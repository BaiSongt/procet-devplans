# CAP-11-04｜工具调用与智能体编排（V0.8，L3待审）

**原88项原文：**「调用规划、求解、刀路和验证受控接口」。保持11域88项、36原编号包、17资产、L1/L2不变；L3待人工审查。对应原包 [T5-01](../../work-packages/T5-01.md) / [T5-02](../../work-packages/T5-02.md)，不造新工作包。

## 业务链路与受控状态

用户意图（GUI/CLI/Agent）→工具目录仅展示业务Owner的有限Port/Schema→读取D01 Project/Scope及各Owner exact revision/hash/Frame→生成无副作用计划DAG→人工确认高影响actionDigest→Owner Port现时ACL/ScopeEpoch/CAS/取消重验→执行→Owner Receipt核对→追加D17审计并让独立消费者验收。计划与工具响应均不自动写入冻结的D08/D16。

待执行Action状态：`DRAFT → BOUND → (AWAITING_CONFIRMATION) → READY → DISPATCHED → RESULT_REVALIDATED → COMMITTED_BY_OWNER`。任何节点可停止为`REJECT/STALE/UNKNOWN/CANCELLED`。取消通知可能和提交竞争：若Owner**取消前已实际完成提交**，必须报告真实Receipt并转入对账/补偿，不得虚称回滚；若取消先于Owner最终提交，则晚回执不得恢复写入资格。重试仅重放同Digest幂等请求，异Digest拒绝。

最小C0：身份、Project/Scope、精确Revision、内容Hash、单位/Frame和Port共通引用。业务字段、数控控制器语义和几何事实保留所属领域Owner；Agent不持有等价Owner超级权限，工具调用不允许开放式Shell/任意URL写入。

## 10项实施与验收规格

### T01 工具目录、schema与Owner Port

工具须注册有限操作、输入Schema指纹与明确Owner Port，不提供万能Shell或隐含写权限。Owner候选资产：D01、D03；领域：01、11；原包T5-01/T5-02。必需字段：`tool.namespaceVersion`、`tool.ownerPort`、`tool.inputSchemaDigest`、`tool.allowedOperations`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S01/C1104-S05` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R01` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T02 精确业务上下文投影

每次调用锁定Project/Owner exact revision、对象原字节Hash、坐标Frame，不复用过期缓存当真值。Owner候选资产：D01、D05、D10；领域：01、03、04、11；原包T5-01/T5-02。必需字段：`context.projectId`、`context.ownerRevision`、`context.assetHash`、`context.frameId`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S01/C1104-S07/C1104-S08` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R02` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T03 受委托权限及二次鉴权

在目标业务Owner内按用户身份、权限范围、现时ACL与ScopeEpoch重新检查。Owner候选资产：D01、D03；领域：01、11；原包T5-01/T5-02。必需字段：`auth.principal`、`auth.scopes`、`auth.ownerAclCurrent`、`auth.scopeEpochCurrent`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S02/C1104-S05/C1104-S06` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R03` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T04 计划DAG及副作用预算

编排依赖无环、记录每节点副作用类型，冻结成果只可引用且请求预算有界。Owner候选资产：D05、D07、D08；领域：05、06、07、11；原包T5-01/T5-02。必需字段：`plan.graphAcyclic`、`plan.sideEffectClass`、`plan.dependenciesFrozen`、`plan.budgetBounded`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S01/C1104-S04/C1104-S05` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R04` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T05 高影响动作人工确认

提交/发布等高风险动作必须确认精确动作摘要、对应业务Scope与有效期限。Owner候选资产：D08、D12、D16；领域：01、08、10、11；原包T5-01/T5-02。必需字段：`approval.actionDigest`、`approval.humanConfirmed`、`approval.scopeBinding`、`approval.notExpired`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S01/C1104-S05/C1104-S09` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R05` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T06 派发侧CAS、撤权与取消重验

Port在最终提交处检验expectedRevision、Hash、cancelEpoch和业务前置条件；跨调用不依赖LLM保证原子性。Owner候选资产：D05、D07、D09、D11；领域：01、05、06、07、11；原包T5-01/T5-02。必需字段：`dispatch.expectedRevision`、`dispatch.hashMatch`、`dispatch.cancelEpochCurrent`、`dispatch.portPrecondition`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S02/C1104-S03/C1104-S07` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R06` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T07 重试幂等与晚回执

幂等键绑定输入Digest；取消后的回执不可激活新提交，已真实提交的先前副作用必须审计并协调。Owner候选资产：D01、D09、D17；领域：01、07、11；原包T5-01/T5-02。必需字段：`retry.idempotencyKey`、`retry.samePayloadDigest`、`retry.ackAfterCancelRejected`、`retry.noDuplicateCommit`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S03/C1104-S04/C1104-S07` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R07` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T08 结果解析与提示注入隔离

工具结果经Schema与Owner收据验证，只作不可信数据，证据不足UNKNOWN不得继续写入。Owner候选资产：D02、D05、D17；领域：03、05、11；原包T5-01/T5-02。必需字段：`result.schemaValidated`、`result.dataOnly`、`result.ownerReceiptVerified`、`result.unknownOnGap`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S05/C1104-S06/C1104-S08` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R08` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T09 NC工程资格专门门禁

D04 Setup不冒充D10实装；D12最终NC→D13执行语义→D14时序→D15独立验证，未知不得签D16。Owner候选资产：D04、D10、D12、D13、D14、D15、D16；领域：04、08、09、10、11；原包T5-01/T5-02。必需字段：`nc.d04NotD10`、`nc.finalNcD12`、`nc.d13D14D15Independent`、`nc.d16BlockedUnknown`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S07/C1104-S08/C1104-S09` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R09` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


### T10 GUI/CLI/Agent同一入口与回滚审计

共享Owner Port及action receipt；单Babylon世界/统一左TaskPanel，关联审计，失效可回退而不覆写A/B冻结。Owner候选资产：D01、D08、D16、D17；领域：01、10、11；原包T5-01/T5-02。必需字段：`ux.sameOwnerPort`、`ux.singleBabylonLeftPanel`、`ux.auditTraceLinked`、`ux.rollbackFrozenSafe`。 [来源](../../../research/sources/CAP-11-04.json) `C1104-S01/C1104-S03/C1104-S08/C1104-S10` → [规则](../../../research/traces/CAP-11-04.json) `CAP-11-04-R10` → [1正+4独立负例](fixtures.json)。所有门禁均为规划合成，不是产品验收。


## 关键接口与责任

- `AgentOrchestrationPort.plan(intent, ownerReadSnapshots)`：仅给不可变计划建议、来源和风险，禁业务提交；D01/11域维护编排草案。
- `BusinessOwnerPort.authorizeAndCommit(actionEnvelope)`：03/04/05/06/07/08/09/10实际所属Owner唯一负责写入；用户身份、ACL、ScopeEpoch、exact Revision/Hash/Frame、CAS与取消态在**提交当刻**重验，返回ownerReceipt；无权则REJECT，数据失配STALE，语义缺失UNKNOWN。
- `ActionEnvelope`明确`actionDigest`、`idempotencyKey`、`expectedRevision`、`originFrame`、`cancelEpoch`、`humanApproval`；`ownerReceipt`必须来源于业务Owner，不是LLM文本。 [合同样例](agent-orchestration-contract.json)。
- `AgentAuditPort.appendReceipt`：D17只追加调用、确认、失败、取消与冲突的审计；不能授机床运行资格。
- `IndependentConsumer`按固定合同独立读取结果，并复核旧/新格式与冻结事实；实施路径见[消费者交接](independent-consumer-handoff.md)。

## 高风险 NC 与失效传播

**D04工艺Setup≠D10执行机床实际绑定**；D09中立CL/刀路动画无独立安全资格。必须是最终NC原字节D12→控制器语义D13→实际机床轴时序D14→D15独立工程验证→D16人类受控发布；未建模语义为UNKNOWN，缺证不发布。规划明确不实施材料扫掠仿真，也不把RAG/Agent建议替代安全预检查、仿真和实机验收。冻结A/B的同一事实不得由Agent直接覆写，新修订必须经Owner。

## 定义完成（仅规划）

来源→十规则→40字段→50独立正反→24门禁可由[独立校验器](../../../tools/check_cap1104_planning.mjs)机器读取；[GUI/3D约束](UI.md)及[理论综述](../../../research/topics/R-AGENT-ORCHESTRATION-001.md)齐备。未实际执行真实模型、三/五轴数控控制器、B5、Rust/TS、浏览器、离线消费者、权限撤销竞态；Owner/L3都待人类审批。**规划PASS≠产品PASS。**
