# CAP-10-07｜异常反馈与工程变更（V0.8，L3待审）
**88项基线目标原文**：「现场问题回流与新修订分支」；原编号工作包**E3-06 / T5-03**。本轮仅实施级规划，未授权机床控制，未提交产品代码。
## 责任和资产边界
10域`FieldEngineeringChangePort`接纳D17追加现场异常，转为**新**变更请求；OPC/MES/质量系统的原始事实由各自Owner拥有，D17不能宣布已排除故障或通过质检。D01管理工程修订，D03机床资源，D04名义Setup，D10独立实装绑定；D08 A/B冻结成果只读。变更影响D12最终NC时必须D13执行语义重解释→D14物理Joint轴时序→D15独立工程验证→D16人类审批签发；中立CL只用于预览，`UNKNOWN`不得发布，**不做材料扫掠仿真**。
不引入D18，17资产编号、11个L1/L2能力域和原包编号均保持不变，C0仅承担identity、revision、hash、unit、frame、scope和protocol。L3待人类审核，所有Owner为候选，不能冒充正式签字。
## 正常流程与异常回流
机床报警/人工问题/外部质量单→保留原始事件、EventId、来源时钟和数据质量→D17只追加证据→10域独立分流安全/质量/工程问题→受影响的D03/D04/D08/D10/D12至D16精确修订闭包→新工程分支及审批→如改NC则重新生成和独立验证→新D16签发→现场接收、人工复工授权。**报警Acknowledge不是维修完成、也不是CycleStart**；外部MES/质检Owner独立签署。
异常：协议缺节点、事件重复、断网迟到、伪造报警来源、无法锚定Frame、不同机床同名工单、工序版本失效、撤权/取消晚ACK、返工质量滞后、旧A/B仍冻结。统一以`REJECT/STALE/UNKNOWN/BLOCK_CHANGE/BLOCK_RELEASE`阻放行；无损保留原始事件和受影响图。
## 十项实施任务（原包E3-06/T5-03；不重编号）
- **T01｜异常原始事实与可信采集**：现场报警/人工问题必须带来源事件ID、时间质量、原始字节指纹及设备修订，来源不明保持UNKNOWN。字段：`report.rawEventIdAndDigest`、`report.sourceTimeQuality`、`report.machineProfileRevision`、`report.unverifiedMarkedUnknown`；C1007-S01/C1007-S02/C1007-S07；正反验收[CAP-10-07-R01](../../../research/traces/CAP-10-07.json)。
- **T02｜确认与解决分开**：OPC Acknowledge/Confirm（能力探测）只是状态事实，不等于排除故障或许可重新启动。字段：`alarm.ackNotResolution`、`alarm.confirmOptionalProbed`、`alarm.eventIdExact`、`alarm.noCycleStartFromAck`；C1007-S01/C1007-S02；正反验收[CAP-10-07-R02](../../../research/traces/CAP-10-07.json)。
- **T03｜追加事件与独立问题身份**：D17只追加问题、证据和更正事件，保留原始事故链和外部MES/质量Owner真值。字段：`incident.d17AppendOnly`、`incident.externalOwnerPreserved`、`incident.evidenceHashPinned`、`incident.correctionsAsNewEvent`；C1007-S02/C1007-S04/C1007-S05；正反验收[CAP-10-07-R03](../../../research/traces/CAP-10-07.json)。
- **T04｜隔离处置与人工分级**：质量、安全、NC异常须按证据分类并等待授权分流，未知风险不允许自动复产。字段：`triage.safetyOwnerAssigned`、`triage.qualityOwnerIndependent`、`triage.unknownBlocksResumption`、`triage.noUnapprovedControllerCommand`；C1007-S02/C1007-S03/C1007-S04；正反验收[CAP-10-07-R04](../../../research/traces/CAP-10-07.json)。
- **T05｜变更影响图与精确快照**：冻结上游exact Revision/hash/frame和影响图，针对工序、Setup、NC、机床及验收逐项重新定位。字段：`impact.exactRevisionHashFrame`、`impact.dependenciesListed`、`impact.d04d10Distinguished`、`impact.d15RevalidationScope`；C1007-S03/C1007-S04/C1007-S05；正反验收[CAP-10-07-R05](../../../research/traces/CAP-10-07.json)。
- **T06｜新修订分支与A/B冻结保护**：现场反馈只可生成新变更请求/新工程修订，使用来源关系，不回写旧A/B批准快照。字段：`revision.forksNewDraft`、`revision.abFrozenReadOnly`、`revision.wasRevisionOfBound`、`revision.noHistoricalOverwrite`；C1007-S03/C1007-S04/C1007-S05；正反验收[CAP-10-07-R06](../../../research/traces/CAP-10-07.json)。
- **T07｜D04计划与D10现场绑定独立**：机床/刀具/夹具/Frame修正后须重取D10实装来源、精确引用，不从D04自动推定。字段：`setup.d04NominalOnly`、`setup.d10ActualRevisionHashFrame`、`setup.machineToolFixtureProfilePinned`、`setup.unknownActualBlocksRelease`；C1007-S02/C1007-S03/C1007-S08；正反验收[CAP-10-07-R07](../../../research/traces/CAP-10-07.json)。
- **T08｜NC重新验收与发布闭环**：变更影响D12/控制器语义时必须由最终NC重新经过D13→D14→D15独立Oracle→D16审批。字段：`reverify.d12ByteDigestExact`、`reverify.d13d14Reexecuted`、`reverify.d15IndependentOracle`、`reverify.d16NewHumanRelease`；C1007-S02/C1007-S03/C1007-S04；正反验收[CAP-10-07-R08](../../../research/traces/CAP-10-07.json)。
- **T09｜提交CAS/权限/取消晚回执**：变更、签收及反馈均须重核Owner ACL/scopeEpoch和CAS；取消/迟到回执不复活请求。字段：`guard.aclScopeEpochRechecked`、`guard.revisionHashCAS`、`guard.cancelLateAckRejected`、`guard.idempotencyKeyScoped`；C1007-S05/C1007-S06；正反验收[CAP-10-07-R09](../../../research/traces/CAP-10-07.json)。
- **T10｜同域多入口与非破坏迁移**：GUI/CLI/Agent共用10域Port；统一Babylon与左Panel；旧Reader双读、回退保留历史及消费者验收。字段：`ux.sameDomainPort`、`ux.singleBabylonLeftPanel`、`ux.shadowReadRollback`、`ux.independentConsumerPending`；C1007-S04/C1007-S05/C1007-S06；正反验收[CAP-10-07-R10](../../../research/traces/CAP-10-07.json)。
## 来源→规则→字段→CAP/原工作包→机器正反验收
| 规则 | 关键要求 | 来源 | 每字段独立变异 | 资产 | 原包 |
|---|---|---|---|---|---|
| CAP-10-07-R01 | 异常原始事实与可信采集 | C1007-S01/C1007-S02/C1007-S07 | `report.rawEventIdAndDigest`、`report.sourceTimeQuality`、`report.machineProfileRevision`、`report.unverifiedMarkedUnknown` | D03/D17 | E3-06 / T5-03 |
| CAP-10-07-R02 | 确认与解决分开 | C1007-S01/C1007-S02 | `alarm.ackNotResolution`、`alarm.confirmOptionalProbed`、`alarm.eventIdExact`、`alarm.noCycleStartFromAck` | D03/D17 | E3-06 / T5-03 |
| CAP-10-07-R03 | 追加事件与独立问题身份 | C1007-S02/C1007-S04/C1007-S05 | `incident.d17AppendOnly`、`incident.externalOwnerPreserved`、`incident.evidenceHashPinned`、`incident.correctionsAsNewEvent` | D01/D17 | E3-06 / T5-03 |
| CAP-10-07-R04 | 隔离处置与人工分级 | C1007-S02/C1007-S03/C1007-S04 | `triage.safetyOwnerAssigned`、`triage.qualityOwnerIndependent`、`triage.unknownBlocksResumption`、`triage.noUnapprovedControllerCommand` | D15/D16/D17 | E3-06 / T5-03 |
| CAP-10-07-R05 | 变更影响图与精确快照 | C1007-S03/C1007-S04/C1007-S05 | `impact.exactRevisionHashFrame`、`impact.dependenciesListed`、`impact.d04d10Distinguished`、`impact.d15RevalidationScope` | D04/D08/D10/D12/D15 | E3-06 / T5-03 |
| CAP-10-07-R06 | 新修订分支与A/B冻结保护 | C1007-S03/C1007-S04/C1007-S05 | `revision.forksNewDraft`、`revision.abFrozenReadOnly`、`revision.wasRevisionOfBound`、`revision.noHistoricalOverwrite` | D01/D08/D17 | E3-06 / T5-03 |
| CAP-10-07-R07 | D04计划与D10现场绑定独立 | C1007-S02/C1007-S03/C1007-S08 | `setup.d04NominalOnly`、`setup.d10ActualRevisionHashFrame`、`setup.machineToolFixtureProfilePinned`、`setup.unknownActualBlocksRelease` | D03/D04/D10/D17 | E3-06 / T5-03 |
| CAP-10-07-R08 | NC重新验收与发布闭环 | C1007-S02/C1007-S03/C1007-S04 | `reverify.d12ByteDigestExact`、`reverify.d13d14Reexecuted`、`reverify.d15IndependentOracle`、`reverify.d16NewHumanRelease` | D12/D13/D14/D15/D16 | E3-06 / T5-03 |
| CAP-10-07-R09 | 提交CAS/权限/取消晚回执 | C1007-S05/C1007-S06 | `guard.aclScopeEpochRechecked`、`guard.revisionHashCAS`、`guard.cancelLateAckRejected`、`guard.idempotencyKeyScoped` | D01/D16/D17 | E3-06 / T5-03 |
| CAP-10-07-R10 | 同域多入口与非破坏迁移 | C1007-S04/C1007-S05/C1007-S06 | `ux.sameDomainPort`、`ux.singleBabylonLeftPanel`、`ux.shadowReadRollback`、`ux.independentConsumerPending` | D01/D04/D10/D17 | E3-06 / T5-03 |
- [八项权威来源与实际阅读深度](../../../research/sources/CAP-10-07.json) → [十条可追踪规则](../../../research/traces/CAP-10-07.json) → [50项独立字段正反及20门禁用例](fixtures.json) → [独立校验器](../../../tools/check_cap1007_planning_2026_10_27.cjs)。
- [十域Port合同](engineering-change-contract.json)、[GUI/3D合同](UI.md)、[独立消费者和迁移/回退](independent-consumer-handoff.md)、[理论专题](../../../research/topics/R-FIELD-ECN-001.md)。
## 验收与未完成责任
规划脚本只测Source→Rule→Field→Case的结构一致性及70项合成门禁；独立Node文件进程、OPC实机、厂商报警、真实机床/NC、质量系统和跨域消费者**NOT_RUN**。要求独立团队提供机器/控制器Profile的exact SHA、Frame、质量时钟/事件、授权状态及未覆盖语义清单；Owner正式会签与L3均PENDING_HUMAN。**规划PASS≠产品PASS**。
