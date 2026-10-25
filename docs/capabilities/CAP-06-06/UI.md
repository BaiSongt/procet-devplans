# CAP-06-06｜GUI/3D交互设计（非产品实现）
统一左侧`TaskPanel`以06域任务贡献接口挂接「候选搜索」：作用域栏（工程/零件/Setup exact引用只读），预算栏（Beam宽、Boolean次数、时间、展开数、内存、并发数，显示单位与预估/实际区分），运行栏（排队/正在扩展/布尔计算/等待独立D07/取消中/UNKNOWN恢复），结果栏（候选Frontier表、剪枝原因、分支差异、预算消耗）。GUI/CLI/Agent共享`06.SolverCandidatePort`，UI按钮不直接操作文件系统和冻结D08。

**单Babylon世界**：只在已有Scene用一个`SearchPreviewOverlay`绘制已有D07封存状态和候选轮廓/分支高亮；多路径时间树放TaskPanel内2D表与小型SVG，**不新增第二Scene**，不把示意轮廓或CL级动画冒充实体布尔或NC D15验收。选择候选加载资产Owner readonly投影，带`sceneLeaseId,scopeEpoch,generation`；取消/切换Setup清除上一个租约。右侧Agent浮窗可以用自然语言配置预算，但必须回显等价schema和差异，权限与提交守卫与GUI/CLI完全一致。

显示两种状态：`SYNTHETIC_RULE_PASS`表示本仓测试，`PRODUCT_NOT_RUN`表示未实施。候选卡旁持续显示`D07独立检查: NOT_RUN`、`D08批准: PENDING`、`D13: UNKNOWN`、`D15: NOT_RUN`、`D16: BLOCKED`，禁止渲染“机床安全通过”。任务取消后迟到结果仅在历史日志出现，不能回填当前Setup。

视觉遵循浅/深双主题，最大字号12px、紧凑行间距、少卡片、状态以窄线/文字表达；GPU流光只是进度动画，与Worker真实任务事件对齐，后台无事件时标识等待。Budget组件必须标注硬限制与审查中的默认值，不编造行业标准默认阈值。

恢复失败呈明确提示`CHECKPOINT_MISMATCH/UNKNOWN_RECOVERY`，提供重新计算新运行的入口，旧checkpoint保留可查。工作台、AI+3D与Focus3D仅展示模式，不改变物理工程证据；D04 Setup不绑定D10实际机床。
