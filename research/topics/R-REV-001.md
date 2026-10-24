# R-REV-001｜工程修订、并发提交、失效传播与恢复证据

访问日：**2026-10-18**。研究目的：为[CAP-01-03研究回补](../../docs/capabilities/CAP-01-03/RESEARCH-BACKFILL.md)的10条设计规则和20条正反验收提供可反驳依据，并严格区分标准正文、官方实现、内部设计与产品测试。**未执行产品测试，不宣称符合任何特定标准。**

## 阅读登记与适用边界

| 来源ID | 官方出处、版本/日期、实读章节与深度 | 支持的设计推导 | 不支持的主张 |
|---|---|---|---|
| `SRC-REF-003`（已登记） | Fielding等，IETF RFC 9110 *HTTP Semantics*，2022-06；RFC Editor官方HTML，§13.1.1 If-Match、§13.2前置条件；**section_text** | 强校验器用于变更前置条件，避免lost update；失败先识别是否已生效 | Procet不是HTTP资源服务器，`expectedGeneration`不是网络ETag；不得据此给内部DB操作直接使用412语义 |
| `SRC-REF-005`（已登记） | W3C *PROV-DM: The PROV Data Model*，W3C Recommendation，2013-04-30；§2.2.1 Subtyping、§5.2.1–5.2.2 Derivation/Revision；**section_text** | 恢复新实体可记录来源、活动和修订关系 | PROV不规定工程快照实现、审批继承、数据库事务或几何拓扑等价 |
| `SRC-SNAP-005`（已登记） | SQLite Project *Atomic Commit In SQLite*，官方网页未标发布日期；§5 Multi-file Commit；**section_text** | 在特定模式和日志前提下，多ATTACH数据库可以共同原子提交 | 不覆盖独立连接/WAL组合、CAS对象写入、`.pct`与DB共同提交 |
| `SRC-BOUND-008`（已登记） | SQLite Project *Transaction*，官方HTML，版次未标；§2.1–2.3 DEFERRED/IMMEDIATE/EXCLUSIVE及失败；**section_text** | `BEGIN IMMEDIATE`可能在争用时失败；提交操作需要明确冲突结果 | 不能证明Procet当前Host已经正确执行跨Owner CAS |
| `SRC-REV-001`（本次新登记） | Git Project *git-revert* 手册，官方git-scm.com在线手册，网页未固定产品版本；`DESCRIPTION`及有关revert/reset/restore差异；**section_text** | 恢复历史效果可以使用新提交表达，不必改写历史；启发“restoreAsNew”工程策略 | 这是Git仓库的操作语义，不意味着Procet的非Git业务资产天然具备相同事务或merge能力 |
| `SRC-REV-002`（本次新登记） | SQLite Project *Write-Ahead Logging*，SQLite官方网页，发布日期未标注；§1 Overview、§2 Concurrency；**section_text** | WAL的ATTACH多库事务在各库内原子，但不是整个多库组原子；需限定多库场景 | 不反证SQLite回滚日志模式满足条件时的多库原子性，也不证明Procet在使用WAL之外的任意模式 |

本轮资料链接：
- RFC9110 §13.1.1：https://www.rfc-editor.org/rfc/rfc9110.html#section-13.1.1
- W3C PROV-DM §5.2.2：https://www.w3.org/TR/prov-dm/#term-revision
- SQLite原子提交：https://www.sqlite.org/atomiccommit.html
- SQLite事务：https://www.sqlite.org/lang_transaction.html
- Git revert：https://git-scm.com/docs/git-revert
- SQLite WAL：https://www.sqlite.org/wal.html

**两条概念区别**：第一，PROV修订关系是一条可追溯事实，不等于新实体拥有旧实体的制造资格；恢复generation=3的内容至new generation=9，其来源可以指向3，但审批仍按9重新判断。第二，HTTP If-Match是服务端条件请求语义，Procet内部工程头CAS只是借鉴并发冲突检测思想，`requestId`幂等与`expectedGeneration`比较如何实现仍取决于Host/领域存储。

## 研究推理、工程风险及正反例

**RV-1：版本层级必须拆分。** ProjectService指定版本中的`workingGeneration`和`savedGeneration`分开，且`.pct` Header有独立`committedGeneration`。对应`REV-R01`。反例：用户只改领域草稿，UI把容器显示成Saved，导致误判。设计要求三个不同状态和三种诊断。

**RV-2：Revert-as-new是内部产品策略而不是Git合规声明。** Git官方手册说明revert通过新提交反转既有更改；PROV-DM提供修订关系。由此提议`REV-R02/REV-R04`：历史是只读事实，恢复新修订有`restoredFrom`、理由、操作者和时间；已经签发的D16不能随恢复变化。反例：把currentHead指回3、删除8的审计，或把旧审批复制到新头。

**RV-3：CAS有两道边界。** RFC9110强条件校验用于避免lost update；本系统设计需要先保存`Change.preview`评估所依据的project head/object revision/ruleset，再在真正写提交点重新核对。对应`REV-R03`。反例：预览完成后头由8升9，本次仍把8的影响评估直接写成10。中止必须保留草稿；超时后检查requestId回执。

**RV-4：语义Diff不是文本Diff。** `.pct`容器或JSON格式变动可能只改变编码和顺序，不能直接判定机床、刀路与批准均失效。CAD/PMI/资源/工艺/NC各Owner提供`known/unknown`语义差异；版本UI只聚合与投影。对应`REV-R05`。反例：改相机后触发全部NC失效，或改精确几何仅比较Mesh显示而当成无变化。

**RV-5：依赖带用途和证据质量。** `D01→D02→D04→D05/D08→D09→D12→D13→D14→D15→D16`只是可能路径，是否实际失效依字段和使用方式；未知用途不能自动作为安全。对应`REV-R06/REV-R07`。反例：人工编辑D12内容但未重验D13-D15，或者仅NC改动反向使全部Plan无效。此为内部架构设计，不由PROV规定制造依赖。

**RV-6：历史资源闭包与新生产资格分离。** SQLite历史数据库可被打开，不等于历史工件文件、资源修订或控制器语义已齐备；`REV-R08`需要精确引用和内容摘要，退役资源不抹除合法历史快照，但新的签发仍按当前权限与适配证据。反例：旧资源R1退役后，系统自动绑定同名R2，以此宣布历史NC可生产。

**RV-7：跨层提交的中间态必须显式。** 实读`ProjectService::save_internal`看到`rename(tmp,path)`在终检和`set_saved_generation`之前，存在`BeforeConfirmSaved`注入点。若该窗口失败，应区分“外部容器已换”“DB savedGeneration未推进”“操作回执未知”，而不能采用模糊统一Saved。SQLite单文件提交/WAL说明局部存储保证，不能直接推到`.pct+SQLite+CAS`。对应`REV-R09`。这一风险**尚未由真实故障注入证明用户场景发生**。

**RV-8：回退范围有限。** “回退设计数据”为新领域修订，不触碰真实机床已经执行的NC、现场检测D17。软件升级Reader失败可以启用隔离的旧Reader，但不能无控制地改写工程存储；正式发布历史D16不可覆写。对应`REV-R10`。

## 可实施设计检查与不成立场景

验证器必须能关联每条规则→所需字段→至少一条通过和一条拒绝/unknown验收；所有sourceId须存在于统一来源登记（既有`research/references.json`和`research/sources/F1-03.json`，以及本次新增表）。测试应分别覆盖：纯协议合同、项目Host故障注入、各域Owner真实差异、GUI单世界交互、跨进程和离线读取，不将数学模型自证为产品PASS。

**证据等级**：已实读官方网页/源码→理论依据与只读代码观察；`restoreAsNew`、影响传播、幂等回执协议→**内部提案**；20组fixtures→**待实现/未执行产品验收规格**。没有实机/控制器/发布包验收，也没有任何物理安全认证。