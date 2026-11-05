# B169｜CAP-03-05 周期面接缝与制造特征边界补证（2026-11-05）

> NEWLY_AUTHORED；原11域/88 CAP/36原编号工作包/17资产保持不变，L1/L2不变，L3待审。关联原工作包F1-03、F1-04、W2-03、T5-02。规划PASS≠产品PASS。

## 问题、反例与判定边界

对OCCT周期曲面，参数图上U=0和U=2π可能对应相同的三维位置。Face上同一拓扑Edge可有两条pcurve作为缝的两个参数边；**不能把两条pcurve当两条实体槽壁，也不能凭UV接缝把闭合圆柱壁识别成真实开槽/去料边界**。反过来，真实开口柱面可能同时具有接缝，不能把`IsSeam`一概当成“不存在物理边界”的证据。需要独立检查实际修剪区域、材料侧、相邻Face和实体边界。

OCCT 8.0.1官方公开API指定章节已实读： [BRep_Tool::IsClosed / CurveOnSurface / Degenerated](https://occt3d.com/dev/doc/refman/html/class_b_rep___tool.html)、[ShapeAnalysis_Edge::IsSeam](https://occt3d.com/dev/doc/refman/html/class_shape_analysis___edge.html)、[BRepAdaptor_Surface::IsUPeriodic/UPeriod](https://occt3d.com/dev/doc/refman/html/class_b_rep_adaptor___surface.html)、[ShapeAnalysis_Wire::CheckSeam](https://occt3d.com/dev/doc/refman/html/class_shape_analysis___wire.html)、[BRepCheck_Analyzer](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html)。注意`CheckSeam`返回false也可能是“非seam或已正确”，不能作为单独有效性判据。Analyzer默认有限点检查与exact选项适用范围不同，BRep有效不代表可加工或NC安全。来源作者、版本、访问日、章节、深度与限制见[来源JSON](../../../research/sources/CAP-03-05-seam-periodic-b169.json)。未引用收费标准正文。

## 方案、Owner、端口与失效行为

1. **D01固定输入**：03域设计Owner提供`projectId/modelDefinitionRef/occurrencePath/designRevision/rawSourceHash/FrameRef/UnitRef/faceRef/edgeRef/occtVersion`。固定Face上下文查同Edge的两条pcurve、方向与周期，区分`IsSeam`与`Degenerated`，缺证据记`unknown`，不得凭Edge索引跨STEP重导入绑定。
2. **周期距离只是必要筛查**：当已实测对应参数方向和正周期`p`时，`r=((u1-u2)%p+p)%p`、`d=min(r,p-r)`。柱面U=0/2π的数值Golden仅为示例；对非周期、单位未知、跨V不连续、3D曲线不一致或修剪失效，返回`unknown`。实际几何误差与容差仍由OCCT独立检查；不得硬编码所有周期为2π。
3. **D02权威边界**：06域FeatureProvider只能提出`candidateRef/seamOnFaceRef/pcurveRefs/physicalBoundaryEvidence/diagnostics`；03域FeatureService以`expectedD02Revision/exactD01Hash/occurrenceFrame/actorPolicy/requestId/scopeEpoch/cancelFence`在提交点执行CAS、ACL及取消重验，返回真实receipt。参数缝单独只能是`SEAM_ONLY`候选，`physicalCutBoundary=not_proven`；实体槽需要独立材料/拓扑正证。D05/D06/D07独立消费者应复核，不能从识别置信度直接批准D08。
4. **同域交互**：GUI左统一TaskPanel展示“周期缝”“实体开口待证”“未知”，唯一Babylon 3D高亮对应Face/Edge，预览不写D02；CLI/Agent调用相同03域Owner Port，工具自述不授写权限。
5. **生命周期**：重导入面号重排、Topo split/merge、算法版次/OCCT升级、Frame/单位变更进入`STALE_REVIEW_REQUIRED`，旧冻结D08不可覆盖。用新Revision重基与人工审核，失败隔离新投影、保留旧reader/资产与回退点。取消晚回执只可存历史，不得采纳当前Scope。A/B共享精确事实但不覆盖冻结。
6. **工程隔离**：D04工艺Setup不等于D10机床执行配置；D09中立CL可动画预览，但D12最终NC必须经过D13解释、D14轴时序、D15独立验证、D16发布。D13未知语义必须`unknown`阻断D15/D16。**不做材料扫掠仿真。**

## 机器可检正反验收与真实测试入口

[9规则36字段追踪](../../../research/traces/CAP-03-05-seam-periodic-b169-v08.json) → [9正/36严格单字段反例/8周期数值Golden](seam-periodic-b169-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap0305_seam_periodic_b169_v08.cjs) → [核验等级](../../../tracking/cap0305-seam-periodic-b169-verification-2026-11-05.json)。负例涵盖周期错误、Seam误判槽、退化与Wire错证、旧D01 Hash或Frame、第二Babylon、CLI旁路Owner、过期CAS/ACL/取消晚回执、把CL冒充NC工程验收。合成正确仅产出`REVIEW_ONLY`，不产生生产认证。

执行入口：`node tools/check_cap0305_seam_periodic_b169_v08.cjs`。后续需真实OCCT B-Rep构建圆柱缝、真实开口/退化极点、反向Wire、pcurve破损、几何重导入；真实D02 Owner并发提交与独立D05/D06/D07消费者；GUI/CLI/Agent和离线回放。当前独立Node完整文件、OCCT/产品/NC/B5/OEM均`NOT_RUN`；17资产Owner正式签署0/17、独立消费者0/17，L3、历史原始附件与全仓GFM AST尚未闭合。**规划PASS≠产品PASS。**
