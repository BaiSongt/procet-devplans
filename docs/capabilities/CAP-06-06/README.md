# CAP-06-06｜多路径预算与并行（V0.8，L3待审）
> 编制：2026-10-25；能力域06「工艺与几何求解」；原88项之一，不新增L1/L2或改变L3待审状态。依赖F1-05、W2-02、W2-03、W2-06；参照CAP-06-02/03/04/05。**规划合成PASS不等于产品PASS**。

## 一、场景、边界和成功定义
航空复杂结构件允许同一目标在多Setup、多种工序和局部去料分解之间搜索多条合法路径。搜索的输出是**D06多候选及其证据**，不是经批准的D05/D08，更不是NC执行结论。完成态包括`FOUND_CANDIDATES_UNPROVEN`、`PROVEN_INFEASIBLE`（必须有独立不可能性证据）、`BUDGET_EXHAUSTED_UNKNOWN`、`CANCELLED`、`INVALID_INPUT`、`UNKNOWN_RECOVERY`；不可将耗时、内存耗尽或Worker异常误写成“无解”。

**不变量**：D06只负责求解；D07封存Stock和局部B-Rep且由独立消费者校核；D05由05域人工采纳；D08由05域封存。A/B引用同一物理来源事实但各分支只追加修订，不覆盖冻结。D04工艺Setup（毛坯与基准）与D10机床执行绑定分离。中立D09 CL→D12 NC后处理→D13控制器执行语义→D14轴时序→D15 NC工程验证→D16发布，D11/CL动画不是D15，未知控制器语义必须UNKNOWN；**不做材料扫掠仿真**。

## 二、预算模型与调度
设`F_k`为第k轮frontier，`b`为Beam宽度，`E_k`为候选扩展，`C_i`为每个真实OCCT布尔调用成本，`W`为Worker数。强制`|F_k|≤b`、`ΣreservedBooleanCost≤B_bool`、`expanded≤B_expand`、`elapsed≤B_wall`、`liveBytes≤B_memory`、`activeWorkers≤B_worker`；五种预算分别计量，**不能将预估Boolean次数当成实际耗时**。预算单位、取整和输入验证须明确；空值不是无限制，越界Fail-Closed。将reserve→派发→报告→核销设计为单Owner协调的幂等令牌台账：同token重复回执只消费一次，超额预留不得启动；Worker失败预留转异常并可核算，禁止隐式释放后重放制造双执行。

Frontier使用`{stateRef,remainingStepsHash,protectHash,constraintHash,costVector,rankKey,parentCandidate,workerTaskId}`并钉死规则版本/seed/并发数和裁剪原因。排序默认先完整约束有效，再多目标成本的显式比较，最终以稳定UID打破平手；`score`仅排序，不允许以评分替代几何/保护区约束。不同Worker完成顺序允许不同，但seal时须按稳定候选键归并并记录重排序；**不保证不同机器/OCCT构建一定逐位复现**。

## 三、路径支配与可回放证据
只有两个候选使用**同一exact材料状态（或经独立证明等价）**、剩余任务、保护区/余量、Frame、容差与业务作用域完全一致，同时A具备可审核的不劣成本界，才可`prune(B)`。如果只是外观相同/BBox相同/模糊可靠值高，一律不得剪枝。候选父子revision DAG不能循环；保存每次`expand/boolean/error/prune/timeout/cancel/replay`的来源事件和预算剩余额。D07几何重新计算不得污染已有父Stock或冻结D08。

checkpoint仅保存已Seal、可独立验证的frontier与来源闭包：`schemaVersion,algorithmVersion,occtBuildHash,inputHash,configHash,scopeHash,frameHash,budgetLedgerHash,randomSeed,frontierHash,checkpointDigest,parentRunId`。恢复时按exact hash和访问权限读取，发现缺失、哈希变动、未决Worker或事务状态不明进入`UNKNOWN_RECOVERY`或隔离待对账。跨算法版本的`migrate`须显式版本映射、只创建新修订并可回退旧reader；绝不修改旧checkpoint。

## 四、10项实施工作与正反验收
| 子项 | 交付物 | 必须通过的门禁/反例 |
|---|---|---|
| 01 | 06域exact输入闭包+Frame检验 | 缺revision/hash/frame拒绝 |
| 02 | 有界Beam/时间/内存/Boolean/Worker预算DTO | 0、负值或无界拒绝 |
| 03 | 原子令牌预算台账 | 超额、令牌重用拒绝 |
| 04 | 线程/进程Worker隔离及稳定frontier归并 | Worker乱序不能改变封存排序 |
| 05 | 严格支配证明器 | BRep不同或成本更差禁止裁剪 |
| 06 | A/B分支隔离 | 父D07与D08冻结字节未变 |
| 07 | pause/cancel/late callback代次仲裁 | 已取消任务不得产生新Owner修订 |
| 08 | seal/checkpoint/replay及强杀恢复 | 缺Worker/哈希不符UNKNOWN_RECOVERY |
| 09 | 06域Stage→Seal→CAS/ACL→提交回执 | 并发改Head/撤权必须拒绝 |
| 10 | CLI/GUI/Agent同Port与独立进程消费者 | 模拟PASS不得声称真实D07/NC工程通过 |

## 五、领域接口和失效传播
[合成DTO](contract.example.json) · [30合成样例](fixtures.json) · [10规则与20正反](../../../research/traces/CAP-06-06.json) · [数据候选Owner清单](asset-owner-candidates.json) · [独立消费者](independent-consumer-handoff.md)。

GUI、CLI、Agent使用**同一`06.SolverCandidatePort`**，只能由Owner领域接口`startBoundedSearch/readFrontier/cancel/stage/seal/commit/readReceipt`写D06；GUI只是投影和配置入口。每次提交核对`expectedHead/aclEpoch/taskGeneration/cancelGeneration/idempotencyKey`，旧代请求和迟到回执不可提交；撤权后单纯UI隐藏按钮不等于权限控制。候选D06重算只失效引用该exact候选的下游D07与其有依赖的D09/D12-D16，不应全局作废不相关Setup，也不能自动覆写已经封存的D08。无双写。C0仅公共identity、单位、Frame和修订协议。

## 六、风险与测试门禁
并行不等于可复现；OCCT`SetRunParallel`存在不等于跨进程安全；Python Future取消不了已运行中的任务；时限不代表可证明无解；真实B-Rep Boolean可能退化/容差异常。把风险登记为`UNVERIFIED`，并要求真实锁版OCCT构建、相同/不同Worker数量、重复100次、双Setup、内存与中断注入、保护区/多Solid/孤岛、序列化升级、对账重启的独立进程验收；记录运行机器、OS、二进制SHA、内核SHA、测试证据路径与退出码。现在仅设计/合成检查，实际Rust/OCCT、独立D07消费者、NC和机床均NOT_RUN，17 Owner正式签署/L3待人工。

[研究专题](../../../research/topics/R-MULTIPATH-BUDGET-001.md) · [9项来源与读取深度](../../../research/sources/CAP-06-06.json) · [机器验证工具](../../../tools/check_cap0606_planning_2026_10_25.cjs)。
