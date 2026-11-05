# CAP-03-04｜B121 尺寸几何引用与标注Plane兼容性、Ordinate基线传播

> 2026-11-03 · 全新编写增量研究，不是恢复缺失的历史附件；原11域88 CAP、36工作包和17资产编号不变。L1/L2不变，L3待人审。**规划PASS≠产品PASS。**

## 新发现及精确来源

此前[B83](ANNOTATION-PLANE-B83-2026-11-01.md)已拆分方向Plane、实际平行放置面、PMI语义、Capture和屏幕布局。B121补充**某一种尺寸是否允许与指定几何/标注Plane组合**、**Ordinate坐标尺寸共享Baseline的精确依赖与失效**两项新缺口。通过Plane正交性只证明数学姿态可用，不代表制造尺寸语义有效。

[PTC Creo R13官方Surface References](https://support.ptc.com/help/creo/creo_pma/r13/usascii/model-based_definition/annotation_plane_requirements.html)对Driven Dimension作了分类：引用平面Face的Plane应与该Face垂直，其他参考决定线性或角度型；圆柱Face需要依据Plane与轴的平行/垂直关系选择半径、直径或线性直径；圆锥轴要求Plane按轴向符合相应几何关系；球面本身不附加Plane姿态约束，但其他尺寸参考仍可能限制。一次/两次点击对应的尺寸类型是Creo特定UI动作，**绝非跨厂商数控制造规则**。

[PTC Creo R12 Ordinate Dimensions](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/about_ordinate_dimensions.html)说明：创建坐标尺寸须有Baseline Annotation Element，多个尺寸使用同一基线Plane；修改组方向须修改Baseline。Procet的新规则把这一关系建成exact有向引用图，基线修订或Plane改变必须传播STALE，成员不能自行换Plane掩盖来源失效。

[Creo R12 Active/Current](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/about_annotation_orientation.html)、[R13 Plane与首附件位置](https://support.ptc.com/help/creo/creo_pma/r13/usascii/model-based_definition/about_annotation_plane.html)、[R12参考/冻结交互](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/to_define_annotation_orient_by_plane.html)、[R13 Flat-to-screen](https://support.ptc.com/help/creo/creo_pma/r13/usascii/model-based_definition/about_flat_to_screen_annotation_orient.html)和[Creo OTK C++ R12概念](https://support.ptc.com/help/creo_toolkit/otk_cpp_pma/r12/usascii/creo_toolkit/user_guide/Annotation_Orientation.html)只作为供应商具体版本的证据，不暗称Procet已有同名功能。

[ISO 16792:2021 Ed3官方目录](https://www.iso.org/standard/73871.html)仅核对书目、发布状态和版次；未读取其受版权保护的收费正文，也不从目录臆造尺寸Plane、容差、GD&T条款；后续DIS草案不是现行正式版。作者、版本、访问日期、URL、章节深度和局限在[9项来源登记](../../../research/sources/CAP-03-04-dimension-plane-b121.json)中独立记录，含本规划固定CAP原规格。

## 设计数据对象与责任边界（拟议，不是现行产品schema）

| 对象 | 必需字段 | 归属/失败语义 |
|---|---|---|
| DimensionIntentRef | D01 sourceRevision/sourceHash/occurrencePath、D02 pmiRevision、dimensionKind、unit、sourceEntityRef | 03域PMI Owner；graphic-only或来源未知返回UNKNOWN |
| SurfaceReferenceExact | source geometryHash/topologySnapshotRef、subshapeId、SurfaceKind、Frame、axis或faceNormal、readerProfile | 03域/原F1-03消费；渲染mesh法向不可冒充B-Rep制造证据 |
| DimensionPlaneEligibility | planeRef/revision/hash、dimensionKind、surfaceKind、planeAxisRelation、otherReferenceEvidence、policyRevision | CANDIDATE/UNKNOWN/STALE/REJECT，必须绑定目标厂商/版本；几何姿态不是标准合规充分条件 |
| OrdinateBaselineRef | baselineId/revision/hash/planeRef、memberRefs、dependencyGraphHash、sourceOccurrence | 子项共享Plane，基线revision变更级联失效，环依赖拒绝 |
| PmiPlacementRef | firstAttachmentRef、planeRef、signedOffsetMm、textRotationDeg、screenLayoutEpoch | Plane定朝向，附件定位置；屏幕避让不能修改模型PMI |
| CommitEvidence | expectedPmiRevision、exactSourceHash、Frame hash、actor/ACL/policy、scopeEpoch、cancelGeneration、requestId、receipt | 03域事务提交点重验CAS与撤权，取消迟到ACK不能写其他工程 |

**数学限定**：同一Frame中`|dot(n_f,n_plane)|≈0`表示两个平面垂直，`≈1`为平行；圆柱或圆锥轴和Plane法向之间的关系必须换用轴向解释；球面无固定轴，不据此对全部参考直接放行。夹具所用`1e-9`仅合成向量关系判定阈值，绝非工业公差或OCCT通用容差。

## 主流程、GUI、异常与迁移

1. 从D01确切CAD实例、合法B-Rep Face/Axis、Reader Profile及D02已有语义PMI获取锁定输入；不能通过屏幕像素长度、双击次数生成制造尺寸。未知单位、仅图形PMI或拓扑分裂保留只读候选。
2. 统一左UnifiedTaskPanel的「尺寸与公差」页列出Plane/Named View候选与Face/Axis相对关系；03域`PmiAnnotationPort.checkDimensionPlaneCompatibility`拟议用例返回CANDIDATE/UNKNOWN/REJECT/STALE与适配器理由。平面、圆柱、圆锥、球面分别采用已锁定的受支持子集，不能默认跨Creo/CATIA通用。
3. Ordinate树一条Baseline对应多个尺寸成员，显示exact baselineRevision/hash、共享Plane与当前失效清单；改变基线生成新Proposal，不能重写旧已批准D02或冻结D08。重复引用、环、缺基线、跨Occurrence混绑、源修订变化必须显式失败/重审。
4. 单Babylon Engine/Scene/Canvas，主工程和制造资源空间横向切换，不并排多3D、不建右Drawer；唯一左TaskPanel、浅/深主题及≤12px字。Renderer只管屏幕投影、引线/避让和高亮，不写语义、Frame或Frozen快照。
5. GUI/CLI/Agent通过同03域Owner Port；preview/drag无领域写。Commit携actor、exact revision/hash/frame、expectedRevision、requestId、scopeEpoch、cancelGeneration，并于提交点重验ACL/CAS与撤权；晚回执仅归档原请求，A/B同事实不覆盖冻结。
6. 旧数据缺Plane、Baseline、单位、SourceHash一律LEGACY_UNKNOWN只读隔离；保留原始raw与版本/转换链，人工补足后生成新修订并支持历史回退。受影响D05/D08等消费者按精确依赖标STALE，冻结快照仍存。
7. D04工艺Setup和D10实际机床执行绑定严格独立；D09中立CL→D12后置→D13执行语义→D14轴时序→D15独立验证→D16发布。未知OEM控制器语义UNKNOWN，CL动画不得冒充NC工程验证，不进行材料扫掠仿真。

## 可追踪的独立正反验收和真实消费者

[9条来源](../../../research/sources/CAP-03-04-dimension-plane-b121.json) → [8规则/字段/业务资产/CAP/原编号包](../../../research/traces/CAP-03-04-dimension-plane-b121-v08.json) → [8正32反+6向量Golden+4有向图Golden](dimension-plane-b121-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0304_dimension_plane_b121_v08.cjs) → [执行等级](../../../tracking/cap0304-dimension-plane-b121-verification-2026-11-03.json)。

典型反例：Planar Face却选平行Plane；圆柱轴关系已知但源DimensionKind不支持；跨实例Ordinate成员共享错基线；成员自己换Plane；Baseline变动漏STALE；CLI/Agent绕授权；晚回执污染新工程。真实实施验收入口拟定`T5-02::pmi-dimension-plane-baseline-roundtrip`：获合法授权的Creo/STEP样例须含两实例、两Baseline与多种参考Face；03域Owner固定模型字节、Reader/Frame/GeometryHash并提交新D02后，由独立质量/工艺消费者读回尺寸种类、Plane/轴关系、组依赖失效和迁移回退；禁止由作者的same judge自称独立验收。

本轮机器样例是同一判定函数布尔合成和人工预期数学Golden，不代表真实Creo/CATIA/OCCT/STEP/NC合规。17正式Owner签署0/17、真实独立消费者0/17、L3待人审，全仓GFM AST与历史原附件原字节审计尚未完成。**规划PASS≠产品PASS。**
