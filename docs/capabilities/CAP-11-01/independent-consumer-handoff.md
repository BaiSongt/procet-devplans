# CAP-11-01｜独立消费者、失效迁移与17资产Owner交接

[原17资产候选Owner清单](../../architecture/v0.8/business-assets.json) → [本轮Owner只读候选映射](asset-owner-candidates.json)。**资产Owner候选不代表会签完成**；AI域只拥有会话、上下文引用和提案记录，不接管D01–D17任一原始业务事实的Writer。C0只承载对象、修订、内容指纹、单位、Frame或N/A、Scope及协议版本，不放通用巨型对象。

**拟议Port**：`AiWorkbenchPort.readContext`、`proposeIntent`、`previewDiff`、`requestHumanDecision`、`dispatchToDomainOwner`、`cancel`。GUI、CLI、Agent调相同Port；仅原Owner域审查写入、重验CAS+ACL+scopeEpoch+cancelToken。外部模型返回的ToolCall不是获授权的命令。禁止Agent直发remoteCycleStart、覆写冻结D08、或对UNKNOWN控制器语义签发D16。

**独立消费者验收入口（NOT_RUN）**：另一个进程/另外一个领域Owner，在两Setup、三轴及B5样本上加载冻结D01/D04/D08/D10和D12原始NC哈希；测试多语言选中引用、跨租户拒绝、异步用户取消、权限中途撤销、同名不同机床、Frame改变、Prompt注入、资源不可用/离线、工具晚回执、CAS冲突、AI建议是否误授D15/D16，以及单Canvas单左TaskPanel。要提交独立工具和产品**exact commit、可执行hash、输入文件及许可、控制器Profile、命令、退出码、原始日志及结果**，不能拿规划fixtures冒充验收。

**Expand/Migrate/Contract**：旧手动Workbench及所有Owner Port原状保留，先将新AI ContextReader配置为只读影子，逐字段对比旧Owner读出的revision/hash/frame/ACL/scope并且只读记录差异；对照及正式Owner会签、独立消费未通过前不切新Writer。迁移失败退回旧Reader和手动工作流，保留D08冻结、D12原NC、D16签发及D17追加审计。恢复后必须重新确认，不消费旧Approve/晚ACK。历史附件原始字节缺口见[审计台账](../../../tracking/pending-source-gaps-2026-10-19.json)。

正式17个资产Owner/接口、L3均`PENDING_HUMAN`，原始产品源码/浏览器/LLM/NC与独立消费者`NOT_RUN`。**规划PASS≠产品PASS。**
