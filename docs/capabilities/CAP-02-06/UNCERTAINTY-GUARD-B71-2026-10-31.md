# B71｜CAP-02-06测量不确定度、三区判定与D03/D17隔离（2026-10-31）

> 本轮为原CAP-02-06研究增量，不增加11域/88CAP/36包；L3待人类评审。新稿NEWLY_AUTHORED，不称历史附件字节恢复。关联原B0-02、E3-06、T5-02、T5-05、U4-03、U4-04。原[业务规格](README.md)与[UI](UI.md)继续有效。

## 1. 可复核的数学反例

D01确切已审规格为`LSL=9.95mm,USL=10.05mm`。合成D17观测采用`uc=0.02mm,k=2,U=k·uc=0.04mm`，展开区间为`[y-U,y+U]`。NIST TN1297 §6.1公开正文解释`U=k·uc`，§6.2提示置信解释取决于分布等前提，**不能从k=2无条件推得95%工程认证**。

| 本件测量y/mm | y±U/mm | 本**内生保守区间policy**结果 | 理由 |
|---:|---|---|---|
| 10.00 | [9.96,10.04] | CANDIDATE_CONFORMING | 完整包含在规格区间 |
| 10.02 | [9.98,10.06] | INDETERMINATE | 中心落在容差内、区间却越过上界 |
| 10.11 | [10.07,10.15] | CANDIDATE_NONCONFORMING | 整段超过上界 |
| 9.89 | [9.85,9.93] | CANDIDATE_NONCONFORMING | 整段低于下界 |
| 9.99 | [9.95,10.03] | CANDIDATE_CONFORMING | 触及下界、仍完全包含 |
| 10.09 | [10.05,10.13] | INDETERMINATE | 与上界相切，严格不相交不成立 |

此区间判定是**Procet需要质量Owner批准的演示决策策略INTERVAL_CONTAINMENT_V1**，不是ISO 14253-1:2017的默认概率规则。公差与区间边界必须明确单位、数值精度和开闭区间；缺数据为`UNKNOWN`，校准/修订过期为`STALE`，非法值或越权为`REJECT`。判定误接收/误拒收的实际风险依测量分布与应用政策另行评估，不能从当前合成计算中推断。

## 2. D01/D03/D17及执行链Owner契约

| 资产 | 唯一权威来源 | 可承诺 | 不可承诺 |
|---|---|---|---|
| D01 | 03域设计/PMI Owner exact revision/hash/frame/unit/limits | 已批准设计公差/基准 | 本件已测量或已验收 |
| D03 | 02域制造资源Owner exact revision/hash/校准档案 | 仪器、探针、能力、适用工况候选 | 资源重复性=此次测量不确定度；校准证书=工件合格 |
| D04 | 04域ProcessSetup Owner | 工艺名义装夹及Frame | D10控制器实际偏置 |
| D10 | 04域ExecutionBinding Owner | 实际机床/控制器/测头配置版本 | 由名义D04自动推断 |
| D17 | 10域现场观测Owner exact revision/hash/measurement method/calibration snapshot/uc/k/U | 有来源的本次测量与审核回执 | HTTP、OPC或CL预览即质量或机床PASS |
| D15/D16 | 09/10域独立验证和发布Owner | 自己的工程证据与审批 | D17观测自动提升为NC安全或上机许可 |

拟议`MeasurementReviewRequest{d01RevisionHash,d03RevisionHash,d17RevisionHash,d04ProcessSetupFrame?,d10ExecutionBinding?,policyRevisionHash,actor,expectedD17Revision,requestId,scopeEpoch,generation}`及`MeasurementReviewEvidence{valueMm,combinedStandardUncertaintyMm,coverageFactor,expandedUncertaintyMm,uncertaintyBudgetRef,methodHash,calibrationSnapshotHash,frameRef,decisionState,diagnostics}`属于**待审批L3合同**。GUI/CLI/Agent只能通过统一受管`MeasurementReviewPort`的Preview/Review/Confirm业务入口，提交点由D17 Owner重验ACL、scope、CAS、资源/观测确切修订、撤权与幂等。取消晚回执可归档但不得提交或污染当前工程。

唯一Babylon Scene负责3D尺寸/测点标签只读投影；所有编辑/待审状态在左侧UnifiedTaskPanel，不能开第二个3D或右Drawer。质量判定意见与真实D17观测是不同事实；新D17只追加版本与失效通知，不改D01/D03/D08冻结A/B事实，迁移Reader/Writer配对，回退保留旧版本与判定来源。中立CL→NC后处理→D13执行语义→D14物理轴时序→D15独立验证→D16发布仍独立完整；本CAP不做材料扫掠，CL动画绝不冒充NC工程验收。

## 3. 判定顺序与验收证据

先判断`STALE`（取消/晚回执/校准或代次过期），再判断`REJECT`（撤权、CAS冲突、单位不一致、无效U/uc/k、伪造D15/D16、越权UI写），再判断`UNKNOWN`（缺实际D17、原始方法/不确定度预算、Frame、Hash/Policy）；随后对固定内生policy计算：若`y-U>=LSL && y+U<=USL`仅候选符合；若`y+U<LSL || y-U>USL`仅候选不符合；否则不可决。候选不是正式质量Disposition，也不是生产许可。

[6项来源及作者版本/阅读层级](../../../research/sources/CAP-02-06-uncertainty-guard-b71.json) → [8条规则/字段/原包及每规则正反验收](../../../research/traces/CAP-02-06-uncertainty-guard-b71-v08.json) → [58条机器合成案例](uncertainty-guard-b71-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap0206_uncertainty_guard_b71_v08.cjs) → [本轮等级记录](../../../tracking/cap0206-uncertainty-guard-b71-verification-2026-10-31.json)。Node另含6项整数微米数学Golden以交叉验证浮点边界，但不是实际独立质量消费者。

## 4. 外部阅读范围与局限

NIST TN1297官方HTML §6.1–6.5、§7.1–7.4已读；网页提示不再更新。ISO 14253-1:2017官网仅公开目录和Abstract（Edition3,2017-10,2023确认），**收费正文未读**。BIPM JCGM106:2012仅读DOI及摘要，未打开PDF。NIST Phillips/Krystek 2014官方著录及摘要已读，未读期刊全文。原CAP-02-06本轮通过GitHub连接器按确切Blob读取；CAS/GUI/D04-D10及冻结边界均为Procet内部要求，不能说是ISO/NIST条款。逐项作者、URL、版本、访问深度见来源登记。

## 5. 真实验收与风险余项

仅58项V8**同一判定函数**规划合成和6项内存整数微米Golden通过。独立Node实际文件执行、真实量具/校准、不确定度预算、D17数据库事务、产品GUI、NC与B5/OEM、独立D15/D16及17资产消费者全部NOT_RUN。正式Owner签署0/17、L3待人类批准；历史原件原始字节及全仓Markdown GFM AST/锚点终核未闭。**规划PASS≠产品PASS。**
