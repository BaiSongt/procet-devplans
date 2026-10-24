# CAP-02-08｜资源能力与兼容性：任务需求到资源候选的可解释判定

**版本** v0.1（2026-10-17）；**状态** 详细规格已编制、待跨域评审；产品尚未实现与验收。保持原88项中的CAP-02-08编号，关联F1-02、F1-06、E3-04；与[交互规格](UI.md)、[理论依据](../../../research/topics/R-RC-001.md)、[规则追踪](../../../research/traces/CAP-02-08.json)、[合成验收样例](fixtures.json)一同评审。

## 一、业务目标与责任边界

资源工程师维护已发布版本的**可证明能力事实**，工艺工程师提出单次工序或Setup的**可满足条件**，资源筛选器给出**理由清晰、可复现、区分未知与不兼容**的候选；机床执行适配、后处理、仿真和生产批准仍由各自领域实施。资源库回答“具有什么能力”，不直接宣告“这套NC可以上机”。

主要参与者：资源工程师（D03）、工艺工程师（D04/D05/D08）、Solver/刀路消费者（D06/D09）、执行配置工程师（D10）、NC后处理与控制器语义Owner（D12/D13）、独立验证者（D11/D15）、发布审查者（D16）。AI和CLI必须与GUI共用领域查询入口，并带相同的输入指纹。

八项内部子能力（不增加88的总数）：RC-01声明及证据归档；RC-02轴运动与加工模式能力；RC-03刀具-主轴-刀柄接口与几何约束；RC-04夹具-台面安装域/位置；RC-05工作范围、刀具行程与可达性层级；RC-06后处理/控制器语义适配范围；RC-07带理由的需求匹配及候选排序；RC-08版本失效、人工补证、离线闭包及审计。

**必须区分**：资源定义/额定值、真实机床当前可用状态、特定工艺任务与装夹组合、控制器执行覆盖、经批准的工程验证，属于不同事实域。工程试验/标准证明必须限定资料型号、条件、时间、标准正文实际读取范围。

## 二、已读取的代码证据与可复用部分（不是运行验收）

只读版本：`procet-resources@b861efee9c84a99eba1fbee2c8749e60576fb93f`、`procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`。公开规划仓只记录路径和设计结论，不复制产品源码。

| 证据ID | 真实源码入口 | 已知事实与局限 |
|---|---|---|
| E-RC-01 | resources:`src/cam/resources/types.rs` | 已有8个typed resource kind，Draft/Released/Obsolete和exact ManufacturingResourceRef；Released可新选，Obsolete仍可追溯历史 |
| E-RC-02 | resources:`src/cam/resources/machine/types.rs` | 有线/旋转轴typed范围、Home、速度、component树、Work/ToolMotion/Safety AABB；这不证明TCP所有姿态可达 |
| E-RC-03 | resources:`src/cam/resources/machine/capability.rs` | 已有后端结构推导：固定3轴、3+2、4轴联动、5轴联动、旋转拓扑、Verified/Unverified及reasonCodes；缺陷导致Unverified时全部布尔输出false，**不等于机床物理上必然不支持** |
| E-RC-04 | gui:`apps/desktop/src/modules/cam/components/machineCapability.ts` | 前端只显示后端确定性能力快照，Unverified合并为灰色“能力未验证”，不重新推导 |
| E-RC-05 | resources:`src/cam/resources/workholding/types.rs` | typed接口、compatibilityKey、Grid/TSlot/Rail/Rigid允许域，及GripCapability，均属资源设计而非Setup已安装 |
| E-RC-06 | resources:`src/cam/setup/manufacturing/types.rs` | Setup选用的具体安装位置、Exact resourceRef与计划夹持参数另存，不应覆盖D03允许域 |
| E-RC-07 | resources:`src/cam/resources/tool_assembly/types.rs` | 刀具总成含exact cutter/holder、gaugeLength、stickout和assemblyFrame；尚不能仅凭这些字段证明主轴接口实体配合 |
| E-RC-08 | resources:`src/cam/resources/dispatch.rs` | typed发布门在分发器执行；PostProcessor当前因缺正式typed配置而fail-closed拒绝发布，不能凭控制器family猜出可发布后处理 |

**设计差距**：上述后端“结构能力推导”和前端Badge已存在；本项新增的是多资源、任务要求、接口匹配、执行覆盖、独立证据的可解释**候选适用性投影**，不是第二套MachineCapability真值。尚未确认完整资源组合匹配服务及产品消费端均已接线；不得称已实现。

## 三、数据所有权、exact输入与边界

| 数据 | 唯一Owner | 在此项中的用途及不可越界 |
|---|---|---|
| D03 制造资源能力档案 | 02 Resources | 发布的机床轴、边界、接口/速度、刀具/总成/夹具属性、来源；更新需新revision |
| D04 Process Setup | 04 Setup | 零件、毛坯、工艺基准、装夹意图、选用位置；可逐阶段完善，不强迫探索者绑定具体机床 |
| D05/D08 工艺要求/冻结 | 05 工艺规划 | 冻结需求、工序与策略约束，不能被资源排名静默更改 |
| D06/D07 求解条件与材料状态 | 06 Solver | 需要的可达性/去料域与几何事实，不能从资源Badge推断几何通过 |
| D09 CL | 07 刀路 | 中立刀位/刀轴及参数要求，绝不能用CL播放替代NC验证 |
| D10 Machine Execution Binding | 04 领域与08/09消费者 | 实际机床、控制器语义、装配、工作偏置、后处理配置的exact绑定；采用要显式写新修订 |
| D11/D15 | 09 验证 | CL预检查和NC解释后验证分开；本文匹配结论不能覆盖它们 |
| D12/D13/D14/D16 | NC/运动/发布相应Owner | 正式NC、控制器展开、轴运动和签发由各域决定；仅消费匹配结果及其fingerprint |

逻辑输入`CompatibilityRequest`（待实施）：`requestId`，`callerScope(project/document/setup/editSession/epoch)`，`requirementSetVersion`，`requirements[]`（kind/operator/quantity/unit/requiredStage/mustOrPrefer/sourceRef），`resourceRefs[]`（resourceId/revisionId/revision/contentHash），`setupRef?`，`executionBindingRef?`，`evidencePolicyRef`，`tolerancePolicyRef`。无工程Scope的资源浏览可只用资源工作区epoch，不强造projectId。

只读输出`CompatibilityAssessment`（拟议）：`inputFingerprint`，`evaluatorVersion`，`derivedAt`，`resourceCombination[]`，`criterionResults[]`（testId/status/reasonCode/evidenceRef/assumptions/units/explainedLimit），`summaryGate`，`alternatives[]`，`missingEvidence[]`，`staleDependencyRefs[]`。输入指纹必须覆盖exact资源快照、用户要求、可选Setup、算法与证据政策；不能由显示排序或当前latest反推。代码中的实际接口名称和DTO须在实施时再核对后冻结，本文不臆称已存在API。

C0只包含公共身份、Frame、单位、版本、调用作用域及协议；兼容谓词、设备能力、工序要求和解释归C1领域，禁止把所有资源属性塞入common。Runtime的实际可用性与设备在线状态不存入D03 Released资源。

## 四、兼容性不是一个布尔：三层判断与五态说明

**L0资源结构事实**：按现有`derive_machine_machining_capabilities`从exact MachineRevision推导，保留`Verified/Unverified`、原因代码和模式布尔；这是资源定义内部的充分性检查。机床轴数5或拓扑非平行不等于该任务的五轴可达、NC语义完整和安全认证。

**L1任务配置适配**：比较本次要求的轴/旋转模式、行程、接口、装夹范围、刀具长度、材料工艺边界以及来源版本。类型/维度不一致和明确超出允许域形成`incompatible`；必要值或接口图缺失形成`unknown`；不需要该项时`not_applicable`；有来源并满足限定条件才记`satisfied`。排序不得把未知当满足或仅因数量多加分。

**L2执行与证据准入**：控制器型号/固件、选定后处理、支持的NC指令子集、实际机床运动链、NC级验证由D10/D12/D13/D14/D15分别审查。本文输出的候选永远不是L2“通过”的替身；可先推荐，但生产批准须等相应Owner的exact证据。

单准则结果枚举`satisfied | incompatible | unknown | not_applicable | stale`；整包Gate枚举`candidate | rejected | blocked_unknown | stale`，且注明阶段。必要项目中至少一项`incompatible`→`rejected`；否则若含`stale`→`stale`，否则若含`unknown`→`blocked_unknown`，全部必要项`satisfied/not_applicable`才是`candidate`。**candidate仅是当前阶段候选，不表示机械/NC已授权**。互相矛盾的资料单独以unknown+conflict reason陈列，不能按最新日期默默覆盖。

A探索模式可展示`blocked_unknown`方案及缺少证据，禁止宣称生产可用；B生产必须走各阶段门，缺必要能力不解除。偏好条件用稳定排序理由表达，不能覆盖Must gate。具体数值比较：先确认维度与单位，比较归一化区间；公差未知时不得默认为零或任意安全余量。AABB重合最多是必要的粗过滤，不是刀具TCP和工件/夹具无碰撞的充分条件。

## 五、资源匹配与选择主流程

1. 用户从工序、Setup或独立资源中心发起，Host记录callerScope；读D05/D08要求或新建未冻结的需求草稿（人工修改须保留来源）。
2. 查询资源catalog，固定候选Released exact revision与可核对内容指纹；历史Obsolete只供回放，不能自动重新选用。
3. 复用机床结构能力derive，补齐接口、允许安装参数、范围、要求/证据条件；调用只读Evaluate，输出每条状态与理由；必要后端能力缺失→unknown。
4. 在同一个Babylon交互世界切换资源/工程空间，3D仅展示候选几何、轴、安装域和假设；拖动/点击创建候选操作而非数据库变更。
5. 用户检查满足/冲突/缺证及替代建议，在B模式点击“采用”前由Setup或执行绑定Owner复核scope、exact引用、expectedRevision和requestId，再生成D04/D10新修订回执；只读匹配模块不持久化其副本。
6. 采用后向工艺、Solver/刀路及验证发布端发依赖变化事件；已冻结成果需显式变更决定，不能直接替换资源。

替代流程：目录无已发布候选→展示缺条件清单/资源新建；旧资源Obsolete→历史只读并列可见的派生版本；A探索无机床或无Setup→只做适用能力筛选，拒绝生产化标记；网络隔离→仅用完整本地闭包和已登记来源，缺资产不得借云端最新纠正；人工覆盖→允许追加备注/风险接受申请但不能直接把unknown写为satisfied。

失败与取消：查询失败保留要求草稿并指出来源；输入与版本冲突保留本地候选但不得提交；A→B Scope切换后晚到结果丢弃；异步取消清除临时匹配与overlay但不撤销成功提交；提交响应丢失按requestId取同一Receipt、不得重复采用；资源模型切换不引起2套交互Scene。错误统一含reasonCode、fieldPath、expected/actual revision、sourceRef、recoverAction。

## 六、十条设计规则及追溯

| 规则 | 设计规范 | 依据类型 |
|---|---|---|
| RC-R01 | 资源固有能力、可用容量/现场状态、任务Requirement各有Owner；标签和在线状态不能直接证明工序适合 | SRC-RC-001/007；内设分域 |
| RC-R02 | 名义轴数、轴方向、拓扑和模式标识须按明确帧/码推导；未验证结构不产生可用Badge；不得从“5轴”名字推导某个NC指令 | SRC-RC-002；E-RC-02/03/04 |
| RC-R03 | 速度/行程/工作包络限定用途与测定条件，几何精度测试并不证明工况下任意路径可达/安全；需实际运动学与NC阶段复核 | SRC-RC-003/004/005/008 |
| RC-R04 | 机床-夹具/刀具-主轴配合须具有exact双方接口和位置允许域，compatibilityKey只能筛选不能证明机械尺寸配合 | SRC-TA-003；E-RC-05/06/07 |
| RC-R05 | 几何包络、刀尖可达、无碰撞、姿态连续性分项核验；未建模的刀尖装配/空间约束保持unknown | E-RC-02/07；内部安全设计 |
| RC-R06 | 控制器family≠已验证后处理/NC执行语义；OPC UA MachineTools监测与作业模型不提供全部专有NC解释能力 | SRC-RC-006；E-RC-08 |
| RC-R07 | 三层资格与多准则五态分开；单一Verified Badge不代替需求匹配、L2验证及生产批准 | SRC-RC-007；E-RC-03/04；内部准入决策 |
| RC-R08 | exact引用/策略/证据指纹绑定，发布派生、版本漂移、条件变化仅失效相关证明，不能静默latest | E-RC-01/06；F1-01/F1-06内部约束 |
| RC-R09 | GUI/CLI/Agent调用同一只读匹配服务；3D只投影；预览不保存；跨Scope晚到丢弃 | E-RC-04；内部GUI/Host契约 |
| RC-R10 | 缺证、冲突、被淘汰或不支持的语义显式状态；候选资格不得转写为CL/NC或实机安全证据 | SRC-RC-005/006/008；内设独立验证边界 |

每条规则对应字段、正反测试和来源由`research/traces/CAP-02-08.json`机器登记。标准公开摘要只证明范围，不证明具体设备满足某公差或认证。

## 七、功能验收规格（均待产品实施）

| 验收ID | 正反场景及预期 |
|---|---|
| RC-T01 | 已发布exact机床与已证3线轴结构匹配固定3轴结构条件；仅L0通过，不显示NC已准入 |
| RC-T02 | 带5个轴但缺合法旋转拓扑/方向或必要证据，Unverified；全布尔false不能解释为物理无五轴 |
| RC-T03 | 真实4+1个轴但要求联动5轴；结构模式不满足则incompatible，不能自动套用特定B5 |
| RC-T04 | 机床工作AABB与工件AABB相交但TCP方向不可达/姿态未知；范围预筛不转为L2通过 |
| RC-T05 | 行程或速度要求越明确边界；该限定需求incompatible且附归属单位/来源 |
| RC-T06 | 原始mm与m表达同一限值，应得等价匹配；缺单位或负速度输入拒绝推导 |
| RC-T07 | 模式Badge Verified但无匹配夹具接口资料；任务组合blocked_unknown |
| RC-T08 | 接口compatibilityKey相同但尺寸/安装datum冲突；不能判机械配合通过 |
| RC-T09 | Grid/槽/轨道合法域内可预览，越界明确incompatible、不clamp，预览与采用分离 |
| RC-T10 | holder与cutter exact组合已发布，但主轴接口/量规长来源未知；不得宣称刀具安装通过 |
| RC-T11 | 控制器家族名称匹配但后处理未发布typed配置；B模式NC绑定blocked_unknown |
| RC-T12 | 控制器自定义宏/循环未建模；NC阶段保持unsupported，不能以OPC UA监测映射证明支持 |
| RC-T13 | 资源结构Verified且任务Must全部符合；结果为candidate而不是D15/D16批准 |
| RC-T14 | Must中一项不兼容且另一项unknown；summary为rejected并仍展示全部缺证 |
| RC-T15 | 只有偏好条件（非Must）不满足；候选保留并显示排序理由，Frozen Plan不改 |
| RC-T16 | Obsolete资源仍可重放历史exact引用，不能自动作为新Setup默认可用资源 |
| RC-T17 | 发布新资源修订后，已存在任务保持原exact；新的评估需显式新输入和新指纹 |
| RC-T18 | 修改Setup/工具总成/容差政策使关联评估stale；仅换主题/镜头不失效 |
| RC-T19 | 查询A晚于用户切换到Setup-B的请求完成；A结果不得覆盖B或更改A/B成果 |
| RC-T20 | 离线闭包缺必需接口/来源或恢复校验失败；保留原工程与unknown，不生成伪Ready状态 |

[合成样例](fixtures.json)供需求规则评审与未来独立预期数据使用；没有运行后端或真实机床检测，所有RC-T仍标not_run。

## 八、模块划分、开发切口与前置条件

逻辑接口（**建议接口，尚未证明产品存在**）：`QueryResourceCapabilities(exactRefs)`由Resources提供已记录事实；`EvaluateCompatibility(request)`由能力评估应用服务提供只读解释；`PreviewResourceCombination(scope,config)`由Setup及RendererPort消费；`AdoptResourceSelection(requestId,expectedSetupRevision,selection)`由Setup/D10所有者写入；`ExplainAssessment(inputFingerprint)`只读证据；`InvalidateDependentEvidence(changeEvent)`由Host依赖图触发，禁止直接删除历史证据。

实施切口及负责人：RC-I01资源字段/消费者审计（Resources+CAM/NC/GUI）；I02需求typed契约与版本映射（Contracts+Plan）；I03三层求值及独立规则样例（Resources+验证）；I04接口和装夹求交（Setup/Resources）；I05工具与执行配置/控制器范围交接（NC/09）；I06统一左容器+单世界预览（GUI）；I07范围失效/离线回放（Host/F1-06）；I08端到端正反复核与灰度迁移（测试Owner）。依赖F1-01公共引用、F1-02帧、F1-06闭包和E3-04控制器边界；文档编制不等于这些工作包已经实现。独立消费方须对生产能力谓词和失败语义签审。

兼容迁移：保留现有`machine/capability.rs`后端和GUI Badge，不创建平行结构来源。新增`CompatibilityAssessment`为显式新schema和版本化只读投影；旧工程缺接口/证据时只读或unknown，不能通过default true或改写Released纠正。新适配失效时可关闭新能力入口，原有Setup/资源可读、保留历史；撤销代码不等于能回滚已写工程数据。

**待审批决策**：Requirement typed字段、查询端口物理位置、策略版本/阈值、接口完整度门、控制器profile归属、推荐排序解释以及历史Schema兼容窗口。真实设备安装图、额定值来源、后处理版本与控制器执行表仍为冻结阻断；设计不依赖自动化模型名称/机床外形猜测。
