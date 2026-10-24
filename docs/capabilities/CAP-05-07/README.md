# CAP-05-07｜计划修订与差异（V0.8原编号）
> 05域D05计划业务Owner；L1/L2不变、L3待人类评审。本文为规划候选，产品Rust/TS/OCCT/NC、独立消费者与17资产正式会签均NOT_RUN/PENDING。

## 业务问题及不可变边界
工艺员修改计划时必须区分**变更事实、候选编辑、已提交D05修订、D08冻结结果、下游验收状态**。不能仅比较树中可见行号：每个工序使用stableId、前驱DAG、D02真实几何occurrence、D04 exact Frame和单位，变更集可独立复算。05域独占D05领域写口，01域持有工程/ACL/CAS，03域D01/D02、04域D04与06域D06/D07各自保有精确事实Owner。D10是机床实际执行绑定，不可反填D04名义Setup；所有D01–D17正式跨域Owner签署仍待审。

## 数据契约
`PlanRevisionRef{id,revision,hash,frame,schemaVersion,scope}`，`PlanChangeSet{baseExactRef,currentExactRef,proposedExactRef,changes[],sourceExactRefs[],frozenScopeRefs[],frameProofRefs[],actor,reason,taskId,generation,scopeEpoch,expectedRevision}`。每项`changes[]{stableOpId,kind,beforeHash,afterHash,dependencyEdges,sourceEvidence,affectedClosure}`必须使用稳定语义与明确单位，不以行位置、模糊名称或单纯拓扑相似度悄然重新识别。哈希与规范序列化Profile由领域版本化冻结，不假定所有JSON.stringify相同。

## 主流程与失败路径
1. `inspectPlanRevisions/getExactPlan`读取base/current/proposed和D08冻结、D01/D02/D04的exact ref；缺revision/hash/frame/scope为UNKNOWN，不允许从latest补齐。
2. `previewThreeWayDiff`按稳定工序ID、strategy/allowance、DAG边、D04 Frame、来源hash、冻结范围计算规范变更。并发两方修改同节点、跨依赖边或仅凭几何相似推断改名均报告冲突。`preview`只读；GUI3D高亮绝不触发提交。
3. 报告`NON_OVERLAP / NODE_OVERLAP / EDGE_CROSS / FRAME_STALE / SOURCE_STALE / FROZEN_SCOPE / UNKNOWN`。部分可修复冲突仍须显式审阅。已冻结D08快照永不可覆盖，解冻要求已批准的精确审批并fork新D05修订。
4. `commitRevision`再取当前actor权限、CAS(expected/current)、taskGeneration、scopeEpoch、source hashes与Frame证明；取消、撤权、晚回执拒绝并记录只追加审计。原计划分支A/B可共享D01/D02等来源但互不可覆盖。
5. 新D05修订写入`wasRevisionOf/wasDerivedFrom`并保存不可变ChangeSet、diffSummary、auditEvent；只对真实受影响子图传播D06/D07复核及D09 CL→D12最终NC→D13执行语义→D14轴时序→D15独立验证→D16发布失效。UNKNOWN不得变PASS；CL动画不等于NC工程验证；不做材料扫掠仿真。
6. 回退永远生成新修订或补偿事件；不覆盖已发布历史，不删用户数据库。旧工程缺稳定工序ID/Frame/hash时用只读versioned adapter输出UNKNOWN及人工重映射任务，禁止静默补造来源或删除数据。

## GUI、CLI、Agent共用领域接口
唯一`PlanRevisionDomainPort.inspect/previewThreeWayDiff/commitRevision/forkRollback/cancel`，Host统一ACL、任务代次和审计，右Agent不得绕Port直写。仅一个Babylon世界和左侧统一TaskPanel；右Agent可独立显隐，主题仅浅/深，最大字号12px。图形显示版本差异、节点增删、DAG边、冻结范围和局部失效。通过3D选择和预览不能被当成正式计划或D15验证资格。CLI候选 `plan revision inspect|diff|commit|rollback` 与GUI/Agent复用同端口。

## 原编号工作包（仅映射不新增）
| 工作包 | 本CAP细项 | 独立负例 |
|---|---|---|
| W2-02 | 三方差异/冻结范围与冲突显式决策 | 同stableId被同时修改 |
| W2-03 | 依赖闭包/有界失效与D08不可变 | 只失效D09却允许D15继续PASS |
| W2-05 | 多Setup、Frame和同域查询/界面 | 同名不同Setup被混合 |
| W2-02/W2-03/W2-05 | CAS/ACL/取消晚回执/回退/迁移 | 旧任务回执覆盖新修订 |

## 逐项证据与可独立执行入口
[UI/3D](UI.md) · [合成领域DTO](contract.example.json) · [8项公开来源](../../../research/sources/CAP-05-07.json) · [10规则→字段→20正反](../../../research/traces/CAP-05-07.json) · [验收数据](fixtures.json) · [独立消费者交接](independent-consumer-handoff.md) · [失效矩阵](invalidation-matrix.json) · [研究边界](../../../research/topics/R-PLANDIFF-001.md)。

规划检查命令：`node tools/check_cap_05_07.mjs`（需开发机本地运行），合成测试不是产品通过。真实实施须分别给出：exact HEAD、D05领域提交、D08冻结审查、独立D09/D13/D15/D16消费验收、GUI/CLI/Agent一致性证据、人类L3与Owner签署。
