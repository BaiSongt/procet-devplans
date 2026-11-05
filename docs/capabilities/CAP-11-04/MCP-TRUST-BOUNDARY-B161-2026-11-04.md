# B161｜CAP-11-04 MCP工具元数据可信边界与Agent提交资格（2026-11-04）

> 原11域/88 CAP/36原工作包/17业务资产不变。本补证是**新编专项研究**，不是安全产品认证、标准全文转录，也不构成L3审批。对应原CAP-11-04、CAP-11-08；原工作包T5-01、T5-02，关联T5-03独立交接。

## 1. 新增结论（与既有R01–R10互补）

MCP 2025-11-25 Tools规范允许模型发现和调用工具，但要求对非可信服务器的**annotations视为不可信提示**。元数据中的readOnly或幂等提示不等于Procet领域Owner书面授权、ACL/CAS或证据资格；tools/list的分页与list_changed通知需要将工具目录Snapshot绑定具体epoch和服务端可信身份，防止目录漂移/同名服务工具劫持。规范还建议人有权拒绝工具调用，但不替代系统对最终写入的认证。

MCP 2026-07-28安全最佳实践明确讨论混淆代理、token passthrough、audience验证与渐进最小权限；HTTP授权链与本地stdio传输不能混作同一认证流程。OWASP LLM06:2025把**过宽功能、权限与自主性**列为过度代理的重要诱因。NIST AI 600-1官方已核对2024-07-26著录与摘要，**未读取全文**，不从其摘要推导任何具体强制技术条款。

**Procet内生设计（不是MCP标准规定）：**任何Agent输入、tool description、检索文本、工具回执或前端状态都不得成为业务Owner授权令牌。真正写入需由原D01/D07/D16领域Owner Port按User+Project+Scope+exactRevision+assetByteDigest+Frame进行CAS与当下ACL重验；取消后到回执应丢弃并保留审计。C0仅承载身份、修订、单位、Frame与协议的最小公共结构。

## 2. 受控执行序列与状态

1. **发现**：可信安装/服务登记→逐页枚举tools/list→以qualified server/tool + inputSchema SHA + catalogEpoch建立有限目录；未知来源保持UNKNOWN，禁止以tool annotations授予写权限。
2. **计划**：LLM的动作提案标为PROPOSED，工具输出与资源链接是UNTRUSTED_TOOL_DATA；经schema校验后的数据仍不能被提升为后续系统指令。
3. **授权**：用户确认具体动作Digest+目标项目+Owner对象+有限有效期；HTTP token必须适用当前resource audience，不能原样透传到下游。
4. **写入**：目标领域Owner执行最终CAS、ACL、cancelGeneration、ScopeEpoch和Frame重验，结果记录不可变audit receipt；过期/已撤权/晚回执拒绝。跨接口重试的副作用需要幂等账本，绝不能把提示模型去重当事务幂等。
5. **发布资格**：D04 Setup不等于D10机床执行绑定；中立CL→D12后处理→D13最终NC重解释→D14轴时序→D15独立工程验证→D16发布。真实NC链缺失就为UNKNOWN；**GUI演示与Agent解释不是D15批准**。

GUI、CLI、Agent共享同一Owner Port、错误码和撤权事件；GUI在单Babylon Engine/Scene/Canvas及左UnifiedTaskPanel展示“提议/需审批/撤销/未知”，不能在界面承载第二3D世界，不能由显示层直接提交。A/B模式只能引用已冻结事实，采纳新结果需生成新修订并保留退回路径；停用旧MCP服务器时撤销映射与历史Token缓存，保留只读审计和回滚说明。

## 3. 来源分级与直接可读边界

| ID | 来源及版本 | 本轮实际阅读 | 不可外推 |
|---|---|---|---|
| B161-S01 | MCP Tools 2025-11-25 | 官方HTML的User Interaction、Tool、Listing、Result | 不是Procet特定CAS或工业控制器认证 |
| B161-S02 | MCP Authorization 2025-11-25 | 官方授权目录/作用范围与audience标题 | 没有逐条审阅全文；不套用于所有本地传输 |
| B161-S03 | MCP Security Best Practices 2026-07-28 | Token Passthrough、Scope Minimization正文 | 并非已验证Procet安全实现 |
| B161-S04 | OWASP LLM06:2025 | 风险根因、示例与防范段落 | 风险分类并非特定行业合规证明 |
| B161-S05 | NIST AI 600-1 2024-07-26 | NIST官方出版元数据与摘要 | **未读报告PDF正文** |
| B161-S06 | 固定GitHub HEAD原CAP-11-04 | 原R01–R10追踪字段 | 内生业务约束非外部规范条款 |

完整作者/版本/访问日/URL/章节深度/限制见[来源登记](../../../research/sources/CAP-11-04-mcp-trust-b161.json)，逐规则来源归属及字段见[机器追踪](../../../research/traces/CAP-11-04-mcp-trust-b161-v08.json)。

## 4. 八项原子验收（每项1正4独立反）

| 规则 | 关键字段 | 必要判据 | 独立消费 |
|---|---|---|---|
| B161-R01 | `catalog.serverRegistrationDigest`、`catalog.qualifiedToolName`、`catalog.inputSchemaDigest`、`catalog.catalogEpoch` | 工具枚举绑定可信注册源与目录修订 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R02 | `hints.annotationTrustTreatment`、`hints.serverTrustVerified`、`hints.effectClass`、`hints.ownerApprovalRequired` | 不可信ToolAnnotations不得提升写权限 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R03 | `token.resourceAudience`、`token.boundAudienceValidated`、`token.rawTokenPassthrough`、`token.downstreamCredentialMode` | Token audience与下游隔离 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R04 | `result.trustLabel`、`result.outputSchemaChecked`、`result.embeddedInstructionDisposition`、`result.resultDrivenWriteAllowed` | 返回内容不成为指令 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R05 | `context.ownerPort`、`context.ownerRevision`、`context.assetByteDigest`、`context.frameRevision` | Owner精确数据与Frame复验 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R06 | `approval.actionDigest`、`approval.approvalState`、`approval.scopeValidity`、`approval.approvalExpiry` | 高影响动作显式确认 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R07 | `commit.finalCas`、`commit.aclRechecked`、`commit.cancelGenerationMatch`、`commit.lateReceiptDisposition` | 最终CAS、ACL及取消栅栏 | T5-03结构复核，实际领域消费NOT_RUN |
| B161-R08 | `engineering.d04D10Separate`、`engineering.finalNcExecutionEvidence`、`engineering.d15IndependentConsumer`、`engineering.d16Publishing` | 规划资格不升级为NC工程发布资格 | T5-03结构复核，实际领域消费NOT_RUN |

[Fixture](../../../docs/capabilities/CAP-11-04/mcp-trust-b161-fixtures-v08.json)包含8正、32个仅改变一字段的反例和8个状态Golden；[只读Node脚本](../../../tools/check_cap1104_mcp_trust_b161_v08.cjs)逐项检查来源ID、8×4字段覆盖、独立单字段差异、预期结果及Golden。完整工程Node进程、实际MCP服务/权限撤回、实机NC/B5/OEM及17业务资产独立消费者尚未运行，**不得把V8合成48/48称为产品PASS**。

## 5. 失效、迁移、回退与未闭阻断

目录版本漂移、输入Schema变化、server重绑定、token audience错误、工具输出注入、撤权/取消、Owner revision不同、Frame过期或NC语义不完整时：撤销待执行提案→停止旧回执提交→记录reason+correlation+原Revision/Hash→重新请求/审批。既有冻结A/B数据只读保留；旧Server与缓存迁移提供可回退的映射快照，不删除证据链。测试入口是工具内存Fixture与待续真实独立Node执行，未来D01/D07/D16独立消费者与L3人类评审单独签署。当前正式Owner 0/17、真实独立消费者0/17、L3待审批，历史原附件原字节与全仓GFM AST终核开放。**规划PASS≠产品PASS。**
