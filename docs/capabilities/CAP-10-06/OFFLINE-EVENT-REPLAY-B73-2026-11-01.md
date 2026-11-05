# B73｜CAP-10-06离线工单重放与现场交付证据（2026-11-01）

原V0.8的11域/88 CAP/36原编号工作包/17资产保持不变。关联原工作包E3-06、T5-03；D04名义Setup与D10实际执行绑定分离。L1/L2不改、L3待人类审批。**规划PASS≠产品PASS。**

## 核心反例与理论边界

1. OPC UA ISA-95 Part4 v2.00.0 §6.2.1.3明确Store只存订单、不启动；§6.2.1.4的StoreAndStart可能立即启动，Table12显示这些方法可选。故本CAP不调用StoreAndStart、不提供远程启机；Method成功、JobOrderStatus、JobResponse、HTTP/OPC ACK、D17落库、真实Cycle、QA和MES批准是不同证据，不能合写为完工事实。
2. CloudEvents v1.0.2要求source+id复合身份，重复投递可重用id，但不保证业务落库或事件全序。上次已持久化seq=9007199254740993，新事件9007199254740994连续，若收到9007199254740995必须GAP_HOLD。超过JS安全整数，采用十进制字符串/BigInt；time可选不能替代producerEpoch+序列连续性。以上扩展序列设计属于Procet内部规则，不归因于CloudEvents。

## Owner与接口责任

ERP/MES工单号+tenant+plant+revision+machine必须exact Join，名称/外部Ready不作权威完成。10域仅提供受控WorkOrderExecutionPort、作业指导签收与只读投影，D17 append-only保存观测；D16受控发布与D15独立工程验证互不替代。D12最终NC字节→D13模态解释→D14轴时序→D15验证→D16发布，不能用中立CL/D11/Babylon动画冒充NC工程PASS，不做材料扫掠仿真。

Owner写入前CAS、ACL、expected revision/hash/frame/scopeEpoch、取消代次与晚ACK重验；失效记录不可删除，Schema旧新Reader与A/B冻结回退必须保留。GUI/CLI/Agent同一Port，单Babylon Engine/Scene/Canvas，左统一TaskPanel，最大12px、浅/深主题；预览不能写。C0最小共用，不引入第18资产。

## 来源→规则→字段→CAP与原包→正反验收

| 规则 | 工程语义/字段 | 来源 |
|---|---|---|
| B73-R1 | 事件source+id/Hash去重、碰撞拒绝；event.source、event.id、event.payloadHash、event.seenHash | B73-S01、B73-S07 |
| B73-R2 | 租户/厂区/MES工单/机床/Frame/D16 exact联接；identity.tenant、identity.jobId、identity.machine、identity.frame、identity.d16Hash | B73-S05、B73-S07 |
| B73-R3 | producerEpoch+十进制连续序号，不以time排序；event.producerEpoch、event.seq、event.lastSeq、event.time | B73-S01、B73-S04、B73-S07 |
| B73-R4 | OPC Store/StoreAndStart及JobResponse资格隔离；event.opcMethod、event.jobState、evidence.jobResponse、gate.remoteStart | B73-S02、B73-S03、B73-S07 |
| B73-R5 | 传输ACK/D17落库/Cycle/QA/MES回执五事实；evidence.receiptKind、evidence.persisted、evidence.cycle、evidence.quality、evidence.mes | B73-S03、B73-S04、B73-S07 |
| B73-R6 | Owner提交时ACL/CAS/Scope/取消晚ACK复查；gate.acl、gate.cas、gate.ownerRev、gate.scopeEpoch、gate.cancelled、gate.lateAck | B73-S04、B73-S07 |
| B73-R7 | GUI/CLI/Agent同Port及单Babylon左TaskPanel；gate.port、gate.channels、gate.sceneCount、gate.panel、gate.previewWrites | B73-S07 |
| B73-R8 | Schema旧新Reader与A/B冻结可回滚交接；event.schemaMapped、gate.oldReader、gate.newReader、gate.freeze、gate.abOverwrite | B73-S05、B73-S06、B73-S07 |

机器判定枚举：CANDIDATE_ONLY（仅收件候选）、REJECT（已知违规）、STALE（依赖变更）、UNKNOWN（证据不足）、DUPLICATE_NOOP（原Hash幂等）、GAP_HOLD（序列缺口）、DISPLAY_ONLY（只读）。这些是Procet待审枚举，不是外部标准原有状态，也不等于工单可启机、NC安全或完工。

[官方来源作者/版本/访问深度](../../../research/sources/CAP-10-06-offline-events-b73.json) → [8条追踪规则](../../../research/traces/CAP-10-06-offline-events-b73-v08.json) → [48合成正反/缺口/幂等/未知样例](offline-events-b73-fixtures-v08.json) → [Node只读入口](../../../tools/check_cap1006_offline_events_b73_v08.cjs)。

## 文献阅读边界与独立验收

2026-11-01实读CloudEvents v1.0.2第2章、OPC 10031-4 v2.00.0 §6.2.1.3—.5/§6.2.6—.7、RFC 9110 §9.2.2；W3C PROV-O仅首页与Abstract、NIST SP 800-82 Rev.3仅官方著录摘要。NIST官方2026-09-21提示Rev.4初始公开草案，非最终版。不编造未读控制条款或OEM能力。

本轮V8使用与Node一样的judge对手工预设期望48/48项合成PASS。独立Node完整文件进程、真实ERP/MES/OPC、D17数据库、NC D13–D16、B5/OEM、17资产跨域消费者均NOT_RUN；正式Owner0/17、L3待人审、历史原附件和全仓GFM AST待核。独立消费者必须实测重发/乱序/取消/撤权/冻结/回退，不可由本规划自签。
