# CAP-11-06｜跨域Owner、独立消费者、迁移与回退

## 权限与资产责任

[17资产候选Owner表](asset-owner-candidates.json)只从原V0.8`business-assets.json`继承Owner名称，**未获得人类正式接口会签**。`11.TaskPort`只对`TaskIntent/Journal`负责；D01/D04/D05/D06/D08/D09/D10/D12/D13/D14/D15/D16/D17等领域真实字节与修订必须由原Owner提供。11域的Task成功不改变任何Dxx所有权。

Port建议（尚未实现）：
```text
11.TaskPort.submit(TaskIntent, Principal) -> TaskHandle/REJECT
11.TaskPort.inspect(taskId,scopeEpoch) -> Status + OwnerReceiptRefs
11.TaskPort.cancel(taskId,generation,reason) -> CANCELLING/RECONCILING
11.TaskPort.resume(taskId,checkpointHash,expectedEpoch) -> RUNNING/STALE/UNKNOWN
11.TaskPort.reconcile(taskId,idempotencyKey,effectDigest) -> OwnerEffectFound/NoEffect/UNKNOWN
05.ProcessOwnerPort.commitCAS(intent,expectedRevision,ACL,ScopeEpoch,Frame,cancelGeneration) -> D05Receipt
06.SolverOwnerPort.commitCAS(...) -> D06Receipt
08.ControllerExecutionPort.read(...) -> D13Status
09.NcVerificationPort.read(d12Hash,d10Revision,d13Hash,d14Hash) -> D15Evidence/UNKNOWN
10.ReleaseOwnerPort.reviewD16(d15Evidence,approvalDigest) -> Approved/Reject
```

**正向独立消费**：以固定Project/ScopeEpoch/Revision/Hash/Frame提交纯计算长任务；Worker挂掉恢复同Checkpoint无额外副作用；05域用同幂等键多次请求只产生一个`committedEffectId`，不同负载同key拒绝；D15来源于最终D12/D13/D14可查账，D16仍要求独立人工审批。

**负向独立消费**：并发双Worker旧fencing令牌必须被拒、cancel后迟到ACK不推进新TaskGeneration、传输超时但Owner已提交时不允许盲重试、切工程后丢弃旧UI结果、D08冻结不覆写、D04/D10串用拒绝、D13 UNKNOWN与CL_ONLY均不能放行、旧MCP实验Tasks遇新Extension未经协商保持UNKNOWN、ACL撤销被所有三入口一致拒绝。

**失效传播：** D01修订或D04 Frame变化使依赖D06/D09/NC任务`STALE`；D10改变或D13语义UNKNOWN使D15资格`UNKNOWN`并阻止D16；D15证据撤销使发布资格失效，已签发的D16事实应追加撤销/再签发流程，而非修改历史字节。任何实际业务回执均保留。

**迁移与回退：** 先新增只读兼容reader与状态字段，再按不可变hash迁移checkpoint及receipt引用，按精确Product SHA对照新旧语义，独立消费者逐案复核，最后人类批准Contract。失败回退旧只读展示和禁写，不恢复过期Lease/ACL，不删除审计或冻结A/B。

测试入口：`node tools/check_cap1106_planning.cjs`为静态fixtures计划检查；产品验收需真实Node进程重启、双Worker并发、Owner事务DB、3+5轴NC及跨域消费者。**当前均未执行**，本仓脚本不能证明实际分布式事务行为。
