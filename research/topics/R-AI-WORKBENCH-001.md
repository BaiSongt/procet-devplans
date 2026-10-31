# R-AI-WORKBENCH-001｜人机共驾、上下文绑定与工具最小权限

研究目标：为 [CAP-11-01](../../docs/capabilities/CAP-11-01/README.md) 的自然语言协同提供可证伪规则，同时避免把AI模型回复当工程事实或Owner写入许可。

## 已核对材料及阅读边界

- **C1101-S01 MCP Tools**（MCP specification 2025-11-25，2025-11-25，Model Context Protocol contributors）：[原网址](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)；2026-10-27访问；已读官方公开正文 User Interaction Model、Listing/Calling Tools、tool schema；定位：User Interaction Model / Protocol Messages / Data Types。支持：模型可发现工具，工具展示、调用提示及人类拒绝能力需在宿主实现。**局限：MCP SHOULD建议并非具体Procet界面实现或实际权限认证**。
- **C1101-S02 MCP Authorization**（MCP specification 2025-11-25，2025-11-25，Model Context Protocol contributors）：[原网址](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)；2026-10-27访问；已读官方公开正文 Introduction、Protocol Requirements、Roles、Overview；定位：Purpose and Scope / Protocol Requirements / Roles / Overview。支持：HTTP transport授权与资源服务器身份的概念参考。**局限：MCP授权为可选机制，STDIO不同；不代替Procet Owner ACL/CAS**。
- **C1101-S03 MCP Prompts**（MCP specification 2025-11-25，2025-11-25，Model Context Protocol contributors）：[原网址](https://modelcontextprotocol.io/specification/2025-11-25/server/prompts)；2026-10-27访问；已读官方公开正文 User Interaction Model、prompts/list及prompts/get；定位：User Interaction Model / Listing Prompts / Getting a Prompt。支持：用户显式选择提示模板、参数与执行建议分层。**局限：协议不强制具体UI模式，也不准许直接修改工程冻结修订**。
- **C1101-S04 OWASP LLM06:2025 Excessive Agency**（OWASP Top 10 for LLM Applications 2025，2025，OWASP GenAI Security Project）：[原网址](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/)；2026-10-27访问；已读公开网页 Common Examples / Prevention and Mitigation Strategies；定位：Root Causes / Minimize Permissions / Require User Approval / Complete Mediation。支持：工具最小授权、人类高影响操作确认、下游全程授权。**局限：安全风险建议不构成具体程序已通过安全测试**。
- **C1101-S05 OWASP AI/LLM Application Security Testing and Red Teaming**（OWASP DevSecOps Guideline online，访问时公开页面，未查得可固定出版日，OWASP）：[原网址](https://owasp.github.io/DevSecOpsGuideline/2-Process/2-4-Test/2-4-6-AI-LLM-Application-Security-Testing/)；2026-10-27访问；已读官网公开风险测试清单：Prompt Injection、Sensitive Information、Excessive Agency；定位：What to test: the OWASP Top 10 for LLM Applications。支持：将检索文档、工具结果中的间接指令作为不可信输入构造负面测试。**局限：清单不替代组织安全评审和实测验证**。
- **C1101-S06 AI RMF: Generative Artificial Intelligence Profile**（NIST AI 600-1，2024-07-26，Chloe Autio / Reva Schwartz / Jesse Dunietz / Shomik Jain / Martin Stanley / Elham Tabassi / Patrick Hall / Kamie Roberts）：[原网址](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)；2026-10-27访问；仅NIST官网官方著录和摘要；未读PDF正文，官网2026-04-08更新；定位：Publication / Abstract / Authors。支持：可信度、生成式AI风险和人工配置的风险评估依据。**局限：不得引用未读细分控制或宣称Procet经过NIST认证**。
- **C1101-S07 PROV-O: The PROV Ontology**（W3C Recommendation，2013-04-30，Timothy Lebo / Satya Sahoo / Deborah McGuinness）：[原网址](https://www.w3.org/TR/prov-o/)；2026-10-27访问；已读W3C公开全文§2、§3.1术语示例；定位：§2 / §3.1 Entity, Activity, Agent, wasDerivedFrom, wasAssociatedWith。支持：来源、模型/Prompt及人类操作责任溯源。**局限：来源图不证明模型答案正确或机床运行安全**。
- **C1101-S08 HTTP Semantics**（RFC 9110，2022-06，R. Fielding / M. Nottingham / J. Reschke）：[原网址](https://www.rfc-editor.org/rfc/rfc9110.html)；2026-10-27访问；已读RFC公开§13.1.1，If-Match强比较及lost update说明；定位：§13.1.1 If-Match。支持：条件提交防止覆盖不同修订。**局限：HTTP ETag不替代领域CAS、scopeEpoch及最终Owner权限重验**。
- **C1101-S09 Babylon.js Engine Specifications**（Babylon.js public online specification page，访问时官方功能页，未锁定npm包版本，Babylon.js contributors）：[原网址](https://www.babylonjs.com/specifications/)；2026-10-27访问；已读官方功能目录 Scene graph、Scene picking、WebGL/WebGPU；定位：ENGINE SPECIFICATIONS / MAIN FEATURES。支持：统一既有Scene和拾取视图可作为AI上下文来源。**局限：功能目录不验证Procet浏览器实例或单Canvas实现，也不表示多Scene方案被官方禁止**。

## 可执行推导（均为Procet设计规则，不冒充官方规范原文）

* MCP工具由模型选择而Prompt由用户发起，故UI明确区分用户意图、工具建议、最终Owner提交；MCP不强制具体UI，真正授权必须下沉到业务Owner。
* OWASP强调 excessive functionality/permission/autonomy 与下游完整调解；基于此设计高风险人类确认、最小Port和跨租户拒绝。工具结果/检索内容视为不可信数据，不能把其中的文字升级为命令。
* PROV-O来源关系可保存User/Model/Tool活动、源文件修订与产生的提案；**来源追踪不证明建议正确**。
* RFC 9110 If-Match提供防lost-update的条件比较启发，但Procet仍需Owner域exact revision/hash/frame和Scope CAS。
* NIST AI 600-1本轮只读官方摘要，不抽取未阅读的措施编号；Babylon官方规格说明Scene和Picking存在，但单世界设计是Procet明确交互原则。
* D04名义Setup≠D10实际执行绑定；D11的CL_ONLY动画不能取代D12→D13→D14→D15独立工程验证，未知控制器语义持续UNKNOWN，不能通过AI摘要申请D16上机。

**追踪链**：[9来源登记](../sources/CAP-11-01.json) → [10规则40字段/原T5-01与T5-02](../traces/CAP-11-01.json) → [50正反独立变异+20状态门禁](../../docs/capabilities/CAP-11-01/fixtures.json) → [Node校验器](../../tools/check_cap1101_planning_2026_10_27.cjs)。本轮仅V8内存合成，不是Node文件进程；真实模型、浏览器、NC/机床、独立消费NOT_RUN。Owner及L3待人类。
