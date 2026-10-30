# CAP-10-08｜数字主线与审计（V0.8，L3待审）

**原88项能力目标原文：**「零件-工序-刀路-NC-机床-执行溯源」。关联原工作包 **E3-06 / T5-03**，不重编号、不新增D18。10域拥有数字主线**受管审计索引与查询投影**，并不接管原D01—D17领域数据Owner。

## 责任/数据流边界

CAD设计D01/特征D02→D04名义Setup及D10实际机床执行绑定→D05工艺/D06候选/D07有序材料/D08冻结→D09中立CL→D12最终NC原始字节→D13控制器执行语义→D14物理Joint运动时序→D15独立工程验证→D16人类受控发布→D17现场事件及外部质检反馈。D11只为CL_ONLY预检，CL动画、设备运行信号和签名均不等于NC工程验证或本地上机许可。D13未建模语义始终UNKNOWN，不做材料扫掠仿真。

每个引用绑定资产类型、原业务Owner、对象ID、exact revision/hash、单位/Frame或N/A、Scope和证据质量；异步审计写入用受管Port重验ACL/scopeEpoch/CAS/cancelToken。设备/ERP/MES/质检保持自己原始事实的Owner，10域的审计投影不能重写。

**类型图允许反馈、实例图不可闭环。** 类型层有D17→D05/D06回流；已冻结的修订来源实例/派生关系只能形成DAG，变更生成新Revision/事件，不能以A/B跨模式接管覆盖旧D08。

## 操作路径

1. 选定工程/对象/原Revision，通过各域受管查询端口读取精确只读引用；拒绝读取与对象不存在要区分。

2. 建立含来源实体、执行活动、责任主体、方向和证据哈希的数字主线图。缺NC字节、D10 Frame、D15独立证据或原始事件质量时保持UNKNOWN。

3. 既能由零件→工序→CL→NC→运动→验证→签发→现场正向检索，也能由现场报警/质量问题→已签发的**实际NC字节**反向核对。

4. 审计事件只追加，记录顺序、来源与入库时间/时钟质量、幂等键、原始指纹；纠错通过新事件。哈希链仅证明对给定信任根的内容一致性。

5. 任何关联及修订变化均计算精确受影响闭包，只失效相关D12/D13/D14/D15/D16；A/B冻结历史可被查看但不能覆盖。

6. 处理断网离线、能力缺失、不同机床同名程序、跨项目拒绝、Frame失效、回执重放、权限撤销、取消晚ACK，返回REJECT/STALE/UNKNOWN/INTEGRITY_FAILED并保留诊断。

## 十项实施子任务

- **T01｜资产身份**：17资产的对象ID、Owner、exact revision、内容hash与Frame/不适用声明必须齐全；D04名义和D10实装各有独立修订。 字段：`identity.assetOwner`、`identity.exactRevision`、`identity.contentHash`、`identity.frameOrNA`；[规则CAP-10-08-R01](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T02｜来源关系**：追溯边必须有类型、方向、生产者identity、证据引用；无法验证的边不能冒充已确认生产事件。 字段：`link.typedRelation`、`link.direction`、`link.producerIdentity`、`link.evidenceRef`；[规则CAP-10-08-R02](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T03｜反馈与冻结**：D17→D05/D06业务反馈有环不等于revision实例来源有环；不可变来源图必须DAG，A/B冻结不可被覆盖。 字段：`graph.businessFeedbackTyped`、`graph.instanceProvenanceAcyclic`、`graph.frozenABImmutable`、`graph.newRevisionOnFeedback`；[规则CAP-10-08-R03](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T04｜审计时间线**：记录追加顺序、原始事件摘要、源/服务器时间质量及更正关联；哈希链不能证明物理事实真实。 字段：`audit.monotonicSequence`、`audit.rawDigest`、`audit.timeQuality`、`audit.correctionAppend`；[规则CAP-10-08-R04](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T05｜设备审计**：OPC AuditEvent字段和Profile先能力探测；行动日志/Status不能推断NC字节真实执行或CycleStart。 字段：`opc.capabilityProbed`、`opc.actionTimestampAndStatus`、`opc.serverClientIdentity`、`opc.noNcExecutionInference`；[规则CAP-10-08-R05](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T06｜NC工程证据**：D09 CL→D11 CL_ONLY仅预演；必须由D12最终NC原始字节经D13→D14→D15独立Oracle→D16人类签发形成证据闭包。 字段：`nc.finalRawBytes`、`nc.controllerAndJointTrace`、`nc.independentD15`、`nc.humanD16Separate`；[规则CAP-10-08-R06](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T07｜Frame隔离**：D04名义Setup不得替代D10真实机床/刀具/偏置/Frame；修订失效必须传播到后续证据。 字段：`binding.nominalD04Separated`、`binding.actualD10Frame`、`binding.machineToolRevision`、`binding.invalidationPropagated`；[规则CAP-10-08-R07](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T08｜授权与质量**：D16签发、D17现场收到、实际机床执行、独立质检与本地启动许可不得相互推断。 字段：`release.d16SignatureExact`、`release.d17ReceiptDistinct`、`release.qualityExternalOwner`、`release.noCycleStartInference`；[规则CAP-10-08-R08](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T09｜CAS与取消**：受管写入提交时Owner ACL、scopeEpoch、expectedRevision/hash、取消/晚回执均重验；UNKNOWN不得成为PASS。 字段：`commit.ownerAclRechecked`、`commit.scopeCasExact`、`commit.cancelLateAckRejected`、`commit.unknownNotPass`；[规则CAP-10-08-R09](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

- **T10｜消费和回退**：GUI/CLI/Agent同Port；单Babylon、左TaskPanel；影子读/独立消费者批准后才切新Writer。 字段：`ux.sameDomainPort`、`ux.singleBabylonLeftPanel`、`ux.shadowReadRollback`、`ux.independentConsumerRequired`；[规则CAP-10-08-R10](../../../research/traces/CAP-10-08.json)，[固定正反场景](fixtures.json)。

## 可证伪的研究与验收链

十项规则各四字段独立布尔正反变异，提供**10正+40反**；另有**8组实例来源图**（合法DAG/非法环/业务反馈环/缺帧/缺hash/覆盖冻结等）和**19个状态门禁**（授权、CAS、原NC字节、Oracle、现场许可等），共**77项合成案例**。脚本只做规划验证，产品验收NOT_RUN。

[官方合法来源与访问深度](../../../research/sources/CAP-10-08.json) → [10规则/40字段/两原包](../../../research/traces/CAP-10-08.json) → [77项合成场景](fixtures.json) → [Node校验器](../../../tools/check_cap1008_planning_2026_10_27.cjs) → [研究专题](../../../research/topics/R-DIGITAL-THREAD-AUDIT-001.md)。

## GUI/接口/17资产Owner候选与独立交付

[统一左TaskPanel与单Babylon](UI.md) · [领域Port契约](digital-thread-contract.json) · [17个原Owner候选](asset-owner-candidates.json) · [独立消费者和迁移回退](independent-consumer-handoff.md)。正式17资产Owner会签及L3均PENDING_HUMAN，Node独立进程、实际OPC/NC/控制器/三轴及B5机床/独立质量/跨域消费者均NOT_RUN；**规划PASS≠产品PASS**。


## 2026-10-31｜B55 17资产消费证据门禁
[17资产消费合同与研究](../../architecture/v0.8/CONSUMER-PROOF-GATE-B55-2026-10-31.md)补强本CAP T01、T09、T10：消费者独立实测、exact revision/hash/frame、ACL/CAS撤权及回退验收，原E3-06/T5-03不改。**正式Owner/真实消费者仍0/17，规划PASS≠产品PASS。**
