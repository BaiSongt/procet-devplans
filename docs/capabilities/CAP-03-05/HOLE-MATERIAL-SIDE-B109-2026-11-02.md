# CAP-03-05｜B109 圆柱表面≠孔：材料侧、轴向通断与多Solid反例

> 2026-11-02，新增研究补证，不改变原11域88CAP、36原编号工作包、17业务资产分母。**L3待审；规划合成与真实制造能力严格分开。** 原B31装配Face补证已存在，本轮新增的是“圆柱面/内部Void/盲通孔证据”而非重复旧主题。

## 业务问题与反例

如果算法看到圆柱面就判定为孔，会把圆柱凸台、环形槽、封底盲孔、两个不连通同轴孔甚至另一Solid上的柱面错误归类。单一圆柱面的数学半径和轴线不能推出加工去除区域、材料侧、轴向双端连通性。**“BRepCheck IsValid=true”不等于“制造孔分类真实正确”**；“SolidClassifier某个点为OUT”也不能证明整条轴向路径畅通。

强制将证据分成：D01 exact源（revision、source字节hash、occurrence、selectedSolidRef、Frame、单位、算法版本）；OCCT曲面类型/圆柱半径；关联边→面邻接与方向；明确的Solid局部材料侧分类（Tol、采样点、IN/OUT/ON/UNKNOWN）；轴向连续墙面及一端/两端真实出入口和终止底面；识别Run→D02确认流程。

例A：圆柱墙面+两端真实开口、连续通道、材料侧VOID、形体完整 → `THROUGH` **仅候选**。例B：一端开口+另一端真实底面 → `BLIND` **仅候选**。例C：相同圆柱半径但轴内为实体 `IN` → 拒绝“孔”判读。例D：两段同轴墙面之间有隔墙 → 没有连续证据时 `UNKNOWN`，不能靠轴与直径相同合并。例E：不同Solid/装配实例上的同轴圆面 → 不跨Solid自动合并。

## 证据来源与读取深度

- OCCT 8.0.1 [BRepAdaptor_Surface](https://occt3d.com/dev/doc/refman/html/class_b_rep_adaptor___surface.html) 已读取 `Face`、`Tolerance`、继承 `GetType`、`Cylinder` API，证明可读取解析曲面，不证明制造孔语义。
- OCCT 8.0.1 [TopExp](https://occt3d.com/dev/doc/refman/html/class_top_exp.html) 已读 `MapShapesAndAncestors` 与 `cumOri/cumLoc`，邻接map调用前不自动清空；局部Face索引不得跨源作为永久ID。
- OCCT 8.0.1 [SolidClassifier](https://occt3d.com/dev/doc/refman/html/class_b_rep_class3d___solid_classifier.html) 已读 `Perform(P,Tol)`、`State`、`IsOnAFace`，其点分类局部性必须保留；点级结果不等于路径连通。
- OCCT 8.0.1 [BRepCheck_Analyzer](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html) 已读 `IsValid`、`GeomControls`、`SetExactMethod`，有限采样方法和ExactMethod限制不能略去。
- [ISO 14649-10:2004](https://www.iso.org/standard/40895.html) Edition 2 2004-12，经ISO官网2024复审仍现行；**只读合法官方目录/摘要，未读收费正文**。公开摘要区分feature catalogue和执行workingstep，本轮不宣称标准规定识别阈值。
- [NISTIR 7098](https://www.nist.gov/publications/feature-based-inspection-and-control-system)，Kramer、Horst、Huang、Messina、Proctor、Scott，2004-03-08；**只读官方摘要/出版元数据**，不能外推出Procet产品已验证。
- 内生来源为[本CAP固定原稿](https://github.com/BaiSongt/procet-devplans/blob/7c10b3e06b3967f6b4d198354198bc6622d44fde/docs/capabilities/CAP-03-05/README.md)，原Blob `354359232cad398eabcc104c1768a4f595b6219c`，具体L3 Owner、UI、CAS和业务限制不是上述外部标准条文。

对应完整可机器追踪元数据：[7条分层来源](../../../research/sources/CAP-03-05-hole-material-b109.json) → [8规则与字段/原编号工作包](../../../research/traces/CAP-03-05-hole-material-b109-v08.json) → [36例显式正反/STALE/UNKNOWN](hole-material-b109-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0305_hole_material_b109_v08.cjs) → [执行等级](../../../tracking/cap0305-hole-material-b109-verification-2026-11-02.json)。

## 领域数据Owner与交互、执行边界

D01源几何和装配Occurrence属于03域输入；06域Feature Provider可产生 `geometryEvidenceRun` 与D02候选，但**03域D02 Owner**才可采纳，且需由人类审核与政策单独确认。消费链D02→D05/D06→D08冻结，D04 Setup不同于D10真实机床绑定。无D10并不阻止孔的纯几何探索；也不能将候选当作已批准加工、D09 CL、D12 NC或D13→D14→D15→D16工程验证。**不做材料扫掠仿真。**

拟议D02候选字段（非现有API声明）：`d01ExactRevision`、`sourceArtifactHash`、`occurrenceRef`、`selectedSolidRef`、`frameRef`、`unitRef`、`occtVersion`、`topologyEvidenceRef`、`cylindricalWallFaceRefs`、`surfaceType`、`radiusMm`、`adjacencyEvidence`、`materialSideProbeRecords[]`、`classifierToleranceMm`、`axisConnectivityEvidence`、`entrance/terminationFaceRefs`、`candidateStatus`、`runProfileHash`、`ownerReceipt`。应保存判定依据引用，而不是用本轮合成JSON替代真实几何证据。样例中的采样位置和阈值是待审算法方案，**不是ISO数值要求**。

GUI工作台始终一个Babylon Engine/Scene/Canvas，左侧统一TaskPanel显示圆柱/端部/材料侧证据高亮及UNKNOWN缺口；CLI/Agent复用03域统一Query/Propose/Adopt命令，不另建Agent写入通道。新候选视图不能修改历史冻结的D08或A/B共享已批准工艺。D02提交点重新验证Actor权限、Exact Revision/Hash/Frame、CAS与ScopeEpoch；取消后的晚回执只能按原requestId查询并归档，不能将旧工程响应回贴当前项目。

## 规划验收与独立产品验收

本轮只针对**合成证据包**提供4条通过候选、17条明确拒绝、10条UNKNOWN、5条STALE；结果只表示这些条件谓词在设计上自洽，**没有运行OCCT、没有真实STEP、没有独立消费者或真实NC验证**。专项真实Golden必须包括：圆柱凸台、通孔、盲孔、同轴隔墙双孔、环槽与岛、多个Solid、相同Definition双Occurrence、重采样mesh、不同OCCT版本/容差。每例锁定源STEP合法字节Hash、Native版本、算法配置、Frame、原始face refs、真实点采样与Owner签收；由与06域检测器不同实现的03域消费者和05域工艺独立检查。

真实测试入口待定：`cargo test --locked ...` 只能在实际产品锁定工作树核对后补写，不凭规划造接口。Node离线运行入口 `node tools/check_cap0305_hole_material_b109_v08.cjs` 是**只读规划校验**，不访问任何产品源码/用户数据库，也不能授予产品PASS。旧面索引/旧候选迁移仅生成受管旧读兼容与映射审计，不能原地覆盖已有Approved。完整风险为：伪通孔→工艺穿底、误将凸台去料、跨Solid误归、采样不充分、独立消费者未验、L3待审批。
