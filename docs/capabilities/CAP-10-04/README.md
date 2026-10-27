# CAP-10-04｜DNC程序交换（V0.8，L3待审）

**原88项目标**：在线下发、回收及传输校验；原关联工作包E3-06/T5-03；长期扩展能力，**本轮仅规划，不声明MVP产品实现**。

## 业务/技术界限
- D16负责不可变已签发NC/子程序与目标配置，D17仅追加收方传输/回读/签收事实。**在线传输、收方回读、程序激活、CycleStart、D15工程验证、现场人工授权是彼此独立的动作**。
- D04名义Setup不能替代D10现场执行绑定。D09中立CL→D12最终NC→D13控制器语义→D14关节时序→D15独立工程验证→D16发布；D11 CL_ONLY动画不能替代NC工程验证。
- 协议以能力发现为前提：OPC UA机器规范§8.1的FileSystem是可选，1.02版§8.4旧ProgramType已弃用并移向OPC40001-3。MTConnect只作为可读观测参考，**不伪称可写DNC**。未知控制器/固件选项/真实读取能力时保持UNKNOWN。
- 禁止材料扫掠模拟、硬编码B5或机床尺寸、自动选择/运行NC、自动扩权；L1/L2冻结、L3仍需人类评审，C0最小公用，不增第二公共发布写入口。

## 10项实施级任务
- **T01 冻结与发起**：只读D16签发对象，核对D12原NC字节、D03机床身份、D10实装Frame、D13控制器方言、D15独立结果；失败UNKNOWN/REJECT。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T02 适配器能力发现**：优先只读枚举OPC UA机器FileSystem支持与实际服务Profile，厂商私有传输映射独立版本化；未知不试写。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T03 身份与权限**：工程端用户/Agent/现场收方分角色，传输写许可和机床启动许可分离，提交前ACL重验。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T04 传输合同**：冻结Manifest、NC及子程序原始bytes、签发hash、块序/大小、SessionNonce与幂等键，不跨Session继承。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T05 Stage写入**：仅隔离临时目录，限制目标路径和权限；禁止覆盖active程序、自动选择程序或启动加工。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T06 收方回读**：接收机独立重算全文件hash和子程序闭包；设备不支持回读时记录UNKNOWN而非自报成功。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T07 生命周期**：断网、重连、超时、乱序、掉电与取消显式状态，完整后才从STAGED_UNVERIFIED到STAGED_VERIFIED。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T08 D17追加审计**：回执绑定D16 exact revision/hash、controllerProfile、D10 Frame、SessionNonce、scopeEpoch；late ACK与重放拒绝。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T09 GUI/CLI/Agent同一入口**：ActivityRail 发布→DNC交换，唯一左TaskPanel；单Babylon Scene只读机床与文件定位，不构建第二3D。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。
- **T10 独立消费者与迁移**：老旧CNC无接口只允许人工介质流程，旧Reader双读/影子比对，故障回退读取器与流程不覆盖冻结。输入须记录原Owner、exactRevision/hash/frame、ACL与scopeEpoch；输出D16引用或D17追加事件；验收与回退参见trace/fixtures。

## 来源→十规则→字段→原包→正反验收
- **CAP-10-04-R01 冻结D16签发对象与目标锚定**：仅使用已签发D16的原NC指纹，目标机器与控制器Profile须精确锁定。字段`identity.signedD16EnvelopeExact`、`identity.targetMachineExact`、`identity.controllerProfileExact`、`identity.d10BindingExact`；证据C1004-S02/C1004-S04/C1004-S10;资产D03/D10/D12/D16;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R02 能力发现与可选传输适配**：需读取真实目标的受支持文件端口/写权限；OPC与厂商私有驱动按Profile显式分支。字段`capability.controllerWritePortVerified`、`capability.transferModeSupported`、`capability.profileRevisionPinned`、`capability.unknownFeatureFailClosed`；证据C1004-S01/C1004-S02/C1004-S03;资产D03/D13/D16;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R03 连接主体与请求意图隔离**：发送端/收方身份、scope和工单意图必须精确一致；传输权不等于机床启动权。字段`auth.senderPrincipalBound`、`auth.receiverIdentityBound`、`auth.scopeAclRechecked`、`auth.noExecutionPrivilegeEscalation`；证据C1004-S04/C1004-S07/C1004-S09;资产D01/D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R04 原NC字节及子程序闭包**：只能传输D16指纹所述的全部原始字节，不能自动规范化NC、替换文件或漏子程序。字段`content.finalNcRawHashExact`、`content.subprogramClosureExact`、`content.noLineEndingTranscode`、`content.manifestDigestExact`；证据C1004-S01/C1004-S08/C1004-S09;资产D12/D13/D16;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R05 预备区接收后独立重算**：收端staging独立重算每个文件原始字节哈希、清单、目标库位置后才能记录接收。字段`staging.receiverRehashIndependent`、`staging.temporaryPathIsolated`、`staging.noActiveProgramOverwrite`、`staging.postTransferReadbackExact`；证据C1004-S01/C1004-S02/C1004-S08;资产D12/D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R06 传输事务与原子阶段门禁**：分块/掉线/断电后恢复须用sessionNonce、完整性及原子提交标识；不得误报成功。字段`transaction.sessionNonceBound`、`transaction.chunkCoverageComplete`、`transaction.atomicCommitConfirmed`、`transaction.reconnectRevalidatesHash`；证据C1004-S02/C1004-S07/C1004-S08;资产D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R07 下载与执行命令物理隔离**：DNC可交换文件或队列草稿，禁止上传成功自动触发NC选择、CycleStart、M代码或加工。字段`operation.stageOnly`、`operation.noCycleStart`、`operation.noProgramActivate`、`operation.humanMachineAuthorizationSeparate`；证据C1004-S01/C1004-S03/C1004-S05;资产D13/D14/D15/D16;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R08 回执因果顺序、取消与幂等**：late ACK、duplicate ACK、取消和切工程后不能改写原已冻结发布事实或产生重复收货。字段`ack.transferRevisionBound`、`ack.idempotencyKeyPinned`、`ack.cancelEpochChecked`、`ack.lateAckRejected`；证据C1004-S07/C1004-S09/C1004-S10;资产D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R09 双向回读与独立消费证据**：上传与反向下载均记录设备侧观察、传输侧证据及独立收方判据；不可自证接收成功。字段`audit.deviceReadbackSeparate`、`audit.producerClaimNotOracle`、`audit.d17AppendOnly`、`audit.unknownReadbackNotPass`；证据C1004-S01/C1004-S06/C1004-S09;资产D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。
- **CAP-10-04-R10 统一Port、单3D与迁移回退**：GUI/CLI/Agent同10域Port、单Babylon与左TaskPanel；旧DNC读模式保留影子回读和无损回退。字段`ui.singleDomainPort`、`ui.singleBabylonWorld`、`ui.leftUnifiedTaskPanel`、`ui.shadowReaderRollback`；证据C1004-S01/C1004-S03/C1004-S10;资产D04/D10/D16/D17;原包E3-06/T5-03；1正+4单字段独立负例。

## 有限责任链和失败状态
- 仅当D16已审签、真实接口具备、目标机床和D10及D15校核齐备、原NC原字节与子程序一致、收方回读完整时，DNC可记录`STAGED_VERIFIED`。这**只是文件传输证据**，不授权机床启动。
- `STAGED_UNVERIFIED`不是完成；offline/未读回/不支持文件系统/控制器Profile无匹配为`UNKNOWN`；哈希不符/权限撤销/目标错配为`REJECTED`；晚回执为`STALE`，状态优先级由可追踪规则定义。
- 提交使用CAS(expectedRevision/hash/frame)+提交前ACL+scopeEpoch+cancelToken；D17写入需独立幂等。A/B共享精确工程事实但不得覆盖冻结结果；GUI中转和Agent解释无越权提交。

## 可追踪交付
[单Babylon和统一左TaskPanel](UI.md) · [10域Port草案](dnc-transfer-contract.json) · [68合成正反状态向量](fixtures.json) · [独立消费者与回退](independent-consumer-handoff.md) · [10份来源与访问层级](../../../research/sources/CAP-10-04.json) → [10规则40字段](../../../research/traces/CAP-10-04.json) → [研究专题](../../../research/topics/R-DNC-TRANSFER-001.md) · [只验证规划的Node入口](../../../tools/check_cap1004_planning_2026_10_27.cjs)。

**验收分层**：规划文件与合成检查≠真实文件传输≠独立控制器读取≠D15物理工程验证≠上机许可。产品、真实OPC UA/厂商适配器、B5、不同机床、浏览器及独立收方均NOT_RUN；17资产正式Owner签署与L3审批PENDING_HUMAN。
