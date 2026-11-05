# CAP-03-08｜语义输出与溯源｜业务与接口详细规格

**规划日期：2026-10-19｜版本：V0.8编号不变、L3待评审｜状态：仅规划草案、产品 NOT_RUN**

## 0. 与V0.8严格对齐

原始三级候选是“语义输出与溯源”，业务定义为**特征/PMI到原CAD实体的证据链**，关联原编号`B0-02 / F1-03 / F1-04 / T5-02`。不创设新的第12域或D18数据包，也不修改原始11域、88 CAP、36包和17类资产的分母。03域唯一负责D01受控设计源及D02正式制造特征语义包的写入；06域识别算法只产候选及证据，05域通过精确引用消费，08/09/10域不借此取得控制器、机床验证或NC发布资格。

**核心判定：输出成功 ≠ 覆盖完整 ≠ 工程审定 ≠ 工艺冻结 ≠ NC验证。** W3C PROV-DM支持对实体、活动、责任方、派生与修订的表达，但并不为Procet规定“工艺批准”的业务门禁；后者是内部设计决策，需Owner和人类审批。

## 1. 用户角色与八项业务子能力

| 子能力 | 主责角色 | 目标、结果及边界 |
|---|---|---|
| 03-08-A 溯源包构建 | CAD/PMI领域工程师 | 从D01、D02及候选/人工编辑日志构成可复查语义包；无源不作实证结论 |
| 03-08-B 语义与视觉分层 | PMI解释人员 | 记录semantic PMI、graphical-only与unknown，图形可显示不等于尺寸/基准语义成立 |
| 03-08-C 几何精确定位 | 几何工程师 | 每项feature指向exact B-Rep及实例路径、拓扑版本、Frame；mesh/faceIndex只作视图线索 |
| 03-08-D 来源谱系 | 领域架构师 | 记录输入实体→活动→输出实体→操作者/算法身份、split/merge/derivedFrom、失败原因 |
| 03-08-E 覆盖与诊断 | 特征识别分析员 | 公开recognized/skipped/unsupported/ambiguous/unbound计数及限定分母，不假报100% |
| 03-08-F 证据导航 | 工艺工程师/质量工程师 | 沿特征→PMI→CAD原件和逆向CAD→依赖特征查询，查无证据则unknown |
| 03-08-G 原子采纳与增量更新 | 项目负责人 | 确认候选、提交D02修订、失效传播；不替代D08冻结或D16审批 |
| 03-08-H 导出、恢复与兼容 | 维护人员 | 离线保留源码快照、证据清单和历史schema reader；坏链禁止被静默修复 |

**唯一Owner：** 03域的D01/D02领域服务负责`SemanticEvidencePackage`版本和其接受状态；Host/Project负责持久事务、幂等与权限重验；`RendererPort`负责3D投影；研究端与Solver只提供候选不可直接写D02。各部门可以附加复核意见，但不产生第二份“真特征表”。

## 2. 主路径、替代路径与异常路径

**主路径 P1：** 打开exact工程与D01 revision → 读取已确认D02/PMI与几何证据 → 检查sourceHash、TopologySnapshotRef、occurrencePath、units、frame → 生成`draftEvidencePackage`（附每项覆盖证据及缺口）→ 五任务面板审查 → 3D高亮仅生成selection intent → 人工“确认采用”调用03域命令 → 服务提交点再次校验revision、权限、内容闭包和schema → 成功回执含新D02 revision/hash及版本化谱系 → 05域收到`SemanticPackageCommitted`后按引用消费。

**替代 P2：** 模型可查看而PMI仅图形层：保留3D及图形PMI展示，状态`graphical_only`，受控PMI要求字段仍`unknown`；允许保存草稿/分析报告，不得批准完整语义包。**替代 P3：** Solver输出多种相互矛盾候选：保留原候选及证据并列，以人工冲突决议形成新D02 revision；永不直接更改求解器历史Run工件。**替代 P4：** 同一CAD定义多装配实例：同源形状可复用内容指纹，但输出必须分别携带`occurrencePath`及局部/实例Frame，不能无条件跨实例继承尺寸解释。

**异常 E1：** 源模型hash或拓扑snapshot漂移：停止采纳，标`stale`并提供旧版只读对照。**E2：** 旧Face编号映射一对多、零或多父冲突：标`ambiguous_mapping`，需选择具体几何来源/人工复核。**E3：** 异步取消：客户端更新`scopeEpoch`并记录cancel，服务若已提交，以`commitReceipt`和revision为准，不能因UI取消抹除真实提交。**E4：** 网络/Worker断线：用`requestId`查询提交回执；同一requestId+同一payload幂等，相同ID不同payload冲突拒绝。**E5：** 审批许可过期、权限撤回：提交点拒绝且返回权限错误码，不把按钮enabled或能力advertised当授权。**E6：** 引用的CAS原件、XDE、PMI或历史模型缺失：离线展示降级并标缺失链，禁止导出`fully_verified`。

## 3. 版本化语义包与字段责任

> 下表为拟议C1内容接口，**不是冻结的产品DTO**。C0只复用身份、单位、Frame、修订、协议；不在common层统一所有领域数据。数值未标单位绝不默认mm或deg。

| 字段 | 类型/单位 | 来源与Owner | 默认/编辑权/失败行为 |
|---|---|---|---|
| `packageRef` | id、revision(u64)、sha256(hex) | 03域分配 | 只读；空或格式错拒绝；每修订不可变 |
| `sourceCadRef` | D01 exact id/rev/hash | 03域D01快照 | 必填只读；哈希不一致=>STALE_SOURCE |
| `occurrencePath` | 装配实例路径数组 | D01装配解释 | 必填（单件可空根路径），只读；不得因相同shapeHash合并实例 |
| `topologySnapshotRef` | id/rev/sourceHash/OCCT profile | D01几何快照 | 必填只读；未定位=>UNKNOWN_TOPOLOGY |
| `geometryRefs[]` | {kind,partIndex,localIndex,topologyId} | 03域精确几何解析 | 只读证据；只存face:N不得跨revision重用 |
| `frameRef` | Frame id/rev/变换链 | 03域调用C0 Frame | 必填只读；handedness/单位不明=>UNKNOWN_FRAME |
| `dimensionalEvidence` | {value,unit,sourcePmiRef} | D01 PMI语义解释 | 保留源单位，展示换算为只读；空值=>UNKNOWN，不设无依据默认 |
| `featureSemanticRef` | D02 id/rev/status | 03域正式Owner | 候选单独命名空间；未批准不得伪装approved |
| `pmiCoverage` | {level,parsed,total,unbound,unsupported} | 03域解释器 | 派生只读；分母仅已识别条目，不作全源完整率 |
| `recognitionCoverage` | {recognized,skipped,ambiguous,scope} | 06域候选记录+03域复核 | 只读；候选Run Solved不等于完整覆盖 |
| `provenanceGraph` | nodes/edges/role/algorithmRev/inputRefs | 03域谱系投影 | 只读；修订派生图不得循环；缺来源=>INCOMPLETE |
| `reviewDecision` | actor/decision/policyRef/time | 03域确认者 | 仅受许可的领域命令写入，未审默认pending |
| `producerProfile` | repo SHA/OCCT版本/算法/参数hash | 产生证据的算法方 | 只读，缺失=>UNVERIFIED_PRODUCER |
| `resultCoverage` | complete/partial/unknown | 03域聚合结果 | 派生只读；未知永不自动升格完整 |
| `scopeEpoch` | u64 | Host作用域 | 写命令和UI互锁；过期晚回执只保存其真实所属scope |
| `expectedRevision` | u64 | 编辑会话读取值 | 必填；冲突使用CAS拒绝，不自动覆盖 |
| `commitReceipt` | requestId/newRev/newHash/decision | Host提交点 | 成功回执产生后才更新工作区域真值 |

**身份元组：** 对可制造语义，一项引用至少绑定`(projectId, documentId, modelId, modelRevision, sourceHash, topologySnapshotId, occurrencePath, frameRef, featureId, featureRevision)`，引用指向不可变修订，另附`schemaVersion`与`producerProfile`。展示网格的pickId不是此元组的代用品。版本迁移必须显式建立oldRef→newRef多值映射，歧义不自动定案。

## 4. C1接口草案：GUI、CLI、Agent同一领域用例

| 类型 | 名称 | 要求及错误语义 |
|---|---|---|
| Query | `QuerySemanticEvidence(sourceCadRef, featureRef?, exactRev)` | 返回scope内快照、正反向来源链及缺口，不返回权限范围外源字节 |
| Query | `QueryEvidenceCoverage(packageRef)` | 返回分母、数据级别、missing/unsupported/ambiguous数组 |
| Query | `GetCommitReceipt(requestId, scope)` | 返回`COMMITTED/REJECTED/PENDING/UNKNOWN`，不得以超时推断未提交 |
| Command | `BuildSemanticEvidenceDraft(sourceCadRef, candidateRefs, requestId)` | 异步创建草稿，返回JobRef；JobRef不是提交回执 |
| Command | `ResolveSemanticAmbiguity(draftRef, selection, expectedRevision, requestId)` | 人工提交具体拓扑/PMI选择理由，冲突必须显式记录 |
| Command | `CommitSemanticPackage(draftRef, expectedRevision, expectedSourceHash, actor, policyRef, requestId, scopeEpoch)` | Host许可和03域数据完整性在提交点重检；CAS/幂等；成功新D02 ref与receipt |
| Event | `SemanticEvidenceDrafted` / `SemanticPackageCommitted` / `SemanticPackageStale` | 事件带exact ref/producer/变更原因，消费者按需重读而不信任缓存事件为真值 |
| Receipt | `ACCEPTED_DRAFT`, `COMMITTED`, `REVISION_CONFLICT`, `SOURCE_DRIFT`, `MISSING_EVIDENCE`, `UNAUTHORIZED`, `UNKNOWN_RESULT` | 枚举并保留原requestId；UNKNOWN_RESULT只能查询补偿，不可自动重投不同载荷 |

`Build...`与`Commit...`是**规划级命名**，未声称仓库中已有该API。GUI、CLI及Agent调用同一Host→03领域命令，不允许Agent另写SQLite，也不让RendererPort写领域对象。对离线Agent，工具级确认与03域批准、D08工艺冻结、D16 NC发布审批分离。

## 5. 下游消费、失效传播与迁移

- **D01更新：** D02语义包按exact sourceHash判为`stale`，保存旧版可追溯，03域决定是否重新解释；不会因为下游已读而隐式重写D05/D08。
- **D02确认：** 05域按exact packageRef消费，06域仍可独立生成新候选；采纳时必须明确人工既有决定的优先范围，不可覆盖冻结D08。
- **PMI版本升级：** graphical-only不能自动提升semantic；缺失公差不自动输入加工参数，版本差异生成lossReport。
- **拓扑修补：** 只在有可信历史关系的场景重绑定；分裂/合并、歧义或来源缺失时触发人工复核。树投影仅方便展示，不等于完整DAG。
- **schema升级：** 新读写器以revisioned additive format演进，旧v1工件只读兼容；禁止原地覆盖。导入历史`manufacturing-features-v1`需隔离其旧semanticId/face:N语义、诊断跳过信息。
- **离线包：** 需CAD原件CAS、topology、PMI、feature revision、算法配置、审查记录、哈希表的最小闭包；缺件返回`partial_restorable`与逐项缺失清单，不称完整恢复。
- **回退：** 功能开关只回退新读写路径，旧案保留历史指纹与只读报告；已提交D02不删除，正确回退是新修订及显式reverse provenance。

跨域不得暗中推进D09/12/13/14/15/16：中立CL→真实后处理NC→控制器语义→轴运动→验证→发布是独立业务链。本CAP提供的3D高亮与证据不证明NC控制器验证成功；不引入材料扫掠仿真。

## 6. 源码复用、实际缺口与验收定位

只读核对**固定仓库SHA，不代表产品实测**：

1. `procet-solver@44172bc046bfd65c2a4fe36212536c70226be48f`的`crates/solver-feature/src/artifact.rs`已有`ManufacturingFeaturesArtifact(schema=manufacturing-features-v1)`，携带semanticId、primary/floor/wall/blend geometry refs、confidence、evidence和diagnostics；但这些只是算法工件，不具D01 exact装配实例、Owner提交回执或正式D02批准语义。
2. 同仓`crates/solver-feature/src/mapping/mod.rs`明确openSides缺失的open_pocket会跳过并写工件级CAM-3301，而Run可继续。故`run=Solved`不能说明每个识别候选均语义完整。
3. `procet-cam@fcec1c86047e6b11be35b8bb38971e3dfcffbd7b`的`src/pmi/geometry_locator.rs`有exact topology ID解析、歧义显式错误和现有字节格式兼容合同，可复用；其`src/ports/pmi.rs`的`UnboundPmiPort`仍返回`MissingProvider`，不得绕开走legacy副本“凑成功”。
4. `procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`的`CamViewportFeatureTree.tsx`只是呈现/选择回调，自己不改变feature approval。GUI对证据查询、3D overlay、工作区回执和Host持久化仍需真实接线审计。
5. 06域`solver-removal/src/provenance.rs`有hash DAG逻辑，模块注释明确哈希仅识别来源而非几何等价/独立认证。**不得**把材料状态D07的provenance直接当D01→D02制造特征语义来源图，两条谱系可引用但归不同Owner。

源码差距作为`OPEN_IMPLEMENTATION_GAP`，L3待审，不因存在trait、演示数据或工具源码即认为可生产使用。建议产品测试入口由F1-03/T5-02验收负责人在冻结产品组合后建立：`TODO_TEST_ENTRY:SemanticEvidenceOwnerCAS`、`TODO_TEST_ENTRY:SemanticEvidenceReplay`、`TODO_TEST_ENTRY:GUI_SCOPE_LATE_RECEIPT`；本轮仅对本规划数据执行静态测试。

## 7. 十条规范性内部设计规则与正反验收

规则和字段、来源、20条可机器读场景见[追踪JSON](../../../research/traces/CAP-03-08.json)及[fixtures](fixtures.json)；研究依据和阅读边界见[R-SEM-001](../../../research/topics/R-SEM-001.md)。这里“规范性”只指本项目的**待审设计规则**，不是外部标准的强制条文。

| 规则 | 关键约束 | 对应正/反验收 |
|---|---|---|
| SEM-R01 | D01、D02与Solver候选、PMI展示分开，不自动提升资格 | T01/T02 |
| SEM-R02 | exact CAD/装配实例/Frame/拓扑快照引用不可缺 | T03/T04 |
| SEM-R03 | split/merge拓扑歧义与缺件必须fail-visible | T05/T06 |
| SEM-R04 | graphical PMI、semantic PMI与未读取内容明确分层 | T07/T08 |
| SEM-R05 | 版本化Entity/Activity/Agent修订派生无环、审查主体可证 | T09/T10 |
| SEM-R06 | 覆盖分母与跳过/未知项公示，不以Solved声明全覆盖 | T11/T12 |
| SEM-R07 | 来源查询只读受授权、跨域反向检索保留scope | T13/T14 |
| SEM-R08 | 下游按exact D02消费，变更冻结需重评，绝不偷写D08 | T15/T16 |
| SEM-R09 | CAS/幂等/迟到回执/取消与权限重验统一Host领域路径 | T17/T18 |
| SEM-R10 | 离线证据闭包、版本兼容与回退不得抹除历史 | T19/T20 |

**验收状态：** 本CAP所有产品20例`NOT_RUN`，人工L3评审`PENDING`；规划自测仅检查JSON字段/追踪/链接/故意错误注入，无任何产品Rust/OCCT/GUI/NC验证。产品确认必须在指定exact-HEAD/离线安装组合上实际执行。