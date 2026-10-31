# CAP-11-02｜知识/规则查询与3D场景交互

**统一GUI约束**：最大12px、浅/深主题；ActivityRail选择11域时只在**左侧唯一UnifiedTaskPanel**切换「知识｜条件｜来源｜冲突｜变更」，**无右Drawer**。全局同一活动Babylon Engine/Scene/Canvas，工程3D与资源3D世界横向切换但仅一个活动场景；规则高亮复用既有Scene的只读overlay，不创建第二套3D。

| 区块 | 字段/行动 | 失败/证据 |
|---|---|---|
| 索引 | 词条URI、schemeRevision、exact知识revision/hash | SKOS closeMatch不作工艺等价；失效显示STALE |
| 适用条件 | 材料牌号+热处理、完整刀具装配、机床D03、实际D10控制器/Frame | 缺单位、热处理、实际装夹显示UNKNOWN，不补值 |
| 规则面板 | 只读条件DSL、优先级、冲突解释及适用边界 | CONFLICT双向溯源，不暗选一个 |
| 关联3D | Babylon拾取更新候选对象Frame/Revision、只读高亮 | 高亮≠提交，也≠D15工程验证 |
| 证据侧签 | 来源作者/版次/合法访问深度/明确限制，规则字段和验收链接 | 目录/摘要不显示「已读标准正文」 |
| 审批 | 变更Diff、人类确认、Owner ACL/CAS/Scope、取消 | 取消晚回执不可提交；需正式Owner会签 |

拟议CLI：`procet knowledge query --revision <exact> --machine-profile <id>`、`procet knowledge explain --advice <id>`；Agent/GUI/CLI调用同一`ProcessKnowledgePort`且同一授权结果。只是**拟议接口而非已运行命令**，不让Agent自行机床启动或签发D16。流程状态为READING/MATCHING/EXPLAINING/ADVISORY_ONLY/PENDING_HUMAN/STALE/UNKNOWN/REJECT/CANCELLED，长任务可见当前动作和等待动画。
