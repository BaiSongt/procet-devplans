# CAP-03-04｜UnifiedTaskPanel五页GUI与单Babylon3D交互合同（评审稿）

> 所有控件、命令均为规划提案，非现有页面承诺。必须使用现有`ModuleRegistry/ContributionHub/RendererPort`与一个主交互Babylon世界；主模型/制造资源空间横向切换而非两套Scene并排。模型姿态投影不能修改Frame真值。

## 页面和用户任务

| 页面 | 使用者与目的 | 输入区与只读区 | 底部操作、3D联动 | 异常 |
|---|---|---|---|---|
| 1 来源与读取 | CAD工程师检视文件协议及PMI可读性 | 输入：源CAD exact revision、可选reader profile；只读：sourceHash、AP版次、Reader锁、`semanticCoverage/graphicCoverage/lossReport` | `预解析`、`查看源`；单场景在源形体上显示PMI coverage热区 | 只读/超时/unsupported可重试，禁止自动报full |
| 2 尺寸和公差 | PMI工程师区分名义值、公差与符号 | 尺寸种类、名义、上限、下限、单位、表达源；readonly原CAD文字与源entity | `新增补录修订`（不写源CAD）；3D选择尺寸关联拓扑，侧栏展示对应记录 | unsupported modifier锁定采纳，显示原文 |
| 3 基准与GD&T | 质量工程师复核系统和引用顺序 | 标准体系/版次、datum目标、先后、zoneType、修饰符、标注坐标frame；只读警告 | 3D高亮目标与序列标签；`预览关联`→`人工确认引用` | datum缺失或不唯一只给候选，不能确认制造要求 |
| 4 复核与冻结 | 审批人审查精确集合和风险 | exact源hash、modelRef、拓扑hash、语义覆盖、问题清单、approval policy；派生资格只读 | `差异复核`/`冻结审批`两步；3D差异叠加仅显示 | CAS冲突/策略变化/权限丢失在提交点拒绝，保留draft |
| 5 消费与追溯 | 工艺/质量工程师查看下游影响 | Frozen package exactRef、消费清单、D02/D05/D08/D16状态、stale map只读 | 高亮D02特征或检验目标；只读导出追踪清单 | provider missing→明确blocked；不能从GUI绕过PmiPort |

## 字段精细化

| GUI标签 | 绑定字段 | 编辑/默认值 | 单位/来源与校验 |
|---|---|---|---|
| CAD源版本 | `modelRef + modelRevision + sourceHash` | 由选择的工程模型带出，不可改 | 无单位，来自D01 exact修订，不得“latest”回放 |
| 标注表现形式 | `representationKind` | readonly，默认`unknown` | 源Reader：semantic/presentation_only/partial/none/unsupported/unknown |
| 尺寸类型/名义值 | `dimension.kind/nominal` | 有权限的人工补录draft可改；源导入只读 | mm或deg从源与显式单位转换，未知禁止默认mm |
| 上下偏差 | `dimension.lower/upper` | 受规则验证；不能直接把公差符号转成±数 | 与尺寸单位同类型，检查finite和上下范围 |
| 公差带与修饰符 | `gdt.zoneType/modifiers` | 从Reader来不可猜；人工选择必须留原因 | 各枚举受`interpretationProfile`版本控制 |
| 基准字母和先后 | `datumSystem/precedence` | 可用结构化序列审查，不能输入自由字符串直接Approve | datum feature exact topologyId，局部Frame标明来源 |
| PMI/几何关联 | `topologyEntityRefs, occurrencePath` | 3D拾取仅暂存候选，点击确认生成审查动作 | 用同源snapshot/实例路径，禁止以mesh三角片索引提交 |
| 来源与策略 | `producer, readerVersion, standardSystem/Edition, approvalPolicyRef` | 源只读/人工修订有审计；缺失为unknown | ISO GPS和ASME体系不自动互译 |
| 采纳资格 | `consumptionQualification, issueCodes` | **只读派生**，不以按钮手工切green | `usable/partial/blocked/stale/unknown`及依赖报告 |
| 保存回执 | `requestId, expectedRevision, scopeEpoch, receipt` | 系统产生，用户可复制诊断ID | 必须回读提交实际revision/hash，超时后按requestId查询 |

## 一次3D交互的真实生命周期

1. 点击尺寸条目→RendererPort从拓扑Ref解析高亮对象，显示原坐标系/单位；若仅有mesh，则显示`visual_only`且禁用“确认锚点”。
2. 鼠标拾取source face→写到**临时SelectionContext**（非D01/D02数据库），同步左侧条目候选和同世界PMI marker；主资源切换不新建Engine。
3. 点击“检查/预览”→请求后端无副作用校验，返回snapshot、ambiguity列表与scopeEpoch。多实例同几何必须明确`occurrencePath`。
4. 点击“确认绑定”→发`expectedRevision + requestId + actor + sourceHash`领域命令；成功回执引导至新revision，失败保持选择/诊断，不偷换当前选中。
5. 快速切文档/Setup/工程/关闭/撤销或编辑并发冲突→scopeEpoch变化，迟到结果保存到原请求历史，只更新该请求记录；绝不污染现视口；取消已提交请求仅可新修订撤回。

## 审查验收（具体产品入口尚未建立，`TODO_TEST_ENTRY`）

须覆盖：同一零件定义的两实例不同PMI、缺Datum、sourceHash变更、CAD拓扑分裂、presentation-only、未知标准体系、尺寸mm与deg混合、CAD语义导入loss、补录与原生语义冲突、协同CAS竞态、离线恢复缺件、审批回执超时、Agent和GUI同权限、多面多边拓扑匹配误差、旧版reader向后兼容，以及发布后源要求失效。UI不是审批真值，3D看见标注不证明GD&T被解析。

## B83（2026-11-01）标注平面与Capture操作补充

沿用本文件五页结构、唯一Babylon世界与左UnifiedTaskPanel，在第三页内添加平面管理、参考Plane/NamedView、Driven/Frozen、翻转/文字旋转、附件偏移及每PMI的planeId；第五页新增Capture及camera/visibilitySet的只读互操作对照。方向Plane、标注实际位置与Saved View三者独立；切换活动Plane**不能覆盖已建PMI**。屏幕避让只更改Renderer临时投影，字体≤12 CSS px而命中区域独立设置，颜色随浅/深主题变化。导出完整Saved View时缺Camera或成员仅UNKNOWN；Clip/切面属Capture/视图层，GD&T语义仍属03域Owner。

[完整流程/字段与失败迁移](ANNOTATION-PLANE-B83-2026-11-01.md) → [规则/验收](../../../research/traces/CAP-03-04-annotation-plane-b83-v08.json) → [Node只读校验入口](../../../tools/check_cap0304_annotation_plane_b83_v08.cjs)。CLI/Agent沿用同域受管命令、提交点CAS/ACL、取消迟到回执不串工程。T5-02真实CATIA/Creo/AP242独立消费者入口仅规划，NOT_RUN。

## B121｜尺寸Plane适配与Ordinate基线操作（2026-11-03）

在原单容器第2页“尺寸和公差”与第3页“基准与GD&T”之间复用已有导航，不增加右侧Drawer。选D01 exact修订/Hash/Occurrence和Face/Axis→选D02维度类型→预览Plane法向/轴向相对关系→通过03域`PmiAnnotationPort.checkDimensionPlaneCompatibility`拟议命令给出CANDIDATE/UNKNOWN/STALE/REJECT的原因、源Reader/Profile与Frame，不以点击次数或屏幕线长提交制造尺寸。Plane选择只影响当前候选而不是历史冻结的D02；球面其他参考未知不能放行。

Ordinate组树单独显示Baseline exact ID/revision/hash与子成员，修改Baseline应展现新旧Plane及全部STALE传播影响；若Baseline环、失效、跨Occurrence或子项使用不同Plane，禁止采纳并保留原始信息。屏幕避让仅在Renderer临时状态，统一左UnifiedTaskPanel、单Babylon Engine/Scene/Canvas、浅/深主题、文字≤12px；GUI/CLI/Agent同03域Owner Port，正式提交处ACL/CAS重验及取消迟到回执隔离。参见[完整研究与测试入口](DIMENSION-PLANE-COMPAT-B121-2026-11-03.md)和[机器追踪](../../../research/traces/CAP-03-04-dimension-plane-b121-v08.json)。真实产品NOT_RUN。
