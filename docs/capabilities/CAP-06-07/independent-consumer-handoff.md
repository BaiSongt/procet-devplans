# CAP-06-07｜独立Oracle消费者交接与验收
锁定产品HEAD及实际二进制sha256，分开运行候选生成器和独立Oracle，记录二者进程/代码路径、OCCT构建参数、合法BRep/STEP输入字节、工程/Setup/Frame、容差Policy。独立复算与校验需要真实Boolean、BRep有效性、前后闭合体积、保护区与岛屿；同一内核的共同失效必须登记，不能以两个进程冒充完全算法独立。

实际正反回归场景：实体腔体、内岛/多环、多Solid、薄壁/错Frame/错误单位、重叠去料与材料状态差异、非闭合拓扑、保护区侵入；留出校准数据缺失、搜索预算耗尽、收敛虚假平台期、撤权/换HEAD/取消晚回执均要求拒绝。记录命令、二进制与输入哈希、退出码、stdout/stderr、每轮原始残差与Oracle证据、Stage/Seal/CAS/回执之前强杀重启持久对账，不能假定跨SQLite库有分布式ACID。

预期未来证据包`artifacts/cap-06-07/<product-head>/<case>/`保存run.json、inputs.sha256、oracle.json、residuals.json、calibration.json、owner-receipt.json、consumer-result.json、stderr。规划fixture不可冒充真实进程验收；几何Oracle PASS不授予D08或D15/D16资格。当前独立消费者、真实OCCT、机床、17 Owner签署`NOT_RUN/PENDING`。