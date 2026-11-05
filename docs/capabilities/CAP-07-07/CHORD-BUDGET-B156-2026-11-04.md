# CAP-07-07｜B156 弦高、Post线性化、控制器轨迹预算分层研究

日期：2026-11-04；新增规划证据，L3待审批；11域88 CAP、36原编号包、17资产及L1/L2不变。关联原F1-03 / E3-01 / U4-04。**规划PASS≠产品PASS**。

## 1. 新发现与技术边界

**中立CL几何弦高合格，不能推出后处理NC或实际控制器跟踪精度合格。**

- D09的曲线离散误差：OCCT 8.0.1 `GCPnts_QuasiUniformDeflection`使用参数中点等距离估计，其文档存在“may respect deflection”的限定；`UniformDeflection`强调C2曲线适用性。不能仅凭`IsDone`、`Deflection()`返回值授予连续区间严格误差上界，须保留算法版本与独立区间证明类型；未经证明的状态为`BOUND_UNKNOWN`。
- D12后处理再次线性化：Autodesk官方Post API列有`linearize(tolerance)`及`getNumberOfSegments(tolerance)`，意味着中立CL是否继续保留圆弧或被改写为G1，需要记录PostProfile exact revision/hash、NC原字节与原SegmentId到NC block的映射；API存在≠实际Post输出可信。
- D13/D14控制器运动：LinuxCNC 2.9公开G61/G61.1/G64 P/Q与Naive CAM说明。没有P值的G64不能默认为有已知跟随上界；Q可能导致段合并。此规则仅归于LinuxCNC，不能推广到Haas/Siemens/B5。最终NC重新解释、Joint展开和D15验证是三个独立证据层。

## 2. 数学Goldens，非机床公差

对半径`R>0`、总角`0<θ≤2π`的二维完整圆弧等角划分`n≥1`段，在相同平面、精确端点条件下：

`δ = R(1−cos(θ/(2n)))`。

若`0<ε<R`，最少`n=ceil(θ/[2 arccos(1−ε/R)])`（不替代数值鲁棒性审查）。取`R=10mm`、`θ=60°`、`ε=0.05mm`，至少6段，弦高约`0.0380530191mm`，若仅2段则约`0.3407417371mm`、应拒绝。该数学式不适用于任意NURBS全域、切削接触误差、刀具包络或实际五轴控制轨迹。

只有`geometry/Post/controller`三种偏差**分别已证明**针对同一物理TCP、同一有向Frame与相同距离范数的真实上界，才可由三角不等式保守使用`ε_total≤ε_geom+ε_post+ε_controller`。合成演示`0.05+0.03+0.02=0.10mm`，不是某OEM精度或任意产品允差；Frame不同、执行Profile或控制器未知则整个工程资格`UNKNOWN`。

## 3. 独立Owner、数据字段与交付

| 阶段 | 唯一业务Owner与精确输入 | 输出/失效 |
|---|---|---|
| D09 CAM | D01/D03/D04/D05/D07/D08 exact revision、hash、frame、scope；D08冻结不可变 | typed曲线、`sourceSegmentId`、`algorithmVersion`、`intervalWitness`、`boundStatus` |
| D12 Post | D09 exact + **D10实际执行绑定（不等于D04工艺Setup）** + PostProfile exact | NC字节、分段谱系、后处理独立误差状态；不覆盖D09 |
| D13/D14 | 对最终NC原字节重读，锁定DialectProfile/运动学双分支和单位 | G61/G64等模态，实际Axis/Joint时序证据；未知为UNKNOWN |
| D15/D16 | 独立验证/发布Owner | 未闭合的NC证据与合成数学不得晋级为D15或D16 PASS |

GUI、CLI、Agent同用`CAMDomainPort`，不从Renderer提交领域数据。唯一Babylon Engine/Scene/Canvas、统一左TaskPanel、字体最大12px、浅/深主题；3D可叠加显示三种不同误差证据，但必须标`D09_PREVIEW`、`NC_UNKNOWN`或实际D15资格。提交时Owner重新验证ACL/CAS、exact revision/hash/frame、scopeEpoch、taskGeneration、取消代次；取消晚回执拒绝。A/B同事实不覆盖冻结，失效传播按D09→D12→D13→D14→D15→D16独立链路，D04≠D10。

更换D09、PostProfile、D10、最终NC或D03机床FK，必须新增revision并将对应下游证据置STALE，保留旧D08冻结/CL/NC/发布物。Expand→Migrate→Contract需要旧Reader、新Reader与真实跨Owner独立消费者正反测试、人类审批；未知语义阻断D16。不删除用户库，不做材料扫掠仿真。

## 4. 来源、机器追踪与人类待办

[6来源/作者/版次/URL/访问章节深度](../../../research/sources/CAP-07-07-chord-budget-b156.json) → [8规则/32字段/原编号工作包](../../../research/traces/CAP-07-07-chord-budget-b156-v08.json) → [8正32独立单字段反+8数学Golden](chord-budget-b156-fixtures-v08.json) → [Node只读入口](../../../tools/check_cap0707_chord_budget_b156_v08.cjs) → [执行等级](../../../tracking/cap0707-chord-budget-b156-verification-2026-11-04.json)。

本轮实读OCCT8.0.1两个指定API正文、LinuxCNC2.9 G61/G64章节；Autodesk Post仅函数索引和签名；Jin等2015只公开摘要/结论摘录；内部CAP原固定Blob完整阅读。没有读论文全文、无实际厂家控制器证据，也不编造ISO条款。工程Owner签署0/17、真实独立消费者0/17、L3待人审、历史原附件审计与全仓GFM AST仍未完成；独立Node全文件/真实OCCT/Post/NC/B5/OEM均NOT_RUN。**规划PASS≠产品PASS**。
