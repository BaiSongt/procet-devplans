> **B68专项补证（2026-10-31）**：[不可信RAG文本→知识Revision晋级的来源Hash/Chunk/Scope、人工批准与CAS规则](POISON-PROMOTION-B68-2026-10-31.md)；[7来源](../../../research/sources/CAP-11-07-poison-gate-b68.json) → [8规则及49合成](../../../research/traces/CAP-11-07-poison-gate-b68-v08.json)。只读规划验证，Owner/L3/真实消费者未通过。

# CAP-11-07｜知识反馈与版本管理（V0.8实施级，L3待审）

**原88项业务定义：**「复用、验证、演化及退回变更」。保留原 [T5-01](../../work-packages/T5-01.md) / [T5-02](../../work-packages/T5-02.md) 两包，不改11域、88 CAP、36原编号包、17资产，L1/L2不变，L3待人类审批。本文是业务契约规划，不是产品验收。

## 受控业务闭环与Owner职责

反馈可能来自10域D17现场采集、工艺员纠错、[CAP-11-05推荐](../CAP-11-05/README.md)的反例、[CAP-11-03检索](../CAP-11-03/README.md)的反证。由11域KnowledgeFeedbackPort受权接收，统一执行：**固定原始来源Hash及Project/Scope → 候选去重/冲突保留 → 机器结构与制造适用域验证 → 人工授权 → 知识Owner即时ACL/ScopeEpoch/CAS/CancelGeneration重验 → 新增不可变知识Revision → 下游失效传播 → 独立消费者复核**。任何失败或来源不足，旧版只读，禁止候选直接影响实机。

11域仅拥有自身知识条目与审核审计；D01-D17原Owner不变。尤其D17观测不能替代D15工程验证，D05/D08采纳与冻结仍由05域，D12/D13由08域，D14/D15由09域，D16发布由10域。AI反馈不是第二个工艺规划或特权写入通道。

## 精确数据结构及修订语义

[提议合同](knowledge-feedback-contract.example.json)覆盖 FeedbackId、SourceEvidenceRawHash、Principal/ACL/Project/ScopeEpoch、D01/D04/D03 exact Revision/Hash/Frame/Unit、机床/刀具/控制器适用域、ParentKnowledgeRevision/ParentDigest、正反证据、ApprovalDigest、ExpectedHead、CancelGeneration及OwnerReceipt。样例Hash是演示占位而非真实SHA。

同一材料与加工场景的两个矛盾参数不能自动最后写入胜出；保留两套证据进入人工仲裁。知识回退、撤销和弃用**只能产生新修订/撤销事件**，不能删除既有版本字节，不能覆盖A/B共享冻结D08。任何旧方案的knowledgeRevision引用保持不变，未来重新采用新版必须显式重评。

## 十项实施任务与来源→规则→字段→正反验收

|任务|实施工作及责任|规则及字段|独立合成验收|
|---|---|---|---|
|T01|反馈采集及非权威候选|[CAP-11-07-R01](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T02|来源Revision/Hash/Frame与无环血缘|[CAP-11-07-R02](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T03|去重、矛盾及冻结保护|[CAP-11-07-R03](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T04|适用域、负例与污染拦截|[CAP-11-07-R04](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T05|人类批准与Owner提交前权限重验|[CAP-11-07-R05](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T06|只追加KnowledgeRevision与Owner回执|[CAP-11-07-R06](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T07|弃用、撤销、晚回执与新版本回退|[CAP-11-07-R07](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T08|跨域失效与最终NC验证隔离|[CAP-11-07-R08](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T09|GUI/CLI/Agent统一Owner Port及单Babylon|[CAP-11-07-R09](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|
|T10|历史迁移、独立消费者、审计回退|[CAP-11-07-R10](../../../research/traces/CAP-11-07.json)对应4个机读字段|正例1 + 独立负例4|

十条规则各含4个独立可校字段、1个完整正例及4个逐字段反例，另外有24个状态门禁与6个来源图正反案例。[10份官方来源](../../../research/sources/CAP-11-07.json) → [10规则40字段与工作包](../../../research/traces/CAP-11-07.json) → [80项合成](fixtures.json) → [规划静态Oracle](../../../tools/check_cap1107_planning.cjs) → [理论推导](../../../research/topics/R-KNOWLEDGE-FEEDBACK-001.md)。结构验证不等于物理切削合格；独立Node进程/实际Owner事务/NC/机床均NOT_RUN。

## 失效传播与NC安全边界

知识Revision替换需精确映射使用它的D05/D06/D09/D12-D15引用，逐个标STALE或重评；既有D16发布包不得原地改写，10域独立决定风险提示、撤销或重签。D04名义Setup与D10实际机床执行绑定分开。**中立D09 CL→D12 NC后处理→D13控制器执行语义→D14轴时序→D15独立工程验证→D16审批发布**，D11/CL动画不能替代D15，控制器未知语义保持UNKNOWN并阻D16。不做材料扫掠仿真。

任何Agent提示词/检索污染文本仅作不可信证据，不转化为工具调用。取消前已提交的Owner回执必须保留并对账；取消后的迟到回执不能获得新的提交资格。C0只共享身份、Scope、Revision/Hash/Frame/单位和协议，不创建全领域知识巨型Store。

## 回退与未通过项

Expand双readers→固定hash迁移和血缘核对→独立消费者逐案签收→人类授权关闭旧write。若迁移失败，切旧只读而不恢复撤权写权限，不丢审计、A/B冻结或真实Owner回执。静态规划入口 `node tools/check_cap1107_planning.cjs`；实际Node执行、知识数据库/SHACL、真实NC/三轴/B5、跨域独立消费全部`NOT_RUN`。17资产Owner正式签署和L3均`PENDING_HUMAN`。

[GUI/3D](UI.md) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者/迁移](independent-consumer-handoff.md)。**规划PASS≠产品PASS。**
