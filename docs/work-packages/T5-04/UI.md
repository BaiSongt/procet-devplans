# T5-04｜GUI/3D迁移审查协议

统一左TaskPanel展示Inventory→Expand→Migrate→Contract→Rollback及逐资产Dxx Owner；单Babylon世界/Scene，Ribbon与ActivityRail仅导航，Agent浮窗可独立关闭；GUI、CLI、Agent调用同一个领域OwnerPort，不新增第二套业务执行流程。最大字号12px、仅浅/深主题；DPI 100/125/150/200%和键盘焦点须后续真实回归。

表格显示exact revision/hash/FrameRef、schema、旧Reader、目标Reader、测试版本、ACL/scopeEpoch、备份校验、人工签署、未知原因。QUEUED/RUNNING/WAITING/BLOCKED/CANCELLED/STALE/FAILED/RECOVERED显示真Owner回执及正在执行的工具，不能仅显示假进度。任务切换或取消晚回执不可回填当前scope。ESC先解除可取消预览，保留脏草稿，未确认的不提交。

3D仅用有scope的OverlayLease展示旧/新Setup姿态和中立CL教学预览，切任务释放Observer/Gizmo/租约，不新增Babylon Scene。D04工艺Setup与D10机床执行绑定分区展示；D09动画不认证D15，D13 UNKNOWN显示D16阻断原因。预览与切换本身无业务写入，Owner CAS/ACL/Frame/取消代次重验后才能申请Commit。

[十任务](../T5-04.md) · [合成账本](migration-ledger.example.json) · [10规则](../../../research/traces/T5-04.json)。真实GUI、GPU、NC与Owner测试均NOT_RUN。
