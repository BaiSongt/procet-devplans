# CAP-08-06｜NC源代码工作台UI及3D交互（仅设计）

- **唯一入口**：左侧ActivityRail的“NC”，在**左侧UnifiedTaskPanel**内切“程序/版本与差异/诊断/验证/发布”标签；同一08域Owner UseCase供GUI、CLI、Agent调用。编辑文本字号≤12px，浅/深两主题；不增加第二个Babylon实例。
- **源码编辑**：行号分栏同时显示不可变物理ordinal/offset和可重复N号；头部固定显示D12 revision、byte hash、编码/BOM、CRLF/LF、D10执行绑定、Profile固件/选件。自定义着色不得改动原始字节。编辑器预览保留原始diff、注释、块删除和多子程序引用。
- **只读警示**：编辑后标注“草稿未提交”，成功提交后标注“新D12修订/下游D13–D16失效”。不提供一键“编辑后安全通过”。语义未知`UNKNOWN`、静态语法无覆盖`NOT_RUN`、原来源变化`STALE`均有独立图标，不滥用绿色PASS。
- **3D联动**：仍为**一个Babylon世界**，通过既有Viewer/RendererPort仅高亮“源行→D13展开事件→D14轴时序”已存在映射；缺映射则灰显原因。CL预览强制显示`CL_ONLY`，D15工程验证需真实独立NC消费者。
- **并发操作**：提交按钮经Owner port重验CAS/ACL/Frame/作用域/任务代次/取消状态；取消后即使后端晚回执也只显示“已忽略”，不得写入D12新修订。变更D12、D04、D10、Profile、程序闭包即使文本没改也会导致下游旧资格失效。
- **离线与回退**：客户离线使用不依赖外部站点。历史D12、D08冻结及旧Reader保留；回退只是重新引用经校验的版本并将D13–D16标记待重新验证，不覆盖字节和用户数据库。

见[实施规则](README.md)、[来源](../../../research/sources/CAP-08-06.json)与[独立消费者](independent-consumer-handoff.md)。
