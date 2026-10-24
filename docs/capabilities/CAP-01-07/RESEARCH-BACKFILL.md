# CAP-01-07｜工作台与3D交互：研究补证与可交接规格

**2026-10-19 新编；已有第01批原规格保留原字节与 AT-01～08；L3待人工批准；产品、Electron、Babylon运行和独立消费者测试均 NOT_RUN。** 不增88项分母。

[原规格](../batch01-v0.9.1/01_功能规格/CAP-01-07_工作台与3D交互.md)｜[研究专题](../../../research/topics/R-UI3D-001.md)｜[来源](../../../research/sources/CAP-01-07.json)｜[规则追踪](../../../research/traces/CAP-01-07.json)｜[正反场景](fixtures.json)

## 1. 业务事实、Owner和不可变边界

GUI Shell拥有唯一ActivityRail、Ribbon、左侧UnifiedTaskPanel和唯一 Babylon Engine/Scene/Canvas，空间选择和相机只是**显示派生**；Host/Project拥有WorkContext及版本化作用域；各领域拥有实际 EditSession、D01、D03、D04、D05、D09、D14 等权威对象。GUI、CLI、Agent不得建立独立的制造真值或绕过Host身份/授权/领域CAS。

A/B是同事实的探索/生产业务模式，不与展示模式或Host ControlMode合并；关闭Panel/Focus3D不等于批准、取消Job或提交Draft。**D04工艺Setup定位与D10机床执行绑定分离**；D09 CL播放只是预览，不等于D13执行语义→D14轴时序→D15工程验证→D16发布许可。未建模NC语义报告unknown，不伪造PASS。

## 2. 业务流程、GUI与3D交互

1. ActivityRail按当前WorkContext聚合模块贡献；同一TaskHost调度打开、关闭、聚焦，不添加第二主3D/中心Tab或多个并行TaskPanel；Ribbon为当前任务命令投影。
2. 项目与制造资源空间使用单一Scene中不同可见根及相机会话。资源选择保存原D04 Setup exact引用、发起者scopeEpoch、预期revision与项目相机状态；隐藏根不可拾取。
3. 树、列表、3D Picker形成SelectionIntent，仅保存Mesh→源D01/D03 exact语义映射；树节点键盘焦点不自动等于制造选择。绑定 `sceneRevision`、`documentInstanceId`、`sourceFrame` 和 `renderFrame`，过期或无来源仅作为候选显示。
4. 编辑进入领域EditSession，UI更新短期PreviewLease。确认后重新校验Actor、Owner exact修订/hash、权限、frame及幂等键，真实提交回执读回后才更新业务显示。关闭/取消/切scope释放租约，不能生成暗中业务写入。
5. 资源空间返回若Setup已变更、权限失效、当前S2不是原S1，旧回执标明原属与失效原因，并提示重新确认，不得覆盖当前业务。
6. 1366×768、125%缩放和触屏/鼠标下保留字段错误定位、键盘焦点与可达提交；真正的模态确认弹窗管理焦点，普通TaskPanel不是模态陷阱。

## 3. 字段和数据契约

| 字段 | Owner/用途 | 必须校验 |
|---|---|---|
| workContextKey、originScopeKey、scopeEpoch | Host导航路由 | 项目/文档实例/Setup exact；跨scope隔离 |
| taskContributionId、taskHostVisible、presentationMode | Shell/ContributionHub | 仅视图，不能变领域revision |
| spatialSessionId、rendererHostId、activeRootId | RendererPort | 仅一Engine/Scene/Canvas；非活动根不参与pick |
| selectionRef、geometryExactRef、sceneRevision | D01/D03语义Owner + Renderer映射 | current source revision、实例路径、scene revision |
| sourceFrame、renderFrame、units | C0最小Frame接口 + 数据Owner | 明示坐标手性/米与毫米转换；仅显示变换 |
| editSessionId、baseRevision、previewLeaseId | D04/D05等领域/渲染端 | 预览无权威写入，CAS提交重验 |
| requestId、expectedRevision、hostActor | Host及目标领域 | 幂等/权限/取消晚回执；Actor不可由消息体自证 |
| semanticStatus、verificationStatus | D13/D15所有者 | unknown不可映射到PASS/发布 |

**C0保持最小单位/身份/Frame/revision/hash/scope规范；L1/L2不改，L3仅列审批提案**。glTF的右手Y-up和米制只适用于glTF载体，不自动成为CAD/OCCT/工件坐标；Babylon可多场景不意味本产品允许多主世界。

## 4. 十规则、独立正反验收与消费方

- 机器映射含7个已阅读官方公开来源、10个 `UI3D-R01..10`、20项 `CAP-01-07-AT-01..20`；每规则含源ID→字段→双向测试→原工作包。前8项原规格的业务期望不变；AT-09起新增反例和迁移隔离案例。
- **独立消费方**：D01 CAD对象/Frame、D03制造资源选择、D04 Setup CAS、D05工艺Draft、D09 CL呈现、D13/14/15 NC工程验证、D16发布守门及Host权限/撤销；各消费方以真正当时产品exact HEAD/SDK/测试命令复验，不能只靠GUI截图验收。
- **测试入口候选（需产品负责人确认）**：`TODO_GUI_E2E_BABYLON_SINGLE_WORLD`、`TODO_HOST_TASK_CANCEL_CAS`、`TODO_CAM_SETUP_RESOURCE_RETURN`、`TODO_NC_UNKNOWN_FAIL_CLOSED`、`TODO_A11Y_KEYBOARD_ZOOM`。未在本轮执行任何真实产品测试，不把JS结构自校验计作产品PASS。

## 5. 实施迁移/回退和交接

保留现有TaskHost/旧Controller/RendererPort适配层，先建立可查询的Contribution注册和scope寻址，逐次替换重复Drawer/3D世界的**调用入口**，不删除仍有历史数据/消费者使用的端口。部署前逐项记录旧读者/旧存储Schema的兼容计划、feature flag与回退验证；回退只切回旧reader/route，已持久化领域revision必须保留，冻结D08/D16不被显示模式切换覆盖。

并发拒绝、取消晚回执、unknown渲染语义、跨Setup误回填均属产品发布门禁反例；不做材料扫掠仿真。若Renderer取舍、性能指标、具体UI token未获业务Owner/GUI Owner/独立测试者会签，维持草案状态。

## 6. 研究结论适用深度

W3C Pointer Events L3 于2026-06-30成为Recommendation，本文只读取相关事件/捕获章节，不认定浏览器端测通过；WAI ARIA APG是规范性建议与操作模式资料，不是制造软件认证；WCAG 2.2网页已检查但尚未跑符合性工具；Babylon官网仅说明具备pick与左右手支持，产品的单世界是内部选择；Khronos glTF2.0.1只约束glTF文件坐标，不自动证明OCCT/G-code中的Frame转换正确。每项版本/日期/作者/章节和未读限制记录在来源JSON。

校验边界：**规划JSON结构与8个故意错误变异 PASS（内存静态校验），Python校验入口未运行、真实GUI/Renderer/NC/产品消费者均 NOT_RUN**。
