# B0-05｜逐SHA证据服务、统一入口与GUI/3D

**L3拟议接口，非已实现产品代码。** 01域只写审查派生记录，06/GUI/Setup及NC真值保持原Owner；所有输入必须携带sourceRevision/hash/scope。

| 端口 | Owner/消费者 | 输入 | 结果或错误 |
|---|---|---|---|
| GitPrMetadataReader | 01只读；GUI/CLI/Agent | repo、PR、expectedHead | 完整head/base/reviews/checks；NOT_FOUND/STALE |
| PrDependencyGraph | 01派生；独立质量复核 | exact PR snapshot数组 | stackEdges、mergeBase、ahead/behind；UNKNOWN |
| VerificationEvidenceReader | QA主责；01索引消费 | exactSha、logRefs、executor | 有界证据、未测范围；LOG_MISSING |
| ReviewDraftCommand | Host统一；GUI/CLI/Agent | requestId、actor、scopeEpoch、expectedDraftRevision、expectPrHead | Committed(receipt)或CAS_CONFLICT/PERMISSION_DENIED/CANCELLED |
| ReadOnlyEvidenceProjection | 01投影；单Babylon世界 | snapshotExactRef、sessionEpoch、optional asset/frame refs | 来源→规则→字段→包→验收，不产领域写入 |

## 五页交互任务流

1. **PR候选**：repo/number、真实观察时点、head/base与Draft/Merged标记，强调“观察快照不自动刷新”。
2. **基线和依赖**：#60→#62关系与另行展示Solver#125的merged历史，不把不同仓提交混成同一Git DAG；显示merge-base与可审计缺口。
3. **逐SHA验证**：单测/构建/桌面NSIS/EXE/3D/几何/Native/NC分行，PASS_SCOPED与未测项同屏；并列“自测/他人评论/独立日志/真实实物”来源级别。
4. **合并建议**：依赖、变更、审批人、必须重验的测试矩阵；本工具没有合并按钮，也不提供运行付费CI命令。
5. **草稿及交接**：diff、CAS precondition、授权重验、回退参考；取消或新scope的晚回执不产生业务提交。

单一Babylon Scene/Canvas/Engine由主世界承载；TaskPanel是左侧唯一业务容器，AI浮层不得复制另一套任务状态。抽象PR没有必要的3D形体：只有存在可合法读取的领域资产确切修订时，使用只读3D高亮展示其证据链；不得制造虚假机床或把渲染投影当验证。资源/视图订阅跟随scopeEpoch，卸载时对称释放。

真实产品入口及测试命令均需要在当期源码检查后登记，不能把规划文本中的服务接口或按钮说成已实现。
