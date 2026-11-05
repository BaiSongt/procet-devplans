# CAP-11-06｜GUI/CLI/Agent长任务同域入口与单世界3D

沿用**唯一Babylon Engine/Scene/Canvas**：主工程世界与制造资源世界横向切换，在同一活动Canvas显示，不允许并排两个3D。统一左侧`UnifiedTaskPanel`单容器，禁止右侧Drawer；Ribbon/ActivityRail通过现有ContributionHub挂载任务入口，最大字体12px、仅浅/深主题、AI面板为独立窗口而非业务写入口。

|阶段|左侧TaskPanel|同一Babylon场景|准入与错误|
|---|---|---|---|
|任务创建|明确操作摘要、scope、预计需要哪些Owner|目标工件与坐标Frame高亮|点击3D只产生候选意图，不写领域结果|
|排队/依赖|队列序号、依赖DAG、可重放/不可重放标识|保持最后可信只读几何|未接Worker不显示“执行中”|
|运行进度|当前Task/Generation、真实阶段、尝试次数、lease|可加载**已核准**中间几何预览|百分比不推断NC放行|
|人工批准|真实diff、expectedHead、受控动作Digest、Owner|冻结D08加锁状态|Agent/CLI与GUI共享人工门禁|
|取消/对账|CANCELLING、Owner原回执、迟到ACK隔离|旧图层只读失效标记|不能删除取消前实际发生的commit|
|异常/恢复|重试类别、Checkpoint、ScopeEpoch、恢复风险|Frame不一致隐藏关联高亮|UNKNOWN不伪作SUCCESS|
|完成/交接|具体业务Owner Receipt与独立消费结果|D11/CL-only动画明确标注非NC验证|D15未独立PASS不授D16许可|

同一个`11.TaskPort`提供`submit/inspect/cancel/reconcile/resume`，所有GUI/CLI/Agent必须以业务Principal调用对应Owner；不存在GUI以外的权限捷径。进度/错误/等待动画仅来自真实队列、Owner事件或Journal，取消后晚回执不能恢复旧任务。主题与AI窗口开关不影响其他区域任务。3D不做材料扫掠。
