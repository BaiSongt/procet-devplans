# CAP-02-07｜资源几何与参数化的业务驱动GUI

> 2026-10-17 v0.1；已编制、**待设计评审/未实现/未运行交互验收**。配套[CAP规格](README.md)。主工程空间与资源空间共享一个可交互Babylon世界，左侧统一任务容器，浅/深主题；不增独立并排制造视口。

## 1. 入口与五任务页面

从ActivityRail“制造资源”→资源列表→几何与参数进入；Setup“选用资源”进入时存储`callerScope={projectId,documentInstanceId,setupId,resourceExactRevision,editSessionId,epoch}`，返回时核对Scope，不能把A的选择放入已经切换的B。无Project时可操作资源草稿，但不能伪造工程Setup。

| 任务页 | 字段与主操作 | 3D反馈 | 风险提示 |
|---|---|---|---|
| 01来源 | sourceKind=OEM/参考CAD/程序化示意、来源URI、资产hash、资格 | 当前资源及证据标签 | 未认证资源可浏览，不可授生产资格 |
| 02参数 | 模板版本、参数、单位、有效域、公式与派生错误 | 临时shape与对应握柄/高亮 | 拖拽只修改候选，不静默写Released |
| 03组件/接口 | parent/child/axisBinding、局部frame、配合关系、包络用途 | 组件树与局部坐标轴同步、线框工作/运动/安全Envelope分层 | 不能从模型外观猜运动结构 |
| 04派生/预览 | backend Job、B-Rep结果、Mesh LOD、来源面映射、有效性 | 精确已核对/示意/降级显示分别标色与文字 | Mesh能显示不代表几何精确 |
| 05检查/发布 | 结构/几何/空间注册/碰撞资格的独立状态，变更影响 | 指向失败子件与参数的overlay | 发布资源≠Setup采用；发布不等于机床验证 |

固定容器宽度内纵向滚动详细字段，标题/错误摘要/主操作常驻；主状态栏显示当前坐标系、单位、revision、证据状态。可查看Released版本但只允许派生新Draft；退役不破坏历史只读引用。

## 2. 字段契约（N必填；C条件；D派生；O可选）

| 字段 | 要求与单位 | 编辑边界和校验 |
|---|---|---|
| resourceId/revisionId/revisionNo/status | D | Resources服务，不从mesh名猜身份 |
| templateExactRef/schemaVersion | C | 由资源模板版本提供，旧模板显式兼容 |
| parameters:key/type/value/unit | N/C | typed、有限、量纲一致；缺工程默认则空缺待填 |
| constraints/min/max/expressions | C | 原数据源或规范化约束；循环/冲突显示字段级错误 |
| componentId/parentComponent/axisBindingRef | C | Resources owns；运动计算归09域 |
| frameRef/origin/xAxis/zAxis | C；mm+无量纲 | F1-02统一变换from/to；拒绝非法安装镜像 |
| geometryRole/assetExactHash/sourceRef | D/C | display/exact/collision/envelope分别显示 |
| sourceFidelity/registrationStatus | D | 两者与kernel capability分开展示 |
| meshingLinearDeflection/AngularDeflection | C；mm/rad | 渲染来源政策，改变仅重生Mesh |
| envelopeKind/minMm/maxMm | C；mm | 明确Machine CSYS，AABB不展示为reachable set |
| validationMethod/assumptions/evidenceRef | D | 每个用途的独立资格回执，unknown≠pass |
| expectedLockVersion/requestId/sceneEpoch | D | Host事务与过期响应判断 |
| adoptedSetupRef/mountSettings | C；Setup层 | 资源页仅预览/返回，正式采用归Setup事务 |

单位输入界面可以用度或英制展示，但提交边界转换一次，记录原单位。不得把未审生产公差写成默认`0.01mm`。

## 3. 输入、预览、选择、提交

3D拾取产生`{resourceExactRef,componentRef,displayMeshRef?,sourceTopologyRef?,sceneEpoch}`；无sourceTopologyRef时“精确面基准”动作禁用，但高亮和相机操作不受影响。树/3D/参数组互选并同步选区；Esc退出拾取模式、不改业务。

模型/参数调整：先在草稿上编辑→`PreviewGeometry`异步请求→本地overlay显示→“保存草稿”调用同领域应用服务→服务端检查与发布→Setup显式选用。返回按callerScope恢复任务容器、相机状态、草稿以及3D位置，不在主3D旁开启另一个永久Canvas。用户连续点击自动落座/对中得到同一个绝对结果，不能叠加位移，也不能自动扩毛坯。

当前代码另有独立交互Viewer，只有在新的唯一交互世界设计完成并回归通过之后才能迁移；离屏缩略图可继续使用独立渲染资源，但不得抢主Scene的输入、工具选择或数据Owner。

## 4. 状态、异常和恢复

页面状态独立于业务状态：idle/loading/editing/deriving/preview_ready/validating/conflict/readonly/error。子项资格为passed/failed/unknown/unsupported/stale/not_requested；**严禁合并为一个“几何安全”绿灯**。

并发改同一Draft时保留本地编辑和对比入口；晚到的preview必须核对epoch/expectedHash并直接丢弃；已发成功但响应丢失，通过requestId获取同一回执。缺offline必需资产则保持当前工程，显示缺失闭包；只有显示模型缺失时按具体业务降级策略只读。用户关闭含脏草稿面板时提供保存/放弃/取消关闭，不默许覆盖。

页面键盘焦点可返回来源列表；Space/Enter不能在字段输入时误触“发布”；列表和3D选中对象在主题切换前后保持。

## 5. 可复现GUI走查（产品待测）

U01 选择Released r1→只读→派生Draft r2→预览→发布→旧Setup仍r1；U02 参数尺寸为0/非法公式→定位字段错误而非生成箱体；U03 仅显示网格→外观可见、精确面确认禁用；U04 切Setup A→B，A late response不污染B；U05 工作包络显示为线框，即使无机床实体图；U06 关闭/重开资源空间不产生第二个对等交互世界，摄像机/选择/状态恢复；U07 取消离屏缩略图释放GPU及URL；U08 显示Mesh修改只影响显示缓存，精确几何改变使相关审查stale。和[RG-T01～20](README.md)交叉验收；本轮没有执行这些产品用例。
