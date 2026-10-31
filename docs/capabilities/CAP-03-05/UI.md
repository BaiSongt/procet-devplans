# CAP-03-05｜五任务GUI与单一3D证据联动（设计提案）

> 2026-10-18；仅规划原型，不表示React/Babylon已实现。回到[业务总规格](README.md)与[20组验收](fixtures.json)。

## 总体框架

保留ActivityRail入口「特征」；Ribbon仅切换任务；唯一`UnifiedTaskPanel`在左侧容纳五个步骤；中部继续使用**全局唯一Babylon主交互世界**。资源空间通过水平切换复用同一Scene/RendererPort，不创建第二交互Engine。所有3D模型、面/边/岛高亮、轴箭头、半透明候选均为领域快照的**显示投影**，不向数据库提交编辑；选中、预览、确认是三种不同状态。支持深/浅主题，保留低对比轮廓以突出诊断。

| 页面 | 输入控件/来源 | 只读展示与业务动作 | 异常反馈 |
|---|---|---|---|
| ① 来源与资格 | Project、CAD修订、装配Occurrence、几何Snapshot、算法Profile（选择已有版本），可选ProcessSetup/StockRef | 来源hash、BRep状态、单位Frame、reader/native版本；“查看可运行条件”“开始识别” | mesh_only/invalid_brep/source_missing时只允许预览与人工定位；无D10机床不全局阻断 |
| ② 识别候选 | 种类过滤（孔/槽/腔/台阶/端面/保留结构）、状态/算法版本过滤、排序 | 计数：recognized/partial/skipped/unknown/ambiguous；差异对比；运行进度与取消 | Run Solved但skipped>0必须警示，不能显示“全部成功” |
| ③ 几何证据 | 用户选候选或冲突组；不编辑原BRep | 高亮floor/wall/rim/island/多Solid及成员面；显示邻接边/法向/MaterialSide，互斥候选叠加；截面可视化 | 映射失效时显示`unresolved`与来源，停止任何正式采纳 |
| ④ 争议与人工复核 | 用户选择保留/拒绝/分裂候选；分类修订理由、PMI关联选取 | 证据对照、可编辑草稿、影响范围；人工修订产生新草案 | 拓扑缺失/未支持/PMI不明→needs_review；不允许仅confidence授批准 |
| ⑤ 确认与历史 | 提交说明、批准引用、选择要采纳的candidateRefs | 提交前exact源码/Frame/算法/权限检查预览、确认后receipt，历史Run和失效树 | stale revision、取消竞态、权限变化→显式拒绝/回执查询/重基入口 |

## 字段表与单位约束

| 字段（UI标识） | 默认/来源 | 单位 | 编辑权限与校验 |
|---|---|---|---|
| `modelRevision`, `sourceHash` | 当前已选D01快照；无自动最新回退 | - | 只读，变化先确认版本 |
| `assemblyOccurrencePath`, `frameRef` | CAD/装配实例及F1-02 | frame ID | 只读，不把Babylon显示矩阵保存为设计Frame |
| `stockRef`, `processSetupRef` | 当前工程可选或none | - | 手工可选；缺毛坯仅影响毛坯相关候选，不强制机床绑定 |
| `featureKind` | 识别算法提议或人工修订 | enum | 草稿可编辑，改动须理由+差异记录 |
| `diameterMm`, `depthMm` | 解析几何派生 | mm | 算法值只读；人工测量单独存审查注记，不原地覆盖算法输出 |
| `axisDirection` | 识别证据+`frameRef` | 单位向量 | 只读，零向量或错Frame阻断实际消费 |
| `openSides`, `materialSide` | 面环/朝向证据 | enum | unknown不得默认closed/inside |
| `confidence` | 当前算法Profile输出 | 0..1（无量纲） | 只读，非校准正确率；不用于自动批准 |
| `evidenceCoverage/diagnosticCodes` | Run工件统计 | count/list | 只读；包含所有跳过候选，不能只统计成功列表 |
| `expectedRevision`, `requestId`, `scopeEpoch` | Host领域入口绑定 | revision/id | 只读隐藏技术域也必须参与提交和回执核验 |
| `frozenPmiRef` | CAP03-04已批准语义引用 | - | 只可选已有冻结包；unknown保留风险 |

## 3D交互细节和恢复

拾取流程：单击mesh投影产生`selectionLease`→使用RendererPort把picked triangle定位至**当前exact**拓扑映射→在左侧证据列表显示对应FaceRef→悬停仅高亮→“标注为候选成员”只修改草稿→“采纳候选”必须显式确认并调用03域Owner。L3拟定状态`idle/loading/previewing/reviewing/dirty/validating/committing/committed/conflict/stale/blocked/cancelled`。

双击冲突节点打开两套图层，不在后台合并面索引；透视与正交相机切换只是显示设置。保存/关闭dirty草稿需“保存草稿／放弃变更／返回编辑”；ESC取消拾取、算法Run取消和业务提交取消分别对应不同协议。关闭页面/Setup切换时注销selectionLease，但不得删除有效历史Run。

并发示例：工程A的`run-a`识别中用户切B；A的结果晚到，仍可按RunRef查询，但不得更新B的候选列表。两操作者分别基于D02 r10采纳不同候选，只有基线仍匹配的一方可提交r11；失败方保留草稿并显示diff，不自动覆盖。提交完成后网络断开，重连用`requestId`查真实receipt；若已经committed，取消按钮不能将成功写入伪称取消。未建模PMI、材料侧、隐式坐标语义统一标`unknown`而非绿色通过。