# CAP-02-05｜毛坯与材料目录 V0.8研究与独立验收补证（2026-10-28）

**新增规划证据，未获L3批准，也不是产品验收。** 原[业务规格](README.md)、[GUI/3D](UI.md)、[R-MS-001原专题](../../../research/topics/R-MS-001.md)、[旧8规则](../../../research/traces/CAP-02-05.json)和research/references.json中SRC-MS-001..006均保留旧字节。本轮文件标识NEWLY_AUTHORED，不冒称恢复历史附件。

## 1. 可机器追踪的证据链

[10项公开来源与作者/时间/版次/URL/阅读定位及局限](../../../research/sources/CAP-02-05.json) → [10规则40字段/原MS-T01..18及工作包映射](../../../research/traces/CAP-02-05-v08-supplement.json) → [10正40独立单字段反例、4数学反例与8状态待执行脚本](research-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0205_research_v08.cjs) → [独立消费者交接](independent-consumer-v08.md)。

原冻结CAP直接包仍为**F1-02/F1-06/E3-04**；规则里的原工作包仅表示研究相关性，不擅自增加原三级表关系。NIST两份研究仅阅读官网摘要；ISO 6508-1/513/10303-238仅官网公开目录摘要；OCCT 8.0.1、RFC9110、W3C PROV-O只读取登记的特定公开方法/条款；不引用收费正文或声称产品已运行。

## 2. 三个必须拒绝的误判

**ISO 513不是工件材料质量证明**：官方摘要的适用主题是硬质切削材料及其应用。材料P/M/K/N/S/H组码、工件牌号、热处理批次或切速必须分别拥有明确分类体系与来源，未核实则unknown。硬度HRC/HBW/HV也不得静默换算为切削条件。

**BBox包含不是Stock实体包含**：OCCT BRepBndLib计算的bbox/OBB只是候选与诊断。二维L形示例：Stock截面=[0,10]×[0,2] ∪ [0,2]×[0,10]，其bbox=[0,10]×[0,10]；点(5,5)在bbox内而不在Stock中。真实检查必须在具名Frame中用有效封闭Solid计算Part减Stock的残差，检查Cut/几何状态、容差及多Solid边界；二维数学反例不算OCCT Native测试。

**版本更新不能改变历史Setup**：缺失历史材料revision的旧material_id只能legacy_unresolved/read-only；材料属性变更通常影响工艺建议的可复核状态，不必废弃CAD几何；毛坯Solid或Frame实际变化时才按依赖传播D07/CL/NC stale。冻结A/B/D08不覆盖，不把当前latest当历史真值。

## 3. 数据Owner、统一GUI与安全事务

D03材料目录和StockTemplate资源；D04名义Setup明确采用的materialRevisionRef/stockSolidRef/hash/frame；D10实际机床安装与执行绑定。C0只负责身份、单位、Frame、修订、作用域和Port协议，拒绝巨型公用材料对象。GUI/CLI/Agent统一通过领域Port，唯一Babylon Engine/Scene/Canvas，主工程世界和资源世界横向切换、左侧UnifiedTaskPanel、12px上限；3D高亮和预览不写业务状态。

业务Owner事务提交前重验ACL、ScopeEpoch、expectedRevision CAS、exact revision/hash/frame、requestId与cancelGeneration；取消后迟到ACK不得恢复权限，已经生效的真实Receipt必须保留对账。失败与并发冲突允许继续编辑或影子读回退，但不得覆写冻结A/B或原NC验证结果。

中立D09 CL→D12最终NC后处理→D13控制器执行语义→D14轴运动时序→D15独立工程验证→D16发布。D13 unknown不得放行，CL动画与资源3D不是NC工程验收；不做材料扫掠仿真。

## 4. 验收等级与工程风险

本轮使用GitHub读到的内容在V8内执行等价谓词，**54项规划静态合成通过（10正40单字段负4数学）**；8项状态只是设计。Node文件系统进程、真实OCCT、实测材料属性、真实D04 CAS/ACL与迟到回执、三轴/B5、NC控制器和17独立消费者均NOT_RUN，不能宣传产品通过。

待Owner人类批准的风险：真实来料批次与试验方法、OEM材料建议适用条件、合法资料授权、OCCT版本锁定及公差、历史material_id修订解析、D04/D10迁移、离线资源闭包、失效传播/回退及D15消费者实测。正式Owner签署0/17，L3 PENDING_HUMAN。**规划PASS≠产品PASS。**
