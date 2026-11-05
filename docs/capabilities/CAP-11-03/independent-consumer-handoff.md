# CAP-11-03｜17资产Owner会签与独立消费者

原始[17资产Owner候选](../../architecture/v0.8/business-assets.json)及[逐D接口](asset-owner-candidates.json)均**PENDING_HUMAN**。11域只能生成派生索引，不接管任何D01—D17 Writer；每个索引项需精确Owner、Source revision、rawHash、ScopeEpoch、许可、unitOrNA、frameOrNA。D04名义工艺Setup≠D10实际执行Frame。

## 不同进程/不同业务Owner的消费测试（NOT_RUN）

05工艺规划独立进程和09/10 NC验证与发布独立消费者，必须使用自己的Port及业务ACL读取同一RAG快照，验证不同租户Project、三轴和B5、两个Setup、类似牌号但不同热处理、同名机床不同构型、离线旧索引、撤权、删文档、Embedding换代、被污染文本、取消晚ACK、重复调用、CAS竞态。必须记录Provider/Consumer exact git SHA及二进制hash、原始测试输入及合法使用权、Frame、命令、退出码、日志与失败原因；不得将本合成布尔判断器冒充独立消费者PASS。

## 扩展—迁移—退出与恢复

Expand：与旧Reader并行创建合规的只读影子索引并做引用Diff，不复制私有模型、客户源数据或标准盗版全文。Migrate：只有Owner授权与独立消费者明确签署，才将11域新Reader置为可读入口。Contract：保留旧Reader受控回滚窗口和撤权清理计划；新索引异常则退回旧Reader并拒绝过期引用，不影响冻结D08、已批准D12/D16或D17追加事实。回滚后重新写业务建议仍需要Owner重验ACL/CAS。

[历史原始附件缺口](../../../tracking/pending-source-gaps-2026-10-19.json)保持如实待核，不把新编fixtures当作原字节恢复。规划PASS≠产品PASS，真实工程/浏览器/消费者NOT_RUN。
