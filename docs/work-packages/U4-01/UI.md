# U4-01｜GUI/3D 正交导航及交互明细
> 仅设计，不是已实现产品。最大字号12px，浅/深主题，低卡片密度；一套Babylon Scene，一个统一左 TaskPanel。
## 信息架构
顶层工程文档选项、左ActivityRail切换业务域、统一左TaskPanel提供查询/编辑，3D viewport全屏单Scene，右Agent浮层可隐藏；Ribbon是当前任务命令投影，不建立另一个提交控制器。
导航层级：Project → Document exact revision/hash → Setup exact revision/hash → Task/Artifact；任务跳转保留 `scopeEpoch` 及 `taskGeneration`。状态栏永久显示文档、Setup、工作模式A/B、预览/冻结/未知资格标签。
## 正交模式规则
`workMode=A|B` 是业务决策阶段；`displayMode=WORKBENCH|AI3D|FOCUS3D` 只改视觉布局，支持6种组合。Focus3D仅收起控件，不释放受管草稿、不修改D05/D08及Owner日志。切回原模式复原 TaskPanel route/focus/scroll，不创建新工程修订。
## 交互详细
- 工作区切换：有脏草稿时不可静默导航，提供保存草稿、放弃本地未提交编辑、取消跳转；保存走Owner Port，待真实ACK再导航。
- 多Setup：选择S-B时保留当前文档revision，以D04返回的setupId/revision/hash校验；若B已有加工特征和工艺，则直接按exact查询D02/D05，不强制重新识别。
- 撤权与晚回执：任务右侧显示RUNNING/CANCELLED/STALE/UNKNOWN；成功返回必须比较当前scopeEpoch和generation，错误的返回只进历史诊断。
- 缺失和迁移：旧路由失效弹出“源对象不可用/版本已迁移”，提供查看来源、显式选择新版本或返回安全只读历史，不偷偷打开默认项目。
- 3D：SelectionIntent引用GeometryRef exact hash/frame，Overlay/Preview采用单Scene租约，切换范围释放旧代理、保留用户已保存镜头；显示代理不能充当制造几何或工程碰撞证据。
- 可访问性：Tab与Arrow键导航规则参照WAI APG；选中不等于焦点，焦点可见；路由改变后设置明确 focusTarget，防止“焦点消失”。
## 输入/输出字段
输入`WorkContextRef + NavigationIntent + expectedScopeEpoch`；只读输出`ResolvedContext + mode + sceneLease + taskProjection + explicitWarnings`。唯一可写操作为单独的Owner命令，附`expectedHead/aclEpoch/taskGeneration`；UI状态不包含写回接口。
## 验收场景
两个文档三个Setup依次切换、同时运行两条查询、切A/B与Focus3D、关闭窗口/后退恢复、撤权、失效引用、Frame变化、旧任务晚回执，必须分别检查TaskPanel字段、3D选中对象、状态栏revision/hash与Owner数据库零隐式写入。性能/FPS不以合成数据推定。
