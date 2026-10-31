# CAP-01-04｜权限、审批与审计：证据回补及实施契约评审稿

- 日期：2026-10-18；状态：**规划已编制／远端待入库／待评审**，不是产品实现或安全认证。
- 原能力编号不变：`CAP-01-04`，不额外增加88项分母；原详细稿与原 `AT-01..08` 保留。原稿位置：`docs/capabilities/batch01-v0.9.1/01_功能规格/CAP-01-04_权限、审批与审计.md`。
- 研究：[R-AUTH-001](../../../research/topics/R-AUTH-001.md)；规则追踪：[CAP-01-04.json](../../../research/traces/CAP-01-04.json)；合成验收：[fixtures.json](fixtures.json)。
- 关联原工作包：`B0-06`、`F1-01`、`F1-06`、`W2-01`、`W2-04`、`E3-06`、`U4-01`、`U4-04`、`U4-06`、`T5-01`。交叉映射不意味着这些工作包已经实施级完成。

## 1. 业务目标、唯一责任与真实范围

该能力确保“谁以何种可信身份，对哪一项目的哪一领域修订，依据哪个策略版本和哪些不可变证据，在什么时点作出什么决定，发生冲突或撤销后产生什么新事实”可以由独立查询回放。目标不是在GUI上增加一个绿色`Approved`标签。

用户：工程编辑者、审查者、签发者、质量责任人、离线操作人员、受限Agent及只读审计员。角色、授权和职责分离在部署的Policy配置中确定，不能按显示姓名或当前按钮可见性推断。**Host是可信Actor与跨入口Policy Enforcement Point（PEP）的唯一宿主边界；领域Owner维护领域批准条件与确切修订；项目Owner负责工程快照与引用；Audit日志维护方持有append-only记账接口。** Host统合提交不意味着将所有领域批准记录塞入C0大对象。

跨域适用范围：工程快照、D03制造资源、D08已冻结工艺、D10机床执行配置、D12最终NC、D15 NC程序级验证记录、D16发布包。所有这些对象由各自领域Owner持有身份与版本，CAP-01-04只维护策略/决定/审计关联。特别是审批一个CAM策略、授权Agent调用与正式发布NC是三种不同层次，不能相互替代。

## 2. 主、替代与异常业务流程

**主流程 M1**：打开工程某一精确修订 → 查询当前读权限和审批资格 → 从领域Owner取得`targetRef`及内容摘要/源引用 → 请求`approval.preview`，列出批准目的、证据和未覆盖语义 → 申请进入审查队列并绑定不可变目标 → 审查者查看3D只读对象投影与变更差异 → 在提交决定时，Host重新获取可信Actor、对象作用域、策略版本和活跃任务世代，领域Owner重新评估冻结/完整性/资格条件 → 追加`ApprovalDecision`和`AuditEvent`，返回可重放回执 → 只读查询校验后刷新UI。**预检成功不代表已批准；通用Host过门不等于领域业务批准。**

**替代 A1：纯只读审计**。缺少批准权限但有合法对象读取范围的人可查询脱敏事件；越域事件、秘钥、客户隐私不得暴露。**A2：离线声明身份**。本机可记录`identityAssurance=locally_asserted`与原始主体声明，并允许被Policy明确许可的草稿操作；不可自称受管身份/数字签名或获得需组织身份的生产批准。**A3：Agent代发**。请求中保留代理链和工具意图，但只使用Host可信Actor及委托权，Agent输入中的actor/role/approved一概不能升级授权。**A4：允许自审部署**。仅在实际Policy显式允许、职责冲突已评估时执行，禁止默认为所有安装启用。

**异常 E1**：预检到提交期间目标`revision/hash`改变，返回`stale_target`，不追加批准决定；用户刷新差异后重新预检。**E2**：策略版本撤换，旧批准原样保留为历史事实；当前适用性按新策略查询为`expired_or_requires_reassessment`，不能改写旧事件。**E3**：无Verifier、离线可信身份不足、跨工程ID或未覆盖控制器语义，拒绝本次生产批准并显示缺项，不能将`unknown`当`approved`。**E4**：批准请求超时但实际提交可能完成，按`requestId/idempotencyKey`查询旧终态；不换通道重复批一次。**E5**：审计追加失败时若领域决定已提交，应依方案设计协调恢复及一致性回执；不可既显示成功又丢掉事件或简单声称跨数据库原子。此项需要实际故障注入验证，当前属于未定实现门。

## 3. GUI / 单Babylon世界与完整交互

在左侧`UnifiedTaskPanel`沿用一个可伸缩容器，设四任务：`目标与证据`、`申请与分派`、`审查决定`、`历史与审计`；顶部状态包含`待预检 / 证据不足 / 待审 / 已决定但当前不适用 / 已撤销 / 审计不完整`，明确区分历史决定状态与当前资格。右侧唯一Babylon主交互世界可从主工程模型横向切至资源3D空间；只读高亮批准作用到的零件、装夹或机床配置，但不得在审批界面新建Scene或把可见相机姿态写入业务版本。

3D工作流为`对象拾取→临时SelectionIntent→证据高亮与修订差异PreviewLease→侧栏确认目标精确修订→调用审批领域用例`。选择/预览不写审计或批准；确认后的服务端响应才能改变业务状态。选中资源后切回主模型时，通过`scopeEpoch`重建合法高亮；旧拾取结果必须丢弃。

窗口缩窄时左容器按设计token限制最小宽度，支持鼠标拖动；没有第二套“审批专用宽度”。浅深主题统一；只读状态不会显示假可点的绿色通过操作；长证据允许抽屉查看，但仍借宿主DocumentView读取快照投影。取消请求不等于撤销已有审批，二者必须使用不同命令。

## 4. 字段、单位、来源、默认与编辑权

| 字段／语义键（拟议） | 类型及单位 | Authority／默认 | 编辑权限、校验及显示 |
|---|---|---|---|
| `projectRef` | Exact DomainRef；无量纲 | Project Owner；必填 | 只读且绑定当前工程generation；跨项目拒绝 |
| `targetRef` | `domain/kind/id/revision`；无量纲 | D03/D08/D10/D12/D15/D16等Owner；必填 | 从合法对象选择，不接受仅裸id或`latest` |
| `targetContentHash` | SHA-256等带算法名；无量纲 | 领域发布工件；必填 | 只读，摘要不能证明法律签名或几何相等 |
| `evidenceRefs` | exact修订集合；无量纲 | 相关领域/验证结果；默认空表示缺证 | 由适用性查询返回，缺D15不得上机批准 |
| `policyRef` | 策略id+revision；无量纲 | Host Policy Owner；必填 | 只读；提交点重新求值版本和撤销状态 |
| `hostActor` | `kind/id/assurance`；无量纲 | Host会话；无可信来源则unknown | 只读；绝不使用请求body覆盖 |
| `delegateChain` | 有序主体Ref；无量纲 | Host Delegation；默认空=非委托 | 只读；Agent不增加委托权 |
| `decision` | `approve/reject`；无量纲 | 授权审查人；默认未决定 | 显式点击后提交；普通object.update不能写 |
| `reviewComment` | UTF-8文本；无量纲 | 审查者；默认空 | 按Policy决定何时必填；脱敏和最小化存储 |
| `previewFingerprint` | hash；无量纲 | 领域+Host预检服务；默认无 | 只读、不由GUI重算；本身非授权token |
| `requestId/idempotencyKey` | opaque字符串；无量纲 | Host请求会话；每个意图一次 | 用于去重、查询未知终态、迟到回执关联 |
| `decisionAt` | RFC3339 UTC；时间 | Host可信时钟；缺失unknown | 只读，离线时钟可能不具备认证时间戳资格 |
| `applicability` | effective/expired/revoked/unknown | 查询投影；默认unknown | 只读，与历史已批准决定分列 |
| `auditReceiptRef` | exact事件/工件Ref；无量纲 | Audit Owner；默认无 | 只读，缺失时不能展示“审计已完备” |
| `scopeEpoch` | 递增会话世代；无量纲 | Host UI会话 | 临时只读，不持久化到领域批准记录 |

**不新增任意毫米/角度等制造参数。** 审批对象如果含`FrameRef`，必须显示其Owner精确frame/revision、单位上下文和摘要，但此能力不自行重定义机床坐标。绝不可从3D图片、相机姿态、操作员手填Name派生生产凭据。

## 5. 逻辑领域命令、查询、事件与回执（尚非已存在API）

| 逻辑能力（提案） | 输入及审查门 | 回执或拒绝 |
|---|---|---|
| `authorization.evaluate` Q | 可信Actor、projectRef、targetRef、action、policyRef | 按scope明细的`Permit/Deny/Unknown`及理由；仅决策非许可凭据 |
| `approval.preview` Q | exact target/hash、证据集、approvalKind | `previewFingerprint`、缺失项、scopeEpoch、有效期（如定义） |
| `approval.request` C | targetRef、expectedRevision、policyRef、证据、理由、幂等键 | requestRef、accepted/denied；accepted不是approved |
| `approval.decide` C | requestRef、decision、reviewComment、预检指纹、expectedRevision、幂等键 | decisionRef、policyRevision、auditReceiptRef，或者typed conflict/denied |
| `approval.revoke` C | 旧decisionRef、合法撤销理由、expectedRevision | 新RevocationRef，不覆写旧decision |
| `approval.applicability` Q | decisionRef、当前exact target、policyRev、最新证据 | currentQualification及明确失效原因 |
| `audit.query/export` Q | projectRef、对象Ref、角色、过滤/游标 | 脱敏结果、分页与schema元数据；越权拒绝 |
| `receipt.reconcile` Q | requestId/idempotencyKey、scopeIdentity | committed/failed/interrupted/unknown；不得未知即重发 |

事件：`approval.requested`、`approval.decided`、`approval.revoked`、`approval.applicability.changed`、`audit.recorded`。事件必须带correlationId、targetRef和originEpoch；事件顺序与领域持久化真实顺序不得混为一谈，旧事件可用于恢复但不能自己制造批准。GUI/CLI/Agent经Host的受管Dispatcher使用相同逻辑能力，而不是分别写SQL或模拟批准。

## 6. 只读源码观察与复用边界（指定HEAD，不是产品验收）

观察版本`BaiSongt/procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`：

1. `crates/procet-host-runtime/src/policy.rs`已有`HostContext/PolicyGate/ApprovalVerifier/DenyReason`，含Host可信Actor匹配、exact能力版本、scope×副作用、模式、缺Verifier fail-closed；应复用，不造第二套Host权限服务。**注意`ApprovalVerifier::verify(approval_ref,capability_id,actor)`接口不直接传入targetRef/hash/policyRef**，这只是可见接口边界，不代表领域层完全没有额外校验。后续核对各批准命令提交点是否独立对照target及policy修订，而不是直接推出已发现安全漏洞。
2. `crates/procet-host-runtime/src/dispatcher.rs`存在Host唯一typed入口、request幂等与terminal四维评价，通用Gate通过之后仍需领域成功证据及提交回执；不得以进程exit0或按钮回调标记业务通过。
3. `apps/desktop/src/modules/manifest/types.ts`中的`ModulePermissions`注释指明文件/网络访问字段是宿主声明面，并不等于用户权限enforcement。
4. `apps/desktop/src/modules/agent/components/ApprovalCard.tsx`是工具级确认UI，只有`decide(boolean)`回调；未从此组件证明它已经接入真实审查签发链，且不可与D16程序发布批准混为一谈。

**差距与需审计风险**：产品命令链从Host Gate到领域审批及审计写入的映射需实读；跨Owner提交与审计回执的一致性、撤销权限和自审策略都尚需真实测试。特别要区分“Host批准某个工具调用”与“批准特定NC程序的正式发布”。以上发现是源码只读观察，并非安全缺陷已复现。

## 7. 失效、迁移、兼容、恢复与最小扩展

- 已批准决策不可被普通编辑覆盖，出现D03资源修订、D08计划、D10机床执行绑定、D12最终NC或D15验证内容改变时，受影响D16发布资格由Owner重新求值；历史审计保留。`applicability=expired`不等于物理删除历史决定。
- 旧项目中仅记录审批姓名或字符串`approved=true`：兼容读取但标为`legacy_unverified`；未有exact目标/可信Actor/策略/证据前不能转成受信签发。迁移生成新适配记录、保留原始payload和来源，不篡改历史。失败回退到只读旧reader和原版本，不自动提升旧记录权限。
- 离线失联：允许策略批准的草稿或本机低可信审阅；一旦恢复组织身份，重新核验身份绑定与精确工件，而不是回填一个“当时已认证”的断言。
- 对外扩展Provider：组织身份、数字签章、可信时间戳、双人复核、细粒度对象策略等分别有可选端口和评审门；不得因NIST指南阅读而宣称具备法律效力、组织认证或不可抵赖安全资质。
- 审计溯源不等于审计防篡改；内容hash可做完整性检测但需独立签名/密钥管理/受信存储及验证策略，不能默认“日志哈希=签章”。敏感令牌不写日志，导出采用最小字段、脱敏与权限查询。

## 8. 实施切口、进入/退出及真实验收入口

| 切口 | 负责角色；生产→消费 | 前置/产物 | 退出及回退 |
|---|---|---|---|
| AUTH-S01可信Actor与委托 | Host安全Owner；Identity→Dispatcher/Agent | B0-06、F1-01；ActorAttestation/DelegationRef提案 | body伪造/跨工程拒绝；不可用回退只读 |
| AUTH-S02许可与策略版本 | Host安全Owner＋领域Owner；Policy→所有命令 | PolicyDecision/ScopeGate、PolicyRef冻结 | 每次调用+提交点重验；旧Policy仅兼容读取 |
| AUTH-S03审批目标与证据 | D08/D15/D16各Owner；领域→Approval | ApprovalPreview与精确证据闭包 | revision/hash漂移拒绝；保留原审批记录 |
| AUTH-S04决定/撤销和日志 | Host/审计Owner；域批准→Audit/Project | Append-only Decision/Revocation及回执 | 注入失败后可协调或明确unknown，不能假成功 |
| AUTH-S05左侧GUI与3D投影 | GUI Owner；Host read model→用户 | UnifiedTaskPanel、Single Babylon selection lease | 无审批权限只读、离开工程拒旧回执 |
| AUTH-S06迁移与合同验证 | 架构/独立测试Owner；历史工程→新reader | Legacy兼容、双端合同与拒绝样例 | 安全旧reader、禁`approved=true`升级 |

准入：F1-01精确引用、B0-06审批角色和部署Policy语义需评审；F1-06快照闭包规则需读取。退出：领域生产者、使用方、独立验证者在同一exact HEAD执行正反例并提供命令、环境、真实回执、拒绝原因和版本Hash。**现有测试入口候选**`crates/procet-host-runtime/src/policy.rs`模块测试；具体UI、撤销与跨域一致性回归入口为`待创建/待核实`，不能宣称当前可运行。独立测试必须覆盖本包20组场景，不能用规划JSON静态校验替代。

## 9. 验收编号与追踪纪律

保留原`CAP-01-04-AT-01..08`所对应的角色伪造、旧预检、NC验证范围、只读审计、本机声明、自审策略、历史撤销、Agent旁路，不重命名；增加`AT-09..20`覆盖策略吊销、目标hash变更、作用域越界、审计脱敏、请求重放、迟到回执、审计提交故障、离线身份恢复、3D预览误批准、未知控制器语义、工具确认与生产签发隔离、旧批准数据迁移。全20项详见[fixtures.json](fixtures.json)，每条在[机器追踪](../../../research/traces/CAP-01-04.json)映射规则和可核验来源；**这些是待执行的产品验收规格，状态均为NOT_RUN_PRODUCT_TEST。**