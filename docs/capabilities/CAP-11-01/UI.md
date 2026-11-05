# CAP-11-01｜单场景AI工作台交互与3D上下文

**视觉约束**：字体最大12px，浅色/深色；单活动Babylon Engine/Scene/Canvas。ActivityRail在「AI工作台」状态调用左侧**唯一UnifiedTaskPanel**；AI对话面板可以独立浮窗但不创建第二个业务TaskPanel或右Drawer。工程与制造资源3D只做横向世界切换，不同时激活第二个3D。

## 交互优先级与具体组件

1. **上文快照行**：当前工程/对象、exact revision、来源Owner、unit/Frame、可读权限与Scope Epoch；缺任意关键字段显示UNKNOWN及「刷新上下文」。
2. **轻量输入**：自然语言、常用提示模板、最近选中对象；无权限提示明确显示，不填充伪默认。
3. **工具状态行**：展示「准备→读取→推理→待用户确认→提交中→成功/取消/STALE/UNKNOWN」，每次调用含名称/目标/可读范围及运行/等待动效；工具和Agent执行不能伪装成成功。
4. **候选差异区**：可折叠结构化字段变化、受影响D01–D17、具体旧revision/hash、风险与对应来源；模型生成内容必须显式标明「建议」。
5. **确认与取消**：高影响写入需独立用户确认（对象/修订/变更指纹一致）；按钮点击只请求相应Owner Port，CAS失败保留差异不静默重试。
6. **3D定位与显隐**：Babylon拾取仅派发`selectionChanged(exactRef, frame)`；AI给出的高亮为只读覆盖层。单个已存在Canvas不重建场景、不写入几何、不暗中变更WCS/Setup。
7. **离线模式**：缺网络或离线模型时显式列可用/不可用操作；不得将未经授权客户模型上传至外部服务。

GUI/CLI/Agent共享`AiWorkbenchPort`和完全相同的上下文审批结果；CLI `procet ai explain --asset D02 --revision <exact>`及`procet ai preview --proposal <id>`是拟议命令，**不是现有产品命令**。CAP-11-01只建立UI和Port规划，不替代CAP-11-04真正受管工具编排。MCP提供工具提示/人类控制建议，但**单Babylon/左TaskPanel是Procet设计约束，不冒称MCP要求**。
