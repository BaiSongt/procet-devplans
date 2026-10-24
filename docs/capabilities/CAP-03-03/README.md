# CAP-03-03｜稳定拓扑引用：精确定位、演化证据与跨修订重绑定

> **v0.1｜2026-10-18｜本地已编制、待人类评审、待远端入库。** 原V0.8编号 `CAP-03-03`；不增加88项CAP分母。原工作包 `B0-02 / F1-03 / F1-04 / T5-02`。本说明、[GUI/3D详细规格](UI.md)、[R-TOP-001研究](../../../research/topics/R-TOP-001.md)、[来源→规则→验收追踪](../../../research/traces/CAP-03-03.json)、[20组正反fixture](fixtures.json)共同构成单项编制交付。产品实现、审批、测试**均未在本任务执行**。已存在的CAP-03-01是远端规划资料；CAP-03-02「零件/装配及版本」当前仅本地待入库，相关跨项连接在GitHub入库时再同步。

## 1. 为什么需要这一能力：用户、授权与业务目标

**设计工程师**维护由确切源文件产生的面/边/体与局部修订，**PMI工程师**把尺寸/基准锚在受控实体，**工艺工程师**把特征候选与加工范围绑定到精确拓扑，**评审人员**确认重导入后的对应是否可信，**Host/Project**保持历史版本与回执。唯一拓扑身份与跨版映射事实由**03域CAD设计语义Owner**发布；CAM/Setup/Solver/PMI可提交候选或反馈，但不能写回CAD映射权威表；渲染层只有投影权。

**核心定义**：稳定引用在本产品中不是“任意STEP修改后相同面永久不变”，而是两层分开的承诺：
1. `ExactTopologyRef` 在同一已冻结 `D01 DesignRevision + occurrence + topologySnapshot + frame` 下**可校验地定位**；
2. `TopologyEvolutionMap` 在两个明确修订之间**可证明或可人工签认地提供跨版对应**。算法找不到证据时报告 `unknown / ambiguous / deleted`，不能按原序号或指纹自动延续批准状态。

本CAP内分7个业务切片（**不是7个新增CAP**）：TP-01精确拓扑选择、TP-02源与派生证据、TP-03变化历史接收、TP-04跨版候选生成、TP-05歧义人工裁决、TP-06下游失效与回放、TP-07兼容迁移与恢复。数学容差和接口字段是**待评审L3提案**，L4不冻结。

## 2. 完整业务路径

### 2.1 主流程——从选面到再次导入

1. 工程空间→CAD对象→「拓扑引用」读取已提交D01源、D01装配修订与有效`TopologySnapshotRef`。确认Source/Reader版本、exact `designRevision`、`instanceOccurrence`、B-Rep与mesh的同源关系，不默认latest。纯CAD查看不要求机床Execution Binding。
2. 在一个Babylon交互世界里拾取面、边、顶点或Solid：先取得`PickResult.sceneRevision`及`GeometryRef`，通过Owner的拓扑索引查询确认其B-Rep同源实体；本地mesh三角面序号只是拾取中间键。无可查的exact映射仅允许高亮「仅显示」，禁止成为可提交制造事实。
3. 形成`ExactTopologyRef`：`modelRef`、`sourceArtifactHash`、`topologySnapshotId/hash`、`occurrenceRef/path`、`kind`、`snapshotLocalId`、`orientation`、`frameRef`以及求解所用`kernelVersion/algorithmVersion`，保留源几何而非用float指纹当唯一ID。纯零件的`occurrenceRef`可显式`none`，重复实例不可省略。
4. 提交明确业务意图（PMI锚定候选、制造特征候选、加工范围候选等）时由CAD Owner在`expectedRevision`及权限/来源闭包门下签发解析回执；这些候选不能取代PMI/D02等消费域自己的审批门。3D选中与预览不写任何事实。
5. CAD文件、导入参数、局部修复或拓扑算法发生变化时，产生新D01派生修订。读取算法提供的`Generated/Modified/IsDeleted`或OCAF `TNaming_*`历史**仅在历史真实可获得时**生成有证据关系；外部重导入若无过程历史，使用几何/邻接指纹只能给`proposed`候选。
6. 变化映射按`unchanged/modified/split/merged/generated/deleted/new/ambiguous/unmatched`显示**集合映射**；不能强制每个旧面对应单个新面。对于孔壁被分割成两个面、相邻共面合并、实体被删除，CAD Owner输出有向证据边与完整source/target候选集合。
7. **人工审查**歧义时可以签认特定旧↔新引用、用途/范围/理由及证据，仅对该有界变更关系生效；不能改写旧revision或直接自动通过旧Plan。审批冻结的PMI/D02/D04/D05/D08/D16由各自Owner重验，消费者根据用途决定`stale/review_required/unaffected`。
8. Host提交新revision及映射工件，独立返回`commitReceipt`；下游继续按旧exact refs回放或明确启动重验，版本切换不清除历史。超时先查询原requestId回执再决定重试。

### 2.2 替代与异常路径（不能假成功）

| 条件 | 合理行为 | 不可发生的行为 |
|---|---|---|
| mesh重采样但B-Rep/source revision完全一致 | 只更换Renderer mesh派生，旧`ExactTopologyRef`在同一BRep快照可继续解析 | 根据新的三角面索引建立新的正式面ID |
| 仅装配实例位姿变化，definition BRep不变 | 变更occurrence/frame版本并重算世界投影，区分定义本体不变 | 把世界坐标近似相同的另一个实例当同一目标 |
| 导入任意第三方STEP新版本，无可回放建模历史 | 指纹/拓扑邻接匹配只产生待审核候选 | 假造OCAF/TNaming演化链或自动继承PMI/批准特征 |
| 面split/merge、面数改变、退化删除 | 多边映射与`ambiguous/deleted`显式输出、阻断需要唯一面的消费者 | 强制把第N号旧面绑定到第N号新面 |
| 指纹碰撞、对称面、几何相似 | 展示全部候选与不确定性，人工分歧保留 | 取最高分即认定产品可加工 |
| 拓扑修补、容差变化、内核升级 | 新派生版本、来源/算法/容差证据，重新检查history适用域 | 在原快照原地更新BRep并继续用原hash |
| `IsSame`/`IsEqual`/`IsPartner`返回true | 仅据同一进程/数据结构中的TShape/Location/Orientation语义使用 | 宣称跨独立文件相同工程实体永久相同 |
| 源/派生工件丢失、未知单位、失效sceneRevision | 可查看旧快照或显示unknown，拒绝新版资格写入 | 用默认mm/最近一次显示mesh或旧UI回执修补依据 |
| 取消/权限改变/切Project/迟到响应 | 废弃预览租约；提交已发生则按requestId查询并只绑定原工程 | A工程异步回执改变B工程当前选面/批准状态 |

## 3. D01数据权威、exact schema候选及不变量

**Owner**：03 CAD输入/拓扑语义子域；Host/Project管理CAS与事务，C0只提供公共引用、hash、schema、frame、scope，不能另建巨型`common.Topology`事实。D02制造特征、D04 Setup、D05 Plan、D06 Solver、D08冻结、D09 CL、D12 NC、D16发布均为不同域消费者。装配Occurrence沿用CAP-03-02提案，尚未批准不得当成既有产品结构。

| 对象/字段（待评审） | 来源/类型/单位/读写 | 必须满足的判断 |
|---|---|---|
| `ExactTopologyRef.designRef` | D01 `domain/kind/id/revision`，只读不可latest | 必须同一已提交设计文档修订 |
| `ExactTopologyRef.definitionRef/occurrenceRef` | CAP-03-02定义与出现引用；可显式无Occurrence的纯零件 | 同定义多实例不能被相同面指纹合并 |
| `sourceArtifactHash / sourceOptionsHash` | 源字节SHA256及导入设置hash；只读 | 不能用文件名、临时绝对路径代替 |
| `topologySnapshotId/snapshotHash` | CAD Owner发布的exact内容/修订；只读 | 快照与几何来源、解析schema必须对账；显示meshHash不是拓扑身份 |
| `topologyKind/snapshotLocalId` | face/edge/vertex/solid与快照局部有界索引 | localIndex**仅在固定snapshot上下文中**有效，不能跨修订承诺 |
| `orientation/frameRef/units` | 原TopoDS方向及显式局部Frame，内部mm；源与派生证据只读 | `IsPartner/IsSame/IsEqual`区别必须保存；旋转或实例变换不能漏掉 |
| `kernelVersion/readerVersion/algorithmVersion/toleranceProfileRef` | 实际执行版本；容差无通用默认值 | 所有几何候选与比较必须写明版本、来源、适用域；未知则unknown |
| `sourceNamingAnchor/sourceLabelEntry` | 若Reader/OCAF提供，受源文档上下文限定的可选证据 | OCAF标签在文档内有地址意义，不自动成为跨STEP导入唯一ID |
| `GeometryFingerprint` | 曲面/曲线类型、面积mm²/边长mm、法向、质心mm、邻接、包围盒，候选只读 | 数值候选，不替代源实体身份；对称、单位变化可能冲突 |
| `TopologyEvolutionMap.sourceRef/targetRef` | 显式两版D01 refs、historyArtifactHash与来源 | 变更边方向自旧至新，引用均exact且内容摘要可校验 |
| `TopologyEvolutionMap.edges[]` | 每边 `relation/sourceElementRefs[]/targetElementRefs[]/evidenceKind/algorithmVersion` | 允许1→N、N→1、0→1、1→0；多对多需要显式来源判据 |
| `mappingStatus` | `verified_history / manually_confirmed / proposed / ambiguous / unmatched / deleted / unknown` | `verified_history`仅确认**指定操作历史与局部映射**，不意味跨产品同一性或制造批准 |
| `reviewDecision` | reviewer/权限/范围/理由/时间/CAS/expectedRevision；只读签认事实 | 审查签认≠工艺批准，旧D08/D16不得覆盖 |
| `TopologyImpactReport` | 引用消费者、精确源、用途与`stale/needs_review/unaffected/unknown` | 不仅按几何差异传播，还依赖消费者用途和原approval范围 |
| `Query/CommandContext/Receipt` | `projectId/documentInstanceId/requestId/expectedRevision/scopeEpoch` | 提交点重验身份、权限、源闭包、乐观版本；迟到响应不得串工程 |

**数学/图约束**：给定快照`S`，引用可解析要求`r=(revision,occurrence,snapshotHash,kind,localId,frameRef)`各项精确匹配；不存在任何函数`stableId = hash(area,centroid,index)`能一般保证跨建模版本唯一。对有向映射图`E_(v→v+1)`，仅在来源版本有因果链时传播；链式复合跨过split/merge后不能无证据还原单一旧面。几何相似度/邻接签名可形成候选评分但阈值与容差按来源和任务确定，**不预设行业通用默认分数、间隙或容差**。在同一快照中`ResolveExact(r)`应唯一或显式失败；跨快照的`SuggestMap(old,new)`不提供制造审批承诺。

## 4. 同一领域入口（均为拟议命令/查询/事件；不得冒充现有API）

| 命令/查询/事件名（候选） | 输入 → 输出与错误 | Owner/调用纪律 |
|---|---|---|
| `QueryTopologyAtRevision` | exact DesignRef+OccurrenceRef+SnapshotHash → 分页Face/Edge/Solid与source证据；`stale_snapshot`/`unknown_schema` | CAD Owner；GUI/CLI/Agent统一只读调用 |
| `ResolveExactTopologyRef` | ExactTopologyRef → 实体解析`found/ambiguous/unavailable`及验证摘要 | CAD Owner；Renderer仅按成功引用做投影 |
| `ProposeTopologyMapping` | old/new exact refs+algorithmVersion+toleranceRef+budget → 候选映射与歧义统计 | Worker只计算候选，不能写CAD权威或批准PMI |
| `QueryTopologyEvolution` | old/new D01 refs+映射revision → 多边证据、删除/生成/修改/歧义 | 允许分裂/合并集合，不假设单值 |
| `ReviewTopologyMapping` | expectedRevision+原候选+决定+理由+证据+reviewer → CAD签认候选 | CAD Owner按作用域提交重验；人工同意仅对指定映射用途生效 |
| `CommitTopologyEvolution` | requestId+old/new refs+evidenceCAS+权限 → receipt/mapRef/ImpactReport | CAD Owner+Host激活提交点；不可写原D01 revision |
| `QueryTopologyImpact` | approved D02/PMI/D04/D05/D08/D16 exact refs → 影响与阻断原因 | 各消费者自行判定业务继承/资格，不由CAD越权批复 |
| `TopologyEvolutionCommitted` | source/target exact+mapHash+receipt+impactedRefs | 只发送事实事件，不伪造消费者已完成重验 |
| `QueryTopologyCommitReceipt` | requestId+projectId→已提交/未提交/unknown | 失败重试前先查真实状态，禁止重复写入 |

**现有源码复用/差距（2026-10-18只读）**：
- `procet-cam@fcec1c86` 的 `src/cad/geometry_core/ids.rs` 已有`GeometryRef{model_id,kind,local_index,occurrence_path,fingerprint,source_revision}`，注释明确`fingerprint`是**候选、非稳定身份**；并且`src/cad/mod.rs::AnchorTarget3D`保留面/边索引+指纹用于旧PMI锚。不能另造与之冲突的“永久面号”。
- 同版`src/cam/topology/snapshot.rs`已有CamTopologySnapshot、CamTopoFace/CamTopoEdge与`GeometryRef`，`src/ports/geometry.rs`的`CamTopologySnapshotAdapter`按job/model/source hash读取并重算快照hash、拒绝未知schema。应复用现有校验而非再建CAM快照数据库；**该Port仍是CAM兼容Owner，CAD真Owner迁移需F1-03审核**。
- 同版`src/cam/topology/gate.rs`的MVP输入门拒绝装配/多件、多个Solid等；**不能由此推出CAD文件无法阅读或新版全部装配已被支持**，后续拓扑身份服务独立于生产CAM门。
- `procet-gui@develop` 的`packages/renderer-port/src/port.ts`已有`GeometryRef`、`TopologySnapshotRef`、`SceneRef`、`PickResult(sceneRevision)`；`packages/renderer-port/src/cad-input.ts`有D00 exact源与mesh派生。同一Babylon Scene复用，不能让前端自创拓扑映射写入。
- 缺口：尚未核实跨独立STEP文件的可重放形状演化历史、CAD Owner持久化映射/人工签认提交口、端到端消费者变更影响、真实OCCT版本锁及完整正反验收入口。不能因为文档有TNaming术语，就说产品已采用OCAF命名系统。

## 5. 十条规则→字段/引用→验收（产品尚未执行）

| ID | 规则与适用边界 | 权威来源或内部决策 | 绑定字段 | 正反例 |
|---|---|---|---|---|
| TOP-R01 | 精确拓扑引用包含完整Design/Occurrence/Snapshot/Frame作用域，单一快照唯一可解；容差不是身份 | SRC-TOP-005、SRC-TOP-007＋设计决策 | designRef,occurrenceRef,snapshotHash,snapshotLocalId | T01/T02 |
| TOP-R02 | 局部索引与指纹仅候选，不可跨文件作为唯一永久面号 | SRC-TOP-007、SRC-TOP-005＋现有源码观察 | localIndex,fingerprint,sourceRevision | T03/T04 |
| TOP-R03 | 有真实历史时可记录PRIMITIVE/GENERATED/MODIFY/DELETE/SELECTED；标签/名字来源须限定文档上下文 | SRC-TOP-001、SRC-TOP-002 | historyKind,sourceLabelEntry | T05/T06 |
| TOP-R04 | selector Solve在命名结构不足/不一致时应失败，不能因成功调用就宣布跨外部文件可靠重绑 | SRC-TOP-003 | selectorEvidence,resolutionStatus | T07/T08 |
| TOP-R05 | `BRepTools_History`支持生成、修改、删除及历史合并；split/merge映射是集合，不强制1:1 | SRC-TOP-004、SRC-TOP-006 | mapping.edges,historyArtifact | T09/T10 |
| TOP-R06 | 指纹/面积/邻接/曲面类型匹配仅给candidate，歧义/对称面须人工处理，无统一生产容差默认 | SRC-TOP-005、SRC-TOP-007＋设计决策 | fingerprint,toleranceProfileRef,status | T11/T12 |
| TOP-R07 | `IsPartner/IsSame/IsEqual`比较的是TShape/Location/Orientation语义，不能作为跨独立STEP模型永久ID | SRC-TOP-005 | shapeIdentityEvidence,frameRef | T13/T14 |
| TOP-R08 | 局部修补/UnifySameDomain改变拓扑须生成新派生并保存历史，旧批准版本不可静默覆盖 | SRC-TOP-006、SRC-TOP-004＋F1-06 | algorithmVersion,sourceHash,targetHash | T15/T16 |
| TOP-R09 | 3D拾取只返回intent/sceneRevision，CAD Owner签发mapping并在提交点重验，跨scope/超时不串版本 | SRC-TOP-001＋内部Host/RendererPort设计 | sceneRevision,scopeEpoch,requestId,receipt | T17/T18 |
| TOP-R10 | 下游D02/PMI/Setup/Plan/发布按确切引用与用途重验；历史资料不明标unknown，不默认迁移批准状态 | SRC-TOP-001＋F1-01/F1-03内部决策 | impactSet,reviewDecision,schemaVersion | T19/T20 |

**规则属性**：TOP-R01/R02/R06/R09/R10的公共引用/权限/审批部分为Procet**内部设计选择**；OCCT资料仅支持其明示API行为，不构成“标准规定Procet采用此DTO”。源码只读发现不是已通过测试。研究深度、具体版本与限制见R-TOP-001和JSON来源注册。

## 6. 正反验收与独立反例

下表每条为**待产品实现的验收对**；机器fixture为显式输入与期望typed判定，不是伪造实际运行记录。统一要求在冻结的源码组合SHA、OCCT实际库版本、D01 schema、source及派生CAS hash、帧/单位、requestId下执行。不存在的测试命令保持`TODO_TEST_ENTRY: CAP-03-03-unit / CAP-03-03-native-OCCT / CAP-03-03-3d / CAP-03-03-consumer`。

| ID | 正向期望 | 独立反例/禁止 |
|---|---|---|
| T01 | 同snapshot对face exact引用可唯一返回且复核hash | 缺snapshotHash却返回同序号其他面 |
| T02 | 同Definition的两个Occurrence各自选中正确实例 | 仅按geometryFingerprint选中另一个重复实例 |
| T03 | mesh只重采样，BRep/Topology不变时原引用不变 | triangulation index变化导致永久faceRef改写 |
| T04 | 同面顺序扰动后需旧snapshot内唯一解析或明确stale | 把旧localIndex移到新snapshot直接接受 |
| T05 | OCAF源内修改保留真实OLD/NEW演化证据 | 任意两个导入STEP被伪造TNaming_MODIFY对应 |
| T06 | 被删除的旧面明确deleted，并阻断其PMI锚 | 自动从相邻同面积面补一个有效锚 |
| T07 | 有效selector源模型变更后有证据重选 | 错误context/naming返回false却仍批准重绑 |
| T08 | 无OCAF命名上下文的历史STEP允许候选但不宣称selector验证 | 缺Naming结构仍报告`verified_history` |
| T09 | 1→2 split保留两目标及旧源关系，单面消费者进待审 | 强制只取任意一个split面并保留批准状态 |
| T10 | 2→1 merge追踪两个源，不误认为新面保留两独立批准锚 | 将原两个PMI锚同时默许到单一新面 |
| T11 | 两对称等面积等法向候选保持ambiguous | 最高分/first index被自动当唯一制造面 |
| T12 | 公差配置缺来源仅输出unknown，拒绝生产升级 | 写死0.01mm阈值给全产品重绑认证 |
| T13 | IsPartner相同TShape但不同Location明确区分实例语义 | IsPartner true就跨位置确认同一Occurrence |
| T14 | 相同TShape位置但方向相反IsSame/IsEqual判据分别记录 | 把IsSame等同IsEqual而丢失方向 |
| T15 | UnifySameDomain后新派生带来源/算法/历史与新hash | 修补后原BRep快照hash不变却几何改变 |
| T16 | 内核升级/容差设置改变派生资格进入对拍或待审 | 旧批准快照在不同算法版本自动视为同资格 |
| T17 | `PickResult`从exact scene引用出发，纯预览不写业务 | mesh三角片命中直接插入正式Accepted Feature |
| T18 | 切Project/取消/迟到回执不更新别的工程，已提交先查回执 | A工程超时重试在B工程重复写且覆盖选择 |
| T19 | 修订变更后PMI/特征/Setup/Plan按用途报告stale/unaffected/unknown | 自动把D08/D16冻结引用改成latest |
| T20 | 旧无指纹、仅localIndex锚可以只读恢复并显示需重绑 | 旧annotation被静默升级为跨修订verified而未审查 |

## 7. 工作包挂接、进入条件、评审、实施切口、迁移和回退

| 工作包/切口 | 拟议实务子项与交付物 | 主责/生产方—消费方评审 |
|---|---|---|
| B0-02 / I1 | 冻结`ExactTopologyRef`内涵、CAD独占Owner、合成双实例/重排/split/merge/删除/对称场景、发布适用/不适用定义 | CAD Owner+平台架构；CAM/PMI/Solver/GUI审查 |
| F1-03 / I2 | 盘点`GeometryRef`和`TopologySnapshotRef`消费者，保留既有CAM Adapter，画出真实读取/变更写权限图 | CAD/CAM与平台集成；RendererPort消费审查 |
| F1-04 / I3 | 探索/候选重绑定与工艺Setup批准分离；无机床绑定CAD可浏览，制造许可重验 | CAD/Setup/工艺；Solver/NC验证审查 |
| T5-02 / I4 | 只读检验旧PMI锚、ExactTopologyRef、legacy reader和schema跨版兼容 | CAD/PMI/质量；Host/CLI/Agent审查 |
| T5-02 / I5 | 原生OCCT演化边重放、无history外部STEP、分裂合并/被删/空壳/容差边界正反对拍 | CAD/几何内核；独立验证人审查 |
| T5-02 / I6 | 单Babylon下pick/source映射和待审UI；切工程/取消/迟到响应场景 | GUI/Renderer；CAD Owner验收映射来源 |
| F1-06 / I7 | 源/派生/映射CAS闭包、版本回放、断网恢复/丢件 fail-closed 与幂等提交回执 | Host/Project；CAM/PMI/发布审查 |

**准入**：CAP-03-01实际输入合同与版本可重放；CAP-03-02 Occurrence语义由Owner评审；F1-01公共exact引用与F1-02 Frame用例确定；锁定实际OCCT/CAD Reader版本和容差来源；提供许可可公开fixture。**退出**：20项产品正反对拍（含原生history及外部STEP无history反例）在exact代码和内核版本真实运行且留日志；GUI/CLI/Agent行为一致；CAD+PMI+CAM+Host消费者评审与回退演练记录齐全。**本规划不声称这些已发生。**

**迁移**：旧`GeometryRef`、`AnchorTarget3D{index,fingerprint}`按原schema只读；缺revision、occurrence或snapshotHash时标`legacy_unresolved`/`review_required`，可提供人工重绑候选但不得静默指向最新。新增映射建议追加版本化旁路适配，先灰度读取，按有界消费者逐个迁移。**回退**：关闭新重绑提交命令，保留旧读适配、精确旧CAS版本和已经产生的审计工件，不逆向覆盖批准记录。删旧字段须独立完成消费者退出证明。

**未决风险（必须显式保留）**：第三方STEP常缺建模演化历史；跨内核版本形状指纹的数值可比性未验证；OCAF/TNaming在产品Native链的实际可用性/锁版本未确认；单面消费者面对split/merge的业务重审批规则仍需PMI/CAM共同签发；源码`ModelIdentity`旧实现`model_id=file_hash`与D01逻辑身份的演进必须受控适配而不能宣称其已解决跨版同一性。