# CAP-02-06｜测量与检测资源

版本：0.1（2026-10-17）；状态：**规划编制完成／待人类评审；产品实现与验收均未执行**。沿用[原88项编号](../../architecture/v0.8/03_三级能力映射_88项.md)，本项为长期扩展能力，不列入3轴＋B5 MVP已实现范围。关联：[界面规格](UI.md)、[理论专题R-MET-001](../../../research/topics/R-MET-001.md)、[机器追踪](../../../research/traces/CAP-02-06.json)、[F1-01](../../work-packages/F1-01.md)、[F1-02](../../work-packages/F1-02.md)，F1-06尚待细分。

## 一、目标、用户与明确边界

资源工程师维护量具、接触式工件测头、对刀/测刀装置、三坐标机及检定用参考件的**能力档案**；计量人员维护校准记录及其所声明的有效条件；工艺工程师在Setup或检测准备阶段选定具体资源修订并核对适配；现场操作员采集原始观测；质量工程师依据相应的不确定度及判定规则解释结果。本CAP只提供可复用的**D03资源能力与资格查询**，不把测量计划、测量结果或NC控制器执行语义混入资源定义。

| 数据 | Owner和状态 | 本CAP的交接 |
|---|---|---|
| D01设计基线与PMI | 03域 | 受控图纸、特征、规范值/公差/基准，不由测头定义改写 |
| D03测量资源能力 | 02制造资源 | 仪器型号／能力、接触组件、接口、几何、传输、可用工况和exact修订 |
| D04工艺Setup | 04域 | 工件／夹具/基准位置、可选测量场景引用；不包含本次实际读数 |
| D10机床执行配置 | 04域引用02域 | 具体机床、主轴／接收器、控制器与测头装配及偏置；不假定资源即兼容 |
| D12–D14 NC链路 | 08／09域 | 若执行在机探测，必须从具体NC程序经D13控制器语义解释至D14轴运动；缺语义显式unsupported |
| D15程序验证 | 09域 | 已建模程序行为的验证，不证明实际测量合格 |
| D17现场执行与检测反馈 | 10域 | 原始观测、方法、判定、不确定度和审批证据；不得直接重写D03或冻结工艺 |
| D16发布 | 10域 | 明确引用适用的检测/执行证据；本CAP不赋予上机许可 |

**关键区别**：资源“重复性”不是本次测量的不确定度；校准证书存在不是所有产品特征已可判定；测量点可在3D中模拟不是实际探测动作；CL可达性不是执行侧G31/循环宏等控制器语义已建模。这些都必须在GUI以独立状态显示。

## 二、实时源码复核（观察，不是产品验收）

2026-10-17读取BaiSongt/procet-resources `develop@b861efee9c84a99eba1fbee2c8749e60576fb93f`：

- [E-MET-01 / resources/types.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/types.rs)：`ManufacturingResourceKind`只有Machine、Cutter、Holder、ToolAssembly、Fixture、WorkholdingBase、FixtureAssembly、PostProcessor八种；**没有**Probe、Gauge或CMM kind。已经有业务revision、draft lock、Released/Obsolete及exact `ManufacturingResourceRef`，但不能直接声称检测资源已接入此合同。
- [E-MET-02 / resources/dispatch.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/dispatch.rs)：typed发布分发器对八种kind逐项处理，PostProcessor缺配置时fail-closed。因此扩展测量kind须同步设计typed表、校验、发布、派生、迁移、GUI消费；**禁止仅添加enum并绕过发布门**。
- [E-MET-03 / resources/mod.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/mod.rs)：现有资源模块没有measurement/probe/gauge专用子模块；本轮未核对老主仓或所有外部插件，不推论整个产品永远没有测量功能。

研发设计选择：短期可有`legacyExternalResourceRef`的**只读目录适配器**，但不可伪造原生Released身份；正式写入须通过02域受控版本升级。不同设备kind必须具有明确能力标记，避免把刀具测量和工件测量、离线CMM和主轴触发测头合并成万能Probe结构。

## 三、7项子能力与流程

| 子能力 | 领域交付与适用边界 |
|---|---|
| MET-01 目录与精确版本 | 类别、用途、兼容性、状态与原始资料；按exactRef查历史，不能latest漂移 |
| MET-02 测量组件与装配 | probe body、stylus/tip、对刀头、接收器、安装接口、绝对局部Frame及长度校准引用；不得直接复用切削刀的TCP假定 |
| MET-03 能力、误差和条件 | 触发/扫描/激光等能力、量程、方向、环境、相关性能指标的**量纲、统计定义、有效条件与证据** |
| MET-04 校准与资格 | 校准结果引用、时间/有效期（依校准策略）、适用组件、校准链和当前可用资格；过期不会覆盖历史检测事实 |
| MET-05 机器/控制器兼容预检 | 机床精确修订、信号接口、受支持指令/模式、坐标链及接收器；不可依据品牌名称猜测 |
| MET-06 选择、3D预览与采用 | Setup/检测任务的临时选择→只读空间预览→显式确认精确资源/校准证据→消费方修订；预览不产生NC |
| MET-07 来源、变更与反馈 | 组件替换、校准过期、版本退役和结果证据影响矩阵；D17只能通过受控变更回流规划 |

**主流程**：从资源目录筛选→打开精确版本→核对装配/技术资料/计量资格→进入单Babylon资源空间预览→从Setup选用时建立callerScope及显式安装候选→预检机床/接收器/控制器语义→显示unknown/blocked/pass按检查项分别反馈→用户确认→业务服务校验expectedRevision、资产闭包、资料用途和幂等requestId→生成下游引用回执；不直接生成或运行测量宏。

**替代流程**：离线CMM/手持量具仅建立资源档案，不要求绑定机床；没有数字接口时可记录受控人工录入渠道与录入人/时刻，但不能伪造设备原始流。A模式允许资源候选和能力假设，但清楚标experimental；B模式正式采用受有证据的门禁限制，不静默复制A的批准状态。

**异常流程**：旧工程的测头型号只有字符串时标legacy_unresolved；两位用户编辑相同草稿返回revision_conflict并保留编辑缓存；资料或证书丢失返回缺失闭包而非默认合格；D10变动则相关执行资格stale；切换Setup后晚到结果被scope/epoch拒绝；断网/现场未提供校准数据时允许只读，不默认继续可执行资格。

## 四、数据契约：C0公共引用＋C1测量领域（提案，非现存API）

| 对象及必需字段族 | 责任归属 | 约束 |
|---|---|---|
| MeasurementResourceDefinition | 02域C1 | `resourceExactRef`、kind、maker/model+source、capabilityModes、interfaceRef、geometryPurpose、metadataVersion |
| ProbeAssemblyRevision | 02域C1 | body/stylus/tip/extension等各自exactRef；`mountFrameRef`、`tipCenterFrameRef`；球半径/方向必须有标定或资料来源 |
| MeasurementCapabilityClaim | 02域C1 | quantityKind、value、unit、statisticDefinition（如2σ）、confidenceContext、testMethod/source、conditions、validScope；未证实填unknown |
| CalibrationEvidence | 计量证据Owner经授权导入，02域只保存引用 | reportHash、instrument/component exact IDs、measurementDate、expiryPolicy/nextDue（如适用）、referenceChain、uncertainty、applicability；不把证书PDF硬编码进定义 |
| MeasurementSelection/Eligibility | 消费方（D04/D10或独立检测应用用例） | input exactRefs、scope、time、controller capability、calibration evidence、check result和原因；决策按检测时点/策略保存 |
| InspectionPlan与Observation/Decision | 未来质检/10域D17或另经评审的受控对象 | characteristic/PMI exactRef、points/frame、method、raw results、uncertainty、decisionRuleRef、outcome、provenance；**不是**本CAP目录的可写子表 |

若新增业务资产仅作为D17下的typed领域对象评审，不能在17项分母之外悄悄创建D18。标称数值以源文件单位保留；几何以mm与声明Frame；采集值带统一量纲转换记录，误差/重复性`µm`与`mm`在边界一次换算。当前有效资格需要现场时间与设备/校准匹配，不由资源`Released`推导。

### 拟议逻辑端口与事件（并非现有Tauri/Rust函数）

| 用例 | 输入 | 结果/失效 |
|---|---|---|
| QueryMeasurementResources / GetExactMeasurementResource | kind、用途、exactRef、分页 | 目录只读快照、支持模式、缺证提示；不隐式latest |
| Draft/Validate/ReleaseMeasurementResource | typed定义、lock、批准策略 | draft/new exactRef或结构化拒绝；发布不等于某测量通过 |
| ResolveProbeAssembly | body+tip+extension exactRef、interface/frame | 合法变换链、装配完整性或unknown；无暗中单位矩阵 |
| AssessMeasurementEligibility | measurementIntent、D10（可选）、exact组件、时间、calibrationRef、controllerProfile | 分项pass/failed/unknown/unsupported；不发布测量许可 |
| PreviewMeasurementPlacement | callerScope、geometryRefs、frameRef、参数、previewId | 临时3D位置/示意接触点与风险，不保存D04 |
| AdoptMeasurementResource | expectedConsumerRevision、exactRefs、requestId、scope | 受控消费者新修订＋回执；不改D03 |
| ExportQualityResourceMetadata | target=QIF profile、schema版本、sourceRefs | 可表达字段清单和缺失字段；不得把部分QIF DTO宣称完整互操作 |

GUI/CLI/Agent共用受Host管理的领域入口。保存草稿、发布资源、采用到Setup、现场记录四种事务分别授权。异步结果需检查`scope + epoch + inputFingerprint`，重试用requestId查原回执，不重复提交。事件通知（`resourceRevisionReleased`、`calibrationEvidenceChanged`、`eligibilityStale`）不是第二份持久化真值。

## 五、理论驱动的设计规则

- **MET-R01 测量类别边界**：在机工件测头、接触/非接触对刀仪、CMM和手动量具资格必须区分。ISO 230-10:2022在机探测系统测试**不等于**机床作为CMM的完整测量性能评定。[SRC-MET-001/002/003]
- **MET-R02 性能定义带测试条件**：厂家`1 µm 2σ`重复性示例不能直接填成绝对定位精度、所有探测方向的总系统不确定度或每次的计量保证。[SRC-MET-008]
- **MET-R03 校准与结果分离**：计量溯源属于测量**结果**的属性；要有文档化不中断校准链及各环节不确定度，不是简单贴“溯源到某机构”标签。[SRC-MET-007/010]
- **MET-R04 不确定度与判定规则**：接近规格上下限的合格/不合格判定必须考虑适用的测量不确定度及经批准的判定规则；资源额定误差不能直接替代本次不确定度。[SRC-MET-004/005]
- **MET-R05 计划/资源/结果分层**：QIF是制造质量数据交换模型，区分资源、测量计划、结果；本CAP的QIF导出仅为未来适配，不宣称已实现ISO 23952完整互操作。[SRC-MET-006]
- **MET-R06 生命周期与资格分离**：资源Released/Obsolete是目录生命周期，校准状态和某时刻某用途的适用性独立；历史证据保留原时点。测量管理体系要求与软件状态机的映射属于本项目设计。[SRC-MET-009及E-MET-01]
- **MET-R07 装配Frame及可达性**：针尖参考点、校准有效半径、机床主轴装配与测量坐标系分开；单纯几何接触预览不证明探测采集可靠。以F1-02数学口径构造精确帧链。[E-MET-01；F1-02内部推导]
- **MET-R08 语义不可绕过**：在机测量NC及其宏/模态、跳转信号等未经D13验证时必须unsupported，不能由CL或3D动画伪造D17检测结果。[Procet内部架构红线]
- **MET-R09 精确引用和异步隔离**：旧资源、校准证据、测针组件和消费方修订保持exact身份；取消/重试/切换工程不写错对象，校准变更只使相关资格stale。[E-MET-01/02；F1-01设计规则]
- **MET-R10 部分资料安全退出**：无可用校准、未知接口、量纲或适用环境、损坏证书与未支持测量模式，独立返回unknown/blocked；显示模型并不等于计量资格。[SRC-MET-007/009；内部规则]

**依据边界**：上述ISO来源大多只读官方目录与摘要，未获得付费正文，不能捏造条款、公差/不确定度公式或“已符合ISO”。产品化必须获得有权使用的相关完整标准和实际设备手册，核定装夹/信号/测试条件。

## 六、失效传播、版本兼容及范围

资源组件改修订→相应装配/资格需重核；证书更新→影响对应设备、组件、时点/工况及测量结果引用，历史结果不原地改写；D10机床/控制器/接收器改变→在机探测资格、NC解释与运动检查待复核；D01 PMI改变→检测计划与判定新版本；仅改变相机/主题→不修改任何制造事实。

若检测结果未来通过D17反馈D05/D06，必须显式形成工程变更决策，不自动调工序、偏置或发布新NC。动态偏置自动修正属于**独立受控执行行为**，本CAP不实现。仪器支持manual-only、CMM-offline等不要求制造Setup，但存储和审批的Owner需单独审查。

迁移策略：先catalog只读/legacy adapter→原生typed能力提案与兼容分发表→新writer灰度→真实消费方端到端；旧资源reader保留、未知kind fail-closed，不对历史结果重设版本。回退先停新writer，保留旧reader和备份，不以删除表清理工程。F1-06离线闭包必须包含计量报告Hash、组件与资源引用、使用时的资格证据及测量原始附件（按D17消费需求）。

## 七、产品正反验收（**全为规格，NOT_RUN**）

| ID | 验收条件与期望 |
|---|---|
| MET-T01 | 工件触发测头、对刀仪、CMM和手动量具可区分且过滤；未知kind不当成probe |
| MET-T02 | 无原生typed发布能力时提交Measurement kind必须阻断，不能仅增enum假发布 |
| MET-T03 | Released r1退役、r2发布后，旧Setup与检测事实仍exact引用r1 |
| MET-T04 | 修改测针球头或加长杆后产生新装配修订，受影响的calibration/eligibility待复核 |
| MET-T05 | 2σ重复性字段保留原统计定义，不能显示成整机绝对精度或测量不确定度 |
| MET-T06 | 设备资料无测试温度/方向/量程时，超出或未知适用范围给unknown |
| MET-T07 | 证书有效期或适用组件与本次不符；仍可看目录，但生产资格blocked/unknown |
| MET-T08 | 校准链中的必要报告/不确定度缺失；不显示“已溯源认证” |
| MET-T09 | 相同型号不同序列设备的校准不能互换；缺序列号不能按型号推定 |
| MET-T10 | 在机测头被选中但没有受支持接收器/控制器语义；预览可看，执行能力unsupported |
| MET-T11 | F1-02非单位父Frame下的球心与触发方向正确；错误/NaN/镜像Frame拒绝 |
| MET-T12 | 同输入重复三次自动定位无增量平移；预览、取消均不写D04 |
| MET-T13 | A工程返回晚于切换到B；A的查询/预览回执不能修改B草稿 |
| MET-T14 | 对公差边界附近的合格性只给测值，无不确定度/判定规则时，不输出确定合格 |
| MET-T15 | 仅离线CMM或手动量具可建立目录，不强制要求NC接入或机床资源 |
| MET-T16 | QIF映射存在不支持字段时列出gap，不宣称已完成ISO 23952文件互操作 |
| MET-T17 | 校准证书撤销/重新标定不覆写历史D17观测，相关新使用资格标stale |
| MET-T18 | 只上传显示网格无精确资产/配合来源，3D可显示但精确碰撞/触发验证不能通过 |
| MET-T19 | 只有CL预览或模拟探测动画、没有最终NC解释与实际观测时，D15/D17不得假通过 |
| MET-T20 | 离线恢复缺计量报告或同身份异内容，阻断所依赖资格而旧工程保持可用 |

全20条必须在真实领域端口、跨版本恢复及GUI/E2E中执行，当前均未执行。应包含“正常量具只读登记、合法装配、原始证据导入”等正向case，也包含每项对应的缺数据/错版本/错帧/未知语义负例。相关工作包：F1-01统一引用、F1-02 Frame、F1-06离线闭包、E3-03 NC执行语义、E3-04轴运动，D17质检接入作为长期扩展评审项。

## 八、实施切口、审查与退出

MET-I01盘点现有老仓/GUI/测量系统消费者（02 Owner＋质量评审）；MET-I02资源typed kind/兼容分发和发布/派生（02 Owner＋数据库评审）；MET-I03组件、量纲/Frame与证书关联（02/04＋计量评审）；MET-I04适用性Evaluator，仅分项报告（02/09＋制造现场评审）；MET-I05单世界UI与作用域隔离（GUI Owner＋领域消费方）；MET-I06 D10/D13/D17受控桥接及离线恢复（08/10＋质量评审）；MET-I07真实设备与独立样例验收（质检、现场、独立验证者）。阶段退出需完成对应范围内的真实测试、明确不支持能力；该长期CAP的全量完成不作为当前MVP交付声明。

### 当前待决策/工程阻断

1. 谁有权批准校准证据、暂停设备与复核临界判定？需质量体系Owner指定。
2. 具体测头、接收器、控制器、测针和量块资料是否齐全？无资料不能填接线/探测宏语义。
3. 标准全文、实际不确定度模型、反射面/温度/夹持影响是否获得并核验？只读目录不能冻结工程准入。
4. 新测量kind的资源存储与D17检测结果的schema/生命周期及QIF适配，尚需跨域L3评审；不自行冻结L4 API。

## V0.8新补证与独立消费者（2026-10-28）

本章节链接新的[8项来源](../../../research/sources/CAP-02-06.json)、[10条规则/40字段](../../../research/traces/CAP-02-06-v08-supplement.json)、[50正反+4数学合成+8待执行状态](research-fixtures-v08.json)、[完整研究边界](RESEARCH-TRACE-2026-10-28.md)、[独立消费和回退](independent-consumer-v08.md)。保留原MET-T01..20及SRC-MET-001..010，不覆盖旧追踪。规划静态验证不代表已实施或计量合格。


## B52增量｜相关不确定度与D17候选判定（2026-10-31）

[相关不确定度数值反例](COVARIANCE-DECISION-B52-2026-10-31.md) → [8来源](../../../research/sources/CAP-02-06-covariance-b52.json) → [9规则](../../../research/traces/CAP-02-06-covariance-b52-v08.json) → [47合成](covariance-b52-fixtures-v08.json) → [测试入口](../../../tools/check_cap0206_covariance_b52_v08.cjs)。原MET规则、资产分母与Owner职责不变；本段新增候选守护带的内生审批边界。独立消费者、校准证书、Node文件/真实机床仍NOT_RUN。
