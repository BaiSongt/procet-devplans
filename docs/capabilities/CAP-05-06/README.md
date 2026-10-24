# CAP-05-06｜局部冻结与冲突管理
> V0.8原编号；L1/L2不变、L3待人类评审。仅规划候选，17资产Owner会签、产品与消费者测试均NOT_RUN。

## 目标与Owner
工艺决策冻结只约束**D05的稳定工序ID、依赖子图和精确源事实**。冻结并不等于D07有序材料状态正确、D09 CL已生成或D15工程验证PASS。05域是D05计划及D08确认快照业务Owner；06域D06多解可在无D05时运行，有D05时只能继承指定冻结子图并返回冲突/原因。03域D01/D02、04域D04名义Setup、02域D03资源是精确只读输入；D10实际机床控制器执行绑定绝不能反填D04。任何实际跨域Owner签署仍为PENDING。

## 最小业务对象
`FreezeScope(projectScope,planExactRef,nodeStableIds[],nodeExactRefs[],dependencyClosure,sourceExactRefs[],frameProofRef,decisionOwner,approvalRef,actor,reason,freezeEventRef)`。`ExactRef`必须含`id/revision/hash/frame/schemaVersion/scope`，哈希canonical profile需独立冻结。D08`ImmutableFreezeSnapshot`必须能从D05决策定位，却不可被后续解冻、B求解候选或旧计划修改所覆盖。A人工与B求解共享事实，不共享可写工艺修订头。

`ThreeWayConflict(base,current,proposed)`分别计算base→current与base→proposed的变化，比较**工序stable ID、策略/余量、DAG边、D04 Frame、D01/D02精确hash和冻结范围**。分类`NON_OVERLAP / NODE_OVERLAP / DEPENDENCY_CROSS / FRAME_STALE / FROZEN_SCOPE / UNKNOWN`；来源失效和UNKNOWN一律阻断。节点集无交集仍可能有DAG依赖交叉，不能静默合并。允许呈现确定性的建议，但只有有权限的人员可显式裁决。

## 主业务流程
1. 加载D05/D08 exact revision和工程D01/D02/D04精确上下文，显示既有冻结及DAG范围；同名不同Setup不得混淆。
2. 工艺人员从统一左TaskPanel选择稳定工序、设置冻结理由→`previewFreeze`。预览给出依赖闭包、来源差异和未知项，**不写正式计划或D08**。
3. D06候选接管、模板实例化或人工编辑前均需`compareThreeWay`；对重叠冲突、冻结范围和变更来源做显式决策与审批。未解冲突不允许提交。
4. `commitFreeze/requestThaw/forkThawedPlan/resolveAndCommit`均走05域`ProcessPlanFreezeDomainPort`。解冻必须有精确批准、原因和**新D05修订**；原D05/D08冻结事件仅追加不原改。只预览或零影响不得伪造提交回执。
5. 写侧提交时二次校验当前ACL、CAS expectedRevision、actor、taskGeneration、scopeEpoch、D01/D02/D04/D05/D08 hash/frame，取消/撤权/过期/晚回执均拒绝并要求重新预览；幂等键用于失败恢复与重复提交去重，不能宣称全域分布式ACID。
6. 成功仅对受影响子图传播失效：D06/D07独立几何复核→D09中立CL→D12最终NC→D13控制器语义→D14机床轴时序→D15工程验证→D16发布。**D13未知为UNKNOWN、D15/D16不能PASS；CL动画不冒充NC验证，不做材料扫掠仿真。** 未受影响分支和历史D08/D16保留。
7. 旧工程迁移必须先输出可审阅差异，缺stable ID/Frame/源hash时标记`UNKNOWN`，用versioned adapter读取而非偷偷生成冻结结论。回退追加受控新revision或补偿事件，**不删除用户数据库**。

## UI、Port与验收
GUI/CLI/Agent必须经同一Host鉴权`ProcessPlanFreezeDomainPort`，Agent不能直接写数据库。渲染只有单Babylon世界/统一左TaskPanel，3D选择不是提交，右侧Agent可独立显隐，主题仅浅/深，最大字号12px。CLI命令候选：`plan freeze inspect|preview|commit|thaw --expected-revision`，名称待L3批准。设计输出`FreezeReceipt(previousExactRef,newD05ExactRef,newD08SnapshotRef?,freezeEventRef,conflictResolutionIds,affectedClosure,unchangedIds,auditEventId)`；不允许把未通过的NC/机床证据升格为已通过。

[GUI/3D](UI.md) · [合成DTO](contract.example.json) · [来源](../../../research/sources/CAP-05-06.json) · [规则](../../../research/traces/CAP-05-06.json) · [20正反验收](fixtures.json) · [独立消费者](independent-consumer-handoff.md) · [专题](../../../research/topics/R-FREEZE-001.md)。

## 原编号工作包拆解（不是新增编号）
| 子任务 | 原包 | 工程输出 | 必需负例 |
|---|---|---|---|
| 冻结上下文与稳定ID读取 | W2-05 | D05/D08精确只读查询 | 跨Setup同名误绑 |
| 三方冲突与依赖DAG差异 | W2-02 | base/head/proposed差异闭包 | 不同节点但依赖交叉 |
| 局部冻结事件和快照 | W2-03 | D05版本、D08新快照 | 旧冻结被改写 |
| 授权解冻与来源链 | W2-02 | fork新修订/wasRevisionOf | 无审批直接解冻 |
| D06继承冻结硬约束 | W2-03 | 子图精确绑定 | solver覆盖冻结工序 |
| ACL/CAS/取消晚回执 | W2-03 | 任务幂等和失效状态 | 旧回执覆盖新HEAD |
| UI/CLI/Agent单Port和单世界 | W2-05 | 统一任务入口 | 3D点击直接持久化 |
| 下游精确局部失效 | W2-03 | affected/unaffected矩阵 | 旧CL冒充D15 |
| 版本迁移/回退 | W2-02 | adapter和只追加审计 | 静默改写用户库 |
| 独立消费者交接 | W2-02 | exact HEAD输入及正反证明 | 自测冒充独立PASS |

**规划机器入口**：`node tools/check_cap_05_06.mjs`检查8来源、10规则、20正反合成用例；真实产品/机床/控制器及独立消费者另建exact HEAD证据。规划PASS≠产品PASS。
