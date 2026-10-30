# B33｜CAP-09-07 / 原E3-05：连续干涉的区间证据与旋转运动门禁
日期：2026-10-30。**专项规划补证，仅V8同函数数学合成；L3待人工审批，真实D15消费者、FCL/OCCT、B5/OEM NOT_RUN。**

## 1. 新增而非重复的能力缺口
原[CAP-09-07](README.md)已明确静态最近距离、离散采样不证明全程无碰；B11主要处理G93/G94/G95时序。本轮专门把**静态Shape-Pair查询 → D14实际Joint时间区间 → 连续碰撞求解器适用性与区间证据 → D15独立结论资格**拆成8条可机检规则，不增加88 CAP或36原编号工作包。范围是刀具/刀柄、夹具、机床连杆与保护几何的**运动干涉**；不是材料切削扫掠仿真，也不计算去料状态。

## 2. 实际来源与读深
- **FCL贡献者**，[固定Git提交ae86ecde (2026-10-21)](https://github.com/flexible-collision-library/fcl/blob/ae86ecde788086110f8a4cea54ae1949df8a21d3/README.md)：2026-10-30实际读取该README的“Continuous collision detection”和`continuousCollide`请求/结果，确认库可按指定始末Transform估算碰撞/接触时间。**没有编译库、证实B5旋转插值、误差区间或控制器物理Joint覆盖**。
- **MoveIt维护者**，[Developer Concepts](https://moveit.ai/documentation/concepts/developer_concepts/)：公开“CollisionRobotFCL / CollisionWorldFCL / Bullet Collision Detection”段落区分Robot连杆、World对象与离散/连续后端；其ACM类思路不等于可将刀柄–夹具全局排除。
- **Open CASCADE文档维护者**，[OCCT8.0.1 DistShapeShape](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html)：已读静态两Shape最近距离类介绍/构造和IsDone/Value定位。仅是**指定姿态的静态距离**，不能推导旋转运动全程无碰，距离零也不能替代重叠判别。
- **Rapier贡献者**，[公开C CCD指南](https://rapier.rs/docs/user_guides/c/rigid_body_ccd/)：已读tunneling、motion clamping与双动体、mesh类范围限制。该指南未锁软件发行版，不能据此给出NC安全等级。
- **Procet原规格Owner**，[固定HEAD业务规则](https://github.com/BaiSongt/procet-devplans/blob/9265153a8f6ecc47b51e2cf63ce37d55038beec1/docs/capabilities/CAP-09-07/README.md)：原R01/R03–R10要求exact输入、持续覆盖、独立D15、Owner/CAS和失效回退，属**内部产品架构规则**，非上述外部库强制条款。

[完整来源登记（作者、版本、日期、URL、阅读章节、限制）](../../../research/sources/CAP-09-07-ccd-interval-b33.json)。

## 3. 数学正反见证与资格
**只考虑一维直线刚性球心的合成模型**：一个球心以`x(t)=x0+(x1-x0)t`移动(`0≤t≤1`)，障碍球心位于0，两球半径和`r=1`。端点`x0=-2,x1=2`各距离2，均未相交；但是`t=0.25`第一次接触（`x=-1`），`t=0.5`深度穿透（`x=0`）。因此**两端安全不等于中段安全**。另一个候选`x0=-3,x1=-2`最近距离2、间隙1；在误差界0且安全边界0.1的*解析前提*下可成为`SYNTHETIC_CLEARANCE_CANDIDATE`，**不是实际机床安全PASS**。切触等于margin的情况需保守UNKNOWN。

本合成校验器只证明这一维的分段最短距离逻辑及门禁分支，无法验证3D B-Rep碰撞、TOI数值稳健性、旋转运动或伺服轨迹。五轴构型中旋转枢轴导致的弧形轨迹不可用笛卡尔直线端点差代替；没有D03经过标定的Joint树和D14时间连续变换证据，就返回`UNKNOWN`。FCL有CCD API **不等于Procet已经集成或具备连续安全证明**。

## 4. D15领域端口与数据契约
输入：`FinalNC@D12 exact bytes hash`、`D13 interpreter/profile hash`、`D14 physical-joint interval hash`、`D10 execution binding revision/hash/Frame`、`D03 kinematic model/geometry hash`、`ShapePair geometry revision/Frame`、碰撞对允许域、误差/裕量、数值算法配置、时序覆盖证据。D04 Setup仅给**名义装夹**，与D10实际机床执行绑定分离。D09中立CL及D11播放永不签发D15。缺形状、Frame、时间覆盖、旋转插值/误差上界或控制器语义均显式`UNKNOWN`；已发现危险穿透为`REJECT`/collision witness；`STALE`区分版本失效与未知。

单一09域`SafetyVerificationOwner`向GUI/CLI/Agent提供`readExact/proposeCheck/inspectIntervalEvidence/commitCAS/invalidateDependents`。界面复用唯一Babylon Engine/Scene/Canvas与左侧UnifiedTaskPanel、最大12px字体，3D轨迹颜色/CL动画不能修改工程判断。写入瞬间重验ACL、ScopeEpoch、期望Revision/Hash/Frame、CAS、取消代次；取消后晚ACK不生新验证结果。A/B共享事实但不覆盖冻结D08，迁移旧Schema采取双Reader影子核验及精确只读回退。D03/D10/D12/D13/D14/几何/算法变化令D15及D16资格STALE，独立D16消费者与人类签署前**不能发布**。

## 5. 可审计追踪、执行入口及严禁冒称
[5来源](https://github.com/flexible-collision-library/fcl/blob/ae86ecde788086110f8a4cea54ae1949df8a21d3/README.md) → [8条规则/逐字段/原E3-04/E3-05/E3-06/U4-04](../../../research/traces/CAP-09-07-ccd-interval-b33-v08.json) → [2正30反，含穿透时间解析见证](ccd-interval-b33-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0907_ccd_interval_b33_v08.cjs) → [验证状态](../../../tracking/cap0907-ccd-interval-b33-verification-2026-10-30.json)。在完整仓库可由独立人员运行`node tools/check_cap0907_ccd_interval_b33_v08.cjs`；本轮仅当前隔离V8环境运行与文件同一判定函数，机器正反例**32/32 PASS**，**没有声称独立Node文件进程已执行**。

产品要另验：真实STEP/OCCT/FCL的静态/连续碰撞、机床运动学校准与五轴转动、D13解释全部最终NC、D14时间区间与路径模型、D15独立消费者的穿透/无穿透正反报告、D16独立发布审查、撤权取消竞态。现实正式Owner **0/17**、实际独立消费者 **0/17**、L3 **PENDING_HUMAN**；规划PASS≠产品PASS。
