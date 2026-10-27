# CAP-11-03｜检索增强与证据（V0.8，L3待审）

**原88项原文：**「可引用数据检索和文档知识联动」。原编号[T5-01](../../work-packages/T5-01.md)、[T5-02](../../work-packages/T5-02.md)，保持11域/88 CAP/36包/17资产及L1/L2不变；L3仍待人类审批，C0仅共享身份、修订、hash、Scope、单位/Frame和Port，不新增D18或全局巨型common。

## 流程与业务边界

用户或Agent指定Project和已授权资产 → Owner Port返回exact Revision/hash/ScopeEpoch与Frame → 11域检索精确Corpus Snapshot、Embedding/Chunker版本 → 对每个候选执行**Owner现时ACL重验** → 从原始来源校对Selector、授权和字节Hash → 仅提供带来源的`ADVISORY_ONLY`建议与`UNKNOWN/CONFLICT/STALE/REJECT/CANCELLED`状态 → 人工确认变更草案后由业务Owner重新CAS、ACL、Scope及取消态检查。索引Embedding、文本块、向量距离都不是业务Owner真值或模型输入的执行指令。

严格保留D04名义Setup与D10实际执行绑定区别，D08 A/B已冻结成果不可被索引或AI覆盖；中立D09 CL只是运动意图，D12最终NC字节→D13控制器语义→D14机床轴时序→D15独立工程验证→D16受控发布，未知不放行。CL动画、RAG证据匹配和D17运行状态不等于D15验证；不做材料扫掠仿真。

## 10项实施、追踪和正反验收

### T01 调用者及Owner授权

业务Owner Port必须按principal、Project及ScopeEpoch检查，每个索引请求不可跨租户。原资产：D01、D05，原编号T5-01/T5-02。需落字段：`request.principal`、`request.ownerPort`、`request.scopeEpoch`、`request.assetAcl`。 [来源C1103-S02、C1103-S09](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R01](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T02 索引模型可复现

向量索引必须有Corpus、Embedding和Chunker的不可变精确修订，召回分数只是排序。原资产：D01、D02，原编号T5-01/T5-02。需落字段：`index.corpusRevision`、`index.embeddingRevision`、`index.chunkerRevision`、`index.snapshotId`。 [来源C1103-S01、C1103-S08](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R02](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T03 原件/块来源定位

Chunk绑定Owner exact Revision、原字节Hash、Selector以及合法引用许可。原资产：D01、D02、D05，原编号T5-01/T5-02。需落字段：`chunk.ownerRevision`、`chunk.rawHash`、`chunk.selector`、`chunk.licenseChecked`。 [来源C1103-S04、C1103-S05](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R03](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T04 召回后再鉴权

召回不等于可展示；每次候选命中必须按当前Owner ACL、Project/tenant、ScopeEpoch和缓存重验。原资产：D01、D03，原编号T5-01/T5-02。需落字段：`hit.ownerPostAcl`、`hit.projectIsolation`、`hit.scopeEpochCurrent`、`hit.cachePermissionRechecked`。 [来源C1103-S02、C1103-S09](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R04](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T05 索引撤权与失效

原件修订、源Hash、索引Snapshot失配必须STALE，撤权后索引与缓存撤销。原资产：D01、D05、D08，原编号T5-01/T5-02。需落字段：`fresh.revisionEqual`、`fresh.rawHashEqual`、`fresh.snapshotCurrent`、`fresh.revocationApplied`。 [来源C1103-S02、C1103-S05、C1103-S06](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R05](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T06 逐结论引用复核

每项答案结论需要Source URI、有效Selector、claim→chunk关联与如实的章节访问深度。原资产：D02、D05、D17，原编号T5-01/T5-02。需落字段：`citation.sourceUri`、`citation.selectorVerified`、`citation.claimToChunk`、`citation.accessDepthHonest`。 [来源C1103-S04、C1103-S05、C1103-S07](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R06](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T07 间接注入与写权限隔离

检索文本只当不可信数据；不得按片段文本发工具指令、授予业务写入或D16签发。原资产：D05、D06、D16，原编号T5-01/T5-02。需落字段：`security.dataOnly`、`security.promptInjectionGate`、`security.noToolInvocation`、`security.noOwnerWrite`。 [来源C1103-S03、C1103-S09](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R07](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T08 未知证据与冲突

覆盖不足为UNKNOWN，来源抵触为CONFLICT，向量相似度不等于来源可信和制造验证。原资产：D03、D05、D15，原编号T5-01/T5-02。需落字段：`quality.coverageMeasured`、`quality.conflictShown`、`quality.unknownExplicit`、`quality.scoreNotSafety`。 [来源C1103-S01、C1103-S07](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R08](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T09 NC与冻结证据保护

D04 Setup≠D10执行绑定；CL预览≠D12→D13→D14→D15独立验证；UNKNOWN不能放行D16、D08不被覆盖。原资产：D04、D08、D10、D12、D13、D14、D15、D16，原编号T5-01/T5-02。需落字段：`guard.d04NotD10`、`guard.clNotD15`、`guard.unknownBlocksD16`、`guard.frozenD08Immutable`。 [来源C1103-S01、C1103-S07、C1103-S09](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R09](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

### T10 统一入口与无损回退

GUI/CLI/Agent共享EvidenceRetrievalPort与审计；单Babylon/左TaskPanel；CAS、撤权、取消晚回执校验及影子回退。原资产：D01、D03、D05、D10，原编号T5-01/T5-02。需落字段：`delivery.sharedPort`、`delivery.oneBabylonLeftPanel`、`delivery.casAclCancel`、`delivery.shadowRollback`。 [来源C1103-S06、C1103-S08、C1103-S09](../../../research/sources/CAP-11-03.json) → [CAP-11-03-R10](../../../research/traces/CAP-11-03.json) → [正例与4个独立字段负例](fixtures.json)，验收见本轮规划合成，不代表产品通过。

## Port接口、验证与失效策略

拟议`EvidenceRetrievalPort`：`startQuery`、`retrieveSnapshot`、`postAuthorizeHits`、`revalidateSourceSelectors`、`assembleClaimCitations`、`explainConflicts`、`prepareOwnerChangeDraft`、`invalidate`、`cancel`。GUI/CLI/Agent共用该Port和审计；Agent不自动取得Writer或D16发布权限。

冻结的授权语料上另设黄金查询清单，测`recall@k`、`precision@k`、引用可复核率、越权泄漏计数、撤权传播延迟与结果时效；**本轮无真实语料，不捏造阈值或达标数**。至少考虑相似材料不同热处理、两Setup、三轴/B5不同运动链、跨租户索引、注入、索引删改、模型升级、网络断开、取消晚ACK。新Reader先影子比对，必要时回退旧Reader，原Owner事实与冻结版本不更改。

[唯一GUI/3D](UI.md) · [示例合同](retrieval-evidence-contract.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者与回退](independent-consumer-handoff.md) · [9来源及阅读局限](../../../research/sources/CAP-11-03.json) → [10规则40字段](../../../research/traces/CAP-11-03.json) → [50字段正反+28门禁](fixtures.json) · [研究专题](../../../research/topics/R-RAG-EVIDENCE-001.md)。

**规划PASS≠产品PASS。** 独立Node文件执行、真实向量检索、Owner ACL、浏览器、NC/机床、独立消费者均NOT_RUN；Owner会签与L3审批PENDING_HUMAN。
