# U4-06｜独立消费者验收矩阵与交接
> 本文件定义未来真实验收；不声称产品实现、模块加载、GPU/Windows/Tauri或NC验证PASS。须在独立进程、隔离测试工程、固定产品exact HEAD/模块包digest/权限配置下由非实现者执行，不能使用客户真实敏感数据。

**可接受的真实正向证据：** 锁定内置示例“几何Inspector”模块后UI无Shell特定分支变化；Ribbon/ActivityRail/左TaskPanel/单Babylon 3D仅新增Contribution；GUI/CLI/Agent对同一D04/D08资产和权限返回同一事实；卸载命令/订阅/事件/OverlayLease余数全部0；共享Scene、D08冻结hash完全未变；重开旧工程通过兼容reader读取。每项提交测试用例、执行日志、二进制hash、消费者源码hash、操作人及复核者、权限与修订快照、预期实际结果。

**独立反向证据：** 错SDK主版本、重复moduleId不同hash、未知强制权限、未可信bundle、自授backend Ready、Tauri拒绝invoke、Owner权限被撤销、错误frame/hash、并发CAS冲突、任务取消后晚回执分别Fail Closed；不得更换账户/API绕过拒绝。强杀/重启后不能留下半挂载并伪造成功，30次启停/不同Setup切换不累积Observable和Overlay。D13未知控制器语义阻D16，CL动画不得升级为NC验证。

**实施判据：** 规划工具仅10正+10反+10不同字段变异，不能代替Node独立文件或产品测试。真实消费者需17资产Owner签字、L3评审后方可开始去旧适配；unknown和无法观测指标一律NOT_RUN/UNKNOWN而非PASS。迁移失效时恢复上一个稳定内置包/只读适配，不改用户库和冻结记录。
