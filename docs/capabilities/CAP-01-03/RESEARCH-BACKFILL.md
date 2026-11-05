# CAP-01-03｜版本、变更与回退——研究证据回补及可实施设计修订

**状态：2026-10-18 本地编制待入库／设计待评审／产品未实现或未在本规划流程验收。** 本件补充已经计入17/88的[原0.9.1详细稿](https://github.com/BaiSongt/procet-devplans/blob/1d8019c77b49d301e494cae0b38ca241e07c82c9/docs/capabilities/batch01-v0.9.1/01_%E5%8A%9F%E8%83%BD%E8%A7%84%E6%A0%BC/CAP-01-03_%E7%89%88%E6%9C%AC%E3%80%81%E5%8F%98%E6%9B%B4%E4%B8%8E%E5%9B%9E%E9%80%80.md)，**不新增CAP编号，也不把L4提案冻结为契约**。详见[研究专题](../../../research/topics/R-REV-001.md)、[来源登记](../../../research/sources/CAP-01-03.json)、[机器追踪](../../../research/traces/CAP-01-03.json)和[20组验收规格](fixtures.json)。

## 一、真实业务目标与Owner

工程师要能回答四个问题：当前操作的是哪一版工程和哪一版领域对象？本次修改的业务含义是什么？会使哪些下游证据失效？如何恢复到历史内容而不抹掉已经批准、签发或现场发生的事实？

- **平台/Project Owner**唯一持有工程工作代数、保存代数、工程头变更/可见提交、文件格式和恢复协调；不自行发明CAD/PMI、CAM、NC的业务失效规则。
- **各领域Owner**持有自己对象的exact id、revision、schema、语义diff、依赖用途及有效性判据。D01、D03、D05、D08、D09、D10、D12、D13、D14、D15、D16分别由原V0.8 Owner管理，不能为版本页面集中复制成一个业务数据库。
- **审查者/授权人**决定对冻结、已批准或已发布成果的处置。工程师可恢复业务内容，但恢复本身不代表历史签发/控制器验证继续有效。
- **GUI/CLI/Agent**消费同一Host命令、查询和事件。GUI的3D选中、对照和恢复预览不构成领域写入。

## 二、主流程、替代流程与异常

**主流程**：①从工程标题修订徽标或“工作区与文档→版本与变更”进入左侧UnifiedTaskPanel；②固定`projectId`、`baseGeneration`、`targetGeneration`和被比较领域对象`ExactRef`，获取只读历史与变更来源；③各Owner分别返回带schemaVersion的语义差异（包括状态变化、资源几何精确工件、CAM参数和NC正文差异）及`known/unknown/unavailable`覆盖程度；④用带用途的依赖边分析影响，明确`recompute/reverify/retain/unknown`并锁定`ruleSetRevision`；⑤预览后，操作者选择处置并填写理由；⑥Host在真实提交点重新验证工程头、领域修订、评估哈希、许可及幂等键；⑦成功后显示新头和提交回执，旧结果保留历史可读。

**替代流程A（仅查看）**：读取历史头、两个版本的非破坏性3D轮廓预览和NC内容差异；不打开编辑会话、不写项目。历史资源缺失时展示`unknown`，不可用当前latest替代。

**替代流程B（恢复）**：从历史generation 3恢复其业务内容到当前generation 8以上的新generation；新提交中记录`restoredFrom`，不倒拨计数和时间，不静默复活历史批准、资源资格或签发程序。旧D16仍引用原D12字节，恢复流程只能生成新的工艺/NC候选版本。

**替代流程C（跨Schema）**：旧reader可读时允许历史只读；支持迁移时在隔离草稿上运行明确版本的迁移器并输出差异与回退入口；缺失必要字段/依赖则阻断转正，旧工程头不变。

**异常流程**：新请求在预览后与他人并发更新冲突，返回typed `stale_head`并保留草稿；领域DiffProvider不可用返回`coverage_unknown`而不是“无影响”；保存回执超时先按`requestId`查询记录，不盲重试；进程中断可能造成“`.pct`已替换而savedGeneration仍旧”的跨层分歧，必须识别及明确恢复，而非显示统一成功；旧scopeEpoch异步回执只进历史审计，不切换当前3D。

## 三、GUI与3D：一世界、左容器及字段级契约

统一左侧容器内设四个连续任务视图：`版本时间线`→`语义差异与依赖影响`→`恢复/迁移预览`→`提交回执与冲突处理`。主3D/资源3D为同一Babylon Engine/Scene里的空间投影切换，禁止为了“前后版本对比”再建一个可交互Scene；以轮廓叠影、显隐切换和颜色图例对比。显示网格仅用于定位，**不能由像素颜色或对象拾取推断CAD、PMI、NC是否仍有效**。

| 字段或状态 | 类型/单位及来源 | 编辑权限、默认与非法态 |
|---|---|---|
| `projectId` | C0精确身份／Project，只读 | 工程切换必须刷新scopeEpoch；不从显示路径推导ID |
| `currentHeadGeneration` | 非负整型代数／Host查询，只读 | 当前头与另存的`.pct` Header不是同一概念 |
| `savedGeneration` | 非负整型代数／Project保存结果，只读 | 可小于workingGeneration；不能仅用dirty布尔映射 |
| `compareBaseRef` / `compareTargetRef` | exact `(owner,kind,id,revision)`加必要`artifactHash/schemaVersion`／使用者选择 | 默认固定当前头与所选历史头；禁止`latest`漂移比较 |
| `semanticDifference` | 领域Owner提供的typed差异与`known/unknown`／只读 | raw JSON不同不是最终语义结论；缺Owner适配显示unknown |
| `impactDisposition` | `retain/recompute/reverify/unknown`及依赖用途／领域规则派生，只读预览 | 用户可选择处置提案，但不能把unknown强行标为valid |
| `ruleSetRevision`与`impactEvaluationHash` | 领域规则版本、输入精确集合摘要／服务端派生，只读 | 任一输入、规则版本或head变更须重新评估 |
| `expectedGeneration` / `expectedObjectRevision` | Host与领域最新返回／只读 | 提交时必须二次CAS，不自动覆盖并发 |
| `changeReason` | UTF-8文本／操作者输入 | 受控修改/恢复必填，空白拒绝；隐藏输入不算理由 |
| `restoreFrom` | 历史快照 exact ref／操作者选定 | 只能新增恢复来源关系，不得修改历史条目 |
| `requestId` / `scopeEpoch` | UUID/单调范围编号／Host和UI会话 | 同request重复必须查询回执；旧scope回执不激活 |
| `approvalValidity` | `valid/stale/unknown`／领域审批Owner，只读 | `unknown`不得显示绿色签发，旧批准证据仅历史只读 |
| `frameRef` | C0坐标系精确引用／所选CAD或Setup Owner，只读 | 只做版本比较标注，不能在3D对照时提交姿态变换 |

**3D交互**：单击对象=更新`SelectionIntent`；勾选“历史版本叠影”=取得有时效的`PreviewLease`；点“确认恢复”=弹出包含新旧头、影响集合、权限和冻结状态的最终确认框，并调用领域命令。点“取消”撤销EditSession中的未提交意图，不撤销已收到正式提交回执。暂停或关闭左面板时保留草稿和基线；退出工程前分别列出dirty草稿、后台运行与已成功但尚未展示的回执。宽度可以拖动，状态栏显示`工作代数/已保存代数/后台任务`三个独立信号；浅深主题统一。

**异步纪律**：所有查询带`projectId+scopeEpoch+exactHead`；显示`loading/empty/ready/dirty/readOnly/backendUnavailable/conflict/failed`真实状态；迟到响应只能写有界审计缓存，不改变当前模型/工程头。后台`JobRef`仅表示受理，不能替代`CommitReceipt`。

## 四、应用命令、输入/回执、事件及迁移

以下为**提案的逻辑命令而非已存在API声明**。Adapter需先审计现有ProjectService、SnapshotProvider、ModuleRegistry/ContributionHub和各Owner facade真实可用性，禁止另起第二Project/版本库。

| 逻辑能力 | 输入与必须的前置版本 | 输出与失败语义 | Owner |
|---|---|---|---|
| `Revision.queryHistory` / `revision.compare` | `projectId,base/target exactRefs,selectedScopes` | `RevisionTimeline`与各领域差异`known/unknown`；缺域可读历史但不可误报无影响 | Project聚合/领域DiffProvider |
| `Change.preview` | 变更意图、原头及领域revision、依赖用途、规则集revision | `ImpactSet`, `evaluationHash`, `expiry`, `unknownEdges`；未知影响阻断相关批准 | 领域影响规则／Host协调 |
| `Change.commit` | `requestId,changeReason,expectedGeneration,expectedRevisions,evaluationHash,authorizationContext` | 原子可见提交新head、每Owner领域回执；CAS冲突/权限变化/依赖失效拒绝 | Project提交协调+领域Owner |
| `Revision.restoreAsNew` | `restoreFrom`, `expectedGeneration`, reason,必要资源闭包 | 新generation、新来源边、批准`stale/unknown`；损坏snapshot不得改变旧头 | Project与各领域Owner |
| `Revision.inspectReceipt` | `requestId/projectId` | `pending/committed/failed/unknown`精确状态；断线重连不盲重复提交 | Host |
| `Migration.preview` | `fromSchema,toSchema, exactSource` | 隔离迁移报告、丢字段列表、回退定位；未知必需字段拒绝 | 迁移Owner |

建议事件：`engineering.change.committed`、`engineering.derivation.stale`、`engineering.restore.created`、`engineering.save.divergence_detected`。事件仅载指针/ID/哈希及有限元数据，不暴露私有文件原文。审批、冻结、发布是独立业务动作；A/B共享版本事实但不能静默覆盖已批准版本。

**失效方向实例**：D01设计或拓扑变化→检查D02制造特征/D04 Setup→D05/D08工艺确认→D09 CL→D12最终NC→D13解释→D14轴运动→D15验证→D16发布资格；并非每个字段都使所有阶段无条件过期。NC纯内容修改：D12新修订仅重验D13—D16，不反向把合法CAD/Plan标为无效。仅视图相机变化不改变制造引用；但真实工件碰撞体/精确几何发生变化须走Owner分析。D17现场反馈保持独立，只能经变更决策影响新修订。

**回退边界**：回退“数据内容”与回退“软件版本或reader”是不同操作。旧Schema仍可只读时保留升级兼容reader，迁移失败不替换可见工程；必要资源必须与具体历史ExactRef一致。软件回滚不能让已经新增的发布记录或现场结果被撤销。允许以后扩展分支/合并，MVP暂为线性工程头，不伪造自动语义合并。

## 五、基于指定源码版本的只读观察（非测试）

**来源限定**：`BaiSongt/procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`，不是对所有版本或生产环境的结论。

- `E-REV-01` `crates/procet-project-runtime/src/service.rs:249-287`：`save()`汇集当前注册provider，`save_as(project,path)`沿用已有Project UUID调用保存；生成独立fork不在所读`save_as`路径里。不要把保存文件路径变化视为新工程身份。
- `E-REV-02` 同文件`330-380`：`save_internal`先进行ReadOnly与路径锁校验，然后`bump_generation("save")`，再做SQLite Backup和manifest。工作代数的推进与“.pct完成保存”必须分别显示。
- `E-REV-03` 同文件`494-538`：存在`rename(tmp,path)`后正式文件终检与`BeforeConfirmSaved`故障注入，再`set_saved_generation()`的处理顺序。**风险待验证**：替换后若终检/确认失败，有可能外部文件已经替换而工作区savedGeneration未更新；源码头注释对“失败旧正式文件不动”的描述不能代替在此切口的故障注入证明。需要写明确恢复与幂等策略；不能直接断言产品发生数据丢失。
- `E-REV-04` 同文件`730-765`：首次挂载先用Online Backup导入`.pct`的metadata.sqlite，随后按正式Header重设savedGeneration；其他CAS与provider资源的完整闭包由F1-06覆盖，不能仅以Header校验等同跨存储一致性。
- `E-REV-05` `crates/procet-project-contracts/src/manifest.rs:35-105`：Manifest包括工程ID、savedGeneration、created/updated字段及模块兼容性；记录的代数不证明任意领域对象都满足新的发布资格。

只读源码线索用于提出测试边界，不构成改代码授权，也不能直接声明真实产品已PASS。

## 六、工程实施切口与原编号映射

| 原编号包 | 负责人角色/生产消费方 | 本CAP交付切口与准入/退出 | 测试状态与回退 |
|---|---|---|---|
| F1-01 | 契约Owner；产Host精确引用供各领域消费 | exact引用/generation/hash判等及版本范围；准入C0协议，退出Rust/TS跨语言fixture对拍 | 产品测试待实施，旧reader兼容窗口保留 |
| F1-06 | Host/Project Owner；CAD/资源/CAM离线消费者 | 原子可见保存与离线资源闭包；准入SnapshotProvider，退出完整故障注入/双版本恢复 | 现有ProjectService指定文件可复用；失败保留原快照、不得提升权限 |
| W2-03 | 领域Owner与工艺规划Owner；用户与下游NC消费 | 变更影响图/冻结失效传播、按用途差分；准入D01—D16依赖边，退出unknown fail-closed及D12→D16回归 | 未建新测试入口，禁止静默改Released |
| W2-04 | Project/平台Owner；GUI/CLI/Agent消费 | 恢复成新头、并发CAS、回执查询；准入F1-01与F1-06，退出跨重启和迟到回执负例 | typed命令待设计/评审；不得回拨旧generation |
| U4-04、T5-04 | GUI/验证Owner；工程师/审核员消费 | 四任务页面/3D版本切换/签发再验证；准入领域真实查询，退出GUI无第二Scene及操作回执映射 | 浏览器/Windows测试待建立；退回旧只读视图 |

以上仅关联原36项编号，不新增工作包或声称对应包已实施。初版领域规则、字段和命令仍须L3评审；L4未冻结。

## 七、研究和验收边界

来源索引按现有`research/source-index.json`枚举；**新增登记仅SRC-REV-001与SRC-REV-002，其余复用已有ID，不修改原`references.json`**。本专题依据[官方研究摘要](../../../research/topics/R-REV-001.md)建立[规则映射](../../../research/traces/CAP-01-03.json)和[20组正反例](fixtures.json)。Git的revert、HTTP If-Match、PROV Revision以及SQLite事务均是**设计类比或局部工程约束**，不能据此宣称Procet已经实现Git版本系统、HTTP ETag服务或跨库ACID；具体实现必须由Host与领域Owner经代码/故障注入核对。

**遗留冻结门禁**：跨进程同源工程多个头冲突策略、`BeforeConfirmSaved`故障注入实测、D01→D16真实依赖图与跨版本资源闭包、恢复审批资格的业务口径、已发布NC控制器执行语义均未由此次静态研究验证。20项验收规格均为`NOT_RUN_PRODUCT_TEST`。