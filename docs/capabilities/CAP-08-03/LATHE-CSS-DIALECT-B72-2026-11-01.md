# B72｜CAP-08-03 两轴车床恒线速、直径模式与G码方言碰撞（2026-11-01）

**定位**：V0.8原CAP-08-03及原E3-02、E3-03、E3-04、E3-05、F1-02、U4-04研究补证。保持11域、88 CAP、36原工作包和17业务资产，不改L1/L2，L3仍须人类审查。此为公开资料+可复核数学+合成校验，不是产品或OEM验证。

## 一、关键发现：同一G字在不同车床方言中的含义并不一致

经2026-11-01定点阅读：
- LinuxCNC Documentation Project，[LinuxCNC 2.9 G-Codes §10/§11/§59/§60](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)公开HTML具体章节：G7将X字按直径解释，G8按半径解释；G95为单位/主轴转进给（须接入选定主轴speed-in）；G96 S开启恒线速度，D是**可选的**最高主轴速度参数；G97为固定RPM。**不得将无D的G96说成LinuxCNC语法错误**。该页面没有证明Haas、B5或其他OEM行为。
- Haas Automation，[车床官方G-Code清单](https://haascnc.com/service/service-content/guide-procedures/lathe---g-codes.html)公开HTML已读：**G94为端面加工循环，G95为动力刀具刚性攻丝，G98为每分钟进给，G99为每转进给**；G96/G97切换恒线速/关闭。故LinuxCNC的G95每转进给不能被Haas车床直接接受为相同语义。Haas [G50 S页面](https://haascnc.com/service/codes-settings.type=gcode.machine=lathe.value=G50.html)公开正文已读：G50 S限制主轴最高转速；绝不能把其语法与LinuxCNC G96 D合并为同一NC令牌。
- Haas [G96单独页](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dlathe.value%3DG96.html)本次只得到**搜索结果摘要**、直接正文跳转失败，不能虚称G96专页已读。Kramer/Proctor/Messina，[NIST IR 6556](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3)仅官方作者/日期/Abstract：只佐证独立NC解释器→Canonical动作分层；[ISO 6983-1:2009](https://www.iso.org/standard/34608.html)仅合法目录/出版摘要与2025确认，**未读收费正文，不编造G码或CAS条款**。
- 以上外部事实与[CAP-08-03原规格锁定Blob](https://github.com/BaiSongt/procet-devplans/blob/61a39c60983896fb130305fd91367e2a04cfab2d/docs/capabilities/CAP-08-03/README.md)（Git Blob `0020764b4fa78761efc90d2bf7cb01ff587f3256`）共同形成追踪。阅读深度、作者、版本、访问时间和局限均见[8项来源Registry](../../../research/sources/CAP-08-03-lathe-css-b72.json)。

## 二、合成数学反例和边界

仅当D10已锁定旋转中心与实际主轴/刀塔/机床坐标、D12最终NC字节、D13对应**精确方言Profile**时，才进行名义算术：
```text
LinuxCNC 2.9 G7:  D_mm = |Xword| × unitToMm
LinuxCNC 2.9 G8:  D_mm = 2 × |Xword| × unitToMm
Haas: 必须另外锁定PROFILE_DIAMETER或PROFILE_RADIUS，不能凭G7/G8猜测
n_theory(rpm) = Vc(mm/min) / (π × D(mm))
n_candidate = min(n_theory, machineLimitRpm, programLimitRpm)
feed_nominal(mm/min) = n_candidate × f(mm/rev)
```

其中`Vc(m/min)×1000`换为mm/min，`Vc(ft/min)×304.8`换为mm/min，`X(in)×25.4`换为mm；这是量纲代数而非实际机床动力学证明。合成`Vc=150m/min、D=40mm、F=0.25mm/rev`，得`n≈1193.662rpm`，名义进给`≈298.416mm/min`；G7 X40和G8 X20产生相同物理直径，错误把G8 X40当40mm将造成2倍直径误判和RPM计算错误。Haas车床候选须使用G99+独立Profile+G50 S限速，不能直接复用LinuxCNC G95/G96 D。

对于D→0，未限速的n_theory发散；即使数值min后有限，也**不证明**中心线附近刀具接触、刀架干涉、夹紧力或速度/加速度安全。没有中心Frame或未知宏时应`UNKNOWN`。为了候选准入要求已核验RPM上限，这是Procet内部保守策略，**不是LinuxCNC G96的强制语法**。

## 三、8条可机读的来源→规则→字段→CAP/原包→正反验收

| ID | 规则焦点/机器字段 | 来源 | 原包 |
|---|---|---|---|
| B72-R1 | `identity.ncHash/d04Rev/d10Rev/profileHash/scopeEpoch/frame*` exact | S08、S06 | E3-02/E3-03/U4-04 |
| B72-R2 | `program.dialect/profileVerified/feedMode`，G95/G99/G94词义隔离 | S02、S03 | E3-02/E3-03 |
| B72-R3 | `program.xMode/xModeKnown/xWord/expectedDiameterMm` | S01、S08 | E3-03/F1-02/E3-04 |
| B72-R4 | `program.units/cssS/expectedRpm/expectedFeedMmMin` | S02、S04、S08 | E3-02/E3-03/E3-04 |
| B72-R5 | `program.limitCode/limitRpm/machineLimitRpm/machineLimitKnown` | S02、S03、S04 | E3-02/E3-03/E3-05 |
| B72-R6 | `program.spindleSelected/spindleFeedbackKnown/feedPerRev` | S02、S03、S06 | E3-03/E3-04/E3-05 |
| B72-R7 | `program.centerFrameKnown/centerAligned/unsupportedMacro` | S02、S05、S08 | E3-03/E3-04/E3-05 |
| B72-R8 | `gate.ownerPort/acl/cas/cancelled/lateAck/sceneCount/leftPanel/channels/freezePreserved` | S08内生规划 | E3-03/U4-04/E3-05 |

[追踪JSON](../../../research/traces/CAP-08-03-lathe-css-b72-v08.json) → [46项显式Expected Fixture](lathe-css-b72-fixtures-v08.json) → [Node只读校验入口](../../../tools/check_cap0803_lathe_css_b72_v08.cjs) → [分级验收](../../../tracking/cap0803-lathe-css-b72-verification-2026-11-01.json)。`3候选、25拒绝、6过期、10未知、2只读显示`；所有正反预期单独登记，合成同judge检查不能代替独立控制器/消费者验收。

## 四、数据契约、领域入口与修订传播

`NcSemanticsCandidate{ncBytesHash,sourceByteSpan,dialectProfileHash,modalBefore,modalAfter,xAxisMode,physicalDiameterMm,spindleMode,cssSurfaceSpeed,programRpmCap,machineRpmCap,spindleFeedbackRef,d04ExactRevisionHashFrame,d10ExactRevisionHashFrame,scopeEpoch,ownerExpectedRevision,approvalState}`。GUI/CLI/Agent复用08域`NcSemanticOwnerPort`的同一UseCase；只有一个Babylon Engine/Scene/Canvas，浮于3D的统一左UnifiedTaskPanel，浅深主题、字号最大12px。GUI预览不写资产。

D04 Setup定位和D10实际机床执行绑定严格分离，D03刀具/刀塔资源只读。提交前重新验证Owner CAS、ACL、精确Revision/Hash/Frame、ScopeEpoch、取消代次；晚回执无权覆盖冻结。C0仅最小共用元数据；A/B同事实不覆盖D08已冻结候选。任一D12 NC原始字节、D10机床/刀塔/主轴、控制器Profile、D04 Frame修改，旧D13–D16资格变`STALE`，保留旧事实与审计链，不能原位覆盖。旧Reader先兼容读取，未能确定方言或中心线的旧数据只读`LEGACY_UNRESOLVED`，Expand→Migrate→Contract并保留回滚。

`D09中立CL→D12后处理NC→D13逐模态重新解释最终NC→D14真实物理轴/主轴时序→D15独立NC工程验证→D16受控发布`。名义CSS/RPM以及CL 3D动画均不属于D14/D15实际通过；未建模宏及控制器差异显式`UNKNOWN`，不做材料扫掠仿真。

## 五、独立消费者与验收现状

独立D13应读两份最终NC字节，对应LinuxCNC G95/G96 D与Haas G99/G50 S，核验相同G码不同语义；D14须收到控制器实际主轴反馈和轴位姿时序；D15再独立验证加工条件。消费者收件必须含`originalNcSHA + exactD04/D10 revision/hash/frame + controllerProfileSHA + consumerBuildSHA + deny/unknown cases + operator`，不得凭同源checker或3D动画放行。

本轮46/46为**同判定函数规划合成**；独立Node完整文件执行、真实LinuxCNC/Haas/B5、D13-D16及17类实际跨域消费者均`NOT_RUN`。Owner正式签署0/17，L3待审，历史附件原字节审计和全仓GFM AST终核待补。**规划PASS≠产品PASS。**
