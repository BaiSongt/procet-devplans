# B174｜CAP-03-04 投影、剖视、剖切的3D PMI标注资格及Capture隔离

> 2026-11-05｜V0.8增量｜NEWLY_AUTHORED｜L1/L2、88 CAP、36原编号工作包及17资产编号不变；L3待人类审核。**规划PASS≠产品PASS。**

## 1. 与B83、B121的新增边界

[B83](ANNOTATION-PLANE-B83-2026-11-01.md)已分离PMI语义、方向Plane、第一附件位置、Capture和屏幕投影；[B121](DIMENSION-PLANE-COMPAT-B121-2026-11-03.md)已规定驱动尺寸与所选Surface/Plane和Ordinate Baseline关系。本轮**不是重新提出标注平面**，而是把Projection/Section/SectionCut三类视图对标注**局部Z放置资格**、剖面相交证据、视图切换和Capture可见集合的失效条件变成具体可检字段。

2026-11-05定点阅读[Dassault品牌帮助文档的第三方镜像](https://help-3dexperience.aesvietnam.com/English/FtaUserMap/fta-c-ViewAnnotationPlanes.htm)指定章节：Projection可正负Z偏移，Section仅负Z偏移，SectionCut需Z=0且只与剖切相交几何相关。此为**特定帮助版本的产品行为**，不是ISO/ASME通用强制条款，也不应强加于PTC Creo。其[Display View](https://help-3dexperience.aesvietnam.com/English/GsdUserMap/fta-t-ViewAnnotationPlanes-Display.htm)切换Show/NoShow，但不改原标注隐藏状态；剖切显示对变化几何并非动态自动更新。PTC Creo R13[About Annotation Plane](https://support.ptc.com/help/creo/creo_pma/r13/usascii/model-based_definition/about_annotation_plane.html)则把Plane朝向与首附件定位分开。

## 2. 来源、版本与可读深度

[8项来源登记](../../../research/sources/CAP-03-04-section-view-b174.json)分别记录作者/厂商、版本、访问日期、URL、实际阅读的章节、深度与局限：PTC R13官方公开HTML；Dassault帮助文本**3个第三方镜像页面**（不冒称官方3ds直接提供）；NIST官方PMI项目Overview/Test System Components公开正文说明语义PMI与图形PMI分离；[ASME Y14.41-2026官方产品目录](https://www.asme.org/codes-standards/find-codes-standards/y14-41-digital-product-definition-data-practices/2019/pdf)只核对版次与介绍，**未读收费标准正文**。固定GitHub原CAP与工作包作为Owner/验收内生规则来源。不得用来源目录替代真实CAD测试。

## 3. 类型化数据与Owner契约

| 对象 | 字段与权威Owner | 必须拒绝或标Unknown的条件 |
|---|---|---|
| `ViewAnnotationPlaneRef` | 03域PMI Owner：`viewKind`、`localZmm`、`planeSha`、`intersectsSectionGeometry`、`vendorProfile/version` | 未明确Profile只返回UNKNOWN；SectionCut偏移非零、无交线关联拒绝，Section正Z拒绝；测例阈值不冒充真实CAD容差 |
| `ExactPmiAnchor` | D01 `sourceSha/modelRev/occurrencePath/frameSha/topologyRef`；D02源语义/修订 | 实例或拓扑版本不一致→STALE，Renderer meshIndex不是几何真值 |
| `CaptureVisibilityRef` | `cameraSha/membersSha/filterPolicy/clipEpoch`，仅显示层拥有临时Screen坐标 | 相机/成员缺失为UNKNOWN，切换Show/NoShow不写FrozenPmiPackage |
| `PmiCommitEvidence` | `expectedRev/currentRev/ACL/cancelFence/actor/requestId/scopeEpoch/receipt`，03域Owner提交 | CAS、撤权、取消晚回执失败则拒绝，不从Preview提升为Approved |
| `PmiSemanticQualification` | `semantic/graphic_only/unknown`、Datum/StandardProfile、审批修订 | DISPLAY成功不是语义可供制造；设计Datum≠D04 Setup≠D10实装坐标系 |

不同种类的Z规则只能作为具有明确厂商版本的Profile而非万能算法；合成`1e-9`零判断阈值只是数学单元测试，真实Kernel容差应有独立证据。SectionCut UI的剖面不改变任何Solid，不是D07材料去除。

## 4. GUI/CLI/Agent、迁移与独立验收

- 已有左侧`UnifiedTaskPanel`的PMI第3页增加ViewKind、Plane/Frame/SourceHash及Capture列表；3D用**唯一Babylon Engine/Scene/Canvas**透明切面网格与只读标注。GUI/CLI/Agent全部从`PmiOwnerPort`提出并提交同域事务；浅/深色，字体≤12px，不开右Drawer或双3D。
- 所有旧工程缺`viewKind`或Profile的记录只读标记`LEGACY_VIEW_UNKNOWN`，Shadow Reader对照旧/新、允许版本回退而不改冻结来源；源CAD变更/Plane删除/Clip参数变化使绑定视图候选失效，Capture临时可见状态不改变D02真值。A/B不得互相覆盖冻结。
- D04工艺Setup与D10执行绑定分开；中立D09 CL→D12后处理→D13解释→D14轴时序→D15独立NC验证→D16发布。未知语义UNKNOWN，CL动画/视图剖切都不能冒充机床安全或材料扫掠。

[10规则40字段](../../../research/traces/CAP-03-04-section-view-b174-v08.json)→[10正40个严格单字段负例及10状态Golden](section-view-b174-fixtures-v08.json)→[只读Node入口](../../../tools/check_cap0304_section_view_b174_v08.cjs)→[层级记录](../../../tracking/cap0304-section-view-b174-verification-2026-11-05.json)。Golden分别覆盖SectionCut非零Z、无相交、Section正Z、Projection允许正Z、缺Camera、graphic-only、旧Source和未知Kind。

真实产品验收入口拟定`T5-02::section-view-pmi-cross-capture-roundtrip`：用有合法许可的Creo/CATIA模型及AP242子集，构造至少两装配实例和3类View；03域Owner提交后独立质量/工艺消费者读回固定PMI hash、Frame、Camera/成员、Visibility前后以及源变化后的STALE。**本轮未运行独立Node完整文件进程，也未运行CATIA/Creo/STEP/OCCT或17实际消费者，正式Owner签署0/17、L3待评审、全仓GFM AST和历史原始附件未闭合。规划PASS≠产品PASS。**
