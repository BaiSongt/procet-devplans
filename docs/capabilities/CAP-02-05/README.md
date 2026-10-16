# CAP-02-05｜毛坯与材料目录

版本：0.1（2026-10-17）；**已编制、待人类评审；未实施产品验收**。继承[V0.8原编号](../../architecture/v0.8/03_三级能力映射_88项.md)，不增加88项总数。关联：[界面字段](UI.md)、[R-MS-001理论与文献](../../../research/topics/R-MS-001.md)、[逐项证据追踪](../../../research/traces/CAP-02-05.json)、[F1-02单位与Frame](../../work-packages/F1-02.md)。

## 1. 业务目的、角色与所有权

资源管理员定义可复用材料牌号/交货状态、技术属性和毛坯模板；工艺工程师在单个Setup明确选用具体材料修订、初始毛坯S₀及姿态；采购/质检归档实际批次、炉次与检验证书；几何求解器消费**已确认S₀**并计算有序去料状态。三类状态不可混淆：

- **D03制造资源目录：** MaterialDefinition/Revision、StockTemplate/Revision、供应商/标准、属性证据；它不记录某零件本次装夹位置。
- **D04工艺Setup与毛坯：** 实际选用的材料精确修订、尺寸/几何与Frame、明确确认的S₀，不等于目标CAD设计实体D01，也不绑定特定机床执行D10。
- **D07求解后的材料状态：** Sᵢ由S₀与工序有序局部去料体推得；不能写回D03/D04。D17的现场炉批与质检事实不自动升级为全体材料牌号的属性。

**禁止自动扩大、缩小或生成默认毛坯**：新建Setup不得根据导入CAD隐式写入包围盒尺寸。“从CAD提出毛坯候选”仅在用户主动请求时预览，明确算法和六向偏置，按“采用”才可创建新D04修订；系统遇尺寸不足不能静默修正。仍不做全程材料扫掠仿真，不从可视化网格推定精确B-Rep。

## 2. 真实代码观察与缺口（只读，非产品验收）

本轮阅读BaiSongt/procet-resources的develop `b861efee9c84a99eba1fbee2c8749e60576fb93f`：

| 源码证据 | 已有结构 | 风险和改造边界 |
|---|---|---|
| [E-MS-01：resources/material.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/material.rs) | `Material{id,revision,name,group,condition,hardness,hardness_scale,density_g_cm3,notes,enabled}`；保存检查revision并递增；列表按ID取最新；有材料库单测 | 材料是独立表，缺属性来源、validConditions、精确消费引用；目前Group P/M/K/N/S/H仅是代码枚举，不能假装是已验证工件材料分类 |
| [E-MS-02：resources/types.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/types.rs) | 其他制造资源具有`ManufacturingResourceRef`、Draft/Released/Obsolete；`ManufacturingResourceKind`**不含Material** | 禁止假设材料已使用统一资源发布生命周期；先保留既有材料表并设计受控适配，不重复真值 |
| [E-MS-03：setup/manufacturing/types.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/setup/manufacturing/types.rs) | `SetupStock{frame,material_id?,shape}`；shape类型有Rectangular、Cylindrical、PartBoundingBoxOffset、CustomGeometry；stock与mcs字段仍有Machine CSYS注释 | 旧`material_id`**没有revision**，历史打开可能漂移；Frame从机床执行域转向工艺域须显式迁移，不能只改字段名 |
| [E-MS-04：resources/default_pack.rs](https://github.com/BaiSongt/procet-resources/blob/b861efee9c84a99eba1fbee2c8749e60576fb93f/src/cam/resources/default_pack.rs) | 默认材料种子由DDL维护；部分资源几何说明为代理 | 种子与代理不能冒充材质证书、实物坯料或制造认证 |

这些是单仓具体提交的源码线索，尚未证明GUI/solver/cam消费者已经接通。尤其材质Revision与通用ResourceRevision的生命周期语义不得直接强合并。

## 3. 七项子能力及主、替代、异常流程

| 子能力 | 交付结果 |
|---|---|
| MS-01 材料目录查询与修订 | 牌号、别名、标准/来源、交货/热处理状态、exactRef |
| MS-02 属性及条件证据 | 密度、硬度量表、有效条件、试验方法、精度/不确定性 |
| MS-03 毛坯模板与几何 | 块、圆棒/圆柱、受支持精确自定义Solid与几何来源 |
| MS-04 Setup初始毛坯 | 选材、模板引用或明确自定义、Frame/尺寸/位置与采用回执 |
| MS-05 包围盒候选及几何Fit | 预览与独立的contains/余量诊断，不能默改几何 |
| MS-06 目录派生、保存、发布/禁用 | exact版本、并发比较、历史解析及审计 |
| MS-07 失效与回退协作 | 属性变化影响参数建议，几何变化影响D07/CL/NC |

**主流程：** Setup选择毛坯→读目录已发布/允许采用的精确版本→手工录入或明确选择模板/已有Solid→预览与CAD目标相对位置→选材与条件→用户查看尺寸/材料/拓扑/余量检查→点击采用→服务端核对expectedSetupRevision、inputHash和权限→生成新D04版本及关联失效清单。用户仅打开资源空间或更换显示材质，绝不算采用。

**替代流程：** 无模板时直接自定义块/圆柱，或选择原始带hash的几何文件；缺材料来源时允许有标记的探索草稿而不授权生产切速；历史Setup保持原值，修改必须派生修订。

**异常流程：** 晚到A工程响应不得覆盖B；Save冲突保留本地草稿并展示服务器revision；无法唯一解析旧material_id时显示legacy_unresolved，不能自动latest；非法Frame、非闭合Solid、布尔不确定状态时返回unknown/failed，不由显示网格或代理补位；发布后响应丢失用requestId查回执，避免重复保存。

## 4. 数据契约与接口（均为拟议逻辑用例，不是现有Tauri命令）

| 端口 | 输入 | 回执与失效责任 |
|---|---|---|
| QueryMaterial / GetMaterialExact | id、来源、condition、exactRef/分页 | Resources返回指定修订；历史只按exact解析 |
| CreateMaterialDraft / Validate / Release | typed属性、sourceRef、expectedLock、policy | Resources返回draft或批准回执及缺证项；草稿可有unknown但不能作为已认证生产建议 |
| QueryStockTemplate / ResolveStockGeometry | kind、exactRef、geometryHash与用途 | Resources返回模板/闭包/几何资格；不得用ProceduralProxy伪造精确B-Rep |
| PreviewStockCandidate | callerScope、partExact、frameRef、methodVersion、偏置、inputHash | Setup/Geometry只读返回尺寸及bbox/精确检查分项；preview不写D04 |
| AdoptInitialStock | expectedSetupRevision、materialExact、templateExact或customHash、frame/size、requestId | Setup生成新D04修订及影响集；CAS失败不覆盖 |
| VerifyStockContainment | exact CAD、D04的S₀、数值政策与几何方法版本 | Solver/Geometry返回passed/failed/unknown/stale、超出部位、残差和证据范围 |
| ExplainStockDependencies | D04 revision/变更字段 | 各Owner说明D07/刀路/NC/切削建议应失效范围 |

GUI、CLI、Agent都走Host管理的同一领域入口。异步先回JobRef，完成时还要核对scope/epoch/hash；事件是通知而不是第二真值。公用C0只管身份、单位、Frame、修订、作用域，材料属性/Stock仍由各领域C1负责。材料`material_id`迁移需要历史证据和审计映射：无法证明对应修订时保持只读待补，**禁止用当前最新版改写历史制造事实**。

## 5. 理论与设计规则

**MS-R01 条件化属性**：材料属性必须带`propertyKind/value/unit/condition/source/method/precision/uncertainty`，不要只凭牌号填硬度/密度。[SRC-MS-001]

**MS-R02 规格与实例隔离**：STEP-NC一般workpiece信息不能冒充实际来料批次验证；Procet的D03/D04/D17分离是内部所有权决定。[SRC-MS-002]

**MS-R03 单位与量表**：尺寸mm，密度支持受控`g/cm³↔kg/m³`且保留源单位；HBW/HV/HRC的数值不可无依据互换。HRC方法仅参考ISO 6508-1目录主题，不能从目录生成换算公式。[SRC-MS-003/005]

**MS-R04 bbox不是精确Solid**：OCCT Add/AddOptimal/AddClose/AddOBB对网格、曲面及容差处理不同。bbox是辅助候选，不能证明几何包含。[SRC-MS-004]

**MS-R05 用户控制毛坯**：任何尺寸/偏置/自动落座的应用均须由用户显式提交；三次重复预览在同一输入下得到相同绝对结果，不能累积平移；Fit失败不自动扩张。[E-MS-03；内部约束]

**MS-R06 真实包含**：在声明的统一Frame下，要求合法闭合B-Rep对`P \ S₀`进行独立残差/拓扑/容差诊断；仅体积、AABB或薄壳布尔成功不等于全部经过认证。多Solid、薄壁、岛屿、接近公差等未支持情形返回unknown。[SRC-MS-004仅约束bbox；其余是待实现并待独立验证的设计推导]

**MS-R07 分类适用边界**：ISO 513官方摘要的主题是硬质**刀具切削材料**及其应用，不能仅凭该标准目录认定任何工件牌号、热处理或推荐切速。当前P/M/K/N/S/H组码须注明具体分类来源。[SRC-MS-006；E-MS-01]

**MS-R08 精确版本与失效**：材料改版不修改历史Setup，通常使对应切削建议/工序参数证据待复核；确认改变S₀几何/Frame才使D07及依赖刀路/NC检查stale；外观/相机改变不触发制造失效。[E-MS-01/02/03；内部设计]

## 6. UI与产品验收（**全部NOT_RUN_PRODUCT_TEST**）

UI详见[UI.md](UI.md)；五大功能面的字段、选择/预览/取消/恢复、3D与失败状态分开。验收场景：

| 编号 | 正/反验收（Given/When/Then关键条件） |
|---|---|
| MS-T01 | 按材料牌号、交货/热处理状态、来源检索，结果显示具体修订 |
| MS-T02 | 同名但不同规范/供应商的材料不能按名字自动合并 |
| MS-T03 | 材料r1被旧Setup采用；目录发布r2后旧Setup仍精确重放r1 |
| MS-T04 | 旧Setup仅material_id且历史revision不可证明；显式unknown，不解析latest |
| MS-T05 | HRC与HBW/HV条件混输；不静默换算或给出有保证的切速 |
| MS-T06 | 材料属性缺方法/来源，能存探索草稿但不得冒充已认证参数 |
| MS-T07 | 新建Setup不自动根据CAD写入毛坯，不自动增加厚度 |
| MS-T08 | 用户主动请求bbox候选，取消预览不改变毛坯；六向偏置显示来源 |
| MS-T09 | 相同输入连续3次落座/对中，pose相同且毛坯尺寸不变 |
| MS-T10 | bbox看似包含但目标形面局部在真实Stock实体外，不能仅凭bbox授信 |
| MS-T11 | 用户的stock尺寸不足或负余量，准确报告而不自动扩大 |
| MS-T12 | CAD/Stock均旋转平移，统一Frame后检查，未确认Frame返回unknown |
| MS-T13 | 只有显示网格、开放壳、无效Solid，不能报告精确包含通过 |
| MS-T14 | 同资产ID不同hash或离线缺几何闭包；旧工程保持、不给代理几何 |
| MS-T15 | 仅材料属性修改，Profile/工艺建议stale但CAD几何不被重写 |
| MS-T16 | S₀尺寸/pose被批准改变，D07及依赖CL/NC明确失效，冻结需人工处理 |
| MS-T17 | Setup-A选择材料后切换Setup-B，A的迟到响应不污染B |
| MS-T18 | 并发保存、幂等重试、已批准Setup、资料不全分别有结构化回执和恢复入口 |

以上测试入口须从真实资源、OCCT、CAM、GUI项目核实，不臆造可运行命令。文档检查/页面原型不等于这些产品用例通过。

## 7. 依赖、切口、迁移与回退

保留原工作包映射F1-02/F1-06/E3-04；额外与F1-01 exact引用、F1-04 Setup拆分、W2-05工艺消费、T5-03回归协同，不增36项。实施切口：I01现场旧字段清点→I02 MaterialRevisionRef与legacy只读适配→I03 StockTemplate/几何闭包→I04显式候选+真实Solid Fit→I05单容器GUI与共享入口→I06失效、离线恢复及迁移回退。Resources/Setup Owner生产，Solver/CAM/GUI消费方和独立几何验证者共同审查；每项记录变更SHA、正反例、未覆盖区、回退证据。

迁移阶段保留旧reader、旧工程数据和原始material_id，先影子对比，再灰度新writer；中途失败不改Approved。不能把`enabled=false`等同全系统统一Obsolete而不评审。待工程审批：材料发布/使用政策、具体材料批次追溯权属、OCCT锁定版本和Fit容差、厂家材料分组来源与历史版本唯一性。
