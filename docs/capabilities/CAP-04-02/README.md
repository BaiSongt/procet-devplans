# CAP-04-02｜毛坯/零件定位配准

**B20补充研究（2026-10-29）**：[非退化点集与严格刚体、ICP资格](ROBUST-REGISTRATION-B20-2026-10-29.md)；[9规则追踪](../../../research/traces/CAP-04-02-robust-b20-v08.json)；[39合成案例](robust-b20-fixtures-v08.json)。不替代原REG-R01..R10及20项验收。规划PASS≠产品PASS。


**原V0.8第04域第02项；2026-10-19首编V0.1。规划已编制，L3待人工评审；产品Rust/TS/OCCT/Windows/实机均 NOT_RUN。** 关联 [CAP-04-01](../CAP-04-01/README.md)、[CAP-02-05](../CAP-02-05/README.md)、[CAP-03-02](../CAP-03-02/README.md)、[字段与交互](UI.md)、[研究](../../../research/topics/R-STOCKREG-001.md)、[来源登记](../../../research/sources/CAP-04-02.json)、[十规则追踪](../../../research/traces/CAP-04-02.json)、[二十正反场景](fixtures.json)、[合成数学样例](math-examples.json)。

## 1. 业务目的、责任及明确非目标

毛坯/零件定位配准的成果是**在单一工艺Setup（D04）里，将确切CAD目标D01、原始毛坯来源和各自Frame关联为可审计的相对位姿与余量评估候选**；不等于创建真实机床工件偏置、不等于自动改库存毛坯、不等于测量认证，更不是材料扫掠仿真。

- **写Owner：04装夹与坐标系/D04**；03域只提供D01原始CAD、修订、设计datum、装配实例；02域提供D03资源及毛坯目录定义，不能用目录替换D04中已采用的毛坯实例。
- **真实消费方：06域D06/D07材料计算**必须检查毛坯来源/配准及几何证据，05域D05/冻结D08、07域D09刀路分别使用exact D04修订；D10由04域另行创建**机床执行绑定**，08域D12/D13、09域D14/D15不得从本画面预览获得执行真值。
- **角色：**工艺工程师发起及修改配准；CAD工程师确认设计实例/基准；装夹工程师确认可落座/可装夹意图；审批人签署相关D04变更；06域几何消费者及09域独立验证人员各自验收。GUI/CLI/Agent只是统一领域端口的不同入口，权限各自重验。
- **不在本CAP：**生产机床偏置数值、探针实测、B5轴树/运动学、夹紧力认证、自动生成/修改库存尺寸、全域材料扫描、CL播放替代NC工程仿真。

## 2. 八个内部子能力（不改变88项分母）

**REG-S01**确切CAD实例与毛坯来源双引用；**S02**单Setup多框架配准；**S03**拓扑/设计datum/手工约束资格；**S04**候选绝对定位及幂等；**S05**目标与毛坯的几何包围/余量判定门；**S06**3D+GUI/CLI/Agent一条命令路径；**S07**授权CAS保存、失效传播；**S08**离线回退、版本迁移与消费者验收。

## 3. 业务主流程与异常路径

1. 从当前工程/文档实例/Setup读取**带scope的D01 exact revision+hash、CAD occurrencePath、已采用或待采用毛坯实例**。无毛坯允许只读查看CAD和候选，但不得通过材料状态求解门；多Setup直接按ID读取，不强制重做特征识别。
2. 用户选择毛坯来源：stock geometry（现有真实B-Rep/网格附几何资格）、目录标称尺寸、人工创建的设计候选，或**确有数据出处**的测量结果；UI明确 `nominal`、`measured`、`unknown`，不能把几何拟合结果称实测。新建Setup/打开模型不执行毛坯自动计算。
3. 选择CAD基准实体/stock基准，保存实体所属CAD revision、topologySnapshotRef、装配实例路径；只有渲染网格拾取且没有B-Rep/PMI可追溯映射时保持 `candidate`/ `unknown`。单点只约束3平移自由度（若无额外信息不可自称唯一6DOF）。
4. 构建具名变换 `T^S_P`（零件P→Setup S）与 `T^S_K`（毛坯K→Setup S），采用列向量左乘约定，`T^K_P = inverse(T^S_K) * T^S_P`；输入单位、正交性、`det(R)>0`、有限数/可逆性必校验。Babylon仅派生显示，不反写CAD Frame真值。
5. 用户点**计算候选**，领域求解基于锁定CAD+stock+constraints+算法修订产生绝对位姿Proposal；任意重复点击相同输入返回同一结果；约束欠定/矛盾或测量误差未知时明确 `unknown` 或 `ambiguous`，不生成伪零矩阵。拖动3D仅修改临时ghost展示。
6. 用户显式请求**计算目标在Setup局部的包围**，区分由BRep精确候选、网格近似、8角保守外包的证据等级；先跑bbox剔除明显越界，再由几何内核/形状资格决定是否能声明包含及余量。不得仅凭AABB交叠声称每处余量充足。
7. 用户在左侧Review页检查旧/新Frame、尺寸（原始库存不改）、几何缺口、源修订、影响表和审批状态；**采用候选并不等于最终保存**。正式Commit前Host/CAM领域服务重验许可、scope、expectedRevision、input hash与CAS；撤权/取消/切Setup后晚回执不能套到新scope。
8. 成功返回D04 `revision/hash/receipt`，按exact依赖将相关D05/D06/D07/D09标stale，已冻结D08/发布D16保留历史并显式列重新签署事项；D10如引用旧D04也标执行绑定待重新核验，**不能自动调整G54或NC**。

**替代路径：**无stock→CAD探索允许、材料链拒绝；无约束唯一解→仅显示多个候选而不得批准；只有旧数值无单位/Frame→只读隔离并要求来源修复；CAD revision变化→本候选撤销并从新source重算；跨Setup切换→草稿按scope独立，不误用晚响应；断网→闭包确认后允许离线草稿，离线保存不能伪装已获服务器批准。

## 4. 跨域数据契约（设计候选，非已发布schema）

`RegistrationRequest = {requestId, projectId, documentInstanceId, setupId, scopeEpoch, expectedSetupRevision, targetCadRef:{id,revision,contentHash,occurrencePath,topologySnapshotRef}, stockRef:{id,revision,contentHash,sourceKind,geometryQualification}, framePolicyRef, constraintRefs, algorithmProfileRef}`。

`RegistrationProposal = {proposalId, inputFingerprint, candidateTransform:{T_S_P,T_S_K,unitCode,columnVectorConvention,handedness,scaleStatus}, solutionStatus:unique|ambiguous|unknown|invalid, bboxAssessment:{frameRef,method,algorithmVersion,tolerancePolicyRef,quality,extent}, containment:pass|fail|unknown, localAllowanceEvidenceRef?, impactedConsumers[], warningCodes[]}`。

`CommitRegistration = {requestId, expectedSetupRevision, expectedCadHash, expectedStockHash, proposalId, scopeEpoch, permissionContextRef, approvalFingerprint}`；服务端返回 `{setupId,newRevision,newContentHash,receiptId,dependencyInvalidationEventRef}`。源改动/批准状态不匹配就拒绝，不靠UI控件是否灰显授权。保存为D04**不可变新修订**，不存在所谓“只更新场景位置不改业务记录”的暗写渠道。

**Frame同义关系**：`p_S=T^S_P·p_P`，`p_S=T^S_K·p_K`；合成误差、浮点精度阈值、几何容差、单位由`frameNumericPolicyRef`和几何政策固定到算法版本，本文不指定无证据的通用工业容差。条件 `Bounds(P in S) ⊆ Bounds(K in S)` 只是必要筛查；并非B-Rep真实包含的充分条件（空腔、薄壁/凹多面体、非实体mesh均需明确分类）。

## 5. 统一端口、失败语义和迁移

候选模块 `StockPartRegistrationPort`：`evaluateEligibility(ctx)`、`proposeRegistration(cmd)`、`getProposal(proposalRef)`、`reviewRegistration(cmd)`、`commitRegistration(cmd)`、`getRegistrationSnapshot(exactRef)`、`explainImpact(oldRef,newProposal)`、`cancelPending(requestId,scopeEpoch)`；复用Host/Project、ModuleRegistry/ContributionHub、RendererPort、现存SetupDraft/SetupService，不为本CAP新建第二个Setup保存控制器。

失败码按域内可机读返回：`SOURCE_REVISION_CHANGED`、`STOCK_UNQUALIFIED`、`REGISTRATION_UNDERDETERMINED`、`INVALID_RIGID_FRAME`、`GEOMETRY_EVIDENCE_INSUFFICIENT`、`CAS_CONFLICT`、`SCOPE_REVOKED`、`LATE_ACK_IGNORED`、`LEGACY_FRAME_UNKNOWN`、`NC_SEMANTICS_UNKNOWN`。未知控制器语义绝不被默认机床规则“补全”；禁止无模型名硬编码。

迁移：先读旧`setup/stock/partTransform`原始字节及schema/单位，再建立只读归一投影；能够用exact source确认才生成迁移Proposal，保留旧raw、迁移证据和回退ref。缺单位/来源或需人工判断时fail-closed，不修改旧工程。C0仅放scope、exact ref、Frame标记/单位、revision/hash、错误分类；领域算法及stock模型留在04域。

## 6. 理论→规则→字段→验收追踪

| 规则 | 核心约束 | 关键字段 | 来源ID | 正例 / 反例 |
|---|---|---|---|---|
| REG-R01 | 双源身份与唯一Owner | `projectId`, `documentInstanceId`, `setupId` | SRC-REG-001, SRC-REG-005 | CAP-04-02-T01 / CAP-04-02-T02 |
| REG-R02 | Frame方向与刚体约束 | `partToSetupTransform`, `stockToSetupTransform`, `partToStockTransform` | SRC-REG-002, SRC-REG-003, SRC-REG-005 | CAP-04-02-T03 / CAP-04-02-T04 |
| REG-R03 | 约束可解性与非积累定位 | `alignmentInputHash`, `registrationConstraintRefs`, `solverAlgorithmRef` | SRC-REG-001, SRC-REG-003, SRC-REG-005 | CAP-04-02-T05 / CAP-04-02-T06 |
| REG-R04 | 毛坯生成显式且保留原始尺寸 | `stockGeometryRef`, `requestedBoundsFrameRef`, `stockNominalDimensions` | SRC-REG-003, SRC-REG-004 | CAP-04-02-T07 / CAP-04-02-T08 |
| REG-R05 | 几何包含与余量证据 | `stockBoundaryRef`, `targetBoundaryRef`, `boundingAlgorithmRef` | SRC-REG-003, SRC-REG-004 | CAP-04-02-T09 / CAP-04-02-T10 |
| REG-R06 | 3D与入口一致性 | `viewportSelectionRef`, `proposalId`, `scopeEpoch` | SRC-REG-003, SRC-REG-005 | CAP-04-02-T11 / CAP-04-02-T12 |
| REG-R07 | CAS权限与取消晚回执 | `requestId`, `expectedRevision`, `expectedCadHash` | SRC-REG-003, SRC-REG-005 | CAP-04-02-T13 / CAP-04-02-T14 |
| REG-R08 | 依赖精确失效与冻结保留 | `dependencyExactRefs`, `impactGraph`, `staleReasons` | SRC-REG-003, SRC-REG-005 | CAP-04-02-T15 / CAP-04-02-T16 |
| REG-R09 | D04与D10及NC验证隔离 | `plannedWorkFrameRef`, `executionBindingRef`, `controllerDialectRef` | SRC-REG-002, SRC-REG-006, SRC-REG-007 | CAP-04-02-T17 / CAP-04-02-T18 |
| REG-R10 | 离线恢复、迁移与可逆回退 | `schemaVersion`, `sourceClosureRefs`, `migrationDecision` | SRC-REG-003, SRC-REG-005 | CAP-04-02-T19 / CAP-04-02-T20 |

来源公开阅读边界详见 [R-STOCKREG-001](../../../research/topics/R-STOCKREG-001.md)。上表中CAS、绝对候选、统一3D场景、禁止自动扩大毛坯为**Procet内部设计安全契约**，不是ISO付费正文的虚构条款。

## 7. 实施任务与独立消费者验收

1. 04域建双源身份/Frame/配准Proposal契约；2. 03域给出CAD occurrence/topology有效性接口；3. 02域提供stock目录/名义几何版本与测量来源资格；4. F1-02在Native/TS与Babylon边界做正反矩阵对拍；5. F1-04为D04与D10分别适配入口；6. W2-05修多Setup exact寻址/失效传播；7. E3-04对3轴+B5执行配置执行真实机床坐标对拍（非默认放行）；8. U4-02完成统一左侧任务和单Babylon世界；9. 建立失败注入/CAS/撤权/离线迁移端到端测试；10. 独立06域用同一revision复算几何包含，08/09域检查D12→D13→D14→D15→D16门禁而非CL动画。

验收命令**待产品工程真实建置**：`TODO_TEST_ENTRY:CAP-04-02/T01..T20`。当前只有规划数据一致性、合成数学算例可以检查；不能把结构校验、渲染截图或mock标为产品PASS。L3评审需要批准领域接口、数值政策与工程设备证据；产品实现后按独立消费者+反例验证和失效回退进行正式验收。
