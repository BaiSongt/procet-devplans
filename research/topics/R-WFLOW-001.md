# R-WFLOW-001｜A/B探索与生产编排：控制流、溯源、并发和可恢复提交

**登记日期2026-10-18；阅读边界：四项网页原文/来源门户与既有W3C/RFC的指定节段。研究不是产品证明。**

## 1．工作流模式≠授权模式≠导航阶段

Russell、ter Hofstede、van der Aalst、Mulyar（2006）的工作流控制模式研究将流程选择、分支、同步、取消等问题作为独立分析对象。此处仅阅读Eindhoven大学研究门户的报告摘要，未取得或分析全部报告的具体Petri网，因此只据此建立**必须明确控制流分支与取消行为**的需求，不把A/B视为论文已经规定的工业模式，也不称实现符合43种模式。Procet的A/B（探索/生产）为内部领域设计；Host的manual/semi_auto/full_auto为已有授权配置；UI CAM阶段为展示导航。

## 2．溯源与局部冻结

W3C PROV-DM（2013-04-30 Recommendation）定义Entity/Activity/Agent以及Usage、Generation、Derivation，允许以来源实体修订与活动记录表达“候选产生于哪次Run、哪项快照被采纳”；这不自动提供工艺批准或可信证明。W3C PROV-CONSTRAINTS同日推荐规范提供有效溯源实例的事件排序与类型/唯一性约束。可借鉴一致性检查思路，但Procet必须自行定义领域`freezeScope`、CAS和审批语义，不能把PROV一致性等同NC上机资格。

## 3．乐观并发与持久化恢复

RFC 9110 §13（2022）中If-Match强比较条件请求用于避免HTTP资源被并发覆盖。将它作为**业务设计类比**：workflow提交用ExpectedRevision+PreviewDigest在服务端检查；若是Tauri/Rust原生用例，并非声称系统使用HTTP/ETag，也不能直接照搬其状态码。

SQLite官方`Isolation In SQLite`文档说明WAL下读者使用快照，写入并发可能出现`SQLITE_BUSY_SNAPSHOT`；这支持跨会话旧快照必须拒绝/重新评估。该文档适用SQLite单数据库连接事务语义，**不能证明Project、CAS、Solver与独立DB的组合具有分布式事务原子性**。

## 4．研究来源逐项限定

| ID | 来源与机构、版次 | 实际阅读 | 支持结论 | 不适用边界 |
|---|---|---|---|---|
| SRC-WFLOW-001 | SQLite官方《Isolation In SQLite》，页更新时间2022-04-18 | 官方HTML全文中Isolation Between Database Connections / WAL Snapshot段，section_text | 读快照、BUSY_SNAPSHOT、提交可见性 | 不等于跨独立数据库/CAS原子提交；不等于Procet已实现恢复 |
| SRC-WFLOW-002 | W3C《Constraints of the PROV Data Model》，2013-04-30 Recommendation | Abstract、§1.2、§6目录/一致性类别，section_text | provenance历史一致性需显式约束 | 不定义制造审批、冻结及控制器行为 |
| SRC-WFLOW-003 | N.C. Russell等《Workflow Control-Flow Patterns: A Revised View》，BPMcenter 2006，Eindhoven门户 | 出版元数据与摘要，catalog_abstract | 工作流模式有控制流/分支/取消等建模范围 | 未读完整报告/Petri网，不能声明具体模式已验证 |
| SRC-REF-005 | W3C《PROV-DM》，2013-04-30 Recommendation（既有登记） | 本轮复读 §2、§5目录/Derivation章节，section_text | Entity/Activity/Agent与来源链接 | 溯源事实不等于被批准计划 |
| SRC-REF-003 | RFC Editor《RFC 9110 HTTP Semantics》，2022（既有登记） | 本轮复读§13 Conditional Requests/If-Match，section_text | 条件修改避免lost update的设计类比 | 不是Procet原生通信协议实现证据 |

本轮新增3个来源记录到独立注册文件，复用原有SRC-REF-003/005，不更改旧记录、历史访问日期。详细字段级及正反例追踪见[机器JSON](../traces/CAP-01-05.json)，各编号适用条件以该文件为准。

## 5．设计结论与未决点

要求候选与接管记录的exact来源、冻结范围不可静默覆盖、预览与提交分离、异步任务按requestId恢复。仍待审议的工程事实：Host接管记录的唯一持久化Owner、部分提交补偿与原子可见点、各领域CAS错误词表、真实预检粒度及多CAD实例恢复。**上述属于待设计/待产品验证，不是标准直接要求或现有软件PASS。**