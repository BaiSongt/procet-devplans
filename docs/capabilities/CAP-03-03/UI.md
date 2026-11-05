# CAP-03-03｜稳定拓扑引用：业务驱动GUI、字段、状态和3D交互

> v0.1本地规划草案，待评审。与[完整CAP规格](README.md)、[R-TOP-001](../../../research/topics/R-TOP-001.md)及[20条合成场景](fixtures.json)配套。不是现成产品页面。

## 唯一入口、页面和空间

入口：**Project→设计对象→几何/拓扑引用**；也可从D02特征、PMI锚定、D04 Setup 的「查看来源」跳转，并携带exact CAD修订及来源用途。左侧仅一个 `UnifiedTaskPanel`，五个任务页共享宽度与滚动/拖宽控件；Ribbon提供操作而不是新真值。中央**单一Babylon Engine/Scene交互世界**，与资源空间横向切换，不能在两个主视口同时显示生产模型。3D树/高亮/透明轮廓都是D01精确证据的只读投影；仅浅色/深色主题。

| 五任务页 | 主操作 | 3D同步 | 写入/异常边界 |
|---|---|---|---|
| **01 精确引用** | 选择已提交D01修订、Occurrence路径、Face/Edge/Vertex/Solid类型，检查Snapshot与来源 | 拾取后面/边高亮；对多实例同时展示Occurrence路径与所在Frame | 拾取只产生SelectionIntent；没有exact topology只显示，不许制造采纳 |
| **02 来源证据** | 查看sourceHash、reader/kernel、source标签、BRep/mesh派生、单位/容差/Frame | 拓扑元件和相邻面、轮廓叠加；渲染索引与拓扑索引分别显示 | 缺证据使用unknown，不从面颜色猜PMI/几何身份 |
| **03 版本差异** | 精确选择旧/新修订，查看unchanged/modified/split/merge/delete/new/ambiguous及证据 | 同一场景轮换旧/新快照，可显示ghost overlay但无第二交互世界 | 不自动把候选对应写成mapping，也不默认切最新修订 |
| **04 重绑复核** | 按用途选择mapping候选，展示所有候选与分裂/合并关系，填写人工决定、范围、理由 | 旧面/新候选交替联动，分裂面允许多选；候选状态徽章 | 只提交待评审意图；CAD Owner CAS/权限/来源门重验；PMI/D02另行审批 |
| **05 保存与影响** | 显示receipt、mapArtifact、受影响D02/PMI/D04/D05/D08/D16、风险与回退版本 | 切换成功后按照已提交revision重建Renderer派生；旧版本可查看 | 未提交取消ghost；已提交超时须QueryReceipt；冻结产物不被静默覆盖 |

## 细粒度字段：单位、来源、可编辑与默认

| 字段/UI组件 | 来源、编辑性、默认 | 校验/失效反馈 |
|---|---|---|
| CAD修订选择 | Project最近被用户明确选中的**确切修订**，不默认latest；只读候选框 | 修订切换使旧selectionIntent与预览租约过期 |
| Definition/Occurrence | D01/CAP-03-02，`definitionRef+occurrenceRef`只读；纯零件Occurrence=none | 重复出现须显示路径，不能只选definitionId |
| 几何类别/局部序号 | Owner TopologySnapshot读回，类别枚举；localIndex只读 | snapshot改变后旧index不再合法，展示stale |
| `sourceArtifactHash / snapshotHash / meshHash` | CAS与Owner，按hash样式只读，详情可复制 | 三者分别表达源/拓扑/显示；不相等时不能硬解成同一对象 |
| `frameId / units` | 源frame与F1-02审定转换，mm/rad；方向与Orientation只读 | unknown unit/frame不得赋制造资格，UI不能靠相机符号补正 |
| `areaMm2 / lengthMm / centroidMm / normal` | 仅已知BRep及算法提供的定量指纹，只读且显示精度来源 | 不是正式身份或跨模型等价阈值；缺值用unknown，不写零值 |
| `algorithmVersion / kernelVersion / toleranceProfileRef` | 当前冻结执行版本/工程容差档案，空则unknown；只读 | 不可填硬编码默认阈值与制造适配声明 |
| 来源history类型 | OCAF/Builder真实执行工件，`verified_history`/`not_available`等只读 | 对两份独立STEP不得默认具备建模历史 |
| 关系类型与候选集 | 算法候选读回，可查看1:N/N:1及删除/生成 | 不强制one-to-one，也不自动接受最高评分 |
| 人工决定 | reviewer角色显式选择accept/reject/defer、用途范围和理由 | 缺角色、无证据、影响审批冻结时拒绝提交 |
| `requestId/expectedRevision/scopeEpoch/receipt` | Host/Owner生成只读；重试复用同请求ID | 迟到响应不得污染当前工程；实际commit须按receipt查询 |
| 下游影响清单 | CAD影响候选+各领域用途确认的三态，默认unknown | 不能用几何“没变”推断计划/NC/发布资格也没变 |

## 生命周期与并发冲突

状态机（提案）：`idle→exact_loading→pick_preview→evidence_check→mapping_preview→review_required→submitting→committed`；`exact_unavailable` / `unsupported_schema` / `ambiguous` / `stale_snapshot` / `permission_denied` / `recovery_required`为显式分支。`cancel_requested`先释放UI临时标记；若已获真实commit回执，不逆写历史。`submit`含requestId与expectedRevision；Host在提交点重查操作者与CAS闭包；`conflict`页面提供「重读差异」「新分支修订」「放弃草稿」，绝不自动重试成批准。

异步`PickResult`、`ProposeTopologyMapping`、`ReviewTopologyMapping`回调携带`projectId/documentInstanceId/sceneRevision/scopeEpoch`；任何一项不匹配即忽略当前视图更新，同时保留已发生提交的真实回执在所属工程日志。多Setup之间重用同D01来源可以，但Setup自己的批准上下文仍由D04独立持有。A探索允许提出重绑候选，B生产只消费明确已审定的exact证据，不能因为切换模式继承任何资格。

## 组件复用与界面验收

复用`RendererPort.pick`、`SceneRef.topology`、已有Project/DocumentManager的activeInstanceId及UnifiedTaskPanel，不建立独立Babylon渲染器，不依赖CAM Job已批准才能**查看**CAD来源。测试待实现：`TODO_TEST_ENTRY: CAP-03-03-3d`，必须覆盖双实例同面、修订重排、mesh仅重采样、split多选、异步A→B跨工程、拒绝mesh-only正式采纳、浅深主题及左右拖宽；产品浏览器/Windows测试未执行。

**UI错误信息**必须包含稳定机器码、证据缺失类型、受影响精确修订和可恢复操作；不能只显示`[object Object]`。字段级L4 schema将由CAD Owner、PMI、CAM、Host与GUI共同评审，不在本稿直接冻结。