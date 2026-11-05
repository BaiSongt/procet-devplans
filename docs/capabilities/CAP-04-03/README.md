# CAP-04-03｜夹具与工件约束
> V0.8 第04域原编号第03项。规划规格已编制，L3待人工评审；产品Rust/TS/OCCT/GUI/NC/实机NOT_RUN，不涉及认证。
> 导航：[五步交互](UI.md) · [规则追踪](../../../research/traces/CAP-04-03.json) · [20正反验收](fixtures.json) · [接触数学样例](constraint-examples.json) · [研究专题](../../../research/topics/R-FIX-001.md) · [公开来源](../../../research/sources/CAP-04-03.json)。

## 一、职责边界
**唯一可写业务Owner是04域D04 Setup修订。** D01设计实体与PMI datum由03域Owner提供，D03夹具定义/能力由02域Owner提供；引用均含id、exact revision、contentHash、作用域和Frame，不复制并静默改写原件。夹具实例与工件实例是不同对象；datum specification≠实体定位点≠机床实际夹紧力。

CAP-04-02管理毛坯/零件位姿配准；本项管理夹具实例、定位接触、夹紧动作、保护区与工序阶段关联。CAP-04-04专管跨Frame图。CAP-04-06/D10负责具体机床、工作台、工件安装和控制器的**执行绑定**，不得由本项生成G54/G43或声称完成执行资格；02域的资源目录定义不代表D04已选实例。

## 二、业务流程与异常
1. 从选中的工程、文档occurrence和**当前setupId**读取D01 exact CAD、D03 exact夹具定义以及CAP-04-02定位候选；可在任意Setup进入，无须回到特征分析重走流程。无合格CAD/fixture时只能只读展示，不能通过装夹审查。
2. 选择机床独立的矩形、圆柱、真空或组合夹具定义并创建D04实例；每一实例保留sourceRevision/hash、装配Frame T^S_F、可视模型资格、与D01的拓扑对应。目录变更不得原地改写既有实例。
3. 添加支撑/侧定位/端定位及夹紧动作；接触双方记录B-Rep topologySnapshotRef与occurrencePath，不以Babylon mesh faceIndex充当可追溯几何实体。3-2-1仅是常见布局，必须检查Jacobians的局部rank、单侧可行性、残差与公差政策；欠定、冲突返回unknown/ambiguous而不是无条件定位。
4. 选择夹紧方向、先后顺序、负载路径/接触点及夹紧力、刚度/摩擦、表面压痕或变形的外部证据引用。证据缺失时可保存**候选**，不得给出物理稳定或机床安全PASS；圆柱/真空/组合夹具不可套用3-2-1全场景模板。
5. 将夹具占用域及螺栓/压板定义为有阶段有效期的保护区：setup阶段、特征/工序或刀路阶段，引用D04修订及几何资格。AABB只是粗筛；OCCT最小距离及布尔公共体只能提供有限静态几何证据，未知时为unknown，不得称已做NC工程验证。
6. GUI、CLI和Agent经过同一D04 Port生成Proposal并提交Review；拖拽/3D选择/预览是ghost，不写D04。所有修改统一显式Commit，提交时Host再验授权、scopeEpoch、expectedSetupRevision、源哈希和CAS。取消、撤权、跨Setup切换的晚回执一律忽略。
7. Commit成功生成新的D04 revision/hash/receipt，通知D05/D06/D07/D09等exact消费者重新评价；已冻结D08与已发布D16不被A/B新候选覆盖；D10若基于旧D04只标待重新绑定，不能静默改G54或NC。
8. 离线仅在闭包满足时保留本地草稿；迁移旧无单位/Frame/源revision的记录，只读保留legacy raw，提供migration proposal和rollbackRef。unknown不得以填0、identity或默认B5偷渡通过。

## 三、候选领域数据契约（待L3，未发布schema）
`FixtureSetupRequest={requestId,projectId,documentInstanceId,setupId,scopeEpoch,expectedSetupRevision,targetCadExactRef:{id,revision,contentHash,occurrencePath,topologySnapshotRef,frame},stockRegistrationExactRef,fixtureDefinitionRefs:[{id,revision,contentHash,frame}],framePolicyRef,unitPolicyRef,geometryQualification}`。
`ConstraintProposal={proposalId,inputFingerprint,fixtureInstances:[{instanceId,definitionExactRef,T_S_F,geometryRef}],locatorContacts:[{partTopologyExactRef,fixtureTopologyExactRef,normal,point,frame,contactKind}],clampActions:[{direction,order,forceEvidenceRef,limitState}],protectedRegions:[{shapeRef,activeStages,qualification}],constraintDiagnostics:{rank,residual,unilateralStatus,physicalStability:unknown|verified|rejected},changeImpact,warningCodes}`。
`CommitFixtureSetup={requestId,proposalId,scopeEpoch,expectedRevision,expectedDependencyHashes,approvalFingerprint}`；成功的唯一业务回执为`{D04Revision,D04ContentHash,receiptId,invalidatedExactConsumers}`。审查通过仅代表**业务修订可保存**，并不代表接触载荷/机床安全已认证。物理稳定证据无从判定时始终是unknown。

右手列向量约定：`p_S=T^S_F·p_F`，`p_S=T^S_P·p_P`。刚体变换旋转正交、det(R)>0、单位明确，不把Babylon场景世界矩阵当领域Frame原始值。合成接触线性化在小位移下约束行`J_i=[n_i^T,(r_i×n_i)^T]`；rank(J)=6也**不充分**证明载荷下稳定、不会干涉或满足NC执行行为。

## 四、领域服务端口与三入口
`FixtureConstraintPort`: `readSetup(exactRef)`、`listEligibleFixtures(scope)`、`proposeFixtureConstraints(command)`、`diagnoseConstraints(proposalRef)`、`evaluateStaticClearance(candidate,policy)`、`explainImpact(oldRef,proposal)`、`commitFixtureProposal(command,CAS)`、`cancelPending(requestId,scopeEpoch)`、`getSnapshot(exactRef)`。
GUI/CLI/Agent复用Host/Project、ModuleRegistry/ContributionHub、RendererPort和既有Setup服务，C0只放scope/exact引用/Frame/单位/通用错误，几何/夹紧/策略留在04域。异常码：DATUM_NOT_LOCATOR、INVALID_FRAME、CONTACT_UNDERDETERMINED、FORCE_EVIDENCE_MISSING、TOPOLOGY_SOURCE_UNKNOWN、CAS_CONFLICT、SCOPE_REVOKED、FROZEN_BASELINE_PROTECTED、LEGACY_FRAME_UNKNOWN、NC_SEMANTICS_UNKNOWN。

## 五、失效、发布、独立验收
D04修订变化→D05/D06/D07/D09对exact D04缓存与候选标stale；D08冻结基线保留并需要另行审批；D10独立执行配置需重新配对；D12来自CL后处理，D13解释NC控制器模态，D14产生轴时序，D15核验真实NC覆盖，D16受控发布。CL动画不可冒充D15；控制器未建模语义必须unknown；本项**不做材料扫掠仿真**。独立消费者为06域求解、07域刀路、08域NC适配、09域验证及10域发布，分别提供正反例；所有真实运行待产品团队另行验证。

## 六、规则→字段→来源→正反验收
| 规则 | 判定要求 | 字段 | 来源 | 独立正例/反例 |
|---|---|---|---|---|
| FIX-R01 | 设计基准与物理定位分离 | targetCadExactRef, locatorContacts | SRC-FIX-001, SRC-FIX-002 | CAP-04-03-T01 / CAP-04-03-T02 |
| FIX-R02 | 夹具实例与工件独立Frame | fixtureInstances, processSetupExactRef, T_S_F, T_S_P | SRC-FIX-002, SRC-FIX-005 | CAP-04-03-T03 / CAP-04-03-T04 |
| FIX-R03 | 定位接触的rank与残差分开报告 | locatorContacts, constraintDiagnostics | SRC-FIX-002, SRC-FIX-003 | CAP-04-03-T05 / CAP-04-03-T06 |
| FIX-R04 | 夹紧力、稳定与刚度须独立证据 | clampActions, contactEvidenceRefs | SRC-FIX-002, SRC-FIX-004 | CAP-04-03-T07 / CAP-04-03-T08 |
| FIX-R05 | 保护区按工序阶段生效，静态检测分级 | protectedRegions, clearanceCandidates | SRC-FIX-005, SRC-FIX-006 | CAP-04-03-T09 / CAP-04-03-T10 |
| FIX-R06 | CAD与夹具接触拓扑双侧exact身份 | targetCadExactRef, fixtureDefinitionExactRef, locatorContacts | SRC-FIX-003, SRC-FIX-005 | CAP-04-03-T11 / CAP-04-03-T12 |
| FIX-R07 | GUI/CLI/Agent共用D04命令与单世界 | scopeRef, requestId, fixtureInstances | SRC-FIX-002, SRC-FIX-005 | CAP-04-03-T13 / CAP-04-03-T14 |
| FIX-R08 | 提交CAS与权限再验，丢弃晚回执 | expectedRevision, expectedDependencyHashes, scopeEpoch, receiptId | SRC-FIX-003, SRC-FIX-005 | CAP-04-03-T15 / CAP-04-03-T16 |
| FIX-R09 | D04变更沿exact依赖失效，D10独立 | changeImpact, protectedRegions, processSetupExactRef | SRC-FIX-006, SRC-FIX-007 | CAP-04-03-T17 / CAP-04-03-T18 |
| FIX-R10 | 旧记录未知Frame只读迁移，L3/产品分级 | legacyRawRef, migrationProposalRef, rollbackRef | SRC-FIX-001, SRC-FIX-007 | CAP-04-03-T19 / CAP-04-03-T20 |

## 七、实施与合规
对应原编号 F1-02/F1-04/W2-05/E3-04/U4-02，不产生新原编号或私自变更L1/L2；L3公开待审。来源仅引用ISO合法目录摘要、NIST出版摘要、OCCT公开8.0.1 API及Carr Lane工程指南；未读付费标准正文或论文PDF不得声称已核查条款。检查入口`python tools/check_cap_04_03_planning.py`只验文档映射与合成矩阵，不等于产品验收。
