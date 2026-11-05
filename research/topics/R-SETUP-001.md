# R-SETUP-001｜制造Setup基准、坐标关系与受控工作坐标来源

**研究访问日：2026-10-19；仅合法公开目录与官方网页文本。研究成果是设计依据，不是产品测试、ISO条款认证或控制器兼容性认证。** 对应[CAP-04-01](../../docs/capabilities/CAP-04-01/README.md)、[字段/UI](../../docs/capabilities/CAP-04-01/UI.md)、[来源登记](../sources/CAP-04-01.json)和[机器追踪](../traces/CAP-04-01.json)。

## 1. 核心术语与证据层级

**设计datum（GPS）≠工艺Setup定位基准≠工作坐标WCS≠机床Machine Coordinate System。** ISO 5459:2024的官方公开范围说明其定义工程图中datum/datum system的表示与理解及规范算子，而**不覆盖实际验证算子的全部实现方式**。不能将设计datum直接推导为某个夹具接触面、G54零点或机器原点，更不能由CAD PMI宣称真实装夹测量已通过。

ISO 841:2001官方目录（2001-10，2023复审确认）说明单个数控机床运动的坐标命名与相对关系；这支持清晰区分机床坐标与工件相对编程的思路，但不提供单台B5机床轴树、原点、G54寄存器、旋转零位或TCP实际校准数据。

LinuxCNC **stable**官方《Coordinate Systems》实际阅读§2机床G53、§3 G54-G59.3、§4/5 G52/G92；G53与G54/G55是控制器语义，不是D04本体。该文档只作*一种公开控制器*语义案例；不能套用至Siemens/Fanuc/Heidenhain/B5控制器，实际需要其版本化手册与运行证据。本CAP的`offsetPreference`只存设计意图，D10/D13负责最终NC程序解释。

## 2. 几何变换的合法使用边界

当前OCCT3D官网的`gp_Trsf`公开API（页面显示**8.0.1**，即使从OCCT7.9.0旧URL重定向）写明`SetTransformation`与`SetDisplacement`的*语义并不相同*：前者变换同一点在不同坐标系下的坐标表达，后者移动一个坐标系统到另一个；`Multiply`和`PreMultiply`矩阵顺序不同，`IsNegative`可以辨别镜像，`ScaleFactor`提供缩放迹象。这支持引入明确`T^A_B`标记、顺序与反向、正交/手系检查，但不能反证当前产品Native7.9.3的具体调用已正确，也不确定全部自定义输入均有刚体约束。

`gp_Ax3` API显示可表达左右手坐标架；因此**`gp_Ax3`可构造并不等于可批准加工Frame**。Procet产品合同选用右手刚体、拒绝镜像/缩放、要求normalized轴和可逆性，这是内部安全设计选项，须由F1-02验证。数学契约`T^A_B*T^B_C=T^A_C`；产品视口Babylon变换只能是`RendererPort`派生投影，不能为迁就坐标画面直接交换真值XYZ。

`TopLoc_Location` API说明其具有复合变换与逆/乘，适合解释装配位置/几何位置的概念；`TopLoc_Location::HashCode`不是跨修订身份/许可/安全认证。STEP同一个定义在两个装配实例中需保留两个occurrencePath并分别计算姿态，不能据相同shapeHash合并放置。

### 无累积定位与包围变换

对某源几何在 CAD Part 帧中的点集 `V_P`，在目标 Setup 帧中的位置为 `{T^S_P*v | v∈V_P}`；再取`min/max`形成**Setup局部轴向**包围。不能先对原BBox的size向量应用刚体变换后取绝对值就宣布已覆盖所有非盒状对象，也不能只交换轴标签复用导入前尺寸。对于原bbox本体若只知道8个角，则将8角全部变换、取极值可给出该外包框的保守包围，但**不是一定等同真实B-Rep紧包围**；非轴对齐对象需独立几何算法/容差预算。真品体的精确 bbox 与统计误差必须通过产品Native算法检验。

定义绝对定位提案为`T_target = Solve(sourceRevision, sourceFrame, stockFrame, placementConstraints, algorithmRevision)`，其中输入**不读取当前显示ghost pose**；若约束完全相同，第二、三次输出相同矩阵。若没有确定的约束，返回`unknown/underdetermined`而非写0矩阵；如需人工偏移，作为新的显式参数进入输入，而不是将Delta累积在上一次算法结果。

## 3. 工作流、批准和缓存

当前只读 `procet-gui@4e8eec12` 看到 `useSetupWorkflow` 和`setupDraftSession`已存在集中草稿、`cam_setup_update` CAS和`cam_setup_approval_preview`服务端批准预览。规划应补消费方一致性与多人并发真实验证，不新建并行SetupController。`setupModes.ts`保存coordinate/native/legacy authoringMode与A/B探索生产编排是**不同维度**；旧数据缺authoringMode的推导只为只读展示，不具备重写旧项目的授权。

业务对象精确修订变化只使消费链中**依赖该修订**的D05、D06、D07/D09等记录标stale，需要影响表与增量重跑。已批准D08、NC签发D16都保留历史，不可因Setup重新定位由后台覆写。工程恢复应以D01/D04/采用的D03精确引用、数据内容Hash、协议版本和所需附件闭包为依据；路径、默认矩阵或旧3D视觉记忆不能代表有效恢复。

## 4. 来源阅读明细与不可推论事项

| 来源 | 实际阅读范围 | 支持 | 限制 |
|---|---|---|---|
| `SRC-SET-001` ISO841:2001 | ISO官方标题、发布日期、Abstract与2023确认记录，`catalog_abstract` | 机床运动坐标名义和工程坐标分层 | 未读20页收费正文，不能推出具体机型参数 |
| `SRC-PMI4-002` ISO5459:2024（本地已登记，复用） | ISO官方目录、Abstract，`catalog_abstract` | 设计datum是GPS规格概念 | 未读收费正文，不推导现场装夹或G54数值 |
| `SRC-SET-002` LinuxCNC Coordinate Systems Stable | §2、§3 G53/G54-59.3、局部/全局偏置，`section_text` | 控制器工作偏置有真实执行上下文 | **LinuxCNC**语义不向其他控制器泛化 |
| `SRC-SET-003` OCCT gp_Trsf | SetTransformation/SetDisplacement、Mul/PreMul、IsNegative/ScaleFactor，`section_text` | Frame变换方向、组合顺序、镜像检测 | 页面自动重定向实际为**8.0.1**，产品Native7.9.3待独立对拍 |
| `SRC-SET-004` OCCT gp_Ax3 | Direct、Location/XDirection/Direction、左右手，`section_text` | 轴系/手系表达能力 | 并非制造合同默认允许左手坐标 |
| `SRC-SET-005` OCCT TopLoc_Location | Location、Transformation、Inverted、Multiplied，`section_text` | 装配位置复合与反向概念 | 不等于可跨revision恢复实体topology身份 |

**研究→规则→字段→验收机器关系**见`research/traces/CAP-04-01.json`，规则10/对应场景20，均`productStatus:NOT_RUN`。产品实现必须对照确切Rust/Native OCCT版本和真实机器/控制器资料补证；文档不是算法真实性证明。