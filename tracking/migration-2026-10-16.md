# 2026-10-16｜迁移纠偏与剩余附件台账

## 已确认的远端事实

本轮开始时main实际为`ecd746ac73aefbb8678e170aab4db411ea7c86d9`，包含根README、5份架构MD、10份详细CAP规格。此前回复所称`bb5a0eec`及完整迁移状态未由此次远端读取支持，不能沿用。

本轮回读确认既有迁移树`8b3692e21432d3764ee8648d1c7350a0fc41d2f6`存在，且对原main只有12个新增文件、无删除或覆盖。已形成提交`2a88ea79855cea35564be4cdc5c5a553355719a2`并非强制更新main，随后再次读取远端确认。

## 本轮修复的12个文件

- docs/architecture/v0.8/README.md
- docs/architecture/v0.8/baseline-lock.review.json
- docs/architecture/v0.8/business-assets.json
- docs/capabilities/batch01-v0.9.1/00_阅读指南与交付范围.md
- docs/capabilities/batch01-v0.9.1/02_界面设计/业务驱动界面总图.md
- docs/capabilities/batch01-v0.9.1/02_界面设计/交互评审工作台.html
- docs/capabilities/batch01-v0.9.1/03_数据与集成/统一数据结构与模块边界.md
- docs/capabilities/batch01-v0.9.1/04_工作包接线/实施切口_30项.md
- docs/capabilities/batch01-v0.9.1/05_验收与校验/已执行检查与未覆盖范围.md
- docs/capabilities/batch01-v0.9.1/05_验收与校验/跨功能验收与实施交接.md
- docs/capabilities/batch01-v0.9.1/06_依据与分批台账/依据与观察边界.md
- docs/history/batch00/00_本批交付说明.md

原内容保留历史语境。历史日期、测量数和测试报告只代表其原交付声明，不表示本轮重新执行。HTML仅原型，不构成生产UI接线。

## 仍待审计与迁入

本轮没有把原ZIP的全部支持文件迁完。重点包括架构capability-map/work-packages/code-evidence等JSON、第01批review.schema.json与examples、capabilities.batch01.json、traceability和产品验收清单、检查脚本/依赖声明、历史报告/截图、分批导出数据及原哈希清单。

这些类别要逐项与原文件核对，记录目标路径、内容hash、原始语境和是否必要。不能沿用上一回复未核实的“已迁40、未迁27”数字。缺少的必要JSON/示例会影响旧文档中相对链接，应优先迁入；历史截图和重复导出可以在明确说明后分类存档，但不得无记录丢弃。

当前可访问的原V0.8与第01批ZIP已在本轮容器安全解压用于核对编号。后续自动运行不应假定仍有同一容器：先检查远端；需要原附件而当前拿不到时，报告具体缺失，不伪造文件。

## 后续机制

跟踪状态见progress.json。正式记录以实际远端commit和文件回读为准；Git树对象生成成功但未挂接提交与分支，不属于已交付。提交失败时不得报告成功，也不能用猜测的短SHA充当证据。