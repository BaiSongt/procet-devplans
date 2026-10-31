# E3-03｜独立消费方与实际测试交接
主责08域D13；09域D14/D15为独立消费者、10域D16为最终审阅，业务Owner签署 PENDING。
交接必须含NC bytes SHA-256（原UTF-8逐字节计算）、精确D12/D10/控制器profile/刀表/偏置/Frame、未支持语义列表、sourceLineMap、事件前后模态SHA、有限步数/时间预算和回滚版本。
D14消费者至少复核正反NC行映射、坐标/补偿及UNKNOWN后的禁止轴时序派生；D15独立复核NC程序级风险，不能继承D11/CL假通过。D16应核对最终NC、配置、D13解释、D14轴运动及D15验收的同一来源闭包，不满足即拒绝发布。
测试入口：`python tools/check_e303_planning_2026_10_24.py --root . --self-test`仅结构及字段级模拟PASS；Rust/TS真实解释器、实际控制器对照、GUI运行和机床测试 NOT_RUN。验收方应提供exact-HEAD、本地运行命令与完整原始日志。
