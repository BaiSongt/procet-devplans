# B92｜CAP-07-02 三轴曲面修剪Face投影、孔环假阳性与周期UV缝
日期：2026-11-01；阶段：**L3待人工审查，规划专项，不是OCCT/机床验收**。原工作包F1-03、E3-01、U4-04；11域88 CAP/36包/17资产基线不变。

## 研究问题
`GeomAPI_ProjectPointOnSurf`可把点投到支撑曲面并返回多个解，但支撑面比有孔/修剪的`TopoDS_Face`更大。只凭UV范围、`IsDone`或支撑面最短距离，会把孔内垂足当成有效刀心，造成不可加工的假阳性。必须完成真实Face分类/拓扑核验，同时按来源Face和3D几何验证周期缝连续性。

## 8项来源及阅读深度（2026-11-01）
- [OCCT 8.0.1 GeomAPI_ProjectPointOnSurf](https://occt3d.com/dev/doc/refman/html/class_geom_a_p_i___project_point_on_surf.html)：仅公开API的IsDone/NbPoints/Parameters/LowerDistance等相关正文；支持支撑面投影与多解，**不提供Trim自动PASS**。
- [OCCT 8.0.1 BRepClass_FaceClassifier](https://occt3d.com/dev/doc/refman/html/class_b_rep_class___face_classifier.html)：公开Face、Pnt2d、Tol与TopAbs_IN/OUT/ON等相关API；ON边界须明确归属。
- [OCCT 8.0.1 BRepTools::UVBounds](https://occt3d.com/dev/doc/refman/html/class_b_rep_tools.html)：公开Face/Wire/Edge范围API；不是有孔Face成员资格。
- [OCCT 8.0.1 BRepAdaptor_Surface](https://occt3d.com/dev/doc/refman/html/class_b_rep_adaptor___surface.html)：Restriction与IsUPeriodic/UPeriod有关API；UV周期一致不独立证明Trim、3D间隙。
- [OCCT 8.0.1 BRepCheck_Analyzer](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html)：公开IsValid相关正文；拓扑输入合格不等于真实刀具包络无干涉。
- [ISO 10303-42:2025官方书目](https://www.iso.org/es/contents/data/standard/09/13/91386.html)：仅目录摘要/版次，未读付费条款，不将本文阈值归因于ISO。
- [NIST Kramer NISTIR4577（1991-06）](https://www.nist.gov/publications/extracting-step-geometry-and-topology-solid-modeler-parasolid-step)：仅官方出版元数据与摘要，不将下面数学样例归因于论文正文。
- [CAP-07-02原规划（固定Git Blob）](https://github.com/BaiSongt/procet-devplans/blob/e0808cfe52ae871ea82ee93f3db359fde56d377e/docs/capabilities/CAP-07-02/README.md)：`78a7af6df25f902671ccfbc76d50a1c62a512095`，为内部业务约束，不是外部标准。
全部作者、版本、时间、URL、访问章节、正文/摘要/目录/内部原件层级与局限记录在[来源登记](../../../research/sources/CAP-07-02-trim-projection-b92.json)。

## 数学反例与适用范围
仅定义**合成解析模型**：支撑平面z=0，矩形外环[0,10]×[0,10]，开方孔(4,6)×(4,6)，mm。它不是ISO推荐标准件，也没有声称使用了实际OCCT C++对象。

| 点(mm) | 支撑面投影 | Trim分类 | 支撑面最近距离 | 带孔Face最近距离 |
|---|---|---|---|---|
| (3,3,1) | (3,3,0) | IN | 1 | 1 |
| (5,5,1) | (5,5,0) | OUT，孔内 | 1 | √2 ≈1.414214，最近孔边 |
| (4,5,1) | (4,5,0) | ON，孔边 | 1 | 1，但仍需边界归属 |

同理，假定同一个有效周期圆柱面同v的u=0与u=2π可以是同一物理点，raw UV差=2π却不能当物理缝隙；必须另核Same Exact Face、Period、两侧Trim和3D距离。

本轮解析分类器仅覆盖直角矩形外环/孔环，不覆盖样条Trim、异形孔、多连通面、退化极点、CAD读入公差或实际OCCT布尔；其他几何明确UNKNOWN，禁止将合成模型扩成真实工程认证。

## 来源→规则→字段→CAP/原包→正反验收
[8条逐字段追踪](../../../research/traces/CAP-07-02-trim-projection-b92-v08.json) → [8正16反8未知与3项解析Golden](trim-projection-b92-fixtures-v08.json) → [只读Node可运行入口](../../../tools/check_cap0702_trim_projection_b92_v08.cjs) → [分级验证记录](../../../tracking/cap0702-trim-projection-b92-verification-2026-11-01.json)。错误版Hash、Frame、孔内假IN、UVBounds假认证、边界ON自动放行、周期性缺证、错误3D距离、ACL撤销、晚回执和CL冒充D15均列显式反例。

**07域D09业务Owner**负责`ToolpathPlanningPort.preview3AxisSurface`读only候选，`ToolpathOwnerPort.stage→seal→commitCAS`才能生成新D09 revision；提交点检查Owner exact revision/hash/frame/scope、ACL、CAS、generation、cancelled和idemKey。GUI/CLI/Agent统一Owner Port，3D保持单Babylon Engine/Scene/Canvas和统一左TaskPanel，显示≤12px仅供预览；D08冻结不可被覆盖、A/B共用事实不双写，C0只存最小身份/单位/Frame/Revision/Scope。

**D04 Setup和D10实机执行绑定严格分离**；D09中立CL→D12最终NC后处理→D13控制器语义→D14轴时序→D15独立验证→D16人类审批发布。D11 CL动画、局部面投影及几何采样一律不可冒充D15产品PASS；未知方言、测量或Trim语义保持UNKNOWN。不做材料扫掠仿真。

迁移采用Expand→Migrate→Contract：旧D09若缺trim/缝来源记`UNKNOWN_LEGACY_TRIM`，保留旧reader和旧Revision原字节，受控生成新证据后才可晋级；发生Frame/Face/Topo/Scope改变须按依赖失效，无法证明影响范围标UNKNOWN，保留无损回退。

## 独立消费者和未闭验收
真实STEP带孔修剪Face、周期柱面缝、退化边、OCCT8.0.1 C++分类/距离、刀具/刀柄包络，以及D12实际消费者应独立在固定Git SHA/Frame/Owner修订上核对。**本轮全部NOT_RUN**。同源判定函数32个合成预期与3个解析Golden仅规划验证；Node文件独立进程未执行。正式Owner签署与真实独立消费者均0/17；L3、历史附件原始字节、全仓GitHub GFM AST/渲染锚点还未闭合。**规划PASS≠产品PASS**。
