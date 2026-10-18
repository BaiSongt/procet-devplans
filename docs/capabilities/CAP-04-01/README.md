# CAP-04-01｜工艺 Setup 与工件基准：从设计目标到受控加工现场

**业务规格草案 V0.1｜2026-10-19｜原 V0.8 的 88 项之一，非新增 CAP。状态：已编制、本地待入库、L3 待评审、产品 NOT_RUN。**

关联原工作包：**F1-02 / F1-04 / W2-05 / E3-04 / U4-02**；架构原文：[04 域三级映射](../../../docs/architecture/v0.8/03_三级能力映射_88项.md)（该文件为远端基线引用，本地差分未复制）；相邻：[CAP-02-04装夹资源](../CAP-02-04/README.md)、[CAP-03-01设计输入](../CAP-03-01/README.md)（后者两个路径均为待与远端仓合并时解析的引用），本包另有[详细UI](UI.md)、[研究](../../../research/topics/R-SETUP-001.md)、[追踪](../../../research/traces/CAP-04-01.json)、[20条正反场景](fixtures.json)、[合成Frame数学样例](math-examples.json)。

> 重要：上述跨包链接相对 **仓库最终根目录** 而非当前 `pending-cap-04-01/` 局部根。最终入库需检查远端所有链接；此处仅静态验证本包可解析的链接，不将未挂载的原V0.8文件标为不存在。正式设计/实现/Windows 与实机测试未执行，不得声称符合 ISO 或 NC 控制器语义。

## 1. 角色与业务边界

**工艺工程师**创建/编辑单个工艺 Setup；**设计/PMI 工程师**提供 D01 的源几何、设计基准及工程修订；**装夹工程师**审核可能采用的夹具/装夹定位意图；**工程管理/审批人**批准受控加工现场；**CAM/几何求解器**消费 D04 的 exact 快照；**机床工程师**另行建立 D10 MachineExecutionBinding；**质量人员**按同一来源审查坐标与证据；GUI/CLI/Agent 只使用同一领域命令，不持有第二套 Setup 真值。

**D04 ProcessSetup 的唯一写入 Owner 为 04 域（装夹与坐标系）**，Project/Host 提供存储与条件提交，不改写业务规则。D01 设计目标属于 03 域，D03 资源能力属于 02 域；D10 具体机床、控制器、G54 实际数值、TCP 与安装链虽关联 D04，**却不是 CAP-04-01 创建时的副产品**。D05 为工艺决策，D06 为求解结果，D08 为工艺冻结决议，均不得由 Setup 画面代写。工艺 Setup 可以处于可供设计探索的草稿状态：没有机床不意味着禁止 CAD/特征审查；但缺毛坯或其合法来源时不得宣称材料状态求解可以启动。

**八项内部业务子能力（不增加88分母）：** S01 选择工程与加工目标；S02 单 Setup 身份/修订/编辑会话；S03 设计基准证据与 WCS 意图；S04 工件与毛坯不同源坐标定义；S05 不累积的姿态预览/自动落座对中；S06 Setup 校验/冲突与受控提交；S07 上下游引用、失效传播和多 Setup 可寻址；S08 离线恢复、迁移、原位撤销与审查。

### 主流程

1. 从 Project/DocumentManager 中选择**确切 CAD 文档实例与 D01 revision/hash**，可直接从已有 Setup 列表切换；切换 Setup 不得强制重新执行特征识别或覆盖另一个 Setup 的工艺状态。
2. 选择“新建 Setup”仅分配带 scope 的草稿身份，不自动估算毛坯、不展开包围盒、不采用机床或控制器。源 CAD 的单位、实例路径、设计几何、PMI 基准资格在卡片中可核。
3. 用户指定 Part/Model Frame、Setup Frame 与 WCS 设计意图。设计 datum 可被**引用作选点依据**，不能把 ISO 5459 的 datum system 直接等同为机床 G54，也不推导真实测量误差。
4. 显式“选择毛坯/生成候选毛坯”操作方可从**当前 Setup 局部 Frame 下的目标几何**计算包围尺寸；用户检查包围差异，点击“采用”才写本地草稿，不能在导入或新建时自动扩展毛坯。
5. 3D 鼠标拾取定位元素→只读预览姿态与对齐证据→在左面板显示输入/派生数值、变化列表及单位→用户确认草稿 patch；3D 拖动、资源视图切换、取消均不得提交 D04。
6. “居中、落座、基准对齐”算法每次从**锁定的源帧+目标约束快照**计算绝对候选位姿，不对当前显示位姿累积平移；用户再次重复同动作必须幂等。
7. 通过 Host 域服务执行检查（finite、正交、单位、非镜像非缩放、拓扑引用、权限、exact 前置和依赖状况）；生成 `ReviewSetupChanges` 展示旧/新 Frame、毛坯范围、受影响下游对象；批准/保存独立，批准前必须以服务端重新取得问题清单与审批指纹。
8. 通过 `CommitProcessSetup` 候选领域命令，经 Host `requestId + expectedRevision + scope` 条件提交，返回真实修订/Hash/事件；若用户仅预览则**无新增 revision**。成功后异步通知 D05/D06/D09 下游重算或标 stale，绝不在后台静默修改已冻结 D08/D16。

### 替代与异常流程

- **无机床**：可以创建 D04 草稿、研究 CAD/Feature 与纯几何工作坐标；需具体机床安装或 NC 执行时单独进入 D10 阻断/待补，不偷偷绑定 B5。
- **多 Setup**：切换仅更改当前 `projectId/documentInstanceId/setupId`，各自保留草稿和快照；同一 D01 可被多 Setup exact 引用，特征/工艺消费者按 Setup 查询，不再要求回到制造特征分析重触发。
- **缺失源单位、错误 Frame 或局部包围不明**：显示 unknown / field-level issue，允许可逆查看，不允许制造级确认。
- **源 PMI datum 冲突或 CAD 修订变化**：冻结旧 Setup 引用保持可读，创建迁移建议/待再验证副本，用户决定新修订，禁止默默重指向最新模型。
- **夹具引用退役/资源无实体几何**：资源可以只显示行程线框并明确碰撞模型缺失；不能假定机器运动学或制造安全检查通过。
- **cancel、断线、UI关闭、Worker超时、迟到回执**：未实际提交的 staging 可丢弃；提交已经完成则必须按 requestId 查询回执，不得以“取消”掩盖真实成功；晚回执只更新原 Setup/scope。

## 2. 领域数据真值与 Frame 契约（L3待评审）

设 `T^A_B` 将在 B frame 表达的列向量坐标映射成 A frame 的坐标，变换序列必须明确乘法顺序：`p_S = T^S_P · p_P`、`p_W = (T^S_W)^(-1) · T^S_P · p_P`。`S` 为 Setup Frame，`P` 为 CAD Part Frame，`W` 为 Setup 内计划 WCS Frame；毛坯 `B`、夹具 `F` 均可独立相对于 S 定义。Part、Stock、Fixture、WCS 的 origin/axis 不因外观相似而复用字段。**Frame 转换是坐标变换，不是几何缩放、更不是直接改变设计 CAD 真值**。长轴单位规范化与坐标数值变换为两个显式阶段。

实施要求：所有单位明确 mm/deg（内部角度计算可 rad，但接口须注明）；构造 `T^S_P` 前先验证变换方向、右手性、正交/单位化、有限浮点、允许范围和来源快照。`|det(R)-1|≤ε_R`、`‖RᵀR-I‖≤ε_R`、`‖T^S_P(T^P_S)-I‖≤ε_T` 是**建议验证公式**，`ε_R/ε_T` 必须由 F1-02 的数值策略按对象、单位与内核版本配置并审查，不能把随手选择的 `1e-6` 声称行业强制。仿射镜像、缩放、退化、NaN/Inf 不得进入批准的 D04 刚体 Frame；显示转换单独使用 RendererPort 映射，不反写坐标真值。模型局部包围计算必须先将每个顶点/可信形状范围按**同一确定的变换路径**表示到目标 frame 后再计算 extrema，不能仅交换轴尺寸或直接使用原局部 bbox。

| 资产/字段建议（C1尚未冻结） | 必需 / 提供方 | 责任与核验 |
|---|---|---|
| `setupRef {projectId, documentInstanceId, setupId, revision, contentHash, schemaVersion}` | 必需；Host + D04 Owner | 单 Setup 精确身份、版本、恢复，不以展示名称定位 |
| `targetCadRef {D01 id, revision, sourceHash, occurrencePath, topologySnapshotRef}` | 必需；03域D01 | 装配实例/几何版本/源Hash缺一不得推定正确制造目标 |
| `partFrameRef`、`T^S_P`、`frameConvention` | 必需；04域按 F1-02 | 坐标方向+轴向+手系+数学策略版本；不可从Babylon坐标伪推 |
| `stockRef`、`stockFrameRef`、`T^S_B`、`stockDefinitionStatus` | 材料求解前必需；02域资源定义 + 04域采用 | 草稿可为 `unconfigured`，绝不默认自动扩毛坯；stock定义本身由02管理 |
| `designDatumRefs[]`、`datumInterpretationStatus` | 可选/未知；03域PMI | 不将设计基准系统、实际装夹定位基准、WCS与机床原点偷换 |
| `wcsIntentFrameRef`、`T^S_W`、`offsetPreference` | WCS规划阶段条件必需；04域 | WCS是相对Setup的设计意图，`G54`仅偏好标签；实际控制器参数属于D10/D13 |
| `workholdingPlanRefs[]`、`placementRefs[]` | 按所选 coordinate/native/legacy 模式；02定义、04采用 | 原有模式编排应复用，unknown模式只读，改模式不隐式删除实例 |
| `targetBoundsFrameRef`、`bboxEvidence`、`calculationAlgorithmVersion` | 当用户点显式计算时必需；CAD几何 + 04域 | 标明几何源、坐标、误差策略、计算与预览的revision；只用于候选 |
| `authoringMode`、`reviewStatus`、`approvalFingerprint` | 由现有 CAM service/04域产出 | 草稿状态不等于经过制造审批，服务端重算批准门 |
| `expectedRevision`、`requestId`、`idempotencyScope`、`scopeEpoch` | 写命令必需；Host与Owner | CAS、权限重验、响应去重、上下文安全、真实提交回执 |
| `dependencyRevisionRefs`、`impactSummary`、`migrationPlanRef` | 变更后必需；Host/消费方 | 下游stale与局部更新，冻结历史不可静默覆盖 |

### 领域端口与跨域生产/消费关系

拟议命令（**不是已存在产品API**）：`BeginSetupDraft`、`ProposeSetupFrame`、`ProposeStockBounds`、`PreviewSetupAlignment`、`ValidateSetupDraft`、`CommitProcessSetup`、`RequestSetupApproval`、`ForkProcessSetupRevision`、`CancelSetupRequest`。查询：`GetProcessSetupAtRevision`、`ListSetupsByDocument`、`GetSetupConsumersAndImpact`、`GetSetupRequestReceipt`。事件：`ProcessSetupCommitted`、`ProcessSetupApprovalChanged`、`ProcessSetupStale`。稳定回执必须含 `requestId, scope, acceptedRevision, committedHash, decision, issues[], recoveryAction`，并区分 `accepted`、`job_started`、`committed`、`approved`。CLI/Agent/GUI使用同一类受管Command/Query，不靠前端调隐藏的IPC写库；工具调用确认**不等于**生产审批。

数据流：D01/03作**输入生产者**→04域唯一 Owner 持久提交 D04→05域D05、06域D06/D07、07域D09为消费者。04域的D10 ExecutionBinding另作为04域独立受管对象，以04域D04和02域D03 exact修订为前置，不得通过新建D04隐式创建。08/09/10域只在 CL→NC→控制器解释→轴运动→验证→发布链路消费D10/D13..D16。03域不因Setup编辑变更CAD或D02实体身份；D05的人工计划/冻结不能被Setup算法改写。

## 3. GUI/3D与真实源码复用

完整字段与五任务页面见 [UI.md](UI.md)。唯一定义：**左UnifiedTaskPanel单容器；唯一 Babylon 主交互世界可主模型/资源空间横向切换**。选择/预览/确认分别显示；3D只负责拾取/高亮/Frame glyph/辅助拖拽，可显示 Unknown；不得由渲染状态决定 `Approved`、拓扑身份或G54实际机床坐标。Resource 3D只作查看/选择，同一窗口中不可并排放第二套3D主世界。

**固定版本只读源码（不等于产品PASS）：**

| 来源 | 可复用已观察机制 | 不能据此宣称的结论及缺口 |
|---|---|---|
| `procet-gui@4e8eec12.../apps/desktop/src/modules/cam/setup/useSetupWorkflow.ts` | `useSetupWorkflow`将coordinate/native/legacy组织在同一控制器；`cam_setup_approval_preview`服务端批准预览；切换mode会询问placements删除；scope/epoch防迟到 | 不等于所有业务入口共用真正的D04 Owner或所有消费者已做到多Setup独立引用 |
| 同版 `.../cam/setupDraftSession.ts` | 单个活动草稿+per-scope暂存；draft patch非落库，Apply走服务端expectedRevision CAS | scope仅Project/document时不能由此断言Setup跨同文档独立; 仍须核对真正setupId隔离及恢复回归 |
| 同版 `.../cam/setupService.ts` | `cam_setup_create_draft`、`cam_setup_update`、preflight/approve typed命令及revision conflict | 旧cam job耦合是否解除需真实端到端测；不能把前端禁用当授权校验 |
| 同版 `.../cam/setup/setupModes.ts` | authored coordinate/native/legacy；不识别历史mode明确unknown只读 | 仅旧数据推导的mode不应被静默持久化；别与A/B探索/生产混为一谈 |
| 同版 `.../cam/setup/coordinateParameters.ts` | `stockTopFrame`和局部frame点转换、出具候选框逻辑 | 不能据单一算法证明所有旋转、多Solid、英寸源和非法Frame均正确；必须按新验收验证 |
| 同版 `.../cam/setup/setupNavigation.ts` | 从DocumentManager选CAD实例，开左`cam.setup`容器 | UI层导航不等于D04跨Setup查询能力及持久准确性 |

`procet-cam@fcec1c86...`的Setup后端原生代码本轮未完整定位/审计，不伪造Rust内部存储契约。产品当前实际包版本/构建profile及F1-02的浮点容差必须额外锁定。OCCT在线当前页显示8.0.1而非产品Native7.9.3，不把API文档页写成当前产线经验证的二进制。

## 4. 十条候选设计规则和证据范围

| 规则 | 要求 | 证据性质 | 成对验收 |
|---|---|---|---|
| SET-R01 | CAD来源、设计datum、Setup基准、WCS意图、机床/控制器实际偏置必须分层，不自动绑定机床 | ISO841与ISO5459目录+内部D04/D10定义 | T01/02 |
| SET-R02 | 从实际Frame/单位链构成右手刚体变换，禁止隐式镜像缩放、不以视图修正算法 | OCCT gp_Trsf/gp_Ax3公开API+F1-02策略 | T03/04 |
| SET-R03 | 毛坯尺寸只在显式动作计算/采用；变换后按目标局部坐标重算bbox | OCCT Location变换+内部非自动政策 | T05/06 |
| SET-R04 | 自动居中/落座必须由同一输入绝对求解，重复不累积平移 | 数学幂等/内部业务共识 | T07/08 |
| SET-R05 | 基准/选面与装配实例/topology exact绑定，PMI datum只是设计证据 | ISO5459目录+03域D01规范 | T09/10 |
| SET-R06 | 取消/并发/迟到回复需原scope隔离与服务端CAS/幂等真回执 | 已核SetupService/Host约束+内部设计 | T11/12 |
| SET-R07 | 多Setup必须直接按identity寻址特征/Plan，不强制重分析或重写别的Setup | W2-05原工作包+内部要求 | T13/14 |
| SET-R08 | D04 Setup不等于D10机床ExecutionBinding，计划WCS不等于LinuxCNC或其它控制器真实G54数据 | LinuxCNC手册+内部D04/D10分离 | T15/16 |
| SET-R09 | exact引用变更必须仅标依赖消费者stale/需重新计算，保留D08/D16批准版本 | 已核Host快照+内部受控冻结 | T17/18 |
| SET-R10 | 离线恢复依赖内容闭包与旧schema受控读取，拒绝缺源假恢复/异常mode写入 | OCCT TopLoc+现有SetupModes+内部设计 | T19/20 |

这些规则的机器登记、字段和来源 ID 见 [追踪文件](../../../research/traces/CAP-04-01.json)；20条独立正反验收见 [fixtures](fixtures.json)。标准只读公开目录/概要，**不是 ISO 条文认证**；非ISO条目为明确设计方案，不冒称行业强制规范。

## 5. 工作包实施切口、准入、退出与回退

建议十个实施切口：S-I01 D01/D04/D10消费方与唯一Owner复核（B0-02）；S-I02 F1-02坐标方向与右手系/单位数学合约；S-I03 保留现有SetupDraftSession并补多Setup键/Scope正确性；S-I04 显式毛坯候选及局部包围计算，禁止自动扩尺寸；S-I05 3D选择/预览/确认单世界接线；S-I06 Host CAS/权限/幂等回执；S-I07 装夹模式与既有批准指纹一致性；S-I08 D04→D05/D06消费和版本失效；S-I09 D10独立ExecutionBinding适配与NC发布门；S-I10离线快照/旧schema/跨Project误回执及20正反产品场景。**每个切口必须绑定真实消费方评审**；不能用本CAP代替F1-02/F1-04/W2-05/E3-04/U4-02退出验收。

准入：B0-01实际构建组合锁（仅规划未实施）、B0-02 Owner批准、F1-02 Frame/单位数学契约评审、F1-04设计/生产入口的兼容策略，以及CAP-03-01 exact CAD。无前置时只可继续规划/原型，不准宣称产品功能已完成。

退出：在确定源CAD、native依赖、UI版本、测试fixture许可、两Setup/旋转/混合单位/离线条件下逐一执行20组正反产品回归，并由D04 Owner、CAD/Planner消费者、独立验证人员签署。实际测试入口待按当时产品仓补充，**当前统一标记`TODO_TEST_ENTRY`**。

回退：保留现有`CamSetupFullContextWire`与旧reader、已有Approved快照、原审批fingerprint；新L3读能力先上线且保持旧写入灰度可停用；遇不认识的字段或Frame标只读/unknown，不迁移已批准Setup到新默认坐标。回退可以撤销新writer路由，但不能删除新增历史revision；若已经发起D16生产发布另按10域受控撤回，不凭UI隐藏表示发布撤销。最小C0只定义身份/单位/Frame/修订/协议，不建立全业务通用巨型对象。

## 6. 仍未被证明的事项与明确风险

(1) GUI当前真正多Setup持久化/隔离、跨Document和晚回执未做本轮实测；(2) F1-02刚体变换与精度策略未在人类评审冻结；(3) ISO 5459设计datum vs实际夹紧基准数学求解还缺负载/接触/测量证据；(4) 现有CAM后端Rust/OCCT native版本及Setup Approval链本轮只读审查不完整；(5) 实际G54/控制器语言必须由D10/D13处理；(6) 真实CAD多实例BRep和毛坯bbox需产品回归；(7) 老数据unknown authoringMode需要只读兼容。状态：**设计提案待审，不以文档校验PASS宣称产品通过**。