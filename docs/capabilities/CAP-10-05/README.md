## 2026-10-31｜B64 OPC UA订阅恢复专项补证（不改变原十任务）
[Publish/Republish/Keepalive/Session/ACK先落盘研究](OPCUA-SUBSCRIPTION-GAP-B64-2026-10-31.md) · [来源](../../../research/sources/CAP-10-05-opcua-subscription-b64.json) · [8规则](../../../research/traces/CAP-10-05-opcua-subscription-b64-v08.json) · [68独立合成](opcua-subscription-b64-fixtures-v08.json) · [验证级别](../../../tracking/cap1005-opcua-subscription-b64-verification-2026-10-31.json)。原十任务和R01–R10保留，新增B64-R01..08属于补证，不冒充真实MDC/产品验收；L3待审。**规划PASS≠产品PASS。**

# CAP-10-05｜MDC数据采集（V0.8，L3待审）

**原88项目标**：设备状态、报警、运行信息采集；原编号关联E3-06/T5-03。为长期扩展能力，本轮仅制定实施级规格，不宣称MVP产品已实现。

## 关键职责和禁区
- **02域D03**提供机床身份、Profile、点位映射；**10域D17**唯一追加保存原始Observation、报警、质量和反馈；D04名义Setup与D10现场执行绑定严格分离。
- 08域D12最终NC字节、D13控制器执行语义，以及09域D14 Joint时序、D15独立工程验证不能由MDC接管。运行灯/报警/采样**不能证明**某NC已执行、D15通过或工单完工。链路中立CL→后处理最终NC→D13→D14→D15→D16受控发布不变；不做材料扫掠仿真。
- MTConnect v2.5.0需以Agent实例及sequence发现buffer缺口；OPC UA须区分SourceTimestamp、ServerTimestamp、ingestTimestamp与StatusCode。未知映射、设备时钟、控制器能力均UNKNOWN，GAP不静默插值。
- 公共C0仅identity/revision/hash/unit/frame/scope/protocol，不再建巨型common。L1/L2不变，L3待审；A/B共用工程事实不覆盖冻结D08。

## 十项可实施任务及反向门禁
- **T01 设备注册与协议能力发现**：只读发现D03设备UUID、固件、协议与Adapter exact版本；未知时不尝试私有命令。 **对应CAP-10-05-R01**，逐字段1正4独立负例。
- **T02 MTConnect Agent断点续采**：以(instanceId,sequence)追踪MTConnect流；OUT_OF_RANGE、重启、buffer溢出形成显式GAP。 **对应CAP-10-05-R02**，逐字段1正4独立负例。
- **T03 OPC订阅、时钟与质量**：分离OPC source/server与接收时间，记录StatusCode与队列Overflow，不能默认时间同步。 **对应CAP-10-05-R03**，逐字段1正4独立负例。
- **T04 原始点位与命名空间映射**：保留DataItemId/NodeId/NamespaceURI与raw payload hash；02域D03拥有映射版本。 **对应CAP-10-05-R04**，逐字段1正4独立负例。
- **T05 单位Frame与实装边界**：字段含单位、Frame引用和校准来源；没有实际D10证据只显示无定位观测。 **对应CAP-10-05-R05**，逐字段1正4独立负例。
- **T06 缺口/UNAVAILABLE/质量状态**：UNAVAILABLE、断网、采样延迟按质量层保存，不插值填造机器执行事实。 **对应CAP-10-05-R06**，逐字段1正4独立负例。
- **T07 报警状态生命周期**：Alarm激活/清除、唯一事件ID与设备关联，恢复信息无证据则保持UNKNOWN。 **对应CAP-10-05-R07**，逐字段1正4独立负例。
- **T08 关联D16工单与D12程序**：D17只是观测，D16关联要独立NC与工单证据，绝不授D15工程PASS。 **对应CAP-10-05-R08**，逐字段1正4独立负例。
- **T09 Owner CAS/权限与异步取消**：提交D17前CAS(expectedRevision/hash/frame)、ACL、scopeEpoch及cancelToken重验，晚ACK拒绝。 **对应CAP-10-05-R09**，逐字段1正4独立负例。
- **T10 三入口同Port、独立消费者、迁移回退**：GUI/CLI/Agent调用10域MdcObservationPort，单Babylon与统一左TaskPanel，双读旧Reader并可回退。 **对应CAP-10-05-R10**，逐字段1正4独立负例。

## 研究到工程规则的逐项追踪
- **CAP-10-05-R01 设备身份及只读能力**：只读能力探测必须核对D03真实设备UUID与Adapter Profile，严禁将DNC传输权当观测权。字段`identity.machineRefExact`、`identity.adapterRevisionPinned`、`identity.readOnlyDiscovered`、`identity.noControllerWrite`；来源C1005-S01/C1005-S02/C1005-S07；Owner资产D03/D17；原包E3-06/T5-03。
- **CAP-10-05-R02 MTConnect流断点和Agent重启**：按Agent实例和sequence单调性记账；重启、缓冲越界和丢失报GAP不填造数据。字段`stream.agentInstanceBound`、`stream.sequenceWithinInstance`、`stream.gapRecordedNoSynthesis`、`stream.resumeCursorPinned`；来源C1005-S01/C1005-S07；Owner资产D03/D17；原包E3-06/T5-03。
- **CAP-10-05-R03 OPC质量与三时钟**：source/server/ingest时戳分别保真，OPC Bad/Uncertain不得当作可信设备状态。字段`clock.sourceStampProvenance`、`clock.serverStampSeparate`、`clock.ingestStampSeparate`、`clock.badStatusNotValue`；来源C1005-S02/C1005-S03；Owner资产D10/D17；原包E3-06/T5-03。
- **CAP-10-05-R04 原始点位来源和映射**：保留设备DataItemId/NodeId/namespace与原始载荷、点位映射revision，不按名字推断设备轴。字段`mapping.nativeItemIdPreserved`、`mapping.namespaceExact`、`mapping.mapRevisionPinned`、`mapping.rawPayloadImmutable`；来源C1005-S01/C1005-S02/C1005-S08；Owner资产D03/D17；原包E3-06/T5-03。
- **CAP-10-05-R05 单位与Frame及D10独立绑定**：单位量纲有出处；现场真实D10 Frame未核时禁止由MDC推断实际Setup/TCP。字段`geometry.unitExplicit`、`geometry.frameRefExactIfApplicable`、`geometry.d10NotInferred`、`geometry.calibrationVersionPinned`；来源C1005-S02/C1005-S05；Owner资产D03/D04/D10/D17；原包E3-06/T5-03。
- **CAP-10-05-R06 缺失值与质量降级**：UNAVAILABLE、Agent BufferGap、OPC Bad/Uncertain、断连显式质量分层，不能静默插值成运行事实。字段`quality.unavailablePropagated`、`quality.statusGradeExplicit`、`quality.lagGapVisible`、`quality.noSilentInterpolation`；来源C1005-S01/C1005-S03/C1005-S04；Owner资产D03/D17；原包E3-06/T5-03。
- **CAP-10-05-R07 报警事件去重与清除**：Alarm/Condition的ID、激活/清除和时钟与设备身份绑定；不得凭重复文本推断清警。字段`alarm.eventIdentityExact`、`alarm.lifecyclePreserved`、`alarm.dedupDeviceBound`、`alarm.clearEventProven`；来源C1005-S02/C1005-S03/C1005-S06；Owner资产D03/D17；原包E3-06/T5-03。
- **CAP-10-05-R08 D17观测和D15验证隔离**：运行灯/设备报警只是现场观测；D12程序和D16工单绑定要有独立证据；不替代D15。字段`lineage.d16AssociationIndependent`、`lineage.d12ByteDigestExact`、`lineage.observationNotD15Pass`、`lineage.d17AppendOnly`；来源C1005-S02/C1005-S04/C1005-S05/C1005-S08；Owner资产D12/D13/D14/D15/D16/D17；原包E3-06/T5-03。
- **CAP-10-05-R09 ACL、CAS、Scope与取消晚回执**：D17 append提交前重新校验CAS/hash/ACL/scopeEpoch/cancelToken；旧会话回执不可复活。字段`auth.scopeEpochRechecked`、`auth.aclEpochRechecked`、`auth.exactRevisionHashCAS`、`auth.cancelLateAckRejected`；来源C1005-S03/C1005-S08；Owner资产D01/D10/D17；原包E3-06/T5-03。
- **CAP-10-05-R10 GUI/CLI/Agent、唯一3D及回退**：同一10域MdcObservationPort，唯一Babylon和左TaskPanel，影子旧Reader保留直到独立消费者合格。字段`ui.singleDomainPort`、`ui.singleBabylonWorld`、`ui.leftUnifiedTaskPanel`、`ui.legacyReaderRollback`；来源C1005-S04/C1005-S07/C1005-S08；Owner资产D03/D10/D17；原包E3-06/T5-03。

## 状态/权限/独立消费者
`OBSERVED_BOUND_NOT_VERIFIED`仅表示已核的观测关联，**不意味着NC工程安全或机床启动权**。`OBSERVED_UNBOUND`未核程序关联；`OBSERVED_NO_FRAME`不允许3D假定位；`GAP`序列缺口；`UNKNOWN`值/时钟/映射不可证；`STALE`CAS或取消；`REJECT`越权、读写混淆或伪工程PASS。
Owner append前重验ACL/CAS/Frame适用性/scopeEpoch/cancelToken，晚回执不得覆盖旧事实。独立消费者必须用真实/授权厂商Agent或录包Oracle交叉核对采样，旧reader影子双读，失败回退不删历史数据或A/B冻结。**真实设备、真实浏览器、独立Node文件执行、消费者均NOT_RUN；17资产Owner与L3 PENDING_HUMAN**。

[界面](UI.md) · [接口草案](observation-contract.json) · [验收](fixtures.json) · [Owner候选](asset-owner-candidates.json) · [独立交接](independent-consumer-handoff.md) · [来源](../../../research/sources/CAP-10-05.json) → [规则](../../../research/traces/CAP-10-05.json) → [专题](../../../research/topics/R-MDC-OBSERVABILITY-001.md) · [校验工具](../../../tools/check_cap1005_planning_2026_10_27.cjs)

**规划PASS≠产品PASS。**
