# E3-03｜GUI/CLI/Agent及3D交互（仅规划）
- ActivityRail选择NC执行时，统一左TaskPanel显示四个同容器标签：NC原文、模态事件、未知语义、来源与诊断。不额外增一个全局面板或Babylon Scene。
- 原文行→事件表→视口当前部件静态定位同步高亮；任何无来源映射的行不得高亮假数据。3D不播放CL机床运动冒充NC仿真；机床真实轴运动须从D14返回。
- 08域NcExecutionPort是GUI、CLI与Agent唯一可写命令入口；Host传递taskId、authContext、expectedRevision、cancelToken。每次提交服务端CAS+ACL重新校验，异步晚回执只能用于审计。
- 上方简短状态：待检查/解析中/UNKNOWN/已拒绝/可交D14；`UNKNOWN`必须列出NC行、控制器配置、原因和下一步，不显示绿色成功。
- 紧凑视觉：浅/深双主题、文字字号不超过12px、少卡片，加载期间展示逐步进度，支持取消但不能直接改写已冻结D08。
- 提供同一领域API的`interpret --nc-ref ... --d10-binding-ref ... --expected-revision ...` CLI示意；CLI和Agent没有越过权限/产品审批的特权。
- 工作流：选中D12→核对D10→预览语义→独立消费者送检→待D15实际通过后由10域决定D16；预览不是提交。
