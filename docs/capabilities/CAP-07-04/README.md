# CAP-07-04｜四/五轴连续刀路：刀轴场、刀触关系与曲面路径
**原始目标：**[V0.8原88项映射](../../architecture/v0.8/03_三级能力映射_88项.md)的CAP-07-04：四/五轴连续刀路，包含**刀轴场、刀触关系、曲面路径**；关联原F1-03、E3-01、U4-04。保留原编号与L1/L2，L3待人类评审。属于长期扩展，**本轮是设计规划不是产品能力实现**。

## 1. 场景及技术边界
面向机匣、航空薄壁框、复杂流道和带倾斜侧面的自由曲面精加工，在选定D04工艺Setup、D02目标面和D03资源候选后，建立连续TCP刀位与刀轴场。**四轴联动**指必要的线/回转联动并不隐含第五可动关节；**五轴连续**在切削运动中刀轴方向可随路径同时改变，与[3+2定位分段](../CAP-07-03/README.md)不同。刀具中心轨迹、真实刀触点(CC)、刀轴单位向量、法向/倾角以及局部工艺余量必须区分，不允许把球头刀具TCP等同于工件接触点。

原型应覆盖球头点接触和侧刃接触的**策略接口与可拒绝条件**，不承诺两者通用算法已实现。D07只读有序材料状态，D08冻结不覆盖；候选A/B是同一工程事实的不同规划视图。D04包含Setup/装夹事实，D10才包含执行机床、机床轴链、控制器及偏置绑定。机床零点、轴限、旋转中心、刀柄长度、数控控制器语义均不得自行写死。

## 2. 10项实施任务及可验证交付
|子项|Owner/输入|输出与测试入口|失败语义及回退|
|---|---|---|---|
|S01 溯源锁定|D01/D02/D03/D04/D07/D08 exact revision/hash/frame、单位/作用域|引用图及[规则R01](../../../research/traces/CAP-07-04.json)|STALE_REF、不同Setup或冻结冲突→拒绝提交|
|S02 刀触几何|D01 B-Rep修剪曲面、D02加工精度、D03刀具刃型|CC/TCP与容差，接触型式/作用域、R02|退化曲面、接触超差或刀形未建模→UNKNOWN/REJECT|
|S03 法向/姿态场|D01局部曲面微分与Frame，D02侧倾/前倾约束|局部刀轴矢量、法向、有效范围、R03|无效法向/零向量/镜像Frame→拒绝|
|S04 姿态连续光顺|连续采样与q/-q等价，D02局部角步长|四元数单位化与最短弧相邻差、R04|过大姿态跳变，不能以画面插值掩盖|
|S05 防过切与干涉|D01目标B-Rep、D04夹具、D03刀具/刀柄、D07保护区|独立局部几何Oracle与Fail-Closed，R05|检测体缺失/碰撞未知→不授工程通过|
|S06 新D09中立CL|D04 Frame、D08计划/冻结、S02–S05候选|TCP/刀轴/进给意图/运动类型、修订hash，R06|绝不预写G-code、机床AC关节角|
|S07 可达/奇异候选|只读D03构型候选，不越权修改D10|逆解分支候选、条件数告警/未知，R07|奇异、关节限位、机床未标定→UNKNOWN_PENDING_D14|
|S08 进给/加减速要求|D09仅保存工艺请求，D10执行绑定下游使用|R08、下游D14时序消费者合同|不声称D09的F值等于真实轴速度或可达插补|
|S09 真实NC工程链|D09→D12后处理→D13解释→D14轴时序→D15验证→D16发布|R09与NC独立消费者|任何未知控制器模态、轴状态或D15未通过阻D16|
|S10 GUI/CLI/Agent及提交|统一07域Port、Owner事务、CAS/ACL/任务代次/取消|R10、人工审批与独立回归|取消晚回执IGNORED_STALE，旧D08/D09及用户数据保留|

## 3. 数学表示与算法适用条件
记CC(s)为刀触点，TCP(s)为刀尖参考点，a(s)为**单位刀轴向量**。须按明确刀具几何与切触解建立`TCP(s)=CC(s)+offset(toolGeometry,normal,lead,tilt)`，offset不是对任意刀形均有效的常量。对于表面参数`S(u,v)`，法向由局部偏导叉积取得且先检查`IsNormalDefined`与修剪域；无法定向或法向不连续时必须分段。对单位四元数`q_i`与`q_(i+1)`，相邻最短旋转角可采用`Δθ=2 arccos(min(1,|q_i·q_(i+1)|))`，以`q`与`-q`表示同一旋转；这是几何光顺检查而非真实转台角速度认证。局部角步长与几何公差取D02工艺输入，不硬编码机床安全值。

机床关节空间由真实D03/D10拓扑及运动学决定，刀轴连续不代表各轴连续且远离奇异点。近奇异、跨分支、轴范围冲突和夹具盲区只有经过独立D11预检查/下游D14展开才可进一步判断；**D11 CL预验证也不可代替D15从最终NC产生的工程验证**。ISO14649-11:2004仅查合法目录，不引用未读付费条款；LinuxCNC为公开示例而非所有控制器通用行为。2019研究文章仅读第三方摘要，不能移植其中实验结果。

## 4. 端口、Owner与失效迁移
`07.ContinuousToolpathPort.preview(exactWorkContext,setupRef,geometryRefs,toolAssemblyRef,orientationPolicy)`返回候选CL、失败/未知诊断与精确来源；`07.ToolpathOwnerPort.stage→seal→commitCAS`只能产生新D09 revision。GUI、CLI、Agent共用该端口，不可由UI覆盖D04、D08或D10；Owner提交事务内必须重验CAS、ACL、scopeEpoch、任务代次、cancelled和来源hash。C0保持最小身份/单位/Frame/Hash/Revision/Scope/协议；不要增加全域巨型工具轴对象。

D01/D02/D03/D04/D07/D08修订变化按精确依赖闭包失效相应D09和派生D11/D12–D16，不可凭模型名批量覆盖。旧数据先兼容只读、标LEGACY_UNVERIFIED；新旧独立消费者对比后才申请迁移写端。失败回退只切读路径，不删除历史工程、冻结资产或数据库。

## 5. 可机器校核与验收矩阵
|规则|业务主题|所需字段|正例 / 反例 / 独立差异变异|
|---|---|---|---|
|C0704-R01|精确几何/毛坯/Frame与冻结只读|`sourceRevision`、`geometryHash`、`frameHash`、`frozenUnchanged`|CAP-07-04-T01 / CAP-07-04-T02 / CAP-07-04-M01|
|C0704-R02|真实刀触点、修剪域与TCP误差|`contactPointLocated`、`contactToleranceMm`、`contactDeviationMm`、`toolAxisConvention`|CAP-07-04-T03 / CAP-07-04-T04 / CAP-07-04-M02|
|C0704-R03|曲面法向有效性、单位刀轴与右手坐标|`surfaceNormal`、`toolAxis`、`frameHandedness`、`normalAvailable`|CAP-07-04-T05 / CAP-07-04-T06 / CAP-07-04-M03|
|C0704-R04|姿态四元数连续性与局部角步进|`toolOrientationQ`、`angularJumpDeg`、`maxAllowedJumpDeg`、`continuousCut`、`quaternionSignHandled`|CAP-07-04-T07 / CAP-07-04-T08 / CAP-07-04-M04|
|C0704-R05|刀具过切、刀柄夹具局部检查与保护区|`gougeCheck`、`holderClearance`、`protectedZoneUnchanged`、`screenProxyIsEvidence`|CAP-07-04-T09 / CAP-07-04-T10 / CAP-07-04-M05|
|C0704-R06|连续五轴中立CL含TCP/刀轴但无机床轴指令|`clMode`、`hasMachineJointWords`、`poseAndAxisRecords`、`clFrameHash`|CAP-07-04-T11 / CAP-07-04-T12 / CAP-07-04-M06|
|C0704-R07|逆运动学分支与近奇异位形不自动认证|`kinematicsEvidence`、`ikBranchPolicy`、`singularityHandling`、`machineVerifiedAtCam`|CAP-07-04-T13 / CAP-07-04-T14 / CAP-07-04-M07|
|C0704-R08|进给意图与实际轴速度/加速度时序隔离|`feedIntentRecorded`、`d14TimingEvidence`、`clPreviewCertifiesFeed`、`rotaryRateActualKnown`|CAP-07-04-T15 / CAP-07-04-T16 / CAP-07-04-M08|
|C0704-R09|最终NC后处理、未知控制器语义和发布门禁|`d12PostProcessed`、`d13ExecutionSemantics`、`d15Result`、`d16ReleaseEligible`、`materialSweepSimulated`|CAP-07-04-T17 / CAP-07-04-T18 / CAP-07-04-M09|
|C0704-R10|07域Owner条件提交与取消晚回执回退|`expectedHead`、`actualHead`、`aclAllowed`、`taskGeneration`、`receiptGeneration`、`cancelled`、`nonDestructiveRollback`|CAP-07-04-T19 / CAP-07-04-T20 / CAP-07-04-M10|
测试入口：`node tools/check_cap0704_planning_2026_10_26.cjs`（静态规划、合成场景，**尚未独立Node执行**）；产品侧待D09真实生成器、OCCT Oracle、D12后处理/D13控制器/D14时序/D15消费者执行。全部人工L3审批与17资产Owner跨域会签待完成。

[GUI/3D规格](UI.md) · [合成数据契约](contract.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [权威来源与阅读边界](../../../research/sources/CAP-07-04.json) · [规则/字段/来源链](../../../research/traces/CAP-07-04.json) · [合成正反变异场景](fixtures.json) · [独立消费者和迁移回退](independent-consumer-handoff.md) · [专题研究](../../../research/topics/R-CONTINUOUS-5AXIS-001.md)。
**规划PASS≠产品PASS；不做材料扫掠仿真。**
