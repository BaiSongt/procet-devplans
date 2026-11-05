# CAP-11-02｜Owner会签、独立消费者、受控迁移与回退

[17业务资产原候选Owner](../../architecture/v0.8/business-assets.json)与[逐项引用合同](asset-owner-candidates.json)均为`PENDING_HUMAN`。11域知识Owner只写自身受控知识版本，读D01/D02/D03/D04/D05/D08/D10等必须绑定`owner + exactRevision + rawContentHash + scopeEpoch + unit + frameOrNA`；不能从AI文字或缓存猜机床配置。D04名义Setup不是D10实际机床绑定。

## 独立消费者验收入口（NOT_RUN）

由不同进程/不同原业务Owner的05工艺规划和06求解消费者加载同一知识版本，比较三轴、B5、两个Setup、相似但不同牌号/热处理、相同机床型号不同运动链与刀具装配revision、不同控制器Profile、离线缓存、跨域撤权、提示注入、规则冲突、源文档变更、CAS冲突、取消晚ACK。必须保存**Provider/Consumer exact commit SHA、可执行文件hash、规则和17资产源文件版本、许可、输入与Frame、命令、退出码、原始日志及正反结果**。知识推荐不得签发D16，真实最终NC仍须D12→D13→D14→D15独立校验。

## Expand/Migrate/Contract与不可变基线

先挂只读影子`ProcessKnowledgePort`，按相同输入与旧可用知识索引比较匹配结果/理由/来源Revision及冲突；未获人工Owner会签及跨域独立消费前不替换原Owner Writer。新索引不合格可立即退回旧Reader，保留D08冻结A/B及D12 NC原字节、D16原批准、D17追加事实；重新同意并重验Scope与CAS后才可重新提交。知识条目本身的版本变更不变更原业务资产。历史原始附件缺口按[审计台账](../../../tracking/pending-source-gaps-2026-10-19.json)保留，不伪造字节恢复。

本轮74例仅布尔字段/枚举规则的规划合成。真实JSON Schema/SHACL解析、厂商刀具参数、浏览器、机床/NC、独立消费者`NOT_RUN`，L3/17Owner`PENDING_HUMAN`。
