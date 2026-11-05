# CAP-06-03｜B23 OCCT布尔历史谱系与去料体证明资格
> V0.8 增量研究，2026-10-29；L1/L2不变，L3待人类审批；**规划PASS≠产品PASS**。

## 发现与核心防误判
OCCT Boolean 的 `Generated / Modified / IsDeleted` **不是可随意互换的三个列表**。官方8.0.1文档明确：Generated只报告特定纯相交所生顶点/边，来源仅可能为Edge或Face；对于Solid不应凭Generated为空断定Solid从未修改，也不得用Modified为空代替Deleted状态。实际布尔的切割、简化、重构还可能改变Face/Edge组成；不能把单个内存TopoDS句柄或GUI拾取ID作为跨保存、重开、ShapeFix、简化后的稳定CAD身份。工程需把历史写成明确输入UID、操作、修改/生成结果及结果Blob的证据链。

## 本轮2026-10-29联网复核（仅合法公开网页）
- Open CASCADE 官方 **OCCT 8.0.1 Boolean Operations**，编者Open CASCADE documentation team；出版日网页未标；[原文](https://www.occt3d.com/dev/doc/overview/html/specification__boolean_operations.html)，实读 `History Information / Deleted shapes / Modified shapes / Generated shapes / BOP result simplification`。从这些章节提炼Generated分类与SimplifyResult历史融合要求，不推定全部失败情形均可自动恢复。
- Open CASCADE **BRepAlgoAPI_BuilderAlgo**，OCCT 8.0.1，[API原文](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_algo_a_p_i___builder_algo.html)，实读`SetToFillHistory / HasHistory / History / SimplifyResult / HasErrors / HasWarnings` API。显示存在开关与接口；不是实际已运行且历史完整的证据。
- Open CASCADE **BRepCheck_Analyzer**，OCCT 8.0.1，[API原文](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html)，实读`IsValid / GeomControls / SetExactMethod`；后者的exact方法也不是几何材料安全的充分证明。
- Open CASCADE **BRepGProp**，OCCT 8.0.1，[API原文](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_g_prop.html)，核对`VolumeProperties`接口；封闭Solid、方向、共享拓扑与三角网参数仍需由产品独立控制。
- Regli/Gupta/Nau，1994，[NIST正式出版页](https://www.nist.gov/publications/feature-recognition-manufacturability-analysis)，只读作者、1994-01-01及摘要；仅说明MRSEV/制造特征解释背景，**未读论文全文**，不将其视为OCCT验证规范。
- Lebo/Sahoo/McGuinness，2013-04-30，[W3C PROV-O](https://www.w3.org/TR/prov-o/)，实读Abstract与Entity/Activity/wasDerivedFrom公开章节；仅用于来源DAG设计借鉴，非布尔内核认证或CAS权限标准。
- 原仓[CAP-06-03业务规格](README.md)固定Git Blob `3bd434372486cd0c08904a8f71e50f5362abd721`；实读L0—L7与失效矩阵。GUI/CLI/Agent、单Babylon、ACL/CAS、D04/D10以及NC阻断是**Procet内生设计**，不错误归因外部标准。

## 7项机器可检增量规则
1. `H23-R1`：输入Stock、候选D06与结果D07各自持有exact Revision/Hash/Frame/Unit/Scope，结果必须是新候选修订。
2. `H23-R2`：操作类型、OCCT版本、非破坏模式、History采集、Errors/Warnings和fuzzy预算有固定证据，拒绝静默调高容差。
3. `H23-R3`：指定的每个输入TopoUID都应有追溯记录；`IsDeleted=true`不能同时保留`Modified`结果。启用SimplifyResult时记录融合后的最终历史。
4. `H23-R4`：Generated只允许文档给出的来源类型与产物类型；输出目标须在序列化候选映射中可解析，不能以`Generated=[]`证明无变化。
5. `H23-R5`：几何前后检查、封闭Solid体积预算、保护区不相交分别出证；合成的100−20=80是**数学Oracle**而非OCCT真实体积。
6. `H23-R6`：所有GUI/CLI/Agent命令经06域同一Port；提交点重验ACL/CAS/ScopeEpoch/JobGeneration，取消、晚回执与旧HEAD隔离，staging不覆盖冻结。
7. `H23-R7`：历史报告最多是D07候选，须由独立序列化消费者复核才谈D08采纳；D04 ProcessSetup≠D10 ExecutionBinding；中立CL→NC后处理D12→D13解释→D14时序→D15验证→D16发布。D13 UNKNOWN时D15/D16 BLOCKED，不做材料扫掠仿真。唯一Babylon世界+左TaskPanel。

精确[来源登记](../../../research/sources/CAP-06-03-brep-history-b23.json) → [规则/字段/原编号包](../../../research/traces/CAP-06-03-brep-history-b23-v08.json) → [1正40独立单字段反例](brep-history-b23-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0603_brep_history_b23_v08.cjs) → [验证等级](../../../tracking/cap0603-brep-history-b23-verification-2026-10-29.json)。关联原F1-05、W2-02、W2-03、W2-06，非新增编号。

## 退出条件与缺口
合成Fixture只检查字段和集合/体积账本，不调用OCCT，且示意哈希不是源STEP实际字节。产品侧应使用锁版OCCT加载真实B-Rep，构造CUT/FUSE/COMMON及SimplifyResult启停、共面/近切、薄壁岛屿/多Solid/旋转Setup等成对案例；每次将历史映射、Original/Modified/Generated/Deleted、BRepCheck与封闭体积、受控fuzzy和警告保存，再由**独立进程D07消费者**重新加载字节校验。之后才允许独立NC与实机链验证；本轮以上均`NOT_RUN`，Owner签署0/17、消费者通过0/17、L3待人审，历史附件原字节与全仓GFM AST仍未闭合。
