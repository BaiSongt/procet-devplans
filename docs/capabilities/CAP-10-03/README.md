# CAP-10-03｜离线介质交付（L3待审）

**原目标原文**：`| CAP-10-03 | 离线介质交付 | 无网络现场的校验、签收与回传 | E3-06 / T5-03 | 基础边界与有限场景接入；完整能力需独立验证 |`，源自[固定88项清单](../../architecture/v0.8/03_三级能力映射_88项.md)，不新增第89项，也不修改L1/L2及原36包。

## 场景和责任
客户现场完全不联网，工程室由CAP-10-01产出D16候选、CAP-10-02经人类批准与受保护密钥签发。CAP-10-03独立接收端只核验签发文件、介质交接、工位适用性及回传D17签收**追加事实**；`COPY_SUCCESS`、`HASH_MATCH`、`SIGNATURE_VALID`、`RECEIPT_SIGNED`均不是机床可安全运行的单一充分条件。现场缺少可信时间、吊销或实际绑定证据时输出`BLOCKED_UNKNOWN`，并给出缺证清单。

业务拥有权：10域D16与D17的Owner候选；D03资源只读，D04名义Setup与D10实装不可混写；D08冻结只读；D12最终NC原始字节→D13控制器语义→D14物理Joint时序→D15独立工程验证→D16受控发布，D11仅CL_ONLY不代替D15。17资产Owner**正式会签待人类**。

## 十项实施级任务（关联E3-06、T5-03）
- **T01 介质与交接账本**：介质实名登记、加封/交接与禁止无主U盘；Owner/接收人双身份与迁移日志并存，未知不得接收。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T02 发行版本封存**：仅接受CAP-10-02人类签发的D16，精确冻结原NC/子程序/manifest字节哈希；复制前后重算比对。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T03 离线信任根**：接收端预置可信根、密钥政策、签名算法版本与签发者身份；不能通过USB提供任意新根即信任。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T04 离线撤销/防回滚**：固定离线撤销快照有效期及可靠时间证据政策；断网未知/根版本回滚不得释放上机资格。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T05 安全路径与隔离区**：只接收允许的相对路径、拒绝symlink/UNC/ADS/大小写折叠冲突和文件覆盖；先隔离后扫描。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T06 工位与实际装配匹配**：D04名义Setup、D10实际执行配置、机床/控制器/刀具Frame逐项核对；不能按机床名字猜。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T07 D15独立验证覆盖**：最终NC经D13语义、D14物理Joint时序及D15独立Oracle覆盖；缺少/UNKNOWN/CL_ONLY统一阻放行。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T08 签收与回传证据**：将再哈希、验签、身份、介质和时间证据作为D17追加事件；签收不等于实机运行成功。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T09 统一交互与并发保护**：唯一Babylon Scene + ActivityRail/统一左TaskPanel；GUI/CLI/Agent只用10域OfflineTransferPort；CAS/ACL/取消晚回执重验。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。
- **T10 受控迁移及独立消费者**：旧D16 Reader与新Envelope双读、影子校验和非破坏回退，异常回退Reader不删历史签名/回执。输出合同与正反验收均需绑定exact revision/hash/frame、证据来源、失败状态及独立消费者运行入口；产品执行`NOT_RUN`。

## 来源→工程规则→字段→资产/原工作包→验收
- **CAP-10-03-R01 介质归属与接收主体**：交接需明确介质Owner、身份、接收职责和精确传递意图；未知无主介质阻断。字段：`identity.mediaOwnerKnown`、`identity.mediaSerialBound`、`identity.receiverRoleAuthenticated`、`identity.transferIntentPinned`；来源C1003-S01/C1003-S02/C1003-S09；资产D16/D17；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R02 原字节与子程序闭包**：收端离线重算最终NC及所有调用文件的逐字节SHA；Manifest JCS摘要单独验证。字段：`integrity.finalNcBytesRehashed`、`integrity.subprogramClosureChecked`、`integrity.manifestJcsDigestMatched`、`integrity.fileListExact`；来源C1003-S03/C1003-S04/C1003-S08；资产D12/D16；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R03 独立验签与预置信任根**：接收者不得只信复制方自报PASS；用预置信任根验证签名、签署策略和轮换。字段：`trust.trustedRootPreinstalled`、`trust.signatureCheckedOnReceiver`、`trust.signerPolicyPinned`、`trust.keyRotationPolicyChecked`；来源C1003-S03/C1003-S05/C1003-S04；资产D16；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R04 离线过期、撤销与防回滚**：时间和撤销快照缺口保持UNKNOWN，拒绝信任根版本倒退且不默许过期。字段：`freshness.trustedTimeEvidenceAvailable`、`freshness.revocationSnapshotCurrent`、`freshness.noRollbackRootMetadata`、`freshness.offlineUnknownFailsClosed`；来源C1003-S05/C1003-S01/C1003-S09；资产D16/D17；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R05 封闭文件路径**：拒绝绝对路径、..、symlink/reparse、大小写折叠重复及Windows特殊路径。字段：`paths.relativeOnly`、`paths.noSymlink`、`paths.caseFoldUnique`、`paths.noTraversalOrAltStreams`；来源C1003-S06/C1003-S07/C1003-S01；资产D12/D16；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R06 现场设备与实装精确匹配**：目标机床、控制器Profile及D10实际执行绑定必须与签发证据一致；D04只提供名义Setup。字段：`target.machineIdentityExact`、`target.controllerProfileExact`、`target.d10ExecutionBindingExact`、`target.d04NominalDistinctFromD10`；来源C1003-S08/C1003-S09/C1003-S01；资产D03/D04/D10/D16；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R07 独立NC工程验证证据闭包**：D15必须独立覆盖D12原NC经D13/D14的执行语义和时序，CL_ONLY/UNKNOWN不能取得上机资格。字段：`validation.independentD15Exact`、`validation.d12D13D14ClosureExact`、`validation.noClOnlyPass`、`validation.unknownRejects`；来源C1003-S08/C1003-S03/C1003-S09；资产D11/D12/D13/D14/D15/D16；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R08 签收不等于机床运行**：接收端记录重新哈希和本地验签证据，签收只能追加D17记录且不得自动导入机床。字段：`receipt.receiverHashRecorded`、`receipt.verifiedWithoutNetwork`、`receipt.noAutoMachineImport`、`receipt.receiptAppendOnly`；来源C1003-S01/C1003-S09/C1003-S05；资产D16/D17；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R09 权限重验、取消与晚回执**：10域收端提交前重验ACL、expectedRevision/hash/Frame、scopeEpoch及取消；晚ACK不得写回旧事实。字段：`transaction.precommitAclRechecked`、`transaction.expectedRevisionHashFrameCAS`、`transaction.scopeEpochCancelChecked`、`transaction.lateAckRejected`；来源C1003-S01/C1003-S09/C1003-S05；资产D08/D10/D16/D17；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。
- **CAP-10-03-R10 单域Port、单Babylon与兼容回退**：GUI/CLI/Agent统一调用10域同一Port，单Babylon只读预览、统一左TaskPanel且新旧Reader可受控回退。字段：`ui.singleDomainPort`、`ui.oneBabylonWorld`、`ui.leftTaskPanel`、`ui.rollbackDualReader`；来源C1003-S01/C1003-S06/C1003-S09；资产D16/D17；原包E3-06/T5-03；一正四独立负例及离线门禁对应fixtures。

## 交付状态与双端流程
1. **工程室**：D16已批准签发对象只读导出原始NC/子程序、manifest和附带签名及离线吊销/信任证据，登记介质Owner与目的工位，不改变D08冻结。签名与NC安全验证各自独立。
2. **转运**：记录介质ID、封签与交接双方；复制只产生`MEDIA_COPIED_UNVERIFIED`。不依赖云端实时查验；介质丢失、授权撤销及过期应进入`REVOKED`或`BLOCKED_UNKNOWN`，按组织策略响应。
3. **现场隔离接收**：先限定压缩容器路径、资源大小/文件类型/软链及路径折叠风险，再分别计算原始NC字节/子程序SHA和manifest规范化摘要，独立验签预置可信根/轮换/撤销/可信时间；前端显示明确未覆盖项。
4. **目标复核**：接收者现场选择真实设备与控制器、D10实际装配与Frame，并检查D15独立结果匹配原NC和工位。签名有效但目标机床未知，仍`BLOCKED_UNKNOWN`。
5. **签收回传**：生成只读报告与D17追加签收（脱机可后续手动回带），发送/回带时使用CAS、ACL、scopeEpoch与cancelToken。重复接收、取消晚ACK不可二次写入。签收≠实际加工结果。
6. **独立上机前核对**：由受训现场人员按已批准规程另行核对上机要求；本CAP不调用CNC开始加工，不做DNC在线传输（10-04）、MDC在线采集（10-05）、材料扫掠仿真或运行安全认证。

## 特殊负例
同名大小写或Unicode归一导致文件碰撞、Windows盘符/ADS、路径遍历与软链；U盘移动过程改字节、子程序缺失；签名自报PASS但接收端无根；根回滚、离线时间不可信、撤销快照过期；实际D10机床/刀长/Frame与D04名义配置混用；ACL撤权、CAS冲突、切工程、撤销晚ACK、回执重放。凡不可决定者显式UNKNOWN，禁止隐式放行。

## 接口、GUI、测试和回退
[10域离线传递Port及字段](offline-transfer-contract.json) · [单Babylon/统一左TaskPanel](UI.md) · [不会产生实签的示意回执](receipt.example.json) · [10规则50正反+25状态门禁](fixtures.json) · [独立消费者和迁移](independent-consumer-handoff.md) · [17资产候选Owner表](../CAP-10-01/asset-owner-candidates.json)。

[9项公开合法来源/阅读边界](../../../research/sources/CAP-10-03.json) → [10规则逐字段证据](../../../research/traces/CAP-10-03.json) → [离线信任研究](../../../research/topics/R-OFFLINE-MEDIA-001.md) → [规划校验工具](../../../tools/check_cap1003_planning_2026_10_27.cjs)。`node tools/check_cap1003_planning_2026_10_27.cjs`仅检查规划合成，**没有进行真实U盘、签名验证、OCCT、NC、B5或独立消费者测试**，L3与Owner待审。**规划PASS≠产品PASS**。
