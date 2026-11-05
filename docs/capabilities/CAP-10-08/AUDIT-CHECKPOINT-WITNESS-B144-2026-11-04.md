# B144｜CAP-10-08 审计检查点、包含证明与独立见证
**日期：2026-11-04｜原编号 CAP-10-08 / E3-06、T5-03 不变｜L3 PENDING_HUMAN｜规划PASS≠产品PASS。**

## 尚未被原CAP-10-08及B55单独验证的问题
原规格T04已规定追加顺序、摘要、时钟质量与更正，B55规定独立消费者，但只保留**当前服务自行计算的哈希链**，不能防止同一服务删除尾部后重新计算、回滚到旧快照或向两个消费者展示互不相容的历史。哈希匹配最多说明“在给定信任根下字节一致”，不保证**完整历史、可信外部时间、设备真实执行、未来不重写，也不构成D15工程PASS**。

## 有界外部理论与独立推导
- RFC 9162（Laurie、Messeri、Stradling，2021-12，Experimental）§2.1.1/2.1.3/2.1.4和§4.9–4.11定义Certificate Transparency树根、包含与旧新树一致性证明。**本轮只借鉴可审计结构；不声明Procet实现CT协议、符合RFC所有协议要求或已执行密码验证。**同尺寸同logId的两份已验签但root不同的检查点，应标 `CONFLICT_EQUIVOCATION` 并请求独立核查；不同尺寸需已验证的一致性证明，而不是“高度更大即可信”。 [官方文档](https://www.rfc-editor.org/rfc/rfc9162.html)
- RFC 8785（Rundgren、Jordan、Erdtman，2020-06，Informational）§1、§3要求对哈希输入JSON选择可复现规范表示；仅是字节编码技术，不证明事件真伪，必须固定编码规范版本、字段与领域分隔。[官方文档](https://www.rfc-editor.org/rfc/rfc8785.html)
- NIST SP 800-92（Kent、Souppaya，2006-09-13 Final）**仅实读官方出版页与摘要，未读PDF正文**；可支持独立日志治理的必要性，不引用其未阅读条款来证明Merkle方案。[官方出版记录](https://csrc.nist.gov/pubs/sp/800/92/final)
- [CAP-10-08原规格](README.md)及[独立消费者交接](independent-consumer-handoff.md)定义Owner责任、事务、A/B冻结及NC发布门禁。这些是**Procet内部规则**，不是外部规范。

## 业务Owner、端口与状态
10域只拥有追加审计索引/检查点，不篡改D01–D17的业务原事实。建议 `AuditCheckpoint{logId,logEpoch,treeSize,rootHash,hashAlgorithm,canonicalizationVersion,previousCheckpointRef,sourceExactRefs,witnessSignatureRef,signerPolicyRevision,aclEpoch,scopeEpoch,createdAt,clockQuality}`。对应 `DigitalThreadAuditPort.appendAuditLinkCAS`、`verifyAuditBundle` 的新字段须**先Expand再双读Migrate、最后Contract**；旧读者不能识别必需证明则返回UNKNOWN，不能默认为已验签。D17设备原始事件、D16发布签署及外部见证分别由不同Owner保管。

包含证明必须绑定实际`leafIndex/treeSize/rootHash`和D12原始NC SHA；跨checkpoint追加应核查原锚点、旧新size与一致性路径；检查点外部签署者及公钥策略需可审计。**同尺寸不同root是冲突，旧根丢失是UNKNOWN，签名来自不受信任的key也为UNKNOWN；仅有本服务自签不能替代真正独立Witness。** 纠错只能追加新事件及旧记录引用，不能静默抹除冻结A/B或D16历史。

D04名义Setup和D10实际绑定仍分别固定exact revision/hash/Frame；统一左TaskPanel/单Babylon世界，GUI/CLI/Agent同一Port，预览/3D拾取无写资格。受管写提交点必须再次核对Owner ACL/scopeEpoch、expectedRevision/hash、取消Fence与幂等键；撤权、并发CAS失败、取消晚ACK拒绝提交。D11 CL_ONLY仍非工程验证，D12 NC→D13执行语义→D14 Joint时序→D15独立Oracle→D16人类批准链缺证时状态UNKNOWN，不以Merkle包含证明抬升NC发布许可，不做材料扫掠仿真。

## 可证伪的执行级规划链
[5条带作者/版次/日期/阅读深度来源](../../../research/sources/CAP-10-08-checkpoint-witness-b144.json) → [8规则32字段/原E3-06、T5-03](../../../research/traces/CAP-10-08-checkpoint-witness-b144-v08.json) → [8正32独立单字段负例+10状态Golden](checkpoint-witness-b144-fixtures-v08.json) → [Node只读结构校验](../../../tools/check_cap1008_checkpoint_witness_b144_v08.cjs) → [执行等级](../../../tracking/cap1008-checkpoint-witness-b144-verification-2026-11-04.json)。

10项Golden覆盖同尺寸不同根、旧新树缺一致性、缺外部见证、size倒退、当前ACL失败、取消晚回执、缺独立D15和正常候选。**Goldens是自主设计的资格状态机，不是RFC 9162真实proof verifier或反双视图实际攻击实验**。实际工具须以两个完全独立进程和存储域复算检查点、验证真实签名/包含/一致性证明并运行断网回放、分叉和篡改测试；本轮该入口标 `TODO_AUDIT_WITNESS_INDEPENDENT_VERIFIER`、`TODO_REAL_SIGNATURE_CONSISTENCY_PROOF`、`TODO_D16_D17_OWNER_REPLAY`，均NOT_RUN。测试必须登记真实二进制SHA、logId、clockQuality、算法、可信锚点、退出码及复现日志，独立D16/D17消费者会签尚为0/17。

**未闭合：** 独立Node文件完整执行、真实密码学及外部Witness、17资产正式Owner/消费者、L3人工审批、历史附件原字节、全仓GFM AST，均不可标产品PASS。