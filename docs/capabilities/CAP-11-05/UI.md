# CAP-11-05｜工艺推荐GUI与单世界3D（L3待审）

沿用唯一Babylon Engine/Scene/Canvas；工程3D与资源3D在同一活动Canvas横向切换，不并列双3D。唯一左侧UnifiedTaskPanel承载“上下文→参数建议→替代比较→证据→采纳草案→回执”，**不得新设右Drawer**。Ribbon与ActivityRail使用已有贡献点；仅浅/深主题，字体最大12px，AI窗口独立但无权越过Owner。

| 阶段 | 左TaskPanel字段/动作 | 3D表现 | 边界 |
|---|---|---|---|
| 1 上下文 | Project/Scope、材料/热处理、D04 Setup、D10绑定、原始Revision/Hash/Frame | 高亮当前工件/加工特征及坐标Frame | Frame错位为STALE |
| 2 方案生成 | 工具直径/刀柄伸出、有效刃数、vc、fz、ap、ae及单位 | 同场景只叠加候选几何轮廓 | 禁自动写NC |
| 3 风险与替代 | 转速、vf、Q、功率估算、能力边界、置信等级UNKNOWN | 可切换备选策略，禁止同时创建第二3D | 算式不代表安全 |
| 4 来源解释 | 逐参数来源链接、版本、适用条件、未覆盖项 | 选中证据的对象位置高亮 | 无来源禁“确定”标签 |
| 5 人工采纳 | 差异、冻结D08警示、expectedRevision/CAS、提交意图 | 预览层保持只读 | 仅05域写新D05 Draft |
| 6 结果与撤销 | OwnerReceipt、ACL/ScopeEpoch、取消/迟到回执、迁移回退 | 若失效立即撤销候选图层 | 取消不删除已真实提交事实 |

GUI/CLI/Agent三入口调用同一`ProcessRecommendationPort`和05域`ProcessPlanningOwnerPort`；不可通过CLI绕过GUI风险门禁。3D选中仅生成选择意图，不能冒充NC D15验证。等待动画只在真实异步任务进行时启用，未知和失败不显示完成态。

测试入口：`node tools/check_cap1105_planning.mjs`检查规划JSON/状态/公式；浏览器3D实际实现、Owner Port集成和机床验证仍未运行。
