# U4-04｜真实独立消费者验收与安全回退（计划）
 
## 执行前提
使用用户后续明确批准的锁定产品二进制：D12 NC Writer、D13控制器适配器、D14轴时序、D15验证器、D06求解器、D04/D10数据Owner与GUI/CLI/Agent读端。记录每个进程/二进制hash、源仓exact HEAD、配置与机床运动链、输入NC字节hash、控制器方言、Setup Frame id/rev/hash、权限epoch、测试者与时间。无真实锁定组合不得填写PASS。
 
## 可独立复现的消费者契约
消费端在独立进程调用`DiagnosticQuery.readExact`返回D12 BlockRange→D13 Actions→D14 Axes→D15 Evidence多对多边，按sourceOwner+revision+contentHash+frameHash逐边重算一致性；若旧NC已失效或私有M码未建模，必须返回`SOURCE_GAP/UNKNOWN_SEMANTICS`及可定位的断边，D16不得获得发布资格。交叉查询`D06RunRef`必须匹配Owner持久化样本，断电恢复后不可虚构前端进度。
 
**必跑独立正例**：同Setup完整源链、重复N号依字节偏移仍正确、单Block展开多轴事件、真实样本稳定取回、仅D12改动影响局部闭包。**必跑反例**：改NC一字节/Frame，D13未知G/M/宏，缺D14采样，D15仅部分覆盖，旧Setup晚回执，ACL撤销，强杀恢复回执终态不明，OTel被完全采样丢弃。输出退出码、日志、机器可读证据路径及测试fixture原始hash。
 
## 迁移和回退
第一步EXPAND：旧日志只读导入并标`LEGACY_UNVERIFIED`，不可靠N号或时间戳填缺失哈希。第二步MIGRATE：运行新旧双读比对，但**绝不双写领域Owner**。第三步CONTRACT：全消费者版本与真实负例验收、人类审批通过后才删除旧只读适配。任何失败立即禁用新诊断投影并恢复旧读取组合，D08冻结、NC程序和用户工程原始记录不删除、不覆盖。人工签署必须由17资产实际Owner承担，本仓不能自签。
 
## 判据
规划JSON/链接检查可为PASS；独立真实消费者、控制器执行语义、机床验证和性能均须保留`NOT_RUN`直至真实证据到位。CL动画不能冒充D15验证，不开发材料扫掠仿真。
