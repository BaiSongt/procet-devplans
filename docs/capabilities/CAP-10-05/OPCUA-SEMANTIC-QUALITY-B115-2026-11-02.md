# CAP-10-05｜B115 OPC UA语义/结构变更、质量证据与机床作业模型迁移

**2026-11-02 · V0.8正式规划补证 · L1/L2/原88 CAP/36包/17资产分母不变，L3待审。** 本专项与B64 Publish/Republish缺口、B65 MTConnect uint64游标**互补而不覆盖**：此处只研究单条 OPC UA DataValue 的可信性、协议元数据变化和作业数据映射。所有状态均为规划验证，真实机床/独立消费者未验。

## 1. 新发现及不可越界的推论

1. **Good/Uncertain/Bad是值可用性，不是机床状态码。** OPC 10000-4 §7.11要求客户检查StatusCode；Bad/Uncertain不能继续当成有效设备运行事实。Bad可能带NULL，NULL不可合成上一个值为当前正常状态。
2. **三个时钟不能互相替换。** SourceTimestamp由源赋予，ServerTimestamp是服务器收到或确认值的时间；D17 ingestTimestamp属Procet采集器自己的写入时间。设备时钟未知时不可声称纳秒级跨机同步，也不凭单一时戳重建NC轴时序。
3. **SemanticsChanged != StructureChanged。** §7.38里的SemanticsChanged要求重新读取单位/范围等相关元数据；StructureChanged要求刷新DataTypeDefinition和解析模型。二者不可仅以“重新订阅成功”消除，也不可自动转换旧历史原始字节。
4. **队列Overflow是丢样证据。** §7.25.2与§5.13区分已检测变化、入队和发布；大于1队列中的Overflow位意味着至少部分已检测变化未返回。queueSize=1时不能由“没看到Overflow”推断完整历史。D17必须记录GAP/UNKNOWN及原StatusCode，不插值制造缺失告警。
5. **requestedSamplingInterval不是effective。** §5.13.2.2返回revisedSamplingInterval、revisedQueueSize；实际底层设备更新周期可能更慢。以请求50ms直接在报表宣称20Hz原始传感器采样是错误的。
6. **MachineTool OPC 40501-1 v1.02.0旧Production模型标记deprecated，不等于已删除。** §8.4和§16说明旧模型向OPC 40001-3作业管理迁移，原节点与新模型对应不能仅凭名字或旧状态硬对齐；运行状态也不等于已执行D16某个具体NC的最终字节。

## 2. 实施任务、字段与追踪

|规则|Owner候选、字段门禁|原编号工作包|预期失败|
|---|---|---|---|
|B115-R01|状态码门禁：Bad/Uncertain值不可变成可信设备运行事实；`severity`、`valuePresent`、`claimValid`；资产D03/D17 |E3-06/T5-03 |REJECT/UNKNOWN|
|B115-R02|三时钟来源：源时钟、服务器时钟、采集时钟分别保真；`sourceTime`、`serverTime`、`ingestTime`、`sourceClockTrusted`、`conflatesClock`；资产D03/D10/D17 |E3-06/T5-03 |UNKNOWN/REJECT|
|B115-R03|SemanticsChanged需重读单位/范围元数据及精确映射修订；`semanticsChanged`、`metadataFresh`、`namespaceExact`、`mappingRevisionPinned`；资产D03/D17 |E3-06/T5-03 |STALE|
|B115-R04|StructureChanged需重读DataTypeDefinition并换代解析器；`structureChanged`、`typeMetadataFresh`、`parserRevisionPinned`、`rawPreserved`；资产D03/D17 |E3-06/T5-03 |UNKNOWN/STALE/REJECT|
|B115-R05|队列Overflow/无连续性证据写GAP，不能插值补造历史；`overflow`、`gapLedgerWritten`、`continuousClaim`、`queueSize`；资产D03/D17 |E3-06/T5-03 |GAP/UNKNOWN/REJECT|
|B115-R06|协商后的采样周期/队列规模独立记录，不冒充请求值；`requestedSamplingMs`、`revisedSamplingMs`、`effectiveIntervalRecorded`、`actualQueueRecorded`、`claimsRequestedRate`；资产D03/D17 |E3-06/T5-03 |UNKNOWN/REJECT|
|B115-R07|40501-1 v1.02旧Production节点弃用和Job数据语义迁移；`machineToolVersion`、`deprecatedProductionUsed`、`jobModelMapped`、`claimsNcCompleted`；资产D03/D12/D16/D17 |E3-06/T5-03 |UNKNOWN/REJECT|
|B115-R08|D17 Owner权限/CAS/取消Fence及三入口与NC隔离；`d03Exact`、`d17Cas`、`aclCurrent`、`cancelled`、`samePort`、`singleWorld`、`leftPanel`、`claimsD15`；资产D01/D03/D04/D10/D13/D14/D15/D16/D17 |E3-06/T5-03 |STALE/REJECT|

[分级来源、作者/版本/日期/阅读深度](../../../research/sources/CAP-10-05-opcua-semantic-b115.json) → [8规则/来源ID/字段/CAP/原编号包/正反ID](../../../research/traces/CAP-10-05-opcua-semantic-b115-v08.json) → [8正29反含GAP/STALE/UNKNOWN](opcua-semantic-b115-fixtures-v08.json) → [只读Node规划检查器](../../../tools/check_cap1005_opcua_semantic_b115_v08.cjs) → [核验等级](../../../tracking/cap1005-opcua-semantic-b115-verification-2026-11-02.json)。每条规则至少一正三反，故障场景仅改变一个输入字段。规则R02、R08的ACL、CAS、GUI约束来自原CAP**内生设计**，不把它们错误归为OPC强制规范。

## 3. Owner Port及交互合同

拟议`10.MdcObservationPort.appendQualityQualifiedObservationCAS`（**接口草案，非产品现有API**）输入 `machineRefD03Revision/hash`、`namespaceURI/NodeId/adapterProfileVersion`、`rawDataValueHash`、`statusCode`、`semanticsChanged/structureChanged`、`sourceTimestamp/serverTimestamp/ingestTimestamp`、`metadataRevision/hash`、`requested/revisedSamplingInterval`、`revisedQueueSize`、`expectedD17Revision/hash`、`scopeEpoch/cancelEpoch`，以及**适用时**`D10PhysicalBindingRevision/hash/Frame`。返回候选 `CANDIDATE`、`GAP`、`UNKNOWN`、`STALE`、`REJECT` 与原始理由；D17只追加原始观测与质量/元数据血缘，不覆盖历史D08或旧D17。

D03为机床Profile与数据项映射Owner，D17为采集事实Owner；D04是名义Setup、D10是独立真实机床执行绑定。GUI的ActivityRail「现场→MDC」只展开统一左`UnifiedTaskPanel`；唯一Babylon Engine/Scene/Canvas投影设备状态，**没有D10精确Frame时不将采样定位到加工空间**。字号不超过12px，浅色/深色主题。GUI/CLI/Agent访问同一个10域Owner Port，Agent没有直接写控制器或DNC权限；读到过期NodeId、重建Subscription、时钟偏移、取消晚ACK时必须重新查ACL、ScopeEpoch、Revision/Hash、Frame及CAS。

完整链路仍为中立CL→NC后处理生成D12最终字节→D13控制器语义→D14轴时序→D15独立工程验证→D16受控签发。**D17采样/告警/工单关联既不能反推该链已验证，也不能发CycleStart。** 未知配置返回UNKNOWN；本规划不做材料扫掠仿真。

## 4. 独立消费者、迁移回退和验收分层

验收应由独立的受控D17消费进程、获授权的测试OPC UA服务器及不同于生成器的Oracle执行：采样Good/Bad/Uncertain/NULL；单位变化置SemanticsChanged、结构变更置StructureChanged、解析器旧版；queueSize=1与>1 Overflow；requested 50ms→revised 200ms；40501-1旧Production与40001-3新Job模型可选/缺失及多版本元数据；CAS冲突、撤权、Scope切换、晚ACK；人工复核时戳和每个原字节Hash。无实测证据时只保留UNKNOWN/GAP，**不得补造历史、签发或机床验证通过**。

迁移采用旧Reader影子双读、元数据快照版本化、新旧字段映射差异报告；只有独立消费者验收通过并由Owner批准后才能切换Writer。读错/固件变化/语义标志不兼容立刻回退只读，保留历史D17、D16和A/B冻结修订；不能静默将旧观测按新单位重新计算而覆盖原值。

## 5. 研究证据边界及核验

- OPC Foundation Part4 v1.05.07：官网公开HTML指定§7.11、§7.38、§7.25.2、§5.13.2.2已定点阅读，未验证具体控制器或私有DataType。
- OPC Foundation/VDW MachineTool Part1 v1.02.0（2024-11-01）：公开HTML§8.4/§16与附录映射已读；deprecated不等于物理删除或任何固件必定实现新模型。
- NIST 2016 Michaloski等：仅官方出版摘要，未读取论文全文，不能成为细字段证据。
- 固定CAP-10-05业务原稿：已由GitHub连接器读取；Owner/CAS/GUI/独立消费者规则属于内生规划，待人审。

合成用例由同一个`judge`函数验证，**不属于独立Oracle或真实产品验收**；独立Node文件进程、真实OPC UA/MTConnect/NC/B5/OEM/17资产正式Owner签署及消费者、全仓GFM AST、历史附件原字节、L3均未完成。**规划PASS≠产品PASS。**
