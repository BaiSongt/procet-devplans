# CAP-01-05｜A/B 工作模式编排：研究补证与开发审查增补

- 文档状态：**研究补证已编制／设计待评审／产品未验收**，2026-10-18；不替换既有0.9.1业务规格、不增88项分母。
- [原业务规格（专项分支固定修订）](https://github.com/BaiSongt/procet-devplans/blob/1d8019c77b49d301e494cae0b38ca241e07c82c9/docs/capabilities/batch01-v0.9.1/01_%E5%8A%9F%E8%83%BD%E8%A7%84%E6%A0%BC/CAP-01-05_A-B%20%E5%B7%A5%E4%BD%9C%E6%A8%A1%E5%BC%8F%E7%BC%96%E6%8E%92.md)的AT-01—AT-08编号及其业务期望保持不变；本文件定义额外AT-09—AT-20和对实现歧义的收敛。实际落地前需与原文逐项复核。
- 研究专题：[R-WFLOW-001](../../../research/topics/R-WFLOW-001.md)；[来源登记](../../../research/sources/CAP-01-05.json)；[机器追踪](../../../research/traces/CAP-01-05.json)；[验收数据](fixtures.json)。

## 1．业务事实与不变边界

A（探索）与B（生产）是**同一工程、同一版本化事实**的两种业务工作方式，不是两个数据库、两个项目、两个渲染器，不是Host `Manual/SemiAuto/FullAuto`权限自动化控制模式，也不是CAM `annotation/setup/feature/process/toolpath/nc/publish`七阶段UI导航。A可以从尚未批准生产Setup的CAD开始能力范围内探索；B可以不经Solver先建生产计划草稿；任何结果进入被批准/冻结计划必须经过显式采纳与领域批准。

目标参与者：工艺工程师（选择与决策）、算法工程师（审查候选和约束）、项目负责人（工程变更与冻结审批）、平台集成人员（宿主/版本/运行管理）、GUI维护者（界面编排）和独立测试人员（核验版本与反例）。

Owner：Project/Host拥有工程快照/任务和应用接管记录的可见提交协调；CAM Planning拥有D05/D08及批准/冻结；Solver拥有D06/D07候选及材料状态；CAD拥有D01/D02；Setup拥有D04，Machine Execution Binding为D10，必须与D04区分。业务记录需引用而非复制各领域权威内容。

## 2．主业务流、替代流与异常流

**A探索→B接管主流**：工程选择CAD exact源→目标能力请求最低条件查询→展示满足/缺失/未知分项→无关的生产机床批准不能阻断纯几何探索→Host建立求解任务并返回JobRef（仅已接受，不等于完成）→Solver在自身域产生候选Run和证据→用户选择可采纳的候选子集及目标范围→生成接管预览（源快照、引用/工序映射、冻结影响、尚缺输入与冲突）→确认时重新验权限、源/目标修订、策略和冻结范围→CAM事务性生成新的Draft或显式适配到已有Draft→Project/Host记录`HandoffRecord`和可追踪回执→导航进入对应Setup/工艺任务。任何阶段不生成NC验证或发布资格。

**替代流1：直接进入B**。无需先跑特征识别或Solver，允许创建未批准Plan Draft；执行器对每个后续具体命令计算条件，缺少资源时显示待补而不是以全局门禁阻止草稿工作。**替代流2：B→A局部返回**。提交一个局部探索作用域与保护边界；已冻结工序不被修改，探索结果回流为待采纳候选，冲突由工艺Owner裁决。**替代流3：多Setup**。从Setup S1切到S2直接回到S2规划范围，不能依赖重跑S2特征分析；WorkContext绑定 `(projectRef, documentInstance, setupExactRef, workflowRevision)`，展示偏好与制造权威分离。

**异常**：源/目标 revision变化、冻结发生冲突、候选来源不完整、服务/能力未ready、预算超限、提交后响应丢失、取消晚到、Host断电/重启、跨库部分提交。按阶段保留可恢复草稿/人工冲突选择与可查询请求状态，不允许把失败当作“已接管”，不得静默改写冻结结果。

## 3．界面：统一左容器与单一三维世界

UnifiedTaskPanel分四种视图：① 模式/目标和能力需求（A/B作为业务状态，非七阶段Tab）；② 接管预览（继承/待补/冲突/冻结四区）；③ B局部返回A（影响范围与解冻审批）；④ 操作回执/恢复（提交阶段、可重试和关联Job）。视觉使用既有Babylon唯一`Engine/Scene/Canvas`与共享`RendererPort`，主CAD及资源空间横向切换，不并排嵌第二个互动世界；只提供浅/深主题。

在3D拾取面/特征/工序仅写`SelectionIntent`，候选高亮只写短期`PreviewLease`；拖拽、勾选和面板字段只改变本地`EditSession`。只有“确认接管”调用领域提交；取消预览必须清租约且业务数据库完全不变。切S1→S2时旧异步预览结果凭`scopeEpoch`和`requestId`丢弃；不能将S1高亮迁移给S2。

| 字段/控件 | 类型与单位 | 来源Owner | 编辑语义及默认 |
|---|---|---|---|
| workflowMode | `explore/production`，无量纲 | 应用Workflow记录 | 显式用户选择；工作台未设置时为空，不默认赋生产资格 |
| capabilityId | 版本化能力ID | ModuleRegistry/Host能力目录 | 选择目标；`advertised`≠`ready`≠`permitted` |
| sourceSnapshotRef/expectedRevision | C0精确引用/整数修订 | Project | 只读，提交前必查；未知版本阻止修改 |
| sourceArtifactHash | 内容摘要，算法标识+hex | Project/源领域 | 只读；仅用于内容校验，不替代实体修订 |
| candidateRefs | D06候选exact引用数组 | Solver | 显式多选，默认为空；不因排序改变身份 |
| frozenScopeRefs | D08冻结工序/约束exact引用 | CAM Planning | 只读保护区；解冻需独立批准 |
| processSetupRef | D04 exact引用或`null` | Setup | 视实际能力的物料/几何前提而定，不自动构造 |
| executionBindingRef | D10 exact引用或`null` | Setup/制造资源 | 仅真实机床执行、后处理等请求需要；不默认B5 |
| activeSetupRef | D04 exact引用 | Setup | 每Setup各有工作现场；切换不重算特征 |
| unitsAndFrames | mm/rad/明确FrameRef | C0/所属域 | 只读派生；3D变换绝不反写几何真值 |
| requirements | 代码、定位、状态`met/missing/unknown` | 领域能力用例 | 只读计算；unknown禁止伪装met |
| handoffPreviewDigest | 摘要/源修订/目标修订 | 应用Workflow | 预览只读且有时效，提交必须重算校验 |
| requestId/idempotencyKey | 非空唯一key（项目作用域） | Host | 提交/恢复共用原key；key换payload冲突拒绝 |
| controlMode | `manual/semi_auto/full_auto` | Host PolicyGate | 只读，与`workflowMode`正交，不可从UI A/B推导 |
| workflowStatus | Draft/Preview/Accepted/Committed/Conflict/Unknown | 应用Workflow | 只读，回执晚到需查精确请求状态 |

## 4．领域接口（设计提案，不冒充现有实现）

- `workflow.requirements(capabilityId, sourceRefs, requestKind)`：只读/缓存带依赖revision；返回每个条件`met/missing/unknown`、owner及解释；无权限隐藏细节但不伪称能力具备。
- `workflow.handoff.preview(sourceSnapshot, targetDraftRef?, candidateRefs, frozenScopeRefs)`：只读，返回`previewDigest`, `sourceRevision`, `targetExpectedRevision`, `affectedRefs`, `conflicts`。
- `workflow.handoff.commit(previewDigest, expectedRevisions, idempotencyKey, hostActorContext)`：唯一写路径，返回`HandoffReceipt{status,recordRef,draftRef,sourceHash,committedGeneration}`或结构化拒绝。重试同key/同payload复读原结果，同key/异payload拒绝。
- `workflow.returnExplore(scopeRefs, frozenConstraintRefs, expectedRevision)`：先只读预览，确认后写新的探索作用域记录；批准/冻结不变。
- `workflow.status(requestId)`：重启或网络超时时先查。事件 `workflow.handoff.committed`和`workflow.handoff.rejected`需带exactRefs、generation和原因，不消费过期scopeEpoch结果。

GUI/CLI/Agent均调用同一领域用例，身份来自Host可信会话；模型侧`mode`与权限控制不能互相替代。跨域失败需由Host恢复协调+领域补偿/对账；不假定跨独立数据库、CAS与`.pct`为单个ACID事务。

## 5．现有代码的只读观察（非产品测试）

在`procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`核对以下文件：

- `apps/desktop/src/modules/cam/stageStore.ts`：`currentStage`是模块内**单个全局内存变量**，`setCamStage`按同值幂等并通知订阅；注释明确`per-document`和持久化不在该轮实现。若新业务要求跨多CAD文档/Setup的独立现场，不应误以为现有stageStore已经具备持久恢复；应经现有DocumentManager/Host受控扩展，不复制第二套领域真值。
- `apps/desktop/src/modules/cam/index.tsx`：已注册`cam.stage.*`和文档相关上下文，模型打开命令的ready条件是`project.open && capability.cam.job.create.ready`。这只是旧CAM路径条件，不应误推整个CAD或探索业务都必须批准CAM生产Setup。
- `apps/desktop/src/modules/registry.ts`：真实`ModuleRegistry`、命令注册、ContributionHub租约可复用；动态激活并非后端业务成功。
- `crates/procet-host-runtime/src/policy.rs`：Host已有`ControlMode::{Manual,SemiAuto,FullAuto}`与`ApprovalVerifier`，**控制模式不同于A/B工作模式**。加入A/B流程时不能复用ControlMode字段并改变原PolicyGate许可含义。

这些观察只针对上述exact提交和读取文件；缺口需由产品开发者/测试者在实际合并目标版本复核，**没有运行GUI/后端测试**。对应F1-04（探索/执行最低输入分层）、W2-01（接管）、W2-02（采纳/冻结）、W2-05（失效），U4-01（界面）、F1-06（工程恢复）。

## 6．失效、兼容、迁移、回退与范围边界

CAD/D01改变→仅失效依赖该修订的候选/工序/验证；Solver Run改变→仅受引用的候选/接管映射待审；D04 Setup变化→重新检查工艺前置条件；D10绑定变化→NC适用性/轴运动/验证待重验但不直接改变CAD历史；七阶段UI切换或相机变化→不触发制造数据失效。审批D08冻结保持旧版本可读，通过新修订或批准撤销实现改变，不能改写原快照。

旧工程若无Workflow记录，默认只读推断/提示用户选择，不把旧`CAM_STAGE_DEFAULT=setup`翻译为`workflowMode=production`。迁移先引入新只读RequirementSet和Handoff预览，运行真实消费者双路对拍，随后逐步开放写命令；失败切回旧显示或禁新入口，但不回写已批准工件。扩展边界：不开发全能可视化工作流编辑器、不复制计划数据库、不要求通用Solver一次支持所有特征，也不新增材料扫掠仿真。

## 7．编号验收映射（本轮只编制规格，产品全部NOT_RUN）

原文AT-01…AT-08按原含义引用。新增：AT-09未知能力拒绝；AT-10合法材料求解具备明确stock；AT-11直接B草稿不授予NC；AT-12冻结工序拒绝覆盖；AT-13 B→A回流不自动改原计划；AT-14 CAS匹配可确认；AT-15切Setup丢弃迟到回执；AT-16业务模式与Host权限正交；AT-17幂等重试复读；AT-18晚取消不得翻转已提交；AT-19重启按requestId恢复；AT-20跨库部分提交不可显示整体成功。各条含Given/When/Then、正反区分及规则映射见[20组fixtures](fixtures.json)。

## 8．待评审和工程准入

业务Owner确认A/B业务边界与冻结裁决权；Host Owner确认提交回执、scopeEpoch、幂等、恢复；CAM/Solver/CAD Owner确认本领域唯一写入和候选身份；GUI Owner验证同一Babylon空间与多Setup现场；独立验证者先建立`workflow_handoff_*`测试入口（**待创建**），再做重复请求、故障注入与断电/双库恢复。具体源提交通过实机/Windows/原生内核测试前，只能称“规格编制完成、产品未验证”。