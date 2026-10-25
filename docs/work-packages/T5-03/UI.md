# T5-03｜GUI、单世界3D与发布审查交互
**状态：L3待审，所有真实产品运行NOT_RUN。**
统一左TaskPanel仅一个容器，在Ribbon“发布”入口展示“组合锁→生产者/消费者矩阵→逐域门禁→离线校验→签收/回退”。右侧Agent浮窗只是候选建议，关闭不应影响任务状态；CLI、GUI、Agent全部调用同一ReleaseCoordinationPort/ReleaseOwnerPort。仅一个Babylon Scene/世界，原机床/Setup/NC观察通过带scope的OverlayLease挂载，不新增发布专用Scene，取消时释放Observer/Gizmo。
紧凑表格最大字号12px、浅/深两主题；每条显示精确revision/hash/Frame、ABI、状态与缺口，失败/未知/未运行必须文字提示，不能只用红绿颜色。键盘焦点与ESC返回保持脏草稿，125/150/200% DPI不允许遮挡门禁。
**异步阶段**：QUEUED/RUNNING/WAITING/CANCELLED/FAILED/STALE/PENDING_APPROVAL；切项目、更换NC或取消后，旧回执仅进原task审计。发布按钮必须展示真实Owner资格与人类签字；触发后Owner再次CAS/ACL/scope/Frame/代次重验；界面不可直接写D16。
D04 Setup观察与D10执行绑定配置分屏差异；D09 CL动画只作教学/检查，不授D15；D13 UNKNOWN显示发布阻断。任何审批、签名、真实Windows安装和GPU结果目前均NOT_RUN。
[主实施任务](../T5-03.md) · [合成锁](contract.example.json) · [规则追踪](../../../research/traces/T5-03.json)。