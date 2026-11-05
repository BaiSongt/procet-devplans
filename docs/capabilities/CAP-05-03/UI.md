# CAP-05-03｜GUI与3D交互审查稿
**统一最大字号12px，只有浅色/深色主题。** ActivityRail左侧「工艺」→统一TaskPanel容纳工序树/依赖图/差异/审计。**只能使用Host现有一个Babylon世界**，RendererPort按租约高亮CAD occurrence/Feature/Setup；右Agent仅建议和解释，不建立影子权威计划。
1. 拖拽Operation：只改显示排序，状态标「视图排序·未修改依赖」。点击显式「新增前置」「删除边」才编辑有向DAG并预览见证路径。
2. 选中跨Setup Operation：面板必须展示D04 Frame、真实`transferExactRef`、UNKNOWN阻断原因；不展示虚构的D10绑定结果。
3. 采纳D06候选：给出run/hash、变更Operation子图、D08冻结冲突、影响范围。冻结子图不可被Agent直接采纳。
4. 左TaskPanel预览与3D几何高亮同步但都是只读；一个Scene、一个选择状态源；不得把CL预览标签写成D15 PASS。
5. Ctrl+Enter的提交需服务端CAS/ACL重验；Escape取消推进generation。异步晚回执只写审计，不能覆盖新scope。
6. 失败侧栏按业务码定位受影响稳定ID并提供重读、fork、人工处理选项。旧Frame/hash不完整时只读。
验收入口为`node tools/check_cap_05_03.mjs`；真实Host/Babylon及独立消费者NOT_RUN。
