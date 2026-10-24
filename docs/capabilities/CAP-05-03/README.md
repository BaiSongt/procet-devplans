# CAP-05-03｜人工编辑与重排（V0.8原编号）
> **新增规划，不是产品实现。L3与资产Owner会签PENDING；Rust/TS/OCCT/NC、Babylon与独立消费者NOT_RUN。** 11域、88 CAP、36原编号工作包及17资产不变。

## 业务目标
工艺人员能够在D05已有工序树中编辑Stage/Operation/Step、对比D06求解候选、局部采纳、显式修改前置边及调整显示顺序。**拖拽显示顺序、DAG业务先后关系、资源排程和D14真实机床轴时序互不等价**。模式A无需先造人工计划即可求解，模式B允许人工维护；两模式共用事实，不重写D08冻结与D16已发布成果。

**Owner**：05域唯一写D05并独立持有D08冻结；03域D01设计/D02已确认制造特征、04域D04名义Setup、06域D06求解候选/D07材料状态、07域D09中立CL均为只读精确依赖。本CAP绝不写04域D10机床执行绑定或08域D12/13和09域D14/15。

## 七步编辑流程
1. 从工程树或当前Setup TaskPanel直接打开对应D05修订，不需反复执行特征识别；锁定CAD occurrence、D02 FeatureSet、D04 Setup、D05 Route及D08 FreezeSet的`id/revision/hash/frame/unit/projectScope`。同名Shape不代表同一发生位置。
2. 建Stage→Operation→Step树，Operation ID须稳定；支持Operation↔Feature多对多。拖动先仅改变`displayOrder`视图，**不会自动更改precedenceEdges**。真正改先后必须使用显式的依赖编辑命令并记录原因。
3. 对修改后的DAG验证自环、悬空边和环，发现环给出具体边/见证路径，不自动删除约束。跨Setup重排要求D04的`transferExactRef`与Frame变换有证据，未知则`UNKNOWN`阻断提交。
4. D06候选只能按`run/revision/hash`、选中子图、人工授权进行局部采纳；D08冻结Operation不可原地编辑。需修改则fork新D05分支，重新审批，旧冻结原样保存。
5. GUI、CLI、Agent经`RouteEditDomainPort.query/preview/commit/cancel/diff/forkAsNewRevision`共域接口。Agent只能建议，不能绕过受管Host权限；预览返回影响闭包与同一Babylon世界的3D高亮租约，不产生生产写入。
6. `commit`瞬间重读ACL、expected/current CAS、输入哈希与scopeEpoch/taskGeneration；取消、撤权、Setup切换或晚回执只记审计，不切换正式修订。成功追加不可变D05 revision、事件日志与带修订原因的invalidationManifest。
7. 只传播**受影响Operation子图及确有依赖的D06/D07/D09/D12/D13/D14/D15**；纯UI重排不传播制造失效。D16历史发布不可改写；D09 CL演示不是NC工程验证，未知控制器语义`UNKNOWN`，不做材料扫掠仿真。回退保留历史并生成授权新引用，不删除数据库。

## 待审L3字段与异常
`RouteEditCommand={scope,actor,expectedD05Revision,scopeEpoch,taskGeneration,operationStableId,verb,anchorStableId?,editedFields?,semanticEdgePatch?,sourceExactRefs[],freezeExactRef?,reason}`，`verb`为`move_display/add_precedence/remove_precedence/update_step/adopt_solver_subgraph/fork`之一。
`ExactRef={id,revision,hash,frame,unit?,occurrencePath?,schemaVersion?}`，哈希必须声明规范化profile（可参考RFC8785的I-JSON要求），不能用任意JSON.stringify代替跨语言规范。
`Preview={candidate,changedNodes,changedEdges,cycleWitness?,crossSetupUnknown[],freezeConflicts[],readOnly3DLease,taskGeneration}`；`CommitReceipt={newRevision,newHash,casReceipt,sourceHashes,actorAuditRef,affectedIds,invalidationManifest,scopeEpoch,generation}`。
错误类型：`SOURCE_REVISION_STALE`、`DAG_CYCLE`、`DISPLAY_IS_NOT_PRECEDENCE`、`REFERENCE_DANGLING`、`TRANSFER_FRAME_UNKNOWN`、`FROZEN_MUTATION`、`SOLVER_ADOPTION_BLOCKED`、`CAS_AUTH_CONFLICT`、`CANCELLED_LATE_ACK`、`INVALIDATION_GAP`。显示稳定ID、失效来源、恢复动作，不能只有“失败”。

## 迁移、工作包与真实消费者
老计划没有稳定OperationId/hash/frame或映射缺失，**仅只读导入为UNKNOWN_MIGRATION**，人工审阅后fork新修订；不能推断默认零Frame或覆盖冻结。C0只复用身份/单位/Frame/scope/错误码，领域对象在05域。
原编号**W2-02 / W2-03 / W2-05**负责：领域DTO、DAG/多Setup、Feature多对多、D06候选接管、D08冻结、CAS+取消及精准失效、GUI/CLI/Agent同域接入。验收需独立06域、07域、08/09域及10域消费者在真实exact SHA下完成；当前均NOT_RUN。计划验收入口`node tools/check_cap_05_03.mjs`只测规则数据。
[GUI/3D](UI.md) · [编辑命令样例](operation-patch.example.json) · [9来源](../../../research/sources/CAP-05-03.json) · [10规则→字段→正反](../../../research/traces/CAP-05-03.json) · [20合成验收](fixtures.json) · [理论边界](../../../research/topics/R-ROUTEEDIT-001.md)。
