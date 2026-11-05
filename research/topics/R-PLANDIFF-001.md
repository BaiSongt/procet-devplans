# R-PLANDIFF-001｜D05工艺计划语义差异与可追溯修订（2026-10-25）
> 本专题针对CAP-05-07新编，非既有论文全文迁移。L3、全部跨域Owner及产品实测未批准/未执行。

## 证据分级与阅读边界
- ISO 14649-10:2004（Edition 2，2024复审有效），只读ISO官方目录/Abstract，证实workplan/workingstep概念，不读取153页付费正文；不能推出本设计中的CAS、stableId等新条款。
- RFC 9110(2022) §13.1.1 强比较If-Match减少lost-update；此处转化为**业务Revision CAS**的工程类比，HTTP协议并不能代替数据库事务、ACL或跨域原子性。
- W3C PROV-O(2013) wasRevisionOf/wasDerivedFrom可支持来源边语义，设计的审批日志、局部依赖DAG、不可变冻结均为**Procet自身要求**，不是PROV-O保证。
- RFC 8785(2020 Informational) §3.1/§3.2可定义结构化JSON规范化，必须统一Profile/版本；原始NC字节不应经JCS变换后宣称相同。
- Git官方git-diff --find-renames/-M用文本相似度猜测重命名，不允许以此自动把工业零件不同几何occurrence当同一stableId。
- NIST Helu/Hedberg/Barnard Feeney(2017)及Hedberg/Helu/Sprock(2018)仅阅读官方出版元数据及Abstract；提供数字线程背景而非可直接执行的具体工艺规则。
- OCCT 8.0.1 BRepCheck_Analyzer公开API表明IsValid检查shape几何/拓扑有效性；不能推导加工、程序或连续运动安全。

## 自主工程推导（必须人类审查）
D05基线`B`、已提交`H`、用户候选`P`三方，按`stableOpId+属性hash+DAG依赖边+D04 frame/source ref`生成`Δ(B→H)`和`Δ(B→P)`。若同ID或依赖跨边冲突，输出Conflict，拒绝自动合并；不能使用UI行位置或几何相似度替代稳定ID。无影响证明时不能宣称局部失效最小。D08不可变；改变冻结范围需新审批和新修订。D09中立CL链路经过D12最终NC→D13语义→D14轴时序→D15独立验证→D16发布，产品级资格不可由本规则表自动授予。

## 开发及验收映射
[8份登记来源](../sources/CAP-05-07.json) · [10条规则→字段/原包→20正反验收](../traces/CAP-05-07.json) · [业务与Port](../../docs/capabilities/CAP-05-07/README.md) · [独立消费者](../../docs/capabilities/CAP-05-07/independent-consumer-handoff.md)。

**待独立验证**：真实D05/D08数据库修订原子性、StableId迁移、OCCT几何复核、控制器D13 UNKNOWN传播、B5 D14时序、D15工程安全、D16发布批准，以及Owner/L3。规划PASS≠产品PASS。
