# B179｜CAP-04-08 装夹变更的「无影响」阴性见证与跨域失效传播

日期：2026-11-05；原始规格锁定 Git 864231558ad42b06b04eb7fa9cb81fe5d5721a2b，仅是**新增规划补证**，不是原历史附件恢复或产品测试。原CAP-04-08与原工作包 F1-02 / F1-04 / W2-05 / E3-04 / U4-02 不变；L1/L2不动、L3待人审。

## 发现：算出了受影响清单，不代表剩余资产「不受影响」

现有CAP-04-08要求计算 `changedOwnerFacts` 和 `affectedRefs/unaffectedRefs`，但如果依赖图缺边，图搜索仍能给出看似精确的「无关」列表。B179新增**阴性结论须另有闭世界证据**：每个使用者Owner在同一工程、Snapshot、Schema、Frame、Revision/Hash上证明其完整消费边集合；缺独立声明或Epoch前后不一致时，哪怕图上找不到路径也只能 `UNKNOWN_COMPLETENESS`，不能输出「已确认不受影响」。

定义有向边 `u→v` 表示消费者v**实际读取**生产者u的指定事实。给定变更源集合Δ，受影响候选 `I=Reach⁺(Δ)`；某资产v被允许标「未受影响」的**必要条件**是`v∉(Δ∪I)`，且该闭世界边目录已由相关Owner签名/版本化/同一Epoch完整核对。该条件不是充分的物理安全证据：真实产品仍需域级消费者独立复验。用户编辑UI的显示顺序且未改变任何领域事实时，应返回`NO_DOMAIN_CHANGE`，不得大范围作废历史刀路。

## 工程反例与可计算Goldens

合成图：D04→D05→D06→D07→D09→D12→D13→D14→D15→D16，且D04→D10→D14；D17作为无关旁支。完整同Epoch且已**合成声明**的情况下，从D04变更可到达D05/D06/D07/D09/D10/D12/D13/D14/D15/D16，D17才可成为阴性候选。把`consumerAttested`切为false，则结果必须退到`UNKNOWN_COMPLETENESS`，不能继续把D17标为产品PASS。其余Goldens检测跨Scope、并发Epoch变化、悬挂边、图环、遍历预算和无领域变更，构成8项独立场景。

**实现边界**：D04拥有名义装夹提案/提交，D05、D06、D07、D09各自判重算；D10实际机床执行绑定**仅作独立依赖，不由D04改写**；D08冻结与D16历史发布不得覆盖。中立CL→D12最终NC后处理→D13真实NC解释→D14轴时序→D15独立工程验证→D16人工审批；CL动画/静态BRep校验不冒充NC验证，未知控制器语义`UNKNOWN`，不做材料扫掠仿真。

## 合法来源与阅读深度

| ID | 作者/版本/时间 | 本次实读范围 | 严格局限 |
|---|---|---|---|
| B179-S01 | Moreau/Missier，W3C PROV-DM，2013-04-30 | [官方§5.2.1/5.2.2/5.5.2/5.1.8](https://www.w3.org/TR/prov-dm/) | 来源/修订关系不是完整依赖图证明 |
| B179-S02 | Lebo/Sahoo/McGuinness，W3C PROV-O，2013-04-30 | [官方wasDerivedFrom及qualifiedDerivation](https://www.w3.org/TR/prov-o/) | 不能替代Owner真实消费边证据 |
| B179-S03 | Fielding/Nottingham/Reschke，IETF RFC9110，2022-06 | [官方§13.1.1、§13.2.1](https://www.rfc-editor.org/rfc/rfc9110.html) | HTTP If-Match并非内部多资产原子CAS实现 |
| B179-S04 | Holterman/Brandl等，NIST GCR24-057，2024-10-15 | [官方出版页作者、摘要、DOI](https://www.nist.gov/publications/roadmap-strengthen-us-manufacturing-supply-chain-digital-thread-technology) | **未读PDF正文**，不据此宣称算法有效 |
| B179-S05/06 | 本规划仓 Git 864231558ad4 | [CAP04-08原规格](README.md)、[原88项](../../architecture/v0.8/03_三级能力映射_88项.md) | 这是Procet内生约束，不是外部标准 |
| B179-S07 | Open CASCADE SAS OCCT8.0.1，发布日期未知 | [BRepCheck_Analyzer的IsValid与SetExactMethod](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html) | BRep有效≠夹具安全/完整依赖/NC安全 |

来源详细登记：[sources](../../../research/sources/CAP-04-08-impact-witness-b179.json)。本轮没借用收费标准未读条款；不复制标准/手册全文。

## 8规则/32字段/48合成与独立验收

[规则→字段→CAP与原工作包→TestId](../../../research/traces/CAP-04-08-impact-witness-b179-v08.json)包含R01精确D04身份、R02闭世界图Snapshot、R03无影响阴性见证、R04独立消费者Owner、R05领域事实与UI分流、R06 CAS权限取消栅栏、R07统一入口与单世界、R08最终NC工程证据隔离。每规则1个正例、4个**单字段**反例，另有8个图状态Golden；[fixture](impact-witness-b179-fixtures-v08.json)与[只读Node规划校验](../../../tools/check_cap0408_impact_witness_b179_v08.cjs)形成可复核路径。纯静态合成规则通过不能证明图真实完整、消费者已承诺或物理安全。

**候选消费记录**需有`{owner,projectId,occurrencePath,producerExactRevision,producerHash,frame,edgeSchemaVersion,graphSnapshotHash,epoch,consumerExactHead,negativeWitnessHash,consumerSignatureRef,positiveAndNegativeEvidence}`，对于各Owner逐份独立测试入库。正式签署0/17，真实消费者0/17；所有签名字段当前均为**设计要求**而非已取得的实际凭据。

## GUI/CLI/Agent、取消与回退

共同使用候选`D04FixtureImpactPort`与同一Host权限/CAS事务，CLI与Agent仅为受管入口。唯一Babylon Engine/Scene/Canvas、左侧UnifiedTaskPanel显示「确认受影响 / 需要复核 / 未影响但证据充分 / UNKNOWN」，12px字体上限不变；3D高亮只读。用户取消、撤权、切工程或Setup时增加ScopeEpoch/Generation，丢弃晚到回执，不将旧结果写回当前视图。旧数据缺consumer edge inventory或Frame时先影子导入并标`UNKNOWN_LEGACY`，失效则回旧Reader但不复活旧审批，不改D08/D16冻结历史。A/B复用同一工程事实但不相互覆盖冻结。

## 执行分层与未闭事项

本轮在工具环境按Node脚本同算法的V8逻辑合成48/48符合预期；**独立Node整文件进程未执行**、真实D04/D10/D05/D15消费者、OCCT/NC/B5/OEM未执行；Owner正式签署0/17、真实消费者0/17、L3待人类审查，历史附件原始字节和全仓GFM AST终核未闭。参见[核验等级](../../../tracking/cap0408-impact-witness-b179-verification-2026-11-05.json)。**规划PASS≠产品PASS。**
