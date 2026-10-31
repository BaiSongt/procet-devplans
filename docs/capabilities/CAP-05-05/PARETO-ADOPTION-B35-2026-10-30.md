# B35｜CAP-05-05 求解候选的Pareto比较、停止状态与局部采纳资格

日期：2026-10-30；原[业务规格](README.md)不替换，L1/L2与11域88 CAP、36原包、17资产不变，L3待审。**规划PASS≠产品PASS。**

## 技术边界与数学反例

- **求解器的OPTIMAL必须附模型与停止条件。** Google OR-Tools v9.15 官方CpSolverStatus说明：FEASIBLE仅为当前整数模型内可行，OPTIMAL有纯可行问题/达到设定gap limit等情形。必须保存`modelHash/configHash/stopReason/status`，不向真实几何、NC及物理安全外推。INFEASIBLE或MODEL_INVALID不采纳，UNKNOWN阻断工程宣称。
- **目标可比性与约束优先。** pymoo v0.6.2列举Feasibility First、CV As Objective、罚函数、epsilon约束等不同策略；这是工程方法选项，非唯一行业算法。对本合成双最小目标，A=(10 min,4 kWh)，B=(12 min,3 kWh)互不支配；A'=(8 min,2 kWh)支配B。任何单位、方向、目标Profile Hash、约束违反向量不一致都不得生成虚假的Pareto排名；不允许隐藏评分把非支配集合写成单一最优。
- **局部接管的前驱闭包。** 只采纳op-B，op-A必须由受控D05现有计划或同次子图满足，缺跨Setup Frame/转序证据返回UNKNOWN。D08冻结op-Z不原位修改。成功仅由05域写入D05新Revision与`wasDerivedFrom`，D06/D07和D08冻结不可反向覆盖。W3C PROV-O只支持来源关系表达，不承担事务或安全认证。
- **预览和工业验证隔离。** D09中立CL → D12最终NC后处理 → D13执行解释 → D14物理轴时序 → D15独立验证 → D16发布；D04名义Setup不得冒充D10实际绑定，D13未知保留UNKNOWN；CL动画不认证D15，不做材料扫掠仿真。

## 业务实施契约

05域`CandidateAdoptionPort.compare/preview/commit/cancel/fork`唯一提交D05。读取D01/D02/D03/D04/D06/D07及D08精确`id/revision/hash/frame/scope/occurrence`，不从latest补值。GUI/CLI/Agent共Port，单Babylon Engine/Scene/Canvas、统一左TaskPanel，最大字号12px；3D仅只读预览。Commit重新核ACL、expected/current CAS、ScopeEpoch、Generation和来源哈希，取消/撤权/迟到回执仅审计不提交。旧字段缺失只读迁移标记UNKNOWN，受管fork生成新修订，回退不覆盖D08/D16历史。独立D05、D07、D09、D13–D16消费者仍未测试。

## 合法来源、访问版本及阅读限制

1. Google OR-Tools维护者，[v9.15 CpSolverStatus](https://or-tools.github.io/docs/java/enumcom_1_1google_1_1ortools_1_1sat_1_1CpSolverStatus.html)，访问2026-10-30：实际读取枚举与gap limit注释，未运行Solver，页面未注明发布日期。
2. pymoo维护者，[v0.6.2 Constraint Handling](https://www.pymoo.org/constraints/index.html)，访问2026-10-30：只读官方约束处理概览，未证实算法性能/收敛。
3. Lebo、Sahoo、McGuinness等编辑，[W3C PROV-O 2013-04-30](https://www.w3.org/TR/prov-o/)，访问2026-10-30：实读§3.1、§4.1/4.2指定来源属性；CAS/Owner是Procet内生规则。
4. Brodsky、Shao、Riddick，[NIST 2014制造决策优化论文著录](https://www.nist.gov/publications/processes-analytics-formalism-decision-guidance-sustainable-manufacturing)，只读官方摘要，未读论文正文或编造条款。
5. Procet团队，[CAP-05-05原规格固定Git Blob](https://github.com/BaiSongt/procet-devplans/blob/9106f820a50930b00cfcfe77f8cae99923bde023/docs/capabilities/CAP-05-05/README.md) `e4442dedbc1ca58dbe8f729c3da0e87d78169062`，连接器完整实读；Owner/GUI/NC/冻结权限是内生规划。

[5份来源登记](../../../research/sources/CAP-05-05-pareto-adoption-b35.json) → [7条来源/字段/CAP/工作包追踪](../../../research/traces/CAP-05-05-pareto-adoption-b35-v08.json) → [2正3未知45反样例](pareto-adoption-b35-fixtures-v08.json) → [Node只读校验工具](../../../tools/check_cap0505_pareto_adoption_b35_v08.cjs) → [执行状态](../../../tracking/cap0505-pareto-adoption-b35-verification-2026-10-30.json)。本轮V8同判定函数50/50合成PASS；**独立Node文件进程、真实OR-Tools/pymoo/OCCT、NC/B5/OEM、17消费者NOT_RUN**。正式Owner0/17，L3及历史附件/全仓GFM AST仍待。
