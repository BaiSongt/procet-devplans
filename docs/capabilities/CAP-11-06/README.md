# CAP-11-06｜智能任务与长时作业（V0.8实施级，L3待审）

**原88项业务原文：**「异步状态、取消、重试、错误管理」。归属原工作包 [T5-01](../../work-packages/T5-01.md) / [T5-02](../../work-packages/T5-02.md)，不更改原11域、88 CAP、36包、17资产分母或L1/L2。此文仅规划，不是运行系统验收。

## 业务边界与结果语义

当用户在GUI、CLI或Agent启动工艺求解、刀路生成、NC解释、验证或文档任务时，**11域TaskCoordinator只拥有任务元状态与受控意图**；D05/D06/D09/D12/D13/D14/D15/D16等业务结果仍由其各自Owner持有。任务`SUCCEEDED`仅说明该任务的指定结果/Owner Receipt得到了核对，不代表整个CAM工程闭环合格，更不能授权机床启动。

运行采用持久化任务DAG：`DRAFT → QUEUED → RUNNING → WAITING_DEPENDENCY/WAITING_APPROVAL/RETRY_WAIT/RECONCILING → RUNNING/SUCCEEDED`；错误终态与保守中间态为`CANCELLING/CANCELLED/FAILED/STALE/UNKNOWN/SUSPENDED`。任何Worker掉线、传输超时都不能简单推导业务动作未执行；必须查询业务Owner提交日志与幂等键效果摘要之后才能重试。子任务仅引用父任务及资产的不可变修订，不通过共享可变指针传递CAD/NC结果。

### 精确任务契约

[合成结构化实例](task-contract.example.json)包含`taskId/taskGeneration/parentTaskId/dependencyIds/correlationId/attempt/leaseEpoch/idempotencyKey/effectDigest/checkpoint`、`Project/ScopeEpoch/principal`、输入`Revision/Hash/Frame/Unit`、`expectedHead/approvalDigest/cancelToken`、业务Owner真实`receiptId/committedEffectId`。C0仅共享身份、范围、单位、Frame、修订、hash、协议字段；任务调度状态及领域工作流不得反向塞入通用C0巨型Store。

**取消竞争顺序：** 接收cancel意图→标记CANCELLING并禁止新排队动作→通知Worker→查询已有Owner提交事实→对取消前提交的Receipt做对账→只把尚未提交的节点标记CANCELLED。迟到ACK只关联原taskGeneration，不可触发新项目或新世代的成功。若Owner在取消之前已成功提交，该事实必须保留且可人工决定补偿；不得删除已冻D08/D16或伪称回滚。

**重启恢复顺序：** 快照/Journal恢复→校验checkpoint结构与inputDigest→校验代码/协议能力版本→重新读取各Owner exact revision/hash/Frame/ScopeEpoch→更换fencingEpoch→对账所有不确定副作用→仅恢复纯计算或已证幂等动作。未知后端任务协议、无Owner回执、旧Schema必须`UNKNOWN`或只读。

## 十项实施任务（每项来源→规则→字段→正反验收）

|任务|实施模块/责任|规则及字段门禁|独立结果|
|---|---|---|---|
|T01|任务身份与不可变上下文；01域TaskPort；具体业务上下文由相应资产Owner提供|[CAP-11-06-R01](../../../research/traces/CAP-11-06.json)：identity.taskIdStable、identity.projectScopePinned、identity.ownerRevisionHashPinned、identity.framePinned|完整正例1+单字段负例4|
|T02|依赖与断点DAG；11域TaskCoordinator只持引用；06域求解写回由06 Owner决议|[CAP-11-06-R02](../../../research/traces/CAP-11-06.json)：graph.dagAcyclic、graph.inputDigestPinned、graph.checkpointVersionPinned、graph.replaySideEffectGuard|完整正例1+单字段负例4|
|T03|Worker租约与fencing；11域Worker调度只排队；05/06域Owner最终CAS|[CAP-11-06-R03](../../../research/traces/CAP-11-06.json)：lease.generationCurrent、lease.fencingEpochCurrent、lease.ownerScopeRechecked、lease.casBeforeWrite|完整正例1+单字段负例4|
|T04|超时与分类重试；11域任务状态；06/07实际计算各Owner|[CAP-11-06-R04](../../../research/traces/CAP-11-06.json)：retry.errorClassKnown、retry.idempotentOrReconciled、retry.budgetBounded、retry.backoffPersisted|完整正例1+单字段负例4|
|T05|幂等键与已提交事实；业务Owner保存真实Receipt；11域仅保存关联索引|[CAP-11-06-R05](../../../research/traces/CAP-11-06.json)：effect.keyDigestConsistent、effect.ownerReceiptExact、effect.committedEffectImmutable、effect.duplicateReconciled|完整正例1+单字段负例4|
|T06|取消竞态与迟到回执；11域协调取消；业务Owner决定已提交事实，不可通过删除事件假装回滚|[CAP-11-06-R06](../../../research/traces/CAP-11-06.json)：cancel.tokenCheckedAtCommit、cancel.lateAckQuarantined、cancel.priorCommitReconciled、cancel.noNewEffectsAfterCancel|完整正例1+单字段负例4|
|T07|授权与人工门禁；05域采纳/冻结、10域签发独立Owner；11域不代理授予权限|[CAP-11-06-R07](../../../research/traces/CAP-11-06.json)：auth.approvalDigestBound、auth.aclCurrentAtCommit、auth.scopeEpochCurrent、auth.frozenABProtected|完整正例1+单字段负例4|
|T08|多入口单世界GUI；GUI状态由11域TaskPort查询；3D图层只读预览|[CAP-11-06-R08](../../../research/traces/CAP-11-06.json)：ui.sameDomainPort、ui.singleBabylonWorld、ui.leftTaskPanelOnly、ui.statusFromOwnerReceipt|完整正例1+单字段负例4|
|T09|Setup/NC工程资格隔离；08域D13、09域D15、10域D16按精确版本独立决议|[CAP-11-06-R09](../../../research/traces/CAP-11-06.json)：safety.d04D10Distinct、safety.d12ToD15Independent、safety.unknownFailsClosed、safety.clOnlyNotRelease|完整正例1+单字段负例4|
|T10|迁移回退与独立消费者；01域协议版本协调；业务Owner持数据，11域不复制业务DB|[CAP-11-06-R10](../../../research/traces/CAP-11-06.json)：migration.expandBeforeContract、migration.legacyReadOnlyFallback、migration.consumerReceiptChecked、migration.rollbackPreservesFrozen|完整正例1+单字段负例4|

合计**10规则、40字段、50逐字段合成案例、28状态门禁、4 DAG案例**，通过[独立静态校验器](../../../tools/check_cap1106_planning.cjs)执行，不能代替真实Node/浏览器/产品/机床验收。来源、局限见[研究登记](../../../research/sources/CAP-11-06.json)、[专题推导](../../../research/topics/R-DURABLE-AI-TASKS-001.md)及[fixture](fixtures.json)。

## 安全、数据流与失败传播

- **A/B同一精确事实，不覆盖冻结：** D05采纳和D08冻结属05域；AI任务只能创候选，经人类独立审批后向Owner提出新修订，不能直接写冻结D08。
- **Setup与机床绑定分离：** D04代表工艺Setup/毛坯和加工基准，D10代表实际机床、控制器Profile、刀具装配与工件偏置，均须独立exact核对；Frame错位使派生任务`STALE`。
- **中立CL到NC验证：** D09中立CL→D12 NC后处理→D13控制器语义→D14机床轴运动时序→D15独立程序工程验证→D16审批发布。D11/CL动画不可代替D15，D13`UNKNOWN`阻断D16，**不做材料扫掠仿真**。
- **迁移/停用：** 旧任务记录按`Expand→Migrate→Contract`，新旧reader同时只读比对，checkpoint版本/回执不足则`SUSPENDED`；历史审计追加不删。切换失败回退旧只读TaskView，不复活过期写资格。
- **排队与释放：** 工程任务UI“100%”只说明该活动结束，不等于机床许可。状态变化由Owner Receipt、fencing epoch与独立消费者确认驱动，模型回复“完成”不是成功依据。

[GUI/3D设计](UI.md) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者交接](independent-consumer-handoff.md)。所有Port均为**建议接口，未确认产品实现**。L3、Owner正式签字`PENDING_HUMAN`；真实异步/故障注入/机床/消费者`NOT_RUN`。**规划PASS≠产品PASS。**
