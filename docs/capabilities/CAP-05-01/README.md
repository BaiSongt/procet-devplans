# CAP-05-01｜工艺路线与工序树（V0.8原编号）
> **状态**：实施级规划已编制；L3待评审；所有产品、独立消费者、NC和机床测试 **NOT_RUN**。本规划不改11域88 CAP、36原编号包与17资产。

## 业务目标与非目标
工艺人员把一个制造目标分解为 **加工阶段(Stage) → 工序(Operation) → 工步(Step)**，建立可编辑、可比较、可追溯的**工序优先关系DAG**，以便多Setup、人工规划与求解候选共享同一权威工程事实。用户能够从Setup任务区直接寻址该Setup的计划，不必重新触发特征分析。

本项Owner仅为 **05域的D05工艺计划与人工决策**：D01/D02由03域供应设计/特征，D04由04域供应名义工艺Setup/转序证据，D06由06域供应求解候选，D07是06域持有的实际材料状态，D08冻结决定仍由05域独立修订；D09由07域生成刀路。**不为D05生成G-code，不写D10机床执行绑定，不做材料扫掠，不声称D15认证通过**。模式A（无人工计划）允许直接求解，模式B允许用户从空计划开始；A/B共享事实与不可变来源，不能静默覆盖冻结。

## 完整业务流程
1. **进入**：工程树或Setup任务区，选择明确CAD occurrence/D01、确认特征集D02以及D04当前Setup；每项均固定projectScope、id、revision、SHA256与frame，不根据“当前最新文件名”猜测。
2. **建树**：创建Stage、Operation、Step及稳定ID，Stage关联D04 exactRef，Operation关联多个D02 feature exactRefs（候选阶段允许空但必须标PENDING），Step仅承载工艺意图与参数引用；前端树顺序只是投影，不是权威执行事实。
3. **排依赖**：明确前驱边、工序约束原因、crossSetup和D04转序引用。拓扑排序发现环、悬空边、未核实Frame返回BLOCKED/UNKNOWN，不能悄悄删除依赖。
4. **校核**：验证父子双向索引、节点ID、来源版本、受保护区/PMI要求、D08 FreezeSet冲突及多Setup上下文。一个特征可服务多道工序，一个工序也可引用多个特征；禁止误归一。
5. **预览**：GUI/CLI/Agent调用同一RouteDomainPort.preview取得带taskGeneration的只读TaskResult、校核消息及影响清单；3D只切换同一Babylon世界已有零件/Setup/特征高亮；悬空或未知几何显示UNKNOWN。
6. **采纳**：RouteDomainPort.commit重新检查当前D01/D02/D04/D08 exactRevision/hash/frame、权限、CAS expected/current、任务代次、取消状态。成功仅产生新的不可变D05 PlanRevision与Journal；失败保持当前发布/冻结数据原样。
7. **下游**：D08确认、D06求解、D07材料状态、D09 CL订阅有版本的依赖失效事件；变化影响相关工序子图而不是全项目；独立D12→D13→D14→D15→D16链路仍须完成，D05状态绝不提升为产品验证PASS。

## L3候选资产与字段（待审，不是已冻结schema）
`RouteSnapshot={projectScope,planId,revision,contentHash,createdFromExactRefs,stageNodes,operationNodes,stepNodes,precedenceEdges,freezeReadOnlyRef,sourceJournal,status}`
- `ExactRef={id,revision,hash,frame,occurrencePath?,unit?}`；hash算法/规范化必须有契约版本，跨语言与I-JSON限制单独验证。
- `StageNode={id,setupExactRef,operationIds,stageKind,entry/exitMaterialStateExactRef?,displayOrder}`；D07引用为可选但不得伪造。
- `OperationNode={id,stageId,stepIds,featureExactRefs[],targetExactRefs[],intent,dependencies,approvalStatus}`。
- `StepNode={id,operationId,kind,parameterRefs,estimatedEffort?,sourceIntent}`；策略参数Owner仍在对应下游域。
- `PrecedenceEdge={from,to,reason,crossSetup,transferExactRef?,sourceEvidence,validationStatus}`，构成DAG而非排程的真实机床资源独占证明。
- `CommitRouteReceipt={newRevision,newHash,affectedNodeIds,invalidationManifest,casReceipt,taskGeneration,actorAuditRef}`。
- `PlanViewProjection={setupId,selectedNodeIds,readOnlyFeatureLinks,validationState}`，可重建，非权威存储。

**精确性**：相同几何shapeHash不代表同一CAD occurrence；跨Setup必须校验Frame和D04精确转序修订。内容指纹编码策略须显式指定，例如独立JCS/I-JSON profile，而非随手`JSON.stringify`。D10中的控制器、偏置、实际机床和轴树不得写入此D05模型。

## 端口和权限
`RouteDomainPort.query(projectScope,setupExactRef,projectionVersion)`、`previewRoute(inputExactRefs,routeProposal,generation)`、`commitRoute(snapshotCandidate,expectedD05Revision,actor,taskGeneration)`、`cancel(taskId)`、`diff/branch/restore(newRevisionOnly)`。
GUI、CLI、Agent都使用同域受管命令（不绕开权限）。Agent只能提出/预览，采纳受human/CAS授权门控制。网络取消后返回旧generation的晚回执必须丢弃且不得更改当前Project或D05。权限与CAS应在实际commit瞬间重新校验；权限验证通过也不等于冻结操作得到批准。

## 失效范围与迁移回退
- 仅修改Step显示标题、主题或3D相机状态：无制造资产内容失效。修改Operation引用特征、D04 Setup、前置边或冻结状态：只失效可证明受影响的D05子图及其下游D06/D07/D08/D09/D12-D16依赖，保留独立的未受影响分支。
- 旧计划无stable ID、无Frame或来源hash：仅只读迁移并标`UNKNOWN_MIGRATION`，经人工核对后fork新修订，不能按同名ID猜测。失败回滚staging新revision/索引，**不删除用户数据库或历史D08冻结**。
- 对于已发布D16，禁止原地改写；计划修订仅产生待重新认证的派生链。任何CL预览或拓扑可行证明均不能替代NC执行验证。

## 原工作包分派与实质验收
- **W2-02**：D06候选→D05 Plan投影/采纳与FreezeSet冲突；重复采纳幂等且冻结不被静默覆盖。
- **W2-03**：DAG、定向依赖、revision原因与窄范围失效；非相关Theme/相机不传播。
- **W2-05**：按Setup查询Feature↔Operation多对多，支持跨序继承且跳转无需重新特征识别。
- 建议开发顺序：①DTO与schema草案；②DAG/toposort；③双向索引；④跨Setup；⑤候选采纳/冻结；⑥失效闭包；⑦三入口；⑧CAS/取消；⑨迁移；⑩独立D06/D09消费者合同测试。
- **验收入口**：`node tools/check_cap_05_01.mjs` 检查10规则、20正反合成用例及来源映射。上线前另需独立消费者读取真实持久化D05修订、D08冻结拒绝、双Setup与实际D09订阅的端到端验证；本轮这些均NOT_RUN。

## 证据链与界面
[8项逐来源阅读登记](../../../research/sources/CAP-05-01.json) → [10条规则、字段、工作包与验收映射](../../../research/traces/CAP-05-01.json) → [20项正反fixture](fixtures.json)；[研究适用边界](../../../research/topics/R-ROUTE-001.md)；[GUI/3D详细说明](UI.md)和[离线概念交互原型](prototype.html)。

**适用边界声明**：ISO 14649-10/11与ISO 10303-238只阅读官方目录和公开摘要；其workingstep/workplan是参考术语，不证明本项目的Stage/Operation/Step DTO符合标准或NC适配已通过。Google OR-Tools排程范例不等于D05自动排产。JCS、PROV用于工程参考且有各自适用边界。
