# B101｜CAP-09-06 非恒等Joint限位与D14→D15独立消费者证据（2026-11-02）

> V0.8规划补证，不变L1/L2、11域88 CAP、36原包、17资产与44关系边；L3待审、正式Owner及独立消费者0/17。**规划PASS≠产品PASS**。

## 一、原问题与B90/B98增量
原CAP-09-06为“解释/执行NC并检查控制器级运动”，原包F1-02/E3-04/E3-05/U4-04。B90已论证G93/G94/G95名义进给不等于实际时序；B98发现D14→D15仅同属09域，须**不同实现和独立执行记录**。本次专攻**Cartesian限位合格但非恒等Joint超限**及**命令/反馈证据不得混同**，不重复B33 CCD或B90时间公式。

## 二、官方原文边界和解析Golden
LinuxCNC 2.9官方INI正文说明：其非恒等运动学下，Cartesian轨迹规划不持有Joint实际运动信息；G-code满足Cartesian坐标限制仍可能导致Joint超限，motion模块会检测并报告。只适用于其锁定版本，不能直接推广B5或其他OEM控制器。

自造数学测试（不是机床模型）：`q=x+2sin(theta)`，theta单位为度。基准`x=2,theta=90°,q=4,jointMax=5`合格；只改`x=4`，Cartesian `x≤5`仍合格，但`q=6>5`，D15独立Joint复算必须拒绝。只校验D14声明`jointOk=true`会漏掉此反例。

LinuxCNC MOTION(9)分别公开`joint.N.pos-cmd`/ `pos-fb`以及`f-error`；规划D14描述指令时序，不持有运行时传感器值。D15不能从未运行的NC预测“已测伺服跟随误差”，必须将实际Servo证据列`NOT_OBSERVED`，未知Profile、采样缺口或未建模语义返回`UNKNOWN`并阻D16；不能用静态/端点检查宣称连续干涉安全，不做材料扫掠仿真。

## 三、来源分级、追踪与机器样例
[来源与作者版本/合法阅读深度](../../../research/sources/CAP-09-06-joint-b101.json)记录7条：LinuxCNC2.9公开INI/MOTION指定章节、W3C PROV-O血缘正文实读；ISO23247-1:2021及ASME V&V10-2019(R2025)仅官方或授权目录，未读付费正文；两份固定Git Blob为**本仓内生业务规则**，不外推厂商承诺。[规则与字段](../../../research/traces/CAP-09-06-joint-b101-trace-v08.json) → [45合成正反/UNKNOWN](joint-b101-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0906_joint_b101_v08.cjs) → [分级验证](../../../tracking/cap0906-joint-b101-verification-2026-11-02.json)。

| 规则 | 工程合同 | 证据 | 具体字段 | 负例 / 未知 |
|---|---|---|---|---|
| B101-R01 | 最终NC字节D13，而非CL动画或未知模态 | B101-S06,B101-S07 | `nc.hash`,`d13.ncHash`,`d13.status`,`d13.unknownCount`,`nc.closure` | B101-N01,B101-N02,B101-N03,B101-N04 / B101-U01 |
| B101-R02 | D10实际修订、Frame、Profile及校准钉住 | B101-S01,B101-S06 | `d10.hash`,`d10.frame`,`d10.profile`,`d10.calibration`,`d14.d10Hash`,`d14.frame`,`d14.profile` | B101-N05,B101-N06,B101-N07,B101-N08 / B101-U02 |
| B101-R03 | D14 NC跨度、时序有序且无缺口 | B101-S02,B101-S03 | `d13.hash`,`d14.d13Hash`,`d14.ordered`,`d14.spans`,`d14.gaps` | B101-N09,B101-N10,B101-N11,B101-N12 / B101-U03 |
| B101-R04 | Cartesian限位合格不能推导非恒等Joint合格 | B101-S01,B101-S06 | `d14.cartesianOk`,`d14.jointOk`,`d14.x`,`d14.thetaDeg`,`d14.qReported`,`d10.jointMax` | B101-N13,B101-N14,B101-N15,B101-N16 / B101-U04 |
| B101-R05 | 速度/加速度与单位包络不可用名义时间冒充 | B101-S01,B101-S02 | `d14.vPeak`,`d14.aPeak`,`d10.vMax`,`d10.aMax`,`d14.timeUnit`,`d14.claimRealTime` | B101-N17,B101-N18,B101-N19,B101-N20 / B101-U05 |
| B101-R06 | D15须同域不同实现/运行并复核D14原Hash | B101-S03,B101-S07 | `d14.timelineHash`,`d15.timelineHash`,`d14.binary`,`d15.binary`,`d14.run`,`d15.run`,`d15.recomputed` | B101-N21,B101-N22,B101-N23,B101-N24 / B101-U06 |
| B101-R07 | 碰撞覆盖、未知语义及伺服实际反馈不得伪证 | B101-S01,B101-S02,B101-S04,B101-S05 | `d15.coverage`,`d15.collision`,`d15.unknown`,`d15.claimServoSafe`,`d15.report` | B101-N25,B101-N26,B101-N27,B101-N28,B101-N29 / B101-U07 |
| B101-R08 | 同Owner三入口、单3D、左TaskPanel、权限CAS/取消/回退 | B101-S06,B101-S07 | `ui.ownerPort`,`ui.babylon`,`ui.leftPanel`,`tx.cas`,`tx.canceled`,`tx.ackEpoch`,`tx.activeEpoch`,`tx.scope`,`d10.scope`,`tx.rollback` | B101-N30,B101-N31,B101-N32,B101-N33,B101-N34,B101-N35,B101-N36 / B101-U08 |

全部规则关联CAP-09-06/09-05/09-08及原F1-02/E3-04/E3-05/U4-04。D10真实机床绑定归04域，D13解释归08域，D14运动时序和D15验证分别归09域**不同实现**；不引入C0巨型公共对象。

## 四、提交端口、GUI、生命周期及真实验收
- D14提供`09.AxisTimelinePort.readExact({D13hash,D10revision/hash,frame,controllerProfile,kinematics,sourceSpans})`；D15必须用独立二进制SHA和runId重新读取D14原Hash，复算Joint/速度/加速度/覆盖，不以D14自述状态代替证据。两端同域也须独立消费者执行者与日志。
- GUI、CLI、Agent复用同一09域Owner Port；唯一活动Babylon Engine/Scene/Canvas、统一左侧TaskPanel、字体不超过12px。选择、播放、CL动画不能授予NC工程资格。
- D15写入前严格CAS(expectedRev/currentRev)、ACL/scopeEpoch、取消Fence重验；撤权或取消后的晚ACK不得提交。更改D12 NC原字节、D13方言、D10实际修订/Frame、D14运动学或D15算法版本均使既有D15/D16相关发布资格STALE。A/B同一事实不覆盖冻结D08。
- 旧Reader影子双读→记录Hash/Frame/单位/时序差异→真实独立正反验证→人类审批切换；失败撤回新Writer，保留旧历史证据及原冻结计划。
- 真实独立验收待提交：锁定D12原始NC、D10/B5精确版本与运动学标定、D14与D15不同代码和运行实例，独立D15读回并复算；注入Cartesian合法但Joint越界、错Frame、旧Profile、采样空白、未知OEM语义、取消晚ACK，保存正反日志及Owner签名。D14模拟不能伪造Joint实际反馈，不声称机械安全通过。

## 五、执行分级
本轮V8同一`judge`的45项合成测试：1正、36反、8未知，均符合预期；在V8对Node文本做语法编译而**未用独立Node文件进程执行**。独立D15消费者、真实LinuxCNC/五轴B5/OEM、全仓GFM AST、历史附件原字节、17个Owner签署/消费者实测与L3全部待办。**规划PASS≠产品PASS**。
