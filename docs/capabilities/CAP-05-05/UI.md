# CAP-05-05｜GUI/3D与CLI/Agent接管交互（待L3审批）
> 最多12px，仅浅/深主题；一个Babylon Scene/World通过现有RendererPort复用，统一左TaskPanel，不新建图形世界，不制造独立右侧工作台。

| TaskPanel阶段 | GUI必需字段与行为 | 不允许的行为 / 异常码 |
|---|---|---|
| 1 候选列表 | runId、candidateId/revision/hash、目标、停止原因、FEASIBLE/UNKNOWN、约束与算法配置 | 隐去UNKNOWN、多解只展示单一“最优”、将评分视为安全证明 |
| 2 A/B比较 | 人工A与多候选B并列，同D01/D02/D04 exact refs，参数/几何/可靠值来源 | 将A的冻结当成可直接覆盖；依名字匹配几何 |
| 3 工序选择 | 稳定工序ID、前驱、DAG依赖、Setup Frame与D07保护区证据 | 自动选择未验证前驱、无Frame继续进入采纳 |
| 4 差异预览 | created/modified/retained/invalidated，适用scope和revision，3D局部高亮租约 | Preview直接改D05/D08、用CL动画冒充NC检验 |
| 5 受控采纳 | actor授权、expected/current CAS、冻结fork、复核来源Hash、审批与签署，显示审计回执 | 取消或晚回执提交、并发冲突静默重试、直接改已发布D16 |

状态提示：`FEASIBLE / INFEASIBLE / UNKNOWN / REQUIRES_REVALIDATION / FROZEN_FORK_REQUIRED / STALE_REFERENCE / PERMISSION_DENIED`分别表达求解、业务和权限含义，不以单个绿色成功图标混淆。3D局部高亮基于`selectedStableIds + FrameGraphProof + generation`；Setup切换、取消时立即释放高亮租约，过期回执不得重绘或写入。Agent工具只能调用`CandidateAdoptionPort`并显示受限条件，CLI`solver candidates|compare|preview|adopt --expected-revision`同策略，不通过私有数据通道绕过Host。