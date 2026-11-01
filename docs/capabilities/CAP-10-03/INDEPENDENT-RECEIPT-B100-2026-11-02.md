# B100｜CAP-10-03 D16→D17独立接收证明、同域自证陷阱与幂等回执（2026-11-02）

> 仅V0.8规划研究与合成验收；L1/L2及原88 CAP、36原工作包、17资产、44业务关系边保持原样，L3待审批。正式Owner与真实独立消费者均0/17。规划PASS≠产品PASS。

## 一、问题与增量

[B98结构矩阵](../../architecture/v0.8/ASSET-CONSUMER-INDEPENDENCE-B98-2026-11-02.md)指出D16只向同属10域的D17输出。仅检查`D16发布成功`或`本地复制完成`，无法断言**另一执行主体确实读取到相同NC原字节**。这不是再次编写ZIP路径白名单（B48）或离线事件重放（B73），而是把**不可自证、端到端证据、同域不同实现、重放幂等/冲突、真实收件的验证边界**制成可追踪合同。

## 二、双端证据与状态机

发行端只生成已审核的D16（包含D12最终NC原字节SHA、manifest规范化算法/摘要、D10实际修订、机床ID、Frame、政策、D15独立验证引用、签发者、撤销状态）；状态`PUBLISHED`不可推导`RECEIVED`。离线媒体`COPIED_UNVERIFIED`仅记录转运。**独立接收实现**从隔离目录重新读取NC、子程序闭包及manifest，逐字节哈希并用**接收方预置信任根**验签、核验吊销/可信时间政策和本机D10实际装夹。任一来源缺失按`UNKNOWN`阻放行，明确相反证据为`REJECT`。

D17仅由本地接收器发出`RECEIVED_VERIFIED`回执：必须绑定`release.id`、`release.ncSha`、`receiverAppSha`、`receiverRunId`、`machineId`、`D10 revision`、`Frame`、`policyId`、`eventId`与签收者签名证据。D16签发实现的同一runId或同一二进制Hash不能充当独立D17消费者；同域允许不同实现，但**真实实现独立性必须人类审核和实际执行记录**。

回执去重：同`eventId`与完全相同的`payloadSha/releaseId`仅`IDEMPOTENT_NO_WRITE`；同ID不同内容`REJECT`。取消/ACL撤销/ScopeEpoch变更后晚ACK不重写旧事实。接收签名有效≠实际机床程序已运行≠D15工艺工程安全验证；不调用CycleStart或材料扫掠仿真。

### 真实Owner/消费者要求（待实测）

D16候选Owner `10.ProgramReleasePort`，D17候选Owner `10.ShopfloorObservationPort`；两端须有人类签署的Port/Schema版本、独立源代码exact SHA和二进制SHA、执行者身份、目标机床/Profile/D10 Rev+Hash+Frame、真实D12字节、D15结果和真实接收日志。签收错误不覆盖D16历史，旧Reader影子双读→差异→独立验收→审批切换→必要时回退，追加原事件保留。GUI/CLI/Agent调用相同10域受控Port，唯一Babylon世界与统一左TaskPanel（最大字体12px），Preview不可提交；取消/失效时权限和CAS在Owner提交前重验。D04名义Setup仍与D10实际绑定分离，A/B冻结D08只读。

## 三、实际联网核对的合法来源与阅读深度

[8条分级来源登记](../../../research/sources/CAP-10-03-independent-receipt-b100.json)记录作者、版本日期、URL、已读范围及限制。RFC 7515 §5.2规定消息签名验证步骤（仅签名语义）；RFC 8785 §3.1/3.2说明JSON规范化与I-JSON输入约束（不能用普通JSON.stringify冒充JCS）；RFC 9110 §13.1/13.2为并发条件写入的类比（**不是离线CAS外部强制规范**）；W3C PROV-O说明来源与失效关系；NIST IR8536 2026-09只读官网**摘要**、SP800-53只读**官方目录/摘要**，不引述未读控制条款。B100-S07/S08属于内部固定规划规格，UI/Frame/权限不假托外部标准。

## 四、规则→具体字段→CAP/原工作包→正反验收

[规则JSON](../../../research/traces/CAP-10-03-independent-receipt-b100-v08.json) → [合成fixtures](independent-receipt-b100-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap1003_independent_receipt_b100_v08.cjs) → [分级验证](../../../tracking/cap1003-independent-receipt-b100-verification-2026-11-02.json)。关联CAP-10-03/06/08、原E3-06和T5-03，资产D16/D17。 

| 规则 | 适用规则 | 源ID | 具体字段 | 单点反例/UNKNOWN及幂等 |
|---|---|---|---|---|
| B100-R01 | 已签D16与独立D15资格，不得将CL_ONLY或草稿当作发布证据 | B100-S07, B100-S08 | `release.approval`、`release.d15` | B100-N01, B100-N02 |
| B100-R02 | D12原NC字节与清单SHA双端一致；规范化清单只允许经正确JCS实现派生 | B100-S02, B100-S07 | `release.ncSha`、`receiver.rehashSha`、`release.manifestSha`、`receiver.manifestSha` | B100-N03, B100-N04 |
| B100-R03 | 独立D17必须本地读回真实字节且与发行实现/运行实例隔离 | B100-S05, B100-S08 | `receiver.localBytesRead`、`receiver.appSha`、`release.publisherAppSha`、`receiver.runId`、`release.publisherRunId` | B100-N05, B100-N06, B100-N07 |
| B100-R04 | 独立验签、预置信任根、吊销与可信时间未知必须UNKNOWN | B100-S01, B100-S06, B100-S07 | `receiver.signatureVerified`、`receiver.trustRootPreinstalled`、`receiver.revocationState`、`receiver.trustedTime` | B100-N08, B100-N09, B100-N10, B100-N11; B100-U01, B100-U02, B100-U04 |
| B100-R05 | D16目标工位与D10真实Revision、Frame、策略精确匹配，D04仅名义 | B100-S07, B100-S08 | `release.machineId`、`receiver.machineId`、`release.d10Revision`、`receiver.d10Revision`、`release.frameId`、`receiver.frameId`、`release.policyId`、`receiver.policyId` | B100-N12, B100-N13, B100-N14, B100-N15; B100-U03 |
| B100-R06 | 现场回执须由独立D17生成、绑定原始收件Hash并append-only | B100-S04, B100-S08 | `receipt.kind`、`receipt.signedByReceiver`、`receipt.appendOnly`、`receipt.payloadSha`、`receipt.releaseId` | B100-N16, B100-N17, B100-N18, B100-N19 |
| B100-R07 | 同EventId同Payload幂等零写入；冲突、取消晚ACK和遥控启机意图拒绝 | B100-S03, B100-S07 | `receipt.eventId`、`receipt.history`、`receipt.ackEpoch`、`receipt.activeEpoch`、`receipt.canceled`、`receipt.intent` | B100-N20, B100-N21, B100-N22, B100-N23, B100-N30; B100-I01 |
| B100-R08 | 提交时复核ACL/CAS、scopeEpoch；GUI/CLI/Agent同域Port、单Babylon和左TaskPanel；兼容回退保全历史 | B100-S03, B100-S07 | `release.aclEpoch`、`receiver.aclEpoch`、`receiver.scopeEpoch`、`receipt.scopeEpoch`、`ui.casRechecked`、`ui.sharedPort`、`ui.singleBabylon`、`ui.leftTaskPanel`、`ui.rollbackReader` | B100-N24, B100-N25, B100-N26, B100-N27, B100-N28, B100-N29; B100-U05 |

固定合成样例：`D16-SYN-001`、合成原始NC SHA `sha256:aa…`、真实字节、真实签名与真实机床**均不存在**。同一判定函数V8预检 **37/37** 预期匹配（DESIGN_OK 1，REJECT 30，UNKNOWN 5，IDEMPOTENT_NO_WRITE 1）；独立Node完整文件进程、真实离线机器/签名/D17消费者、全部产品与L3仍`NOT_RUN`。

## 五、独立验证交接与不可替代的证据

- **独立正向**：两个不同代码修订/独立执行者分别签发和验收，现场读取实际NC+manifest及子程序原字节，预装根和吊销/时间政策可验证；产出D17有真实签名的只读原始日志，第三方再按exact哈希比对。不得仅复用本规划合成判定器。
- **独立负向**：将NC改1字节、换D10修订/Frame、替换目标工位、伪造发行端ACK、旧信任根、撤权取消后迟ACK、EventID相同但payload不同，逐个取得真实消费者拒绝日志；缺证写NOT_RUN，不以模拟计数代替。
- **回退**：接收Reader升级先影子双读，若不一致保持旧批准D16不变并把新导入隔离；D17不覆写，只新增更正/撤销事实，冻结D08与旧签发版本保持可审计。

**本轮不能签出规划终验**：17正式Owner签署、17真实独立消费、历史附件原始字节和全仓GFM AST/渲染对等仍未闭合；本报告不证明实际加工资格。
