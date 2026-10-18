# CAP-03-06｜UnifiedTaskPanel 与单Babylon世界交互规格（L3待评审）

> 仅规划，不是已经实现的UI；详见[业务规格](README.md)。不新增第二渲染Canvas，左侧统一任务容器可拖拽调宽度并保留尺寸偏好，主模型与资源空间横向切换，预览不持久写入。

## 页面1｜范围与来源
入口：ActivityRail「CAD/特征」→左侧单任务容器「人工特征编辑」。字段：Project/Document选择（Host来源、无单位）、装配Occurrence路径（D01只读）、设计revision/hash（只读且精确）、几何Snapshot/Frame/Unit（只读）、D02当前revision与权限/ready状态（只读）。用户须能区分只显示mesh、可识别B-Rep、已经确认D02。切换工程时提前提示未提交草稿，保留草稿到原scope；old scopeEpoch晚回执不得污染新工程。

## 页面2｜新建与修订
左侧上部列表显示算法候选、人工草稿、已确认、过期、被拒绝，按精确revision分组；下部编辑表单`featureKind、intentName、roleClaims（wall/floor/rim/island/keep/entry）、materialSide、openSides、throughness、parameterClaims、evidenceNote`。字段来源分显式用户输入、B-Rep只读派生、unknown。长度mm仅输入视图单位并按C0统一量纲保存；方向用FrameRef+归一化向量，不直接存随3D相机旋转的XYZ。模型只有mesh时可以编辑intentName、待映射定位说明，确认键禁用。

## 页面3｜拓扑与PMI审查
单一3D世界中点选面/边→临时`SelectionProjection`，亮色代表当前候选，交叠面采用多来源标签；在左侧面角色清单中选择“底面/壁面/岛屿/开放边界/其他”。拾取返回`{viewEpoch,sourceSnapshotRef,localPickHandle}`，Host查询稳定TopologyRef/InstancePath；没解析成功须显示`unresolved`而非造faceId。显示“设计PMI引用（精确版本）/几何测量（只读）/用户声明值/相互冲突”的差异，不能一键将视觉标签变成形位公差认证。

## 页面4｜确认与版本差异
两列比较「当前已确认revision」与「拟议新revision」，不产生并排3D世界；视图在两个快照投影间切换或叠加着色，不同时交互两个Canvas。列出分裂/合并谱系、受影响D05/D06/D08/D16、审批角色与政策版本、unknown项目。提交按钮区分“保存草稿”“提交复核”“确认特征”“批准特征”：分别有不同域命令与合法门禁，确认不等于批准；每个动作预览将发送的exact引用。批准D02不等于工艺D08/NC D16发布。

## 页面5｜审计、冲突与恢复
按`requestId`查看“仅本地草案/已受理/冲突/已提交/取消在提交前/回执未知”等状态；显示原sourceHash、expectedRevision、实际committedRevision及eventCursor，不显示密钥。对冲突提供“只读比较→复制为新草案→人工重基/放弃”的路径，不提供强制覆盖。对断线`UNKNOWN_AFTER_TIMEOUT`按原requestId查询receipt。对CAD版本更新列出必须重新绑定的旧拓扑、PMI及冻结影响，旧D02可查但标stale/superseded。

## UI行为矩阵（非产品PASS）

| 行为 | 视图状态 | 领域动作 | 错误处理 |
|---|---|---|---|
| 3D hover/pick | ephemeral selection | 无 | 失帧/旧snapshot清除高亮、保留说明 |
| 选候选并更改面角色 | draft dirty | `ChangeFeatureClaims`暂存提案 | 角色不可证明则unknown |
| `保存草稿` | draft saved | `CreateManualFeatureDraft`（提案） | CAS冲突转比较，不覆盖 |
| `确认特征` | waiting receipt | `ConfirmFeatureRevision`（提案） | 旧revision/hash/权限拒绝 |
| 工程切换 | old scope stored | 不写当前工程 | 晚回执归档原scope |
| 取消未提交任务 | cancellation requested | 取消子任务，等待受理结果 | 已提交显示真实COMMITTED |
| D01版本更新 | stale and needs review | `ReopenFeatureOnNewDesignRevision`（提案） | 歧义不自动映射 |
| 回退适配器 | read-only fallback | Host切安全Handler（待实现） | 新修订保留不可删 |

## 验收所需交互证据
真实浏览器需要分别验证键盘选择、屏幕阅读器状态、鼠标调整左栏、场景切换不重复Canvas、拾取稳定引用、纯预览无数据库写入、断网返回后QueryReceipt与滚动列表内多实例区分。未实现的RendererPort协议、领域端口和测试入口都标`PROPOSED`，禁止截图自证软件通过。相关规范来源与用例见[研究](../../../research/topics/R-FEDIT-001.md)及[场景](fixtures.json)。