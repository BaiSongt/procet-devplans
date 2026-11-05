> **B69定点补证（2026-10-31）**：[工艺模板的三值适用性/单位精确换算与CAS](APPLICABILITY-THREE-VALUED-B69-2026-10-31.md) → [来源](../../../research/sources/CAP-05-04-applicability-b69.json) → [8规则](../../../research/traces/CAP-05-04-applicability-b69-v08.json) → [40合成](applicability-b69-fixtures-v08.json)。未知材料/机床能力不能从default推定适用，规划候选≠NC产品验证，L3及真实消费者待验。

# CAP-05-04｜工艺模板与复用（V0.8原编号）
> **规划候选，L3、Owner签署及产品/独立消费者均未执行；不是可直接使用的CAM模板库。** 保留11域、88 CAP、36工作包、17资产的既有编号。

## 目标与Owner
将重复的粗/半精/精工序意图、工艺策略、参数族及适用条件管理为**不可变ProcessTemplateRevision**，通过显式槽位重绑定到新零件，生成新的**D05工艺计划候选修订**。复用不是复制旧零件刀路/NC，也不是自动批准加工。**05域是模板与D05业务Owner**；03域的D01/D02设计、04域的D04名义Setup、02域D03资源为外部精确依赖；06域D06候选和D07材料状态仅供独立再评价。08域D12/D13、09域D14/D15、10域D16都不能从模板直接“继承通过”。

## 最小数据模型与边界
- `TemplateFamily(id,scope,ownerDomain)` / `TemplateRevision(id,revision,hash,canonicalProfile,schemaVersion,state,parentExactRef?,actor,approvalRef?,createdAt)`：仅追加新版本。状态建议 `DRAFT→REVIEWED→APPROVED→DEPRECATED`，L3具体细节待审。
- `Applicability(materialFamilies[],featureClasses[],processKinds[],requiredCapabilities[],revision,unknownPolicy=REJECT)`：字段缺失或证据不明时不自动命中，不把“近似”推定为可加工。
- `OperationTemplate(stableKey,strategyIntent,parameterFamilyRefs[],featureSlotRefs[],precedenceEdges[])`：DAG为工序业务先后，非机床排程；`D03 ToolRequirement`只表示候选要求，不内嵌工具ID或生产准入。
- `TemplateInstantiation(projectScope,actor,templateExactRef,sourceExactRefs[],geometrySlotBindings[],resourceBinding,frameGraphProof,overrides[],expectedD05Revision,scopeEpoch,taskGeneration)`：每个引用必须包含`id/revision/hash/frame/schemaVersion`，哈希规范化profile明示；不以UI名称或当前活跃Selection推断实体。
- `ReuseDiff(added/modifiedOperationStableIds,affectedDependencyClosure,unaffectedNodes,migrationWarnings,unresolved)`；`ApplyReceipt(newD05ExactRef,templateProvenance,sourceProvenance,acceptanceStatus)`。D08已冻结则走fork＋审批，历史不变。

[合成契约](contract.example.json) · [GUI和单3D交互](UI.md) · [20项正反合成规格](fixtures.json) · [来源登记](../../../research/sources/CAP-05-04.json) · [10条规则映射](../../../research/traces/CAP-05-04.json)。

## 主流程
1. 从`工程→工艺计划`或统一左`TaskPanel`打开**模板目录**，显示版本、业务Owner、审批状态、适用性范围、来源及上次维护人；不通过模板名选择最新版本用于历史工程。
2. 选择已审批版本，在D01/D02/D04的**精确修订**上下文运行`evaluateApplicability`。必要上下文缺失返回`UNKNOWN/NOT_APPLICABLE`，不得当PASS；MVP不支持的工艺策略显式标为`UNSUPPORTED`。
3. 工艺人员绑定每个抽象FeatureSlot到真实CAD occurrence/制造特征与FrameGraph变换。必须显示未匹配、几何变化及多实例歧义；`bbox`接触不是精确实体或安全证据。
4. 按D03现有资源能力解析刀具与刀柄、材料和切削参数`单位/允许区间/来源`。未找到完全合格资源时`REQUIRES_MANUAL_RESOLUTION`，不静默代换相似刀具；人工覆盖必须有权限、理由、批准证据。
5. 仅预览`模板意图→局部Operation DAG→目标D05候选`的差异，显示新增/失效/未影响子图，3D只高亮已匹配occurrence；模板绝不携带旧D09 CL、旧D12 NC或D10机床执行绑定。
6. GUI、CLI、Agent共用`ProcessTemplateDomainPort`：`list/getRevision/evaluateApplicability/previewInstantiation/resolveBindings/commitInstantiation/forkTemplateRevision/cancel`。Agent只提供建议；统一Host每次commit重新校验ACL、CAS、scopeEpoch、taskGeneration、模板批准与输入hash。预览不写正式D05。
7. 取消、撤权、切Setup、超时或晚回执不得切换正式修订；保留不可变审计。成功则创建**新D05 revision**及模板`wasDerivedFrom`来源链，不写回D08冻结、不覆盖D16历史。需要回退时创建新受控修订/撤销引用，而非删除用户数据库。
8. 在版本升级中生成可审阅迁移差异；不兼容字段必须明确adapter revision并由人类批准，历史采用固定模板版本。D05变更引发的D06/D07/D09与后续D12–D15仅在受影响子图失效。**CL动画≠D15 NC工程验证**，D13未知执行语义继续`UNKNOWN`，不开展材料扫掠模拟。

## GUI/CLI/Agent与验收出口
- 统一左TaskPanel五步：**选择模板→适用检查→槽位/资源绑定→差异预览→受控采纳**。右侧Agent独立可隐藏，单Babylon场景统一租约/高亮，不生成第二世界；主题仅浅/深，最大文字12px。
- CLI可做`template list|inspect|evaluate|preview|apply --expected-revision`（命名候选，L3待定）；CLI不能跳过审批/资源绑定。Agent工具直接调用同领域Port，并公开`UNKNOWN`及证据。
- **测试入口候选**：`node tools/check_cap_05_04.mjs`检验本仓机器规则及正反fixtures；将来产品端应在固定exact HEAD对模板迁移、跨语言canonical、D05写侧、D03工具匹配、D04变换、NC下游失效分别构造独立消费者测试。当前均`NOT_RUN`。
- 10规则对应20机器规格，仅静态规划契约检查；拒绝后需返回可定位的错误码及受影响字段。合成数据不意味着任何真实工件可以安全加工。

## 推进依赖与验收分解
| 原编号包 | 本CAP的输入/输出 | 独立负例 |
|---|---|---|
| W2-02 | 接管模板生成的D05候选，只采纳目标子图；冻结走fork | 未审批模板或冻结原位覆盖拒绝 |
| W2-03 | 依赖DAG与准确失效闭包 | 只有UI变化不得广播D09/D15失效 |
| W2-05 | 多Setup中的FeatureSlot/FrameGraph可寻址绑定 | 同名不同occurrence和转序UNKNOWN拒绝 |

**范围外**：自动生成可执行NC、隐含机床运动学、全自动机床排程、未经验证的生产切削建议、控制器专有宏、连续材料扫掠与实机碰撞证明。模板“可采纳”不等于“可发布”。
