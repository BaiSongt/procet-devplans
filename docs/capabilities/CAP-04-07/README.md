# CAP-04-07｜刀具安装关系（V0.8实施级详细规划）

原88项第04域第07项，原始目标：“主轴端、刀柄、刀具总成、TCP偏置”。L1/L2保持不变，L3 **PENDING_HUMAN**，本文件是施工规格而非产品认证。

[GUI/3D](UI.md) · [候选合同](tool-mount.example.json) · [来源](../../../research/sources/CAP-04-07.json) → [规则/字段](../../../research/traces/CAP-04-07.json) → [80合成验收](fixtures.json) · [跨域交接](independent-consumer-handoff.md) · [研究专题](../../../research/topics/R-TOOL-MOUNT-001.md)。

## 责任与数据边界

- **D03（02域Owner）**：刀柄/刀具/延长杆资源、接口尺寸类别、资源几何、能力及内容修订，不因某个工程使用而改写目录原件。
- **D04（04域Owner）**：名义Setup、毛坯、夹具、工艺Frame；不可写入实际机床偏置或工具表。
- **D10（04域候选Owner）**：在特定机床实例和刀位上所选刀柄+刀具的**安装实例**、gauge基准、量测证据、TCP与控制器映射的引用快照。D10是独立新修订，必须绑定CAP-04-06的机床/主轴精确版本。
- **D12/D13（08域）**：后处理结果与控制器执行语义。H补偿、G43/G43.1/G43.2/G49是否生效属于有版本的D13解释，不得在几何模型中偷偷重复加H。
- **D14/D15（09域）**：以D13和真实运动链展开轴时序，再进行**独立**工程验证。D11/中立CL动画不能充当D15；未建模语义=UNKNOWN，阻断D16发布。
- D08已冻结工艺以及历史D16发布均不得覆写；A/B只能基于同一事实提出新候选，不能互相静默覆盖。

## 十项实施任务与可机检规则

|任务|施工定义|工程约束|规则|
|---|---|---|---|
|T01|接口规格和兼容矩阵|02域D03主轴端与刀柄端均使用具名接口+exact revision，机床品牌或外观相似不能判兼容|CAP-04-07-R01|
|T02|刀具组件全链装配|SpindleMount→Holder→Extension(optional)→Tool→Tip必须逐边固定from/to Frame、修订与插入/夹持证据|CAP-04-07-R02|
|T03|Gauge Length及参考基准|Gauge Length是具名量测基准面至特定TCP的轴向距离；刀具伸长量、刀柄长度、总长禁止混用|CAP-04-07-R03|
|T04|刀轴和TCP刚体变换|列向量左乘，主轴载体→刀柄→刀具→TCP；显示矩阵与缩放/镜像不得回写业务Frame|CAP-04-07-R04|
|T05|实际装配与机床执行隔离|D03库中工具定义不等于D10已装机的T位/刀柄/伸长量，D04名义Setup不写D10或控制器刀表|CAP-04-07-R05|
|T06|刀长H与程序执行语义|T换刀、G43 H、G43.1/2与G49解析由08域D13按控制器版本解释；H不是Gauge Length通用别名|CAP-04-07-R06|
|T07|碰撞包络与可达性输入|总成网格仅表现；Holder/Extension/Tool有效包络按D03/D10精确版本给D14/D15独立消费者|CAP-04-07-R07|
|T08|三入口与统一GUI|GUI/CLI/Agent调用04域ToolMountPort，单Babylon世界+左TaskPanel，3D交互仅租约式只读预览|CAP-04-07-R08|
|T09|CAS取消撤权与业务回执|提交由04域Owner重复校验ACL、ScopeEpoch、expected revision/hash/Frame、CAS和取消代；晚回执不复权|CAP-04-07-R09|
|T10|失效图、NC验证和回退|换装配新D10仅使下游依赖D11-D16失效，冻结D08和旧D16不覆写；D13 UNKNOWN/CL_ONLY不可发布|CAP-04-07-R10|

## 装配、Gauge Length与TCP

统一采用**具名右手刚体Frame**，内部长度mm、角度rad、列向量左乘；此为Procet内部契约，不冒称ISO强制具体乘序。若T表示从子Frame到父Frame的齐次变换，则 `p_machine = T_machine_spindle(q) · T_spindle_holder · T_holder_extension · T_extension_tool · p_tcp`。可选延长杆缺失时用经验证的直接接口边，不得用默认零矩阵。

**Gauge Length**：在定义明确的**主轴/刀柄量测基准面**沿具名刀轴至特定TCP的轴向量测值及其修订；**Stickout**是工具相对于刀柄夹持出口的伸出量，刀柄产品总长、名义Gauge和控制器当前H有效补偿均是不同量。必须记录datum、tip类型、测量仪器/日期/来源、单位、测量版本和可选不确定度；没有真实测量时显示 UNKNOWN，禁止凭视觉Mesh给实机安装合格结论。角度头、偏心刀具和多TCP需扩展帧链，不能套用简单Z轴长度。

合成几何Oracle仅测试 `tip = gaugePlaneOrigin + gaugeMm * unitToolAxis`；它不是机床运动学、H模态或碰撞许可。真实FK、刀具包络和测量需消费者另行执行。

## 工作流和端口

1. 从02域读D03 exact机床主轴接口、刀柄与刀具资源版本；未知接口类别/锁紧装置→UNKNOWN，不能仅凭品牌或Mesh匹配。
2. 从04域读CAP-04-06 D10机器/主轴实例和D04名义Setup，明确三份互不覆盖的版本。
3. 在左侧统一TaskPanel编辑刀柄→延长杆→刀具组件，唯一Babylon世界里ghost预览及实时Gauge/刀轴矢量，但所有预览为只读租约。
4. 录入装配量测基准、实测Gauge与量测证据，检查Frame右手性、工具方向、接口兼容、刀具包络与主轴上限；不足则保持DRAFT/UNKNOWN。
5. 将T位/刀表/H映射声明为候选，08域按指定控制器方言和D12最终NC读取后重新解释，禁止由GUI自行写机床刀表。
6. 在提交前列出D10改变引发的D11-D16 exact失效边和独立消费者，确认D08及历史发布字节不动。
7. GUI/CLI/Agent共用受管**04域ToolMountPort**：readAssembly、readMachineBinding、proposeMount、validateFrames、previewLease、assessToolCompensationDialect、calculateInvalidations、commitWithCAS、cancelLease、readReceipt、proposeLegacyMigration。
8. Owner事务提交重新核对ACL/ScopeEpoch/expectedRevision+Hash+Frame、CAS、依赖闭包、人类授权与cancelGeneration；取消后迟到ACK不恢复写资格，取消前真实已提交必须保存Receipt并对账。
9. 刀具拆装、伸长量变化、重新对刀、资源修订仅产生新D10 Revision，旧装配及冻结快照保留；legacyUnknown只读隔离并附rollbackRef，迁移消费者NACK不切写。
10. 由真实D12 NC→D13解释(包含H/换刀/未知指令)→D14轴时序→D15工程验证→D16签发；CL-only或推定机床动作绝不放行。**不做材料扫掠仿真**。

## 四十个机器可检字段

- **CAP-04-07-R01**（C0407-S01、C0407-S02，F1-02/F1-04/W2-05/E3-04/U4-02）：`interface.spindleExact`、`interface.holderExact`、`interface.matingEvidence`、`interface.unsupportedBlocked`，1正例+4单字段反例
- **CAP-04-07-R02**（C0407-S01、C0407-S07，F1-02/F1-04/W2-05/E3-04/U4-02）：`assembly.orderedChain`、`assembly.parentLocal`、`assembly.componentExact`、`assembly.retentionKnown`，1正例+4单字段反例
- **CAP-04-07-R03**（C0407-S05、C0407-S06，F1-02/F1-04/W2-05/E3-04/U4-02）：`gauge.datumExact`、`gauge.measuredRevision`、`gauge.axisAndUnit`、`gauge.notStickout`，1正例+4单字段反例
- **CAP-04-07-R04**（C0407-S03、C0407-S07，F1-02/F1-04/W2-05/E3-04/U4-02）：`tcp.fromToFrames`、`tcp.rightHanded`、`tcp.transformOrder`、`tcp.assemblyAxisKnown`，1正例+4单字段反例
- **CAP-04-07-R05**（C0407-S01、C0407-S06，F1-02/F1-04/W2-05/E3-04/U4-02）：`boundary.d03CatalogUnchanged`、`boundary.d04NominalSeparate`、`boundary.d10RevisionNew`、`boundary.noControllerWrite`，1正例+4单字段反例
- **CAP-04-07-R06**（C0407-S05、C0407-S06，F1-02/F1-04/W2-05/E3-04/U4-02）：`controller.dialectExact`、`controller.toolTableExact`、`controller.offsetStateKnown`、`controller.unknownFailClosed`，1正例+4单字段反例
- **CAP-04-07-R07**（C0407-S04、C0407-S07，F1-02/F1-04/W2-05/E3-04/U4-02）：`safety.holderEnvelopeExact`、`safety.toolEnvelopeExact`、`safety.installedPoseExact`、`safety.noMeshCertification`，1正例+4单字段反例
- **CAP-04-07-R08**（C0407-S07、C0407-S10，F1-02/F1-04/W2-05/E3-04/U4-02）：`ui.singleBabylon`、`ui.unifiedLeftPanel`、`ui.ownerPortShared`、`ui.previewReadOnly`，1正例+4单字段反例
- **CAP-04-07-R09**（C0407-S08、C0407-S09，F1-02/F1-04/W2-05/E3-04/U4-02）：`commit.aclCurrent`、`commit.scopeEpochCurrent`、`commit.casAndDependencies`、`commit.cancelLeaseCurrent`，1正例+4单字段反例
- **CAP-04-07-R10**（C0407-S05、C0407-S10，F1-02/F1-04/W2-05/E3-04/U4-02）：`handoff.invalidationsExact`、`handoff.frozenD08Preserved`、`handoff.d15NCIndependent`、`handoff.rollbackAndAck`，1正例+4单字段反例

静态检查入口：`node tools/check_cap0407_planning.cjs`，覆盖50字段、24状态、6数学=80项合成；它不触达真实产品。所有正式Owner签字、L3审核、量测、机床控制器、Node独立文件执行、消费者ACK和产品验收仍须分别记录为PENDING_HUMAN/NOT_RUN。**规划PASS≠产品PASS**。
