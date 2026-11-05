# R-AUTH-001｜权限、审批、身份可信度与审计证据

2026-10-18｜研究状态：原始公开资料**定点阅读**，业务设计评审稿；不能证明Procet安全实现已通过或组织/法律合规。

关联CAP：[CAP-01-04补证](../../docs/capabilities/CAP-01-04/RESEARCH-BACKFILL.md)，机器追踪：[CAP-01-04.json](../traces/CAP-01-04.json)。新增来源清单：[CAP-01-04.json](../sources/CAP-01-04.json)；复用历史来源`SRC-REF-005`(W3C PROV-DM)。所有日期是本轮实际检查日期，不批量刷新历史登记。

## 1. 原始来源的可用结论和边界

| 来源 | 本轮实际阅读 | 可支持的工程规则 | 不能证明 |
|---|---|---|---|
| `SRC-AUTH-001` NIST SP800-162 Updated 2019 | CSRC官方目录的标题、版本历史、摘要（`catalog_abstract`） | ABAC授权决策需考虑subject/object/action/environment及Policy；在工艺系统中不能只凭角色决定批准 | 未读PDF正文，不能把某条领域字段、审批流程冒充NIST标准条款 |
| `SRC-AUTH-002` OWASP Authorization Cheat Sheet | “Enforce Least Privileges”、“Deny by Default”、“Validate the Permissions on Every Request”、“Implement Appropriate Logging”等页面正文（`section_text`） | 每次调用及对象层范围重新鉴权、默认拒绝、异常记录与测试覆盖 | OWASP并非具体控制器或国家法律合规认证，不决定组织自审与离线批准政策 |
| `SRC-AUTH-003` Tauri v2 Capabilities | Capabilities定义、窗口/WebView/命令暴露、合并权限以及默认注册命令相关提醒（`section_text`） | IPC暴露是一个独立权限层，需审核capability叠加与app manifest | 不自动证明领域写入权限、外部原生插件权限或签发资格已被检查 |
| `SRC-AUTH-004` Tauri v2 Permissions | 命令allow/deny、路径scope以及permission set（`section_text`） | 应限制插件/命令与文件作用域，防止GUI有能力调用被认为可写全部资源 | 文件scope不是D03/D16业务角色授权，也不是所有操作系统文件权限的全覆盖 |
| `SRC-AUTH-005` NIST SP800-63B Revision 4 | 官方HTML“Authentication Assurance Levels”中的AAL定义及使用边界（`section_text`）；版本来自NIST SP800-63-4首页，2025年7月最终发布 | 可信身份的强度与角色许可相互独立；本机输入姓名不可自称具备组织受管AAL | 未核验Procet认证器，无权赋予具体AAL，也不能宣称法律数字签名有效 |
| `SRC-REF-005` W3C PROV-DM | 历史已登记的来源；本轮重新打开W3C Recommendation首页、Entity/Activity/Agent语义（`section_text`），不更改历史注册日期 | 用对象-活动-责任人记录决定依据、撤销和审计来源 | PROV是溯源数据模型，不保证日志防篡改、签章或事件在真实系统发生 |

上述标准/指南不构成面向任何具体客户机床或企业的安全认证，也不证明Procet已经通过测试。NIST政府系统背景及风险选级流程不能直接套成Procet法定义务。

## 2. 关键工程推论

**2.1 Authn ≠ Authz ≠ Approval ≠ Execution**：认证识别主体；授权决定动作+对象+环境是否允许；领域审批绑定业务内容与规则；执行回执描述是否实际提交。四者必须可分别查询，且不能单凭GUI是否显示按钮或者某个通用Gate通过就判定D16发布资格。

**2.2 精确对象与作用域**：一次许可应至少是`(trusted actor, capability, project, exact target, policy revision, side effect, optional environment)`的决策，审批闭包还要有来源、验证证据、请求Hash和版本。对象修订或Policy变化后的决定适用性需重新查询，而不是覆盖历史`approved`标志。这个具体结构是Procet内部设计选择，并不是NIST提出的固定wire字段。

**2.3 GUI/Tauri与领域门是两层不同责任**。Tauri定义WebView能调何种命令/插件；领域Policy按受信Actor、对象、动作、scope决定数据/审批权限。即使IPC命令被暴露，也不可默认为所有工程对象可写。Agent经Host会话身份发起，body中的actor或prompt不能替代可信身份。

**2.4 异步和双记录一致性**：建议`Decision`与`AuditEvent`具有同一correlation、可恢复的原子/补偿边界；如在独立库中无法原子提交，应以显式`unknown/reconcile`代替假成功。W3C模型支持溯源关系表达，但并不提供数据库事务或不可篡改机制。

**2.5 自审与职责分离是策略决策**。可以制定`no_self_approval`并为质量责任签发启用更严格门，但此开关需由实际组织制度确认；不能宣称OWASP/NIST目录页面要求所有软件业务必须无例外双人审批。策略改变不追溯修改旧历史，现时适用性可失效。

**2.6 弱身份与离线**：离线本地署名可形成操作事实，但与多因子认证、组织身份保证、可信时钟、法律签章是不同级别。界面需显示真实身份保证来源，并阻断需受管身份的签发动作；重联后不能倒填伪造可信身份。

## 3. 只读源码观察、差距及待证故障

**读取源提交**：`BaiSongt/procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`。

- `E-AUTH-01`：`crates/procet-host-runtime/src/policy.rs`。`HostContext.actor`与`request.actor`比较，`PolicyGate`检查mode/scope/side-effect，Verifier未注入拒绝。现有`verify(approval_ref, capability_id, actor)`接口不直接接收targetRef/hash/policyRevision；需追踪其上游/下游是否完成精确业务对象重验，**不能据此断言存在已复现越权**。
- `E-AUTH-02`：`crates/procet-host-runtime/src/dispatcher.rs`。Host typed入口对幂等、取消、deadline、能力ready和四维结果做分层处理。Job成功与领域资格分离，符合复用方向，但不直接证明每个领域写入点的批准与审计都已闭环。
- `E-AUTH-03`：`apps/desktop/src/modules/manifest/types.ts`。Manifest模块权限字段注释表明当前只是声明面，需核对后续真实enforcement，不能由`network=false`推断外部插件不能访问网络。
- `E-AUTH-04`：`apps/desktop/src/modules/agent/components/ApprovalCard.tsx`。界面`decide(boolean)`是工具确认入口，不是D08/D16正式领域批准证据。真实身份、签发记录和当前资格应通过Host/领域查询读回。

高风险待证：具体发布业务可能调用已存在的Host通用Gate，却未在**同一精确目标**下完成提交点重验；跨库审计记录失败产生半成功；Agent被授权执行工具并不等于NC程序经验证可发布。这些均是要验证的设计风险，而非已发现产品事故。

## 4. 强制验收与适用边界

拒绝伪造Host Actor、拒旧预检指纹/旧对象Hash/撤销Policy、Agent越权、跨工程ID及Scope、缺身份保障的生产签发；同Key重放不能多批准；迟到回执只读对账；3D高亮不引入数据写；NC未建模控制器语义不得给完整资格。测试需真实Dispatcher/Domain/Audit/Project下的独立集成及GUI场景，不以本目录合成fixtures作真实系统PASS。

若使用组织身份、电子签章、时间戳或不可篡改日志，须将供应方、版次、密钥生命周期、责任人、控制器资格与适用法规独立列出，不得凭本专题直接签发生产合规声明。