# R-CONTROLLED-MIGRATION-001｜受控迁移的理论、局限和规则

研究时间2026-10-26；资料仅涉及已核公开原作者/官方章节。T5-04工作包设计并非产品实现，17 Owner签署及L3待人类评审。

## 分层理论
1. Danilo Sato于2014-05-13的Parallel Change明确Expand、Migrate、Contract三阶段，支持R03/R09的先兼容后停旧，不代表实际数据可逆。
2. AWS Branch by abstraction介绍上游依赖深的内部模块通过抽象层迁移；适用于现存GUI、CAM、资源Port，但并不要求微服务。R01/R02/R06/R07所用的单Babylon/12px、D04/D10是Procet自身约束。
3. AWS Strangler fig pattern建议transform/coexist/eliminate和回退，适用于保留旧Reader与分域替换。必须真正读取旧用户工程；产品不采用AWS网关也可以遵守渐进原则。
4. SQLite的Backup API可帮助单库一致快照，ALTER TABLE及PRAGMA user_version支撑有界Schema变更。不能假设不同SQLite/PG/对象文件全局事务，user_version不代表业务兼容，故R04/R10规定独立恢复与用户库不删除。
5. RFC 9110第13节If-Match示例可类比lost-update保护，但Owner同时必须重验ACL epoch、sourceHash、Frame、scope、taskGeneration与取消状态。W3C PROV-O的wasRevisionOf、wasDerivedFrom、失效表达仅支持版本谱系模型，不等于实现与审计证明；R02/R05/R08使用相应思想。
6. NIST SP 800-218 v1.1（2022-02-03 Final）本轮只读官方目录和摘要，作为质量治理一般背景；Rev.1还是Draft。未阅读完整PDF正文，不得将尚未核实的具体条款用作验收依据。

## 制造失效链
D04 ProcessSetup与D10 ExecutionBinding独立；D09 NeutralCL→D12最终NC后处理→D13控制器语义解释→D14轴时序→D15独立工程验证→D16人工签发，每段都绑定exact版本与来源，未知语义必须UNKNOWN且D16阻断；CL动画和D11不能替代D15，不做材料扫掠仿真。材料工序D07不可被迁移时推断的假材料扫掠覆盖，D08冻结成果必须保全。

## 可机读映射
[来源清单](../sources/T5-04.json) → [10条规则/字段/资产](../traces/T5-04.json) → [10正10反10不同字段变异](../../docs/work-packages/T5-04/fixtures.json) → [实施与独立消费者](../../docs/work-packages/T5-04.md)。所有30例都只是合成规则，真实SQLite恢复/NC/机床/独立消费者和L3签署NOT_RUN/PENDING。
