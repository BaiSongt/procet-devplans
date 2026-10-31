# CAP-10-07｜B40 现场观察时间、设备代次与D17工程变更非因果资格

**2026-10-30 研究补证。** 沿用原[CAP-10-07异常反馈](README.md)与原E3-06、T5-03；11域、88 CAP、36原包、17资产不变；L1/L2冻结，L3人类待审。D17是现场观察的追加事件，不是质量合格证、维修证明或复工许可。

## 研究发现与误判反例

- [MTConnect官方2.5.0目录](https://docs.mtconnect.org/)可核对2026-01-05发布目录，但本轮**没有读2.5 PDF正文**；[MTConnect 2.4公开SysML示例](https://model.mtconnect.org/Version2.4/ObservationInformationModel/)展示Condition/Event/Sample、`dataItemId`、`sequence`、`timestamp`以及`UNAVAILABLE`。不能由示例推断每个DataItem的sequence连续，也不能把2.4例子称为2.5规范正文。收集Agent重启或数据保留窗丢失时必须保留断档UNKNOWN。
- 将`eventUtcMs`与`ingestUtcMs`分开；观察时间落入程序运行窗口（考虑已知时钟不确定度）**至多支持候选关联**，不证明该NC导致报警，且不表明真实执行了哪个程序。合成例：运行[90000,105000]ms，观察100000ms，误差±1000ms，记录仅为`PROPOSE_ONLY`；观察107000ms超过扩展窗应`UNLINKED`。这些数字仅为自编测试向量，不来自标准阈值。
- 现场设备名称、任务名和传输ACK不能替代D16已签发原始NC字节/子程序闭包、D10实际机床控制器与Frame、收方独立回读。即便收到MTConnect状态`NORMAL`或OPC的Ack，也不能推断维修成功、质量OK、CycleStart许可。
- [W3C PROV-O 2013](https://www.w3.org/TR/prov-o/)的`wasGeneratedBy/wasDerivedFrom/wasRevisionOf`提供来源/修订表达。D17原始Observation、D17更正事件、D01新变更草稿构成独立实体；更正不能重写原始证据，事件关系不能代替因果实验。新Revision指向旧版本而非反向覆盖A/B冻结D08。
- [NIST IR 8536 Final，2026-09-09](https://csrc.nist.gov/pubs/ir/8536/final)官方摘要提出可验证的跨系统制造溯源与加密链接背景；本轮**只读目录、作者、Abstract及历史**，没有读报告PDF/执行开源实现，不据其摘要推导本地CAS强制条款。

## 八条可机检规则与责任界面

|规则|风险/字段（完整字段见机器Trace）|领域Owner、原工作包|资格|
|---|---|---|---|
|B40-R1|MTConnect实例代次、请求窗口与序号语义；`stream.instance`、`stream.expectedInstance`、`stream.requestSeq`等|D03/D17；E3-06/T5-03|候选/未知分级|
|B40-R2|观察时间/接收时间、时钟资格及非因果窗口；`time.eventUtcMs`、`time.ingestUtcMs`、`time.clockQualified`等|D10/D16/D17；E3-06/T5-03|候选/未知分级|
|B40-R3|原始观察事件类型及Ack非维修证明；`observation.eventId`、`observation.rawSha`、`observation.dataItemId`等|D03/D17；E3-06/T5-03|候选/未知分级|
|B40-R4|现场观测与D16/D10/D12原始收方证据精确绑定；`binding.d16`、`binding.d10`、`binding.expectedMachine`等|D10/D12/D16/D17；E3-06/T5-03|候选/未知分级|
|B40-R5|D17追加更正与外部质量Owner不被遥测劫持；`feedback.d17AppendOnly`、`feedback.correctionAsNew`、`feedback.externalQualityOwner`等|D01/D17；E3-06/T5-03|候选/未知分级|
|B40-R6|PROV来源关联及A/B冻结新Revision分叉；`change.newDraftOnly`、`change.freezeBefore`、`change.freezeAfter`等|D01/D05/D08/D17；E3-06/T5-03|只能新草稿，冻结不变|
|B40-R7|Owner exact revision/hash/frame与ACL/SCOPE/CAS取消晚回执；`owner.expectedRevision`、`owner.currentRevision`、`owner.expectedHash`等|D01/D16/D17；E3-06/T5-03|候选/未知分级|
|B40-R8|D04与D10隔离及D13-D16阻放行、同Port单3D迁移；`flow.d04`、`flow.d10`、`flow.d13`等|D04/D08/D09/D10/D12/D13/D14/D15/D16/D17；E3-06/T5-03|产品D15/D16不因观察放行|

**业务链**：D03和现场独立数据Owner提供observations→10域`FieldEngineeringChangePort.ingestEvidence`由D17 Owner以exact revision/hash/frame及源指纹追加→GUI/CLI/Agent共用`qualifyIncident`与`proposeChange`只读查询→D01 Owner按CAS重验生成**新**修订草案；旧D08只读。提交前重验ACL/scopeEpoch、generation/cancelEpoch、事件幂等键；旧权限或取消后的晚回执只留审计，不得产生新提交。未知资产Owner正式签署记`PENDING_HUMAN`。

**NC保护**：D04名义Setup≠D10现场执行绑定；中立D09 CL（与D11 CL预演）→最终D12 NC→D13控制器执行语义→D14物理轴时序→D15独立工程验证→D16发布审批。任何影响D10/D12的变更重算资格并阻旧发布；未知语义显式`UNKNOWN`，CL动画不作NC认证，不做材料扫掠仿真。

**GUI/3D与迁移**：ActivityRail的现场反馈进入唯一左UnifiedTaskPanel，12px最大字体，单Babylon Engine/Scene/Canvas（工程/制造资源为同世界活动根切换），不会新建“监控第二3D”。3D选取及告警列表仅为投影；旧D17 Reader保留影子双读，发生解析/时钟/事件代次不兼容即回退为只读，不删除原始D17或冻结数据。

**独立消费者待验**：对真实MTConnect Agent重启、first/lastSequence保留窗、跨设备UTC偏移、乱序/延时、接收端NC回读、外部质量系统Owner审批与取消晚ACK进行成套测试；两套不同控制器Profile对比；原始录波及真实D17收方进程必须提供可审计证据。当前正式签署0/17、真实独立消费者0/17、Node文件独立进程/MTConnect/OCCT/NC/B5/OEM全部`NOT_RUN`。

[6项来源和阅读深度](../../../research/sources/CAP-10-07-event-provenance-b40.json) → [8规则/字段/正反引用](../../../research/traces/CAP-10-07-event-provenance-b40-v08.json) → [4正、69反、4未知合成](event-provenance-b40-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap1007_event_provenance_b40_v08.cjs) → [执行分级](../../../tracking/cap1007-event-provenance-b40-verification-2026-10-30.json)。

**规划PASS≠产品PASS。** 标准目录与公开SysML示例非交叉版本认证，合成正反例不等于真实物理因果或生产安全。
