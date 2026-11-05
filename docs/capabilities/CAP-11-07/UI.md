# CAP-11-07｜统一工作台GUI/CLI/Agent及3D

唯一Babylon Engine/Scene/Canvas：工程3D世界与资源3D世界横向切换，同一活动Canvas，禁止左右并列双3D。所有知识审查在左侧`UnifiedTaskPanel`单容器切换，Ribbon/ActivityRail沿用ContributionHub；无右侧Drawer，字体最大12px，仅浅色/深色。Agent独立窗口仅能生成候选。

|状态|左TaskPanel交互/字段|唯一3D反馈|权限与错误|
|---|---|---|---|
|证据输入|D17事件/时间/质量、原字节Hash、人工描述|仅高亮关联零件/Feature|3D点击不写业务数据|
|候选及冲突|ParentRevision、正反证据、适用材料/刀具/机床/控制器|单世界切换新旧标注|置信分数不可覆写旧版|
|审核|Diff摘要、审批人、ScopeEpoch、ExpectedHead|D08冻结图层只读加锁|批准不等于Owner已提交|
|提交|新知识Revision、OwnerReceipt和取消世代|提交成功后才更新可信预览|晚ACK不得激活新世代|
|影响审计|列出D05/D09/D12-D16受影响精确引用|STALE/UNKNOWN标记，不显示伪NC PASS|D15不通过不予D16|
|退回/迁移|旧版浏览、新版追加事件、消费者回执|旧几何只读仍可见|NACK回退旧只读|

统一建议Port为 `11.KnowledgeFeedbackPort.propose/readEvidence/diff/requestReview/retract`；只有`11.KnowledgeOwnerPort.commitCAS`能提交11域知识；涉及D05/D08须再由05域Owner独立决定。GUI、CLI和Agent携同一Principal/ScopeEpoch/ACL/Frame/expectedRevision调用，执行前实时重验权限、CAS、取消。当前仅规划，产品`NOT_RUN`。
