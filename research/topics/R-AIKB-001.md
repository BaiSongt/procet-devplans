# R-AIKB-001｜AI与知识通过受控能力调用的理论与工程边界
> 2026-10-26；10份公开合法登记，未复制第三方版权正文。仅规划补证，不对产品可靠性或制造安全作认证。

## 理论到设计的可验证转化
- **工具协议，不等于业务Owner**：MCP 2025-06-18 Tools支持工具元数据、inputSchema和tools/call，且明确建议人可拒绝调用（S03）；生命周期规定初始化/版本能力协商（S04）。由此推出统一`DomainToolIntent`/工具回执，领域Owner仍须独立重验、不得让模型口头返回SUCCESS代替持久回执。该Procet规则是内部工程决策，不是MCP要求的D08事务条款。
- **安全授权须分层**：MCP HTTP authorization（S05）具有适用传输边界，不能照搬为本地Rust/SQLite授权。OWASP Prompt Injection说明检索内容、工具结果属于不可信输入，模型输出还须在工具边界重验（S06），任何过滤无法保证绝对安全。拒绝动作不能换账户、端口或API绕过。
- **证据与风险评估**：W3C PROV-O的Entity/Activity/Agent关系（S07）启发sourceRef/indexRevision/locator/派生活动记录；它不证明源本身正确。NIST AI RMF 1.0（S01）和GAI Profile（S02）**只读出版元数据及摘要**，用于说明治理动机；不引用未读PDF控制项，不宣称认证。
- **并发与回执**：RFC 9110 §13.1.1 If-Match（S08）支持条件写避免丢失更新的类比；Procet需Owner CAS/ACL/Frame/任务代次的真实事务。OpenTelemetry 1.62.0 Trace API（S09）提供Span/Event/Status描述能力，但Span成功不等于业务提交成功，日志不得泄露客户私密。
- **Schema与版本**：JSON Schema Draft2020-12 Validation（S10）提供类型、required等字段断言；该HTML为2022年到期Internet-Draft，属于参考而非现行强制标准。结构合法仍不证明知识/权限/NC安全。共享LLM网关只对固定Model/Provider/工具协议组合建立兼容试验矩阵。

## 规则与来源索引
S03/04/09/10→R01；S01/02/03/08→R02；S01/02/07→R03；S03/05/06→R04；S05/07/08→R05；S03/07→R06；S03/08/09→R07；S01/04/10→R08；S02/07/08→R09；S01/03/06/09→R10。具体检查字段、资产及每条一正一反和另一个不同字段变异见[来源注册](../sources/T5-01.json)、[规则追踪](../traces/T5-01.json)、[合成样例](../../docs/work-packages/T5-01/fixtures.json)。

不变边界：11域/88CAP/36原编号包/17资产；L1/L2不变、L3待审；C0最小；A/B不改D08冻结；D04 Setup与D10执行配置分离；D09 CL→D12 NC→D13控制器语义→D14轴时序→D15验证→D16发布，UNKNOWN不发布，CL动画不充验证，不做材料扫掠仿真。规划PASS≠产品PASS。
