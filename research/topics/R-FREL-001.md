# R-FREL-001｜制造特征关系：拓扑邻接、材料交互、语义层级与工艺依赖

> 研究访问日：2026-10-19。关联[CAP-03-07业务规格](../../docs/capabilities/CAP-03-07/README.md)、[新登记来源](../sources/CAP-03-07.json)、[规则追踪](../traces/CAP-03-07.json)。原编号B0-02/F1-03/F1-04/T5-02。**文献研究与源码观察不等于产品验收。**

## 1. 问题定义及理论范围

NIST Regli/Pratt 1996论文的官方摘要指出“特征交互”概念本身存在歧义；Regli/Gupta/Nau 1995讨论同一零件多种可制造特征解释。Han/Pratt/Regli 2000将特征识别主流技术概括为图、体分解和Hint-based推理，而没有宣称单一方法穷尽复杂曲面场景。SAGE 2009航空结构件研究摘要描述了通过属性邻接图扩展来处理自由曲面及交互特征。这些均支持将候选/证据/冲突与人工决议分开，而**没有要求特定的父子关系、容差常数或工艺排序**。

OCCT TopExp `MapShapesAndAncestors(Edge,Face)`能表达拓扑共享边；`BRepExtrema_DistShapeShape`提供距离证据、`BRepTools_History`提供建模历史变化证据。但TopExp共边只是局部拓扑；距离为0并不自动区分切触与穿透，且几何计算需定义公差和有效Solid域。`History`仅在有真实操作链时可信，不替代两个独立导入STEP间的关系身份。OCCT官方在线文档在访问时显示**8.0.1**；此项规划的算法实现依据另锁`procet-solver` Native **7.9.3**，两版不能被默认为行为一致。

W3C PROV-DM 2013第5.2节Derivation/Revision用于记录图候选、人工决议和来源实体之间的版本化关联；并不定义D02批准条件。所有业务批准条件、CAS/幂等、三层关系模型是**Procet拟议内部架构决策**，不是论文或ISO强制条款。

## 2. 数学与语义不可混淆

若`G_t = (V,E_t)`是同一个`geometrySnapshotRef`下的拓扑邻接图，边可表示`SharesEdge(f_i,f_j,e_k)`；该关系在此作用域内对称，但face index不能跨revision稳定。若`G_m=(F,E_m)`为03域特征关系图，`ContainsPreserve`与`ContainsRemoval`有方向与不同材料语义，`Intersects`通常是对称交互；复合成员是归属事实，不等于去料嵌套。`G_p`才是05域提出并经审查的优先约束DAG，所有`DependsOn`的前置必须有工程材料/Setup/工具/工艺条件；不能将`G_m`直接当`G_p`。

有界检查：父子有向包含的采纳子图必须无环，`cycle(G_tree)=false`；对称关系以`(minRef,maxRef,kind,exactSnapshotRef)`排序去重，**有向父子/DependsOn不可排序端点**。多父相同证据产生`ambiguous`或人工裁决，禁止偷偷按ID选择。算法的`candidateGraphHash`与03域提交`relationGraphHash`分离；即使几何体积证据完整也不能证明生产NC具有控制器语义验证。

## 3. 2026-10-19只读产品源码观察（固定HEAD，非实测）

只读`BaiSongt/procet-solver@44172bc046bfd65c2a4fe36212536c70226be48f`的`crates/solver-feature/src/hierarchy/relation.rs`、`projection.rs`、`dag.rs`、`mod.rs`及`model.rs`。确认已有`RelationKind`八类及typed候选、证据类、树投影、Kahn依赖图。需保留算法资产而非重造。

**具体待核风险**：`relation.rs`局部`floor.centroid[2]`加固定Z方向与足迹等面积圆近似适用于当前测试几何，不说明跨任意Frame稳定；`projection.rs`注释说歧义不猜父，但具体`min_by`含parent ID收尾且`chosen`随后continue，需独立注释/实现回归；`dag.rs``tree_edge_is_removal()`没有匹配候选时默认true，生成只读DAG不是工艺批准。所有风险标`SOURCE_OBSERVATION_NEEDS_PRODUCT_TEST`，本轮没有运行Rust/原生OCCT测试，不能认定产品实际出错。

## 4. 适用边界与下一阶段独立测试

建议用合成公开模型覆盖同深多腔、双父归属、岛屿保护、非流形共边、仅顶点接触、BRep布尔假相交BBox、倾斜/翻转Frame、多Solid重复实例与旋转镜像、圆弧岛及支撑筋。产品回归必须记录模型/源文件SHA、几何Kernel实际版本、算法/容差Profile、输入Frame、期待关系类型与负例诊断，并给出截图或结构报告。生产Native7.9.3和当前在线OCCT8.0.1需分别对拍API兼容，失败时显式unknown。不得以一组含有限benchmark的`Solved`结论称通用关系图已通过。

来源阅读深度：NIST三篇官方页面**abstract**；SAGE航空结构件论文**abstract**；OCCT三篇官方API的相关method说明**section text**；W3C PROV-DM推荐文档第5.2/5.3节**section text**。未购买付费标准或获取论文全文；未声称已实施OCCT或产品集成测试。

**产品实测状态：NOT_RUN。** 独立产品/OCCT版本验证和GUI回归必须由后续实现工作包单独执行。