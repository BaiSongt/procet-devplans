# B183｜CAP-08-03 G93/G94/G95逆时间与每转进给执行语义

2026-11-05，V0.8原CAP-08-03，原E3-03/E3-04/E3-05/U4-04；**新编NEWLY_AUTHORED，不冒充历史原件、产品或机床测试**。11域88CAP、36原编号工作包及17资产数目不变，L3仍待人类审批。

## 理论核对、版本与阅读限制

1. [LinuxCNC 2.9官方G-Code](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)（LinuxCNC Documentation Team；官网2026-11-01更新，2026-11-05访问）§59已读取：G93 F代表每分钟程序段次数，名义时间`60/F`秒；G1/G2/G3每个插补块包括隐式模态续行需要F，G0快速例外；G94单位/分钟、G95单位/主轴转；切换G94或G95要求新F。§43.5和§60指定正文已读：G93与固定循环冲突，G95要确认具体主轴反馈。**LinuxCNC 2.9不是所有OEM的通用承诺。**
2. [Haas官方G93帮助](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG93.html)仅搜索索引正文摘要，官方直接打开重定向失败；[Haas NGC 96-8210 Rev V，2025年12月](https://www.haascnc.com/content/dam/haascnc/en/service/manual/operator/english---mill-ngc---operator%27s-manual---2025.pdf) §6.29、§7.1.50-52公开PDF**提取文字**已读，PDF截图因重定向失败而未核版面。该版同时4/5轴通常采用G93、具G234 TCP选项的机床可按条件使用G94，G93 F上限45000、RESET回G94；G95随主轴转速与倍率变化。只用于锁定该版Haas Profile，不能用于未认证B5/其它品牌固件。
3. [NISTIR 5754，Kramer/Proctor，1995-10-01](https://www.nist.gov/publications/nist-rs274vger-interpreter)：仅核对官方出版作者/日期/报告号，**未读PDF正文**。本仓[原CAP规格](README.md)、[原E3-03](../../work-packages/E3-03.md)为Owner/GUI/权限CAS与D04-D10隔离的内生来源，不能归因于外部手册。所有7份来源的作者、版本、时间、URL、章节、阅读深度、局限详见[来源台账](../../../research/sources/CAP-08-03-inverse-feed-b183.json)。

## 公式、反例与语义边界

G93 F2的名义段时间30秒，F4则15秒；**不是**D14真实物理轴时长：加减速、速度/加速度限制、控制器预读/路径平滑、暂停或倍率均可能影响实际运动。G95 `0.2mm/rev × 1200rev/min = 240mm/min`是已知有效主轴转速前提下的名义换算，不是实时伺服测量；主轴反馈缺失、选错主轴、倍率未知必须`UNKNOWN_SPINDLE`。G93下无F的`G1 X10`拒绝，`G0 X10`不按逆时间求时；G94/G95切换不补F拒绝。

## 8规则、32字段、40独立正反及10 Golden

|规则|工程设计资格|独立字段|来源|
|---|---|---|---|
|B183-R01|最终NC原始字节与D04/D10分离|`identity.ncSha`、`identity.profile`、`identity.d04Separate`、`identity.d10Exact`|B183-S01/B183-S06/B183-S07|
|B183-R02|G93每插补块F及模态|`modal.mode`、`modal.interpolated`、`modal.eachBlockF`、`modal.fInverse`|B183-S01/B183-S03/B183-S04|
|B183-R03|60/F数学名义时长与物理轴时序分离|`inverse.f`、`inverse.seconds`、`inverse.unit`、`inverse.nominalNotActual`|B183-S01/B183-S03/B183-S07|
|B183-R04|G0例外、隐式G1与固定循环拒绝|`exceptions.g0Unaffected`、`exceptions.implicitG1NeedsF`、`exceptions.cannedCycleG93Rejected`、`exceptions.unknownBlocked`|B183-S01/B183-S02/B183-S06|
|B183-R05|G94/G95重给F与主轴反馈资格|`switch.mode`、`switch.newFRequired`、`switch.spindleSignalKnown`、`switch.spindleId`|B183-S01/B183-S02/B183-S06|
|B183-R06|G95名义进给与伺服反馈隔离|`perRev.fMmPerRev`、`perRev.spindleRpm`、`perRev.nominalMmPerMin`、`perRev.notMeasured`|B183-S01/B183-S04/B183-S07|
|B183-R07|Haas NGC Rev V Profile特有条件|`haas.profile`、`haas.g234Conditional`、`haas.resetG94ProfileOnly`、`haas.maxF45000ProfileOnly`|B183-S03/B183-S04/B183-S06|
|B183-R08|同领域Port、CAS/ACL、取消与D15独立|`release.oneOwnerPort`、`release.casAclRecheck`、`release.cancelLateAckBlocked`、`release.independentD15UnknownBlocksD16`|B183-S06/B183-S07|

[机器追踪](../../../research/traces/CAP-08-03-inverse-feed-b183-v08.json)逐项映射CAP-08-03、原工作包、资产、来源与每字段独立反例；[Fixture](inverse-feed-b183-fixtures-v08.json)含8正32单字段负10状态/数值Golden；[Node只读检查器](../../../tools/check_cap0803_inverse_feed_b183_v08.cjs)入口`node tools/check_cap0803_inverse_feed_b183_v08.cjs`。检查器只检验合成合同，不充当NC解释器。

## 数据Owner与完整执行链

D12持有**最终NC原始字节**、SHA256、Profile/选项快照和物理行映射；D13必须**独立重读最终NC**，生成`FeedModeEvent{programSha,profileSha,optionsSha,physicalLine,byteRange,modeBefore,modeAfter,feedWord,feedUnits,nominalSeconds,spindleId,spindleFeedbackEvidence,d04Exact,d10Exact,frameHash,scopeEpoch,unknownReasons}`。D04名义Setup与D10机床执行配置/工具实际安装不混用；D14基于D13事件+D10物理运动链生成轴时序，D15为独立NC工程验证消费者，D16只在Owner授权与D15合格时发布。链路`D09中立CL→D12 NC后处理→D13执行语义→D14轴时序→D15验证→D16发布`；D11 CL动画不能冒充NC验证，不做材料扫掠仿真。

GUI/CLI/Agent统一使用08域`NcExecutionPort.interpretFinalNc(exactNC,profile,d10Binding)`，只读预览不可代提交。单Babylon Engine/Scene/Canvas、统一左UnifiedTaskPanel、浅深主题、≤12px、无右侧Drawer。提交时重验revision/hash/Frame、scopeEpoch、ACL权限、CAS、cancelGeneration与晚回执；取消ACK仅记历史不覆盖当前界面。A/B共享不可变事实，D08冻结不可原位覆盖。遗留无F/Profile/Spindle/Frame证据仅可`LEGACY_UNVERIFIED`，Expand→Migrate→Contract双读与失败回退不得恢复旧PASS。

原E3-03验收须覆盖：显式/隐式G1遗漏F、G0例外、G94/G95新F、G95主轴失联、Haas G234条件缺失、Reset/Profile不符、取消晚ACK、撤权、CAS冲突和跨Frame失效；E3-04/D14和E3-05/D15分别由不同消费者验证。V8同判据50/50规划合成，独立Node整文件进程、真实LinuxCNC/Haas/B5/NC/运动链/Owner及消费者**均NOT_RUN**；正式Owner 0/17，独立消费者0/17，L3待审，历史原字节/全仓GFM AST未闭。**规划PASS≠产品PASS。**
