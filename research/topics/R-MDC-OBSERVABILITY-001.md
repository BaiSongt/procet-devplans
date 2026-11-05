# R-MDC-OBSERVABILITY-001｜MDC观测、序列缺口与来源

**范围**：CAP-10-05，原工作包E3-06/T5-03，原17资产D03/D04/D10/D12-D17。

### 已核对的公开来源
MTConnect Institute/AMT `Part 1.0 Fundamentals v2.5.0`（2026-01-05）**正式PDF印刷页37、40、54**分别明确Agent实例/sequence、UNAVAILABLE及sample OUT_OF_RANGE，已核对对应页截图；仅归因这三部分。OPC Machine Tools `1.02.0`（2024-11-01）公开HTML§5/§6/§8.4.4区分设备状态、作业和弃用程序模型。OPC Services `1.05.07`公开§7.11及§7.25.2区分StatusCode、Source/Server时间、队列Overflow。<https://www.nist.gov/publications/spatial-and-temporal-data-alignment-disparate-sources-feature-association>（Standfield等，2024-04-25）以及Michaloski等（2016-06-27）**只读NIST摘要**，不能宣称论文全文实验重现。

### 项目推导（非标准原话）
1. 序列主键含`(deviceUuid,agentInstanceId,sequence,adapterRevision)`，Agent重启/GAP不可补造。
2. `sourceTimestamp/serverTimestamp/ingestedAt`+clockQuality分别存在，未知时钟不能声称精准NC工序时序。
3. D17采集仅append现场观察，D03为资源映射真值；D04≠D10，MDC运行灯不授D15/D16资格。中立CL→最终NC→D13→D14→D15→D16仍独立。
4. 同10域Port服务GUI/CLI/Agent；单Babylon左TaskPanel；CAS/ACL/取消晚回执，旧reader无损回退。

**未完成**：实际MTConnect/OPC机床、厂商许可、低延迟、多通道时钟对齐、独立NC程序关联和消费者现场验证全部NOT_RUN；L3和17资产Owner会签PENDING_HUMAN。

[来源](../sources/CAP-10-05.json) → [规则](../traces/CAP-10-05.json) → [68合成用例](../../docs/capabilities/CAP-10-05/fixtures.json)。**规划PASS≠产品PASS**。
