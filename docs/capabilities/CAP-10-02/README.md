# CAP-10-02｜发布审批与签发（V0.8实施级，L3待审）

**原始三级目标**：`CAP-10-02 | 发布审批与签发 | 授权、审批、冻结与受控签发 | E3-06 / T5-03`。本项是原88项中的第72项详细规划，不新增L1/L2、工作包或资产编号，不代替人类签发。

## 十项实施子任务（原工作包E3-06 / T5-03）
T01. **审批申请生成**：从CAP-10-01不可变D16候选及D08冻结读取精确引用，不增新制造事实；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T02. **职责分离**：申请人、候选制作者、人工审核人按组织审批策略校验，Agent不能当真人；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T03. **最终NC复核**：对D12主/子程序的原始字节Hash及manifest/JCS分别核对；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T04. **执行实装与验证覆盖**：逐D04名义Setup复核D10实装/控制器/刀具，以及独立D15证据；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T05. **门禁与风险处理**：未知宏、CL_ONLY、D15过期、未闭合机床运动范围只准拒绝/UNKNOWN；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T06. **人类签审流程**：审批意见、拒签理由、冲突声明与签审范围不可变留痕；无授权不给签名；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T07. **密钥及签名信任**：签名技术方案待安全评审；密钥不在Git仓、3D/Agent/浏览器；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T08. **CAS权限重验**：提交签审事件前复核ACL、CAS、scopeEpoch、撤权与晚回执；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T09. **审批/撤销状态机**：撤销、退役、失效事件追加记录，不删除历史原始D16证据；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。
T10. **独立消费交接**：CAP-10-03离线重算NC/manifest及验签，旧Schema双读回退；验收包含字段独立正反例、跨域消费者与失败回退；产品验证NOT_RUN。

## 审签状态与业务流程
1. CAP-10-01构造**候选未签发包**。CAP-10-02只接受带固定revision、hash、Frame和scope的候选；D04名义Setup和D10实装分离，D08 A/B模式共享的冻结事实只读。选择3D对象或AI生成意见不能完成业务审批。
2. D12最终NC原字节→D13控制器解释→D14物理Joint轴时序→D15独立Oracle与覆盖范围→D16候选；D11 CL_ONLY或Babylon播放不是D15 PASS；任何UNKNOWN/STALE/未覆盖均阻签；不做材料扫掠仿真。
3. 申请、业务审核、签发授权、密码学签名、CAP-10-03离线独立验签是**五个不同动作**。人类审查不得由Agent或自动规划动作取代；未确立组织签名政策与可靠密钥服务时停在`APPROVED_NOT_SIGNED`或`UNKNOWN`，绝不写成已上机授权。
4. 审批提交前验证申请人/审核人职责冲突、ACL、CAS(expectedRevision/hash/Frame)、scopeEpoch、cancelToken、密钥授权与撤销状态；撤权、项目切换、取消后到达的晚ACK不提交。
5. 签署对象使用明确域分离和版本化JCS快照指纹，原始NC文件另算byte SHA；密钥与信任根绝不写入公开规划仓。批准后任何上游变更生成新的候选和再审流程，历史记录只追加撤销/失效，不破坏旧包字节。

## 来源→规则→字段→资产/原包→正反验收
- **CAP-10-02-R01 职责隔离与双人批准**：请求者不能自审自签；审批策略版本与申请人、审核人真实主体必须精确绑定 字段：`identity.requesterSeparation`、`identity.reviewerAuthenticated`、`identity.policyRevisionPinned`、`identity.noAgentAutoApproval`；来源C1002-S01/C1002-S02/C1002-S06；资产D08/D16；原编号E3-06/T5-03。
- **CAP-10-02-R02 审批对象不可换包**：复核目标必须是CAP-10-01不可变候选的精确修订、原字节Hash及全部依赖闭包 字段：`target.candidateRevisionExact`、`target.ncByteShaExact`、`target.manifestDigestExact`、`target.dependenciesClosed`；来源C1002-S04/C1002-S06/C1002-S07/C1002-S09；资产D08/D12/D16；原编号E3-06/T5-03。
- **CAP-10-02-R03 NC工程验证门禁**：独立D15对最终NC及实际绑定覆盖充分，未知语义、CL_ONLY与旧验证不得签发 字段：`evidence.independentD15`、`evidence.finalNcCoverage`、`evidence.actualD10Matched`、`evidence.unknownBlocksSignoff`；来源C1002-S07/C1002-S09/C1002-S01；资产D10/D12/D13/D15/D16；原编号E3-06/T5-03。
- **CAP-10-02-R04 现场执行绑定核验**：D04名义Setup不得冒充D10实装，机床控制器、工件Frame和刀具规长须确证 字段：`binding.nominalD04Separate`、`binding.actualD10Exact`、`binding.controllerProfileExact`、`binding.toolFrameRevisionExact`；来源C1002-S07/C1002-S09/C1002-S06；资产D03/D04/D10/D16；原编号E3-06/T5-03。
- **CAP-10-02-R05 密钥与信任策略分离**：人类批准记录与密码学签名分层；签名私钥不入公开仓，身份、信任根和密钥状态必须可审计 字段：`trust.signerIdentityAttested`、`trust.keyAuthorityCurrent`、`trust.privateKeyNeverExported`、`trust.trustRootPinned`；来源C1002-S02/C1002-S03/C1002-S05；资产D16；原编号E3-06/T5-03。
- **CAP-10-02-R06 签署字节与算法明确**：批准语义绑定JCS规范化候选摘要、签名算法/域分离和授权策略；不签易变UI文字 字段：`signature.payloadCanonicalDefined`、`signature.algorithmProfilePinned`、`signature.domainSeparated`、`signature.signatureNotSelfHashed`；来源C1002-S03/C1002-S04/C1002-S05；资产D12/D16；原编号E3-06/T5-03。
- **CAP-10-02-R07 撤销与失效不可静默**：撤权、过期、NC变化、控制器变更和审签撤回必须使资格失效；历史签署追加事件不可改字节 字段：`lifecycle.revocationAppendOnly`、`lifecycle.ncChangeInvalidates`、`lifecycle.controllerChangeInvalidates`、`lifecycle.revokedCannotRelease`；来源C1002-S01/C1002-S02/C1002-S05/C1002-S06；资产D10/D12/D16/D17；原编号E3-06/T5-03。
- **CAP-10-02-R08 提交CAS与晚回执**：签发提交点重验ACL、职责冲突、CAS、scopeEpoch与cancelToken，取消晚ACK不能变更冻结 字段：`commit.aclRechecked`、`commit.casExact`、`commit.scopeEpochCurrent`、`commit.lateAckDiscarded`；来源C1002-S01/C1002-S06；资产D08/D16；原编号E3-06/T5-03。
- **CAP-10-02-R09 独立离线验签交接**：CAP-10-03独立消费者重算D12原始文件Hash、验证签名和信任根，未知吊销离线策略标UNKNOWN 字段：`receiver.byteHashRecomputed`、`receiver.signatureIndependentlyVerified`、`receiver.trustPolicyPinned`、`receiver.unknownRevocationBlocks`；来源C1002-S03/C1002-S05/C1002-S08；资产D12/D16/D17；原编号E3-06/T5-03。
- **CAP-10-02-R10 同域界面与回退**：GUI/CLI/Agent统一10域ApproveReleasePort，唯一Babylon Scene、左TaskPanel、A/B冻结共享且旧读者可回退 字段：`ui.singleDomainPort`、`ui.singleBabylonScene`、`ui.oneLeftTaskPanel`、`ui.backwardReaderAvailable`；来源C1002-S01/C1002-S06/C1002-S08；资产D08/D16；原编号E3-06/T5-03。

## 关键异常与失效传播
一人自签、伪人类身份、过期ACL、控制器Profile变化、D10 Frame变化、D12换行变化、D15非独立Oracle、离线无法判断证书吊销或签名有效性、U盘复制成功但收方未验签，均不能放行D16上机。密钥泄露和组织撤销处理依赖待人类批准的信任策略；未建立离线可信根时保持UNKNOWN，不假设联网时间或吊销服务可用。禁止覆盖已冻结的D08及旧D16。

## 界面、接口、迁移和验收
[唯一Babylon/左TaskPanel GUI设计](UI.md) · [10域人类审批端口候选合同](approval-contract.json) · [绝不签发的合成示例](approval.example.json) · [独立消费者和回退](independent-consumer-handoff.md) · [17资产上游候选Owner](../CAP-10-01/asset-owner-candidates.json)。
[9项实际核对来源及阅读边界](../../../research/sources/CAP-10-02.json) → [10规则40字段](../../../research/traces/CAP-10-02.json) → [70个字段案例及14审批门禁](fixtures.json) → [专题](../../../research/topics/R-RELEASE-APPROVAL-001.md)。

规划测试入口`node tools/check_cap1002_planning_2026_10_27.cjs`仅校验JSON映射与合成门禁；实际签名、控制器、B5、Windows离线接收、独立消费者、人工审批均`NOT_RUN/PENDING_HUMAN`。L3未审；**规划PASS≠产品PASS**。
