# CAP-04-01｜工艺Setup与工件基准——统一任务面板和3D交互规格

**2026-10-19，规划草案，L3待审。** 配套[业务规格](README.md)、[研究](../../../research/topics/R-SETUP-001.md)、[验收](fixtures.json)。不新增第二个Babylon世界；左侧UnifiedTaskPanel唯一容器固定/可调宽，主模型与资源 3D 在同一视口内横向切换而非并排。Ribbon仅触发受管域命令，3D glyph 是投影不是写入权。

## A. 五任务页面和状态机

| 页 | 顶部业务问题 | 主要UI字段和操作 | 3D联动和提交界限 |
|---|---|---|---|
| ① 加工目标 | 当前编辑哪一个零件及哪一次装夹？ | Project/Document、`setupId`、CAD目标exact修订、装配实例路径、模式coordinate/native/legacy、Setup列表；新建、复制、切换 | 选中零件实例高亮，资源不存在仍可浏览CAD；选择列表不写D04，显式新建才创建draft |
| ② 基准与坐标 | Part、Setup、设计datum、WCS是不是同一概念？ | 设计datum只读引用/资格、Part Frame源、`T^S_P`、WCS origin/X/Z、单位、方向、EPS配置版本、工作偏置“计划标签” | 3D显示Part/Setup/WCS坐标轴与方向箭头，切换比较原位姿/拟议位姿；点击“应用到草稿”才patch，非D10下发 |
| ③ 毛坯与定位 | 实际毛坯是什么形状、在哪个frame？ | stock资源引用、类型、长宽高/直径长度、毛坯Frame、是否手动定义/按按钮显式计算、余量及其来源 | 计算按钮显示local bbox与来源、红/黄/灰未知状态；采用需要二次确认，绝不自动扩尺寸；不支持类型不能靠bbox默许 |
| ④ 装夹与约束 | 工件怎样落座、如何与夹具关联？ | 夹具exact引用、安装接口/自由度约束、支撑/夹紧来源；居中、落座、对齐、撤销、重算 | 只读线框机床/夹具可选，真实接触、负载、机床可达性均not_verified；连续点击不累积位姿；不允许从机床外观猜轴树 |
| ⑤ 预检、批准与影响 | 这次保存修改了什么，谁需要重新计算？ | field issues、源revision、变更diff、依赖D05/D06/D08/D09、草稿/已批准、批准人及审查指纹、保存/批准/回退 | 旧新坐标叠加；确认弹层列具体被替换的placements/批准状态变化；服务端提交点重验权限和CAS，成功回执才更新状态 |

统一页面底部保持工程状态条（Project/Document/Setup、frame标签、`draft/dirty/stale/conflict/readonly`与`unknown`），主3D底部浮动状态不再独立复制。3D点选源Solid/Face时，如果只有mesh三角索引、没有合法TopologySnapshotRef，允许预览但“指定制造定位面”动作禁用并显示原因。资源空间与主视图共享选择上下文和版本，不建立资源3D第二控制器。

## B. 字段级输入、默认和只读派生

| Field/path | 展示单位 | 输入来源 | 默认/读写态 | 错误与恢复 |
|---|---|---|---|---|
| `targetCadRef` | — | D01精确选择 | 必填，关联只读；点更换需创建新Revision候选 | `SOURCE_REVISION_MISMATCH`→查看CAD差异/新版本映射 |
| `partFrameRef.origin` | mm（若原单位inch先显式转换） | D01/用户设置 | 用户改拟议变换，不直接改CAD源 | `UNIT_UNRESOLVED`拒制造确认 |
| `partFrameRef.axes` | 归一化方向 | 精确几何/经审查人工指定 | 修改要记录依据、axis frame来源；派生det只读 | `FRAME_LEFT_HANDED`或`FRAME_NON_RIGID` |
| `designDatumRefs` | — | 03域PMI读取/人工关联 | 可空，但显示`unknown`，不默认即WCS | `PMI_DATUM_UNBOUND`需审查，不伪填 |
| `T^S_P` | mm平移+旋转(度输入/弧度内部) | F1-02变换端口 | 矩阵可查看，建议用受控轴+角和原点编辑；det及逆变换只读 | `FRAME_COMPOSITION_INVALID` |
| `stockFrameRef`、`stockDimensions` | mm | 02域资源+用户采用 | 新建时`unconfigured`；**禁止导入时计算或自动扩容** | `STOCK_NOT_CONFIGURED`→显式定义按钮 |
| `bboxEvidence` | mm | 点击“计算候选”后几何内核 | 只读，显示目标Frame/计算版本/上下界及差值 | `BBOX_SOURCE_STALE`→重算不得把旧数转新轴 |
| `wcsIntentFrameRef` | mm/度 | 04域设计 | 未知时允许部分草稿；不自动下发G54/G55 | `WCS_NOT_DEFINED`→定义后再审核 |
| `offsetPreference` | 偏好符号 | 用户 | 候选G54等标签不等于D10机床寄存器数值 | `CONTROLLER_OFFSET_UNKNOWN`→D10确认 |
| `selectedMachineRef` | — | D03/D10 | **不属于本CAP必填**，只读绑定提示 | `EXECUTION_BINDING_MISSING`仅NC侧阻断 |
| `approvalFingerprint` | hash | CAM批准预览服务 | 只读，失效即重新获取 | `APPROVAL_PREVIEW_STALE` |
| `expectedRevision`、`scopeEpoch` | — | Host/Workspace | 只读内部提交字段 | `REVISION_CONFLICT`→对比、重载、分叉 |

数值回显精度是UI格式，不等于几何计算容差；默认尺寸、默认1mm余量或默认B5机床均不可写死。所有输入字段显示数据来源：`source`, `manual`, `derived`, `unknown`。若源单位unknown，先确认和记录转换，不自动按毫米解释。

## C. 同一世界的3D交互细节

`Select`：用户点 CAD拓扑/Frame Glyph/资源锚点，返回 `{projectId, documentInstanceId, setupId, geometryRevision, topologySnapshotRef, instancePath, pickingKind, worldPoint, renderProjectionVersion}`。仅mesh pick不能提升为制造拓扑引用。

`Preview`：F1-02计算候选刚体矩阵，绘制 ghost工件/毛坯bbox/基准轴三层，标注旧/新 origin 与围框差值（毫米），提供`unknown`层。不改变D04；点击三次“居中落座”每次从同源输入计算**同一结果**，不采用`currentPose += delta`。

`Confirm draft`：点击“应用到草稿”才patch本地唯一`setupDraftSession`；点击“保存”经领域命令+Host CAS提交；点击“批准”单独调用服务端批准预检与权限重验。取消恢复本地上次draft快照，不回滚已经真正commit的历史修订。

`Switch setup`：保存提示→suspend本Setup草稿→切换到目标exact setupId→恢复其session；监听异步scopeEpoch，旧回执不得写新scope。多文档与同文档多Setup分别测试。`Switch 3D space`只改变渲染资源上下文，不重建业务状态。

`Error`：field code/expected/actualRevision/scope/recoverAction结构化展示，不能向用户弹`[object Object]`。任务失败时显示已持久化的真实回执状态和重新查询入口。

## D. 测试前置与人类评审项

至少准备无机床的单Solid、旋转45°模型、同CAD双实例、多Setup、已有批准Setup、CAD修订导致缺失定位面、英寸模型、no-brep mesh、容器重装导致project scope变化、旧`authoringMode`未知以及当前协调前端源码真实屏幕录制。正式验收由04域Owner+03/05域消费者+独立验证执行；本次文档场景均`NOT_RUN`，未运行Babylon交互测试。