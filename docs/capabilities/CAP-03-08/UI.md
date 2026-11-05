# CAP-03-08｜五任务左侧面板与单一3D证据工作台

状态：L3待评审，静态交互设计；复用宿主`UnifiedTaskPanel`、ActivityRail、Ribbon、ModuleRegistry/ContributionHub/RendererPort，**不再创建第二个全局3D世界或第二个领域Store**。主工程世界与左侧资源空间横向切换；浅/深主题同一信息架构。

## 一、五页业务任务

| 页 | 用户意图与主操作 | 必须展示的信息 | 禁止的交互/异常表现 |
|---|---|---|---|
| 1 选择语义范围 | 工程、D01修订、D02状态和候选来源筛选；新建草稿 | project/document/model exact identity，装配实例路径、Frame、拓扑snapshot/生产者版本 | 不能把图形网格pick直接当受控拓扑引用；scope切换作废旧request |
| 2 溯源审查 | 逐特征查看原CAD面、边、体与PMI、人工修订来源 | 特征→原始设计→活动→操作者/算法→修订；反向查询原CAD→feature | 局部face index变化不能直接认定永久同一实体；缺件明确unknown |
| 3 覆盖与冲突 | 对skipped/unsupported/ambiguous作人工决议 | 每类实际观察数、覆盖分母、未采纳候选、冲突证据、关键失配 | “100%覆盖”仅在有可证明的分母与源完整性时可显示；不能只看Run Solved |
| 4 确认与影响 | 选择候选决定，预览D02变化及05/06下游失效 | 冻结工艺D08受影响列表、期望修订、审批策略、选中Actor和理由 | 无许可按钮disable仍须服务提交点复核；不允许静默改冻结D08 |
| 5 回执/导出/恢复 | 查看commitReceipt、离线包闭包与回退路径 | requestId、scopeEpoch、result/newRev/newHash、SHA清单、缺件清单、旧reader版本 | 超时不等于未提交，网络晚到响应不得落在其它文档上 |

## 二、字段层级与可编辑性

顶部常驻面包屑：`工程 / 文档实例 / D01 revision / D02 revision`；右侧固定`DRAFT / PARTIAL / APPROVED / STALE / UNKNOWN`状态徽标，**颜色不能替代状态文字**。单位由源声明+Frame协商，不推断绝对毫米。`sourceHash`、`topologySnapshotId`、`producerProfile`、`PMI来源`和`coverage`均为只读，人工可编辑字段仅`selectedCandidateRefs`、`decisionReason`、`ambiguityChoice`及申请审批意图；批准真实状态由Owner回执给出。过期、不可用、未建模语义均显示`unknown`和证据缺口列表。

## 三、唯一Babylon主世界交互

1. 由RendererPort按现有CAM模型加载一个B-Rep派生mesh；overlay层分别显示原CAD拓扑（灰）、候选特征（蓝）、确认D02（青）、PMI绑定（紫）、缺失/冲突（橙），深浅主题遵循token。
2. 点击树或3D几何发出`FeatureSelectionIntent(featureId, viewportRevision, exactScope)`，业务面板经03域只读查询反查canonical topology ref。**一次点击不变更D02**。
3. 选择“预览差异”仅生成临时会话overlay，显示old→new并用虚线/颜色说明split或merge；无可证的历史边显示`UNMAPPED`而非强行线连。
4. 点击“确认采用”才发`CommitSemanticPackage`命令，面板先展示预计影响和错误码。后台CAS/权限/源Hash通过后才替换唯一store中的revision；失败保持旧投影。
5. 切换主资源空间、关闭文档、ESC退出AI+3D、网络断开、Worker迟到时，按`projectId+documentId+scopeEpoch+requestId`路由，迟到回执记历史查询但不污染当前高亮或当前revision。

## 四、状态机（单一Owner事实）

`EMPTY → DRAFT → EVIDENCE_PARTIAL | REVIEWABLE → REVIEW_PENDING → COMMITTED`，`COMMITTED → STALE`只能由精确源或相关依赖变化触发。`BLOCKED`与`UNKNOWN`记录证据不足；`CANCEL_REQUESTED`是请求状态而不是服务器已取消的事实。`COMMITTED`仅指D02领域提交，**不是D08/D16**。

错误反馈面板要用可机器读代码：`SOURCE_DRIFT / REVISION_CONFLICT / UNKNOWN_TOPOLOGY / AMBIGUOUS_MAPPING / MISSING_PROVIDER / UNAUTHORIZED / INCOMPLETE_CLOSURE / UNKNOWN_RESULT`，附定位到字段/证据节点的跳转动作；不把`[object Object]`写入UI，也不把调用失败隐藏为toast成功。

## 五、GUI/CLI/Agent共用命令与可用性判定

UI的“可操作”分四层：能力已注册`advertised`、后端准备`ready`、本次请求获许可`permit`、持久提交`committed`。四层独立显示，`ready`不授权，`permit`不代表已提交。CLI/Agent必须调用完全相同的领域命令，不能绕过Host切换本地SQLite或插入发布包。用户申请重试时先查`GetCommitReceipt(requestId)`；相同ID不同载荷明确冲突。

## 六、可用性及无障碍

表格与3D选择相互同步但不依赖颜色识别；键盘可完成证据导航、冲突列表筛选、预览、取消和回执复制；低性能系统可以关闭overlay而保留列表与只读证据；屏幕阅读器告知证据状态及版本。演示模式只显示明确标注`DEMO`的合成几何，禁止混入真实授权资料。

交叉引用：[业务契约](README.md)、[20场景](fixtures.json)、[R-SEM-001](../../../research/topics/R-SEM-001.md)。