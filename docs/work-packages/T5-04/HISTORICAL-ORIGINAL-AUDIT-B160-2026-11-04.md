# B160｜T5-04 受控迁移：三份旧架构JSON缺失与原字节身份审计

**2026-11-04｜NEWLY_AUTHORED 研究/负证据审计；原36工作包T5-04（关联T5-03、B0-02），不新增CAP或业务资产编号。L1/L2不变、L3待人审。规划PASS≠产品PASS。**

[6项合法来源及访问深度](../../../research/sources/T5-04-historical-original-b160.json) → [8规则/32字段/原包](../../../research/traces/T5-04-historical-original-b160-v08.json) → [8正32单字段反例8状态Golden](historical-original-b160-fixtures-v08.json) → [只读Node工具](../../../tools/check_t504_historical_original_b160_v08.cjs) → [真实Tree观察快照](../../../tracking/historical-original-audit-b160-2026-11-04.json) → [分层核验](../../../tracking/t504-historical-original-b160-verification-2026-11-04.json)。

## 一、真实发现：README列出的三份JSON并未在固定Git Tree中

2026-11-04通过原GitHub连接器独立重读公开仓库，规划分支 exact HEAD `bc8f7a8b39487241e2fdf07dacc071af042e4fbe`，原始Git Tree `403c2ec7a38412c755565ef48b3070debe905629`；递归返回`truncated=false`、2494项（其中687份Markdown）。全Tree**没有任何一个**以下精确文件名，也未发现同名其它路径：

| 按旧README引用的路径 | B159 Tree | 规划分支路径历史查询 | main路径历史查询 | 当前处置 |
|---|---|---|---|---|
| `docs/architecture/v0.8/capability-map.json` | 缺失 | 0条 | 0条 | `MISSING_ORIGINAL_BYTES` |
| `docs/architecture/v0.8/work-packages.json` | 缺失 | 0条 | 0条 | `MISSING_ORIGINAL_BYTES` |
| `docs/architecture/v0.8/code-evidence.json` | 缺失 | 0条 | 0条 | `MISSING_ORIGINAL_BYTES` |

查询均是GitHub REST `commits?path=<精确路径>&sha=<分支>&per_page=100`，另对默认main同路径查询；每次返回空数组。本结果**只能证明指定可达分支与精确路径的本轮负证据，不能证明它们从未存在于其他路径、已重命名文件、游离对象、以前本地分支、用户文件或其他仓库**；GitHub路径过滤并未运行Git `--all --follow`。Git官方`git-log`对`--follow`和可达历史的范围也有明确定义。不可从0结果推断删除责任人或时间。

前期`CAP-01-02`补证附件和少数旧Python校验器的**历史原字节**仍不明；当前`research/sources/CAP-01-02.json`等新编资料只是满足规划追踪，不可重标为历史原件。Files Library/会话语义检索未找到三个精确同名原附件，**该检索不是对用户所有存储或所有命名的穷尽证明**。

## 二、原附件缺失并不等于88/36/17原基线自动丢失

已存在的`docs/architecture/v0.8/03_三级能力映射_88项.md`、`04_开发工作包_36项.md`和`business-assets.json`仍作为原V0.8候选范围来源；88/36/17的分母不可因为三个历史JSON缺失而暗改。它们的**原始JSON字节来源未证实**，不可以用Markdown自动转JSON并命名为原始的`capability-map.json`。`docs/architecture/v0.8/README.md`此前的JSON目录是意图说明，不是Git Tree的文件存在证据；B160只添加事实澄清而不删除历史承诺。

从MD新建结构化索引可以做，但须使用**新文件名、新Schema、新Commit、明确`NEWLY_AUTHORED`、派生来源/生成工具/可审计映射及人工审查**。即便值相同，也不能用`prov:wasDerivedFrom`之类的来源关系自动证明**原字节**一致。真正恢复原件至少需要合法原Blob或文件字节、可信原始hash或可审计的签名/版本见证、相同字节hash比较、授权来源和批准人；若原hash根本未知，归类`UNVERIFIED_ORIGINAL`而非`VERIFIED_ORIGINAL`。

## 三、T5-04迁移接口与治理门禁

`HistoricalOriginalEvidence = {sourceRepo, exactHead, gitTreeSha, path, blobSha?, contentDigest?, byteOrigin:RECOVERED_ORIGINAL|NEWLY_AUTHORED|MISSING_ORIGINAL, accessScope, observationTime, observedBy, historyQueryScope, historyResultCount, evidenceRef, reviewState}`。

`RestoreOriginalCandidate`是01域只读候选端口，不发布或覆写旧名。领域Owner提交实际迁移前还需核对每一D01–D17的`exact revision/hash/frame/ACL/expectedCAS/scopeEpoch/taskGeneration/cancelGeneration`，撤权、切项目、取消或后到回执全部拒绝并保留事件日志。各业务对象由唯一Owner写，C0仅管理身份/单位/修订/Frame/Scope/协议。GUI/CLI/Agent都使用同一领域Port；GUI仍是单Babylon世界和左UnifiedTaskPanel、≤12px、浅深主题，历史缺失仅可显示`MISSING`而不能在展示层持久化伪原件。离线旧Reader必须保留诊断和回退。

源→规则→字段→原CAP/原包→独立正反机器测试已入Trace；8条规则每条4字段、各1个正例和4个**独立单字段**反例，并有8个来源状态Golden。数学/状态Goldens仅用于区分`MISSING_ORIGINAL`、`UNVERIFIED_ORIGINAL`、`NEWLY_AUTHORED`、`HASH_MISMATCH_REJECT`及`VERIFIED_ORIGINAL`，**当前三项永远不能由这些Goldens转为已恢复**。

## 四、最终交叉覆盖与阻断

原T5-04业务主责为平台与集成，B0-02负责88/36/17候选原范围，T5-03负责独立消费者/交接；真实Owner签署0/17、独立消费者0/17、L3人工批准缺失。最终导航需显式展示此历史原字节缺口，任何未关闭附件风险不得掩藏于PASS数字。后续若真取得原文件，必须首先校验来源可合法入public仓、原hash与路径/版本，然后单独审批恢复；**不得在原文件名凭空生成替代品**。

迁移不得篡改A/B同一事实或已冻结D08，D04工艺Setup与D10执行绑定分离，最终工程链`中立CL→D12 NC后处理→D13执行语义→D14轴时序→D15独立验证→D16发布`；CL播放不能授予NC安全等级、未知指令保持UNKNOWN、不实施材料扫掠仿真。

## 五、证据深度及未完成

GitHub官方Tree、Commit列表精确路径只读查询已执行；Git官方log手册与W3C PROV-O 2013-04-30公开正文指定章节实读；不是付费标准正文，也不冒称GitHub的路径历史查询等于所有ref的重命名考古。本次8正+32单字段负+8Goldens为本地V8同谓词**48项合成**，与仓库内Node独立文件进程/完整仓AST、真实产品、Owner签署、合法旧文件、独立跨域消费者、Win11回退、NC/B5/OEM均分开列明。**规划PASS≠产品PASS**。
