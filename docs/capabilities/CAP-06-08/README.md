# CAP-06-08｜冻结约束增量求解（V0.8；L3待审）

原88项映射定义：**保留工程决策、受影响局部重算和冲突解释**。关联原F1-05、W2-02、W2-03、W2-06；不更改11域、88 CAP、36原编号包、17业务资产分母。规划设计≠产品通过。

## 1. 基于真实制造状态的用户工作流
B模式中，工程师冻结工序S1/S2（D08）后，只修改未冻结S3的参数。系统从各域Owner**精确读取**D01设计基线、D02特征、D04名义Setup/Frame、D05人工决策、D07前序Stock、D08冻结约束；依据已登记的**版本实例消费边**计算受影响StepUID传递闭包，仅对未冻结部分提出新D06候选。不能覆盖已确认D08、不相关Setup、旧D07原始B-Rep字节。
A模式可以在无D05计划时计算候选，但几何必须有真实D01和D04 Stock；A/B共用数据事实，不复制两个工程版本。候选必须先由D07独立几何Oracle复核，再由05域受控采纳和冻结，不能由Solver自证转正。

## 2. 增量算法与异常
变更集合`{owner, assetId, revisionBefore, revisionAfter, fieldPaths, frameHash}`必须按exact hash读取。对有向消费图`G=(V,E)`，`Affected=Reachable_G(Changed)`；只能在**依赖边完整且版本一致**时称“最小闭包”，缺失边返回`UNKNOWN_SCOPE`，而非错误地认为无影响。类型级业务图可含反馈循环，实例谱系DAG必须无环。
冻结`F={stepUid, decisionRevision, contentHash, scope, protectedGeometryRefs}`是硬约束：重算只能作用于`V\F`；若局部改动与F冲突，输出`CONFLICT_REQUIRES_HUMAN`及冲突UID/Frame/证据，不进行自动解冻。D08原修订不可变。
搜索frontier/checkpoint复用须完全匹配D07父Stock、Frame、算法、成本、容差和约束指纹；不匹配时从受控输入重新计算而非使用过期缓存。Koenig等LPA*只证明变化图最短路设定下的性质，**不可直接外推**多目标、非单调B-Rep工艺规划。OCCT Boolean History用于追踪候选被拆分的面/体，但不证明跨修订拓扑身份稳定；真实Boolean与Oracle分别验收。
求解预算耗尽返回`BUDGET_EXHAUSTED_UNKNOWN`；无法解释的D13控制器语义为`UNKNOWN`。两者都不得成为D15 PASS或D16发布资格。

## 3. 十项施工与字段到机器验收
| 编号 | 设计规则/施工子项 | 关键字段 | 正例 / 反例 / 异因变异 |
|---|---|---|---|
| 1 | Owner精确引用验证与Frame隔离 | `revision`, `contentHash`, `frameHash`, `setupRevision`, `scopeId` | CAP-06-08-T01 / CAP-06-08-T02 / CAP-06-08-M01 |
| 2 | 冻结范围不写入且保持D08原字节 | `locked`, `touched`, `frozenBeforeHash`, `frozenAfterHash`, `authorized` | CAP-06-08-T03 / CAP-06-08-T04 / CAP-06-08-M02 |
| 3 | 依赖变更计算最小闭包且无关节点稳定 | `edges`, `changed`, `affected`, `unaffectedStable` | CAP-06-08-T05 / CAP-06-08-T06 / CAP-06-08-M03 |
| 4 | 复用checkpoint必须匹配输入/算法/容差指纹 | `priorHash`, `currentHash`, `priorAlgo`, `currentAlgo`, `priorTolerance`, `currentTolerance` | CAP-06-08-T07 / CAP-06-08-T08 / CAP-06-08-M04 |
| 5 | 修订谱系DAG无环且父状态与冻结字节不变 | `edges`, `parentRevision`, `childRevision`, `parentPreserved`, `freezePreserved` | CAP-06-08-T09 / CAP-06-08-T10 / CAP-06-08-M05 |
| 6 | Owner提交时重验Stage/Seal/CAS/ACL/代次/取消 | `sealed`, `expectedHead`, `actualHead`, `aclAllowed`, `generation`, `receiptGeneration`, `cancelled` | CAP-06-08-T11 / CAP-06-08-T12 / CAP-06-08-M06 |
| 7 | A/B同事实与05域采纳禁止覆盖冻结 | `mode`, `canonicalFactHash`, `observedFactHash`, `duplicateFrozen`, `adoptOwner` | CAP-06-08-T13 / CAP-06-08-T14 / CAP-06-08-M07 |
| 8 | 独立D07几何Oracle才能准许候选接管 | `oracleProcess`, `generatorProcess`, `oracleBinaryHash`, `generatorBinaryHash`, `recomputed`, `geometryValid` | CAP-06-08-T15 / CAP-06-08-T16 / CAP-06-08-M08 |
| 9 | 预算/控制器未知不可宣称无解或NC验证通过 | `budgetExhausted`, `searchStatus`, `controllerStatus`, `ncValidated`, `publishAllowed` | CAP-06-08-T17 / CAP-06-08-T18 / CAP-06-08-M09 |
| 10 | 取消晚回执丢弃、旧reader兼容且回退不删用户数据 | `late`, `receiptAction`, `legacyReadOnly`, `rollbackExact`, `originalDataPreserved` | CAP-06-08-T19 / CAP-06-08-T20 / CAP-06-08-M10 |

每项先实现受管Port数据、失败原因码及本表字段，再接UI和测试；禁止将文档合成输入当作已运行的CAD实体。**正反用例10+10+10变异只检验规则，不调用OCCT。**详见[规则链](../../../research/traces/CAP-06-08.json)及[fixtures](fixtures.json)。

## 4. 统一数据、权限与落库
`06.IncrementalSolvePort.preview(exactInputs, changeSet, frozenRefs, budget)`是GUI/CLI/Agent共同入口，返回受影响UID及其来源、复用与重新计算清单、冻结冲突、候选BranchRef、独立Oracle待办；`06.IncrementalSolverPort.stage/seal/commit`仅写**新的D06修订**。D07材料状态由独立Oracle后通过06域材料Port写新修订；D05人工采纳/D08冻结由05域独有，06域禁止直接写。公共C0只持身份、单位、Frame、修订、哈希和任务协议，不建立跨域业务巨型DTO。
[示例契约](contract.example.json)须持有projectId/documentId/setupId及D04/D07/D08 exact revision、contentHash、hashKind、frameRevision、frameHash、scopeEpoch、taskGeneration、expectedOwnerHead、algorithmVersion、configHash与tolerancePolicyHash。提交阶段在**Owner内部**重验HEAD-CAS、ACL、Seal、taskGeneration、取消代次及重放幂等。迟到回执丢弃，不能污染新Setup。
[失效矩阵](invalidation-matrix.json)将局部变更独立传播到**D09中立CL→D12最终NC后处理→D13执行语义→D14机床轴时序→D15独立工程验证→D16发布**。D04名义Setup不同于D10执行绑定；D11/CL展示不构成D15验证；不做材料扫掠仿真。

## 5. GUI/3D、旧数据与验收
统一左TaskPanel、单Babylon世界和只读OverlayLease显示旧/新局部材料与冻结状态；[UI方案](UI.md)提供诊断与冲突交互。迁移旧reader可读但不可新旧双写；回退还原旧引用、快照、错误记录，不删除用户数据库。17数据Owner候选与签署人未确认，详见[Owner清单](asset-owner-candidates.json)。
[理论与资料](../../../research/topics/R-INCREMENTAL-FREEZE-001.md)、[来源登记](../../../research/sources/CAP-06-08.json)、[独立消费者及强杀验收](independent-consumer-handoff.md)。真实OCCT、Owner持久化、NC/机床及Node独立文件校验当前NOT_RUN；L3待人工审核。**规划PASS≠产品PASS。**
