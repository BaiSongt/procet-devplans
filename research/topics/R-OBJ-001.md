# R-OBJ-001｜工程对象与文档的身份、注释与恢复边界

**2026-10-19 新补证专题，L3待评审；未执行任何产品测试。** 关联 CAP-01-02 原版已存在业务规格，原AT01–AT08保留，本文件新增AT09–AT20。

## 实际读取的公开依据与适用限制

- W3C Web Annotation Data Model（2017-02-23，Recommendation），已读Body/Target/SpecificResource/Selector/State公开章节：对象可与特定资源版本、局部区域建立有类型关联；**不要求Procet内部存储JSON-LD**，也不将注释等同于PMI正式批准。
- Tauri v2 File System Plugin官方文档，已读Permissions/Scopes：文件访问须经过受控授权；它只约束文件访问，不替代CAD、Project的业务写权限。
- IETF RFC 9110（2022-06），已读§13 If-Match/Preconditions：条件更新是防止失配覆盖的协议参考；内部CAS必须实际独立实现并测试。
- SQLite Foreign Key Support官方文档，已读§4.3 ON DELETE/UPDATE：引用删除策略有RESTRICT等方式；**不保证跨外部CAS和其他数据库的冻结证据自动受到保护**。

来源详见 [CAP-01-02登记](../sources/CAP-01-02.json)；规则与字段、工作包及验收详见 [追踪JSON](../traces/CAP-01-02.json)。来源不是对已实现产品的认证。

## 原有代码观察与新设计差距

历史只读观察的procet-gui@4e8eec12 DocumentManager会按documentId复用会话并产生临时instanceId，session恢复并非永久视图ID，且dirty门需在调用端完整审计。这里把它们作为**历史源码观察/待复核**，不声称本次对产品源码重运行或已复现bug。

建议复用Host/Project/DocumentManager/ContributionHub/RendererPort，约定业务对象身份与ViewInstanceId分离；Project只管理索引/关联，CAD和其他域管理自己的事实，3D只投影并通过领域Intent确认。GUI/CLI/Agent共用Host，提交点校验exactRef、scopeEpoch、requestId、expectedRevision和实际许可。未知类型与旧工程保留未识别原数据，不能静默丢失。

## 风险与退出条件

真实多视图/跨Project迟到回执、异常SourceHandle、断网required附件、冻结删除和Agent越权均为**待实施测试**。任何来源字段名只是规划L3语义提议，未来产品命名须按真实DTO核对。研究、源码观察、设计意见及产品测试四类证据单独归档。