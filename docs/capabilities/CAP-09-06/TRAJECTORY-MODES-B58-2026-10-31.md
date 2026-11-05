# CAP-09-06｜B58 G61/G61.1/G64轨迹模式、前瞻与NC轴时序（2026-10-31）

**目标与边界：** 在现有11域88 CAP/36原包/17资产及L1/L2不变的前提下，补齐原CAP-09-06、E3-03/E3-04/E3-05/F1-02的**NC解释、轨迹规划与真实Joint时序证据**。L3仍需人工评审；本文只做规划，不进行材料扫掠仿真，也不声称B5或任意OEM已获机床安全认证。

## 一、合法资料的已读章节与局限

- [LinuxCNC 2.9 G-Codes §35–37](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：官方公开HTML正文已读。G61通过各编程点，且共线相邻移动不要求停车；G61.1逐段末停车；G64属于路径混合，未给P或P0不意味着零路径误差。P为混合容差，Q为Naive CAM判据；Q0禁用，未给Q按2.9官方说明使用默认值。**仅适用于经过明确版本锁定的LinuxCNC2.9方言。**
- [LinuxCNC 2.9 Important User Concepts §1.1–1.3](https://linuxcnc.org/docs/2.9/html/user/user-concepts.html)：官方公开正文已读。G1编程F不意味着短线段必达到该速度，G0同样受轨迹规划影响；角点可以减速或平滑偏离，Naive CAM可合并满足条件的短直线。
- [LinuxCNC 2.9 INI §2.10 [TRAJ]](https://linuxcnc.org/docs/2.9/html/config/ini-config.html)：官方公开正文定点已读，`ARC_BLEND_ENABLE`与`ARC_BLEND_OPTIMIZATION_DEPTH`、实际Joint速度/加速度及配置共同影响前瞻时序。**没有真实INI/HAL与标定值。**
- [Prévost/Lavernhe/Lartigue 2010，arXiv 1004.4722](https://arxiv.org/abs/1004.4722)：只读官方公开题录/摘要，**未阅读PDF正文**；仅为五轴进给驱动动态/跟踪误差研究背景，不推断具体误差值。
- [Procet原CAP-09-06固定Blob](https://github.com/BaiSongt/procet-devplans/blob/02c3944edb1b8e1565c382e9af56506d20bbd964/docs/capabilities/CAP-09-06/README.md)：Git Blob `cfeadf1f49004b8774b68064421bf147f8882785`实读。D04与D10分离、C0最小公用、ACL/CAS及GUI规范是**内生约束，非外部标准条款**。

五份来源的作者、时间、版本、URL、访问深度/限制分别记录于[来源登记](../../../research/sources/CAP-09-06-trajectory-modes-b58.json)。

## 二、工程上不可混淆的事实

1. **G61≠G61.1。** 前者要求路径经过编程点，后者明确每段终点停车。错误地将二者都变成每块零速度，会使D14时间轴/运动学仿真失真，进而误导NC独立校验。
2. **G64 P0≠几何零误差。** 对G64无P、P=0，不能发出有限偏差或角点精确到达的合格证书。给定P>0也是控制器编程容差语义，不自动变为可移植的物理刀柄轨迹证书。
3. **P/Q不是同一个量。** P控制允许混合偏差，Q参与Naive CAM线段合并；按LinuxCNC 2.9 Q=0禁用该简化。必须按NC逐块模态快照追踪有效值、单位及子程序调用位置。合成换算：`G20 G64 P0.002`的声明数值对应`0.0508 mm`，但未经独立测量，不能将其作为实际误差界。
4. **程序顶点不是机器时钟。** 前瞻、加速度、回零与物理Joint链、控制器规划器选项、RTCP/刀长补偿都可能影响D14时序。没有真实设备/Profile/运动学时，标记`UNKNOWN`而非匀速连接源程序坐标点。
5. **D15与D16必须独立。** D11刀路播放`CL_ONLY`不是真实NC的D15 PASS；D13读取最终D12原始字节，D14根据D13语义及D10实际绑定展开物理Joint，D15由独立消费者对轴限、连续覆盖、碰撞资格验收，D16二次审批。未知宏/Remap、未证实间隙与Profile阻止发布。

## 三、局部净空的独立反例（不是厂商测试）

纯数学设计假设：某已冻结程序角点附近**编程路径**的名义净空`c_nom=0.04 mm`，再假设由**独立实测或已证明的运动模型**给出实际路径与编程路径的误差上界`e_path=0.05 mm`，其他误差暂取0。保守下界`c_lower=c_nom-e_path-e_geom=-0.01 mm`，结论**UNKNOWN（不能证明安全，也不声称已实际碰撞）**。不能把程序中的`G64 P0.05`直接替换为“已证明的e_path”，否则前提无效、仍是UNKNOWN。第二个纯合成向量`0.20-0.02-0.01=0.17 mm`仅说明预算算式可用；完整刀具/刀柄/夹具模型、连续覆盖、物理校准及独立误差证据都具备时才可成为`LOCAL_CANDIDATE`，不可代替D15工程PASS。

## 四、数据字段、Owner端口和3D业务入口

- **08域D13唯一解释Owner**：`TrajectoryControlEvent{d12ByteHash,sourceByteSpan,callInstance,unitModalBeforeAfter,mode:G61|G61.1|G64,pRaw,qRaw,controllerProfileHash,unknownReasons}`，按原始NC字节及子程序闭包重读，不引用D09 CL动画作为解释事件。
- **09域D14唯一时序Owner**：消费D13事件、D10实际安装、D03机床模型与`trajIniHash`，形成`JointTimelineCandidate{d13EventHash,d10Revision,physicalJointId,frame,t0t1,velocityAndAccelerationEnvelope,coverage,unknownReasons}`。D04只是工艺名义Setup，不能代替D10。
- **09域D15独立校验、10域D16独立消费**：比对相同exact revision/hash/frame/scope和控制器版本。A/B共享事实但不得覆盖D08冻结；D12、Profile、D10或D03改动使下游资格STALE，保留旧Run和旧Reader，Expand→Migrate→Contract受控回退。
- **一致入口**：GUI、CLI、Agent共用相同领域Owner UseCase；单Babylon Engine/Scene/Canvas和左侧UnifiedTaskPanel，最大12px字；3D区分`NC_PROGRAMMED`与`PLANNER_UNKNOWN`两类轨迹，播放仅用于定位证据。提交瞬间复验ACL、CAS expectedRevision/hash、Frame、scope、taskGeneration/cancelEpoch；取消后的晚回执不得写入。
- **独立收件与分级**：D13消费者检查G61/G61.1/G64逐块状态；D14消费者独立运行真实LinuxCNC/控制器Profile与3轴+B5有效配置的速度/轴时序测试；D15以独立Oracle审查角点误差、Joint限位和连续覆盖；D16验收证据版本与人工签署。真实Owner签署、消费者验收均未发生。

## 五、机器可检链与交付声明

[来源](../../../research/sources/CAP-09-06-trajectory-modes-b58.json) → [8条规则/字段/CAP和原工作包追踪](../../../research/traces/CAP-09-06-trajectory-modes-b58-v08.json) → [61个独立正反UNKNOWN案例](trajectory-modes-b58-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0906_trajectory_modes_b58_v08.cjs) → [执行等级](../../../tracking/cap0906-trajectory-modes-b58-verification-2026-10-31.json)。本轮在代码执行环境使用与提交文件相同的纯`judge`函数，**8正44反9 UNKNOWN，61/61合成PASS**；独立Node文件进程、真实LinuxCNC/NC/HAL/B5/OEM/D15与17个消费者**NOT_RUN**，L3待审、历史原字节审计和全仓GFM AST终核未闭合。**规划PASS≠产品PASS。**
