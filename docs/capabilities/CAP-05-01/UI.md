# CAP-05-01｜单容器路线编辑交互（评审稿）
**约束**：全局最大字号12px；仅浅色/深色，拒绝卡片堆叠；ActivityRail→唯一左TaskPanel；同一Babylon Scene/RendererPort，杜绝为路线面板创建第二3D世界。以下为规划需求，并非已运行产品GUI。

## 区域布局
- 左ActivityRail选择“工艺”；左统一TaskPanel保持树、Setup选择、工序属性、顺序依赖、冲突与审核Tab。树可缩放宽度，切换Setup后直接定位对应Stage与Feature索引，不返回“特征分析”页。
- 中心唯一Babylon世界通过RendererPort应用`previewLease={taskId,generation,selectedOccurrenceExactRef}`；Stage→高亮装夹Frame，Operation→关联特征轮廓，Step→显示策略意图文字，不渲染伪已认证刀路。右浮Agent仅显示请求/解释/来源并受DomainPort命令权限控制。
- 底部操作日志：CAS校验、冻结冲突、UNKNOWN、被丢弃的过期回执、独立消费验证`NOT_RUN`，不能仅显示旋转loading。

## 五任务编排
1. **新建路线**：选择CAD occurrence revision/hash/frame与D04 Setup；空A模式Plan可留空。缺任意exact引用时以阻断提示标出。
2. **划分阶段**：树拖拽调整显示顺序，实际precedenceEdges只由“连接依赖”动作改变；删除Stage前必须可视化显示关联工序/冻结范围。
3. **约束审核**：同一TaskPanel展示拓扑序、跨Setup转序证据、Frame不匹配及来源精度；存在环自动聚焦红色具体边，不自动给“智能纠错通过”。
4. **候选接管**：按D06 run/hash比较多候选，仅用户批准的Operation局部采纳；Frozen D08节点显示锁状态，可fork方案不覆盖历史。
5. **保存与传播**：提交前复读权限/CAS、exactRefs与generation；成功显示新D05 revision与真正受影响D06/D09消费者；任何旧Task异步回执不改变UI可见数据。

## 状态与键盘
DRAFT / PREVIEW / NEEDS_EVIDENCE / BLOCKED / UNKNOWN / COMMITTED / STALE；“预览可见”不是“已提交”，更不是D15通过。Ctrl+Enter可触发授权提交但必须保持确认门禁；Escape取消任务并推进generation。Graph事件应可追踪id，拖拽后的行号绝不可作为OperationId。
浅色与深色共用组件结构；等待用细线流光/当前阶段文字，不动画化假确认。

## 业务字段网格（最大12px）
项目Scope、CAD/D02精确修订/哈希/Frame、Stage/Setup、Operation/Feature refs、Step参数引用、precedenceEdge、transferExactRef、freezeRef、CAS expected/current、permission状态、taskGeneration、下游影响列表、Journal receipt。编辑角色的字段应是“建议/草稿”，Agent不能直接改写D08。
