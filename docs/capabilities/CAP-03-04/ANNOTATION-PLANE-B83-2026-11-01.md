# CAP-03-04｜B83 三维PMI标注平面、放置面与Saved View分离设计

> 2026-11-01 · V0.8增量研究 · NEWLY_AUTHORED，不是历史缺失字节的恢复；L1/L2、11域88 CAP、36原编号工作包、17类资产不变；L3待人审。**规划PASS≠产品PASS。**

## 1. 本轮实质结论与权威来源阅读层级

当前三维尺寸/GD&T容易出现「所有标注在任意三维方向自由悬浮、重叠、切换视角不受约束」的问题。应严格拆分标注**语义锚定、方向平面、放置位置、Saved View/Capture、屏幕碰撞布局**这五套对象，不能把一张Datum平面、一个摄像机角度和一条PMI记录混为一体。

PTC Creo Parametric R12 [About Annotation Plane](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/about_annotation_plane.html) 明确：Annotation Plane规定标注相对于模型的朝向，标注真实位置可在平行于该Plane的虚拟平面上，由第一个几何附件定位。[About Annotation Orientation](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/about_annotation_orientation.html) 还区分下一条标注使用的Active Orientation与既有标注的Current Orientation，参考的datum/view消失后冻结已有方向。这是厂商交互事实，不是所有CAD或ISO的统一算法。

PTC R12 [按平面定义标注方向](https://support.ptc.com/help/creo/creo_pma/r12/usascii/model-based_definition/to_define_annotation_orient_by_plane.html) 提供参考平面、Flip、文字旋转、冻结、是否放在参考平面等模式。[Creo Toolkit Annotation Orientation](https://support.ptc.com/help/creo_toolkit/otk_cpp_pma/r12/usascii/creo_toolkit/user_guide/Annotation_Orientation.html) 的REFERENCE、NAMED_VIEW、FLAT_TO_SCREEN是Creo枚举，Procet只能参考建模，不得冒称已有同名API。Creo 12.4.4.0的[默认标注平面](https://support.ptc.com/help/creo/creo_pma/r12/usascii/whats_new_pma/mbd_default_annotation_plane.html)仅影响新标注初始偏好，不应覆盖已有标注身份。

[CAx-IF PMI Recommended Practices v4.0.8](https://www.mbx-if.org/home/wp-content/uploads/2024/06/rec_pracs_pmi_v408.pdf)（Jochen Boy等，2020-09-04，**Status: for Review**）§9.4.2公开正文将Saved View拆成显示的对象集合（draughting_model）与从哪里观看（camera_model）；Annex D的**印刷p.143/PDF第154页**公开正文+页图显示，CATIA V5/V6每条PMI属于一个View/Annotation Plane，却可属于0至多个Capture，Capture可固定成员、相机与剖切。仅由Plane法向猜测相机，无法保证原始变焦与视点；CATIA→STEP→CATIA往返后Plane数量可能不同，Capture的显示集合和方向仍是更合理的核验对象。Creo用View+Layer组合Combined State，不能一对一照搬CATIA命名。

[ISO 16792:2021](https://www.iso.org/standard/73871.html)（ISO/TC10，2021-04，Ed3）只阅读合法官方**目录、摘要、状态**：数字产品定义数据编制、修订和表现的范围；ISO/DIS 16792是待发布草案。没有读取付费正文，不宣称上述平面/Capture Schema是ISO的强制条款。

[8项完整来源、作者、版次、访问日、章节、阅读深度、限制](../../../research/sources/CAP-03-04-annotation-plane-b83.json)。本轮自有业务规则来自[固定原CAP-03-04设计规格](README.md)，不冒称源于外部标准。

## 2. 五套C1对象与权威字段（拟议端口，非产品接口实现）

| 对象 | exact字段/单位与Owner | 失效/兼容规则 |
|---|---|---|
| PmiSemanticRef | D01 exact sourceHash/designRevision/occurrence、topology entity、Datum/GD&T种类、标准解释Profile、PMI Owner | 显示隐藏不删语义，Graphic-only、未知modifier不授制造资格 |
| AnnotationPlaneRef | planeId/revision/hash、sourceFrameRef、origin mm、right/up/normal单位向量、textRotationDeg、mode、driven/frozen、referenceRef及状态 | Reference失效仅有冻结SnapshotHash可有限查看；不自动绑latest同名平面 |
| PmiPlacementRef | annotationId、planeRef、首附件TopologyRef、attachmentState、signedOffsetMm、文本二维位移、leaderAnchor、placementRevision | Plane提供朝向，位置由附件和偏移给出；屏幕避让不能修改原设计坐标 |
| PmiSavedViewRef | captureId/exactRev、cameraRef/方向/zoom、clip/section、geometry及PMI成员集合Hash、viewVisibilityPolicy | 仅有Plane或无相机时不是完整Saved View，状态UNKNOWN_CAMERA；一个Plane被多个Capture引用不导致对象复制 |
| PmiProjectionState | screenCSS位置、DPR、遮挡/重叠/背面诊断、layoutEpoch、scopeEpoch、theme；RendererPort临时只读 | 投影、拖动仅改变当前视图，不写D01/D02/PMI冻结包；文字最大12px，可独立放大命中区域 |

**与CAD设计基准的区分**：DatumFeature/DatumSystem是设计语义目标，AnnotationPlane是显示朝向，D04是工艺Setup，D10是实际机床绑定/WCS，D17是测量证据。不能通过把PMI平面命名A/B/C就自动生成WCS或测量基准认证。所有几何锚点必须包含实例路径、Frame、source SHA256、设计修订及可信TopologySnapshot；mesh pickIndex只作为Renderer临时命中线索。

**数学约束**：Plane右/上单位向量正交，法向等于right×up；表现点可写为P=P0+u·right+v·up+d·normal。法向/Flip改变时须同步检查文字阅读方向与坐标手性。合成fixture中的正交误差门槛1e-6仅供机器可复算单元样例，实际几何精度/重建阈值由有出处的kernel tolerance/profile确定，绝不可冒称工业通用公差。

## 3. 单一Babylon/统一左TaskPanel的详细操作协议

1. **标注管理 → 标注平面**（ActivityRail沿用原PMI入口）在唯一UnifiedTaskPanel显示当前Plane、来源D01 revision、可用Front/Top/Side/Datum/PlanarFace/NamedView、已绑定PMI数、失效引用数；中部仅**一个Babylon Engine/Scene/Canvas**，资源世界以横向切换替代双3D并排。浅色/深色主题，标签字体上限12px。
2. 点击“新建平面”进入临时草案；左Panel可编辑模式REFERENCE/NAMED_VIEW及只读屏幕Note模式、origin、textRotation、Flip、Driven/Frozen、reference；3D绿色透明网格、normal/up/right箭头仅为显示投影。默认取当前视图可以生成临时草案，但不能凭镜头生成已批准Datum。
3. 在Plane列表中点击某一条PMI显示其源Topo附件与首Attachment、平行位移、文字局部布局、指向箭头；对于圆柱/球面或多个面，只能在该PMI类型、解释Profile、几何引用满足条件时提供“建议标注平面”，不强制贴到该面所在几何曲面。
4. “自动整理”只对**当前Capture的屏幕投影**执行避让与分组；相互遮挡分别显示COLLISION、OCCLUDED、BACK_FACING及unknown。选择/hover/拖动不改变FrozenPmiPackage、源Plane方向或D02制造意图；用户可以在左Panel对比原始放置、恢复布局。
5. “保存Capture”单独固定相机姿态/zoom、clip、可见几何与标注成员集合及关联Plane hash，一个Plane可被多个Capture复用。仅保存Plane不得将它假装为完整AP242 Saved View；目标交换能力不明时保留UNKNOWN与导出降级说明。
6. 用户确认方向/归属修改后经03域PMI Owner同一有界命令（GUI/CLI/Agent共享）携带project/doc、exactSourceHash、designRev、occurrence、frameRef、expectedPmiRev、planeRev/hash、actor/policy、requestId、scopeEpoch；**Host真实提交点**重验ACL、CAS、引用证据闭包及cancel generation；收到真实commit receipt后更新显示。超时先按requestId查回执、取消晚回执只能归档旧工程。
7. A/B同一工程事实，A中已冻结PMI不受B模式中的建议布局覆盖；旧PMI导入缺Plane时迁移为legacy_unspecified_plane并保持可读和回退，禁止假造默认Front已正式绑定。拓扑分裂/实例变位/来源更新要求受影响PMI重审，不原地改旧冻结对象。

## 4. 新规则、独立正反验收与边界

[8条来源→规则→字段→CAP-03-04/原包→37项显式正反预期](../../../research/traces/CAP-03-04-annotation-plane-b83-v08.json) → [合成fixture](annotation-plane-b83-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0304_annotation_plane_b83_v08.cjs) → [实测分级](../../../tracking/cap0304-annotation-plane-b83-verification-2026-11-01.json)。代表性反例为：装配Occurrence漂移、文本朝向法向镜像、非正交/零向量、Driven引用丢失、Frozen来源Hash缺失、附件/Plane错配、Capture相机/显示成员缺失、Graphic-only冒充Semantic、未知GDT修饰符、screen note被用作语义GD&T、双Scene与右Drawer、ACL撤回、CAS竞争、Cancel与晚回执错工程。

判定QUALIFIED_DRAFT只表示**有限内部合成草案规则**满足，不能代表实际CATIA、Creo、AP242互操作、ISO/GPS解释、D15安全验证或D16 NC发布。

需要独立消费者实验：T5-02::pmi-annotation-plane-view-roundtrip。用许可合规的带两装配实例、三个不同Datum/GD&T、两个Capture交叉引用同一Plane的样例，固定STEP原字节/Reader/OCCT版本；D01/03域Owner实际提交后，由独立质量/工艺消费者重新读取PMI实体ID、方向/附件、Capture成员、camera/visibilityHash与独立渲染截图，并测试拓扑分裂、缺Camera、仅Graphic、导入损失分母及回退。CATIA→STEP→CATIA、Creo→AP242→Creo只测试有实物与合法许可的可支持子集，错误或未支持返回UNKNOWN。

**执行等级**：本轮只有V8中相同judge函数对37个显式合成预期的核对；独立Node完整文件、真实OCCT/STEP、CATIA/Creo、Babylon/Electron、Owner写事务与17资产独立消费者**NOT_RUN**。正式Owner签署0/17、真实消费者0/17、L3待审；历史原附件原字节与全仓Markdown GFM AST/渲染对等仍未完成。**规划PASS≠产品PASS。**
