# CAP-03-07｜特征关系与依赖：版本化制造特征关系图

> 状态：**本地详细规划已编制，远端未入库，L3待评审，产品实现与验收未执行**。2026-10-19。原V0.8第03域第07项；不增加88/36分母。关联[GUI/3D交互](UI.md)、[研究R-FREL-001](../../../research/topics/R-FREL-001.md)、[来源登记](../../../research/sources/CAP-03-07.json)、[规则追踪](../../../research/traces/CAP-03-07.json)与[独立正反验收](fixtures.json)。

## 1. 业务定位、用户与原工作包

目标是在**同一个受管工程、D01 CAD精确几何快照与装配实例**下，将已确认D02制造特征之间的几何拓扑接触、材料空间关系、制造语义归属、分组和证据冲突建成可审查的版本化关系图，为05域工艺规划和06域求解提供**有界事实**，而非直接写工序次序。原始定义是“包含、相交、相邻、制造关系图”，不是机床运动或材料扫掠仿真。

- 03域特征工程师发起关系候选、确认、冲突处理；03域PMI工程师审查保留区/要求的exact引用，03域**FeatureRelationService**（提案名）为D02关系修订的唯一写入Owner。
- 06域Solver负责AAG、几何分类、候选父子、HierarchyProjection与只读DependencyDag的**算法证据**，不得越权审批D02；05域工艺工程师将可信关系消费进D05，另行确定优先级、资源与Setup依赖，批准后的D08不可静默变更。Host/Project/快照管CAS、作用域、身份和事件，GUI/CLI/Agent调用同一领域服务。
- 对应**B0-02 / F1-03 / F1-04 / T5-02**，关联CAP-03-02装配实例、CAP-03-03稳定拓扑、CAP-03-04设计要求、CAP-03-05算法候选、CAP-03-06人工确认；D04 ProcessSetup与D10 MachineExecutionBinding严格分开。

内部细分（不新增CAP编号）：FR-01选择图作用域、FR-02真实邻接证据、FR-03几何交叠/包含证据、FR-04制造语义和岛屿保护、FR-05父子/分组/辅助图、FR-06多解释与冲突裁决、FR-07审查冻结与提交、FR-08版本演化和下游影响。

## 2. 三层关系的精确定义

**第一层几何关系（只读事实/候选）**：`shares_topological_edge`来源于同一B-Rep拓扑实际共边；它是对称关系，且应保留支持边及多面/非流形诊断。`distance_near`是同一Frame的距离测量，阈值必有单位和profile；`volume_intersects`须独立几何核验证据，AABB重叠不足以证明。`geometric_contains`必须声明对象是特征体积、目标材料还是加工去除域，禁止仅通过投影的包围关系推断。仅共顶点不等于共边。

**第二层制造特征语义关系（03域版本化D02）**：`ContainsRemoval`表达去料语义嵌套、`ContainsPreserve`表达保留岛/凸台关联、`Intersects`表达交互、`CompositeMember`表示复合特征成员、`FeatureGroup/StructuralDomain/MachiningGroup`是分组或网络辅助事实；彼此不互换。多重属于一组可以合法，**不能把全关系图压成必须唯一父级的树**；需要树展示时仅生成只读`HierarchyProjection`并记录选父规则、舍弃候选及歧义。`ConflictsWith/AlternativeInterpretation`是设计提案的扩展关系，仅在L3批准后开放，不写回旧Schema。

**第三层工艺依赖（05域D05/D08）**：`DependsOn(child,parent)`包含约束方向，是有向关系，需加工策略/材料保留/访问性/阶段余量/Setup及人工决策证据。03域的`ContainsRemoval`**不能自动升级为已批准工艺顺序**。05域可以查询06域只读DependencyDag作为候选，但在本域提交前不得授予D08冻结资格。`ContainsPreserve`不意味“把保留岛粗铣掉”；CL/NC/控制器执行链仍独立运行。

> 几何材料关系≠制造语义关系≠工序依赖；三类Graph的有效域、方向、算法Version、Owner和审查状态必须独立保留。Source→Provenance→Decision→Acceptance同样不意味着Source本身是企业批准规则。

## 3. 主流程、替代流程和异常流程

1. 在工程工作台选`projectId/documentId/designRevision/sourceGeometryHash/assemblyOccurrencePath/frameRef/geometrySnapshotRef`，查询已确认D02及其revision；必要条件不足只展示候选，禁止跨装配实例静默合并。
2. 03域向06域只读请求候选图(`QueryRelationCandidates`)：来自拓扑共边、曲面属性、真实布尔或域证据；每个edge包括`evidenceClass/algorithmVersion/profile/coverage/unknownReason`。算法Run Solved只说明该Run的结论，**不代表关系全集与D02批准**。
3. 分类邻接、接触、交叠、材料包含、复合成员与辅助边；明确边的对称/有向属性，双向反例不能被字典序归一时误去方向。
4. 对台阶腔、孔穿腔、开放槽、圆弧岛、薄壁/筋、组合特征、多Solid和多实例进行冲突分组。`parentCandidates`多项、证据不足或topology remap ambiguity均维持`ambiguous/unknown`而非任意按ID选择一个作为批准树父。
5. 左侧UnifiedTaskPanel中显示关系表、树视图与完整Graph的对照；唯一Babylon主世界高亮关系两端及支持面/边，候选颜色区别`proposed/confirmed/unknown/stale`。三维Pick/hover/预览仅改变UI状态，**不得修改D02或D08**。
6. 负责工程师按明示证据处理多父归属、保留岛、冲突，提出`ProposeRelationResolution`；保留被驳回候选及原因，协作评审需要PMI/设计Owner参与时发起待审，不得伪造批准。
7. `CommitFeatureRelations`必须带`expectedD02Revision/requestId/actor/policyRef/scopeEpoch/candidateGraphHash/resolvedEvidenceRefs`。**真正提交点**由Host/03域二次验证权限、exact D01/D02、Frame/单位、CAS、证据闭包及冻结影响；成功才发行新`d02RelationRevision/hash`与不可变事件。
8. 向05/06/08/10相关消费者广播精确受影响节点和关系，生成人工可审查的`ImpactManifest`；旧D08、D16保持原版，只标需要回看，不能篡改既有批准和NC验证。

替代A：**无求解器的人工关系**。可选已确认特征建立人工“相邻/包含”提案，若几何证据不足只可`pendingEvidence`，不可被机器误认为`verified`。替代B：**多解释网络**。容许同一区域多个交叠候选并存、复合/结构组不抢占单树父；在规划采纳点明确选择或暂停。替代C：**变更后迁移**。根据CAP03-03真实拓扑History多对多重绑定，人工确认后产生新D02关系revision，不挪用旧Face Index。

异常：非流形边、只共顶点、BBox假相交、近相切数值容差、高曲率曲面、保留岛误认成去料、跨Solid实例、双父竞争、父子回路、证据版本不匹配、权限在预览和提交之间变化、两编辑者CAS冲突、取消后迟到Worker、断网后结果未知、冻结NC依赖失效。全部使用`unknown/conflict/stale/rejected`及typed诊断，而不是“继续可加工”。`UNKNOWN_AFTER_TIMEOUT`须按requestId查真实receipt，不得因网络超时自动生成第二修订。

## 4. 数据字段、量纲与Owner（L3提案，非已实现产品API）

| 字段/引用 | 来源、单位与默认 | 用户编辑/派生/Owner |
|---|---|---|
| `projectId/documentId/modelDefinitionRef/occurrencePath` | Host/D01；无量纲；无静默默认 | 必填只读；03域绑定确切实例 |
| `d01Revision/geometryHash/geometrySnapshotRef` | D01精确快照/哈希；无量纲 | 必填只读；源变更必须再计算/复核 |
| `d02Revision/featureRefs[]/featureRevision[]` | CAP03-05/06已确认D02；无量纲 | 必填只读；03域FeatureService管权威revision |
| `relationRef/relationRevision/relationGraphHash` | 03域提交生成；无量纲 | 提交前为临时ref；提交后只读追加式 |
| `relationKind/graphLayer/direction` | 03域审查与算法候选；枚举；默认unknown | 允许提出类型，持久确认时强制检查类型方向 |
| `edgeEndpoints[]/syntheticNodeRefs[]` | exact D02 ref；无量纲 | 有向端点保序；对称边canonical排序仅在同scope内 |
| `topologyEdgeRefs/contactFaceRefs/intersectionEvidenceRef` | OCCT证据；同一快照及Frame；无量纲 | 算法派生只读，历史不明unknown |
| `distanceMm/toleranceMm/toleranceProfileRef` | 内核测量与显式策略；mm、配置哈希 | 数值只读派生；无profile不按固定阈值断言接触 |
| `volumeIntersectionMm3/containmentProofRef` | 独立几何核验；mm³/无量纲 | 派生只读，BBox证据不允许升级为exact |
| `materialRole/protectedRegionRef` | CAD目标+PMI/人工意图；枚举与exact ref | 03域决议，质量审查保留结构影响；不写D04/去料体 |
| `evidenceClass/sourceAlgorithmVersion/kernelProfileRef` | Solver/OCCT实际发射；哈希和版本 | 只读，来源缺失为unknown，不默认为prod Native7.9.3 |
| `parentCandidates[]/ambiguityStatus/resolutionReason` | 算法+人工审查；枚举 | 可决议但保留被淘汰候选及来源；无理由不可批准 |
| `coverageStatus/diagnostics[]/proofHash` | 范围限定的候选/Oracle；枚举/哈希 | 只读，不将部分覆盖伪称完整图 |
| `requestId/expectedD02Revision/actorRef/policyRef/scopeEpoch` | Host受管域上下文 | 写命令必填，提交点重新验证 |
| `affectedConsumers/impactManifestRef/frozenSnapshotRefs` | 下游D05/D06/D08/D16只读依赖 | 仅通知与审查；禁止03域重写冻结真值 |
| `schemaVersion/compatibilityReader/rollbackRef/receiptStatus` | C0协议/Host持久事件 | 仅追加新Schema，旧Reader保留，回退不删历史 |

版本容差原则：`distanceMm`和`volumeIntersectionMm3`仅在适用几何证据存在时赋值，不能用零表示“未知”。图形展示和Backend几何采纳必须绑定相同的`geometryHash`与Frame。半径/坐标方向不猜测；统一C0只提供引用/单位/帧协议，不新造全业务`commonRelation`对象。

## 5. CLI/GUI/Agent共用领域用例和协议

**拟议查询**：`GetFeatureGraphAtRevision(scope,d02Ref)`、`ListRelationCandidates(exactSnapshotRef)`、`GetRelationEvidence(relationRef)`、`GetRelationImpact(d02Revision)`、`QueryRelationCommandReceipt(requestId)`。

**拟议命令**：`PreviewFeatureRelations(candidateRefs,options)`（只读）、`ProposeRelationResolution(candidateGraphRef,decisions)`（草案）、`CommitFeatureRelations(expectedRevision,requestId,actor,policyRef)`（唯一领域受管写口）、`RebindFeatureGraph(newD01Snapshot,historyEvidence)`（产生新草案）及`RequestFeatureRelationReview(targetRef)`。不得把候选命令当现有TypeScript/Rust API。

**拟议事件**：`FeatureRelationCandidatesReady`（算法只读证据）、`FeatureRelationReviewRequested`、`FeatureRelationsCommitted`、`FeatureGraphStale`、`FeatureRelationConflicted`；生产域`PlanDependencyApproved`由05域Owner另行发出。回执提案：`{requestId,scopeEpoch,targetProjectRef,expectedD02Revision,committedRevision?,committedHash?,status: COMMITTED|CONFLICT|REJECTED|CANCELLED_BEFORE_COMMIT|UNKNOWN_AFTER_TIMEOUT,diagnostics[],eventCursor?}`。`COMMITTED`由03域CAS持久提交确认，而非GUI动画已完成。

**并发/取消/恢复**：`same requestId + same payloadHash`需查询同一实际receipt；同key异payload应拒绝。另一操作者改D02后，本地旧revision提交必须冲突，不执行“刷新并覆盖”；切Project/Document后迟到响应只登记原范围，不改变当前3D overlay和编辑页。取消只能撤销未提交操作；提交已发生需提新修订/显式回退提案，不能销毁旧事件。断网下结果不明先查原requestId，再决定继续。

## 6. 真实源码复用与待审工程风险（只读固定SHA）

- `procet-solver` develop@`44172bc046bfd65c2a4fe36212536c70226be48f`中存在`crates/solver-feature/src/hierarchy/{relation,projection,dag}.rs`：`RelationKind`已有8类，包括`ContainsRemoval/ContainsPreserve/Intersects/CompositeMember/FeatureGroup/StructuralDomain/MachiningGroup/DependsOn`；存在`CandidateEdge`, `EvidenceClass`, `HierarchyProjection`, `DependencyDag`。因此**应复用既有typed候选图及算法产物**，而非重做relation engine。
- `relation.rs`用成员面邻接、floor质心Z/足迹圆近似、`FLOOR_Z_TOL=1e-3 mm`、`OBLIQUE_AXIS_DEG=30°`等启发式推导。**这是当时算法实现中的局部判断，不是跨任意Frame与复杂曲面通用标准**。需工程量测、旋转/翻转、细窄腔、交错孔和多Solid的独立反例，不能默许世界Z就是加工深度。
- `projection.rs`注释承诺多父势均力敌时unknown，但本次只读发现实现中的`min_by`包含id决胜，可能令`ambiguous_ownership`分支难以命中；这仅是**待核实的潜在实现/注释不一致**，需要在固定HEAD上增加反例测试，未宣称产品故障。`dag.rs`从树ContainsRemoval推出默认先父后子的`DependsOn`只读候选；`tree_edge_is_removal()`找不到候选时回退true是边界风险，不能直接写05域批准次序。投影处理辅助边排序时有方向归一，需给未来有向依赖边单独回归检查。
- 这些文件中的`face index`、量化group ID等可作为**同一算法/快照的证据索引**，不能作为跨模型永久身份。`OCCT8.0.1`在线参考与生产Rust Native7.9.3目标属于不同profile，既有tests没有在本轮运行。
- 复用`procet-gui` Host/Project/快照、ModuleRegistry、ContributionHub及唯一RendererPort；GUI只做投影。现有算法relationship/hierarchy artifact不等于GUI/CLI/Agent能提交正式D02；需要新03域Owner Adapter/领域CAS、审查投影、应用层事件与跨域影响契约。不得将Solver的`Solved`包装成D02批准/生产NC可发布。

## 7. 10条规则与20个独立正反验收

| 规则 | 要求 | 正例/反例 |
|---|---|---|
| FREL-R01 | 关系必须绑定Project/Occurrence/D01与D02 exact修订、Hash、Frame；异实例不可仅靠名称合并。 | T01/T02 |
| FREL-R02 | 拓扑邻接是同版本真实共边证据；仅共顶点、mesh视觉靠近不能宣称有共享边。 | T03/T04 |
| FREL-R03 | 几何相交、紧邻、包含分开；包围盒相交只是粗筛，实际材料关系需要独立几何证据与容差上下文。 | T05/T06 |
| FREL-R04 | 去料包含与保留结构包含绝对区分；boss/岛屿不能因视觉上被包围而变成去料子级。 | T07/T08 |
| FREL-R05 | 被采纳的父子层级必须有向无环；非树交叉/分组辅助边不强制唯一树；发生环拒绝或转人工审查。 | T09/T10 |
| FREL-R06 | 多父竞争、特征交叠或拓扑身份歧义必须保留候选与unknown，不凭ID排序默默批准单个父。 | T11/T12 |
| FREL-R07 | 03域材料/拓扑关系不是05域工艺优先序；DependsOn只能由规划/约束证据形成受控D05/D08结果。 | T13/T14 |
| FREL-R08 | 证据记录引擎配置/容差单位、来源面集与核验范围；OCCT API样例不能冒充生产Native7.9.3实测。 | T15/T16 |
| FREL-R09 | 3D候选/预览不持久化；GUI/CLI/Agent同端口提交时在03域Owner处重验权限、D02-CAS、幂等key。 | T17/T18 |
| FREL-R10 | 关系修订只追加新D02并传播局部失效；保留冻结D08/D16，断线重试按requestId查询真实回执。 | T19/T20 |

独立输入、正例期望与负例拒绝行为在[fixtures.json](fixtures.json)中；本轮校验工具只检规格结构和合成图契约，**不运行真实B-Rep布尔、Rust OCCT、GUI/权限、NC或实机**。独立实际验收须在固定Project/源fixtureSHA/OCCT Native7.9.3构建profile、许可证允许的合成模型、真实FeatureService提交口和权限配置下执行，保留真实日志/报告。没有产品测试入口时标`TODO_TEST_ENTRY`，不能假造PASS。

## 8. 迁移、兼容、准入/退出与回退

实施建议：①冻结D02关系Schema草案和Owner审查 →②将Solver候选graph以只读port入Host →③接通UnifiedTaskPanel+RendererPort只读投影 →④建立03域CAS提交与人工裁决 →⑤下游D05/D08失效传播及旧记录兼容 →⑥配置Native7.9.3实际回归并审计算法建议域。旧版本HierarchyProjection保留只读读取，面号或合成组没有可确证跨版History则标`legacy_unresolved`；不将old graph迁移为approved真值。

**规划准入**：CAP03-02/03/05/06的待入库草案、B0-02权责草案和V0.8源编号已核对；现有算法接口与限制已按固定源码SHA观察。**规划退出**：业务、GUI、数据、算法边界、10条机器追踪与20组正反规格和本地校验形成；本轮已编制，不是L3批准。**实施准入**：B0-01真实产品三组合锁、D02 Owner审批、实际Host事务/授权/幂等协议、production OCCT profile、合法测试模型/测试入口均待建立。**产品退出**：包含、相交、相邻、非流形、变Frame、交互特征、岛屿、复合群、图环、多父、并发、迟到回执、冻结影响以及3轴/5轴下游均实际通过；本轮NOT_RUN。

回退只禁用新RelationHandler并将已有D02关系修订保持只读，新事实不得覆盖旧批准或删除历史。历史读取器按schema版本工作；当前不创建工序、刀路或NC，杜绝“撤回关系=自动撤销NC”的错误。