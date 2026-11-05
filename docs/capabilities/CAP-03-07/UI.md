# CAP-03-07｜业务驱动GUI与唯一3D视口（L3待评审）

参见[业务规格](README.md)、[正反验收](fixtures.json)、[理论研究](../../../research/topics/R-FREL-001.md)。**本文件仅界面/交互契约，不代表已经实现Babylon产品页。**

## 共用布局与状态

左侧原`ActivityRail`进入“特征→关系”，Ribbon随任务切换；左侧**唯一UnifiedTaskPanel**承载五个任务页。主区域唯一Babylon 3D世界，`RendererPort`做选择/着色/几何来源映射；资源工作空间为横向切换，不能出现并列第二个可交互3D。深色/浅色共享token，颜色必须有图例和文字，红绿盲场景用实线/虚线与图标辅助。无RendererPort ready时保持结构化关键信息与unknown，不伪造3D可用。

| 任务页 | 业务活动 | 左侧表单与只读量 | 3D交互与完成条件 |
|---|---|---|---|
| ①选定范围 | 锁定D01/D02确切版本和装配实例 | projectId、documentId、occurrencePath、geometryHash、frameRef均只读；版本下拉需显式选择 | 高亮所属实例；缺源Hash/Frame只可查看无提交 |
| ②发现关系 | 请求候选、筛选共享边/包含/相交 | relationType、算法profile、证据class、distanceMm(测量只读)、toleranceProfileRef；默认未核验 | 选端点+高亮实际支持面/边，hover/相机移动不写D02 |
| ③审查歧义 | 展开多父候选、保留岛与复合关系 | unknownReason、sourceEvidence、candidateParentRefs、preserveRole、PMI exact Ref；图层开关 | 对比树与全Graph；歧义虚线、冲突标志和说明不能隐藏 |
| ④确认修订 | 查看exact变更、原冻结与影响清单 | expectedD02Revision、requestId、actor、policyRef、affected D05/D08/D16只读；提交前重验 | 显示拟议关系差异；**用户按左侧确认键**后查COMMITTED回执 |
| ⑤历史恢复 | 冲突、撤回提案、断网重试、版本回放 | eventCursor、requestId、receipt、前后Hash、compatibilityVersion | 显示历史图为只读，旧Project晚回执不替换当前视口 |

## 字段单位、编辑权与默认

`distanceMm`/`toleranceMm`均为毫米，`intersectionVolumeMm3`为mm³，`angleDeg`为度或明确`angleRad`，全部来自带Kernel/Frame的计算证据，只读；无值=null+unknown，不得用0替代。布尔`bboxOverlap`只表示粗筛，不影响正式关系。`relationKind`由用户选择提案；`proposed/confirmed/stale/ambiguous/unknown`为可见状态，只有03域Owner实际提交改变confirmed。主/资源空间切换不清空当前受管修订，但不允许资源库编辑在3D对象选择时悄悄创建机床ExecutionBinding。

## 取消、并发、迟到回执

弹窗取消=撤销本地预览，不调用提交；Worker取消后迟到结果进入原Request日志不可切换工程显示。提交中显示`PENDING_RECEIPT`，断网或超时改`UNKNOWN_AFTER_TIMEOUT`并可重查；成功必以`COMMITTED+revision+hash`为准。CAS冲突显示双侧revision和比较，不以自动刷新覆盖别人批准。切换Document时增加`scopeEpoch`，只过滤前端显示；后台保存的旧请求状态仍可追查。获批D08/D16只显示影响及重新审查建议，不提供“直接覆盖发布包”按钮。

## 可复用与缺口

复用现有`ModuleRegistry/ContributionHub/RendererPort`入口、Host工程快照与原`CamViewportFeatureTree`选择能力。`solver-feature`的relation/hierarchy/DAG为只读算法层；03域持久RelationOwner和GUI/CLI/Agent统一命令、事件/回执以及跨版本拓扑处理为待实现。现有服务是否具有插件/渲染状态须在产品集成时实测，不因本规划宣称存在完整特征图工作台。