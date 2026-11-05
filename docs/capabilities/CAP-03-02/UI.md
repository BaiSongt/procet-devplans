# CAP-03-02｜零件、装配及版本：GUI/3D交互、字段与状态设计

**v0.1｜2026-10-18｜仅规划，待评审，未实施。** 主业务见[README](README.md)，来源与规则见[R-ASM-001](../../../research/topics/R-ASM-001.md)。遵守“一个Babylon交互世界、左侧UnifiedTaskPanel一个任务容器、主工程与资源空间横向切换、浅/深两主题、3D仅做显示投影”。工具条不重复创建第二个Tree/Scene的事实库；不要把CAM工序树demo直接当CAD装配树。

## 页面入口与角色

工程空间 → 设计数据 → 零件/装配与版本；也可由打开的CAD文档工具栏进入“装配结构”，回到工程列表后保持精确活动文档和源修订。设计工程师可比较并发起修订；工艺工程师可选择指定实例作为候选加工对象但不得直接写D01；审查员核差异与来源；无权限用户只能浏览。`ActivityRail`与浮动Ribbon仅贡献入口，左侧任务页是唯一主编辑容器；3D为同一世界，浏览与资源中心是可切换空间。

## 五个业务任务页

| 页签/状态 | 左侧任务操作 | 同一3D世界反馈 | 确认、取消、恢复 |
|---|---|---|---|
| 01 来源与版本 `loading/ready/readonly` | 当前Project/CAD文档、exact源修订、源Hash、解析器版本/选项、状态、根数；选择历史版本 | 当前修订正常显示；旧版以ghost叠加，无第二交互canvas | 加载前不替换当前正式模型；失败保留当前场景；取消只终止预览请求 |
| 02 结构浏览 `tree_partial/tree_ready` | 多根Tree、定义/实例图标、单定义被引用次数、实例路径面包屑、只读属性、筛选/搜索 | Tree选实例高亮唯一实例及其局部Frame；渲染色为显示派生 | 多选只创建`SelectionIntent[]`；点击节点不保存D01；缺件使用灰框+未知标签 |
| 03 版本差异 `diff_pending/diff_ready/ambiguous` | 选base/target exact revision；新增、删除、替换、重挂、位姿、属性、无法判定筛选 | 两修订可ghost对比，颜色图例为比较状态（不写成材料）；位置变化画局部轴与箭头 | “确认对应关系”需设计Owner权限和CAS；模糊对应必须人工复核，取消保留原修订 |
| 04 制造目标候选 `candidate/blocked/needs_review` | 选择occurrence exact ref及其PartDefinition、几何等级、单位/Frame、PMI覆盖、下游影响预览 | 单选选中确切发生实例，定位该occurrence; 工艺坐标/机床绑定仍未设置 | “提交候选”调用领域Owner校验；mesh_only/未知Frame/缺外链不得冒充已制造可用；结果只是候选 |
| 05 修订与回执 `validating/committing/committed/conflict/recovery` | 修改摘要、影响消费者、源闭包问题、expectedRevision、requestId、操作者与确认记录 | 提交成功后由receipt加载新修订场景；失败ghost不成为真值 | CAS冲突/授权变化/依赖缺失禁止提交；超时先按requestId查询receipt，已提交后“取消”只退出视图 |

## 字段规格（具体L3契约为提案，未冻结）

| 字段名 | 读写、单位、默认来源 | UI/异常约定 |
|---|---|---|
| `sourceRevision`, `sourceHash`, `readerVersion`, `schemaVersion` | 只读，由CAD/Host返回；无默认latest | 顶部状态栏同显；hash未知不启用提交 |
| `rootIds`, `definitionId`, `occurrenceId`, `instancePath` | 只读领域身份，不把Tree索引存入数据 | 同定义重复实例在树里分行，选择定位有唯一高亮 |
| `localToParentFrame`, `rootFrame` | 4×4矩阵，只读；长度单位内部mm，角度按rad，UI可换算deg并显示来源 | 不允许用户通过拖拽制造源CAD发生位姿；需变更设计须走修订命令 |
| `name/color/layer` | 源有则只读，缺失时显示“源缺失”；视图色可用户临时设置 | 视图配色不能作为源材料/审查签名 |
| `geometryCapability`, `pmiCoverage`, `externalRefsStatus` | 只读实际Reader回执：available/partial/unknown/unavailable等 | 未知显示灰色标签并提供诊断，不用绿色勾表示部分通过 |
| `diff.baseRef`, `diff.targetRef`, `diff.entries` | 只读由查询生成；未选版本时不猜最新 | `ambiguous`保持黄色“待核验”，不自动选第一个候选 |
| `selection.occurrenceRef` | 在当前exact revision里的UI意图，可取消；正式提交前二次校验 | 视图切换/Project切换自动撤销或暂停跨Scope选择 |
| `commit.note`, `expectedRevision`, `requestId` | note可编辑；expectedRevision从查询产生只读；requestId客户端幂等生成 | 变化中二次点击不得双写；提交后按receipt归档 |
| `impactSet` | 只读受影响D02/D04/D05/D06/D08/D16 refs及用途中性状态 | 禁止点击“应用全部最新引用”；已批准资产需独立变更流程 |
| `commitReceipt`, `committedRevision` | 只读后端回执 | 提交延迟时查询，不能用界面显示Ready冒充提交成功 |

## 交互状态机和晚到回执

预览支线：`idle → loading → ready/partial/blocked → selecting/diffing → candidate`。提交支线：`candidate → validation → commit_pending → committed/conflict/blocked/unknown_receipt`。任何只读预览允许`cancel_preview`，但**已提交不可撤销来源事实**，只可新修订回退或关闭当前页面。

在`loading/diffing/commit_pending`期间切换CAD文档、Project或视图空间，`scopeEpoch`递增；收到回执时先核对`projectId/documentInstanceId/sourceRevision/requestId/epoch`。不匹配则缓存给原作用域的通知中心，绝不能把旧响应写入新工作区。断线恢复先查询提交回执；未收到确认时显示`receipt_unknown`而不是“未提交，可重试”。同名两个实例选择必须使用occurrenceId与revision、绝不只传definitionId。

**3D选择规则**：左侧Tree与3D互相定位，3D拾取只返回候选`SelectionIntent`，候选引用需要从当前拓扑/Occurrence exact索引投影；不允许根据mesh triangle index生成长期制造几何身份。显示世界维持右手系与明确Frame转换，视口相机转换不得补写源数据。多实例选中时先突出当前instance，默认不高亮其他同定义节点（可切换“查看全部引用”作为只读辅助）。

## 页面级异常与可恢复动作

- 无有效CAD输入：显示“请先导入或打开CAD输入修订”，沿用CAP-03-01而非暗中创建CAM Job。
- 源修订已变：保留原树、标`stale`并显示“比较后派生”；不自动替换正在编辑的选择。
- 缺少合法源或外链：允许已解析部分浏览，阻断完整装配接受并展示来源/缺件路径；无网环境不自动下载。
- Reader不支持某级装配属性：按实际能力标部分读取，不从显示装配推定真实产品BOM。
- 发生引用环/非法Frame/未知单位：单节点诊断+`blocked`，不会自动删坏节点伪装成功。
- 取消与并发CAS失败：显式保留当前已确认版本，提供重新加载diff/导出诊断，必要时查询原提交receipt。
- CLI/Agent与GUI同时修改：全部经同一CAD Owner写口及expectedRevision，冲突应有唯一真实获胜版本；Agent输出候选而非静默审批。

## 页面验收对应

树/3D实例选择覆盖T01/T02/T03/T04/T17；Frame T05/T06；多根和外链T07/T08；属性覆盖T09/T10；版本diff和冻结影响T11/T12/T13/T14/T20；取消恢复/异步Scope T15/T16/T18；历史schema T19。验证时提供两层嵌套且同定义重复使用的合成STEP/XDE样例、非交换位姿和跨Project迟到响应，不依赖客户真实装配。实际浏览器/EXE/OCCT组合验收**尚未运行**。