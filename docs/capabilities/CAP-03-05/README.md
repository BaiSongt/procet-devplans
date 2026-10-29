# CAP-03-05｜制造特征识别——从 B-Rep 证据到可复核的 D02 候选

**B31追加专项（2026-10-30）：** [装配Occurrence与Face历史重绑证据](ASSEMBLY-FACE-B31-2026-10-30.md) · [8条规则追踪](../../../research/traces/CAP-03-05-assembly-face-b31-v08.json) · [合成检查](../../../tools/check_cap0305_assembly_face_b31_v08.cjs)。原文历史状态未改；专项证据已正式在规划分支入库，但L3、真实产品、独立Owner/消费者均待审。

> 2026-10-18 · V0.1 · **本地编制，远端待入库；L3方案待评审；未进行产品测试或人工批准。** 属原V0.8第03域第05项，不变更88项分母。原工作包：B0-02、F1-03、F1-04、T5-02。配套：[GUI/3D](UI.md) · [理论 R-MFR-001](../../../research/topics/R-MFR-001.md) · [研究规则追踪](../../../research/traces/CAP-03-05.json) · [20正反规格](fixtures.json)。

## 1. 业务目标、角色、Owner和反目标

把设计几何中的孔、槽、台阶、型腔、端面、保留岛/筋壁、组合与重叠区域转成**证据齐全、可人工确认的制造特征候选**，再经03域Owner受管用例写入D02。算法识别不等于可加工性结论、工序、刀路、真实材料去除几何或批准。关键是每个结论可回答“基于哪个exact几何、哪些面/边、哪个算法配置、为什么是这一类、替代读法是什么、何时失效”。

- **CAD/制造特征工程师（03域）**：选取模型/装配实例、对候选进行复核、修订、人工确认；**唯一权威D02写入Owner**为03域的Feature Service（提案，不宣称已有同名实现）。
- **求解/几何算法提供者（06域）**：读取授权的D01几何/可选D04毛坯，输出不带生产资格的候选及证据Run；不得直接改D02、D05、D08。
- **工艺工程师（05域）**：消费D02已确认版本，按Setup和加工目标选取特征→编排/采纳D05、D08；不得用自动候选直接改批准Plan。
- **质量/PMI工程师（03/质量）**：检查从CAP-03-04冻结PMI到D02加工要求的绑定，不允许推断未知形位公差。
- **GUI、CLI、Agent**：只通过相同Host领域查询/命令/回执；无论工具自称支持、后端就绪、用户授权，均不得省略提交点再校验。

八个内部切片：M5-01 B-Rep输入资格；M5-02邻接/解析几何证据；M5-03孔/槽/台阶/型腔识别；M5-04端面及毛坯依赖；M5-05保留岛/薄壁/筋与重叠候选；M5-06可信度/歧义/诊断；M5-07候选审查与D02精确采纳；M5-08跨版失效/迁移/离线恢复。以上是CAP内部切片，不增加88的分母。

**不做**：在本CAP中构造工序顺序、材料扫掠、局部真实去料体布尔、CL/NC、机床轴运动；不以“识别成功”宣布任意2.5D/五轴可加工；不靠 B5/零件名/包围盒猜轴树或加工参数；不把算法面对`face:3`等单纯索引当跨版本永久引用。

## 2. 主流程、替代流程、异常流程

**主流程（用户显式选定工程与输入）**

1. 从Project/文档导航进入“制造特征识别”，选 `ProjectId + ModelDefinitionRef + DesignRevision + SourceGeometryHash + AssemblyOccurrencePath + GeometrySnapshotRef + FrameRef`。多实例应分别建引用，Frame/单位不得从显示矩阵推导。
2. Host询问03域D01真实B-Rep快照及几何完整性、拓扑映射支持集、Reader/OCCT和feature算法profile；分清`geometry_can_display`、`geometry_can_recognize`、`manufacturing_qualified`三个状态。仅mesh则可观察/手动圈选，禁止冒认几何语义。
3. 授权只读识别Run交06域受管Provider（F1-05）。使用拓扑Face/Edge/Wire/Solid/方向/局部坐标、邻接/凸凹、解析面、材料侧、法向证据生成图和候选；有D04毛坯才开放依赖毛坯的外形/端面候选，不强制用户预绑定具体机床执行配置D10。
4. 识别器输出候选（孔、复合孔、闭/开腔、槽、台阶、端面、凸台/薄壁保留、组合/重叠）、`sourceFaceRefs`、角色面（底/侧/过渡/入口/岛）、参数与单位、算法证据、诊断、互斥与重叠关系。缺信息保留`unknown/needs_review/skipped`而非抹去。
5. GUI左侧统一任务容器展示候选队列与可解释的争议；在同一Babylon主世界高亮成员面与重叠面，预览选择**绝不写入D02**。用户能取消、选择人工审查或复跑限定Profile。
6. 03域工程师逐项确认/拒绝/修订，允许保留多个相互冲突的提案而不自动批准；与CAP03-04冻结PMI绑定时只写显式、可解释的加工要求关系，未知GD&T不转成刀具参数。
7. Host对 `requestId + expectedD02Revision + exactD01Ref + topologyHistory + policyRef + Actor + scopeEpoch` 在**提交点**重新验权、验几何和冻结依赖；03域写入新D02`accepted_draft`或经批准的`approved`（批准单独执行），回传真实修订和receipt；后续工艺D05读取确定D02版本。
8. 将识别Run、合法的输入及诊断持久化到离线工程的只读来源闭包。提交后按依赖规则通知D05/D06/D08、D09/D16 *需重审*；不会在识别阶段直接发布NC。

**替代路径**：几何有非法面或只有网格→仅供选择与定位、不输出Verified候选；复杂腔多假设→人工决定或分阶段标注，不必全部阻断其它有效候选；未选择毛坯→不阻断几何孔识别，但`outer_profile`/端面余量类显示requires_stock；没有PMI→几何探索继续，但相关制造约束状态unknown；无机床D10→依然允许无机床相关识别，不授予定机床可达性或加工参数。

**异常时序**：取消计算后旧Worker返回、切换Project/文档/Setup导致scopeEpoch变化、相同requestId重试、并行两个操作者基于旧Revision采纳、CAD重新导入面号变化、拓扑分裂/删除、算法Profile升级、原批准D08仍被冻结。所有晚回执以Run所属scope保存历史但**不得更新当前屏幕对应工程**；若提交先于取消发生，应查询receipt并显示已提交而非假取消。过期revision冲突不得隐式覆盖：提供复核/重基/新草案，保留旧Frozen版本及完整来源。

## 3. D01/D02/D04/D05/D06边界及拟议域契约

| 对象/字段 | 来源、单位、必填/只读 | 唯一Owner、适用性 |
|---|---|---|
| `projectId/modelDefinitionRef/designRevision/sourceHash` | D01、必填、无物理单位；hash按文件字节 | 03域设计输入Owner，识别不得改源 |
| `assemblyOccurrencePath/geometrySnapshotRef/frameRef/unitRef` | D01/CAP03-02/03-03；单位mm/deg需明确来源 | 设计定位；装配实例不能只用定义ID替代 |
| `topologyCheck/evidenceAvailability` | B-Rep provider只读派生；valid/invalid/unknown | 解析/完整性≠制造性；只有mesh时不授几何资格 |
| `algorithmProfileRef/hash/workerVersion/runRef` | F1-05/06域；必须有exact版本 | 同输入、不同算法配置为不同Run，分开溯源 |
| `featureCandidateRef/featureKind/hypotheses` | 06域输出候选；不等于权威D02 | confidence只是算法启发式，不代表概率校准 |
| `faceClaims/floorRefs/wallRefs/rimRefs/islandRefs` | exact topology refs；角色集合无物理单位 | 可重叠，不因列表顺序强迫唯一认领 |
| `holeDiameterMm/depthMm/axisFrameRef` | 解析几何与边界证据，mm / 方向单位向量 | 来源、方向/单位完整才可用于工艺提议 |
| `openSides/throughness/materialSide` | 结构证据或unknown；布尔/枚举 | 缺证据不可自动填closed/through |
| `frozenPmiRef/requirementBinding` | CAP03-04已批准的exact PMI | 来源不可混同切削余量或进给速度 |
| `diagnostics/skippedCount/evidenceCoverage` | Provider派生只读；含代码和字段位置 | Run状态Solved不意味着全部特征已映射 |
| `d02FeatureRevision/decision/approvalRef` | 03域命令提交后才有；无物理单位 | Solver无权写，03域以compare-and-swap提交 |
| `affectedConsumers/invalidationGraphRef` | Host/W2-03只读计算 | 对D05/D08及下游失效局部传播，冻结不静默篡改 |

C0只需`DomainRef, ExactRevision, ContentHash, FrameRef, UnitRef, ProtocolVersion`；本域候选/证据是03/06特有C1 DTO，**不建全局巨型common**。候选端口（均为L3提案，代码尚未建立）：`FeatureProvider.request_recognition(exactInputs,profile)`、`FeatureProvider.get_run_artifact(runRef)`、`FeatureService.query_candidates(scope)`、`FeatureService.preview_evidence`、`FeatureService.adopt_candidate(expectedRevision,proposalRef,Actor,requestId)`、`FeatureService.rebind_geometry`、`FeatureDecisionRecorded`/`FeatureCandidatesInvalidated`事件及`FeatureCommandReceipt`。GUI/CLI/Agent必须向同一Host协调器发送调用；不得直接调用Solver的内部数据库写操作。

注意业务状态边界：`candidate`、`in_review`、`accepted_draft`、`approved`、`stale`、`rejected`、`unsupported`各有明确跃迁；来自06域的`manufacturing_features`工件属于**算法候选载荷**，不是D02最终审批。审批凭证必须绑定目标Hash、策略版本、Actor和用途；「工具调用已确认」不等于批准。

## 4. 现有真实复用面与缺口（源码观察，不是产品测试）

本轮只读[procet-solver@44172bc0](https://github.com/BaiSongt/procet-solver/tree/44172bc046bfd65c2a4fe36212536c70226be48f)：

| Evidence | 源码入口与实际观察 | 必须补齐的产品审查 |
|---|---|---|
| E-FEAT-01 | `solver-feature/src/recognition/mod.rs`输出带`confidence/face_indices`的`RecognizedFeature`；顺序含孔/倒角/弯曲筋/腔/结构/外形 | source face index只是局部算法引用；跨修订依CAP03-03精确引用与演化；识别顺序不能假设全球最佳唯一分解 |
| E-FEAT-02 | `solver-feature/src/stage.rs`输入topology缺失/门拒则Run Blocked；部分特征缺证据在artifact diagnostic中跳过，Run仍可Solved | 需要`runOutcome`与`featureCoverage`并列呈现，阻止Run Solved→全部已确认的错误提升 |
| E-FEAT-03 | `solver-feature/src/artifact.rs`定义`manufacturing-features-v1`、成员角色refs、参数、置信度与诊断 | 复用现有DTO/工件和Run包，不重造识别算法；但正式03域D02采纳事务仍需产品接线 |
| E-FEAT-04 | `solver-feature/src/mapping/mod.rs`世界系子集，开放腔缺openSides出现CAM-3301跳过 | exact实例Frame、受控补充、兼容Reader及跳过条目统一呈现，不应将`skippedCount=0`由仅检查success列表推断 |

现有阈值（例如`holes.rs`的0.95τ、同轴1°等）仅记录为**所读代码中的局部启发式事实**，并非国际标准强制阈值或通用工程容差；产品冻结时需要版本Profile、基准Golden和反例。GUI现有研究笔记显示旧特征面板/手动特征管理器，但本轮未遍历全部消费者或运行界面，不能宣称已经接入统一TaskPanel。OCCT公开参考是8.0.1文档，Solver本轮开发环境已知Native 7.9.3，API等价与兼容必须锁定实际版本后再实测。

## 5. 十条规则、20组正反验收与适用边界

| 规则 | 核心验收主张 | 验收编号 |
|---|---|---|
| MFR-R01 | D01精确BRep输入资格，mesh只能预览 | T01/T02 |
| MFR-R02 | 邻接、朝向、材料侧联合取证 | T03/T04 |
| MFR-R03 | exact装配实例/Frame/单位、跨面序变化 | T05/T06 |
| MFR-R04 | 孔/复合孔/凸台与环岛材料辨别 | T07/T08 |
| MFR-R05 | 型腔/槽/台阶与多圈岛屿 | T09/T10 |
| MFR-R06 | 组合重叠与保留域冲突图 | T11/T12 |
| MFR-R07 | 算法候选≠D02已采纳≠D08冻结 | T13/T14 |
| MFR-R08 | 诊断、覆盖与置信度不夸大 | T15/T16 |
| MFR-R09 | 同源命令、提交点重验与迟到回执 | T17/T18 |
| MFR-R10 | 变更失效、迁移兼容和回退 | T19/T20 |

以上T01..20完整ID见[fixtures](fixtures.json)。每个用例的“预期输出”不是结果证据，必须在锁定合法模型/Native Profile/实际产品组合和可执行Harness后独立运行，保留exact Run/源码SHA与未覆盖项。正反验收不能只让模拟JSON自证其正确。

## 6. 依赖、扩展、迁移和回退

上游依赖CAP-03-01几何源、03-02装配实例、03-03稳定拓扑、03-04 PMI语义；跨域B0-02确认Owner，F1-03梳理旧CAM副本，F1-04分离探索/生产资格，T5-02负责CAD/PMI/特征真实回归；F1-05提供受管Solver调用，F1-06保证离线源工件及Profile快照。下游D02→D05/D06/D08，产生D07/D09/NC的逻辑在各自Owner，不在本CAP内。对旧feature字段/旧面索引数据建立只读Reader与迁移报告，不能静默重算所有历史已批准特征；新算法结果为新候选revision，回退时只切受管Handler绑定并保留源Run和业务决定。

**准入**：明确两侧真实接口Owner、锁定Source BRep/算法Profile/native版本、数据许可/离线模型来源、可用几何结构和审查人角色、模型/单位/Frame具体含义。**退出（规划阶段）**：规范/GUI/接口/验收/原工作包映射及来源双向追踪可审，风险与unsupported列表存在。**退出（未来产品阶段，尚未执行）**：真实BRep Golden和反例、不同Face顺序/刚体变换、孔与环槽/凸台误判、含岛屿/多Solid、并发提交/取消恢复、版本迁移在exact组合下记录PASS/FAIL/SKIPPED；无失败静默丢弃及人工确认责任可核对。人类批准仍单独待办。