# B77｜CAP-01-07 三维尺寸HUD的CSS像素、可见性和交互资格

**2026-11-01，新编研究补证，沿用11域88 CAP、36原工作包与原十规则/20验收；不改L1/L2，L3待人类评审。** 本轮专门补足 [B50三维尺寸驱动语义](DIMENSION-EDIT-B50-2026-10-31.md) **未解决的尺寸标签太小、高DPI错位、被遮挡误点和密集标签管理**问题。不声称产品仓已经实现。

[9份分级来源](../../../research/sources/CAP-01-07-hud-b77.json) → [8条字段级规则](../../../research/traces/CAP-01-07-hud-b77-v08.json) → [48项预期合成样例](hud-b77-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0107_hud_b77_v08.cjs) → [验收分级](../../../tracking/cap0107-hud-b77-verification-2026-11-01.json)。对应原U4-01/02/03/05/06与F1-02，及CAP-02-05/02-07资源参数场景。

## 1. 问题、数学反例及方案边界

几何尺寸真值在D01 CAD、D03资源定义或D04当前Setup的Owner数据，3D文本仅为Renderer派生。**12px字体上限是本产品内部硬约束，不能通过“将字体升到16px”修复；同时文字12px也不能意味着交互热区只有12×12px。**建议默认12 CSS px、可审候选范围10–12 CSS px；实际可读性在125%/150%系统缩放及不同DPR下必须验收。

已知Babylon输出的是当前Render Target的像素投影（前提：项目实际API输出坐标系已被锁定为左上原点、并适配Viewport偏移），当前canvas的`drawWidth/drawHeight`与`getBoundingClientRect()`返回CSS宽高分别取源，变换应写为：

`xCSS=rect.left+(xRender/drawWidth)*rect.width`，`yCSS=rect.top+(yRender/drawHeight)*rect.height`。

合成例：画布CSS位于(100,50)、尺寸800×600；render backing为1600×1200；投影点(800,600)映射为**(500,350) CSS px**。**不得再乘devicePixelRatio=2**，否则会把CSS坐标错算为(1000,700)或其他双倍偏移。render backing与DPR不要求严格相等，非整数DPR需以实际draw大小和DOMRect为准；缩放或画布尺寸变化时重新求位置。

投影后z超裁剪范围、遮挡证据未生成、WebGL上下文丢失、Viewport定义不确定，不得展示成“无遮挡可编辑尺寸”。深度采样、射线或几何可见性策略均是待版本核实的Renderer实现候选，**本轮没有实测深度精度或接受任意Babylon API必然返回该坐标定义**。

## 2. 显示/布局契约与责任划分

| 层与Owner | 关键字段 | 行为与失效 |
|---|---|---|
| D01/D03/D04领域Owner | projectId、assetId、revision、contentHash、geometryHash、sourceFrame/ref/hash、occurrencePath、dimensionKind、canonicalValueMm、parameterRef? | 只有有真实驱动参数的DRIVING才提供修改入口；MEASURED/REFERENCE_PMI只读，拓扑重绑不唯一是UNKNOWN |
| RendererPort（不写资产） | engine/scene/canvas计数、sceneEpoch、activeRoot、renderDimensions、canvasDOMRect、projectedPoint、occlusionEvidence | 仅一个Babylon Engine/Scene/Canvas；资源/工程会话切可见root、禁旧pick；CSS投影与UI layout epoch分开 |
| HUD Layer（显示状态） | cssPosition、fontCssPx、hitBoxCssPx、safeArea、collisionGroup、priority、status | 默认12px字体且不能超过12；命中区≥24×24 CSS px，完整数值可经键盘与左TaskPanel到达；让位不丢完整值 |
| Host/业务Port | actorFromSession、scopeEpoch、expectedRevision、CAS、ACL、PreviewLease、requestId、receipt | GUI/CLI/Agent共用领域Port；移动标签/输入仅造Preview；撤权、取消、晚回执阻断提交 |
| 下游与冻结 | D08/D16 frozenRef、D04/D10分离、D09/12/13/14/15/16状态 | 几何/资源变更只生成失效通知，不篡改冻结，也不借CL动画制造NC验证PASS |

候选状态：`CANDIDATE_ONLY`（具备显式尺寸编辑提案资格）；`DISPLAY_ONLY`（只读/遮挡/布局冲突/安全区回退）；`UNKNOWN`（来源、Frame、投影或可见性证据不足）；`STALE`（Owner或Scene/Scope世代变化、取消晚回执）；`REJECT`（越权、不合法UI/数据边界）。所有状态均**不表示领域写入完成**。

## 3. 布局、性能与可用性

- 每帧只对可见且当前scope精确的锚点候选进行投影；相机/模型/Canvas/布局epoch未变化时复用上轮位置（具体事件/性能测量后批准），避免为每个Face持久创建DOM标签。
- 用稳定`sourceExactRef+occurrence+dimensionId`排序；选中、正在编辑、当前任务可见优先，优先保留语义而非基于文本字母排序。密集区域采用屏幕网格/矩形碰撞裁减，隐藏项在左UnifiedTaskPanel显示全值及`被折叠`原因。
- 排除ActivityRail、Ribbon、左TaskPanel、对话框的动态安全区；镜头绕转时不得让尺寸标签落到可点击提交按钮之上。遮挡时不使用“永远置顶透明尺寸”伪装可见性；可由明确选择显示leader并注明透视/遮挡模式。
- 交互文本最大12px，与≥24×24px透明热区彼此独立；键盘焦点、只读解释、数值输入应通过同一左TaskPanel提供，无需拖拽就可完成。高DPI纹理清晰度与字体可读性是两种指标，不用提高贴图backing尺寸冒充CSS文本变大。
- **性能阈值待实际设备和业务Owner评审**：需要报告10/100/1000可见候选在旋转、DPR1/1.25/2、125%缩放、D01/D03大模型、10次空间切换后的frame p95、布局CPU、GPU纹理与DOM数量，不能凭合成JSON声明达到某帧率或通过WCAG。

## 4. 分阶段工程交接、迁移与独立验收

实施次序：U4-03新增`DimensionOverlayProjectionPort`（RenderViewport/Frame/SourceExact/SceneEpoch）只读适配；U4-05独立验证CSS坐标、可见性与键盘/触摸；U4-02把尺寸输入、冲突和错误放入唯一左TaskPanel；U4-06对GUI/CLI/Agent端口、取消栅栏、历史旧schema的READ_ONLY回退进行审计。不新建第二个Scene、右Drawer或独立尺寸数据Store。视觉功能可降级为纯左Panel列表，旧版已冻结资产不能被“显示修复”重写。

跨域**独立消费者验收尚未执行**：D03资源Owner在别的会话查询真实旧/新revision与B-Rep，D04 Setup Owner验证资源变更没有偷偷修改装夹坐标，D01/PMI Owner验证Face重新编号不自动采纳错误锚点，09域独立从最终D12 NC→D13语义→D14时序→D15验证判断，Renderer E2E分别在Browser/Windows DPI/缩放下测试。必须锁定实际产品HEAD、Babylon版本、Electron/Chromium版本与GPU驱动；场景包括后台返回、pointercancel、撤权、跨Setup与保存失败。无法验证则记录NOT_RUN，不写PASS。

## 5. 本轮公开依据及归属边界

- [MDN DPR](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)、[DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)与[WebGL高DPI建议](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)用于区分物理、backing与CSS坐标，**不是**Babylon当前项目版本投影API适配证明。
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)的2.5.8允许例外，本方案候选一律≥24×24 CSS px是更严格内部设计；≤12px字体仍属用户要求，不能称WCAG的最大字体要求。 [Pointer Events L3](https://www.w3.org/TR/pointerevents3/)只指导输入捕获/取消，与业务写入无关。
- [Babylon Transformations](https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms)与[OCCT 8.0.1 TopLoc_Location](https://occt3d.com/dev/doc/refman/html/class_top_loc___location.html)说明显示/几何局部参考与组合变换须显式处理；不说明实际D03参数化再生已实现。
- [原CAP](../batch01-v0.9.1/01_功能规格/CAP-01-07_工作台与3D交互.md)与[B50](DIMENSION-EDIT-B50-2026-10-31.md)提供Procet内生Owner、冻结和L3边界，不伪称外部标准约束。

## 6. 机器验收与不宣称范围

字段级规则见[追踪](../../../research/traces/CAP-01-07-hud-b77-v08.json)，48项显式预期合成（状态分类：CANDIDATE_ONLY=2、DISPLAY_ONLY=5、REJECT=25、UNKNOWN=8、STALE=8）见[fixture](hud-b77-fixtures-v08.json)。检查器把预期与同一个`judge`逻辑逐项核对，还校验来源ID和案例ID的完整性；**不构成独立实现、真实DOM/Babylon/OCCT渲染、实际热区尺寸、产品权限、NC或17资产消费者验收**。本轮研究优先建立可执行合同与阅读限制，后续再锁定项目HEAD后执行真实E2E与完整仓库AST审计。**规划PASS≠产品PASS。**
