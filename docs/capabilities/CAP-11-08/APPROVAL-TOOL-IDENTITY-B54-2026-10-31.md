# B54｜CAP-11-08 工具身份与人类批准的不可变绑定

日期：2026-10-31；状态：**NEWLY_AUTHORED规划补证，L3待人审，产品/正式Owner及17独立消费者NOT_RUN**。保持11域88 CAP、36原编号工作包、17资产和L1/L2不变；承接[原CAP-11-08](README.md)及[T5-01](../../work-packages/T5-01.md)/[T5-02](../../work-packages/T5-02.md)。

## 新的工程风险：同名工具不等于同一权限

MCP官方2026-07-28 [Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)规定工具名只在同一Server内唯一，工具目录可随逐请求授权变化并支持缓存，工具Annotations未经可信来源不得直接信任。因此`stage_plan`即使名称不变，只要Server、Schema、工具目录代次、批准参数或审批主体不同，都**不能**复用旧批准。旧缓存、工具回执、自然语言和LLM“已成功”不具备领域提交权。该判据是**Procet依据协议所作的业务设计推导**，不是MCP协议本身定义的人类审批流程。

[Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)与[Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)要求HTTP受保护资源校验令牌受众并禁止令牌透传；该层只解决传输鉴权，**不能代替业务Owner ACL/CAS、D08冻结、人类审批或NC验证**。MCP [2026-07-28发布说明](https://blog.modelcontextprotocol.io/posts/2026-07-28/)确认stateless逐请求协议与工具目录缓存演进，但发布说明并非实际SDK验收证据。

## 数据合同与拒绝条件

1. `protocol.version/catalogScope`：固定已确认协议能力及逐请求工具目录；旧协议或目录来源未知必须重新评估。
2. `tool.server/name/schemaHash/catalogEpoch`：四元工具身份与批准记录精确相等，跨Server同名和Schema更换均阻断。
3. `tool.argsHash/approval.intentHash/nonce`：批准范围只对应一个不可变意图及参数；RAG、图纸、工具输出不可信且不能充当指令。
4. `approval.principal/signer/evidence/expiry`：人类批准不得由Agent代签；过期边界拒绝。合成`SYNTHETIC_ONLY`不构成真实签名验证，未知签名仍为UNKNOWN。
5. `oauth.resource/audience/issuer/tokenPassThrough`：令牌受众和签发方校验，拒绝跨Server透传。
6. D05业务Owner提交前重读`revision/hash/frame/scope/aclEpoch`，并做原子CAS与ACL重验。RFC 9110 [§13.1.1](https://www.rfc-editor.org/rfc/rfc9110.html)的强If-Match是并发更新的技术依据，但不自动实现Procet跨域事务。
7. `ack.generation/cancelled/late/nonceConflict`：取消或切工程后晚ACK不刷新新任务；网络超时后真实已提交Receipt必须单独对账，未签发不能由模型文本伪造。
8. D04名义Setup与D10执行绑定分离，A/B共享事实不覆盖D08冻结；GUI/CLI/Agent共用`11.ActionAuthorizationPort`，单Babylon Engine/Scene/Canvas与左UnifiedTaskPanel，字体最大12px；3D选中只是预览。
9. 中立D09 CL→D12后处理NC→D13控制器执行解释→D14物理轴时序→D15独立NC验证→D16发布。没有最终NC，必须`D13=UNKNOWN/D14=D15=NOT_RUN/D16=BLOCKED`；不把CL动画或Agent批准当产品工程验证，不做材料扫掠仿真。

## 反事实测试与迁移

已批准Server A工具`stage_plan`但Agent改由Server B同名工具执行，拒绝；批准后Schema变更或目录代次漂移，拒绝；OAuth Token未过期但D05 ACL Epoch从8变为9，拒绝；批准截止时间刚到，拒绝；撤销任务的迟到ACK，拒绝。分别提供缺少来源/签名/版本等UNKNOWN测试。工具升级采取影子读→新reader→独立消费者验收→人审切写，旧版本退只读，不能自动合并冻结事实或借CLI绕过拒绝。

[8项来源分层与阅读局限](../../../research/sources/CAP-11-08-tool-approval-b54.json) → [9规则、字段、资产/原包](../../../research/traces/CAP-11-08-tool-approval-b54-v08.json) → [3正48反9 UNKNOWN合成](tool-approval-b54-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap1108_tool_approval_b54_v08.cjs) → [核验等级](../../../tracking/cap1108-tool-approval-b54-verification-2026-10-31.json)。NIST [AI600-1](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)只读官方目录/摘要，**未读PDF正文**；本轮V8相同judge 60/60合成，不是独立Node或实际身份服务运行。**规划PASS≠产品PASS。**
