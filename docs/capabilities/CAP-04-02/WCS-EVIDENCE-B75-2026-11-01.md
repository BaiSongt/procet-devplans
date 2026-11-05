# B75｜CAP-04-02 毛坯/零件配准与执行WCS叠加证据隔离（2026-11-01）

> **NEWLY_AUTHORED 增量研究，L3待审。** 原88 CAP、36原工作包、17资产及L1/L2未变。本项不是重复B09的Frame刚体检验、B20的点集非退化，也不覆盖B46对D13 G代码语义的研究；专门验证**同一D04定位事实不能冒用D10/G54/G52/G92的实际执行状态**。

## 发现：同一个D04 Frame，不代表同一个物理NC位置

LinuxCNC 2.9官方G-Code §14指出，`G10 L2 P1 ... R90`可以更改G54旋转/偏置定义，**并不自动选中G54**；如已有G52/G92，它们保持有效，且在旋转之后应用。2.9 Coordinate Systems §4–5记载G52/G92共用寄存器，受持久化配置影响；`G53`是非模态机器坐标命令。不能只看到G54的名称就认定现场偏置快照已锁定。以上仅对LinuxCNC 2.9公开文档适用，B5、Haas、FANUC/OEM需要单独证据。

**数学反例（合成、非真实LinuxCNC量测输出）：** 用列向量约定，零件点`p=(2,1)mm`，旋转`Rz(90°)`、名义机器原点`t=(100,20)mm`和旋转后位移`a=(3,0)mm`：
- 后叠加：`t + R·p + a = (102,22)mm`；
- 误将位移先叠加：`t + R·(p+a) = (99,25)mm`。
两者相差`(3,-3)mm`。这只是验证矩阵运算次序不交换的教学Golden，数值`1e-9mm`断言为测试容差，不是数控或定位工业公差；不能直接把本模型当LinuxCNC真实机器坐标解释器。

NIST Franaszek/Cheok 2017**出版摘要**还区分fiducial拟合残差与未参与配准的target误差，因此**配准数值残差小≠目标位置或机床执行合格**。没有读取论文全文，不从摘要导出任何验收精度阈值。

## 设计补证、Owner与规则

| 规则 | 字段及原工作包 | 来源 |
|---|---|---|
| B75-R1 | 确切配准来源与测量证据层级，不用低残差冒充目标精度；`sources.cadRev / sources.cadHash / sources.stockHash / sources.occurrence / sources.unit`；原F1-02 / W2-05 | B75-S04、B75-S05、B75-S06 |
| B75-R2 | G10 L2 P/R不自动选G54；旋转后的G52/G92与先叠加不可交换；`execution.g10P / execution.wcsSelected / execution.g10WritesButDoesNotSelect / execution.offsetAppliedAfterRotation / math.reported`；原F1-02 / E3-03 | B75-S01、B75-S03 |
| B75-R3 | G52/G92共寄存器、恢复持久性须有D10快照，双标签混合拒绝；`execution.g52 / execution.g92 / execution.offsetRegistersKnown / execution.persistenceKnown`；原F1-04 / E3-03 | B75-S02 |
| B75-R4 | D04名义Setup不得写G54，D10负责控制器执行绑定与证据；`chain.d04WroteControllerOffset / chain.d10BindingOwner / execution.owner / execution.toolMeasureEvidence`；原F1-04 / E3-04 | B75-S05 |
| B75-R5 | D13精确方言/版本与G53非模态，D14/15/16不得由CL动画升格；`execution.dialect / execution.version / execution.g53OnlyCurrentBlock / chain.d13 / chain.d15 / chain.d16`；原E3-03 / E3-04 / E3-05 | B75-S01、B75-S02、B75-S05 |
| B75-R6 | D01/stock/D04/D10各自revision/hash/frame和实测凭证不能跨证据升格；`sources.setupHash / execution.hash / gate.expectedExecRev / execution.toolMeasureEvidence`；原F1-02 / F1-06 | B75-S05、B75-S04 |
| B75-R7 | ACL/CAS/permissionEpoch/scopeEpoch取消晚回执零写入；`gate.acl / gate.cas / gate.scopeEpoch / gate.receiptEpoch / gate.permissionEpoch / gate.receiptPermissionEpoch / gate.cancelled`；原F1-04 / U4-03 | B75-S05 |
| B75-R8 | GUI/CLI/Agent同领域、唯一Babylon和左TaskPanel、A/B冻结回退；`ui.channels / ui.engines / ui.scenes / ui.canvases / ui.panel / migration.freezeUnchanged / migration.rollbackRef`；原U4-02 / U4-03 / T5-01 | B75-S05 |

D01 CAD与stock原始`revision/hash/occurrence/frame/unit`只提供D04配准依据；D04 Owner产出`SetupRegistrationRevision`并保留名义Frame。D10执行绑定Owner须另外锁定实际WCS选择、机器原点、G10/G52/G92寄存器快照、有效性与持久化策略、工具测量和控制器方言/版本，返回独立`executionBindingRevision/hash/frame`。D04不得直接写G54或机器寄存器。

候选端口为`StockPartRegistrationPort`→`ExecutionBindingQualificationPort`的**显式只读检查**，并非将两个Owner合并。GUI/CLI/Agent调用同一领域接口，Babylon唯一Engine/Scene/Canvas、左侧UnifiedTaskPanel；3D Frame/ghost仅预览不得提交。写入必须经Owner ACL/CAS/expectedRevision/hash/frame、permissionEpoch/scopeEpoch再次核对，已撤权或取消的晚回执返回STALE且零写入。

多Setup与A/B模式共享同一工程事实，绑定变化精确传播依赖失效但不覆盖冻结D08或签发D16。旧WCS/Frame缺实证只能以legacy UNKNOWN保留只读；新旧Reader并行、旧字节与rollbackRef保留，不能悄然把旧偏置归一后自动批准。C0仅存身份/修订/Hash/单位/Frame/Scope公共包络，不塞入控制器模式解释。

`CL → D12 NC后处理 → D13按确切方言解释执行模态 → D14轴时序 → D15工程验证 → D16发布`。D04 Setup配准与D10实际绑定不得混写，CL或Babylon动画不授予NC PASS；D13语义未知则`UNKNOWN`，D15未验、D16阻断；不做材料扫掠仿真。

## 可机器核对的正反例、来源深度及未完成

[6份分级来源](../../../research/sources/CAP-04-02-offset-evidence-b75.json) → [8规则/字段/原包](../../../research/traces/CAP-04-02-offset-evidence-b75-v08.json) → [24条独立预期案例](offset-evidence-b75-fixtures-v08.json) → [Node只读校验工具](../../../tools/check_cap0402_offset_evidence_b75_v08.cjs) → [验证等级](../../../tracking/cap0402-offset-evidence-b75-verification-2026-11-01.json)。
每规则1候选+2独立反例，含错误选择G55、隐式把G10当选择、同时保存G52/G92、取消回执、Owner缺失、旧版本未知、双Babylon等。V8等价`judge`执行24/24符合期望（8候选、8拒绝、5未知、3过期）；**远端完整Node文件独立进程、真实NC解释、OCCT/B5/OEM/17独立消费者均NOT_RUN**。正式Owner签署0/17，L3待审；历史附件原字节与全仓GFM AST尚未终核。规划PASS≠产品PASS。

**资料阅读边界（访问2026-11-01）：** LinuxCNC 2.9 G-code §14/§16、Coordinate Systems §2–5公开HTML对应段落实读；OCCT 8.0.1 gp_Trsf Inverted/Multiply公开API文本已读但没有运行内核；NIST Franaszek/Cheok 2016/2017只读官方著录和Abstract；Procet CAP-04-02 §1–7为内部规划原文，不冒充外部标准。文件逐条保存作者、版本、时间、URL、章节、深度和局限。
