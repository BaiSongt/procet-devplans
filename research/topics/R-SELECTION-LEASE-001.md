# R-SELECTION-LEASE-001｜GeometryRef、选择语义与单世界预览生命周期
日期：2026-10-25。范围：原U4-03，领域01/02/03/04/09。仅方案待评，未取得产品运行证据。

## 理论区分
**第一类：官方框架能力。** Babylon允许多个Scene（S01），并提供HighlightLayer/addMesh/removeMesh（S02）与Mesh ActionManager Picking（S03）。因此“单Babylon世界”是Procet为了跨工作台身份与生命周期统一作出的自主治理决策，并非Babylon规范强制。Mesh有绘制身份却没有业务对象的权威性；必须经`meshPickId→{owner,revision,hash,frame}`解析并精确复核。

**第二类：交互与可访问性。** Pointer Events 4当前为2026-10-08 Working Draft（S04），支持pointercancel和捕获释放行为；W3C APG树模式S05强调DOM focus与selected状态不同，WCAG 2.2（S06）要求键盘及焦点可见。故`FOCUS`与`SELECT`必须分开，Esc释放预览并不等于丢弃草稿。

**第三类：取消与数据一致性。** WHATWG DOM S07描述AbortSignal支持通知异步操作取消，不提供撤销已提交Owner数据的语义；RFC9110 S09的If-Match只作条件更新类比。本领域提交仍必须自己完成CAS、当前ACL、scopeEpoch、generation与取消重验。PROV-O S08可表示来源，但不替代内容hash和真实Frame转换计算。

## 关键规则推导与反证
`visible(overlay)`当且仅当`lease.scopeEpoch=active.scopeEpoch ∧ lease.generation=active.generation ∧ geometryHash=ownerExactHash ∧ !cancelled`；这条表达式是Procet设计规则，非W3C或Babylon宣称的行业标准。旧mesh在重新加载后可变id，因此以MeshId作为永久GeometryRef会产生假同一性。数据Owner revision/hash/frame比显示名字或包围盒更有优先权；Frame错版则`STALE_FRAME`，不能仅凭视觉重合认定配准成功。

`release(lease)`只释放可视观察者、拾取映射、Gizmo、GPU overlay资源；D04/D08/NC的业务事实和历史修订保持原样。代理STL/渲染Mesh不得冒充真实碰撞体或D15 NC程序级验证。未建模D13指令语义保持`UNKNOWN`，规划不包含材料扫掠仿真。

## 逐项可审计链路
见[9项来源与阅读限制](../sources/U4-03.json) → [10条规则含字段与来源ID](../traces/U4-03.json) → [20正反+10变异](../../docs/work-packages/U4-03/fixtures.json) → [原编号实施](../../docs/work-packages/U4-03.md) → [独立消费者门禁](../../docs/work-packages/U4-03/independent-consumer-handoff.md)。场景数据明确标为合成；真实Babylon版本、GPU资源、Native Frame、Owner端口和消费者构建版本皆NOT_RUN/待锁。
