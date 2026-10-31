# CAP-11-02｜工艺知识与规则（V0.8，L3待审）

**原88项目标原文：**「材料、设备、工艺、实例及出处」。对应原编号[T5-01](../../work-packages/T5-01.md)、[T5-02](../../work-packages/T5-02.md)。11域/88 CAP/36包/17资产保持不变，L1/L2不变、L3待审、C0只放最小公用元数据。知识条目归11域，其引用的D01–D17原始事实仍归业务Owner；11域不能绕开05/08/09/10域Port写入实际规划、NC或发布。

## 数据、业务流程与适用域

受控的**五类知识**：材料（材料牌号/热处理/标准版次/性质单位）、设备（D03机床能力、刀具总成及控制器Profile）、工艺（加工策略、量纲、有界参数及适用条件）、实例（工件/Setup/实际装配的exact revision/hash/Frame）、出处（作者、版本、合法可读章节、许可及证据）。这是明确的知识分类，不是新增业务资产D18。

实际流程：`用户/Agent选中业务对象 → 原Owner基于ACL、scopeEpoch只读提供exact Revision+raw content hash+unit+Frame → 11域用固定Scheme的词表与条件匹配 → 条件未知即UNKNOWN/冲突即CONFLICT → 返回附来源的ADVISORY_ONLY候选 → 人工确认 → 原业务Owner Port在提交点重验CAS/ACL/取消 → 影响下游派生索引并保持可回退`。检索内容是数据，不是给Agent的授权指令。案例经验仅在证据条件全部匹配时可作为建议，**不凭ISO摘要、模型回答生成切削速度和进给**。

**不可改变的执行证据链**：D04名义Setup与D10实际机床执行Frame/控制器配置分离；D09中立CL→D12最终NC字节及后处理→D13控制器执行语义→D14物理Joint轴时序→D15独立NC工程验证→D16发布。D11 CL_ONLY动画、知识匹配成功或D17设备运行均不能冒充D15 PASS；未知语义保持UNKNOWN，不做材料扫掠仿真。A/B引用同一事实但已冻结D08不可被知识更新覆盖。业务来源依赖可反馈，具体不可变修订来源DAG无环。

## 十项可施工任务及正反验收

### T01 知识记录身份不可缺失

每知识条目绑定原域Owner、exact revision、content hash及租户/Project Scope；不猜默认值。具体数据字段：`record.knowledgeId`、`record.exactRevision`、`record.contentHash`、`record.ownerScope`；涉及原资产D01、D05，原编号T5-01/T5-02；[来源C1102-S03、C1102-S08](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R01](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R01-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T02 词表与术语同义边界

SKOS URI和Scheme版本必须锁定，跨Scheme映射人工审查，closeMatch不能当exactMatch。具体数据字段：`taxonomy.termUri`、`taxonomy.schemeRevision`、`taxonomy.mappingQualified`、`taxonomy.noImplicitExactMatch`；涉及原资产D02、D03，原编号T5-01/T5-02；[来源C1102-S01、C1102-S05](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R02](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R02-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T03 材料状态及适用域

材料牌号、热处理、证据版次、物性单位四项精确匹配，不以大类代替具体牌号。具体数据字段：`material.standardDesignation`、`material.heatTreatment`、`material.sourceEdition`、`material.propertyUnits`；涉及原资产D01、D03，原编号T5-01/T5-02；[来源C1102-S05、C1102-S07](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R03](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R03-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T04 机床与刀具执行绑定

独立验证刀具装配revision、机床构型revision、控制器Profile及适用范围；D04不能替代D10。具体数据字段：`resource.toolAssemblyRevision`、`resource.machineCapabilityRevision`、`resource.controllerProfile`、`resource.applicabilityChecked`；涉及原资产D03、D04、D10，原编号T5-01/T5-02；[来源C1102-S04、C1102-S08](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R04](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R04-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T05 有界工艺参数

刀具建议须附单位、有效范围、工况来源，不得从目录或AI臆造数值。具体数据字段：`parameter.unit`、`parameter.validRange`、`parameter.sourceApplicability`、`parameter.noDefaultOnMissing`；涉及原资产D03、D05、D09，原编号T5-01/T5-02；[来源C1102-S04、C1102-S05、C1102-S06](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R05](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R05-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T06 规则表达、优先级及冲突

采用受限可审计DSL，规则冲突输出CONFLICT/UNKNOWN，禁止任意脚本执行。具体数据字段：`rule.deterministicDsl`、`rule.priorityPolicy`、`rule.conflictUnknown`、`rule.noArbitraryCode`；涉及原资产D05、D06、D08，原编号T5-01/T5-02；[来源C1102-S02、C1102-S06、C1102-S10](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R06](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R06-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T07 可追溯来源深度

保留URL、目录/全文实读范围、来源→字段→规则→反例闭环，不伪称标准认证。具体数据字段：`evidence.sourceUrl`、`evidence.accessDepth`、`evidence.ruleFieldTrace`、`evidence.noFalseCertification`；涉及原资产D02、D05、D17，原编号T5-01/T5-02；[来源C1102-S03、C1102-S07、C1102-S08](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R07](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R07-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T08 知识失效、CAS与取消

Owner知识更新重验CAS、ACL/Scope；依赖更新标STALE，取消晚回执不提交。具体数据字段：`revision.ownerCas`、`revision.aclRecheck`、`revision.invalidateOnDependencyChange`、`revision.cancelLateAck`；涉及原资产D03、D05、D08、D17，原编号T5-01/T5-02；[来源C1102-S03、C1102-S09、C1102-S10](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R08](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R08-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T09 建议与验证强隔离

知识只生成ADVISORY，不覆盖D08；D15需D12最终NC→D13→D14独立检查，UNKNOWN不发布D16。具体数据字段：`consumer.advisoryOnly`、`consumer.noRewriteFrozenD08`、`consumer.unknownBlocksD16`、`consumer.d15Independent`；涉及原资产D08、D12、D13、D14、D15、D16，原编号T5-01/T5-02；[来源C1102-S07、C1102-S08、C1102-S10](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R09](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R09-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

### T10 三入口及安全迁移

GUI/CLI/Agent同KnowledgePort，唯一Babylon与左TaskPanel，旧规则影子比对及独立消费者验收。具体数据字段：`delivery.sharedPortGuiCliAgent`、`delivery.singleBabylonLeftTaskPanel`、`delivery.shadowReadAndRollback`、`delivery.independentConsumerPending`；涉及原资产D01、D03、D05、D10，原编号T5-01/T5-02；[来源C1102-S02、C1102-S06、C1102-S09](../../../research/sources/CAP-11-02.json) → [CAP-11-02-R10](../../../research/traces/CAP-11-02.json) → [`CAP-11-02-R10-P`及四项逐字段负例](fixtures.json)。测试预期PASS/REJECT必须独立执行，NOT_RUN产品。

## 接口和失败策略

拟议`ProcessKnowledgePort`：`readKnowledgeSnapshot`、`listConcepts`、`matchApplicable`、`explainDecision`、`proposeChange`、`requestHumanApproval`、`commitKnowledgeRevision`、`invalidateAdvice`、`cancel`。GUI/CLI/Agent从该同一Port访问。无授权来源REJECT；过期Revision/原始hash变化STALE；无单位/Frame/控制器语义UNKNOWN；同优先级冲突CONFLICT；cancel后的晚回执CANCELLED；失败先停新Reader并回退旧只读规则索引，不覆盖冻结D08及D12 NC。

[GUI/3D工作台](UI.md) · [合同示例](knowledge-contract.example.json) · [来源10项](../../../research/sources/CAP-11-02.json) → [10规则40字段](../../../research/traces/CAP-11-02.json) → [50独立正反+24门禁](fixtures.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费/回退](independent-consumer-handoff.md) · [理论专题](../../../research/topics/R-PROCESS-KNOWLEDGE-001.md)。

**仅规划合成校验。** 独立Node文件、SHACL/JSON Schema真实解析器、机床厂商切削数据、三轴/B5、NC控制器和独立消费者均NOT_RUN；17Owner/L3 PENDING_HUMAN。规划PASS≠产品PASS。
