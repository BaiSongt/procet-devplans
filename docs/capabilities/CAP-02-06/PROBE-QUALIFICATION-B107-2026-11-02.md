# CAP-02-06｜B107 测头/对刀仪的设备资格与厂商台架2σ外推防错

> 2026-11-02 · NEWLY_AUTHORED · 关联原F1-02/F1-06/E3-04/T5-05；保留11域88CAP36原包17资产，L1/L2不变、L3待审。这不是实际计量认证或产品验收。

## 本次新增缺口

**厂商CMM测试架条件下的重复性，不能直接被解释成某台NC机床的测量不确定度，更不能充当本件D17的测量预算或检验合格证据。** 与已有[B71三区不确定度决策](UNCERTAINTY-GUARD-B71-2026-10-31.md)区别：B71处理已取得本件测量预算之后的保守决策；B107处理**测头/接触或激光测刀设备类别、实际测试条件和预算来源资格**。

ISO 230-10:2022 Edition 3 官网公开摘要将NC测头的离散触发、扫描、测孔以及接触式和激光测刀测试列为不同类别，并排除将机床作为CMM的性能评价。这里**仅实读摘要/目录/版次，不宣称已读付费正文中7.1/7.2/7.3/8.1/8.2完整测试规程，也不宣称运行过相关试验**。Renishaw TP200官方CMM文档指出其性能来源受测试架限制，不能直接认定整台CMM具有同一能力。Renishaw TP20模块资料的特定组合/测针条件不等于所有NC探针换装可以免校准。

NIST TN1297公开§5、§7表明不确定度需要有测量模型、分量及报告条件；本规划据此要求D03目录性能、实际D10装配资格和D17本件观测与不确定度预算分离。这是本系统的工程推导，不冒称上述文献制定了Procet内部CAS、GUI或接口。

## 资料与阅读分级

- [ISO 230-10:2022官方目录/Abstract](https://www.iso.org/standard/78909.html)：ISO/TC39/SC2，Edition 3，2022-03；2026-11-02仅开放目录与摘要；正文未读。
- [NIST TN1297 §5.1–5.2](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty)与[§7.1/7.6](https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-7-reporting-uncertainty)：Taylor/Kuyatt，1994版，2026-11-02公开HTML章节实读，旧页面不再更新；不是机床实测。
- [Renishaw TP200官方规格](https://www.renishaw.com/cmmsupport/knowledgebase/en/specification--13608)、[TP20模块条件](https://www.renishaw.com/cmmsupport/knowledgebase/en/tp20-probe-module--29271)：2026-11-02公开HTML实读；CMM资料不外推NC实际性能，未测试。
- [CAP-02-06固定业务原稿](README.md)：Git Blob `c30df09ff6927dfae37183c5009ffe1f20733c89`，GitHub exact HEAD实读。Owner、CAS、Frame/Hash/Revision与单3D为**Procet内部要求**。
- [6项结构化来源与真实阅读限制](../../../research/sources/CAP-02-06-probe-qualification-b107.json)。

## 八条规则：字段、Owner与拒绝/未知资格

|规则|必需领域字段|正反边界|
|---|---|---|
|B107-R01|`resource.kind`、`request.machineRole/mode`|NC SPINDLE_TOUCH、CMM_TOUCH、CONTACT_TOOL_SETTER、LASER_TOOL_SETTER分型，错配REJECT|
|B107-R02|`request.isoScopeClaim`、`evidence.actualMethodBasis`|只知公开目录不得授予ISO全文测试PASS；缺方法为UNKNOWN|
|B107-R03|`evidence.metricConditions`、`vendorRigMetricIsSystemUncertainty`、`vendorRepeatabilityUsedAsPieceBudget`|2σ跨测试架/整机/本件混用REJECT|
|B107-R04|`calibration.stylusConfigExact/certificateHash/status`|测针变化、失效STALE；缺证据UNKNOWN|
|B107-R05|`resource.sha256/exactRevision`、`request.machineExact/frameRef`、`tx.expectedRevision/currentRevision`|D03资源与D10实装/校准各自exact；错帧不得通过|
|B107-R06|`tx.aclAllowed/casAllowed/scopeEpoch/receiptEpoch/lateAck`|02 Owner提交重验ACL/CAS，取消及晚回执不复活写权|
|B107-R07|`ui.guiPort/cliPort/agentPort/babylonWorldCount/taskPanel`|GUI/CLI/Agent同受管02域Port，唯一Babylon世界、左UnifiedTaskPanel|
|B107-R08|`chain.d03WritesD17/clPreviewAsD15/unknownD13PermitsD16/rewriteFrozenAB`|D03不可直写D17；A/B冻结不可覆盖；CL不代替D15，D13 UNKNOWN阻D16|

D04名义Setup必须与D10实际机床/测头绑定分开。中立CL→最终NC后处理→D13执行语义→D14轴时序→D15独立工程验证→D16发布，不能用CL动画冒充NC验证；不做材料扫掠仿真。D17真实观察由10域Owner独立提交，不由D03资源库存写入。业务Owner恢复或迁移时必须保持旧字节与修订、旧消费者NACK后回退、取消前真实提交回执可对账，禁止静默覆盖冻结版本。

## UI与验收入口

单Babylon活动Engine/Scene/Canvas支持工程空间和制造资源空间横向切换，任务仅在左侧唯一UnifiedTaskPanel显示“设备类别→测针/球头装配→统计量来源→校准资格→Machine/Frame→确认”。预览只显示`CATALOG_CANDIDATE_ONLY`或明确UNKNOWN，不能涂成工程合格标志。CLI/Agent调用02域同Owner Port而不是独立数据库。

[8规则/原包追踪](../../../research/traces/CAP-02-06-probe-qualification-b107-v08.json) → [34个合成正反、STALE、UNKNOWN](probe-qualification-b107-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0206_probe_qualification_b107_v08.cjs) → [执行等级](../../../tracking/cap0206-probe-qualification-b107-verification-2026-11-02.json)。同判定函数V8预检34/34符合预期，但独立Node整文件、真实ISO测量/校准、D17质量验收、17 Owner签署和消费者均NOT_RUN；全仓GFM AST与历史附件仍待终核。**规划PASS≠产品PASS。**
