# CAP-04-03｜GUI / 3D / CLI / Agent一致性规格
规划待L3；坚持**一个Babylon World、左侧唯一UnifiedTaskPanel**，Ribbon切换04域Setup任务，不创建第二个3D或重复资源抽屉。浅/深主题、键盘焦点与ESC退出AI+3D需要有可观察验收。

## 五步任务视图
1. **当前对象**：显示工程、文档、CAD instance、setupId、D04 expectedRevision/hash、D03 fixture exactRef；没有源时只读显示unknown。选择其他Setup立即提升scopeEpoch、取消旧请求。
2. **夹具资源**：3D中点选D03经资源资格筛过的实体或线框（无实体仅行程线框），左侧显示owner/版本/挂接Frame。点选为ghost proposal，不能写入D04或依赖暗转Frame。
3. **支撑/夹紧**：分层添加primary/secondary/tertiary locator，提供三维接触法向箭头和rank/residual，显示欠定/冲突、forceEvidenceRef、contact provenance。缺证显示unknown，不显示绿色安全勾。
4. **占用与保护**：按Setup/工序阶段展示夹具占用体、保护区域、静态bbox/OCCT证据等级及未知原因。UI显著标记“静态候选≠NC验证”；无D15的真实执行结论。
5. **影响与提交**：old/new D04 diff、消费者清单、冻结D08/D16标识、D10待再绑定、审批和CAS条件，用户显式点击提交。服务端重验权限；失败保留draft及错误码；成功回执以revision/hash/receipt显示。

## 输入与交互契约
活动Rail：Setup→`FixtureConstraintsTask`。`RendererPort`统一选中对象`{scopeEpoch,modelRef,occurrencePath,topologySnapshotRef,representationQuality,sourceFrame}`并使左TaskPanel填充，尚未可逆映射的mesh选取只用于视觉辅助。`TaskPanel`字段包括`fixtureInstanceRef`、`T_S_F`、`contactNormal`、`contactPoint`、`clampActionOrder`、`forceEvidenceRef`、`activeStages`、`expectedRevision`。D04的领域保存入口唯一。
CLI:`procet setup fixture propose --setup <id> --expected-rev <rev>`；Agent必须调用同一port，执行前提示权限/冻结影响及证据缺口，Agent回答不是批准回执；这两条是**建议接口**，非已实现CLI命令。
失败/失效：切项目、切Setup、取消、撤权、加载旧快照时无scope匹配的迟到回执丢弃；3D仅重新渲染来自领域Snapshot/Proposal的派生视图。无真实机床、夹具材料力学或NC语义时状态明确unknown。
