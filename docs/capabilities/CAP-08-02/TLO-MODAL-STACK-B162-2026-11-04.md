# B162｜CAP-08-02 最终NC刀长补偿栈、H寄存器与机床坐标模式（2026-11-04）

> **新增研究补证 / L3待审**。保持11域、88 CAP、36原工作包、17资产。对应CAP-08-02及CAP-02-03、CAP-08-03；原编号E3-02/E3-03/U4-04。这里只设计D13解释资格，不实现实际控制器解释器、机床运动或材料去除扫掠仿真。

## 一、为何此项容易被错误简化

名义刀具总成的量规长度、实际对刀测量、控制器H寄存器、D13当前已应用TLO与D14机床轴时序**不是同一数据**。例如D03刀具总成中有125mm量规长度，不等于当前控制器H07必为125mm；即使数值相等，其原点、符号、版本及实际D10执行绑定也可能不同。不得做一次D03刀长几何平移之后，再未经模态解释在D13额外叠加同一数值；也不得因同名刀具推定H表正确。

**LinuxCNC 2.9官方§28**：G43引入刀长补偿而不立即产生运动；G43 Hn选工具表索引n；H0的行为随随机/非随机刀库不同；5081–5089表示已应用的补偿值，5401–5409是随工具变更等刷新的已装载工具存储偏置，不能混同。**§29** G43.1用给定轴值**替换**已有补偿，不是加法；禁止与运动同块，且不写工具表。**§30** G43.2**追加**补偿，可以叠加多次，H和轴参数不能同时给出；不写工具表。**§31** G49取消刀长补偿。**§33** G53是**非模态仅本块**的机床坐标选择，需要G0/G1且不能开半径刀补。G53不是“免检高速安全退刀”认证，也不能据其名称推断所有偏置/变换均被移除。

**Haas铣床官方G43/G44页面**明确新一代NGC软件自`100.21.000.1100`起存在与旧版不同的刀补自动应用、换刀更新和跨断电保持行为；Haas目录将G43/G44/G49分组08、G53为非模态。两家手册不可合并成“标准G代码初始状态”。NISTIR6556本轮仅有官方搜索结果著录，**没有打开PDF正文**，不据此虚构解释器条款。

## 二、正确的所有权与执行序列

1. **资源层D03（候选）**：保留刀具组件树、根主轴安装基准、刀具端TCP、名义量规/伸出、子件revision和Frame；这些信息不是控制器动态H寄存器。
2. **工艺层D04（名义）**：仅持Setup及工件Frame；**D10（现场执行绑定）**单独持目标机床/控制器固件/选件、实际装配、H索引与工具表快照、实际WCS/补偿来源。版本不详即UNKNOWN。
3. **D09→D12**：中立CL不编码特定H/G43语义。后处理产生真正的NC原字节+闭包manifest+Post配置与方言Profile修订；人工编辑产生新D12，不改D08冻结。
4. **D13独立执行解释**：从最终D12原字节按确切控制器模态读取T/M6、H、G43/G43.1/G43.2/G49、G53及WCS；记录每个状态改变前后offset寄存器、工具表版本、物理byteSpan、执行实例、Frame、units与未知原因。H0刀库模式不详、H无效或Haas固件选件未知→UNKNOWN，不允许静默假定。
5. **D14→D15→D16**：D13归一化的运动意图与D10装夹/物理Joint树共同产生轴时序，再由D15独立校验限位、碰撞和间隙。缺D13语义、D14时序或独立D15只能标`UNKNOWN/NOT_RUN`，不能发布。D11 CL动画不能抵充。

### 补偿变换的形式化边界

示意状态`TLO=(tx,ty,tz,...)`，仅在**已锁定LinuxCNC 2.9方言、工具表和D10坐标标定**时讨论：
- `G43 Hn: TLO ← ToolTable[n]`，不直接运动；
- `G43.1 Zz: TLO.z ← z`（替换当前指定轴补偿，非叠加），同块运动拒绝；
- `G43.2 Zδ: TLO.z ← TLO.z + δ`；可追加多次；
- `G49: TLO ← 0`（取消当前刀补）；
- `G53 G0 X..: coordinateMode ← MACHINE_FOR_THIS_BLOCK`，下块恢复之前WCS作用，不能自行推出TCP安全。

示例`120 → G43.1 Z12.5 → G43.2 Z0.2 → G49`的抽象Z补偿数值依次为`120、12.5、12.7、0`；这是**离线状态机教学Golden**，不是实际NC解释或机床Z位置推导。长度符号和实际空间变换要按确切控制器说明与执行上下文计算。

## 三、来源—规则—字段—验收（逐项机器可检）

| 规则 | 关键契约 | 数据资产 / 原工作包 | 验收 |
|---|---|---|---|
| B162-R01 | 执行绑定与物理Frame锁定；`binding.d10Revision`, `binding.d10Hash`, `binding.machineFrame`, `binding.controllerProfile` | D03/D04/D10/D13; E3-02/E3-03/U4-04 | B162-R01-P、B162-R01-N1..N4 |
| B162-R02 | H索引与实际刀具表/量规分离；`offset.toolTableHash`, `offset.hIndex`, `offset.measurementIdentity`, `offset.notAssemblyGaugeEqualsH` | D03/D10/D13; E3-02/E3-03/U4-04 | B162-R02-P、B162-R02-N1..N4 |
| B162-R03 | G43/H0已知模态与换刀方式；`g43.explicitModalState`, `g43.hSelectionIdentity`, `g43.toolChangerMode`, `g43.appliedOffsetSnapshot` | D12/D13; E3-02/E3-03/U4-04 | B162-R03-P、B162-R03-N1..N4 |
| B162-R04 | G43.1替换且不执行同块运动；`replace.g431Semantics`, `replace.noSameBlockMove`, `replace.toolTableUnchanged`, `replace.postOffsetState` | D12/D13; E3-02/E3-03/U4-04 | B162-R04-P、B162-R04-N1..N4 |
| B162-R05 | G43.2追加而非替换；`additional.g432Semantics`, `additional.hOrAxesExclusive`, `additional.accumulationLogged`, `additional.tableNotWritten` | D12/D13; E3-02/E3-03/U4-04 | B162-R05-P、B162-R05-N1..N4 |
| B162-R06 | G49取消与G53单块边界；`machine.g49ClearsToolLength`, `machine.g53IsBlockScoped`, `machine.g53G0G1Validated`, `machine.g53CutterCompNotActive` | D13/D14; E3-02/E3-03/U4-04 | B162-R06-P、B162-R06-N1..N4 |
| B162-R07 | Haas NGC版本化默认刀补区别；`dialect.haasVersionEvidence`, `dialect.haasAutoTloNotCrossApplied`, `dialect.linuxH0ChangersDistinguished`, `dialect.unknownBlocksPublishing` | D03/D10/D13; E3-02/E3-03/U4-04 | B162-R07-P、B162-R07-N1..N4 |
| B162-R08 | D13独立原字节解释与Owner统一提交；`gate.finalNcReparsedByD13`, `gate.d04NominalSeparateFromD10`, `gate.ownerAclCasCancellationRechecked`, `gate.guiCliAgentOneOwnerPort` | D09/D12/D13/D14/D15/D16; E3-02/E3-03/U4-04 | B162-R08-P、B162-R08-N1..N4 |

**实际机器资料阅读深度**详见[7份分级来源](../../../research/sources/CAP-08-02-tlo-stack-b162.json)，[JSON追踪](../../../research/traces/CAP-08-02-tlo-stack-b162-v08.json)将每条规则映射到精确源ID、字段、CAP、原编号包和独立消费者，再由[8正+32单字段反+8状态Golden](tlo-stack-b162-fixtures-v08.json)及[只读Node门禁](../../../tools/check_cap0802_tlo_stack_b162_v08.cjs)验证。动态解释器、安全Oracle和Haas软件行为**没有**被这些合成用例认证。

## 四、GUI/CLI/Agent、权限、失效与受控回退

- GUI在唯一Babylon Engine/Scene/Canvas与左UnifiedTaskPanel呈现两个独立组：“D03名义总成/量规”和“D10/H现场寄存器与D13已应用状态”。差异/未知显示来源、修订、Frame、物理NC块，非绿色“安全”标签；活动轨迹选中和NC行高亮仅使用已证映射。
- GUI/CLI/Agent统一走08域`NcExecutionSemanticsPort`和各事实Owner的`readExact`；无第二Agent直写数据入口。C0仅共享Identity/Revision/Hash/Frame/Unit/Scope/Protocol。A/B同一冻结事实不可静默覆盖。
- 任何工具表、换刀方式、D03总成、D04 Setup、D10实际H/Frame、控制器固件/选件、最终NC字节的变化均使对应D13及后续D14–D16派生证据陈旧，保留旧不可变历史。没有依赖追踪时`UNKNOWN_SCOPE`，不接受跨Setup“latest”猜测。
- 候选提交阶段按业务Owner执行ACL和CAS（expected revision/hash/frame、scopeEpoch、taskGeneration、cancel fence、幂等记录），取消晚回执只记录不得写入新事实。旧Reader→双读影子校核→切换→可无损回退；旧结果无实际适用证据不得继续发布。

## 五、验收层级与交接

本轮只允许宣称V8规划合成规则的结构自检。针对`G43.1`替换/同块运动、`G43.2`累加、`G49`取消、`G53`仅本块、H0随机刀库与Haas NGC版本缺失，Golden给出8项明确结果；这些值不含真实机床数据。**必需的产品独立验收**：在隔离LinuxCNC 2.9环境用实际工具表与G-code检查offset应用时序；Haas须先取得OEM确切机型/软件/选件与授权测试，再由独立D13、D14、D15消费者比较NC原字节与轴时序；量仪/实机遵循现场安全制度。17资产正式Owner签署0/17，真实消费者验收0/17、L3待人审。

[验证等级记录](../../../tracking/cap0802-tlo-stack-b162-verification-2026-11-04.json)。**规划PASS≠产品PASS。**