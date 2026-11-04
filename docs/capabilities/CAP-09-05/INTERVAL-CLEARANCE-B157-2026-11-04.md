# B157｜CAP-09-05 CL离散测距与连续区间下界补证

2026-11-04；**NEWLY_AUTHORED**；不更改原11域88 CAP、36编号工作包、17资产、L1/L2、原十规则；L3待人审。**规划PASS≠产品PASS。**

## 新增问题与工程推导
B156负责D09弦高/D12后处理与控制器误差分层，B155负责机床双分支FK；本补证只解决**D11的CL碰撞预演中，两个离散安全姿态之间仍可能穿过薄夹具**。OCCT 8.0.1 `BRepExtrema_DistShapeShape`的`IsDone/Value`只说明给定两形体在一个状态下的最小距离；其`InnerSolution`、误差容限和布尔几何可靠性另行验算。实际连续碰撞算法没有被本轮实现或验证。

假设同Frame下固定障碍B、运动形体A(u)存在**独立证明的Hausdorff运动位移上界** `d_H(A(u),A(v)) ≤ L|u-v|`，且每段参数上任一点距离最近取样参数不超过`δ`，那么由距离函数的1-Lipschitz性质，`dist(A(u),B) ≥ min_i(d_i−ε_i)−Lδ`。这是本轮基于三角不等式的**内生工程推导**，不是外部文献中直接给定的B5认证方法；若L、δ、几何误差ε、Frame、轨迹参数化任何一项未知则`UNKNOWN`，不能把未知量设为0。

合成演示（**非实机公差**）：`min(d_i)=0.50mm`、`L=0.20mm/param`、`δ=0.50param`，下界`0.40mm`。模型误差`0.02mm`、数值误差`0.01mm`、自定余量`0.30mm`时仅在此假设场景满足`0.40≥0.33`；若测得`0.10mm`则下界为0，不能通过。对包含旋转的刚体保守位移上界应满足`L≥v_max+ω_max r_max`，其中r必须包括刀具、刀柄以及相关移动机床件到旋转轴中心的最大半径，且共同度量、Frame、姿态分支和单位受控。未覆盖两个移动形体的相对运动、材料去除或未知连续控制器模式时保持UNKNOWN。

## 来源清单、实读深度和适用限制
| 来源 | 作者/版本/时间 | 公开访问章节与局限 |
|---|---|---|
| B157-S01 [BRepExtrema_DistShapeShape](https://occt3d.com/dev/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html) | Open CASCADE Technology / OCCT3D; OCCT 8.0.1; 8.0.1 API页面无单独发布日期 | 2026-11-04官方公开HTML指定API正文实读，Public Member Functions：Perform、IsDone、Value、InnerSolution、deflection；仅形体在该姿态的距离，非连续碰撞认证 |
| B157-S02 [Fast Continuous Collision Detection between Rigid Bodies](https://onlinelibrary.wiley.com/doi/abs/10.1111/1467-8659.t01-1-00587) | Stéphane Redon; Abderrahmane Kheddar; Sabine Coquillart; Computer Graphics Forum 21(3), DOI 10.1111/1467-8659.t01-1-00587; 2003-05-06 | 2026-11-04出版社摘要实读，Abstract；未读全文，不能宣称复现、证明算法或B5适配 |
| B157-S03 [Continuous collision detection for articulated models using Taylor models and temporal culling](https://pure.ewha.ac.kr/en/publications/continuous-collision-detection-for-articulated-models-using-taylo-2/) | Xinyu Zhang; Stephane Redon; Minkyoung Lee; Young J. Kim; SIGGRAPH 2007, DOI 10.1145/1275808.1276396; 2007 | 2026-11-04高校公开摘要实读，高校机构书目和Abstract；仅摘要，未读完整证明，不把摘要性能映射为产品性能 |
| B157-S04 [A Differentiable Signed Distance Representation for Continuous Collision Avoidance in Optimization-Based Motion Planning](https://arxiv.org/abs/2302.09704) | James Guthrie; arXiv:2302.09704 v1; 2023-02-20 | 2026-11-04公开HTML摘要及引言实读，Abstract、Introduction §I；未审阅全部证明，文中凸形优化条件不直接等同一般机床B-Rep运动 |
| B157-S05 [Test code for machine tools — Part 1](https://www.sis.se/en/produkter/manufacturing-engineering/machine-tools/general/iso23012012/) | ISO; Swedish Institute for Standards (SIS); ISO 230-1:2012 Ed.3; 2012-02-24 | 2026-11-04合法目录/公开摘要阅读，官方销售目录名称/版本/范围；未获得付费标准正文，不声称任何具体条款或机床认证 |
| B157-S06 [CAP-09-05 原业务规格及原十规则](https://github.com/BaiSongt/procet-devplans/blob/c2d3d759dec260bdebb6b8c5ec329c3b2fea8b93/docs/capabilities/CAP-09-05/README.md) | Procet V0.8规划编制组; 固定规划HEAD c2d3d759dec260bdebb6b8c5ec329c3b2fea8b93; 原稿时间未独立核实 | 2026-11-04 GitHub固定HEAD读取业务规格，原业务规格、D11、D13–D16职责/GUI/CAS/迁移；本项目内生要求，不是外部标准，产品/Owner/消费者均未验 |

## 源→规则→字段→CAP/原包→正反验收
| 规则 | 来源 | 四字段 | 验收 |
|---|---|---|---|
| B157-R01 D09/夹具/Frame/Profile精确身份 | B157-S06 | `d09Hash`、`fixtureHash`、`frameExact`、`profileHash` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R01-P / -N1..N4（单字段反例） |
| B157-R02 OCCT单姿态形体测距资格 | B157-S01 | `occtIsDone`、`occtDistanceMm`、`occtDeflectionMm`、`closedGeometryQualified` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R02-P / -N1..N4（单字段反例） |
| B157-R03 连续参数区间距离下界 | B157-S02/B157-S04/B157-S06 | `minSampleMm`、`lipschitzMmPerParam`、`maxHalfGapParam`、`lowerBoundMm` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R03-P / -N1..N4（单字段反例） |
| B157-R04 旋转部件位移上界包含刀柄与机床 | B157-S03/B157-S06 | `linearRateMmPerParam`、`angularRateRadPerParam`、`radiusMm`、`motionBoundMmPerParam` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R04-P / -N1..N4（单字段反例） |
| B157-R05 模型/数值误差、政策间隙分账 | B157-S01/B157-S04/B157-S05 | `clearanceLowerBoundMm`、`modelErrorMm`、`numericErrorMm`、`policyMarginMm` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R05-P / -N1..N4（单字段反例） |
| B157-R06 D11不冒充D13–D15工程验证 | B157-S06 | `checkTier`、`finalNcReparsed`、`d15Status`、`d16Eligible` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R06-P / -N1..N4（单字段反例） |
| B157-R07 统一D11端口、单Babylon、左TaskPanel、事务重验 | B157-S06 | `ownerPort`、`channels`、`oneWorldLeftPanel`、`casAclCancelRecheck` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R07-P / -N1..N4（单字段反例） |
| B157-R08 源变更失效/冻结保留/旧Reader/独立消费者 | B157-S06 | `changedD10MarksStale`、`frozenD08Unchanged`、`legacyUnknownReadOnly`、`independentD15Needed` | CAP-09-05；F1-02/E3-04/E3-05/U4-04; B157-R08-P / -N1..N4（单字段反例） |

完整机器文件：[来源](../../../research/sources/CAP-09-05-interval-clearance-b157.json)、[逐字段追踪](../../../research/traces/CAP-09-05-interval-clearance-b157-v08.json)、[8正32反8数学Golden](interval-clearance-b157-fixtures-v08.json)、[只读Node校验器](../../../tools/check_cap0905_interval_clearance_b157_v08.cjs)。正例只表示本轮数学/字段判据PASS，绝不宣布连续碰撞产品或D15工程安全认证。

## Owner/接口/GUI与NC分界
09域D11唯一Owner为`ClMotionPrecheckPort`，消费D09中立CL、D03几何Profile、D04名义Setup、D10实装机床与夹具、D08冻结的精确`id/revision/hash/frame/scope/units`。输出`IntervalPrecheckEvidence{d09Exact,d03Exact,d04Exact,d10ActualExact,geometryHash,frame,parameterizationHash,intervalCoverage,motionBoundProofRef,rotationRadiusProofRef,occtDistanceProfile,lowerBoundMm,uncertaintyBudget,quality:CL_ONLY|UNKNOWN|REJECT_PRECHECK,affectedRefs,readerVersion}`。**D04名义Setup不替代D10实际绑定**。

GUI/CLI/Agent都调用此Owner端口；只使用单Babylon Engine/Scene/Canvas及统一左侧TaskPanel，最大字体12px、浅/深主题，渲染/拾取不是持久化。提交时服务端重验ACL/CAS、expectedRevision/hash/frame/scope、generation与取消状态；撤权或取消后的晚ACK零写。A/B共享源事实而不覆盖冻结D08或已发布D16；源变化使D11 STALE，旧Schema缺上界证据只读UNKNOWN并保留旧raw与回退Ref。独立D15消费者必须从**最终NC**重新解释并展开物理Joint：`中立CL(D09)→NC后处理(D12)→D13执行语义→D14轴时序→D15独立验证→D16条件发布`。CL播放不代替NC验证，不做材料扫掠仿真。

## 校验等级
V8同源纯函数规划合成48/48符合预期；独立Node完整文件进程、真实OCCT B-Rep、连续CCD、实际NC/B5/OEM、D15独立消费者、17正式Owner签署、L3、历史原始附件和全仓GFM AST均NOT_RUN。上述合成数字不得作为真实机床间隙、安全或精度规范。
