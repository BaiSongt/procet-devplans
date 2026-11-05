# T5-03｜独立消费者、兼容窗口与风险交接
这是一份**未来执行验收协议**，不是已通过的产品测试。每条记录必须包含producer/consumer exact HEAD、真实binary hash、契约版本、OS/ABI、输入fixture、正反结果、日志hash、签发/复核责任与可定位回退锁。私有仓精确SHA放受控交接文件，不写入public规划。
|独立消费者|必须执行的正向/反向场景|当前|
|---|---|---|
|GUI→contracts/Owner|同一业务资产readExact/commitCAS；错误权限、旧版本、错Frame及取消晚回执|NOT_RUN|
|D09→D12|真实中立CL与最终NC字节、后处理方言锁；手改NC后旧证据失效|NOT_RUN|
|D12→D13→D14|已声明控制器语义→轴时序；未知宏、错偏置、运动学奇异与越限|NOT_RUN|
|D14→D15→D16|独立程序验证正例，过期D15/未知语义/无审批负例|NOT_RUN|
|旧reader→新组合|受权脱敏工程新旧双读、快照迁移与强杀恢复|NOT_RUN|
|Windows无网接收|离线依赖、installer+lock成对、签名可信根与接收hash|NOT_RUN|
版本窗口从Expand兼容reader开始，Migrate后独立消费者实测、签字方可Contract；旧组合/用户工程/数据库/D08冻结/历史NC不可原地重写。回滚必须相同一对installer+composition lock，保存签收和失败证据。离线吊销不可及时获知、Native二进制兼容、第三方授权、D13专有控制器语义是显式风险，未证就UNKNOWN。
17资产Owner域候选见[候选清单](asset-owner-candidates.json)，无授权个人签字；10域D16受控发布与现场D17签收各自负责，不能用计划文档当交付事实。
[主规格](../T5-03.md) · [机器正反验收](../../../research/traces/T5-03.json)。