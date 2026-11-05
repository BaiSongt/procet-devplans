# CAP-11-04｜Agent工具编排界面与3D（L3待审）

入口严格共用`AgentOrchestrationPort`，不得另起Agent专属数据副本。**只允许一个Babylon Engine/Scene/Canvas处于活动状态**；工程世界与制造资源世界按横向切换，共享活动Canvas，禁止并排双3D与隐式第二渲染器。所有功能置于**统一左侧UnifiedTaskPanel**，不出现右侧Drawer；UI最大字体12px，仅浅/深主题，AI窗口可独立但权限和Owner同源。

| 用户步骤 | 统一左面板字段/操作 | 3D反馈 | 提交边界 |
|---|---|---|---|
| 1 意图确认 | Project/Scope、模型身份、作用域 | 单世界聚焦当前零件 | 仅读候选 |
| 2 计划预览 | DAG、节点类型、依赖、成本预算、来源 | 只画选中对象/Frame/工艺候选高亮 | 预览非提交 |
| 3 风险审查 | targetOwner、exact revision/hash/frame、sideEffect、UNKNOWN | 只读图层/状态颜色 | 未确认不派发 |
| 4 人工审批 | actionDigest、批准者、Scope、到期、冻结差异 | 原世界可比较A/B不覆盖 | 审批仍非业务提交 |
| 5 执行 | Tool/Port、执行中、取消中、超时、重试次数 | 显示Owner-validated可视状态，不从CL假冒NC | 每步Owner重验 |
| 6 结果对账 | OwnerReceipt、CAS、取消晚ACK、审计traceId | 结果快照绑定exact revision | 冻结不被覆盖 |
| 7 发布前核查 | D04/D10差异、D12/D13/D14/D15、D16状态 | CL_ONLY与NC证据不同标识 | 只有D16受控签发流程 |

状态等待流动边框仅在Agent/工具实际运行时启用；失败/取消停动画且展示`UNKNOWN/STALE/REJECT/CANCELLED`。点击3D对象只产生选择意图；GUI/CLI/Agent相同Port/API、相同审批和CAS重验，不允许换入口绕过拒绝。测试入口：`node tools/check_cap1104_planning.mjs`（规划数据），真实交互与浏览器仍`NOT_RUN`。
