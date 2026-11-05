# R-PROCESS-KNOWLEDGE-001｜受控制造知识、适用域与规则冲突

面向[CAP-11-02](../../docs/capabilities/CAP-11-02/README.md)：区分**可追溯术语/来源**、**有界工程规则**与**真正生产可用的工艺参数**。设计不复制受版权保护全文，不冒充机床知识验证。

## 2026-10-27合法联网证据及其实际阅读深度

- **C1102-S01** SKOS Simple Knowledge Organization System Reference（W3C Recommendation，2009-08-18，Alistair Miles / Sean Bechhofer）：[原链接](https://www.w3.org/TR/skos-reference/)；已读公开§1、§8和§10词表、关系和映射；支持：词项ID、层级与跨体系映射；**局限：词表不决定切削参数、工况适用性**。
- **C1102-S02** Shapes Constraint Language (SHACL)（W3C Recommendation，2017-07-20，W3C RDF Data Shapes Working Group）：[原链接](https://www.w3.org/TR/shacl/)；已读公开§2.1、§3.5和§3.6结构验证与Validation Report；支持：知识结构约束与违规反馈；**局限：符合形状约束不等于制造安全；未运行实际SHACL引擎**。
- **C1102-S03** PROV-O: The PROV Ontology（W3C Recommendation，2013-04-30，Timothy Lebo / Satya Sahoo / Deborah McGuinness）：[原链接](https://www.w3.org/TR/prov-o/)；已读公开摘要、§2和§3.1来源关系；支持：规则、来源、活动、Agent溯源；**局限：来源链不能认证工艺正确或NC安全**。
- **C1102-S04** ISO 13399-1 Cutting tool data representation and exchange（ISO 13399-1:2006 Edition 1，2006-02，ISO/TC 29）：[原链接](https://www.iso.org/standard/36757.html)；仅官方合法目录Abstract、General information、2010 Amendment目录；未读284页标准正文；支持：刀具信息分类与交换上下文；**局限：不引述未读字段、不声称实现标准**。
- **C1102-S05** ISO 513 Classification and application of hard cutting materials（ISO 513:2012 Edition 4，2012-11，ISO/TC 29/SC 9）：[原链接](https://www.iso.org/standard/59932.html)；仅ISO合法目录摘要和版次，未读付费全文；支持：切削材料类别与应用范围版本化；**局限：目录不能推导厂商速度进给**。
- **C1102-S06** JSON Schema Draft 2020-12（Draft 2020-12，2022-06-16，Austin Wright / Henry Andrews / Ben Hutton / Greg Dennis）：[原链接](https://json-schema.org/draft/2020-12)；已读公开规格索引、发布变更、Core/Validation说明；支持：结构Schema验证与演进；**局限：本轮未执行正式JSON Schema validator**。
- **C1102-S07** TOWARDS KNOWLEDGE MANAGEMENT FOR SMART MANUFACTURING（NIST publication listing，2017-07-04，Shaw C. Feng / William Z. Bernstein / Thomas D. Hedberg Jr. / Allison Barnard Feeney）：[原链接](https://www.nist.gov/publications/towards-knowledge-management-smart-manufacturing)；仅NIST官网作者、出版信息与摘要，未读论文PDF；支持：设计、工艺、加工、检测知识治理需求；**局限：摘要不是可直接实施算法**。
- **C1102-S08** Reference architecture to integrate heterogeneous manufacturing systems for the digital thread（CIRP/NIST publication listing，2017-05-22，Moneer M. Helu / Thomas D. Hedberg / Allison Barnard Feeney）：[原链接](https://www.nist.gov/publications/reference-architecture-integrate-heterogeneous-manufacturing-systems-digital-thread)；仅NIST著录摘要和DOI，未读论文全文；支持：多源制造上下文与授权隔离；**局限：不能证明Procet实机已验证**。
- **C1102-S09** RFC 9110 HTTP Semantics（RFC 9110，2022-06，R. Fielding / M. Nottingham / J. Reschke）：[原链接](https://www.rfc-editor.org/rfc/rfc9110.html)；已读公开§13.1.1与§13.2 If-Match强条件与先决条件；支持：知识修订CAS防止lost-update；**局限：HTTP条件不能替代Owner ACL、scopeEpoch及晚ACK屏蔽**。
- **C1102-S10** OWASP LLM06:2025 Excessive Agency（OWASP Top 10 for LLM Applications 2025，2025，OWASP GenAI Security Project）：[原链接](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)；已读公开Root Causes、Common Examples、Mitigation；支持：规则检索与Agent写权限最小化；**局限：风险指南不是软件认证和实测**。

## 来源→规则推导

SKOS仅提供词汇组织和映射，并不担保相似牌号相同工况（R02–R03）。SHACL/JSON Schema提供结构约束思想；结构有效不等于刀具碰撞、工艺适用或NC校验（R05–R06）。ISO 13399和ISO 513**仅已阅读官网目录摘要**，不能推导未经核实的刀具材质范围或转速进给（R03–R05）。NIST两篇仅摘要，用于说明知识跨制造环节的上下文和来源问题，不宣称提取其论文算法（R07）。PROV-O记录规则更新的活动与衍生证据，RFC 9110的If-Match仅辅助Owner CAS而非替代业务权限（R01/R08）。OWASP是限制Agent权限与不可信知识源的威胁模型（R09–R10）。

[来源Registry](../sources/CAP-11-02.json) → [十规则、40字段及T5-01/T5-02](../traces/CAP-11-02.json) → [50独立正反变异+24状态门禁](../../docs/capabilities/CAP-11-02/fixtures.json)。独立消费、OCCT/NC/B5/真实厂商工况均NOT_RUN；L3和Owner待人类。**规划PASS≠产品PASS**。
