# B91｜CAP-07-01 多环岛屿偏置、窄通道与圆弧误差的可采纳性（V0.8增量研究）

**日期：**2026-11-01；**状态：**研究及实施候选，L1/L2不变、L3待人类审查；规划PASS≠产品PASS。关联原CAP-07-01、原F1-03/E3-01/U4-04，不产生新CAP或业务资产编号。

## 1. 为什么补证
原CAP-07-01已经要求闭合轮廓、保护岛、自交拒绝和独立NC验证，但尚不能以一个泛化的 `offsetStatus=VALIDATED` 推断**多环偏置后父孔关系、局部通道宽度、圆弧离散精度与不同连通分量间链接**全部正确。本轮将这些条件落实到字段和能拒绝反例的规则，避免“偏置成功/预览好看”冒充可加工安全结论。

## 2. 已联网核对的理论范围
- **OCCT 8.0.1** 的 `BRepOffsetAPI_MakeOffset` 明确针对平面Face/Wire，提供 `Init`、`AddWire`、`Perform`、`SetApprox`、`Generated` 及 `GeomAbs_Arc/Intersection` Join候选，但API存在并非多岛拓扑自动正确。见 [官网API](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_offset_a_p_i___make_offset.html)，只读指定API章节，不是本地OCCT试验。
- **CGAL 6.1.1** [官方手册](https://doc.cgal.org/6.1.1/Straight_skeleton_2/index.html) 的特定“Polygon with Holes”和偏置章节，要求该算法输入外环CCW、孔环CW、边界互不相交且不能孔内嵌孔；输出可能分裂、原孔消失，不能要求所有层级数量不变，但应记录并复核新父子/连通关系。此为CGAL特定输入前提，不代表所有OCCT Wire方向规则。
- **CGAL 6.1** [参考与许可证](https://doc.cgal.org/6.1/Straight_skeleton_2/group__PkgStraightSkeleton2Ref.html) 显示 `arrange_offset_polygons_2` 且Package标为GPL。仅将其作为研究/对照候选；未经法律与依赖评审不将其直接接入产品。
- **NIST Kramer 1992** [出版页](https://www.nist.gov/publications/pocket-milling-tool-engagement-detection) 仅摘要说明含岛型腔及刀具啮合研究；**Liu/Yao/Zhou 2014** [出版摘要](https://www.scientific.net/AMM.607.853) 指出直线/圆弧边界、无效偏置环与连线树问题。均未阅读付费/论文全文，不能冒称复现算法。
- [ISO 14649-11:2004官方目录](https://www.iso.org/standard/40896.html)仅用于确认版次及书目，不摘录受限标准内容、不借此推导数值门限；**0.01mm的分析margin和0.05mm弦高预算均为下述合成样例内生参数，不是ISO/OCCT默认要求**。来源作者、版本、日期、URL、章节、阅读等级及边界逐项见[7条来源](../../../research/sources/CAP-07-01-multiring-offset-b91.json)。

## 3. 字段与数学门禁（不声称通用充分性）
- `refs.refHashes/expectedRefHashes` 保留D02/D03/D04/D07/D08的exact Revision、Hash、Frame与ScopeEpoch，错版`STALE`。
- `topology.planeVerified,wireClosed,outerOrientation,holesOrientation,holesNested,ringIntersections,kernel,offsetStatus,offsetBuildDone,holesMapped,topologyChangeRecorded,componentCount,joinType,legalReview`。从OCCT结果重建区域/孔/连通图；未证明则`UNKNOWN`或`REJECT`。CGAL研究原型法律资格未知不进入商业产品。
- **仅理想直线平行通道**，以局部宽度`w`、工具半径`r`、保留余量`a`，解析可用中心宽`c=w-2(r+a)`。合成`w=5,r=2,a=0.25`时`c=0.5mm`；`w=4.4`时`c=-0.1mm`，拒绝穿行。另加`0.01mm`内生margin；对弧形、自由曲面、非平行通道，**本推导不适用、返回UNKNOWN**，不能靠BBox证明。
- 保留解析圆弧优先；若`DISCRETIZED`，以弦高`e=R(1-cos(Δθ/2))`记录近似损失。合成`R=10mm,Δθ=10°`得`e≈0.038053mm`，在样例`0.05mm`预算内；`20°`超出。此弦高仅验证分段几何误差，**不是刀具包络、机床精度或工序表面质量认证**。
- `protection.sweptDisk2DCertified,islandIntersections,componentsDisconnected,safeRetractForSeparated,linkEnvelopeCertified` 作为02维刀具投影的保守证据；多分量连线不经独立避让证明不得留在切削高度。此处不进行材料扫掠仿真，也不默认Z层、夹具、刀柄已安全。

## 4. 领域契约与UI
D09仍由**07域Owner**经 `07.ToolpathPlanningPort.preview` 生成只读候选、再经 `07.ToolpathOwnerPort.stage→seal→commitCAS` 创建**新修订**；D02/D03/D04/D07/D08只读，D08冻结永不由重算覆盖。GUI、CLI和Agent调用同一Port，单Babylon Engine/Scene/Canvas、唯一左TaskPanel；3D展示外环/岛/偏置候选/UNKNOWN风险和每段来源，可展开至全工作区，不通过Overlay提交状态。全部字段在CAS提交点重验ACL、exact Hash、Frame、ScopeEpoch、任务generation和取消Fence；晚回执不复活，出错保留原修订并可无破坏回退。对旧记录缺少环拓扑证据时迁移标`UNKNOWN_LEGACY_GEOMETRY`，不回填伪VALIDATED。

D09中立CL及D11预览只表达刀路意图。真正机器验证必须基于 `D09→D12最终NC→D13控制器解释→D14轴时序→D15独立验证→D16审批发布`；未知方言、RTCP、碰撞或刀具安装保持`UNKNOWN`。切勿以CL动画或二维偏置合格代替机床认证。

## 5. 规则、验收与交接
[8条逐项来源→字段→资产→原工作包→正反验收](../../../research/traces/CAP-07-01-multiring-offset-b91-v08.json) → [8正18反、3独立数值Golden](multiring-offset-b91-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0701_multiring_offset_b91_v08.cjs) → [执行等级](../../../tracking/cap0701-multiring-offset-b91-verification-2026-11-01.json)。

独立D12消费者必须以固定D09 Hash、同一Frame及明确轮廓原曲线/离散误差重建偏置并故意输入：逆向孔环、孔内嵌孔、薄壁净宽为负、近临界圆弧、岛屿穿越、跨区域切削高度链接、并发CAS冲突、ACL撤销、取消晚回执。接口消费者验收需要真实OCCT/测试CAD及产品跑测、产出失败证据与精确运行版本；本轮未运行。17类资产正式Owner签署仍0/17、独立真实消费者0/17、L3待审、历史原始附件及全仓GFM AST待核；**规划PASS≠产品PASS**。
