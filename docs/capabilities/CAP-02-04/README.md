# CAP-02-04｜夹具与工装资源

版本：0.1评审稿；编制日期：2026-10-16。状态：详细规格已编制、待人类评审；不是产品实现或装夹认证。

关联：[界面与字段](UI.md)｜[R-WH-001理论依据](../../../research/topics/R-WH-001.md)｜[F1-02实施工作包](../../work-packages/F1-02.md)｜[研究追踪](../../../research/traces/CAP-02-04.json)。原编号、名称和11/88/36/17目录保持不变。

## 1. 目标与范围

资源工程师维护可复用的夹具定义；工艺工程师在特定Setup中选用精确修订、选择安装位置、建立工件约束；执行适配记录本次夹紧动作；验证模块产生限定输入和方法的证据。四者不能共用一个可随意改写的夹具JSON。

本项覆盖基座、夹具总成、组件、接口、语义基准、行程/开口能力、资料与几何资产、草稿及发布生命周期。实际工件定位和夹紧参数由04域负责，本项规定交接接口。夹紧力优化、弹性变形、真空/磁吸精确物理、夹紧PLC指令和连续碰撞并非本次自动获得的能力；需各自能力声明和验证。

用户故事：从Setup进入资源选择器，选中一个已发布总成，查看接口与夹持范围，在单一3D空间预览配合，返回原Setup选择位置和开口；先保存草稿，再经服务端检查提交。全过程可以追溯资源、工件、安装和证据版本。

## 2. 已核实代码与复用边界

本轮读取procet-resources的develop提交`b861efee9c84a99eba1fbee2c8749e60576fb93f`。以下只证明被读代码结构，不证明GUI消费版本或本地产品通过。

| 证据 | 已有内容 | 本项处理 |
|---|---|---|
| [E-WH-01](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/workholding/types.rs) | WorkholdingBaseDefinition、FixtureAssemblyDefinition、组件、接口、局部datum、驱动与grip能力；读取1–360行 | 保留这些领域类型；补齐用例、来源与消费侧语义 |
| [E-WH-02](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/setup/manufacturing/types.rs) | exact引用、Grid/TSlot/Rail位置参数、Setup planned state；读取1–240行 | 不从最终pose逆猜槽号/格点；区分资源允许域与Setup选用值 |
| E-WH-03，见E-WH-02同文件 | 旧Stock/MCS/Fixture字段含Machine CSYS语义 | F1-02/F1-04显式适配，禁止只改字段名就称为工艺Setup解耦 |

E-WH-01的组件碰撞资产字段目前是必填字符串。本规格不授权放松现有发布门，也不允许填虚构资产ID。缺资产可保留设计草稿；扩展只显示状态需要单独版本化提案。调用清单中的英文名均为拟议逻辑用例，不是已存在的Tauri命令名。

## 3. 数据所有权

| 对象/数据包 | 唯一写入责任 | 不应包含 |
|---|---|---|
| WorkholdingDesignDefinition，D03 | Resources；发布后内容不可变 | 特定零件的接触关系、实际夹紧状态、Setup批准 |
| WorkholdingPlacement/Constraint，D04 | CAM Setup；exact设计引用、安装参数、计划开口、工件基准绑定 | 覆盖资源额定值、传感器实时值 |
| ExecutionBinding，D10 | 执行配置应用用例 | 以机床名称猜安装点或控制器动作 |
| ActuationState/动作事件，D13/D14；现场记录归D17 | 解释/运动执行适配，按真实来源分开 | 直接改资源定义或批准Setup |
| WorkholdingAssessment，按用途挂D11/D15或Setup检查工件 | 对应验证能力生产者；绑定输入指纹和方法版本 | 把局部几何成功升级为全程序/力学通过 |

C0只共享身份、Frame/单位、版本、作用域和工件引用。夹具定义、接触模型、夹持范围仍归C1领域契约。新增评审字段通过版本化C1扩展，不把整套夹具复制到procet-contracts公共类型。

## 4. 六项子能力与业务流程

| 编号 | 子能力 | 主输出 |
|---|---|---|
| WH-01 | 查找、筛选、比较和选用修订 | exact资源引用和兼容性原因 |
| WH-02 | 基座/总成/组件与几何资产编辑 | 受版本管理的定义草稿 |
| WH-03 | 安装接口与局部语义基准 | frame、接口允许位置域、资料来源 |
| WH-04 | 驱动、开口与夹持能力 | typed能力与使用前提，不是运行状态 |
| WH-05 | 检查、派生、发布、退役 | 服务端检查回执和新修订 |
| WH-06 | Setup选用、空间预览及变更影响 | 选用意图、Setup草稿差异、受影响成果列表 |

主流程：保留调用方WorkContext → 查询资源与已发布修订 → 打开只读详情 → 选择接口 → 预览 → 返回exact引用 → Setup配置安装位置/计划开口/工件约束 → 服务端重新核对修订、权限与并发版本 → 保存新Setup修订 → 按实际依赖标记下游待重算。

资源创作流程：新建或从已发布版本派生草稿 → 选基座与组件 → 绑定几何、接口和datum → 录入有来源的能力 → 检查 → 发布。资源发布只表示该定义满足发布政策，不表示任何零件装夹已通过。已发布修改必须派生新修订。

A探索可以使用明确标记的未完整资源假设；它不能冒充已发布生产资源。B采用资源时按能力的最低要求检查，不强迫不需要夹具的纯特征探索先建立完整装夹。A/B切换不复制或覆盖工程事实。

## 5. 安装、接触与工程资格规则

WH-R01：刚体有6个独立瞬时运动分量。3-2-1是候选定位布置，不是所有零件的自动证明；支撑共线、法向错误和冗余定位须诊断。[SRC-WH-001/002]

WH-R02：安装使用显式接口链，`T_WC=T_WP*T_PI*T_IJ*inverse(T_CJ)`。每个T从右下标帧变换到左下标帧；T_IJ为资料/用户确认的配合关系，不按名称自动翻180度。重复定位由同一输入重新计算绝对目标，不在上一次结果上累计平移。[SRC-TA-001；F1-02设计推导]

WH-R03：工装datum、工件GPS基准、工艺基准、执行工作偏置是不同对象。创建局部datum不会自动生成工件约束；拓扑拾取必须带来源几何与修订。[SRC-WH-006；E-WH-01；内部所有权决策]

WH-R04：保持接触的等式约束rank为6，只说明该线性化双边模型无自由增量。单边接触允许脱离，必须独立分析可行运动锥；不满足一阶形封闭不能直接断言所有高阶模型都不稳定。[SRC-WH-002/003]

WH-R05：力封闭不等于有限夹紧力足以抵抗给定切削载荷。载荷、摩擦、预紧/额定力、材料和接触模型缺失时，结果是unknown，不填默认安全系数或摩擦值后授信。[SRC-WH-004/005]

WH-R06：CAD网格、程序化代理、精确几何和接触证据分开。仅可显示的资源可以在浏览器查看，不能冒充准确碰撞体或据此确认制造约束。必须保留现有后端所要求的必需资产门。[E-WH-01；Procet设计决策]

WH-R07：资源额定驱动能力、Setup计划开口、当前夹紧命令/回执和现场感知状态分开。手动资源没有感知就标“待人工确认”，不能用播放到达位置替代实夹紧。[E-WH-01/02；Procet设计决策]

WH-R08：所有检查绑定exact输入；名义位姿、接触、载荷和几何检查互不替代。修改安装位置使有关证据失效，主题/相机变化不使制造事实失效。[Procet版本化设计决策]

## 6. 模块端口与事务设计

| 拟议逻辑入口 | 输入 | 输出/失败语义 | 责任 |
|---|---|---|---|
| QueryWorkholdingCatalog / GetExactDefinition | 类型、用途、分页、exact引用 | 只读投影；不默认替换历史latest | Resources |
| OpenDefinitionDraft / PatchDefinition | baseRevision、patch、expectedLockVersion、requestId | 草稿及新lock；冲突保留旧草稿 | Resources |
| ValidateDefinition / ReleaseDefinition | draftRef、expectedLockVersion、policyRef | 结构化问题、服务端指纹、发布回执；不靠前端勾选放行 | Resources |
| PreviewMount | callerScope、父/子interfaceRef、选中参数、frameRef、输入指纹 | 临时pose与缺失条件；不写Setup | Setup应用服务 |
| AdoptWorkholding | expectedSetupRevision、exact定义引用、选中位置、计划状态、requestId | 新Setup修订及receipt；不改D03 | Setup应用服务 |
| AssessWorkholding | exact Setup/工件/几何、contactModel、tolerancePolicy、可选loadCase | 各检查分项、输入hash和方法；未支持项unknown | 验证/求解端口 |
| Derive / RetireDefinition | exact资源、理由、版本前提 | 新草稿或生命周期事件；历史引用仍可审计 | Resources |

GUI/CLI/Agent共用这些领域入口。资源库操作可无Project；此时使用资源工作区作用域和草稿lock，不强造projectGeneration。Setup采用操作必须绑定工程/文档/Setup。异步任务由既有Host管理，返回Job引用；完成后再核对callerScope、epoch和输入hash。resourceUpdated、setupRevisionCreated、assessmentCompleted是拟议事件族，事件不作为第二份数据库真值。

取消只撤销在途请求或临时预览；发布完成后取消不能伪装为回滚。提交成功但响应丢失通过requestId查询同一receipt；重试不重复发布/采用。标准错误包含code、fieldPath、scope、expected/actualRevision、recoverAction，不弹出难以定位的对象字符串。

## 7. 状态与变更影响

资源生命周期、编辑状态和检查状态三条轴独立。编辑状态至少包括loading、ready、dirty、validating、conflict、readonly、failed；检查分项为passed/failed/unknown/not_requested/stale，不设置一个全局“夹具安全=true”。

exact引用改变：原定义与Setup记录保留，产生新采用修订。接口或安装参数改变：重算相关pose、接触和消费这些条件的刀路/执行验证。计划开口改变：重算相关夹爪位姿与检查；不重写资源最大开口。运行夹紧状态改变：新事件和对应时段验证，不改已批准计划。仅显示几何变化：按是否被碰撞/拾取消费决定影响，不一概全部重算。退役与内容损坏分开，历史重放不因退役自动解析到新版本。

离线恢复由既有SnapshotProvider/CAS完成：exact定义、组件、接口、几何与出处形成必需闭包。缺必需资产在staging阶段拒绝，不用空字符串、单位矩阵或默认夹具代替。恢复失败保留当前工程；F1-06负责完整故障注入验收。

## 8. 产品验收规格（均待实施）

| ID | 场景与预期 |
|---|---|
| WH-T01 | 老Setup指向r1而目录出现r2；打开/保存后仍引用r1，采用r2必须显式新修订 |
| WH-T02 | 两个编辑者以同一lock提交；第二个收到冲突，不覆盖第一个 |
| WH-T03 | 非单位父坐标下接口配合满足闭环等式；含子接口逆变换，不能简单加平移 |
| WH-T04 | 同输入连续三次自动定位，结果相同；不扩大毛坯、不累积平移 |
| WH-T05 | 槽号/格点/轨道行程越界；预览标问题，正式提交拒绝，不静默夹限 |
| WH-T06 | A→B作用域切换后A的预览晚到；不能改B草稿或打开A资源空间 |
| WH-T07 | 六点双边矩阵满秩但存在向上脱离；定位分析可通过，一阶封闭不得通过 |
| WH-T08 | 主支撑共线或重复；诊断欠约束/冗余，不以定位点数量代替计算 |
| WH-T09 | 摩擦、预紧或载荷来源缺失；载荷项unknown，不能写已完成力学验证 |
| WH-T10 | 有摩擦但载荷超过有限能力；返回该模型下失败及条件，不用力封闭覆盖 |
| WH-T11 | 只有显示网格且exact topology缺失；允许显示选择，禁止确认精确工件接触约束 |
| WH-T12 | 组件显示资产可用但必需碰撞资产缺失；保留草稿并列出缺失，不伪造发布通过 |
| WH-T13 | 手动夹具没有实夹紧观测；现场状态unknown/待确认，预览闭合不代替传感器 |
| WH-T14 | 未批准Setup在检查通过后又改变安装参数；旧检查标stale，提交需重算 |
| WH-T15 | 已发布资源退役；历史快照可审计，新采用是否允许按政策显式判断 |
| WH-T16 | 离线恢复缺子件资产或同身份异内容；原工程保持，输出明确缺失/冲突 |
| WH-T17 | 非法反射/缩放/NaN/未知Frame；制造提交拒绝，显示层不替后端修正 |
| WH-T18 | 原生资源与legacy入口并存；旧引用由隔离适配器读取，不伪造native exact身份 |

纯数学检查见`checks/test_workholding_math_examples.py`；只覆盖公式、数值与反例，不能代替以上18条产品验收。机械接口、摩擦与载荷资料、连续碰撞、Windows交互、具体机床的工作台安装关系尚需工程验证。

## 9. 实施分解与扩展

先F1-02定义单位/帧和纯数学端口，再F1-06完成资源闭包，结合F1-04建立Setup选用边界；E3-04只消费已明确的机床/夹具执行配置。每个切口先补消费者测试，不整仓重写。

可分派六个切口：WH-I01类型/所有权与legacy映射审计；WH-I02资源创作与exact修订服务；WH-I03接口预览及无累积定位；WH-I04统一任务页面与callerScope恢复；WH-I05分项证据投影及失效；WH-I06离线闭包和产品正反回归。每项由对应领域Owner实现、至少一个消费方评审。

扩展接触模型、真空/磁吸、可动子组件时使用明确的新kind和C1版本，声明可支持的约束与验证范围。旧reader遇未知必需kind显式拒绝或只读，不猜测等价为普通压板。多个装夹位点属于Setup实例层，不能导致同一资源模板复制多套私有字段。

回退：保留旧reader和独立legacy适配；新writer灰度启用；旧格式缺语义时只读并记录待补，不原位重写Released。代码回退与工程数据迁移回退分别验证。尚未批准的决策包括新检查DTO的字段名、服务拆包位置和数值策略默认值，编制完成不替代这些审批。
