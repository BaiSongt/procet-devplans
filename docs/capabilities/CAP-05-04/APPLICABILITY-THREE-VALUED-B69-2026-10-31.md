# B69｜CAP-05-04 工艺模板的适用性三值判定与英寸量纲资格（2026-10-31）

> 适用范围：Procet V0.8 L3待审规划补证。**这一判断只产生D05候选，不能直接授权设备、D15或D16；规划PASS≠产品PASS。**

## 业务反例与本轮解决的问题

将模板 `APPROVED` 或JSON Schema `default: "ALUMINIUM"` 误读为现场材料已经测得为铝，会把**未知**误判为**适用**。本轮将模板候选应用建立在三个互斥事实等级之上：事实已知且不匹配 = `NOT_APPLICABLE`；尚无可靠事实或量纲无法解释 = `UNKNOWN`；所有已要求谓词及精确引用均有证据且通过 = `CANDIDATE_ONLY`。另外，D05 Head/Scope/任务代次过期 = `STALE`，权限、冻结或执行边界违约 = `REJECT`。判定按阶段进行：权限、身份与冻结不变量违规先`REJECT`，Owner或依赖代次冲突为`STALE`；随后必须先建立精确来源与FrameGraph资格，否则返回`UNKNOWN`；资格成立后，已知类别或量值失配为`NOT_APPLICABLE`，剩余缺失信息为`UNKNOWN`，全部满足才为`CANDIDATE_ONLY`。**这只是Procet内生保守决策顺序，并非全局可交换的状态优先级；JSON Schema/ISO没有规定这些状态**。

取一个明确注明为合成的铣削模板：要求铝合金、平面腔体、粗加工、三轴能力、`pocket-main`槽位、目标直径闭区间[20,30] mm以及步距最大13 mm。NIST公开英寸定义给出 `1 in = 25.4 mm` 精确，因此`1in`直径为25.4 mm、`0.5in`步距为12.7 mm，仅满足**本合成适用性规则**。步距`0.6in=15.24mm`明确不适用；机床能力未读取时则UNKNOWN而不是默认无能力。13 mm边界是**合成值，不是刀具切削参数推荐值或标准公差**。

## 来源登记、真实阅读范围及局限

|ID|出版者/版本/访问章节|实际阅读深度与局限|
|---|---|---|
|B69-S01|JSON Schema Draft 2020-12 Validation；2022-06-16；§6.5.3/§9.2/§7.2|公开正文定点阅读：required与default/format不同；不能证明生产工艺适用|
|B69-S02|JSON Schema Draft 2020-12 Core；2022-06-16；§10.2.2、§11.3|公开正文定点阅读：条件、注解语义；三值判定为内生设计|
|B69-S03|NIST Office of Weights and Measures；SI Units–Length；inch 1959定义FAQ|官方公开正文：1in=25.4mm精确；非实际工艺质量结论|
|B69-S04|ISO/TC184/SC1；ISO14649-10:2004 第2版，2024复核|**仅合法官方目录与摘要**：工作步骤和通用工艺数据；付费EXPRESS正文未读|
|B69-S05|W3C PROV-O，2013-04-30；§3/§4|正式推荐规范的公开指定章节：来源关系；不包含D05 Owner授权|
|B69-S06|本仓CAP-05-04既有实施规格的固定Git Blob `8e392033...`|真实规划规格原文：Setup/Owner/冻结/统一GUI；非产品实现|

完整作者、版次、时间、URL、访问深度及局限见[来源文件](../../../research/sources/CAP-05-04-applicability-b69.json)。标准原文未复制到公共仓。

## 源→规则→字段→CAP/原工作包→独立正反验收

[8条机读规则](../../../research/traces/CAP-05-04-applicability-b69-v08.json)逐项覆盖：R01模板Scope/版本Hash/批准；R02缺失值与材料/特征/工艺事实；R03机床能力及FeatureSlot；R04英寸到毫米与量纲/区间；R05 D01/D02/D03/D04 exact Revision/Hash/FrameGraph；R06 D05权限、CAS、撤权与取消晚回执；R07 GUI/CLI/Agent同Owner Port及单Babylon、统一左TaskPanel；R08 A/B冻结不被模板重写及D04/D10/D12–D16隔离。全部映射到原编号W2-02、W2-03、W2-05，原11域/88 CAP/36包及17资产分母不改。

[40例规划合成Fixture](applicability-b69-fixtures-v08.json)包括四个候选、18个明确拒绝、七个事实不适用、四个过期、七个UNKNOWN；[只读Node校验入口](../../../tools/check_cap0504_applicability_b69_v08.cjs)需要真实checkout并执行后，才可记录独立Node PASS。本轮在V8中按同一判定函数核对所有预先标注结果；**不宣称独立Node进程已运行，也不宣称实际工件适用**。

## GUI、事务、失效迁移与最终验收边界

1. 单Babylon Engine/Scene/Canvas呈现只读特征/资源高亮；统一左TaskPanel逐项显示`PASS / NOT_APPLICABLE / UNKNOWN / STALE`原因及原始单位，最多12px。CLI/Agent与GUI共用`Domain05.ProcessTemplateDomainPort`，预览不能直接写D05。
2. 最终提交由05域Owner在同一事务中重新取得模板、D01–D04依赖Revision/Hash/Frame、scopeEpoch、ACL、D05 Head CAS、taskGeneration与cancelFence；迟到预览回执不得改变已冻结D08。合格只允许**另建D05候选Revision**，不从模板复制D09 CL、D12 NC或D10机床执行绑定。
3. D05改动按W2-03版本依赖图传播D06/D07/D09及D12–D15的真实失效闭包；A/B共事实但不得覆盖冻结。执行仍须走中立CL→D12后处理→D13解释最终NC字节→D14轴时序→D15工程验证→D16审批发布；控制器未知语义UNKNOWN，不做材料扫掠仿真。
4. Expand：旧模板只读适配字段与既有`contract.example.json`保持兼容；Migrate：明确记录单位profile和缺失项，未知一律不自动补默认；Contract：只有独立消费者逐案签收、人类批准及D05实际事务校验后才撤旧Reader。失败恢复旧只读，但不得恢复撤权写入或删除历史审计。

**实际缺口**：D05 Owner真实事务0次、跨语言单位/Canonical互操作0次、17资产正式Owner签署0/17、17独立消费者真实验收0/17、真实NC/OCCT/OEM/B5及L3评审均NOT_RUN。历史原件字节、全仓596份Markdown GFM AST/锚点终核另行审计。规划PASS≠产品PASS。
