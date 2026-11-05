# B124｜CAP-09-05 连续区间漏采样与CCD资格（2026-11-03）

**增量研究补证；原R01–R10及F1-02/E3-04/E3-05/U4-04编号不变，L3待人工审批。** 不做材料扫掠仿真。本报告只约束D11中立CL运动预检查证据，不产生D15的NC工程验证结论。

## 核心数学反例与工艺价值

一维解析合成：半径\(r=0.25\,mm\)的球心\(x(t)=-2+4t\)，静止障碍点位于0，\(t\in[0,1]\)。signed clearance \(d(t)=|x(t)|-0.25\)。端点\(d(0)=d(1)=1.75\,mm\)，中点\(d(0.5)=-0.25\,mm\)；实际接触区间\([0.4375,0.5625]\)。**仅端点均安全并不能证明中途无碰**。这是一维解释反例，不是FCL输出/真实刀柄几何。

对**本合成标量路径**，可证明\(|d'(t)|\le4\,mm\)（分段导数，尖点按Lipschitz），端点采样的最大无观测参数距离0.5，误差上界为2 mm，大于端点1.75mm余量，因此不能凭两端放行。实际五轴需结合回转速度、全连杆运动、真实Frame、刀柄/夹具全体几何、插值算法给出有效上界，不能移植此示例常数。

## 2026-11-03官方与合法来源核对

| ID | 作者/版本/访问位置 | 实际阅读深度和局限 |
|---|---|---|
| B124-S01 | [Flexible Collision Library README](https://github.com/flexible-collision-library/fcl/blob/master/README.md)；FCL contributors；master rolling; exact SHA unpinned；undated rolling；README Introduction / Continuous collision | Read public README CCD vs static, initial object and goal transform。**局限**：Interpolated transform does not prove actual machine NC axis motion |
| B124-S02 | [FCL 0.7.0 README Debian](https://sources.debian.org/src/fcl/0.7.0-3.1/README.md)；FCL contributors / Debian archive；0.7.0-3.1；release date not verified；Interfaces / Continuous collision | Read versioned public README for continuousCollide request arguments。**局限**：Packaging docs not measured library accuracy or OEM proof |
| B124-S03 | [BRepExtrema_DistShapeShape](https://occt3d.com/dev/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html)；Open Cascade；OCCT 8.0.1；API page undated；Detailed Description; IsDone; Value | Read public OCCT API for minimum distance of static shapes。**局限**：Static minimum distance is not motion-interval clearance certificate |
| B124-S04 | [Developer Concepts: Collision Detection](https://moveit.ai/documentation/concepts/developer_concepts/)；MoveIt maintainers；master rolling；undated rolling；Collision Detection / FCL / Bullet | Read public master HTML describing collision environments; Bullet discrete/continuous。**局限**：MoveIt is not B5 machine, CNC controller or independent D15 proof |
| B124-S05 | [Performance Metrics of Speed and Separation Monitoring in Shared Workspaces](https://www.nist.gov/publications/performance-metrics-speed-and-separation-monitoring-shared-workspaces)；Jeremy A. Marvel；IEEE T-ASE 10(2) / NIST entry；2013-04-01；NIST publication metadata and abstract | Read only official abstract, separation and sensor uncertainty in industrial robot workspace。**局限**：PDF full paper not read; no unverified formulas or safety limits attributed |
| B124-S06 | [PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/)；Timothy Lebo; Satya Sahoo; Deborah McGuinness (editors), W3C；W3C Recommendation；2013-04-30；§2 / §3.1 / §3.2 | Read public document and provenance Entity, Activity, derivation, invalidation terms。**局限**：W3C does not prescribe Procet collision sampling, NC certification or CAS |
| B124-S07 | [Procet CAP-09-05 existing specification](https://github.com/BaiSongt/procet-devplans/blob/9ac4369fa00b286584615bff0f075eca1d485bc9/docs/capabilities/CAP-09-05/README.md)；BaiSongt/procet-devplans；exact Blob 14e60fcc118ee06a15e8a87c2219ab8a25c5f860；2026-10-27 original draft；Original R01–R10; D11/D15 boundary | Read full exact Github file on the planning branch。**局限**：Internal CAS/ACL/GUI rules not inferred from external papers |

FCL README区分静态碰撞、距离和连续碰撞，但**CCD引擎假定的运动插值不是具体数控控制器的真实时序**；OCCT 8.0.1 `BRepExtrema_DistShapeShape`计算的是静态形状距离。NIST 2013文章仅官方摘要，没有声称读了论文正文。W3C PROV-O定义来源术语，不定义安全或CAS算法。7条登记并非7篇独立出版物。

## 规则、字段与机器验收

[7来源登记](../../../research/sources/CAP-09-05-continuous-coverage-b124.json) → [8规则及全部32字段反例](../../../research/traces/CAP-09-05-continuous-coverage-b124-v08.json) → [8正+32独立单字段负例+4解析Golden](continuous-coverage-b124-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap0905_continuous_coverage_b124_v08.cjs)。每规则关联原4个工作包、CAP-09-05/09-06、实际业务资产：

- **B124-R01** D09/D10/Frame/政策版本精确闭包；字段：`input.clSha`、`input.d10Sha`、`input.frameHash`、`input.policyHash`；资产：D09/D10/D11；正例B124-P01 / 反例B124-N01-1、B124-N01-2、B124-N01-3、B124-N01-4。
- **B124-R02** 机床、刀具刀柄、夹具与Frame共同覆盖；字段：`models.toolHolder`、`models.fixture`、`models.machine`、`models.sameFrame`；资产：D03/D04/D10/D11；正例B124-P02 / 反例B124-N02-1、B124-N02-2、B124-N02-3、B124-N02-4。
- **B124-R03** 时间/段参数与插值模型双侧锁定；字段：`motion.start`、`motion.end`、`motion.interpPinned`、`motion.dynamicFramePinned`；资产：D09/D10/D11；正例B124-P03 / 反例B124-N03-1、B124-N03-2、B124-N03-3、B124-N03-4。
- **B124-R04** 离散抽样误差界与区间认证资格分离；字段：`sampling.endpointsOnly`、`sampling.marginMm`、`sampling.errorBoundMm`、`sampling.claimCertified`；资产：D09/D11；正例B124-P04 / 反例B124-N04-1、B124-N04-2、B124-N04-3、B124-N04-4。
- **B124-R05** CCD引擎版本、运动类型、请求完整性与全检测对象；字段：`ccd.version`、`ccd.motionSupported`、`ccd.requestComplete`、`ccd.allObjects`；资产：D03/D10/D11；正例B124-P05 / 反例B124-N05-1、B124-N05-2、B124-N05-3、B124-N05-4。
- **B124-R06** 接触结果、首次接触时间与调用失败独立状态；字段：`result.collision`、`result.toi`、`result.methodSuccess`、`result.falseClearOnFail`；资产：D11/D15；正例B124-P06 / 反例B124-N06-1、B124-N06-2、B124-N06-3、B124-N06-4。
- **B124-R07** D11只属CL预检、不能冒充最终NC验证发布；字段：`gate.tag`、`gate.acknowledgeNoNcAxes`、`gate.noD15Promotion`、`gate.noD16Release`；资产：D11/D12/D13/D14/D15/D16；正例B124-P07 / 反例B124-N07-1、B124-N07-2、B124-N07-3、B124-N07-4。
- **B124-R08** 统一GUI/CLI/Agent和左Panel，重验CAS权限取消回执；字段：`guard.samePort`、`guard.uiTopology`、`guard.aclCasCurrent`、`guard.cancelled`；资产：D01/D09/D11；正例B124-P08 / 反例B124-N08-1、B124-N08-2、B124-N08-3、B124-N08-4。

**数据契约**：09域`ClMotionPrecheckPort.previewInterval(exactD09,exactD10,policy,modelHashes)`返回`segmentId, parameterRange, motionModelId, frameHash, objectSetHashes, samplingBound, ccdMethodVersion, toiOrUnknown, status, derivedFrom`。即便CCD在某种插值假设下返回未碰，输出也只能`CL_ONLY_PRECHECK`；`UNKNOWN`不能升级。D03机床资源、D04名义Setup、D10实际安装/控制器绑定分别精确revision/hash/frame；D08 A/B冻结不覆盖。

**严格工程链**：D09中立CL → D11预检提示 → D12最终NC后处理 → D13控制器语义 → D14物理轴时序 → D15独立NC验证 → D16人工发布，未建模语义保留UNKNOWN，不能根据流畅CL动画或离散端点将D15/D16标PASS。C0只保留identity、unit、frame、hash、revision、scope和protocol。GUI/CLI/Agent走09域同一Owner Port，唯一Babylon Engine/Scene/Canvas，左侧统一TaskPanel（浅/深、字体不超过12px），以虚线区间标示`UNKNOWN_INTERVAL`，不出现误导性“绿色安全认证”。

**提交/失效/迁移**：提交前重验ACL、CAS、scopeEpoch、taskGeneration和取消；取消晚回执必须丢弃。D03/D04/D08/D09/D10、插值假设、模型Hash或算法容差发生变化就对依赖闭包的D11标STALE，保持D08及D16旧冻结历史。新旧Reader做Shadow比对与可逆回退，不覆盖原始NC或旧资产；由09域以外独立消费者对真实D09、D10、刀柄/夹具、控制器和D13–D15结果验收。

**实际测试边界**：本轮执行同判定函数40个合成正反、4个解析Golden；独立Node文件进程、真实FCL/OCCT/NC、B5/OEM、17资产Owner会签及17真实独立消费者都是NOT_RUN。L3、历史附件原字节、全仓GFM AST均未闭。**规划PASS≠产品PASS。**
