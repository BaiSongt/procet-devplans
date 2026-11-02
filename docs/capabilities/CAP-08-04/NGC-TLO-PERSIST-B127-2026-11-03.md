# B127｜Haas NGC刀长偏置自动应用、跨上电保持与LinuxCNC G43差异

> 2026-11-03；CAP-08-04专项增量、关联CAP-02-03/CAP-04-07/CAP-09-06及原E3-02/E3-03/E3-04/E3-05/F1-02/U4-02/U4-04。**NEWLY_AUTHORED**，L1/L2不变，L3待审。不是任何具体机床或NC验证结果。

## 关键新增：更正“换刀永远不自动生效H”的危险概括

Haas官方[Group08服务页](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG44.html)的NOTE明确：**自NGC软件100.21.000.1100起**，默认刀长偏置保持应用，除非明确G49/H00；铣床换刀时偏置自动更新到新工具，且当前刀长偏置与Group08代码在掉电后保持。此规则**仅可在核实具体Haas NGC机型、固件版本与选件配置后适用**，不得把Haas前代、LinuxCNC、Fanuc、B5或未知OEM一概按此执行。原CAP-08-04的“M6不等于自动G43”应解释为**不得跨方言默认**，而不是“所有控制器M6以后均无TLO变化”。

LinuxCNC 2.9[官方G-Code §28–31](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)说明G43从刀表选用H，**不在发出G43时产生运动**，在后续运动作用；不带H使用当前已装工具；H0语义取决于random/nonrandom换刀；G43.1替换当前偏置、G43.2叠加、G49取消。与Haas固件持久化不能混用。工具表来源、数据单位及G10变更必须独立记录实际版本；[Tool Compensation](https://www.linuxcnc.org/docs/stable/html/de/gcode/tool-compensation.html)的stable网页并非2.9源码精确快照。

ISO 13399-1:2006 [官方目录](https://www.iso.org/standard/36757.html)仅能支持切削工具信息交换的研究背景；**收费正文未读，不可据此声称控制器H映射或具体Gauge测量公式来自ISO条款**。7条来源包括3份本仓固定Git Blob，不等于7篇独立论文。作者、版本、访问日期、章节、深度、限制见[逐项来源](../../../research/sources/CAP-08-04-ngc-tlo-b127.json)。

## 业务数据契约和消费者

- D03资源Owner只持有刀柄/刀具总成精确修订和具名gauge datum；D04仅名义工艺Setup，**不写机床H表**。D10机床执行绑定Owner持有实际机床/装刀位、工具测量值/Frame/单位、OEM固件Profile与H映射的原子快照；**名义Gauge Length不等于实测控制器偏置**。
- D12必须提供最终NC原始字节Hash与子程序闭包；D13按锁定的控制器/固件/ToolTable revision完整解释M6、G43/H、G43.1/.2、G49及重启前后模态快照，输出typed事件。**非本Profile支持的G码与开机状态为UNKNOWN**，不从可视网格或CL推断。
- D14采用D13事件和D03/D10实际机床轴树展开**joint轴时序**；D15由独立消费者验证限位、干涉与证据覆盖；D16仅在同Hash证据和授权审批成立时发布。D11 CL动画、合成Offset表与工具标签显示正确均**不能代替D15**；不做材料扫掠仿真。
- GUI/CLI/Agent调用同一资源和执行领域Owner Port。GUI使用**一个Babylon Engine/Scene/Canvas**和**唯一左TaskPanel**；刀长面板分别展示“资源名义Gauge”“D10测量H”“D13解释生效值”“实际D15资格”，未知明确灰态而不静默补零。操作提交重验ACL、ScopeEpoch、CAS、cancel fence与最新exact revision/hash/frame；撤权/取消晚ACK不可提交。A/B同事实只保留冻结成果并新建修订，旧Consumer可读旧schema，失效则stale并提供回退。

## 7来源→8规则→32字段→原编号包→正反验收

| 规则 | 核心约束 | 机器字段（各4） | CAP / 原编号包 | 来源 | 样例 |
|---|---|---|---|---|---|
| B127-R01 | Haas NGC固件代际/机型不允许通用预设 | `profile.controllerFamilyExact` · `profile.firmwareRevisionPinned` · `profile.ngcBehaviorQualified` · `profile.noCrossDialectDefault` | CAP-08-04/CAP-02-03 · E3-02/E3-03 | B127-S01, B127-S06 | 1正4反 |
| B127-R02 | NGC指定固件后M6/重启时偏置状态需显式建模 | `state.toolChangeTransitionCaptured` · `state.ngcPostM6OffsetRead` · `state.powerCyclePersistenceRead` · `state.noAssumeLegacyBehavior` | CAP-08-04 · E3-03/E3-04 | B127-S01 | 1正4反 |
| B127-R03 | LinuxCNC G43 H及H0取表/换刀类型严格限定 | `linux.loadedToolExact` · `linux.hOffsetSelectionExplicit` · `linux.h0ChangerTypeKnown` · `linux.toolTableRevisionPinned` | CAP-08-04/CAP-09-06 · E3-03/E3-04 | B127-S02, B127-S03 | 1正4反 |
| B127-R04 | LinuxCNC G43.1替换/G43.2叠加/G49取消不能混用 | `dynamic.g431ReplaceNotAdd` · `dynamic.g432AddNotReplace` · `dynamic.g49CancelsKnown` · `dynamic.noImplicitTableWrite` | CAP-08-04/CAP-09-06 · E3-03 | B127-S02, B127-S03 | 1正4反 |
| B127-R05 | D03名义Gauge与D10实测偏置/基准非同字段 | `mount.d03AssemblyExact` · `mount.d10InstallRevisionExact` · `mount.gaugeDatumFrameExact` · `mount.measuredOffsetNotGaugeAlias` | CAP-02-03/CAP-04-07 · F1-02/E3-04 | B127-S04, B127-S05, B127-S06 | 1正4反 |
| B127-R06 | D13从最终NC字节重新解释修订化补偿模态 | `nc.d12FinalBytesHashPinned` · `nc.d13ReparseWithProfile` · `nc.offsetBeforeAfterSnapshot` · `nc.unknownOrUnsupportedFailClosed` | CAP-08-04/CAP-09-06 · E3-02/E3-03 | B127-S01, B127-S02, B127-S07 | 1正4反 |
| B127-R07 | D14轴时间序列与D15独立验证，不允许CL动画冒充 | `motion.d14JointTimelineFromD13` · `motion.d15IndependentConsumer` · `motion.noClOnlyApproval` · `motion.d16BlocksUnknown` | CAP-09-06 · E3-04/E3-05 | B127-S05, B127-S07 | 1正4反 |
| B127-R08 | 统一三入口与ACL/CAS/撤权晚回执/冻结回退 | `commit.sameOwnerPortThreeEntries` · `commit.aclAndScopeRecheck` · `commit.casAndCancelLateAck` · `commit.abFrozenRollback` | CAP-01-08/CAP-04-07 · U4-02/U4-04 | B127-S05, B127-S06, B127-S07 | 1正4反 |

[追踪机读JSON](../../../research/traces/CAP-08-04-ngc-tlo-b127-v08.json) → [8正32单字段反+8解析Golden](ngc-tlo-b127-fixtures-v08.json) → [只读Node检查入口](../../../tools/check_cap0804_ngc_tlo_b127_v08.cjs) → [验证分级](../../../tracking/cap0804-ngc-tlo-b127-verification-2026-11-03.json)。所有正例只输出**CANDIDATE**；失败输出REJECT/STALE/UNKNOWN，未获签署/独立Consumer不得写PASS。

## 可复查合成场景与反例边界

以合成Z向Offset标量（**不计算TCP/实际轴位置/碰撞**）举例，假设刀表T1=100、T2=120、T3=5 mm：

| 场景 | 合成TLO结论 | 意义 |
|---|---|---|
| 已核NGC 100.21.000.1100+后M6 T2 | 120 | 固件依赖的自动更新；非通用M6规则 |
| LinuxCNC初始G49=0后M6 T2 | 0 | 无显式G43时不以Haas方式升级；以该合成初态限定 |
| LinuxCNC G43 H2 | 120 | H2映射需要固定tool.tbl revision |
| LinuxCNC当前120时G43.1 Z30 | 30 | 替换而非叠加 |
| LinuxCNC当前120时G43.2 H3 | 125 | 叠加（演示一维），非OEM五轴变换 |
| LinuxCNC G49 | 0 | 取消偏置，不证明后续运动安全 |
| 指定Haas NGC重启 | 保留120 | 官方NOTE支持状态保持，但实际状态必须读回 |
| 未知OEM/固件M6 T2 | UNKNOWN | 拒绝按任何其他方言默认推断 |

额外机器负例对每规则的4字段逐一独立突变，错误状态区分STALE/REJECT/UNKNOWN。**合成预检≠独立Node完整文件执行≠实际Haas/LinuxCNC/B5/OEM/D15产品验收**。正式Owner签署及17独立消费者保持0/17；历史原附件与全仓GFM AST终核、L3审批仍待办。
