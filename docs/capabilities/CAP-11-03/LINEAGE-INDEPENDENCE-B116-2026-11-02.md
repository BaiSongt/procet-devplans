# CAP-11-03｜B116 来源谱系、独立根与矛盾证据补证

**2026-11-02｜V0.8正式规划补证；L1/L2、11域/88 CAP/36原包/17资产分母不变，L3待人审。** 原包T5-01、T5-02。与B80 Unicode Selector、B68注入门禁互补，不取代原规格。

## 研究结论与证据界限

1. **不同URL的转载不能自动计作独立证据。** W3C PROV-O 2013 Recommendation §3.1、属性wasDerivedFrom/wasQuotedFrom/wasRevisionOf/hadPrimarySource描述来源派生；**独立上游根计数是Procet自己的保守策略**，不是W3C强制投票规则。来源环或缺失原始根返回REJECT/UNKNOWN。
2. **引用匹配须有exact Owner版本、原字节Hash及可复核Selector/State。** W3C Web Annotation 2017 Recommendation §4.2.4/4.2.5、§4.3支持文本定位和原件状态；不保证引用唯一，也不授读取权限；同文本不同版本、热处理或OEM适用条件不可直接合并。
3. **同条件矛盾须保留CONFLICT，不以转载数量或向量分数投票消解。** 不可比较的源条件为UNKNOWN，失效引用STALE。W3C DQV 2016为Working Group Note**并非Recommendation**，来源质量度量不是实际真值或D15工程验证。
4. **NIST AI RMF Playbook Measure 1.1为自愿性指南。** 2026年官网表示AI RMF正在修订，不能编造新版要求。Albertoni/Isaac 2020 DOI论文在本轮只使用出版元数据与摘要，不引用未读全文。所有规则R01–R08需要人类L3批准。

## 八项实施规则、字段与验收

|规则|判定目标、精确字段|来源、原包及涉及资产|测试|
|---|---|---|---|
|B116-R01|上游派生图必须绑定原始版本/hash，缺边、循环不能当可靠双重证据；`rootPinned`、`rootDigestMatches`、`graphAllEdgesResolved`、`hasUnresolvedCycle`|B116-S01/B116-S07；T5-01/T5-02；D01/D05|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R02|两篇转载同一源仅计一根，独立性不是URL数量或向量命中数；`independentClaimCount`、`distinctPrimaryRoots`、`lineageComplete`、`aliasesResolved`、`sameSourceNotDoubleCount`|B116-S01/B116-S03/B116-S07；T5-01/T5-02；D01/D02/D05|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R03|同适用条件下的反对意见需CONFLICT，不可用转载多数压制；`claimContextsComparable`、`opposingEvidencePresent`、`conflictDisclosed`、`versionPinned`|B116-S01/B116-S03/B116-S07；T5-01/T5-02；D01/D05/D08|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R04|证据原始字节、Selector、唯一定位及许可逐条校验；`exactSourceHash`、`normalizedSelectorMatch`、`uniqueTarget`、`accessLicenseValid`|B116-S02/B116-S07；T5-01/T5-02；D01/D02|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R05|正文/摘要/WG Note与内生准则分层，禁止编造未读规范；`officialTextSectionRead`、`claimWithinAccessDepth`、`policySeparated`、`noInventedNorms`|B116-S01/B116-S03/B116-S04/B116-S05/B116-S06/B116-S07；T5-01/T5-02；D01/D17|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R06|检索和引用测量需固定分母，不把召回分数等同安全性；`qualityMetricDefined`、`denominatorPinned`、`independentRootsCounted`、`notEquatingScoreToEvidence`|B116-S03/B116-S04/B116-S06/B116-S07；T5-01/T5-02；D05/D15/D17|1正4反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R07|召回后Owner权限、Scope、exact Revision/Hash/Frame与取消Fence重验；`postFilterOwnerAcl`、`scopeEpochExact`、`revocationInvalidatesCache`、`cancelFenceVerified`、`ownerRevisionHashFrameExact`|B116-S07；T5-01/T5-02；D01/D04/D05/D10|1正5反，含明确UNKNOWN/STALE/REJECT/CONFLICT|
|B116-R08|GUI/CLI/Agent同Port，单3D左TaskPanel、D04/D10、冻结及NC责任分离；`sameDomainPort`、`singleBabylonWorld`、`leftUnifiedTaskPanel`、`d04SeparatedFromD10`、`frozenD08Preserved`、`d13UnknownBlocksRelease`、`ownerCasAtWrite`、`lateCancelReceiptIgnored`|B116-S07；T5-01/T5-02；D04/D08/D09/D10/D12/D13/D14/D15/D16|1正8反，含明确UNKNOWN/STALE/REJECT/CONFLICT|

[7项合法来源及章节阅读深度](../../../research/sources/CAP-11-03-lineage-independence-b116.json) → [8规则、字段/CAP/原包和正反ID](../../../research/traces/CAP-11-03-lineage-independence-b116-v08.json) → [45合成案例和4图谱Golden](lineage-independence-b116-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap1103_lineage_independence_b116_v08.cjs) → [执行等级](../../../tracking/cap1103-lineage-independence-b116-verification-2026-11-02.json)。4图谱案例：两篇派生同一原件只能数1根、两原件可数2根、循环应拒绝、上游缺失应UNKNOWN；本轮在V8中做图遍历预检，但**独立Node完整文件进程未运行**。

## 数据契约、GUI/CLI/Agent与失效

设计提案（**非产品既有API**）为`11.EvidenceLineagePort.qualifyClaimWithProvenance`：输入`project/principal/scopeEpoch`、`claimId/applicabilityContext`、`primarySource/derivedSource/edgeType`、`ownerAsset/exactRevision/hash/frame`、`sourceURL/rawByteHash/sourceVersion/accessDepth`、`selector/selectorState`、`evaluationCorpusRevision/denominator`、`expectedRevision/hash`、`taskGeneration/cancelEpoch`。输出`CANDIDATE/CONFLICT/UNKNOWN/STALE/REJECT`、有效根、引用位置与拒绝理由；仅产生`ADVISORY_ONLY`证据，不能直接写D05。

业务事实Owner仍为D01/D05/D08等原领域。检索召回后的每个命中需**当前ACL/Scope、revision/hash/frame**重验；撤权删除缓存可见性，取消晚回执不得恢复旧建议。写入时由业务Owner重新执行事务CAS、权限、scopeEpoch、取消Fence与expected revision/hash。GUI、CLI、Agent三入口共用EvidenceLineagePort；GUI在**单Babylon Engine/Scene/Canvas、左UnifiedTaskPanel**内显示来源树、适用条件和冲突，不增右Drawer/第二3D，浅暗主题、字号≤12px。A/B共用事实与冻结D08，索引迁移仅先影子只读再Owner会签，失败回退读端不覆盖历史。

D04仅名义Setup，D10是实际机床执行绑定；中立D09 CL→D12后处理→D13控制器解释→D14轴时序→D15独立验证→D16受控发布。CL动画/索引质量/D17运行记录均**不得冒充D15**；D13无法确认则UNKNOWN并阻断D16。本规划不做材料扫掠仿真。

## 独立消费者交接与风险

T5-02的独立消费实现和D05真实Owner应从原始文档字节重算源图并核对：相同材料不同热处理、不同时间标准、不同Frame、同根双URL、图环/缺源、撤权后缓存、跨Project、Agent间接提示注入、CAS冲突、取消晚回执。模型升级先双读比对；正式Owner签署与独立消费者全部通过后才能切换索引读端和业务Writer。无真实Corpus与机器环境，本轮不设虚构准确率和认证阈值。

来源等级：W3C PROV-O §3.1/派生属性、Web Annotation §4.2/4.3、DQV §4/§6选段实读；NIST Playbook Measure 1.1定点实读；NIST RMF官网元数据/修订告知；2020论文仅出版商摘要；CAP11-03原稿exact Git Blob只作内生依据。**规划合成45/45及4图谱Golden不等于独立Node、真实ACL/Owner、NC/OEM或产品PASS。L3待审、17Owner正式签署0/17、独立消费者0/17、历史原字节及全仓GFM AST未闭。**
