# CAP-03-02｜零件、装配及版本：定义—实例—修订一致性

**规划稿 v0.1｜2026-10-18｜编制完成、待人类评审；不表示产品实现或验收。** 保持原V0.8能力编号与分母：`CAP-03-02`，原关联工作包 `B0-02 / F1-03 / F1-04 / T5-02`。研究专题 [R-ASM-001](../../../research/topics/R-ASM-001.md)、[GUI/3D规格](UI.md)、[规则—验收追踪](../../../research/traces/CAP-03-02.json)和[合成用例](fixtures.json)共同构成本项资料。与[CAP-03-01](../CAP-03-01/README.md)衔接：源文件导入是上游能力，**零件定义、装配节点、实例路径和工程修订不是一个ID**；与未来CAP-03-03拓扑稳定引用、CAP-03-04 PMI语义另设评审边界。

## 1. 用户、目标、权责与能力边界

设计工程师维护外部设计树及修订，工艺工程师在装配中选择具体制造目标，设计审查人员核对差异和来源，项目Owner管理工程修订/访问授权，CAD领域Owner维护D01定义/实例语义，Host/Project维护快照及提交事务。CAM、PMI、Solver、Setup只是精确消费者，不能更新设计源的事实。GUI/CLI/Agent统一请求同一CAD领域用例；3D树和渲染网格只是此用例的投影，不建立第二份装配数据库。

本项只做**零件定义（PartDefinition）、装配定义（AssemblyDefinition）、实例出现（ComponentOccurrence）、设计修订（DesignRevision）、差异报告（RevisionDiff）及追踪**。不擅自增加V0.8 CAP，不实现PDM/PLM全平台，不赋予导入文件生产适用或PMI全部符合资格，不负责制造特征算法、刀路或NC发布。供应商零件号、工厂BOM/替代件规则及 effectivity 只登记扩展候选，未获接口证据时明确 `not_modeled`。

内部分解的八个业务动作：AS-01提取多根设计树；AS-02定义/实例去耦；AS-03层级与局部Frame；AS-04元数据覆盖与外部引用；AS-05精确修订/快照；AS-06版本差异和影响；AS-07实例选择与目标确认；AS-08恢复/冲突/迁移。**这八项不是新增CAP。**

## 2. 业务流程：主流程、替代路径与失效

### 2.1 主流程

1. **选择已有CAD输入修订**：从Project→设计与文档→零件/装配树进入，读取`CAP-03-01`已提交的D01 `CadInputDescriptor`、原始`sourceArtifact`、解析选项和相应`geometryCapability`。页面不得从当前活动Tab推断为别的文档。仅预览可在受限只读上下文发生。
2. **读取结构**：CAD Owner在确切Reader/内核版本下导出`Root[]`及每个定义、实例、引用和属性读取覆盖；允许多根，不强制制造一个假总装。对不支持的外部链接/子装配记录`unresolved_reference`，不拼造缺失零件。
3. **构造定义—引用—出现图**：一个`PartDefinition@revision`可被不同Occurrence引用多次；`AssemblyDefinition`包含受控出现边。Occurrence记录`occurrenceId`与在该修订下的`parentPath`/`instancePath`，不以显示序号、名称、面哈希或文件名充当稳定身份。可共享定义；装配发生图禁止祖先环。
4. **规范化坐标/单位**：读取各节点`T_parent_child`及其来源，继承CAD源单位和Frame；基于明确的列向量约定计算`T_root_child = T_root_parent × T_parent_child`。模型显示矩阵是投影，不能反写D01几何/装配变换。未知单位或不可信变换的节点保留`unknown`并阻断对该节点的几何采纳。
5. **审查元数据与质量**：展示名字/颜色/层/源产品标识/验证属性等的真实读取状态；无元数据是`not_present`或`unsupported_reader`，不要补造BOM、材料或PMI。记录几何/显示/PMI实际能力层级，不做越权推断。
6. **新修订差异预览**：若与历史D01对比，列出Definition新增/删除/替换、Occurrence新增/删除/重挂、局部Frame变化、属性变化和无法消歧项；仅算法高置信候选可以建议对应关系，未确认的`ambiguous`不得自动绑定已批准CAM消费。
7. **实例选择与显式确认**：3D选中携带`documentRevision + occurrenceId/path + definitionRef + sourceGeometryHash + frameRef`。可选择“仅查看”“作为制造目标候选”，正式提交前重查Project作用域、操作人权限、expectedRevision/CAS、源闭包及冻结下游消费者；3D高亮不改变业务。
8. **提交/回执/影响报告**：CAD Owner发布**新的不可变D01修订**，Host原子激活工程快照，返回`requestId/revision/commitReceipt`，并形成D02/D04/D05/D06/D08/D16的**需复核清单**；下游冻结事实不能被新装配文件静默覆盖。旧修订可继续回放。

### 2.2 替代与异常路径

- **纯零件**：一根PartDefinition而无AssemblyDefinition，是有效设计输入；不要求虚构根装配。
- **多装配根**：按源XDE的free roots保留数组；可指定浏览主根，但不修改原始结构。
- **相同零件多次使用**：两个Occurrence可共享一个Definition、使用不同局部位姿；为制造目标选择时必须先落实发生实例/安装语义。
- **外部引用丢失**：部分树可浏览，缺件节点为`unresolved_reference`；不声称完整离线资产闭包通过。若制造目标指向缺件，拒绝采用。
- **同名异件/同哈希异身份**：显示名和文件/形状hash均不能单独确立工程定义同一性；使用源标识与显式映射候选，冲突入待审。
- **移动/重挂节点**：路径可能变化，保留来源修订及旧路径；同一逻辑Occurrence的跨版延续要有证据，否则`ambiguous`，禁止沿用旧选中路径直接绑定。
- **组件版本漂移**：父装配仅引用`exact`子定义版本；旧子定义不可隐式升级latest。外部更新提示派生方案，不能自动编辑批准内容。
- **取消/超时/切工程**：解析预览可取消并清理临时场景；提交点已完成时按receipt查询，不能回称未写入。迟到响应绑定原projectId/documentInstanceId/scopeEpoch，禁止污染其他工程。
- **冲突/未知**：循环装配、父子引用悬空、无证据单位、来源缺失/校验失败或新旧schema解释不确定时`blocked/unknown`，给出可检查的问题列表和恢复操作，不猜测。

## 3. 领域模型、数据权威与结构不变量

**D01唯一Owner：03 CAD/PMI与制造特征域中的设计基线子域。** 以下为**L3候选契约，待评审，不宣称现有API或L4字段已冻结**。Host保存/恢复；不在`common`中定义所有领域对象。C0只提供`DomainRef`、`ArtifactDescriptor`、frame/units及请求/回执协议。下游D02制造特征与CAP-03-03拓扑对应关系是另一层，D04为工艺Setup，不是导入装配中的localFrame。

| 领域对象/字段 | 类型/单位/来源/默认 | Owner与检查约束 |
|---|---|---|
| `DesignDocumentRef` | `domain/kind/id/revision`；Host/CAD产生，禁止latest | 绑定`sourceArtifact.contentHash`、`readerOptionsHash`、`readerVersion`及`schemaVersion`，不同派生配置不同修订 |
| `PartDefinition.definitionId/revision` | 不可变字符串与精确修订；CAD Owner授予 | 只表达设计中的逻辑零件；同名/同BRep不自动合并 |
| `PartDefinition.geometryRef` | 可选BRep exact ref+hash+能力等级，读取源 | `mesh_only`可浏览，不能自动进入几何求解或制造特征Accepted |
| `AssemblyDefinition.definitionId/revision` | 与零件定义独立，CAD Owner授予 | 子节点引用是图关系，不把Flattened compound当完整装配真值 |
| `ComponentOccurrence.occurrenceId` | 修订内独立身份；稳定跨版需来源证据 | 重复引用同一子定义时必须拥有不同occurrenceId |
| `parentOccurrenceRef/childDefinitionRef` | exact定义或父Occurrence引用；无默认为unknown | 不允许循环/悬空；单版本出现路径构成根森林、定义共享形成DAG |
| `instancePath / sourceLabelPath` | 只读派生；XDE label/source record与当前结构 | 路径可随编辑更改，不能充当跨修订稳定业务ID；XDE label只在该源文档上下文内有效 |
| `localToParentFrame` | `4×4`齐次变换，内部长度统一mm，角度约定rad；源单位及转换证据 | 只读来自Reader；无可信来源置unknown；Setup装夹变换不能覆盖它 |
| `rootIds / displayOrder` | Root列表与独立显示序号 | 多根合法；displayOrder仅UI偏好，不能参与持久ID构造 |
| `name/color/layer/productId/validationProps` | 有则保留源值及来源，缺失区分`missing/unsupported` | 字段不证明材料、装配关系或已审批PMI；颜色缺省为视图样式 |
| `externalReferenceRefs` | 受控URI/相对路径、许可/哈希或`unresolved` | 离线快照要闭包；不得靠联网填充未经授权源文件 |
| `DesignRevision.baseRef/newRef` | exact修订、CAS hash、提交主体、时间与原因 | 不原地覆盖源修订；`revision`≠`sourceHash`，二者分别判断 |
| `RevisionDiff.entries` | `add/remove/replace/relocate/metadata/ambiguous`，含confidence/evidence | 差异是报告/候选，不是批准结果；不可自动继承原修订的制造资格 |
| `ImpactSet` | 下游exact refs与`stale/review_required/unaffected/unknown` | 消费端按用途/来源确认；已批准D08与D16不静默更新 |
| `CommandContext/CommitReceipt` | Project/document/requestId/expectedRevision/epoch/actor/授权证据 | 同一领域口提交点CAS重验，幂等重试先查回执，冲突不产生新修订 |

**结构不变量**：

1. 任一Occurrence引用一个精确子Definition，不能仅持`latest`或单个形状hash；同一Definition可被多个Occurrence引用，单一Occurrence不能隐式复制成多节点。
2. 发生层级的根必须有确切Frame；在列向量与右手系约定下，`T_root_child = T_root_parent * T_parent_child`，变换次序不可交换；转换/显示不改CAD设计修订。实例移动只使相关世界位姿派生失效，不必宣称其零件几何发生改变。
3. 来源字节不可变；重读/ShapeFix/导出可以产生新派生，但不能修改原Source CAS。修改定义几何不等于修改所有实例的局部位姿，修改实例位姿不等于改变Definition BRep。
4. 跨修订对应只保留有证据的`confirmed`、候选`suggested`、歧义`ambiguous`、明确`unmatched`，尤其面/边身份交由CAP-03-03判定；禁止按面序号/显示节点序号默认延续。
5. 来源的引用闭包如不完整，保留可浏览范围及问题清单；**未证实完整**不得用于下游自动制造资格。

## 4. 同一领域入口：拟议命令/查询/事件/回执

这些名字均为**提案，未核实为现存API**，须由CAD Owner与Host/CLI/Agent共同评审；不能绕过现有`CadInputDescriptor`和`Project`存储。

| 行为 | 命令/查询/事件（提案） | 输入 / 输出与错误门 |
|---|---|---|
| 查询版本化结构 | `QueryAssemblyTreeAtRevision` | exact `DesignDocumentRef`→roots、definitions、occurrences、capabilityEvidence；缺源`source_unavailable` |
| 查询实例 | `QueryOccurrenceAtRevision` | exact revision+occurrenceId→parent/childRef、localFrame、sourceEvidence；不存在`not_found` |
| 预览修订差异 | `ProposeDesignRevisionDiff` | baseRef/targetRef+算法/预算→多类别差异与`ambiguous[]`；只读不写D01 |
| 选择制造目标 | `ProposeManufacturingTarget` | occurrence exact ref+scope→候选及下游适配风险；不建立D04或D10 |
| 提交修订 | `CommitDesignAssemblyRevision` | requestId/expectedRevision/授权/完整闭包→receipt/newRef；原子CAS、`stale_revision`/`unauthorized`/`unknown_dependency` |
| 变更影响查询 | `QueryDesignImpact` | base/target/diff exact refs→按消费者用途的stale/unknown清单；不改冻结D08/D16 |
| 发布事实事件 | `DesignAssemblyRevisionCommitted` | oldRef/newRef/sourceHash/diffHash/commitReceipt→订阅者仅记录需要重验的用途 |
| 查询已提交回执 | `QueryDesignCommitReceipt` | 原requestId+scope→已提交/未提交/未知，超时重试不能双写 |

所有写入在CAD Owner命令端实行授权/版本/来源检查；Host负责Project快照激活，CAM/PMI/Solver不能用直接SQL/renderer事件写D01。与F1-03公共面审计、F1-04阶段化输入门、F1-06离线闭包联审。

## 5. 十条设计规则及证据归属

| 规则 | 必须遵守的判断与归属 | 来源（技术依据或内部设计） | 绑定字段 | 正反验收 |
|---|---|---|---|---|
| ASM-R01 | 定义、装配、Occurrence分别建模，多个实例可以共享Definition；技术依据不自动规定Procet ID策略 | SRC-ASM-001/XDE | definitionRef, occurrenceId | T01/T02 |
| ASM-R02 | `GetReferredShape`与`GetLocation`等方法对应不同语义，按版本验证，不用flattened Compound重建唯一实例关系 | SRC-ASM-002/官方API | sourceLabelPath, childDefinitionRef | T03/T04 |
| ASM-R03 | 多层Frame列向量乘法顺序显式固定；模型实例位姿与Setup位姿分开 | SRC-ASM-001、已有SRC-TA-001；设计政策 | localToParentFrame, rootFrameRef | T05/T06 |
| ASM-R04 | 多根合法；外链和部分读取不得冒充完整装配闭包 | SRC-ASM-001、SRC-ASM-003 | rootIds, externalReferenceRefs | T07/T08 |
| ASM-R05 | 源名称/颜色/属性若缺失只能报告缺失；源属性与视图派生有界隔离 | SRC-ASM-001 | sourceMetadataCoverage | T09/T10 |
| ASM-R06 | 差异按定义/发生/位置/属性/未知分类，跨版对应先提供候选，不保证稳定拓扑命名 | SRC-ASM-004（溯源模型）＋设计决策 | revisionDiff, mappingEvidence | T11/T12 |
| ASM-R07 | 修订、来源hash、派生配置hash不混同；源/修订关系不可变，`wasRevisionOf`仅表示来源，不授制造资格 | SRC-ASM-004＋C0内部决策 | oldRef,newRef,sourceHash | T13/T14 |
| ASM-R08 | 多文档编辑不把OCAF单文档事务当成Project/CAS跨模块原子提交；Host需闭包和最终激活点 | SRC-ASM-003＋F1-06内部决策 | transactionGeneration, closureRef | T15/T16 |
| ASM-R09 | 选择/视图节点只是投影；提交资格必须Owner端重验，异步回执与当前文档作用域绑定 | 既有RendererPort/Host观察与内部决策 | selectionIntent, scopeEpoch, commitReceipt | T17/T18 |
| ASM-R10 | 旧D00输入descriptor能只读恢复，不推断新结构/批准；变更只派生新修订，下游显式重审 | SRC-ASM-004＋F1-01内部决策 | schemaVersion, impactSet, migrationRef | T19/T20 |

研究文档明确区分：ISO公开目录仅支持AP242存在产品/装配数据范围；OCCT官方指南支持所列API概念但不证明Procet运行版本；W3C PROV-O给出可表达的溯源关系**不是**强制Procet采用的存储格式。范围更详见研究专题及机器可读追踪。10条规则的正负测试仍均**待产品实现/验证**。

## 6. 二十个正反验收规格（目标行为，尚未执行）

| ID | 正例 | 独立反例/阻断 |
|---|---|---|
| CAP-03-02-T01 | 一个Definition两次使用，显示两条Occurrence且位置不同 | 按definitionHash去重后只剩一个Occurrence |
| CAP-03-02-T02 | 同名不同产品标识的定义分别保留 | 仅按显示名/颜色自动合并不同零件 |
| CAP-03-02-T03 | XDE实例标签映射到正确被引用定义与局部位姿 | 把实例label误认独立几何定义，装配位置丢失 |
| CAP-03-02-T04 | 源结构的多重引用能按确切InstancePath回读 | 仅用TopoDS_Compound遍历顺序生成永久Instance ID |
| CAP-03-02-T05 | 两级非交换旋转/平移矩阵按父子乘法得到正确世界变换 | 反向相乘或显示坐标修补导致错位 |
| CAP-03-02-T06 | 只修改Occurrence位姿仍沿用同一Definition几何修订 | 把位姿变化算作所有共享定义几何修改 |
| CAP-03-02-T07 | 同文件多个free roots保留为森林 | 强行创建带工程含义的伪总装 |
| CAP-03-02-T08 | 缺失外链/循环引用进入unresolved或blocked并报路径 | 缺件被替换成同名占位Solid后报告可制造 |
| CAP-03-02-T09 | 名称颜色缺失可使用视图默认样式并注明来源缺失 | 默认渲染色反写成为正式材料/零件分类 |
| CAP-03-02-T10 | PMI及验证属性按实际Reader覆盖显示partial/unknown | 源无PMI仍从3D外观制造公差属性 |
| CAP-03-02-T11 | 差异报告将新增、删除、重挂和局部姿态改变分开 | 单纯树索引变化被认成几何替换且自动继承接受状态 |
| CAP-03-02-T12 | 版本匹配歧义保持review_required，不更新冻结工艺 | 模糊匹配自动覆盖已批准D08或D16 |
| CAP-03-02-T13 | 同sourceHash不同readerOptionsHash保留独立派生资格 | 导入配置改变仍冒称完全同一可复现结构 |
| CAP-03-02-T14 | 重设源几何需新修订与准确下游影响映射 | 仅凭形状hash相同就合并工程不同设计件 |
| CAP-03-02-T15 | CAD局部预览修改可撤销且不改正式Project修订 | OCAF单文档事务被宣称覆盖跨库CAS提交成功 |
| CAP-03-02-T16 | 快照缺必需外链拒绝完整恢复并保留原工程 | 缺资源情况下启用不完整新工程替换旧工程 |
| CAP-03-02-T17 | 选中第二个相同定义实例时选区与路径均指向第二实例 | 选择只持definitionId导致高亮/制造目标错误实例 |
| CAP-03-02-T18 | 切工程或关闭标签使迟到查询/提交回执只关联原上下文 | A工程旧回执覆盖B工程当前树/确认按钮状态 |
| CAP-03-02-T19 | 旧cad-input-v1结构能够保留原始数据并显示未知结构覆盖 | 自动补造未读装配、跨版未知单位或PMI |
| CAP-03-02-T20 | 源修订改变后下游引用显式标stale/needs_review并可回溯旧版 | 自动将D02/D04/D08/D16引用指向latest并发布 |

每例都须携带合成fixture输入、冻结的产品组合SHA、Reader/OCCT具体版本、预期typed code和退出状态；模拟场景不等于真实产品执行。实际测试尚无确定命令，入口标记`TODO_TEST_ENTRY: CAP-03-02-contract / CAP-03-02-3d / CAP-03-02-revision`，由负责工程Owner确定并在实现后补真实命令。禁止用真实客户模型填充公开fixture。 [合成用例](fixtures.json)给出20项独立positive/negative预期的机器格式。

## 7. 工作包、实现切口、准入退出、迁移回退

| 次序 | 实施切口与产物（提案，不修改代码） | 负责人角色/消费者评审 |
|---|---|---|
| A1 | B0-02锁定D01定义/实例Owner、实际源格式、最小合法多根/多实例fixtures及身份冲突判据 | CAD Owner；CAM/PMI审查 |
| A2 | F1-03公共面/ports核对：仅CAD域写DesignRevision，Host保存CAS，CAM端按exact ref读取 | CAD与平台；CAM/CLI/Agent消费审查 |
| A3 | 实际Reader输出适配：XDE label/definition/occurrence/placement、源元数据覆盖与loss report | CAD/几何；RendererPort消费审查 |
| A4 | 组合变换与显示投影：单Babylon场景Tree/SelectionIntent绑定Occurrence精确身份 | CAD/GUI；Setup与工艺审查 |
| A5 | RevisionDiff/ImpactSet版本化提案与歧义待审门 | CAD/Host；D02/D04/D05/D06/D08/D16消费审查 |
| A6 | Host事务、幂等回执、离线闭包、旧descriptor兼容读及可回退派生 | Host/Project；CAD/CAM审查 |
| A7 | T5-02正反测试、跨语言adapter、静态链接、来源证据和断网恢复回归 | 验证负责人；所有消费者签收 |

**准入**：CAP-03-01输入Contract确定；实际STEP/OCCT库版本和权限可核；F1-01引用与F1-02 Frame方案获Owner审核；F1-03、F1-04并行迁移窗口明确；黄金fixture合法可公开。**退出**：20条正反验收在精确产品组合上执行并保存回执；定义—发生多实例无混淆、修订影响和旧数据读适配通过；Owner/消费方评审完成；**规划稿不宣称这些条件已满足**。

**迁移**：旧`procet-cad-input-v1`保持只读解析，缺实例结构时显示`legacy_unresolved`，不凭历史文件名或mesh自造树；新快照追加写，历史D01/CAM修订不自动提升。**回退**：关闭新结构编辑命令而非删除已提交修订；恢复旧Reader/旧显示投影、保留CAS和影响日志；旧已批准D08/D16不静默降级也不自动重新批准。

**未决设计风险**：当前产品实际OCCT锁版本与XDE导入能力尚未核实；实例跨版本持续ID可能没有来源保证；外部引用/多根数据完整性与真实BOM semantics未验证；D01 Owner提交点和Host原子激活分工需L3评审。上述均以`unknown/review_required`进入实施门禁，不作默认假设。