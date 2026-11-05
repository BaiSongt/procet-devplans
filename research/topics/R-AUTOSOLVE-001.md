# R-AUTOSOLVE-001｜无人工计划几何探索与受限搜索
本专题对应原CAP-06-01、F1-05/W2-02/03/06；2026-10-25仅核对公开合法目录/API/官方摘要，不宣称产品实测。
**几何理论**：OCCT 8.0.1 Boolean Operations公开说明CUT/COMMON/FUSE、来源History；BRepCheck_Analyzer提供IsValid，BOPAlgo_Options提供FuzzyValue/Errors。可用于设计“B-Rep输入→带预算布尔→独立检查”的候选证据链。未见任何足以证明航空薄壁件加工安全、自动fuzzy限值或五轴运动安全的凭据。
**多方案与状态**：NIST Gupta等1994年多工艺方案及Kramer等2000年分层规划，仅查阅出版页Abstract，不能假装已读论文方法细节。OR-Tools CP-SAT官方区分UNKNOWN/FEASIBLE/INFEASIBLE；这个离散规划状态只能借鉴终态语义，真实几何仍需OCCT独立验证。
**数据语义**：ISO 14649-10:2004官方目录支持workplan与workingsteps的数据边界，未阅读153页付费正文。W3C PROV-O的Entity/Activity/wasDerivedFrom、RFC9110 §13.1.1 If-Match与RFC8785 §3 I-JSON可作为来源/DAG/CAS/Profile设计参考；它们不强制Procet具体实现，不能代替ACL、数据库事务和D15验证。
每个来源登记标题/机构/版次/发表日期/访问日/深度/阅读位置/支持与限制，见[来源清单](../sources/CAP-06-01.json)。追踪[规则→字段→正反验收](../traces/CAP-06-01.json)，规划PASS≠产品PASS。下一步必须锁定产品OCCT实际二进制、验证多Solid/薄壁/保护域/预算及05/07两个独立消费者。