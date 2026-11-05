# CAP-11-04｜B29 MCP 2026-07-28版本迁移、工具目录缓存与受控回执

**2026-10-30，专项研究补证。** 原[CAP-11-04规格](README.md)、原[T5-01](../../work-packages/T5-01.md)/[T5-02](../../work-packages/T5-02.md)不改编号；L1/L2冻结、L3待人类评审。只针对Procet的Agent工具调用**协议适配器设计**，不声称现有产品已经接入新版MCP。

## 新的版本事实与误用风险

- 2026-07-28是截至本轮重新联网核实的[MCP官方当前规范](https://modelcontextprotocol.io/specification)；旧研究中使用的2025-11-25是历史稳定版。新版[版本兼容正文](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)§Protocol Version Negotiation/Backward Compatibility明确**逐请求携带版本及能力**，不再依赖旧`initialize`握手和协议级Session。**服务器MUST实现`server/discover`，客户端MAY使用**；不得写成客户端每次都必须先调用发现。
- 新版[Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools)§Capabilities/Listing Tools允许工具列表根据**每请求授权**变化，支持分页和缓存提示`ttlMs/cacheScope`。因此一个用户的工具菜单或已缓存目录**不能成为另一用户的权限证明**；目录刷新、工具schema变更、撤权、scope epoch变化都必须令待执行批准失效，重新绑定Owner目录与actionDigest。即便`public`缓存符合某个服务端部署的合法前提，Procet**受权限保护的制造操作目录**仍采取额外保守的`private`策略；这不是MCP对全部服务端强制的默认策略。
- 新版§Tool Names声明名字只在单个服务端唯一，跨服务聚合可能撞名；用可信的`providerId::toolName`及`inputSchemaDigest/outputSchemaDigest`锁定，不能只按`toolName`匹配。§Annotations明确非可信来源的工具注解不可授权写入。§Structured Content/Output Schema中结构可验证，但**不具备业务Owner修订资格**。
- 新版§Input Required Tool Results允许`resultType=input_required`的MRTR，重试附`inputResponses/requestState`，**两次JSON-RPC请求ID必须不同**；中途回复或requestState并不是Owner的人工批准和幂等提交收据。对外部工具输出仍按不可信数据处理，变更前重新核验actionDigest、现时ACL/ScopeEpoch/CAS和取消代次。
- 新版[Authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)§Purpose and Scope/Protocol Requirements说明HTTP传输授权属可选机制，STDIO凭据模型不同。外部协议鉴权不会替代Procet的业务Owner授权。不能把`Mcp-Method`/`Mcp-Name`路由Header或`x-mcp-header`当作制造权威；MCP标准没有批准D16发布的能力。
- 官方[2026-07-28发布记录](https://blog.modelcontextprotocol.io/posts/2026-07-28/)（David Soria Parra、Den Delimarsky）核对了状态无会话、MRTR、工具缓存、认证增强的发布时间。此发布介绍不是替代协议逐条证据。

## 可检验的来源—规则—字段—正反案例

| 规则 | 业务验收重点 | 同步字段与负例 |
|---|---|---|
| B29-R1 | 2026协议逐请求版本与客户端身份/capability，服务端可发现、客户端发现非必需；拒绝旧initialize/session假混用 | `protocol.version`, `protocol.requestMeta.version`, `protocol.headerVersion`, `protocol.usedInitialize`, `protocol.serverDiscoverSupported`, `protocol.clientDiscoverMandatory`；N01/N02/N03/N04/N05/N06 |
| B29-R2 | 只按已批准provider ID+限定命名空间+input/output schema指纹选工具；跨服务同名不可静默劫持 | `catalog.providerId`, `catalog.qualifiedName`, `catalog.inputSchemaDigest`, `catalog.selectedSchemaDigest`；N07/N08/N09/N10 |
| B29-R3 | 工具目录按真实授权上下文私有缓存，分页完整且TTL/目录修订有效；公开缓存不得成为Owner权限 | `cache.scope`, `cache.authorizationHash`, `cache.remainingMs`, `cache.allPages`, `cache.selectedRevision`；N11/N12/N13/N14/N15 |
| B29-R4 | 工具annotations/description不授写权，最小READ/PROPOSE能力由可信Owner登记而非LLM断言 | `trust.annotationsAreAuthority`, `trust.descriptionGrantsWrite`, `trust.toolHasWriteCapability`, `trust.trustedServer`；N16/N17/N18/N19 |
| B29-R5 | MRTR重试RPC ID不同且requestState绑定，inputResponses只是输入数据，审批仍按actionDigest重验 | `mrtr.retryRpcId`, `mrtr.requestStateBound`, `mrtr.responseTreatedAsData`, `mrtr.approvalRevalidated`, `mrtr.state`；N20/N21/N22/N23/N24 |
| B29-R6 | outputSchema校验只说明结构，不把structuredContent/文本冒充业务Owner收据；isError为失败 | `result.isError`, `result.outputSchemaValidated`, `result.structuredContentRole`, `result.ownerReceiptFromResultText`；N25/N26/N27/N28 |
| B29-R7 | 当前业务Owner在提交时按project/revision/hash/frame/ACL/scope/cancel/generation/CAS和批准摘要重验；D04≠D10、冻结不覆写 | `owner.currentRevision`, `owner.currentHash`, `owner.currentFrame`, `owner.currentScopeEpoch`, `owner.aclAllowed`, `owner.cancelled`, `owner.lateAckAdopted`, `owner.approvedActionDigest`, `owner.d10`, `owner.frozenOverwrite`, `owner.currentGeneration`；N29/N30/N31/N32/N33/N34/N35/N36/N37/N38/N39 |
| B29-R8 | GUI/CLI/Agent共用Port、单Babylon和左TaskPanel；未知D13/D14/D15不得签发D16 | `ux.port`, `ux.worlds`, `ux.panel`, `ux.d16`, `ux.d15`, `ux.channels`；N40/N41/N42/N43/N44/N45 |

[来源登记/版本与阅读深度](../../../research/sources/CAP-11-04-mcp-version-cache-b29.json) → [8规则字段和原包追踪](../../../research/traces/CAP-11-04-mcp-version-cache-b29-v08.json) → [3正45反自编样例](mcp-version-cache-b29-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap1104_mcp_version_cache_b29_v08.cjs) → [验收层级](../../../tracking/cap1104-mcp-version-cache-b29-verification-2026-10-30.json)。各测试阈值、Hash占位值及冻结示例均为合成设计，不来自官方标准。

## 统一入口、Owner判定和迁移回退

所有GUI、CLI、Agent通过同一个`11.AgentOrchestrationPort.plan`生成只读DAG，业务变更只能转发至**真正Owner Port**。申请时固定Project、业务资产exact revision/hash/frame、`providerId/schemaDigest`、actionDigest、approval、ScopeEpoch和cancel/generation，最终Owner提交前CAS和权限二次校验；晚回执不新建写资格，Owner已先提交的真实Receipt须对账而非虚构回滚。D04名义Setup≠D10执行绑定；中立CL→最终NC后处理→D13语义→D14轴时序→D15独立验证→D16受控发布。缺证为UNKNOWN，不做材料扫掠仿真，不允许从Agent说明文字获得发布资格。

单Babylon世界（工程/资源按桌面切换但仅一个活动Canvas）、左UnifiedTaskPanel、最大字号12px、浅/深主题。3D选择和Agent计划仅是投影，不写冻结A/B事实。出现协议版本不兼容时**优先只读降级**，旧2025协议适配保留独立版本号及严格能力表；当场禁用写功能，不通过重试或换入口绕过Owner拒绝。撤销新版工具路由只影响编排，不改原D01/D07/D08/D16真值。

**独立消费者待办：** 在双版本真实MCP Server+Client分别验证modern与legacy探测、带不同用户Scope的目录缓存隔离、schema热变更、MRTR中途确认以及重复/取消回执；随后跨D01/D04/D10/D13/D15/D16按固定机器组合独立验收、旧适配回退。正式Owner签署和真实消费者仍0/17；真实SDK/Node仓库文件进程/Windows端、浏览器和机床均NOT_RUN。**规划PASS≠产品PASS。**
