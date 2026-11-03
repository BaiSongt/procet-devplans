# B141｜CAP-08-08 后处理插件来源、离线验签与控制器资格分离（2026-11-03）

**NEWLY_AUTHORED；L1/L2保持原编号、L3待人类审查。** 专项关联原工作包E3-02/E3-03/U4-04。原[CAP-08-08实施级规格](README.md)已经规范后处理插件与配置摘要，但摘要相等不证明来源可信，签名有效也不能证明构建过程达到某等级、后处理器兼容实机或者NC工程安全。本轮与此前B105 G93、B128 WCS、B135 Block Delete研究不重复。

## 实际读到的证据与局限
[七项分级合法来源](../../../research/sources/CAP-08-08-post-provenance-b141.json)：SLSA v1.2 *Approved* Build Provenance §Model/BuildDefinition/RunDetails/Builder指定`subject`、`buildType`、`externalParameters`、`resolvedDependencies`和`builder.id`；Build L1/L2/L3属于不同保障级别（两条同出版物章节非独立论文）。Sigstore Bundle v0.3.2官方帮助（2025-01-14更新）列出验证材料、短期证书签署时间、透明日志证据；Sigstore-Go公开§Trusted Root/Verifier/Policy和Cosign verify-blob说明必须核对签署者身份和预期issuer，**Bundle字段存在≠已完成密码验证**。Sigstore-Go GitHub main没有锁定实际版本，作为研究阅读不能提升为产品固定依赖。NIST SP 800-218 v1.1（Souppaya/Scarfone/Dodson，2022-02-03）**只读官方元数据与摘要**，不编造未读条款。S06本仓原规格为内生规则，不冒称外部标准。

## 数据契约与不等价反例
`PostProvenanceRef{pluginSha256,buildTypeUri,externalParametersDigest,resolvedDependencyRefs,builderId,buildMode,attestationSubjectSha256,bundleSha256,signerIdentity,issuer,trustedRootDigest,policyRevision,signedTimeProof,cryptoVerifierDigest,result}`与`PostProfileRef{d03ResourceExact,d04NominalSetupExact,d10ActualBindingExact,firmwareOptionsDigest,dialectDigest,postConfigDigest}`分别受管。所有Owner引用锁定exact revision/hash/frame/scopeEpoch；D04名义Setup与D10实际机床/安装绑定分离。

* 相同SHA无签名：内容身份已知，来源证据`UNKNOWN_SIGNATURE`，不能视为可信发布。
* 有效签名但证书签署身份或issuer不在策略范围：`UNKNOWN_IDENTITY`，不能当作合法供应商批准。
* 离线Bundle缺可信签署时间：短效证书签署时刻不得靠本机时钟猜测，`UNKNOWN_TIME`。
* 有效Bundle但OEM实际固件/选件不明：`UNKNOWN_CONTROLLER`，禁止凭签名将D13/D15提升PASS。
* 声明SLSA L3但缺独立平台评估：不能自封L3；修改了配置仍需重签/复核新D12最终NC版本。

## 来源→规则→字段→原包→独立正反验收
|规则|字段（每条1正+4独立字段反例）|失败状态|
|---|---|---|
|B141-R01 输入和后处理产物固定身份|`input.d09RevisionHashFrame`、`input.d08FreezePinned`、`input.pluginSha256Pinned`、`input.configAndRuntimeHashPinned`|REJECT_INPUT|
|B141-R02 SLSA Provenance必须可独立核对|`provenance.subjectDigestMatches`、`provenance.builderIdentityTrusted`、`provenance.buildTypeAndParamsReviewed`、`provenance.dependencyRefsChecked`|UNKNOWN_PROVENANCE|
|B141-R03 不得签名即宣称SLSA L3|`assurance.assessmentScopePinned`、`assurance.independentBuilderEvidence`、`assurance.noSelfDeclaredL3`、`assurance.sourceAndBuildTrackDistinct`|UNKNOWN_BUILD_LEVEL|
|B141-R04 离线Bundle验签与身份策略分开|`signature.bundleVersionRecognized`、`signature.cryptoVerified`、`signature.signerAndIssuerExpected`、`signature.trustRootPinned`|UNKNOWN_SIGNATURE|
|B141-R05 签署时间与透明日志证据不可猜|`offline.bundleLocallyPresent`、`offline.signedTimeCryptographicallyVerified`、`offline.logProofOrPromiseChecked`、`offline.noOnlineRequirementAssumed`|UNKNOWN_TIME|
|B141-R06 OEM固件Profile不是签名可证明的|`profile.d03ResourceExact`、`profile.d10FirmwareOptionsExact`、`profile.postDialectCompatibilityChecked`、`profile.unknownBlocksRelease`|UNKNOWN_CONTROLLER|
|B141-R07 受管Owner、CAS和取消晚回执|`owner.guiCliAgentSamePort`、`owner.casAclScopeRechecked`、`owner.cancelLateAckRejected`、`owner.abFreezePreserved`|REJECT_TRANSACTION|
|B141-R08 签名静态PASS不得越过NC执行链|`handoff.d13ReadsFinalD12Bytes`、`handoff.d14UsesActualD10`、`handoff.independentD15Consumer`、`handoff.d16HumanApprovalSeparate`|UNKNOWN_ENGINEERING|

[机器可读8规则/资产和原包映射](../../../research/traces/CAP-08-08-post-provenance-b141-v08.json) → [8正32独立反例及8语义Golden](post-provenance-b141-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0808_post_provenance_b141_v08.cjs)，命令`node tools/check_cap0808_post_provenance_b141_v08.cjs`；仅规划字段与合成状态模型，不属于实际密码库验签或产品安全检查。

## 三入口、失效传播与独立消费者
GUI/CLI/Agent同调08域唯一`PostQualificationPort`受管UseCase；统一左TaskPanel、单Babylon Engine/Scene/Canvas，只读显示证据和差异，浅/深主题字号≤12px。提交前必须重验ACL、scopeEpoch、CAS expected revision、权限撤销、signedTrustRoot、实际D03/D04/D10的Frame和cancelEpoch。取消后晚回执拒写。A/B共享业务事实但不可覆盖D08冻结或旧D16发布修订。插件、信任根、后处理配置、机床固件、签名策略变化触发D12→D13→D14→D15→D16失效闭包；Expand→Migrate→Contract及配对Reader shadow-read、旧Schema只读UNKNOWN、验证迁移失败可回退，不删除用户数据。

中立D09 CL→D12最终NC后处理→**D13独立读取最终NC原字节和子程序闭包并解释控制器语义**→D14依据D10展开物理Joint时序→D15独立工程验证→D16人类审批发布。D11的CL动画不冒充NC验证，未建模语义`UNKNOWN`，不做材料扫掠仿真。独立消费者应在真实08域用正式离线验证器和真实Bundle签名正反验证，09域D15/10域D16各自消费真实NC；本轮真实签名、独立Node文件进程、B5/OEM/NC/17正式Owner与消费者、全仓GFM AST和历史附件原始字节**均NOT_RUN**，L3待审。**规划PASS≠产品PASS。**
