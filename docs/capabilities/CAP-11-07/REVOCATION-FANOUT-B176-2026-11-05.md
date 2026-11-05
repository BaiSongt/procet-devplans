# B176｜CAP-11-07 知识撤销的反向依赖闭包与冻结隔离
日期：2026-11-05；版本：V0.8、L3待人类审批；原T5-01/T5-02；本文是新编规划研究，不是历史原件恢复/产品验收。

## 事实模型与关键判定
证据失效不能仅将原知识K标记已删除：它可能被方案、工艺计划、图纸候选或推荐引用。历史精确修订K@revision/hash/Project/Scope及已经发生的采纳审计必须保留；**失效阻断的是后续可靠引用与新采纳，不改写D08冻结或历史NC**。对有向边`u→v`定义“v的可信性依赖u”，源u撤销影响`Reachable(u)\{u}`。要求有界遍历、无环、边完整、Project/Scope一致与事件Epoch完整；悬边、缺事件、环、跨项目及预算不足均`UNKNOWN`、停止新采纳。遍历成功仅证结构规则符合，不证明依赖关系实际完备。

## 官方文献与阅读限制
|ID|实际阅读与版本|适用范围|
|---|---|---|
|B176-S01|[W3C PROV-O](https://www.w3.org/TR/prov-o/)，Lebo/Sahoo/McGuinness编，2013-04-30，expanded `wasRevisionOf/wasInvalidatedBy/invalidatedAtTime`|描述实体版本与失效，并不规定Procet图算法|
|B176-S02|[W3C PROV-DM](https://www.w3.org/TR/prov-dm/)，Moreau/Missier编，2013-04-30，§5.1.8、§5.2/5.3|失效后的实体不再可用；非物理NC撤销证明|
|B176-S03|[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)，Fielding等编，2022-06，§13.1.1/13.2|HTTP If-Match强比较、防丢失更新，内部CAS为独立设计|
|B176-S04|[NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/)，2026-11-05仅读公开概览与四函数目录|自愿建议且更新中，不宣称已读所有措施或获制造认证|
|B176-S05/S06|[CAP-11-07](README.md)、[T5-01](../../work-packages/T5-01.md)，B175 exact HEAD及Git Blob|领域Owner与界面规范为Procet内生约束|

作者、URL、访问日期、版本、实读章节和限制在[来源登记](../../../research/sources/CAP-11-07-revocation-fanout-b176.json)。无收费标准全文/私有产品源。

## 原工作包与Owner数据契约
候选`11.KnowledgeOwnerPort.revokeEvidence`为**待实现端口提案**，不得冒充真实API。固定`knowledge.id/revision/sourceSha/scopeEpoch`、撤销EventId/原因/受权Actor、PROV活动与时间、CAS expectedHead、ACL、CancelGeneration。T5-01统一GUI/CLI/Agent的工具意图和Owner回执，T5-02只生产OCR/图纸证据候选，不代写知识撤销事务。撤销生成新的不可变KnowledgeRevision与审计事件；相同事件幂等，迟到ACK不能复活。提交临界点必须重查Project/ScopeEpoch、revision/hash/frame、ACL及taskGeneration和取消栅栏；独立D05消费者重新判定工艺是否允许新采纳，D08冻结不覆盖。

D17现场观测与知识评价分开；D04名义Setup不等于D10实际执行绑定。原链路D09中立CL→D12最终NC→D13执行语义→D14轴时序→D15独立验证→D16批准发布不变。知识失效不能替代D13/D15；未知厂商语义必须UNKNOWN，CL动画不算工程验证，不做材料扫掠仿真。

## 八项可机检规则
|规则|规则主题|字段（独立四字段验收）|资产|
|---|---|---|---|
|B176-R01|来源精确知识修订及Project/Scope|`knowledge.id`, `knowledge.revision`, `knowledge.sourceSha`, `knowledge.scopeEpoch`|D01/D05 |
|B176-R02|受权撤销事件与行动者|`revoke.eventId`, `revoke.reason`, `revoke.authorized`, `revoke.actor`|D17 |
|B176-R03|PROV来源失效与历史字节保留|`provenance.relation`, `provenance.activityId`, `provenance.invalidatedAt`, `provenance.preservesHistory`|D08 |
|B176-R04|反向依赖闭包、环及跨域、预算|`graph.closureComplete`, `graph.noCycle`, `graph.noCrossScope`, `graph.budgetWithin`|D05/D08 |
|B176-R05|读模型Epoch完整与UNKNOWN降级|`reader.currentEpoch`, `reader.minEpoch`, `reader.gapFree`, `reader.unknownBlocked`|D05/D17 |
|B176-R06|领域CAS ACL取消Fence及晚回执|`commit.expectedHead`, `commit.aclRechecked`, `commit.cancelFence`, `commit.lateAckIgnored`|D05 |
|B176-R07|GUI/CLI/Agent共用领域端口与单3D|`ui.sameOwnerPort`, `ui.singleWorld`, `ui.leftTaskPanel`, `ui.noRightDrawer`|D11 |
|B176-R08|独立消费、冻结保护与NC验证隔离|`consumers.d05NewRevisionOnly`, `consumers.d08FrozenUntouched`, `consumers.d15NcIndependent`, `consumers.d16NoAutoGrant`|D05/D08/D15/D16 |
[追踪JSON](../../../research/traces/CAP-11-07-revocation-fanout-b176-v08.json)绑定6来源、8规则、32字段、原T5-01/T5-02、8正例、32独立单字段负例。[Fixture](revocation-fanout-b176-fixtures-v08.json)另有8个图Golden，覆盖传递闭包、无关旁支、环、悬边、预算耗尽、跨scope、无依赖、重复边。读者可使用[只读Node入口](../../../tools/check_cap1107_revocation_fanout_b176_v08.cjs)，真实跨域测试必须另行独立完成。

## GUI/失效传播/迁移与回退
一个Babylon世界/Canvas/Engine，左UnifiedTaskPanel展示来源撤回、受影响依赖、人工采纳与冲突原因；Ribbon仅是入口，禁止第二右Drawer，浅深主题与字体不大于12px。所有入口使用同Owner Port，3D拾取只能给出GeometryRef候选不产生写权限。事件缺号、旧reader未带来源Hash或Epoch、旧冻结模型缺失必须显式`LEGACY_UNVERIFIED/UNKNOWN`且只读；双读影子迁移校验反向依赖闭包后才切换，失败回滚旧reader但继续撤销阻断。A/B同一事实，不互相覆盖冻结。

**核验分层：** 本轮V8内存同判定函数48/48合成符合预期；独立Node文件进程、实际KnowledgeOwner/RAG/跨资产消费者/NC/B5/OEM均NOT_RUN；正式Owner签署0/17、真实独立消费者0/17、L3待人审、历史原始附件与全仓GFM AST未终核。**规划PASS≠产品PASS。**
