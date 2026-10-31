# CAP-01-06｜统一任务与事件中心：接口、界面与研究补证

**新增研究文件（NEWLY_AUTHORED），并非找回旧文件原始字节；2026-10-19，仅规划。** [原详细规格及AT01..08](../batch01-v0.9.1/01_功能规格/CAP-01-06_统一任务与事件中心.md)保留；[研究专题](../../../research/topics/R-TASK-001.md)、[8来源](../../../research/sources/CAP-01-06.json)、[10规则](../../../research/traces/CAP-01-06.json)、[20正反验收](fixtures.json)。

## 统一数据与身份契约（目标字段，非已存在的wire schema）

| 业务字段 | 权威Owner | 强制判断 | 用途 |
|---|---|---|---|
| hostJobId, attemptId, retryOf | Host Dispatcher/Journal | 新尝试新ID，同幂等键命中原回执 | 不与camJobId或ViewTaskId混用 |
| scope, projectId, setupId, scopeEpoch | Host WorkContext | scopeEpoch变化时旧晚回执仅保留未采纳 | GUI/CLI/Agent统一上下文 |
| inputRevision, inputHash, frameRef | 各Dxx生产领域快照 | 与实际领域当前Head对齐；空间结果需明确frame | 消费方exact校验 |
| streamId, eventId, sequence, occurredAt, observedAt | Host Journal | 单调序列、补洞、重复去除 | 断线恢复和诊断时序 |
| runState, cancelGeneration, commitReceipt | Host调度及受管领域回执 | cancelRequested不等于cancelled；持久副作用不假撤销 | 明确运行真相 |
| adoptionState, verificationEvidenceRef, releaseEligibility | 实际领域Owner/D15/D16 | 成功未采纳与unknown/未验收不得授发布PASS | 隔离制造资格 |
| diagnosticLocator, errorCode, redactionPolicy | 领域诊断、安全Owner | 字段/对象/NC行可定位且脱敏 | 日志非业务权威 |

## 命令与状态边界

GUI、CLI、Agent调用同一Host业务用例：`job.submit`先取会话身份重验权限、能力范围、预算、exact输入与幂等键，再返回`HostJobRef`。观察`job.observe(afterSequence)`只读Host持久流；`job.cancel`请求受管Worker确认后才可能转cancelled；`job.retry`须先对账未知commitReceipt，不能盲重发。任务算完→成果保留→人工明确采纳→领域CAS并生成CommitReceipt；如过期或越权则保留未采纳历史。

执行相关任务不越域重写D04 Setup或D10 ExecutionBinding。NC链维持中立CL→传统NC后处理→D13执行语义→D14轴时序→D15工程验证→D16发布；D13 unknown中止肯定性认证，CL动画不冒充NC验证，不做材料扫掠仿真。A/B共享同一冻结事实，C0仅承载必要身份/Frame/Revision协议，不能塞全部业务内容。

## 统一GUI/3D任务流

ActivityRail/Ribbon打开同一个左侧`UnifiedTaskPanel`，底部消息中心的任务/问题/日志/输出计数同排；面板切换/隐藏不终止后台Worker，不新建第二调度队列。进度无分母时展示阶段而非假百分比，WAI-ARIA status礼貌提示且不抢焦点。3D对象定位在唯一Babylon世界中只形成`SelectionIntent`/可撤销`PreviewLease`，不能将预览当领域写入。跨工程、跨Setup旧回执定位原Scope，并需用户显式切换；保存前再核验actor/exact revision/hash/frame及CAS。

## Owner、原工作包与迁移风险

Host/平台负责Journal、cancel/retry与进程恢复；业务领域Owner负责Dxx修订和CommitReceipt；GUI负责可见性、无障碍/订阅租约；安全Owner负责脱敏和审计；独立消费者负责真实Host/CLI/Agent/D13-D15的故障注入验收。映射原包B0-01/B0-02/F1-05/W2-04/U4-01/U4-02/U4-04/E3-03/04/05/T5-01，不新增36包编号。迁移使用可版本化read model和受控adapter，旧Journal/成果不得因新界面被清理；未知副作用标reconciliationRequired，不假装回滚。

## 质量门槛（尚未执行产品测试）

[fixtures](fixtures.json)保留原AT01..AT08业务语义，补AT09..20，每规则至少一正一负。真实Host故障注入要覆盖取消晚确认、回执丢失、事件乱序、强杀重开、并发CAS、权限重验、D13未知语义；另从GUI/CLI/Agent与D15/D16做独立消费者验收。当前设计L3待审，Python脚本、产品Rust/TS/OCCT、NC/GUI与实机均NOT_RUN；规划结构PASS不等于产品PASS。