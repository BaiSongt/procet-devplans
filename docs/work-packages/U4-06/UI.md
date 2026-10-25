# U4-06｜单Babylon世界及统一左TaskPanel的贡献合同
> UI最大字号12px，只保留浅/深两个主题。无第二Scene/任务容器；右Agent是浮窗，不可成为独立数据Owner。

|界面入口|声明式Contribution|实际授权与交互|
|---|---|---|
|Ribbon|CommandDescriptor(commandId,portId,scopeSelector)|宿主按Manifest注册；不增加Shell if/else；未授权显示原因|
|ActivityRail|TabDescriptor(id,order,taskRef)|切换唯一左TaskPanel、保留脏EditSession与焦点|
|左TaskPanel|TaskContribution(componentFactory,WorkContextRef)|从Owner按exact revision/hash/frame只读；CAS提交仍在领域服务|
|Babylon 3D|OverlayContribution(GeometryRef,LeaseId)|同一Scene下临时高亮/预览；取消/卸载释放Observer与租约|
|右Agent|DomainCommandPort(toolState,taskGeneration)|执行/排队/取消为真实领域状态；延迟回执按scope/generation隔离|
|CLI|同DomainCommandPort|相同ACL与幂等键；可独立在无界面环境验收|

生命周期：DISCOVERED→SCHEMA_VALID→COMPATIBLE→REGISTERED→ACTIVE→DISABLING→DISPOSED。拒绝分支DECLINED记录INVALID_SCHEMA、INCOMPATIBLE_SDK、UNKNOWN_CAPABILITY、NO_LOCK、STALE_SCOPE等。Tauri调用能力与Owner业务权限双门禁；manifest声称“READY”或Vue注入对象不能直接授权Rust命令/Dxx写入。

交互不改变工程事实。每个操作显示assetId、owner、revision/hash/frame和UNKNOWN/NOT_RUN状态。D09 CL动画角标PRECHECK_ONLY，D13 unknown不得标D15 PASS；共享Scene释放由Host持有，模块只释放自身OverlayLease。
