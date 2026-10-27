# CAP-11-03｜检索/引用/3D交互（唯一左TaskPanel）

设计约束：全局字体**最大12px**、仅浅色/深色；11域通过ActivityRail打开唯一左UnifiedTaskPanel，切换「问题 / 作用域 / 检索 / 引用 / 冲突 / 变更草案」，**不得再建右Drawer**。主工程3D与制造资源世界可横向切换，但同时仅一活动Babylon Engine/Scene/Canvas，不允许并排3D。选中结果仅由现有Scene做只读高亮，**选中、高亮或动画绝不形成工程验证PASS**。

| 面板 | 字段/交互 | 状态及失败条件 |
|---|---|---|
| 访问范围 | principal、Project/Tenant、ScopeEpoch、Owner、Dxx exact revision/hash | 未授权REJECT、过期STALE，越权命中不能显示 |
| 检索 | Snapshot、Embedding/Chunker版本、TopK、排序信号 | 分数仅排序；缺原件UNKNOWN |
| 证据 | 原件URL/引用权、Selector、定位版本、读文深度、claim→chunk | 无法复核UNKNOWN，冲突CONFLICT |
| 三维 | D01/D02对象引用、D04名义Setup、D10实际Frame | 只读Scene overlay，不能自动修改执行绑定 |
| 变更 | Diff/原因、业务Owner、人类确认、CAS/ACL/取消重验 | 撤权/晚ACK不得提交，D08冻结保护 |
| 等待态 | 当前召回、重排、Owner重验、Selector复核和取消状态 | 动画仅表明任务执行，不是安全认证 |

CLI设计接口（尚未实现）：`procet evidence query --project <id> --revision <exact>`、`procet evidence explain --claim <id>`。Agent、CLI与GUI统一调用`EvidenceRetrievalPort`，严格同一授权。
