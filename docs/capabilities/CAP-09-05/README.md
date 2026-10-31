# CAP-09-05｜CL机床运动预验证（V0.8原编号；L3待审）
**原88项目标**：从中立刀路驱动机床运动与行程判定。归09机床运动与工程验证域；原关联工作包F1-02/E3-04/E3-05/U4-04。L1/L2不修改，L3设计需人工评审。

## 必须区分的业务结果
D11由09域Owner负责，读取07域D09的**中立CL**、05域D08冻结、02域D03机床能力、04域D04名义Setup和04域D10**具体机床的实际执行绑定**。D04不是D10；D03资源能力也不是某次物理安装证据。D11可以提示显著的行程、逆解或初筛异常，但其结果严格标识`CL_ONLY`、`REJECT_PRECHECK`、`UNKNOWN`、`STALE`，绝不输出`NC_ENGINEERING_PASS`。
CL可以按受控运动链进行几何/轴空间预演，但不存在后处理后的G-code、真实控制器模态及轴时序；因此**绝不可据D11提升D15为工程验证PASS或授予D16发布资格**。唯一NC证据链为D09→D12后处理最终NC字节→D13按控制器版本独立解释→D14展开轴时序→D15独立工程验证→D16经授权发布。未知行为返回`UNKNOWN`，不得推断成安全。
不做材料扫掠仿真。连续碰撞安全不是端点采样或静态形状最小距离的逻辑推论；间隙/插值误差/刀柄姿态/夹具模型不齐应返回UNKNOWN，等待更高等级独立验证。

## 十项实施任务——来源→规则→字段→正反验收
1. **输入快照与D09来源（CAP-09-05-R01）**：CL修订及内容哈希、D08冻结、Frame、单位全部精确引用；没有D09冻结源则不生成D11。 字段：`input.d09RevisionPinned`、`input.d09HashPinned`、`input.d08FreezeReferencePinned`、`input.frameAndUnitsDeclared`；关联资产D08/D09/D11；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S01/C0905-S02/C0905-S07；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
2. **D04/D10责任分界（CAP-09-05-R02）**：名义Setup只从D04读取；特定机床、装夹实态和控制器配置归D10；D11不可代替执行绑定。 字段：`binding.d04NominalOnly`、`binding.d10ActualBindingPinned`、`binding.machineResourceD03Pinned`、`binding.physicalEvidenceUnknownBlocked`；关联资产D03/D04/D10/D11；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S01/C0905-S03/C0905-S05；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
3. **运动学与逆解候选（CAP-09-05-R03）**：09域调用正逆运动学并记录候选分支及连续性；无法唯一确定有效解则UNKNOWN。 字段：`kinematics.fkIkVersionPinned`、`kinematics.solutionBranchIdentityRecorded`、`kinematics.rotaryWrapAndSingularityConsidered`、`kinematics.ambiguousSolutionsUnknown`；关联资产D03/D10/D11/D14；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S02/C0905-S03/C0905-S05；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
4. **机床轴限位分层（CAP-09-05-R04）**：分别计算笛卡尔/逻辑轴与物理Joint限位，不能以终点在软限位内替代关节轴校核。 字段：`limits.jointAndAxisLimitsSeparated`、`limits.travelBoundariesPinned`、`limits.sampledInteriorChecked`、`limits.limitViolationPrecheckReject`；关联资产D03/D10/D11；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S02/C0905-S03/C0905-S08；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
5. **连续区间覆盖（CAP-09-05-R05）**：每个中立CL段需要有界插值区间与取样误差预算；采样遗漏或误差上界缺失只能UNKNOWN。 字段：`sampling.segmentParameterIntervalDeclared`、`sampling.samplingToleranceVersioned`、`sampling.coverageGapUnknown`、`sampling.continuousSafetyNotCertified`；关联资产D09/D11/D14；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S02/C0905-S04/C0905-S05；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
6. **几何干涉初筛（CAP-09-05-R06）**：刀具/刀柄/机床/夹具在同一Frame执行粗筛；OCCT点到形状最小距离不自动证明连续无碰撞。 字段：`clearance.toolHolderFixtureModelsPinned`、`clearance.shapeDistanceMethodRecorded`、`clearance.uncertaintyAndToleranceIncluded`、`clearance.unobservedIntervalUnknown`；关联资产D03/D04/D10/D11；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S04/C0905-S05/C0905-S06；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
7. **CL与NC工程边界（CAP-09-05-R07）**：D11仅输出CL_ONLY/UNKNOWN/REJECT_PRECHECK；不存在D13重读最终NC与D14轴时序时不得写D15验证PASS或D16可发布。 字段：`gate.d11ResultPrecheckOnly`、`gate.d12D13RequiredForNc`、`gate.d14D15Independent`、`gate.d16CannotUseClPass`；关联资产D09/D11/D12/D13/D14/D15/D16；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S02/C0905-S03/C0905-S07；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
8. **引用变更与失效（CAP-09-05-R08）**：D03/D04/D08/D09/D10或算法/采样策略改变即使D11失效；保留旧证据但不复用其放行资格。 字段：`stale.inputDependencyGraphExact`、`stale.changedInputMarksD11Stale`、`stale.oldFrozenD08Retained`、`stale.d16OldHistoryPreserved`；关联资产D03/D04/D08/D09/D10/D11/D16；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S06/C0905-S07/C0905-S01；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
9. **三入口事务及统一GUI（CAP-09-05-R09）**：GUI、CLI、Agent共用领域Owner Port；单Babylon世界、左TaskPanel，提交时CAS/ACL/作用域代次和取消重验。 字段：`transaction.oneBabylonSceneTaskPanel`、`transaction.guiCliAgentSameOwnerPort`、`transaction.casAclRecheckAtCommit`、`transaction.lateAckCancelRejected`；关联资产D09/D10/D11；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S06/C0905-S07/C0905-S08；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。
10. **独立消费者及迁移交接（CAP-09-05-R10）**：独立测试读取D11新旧Schema；验证正反样例、失效传播、回退与未知分类；规划通过不替代实机和产品测试。 字段：`handoff.independentConsumerContract`、`handoff.positiveNegativeOracleSeparate`、`handoff.legacyReaderRollbackPlanned`、`handoff.productAcceptanceNotRun`；关联资产D08/D11/D13/D14/D15/D16；原包F1-02/E3-04/E3-05/U4-04；来源C0905-S03/C0905-S06/C0905-S07；使用[合成正例、反例、独立字段变异](fixtures.json)各一条。

## Owner端口与同源业务入口
09域D11独占写端口：`ClMotionPrecheckPort.readD09Exact`、`resolveD10BindingExact`、`enumerateIkBranches`、`sampleJointBounds`、`checkShapeClearancePreliminary`、`commitD11CAS`、`invalidateByDependency`、`readD11Evidence`。07域只写D09，04域只写D04/D10，08域负责D12/D13，09域D14/D15不得借D11结果伪造NC轴事件。
GUI、CLI、Agent调用同一Owner端口，不各自实现限位或审批。提交前重读scope/ACL、CAS expected revision/hash、Frame、generation及cancel token；取消后晚回执REJECT且不写入。A/B读相同事实但冻结D08不可被B直接覆盖；新任务必须新revision，保留历史记录。

## 入口与视觉边界
[GUI及三维交互](UI.md)：只有一个Babylon世界，左侧统一TaskPanel（可调宽，最大12px，浅/深主题），右面板可切换读数及失败原因；绿色不代表NC安全；CL_ONLY用明确标识且D16入口禁用。3D只读预演允许显示机床及刀具当前姿态，但不是运动学标定，也不是执行模拟验证。

## 失效、验收和交接
[8项合法研究来源及阅读深度](../../../research/sources/CAP-09-05.json) → [10项规则字段/原工作包追踪](../../../research/traces/CAP-09-05.json) → [30项字段合成正反/10项状态向量](fixtures.json) → [独立消费者](independent-consumer-handoff.md)。[候选17资产Owner](asset-owner-candidates.json)仅为提案，**全部PENDING_HUMAN**；[示例合同](contract.example.json)、[失效矩阵](invalidation-matrix.json)、[理论推导](../../../research/topics/R-CL-PRECHECK-001.md)、[Node规划校验器](../../../tools/check_cap0905_planning_2026_10_27.cjs)互相联动。
合成检查只判规则/界限，不读取真实STEP、B5运动参数或G-code，不构成真实OCCT连续碰撞、控制器、机床、浏览器或独立消费者PASS。L3审批`PENDING_HUMAN`；真实产品与消费者`NOT_RUN`；**规划PASS≠产品PASS**。
