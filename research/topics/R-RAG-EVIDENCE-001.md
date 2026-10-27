# R-RAG-EVIDENCE-001｜可复核RAG与受限检索

## 实际文献阅读及论证

[9份来源的作者、版本、时间、URL、章节及局限](../sources/CAP-11-03.json)：Lewis等RAG论文2020年仅HTML摘要及引言；OWASP LLM08/01/06 2025官网公开相关段落；W3C Annotation Selection与PROV-O来源关系；RFC9110 If-Match；NIST AI600-1仅出版页摘要；JSON Schema Draft 2020-12目录及Validation章节（Internet-Draft已到期，非IETF最终RFC）。不编造标准条款，不将NIST摘要当已读PDF，不搬运受限版权全文。

## 来源→规则→字段→产品边界

- Lewis等提出检索记忆与生成相结合，但不保证答案引文成立；故固定Corpus/Embedding/Chunker Revision以及人工黄金检索集，引用必须按实际原件重新核对，不能凭置信分数得出工艺安全结论。
- W3C Annotation的TextPosition/Quote Selector提供目标片段定位，但Source内容变化使位置选择器可能失效；故增加Owner rawHash/exactRevision/许可核对。PROV-O是来源图表达基础而不是制造认证。
- OWASP LLM08强调Embedding/索引越权及污染风险，故检索前后双授权、撤权清除与隔离缓存；LLM01间接注入和LLM06过量代理决定片段只是数据、Agent不能调用Owner Writer和D16签发。
- 未知、缺失许可、错误Selector、语义未建模均`UNKNOWN`或`STALE`，多来源冲突明确`CONFLICT`，保留不可变D08和D12/D15/D16。D04不等于D10，D09 CL动画不等于真实D12→D13→D14→D15 NC执行工程验证。
- 测试计划需独立标注检索golden set，分别测授权召回recall@k/precision@k、引用验证率、跨租户泄漏数、失效延迟、对抗注入假阳性/假阴性；当前无真实数据/阈值，绝不声称指标已满足。

[规则及字段追踪](../traces/CAP-11-03.json) → [10正/40逐字段独立反例+28状态门禁](../../docs/capabilities/CAP-11-03/fixtures.json) → 原T5-01/T5-02。所有规则合成检验仅规划，真实向量检索、Owner ACL、独立消费和NC/B5 **NOT_RUN**；L3/17 Owner PENDING_HUMAN。规划PASS≠产品PASS。
