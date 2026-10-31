# CAP-05-04｜统一界面与3D交互规格（候选）
> 仅设计交互和字段；**未运行Babylon/产品，L3待评审**。

## 面板入口与视图
统一左侧`ActivityRail→工艺规划→Template TaskPanel`容器，保留工程树、Setup、工序树和AI面板的业务联动。模板库不是浮动多卡片布局；顶部为紧凑检索、版本切换、适用性过滤，最大字号12px，只允许浅/深两个主题。右侧Agent为独立显隐，绝不建立第二Babylon Scene/World。

| 步骤 | 操作 | 必填/可观察证据 | 异常提示 |
|---|---|---|---|
| 1 模板选择 | 检索、比较approved版本与来源 | templateId/revision/hash/owner/lifecycle | 缺来源或旧版本标UNKNOWN |
| 2 适用检查 | 当前特征/材料/工艺/机床能力逐谓词预查 | D01/D02/D04 exact refs、D03 capability | 不适用/缺失分别NOT_APPLICABLE/UNKNOWN |
| 3 绑定 | 按slot逐项绑定occurrence、Frame、刀具参数 | occurrencePath、transformProof、unit、resourceExactRef | 歧义高亮但不自动选定；D10执行配置不在此编辑 |
| 4 差异预览 | 模板意图与当前D05 DAG并排对比 | added/modified/affected/unaffected、unresolved | D09 CL未生成、D15 NOT_RUN明示 |
| 5 受控采纳 | 再检查权限、版本CAS、冻结、批准 | expected/current revision、scopeEpoch、audit receipt | 撤权/并发/取消/晚回执均阻断正式写入 |

## 单Babylon世界
模板槽位先在表格选中并触发`HighlightLease`，租约绑定`taskGeneration`。渲染端只用现有RendererPort承载D01几何高亮和D04坐标系，不注入模板专属场景。发生多Setup切换/取消时撤销高亮、清空未提交预览，不能使旧回执切换当前工序。无法解析Frame显示`UNKNOWN`状态，不把矩阵猜测当计算结果。

## Agent/CLI同步
`evaluateApplicability`/ `previewInstantiation`/ `commitInstantiation`三入口返回同一`resultKind、exactRefs、reasons、affectedIds、newRevision?`；Host而非AI负责权限决策。提交前检查当前D05、D08冻结、模板approval与输入hash；所有入口统一审计。不把预览、3D线条动画或模板匹配进度升级为D15验证PASS。
