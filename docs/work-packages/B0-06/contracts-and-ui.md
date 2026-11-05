# B0-06｜受管领域端口与GUI/3D交互契约

**Port：** `GovernanceReviewPort@v1`。三入口 GUI/CLI/Agent 均走相同端口与权限层，不能让Agent直接写ADR库或让GUI操作按钮伪造签署。

## 强类型命令（待实现，不代表已有API）

```text
ReviewScope = { projectId, documentId, setupId?, mode:A|B, scopeEpoch }
ExactRef = { assetId:D01..D17, revision, contentHash:sha256, frameId, units, schemaVersion }
ProposeADR = { scope, idempotencyKey, expectedRevision, actor, context, alternatives[], consequences, supersedes? }
AttachEvidence = { scope, sourceExactRefs[], gitCommitSha, binaryHash?, environment?, command?, resultHash?, phase }
RequestApproval = { scope, expectedRevision, ownerRole, independentConsumerIds[], evidenceHashes[], approvalKind }
Receipt = { commandId, scopeEpoch, committedRevision?, status:PENDING|COMMITTED|REJECTED|UNKNOWN, reasonCode }
```

**业务命令门禁：** readCurrent@exact→authorize(actor,action,scope)→CAS(expected revision/hash)→validate frozen D08/D16→atomic commit in Owner→返回带版本回执；取消只改变尚未提交任务资格。先Commit后取消时不否认已发生提交，允许补偿新修订。

## GUI步骤与状态矩阵

1. Ribbon/ActivityRail选择“计划审查”，左TaskPanel显示对象名、原CAP/工作包、当前源HEAD和证据分层；空配置时显示 UNKNOWN，不自动补假账号。
2. “查看来源/决策”在同一Babylon世界只读高亮相关D04/D09几何，使用OverlayLease，在切工程、取消、禁用模块时dispose；不得另起世界。
3. “提交审阅”先显示待批准/已运行/未知三轴状态及红色阻断原因，表单只读/可编辑依据权限；提交时必重新读取精确Revision。
4. “取消/切Setup”提高scopeEpoch，忽略过期回执；存在已Commit事实时显式提示“已提交，需新修订撤销”，不能悄悄回写。
5. CLI `plan review --exact ...` 和 Agent工具 `governance.review.request` 为未来外层适配，响应必须等价于GUI受管端口；尚无产品实现则显式NOT_IMPLEMENTED。

**布局准则：** 仅浅/深主题，最大文字字号12px，紧凑无卡片堆叠；统一左任务容器，不遮挡3D坐标工具条。原型仅为静态交互说明，没提供工程认证功能。

## 完整NC资格链和拒绝例

D09 CL `PREVIEW_ONLY` 不授D15资格。D12后处理生成实际NC bytes；D13必须带控制器profile、模态/补偿、宏循环支持集及unknown清单；D14独立展开轴时序并界定可验证范围；D15独立限位/干涉/未覆盖证据；D16需真实授权。未知指令或无法可靠展开轴行为均 BLOCKED。明确**不做材料扫掠仿真**、不根据机床名称臆造运动学。

## 迁移与测试入口

合成：研究追踪JSON与正反fixture经tools校验；真实GUI、CLI、Agent、DomainPort、NC解释、实机及独立消费者验收全为NOT_RUN。旧manifest版本不认识时只读展示，禁止通过静默默认字段提升批准资格。
