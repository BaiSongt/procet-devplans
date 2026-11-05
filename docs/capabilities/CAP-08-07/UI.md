# CAP-08-07｜NC↔CL溯源界面与3D联动（仅规划）

唯一入口：ActivityRail的“NC”→**左侧统一UnifiedTaskPanel**（溯源/NC源码/执行展开/独立验证/发布）；右侧与主3D共享**一个Babylon世界**及RendererPort，不创建嵌套Canvas和第二Engine。GUI/CLI/Agent统一调用08域Owner UseCase；浅/深主题，字号不超过12px。

## 布局、状态与操作
- 顶部版本锁显示`D09 revision/hash/frame`、`D12 NC finalBytesHash/closureHash`、`D04 Setup`、`D10 executionBinding`及`Profile firmware/options`，缺任何一项禁止显示“完整映射”。
- 左栏为可重复N号的NC物理行+字节偏移，第二栏为CL片段/工序/Setup与D08冻结快照；点击单行高亮0..N条来源，不做按序号盲跳。
- 多对多映射显示“多个来源/多个生成块”，后处理插入头尾显示“无CL来源：POST_HEADER”而非错误；N号重复、循环展开按`byteSpan+callStack+iteration`展开实例。
- 右侧唯一Babylon视口仅高亮已具证据的CL片段与D14运动事件；`CL_ONLY`用独立标签，遇`UNMAPPED/UNKNOWN/STALE/NOT_RUN`显示原因，不伪用绿色安全通过。
- “提交映射”仍是Owner CAS操作，重新验权限、精确引用、任务代次和取消；晚回执忽略，不可将临时选中写成冻结批准。
- 切换Setup无需重新跑特征分析才能找上下文；恢复选择基于相同数据Owner的revision锁，而不是隐式会话副本。

[返回原业务规划](README.md) · [研究来源](../../../research/sources/CAP-08-07.json) · [独立消费者](independent-consumer-handoff.md)。
