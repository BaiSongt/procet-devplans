# U4-03｜唯一Babylon世界与统一TaskPanel交互规范（L3候审）

**用户观察结果**：ActivityRail切“工程/制造资源”时视口仍是同一`RendererPort.scene`，仅换世界根节点/高亮层/相机书签；所有任务从左侧统一TaskPanel打开，Ribbon和Agent不产生第二个任务保存器。浅/深两主题，正文/标签最大字号12px；快捷键焦点可见且不被浮窗遮挡。

| 交互 | 发起处 | 领域命令/可视化 | 空态/错误 |
|---|---|---|---|
| 点击工程树“毛坯B” | 左TaskPanel | `SelectionIntent(SELECT, exact D04)`；同一世界高亮；只读 | 旧Frame→`STALE_FRAME`及重新定位 |
| 3D点击面/刀具组件 | Babylon Picking | 映射为D01或D03 exact GeometryRef，左面板定位同一ID | Mesh仅视觉Proxy→`PROXY_ONLY`，不授资格 |
| 鼠标悬停 | 任一列表/3D | `HOVER`单租约，新的HOVER覆盖旧租约 | 资源不在本地→`UNAVAILABLE`，不伪造0对象 |
| 打开装夹预览 | 左TaskPanel/Agent | `OverlayLease.open`，透明虚线轮廓+Frame轴标注 | Frame/Hash不匹配→拒绝显示 |
| 按Esc或pointercancel | 视口/TaskPanel | `OverlayLease.release`，清观察者、Gizmo、GPU Overlay | 不丢弃编辑草稿，不产生Owner写入 |
| 用户点击“编辑” | TaskPanel | 进入U4-02 EditSession，同领域命令CAS+ACL重验 | 撤权/HEAD前移→显式冲突，旧冻结未改 |
| 切换至机床执行视角 | ActivityRail | 只读D10/D14/D15来源和验证状态 | 无D13实证→UNKNOWN，不将CL预览标D15通过 |

### 动画与可访问性
Hover至高亮过渡允许短动画，任务进行显示实际工具执行状态，禁止伪进度；禁用动画时结果相同。键盘焦点与选中状态分离（W3C APG），焦点可见（WCAG2.2）；必要时单独提供定位选中对象的可访问按钮。几何Proxy显示`可视代理/非验证模型`标签；NC验证结论只取D15 Owner证据，不由颜色反推。

### 概念布局
`ActivityRail(工程|制造资源|标注|Setup|特征|工艺|刀路|NC|发布)` → `UnifiedTaskPanel` → `单Babylon Scene`，Agent为可独立显示的浮层，所有命令进入同一个领域用例。禁止每个工作台自行new Scene/ToolController，Hover/Preview租约关闭后释放资源。此处是架构约束，Babylon官方确实支持多Scene，不能虚称其技术上做不到。
