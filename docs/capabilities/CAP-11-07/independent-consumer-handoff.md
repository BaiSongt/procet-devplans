# CAP-11-07｜跨域Owner/独立消费者/回退契约

[17资产候选Owner表](asset-owner-candidates.json)直接继承原[业务资产定义](../../architecture/v0.8/business-assets.json)。Owner状态均为`PENDING_HUMAN`，知识服务没有任何D01-D17原资产的第二写权限。以下均为提议Port，不宣称已实现。

```text
11.KnowledgeFeedbackPort.propose(SourceEvidenceRef, RawHash, Principal, ScopeEpoch, ExactFrame) -> Candidate/REJECT
11.KnowledgeFeedbackPort.diff(ParentKnowledgeRevision, Proposal) -> ChangeDigest
11.KnowledgeOwnerPort.commitCAS(ApprovalDigest, ExpectedHead, ACL, ScopeEpoch, CancelGeneration) -> NewRevisionReceipt/REJECT
11.KnowledgeOwnerPort.deprecateCAS(VersionId, Reason, ExpectedHead) -> NewRevisionOrRevocationReceipt
05.ProcessOwnerPort.adoptKnowledgeCAS(KnowledgeRevision, ExpectedD05, FrozenD08, Principal) -> D05Revision/REJECT
08.NcExecutionPort.readFinalNcSemantics(D12Hash,D10Revision) -> D13/UNKNOWN
09.NcVerificationPort.verify(D12Hash,D13Hash,D14Hash,D10Revision) -> D15/UNKNOWN
10.ReleaseOwnerPort.reviewIndependentD15(D15Hash,ApprovalDigest) -> D16/REJECT
```

**独立正例：** 现场D17观察 + 工艺员反证分别保留来源Hash→11域创建待审候选→独立人工复核→11域Owner CAS新增K_rev→05域按精确引用决定是否形成新D05→旧D08冻结不变；若生成新NC，则08/09/10域必须重新运行D12→D13→D14→D15→D16。

**独立负例：** SourceHash改变、Frame与D04不符、材料/机床适用域缺失、反证被吞、被检索污染提示注入工具、两个审批并发CAS冲突、ACL撤销、跨Project迟到ACK、A/B冻结覆写、D13 UNKNOWN/CL_ONLY冒充D15、迁移消费者NACK，均应保持拒绝/UNKNOWN/旧只读，不伪造通过。

依赖失效要求逐个对照受影响的知识Revision和D05/D09/NC来源Hash，不把旧D16变为新内容，也不伪称机床已停机。D04名义Setup和D10实际执行配置必须各自精确锁定，变更后须重新验证。拓扑来源实例DAG无环；业务反馈流程可以有环但不得修改历史事实。

**迁移回退：** Expand reader→锁Schema/Hash生成血缘→独立消费者检查兼容和权限→审核切写；NACK回退旧只读、保留审计/OwnerReceipt/冻结快照；禁止恢复被撤销写权限。入口 `node tools/check_cap1107_planning.cjs`仅80项规划合成。知识数据库/真实Node/NC/B5/消费者`NOT_RUN`，17资产签署/L3`PENDING_HUMAN`。
