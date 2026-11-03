# B148｜CAP-03-02：XDE装配发生层级闭包与Location单次变换（2026-11-04）

> 规划研究补证；原11域/88 CAP/36原编号工作包/17资产及L1/L2不变，L3待人工审批。**规划PASS≠产品PASS。** 与B106的SHUO显示样式研究不同，本项聚焦**完整装配身份与变换可证性**。关联原编号B0-02/F1-03/F1-04/T5-02。

## 核心问题

同一PartDefinition允许被两个或多个ComponentOccurrence引用；共享几何Hash、文件名、XDE Referred Label并不意味着出现实例相同。每个Occurrence应有精确文档Revision/Reader options/源Label路径、父实例与局部Frame。名字、网格ID、三角片或展开顺序不能当成稳定身份。

OCCT 8.0.1的`XCAFDoc_ShapeTool::GetComponents(L, Labels, getsubchilds=false)`默认不递归，拿到当前一层不能声称遍历了整套嵌套结构；`GetReferredShape`解析引用定义，`GetLocation`返回实例位置。`GetShape(Component)`已经可能包含正确实例Location，业务代码不能在不知道读取路径的情况下再盲乘一次。这里仅根据官方API识别风险；尚未调查Procet当前Reader内部调用链，也没有真实STEP运行结果。

**自行构造的教学数学反例（非OCCT产品测量）**：采用列向量、齐次坐标与`T_root_child = T_root_parent × T_parent_child`。若父平移(10,0)且子平移(0,2)，局部原点落在根系(10,2)，而把子Location应用两次会错到(10,4)；父绕原点旋转90°、子沿局部X平移2，根点应是(0,2)，错误的乘序不能互换。两个Occurrence分别位于(10,0)与(20,0)，即使共享定义也不能合并。

## 合法来源与实际阅读深度

|ID|作者/版本、时间|URL与读到的章节|证据等级和限制|
|---|---|---|---|
|B148-S01|Open CASCADE S.A.S.；OCCT 8.0.1；网页不标单篇出版日期|https://dev.opencascade.org/doc/refman/html/class_x_c_a_f_doc___shape_tool.html ，GetComponents、GetReferredShape、GetLocation、GetShape、GetFreeShapes方法|实读公开API指定方法，不能证明Procet真实装配读入或跨Revision实例ID|
|B148-S02|Open CASCADE S.A.S.；OCCT 8.0.1；网页不标单篇出版日期|https://dev.opencascade.org/doc/refman/html/class_s_t_e_p_c_a_f_control___reader.html ，ReadFile、Transfer、ReadExternFile|实读公开API指定方法，支持外部引用能力不等于依赖闭包已完整|
|B148-S03|ISO/TC184/SC4；ISO 10303-242:2025第4版；2025-08-25正式出版|https://www.iso.org/standard/84300.html ，公开版本/生命周期目录|只读合法目录，未读付费正文、不得引用未读条款；2026年Edition5 ISO/CD尚非Final|
|B148-S04|NIST；参考STEP/QIF三件箱体数据；目录2019-10-21更新|https://catalog.data.gov/dataset/reference-knowledge-graphs-of-step-and-qif-data-for-a-three-part-box-assembly-071c8 ，公开元数据摘要|未下载或运行STEP/QIF，不能证明本轮验收|
|B148-S05|BaiSongt/procet-devplans原CAP-03-02；2026-10-18规格、2026-11-04固定Blob回读|https://github.com/BaiSongt/procet-devplans/blob/5cd649ee9519da20e57642c5cc0f12f5e34bee06/docs/capabilities/CAP-03-02/README.md ，§2–4|内生设计来源，不冒称ISO/OCCT约束|

## 8项字段规则及正反测试要求

|规则|字段/状态约束|正向独立反例各1项，共4反|
|---|---|---|
|B148-R01 来源与多根|sourceHashExact、readerProfileExact、transferResultCaptured、freeRootsRetained|分别删除四个字段，返回SOURCE_SCOPE_INCOMPLETE|
|B148-R02 定义/实例|definitionRefExact、occurrenceIdsDistinct、sharedDefinitionAllowed、noDedupByNameOrHash|单字段变异返回DEFINITION_OCCURRENCE_CONFLATED|
|B148-R03 递归闭包|nestedTraversalExplicit、referredShapeResolved、labelScopedToDocument、noOccurrenceCycle|单字段变异返回NESTED_REFERENCE_NOT_CLOSED|
|B148-R04 变换|localToParentDeclared、parentFirstMultiplication、sourceUnitsFramePinned、locationAppliedOnce|单字段变异返回TRANSFORM_UNPROVEN|
|B148-R05 修订失效|definitionHashNotPose、poseRevisionSeparate、affectedConsumersStale、frozenRevisionProtected|单字段变异返回INVALIDATION_MISSING|
|B148-R06 外链|externalManifestPinned、unresolvedNotHidden、offlineNoImplicitDownload、incompleteCannotQualify|单字段变异返回EXTERNAL_DEPENDENCY_UNRESOLVED|
|B148-R07 业务事务|guiCliAgentOneOwner、singleBabylonLeftTaskPanel、previewNoWrite、aclCasEpochCancelRechecked|单字段变异返回OWNER_TRANSACTION_UNSAFE|
|B148-R08 资格隔离|d01ExactRevisionHashFrame、d04SeparateD10、clCannotImpersonateD15、realConsumersNotRun|单字段变异返回FALSE_PRODUCT_PASS|

每条规则要求1个有效候选与4个仅改动一个字段的独立负例，总计8正32反；再加入5个位置矩阵Golden。正例只能标`PLANNING_CANDIDATE_ONLY`，不能给`PRODUCT_PASS`。来源B148-S01/S02支持XDE与Reader机制，S03/S04只用于标准版本与未来试件背景；CAS、Owner、权限、回退和GUI约束来源为S05本仓原规划。

## Owner/接口/GUI/3D与失效迁移

D01由03域CAD Owner唯一写入：源文件原始字节Hash、Read/Transfer配置、exact Revision、Occurrence/Definition分层、Frame及单位，GUI/CLI/Agent走同一领域UseCase。只允许一个Babylon Engine/Scene/Canvas和一个左侧UnifiedTaskPanel；浏览/3D拾取是投影，不能以共享Mesh ID更新D01。提交前重新检查ACL/ScopeEpoch/CAS expectedRevision/Hash/Frame/取消generation；晚ACK只保留原请求receipt，不覆盖当前工程。A/B不静默改已冻结D08。

D01实例变换或外链变化按受影响的D02/D04/D05/D06消费者传播STALE；失效的旧Reader兼容窗口保留原始字节与只读回退。未知外链/单位/定位返回UNKNOWN并阻断自动制造采用。D04名义Setup与D10真实执行绑定各自修订。中立D09 CL及D11 CL动画不是NC工程PASS：D12最终NC必须重新被D13解释，再经D14实际轴时序和D15独立验证，最后D16授权发布。本项不做材料扫掠仿真。

## 独立消费者与测试入口

规划侧门禁需只读检查来源ID、8规则/32字段、8正32独立反、5矩阵Golden以及跨域资产Owner分层。真正验收应由03域提供含双实例、两级嵌套、旋转与平移、多根与缺失外链的实际STEP测试包（含合法来源和SHA），04/06域**另一个实现/进程**读取与反算Frame，记录Reader build、错误分级、ACL/CAS/退出码和旧版本回退，再由Owner人工审签。当前这些**NOT_RUN**；17正式Owner签署0/17、独立消费者实际验收0/17；L3待人审、历史原始附件审计、全仓GFM AST终核未闭。