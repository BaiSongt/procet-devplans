# CAP-11-05｜工艺推荐与方案解释（V0.8，L3待审）

**88项原文：**「参数建议、依据、替代方案和风险」。11域、88 CAP、36原编号工作包、17资产及L1/L2不变；归属原包 [T5-01](../../work-packages/T5-01.md) / [T5-02](../../work-packages/T5-02.md)。本文是规划规格，不是切削工艺参数批准或产品验收。

## 业务流程与状态

GUI/CLI/Agent统一调用`ProcessRecommendationPort`，以Owner受控只读Port获取D01/D03/D04/D05/D07/D08/D10的exact revision/hash/Frame/单位，关联 [CAP-11-02](../CAP-11-02/README.md)适用知识及[CAP-11-03](../CAP-11-03/README.md)原件引用，构造可审计的**候选、依据、替代、风险**。候选状态`DRAFT→CONTEXT_BOUND→EVIDENCE_CHECKED→ADVISORY_ONLY→AWAITING_HUMAN→OWNER_REVALIDATED→D05_NEW_DRAFT`；`REJECT/STALE/UNKNOWN/CANCELLED`分支不得自动提升为已采纳工艺。优化目标只有在比较口径及约束一致时可排序，不能依据LLM偏好直接选最优。

`vc=π×Dcap×n/1000`（m/min，Dcap:mm，n:r/min）、`vf=fz×n×z_eff`（mm/min）、`Q=ap×ae×vf/1000`（cm³/min）仅是已声明单位及铣削条件下的算术恒等式；不能直接推出适用切削数据，亦不构成材料去除仿真。LinuxCNC G93/G94/G95进给模态差异必须由D13控制器语义解释，不能把计算的vf写成任何机床均可运行的F字。

## 10项实施级施工与字段门禁

### T01 精确设计/材料/Frame上下文
推荐必须绑定目标和材料状态精确修订及Setup坐标，不使用过期缓存。涉及资产D01、D04、D07；关联领域03、04、06、11；原包T5-01/T5-02。字段：`scope.designRevisionExact`、`scope.materialStateHashExact`、`scope.setupFrameExact`、`scope.unitsExplicit`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S07/C1105-S09` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R01` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T02 机床适用能力
从D03受控Port读取构型能力并验证D10实际执行上下文，不能把资源目录当实装。涉及资产D03、D10；关联领域02、04、09、11；原包T5-01/T5-02。字段：`machine.d03CapabilityRevision`、`machine.d10ExecutionBinding`、`machine.axesReachEnvelope`、`machine.ownerPortRead`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S04/C1105-S05/C1105-S07` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R02` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T03 刀具装配与有效切削直径
候选必须有刀具总装修订、实际伸出量、有效切径、刀具用途来源。涉及资产D03、D10；关联领域02、04、11；原包T5-01/T5-02。字段：`tool.assemblyRevision`、`tool.actualGaugeLengthKnown`、`tool.effectiveDiameterKnown`、`tool.sourceApplicable`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S01/C1105-S03` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R03` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T04 材料与工况匹配
不确定牌号/热处理/硬度/工况时不生成伪确定参数。涉及资产D01、D03、D04；关联领域02、03、04、11；原包T5-01/T5-02。字段：`material.gradeProvenance`、`material.heatTreatmentKnown`、`material.hardnessRangeKnown`、`material.operationCompatibility`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S01/C1105-S02/C1105-S08` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R04` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T05 铣削公式、单位与进给模式
校验Dcap>0、有效齿数>0、vc/fz单位，明确G93/G94/G95不可混推。涉及资产D03、D09、D10；关联领域02、07、08、11；原包T5-01/T5-02。字段：`calc.effectiveDiameterPositive`、`calc.effectiveTeethPositive`、`calc.unitConsistent`、`calc.feedModeExplicit`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S02/C1105-S03/C1105-S04/C1105-S05` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R05` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T06 参数边界与不确定
建议值不得超出现时能力Profile；功率/刀具负荷缺证则UNKNOWN或人工待审。涉及资产D03、D10、D11；关联领域02、09、11；原包T5-01/T5-02。字段：`limits.rpmEnvelopeChecked`、`limits.feedEnvelopeChecked`、`limits.engagementChecked`、`limits.powerEvidenceKnown`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S03/C1105-S04/C1105-S05/C1105-S06` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R06` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T07 替代方案与风险
至少解释一个替代/不适用原因，指标必须可比，未校核项目显式显示。涉及资产D05、D06、D08；关联领域05、06、11；原包T5-01/T5-02。字段：`alternatives.distinctStrategies`、`alternatives.comparableMetrics`、`alternatives.constraintTrace`、`alternatives.rejectionReason`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S06/C1105-S07/C1105-S08` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R07` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T08 证据可定位和逐结论解释
每个参数引用可定位来源/公式版本和单位，未知信息不可伪称已验证。涉及资产D05、D17；关联领域05、10、11；原包T5-01/T5-02。字段：`explain.claimSourceLocator`、`explain.ruleVersion`、`explain.formulaUnitTrace`、`explain.gapsExplicit`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S03/C1105-S06/C1105-S07/C1105-S08` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R08` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T09 人工采纳与冻结安全
Agent仅提交D05候选草案，D08冻结不覆写，最终业务Owner ACL/CAS/取消重验。涉及资产D05、D08、D17；关联领域01、05、11；原包T5-01/T5-02。字段：`adopt.d05DraftOnly`、`adopt.d08FrozenProtected`、`adopt.ownerAclCurrent`、`adopt.casCancelEpochCurrent`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S06/C1105-S07/C1105-S10` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R09` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

### T10 NC资格与独立消费
CL预览非NC验证，D12→D13→D14→D15独立PASS前不能自动签发D16。涉及资产D09、D12、D13、D14、D15、D16；关联领域07、08、09、10、11；原包T5-01/T5-02。字段：`safety.clOnlyDistinct`、`safety.ncChainIndependent`、`safety.unknownBlocksRelease`、`safety.consumerReceiptReviewed`。[来源](../../../research/sources/CAP-11-05.json) `C1105-S04/C1105-S06/C1105-S08/C1105-S09` → [规则](../../../research/traces/CAP-11-05.json) `CAP-11-05-R10` → [独立正反](fixtures.json) 1正4逐字段负例，另有状态门禁。**仅规划可机检**。

## Port、权限及版本一致性

`ProcessRecommendationPort.recommend({principal,projectId,scopeEpoch,ownerRefs,objective,constraints,evidenceRefs,requestDigest,cancelEpoch})`只返回`Candidate[]/Risk[]/EvidenceLink[]/Unknown[]`，不持有D05或D08写权限。跨域业务Owner Port分别承担真实资产读取与变更：D01(03)、D03(02)、D04(04)、D05/D08(05)、D07(06)、D10(04+02资源引用)；正式Owner会签仍待完成，详见[17资产候选与独立消费者](independent-consumer-handoff.md)及[Owner原资产基线](../../architecture/v0.8/business-assets.json)。

采纳命令只能向05域Owner提交**新的D05 Draft Revision**，写提交瞬时重验ACL、ScopeEpoch、Hash、Frame、expectedRevision CAS、cancelEpoch和动作Digest；冻结D08保持历史，不允许A/B方案互相覆盖冻结。取消先于提交则晚回执无效；提交先于取消则保留真实OwnerReceipt，对账/补偿不伪称回滚。独立消费者必须验证证据和下游数据，不能使用推荐端自己的`PASS`。

## 安全与工程边界

D04仅为名义工艺Setup，D10是实际机床、刀具/控制器执行绑定；D09中立CL、D11 CL预验证和3D刀路播放仅是前期意图/预检查。**D12最终NC原字节→D13控制器语义→D14机床轴时序→D15独立工程验证→D16受控发布**，任一语义未建模为`UNKNOWN`不发布。NC程序的真实执行和现场操作权限不由推荐系统授予；不做材料扫掠仿真。

## Definition of Done（规划阶段）

[GUI/3D方案](UI.md)、[合同样例](recommendation-contract.example.json)、[来源](../../../research/sources/CAP-11-05.json)→[十规则40字段](../../../research/traces/CAP-11-05.json)→[50正反+24状态+2公式合成用例](fixtures.json)、[研究综述](../../../research/topics/R-PROCESS-RECOMMENDATION-001.md)、[独立消费者与迁移回退](independent-consumer-handoff.md)以及[校验入口](../../../tools/check_cap1105_planning.mjs)成套；产品Rust/TS/三轴+B5/OCCT/NC/真实消费测试、17Owner签署、L3全部`NOT_RUN/PENDING_HUMAN`。**规划PASS≠产品PASS。**
