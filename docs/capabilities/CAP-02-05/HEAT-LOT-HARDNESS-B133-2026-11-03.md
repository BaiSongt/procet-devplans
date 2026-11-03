# B133｜CAP-02-05 炉批检验文件、硬度换算适用性及D03/D04/D17证据资格

2026-11-03；新增规划补证（非标准全文转录，非实际材料/产品验收）。关联[原CAP-02-05](README.md)、[材料数据专题](../../../research/topics/R-MS-001.md)及原F1-02/F1-06/E3-04/W2-05/T5-02/T5-03，保持88CAP、36原编号工作包及L1/L2不变，L3待人审。

## 工程结论与新增缺口

1. **牌号/目录版本≠实际炉批/收货批次。** 目录D03仅定义受控MaterialRevision与属性资格；Setup D04需固定材料版本和初始S₀；供应商证书、订单对应关系、炉批和现场收货事实存为D17事件及附件证据。即使同一炉号分两次收货也不得按字符串合并修订。证书必须绑定产品类型、采购订单、关联库存实体及原文SHA；缺证返回UNKNOWN，不能自动提级为物性已认证。
2. **ISO 10474:2013官方摘要只涉及钢铁产品交货检验文件类型**，必须结合采购订单和其他交货条件；本轮没有读取4页收费正文，因此**不宣称3.1/3.2签字或签发责任的具体条款**。非钢材只能走自身适用规范/证据路径，不能把ISO10474当万能材料证书。
3. **实测硬度、经验换算、抗拉强度估计三者分立。** ISO 18265:2013官方摘要指明换算值对实际测试材料以外仅作指标性提示，不能代替正确试验；抗拉强度估计可靠性尤其有限。没有合法可用、同材条件相符的表与实验资格时，不提供确定跨HRC/HV/HBW换算，不自动生成加工许可。本轮不保存或复述收费转换表。
4. NIST Munro SP960-11 (2003)的官方摘要强调可靠性、完整性、一致性评价；Rumble/Sturrock (2008)官方摘要强调制造预测依赖材料数据质量。W3C PROV-O可表达来源派生和责任主体，但并**不**规定Procet的证书、权限或验收门槛。后者均为本仓业务Owner设计。

## 字段级规则与验收

| ID | 关键字段（均逐个独立反例） | 对应风险 | 来源 |
|---|---|---|---|
| B133-R01 | `lot.heatId ／ lot.receiptId ／ lot.documentSha ／ lot.matchedStock` | 炉批来源不能由目录牌号替代 | B133-S01, B133-S07 |
| B133-R02 | `document.standard ／ document.productKind ／ document.orderScopeMatched ／ document.issuerAccountable` | 交货检验文件的产品和采购范围须显式匹配 | B133-S01, B133-S07 |
| B133-R03 | `identity.materialRevision ／ identity.materialHash ／ identity.setupRevision ／ identity.frame` | D03/D04精确修订及Frame不得使用floating latest | B133-S07, B133-S08 |
| B133-R04 | `test.method ／ test.scale ／ test.value ／ test.condition` | 实测硬度保留方法量表条件，不以混标数据代入 | B133-S03, B133-S04, B133-S07 |
| B133-R05 | `conversion.automaticCrossScale ／ conversion.replacesMeasuredValue ／ conversion.tensileCertifiedFromConversion ／ conversion.cuttingApprovedByConversion` | 硬度换算不得自动升级为真实测量、验收或切削许可 | B133-S02, B133-S04, B133-S05 |
| B133-R06 | `provenance.issuer ／ provenance.documentDigest ／ provenance.locator ／ provenance.lineageRef` | 证据责任主体、原始摘要与来源谱系可追溯 | B133-S04, B133-S05, B133-S06 |
| B133-R07 | `owner.materialPort ／ owner.d04Pinned ／ owner.d17Separate ／ owner.d10Separate` | D03目录、D04名义Setup、D17来料批次和D10实装分离 | B133-S07, B133-S08 |
| B133-R08 | `transaction.acl ／ transaction.cas ／ transaction.cancelled ／ transaction.lateAckMutation` | 写提交瞬时权限CAS与取消Fence重检 | B133-S07, B133-S06 |
| B133-R09 | `ui.worlds ／ ui.panel ／ ui.entry ／ ui.previewWrites` | 单Babylon世界、左TaskPanel、同Owner的三种入口 | B133-S07 |

[8条有界来源](../../../research/sources/CAP-02-05-heat-lot-b133.json) → [9项规则/36字段/原编号包与测试ID](../../../research/traces/CAP-02-05-heat-lot-b133-v08.json) → [9正36负与4语义Goldens](heat-lot-b133-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0205_heat_lot_b133_v08.cjs) → [执行等级](../../../tracking/cap0205-heat-lot-b133-verification-2026-11-03.json)。45个合成用例逐次仅改变一个字段，期望码分为`UNKNOWN/REJECT/STALE`与`PLANNING_CANDIDATE_NOT_PRODUCT_PASS`；后者**不是**生产准入或材料证书审核PASS。数值`HRC=38`只是合成数据，不代表实际材料试验结果。

## 业务Owner与UI/3D合同

- D03 MaterialCatalogPort只管理牌号定义/可用条件和精确Revision/Hash；D04 SetupStockPort管理材料引用、S₀与Part/Stock Frame；D17 ReceivingEvidencePort消费并记录实际炉批/收货检验，不能反写D03物性真值；D10实际机床/刀具绑定独立。
- GUI/CLI/Agent三入口共用上述领域服务；制造资源与Setup之间横向切换，唯一Babylon Engine/Scene/Canvas、左UnifiedTaskPanel、浅深主题、最多12px。证书展示和半透明毛坯预览不触发持久提交。
- 接收/采纳时按业务Owner提交瞬时重验ACL、expected Revision/Hash/Frame的CAS、scopeEpoch/cancelEpoch；撤权、切Setup、断线和取消后的晚ACK拒绝写入。旧只含`material_id`而缺修订证据的Setup保持`legacy_unresolved`只读，先影子Reader和证据定位再人工匹配；不能凭最新资源自动补值，回退不破坏已冻结A/B事实。
- 只改变检验文档/材料条件优先使D05工艺建议与物性适用证据`STALE`，**不**重写S₀或D07；如果实际S₀/Frame发生有权限的修改，D07及依赖的D09→D12 NC与D13/D14/D15验证资格需重新判断。中立CL→NC后处理→D13解释→D14轴时序→D15独立验证→D16发布，CL动画不冒充NC验证；未知控制语义`UNKNOWN`，不做材料扫掠仿真。

## 独立消费者与测试分层

规划合成只验证文档规则和字段单变异：9正/36负、4个语义Goldens；真实独立进程需在获得仓库本地副本后执行`node tools/check_cap0205_heat_lot_b133_v08.cjs`。实际交接需由**不同于D03生产Owner**的D04/D17读取者提供同一收货件下的准确材料Hash、炉号、原始检验文档Hash、Frame与撤销/变更证据；质检和工艺消费者要复核证书范围、单位和适用条件，不能用规划合成代替物性签发。当前17正式Owner签署0/17、真实消费者0/17、L3 PENDING_HUMAN，真实证书/量仪、OCCT、NC、OEM及产品测试NOT_RUN。

## 本轮资料阅读深度

- ISO/TC 17/SC20，*ISO 10474:2013* Ed2，2013-07，官方[摘要](https://www.iso.org/standard/53736.html)；2023复审确认，**未读收费正文**。
- ISO/TC164/SC3，*ISO 18265:2013* Ed2，2013-10，官方[摘要](https://www.iso.org/standard/53810.html)；2024复审确认，Annex A–H仅摘要介绍，**未读转换表**。
- ISO/TC164/SC3，*ISO 6508-1:2023* Ed5，2023-12，官方[摘要](https://www.iso.org/standard/84343.html)，**未读试验方法正文**。
- R. G. Munro，NIST SP960-11 (2003-06-26)；J. R. Rumble / C. P. Sturrock，NIST (2008-10-16)：各只读[出版摘要](https://www.nist.gov/publications/data-evaluation-theory-and-practice-materials-properties)和[出版摘要](https://www.nist.gov/publications/reliable-materials-data-whys-and-wherefores-data-evaluation)，未下载论文PDF。
- Lebo/Sahoo/McGuinness（编），W3C [PROV-O](https://www.w3.org/TR/prov-o/)，2013-04-30 Recommendation，定点阅读引言、Starting Point、Expanded Terms；与材料审核策略区别。
