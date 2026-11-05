# T5-06｜GUI/3D质量与回归工作台
仅使用**单Babylon Engine/Scene/世界**；ActivityRail只做导航，左侧**统一TaskPanel**呈现质量Golden、性能历史、故障注入、NC验证和新能力准入。Agent面板可以独立开合。最大字号12px，仅浅/深主题，实际无障碍回归另行测试。

QualityTask以案例/作用域/Owner revision/hash/Frame/环境锁显示，四态PASS/FAIL/UNKNOWN/NOT_RUN不得互相替换。每张历史性能曲线必须筛选相同输入hash、机器/ABI/系统/工具链；阈值来自逐案例批准，不默认经验百分比。工作中的工具调用显式显示当前工具与等待状态；取消/ESC/切换释放Observer、Gizmo和OverlayLease，晚回执只进入原任务审计。

GUI、CLI与Agent走同一领域Owner Port。Owner提交时CAS、ACL、Frame、scopeEpoch与任务代次/取消重验；Agent建议及CL可视化不能直接写业务事实。D04 Setup与D10真实执行配置分开；D09 CL预览贴“**非最终NC工程验证**”，D12→D13→D14→D15→D16的每段显示exact哈希和阻断原因；D13=UNKNOWN或D15=NOT_RUN不可显示绿色发布。无材料扫掠仿真。真实GUI/GPU/Owner执行NOT_RUN。

[原工作包](../T5-06.md) · [规则字段](../../../research/traces/T5-06.json) · [独立消费者](independent-consumer-handoff.md)。
