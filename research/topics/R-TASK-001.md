# R-TASK-001｜统一任务中心的持久性、事件回放与成果采纳

> 新编研究补证；L3待评审；产品、独立消费者与实机NOT_RUN。

[CAP原规格](../../docs/capabilities/batch01-v0.9.1/01_功能规格/CAP-01-06_统一任务与事件中心.md) · [补证](../../docs/capabilities/CAP-01-06/RESEARCH-BACKFILL.md) · [来源](../sources/CAP-01-06.json) · [追踪](../traces/CAP-01-06.json) · [20验收](../../docs/capabilities/CAP-01-06/fixtures.json)

## 已核对的理论及工程局限

**事件身份与传输不是持久Job事实。** CloudEvents v1.0.2定义id/source/type等事件属性，WHATWG SSE定义Last-Event-ID断线续读，但二者不保证本应用Host Journal持久化、有序seq和副作用幂等；Procet须设计streamId/sequence/eventId、缺页重放、重复去除与失败对账。[SRC-TASK-001/003]

**取消不是撤销提交。** Tokio Future drop只能说明该Future的取消，已spawn任务可能仍在；SQLite事务保证范围限于相应数据库连接/事务，不能承诺跨库、控制器或已发布业务状态同时回滚。[SRC-TASK-007/004]

**CAS和业务授权不可托付界面。** RFC 9110 §13 If-Match支持HTTP防丢失更新设计类比，实际工程CAS、工作范围权限、exact输入Revision/hash/frame必须在领域Owner写入处复核；GUI/CLI/Agent走同一Host命令路径。[SRC-TASK-005]

**结构化事件和诊断分权。** NIST SP 800-92当前只读取官方出版摘要，不能据其推导保留时限；OpenTelemetry事件语义仍为Development，不代表Procet已采用。WAI-ARIA的status角色适合礼貌播报，不应抢输入焦点。[SRC-TASK-006/008/002]

**制造执行资格单独审查。** HostJob的succeeded仅是运行状态；D04工艺Setup与D10执行绑定分离。中立CL→NC后处理→最终D12→D13语义→D14轴运动→D15验证→D16发布；任意D13 unknown不得被消息中心涂成PASS。CL动画仅预览，不做材料扫掠仿真。这是Procet规划而非外部标准强制规则。

## 待落实与独立验收

原AT01..08保持业务含义，新增AT09..20；每条设计规则均绑定至少一正一负验收场景。必须由真实Host Journal、GUI/CLI/Agent消费者和D13/D15/发布读取端独立执行取消竞态、断线补洞、幂等重试、过期Scope、误判验证/发布的失败注入。本轮未执行这些产品验证，Owner审批与迁移窗口均待签署。