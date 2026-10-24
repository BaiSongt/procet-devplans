# B0-02｜V0.8历史支持附件定位核查

**只读检查日期**：2026-10-19。检查渠道：GitHub连接器`fetch_file`，分别定位`main@271f2ad017fd30ef01c13763c61046f888ea0d48`和规划分支`gpt-ai/plans/cap-02-07-20261017@1d8019c77b49d301e494cae0b38ca241e07c82c9`。未对产品仓执行写操作。`NOT_FOUND`仅说明这两个检查位置不存在，不能证明历史附件从未存在或已被删除。

| V0.8 README列出的应有附件 | main | 当前文档规划分支 | 已有替代证据 | 推荐恢复动作 |
|---|---|---|---|---|
| `docs/architecture/v0.8/capability-map.json` | GitHub 404 | GitHub 404 | `03_三级能力映射_88项.md`存在且共88行CAP；本轮新增`B0-02/capability-88-first-batch.json`为规划提取候选 | 先查旧交付真实附件/原哈希，找不到时将新生候选标`reconstruction`而不是冒称历史原件 |
| `docs/architecture/v0.8/work-packages.json` | GitHub 404 | GitHub 404 | `04_开发工作包_36项.md`存在，B0-02原文、B0-01依赖清晰 | 从原文/合法原件核实字段和36项依赖，若需重建新文件必须标来源、重建日期、差异与兼容边界 |
| `docs/architecture/v0.8/code-evidence.json` | GitHub 404 | GitHub 404 | README及`02_代码证据与差距台账.md`指向E系列；本轮未重新核验23条产品源码 | 优先寻找历史真实文件，无法找到时在台账明确标缺；不得以规划作者记忆自动重建SHA或观测结果 |

**本次可证实原文**：`03_三级能力映射_88项.md`Blob SHA `e2c7fbaef7603e69576fb8c5c2b2e2c18d127cfb`；`04_开发工作包_36项.md`Blob SHA `45c897339bb51a574d94a13c1cd378f9b2539c5a`。这些Git blob SHA不是当前本地新稿哈希。

**状态**：`discovered_missing_supporting_files_pending_authorized_retrieval`。不虚称历史迁移完成，不影响本轮新B0-02作为独立待入库工作包。后续通过Files检索先前真实附件，必要时由用户明确来源再恢复；不改写历史内容与访问日期。正式迁移完成前不能宣称V0.8所有附件已恢复。