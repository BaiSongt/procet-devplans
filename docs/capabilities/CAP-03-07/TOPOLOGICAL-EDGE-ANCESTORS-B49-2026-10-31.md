# B49｜CAP-03-07 拓扑共边祖先、形状同一性与非流形证据

2026-10-31；L3待审；本文件是增量研究，原FREL-R01..R10、20验收不替换。原工作包 **B0-02/F1-03/F1-04/T5-02**。

## 问题与依据

OCCT 8.0.1的`TopExp::MapShapesAndAncestors`和`MapShapesAndUniqueAncestors`**不自动清空传入Map**。长期复用容器会混入前次D01几何实例的面祖先；必须在Run开始重建Map、保存`mapRunId`并定性Unique的方向模式。OCCT的`TopoDS_Shape::IsPartner`只比较TShape，`IsSame`还比较Location而允许Orientation不同，`IsEqual`进一步比较Orientation。因此同TShape但不同Location的边不能直接声明同一位置共边；方向反转不一定消除邻接。

本次保守契约把**两个不同祖先Face+同一真实Edge**作为`shares_topological_edge`的**候选**，零/一个Face视为证据不足，三个及以上祖先视为非流形歧义，统一返回UNKNOWN。重复Face在Unique证据中为REJECT。这个规则是**Procet设计门禁**，不是OCCT官方规定“非流形一定不可加工”。单纯共顶点、Mesh近邻或BBox相交不等于同一拓扑边。OCCT图关系不自动推导`ContainsRemoval`、`ContainsPreserve`或D05 `DependsOn`，不把D02候选当D08冻结工序。

## 字段、Owner与实物证据

`source.projectId/occurrencePath/d01Revision/d01Hash/d02Revision/frameRef`和`topology.mapReset/mapRunId/ancestorMode/edge.tShape/edge.location/comparedEdge/ancestorFaces`是候选的exact来源；运行内的索引不可当跨修订永久Face ID。跨D01版本重绑定需独立History与人工决策，并保留旧D08/D16不可变。由03域FeatureRelationService负责D02 Owner提交，06域Solver仅提供算法证据，05域D05 Owner另行批准工艺依赖。

GUI、CLI、Agent共用03域Owner Port并在提交点重验D01/D02/Frame、ACL、CAS、scopeEpoch；取消晚ACK不可重新提交。界面保持唯一Babylon世界和统一左TaskPanel；迁移应采用双Reader只读回退，旧revision与事件不删。D04工艺Setup≠D10执行绑定，D09中立CL→D12最终NC→D13执行语义→D14轴时序→D15独立验证→D16发布；任何3D关系动画、CL播放或本合成准入不得冒充D15 PASS，不做材料扫掠仿真。

## 独立正反验收与阅读分级

[6来源/作者版本阅读范围](../../../research/sources/CAP-03-07-edge-ancestors-b49.json) → [8规则/字段/原包/CASE映射](../../../research/traces/CAP-03-07-edge-ancestors-b49-v08.json) → [1正34反5 UNKNOWN，合计40](edge-ancestors-b49-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0307_edge_ancestors_b49_v08.cjs) → [验证记录](../../../tracking/cap0307-edge-ancestors-b49-verification-2026-10-31.json)。

正例为合成E1/TShape=E、Location=L、双Orientation(FORWARD/REVERSED)、唯一祖先[F1,F2]，预期仅`CANDIDATE_ONLY`；反例包括Map未清空、同TShape异Location、重复Face、仅共顶点、D05偷升、CAS/权限/取消/晚ACK、双3D、右Drawer与发布；UNKNOWN包括单/三/零Face、跨版本无History、D15未知。所有fixture相对正例单字段变异，判定函数不读取fixture的expected反推逻辑。

| 来源 | 读深与边界 |
|---|---|
| [OCCT TopExp 8.0.1](https://occt3d.com/dev/doc/refman/html/class_top_exp.html) | 实读MapShapesAndAncestors/UniqueAncestors；无OCCT调用 |
| [OCCT TopoDS_Shape 8.0.1](https://www.occt3d.com/dev/doc/refman/html/class_topo_d_s___shape.html) | 实读IsPartner/IsSame/IsEqual；非长期ID |
| [OCCT Modeling Data 8.0.1](https://www.occt3d.com/dev/doc/overview/html/occt_user_guides__modeling_data.html) | 实读Topological Data Structures；不等于制造特征语义 |
| [NIST Regli & Pratt 1996](https://www.nist.gov/publications/what-are-feature-interactions) | **仅官方摘要**，没有读取PDF正文或推导标准阈值 |
| [W3C PROV-O 2013](https://www.w3.org/TR/prov-o/) | Recommendation，实读来源/wasRevisionOf/qualifiedRevision；不含Procet CAS/审批规则 |
| [原CAP固定Blob](README.md) | 完整原业务规格；L3尚未批准 |

## 回退与独立消费者移交

以合法的自建两面共边/三面共享边/相同TShape异Location/方向反转STEP或BRep在固定OCCT Native构建实测；验证真实Map生命周期及03域Owner事务、05域D05读取、D08冻结影响和审计回执。若Schema迁移失败禁用新Reader/Writer并保留历史D02；证据不完整维持UNKNOWN，不许静默当PASS。**独立Node文件进程、OCCT Native7.9.3、D05实际消费者、NC/B5/OEM仍NOT_RUN，正式Owner 0/17、L3待审，规划PASS≠产品PASS。**
