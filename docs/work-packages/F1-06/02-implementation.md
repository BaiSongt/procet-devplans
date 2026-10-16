# F1-06｜02 实施级工作包分解

状态：10个可分派子任务已编制，**尚未实施**。原先F1-01、F1-03、B0-03为实际前置条件；研究依据[R-SNAP-001](../../../research/topics/R-SNAP-001.md)。

## A. 分包前需冻结的输入

收到F1-01唯一C0 exact-ref、hash/Schema协议及Owner列表；F1-03已核实的工程存储和依赖关系；B0-03独立黄金包。保留当前ProjectService/Working Store/Reader/Writer，先做只读审计，不能以文档规则重构全仓。消费方至少CAD、资源、Setup、CAM、NC、验证和GUI；只涉及本工作包规划，不自动更改这些仓库。

## B. 十个实施切口

| ID | 主责（含必须评审的消费方） | 具体任务与产物 | 准入、退出及回退 |
|---|---|---|---|
| F1-06-S01 | Platform/Project；CAD、资源、CAM | 列D01—D17真实数据版本、根与外部依赖的读写Owner；核对Project manifest/currentHeads与历史材料路径；交付actual-SHA接口清单和闭包风险表 | F1-01规格；关键required链没有“仅路径/仅名称/latest”后退出；审计只读 |
| F1-06-S02 | C0/C1 Owners；Project、NC、Solver | 建立每领域exact deps枚举与consumer capability策略、缓存失效；交付版本化DependencyEdge和ClosurePolicy提案 | S01；同一CAD被两用途引用的必选级别正确区分；未知kind fail-closed；reader兼容 |
| F1-06-S03 | 资源/几何Owner；Setup/Renderer | 审核几何与组件子件、typed材质/接口、显示网格和真实B-Rep用途；provider所需项与可选项的明确判定 | S02；显示可选与制造必需不混淆，孤儿子件不可冒充完整总成；不得伪造资产 |
| F1-06-S04 | Project/runtime；CAM/NC | 绑定generation和provider输出，准备一致切面；固定heads及重读hash、CAS引用锁；独立工作区并发测试 | S01/S02；人工交叉修改不产出混世代包；保留旧保存路径开关 |
| F1-06-S05 | Project/format；Contracts | 提供闭包报告与包内descriptor映射、digest/size/schema/required关系和版本化编码策略；保留旧TOC | S02/S04；跨语言fixture和有界读取通过；只新增schema minor/版本明确 |
| F1-06-S06 | Project/Reader；安全与业务Owners | 导入preflight：容器边界、路径遍历、digest、source/version/许可、闭包可满足性；诊断分项 | S05；必需缺失拒绝ready；仅可选缺失保留警告；绝不网络补档 |
| F1-06-S07 | Host/Project；GUI及存储Owner | 独立staging工作区、实际消费者hydrate、原子可见激活与提交回执、恢复日志与中断重放 | S06；运行时failpoint和旧工程继续可用；代码回退不能污染数据 |
| F1-06-S08 | 资源/CAM；Project维护者 | 老schema适配器、已发布Revision保留、存量未知引用只读/隔离迁移；迁移损失审计 | S05/S07；不把旧ID补成latest；无损与有损分支都有反例；旧Reader保留 |
| F1-06-S09 | GUI；项目和3D消费方 | 左侧单容器五任务恢复页、冲突修复、离线过滤、3D隔离预览、epoch和取消竞态；CLI命令复用Host | S06/S07；A/B、跨Setup切换旧回执不污染；禁第二3D世界 |
| F1-06-S10 | 独立QA；全部生产与消费Owner | 20项产品黄金/反向场景、Win11/WSL/Linux对照、无网络新进程、故障注入和备份回退；审计证据包 | S03—S09；精确HEAD/命令/环境/日志及差异0阻断才退出，CI不作为唯一门 |

实施次序S01→S02；S03/S04并行；S05→S06→S07；S08/S09在S06后推进；S10沿途建立，最后收敛。跨域依赖审查至少CAD+Resources+CAM+Project四方共同确认；机器执行/验证端只校验恢复输入绑定，不重新实现NC执行链。

## C. 关键输入输出与逻辑事务边界

- InspectOfflineClosure(projectRef,g,policyRevision)→ClosureReport(fingerprint,missing,conflict,stale,usageGates)；**只读**。
- ExportExactPackage(closureFingerprint,expectedGeneration,requestId)→PackageDescriptor(exportReceipt)；没有闭包资格不得导出“可生产”标签，可导出仅浏览受限包须清楚声明。
- PrepareOfflineRestore(pkgHash,targetWorkspaceRef,capabilities,expectedActiveEpoch)→RestorePlan(stagingRef,diagnostics)；不能变更当前工程。
- VerifyStagedRestore(stagingRef)→各消费端按实际schema的Resolved/Unknown/Blocked结果；只返回限域能力，不直接写Released。
- CommitOfflineRestore(verifiedPlanId,expectedActiveEpoch,requestId)→RestoreReceipt；唯一Host可见提交点，精确幂等。GetReceipt/RecoverJournal处理丢响应与进程重启。

上述为**拟议领域用例名称与合同草图**，不代表现有Tauri command或Rust方法已经实现。必须在S01根据真实实现对接并命名，GUI、CLI、Agent不得直连SQLite修改工程头。

## D. 数据与版本审查责任

| 数据范围 | 生产者 | 消费/闭包责任 |
|---|---|---|
| D01、D02 | CAD/PMI/特征Owner | 精确CAD几何、拓扑和识别来源，B-Rep与mesh用途分离 |
| D03 | Resources Owner | 机床/刀柄/夹具/材料/测量资源精确修订及子件；退役不自动使历史不可读 |
| D04、D10 | Setup与执行配置Owner | 毛坯、安装、机床执行配置独立根，帧/单位与选址不能重算为另一机床 |
| D05、D06、D07、D08 | Plan/Solver Owner | 被采用候选、局部去料状态、冻结关系；候选和批准状态不混淆 |
| D09、D11 | CAM/预验证Owner | 中立CL精确版本及限定级预检，不代替D12—D15 |
| D12、D13、D14、D15 | NC/解释/运动/验证各Owner | NC程序、控制器解释器版本、轴轨迹和验证证据按明确依赖收集；未知NC指令无通过 |
| D16、D17 | 发布/现场Owner | 仅在包声明的范围归档、审计；恢复不更改实际现场回执 |

字段Owner采用原表[17类映射](../../architecture/v0.8/C0-C1-reference-crosswalk.md)，不将表改成17个公共DTO。

## E. 测试入口与回退计划

当前在所读版本可见的既有组件是procet-project-runtime/format/store及procet-project-cli，**本轮没有执行**以下产品命令。实施时须按准确workspace核对并记录新HEAD，建议优先跑现有Project suite，再补F1-06聚焦测试：

~~~bash
# 待实施时由S01/S10对照实际仓库确认
cargo test -p procet-project-runtime
cargo test -p procet-project-format
cargo run -p procet-project-cli -- verify <经授权的测试工程.pct>
# 以下是计划新增测试名称，并非现存命令
# snapshot_closure_positive_and_negative
# staged_restore_crash_replay
# cross_provider_generation_consistency
~~~

回退分两层：①软件回退，保留旧Reader/旧schema适配和feature gate；②数据回退，旧工程文件及原Working Store不被新版本替换。对已commit的新工程只能通过新修订/新恢复事件反向处理，不反写旧批准事实。关键负向矩阵见[03](03-acceptance.md)。
