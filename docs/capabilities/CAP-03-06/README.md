# CAP-03-06｜人工特征编辑确认：从审查草案到版本化D02事实

> 版本：本地规划V0.1，2026-10-19。原V0.8第03域第06项，88项分母不变；**仅编制/尚未远端提交，L3待评审，代码实现与产品验收均未执行**。前序CAP-03-05「制造特征识别」（另有独立本地待入库草案）定义算法候选语义；本项承接其本地待入库草案，不把候选当已批准事实。配套[UI/3D](UI.md)、[研究说明](../../../research/topics/R-FEDIT-001.md)、[来源登记](../../../research/sources/CAP-03-06.json)、[追踪矩阵](../../../research/traces/CAP-03-06.json)、[20个独立规格](fixtures.json)。

## 1. 用户与业务边界

**目标**：在确定的工程、几何快照和装配实例上，支持人工新建制造特征、修正算法识别的候选、分裂/合并特征、标定拓扑语义和制造意图，完成受控确认、争议处理和审计；上游输入属于D01，正式输出属于D02。编辑者不应被迫启动Solver、创建Plan或绑定具体机床，必要时可先形成`manual_draft`，但没有可信B-Rep时仅可存储“待定位意图”，不得授予几何确认状态。

**责任角色**：03域制造特征工程师创建/编辑/审查D02；03域领域FeatureService是**唯一D02权威写入Owner（设计提案，不声称当前已有同名服务）**；03域PMI/质量工程师对CAP-03-04的设计要求绑定出具确认；06域Solver只能提出候选和几何证据，不直接审批或改写D02；05域工艺工程师只消费确定修订的D02，不把D02修订直接等价于D05工序采纳或D08冻结；Host执行身份、授权、幂等和版本原子提交协调，GUI/CLI/Agent只调用同一用例。

**原编号依赖**：B0-02（17资产与03/05/06 Owner）、F1-03（CAM领域副本）、F1-04（CAD探索与ProcessSetup/ExecutionBinding分离）、T5-02（CAD/PMI/特征真实回归）。关联CAP-03-02装配实例、CAP-03-03拓扑演化、CAP-03-04 PMI、CAP-03-05算法候选、CAP-01-04权限审计、CAP-01-05 A/B模式。**不增加**原88 CAP或36工作包。

**不做**：不在3D绘制手势时直接写D02；不改D01 CAD/B-Rep、PMI源、D04毛坯、D05/D08工艺冻结；不算局部去料B-Rep、不规划刀路、不生成CL/NC、不做材料扫掠，不模拟控制器或机床运动。手动圆柱面选择≠已知孔可加工，算法置信度≠审批，D02 confirmed≠D16 NC发布许可。

## 2. 主路径（确定目标→编辑→审查→受管提交）

1. 在Project/Document范围明确`projectId/documentId/modelDefinitionRef/designRevision/sourceGeometryHash/assemblyOccurrencePath/geometrySnapshotRef/frameRef/unitRef`，通过Host获取D01及已有`d02Revision`。必须精确到装配实例，不能仅凭零件定义ID或视图Face Index定位。
2. 从Solver候选、已确认D02的修订分叉，或空白人工草案进入。状态区分`recognized_candidate`（未采纳）、`manual_draft`、`in_review`、`confirmed`、`approved`、`stale`、`rejected`、`superseded`；算法Run Solved不会偷偷进入confirmed。
3. 选择`featureKind`及边界/入口/底/侧/岛/保留材料面等`TopologyClaim`，记录每条来源（手工点选、导入标注或算法证据）及`GeometryRef`；核对几何合法性、边界闭合、材料侧与多Solid范围。仅网格/局部索引或无历史重绑定时产生`unresolved`，不得标记`verified`。
4. 编辑参数与语义。`diameterMm/depthMm/axisFrameRef/throughness/openSides`只有有证据和适用类型才录入；用户输入与只读几何测量结果并列，差异进入校核；不按B5名称/零件包围盒猜公差、机床、加工方式。
5. 同一Babylon主交互世界中勾选面/边和候选，左侧UnifiedTaskPanel内预览拟议特征、差异和冲突图。hover/pick/overlay改变UI临时状态**不改变D02 revision**；主/资源工作空间横向切换沿用唯一RendererPort。
6. 在审查页展示与原候选/旧确认版本的差异，冲突（重叠、分裂、共享面、误认保留岛）、PMI exact绑定、下游受影响引用。允许人工声明`unknown`与“需再取证”，禁止通过空白备注将不确定语义包装成已核实。
7. 用户显式提交`ProposeFeatureEdit`或`ConfirmFeatureRevision`，携带`requestId/expectedD02Revision/expectedD01Hash/policyRef/Actor/scopeEpoch`、编辑操作日志与证据哈希。**实际提交点**重新核对身份、用途权限、几何快照、拓扑可解析、PMI冻结引用与目标冻结规则；仅03域Owner以CAS写入新D02，回`FeatureCommandReceipt`（真实新revision/hash/status）或 typed conflict。
8. 成功后保持旧D02不可变，写入“基于某候选/修订的人工决议”来源图，通知D05/D06/D08等依赖的`needs_review`，**冻结D08/D16绝不自动重写或取消**。GUI/CLI/Agent可以查询同一receipt和事件链，但不得根据本地动画判断提交成功。

**替代路径A：纯人工建立**。未调用Solver仍可圈选已载入B-Rep定义孔/槽/型腔；所有解析尺寸需实际几何证据。纯网格模型可保存仅供草图对照的`unresolved_intent`，后续重绑B-Rep才可申请确认。

**替代路径B：分裂/合并**。旧特征被两项替代或多个候选合一时新增revision/featureRefs与显式`derivedFrom[]/supersedes[]`多对多关系；不得靠复用旧`featureId`隐藏变化。共享面允许多种制造解释并存，产品需显式冲突与审查裁决。

**异常路径**：权限变更、工程切换、提交后断网、响应丢失、并行用户旧revision提交、取消后晚Worker回执、重新导入STEP导致面号重排、D01分裂/合并、source PMI改变、冻结下游引用仍被生产使用。对`unknown/stale/conflicted`保持拒绝生产资格；对提交结果不明的请求先按idempotency key查询receipt；取消是停止未提交任务，不对已提交历史执行“悄悄撤回”。

## 3. 领域数据契约（L3提案，非既有API）

| 字段/集合 | 来源与单位 | 必填性及只读属性 | 唯一负责域/约束 |
|---|---|---|---|
| `projectId,documentId,modelDefinitionRef,assemblyOccurrencePath` | Host/D01；无物理单位 | 必填/只读 | 03域；路径为具体实例，不由显示树标签替代 |
| `designRevision,sourceGeometryHash,geometrySnapshotRef` | D01 exact；字节内容Hash | 必填/只读 | 03域D01；必须与视口投影来源相同 |
| `frameRef,unitRef,topologyRef[]` | C0 Frame协议及CAP03-03；毫米、弧度/角度需明确标注，拓扑Ref无量纲 | 必填或`unresolved`/只读 | 03域；反变换与容差来源可追踪 |
| `featureRef,featureRevision,parentRevision,editKind` | 03域D02生成 | 提交前为本地临时ID，提交后只读 | 新修订不可复用旧immutable revision |
| `featureKind,roleClaims,materialSide,openSides,throughness` | 用户显式选择+几何证据，枚举/unknown | 可编辑，确认前必须有支持证据 | 03域；面可以多重声明但有冲突记录 |
| `parameterClaims`（diameter、depth、axis） | 手工输入或B-Rep派生；mm或Frame向量 | 输入与测量两个槽，测量只读 | 不以输入值覆盖几何测量，不捏造通用容差 |
| `sourceCandidateRef,algorithmRunRef,sourceEvidenceHash` | D06/F1-05候选；无量纲 | 可缺省/只读 | 06域负责候选，03域负责决议，候选不可改写 |
| `frozenPmiRef,requirementLinks` | D01/CAP03-04 exact | 可选/外部只读 | 冻结PMI不能从特征编辑页隐式修改 |
| `conflictRefs,ambiguityReason,coverage` | 03域审查计算，枚举+解释 | 派生只读；unknown显式 | 只覆盖当前选中的几何/业务范围 |
| `expectedD02Revision,requestId,actor,policyRef,scopeEpoch` | Host/CAP01-04 | 提交必须；只读上下文 | 提交点核验范围与幂等重放 |
| `decision,reviewReason,approvalRef,receiptRef` | 03域审查/批准服务 | 写入需用户动作，确认与批准分开 | 决议证据源与审核人可追踪，撤回不删历史 |
| `affectedConsumers,invalidationPlan` | 05/06/08/10下游订阅查询 | 只读；仅建议待重审 | 禁止03域直接覆盖已冻结D08/D16 |

`TopologyClaim`候选结构：`{role, geometryRef:{documentId,designRevision,sourceHash,occurrencePath,frameRef,subshapeKind,selector,historyEvidence}, state: verified|unresolved|ambiguous|invalid, provenanceRef}`。`selector`可以是历史支持的稳定引用或限定快照内的索引，但绝不能只存faceIndices跨版使用。复杂孔、开腔、薄壁/岛屿的拓扑集合不强行压缩为一个face；命名歧义保留证据和候选集合。

**领域入口（全部标提案）**：查询`ListFeatureProposals(scope,exactD01Ref)`、`GetFeatureRevision(ref)`、`PreviewEditDiff(draft)`、`ResolveTopologyClaims(ref,sourceSnapshot)`；命令`CreateManualFeatureDraft`、`ChangeFeatureClaims`、`SplitFeatureRevision`、`MergeFeatureRevisions`、`ConfirmFeatureRevision`、`ApproveFeatureRevision`、`ReopenFeatureOnNewDesignRevision`、`QueryReceipt(requestId)`；事件`FeatureEditProposed`、`FeatureRevisionConfirmed`、`FeatureReviewRequired`、`FeatureRevisionSuperseded`。所有调用由Host鉴权/版本校验→03域FeatureService完成，06域SolverProvider只读供候选，GUI/CLI/Agent统一使用同一端口，不通过Redux/React事件持久化D02。

**回执规范提案**：`{requestId,scopeEpoch,targetRef,expectedRevision,committedRevision?,committedHash?,status:COMMITTED|REJECTED|CONFLICT|CANCELLED_BEFORE_COMMIT|UNKNOWN_AFTER_TIMEOUT,diagnostics[],eventCursor?}`。`UNKNOWN_AFTER_TIMEOUT`不等于FAILED，须查询原requestId。`scopeEpoch`用于阻断旧视图回执误绑定，而不是服务器凭其判定实际提交无效。

## 4. 五页面交互与取消/并发完整协议

五页共用左侧统一任务容器，详见[UI](UI.md)：①范围及来源→②创建/编辑特征→③几何/PMI审查→④确认与版本差异→⑤历史/冲突/恢复。唯一Babylon主世界和RendererPort仅做显示投影；提交键处于左侧表单，审查必须显示geometryHash与当前业务revision。3D空间不可与资源空间并排；浅/深两种主题遵循统一token。

草案取消只撤销本地未提交操作；Worker取消受异步语义限制（已执行但迟到仍可留只读Run证据）；确认已提交后出现取消必须告知`COMMITTED`并提供撤销提案（创建新修订）。同一`requestId`相同payload重复提交应返回同一receipt；相同key不同payload明确冲突。CAS失败不得自动刷新覆盖别人修改；提交后Project切换，迟到receipt可记录到原Project历史，但不得刷新当前页面数据。恢复需要从Host保存的`scopeRef + requestId + receipt`查询；只有本地浏览器状态不能构成持久化成功证据。

## 5. 源码只读观察、真实复用与不可宣称项

- `procet-gui@4e8eec12`的`apps/desktop/src/modules/cam/components/CamViewportFeatureTree.tsx`确有展示树、选中回调，**文件注释明确“Presentation only，selection不改变feature acceptance/plan revisions”**，可复用分组/选择展示，但不代表领域审批已接线；当前`viewportMarkers.ts`包含演示Marker及`faceIndices`显示字段，绝不能充当跨版身份或真实制造规格。
- `procet-solver@44172bc0`上轮已只读核对算法识别Run/候选与诊断；算法候选输出不是正式D02写入及审批证据。代码版本仅为当时观察基线，下一实施轮须再核HEAD/测试；不凭旧工作台研究笔记声称现有手动特征管理器运行在新GUI。
- `CAP03-03`稳定拓扑、`F1-01`C0精确引用、`F1-05`Solver受管接口、Host/Project/快照、ModuleRegistry/ContributionHub/RendererPort均为待接线复用对象，不新建第二套3D世界/巨型common或CAM状态真值。OCCT公开OCAF与History API不能当成生产锁定7.9.3的ABI兼容测试通过。
- **缺口**：03域持久D02决策端口、Host提交权限二次校验、人工草案持久状态、拓扑歧义处置、两人并发CAS、失效传播回执、老面号升级Reader与安全回退。全部标记为“待实现/待评审”，不能把本规划写成已完成的产品能力。

## 6. 10项规则与20组正反验收

| 规则 | 设计断言 | 正例/反例 |
|---|---|---|
| FEDIT-R01 | exact工程/实例/修订/Frame范围 | T01/T02 |
| FEDIT-R02 | 无Solver也可有证据地人工草拟；mesh仅意图 | T03/T04 |
| FEDIT-R03 | 3D选择与暂存预览不写D02 | T05/T06 |
| FEDIT-R04 | 用户参数与几何测量分离，unsupported显式 | T07/T08 |
| FEDIT-R05 | 分裂/合并保留多对多谱系/歧义 | T09/T10 |
| FEDIT-R06 | PMI精确引用与冲突不可静默覆写 | T11/T12 |
| FEDIT-R07 | confirmed、approved、D08/D16严格分离 | T13/T14 |
| FEDIT-R08 | 提交点验权/哈希/CAS/幂等 | T15/T16 |
| FEDIT-R09 | 取消/晚回执/断线恢复/切Project不误绑定 | T17/T18 |
| FEDIT-R10 | 变更重审、冻结保护、兼容Reader与回退 | T19/T20 |

20个场景的实际输入、expected、negative rule和`NOT_RUN_PRODUCT`记录见[fixtures.json](fixtures.json)。**均为测试规格，不是产品已通过**；真实OCCT、Rust、GUI、数据库与NC测试需锁定合法模型、内核Profile、完整上下游后建立并运行。校验器只检查规划契约和链接，不宣称业务算法、审批或实时协作已正确实现。

## 7. 数据迁移、技术分期、回退与准入退出

阶段A：只读复用旧feature与marker显示，恢复其exact D01几何来源；旧面号只能在原revision内辅助定位，无法恢复者标`legacy_unresolved`。阶段B：建立03域FeatureDraft/Decision契约及不触及冻结成果的FeatureService适配，Host受管用例。阶段C：完成跨实例拓扑重绑定、CAS/幂等、PMI绑定、失效传播；独立测试读写、恢复。阶段D：迁移旧数据时保留旧快照与映射表，按业务Owner批准的规则批量迁移，歧义逐项人工裁决；不重写原D08/NC证据。回退时停用新适配器，旧数据只读，受控切回上一个已验证Handler；不丢失新修订的追加式历史。

**规划准入**：原V0.8范围、03域Owner、D01/D02精确引用、用户角色、来源/算法归档可读，避免跨域审批职责混淆。**规划退出（本轮可检）**：规格/五页GUI/字段/命令事件/来源追踪/20正反场景完整；技术路线与缺口明示。**实施准入（尚未满足）**：批准L3、真实FeatureService Owner及Host权限模型、固定OCCT Profile和合法测试模型、旧数据转换方案、真实测试入口。**产品退出（尚未执行）**：人工补录/修订/分裂/合并/PMI/多实例/并发/取消/断网/历史变更全部在真实产品验证，冻结D08/NC不静默变化。