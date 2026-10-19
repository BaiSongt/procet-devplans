# CAP-01-02｜工程对象与文档：研究补证与设计校核

**补编2026-10-19，非已丢失旧补证的原字节恢复；原版0.9.1评审稿继续保持，不改原88编号。待人类设计批准，产品测试NOT_RUN。**

原始业务规格：[CAP-01-02_工程对象与文档](../../batch01-v0.9.1/01_功能规格/CAP-01-02_工程对象与文档.md)。研究：[R-OBJ-001](../../../research/topics/R-OBJ-001.md)；规则与测试：[追踪](../../../research/traces/CAP-01-02.json) / [20项正反场景](fixtures.json)。

## 业务责任与主流程

设计员受控导入CAD/附件；工艺工程师从工程对象直接导航工序；项目Owner维护对象关联，CAD/PMI/Docs等分别持有内容真值；文档容器维护ViewInstanceId和局部dirty状态而非第二套业务对象库。

主流程：①通过Host验证SourceHandle、格式和SourceHash；②内容Owner导入并返回ExactRef候选；③Project使用expectedRevision/CAS登记关联；④DocumentManager在唯一统一TaskPanel中按同一业务对象打开多视图；⑤用户在单Babylon主世界选择对象并预览来源；⑥任何写操作经Owner提交且返回typed Receipt；⑦跨模块导航按精确引用，关闭视图不改变业务对象。

替代：未知类型provider、可选附件离线、mesh-only仅显示，均允许受控只读并明确未建模语义。异常：源损坏、版本争用、切Project迟到回执、被冻结NC发布包引用、required资源不全、恢复旧Schema；分别保留现场、解释拒绝及允许安全重试。

## 界面与字段设计

左侧单UnifiedTaskPanel五任务：①对象目录与过滤；②来源/元数据与关联；③视图实例与差异；④附件离线闭包与引用影响；⑤确认/审计/恢复。主/资源空间横向切换，只有一个Babylon交互世界。3D选择→Ghost预览→领域确认三个动作独立，显示色标/状态不可作为持久提交。

| 字段 | 单位/来源 | 写入角色/约束 |
|---|---|---|
| projectId, documentId, objectExactRef | 无量纲标识，Project/领域Owner | 稳定身份，不能来自文件名或Tab序号 |
| revision, contentHash, sourceHandle | 修订和字节摘要，内容Owner/授权文件桥 | exact值只读；本机路径不得当ID |
| viewInstanceId, dirty, scopeEpoch | UI会话/Host状态 | 仅视图范围，不进入制造资产 |
| relationKind, targetExactRef, impactHash | Project索引/领域来源 | 反向依赖评估，禁止默认latest |
| attachmentPolicy, requiredForOffline | Project策略+Owner要求 | 嵌入或外链，必需缺失阻断就绪 |
| frameRef, lengthUnit | CAD领域来源，mm或源标注 | 未知unit/frame不得默认为机器参数 |
| requestId, expectedRevision, permit, receipt | Host提交域 | GUI/CLI/Agent一致检查且重试幂等 |

## 状态与兼容性

状态idle/loading/readOnly/dirty/preview/committing/conflict/recoverable/committed，跳转Project或关闭视图时，旧scopeEpoch的晚回执不能污染新工程。旧reader/类型未知时保留rawDescriptor和只读投影；迁移要求灰度双读、生产者消费者签署、旧schema回放、数据/路由/工程快照三层回退。冻结内容不可静默覆盖。

## 命令查询事件回执（拟议非已实现DTO）

object.query、object.import、document.openView、object.previewUnlink、object.commitUnlink、object.inspectReceipt统一走Host，写命令包含scope/project/exactRef、requestId、expectedRevision和permit；结果是Committed/Rejected/Conflict/Unknown typed receipt，异步JobRef只表示受理。事件object.import.completed/project.object.linked/document.view.closed必须区分业务变更和纯显示行为。

## 可复用基础及当前缺口

复用已观察DocumentManager、ProjectService、TaskHost、ModuleRegistry/ContributionHub、RendererPort；不另造React双向同步。仅旧源码观察曾提示同documentId视图复用和dirty关闭路径需要审计，真实多视图产品测试未执行，不能据此认定已有缺陷。新字段、独立命令与移交均属于L3提案。

## 十条规则 / 二十个验收

- **OBJ-R01**：将对象身份与视图实例分开，同一ExactRef可有多视图，关闭视图不删除对象。字段：documentId、viewInstanceId、exactRef；原编号工作包F1-01 / U4-06；验收CAP-01-02-AT-01、CAP-01-02-AT-09。
- **OBJ-R02**：导入经受控SourceHandle及格式/大小/许可审查，解析失败不得进入Project有效对象目录。字段：sourceHandle、importerId、sourceHash、readiness；原编号工作包F1-03 / W2-01；验收CAP-01-02-AT-02、CAP-01-02-AT-10。
- **OBJ-R03**：范围epoch、幂等请求、expectedRevision及最终receipt必须关联；晚到回执只能回写原Project。字段：scopeEpoch、requestId、expectedRevision、receipt；原编号工作包F1-01 / F1-06；验收CAP-01-02-AT-03、CAP-01-02-AT-11。
- **OBJ-R04**：关系导航使用exact目标和版本化边，不能强迫用户通过特征页面或猜测active tab。字段：relationKind、targetExactRef、relationRevision；原编号工作包U4-06 / T5-02；验收CAP-01-02-AT-04、CAP-01-02-AT-12。
- **OBJ-R05**：解除关联先审查反向引用与冻结D16，后台清理不能被对象界面直接调用。字段：reverseRefs、freezeRef、impactHash；原编号工作包F1-06 / W2-04；验收CAP-01-02-AT-05、CAP-01-02-AT-13。
- **OBJ-R06**：嵌入附件与外链按重要性独立标明，离线必需附件需字节闭包。字段：attachmentPolicy、contentHash、requiredForOffline；原编号工作包F1-06；验收CAP-01-02-AT-06、CAP-01-02-AT-14。
- **OBJ-R07**：mesh-only可显示不可冒充B-Rep制造选面，3D拾取保持SelectionIntent只读。字段：geometryCapability、selectionIntent、topologyProof；原编号工作包U4-06 / T5-02；验收CAP-01-02-AT-07、CAP-01-02-AT-15。
- **OBJ-R08**：未知类型、未安装provider及旧schema保留原始引用和诊断，不静默删除。字段：typeDescriptor、providerState、rawDescriptor；原编号工作包F1-01 / U4-01；验收CAP-01-02-AT-08、CAP-01-02-AT-16。
- **OBJ-R09**：导入、关联、视图关闭和对象修订应各自有Owner及提交点授权/CAS校验。字段：ownerId、expectedRevision、permit、idempotencyKey；原编号工作包F1-03 / W2-04；验收CAP-01-02-AT-17、CAP-01-02-AT-18。
- **OBJ-R10**：可定位注释应保留来源与目标修订；自定义业务标注不能自动升级为冻结制造要求。字段：annotationTarget、sourceRevision、originEvidence；原编号工作包F1-03 / T5-02；验收CAP-01-02-AT-19、CAP-01-02-AT-20。

原AT01–AT08语义保持，新增AT09–AT20均明示设计验收待运行；产品/实机/GUI、数据库故障注入全部NOT_RUN。
