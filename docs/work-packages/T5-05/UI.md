# T5-05｜统一GUI/3D双切片交互规划

唯一Babylon Engine/Scene/世界，Ribbon与ActivityRail只做导航，A/B复用**同一个左TaskPanel**，Agent浮窗可独立开关。最大字号12px、仅浅/深主题，不豁免可访问性真实回归。GUI、CLI、Agent同一个领域Owner Port，TaskPanel不直接写资产。

A显示2D/Docs来源revision/hash、OCR候选、人工确认、D01/D02 CAS回执与D04 Setup姿态；未经确认的PMI仅以OverlayLease显示。B显示D09 CL→D12 NC→D13支持/UNKNOWN→D14轴时序→D15证据→D16发布阻断。D04 Setup不同于D10机床执行绑定，D11 CL动画必须标注“预览非NC验证”，不做材料扫掠仿真。

切换/ESC/取消释放Observer、Gizmo和OverlayLease，保存未提交脏草稿；输入精确FrameRef、scope与acl epoch；提交前Owner重验CAS、权限、任务代次和取消。正在执行的工具状态取真实回执，晚回执只记原task，不污染当前场景。真实GUI/GPU/Owner测试NOT_RUN。

[实施](../T5-05.md) · [消费者交接](independent-consumer-handoff.md) · [规则](../../../research/traces/T5-05.json)。
