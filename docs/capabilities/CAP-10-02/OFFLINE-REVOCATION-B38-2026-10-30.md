# B38｜CAP-10-02 离线证书撤销、TSA时间证据与受控签发资格补证

日期：2026-10-30。原CAP-10-02《发布审批与签发》，原E3-06/T5-03工作包；不改变L1/L2、11域88CAP、36原包和17资产，L3待人类评审。与已有B13离线ZIP路径安全不同，本补证聚焦**离线密码学信任状态和业务授权分离**。

## 合法来源及实读限制

- **B38-S01**：D. Cooper等，RFC 5280（2008-05），[官方HTML](https://www.rfc-editor.org/rfc/rfc5280.html)，2026-10-30定点实读§5.1.2.4/5与§6.1/§6.3.3。CRL签发者、thisUpdate/nextUpdate、撤销理由覆盖、信任路径是不同验证条件；本轮**未运行完整PKIX/CRL/OCSP实现**，时间窗口拒绝规则属Procet保守政策候选。
- **B38-S02**：C. Adams等，RFC 3161（2001-08），[官方HTML](https://www.rfc-editor.org/rfc/rfc3161.html)，实读§1、§2.1、§2.4.1/2.4.2。TSA的messageImprint和时间可提供数据存在的证据，**不证明人类已批准、不证明NC可上机**；未核真实CMS/TSA签名、nonce或信任链。
- **B38-S03**：A. Rundgren、B. Jordan、S. Erdtman，RFC 8785（2020-06），[官方HTML](https://www.rfc-editor.org/rfc/rfc8785.html)，实读§1、§3.1/3.2。JCS只用于JSON Manifest域的确定性表达，**不能对最终NC原始字节和子程序做隐式规范化**。
- **B38-S04**：Elaine Barker，NIST SP 800-57 Part1 Rev.5 Final（2020-05），[官方目录及摘要](https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final)，本轮**未读标准正文**。只做密码学密钥管理研究背景，不能据此杜撰CAS、审批或上机条款。
- **B38-S05**：Procet原实施级CAP-10-02，[固定HEAD原文](https://github.com/BaiSongt/procet-devplans/blob/aa9b0a7c9d20793148f78f8122e14021d6f673f2/docs/capabilities/CAP-10-02/README.md)、Git Blob `1d930201bb7bf1b6ccbc2a619be9826e645d5aff`，原连接器完整实读。Owner/CAS/ACL/ScopeEpoch、D04与D10、单Babylon、左TaskPanel、A/B冻结属于**内生业务设计**。

逐项来源的作者、版次、时间、访问日、URL、阅读深度和限制在[来源登记](../../../research/sources/CAP-10-02-offline-revocation-b38.json)中保留。不得将只读目录或摘要写成已阅读付费正文。

## 来源→规则→字段→CAP/原包→正反验收

| 新规则 | 强制边界及主要字段 | CAP / 原包 |
|---|---|---|
| B38-R1 | 最终D12原始NC字节哈希和D15实际覆盖哈希相同；`nc.rawHash`、`nc.d15RawHash`、`nc.manifestHash`、`nc.approvedManifestHash`、`nc.closure` | CAP-10-01/02/03 · E3-06/T5-03 |
| B38-R2 | D04只名义Setup，D10实装Frame与独立D15必须锁定；`binding.d04`、`binding.d10`、`binding.from/to`、`binding.d15Independent`、`binding.coverage`、`binding.d13Known` | CAP-10-02/03 · E3-06/T5-03 |
| B38-R3 | 人类申请者与审核者分离，Agent不得冒充审批；`approval.requester/reviewer/human/noAgent` | CAP-10-02 · E3-06/T5-03 |
| B38-R4 | CRL签名、发行方、撤销状态、时间窗和覆盖理由；`crl.issuer`、`crl.syntheticSignatureChecked`、`crl.coverage`、`crl.revoked`、`crl.thisUpdate/nextUpdate/validationTime` | CAP-10-02/03 · E3-06/T5-03 |
| B38-R5 | TSA imprint、信任、策略和时间，均非组织审批；`tsa.imprintMatches`、`tsa.syntheticTrustChecked`、`tsa.policy`、`tsa.time` | CAP-10-02 · E3-06/T5-03 |
| B38-R6 | 离线可信根/时钟/吊销快照及禁止由签名推CycleStart；`offline.root/clockTrusted/snapshotPinned/noCycleStartInference` | CAP-10-02/03 · E3-06/T5-03 |
| B38-R7 | D16提交点精确Revision/Hash/CAS、ACL、ScopeEpoch、取消/晚ACK；`owner.*` | CAP-10-02 · E3-06/T5-03 |
| B38-R8 | GUI/CLI/Agent共用同一10域ApproveReleasePort，唯一Babylon世界和统一左TaskPanel，12px上限、旧Reader影子回退及D08冻结不覆盖；`ui.*`、`handoff.*` | CAP-10-02 · E3-06/T5-03 |

**失败状态**：原始NC、Manifest或独立D15字节覆盖冲突→REJECT/UNKNOWN；已确认吊销或TSA imprint错配→REJECT；缺少CRL签名证据、理由覆盖、可信时间或离线信任根→UNKNOWN；Owner revision/hash/ACL/scope冲突、取消或晚ACK→STALE。业务人类批准、密码学签发、离线收方验签、现场CycleStart是**四个不同事实**；不能互相升级。

**可用链路不变**：中立D09 CL→D12后处理最终NC→D13受控解释→D14实际物理Joint时序→独立D15工程验证→D16人类审批发布。D04名义Setup和D10实际执行绑定分离；D13未知语义保持UNKNOWN；CL动画/设备观测不能代替NC独立验证，不做材料扫掠仿真。C0最小、A/B同事实不覆盖冻结。

**迁移与界面**：唯一Babylon Engine/Scene/Canvas，统一左TaskPanel最大字体12px；GUI/CLI/Agent同OwnerPort，预览与Pick不写D16。D16域唯一持久事务Owner在提交时再次检查ACL/CAS、Revision/Hash/Frame、scopeEpoch与cancelToken，取消后晚回执不得复活。保留已签发历史、失效后标记STALE，旧Schema影子Reader可回退，D17仅追加事件不授控制权。

## 独立验收与未闭合事项

[8条机器可查来源/字段/原包追踪](../../../research/traces/CAP-10-02-offline-revocation-b38-v08.json) → [1正/55反/4未知合成向量](offline-revocation-b38-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap1002_offline_revocation_b38_v08.cjs) → [核验等级](../../../tracking/cap1002-offline-revocation-b38-verification-2026-10-30.json)。每规则引用正反case ID，字段均有单字段变异；CRL边界、TSA未来、缺可信时钟及晚ACK另设反例。所有`syntheticSignatureChecked`只是**预置的合成测试布尔值**，从未进行真实证书签名、TSA签名、时钟或D15独立验证。

下一道独立消费门禁：CAP-10-03的离线收方在获授权的隔离设备上用第三方PKIX/CMS/时间验证实现、预置可信根与适用吊销策略，分别检验新鲜/过期/撤销/遗漏理由/错误NC字节/过期Scope的真签名和真实回执；通过后方可由业务Owner签署资格。当前独立Node文件进程、真实PKI/TSA、B5/OEM、D15、17消费者均NOT_RUN；正式Owner签署0/17，L3待审，历史原字节与全仓GFM AST仍待审。**规划PASS≠产品PASS。**
