# B134｜CAP-09-07：笛卡尔Axis限位通过不代表物理Joint安全
日期：2026-11-03。归09域，L3待审批。原工作包 F1-02、E3-04、E3-05、U4-04；不变更11域88 CAP、36包或17资产分母。对原R02/R03新增**LinuxCNC 2.9特定非identity运动学失效机制**，不同于B33的连续碰撞区间研究。

## 官方资料、范围与审慎结论
LinuxCNC **2.9 INI Configuration**公开段落明确：G-code规划器在笛卡尔空间限制Axis坐标，但非identity运动学计算所得物理Joint仍可能越界，motion模块在执行时fault。故D15不能把XYZABC在范围内升级为物理Joint安全。LinuxCNC 2.9 **Switchable Kinematics**的相关公开章节说明运动学切换需要解释器/运动层同步，偏置及限位相关配置也应重新审查；LinuxCNC 2.9 **5-Axis Kinematics**区分CL刀尖/姿态与具体机床Joint映射。这些仅适用于引用版本，不应推广为B5/OEM事实。
ISO 841:2001（2001-10第2版，2023确认）只核对合法公开目录与摘要，收费正文未读；NIST Gao等（2023-04-20）机床校准论文只核对官方摘要，论文PDF未读。本仓CAP-09-07与CAP-09-03固定Blob属内部设计依据，不是标准。作者、版本、时间、URL、访问章节及局限均载[7项来源](../../../research/sources/CAP-09-07-joint-limits-b134.json)。

## 无量纲独立数学反例
定义两笛卡尔显示量x与a各自范围为[-1,1]，假定某**教学耦合量**q=x+0.8a允许[-1.2,1.2]。若x=0.6、a=0.9，两个Axis均合法，但q=1.32违反假设Joint限位；若x=0.4、a=0.4，q=0.72合法。该玩具**不是任何真实五轴运动学、机床参数、NC安全证明或材料扫掠仿真**。包含轴超界和Joint越界的6项数学Golden可用[合成样例](joint-limits-b134-fixtures-v08.json)重放。

## 字段规则、原包和机器验收
每条规则1项正例+4项各只改一字段的独立反例；L3待审批、所有独立消费者NOT_RUN。原包全部为F1-02、E3-04、E3-05、U4-04。
| 规则 | 场景与约束 | 来源IDs | 核验字段 |
|---|---|---|---|
| B134-R01 | D03/D10精确修订、D04名义Setup及Frame隔离 | B134-S06、B134-S07 | `refs.d03Revision`、`refs.d10Revision`、`refs.d04NominalOnly`、`refs.frameHashExact` |
| B134-R02 | 运动学模式/解释器运动同步/偏置重校 | B134-S02、B134-S03、B134-S06 | `mode.kinTypeKnown`、`mode.modeRevisionExact`、`mode.interpreterMotionSynced`、`mode.offsetsRequalified` |
| B134-R03 | 笛卡尔Axis包络和来自最终NC的独立证据 | B134-S01、B134-S04、B134-S06 | `axis.axisEnvelopePinned`、`axis.axisWithinBounds`、`axis.frameExact`、`axis.finalNcSource` |
| B134-R04 | 物理Joint限位/归零/整周与笛卡尔Axis分开 | B134-S01、B134-S02、B134-S07 | `joint.physicalLimitsPinned`、`joint.homingEvidence`、`joint.physicalJointsWithinBounds`、`joint.noOneToOneAssumption` |
| B134-R05 | D14实际关节完整时间区间/分支/动态证明 | B134-S01、B134-S03、B134-S07 | `interval.timeCoverage`、`interval.branchContinuity`、`interval.turnCountExact`、`interval.speedAccelerationQualified` |
| B134-R06 | 最终D12字节→D13语义→D14轴时序→D15独立Oracle | B134-S03、B134-S06、B134-S07 | `nc.finalD12Hash`、`nc.d13IndependentInterpret`、`nc.d14PhysicalTimeline`、`nc.d15IndependentOracle` |
| B134-R07 | GUI/CLI/Agent同Port、单Babylon与左TaskPanel | B134-S06 | `ui.oneBabylonWorld`、`ui.leftTaskPanel`、`ui.sameDomainPort`、`ui.previewReadOnly` |
| B134-R08 | 写点ACL/CAS/取消Fence及冻结历史/旧Reader回退 | B134-S06、B134-S07 | `commit.aclRechecked`、`commit.casExactChecked`、`commit.cancelLateAckFenced`、`commit.migrationRollbackFrozen` |
[来源索引](../../../research/sources/CAP-09-07-joint-limits-b134.json)→[完整规则与原编号包](../../../research/traces/CAP-09-07-joint-limits-b134-v08.json)→[40正反及6Golden](joint-limits-b134-fixtures-v08.json)→[Node只读校验器](../../../tools/check_cap0907_joint_limits_b134_v08.cjs)→[执行分级](../../../tracking/cap0907-joint-limits-b134-verification-2026-11-03.json)。

## 业务契约、GUI与验收条件
D03资源Owner持有已测/标称物理限位和运动学配置的精确修订、Hash、Frame；D04工艺名义Setup和D10实际机床/控制器/刀具安装绑定由各业务Owner分别提供，禁止用D04生成伪实装状态。中立D09 CL和D11动画只提供预检；最终NC以D12字节Hash为基，经D13**控制器语义独立重解释**、D14**物理Joint时序**，D15独立双层限位/碰撞/动态证据核验，再由D16独立人工受控发布。未知控制器语义、未标定Joint、未覆盖时间区间均UNKNOWN，已证越界REJECT_ENGINEERING，上游Hash/Profile/Frame/模式不一致为STALE；不做材料扫掠仿真。
09域`SafetyVerificationPort`供GUI/CLI/Agent同域入口，唯一Babylon Engine/Scene/Canvas，左侧UnifiedTaskPanel显示Axis、Joint、来源/状态与运动时序；3D预览只读，不能当D15 PASS。写入瞬时再次核ACL/CAS expectedRevision+Hash+Frame、scopeEpoch及取消generation；晚ACK拒绝生效，A/B已冻结修订保留。D03/D10/Profile/NC变更按D13–D16依赖图失效并经旧Reader/新Schema并行迁移与无损回退。
独立消费者必须用**真实最终NC、实际机器轴拓扑、回零/整周数、实际限位/姿态、模式切换同步及单独Oracle**做正反见证。目前正式Owner签署**0/17**、实际独立消费者**0/17**、LinuxCNC实跑/B5/OEM/NC/OCCT/真实D15及浏览器均**NOT_RUN**。规划PASS≠产品PASS。
