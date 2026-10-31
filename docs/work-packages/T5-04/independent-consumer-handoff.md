# T5-04｜独立消费者、17Owner人类会签及回退

此文件是执行交接要求，不是产品签收。真实验证命令需要固定Producer/Consumer exact SHA、Schema版本、Frame、数据hash、独立进程运行环境和最终二进制构建hash，不准使用同实现mock代替。公开仓只记录受控证据位置或标记CONTROLLED_NOT_PUBLIC。

|独立消费者|生产与读取链|关键反例/待执行测试|状态|
|---|---|---|---|
|03域Reader|D01/D02旧/新CAD与PMI|旧工程/未知版本保留可诊断|NOT_RUN|
|04域Setup|D03→D04、D10|Frame逆检与D04/D10不混同|NOT_RUN|
|05域工艺|D05/D06/D07/D08|A/B同事实、不覆盖冻结|NOT_RUN|
|07域CAM|D08→D09|只创建中立CL|NOT_RUN|
|08域NC|D09/D10→D12/D13|最终NC重解，UNKNOWN阻断|NOT_RUN|
|09域验证|D13→D14→D15|D11/CL不能冒充D15|NOT_RUN|
|10域发布|D15→D16/D17|签署、权限与失效重验|NOT_RUN|

每资产Owner须登记Owner身份、人工审批时间、源/目标版本、Hash/Frame、回退读取器、恢复实测、是否认可退旧。17资产正式会签目前全部PENDING_HUMAN。旧Reader测试、Schema异常、断电恢复、取消晚回执、组合锁双回退必须全部有真实日志才可将Contract从BLOCKED转换为APPROVED。无网现场必须验证Win11及依赖。

[详细T5-04](../T5-04.md) · [操作协议](migration-runbook.md) · [合成规则](../../../research/traces/T5-04.json)。规划PASS≠产品PASS。
