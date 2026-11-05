# CAP-11-08｜Owner端口与跨域独立消费者交接

[17资产规范](../../architecture/v0.8/business-assets.json)及[候选Owner](asset-owner-candidates.json)保持单一业务写Owner，17人类签署均为`PENDING_HUMAN`；本文件不伪称Owner已采纳接口。

```text
11.ActionAuthorizationPort.propose(Intent, RawHash, Principal, Delegation, ScopeEpoch) -> CANDIDATE/REJECT
11.ActionAuthorizationPort.preflight(IntentDigest, TargetExactRevisionHashFrame, Risk) -> REVIEW_READY/REJECT
11.ActionAuthorizationPort.requestHumanDecision(IntentDigest, ActionScope, Expiry) -> APPROVED/DENIED/EXPIRED
DOMAIN.OwnerPort.commitCAS(ApprovalDigest, ExpectedRevisionHashFrame, ACL, ScopeEpoch, CancelGeneration) -> RealReceipt/REJECT/UNKNOWN
11.ActionAuthorizationPort.reconcile(IntentId, OwnerReceiptHash) -> COMMITTED/QUARANTINED/UNKNOWN
10.ReleaseOwnerPort.verifyAndReview(D10,D12,D13,D14,D15,HumanApproval) -> D16/REJECT
```

**独立消费者正反验收（未执行）：**

1. 01域权限/审计：Project ScopeEpoch或ACL撤销后，旧会话/GUI/CLI/Agent均无法提交；外部Token Audience不符拒绝；相同Nonce重放拒绝，审计敏感内容脱敏追加。
2. 05域D05/D08：合法人工批准允许**申请新D05草案**，不允许改写A/B共享冻结D08；相同目标并发CAS至多一个事务生效。
3. 08域D12/D13：最终NC字节和控制器profile exact Hash；未建模宏/循环的D13为`UNKNOWN`并拒绝进入发布，不以审批“通过”替代解释。
4. 09域D14/D15：按已解释D13展开轴运动而非用CL动画；Frame、限位、刀具装配变化令原D15`STALE`，必须独立复验。
5. 10域D16/D17：D16必须持有同一D12/D10/D13/D14/D15证据与人类许可；D16仅发布审核，不是CycleStart授权；D17现场观测不能直接写回D08。
6. 离线/迁移消费者：被撤销凭证不能离线伪放行；NACK保持旧只读和不可变Receipt，不能切换到旧不安全写服务。

负面案例必须真实执行：Agent冒签、权限撤回、跨项目令牌、过期/重放Nonce、Diff摘要被提示注入篡改、D04/D10变更、冻结覆盖、取消后晚ACK、未知NC语义、缺D15、消费者NACK。每项由**独立域Consumer**观测拒绝/UNKNOWN/真实Receipt；本轮[87项合成案例](fixtures.json)仅是规划Oracle，真实Node、Owner/NC/机床/独立消费者`NOT_RUN`。

迁移：影子读→固定Hash→双reader核对→消费者签收→人工授权切写；不满足条件时退旧只读，保持冻结和真实回执。**规划PASS≠产品PASS。**
