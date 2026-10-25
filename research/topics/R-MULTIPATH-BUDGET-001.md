# R-MULTIPATH-BUDGET-001｜多路径有界求解、并行调度与安全裁剪
> 2026-10-25证据登记。属于06域**规划推导**，不是标准规定的Procet实现，也不是产品测试记录。

## 1. 状态图与有限预算
搜索结点`v=(StockExactHash, RemainingTasksHash, ProtectHash, FrameHash, ConstraintsHash, lineage)`，边代表一步候选去料决策并记录前后D07来源。以Beam`b`仅保证每轮保留不超过b条候选，**不保证最优、完备或已穷举**。多目标成本向量须有可解释的局部下界，路径支配只在共同可比的状态空间内使用。算法无解`PROVEN_INFEASIBLE`与预算用尽`UNKNOWN`严格区分。

预算`maxBooleanCalls,maxExpansions,maxWallMs,maxBytes,maxWorkers`必须独立计量；硬限制由产品根据锁版场景标定，本规划不编造工业标准数值。先reserve token再分配worker，超额拒绝；核销幂等。Checkpoint要记录算法/配置、输入、frontier和令牌账本哈希，不能从恢复顺序推定异步回执顺序或原运行结果。

## 2. 可核查外部依据与不外推
- Google OR-Tools公开CP-SAT限制与状态正文：有时间上限以及`UNKNOWN`状态的客观案例，但它不是Procet Beam引擎，更不是OCCT证明器。
- OCCT 8.0.1的`BOPAlgo_Options::SetRunParallel`是可用API，不能证明跨进程并行或可复现，仍须锁版实测。
- Python公开`Future.cancel()`说明运行中的Future不可被该方法取消，由此**推导**Owner必须过滤晚回执并以持久回执仲裁。
- RFC 9110 If-Match给出条件写入语义类比；本地06域必须自己提供CAS+ACL检查。
- W3C PROV-O与RFC 8785提供谱系和元数据规范化的参考，均非B-Rep几何等价证明。
- NIST IR8536只读官方摘要元数据，不引用正文具体条款。

## 3. 可验收推导与局限
规则`C0606-R01..R10`均附一正一反和一项不同字段故意变异；合成仅测字段及状态门禁。实际应通过两进程/多Worker重复运行检查封存Frontier的**语义稳定性**、资源峰值、预算耗尽UNKNOWN、父D07/D08不被改变；相同模型但OCCT版本变化只能另立修订。失败时不声明产品通过。

[公开来源](../sources/CAP-06-06.json) · [机器追踪](../traces/CAP-06-06.json) · [业务规格](../../docs/capabilities/CAP-06-06/README.md)。
