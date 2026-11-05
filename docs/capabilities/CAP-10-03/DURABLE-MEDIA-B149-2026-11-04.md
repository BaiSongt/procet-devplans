# B149｜CAP-10-03离线介质写入耐久、拔插复核和部分拷贝恢复
**2026-11-04｜NEWLY_AUTHORED｜L3待审｜规划PASS≠产品PASS**

## 业务场景与新增风险
原CAP-10-03目标：“无网络现场的校验、签收与回传”；原编号E3-06/T5-03不变。[B48](WINDOWS-PATH-ALIASES-B48-2026-10-31.md)已约束Windows路径别名，[B100](INDEPENDENT-RECEIPT-B100-2026-11-02.md)已约束独立签收；本轮专门补齐**写入和物理介质移动阶段**。`WriteFile`返回成功≠数据落盘；同机写后Hash≠重新插入后仍可读；rename原子可见性≠断电持久性；D17签收不等于D15安全验证/真实机床加工。全部不可证处必须`UNKNOWN`，不以成功动画升级工程资格。

## 来源、章节及阅读边界
- **B149-S01** Microsoft，Win32 FlushFileBuffers API（2021-10-13 页面更新），[官方/固定原文](https://learn.microsoft.com/en-us/windows/win32/api/fileapi/nf-fileapi-flushfilebuffers)；实读Return Value / Remarks。支持：写完成可能仅缓存；Flush与错误报告须核对；局限：Flush成功非USB硬件断电持久证明。
- **B149-S02** Microsoft，Windows 10/11 removable media removal policy（2025-08-18 页面更新），[官方/固定原文](https://learn.microsoft.com/en-us/windows/client-management/client-tools/change-default-removal-policy-external-storage-media)；实读Quick removal / Better performance / Important。支持：Better performance写缓存情况下安全移除必须执行；局限：不知道目标Windows设备的实际策略。
- **B149-S03** Linux man-pages project; Michael Kerrisk (HTML维护)，Linux man-pages 6.19 fsync(2)（2026-02-08; HTML 2026-09-09），[官方/固定原文](https://man7.org/linux/man-pages/man2/fsync.2.html)；实读DESCRIPTION / ERRORS / COLOPHON。支持：文件fsync不能保证目录项同步；EIO/ENOSPC必须处理；局限：Linux调用语义非Windows或所有U盘固件承诺。
- **B149-S04** Linux man-pages project; Michael Kerrisk (HTML维护)，Linux man-pages 6.19 rename(2)（2026-02-08; HTML 2026-09-09），[官方/固定原文](https://man7.org/linux/man-pages/man2/rename.2.html)；实读DESCRIPTION / RENAME_NOREPLACE / BUGS。支持：原子命名可见与耐久是不同事实，no-replace依赖文件系统；局限：不推导所有FAT/exFAT/Windows相同行为。
- **B149-S05** BaiSongt / Procet业务规划，CAP-10-03 fixed Git blob a6c7db45416b0cde8d71896a89c3565c54dfe373（2026-11-04 固定HEAD读取），[官方/固定原文](https://github.com/BaiSongt/procet-devplans/blob/43538390e81d130158118c0e982a05dc15ed0ad9/docs/capabilities/CAP-10-03/README.md)；实读原T01–T10/R02/R08/R09/R10。支持：D16/D17 Owner、ACL/CAS、取消及GUI/CLI/Agent属于本仓内生规则；局限：内生规格非外部厂商权威，不替代产品验收。
访问日期2026-11-04；[机器来源登记](../../../research/sources/CAP-10-03-durable-media-b149.json)。Linux man-pages 6.19、Microsoft页面按以上指定公开章节读取；没有假称ISO/NIST付费正文、实机文件系统或USB控制器验证。Owner/CAS/GUI等为固定CAP原文的内生规则，不冒充OS官方要求。

## 精确输入、Owner与状态语义
10域`OfflineTransferPort`以 D16 `releaseRevision/hash`、D12最终NC原始字节/子程序闭包、D10真实`executionBindingRevision/hash/frame`、D15独立验证证据、项目scopeEpoch、principal与cancelToken为最小业务输入；D04仅名义Setup。阶段为`PREPARED → STAGING → FLUSH_OBSERVED → PROMOTED_VISIBLE → IN_TRANSIT_UNVERIFIED → RECEIVER_REHASHED`。任何实际文件系统或介质策略不支持的耐久保证须降为UNKNOWN，不可假设USB控制器在Flush后永久安全。禁止覆盖旧D16，半写文件隔离并创建新接收代际，重试不复用旧回执。

Windows须显式记录设备移除策略及安全移除结果（尤其Better performance）；Linux需记录文件`fsync`、含目录项创建/rename后的目录同步状态，记录`EIO/ENOSPC`；不同OS/文件系统不推导相同保证。临时隔离写入+Hash闭包比对后才可提升“可传运候选”；**另机或物理重插**后D17独立实现重新读取全部文件重算Hash、核对D16信任锚/政策、D10绑定和D15验证。`RECEIVED_VERIFIED_NOT_EXECUTED`只表示收件校验，不能自动导入机床或授予加工PASS；无现场可靠时钟/撤销状态时按原CAP阻断。

## 八项来源→规则→字段→资产/原包→正反验收
- **B149-R01 字节封闭及非覆盖写**：字段`pathScoped`、`expectedByteCountPinned`、`bytesClosedBeforeDigest`、`noDirectTrustedOverwrite`；来源B149-S01/B149-S05；资产D12/D16；原包E3-06/T5-03；失效`WRITE_INCOMPLETE`；1正4独立单字段反例B149-R01-P/B149-R01-N1/B149-R01-N2/B149-R01-N3/B149-R01-N4。
- **B149-R02 Flush返回与失败处理**：字段`osFlushInvoked`、`flushResultChecked`、`ioErrorsFailClosed`、`flushNotPhysicalProof`；来源B149-S01/B149-S03/B149-S05；资产D16/D17；原包E3-06/T5-03；失效`FLUSH_UNVERIFIED`；1正4独立单字段反例B149-R02-P/B149-R02-N1/B149-R02-N2/B149-R02-N3/B149-R02-N4。
- **B149-R03 目录与原子命名差异**：字段`sameVolumeStaging`、`noReplaceExistingGeneration`、`directoryPersistenceCheckedOrUnknown`、`atomicVisibilityNotDurability`；来源B149-S03/B149-S04/B149-S05；资产D16/D17；原包E3-06/T5-03；失效`PROMOTION_UNPROVEN`；1正4独立单字段反例B149-R03-P/B149-R03-N1/B149-R03-N2/B149-R03-N3/B149-R03-N4。
- **B149-R04 介质移除策略**：字段`removalPolicyRecorded`、`ejectRequirementSatisfied`、`unplugDuringWriteRejected`、`hardwareCacheUncertaintyExplicit`；来源B149-S02/B149-S01/B149-S05；资产D16/D17；原包E3-06/T5-03；失效`REMOVAL_UNCERTAIN`；1正4独立单字段反例B149-R04-P/B149-R04-N1/B149-R04-N2/B149-R04-N3/B149-R04-N4。
- **B149-R05 独立重新插入再哈希**：字段`physicalRemountOrIndependentReader`、`receiverRehashAllFiles`、`exactClosureMatchesD16`、`noMtimeOrSenderPassProxy`；来源B149-S01/B149-S03/B149-S05；资产D12/D16/D17；原包E3-06/T5-03；失效`REINSERT_REHASH_MISSING`；1正4独立单字段反例B149-R05-P/B149-R05-N1/B149-R05-N2/B149-R05-N3/B149-R05-N4。
- **B149-R06 半写恢复与代际回退**：字段`previousPublishedGenerationImmutable`、`partialCopyQuarantined`、`retryCreatesNewGeneration`、`receiptSequenceMonotonic`；来源B149-S03/B149-S04/B149-S05；资产D16/D17；原包E3-06/T5-03；失效`ROLLBACK_AMBIGUOUS`；1正4独立单字段反例B149-R06-P/B149-R06-N1/B149-R06-N2/B149-R06-N3/B149-R06-N4。
- **B149-R07 签发/执行资格独立**：字段`trustedD16RecheckedIndependently`、`d10ActualBindingHashFrameExact`、`d15IndependentD12D13D14Evidence`、`d17ReceiptNeverExecutionPass`；来源B149-S05/B149-S02；资产D03/D04/D10/D12/D13/D14/D15/D16/D17；原包E3-06/T5-03；失效`RECEIVER_QUALIFICATION_MISSING`；1正4独立单字段反例B149-R07-P/B149-R07-N1/B149-R07-N2/B149-R07-N3/B149-R07-N4。
- **B149-R08 事务/GUI与旧Reader**：字段`guiCliAgentSame10DomainPort`、`singleBabylonLeftTaskPanel`、`ownerAclCasScopeCancelRechecked`、`lateAckRejectedAndPairedReaderRollback`；来源B149-S05；资产D16/D17；原包E3-06/T5-03；失效`TRANSACTION_REJECTED`；1正4独立单字段反例B149-R08-P/B149-R08-N1/B149-R08-N2/B149-R08-N3/B149-R08-N4。

[规则追踪](../../../research/traces/CAP-10-03-durable-media-b149-v08.json) → [40正反+8状态Golden](durable-media-b149-fixtures-v08.json) → [只读Node](../../../tools/check_cap1003_durable_media_b149_v08.cjs) → [验收等级](../../../tracking/cap1003-durable-media-b149-verification-2026-11-04.json)。

## GUI/CLI/Agent、独立消费者与回退
GUI保持**单Babylon Engine/Scene/Canvas**、唯一左侧UnifiedTaskPanel，阶段显示写入/Flush/命名持久/安全移除/重插全闭包/签名/D10/D15/D17独立状态；CLI与Agent均只能调用10域Owner Port，禁止绕开ACL/CAS自签“已上机”。提交前重验exact revision/hash/frame、ACL、CAS、scopeEpoch、cancelToken，取消后的晚ACK只读记录，不能写回旧事实。旧Reader通过双读与受控迁移回退，不修改冻结D08/旧D16或历史D17。

真实验收应由独立Windows和Linux接收实现执行：中途拔出、模拟ENOSPC/EIO/Flush失败、rename后目录同步失败、目标已存在、Better performance未安全移除、重插损坏/缺子程序、同幂等键异摘要、旧包签名、错D10实装/Frame、D15 UNKNOWN、撤权和晚ACK、旧Reader回退；全部`NOT_RUN`。NC链路仍为中立CL→后处理D12→D13语义→D14轴时序→独立D15→D16，未知语义UNKNOWN，不做材料扫掠仿真。**规划PASS≠产品PASS。**
