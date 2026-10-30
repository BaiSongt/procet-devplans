# B42｜CAP-11-02 词表映射、Shapes合格、知识失效与受控建议

> 2026-10-30；V0.8实施补证，L1/L2/11域/88 CAP/36原包/17资产保持原编号，L3 PENDING_HUMAN，规划PASS≠产品PASS。

## 核心问题：知识结构正确为何仍不能直接生成加工参数？

原[CAP-11-02十项业务目标](README.md)明确材料、机床、工艺、实例和来源证据。新增四类不可跳过的资格：

1. **SKOS词表**：W3C 2009正式[§10 Mapping Properties](https://www.w3.org/TR/skos-reference/)的`closeMatch`不具有传递性。合成三节点`A closeMatch B`和`B closeMatch C`不能自动推得`A exactMatch C`。即使`exactMatch`在SKOS图上有传递性，亦不等价于材料热处理、刀具夹持、控制器Profile等制造条件相同。跨Scheme审批由11域Knowledge Owner负责。
2. **SHACL验证**：2017年W3C正式[§3.6 Validation Report](https://www.w3.org/TR/shacl/)的`sh:conforms true`只表示按本次Data Graph与Shapes Graph的校验未产生相应验证结果；不能证明这些Shapes覆盖全部制造工况，更不能直接授予D15 PASS。保存两个图确切Hash/版本与验证器版本，未知字段继续UNKNOWN。
3. **知识失效**：[PROV-O prov:invalidatedAtTime](https://www.w3.org/TR/prov-o/)表达实体不再可用的来源事实；[RFC 9111 §4与§4.4](https://www.rfc-editor.org/rfc/rfc9111.html)定义HTTP缓存重用和失效边界。两者均不能替代Procet领域的Owner revision、依赖Digest、ACL/Scope Epoch及索引级联Fence。在旧索引未完全失效时返回UNKNOWN而非沿用旧建议。
4. **证据阅读深度**：NIST AI RMF 1.0本轮仅核阅[官方元信息及摘要](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10)，非材料参数或OEM技术规范，不从目录摘要编造速度/进给推荐值。

## 可实施的数据/接口链

`D03材料或工具确切修订/hash/单位/Frame → 11域固定Scheme版本/知识规则 → 数据图与Shapes图验证 → Owner/ACL Scope Epoch复核 → 来源失效DAG级联 → ADVISORY_ONLY建议 → 人类确认 → 原业务Owner Port CAS/权限/取消重验 → 原业务域新修订或拒绝`。

权限丢失、Scope变化或Revision mismatch标`STALE/REJECT`；失效链不完整、阅读仅目录、控制器Profile或单位未知标`UNKNOWN`；取消后的晚回执标`CANCELLED`并禁止写入。GUI/CLI/Agent共用`11.ProcessKnowledgePort`，单Babylon活动世界/唯一左TaskPanel、字号上限12px；3D选择非制造提交。A/B同一业务事实，不覆盖已冻结D08，旧规则采用只读shadow比对及受控回退。

## 八规则：来源→字段→CAP/原包→正反验收

| 规则 | 内容 | 业务资产及原包 | 正反合成 |
|---|---|---|---|
| B42-R1 | 知识条目精确Owner修订、hash、单位、Frame | D01、D05 / T5-01、T5-02 | 正1、反4、未知0 |
| B42-R2 | SKOS近义映射不能传递提升为工艺等价 | D02、D05 / T5-01、T5-02 | 正2、反4、未知0 |
| B42-R3 | SHACL结构符合不等于D15或参数认证 | D02、D05 / T5-01、T5-02 | 正1、反5、未知0 |
| B42-R4 | 依赖变化必须触发索引与缓存的失效Fence | D03、D05、D17 / T5-01、T5-02 | 正1、反5、未知1 |
| B42-R5 | 查询与采纳时重新检验Scope/ACL | D01、D05 / T5-01、T5-02 | 正1、反5、未知0 |
| B42-R6 | 目录证据、控制器和单位不明时保持UNKNOWN | D03、D05、D10 / T5-01、T5-02 | 正1、反2、未知3 |
| B42-R7 | 知识只读建议不得覆盖冻结或发布 | D08、D12、D13、D14、D15、D16 / T5-01、T5-02 | 正1、反6、未知0 |
| B42-R8 | 同领域Port、单世界和左TaskPanel与取消晚回执 | D04、D08、D10、D16 / T5-01、T5-02 | 正1、反9、未知0 |

[6份来源及版本阅读深度](../../../research/sources/CAP-11-02-knowledge-conformance-b42.json) → [8条含字段与来源ID的Trace](../../../research/traces/CAP-11-02-knowledge-conformance-b42-v08.json) → [2正、40反、4未知的独立字段Fixtures](knowledge-conformance-b42-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap1102_knowledge_conformance_b42_v08.cjs) → [执行分层记录](../../../tracking/cap1102-knowledge-conformance-b42-verification-2026-10-30.json)。全部单字段负/未知变异均附明确期望，P02为允许双字段的`exactMatch`正向对照。

## 跨域隔离和交接

D04工艺Setup不等于D10实际执行绑定；D09中立CL→D12最终NC后处理→D13解释控制器模态→D14物理Joint时序→D15独立验证→D16受控发布。知识命中、SHACL`conforms`、CL动画、D17运行记录都不可替代D15。控制器语义未知继续UNKNOWN，不做材料扫掠仿真。迁移需保留旧原始知识CAS、旧Reader、影子比对与失败回退；不写D08冻结。真实独立消费者验收由D03、D05、D08、D10、D15、D16相关Owner在确切版本开展，测试入口`TODO_TEST_ENTRY`，正式签署仍0/17。

**证据限制**：本轮W3C SKOS/SHACL/PROV-O和RFC 9111指定公开HTML章节实读；NIST只读官方摘要；内部Owner、CAS、字体、GUI和发布边界由原CAP定义，不冒称外部标准要求；尚未实际运行RDF/SHACL引擎、独立Node文件进程、真实业务Owner、NC或B5/OEM。仅规划合成测试。
