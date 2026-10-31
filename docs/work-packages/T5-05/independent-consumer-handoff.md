# T5-05｜跨团队独立消费者、故障注入、回退及交接

**切片A**：procet-agent团队提供2D/Docs→OCR候选→人工确认→D01/D02领域Owner CAS→D04 Setup/05、06消费。独立消费者必须在不同进程以exact图纸/模型revision/hash/Frame重放，测试错误hash、错误Frame、人工未确认、撤权、取消晚回执均拒绝。OCR不自动成为权威PMI，不覆盖D08。

**切片B**：procet-cam团队提供D09 CL→D12最终NC→D13独立语义→D14机床轴时序→D15程序级验证→D16发布。独立消费者以不同进程校验控制器UNKNOWN、D10机床配置过期、轴限、D15失效、发布版本不一致等拒绝。CL动画不能冒充NC工程验证，材料扫掠仿真不在本计划内。

双方**不得修改对方私有源码**，仅依赖经过版本锁定的C0最小协议和D01-D17唯一Owner Port；审查人为非提交者。Producer、Consumer分别记录仓HEAD、产物二进制Hash、Schema/ABI、输入Golden Hash、执行命令、退出码、日志Hash。Pact HTTP契约不替代Native/领域Port真实进程。

新成员需在**空目录**从版本锁加载离线依赖/工具链/Native ABI与脱敏Golden，不删除既有用户数据库，证明同案例输出匹配；网络不可用/未执行时记录NOT_RUN而非伪PASS。冲突注入：故意改Schema、revision、hash、Frame、权限、D13语义，必须由独立消费者检测。旧Reader和故障记录保留。

**回退**：A可撤回自身候选Reader/Port但不写D08；B回退NC/控制器组合锁且不删除已审批D16、现场D17和任何用户数据。迁移先Expand→Migrate→Contract；人类Owner批准后方可退出旧实现。业务签署/独立进程/真实NC、新环境全部NOT_RUN/PENDING。

[原包十任务](../T5-05.md) · [候选Owner](asset-owner-candidates.json)。
