# CAP-01-01｜项目与工程空间：逐条研究补证与工程验收扩展

**2026-10-18｜对历史第01批0.9.1规格的增量补证；业务规格已编制/待评审，产品验收NOT_RUN。**

原规格（远端现有）：`docs/capabilities/batch01-v0.9.1/01_功能规格/CAP-01-01_项目与工程空间.md`。本文件不替换原8个AT场景、不增设88之外的CAP编号；只明确真实证据、接口适配差距和12个独立反例。参阅[研究专题](../../../research/topics/R-PROJ-001.md)、[机器追踪](../../../research/traces/CAP-01-01.json)、[合成场景](fixtures.json)。

## 1. 业务入口、角色与许可

用户：工艺工程师创建/保存/打开工程，工程负责人审核复制、另存与归档，Host/Project Owner维护事务、文件权限及模块兼容；CAD/Resources/CAM/NC是领域内容生产者/消费者，不将其数据移交Project为第二份权威。入口是ActivityRail「工作区与文档」→工程，统一左侧TaskPanel，单个Babylon 3D场景仅展示当前项目有效投影。GUI/CLI/Agent调用同一个Project应用命令，用户身份和写权限由Host获取；项目名可重名、不作为主键。

**主流程**：创建ID→导入/引用D01与其他领域结果→域Owner按exact修订枚举必需/可选资源→保存前预检及冻结→同代数manifest/.pct校验→Host确认保存回执→关闭和离线重开→隔离验证、再激活。

**替代流程**：无CAD模型也可创建空项目；缺可选UI模块只隔离显示；旧版本仅支持只读诊断/有版本的迁移器；想要独立派生工程必须显式fork，不用单纯save_as暗中生成新身份。

**异常流程**：权限撤销、两次保存冲突、文件损坏、跨库资源版本漂移、hash错配、磁盘故障、任务取消后晚到回执、工程P1→P2切换、装载中途失败。任何异常都不能污染旧active project或静默覆盖冻结成果。

## 2. 字段与所有权（语义键均是设计字段，不伪装已实现Wire）

| 字段／单位 | 来源与唯一Owner | 编辑和默认策略 | 失败后状态及用途 |
|---|---|---|---|
| `projectId`／UUID | Project Host | 新建生成，只读；路径/名称不是缺省ID | 冲突不得换一个ID继续写 |
| `displayName`／UTF-8文本 | Project Host | 创建时填写、可修改；可重名 | 空名/超长按Host限制反馈 |
| `locationHandle`／受权文件句柄 | Host文件访问 | 显式选择，原路径只作为可选显示来源 | 不自动要求机器另一位置仍有同路径 |
| `expectedGeneration`／无量纲非负整数 | Project Host | 基于查询只读快照派生；写请求必须带精确预期 | 不一致返回冲突，不重试覆盖 |
| `savedGeneration`／无量纲非负整数 | Project Manifest | 从正式持久化回执读取，只读 | 失败不能展示“已保存” |
| `currentHeads[]`／ExactRef + SHA-256 | Project清单写入；领域Owner产工件 | 后端派生，不手动拼“最新” | hash错配则阻断对应用途 |
| `moduleCompatibility.required/optional`／集合 | Project Manifest/各Owner | 保存/恢复需要保真；未知必需标unknown/阻断 | 不因一次save丢失约束 |
| `dependencyUse`／required/optional/unknown | 各领域Owner声明，F1-06汇总 | 只对明确消费任务决策；unknown不可当optional | 影响保存闭包和打开资格 |
| `forkOf`／可空来源引用 | Project Host + provenance | 仅显式fork时写，新ID、保留来源 | 不继承原工程的生产批准 |
| `activeContext`／文档/Setup/任务引用 | Host Session | 可恢复会话偏好，无工程业务默认修改 | 切Setup不改制造修订 |
| `scopeEpoch`／单调会话代次 | Host运行态 | 由工程切换生成、只读给前端 | 晚回执不更新新项目 |
| `requestId/receipt`／幂等标识和终态 | Project应用服务 | 服务端登记、超时先查原结果 | 不凭客户端超时创建第二提交 |

涉及D01 CAD来源、D03资源、D04 Setup、D05/D08规划/冻结，由各自Owner持有真实内容。Project只写项目引用、模块要求、可见头/receipt；不可用`projectId`跨域直连私表。`frame`属于几何及Setup的exact DomainRef事实，Project记录引用并保留，不能因空间切换默认为单位变换。L3/字段名字待Owner评审，L4不冻结。

## 3. 页面与3D操作状态

| 页面/状态 | 输入与投影 | 预览/确认边界 | 取消/恢复处理 |
|---|---|---|---|
| 新建/最近工程 | 名称、位置与模板引用；背景保持旧Project投影 | 工程卡选中仅预览，不主动open | 取消不创建半项目 |
| 工程概览 | 当前ID、g/saved g、dirty与工作对象目录 | 点击Setup只改session选择，不重跑特征/制造判断 | 迟到旧scopeEpoch拒绝投影 |
| 保存检查 | 各领域exact头、required闭包、磁盘目标 | 预检只读，不提交；确认后Project唯一提交点重验 | 保存失败保留上次可读文件和dirty |
| 打开预检 | 完整性/模块/reader资格分项，3D不更改项目事实 | 先stage，再激活；无效候选只读诊断 | 主工程保持，取消的stage回收 |
| 另存与派生 | 区分Save copy path和Fork project ID的明确动作 | fork来源和批准资格提示二次确认 | 接管失败不产生可见P2批准 |
| 关闭工作区 | dirty、长期任务及其他项目状态 | 关闭面板≠取消后台任务 | 只影响选中Project作用域，不杀其他项目任务 |

一个Babylon互动Scene，主/资源空间横向切换。3D拾取→SelectionIntent，预览→PreviewLease，只有经Project/各领域应用服务明确命令才写业务；GUI主题仅浅/深。没有后台能力时显示不可用原因，不给虚假成功按钮。

## 4. 命令、事件、回执（目标逻辑口，非虚构现存接口）

- Query `project.inspect/open_preflight`, `project.list`, `project.current_heads`, `project.request_receipt`：返回`projectId, activeGeneration, savedGeneration, compatibility, capabilityReady, scopeEpoch`；查询不提升批准级别。
- Command `project.create`, `project.save(expectedGeneration,requestId)`, `project.save_as_path`, `project.fork(sourceExactRef, newTarget, requestId)`, `project.open(stageToken,expectedScopeEpoch)`, `project.close(decision)`：同一Host写入校验，actor来自session，domain内容保持Owner权威。
- Event `project.saved`、`project.save_failed`、`project.head_committed`、`project.open_preflight_failed`、`project.activated`：带requestId、projectId、generation、source hash；事件可重放，不是持久化确认的唯一真值。
- Receipt `COMMITTED / REJECTED / CONFLICT / UNKNOWN`：`UNKNOWN`需要先查询requestId再确定是否重试；能力注册≠handler就绪≠当次授权≠提交成功。

当前源码复用项：`ProjectService::save/save_as/open_and_mount/close_project`、`Manifest`、`ProjectSnapshotProvider`、CAS/Working Store、真实路径锁与故障注入。差距：`save_as`不见新ID，需区分fork；是否具备稳定业务层expectedGeneration/request receipt须核实；provider required语义须做独立消费者矩阵；跨域激活需故障证据。不可不经审查另建Project或重写既有保存协议。

## 5. 10条规则与正反验收映射

| 规则 | 源/判断依据 | 关键字段 | 对应正反例 |
|---|---|---|---|
| PROJ-R01身份分离 | PROV-DM类比+Project领域策略 | projectId/displayName/locationHandle | AT05、AT09 |
| PROJ-R02精确根与来源 | PROV-O/RFC8785边界+内部领域引用 | currentHeads、artifactHash、sourceRefs | AT01、AT10、AT20 |
| PROJ-R03提交CAS与回执 | SQLite事务定义+内部乐观并发 | expectedGeneration、requestId、receipt | AT03、AT11 |
| PROJ-R04一致DB快照≠跨域闭包 | SQLite Backup/WAL | snapshotGeneration、snapshotRef | AT01、AT12 |
| PROJ-R05文件提交与旧版本保护 | SQLite Atomic Commit/How To Corrupt；OS行为待实测 | tmpRef、lastSavedGeneration | AT04、AT13 |
| PROJ-R06隔离恢复后激活 | SQLite backup约束+Host策略 | stageToken、scopeEpoch、activeProject | AT02、AT14、AT15 |
| PROJ-R07必要性按用途定义 | 各领域Owner决策+F1-06闭包 | requiredModules、dependencyUse | AT08、AT16、AT17 |
| PROJ-R08fork不复用原批准 | PROV-O/PROV-DM+项目政策 | forkOf、newProjectId、approvalRefs | AT05、AT18 |
| PROJ-R09会话≠业务世代 | Host Session策略 | activeContext、generation | AT07、AT19 |
| PROJ-R10取消/晚回执/其他项目隔离 | Host业务幂等策略 | scopeEpoch、requestId、projectId | AT06、AT15、AT19 |

`AT01...AT08`是原已存在规格；`AT09...AT20`是本轮新增**验收规格**（全部NOT_RUN），详见[合成场景](fixtures.json)。单纯检验JSON条数不是执行产品测试。F1-01提供精确引用，F1-06承接资源闭包/故障恢复，W2-04承担多Setup上下文，U4-01承担左侧统一入口，B0-01承担任务及角色交接。

## 6. 迁移、版本与回退

既有`.pct`必须保留原ID、manifest hash、module compatibility和明确版本；更换阅读器采用受控迁移只读preview→比较→新副本→提交，不覆盖旧批准。跨工程复制需新ProjectId和来源边，不以文件重命名完成派生。失败时保留最后一个已回读验证的正式工程；后台未采纳域工件保留来源但不推进项目head；历史代码未支持的逻辑命令均归项目Owner设计/测试待实现。

### 待确认评审门

由Host Owner确定真实命令/事务边界；领域Producer/Consumer确认required子资产与Frame/Approval依赖；独立测试Owner在Windows/Linux/离线盘进行故障注入；GUI Owner验证单世界与旧scope抑制。未解决之前只能标记`drafted_pending_review`，不宣布产品ready或批准。