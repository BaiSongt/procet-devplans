## B35｜求解候选多目标资格补证（2026-10-30）
[补充研究](PARETO-ADOPTION-B35-2026-10-30.md) → [来源](../../../research/sources/CAP-05-05-pareto-adoption-b35.json) → [追踪](../../../research/traces/CAP-05-05-pareto-adoption-b35-v08.json) → [正反未知样例](pareto-adoption-b35-fixtures-v08.json) · [只读Node](../../../tools/check_cap0505_pareto_adoption_b35_v08.cjs)。仅合成，真实消费者/Owner/L3未完成。

# CAP-05-05｜求解候选接管（V0.8原编号）
> **规划候选；未获L3批准，D05/求解器/NC/机床/独立消费者测试均为NOT_RUN。** 固定11域88 CAP、36原包、17资产编号，业务契约待评审，不引入新的一级/二级能力。

## 目标与业务责任
允许D06在**没有预建D05工艺计划**时独立求解，也允许以已有D05的受控子图为约束迭代求解。将一个或多个不可变D06候选逐步比较、人工选取并只采纳指定工序到**新D05修订**，A人工工艺与B求解分支共享D01/D02/D04事实引用但不能互相覆盖，D08冻结成果必须保留，原D06/D07证据不因采纳而被改写。

**Owner**：05域拥有D05采纳Port与审批，06域拥有D06候选、D07有序材料状态与布尔证据；03域D01/D02、04域D04名义Setup、02域D03制造资源为只读精确依赖；D10实际机床/控制器绑定属于单独执行上下文，不允许由候选意图推断。任何Owner跨域正式签署仍待办理。

## 过程与异常
1. 以`scope、sourceExactRefs(id/revision/hash/frame/schemaVersion)`请求`SolverCandidatePort.list/getExact`，显示`runId、algorithm/configHash、stopReason、solverStatus`。无D05也可运行；`UNKNOWN、INFEASIBLE、MODEL_INVALID`不能自动接管；`FEASIBLE`不等于工程可加工，`OPTIMAL`仅相对于给定数学模型。
2. 候选比较使用明示目标、单位、归一化策略、约束违背、可靠值及其**校准来源**；允许多解/非支配结果，不采用不可追溯的单一分数。没有校准时显示`UNVERIFIED`，不能升格为通过门禁。
3. 每个候选绑定D02真实`occurrencePath`和D04 `FrameGraphProof`，对D07有序去料体与保护区独立检查拓扑/布尔证据；`BRepCheck_Analyzer.IsValid`只证明有限几何有效性，不保证加工可行、剩余材料全正确或连续机床碰撞安全。未知则`REQUIRES_REVALIDATION`。
4. 左TaskPanel提供`比较候选→检查约束→勾选子图→差异预览→受控采纳`。选择性接管必须保持依赖DAG无环、必要前驱已选或已由现有基线满足；`selectedStableIds、writtenStableIds、affectedClosure、unaffectedIds`精确列出。跨Setup转序证据缺失时禁止采纳；切换Setup需刷新租约。
5. D05 `CandidateAdoptionPort.preview`只返回新旧D05节点差异与局部失效闭包，绝不修改正式计划。统一`Host TaskPanel`及一个Babylon世界，右Agent独立显隐。CLI和Agent必须调用同一受管领域Port（不能由Agent直接落库），并呈现UNKNOWN/原因码。
6. `commitAdoption`重新获取当前授权、`expectedPlanRevision` CAS、`scopeEpoch/taskGeneration`、全部D01/D02/D03/D04/D06/D07哈希、冻结与审批，成功**仅新增D05 revision和不可变provenance**。取消、失权、并发变更、晚回执、一部分过期引用均拒绝，需用户重新预览；D08冻结只能fork审批，不原位修改。失败审计记录不删除用户数据。
7. 写入仅对受影响的D05子图及其真实消费者传播失效；未经影响的工序/D08历史/D16历史继续保留。D07必要时重新解算；D09中立CL需重新计算，D12需重新后处理，D13解释未知仍UNKNOWN，D14/D15需要独立执行。**CL动画不等于NC程序级工程验证，也不做材料扫掠仿真。**

## 端口与契约
- `SolverCandidatePort`（06域只读）：`listCandidateRuns/getCandidateRevision/getGeometryEvidence/getStopReason`；结果引用D06/D07只读，必须声明部分覆盖和算法限界。
- `CandidateAdoptionPort`（05域唯一写侧）：`compareCandidates/previewAdoption/commitAdoption/forkPlanRevision/cancel`；统一`actor、scope、taskId、generation、expectedD05Revision、candidateExactRef、selectedStableIds、sourceExactRefs、approvalRefs`。
- `CandidateAdoptionPreview`：`diff、violations、frameProofs、impactClosure、risk/unknown、previewLease、commitEligibility`。即使`commitEligibility=true`，提交仍需重验权限、修订及来源。
- `AdoptionReceipt`：`newD05ExactRef、adoptedCandidateExactRef、wasDerivedFrom、actor、decisionReason、auditEventId、invalidatedExactRefs、unchangedExactRefs`；版本回退是新修订/显式撤销，不删除原始事实。
- `D08`冻结状态与采纳意图各自保持不可变；本CAP不自动变更D10、产生D12 NC、授予D15或发布D16。

[交互规格](UI.md) · [合成DTO](contract.example.json) · [来源研究](../../../research/topics/R-SOLVER-ADOPT-001.md) · [7来源](../../../research/sources/CAP-05-05.json) · [10规则追踪](../../../research/traces/CAP-05-05.json) · [20正反验收](fixtures.json) · [独立消费者交接](independent-consumer-handoff.md) · [失效矩阵](invalidation-matrix.json)。

## 编制→开发→独立验收出口
关联原`W2-02/W2-03/W2-05`，依次实施端口数据冻结、选择性接管、DAG依赖闭包、变更失效、三入口共域、CAS与取消、A/B与D08冻结、D07独立校验、下游消费者、审计与迁移回退。**建议本地测试入口**：`node tools/check_cap_05_05.mjs`仅机器检查本规划的7来源10规则20合成案例；真实产品端必须再建立独立D05、D07、D09、D13–D16消费用例及相同输入HASH的跨语言检查。人类L3、17资产Owner签署均PENDING。
