# R-SEM-001｜制造特征语义输出、来源谱系与跨域消费

**2026-10-19实际联网查阅｜仅研究与规划，不是产品测试或人类批准。**

## 研究问题与结论

制造特征输出不是“有一个feature JSON”即可成立：需要说明它引用哪个精确CAD修订、哪个B-Rep实体、哪种PMI解释、哪个算法或人工活动产生、其未知/跳过证据，以及交由哪个领域提交和哪些下游消费。语义输出的**完整性、可追溯性、可采纳性、可制造性**各自独立判断。

W3C PROV-DM（2013-04-30正式Recommendation）以Entity/Activity/Agent、generation/usage/derivation、revision与bundle表达来源与责任。对Procet适合采用为**概念映射**：不可变D01/D02修订对应Entity，运行识别/人工审查对应Activity，算法profile或经认证的工程师作为Agent。其本身不定义本产品审批策略、geometry equivalence或NC验证；内部应明确声明这个边界。

W3C PROV-O（2013-04-30正式Recommendation）公开`prov:wasDerivedFrom`、`wasGeneratedBy`等RDF/OWL术语，可作为未来互操作的导出投影；**不要求内部数据库改成三元组存储**。PROV-AQ（2013-04-30 Working Group Note）讨论通过标准Web机制访问/查询来源，适用于设计查询可发现性，但不是强制标准，更不构成Procet离线场景需要HTTP服务器的理由。

NIST “Enabling the Digital Thread for Smart Manufacturing”官方研究页面描述设计、制造与质量之间的信息复用和追踪问题，支撑需要跨环节能回到原设计出处的方向性需求；这是研究项目介绍，不是对Procet接口实现或精度的认证。

Open Cascade的OCAF指南介绍label/attribute与topological naming的演化关系；此处用作**开源实现机制参照**。它不能推导任意STEP输入的每个面都有跨修订永久同一ID，遇到分裂/合并仍需要可解释候选和人工复核。`BRepTools_History`的Generated/Modified/Deleted只是建模算法历史的一类证据，不能无条件升级为CAD所有版本之间的几何等价证明。在线OCCT文档当前版本不自动等于Procet生产原生OCCT 7.9.3。

## 四类证据边界

| 类别 | 已核对内容 | 不能推断的内容 |
|---|---|---|
| 官方理论 | W3C PROV-DM/PROV-O/PROV-AQ，NIST digital thread | 不授予领域权限，不要求使用RDF，不证明实现符合任何认证 |
| 只读源码 | solver-feature artifact/mapping；CAM geometry_locator和PmiPort；GUI CamViewportFeatureTree；solver-removal provenance | 代码存在不等于产品接线、运行正确或跨工程独立校验通过 |
| 内部设计 | 03域唯一Owner、C0精确引用、命令CAS、语义覆盖分母、离线闭包 | L3仍待评审，字段不是已冻结C1产品契约 |
| 实际测试 | 本轮仅本地规划JSON/链接/追踪及检查器人为错误输入测试 | Rust/TS/OCCT/GUI/NC/Windows运行、数据库真实故障注入全部NOT_RUN |

## 来源登记和阅读深度

| ID | 名称/机构/发布日期 | 实际阅读范围 | 支持内容与局限 |
|---|---|---|---|
| SRC-SEM-001 | W3C PROV-O, Luc Moreau等, Recommendation 2013-04-30 | Section 3 Starting Point Terms, Section 4.1/wasDerivedFrom，`section_text` | 标准化来源词汇；不强制RDF持久化 |
| SRC-SEM-002 | W3C PROV-AQ, Klyne/Groth等, WG Note 2013-04-30 | Abstract、Sections 1.1/1.2、2–4章节导航，`section_text` | 来源发现/检索及动态资源的version约束；Note非规范性标准，不强制联网 |
| SRC-SEM-003 | NIST Enabling the Digital Thread, NIST Smart Manufacturing项目，项目2013–2018，页面创建2014-12-04、更新2022-05-19 | Overview及Resources，`section_text` | 工程→制造→质量可追踪方向，未提供Procet字段/认证 |
| SRC-REF-005 | W3C PROV-DM, Moreau/Missier, 2013-04-30 | Section 2及5.1–5.5，`section_text`（此前已有远端登记，本轮核对正式页面） | 版本化Entity/Activity/Agent/derivation模型，不能充当审批 |
| SRC-CAD-005 | OCCT STEPCAFControl_Reader官方8.0.1 API | 历史远端已登记，当前未单独验证整个产品8.0.1运行 | XDE中装配名称等元数据的Reader边界，不能证明语义PMI全覆盖 |

上表前三条为本轮新增本地来源，后两条复用远端`source-index.json`已登记ID。OCCT OCAF/BRepHistory在线资料实际复核但作为不新增来源ID的**实现说明**，避免与其他pending稿的同源记录重复统计；如未来正式入库时审核同一出版物的registry去重。

## 工程决策依据与需补证的反例

- 正向：同一STEP模型修订中，孔特征经正确TopologySnapshot定位，源PMI语义与人工确认一致，导出完整D02证据节点，可从特征双向追溯至原CAD面、实例、算法profile和审查记录。
- 反向：同一形状内容Hash对应不同装配实例，但只保存单一face:N并把两个孔公差合并。**应拒绝或标AMBIGUOUS**，不能“文件指纹一样即可继承”。
- 正向：一对多face split有可验证BRepHistory时列出两个目标候选及人工判定记录；未定位则`unknown`，已冻结结果保持历史引用。
- 反向：Solver Run状态`Solved`但开放腔特征缺`openSides`并被诊断跳过，却导出100%完整ManufacturingFeature列表。必须拒绝伪完整报告。
- 正向：断网导致提交回执丢失后按requestId获取确定结果，业务revision不重复增加；反向：只要页面按钮Enabled就允许写D02，必须在Owner提交点再次拒绝。
- 正向：离线导出含完整证据闭包；反向：仅导出PDF截图和一个相对文件路径即宣称可重放，应标为`partial_restorable`。

需要F1-03、F1-04和T5-02的实际产品测试切口：真实AP242 PMI/多实例、分裂合并、跨文档晚回执、旧JSON阅读器与Native7.9.3的单元/集成实验。**这些均为TODO_TEST_ENTRY，不是本轮已执行。**

公开仓只登记官方链接与自己的总结，不复制未授权标准正文、客户模型或私有源码。