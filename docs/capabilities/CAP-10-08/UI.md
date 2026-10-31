# CAP-10-08｜数字主线与审计统一交互规划

**位置：** ActivityRail「发布与现场 → 数字主线」切换**唯一左侧UnifiedTaskPanel**；最多12px字体、浅/深主题、压缩层级。以零件→工序→CL→NC→机床/执行正向和现场报警→D17→D16→最终NC字节反向两条视图展开，不同时堆两套TaskPanel。

①工程/修订Scope ②有向类型关系图 ③D04名义Setup与D10实际执行Frame并排属性对照（不是两个3D）④Owner/Revision/hash及原始证据出处 ⑤时间质量和UNKNOWN差异 ⑥审计更正与独立报告/缺口。拒绝访问、缺数据、过期与UNKNOWN用独立诊断，不伪装空搜索。

全局只保持**单个活动Babylon Engine/Scene/Canvas**，工程3D/制造资源3D横向切换；审计有向图用2D/DOM/SVG，不能在工作台并排第二个3D引擎。3D只读选中/定位严格匹配Frame；CL预览或审计事件不可触发机床运动/审批。

CLI候选 `procet thread trace --asset D12 --revision ... --digest ...`、`procet thread audit --root ... --verify`；Agent共享10域DigitalThreadAuditPort，只能通过同一受权Port查询/草拟索引，写入瞬间重验ACL/scopeEpoch/CAS/cancelToken；不可绕过D16真实人工审批。
