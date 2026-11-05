# B185｜W2-04跨域双见证和失败恢复增补

> 原编号W2-04不变，补充[原规格](../W2-04.md) S02、S03、S04、S05、S06、S07、S08、S10，设计待L3人审。

01域Project/Host只负责接管协调、任务代次、可见Head与恢复索引；05域独立持有D05新草稿、D08冻结、commitMarker；06域D06候选不得直接写D05；D04工艺装夹和D10执行绑定不得混同。

每次跨域接管需保存HandoffIntent(projectScope,sourceRevision/hash/frame,selectedCandidateRef,freezeDigest,expectedHead,aclEpoch,taskGeneration,idempotencyKey,payloadHash)；SealedManifest实际字节Hash；05域DomainReceipt(commitId,planRevision,planHash)和01域ProjectVisible(commitId,headRevision)分别由Owner写入。缺任一权威见证则UNKNOWN_RECOVERY，禁止COMMITTED_DRAFT。原D08不原位修改，回退以新修订表示。

独立消费者必须从另一进程复验双Setup、旧generation晚ACK、权限被撤销、同Key异Payload、staging密封前强杀、05域提交后/01域发布前强杀、发布后ACK丢失及恢复幂等，记录真实bytes/hash/frame。不能以UI mock或同函数合成代替。

[CAP-01-05专项研究](../../capabilities/CAP-01-05/HANDOFF-RECOVERY-B185-2026-11-05.md) → [8规则32字段](../../../research/traces/CAP-01-05-handoff-recovery-b185-v08.json) → [8正32反10Golden](../../capabilities/CAP-01-05/handoff-recovery-b185-fixtures-v08.json) → [Node只读规划门禁](../../../tools/check_cap0105_handoff_recovery_b185_v08.cjs)。

真实跨库、断电、NC/D15、实际独立消费者NOT_RUN；正式Owner0/17，L3待批。规划PASS≠产品PASS。
