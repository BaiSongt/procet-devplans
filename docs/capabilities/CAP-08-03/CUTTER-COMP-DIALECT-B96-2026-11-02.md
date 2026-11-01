# B96｜CAP-08-03 G41/G42刀具半径补偿的跨控制器执行语义

日期：2026-11-02。性质：**研究补证及规划合同（NEWLY_AUTHORED）**，不替代旧CAP原件、L3人工批准或真实控制器。原工作包 **E3-02、E3-03、U4-04**；主Owner **D13**（解释最终NC）；D03是刀具资源，D04是名义Setup，D10是物理安装与控制器绑定，D09仍为中立CL。

## 1. 本轮新增的差异及合法证据

1. **LinuxCNC 2.9**：[G-code §25–27](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)在G41/G42中D编号可选，G17或G18允许而G19报错；G41/G42进入运动至少为**当前刀具半径**，G40关闭后的**下一条直线运动大于刀具直径**，且不能紧跟G2/G3。该规则只适用于固定LinuxCNC 2.9来源版本（B96-S01），不应自动转嫁Haas/FANUC。LinuxCNC [2.8 Tool Compensation §3](https://www.linuxcnc.org/docs/2.8/html/gcode/tool-compensation.html)用图文说明转角路径受下一段影响，仅作为旧版几何解释（B96-S02）。
2. **Haas铣床**：[官方Mill G-Codes Cutter Compensation](https://haascnc.com/service/online-operator-s-manuals/mill-operator-s-manual/mill---g-codes.html)要求G41/G42带D补偿号；**Setting 40**决定刀补表按直径或半径解释，几何和磨耗相加；负值会使有效左右侧翻转。平面G41/G42圆弧补偿限G17，而G141是单独3D能力，不等于直接允许G18/G19。**Setting 58** Fanuc/Yasnac会改变拐角策略，不能在未知时推断相同刀具中心线。进入/退出应按官方所述G01满足刀具半径条件，并针对小于有效刀具半径的内弧做失败判定（B96-S03/04/05）。
3. **NIST**：[Kramer、Proctor、Messina，NISTIR6556（2000）](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3)本轮仅阅读官方出版摘要，它确认解释器将NC转为canonical machining functions，不提供本轮实读的刀补数值条款；不得将其当作Haas控制器认证。RFC9110 §13与W3C PROV-O §1/3的公开选段仅支撑业务修订条件及来源表示，**不是数控语义标准**。

全部9项来源的作者、版本、时间、网址、章节、访问深度及限制见 [登记表](../../../research/sources/CAP-08-03-cutter-comp-b96.json)，不包含付费标准正文。

## 2. 可证伪数学与差异反例

- Haas设置40为`DIAMETER`，几何`4.0 mm`、磨耗`0.2 mm`时，`r_eff=(4.0+0.2)/2=2.1 mm`；如设置为`RADIUS`，几何`2.0 mm`、磨耗`0.1 mm`也得到`2.1 mm`。字段需同时冻结显示单位、设置40、表字节哈希与来源，不能以同一个表值跨设置复用。
- Haas `G41`且**有效有符号刀补负值**时，左/右效果翻转为RIGHT。数学Goldens只验证符号逻辑，不宣称机床刀补表已加载。
- 规划合成半径`2.1 mm`、退出直线`2.1 mm`：Haas官网的**半径进入/退出规则**可达名义长度下限；LinuxCNC 2.9的**G40下一直线必须大于直径4.2 mm**，故同一退出长度应拒绝。该值为合成反例，不是工艺安全间隙。对Haas外圆角、尖角、Setting58及G141不从当前数学判定器宣称成功。
- 对内弧半径<有效刀具半径的Haas条件拒绝；**等于半径时返回UNKNOWN**，因为边界/数值/实体干涉未被独立证明；这项保守UNKNOWN是Procet内生设计，而非厂商原文阈值解释。

## 3. D13 Typed合同与失效图

从`{d12FinalNcBytesHash,d13DialectProfileExact,d03ToolExact,d04SetupExact,d10PhysicalBindingExact,toolOffsetTableHash,setting40,setting58,plane,sourceByteSpan,executionOccurrence,frameHash,scopeEpoch}`生成`CompensationOccurrence{before/after,code,D,rawGeometry,rawWear,normalizedSignedRadius,side,leadIn/Out,cornerMode,sourceHash,semanticStatus}`。**D13先重读最终NC**；缺固件/选件/刀补表/Setting40/58、外部程序闭包或完整初始模态时返回`UNKNOWN`，不把旧D09可视化刀路作为刀具中心线认证。

只写对应Owner：D03资源档案，D04名义工艺Setup，D10实物装夹与WCS/刀补快照，D12最终NC原始字节，D13解释执行语义，D14按实际机床运动链生成轴时序，D15独立工程验证，D16人工授权发布。**D09中立CL→D12 NC→D13→D14→D15→D16**；D11 CL动画只标预验证；本轮不做材料扫掠仿真。

GUI、CLI、Agent使用08域唯一Owner Port；一个Babylon Engine/Scene/Canvas、统一左UnifiedTaskPanel、最大字号12px、仅浅/深主题。切换方言、Setting40/58、刀具或表修订须使D13-D16旧资格STALE，保留D08冻结与发布历史。提交瞬间重验CAS、ACL、Frame、scopeEpoch、取消代次与回执；晚回执不得写新修订。旧数据`LEGACY_UNRESOLVED`只读，Expand→Migrate→Contract在真实独立消费者验收后收缩，回退非破坏。

## 4. 机器验收、等级与独立消费者交接

[9来源](../../../research/sources/CAP-08-03-cutter-comp-b96.json) → [9规则/字段/原包](../../../research/traces/CAP-08-03-cutter-comp-b96-v08.json) → [38合成正反与UNKNOWN/3数学Golden](cutter-comp-b96-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0803_cutter_comp_b96_v08.cjs) → [测试等级](../../../tracking/cap0803-cutter-comp-b96-verification-2026-11-02.json)。独立消费者E3-03/D14、U4-04/D15须用固定LinuxCNC 2.9和目标Haas实际Profile重放正反NC，读取刀具/刀补表、Setting40/58及完整模态，核对实际解释与轴时序；再做D16权限、取消晚回执及旧Reader回退验证。

**限制**：38项本轮仅V8同一`judge`规划合成，不是独立异构Oracle；独立Node磁盘执行、真实LinuxCNC/Haas/B5/OEM、17资产正式签署与真实消费者、全仓GFM AST/锚点、历史附件字节均未完成。L3待人类审批。**规划PASS≠产品PASS。**
