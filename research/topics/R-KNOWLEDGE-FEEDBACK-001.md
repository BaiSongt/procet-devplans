# R-KNOWLEDGE-FEEDBACK-001｜知识来源演化与受控版本退回

服务[CAP-11-07](../../docs/capabilities/CAP-11-07/README.md)与原[T5-01](../../docs/work-packages/T5-01.md)/[T5-02](../../docs/work-packages/T5-02.md)。独立[来源登记](../sources/CAP-11-07.json)→[规则与字段](../traces/CAP-11-07.json)→[正反/状态/血缘DAG fixtures](../../docs/capabilities/CAP-11-07/fixtures.json)。

**边界1：证据事实与知识建议不同。** D17现场遥测或质检并不是D15 NC验证；RAG检索文档可能受污染（OWASP RAG §1），应保存原始来源Hash、采集质量及矛盾证据，不让其变成Agent指令或特权工艺规则。

**边界2：版本血缘与不可变实例。** W3C PROV-O 2013的`prov:wasRevisionOf`/`prov:wasDerivedFrom`表述版本关系；项目另规定实体修订DAG无环、字节Hash可复核。W3C SKOS可辅助术语整理、SHACL可检图形状，但两者不认证制造适用性或实际切削参数。

**边界3：人类变更控制与CAS。** ISO10007:2017只读官方合法目录摘要及委员会概述，不能引用未读条款。RFC9110 §13.1.1 If-Match提供预条件防止lost-update的思路，Owner必须叠加ACL/ScopeEpoch/Frame/CancelGeneration。RFC8785 JCS可帮助重复可计算的JSON摘要，但Hash不代替权限/签名。

**边界4：撤回与下游失效。** 退回只能提交新KnowledgeRevision/撤销事件，不直接更改旧版本。只对引用已变更Revision的下游D05/D06/D09/D12-D15传播STALE，D16已签名事实保留，由10域决定撤销/重签而非修改字节。中立CL/D11动画不等于D15独立NC验证，D13未知语义保持UNKNOWN并阻D16；不做材料扫掠仿真。

**当前研究层级：** ISO标准全文、NIST AI RMF与SP800-53完整PDF未读；仅记录目录/出版摘要。真实SHACL实现、知识库CAS竞态、权限撤销、三轴/B5 NC与独立跨域消费者未测。来源author/edition/time/URL/accessDepth/limits逐项记录在source JSON。规划结论不应冒称产品认证。
