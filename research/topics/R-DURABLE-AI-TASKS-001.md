# R-DURABLE-AI-TASKS-001｜异步Task持久化、幂等恢复、取消竞态及协议演化

本专题于2026-10-27核对合法公开资料，基于[来源登记](../sources/CAP-11-06.json)→[10规则/40字段](../traces/CAP-11-06.json)→[50+28+4正反合成案例](../../docs/capabilities/CAP-11-06/fixtures.json)。推导属于规划设计，非对Procet运行代码的观察或机床实测。

1. **任务状态与业务事实分离。** MCP 2025-11-25§Tasks描述实验性task ID、polling与单任务生命周期，但不保证业务Owner CAS。定义两种凭证：11域任务Journal反映编排进度；05/06/08/09/10域Owner原始Receipt反映已提交事实。只有第二类才能证明真实写入，且不能以此直接证明NC工程通过。
2. **版本协商不可忽略。** SEP-2663公开Backward Compatibility说明2025-11-25实验`tasks/*`与2026任务Extension线级不兼容；规划中冻结`protocolVersion/capabilityNegotiation`，未知返回UNKNOWN。当前SEP属演化公开提案，未把它假设为稳定部署。
3. **取消是意图，不是时光倒流。** MCP Cancellation正文指出请求可能已完成或取消被忽略，Tasks采用不同取消机制。Owner在原子CAS提交前重读`cancelToken/taskGeneration/ACL`；若已有提交，读原始Receipt并`RECONCILING`，记录补偿或人工处置，不删除不可变业务记录。
4. **租约与故障恢复。** Temporal公开Workflow/Replay资料支持设计checkpoint/journal、fencing generation和无副作用部分重放的工程思路，但没有证明引入Temporal即可获得领域exactly-once。跨Worker对外副作用只允许Owner idempotency ledger + effectDigest/receipt去重；不确定结果禁自动重试。
5. **HTTP幂等不等于业务幂等。** RFC9110§9.2.2区分安全、幂等方法与非幂等请求的自动重试限制。Procet的`idempotencyKey/effectDigest`由业务Owner自己定义，旧Worker或重连不能仅凭相同POST要求重复提交。
6. **不可变证据。** CloudEvents v1.0.2的event ID/source用于传输层关联，W3C PROV-O Activity/Entity/Agent表述任务与产出关系；二者均不提供机床物理安全保证。NIST800-53只读官方版本/摘要，不据未读条款声称认证。OTel追踪用于诊断并应避免敏感Baggage，不替代D17业务审计。
7. **对接制造链而非取代制造链。** D04 Setup不等于D10实际执行绑定；D09中立CL→D12 NC→D13实际控制器解释→D14轴运动→D15独立验证→D16人工发布，D11预览仅CL级。不造材料扫掠，不把任务完成或CL动画冒充NC验证，未知语义UNKNOWN。
8. **渐进演化。** A/B共用exact修订并保护冻结D08；旧reader先并存、按真实原字节/hash恢复，可疑checkpoint迁移只读并标`SUSPENDED`；跨域消费者对照旧新字段、权限撤销与迟到回执，未通过不Contract。

**适用局限**：资料是公开技术参考而非Procet的接口实现或厂商NC证书；Temporal未选型，真实分布式持久化、数据库事务、独立消费者、双Worker故障注入、3+5轴机床均`NOT_RUN`。每一条状态必须由Owner真实回执与可复核证据支撑；L3/17资产Owner正式会签`PENDING_HUMAN`。
