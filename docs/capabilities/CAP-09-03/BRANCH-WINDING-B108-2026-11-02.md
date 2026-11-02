# B108｜CAP-09-03 物理旋转周数、IK支链与D14轴时序资格

> V0.8规划研究补证，2026-11-02。仅规划契约及合成用例；L3、17资产正式Owner和真实独立消费者尚未通过。规划PASS≠产品PASS。

## 本轮可证实的问题

同一个显示转角或同一个TCP位姿，可能对应不同的物理Joint状态。以受限连续B轴为示例，物理关节370°与10°具有相同的归一化角度10°，但前者多一整圈；若机械行程、回转接口、联动电缆或控制器模式不同，两者不能作为同一个可执行候选。用于教学的数值不代表真实B5机床参数。

LinuxCNC 2.9的官方INI文本分开列出了AXIS与JOINT限位、ANGULAR_UNITS和WRAPPED_ROTARY选项，并说明非恒等运动学下即使Cartesian轨迹限位合法仍可能Joint限位失效。[官方INI](https://linuxcnc.org/docs/2.9/html/config/ini-config.html) 的[AXIS_l]/[JOINT_n]配置和[运动学说明](https://www.linuxcnc.org/docs/2.9/html/motion/kinematics.html)在本轮限定阅读范围内。**不能据此假定Haas/西门子/B5也采用同一种wrap或最短路径策略。**

Cambridge 2017出版、2024上线的[Modern Robotics第6章公开摘要](https://www.cambridge.org/core/books/abs/modern-robotics/inverse-kinematics/C98C1958551678B2C1ECE911C9)以二维连杆说明同末端目标可有两个IK解；这里仅使用摘要，不宣称阅读全文。Northwestern官方[第6章教学说明](https://modernrobotics.northwestern.edu/chapters/chapter6/)仅读网页文字，未观看视频。[MoveIt Rolling时间参数化](https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html)仅作为速度/加速度时序分层的工程类比，不引入ROS依赖。NIST 2011[五轴测试件公开摘要](https://www.nist.gov/publications/evaluation-proposed-test-artifacts-five-axis-machine-tools)指出不同倾角会导致显著不同轴轨迹，未读取PDF和实测数据。

## Owner、数据与操作边界

- D03提供精确机床资源/轴拓扑与机械限制，D04仅负责名义工艺Setup；D10提供执行机床绑定、当前机床坐标与ControllerProfile的exact revision/hash/frame，二者严禁替代。D13为最终NC的已知/未知执行语义Owner；D14为轴运动时序Owner；D15必须以独立实现/运行实例消费最终NC重新验证，D16发布不能继承CL预览结论。
- 建议定义RotationCandidate：axisId、axisKind、rotaryPolicy及policyRevision、physicalJointDeg、displayAngleDeg、turnIndex、previousPhysicalJointDeg、ikBranchId、sourceD13ExactRef、machineD10ExactRef、timeSample、jointLimitsProfile、velocity/accelerationLimit、frameGraphProof、ownerRevision、resultProvenance。所有exact引用含id/revision/hash/frame；真实单位/方向、轴周期和上/下限以锁定厂商Profile为准。
- 仅在明确工程归一化约定为[0,360)、单位度的合成有限连续轴案例里，可按physicalDeg = displayDeg + 360 × turnIndex验证三个字段一致；这不是所有控制器的回转指令公式。遇到WRAPPED_ROTARY、带限位转台、索引锁紧或控制器状态未知时返回UNKNOWN等待受控解释，不进行隐式模360或自动选择最短旋转。
- 05域的工艺排序与D09中立CL仅给需求/候选；D13解释后的NC轨迹才可生成D14轴时序。G93名义块时长、IK近奇异阻尼或D14仿真动画都不授予D15 VERIFIED。未知的机床特定语义维持UNKNOWN。

## 八项可追踪规则与验收

| 规则 | 关键拒绝/UNKNOWN | 原编号包 |
|---|---|---|
| B108-R01 exact D03/D04/D10及Frame隔离 | D10同名异Hash→STALE、D04 Frame缺失→UNKNOWN | F1-02/E3-04 |
| B108-R02 控制器旋转策略显式 | 未锁定policy或WRAPPED_ROTARY不适用本示例→UNKNOWN | E3-04 |
| B108-R03 归一化角与实际周数分离 | 370°/10°/turn=0→REJECT | E3-04/U4-04 |
| B108-R04 IK多支链与FK证据 | 同TCP未经证据跳Branch→REJECT/UNKNOWN | E3-04/E3-05 |
| B108-R05 物理Joint限位 | q=370°但受限max=360°→REJECT | F1-02/E3-05 |
| B108-R06 时间/速度/加速度预算 | 非法dt、超速或超加速度→REJECT | E3-04/E3-05 |
| B108-R07 最终NC与验证资格隔离 | CL预览→UNKNOWN、自称D15 VERIFIED→REJECT | E3-05/U4-04 |
| B108-R08 三入口/事务/单世界 | ScopeEpoch过期→STALE，两个Babylon主Scene→REJECT | U4-04 |

字段规则的外部证据与内部Procet规范来源已分层，逐项可见[7条来源](../../../research/sources/CAP-09-03-branch-winding-b108.json)、[8条追踪规则](../../../research/traces/CAP-09-03-branch-winding-b108-v08.json)、[34组正反/UNKNOWN/STALE合成输入](branch-winding-b108-fixtures-v08.json)、[只读Node入口](../../../tools/check_cap0903_branch_winding_b108_v08.cjs)。

## GUI/CLI/Agent及失效迁移

唯一互动Babylon Engine/Scene/Canvas，资源3D与工程3D以横向世界切换展示，统一左TaskPanel显示当前物理Joint角/显示角/整周数/IK分支/控制器Profile来源及UNKNOWN理由。若Renderer只能显示归一化角度，必须加醒目的‘显示投影’标签，不能将显示变换回写为机床物理坐标。GUI、CLI、Agent共用09域MotionDomainPort及04域D10查询/授权，不新建Agent隐式Writer，Agent工具只能建议或调用受管命令。

预览→受控确认过程中CAS、权限、ScopeEpoch、generation、source hash/frame必须在Owner提交处重新校验；撤权、取消、切工程/Setup、晚到ACK一律不能写正式新修订。已冻结A/B同事实方案只可fork受控修订，不能原地覆盖；升级控制器策略或机床拓扑须将D14/D15/D16的相应旧证据标STALE，保留历史与显式回退读侧。内生协议不归因于LinuxCNC/NIST。

## 验收层次与风险

本轮设计合成5正、15反、9 UNKNOWN、5 STALE（共34），3个角度/速度数值Goldens；同一个规划判定函数的结果不能替代独立实现。建议未来产品端以真实D10机床Profile、两个同TCP不同Joint解、跨0°连续受限旋转、实际NC执行时序与D15独立进程作为验收样本，分别做FK回代、限位、速度、加速度、异常退刀/取消、跨语言Hash、独立消费者与版本回退测试。没有真实实机运动或材料扫掠切削仿真；真实B5/OEM、Node独立文件、D13–D16、GPU及17资产真实消费者均NOT_RUN。
