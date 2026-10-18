# R-FEDIT-001｜人工制造特征修订：来源、拓扑演化、事务边界与许可

> 编制于2026-10-19。证据范围为官方公开网页指定章节；ISO仅目录与摘要，不使用未获授权正文。全文与可追溯来源元数据见[来源登记](../sources/CAP-03-06.json)；规则→字段→验收在[追踪JSON](../traces/CAP-03-06.json)。**研究只是外部支持，不是Procet产品测试或合规证明。**

## 1. 官方来源实读与支持边界

1. **OCCT OCAF User Guide**：本轮实际阅读“Transaction mechanism”和“Topological naming / selection & recomputation”。其文档事务支持Abort、Undo，但是**以单个OCAF文档为中心**，跨多个Project、CAS、用户批准数据库不自动成为同一原子事务；拓扑命名的Solve依赖算法的旧新形状历史、正确注册和可解析selector。因此手工确认不能仅凭`faceIndices`永久绑定，且跨系统提交由Host明确控制。官网公开指南对应当前dev文档而非产品锁定7.9.3 ABI。
2. **OCCT Modeling Algorithms User Guide / BRepTools_History**：本轮阅读“BRepTools_History”、“IsDeleted/Modified/Generated”和历史Merge示例。它是有历史的建模算法所提供的关系，而不是任意两个STEP快照天然共享的全局拓扑身份。人工分裂/合并需产生可追溯映射、歧义时人工选择，不能填平原始未知关系。
3. **W3C PROV-DM Recommendation 2013-04-30**：本轮阅读5.1 Entity/Activity、5.2 Derivation/Revision与5.3 Agent责任。一个人工决议产生新版本实体、源于某算法候选或旧特征、带责任Actor是合适的来源表达。PROV-DM**没有定义CAM的几何公差、审批权限或D08冻结协议**；后者是Procet提议的域规则。
4. **ISO 14649-11:2004（Edition 2）官方目录**：本轮阅读官方Status/Abstract/Excluded items。它界定铣削/钻孔工艺数据与泛化制造特征等资源的分界，不能用某个手工确认的制造特征直接宣称已确定刀路、NC或控制器语义。本轮**未读取付费EXPRESS标准正文**，不引用未知条款。

## 2. 理论→设计规则（内部选择须有别于外部义务）

- **几何可信性**：OCAF命名成功还不够；业务应记录确切快照、实例、Frame和校核证据。BRepTools_History只在原操作真实提供History时可用于演化；没有History要保留`unknown`。映射到FEDIT-R01/R03/R05/R10。
- **人工审查与来源图**：FeatureDraft → ReviewActivity(Actor、policy、输入版本) → D02Revision符合PROV修订模型；`approved`另由用户/组织治理定义，不由PROV自动授予。映射到R02/R07/R08/R09。
- **制造意图与实现分离**：ISO 14649-11的目录范围并不等于Procet全栈工艺控制；制造特征确认不能替代Setup、资源适配、工艺冻结、NC执行与验证。映射到R04/R06/R07/R10。
- **领域CAS与幂等**：源要求是Procet内部工程决策，不应说是OCCT或W3C强制“Git式CAS”；C0 Host对`expectedRevision+hash+policy+Actor`在真正提交点验证，失败不可静默覆盖，重复requestId须查原receipt。映射到R08/R09。

## 3. 推导与未获得的证据

推导（非实测）：①只复制UI marker的`faceIndices`无法保证STEP重导后的引用不漂移；②从“确认特征”直接触发下游工序更新将绕过D05/D08 Owner；③OCAF Undo不解决跨存储保存崩溃。以上需要真实模型、Windows+Rust/native OCCT、并发DB故障注入、GUI行为验证。

风险：生产Native OCCT目前已知采用7.9.3锁而本轮公开官网提供dev API，需固定依赖与编译证明；对未拥有合法模型及控制器资料的测试只能保留NOT_TESTED。ISO仅可用官方目录，不作符合性或刀路认证。架构提案保持L3待人类评审、L4不冻结。