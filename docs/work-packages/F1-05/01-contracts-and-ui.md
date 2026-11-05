# F1-05／01｜受管求解接口、跨域数据与用户界面

状态：V0.1提案；以下DTO名称/字段为**待实施协议设计**，不可声称当前solver-sdk已导出相同类型。设计需由Solver/Host/CAM/Contracts Owner共同评审后才冻结C1。

## 1. 数据所有权和架构路径

CAD/PMI D01/D02 ——exact ref→ **Solver受管入口（SDK/CLI/Worker）** ←exact ref—— Setup D04

→ 可信环境/预算预检 → 冻结输入/执行身份 → D06搜索与候选 + D07材料变化（Solver唯一写方） → manifest/hash/独立Oracle/Checker → 资格投影（求解层） → Plan域显式采纳成为D05/D08（绝无自动批准） → CAM策略/CL D09 → 后处理NC D12 → NC解释D13 → 轴时序D14 → D15验证 → D16发布。

探索分支可以没有D05/D08及机床ExecutionBinding；若仅做几何结构探索，按该算法声明判定最低输入；材料演化须提供D04 Stock且校核与D01设计模型的frame关系。D07不由逐帧渲染生成，不做材料扫掠仿真。Host负责运行索引/授权/生命周期，不成为几何结果第二Owner；C0只定义精确引用/协议，不塞整个BRep状态。

## 2. 提议的SolverRunRequest v1（字段评审）

| 字段 | 类型/单位/来源 | 编辑/默认/门禁 |
|---|---|---|
| `requestId` | UUID/唯一幂等键；Host受理层 | 系统生成只读；重复调用查原receipt，不生成新业务run |
| `projectRef`与`workContextRef` | C0 exact domain/ref/revision，Host | 系统只读；不默认latest，切工程/Setup旧回执作废 |
| `designRef`、`geometryArtifacts[]` | D01 exact revision + SHA256原字节，CAD | 选择后只读，面/体实例路径由CAD真值提供；禁止仅用mesh |
| `stockRef`、`processSetupRef` | D04 exact revision、单位mm、局部Frame，04域 | 允许探索不填（仅对不要求Stock的能力）；材料变化能力必须填 |
| `frameRef`、`precisionMm` | C0 Frame精确身份，长度精度mm；依算法 | 明确来源，不依据3D相机矩阵猜测；校验finite/正数/作用域 |
| `protectedRefs[]`、`allowanceRefs[]` | D04/06冻结工件及SHA、长度mm | 可选取决于算法能力；缺必要时fail-closed |
| `algorithmId`、`profileRef` | Solver目录精确版本，native/independent/legacy | native生产默认只在部署完成后可选；旧Python只读不参加生产 |
| `budget` | Boolean调用数、最大内存MiB、CPU/墙钟ms、候选数、maxFeatures，Solver声明上下界 | 用户可调且只允许在声明范围内；总额度和局部额度不得错配 |
| `verificationPolicyRef` | Checker/Oracle/容差策略hash，Solver与安全审查 | 明确验证模式，不能默认所有候选都oracle-verified |
| `expectedInputRevision`与`approvalContext` | CAS、调用人/授权策略Ref，Host/领域 | 提交点重新校验；Agent的工具确认不代替正式批准 |

**运行与完成是两个身份：** `requestId` (调用)、`jobId` (计划排队)、`runRef` (不可变结果工件)、`acceptedPlanRevision` (另一领域人工决策)。允许同一请求因网络重试返回相同`jobId/runRef`，不允许把不同输入偷偷共用旧运行。

### 状态/错误（提议的业务投影而非已存在编码）

流程状态 `queued/running/cancelling/cancelled/timed_out/interrupted/completed/failed` 与**证明资格** `none/partial/unverified/geometry_checked/independent_oracle_checked`为**独立维度**。已完成只能说明worker终态；几何核验仍可能无法达到制造许可。所有未知状态必须显示`unknown`，不得默认`verified`。错误码例：`solver.profile_unavailable`、`solver.kernel_mismatch`、`solver.input_stale`、`solver.budget_exceeded`、`solver.manifest_mismatch`、`solver.verifier_incomplete`、`solver.request_conflict`、`solver.cancelled`，最终枚举需依现有SDK错误谱系协调。

**RunReceipt**建议字段：`requestId`、`jobId`、`workContextRef`、`frozenInputDigest`、`profileDigest`、`runRef`、`manifestDigest`、`runStatus`、`verificationLevel`、`evidenceRefs[]`、`diagnostics[]`、`commitGeneration`、`resolvedAt`。成功写入须是唯一Owner签发的持久回执；结果展示和平台通知只能消费该回执，不能以HTTP 202或exitCode=0宣称制造完成。

## 3. GUI左侧统一任务容器，主世界3D联动

沿用procet-gui唯一Babylon互动场景和UnifiedTaskPanel，宽度沿历史交互约定可鼠标调整，不创建旁侧第二3D viewer或第二引擎。活动步骤分为：

| 页签 | 业务动作和必须给出的状态 | 3D联动/禁止动作 |
|---|---|---|
| **1 输入与来源** | 选CAD/Stock/Setup；展示exact修订、单位mm、Frame、Hash和缺失说明；面/特征引用绑定状态 | 选择/高亮/预览不写任何D01/D04/D06；只在点击“采用输入”时经领域命令提交草稿 |
| **2 环境与预算** | 展示native生产或独立对照profile、加载OCCT版本与SHA、算法覆盖、1..5等真实上下限和可用性；验证策略 | 3D展示工作体/保护区只是投影；禁止从线框推断可达或认证 |
| **3 求解执行** | 排队/运行/取消/超时/终止/失败；阶段trace、预算已用/剩余；重复调用查询原requestId | 3D冻结输入与阶段材料状态按已落盘证据播放；未拿到工件不动画臆造结果 |
| **4 候选与证据** | 序列、before/removed/after、保护区、来源DAG、checker/Oracle、残差、unverified原因、适用边界 | 多对象同场联动“毛坯/目标/去料体/分步结果”；显示D07冻结mesh来源，可单步/切步/分透明层 |
| **5 采纳与交接** | 选择候选和工序影响范围；比较Plan、预览冻结冲突；明确提交方/审批要求 | “采纳”经05域命令产生新修订；不因为播放动画就发布CL/NC；机床运动另由NC解释验证模块完成 |

全程显示状态栏当前Project/ModelRevision/SetupRef/RunRef/Frame/Version和业务资格，不用悬浮警报遮挡零件。场景从“工程主3D”与“资源空间”横向切换，使用同一World/RendererPort。取消订阅、窗口切换、A/B接管，旧异步回执只能进入历史记录，不能改写当前视图或批准状态；关闭窗口后以持久回执恢复（server内存任务重启丢失属于明确限制，不假装恢复）。

## 4. 安全、版本、兼容与失败恢复

- 有明确输入所属Project/实例、Frame和Revision的前提下展示，绝不将另一个Setup同名几何静默对齐。
- OCI digest/size原则作为**设计类比**：对run_manifest中的每个声明文件重算字节Hash和长度，并检查内含相互引用与run/schema/kernel身份；这不是宣称run_manifest实现OCI格式。
- Host部署同时绑定solver SDK/CLI/worker版本、native OCCT 7.9.3的具体发行工件摘要和协议feature；`native-occt`开启只是构建声明，不等于运行动态库已匹配。
- HTTP同步/202排队/SSE状态仅作外层可观测性；当前server无鉴权和持久队列，不设想公网生产使用；工厂离线部署也必须由Host进行身份/权限/路径隔离。
- 回退不篡改历史Run：创建新的处理器路由修订，旧版本Run保持只读、不冒充新验证；失败则恢复经验证的旧能力（若旧能力资格更低，UI必须显示降级，不得无声替换）。