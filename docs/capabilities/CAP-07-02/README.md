# CAP-07-02｜三轴曲面加工：等高、平行、清根与残料
**依据：** [原88项V0.8映射](../../architecture/v0.8/03_三级能力映射_88项.md)中07域CAP-07-02的原始表述；**阶段：L3待审的设计规格，不是功能开发/产品验收**。上一项[CAP-07-01](../CAP-07-01/README.md)的2.5D刀路契约提供可复用中立CL输出，但**不推导三轴自由曲面已实现**。

## 业务目标与非目标
面向带圆角过渡、局部缓坡、陡壁、复杂边界和前序余料的复杂航空零件，明确三轴定刀轴下可制造的曲面精加工候选。支持等高(Constant Z)、平行(Parallel)、等残高(Scallop)和残料(Rest)策略的可解释规划；清根指可由更小刀具在**前序有序D07材料状态**上证明仍存在且可达的区域。阶段性交付建议依次为：可重复的几何/参数提案→独立Oracle验证→D09中立CL→实际NC独立链路回归。不存在默认通用五轴或连续材料扫掠仿真。

不得将水线轮廓、曲面投影或球头公式自动等同真实加工安全；不能把D07名义模型/毛坯几何伪装成真实前序残料测量。D01/D02/D04的公差、面修剪、材料保护区与D03真实刀具组件都必须有精确身份。支持信息不足时明确UNKNOWN，而非伪造完整刀路。

## 十项实施单元及异常
|序|实施工作|输入/算法候选|失败、回退和可验收输出|
|---|---|---|---|
|S01|读取D01/D02/D03/D04/D07/D08 exact快照|独立revision/hash/Frame/容差/单位/权限|Frame混用STALE_FRAME，不修改冻结D08|
|S02|曲面分片、UV投影与修剪域判定|GeomAPI多解＋Face边界分类、周期缝、退化极点|点落修剪域外/无解UNCERTIFIED_TRIM|
|S03|陡缓分区和重叠带|斜率、恒Z、多方向平行、SCALLOP候选|欠切/无覆盖UNKNOWN_REGION，不凭BBox覆盖|
|S04|球头残高及步距|平面局部公式初值+真实曲率/半径、边界再采样|未经过曲面Oracle仅ESTIMATED_NOT_CERTIFIED|
|S05|刀心轨迹与几何防过切|法向补偿、刀具/刀柄组件与邻面/岛/保护区|若未核实包络则GOUGE_UNVERIFIED|
|S06|有序D07残料清根|上一工序/刀具/Setup/Frame及Stock实态|空域NO_REST_REGION，错Setup UNKNOWN_SCOPE|
|S07|自适应折线/弧、法向与缝连续|弦高误差、面边界、接缝容差、段来源|面缝断裂/采样不收敛UNCERTIFIED_GEOMETRY|
|S08|固定三轴可达、进退刀与保护|三轴锁定刀轴、倒扣检查、夹具/刀柄局部预检|倒扣INACCESSIBLE_3AXIS；未知间隙UNKNOWN|
|S09|D09 CL修订与工程门禁|只写D09中立CL，D11只做CL预检|D12/D13/D14/D15未知不得标D16发布PASS|
|S10|GUI/CLI/Agent及Owner提交|同07域Port、CAS/ACL/generation/idemKey、迁移|取消晚回执忽略、非破坏回退、独立消费者签收|

## 关键几何模型与适用边界
三轴刀轴在选定Setup内固定，刀触与刀心沿曲面法向关系构造**候选**，不是刀具在全空间无干涉的证明。GeomAPI_ProjectPointOnSurf可返回曲面投影多解；UV落在支撑曲面上还需要修剪Face、边界和周期缝二次分类。BRepExtrema距离API只给特定形体之间的极值；不能据此声明连续时间刀柄/机床已安全。局部球头平面残高初值：当球半径R、相邻走刀局部有效间距s且0<s<2R时，h=R−√(R²−(s/2)²)，小步距近似h≈s²/(8R)。这只是局部几何关系，**在曲率变化、球头非中心接触、斜坡、尖角、边界和刀具磨耗下不能当全曲面残高保证**。参数与测量单位为mm/deg，公差由D02显式指定，不在文档虚构认证值。

等高适于陡壁，平行/等残高为缓区候选；坡度阈值/重叠带需证据驱动，且重复扫过边界不等于完整覆盖。Rest必须绑定有序D07来源及实际前序刀具参数；不做材料扫掠仿真，真实剩余体几何通过独立B-Rep状态与Oracle检验。

## 字段→来源→规则→验收（10条）
|规则|实现关注点|字段及正/反/独立变异|
|---|---|---|
|C0702-R01|曲面加工精确输入与Frame/冻结来源|`revision`、`designHash`、`frameHash`、`stockHash`、`toolHash`、`frozenBytesPreserved`；CAP-07-02-T01/CAP-07-02-T02/CAP-07-02-M01|
|C0702-R02|UV投影和修剪Face有效域|`projectionSolutions`、`pointInsideTrim`、`projectionResidualMm`、`surfaceToleranceMm`、`uvBoundaryClass`；CAP-07-02-T03/CAP-07-02-T04/CAP-07-02-M02|
|C0702-R03|陡缓分区与策略重叠交界|`steepMethod`、`shallowMethod`、`partitionThresholdDeg`、`overlapBoundaryCovered`、`regionClassified`；CAP-07-02-T05/CAP-07-02-T06/CAP-07-02-M03|
|C0702-R04|球头局部残高估计边界|`ballRadiusMm`、`stepoverMm`、`estimatedScallopMm`、`maxRequestedScallopMm`、`approximationScope`、`surfaceResultCertified`、`ballDiameterMm`；CAP-07-02-T07/CAP-07-02-T08/CAP-07-02-M04|
|C0702-R05|曲面刀心补偿与防过切独立Oracle|`toolCenterMethod`、`gougeCount`、`protectedHits`、`geometryOracleStatus`、`clearanceResultScope`；CAP-07-02-T09/CAP-07-02-T10/CAP-07-02-M05|
|C0702-R06|残料必须来自有序D07状态|`stockStateHash`、`restSource`、`orderedPriorState`、`setupFrameMatched`、`restStatus`；CAP-07-02-T11/CAP-07-02-T12/CAP-07-02-M06|
|C0702-R07|曲面采样、公差及拼缝|`chordToleranceMm`、`observedChordErrorMm`、`normalJumpDeg`、`maxNormalJumpDeg`、`seamContinuityVerified`；CAP-07-02-T13/CAP-07-02-T14/CAP-07-02-M07|
|C0702-R08|固定三轴可达性、刀柄及转接|`axisMode`、`undercutDetected`、`toolHolderPrecheck`、`entryLinkPrecheck`、`noKinematicPassClaim`；CAP-07-02-T15/CAP-07-02-T16/CAP-07-02-M08|
|C0702-R09|中立D09与NC验证/发布严格隔离|`clOwner`、`controllerId`、`d12Status`、`d13Status`、`d15Status`、`releaseEligible`、`materialSweepSimulated`；CAP-07-02-T17/CAP-07-02-T18/CAP-07-02-M09|
|C0702-R10|Owner CAS/ACL/取消晚回执与无损回退|`expectedHead`、`actualHead`、`aclAllowed`、`taskGeneration`、`receiptGeneration`、`cancelled`、`lateReceiptDiscarded`、`nonDestructiveRollback`；CAP-07-02-T19/CAP-07-02-T20/CAP-07-02-M10|

## Owner端口、GUI与失效
07域单一领域入口：`ToolpathPlanningPort.preview3AxisSurface(exactWorkContext, targetFaces, frozenRouteRef, setupRef, stockRef, toolAssemblyRef, strategy)`返回只读候选、局部测量、失效和UNKNOWN；`ToolpathOwnerPort.stage→seal→commitCAS`只产生新D09修订，提交时重验expectedHead、ACL、scopeEpoch、taskGeneration、cancelled和idemKey。不改变其他域资产。C0仅有身份/单位/Frame/Revision/Hash/Scope，不加入几何策略私有字段。A/B共用同一D01～D08事实，07候选不得覆盖05域D08冻结。

D04表示工艺Setup与名义毛坯，D10为机床执行装夹/偏置绑定，**不同Owner与修订**。完整链路：`D09中立CL→D12 NC后处理→D13控制器执行语义→D14轴时序→D15工程验证→D16发布`。D11的CL预检≠D15工程通过；D13未知指令/宏/循环为`UNKNOWN`，不默许发布。严禁材料扫掠仿真或将CL动画称NC工程验证。

D01/D02/D03/D04/D07/D08变化只失效确证依赖范围的D09及其派生D11～D16；证据不足则`UNKNOWN_SCOPE`，旧修订可审计、不同Setup不被误失效。GUI/CLI/Agent调用同一个07域Port，单Babylon世界/左TaskPanel只保存只读预览租约，不拥有事实。详见[交互规格](UI.md)、[合成DTO](contract.example.json)、[17资产候选Owner](asset-owner-candidates.json)及[独立消费者回退](independent-consumer-handoff.md)。

## 溯源、校验和实际产品验收分层
[研究专题](../../../research/topics/R-3AXIS-SURFACE-001.md) → [10份合法公开来源及深度](../../../research/sources/CAP-07-02.json) → [10规则/字段映射](../../../research/traces/CAP-07-02.json) → [20正反+10独立变异](fixtures.json) → [规划校验器](../../../tools/check_cap0702_planning_2026_10_26.cjs)。`node tools/check_cap0702_planning_2026_10_26.cjs`仅检静态规划合成DTO；**不执行真实OCCT/机床/后处理/独立消费者，规划PASS≠产品PASS**。
