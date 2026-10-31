# T5-01｜AI工具、知识溯源与GUI/3D交互
> 仅规划原型文字；不产生第二Babylon Scene；所有可交互文字最大12px，仅浅色/深色两主题；必须通过设计及可访问性审查。

## 业务信息架构
Ribbon切换工作模式，ActivityRail只切领域，**唯一左侧UnifiedTaskPanel**展示当前任务的“输入→检索证据→建议→工具执行→批准→结果”；右侧可独立显隐Agent浮窗，不在Agent内部重复造资源树或控制台。单Babylon Scene是共享3D画布，Selection、OverlayLease、标记高亮来自只读exact GeometryRef，禁止把高亮当作已执行工艺或D15碰撞结果。A/B只是交互模式，不改变冻结数据权属。

输入区提供“作用域 Project/Document/Setup + revision/hash/frame”、“允许读取的资源”“建议/受控执行”明确开关。未知引用标注“缺来源”；无审批时只能生成可复制方案，**不出现假成功Toast**。每条引用点击可定位文档页/几何元素、显示来源hash、可见性与已失效告警；定位若Frame或文档版本不同，显示不可定位并可选择重新检索，不静默投影到新Setup。

## 状态反馈与用户可见性
按TaskId和generation显示阶段标签：排队、检索、模型推理、等待工具、工具执行中、等待人工审批、已提交（附Owner回执）、失败、已取消、范围过期、语义未知。执行中使用克制的流光/细线动效，同时给出静态文本状态和取消按钮；遵守reduced-motion。取消立即禁止新工具执行，待执行回执只能入原任务事件流，不能覆盖新工程。失败操作固定reasonCode和重试前提，权限撤销不能换账户或API绕过。

## 交互与验收
相同领域操作在GUI/CLI/Agent路径下用相同Schema/Owner Port，拥有相同拒绝原因；按钮disabled不等于Owner授权。全部提交须Owner CAS/ACL/取消重验。临时叠加层只有read-only OverlayLease，退出/切Setup释放Observer、拾取映射和Gizmo而不Dispose共享Scene。证据图仅可显示真实版本依赖，未知边显示UNKNOWN。推荐参数不可绕过D05批准，CL动画不充NC验证。

验收环境：键盘-only导航/焦点恢复、深浅主题、100/125/150/200%DPI、窗口缩放、长输出滚动、取消后晚回执、重复点击及旧工程恢复；另需真实Babylon GPU与Owner回执双通道独立取证。以上均待产品测试，并非规划内存合成PASS。
