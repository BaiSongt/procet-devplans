# CAP-04-06｜机床Setup绑定（V0.8实施级详细规划）

原88项第04域第06项：具体机床、工作台、工件安装位姿。L1/L2不变、L3待人类评审；仅规划完成不代表产品通过。

[界面/3D](UI.md) · [D10候选合同](binding.example.json) · [来源](../../../research/sources/CAP-04-06.json) → [规则](../../../research/traces/CAP-04-06.json) → [74例正反验收](fixtures.json) · [独立消费者](independent-consumer-handoff.md) · [理论专题](../../../research/topics/R-MACHINE-BIND-001.md)。

## 业务目标和Owner

D04仅拥有名义工艺Setup、毛坯/夹具基准；D10才拥有具体机床实例、控制器、安装载体、偏置映射及机床执行配置的独立修订。D10候选Owner为04域，D03资源来自02域，05/07/08/09/10各域以exact快照消费。工艺Setup不能代替G54实机偏置，更不能写入控制器。资源名B5或机床型号不能代替真实机器instance、工作台结构和home FK。三轴与五轴都要求真实版本，而不能用网格预览假装FK。

## 十项实施任务

| Task | 功能 | 输入与不变量 | 规则 |
|---|---|---|---|
| T01 | 机器实例和控制器exact绑定 | D03机器、台面、控制器必须固定实例与revision/hash/Frame，名字或B5模板无效 | CAP-04-06-R01 |
| T02 | 工艺与执行双资产 | D04名义工艺Setup不写实际偏置，D10单独修订并仅04域Owner提交 | CAP-04-06-R02 |
| T03 | 父子载体运动链 | MachineBase→Table(q)→Fixture→Part须具名parent-local和home FK | CAP-04-06-R03 |
| T04 | 右手刚体与矩阵乘序 | 列向量左乘、明确from/to、右手det+1、mm/rad；禁止scale/mirror | CAP-04-06-R04 |
| T05 | 控制器偏置适配 | G54/G10只能作指定方言示例，实机偏置及home不明则UNKNOWN | CAP-04-06-R05 |
| T06 | 安装点与非平凡运动学 | 刀具装配exact依赖另见CAP-04-07，五轴头/转台需真实FK/IK证据 | CAP-04-06-R06 |
| T07 | 单Babylon和领域共用Port | GUI/CLI/Agent同受管端口，左侧唯一TaskPanel，预览不写业务数据 | CAP-04-06-R07 |
| T08 | CAS权限与取消回执 | 每次提交重验权限ScopeEpoch/expected revision/hash/CAS/取消；晚ACK不能复活 | CAP-04-06-R08 |
| T09 | 失效回退与冻结保护 | D10改变时按exact边失效D11-D16，不覆盖已冻结D08或历史发布D16 | CAP-04-06-R09 |
| T10 | 最终NC而非CL动画 | D12 NC→D13控制器语义→D14轴时序→D15独立验证→D16批准，未知不得通过 | CAP-04-06-R10 |

## 数据类型与事务端口

候选MachineBindingSnapshot = {projectId, scopeEpoch, revision, contentHash, d04SetupExactRef, d03MachineExactRef, controllerExactRef, tableAndCarrierChain, homeFKRevision, jointStateExactRef, fixtureInstanceExactRef, partOccurrenceExactRef, offsetDialectStatus, toolAssemblyExactRef, impacts, receipts}。ExactRef必须有id、revision、contentHash、sourceFrame/targetFrame、instancePath、unit，不能仅靠name/shapeHash。C0仅共享scope、身份、Frame、单位、revision/hash和协议，L3不在本轮冻结。

MachineBindingPort（04域受管候选）：readNominalSetup、readMachineInstance、proposeBinding、validateNamedFrames、previewInSingleWorld、assessDialect、calculateInvalidations、commitWithCAS、cancelLease、readReceipt、proposeLegacyMigration。GUI/CLI/Agent严格共用Owner Port，任何提交前重新验证ACL、ScopeEpoch、expected revision/hash、依赖摘要、CAS、人类批准和cancelGeneration。取消后晚ACK不重新授权；已真实提交则保存Receipt并对账。RendererPort只绘制，不拥有业务写权限。

## 坐标学与机床链路

列向量左乘：p_M = (^M T_Table(q)) · (^Table T_Fixture) · (^Fixture T_Setup) · (^Setup T_Part) · p_P。每条parent-local边记录from/to、源版本、mm/rad和发生时的joint q。右手SE(3)、det(R)=+1、scale=1，拒绝镜像与缩放。OCCT gp_Trsf::SetTransformation与SetDisplacement不能混用，Babylon显示矩阵不能反写OCCT业务Frame。具有动工作台与动主轴混合机床需分别沿真实运动链组合，不能将回转台简化为静态网格。

## 七步操作和状态机

1. 读取锁定D04/D03/旧D10的exact版本，若缺机床/控制器/载体真实资料显示UNKNOWN。
2. 建立机床实例、工作台、回转载体、夹具和Part occurrence装配草稿，引用CAP-04-07刀具安装候选。
3. 用唯一Babylon世界ghost预览、在左TaskPanel调整，换项目/Setup销毁旧租约，不自动扩展毛坯。
4. 进行Frame正交/乘序、home FK、关节状态及控制器方言检查，失证只允许DRAFT。
5. 展示D09/D11-D16精确依赖失效清单，不覆写冻结D08与历史D16。
6. D10 Owner事务重新授权/CAS提交新修订与回执；失败保留旧数据，允许只读回滚。
7. 后续D09中立CL→D12 NC后处理→D13控制器语义→D14轴时序→D15独立工程验证→D16发布。UNKNOWN阻断，D11/CL动画不能当D15，未实施材料扫掠仿真。

## 可追溯工程门禁

| 规则 | 门禁 | 四字段 | 来源 | 正反 |
|---|---|---|---|---|
| CAP-04-06-R01 | 机器实例和控制器exact绑定 | machine.instance, machine.resourceExact, machine.controllerExact, machine.scopeCurrent | C0406-S01, C0406-S09 | 1正4反 |
| CAP-04-06-R02 | 工艺与执行双资产 | boundary.d04Distinct, boundary.d10NewRevision, boundary.ownerPortOnly, boundary.noMachineWrite | C0406-S04, C0406-S05 | 1正4反 |
| CAP-04-06-R03 | 父子载体运动链 | carrier.parentFrames, carrier.homeFK, carrier.jointState, carrier.tableInstance | C0406-S03, C0406-S06 | 1正4反 |
| CAP-04-06-R04 | 右手刚体与矩阵乘序 | transform.direction, transform.rightHanded, transform.scaleOne, transform.unitKnown | C0406-S01, C0406-S03 | 1正4反 |
| CAP-04-06-R05 | 控制器偏置适配 | offset.dialectExact, offset.homeEvidence, offset.mappingKnown, offset.unknownBlocked | C0406-S04, C0406-S05 | 1正4反 |
| CAP-04-06-R06 | 安装点与非平凡运动学 | kinematic.toolAssemblyExact, kinematic.rotaryChain, kinematic.fkIkKnown, kinematic.noRendererShortcut | C0406-S03, C0406-S06 | 1正4反 |
| CAP-04-06-R07 | 单Babylon和领域共用Port | interface.singleWorld, interface.leftTaskPanel, interface.sharedOwnerPort, interface.previewReadOnly | C0406-S03, C0406-S09 | 1正4反 |
| CAP-04-06-R08 | CAS权限与取消回执 | commit.aclCurrent, commit.scopeCurrent, commit.casCurrent, commit.cancelGenerationCurrent | C0406-S07, C0406-S08 | 1正4反 |
| CAP-04-06-R09 | 失效回退与冻结保护 | impact.edgesExact, impact.d08FrozenPreserved, impact.d16HistoricalPreserved, impact.rollbackAvailable | C0406-S08, C0406-S09 | 1正4反 |
| CAP-04-06-R10 | 最终NC而非CL动画 | verification.ncExact, verification.d13Known, verification.d14Axes, verification.d15Independent | C0406-S05, C0406-S06, C0406-S09 | 1正4反 |

## 迁移和真实验收边界

旧绑定若缺MachineInstance、home FK、控制器偏置读回、工具装配或Frame方向，一律legacyRaw只读保存；生成migrationProposal+rollbackRef，待独立消费者ACK与人类批准切写，NACK恢复旧只读。跨域消费者提交产品exact HEAD、资产exact revision/hash/Frame、故意错版本/取消/控制器未知反例及真实回执。静态校验入口node tools/check_cap0406_planning.cjs；74例仅V8内存合成。真实Node文件进程、OCCT、三轴/B5、NC与控制器、独立消费者NOT_RUN，17资产Owner正式会签/L3 PENDING_HUMAN。规划PASS≠产品PASS。
