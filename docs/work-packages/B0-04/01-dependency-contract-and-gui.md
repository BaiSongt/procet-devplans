# B0-04｜依赖闭包、Host领域接口与GUI/3D五任务

状态：拟议L3，待评审；不是已存在的产品Command或运行时打包器。母文：[B0-04](../B0-04.md)。

## 一、最小领域对象（版本化事实，统一01域登记）

`ReleaseConsumptionProfile { id, revision, hash, combinationLockRef, camSource, rootCargoLockRef, desktopCargoLockRef, pnpmLockRef, toolchainRef, platformTriple, features, overridePolicy, dependencyClosureRef, workerClosureRef, nativeClosureRef, approvalPolicyRef }`。`camSource.kind`分别为`git_exact`、`audited_source_archive`、`dev_override`。dev_override永远只能用于`development`，且必须记录dirty与来源hash；生产组合拒绝路径覆盖。前两种方案择一后需要独立验证Cargo真实解析闭包，不能同时宣称二者都已验证。

`BuildEvidence { attemptId, profileExactRef, sourceTreeDigest, manifestDigests, lockfileDigests, actualResolvedGraphDigest, targetTriple, toolchainDigest, environmentSnapshotRef, compilerInvocationRef, buildLogDigest, buildArtifacts[], status }`。`status=success`只表示该build attempt按标定范围完成，不意味着目标安装通过。

`InstallEvidence { bundleExactRef, targetTriple, offlineEnvironmentRef, nativeArtifactsMeasured[], workerArtifactsMeasured[], loaderDiagnostics, independentVerifierRef, status, unknowns[] }`。`status`可为`unknown|incomplete|verified_declared_scope|failed`；若Native真实字节、许可或协议无法核验，必须`unknown`而不是`verified_declared_scope`。不向公网上传本地文件路径、用户名、授权URL、客户模型或授权标准正文。`frameRef=not_applicable`，不引入机床坐标。

| 字段 | 来源/类型 | 默认与单位 | 可编辑/冻结 | 拒绝条件 |
|---|---|---|---|---|
| `combinationLockRef` | B0-01 exact Ref | 无默认 | 只读引入 | 仅字符串未关联版本/hash |
| `camSource` | 集成负责人选受管来源 | 无默认 | 草稿可改，提交后只读 | 发行profile出现`dev_override` |
| `overrideProfile` | 研发显式选择 | 默认none | 只在研发可改 | 没记dirty/hash或发布混用 |
| `rootCargoLockDigest` | 独立计算 | `sha256:`字节摘要 | 派生只读 | 为空或与预期不一致 |
| `tauriCargoLockDigest` | 独立计算 | `sha256:`字节摘要 | 派生只读 | 被root lock冒名 |
| `frontendClosure` | pnpm锁+store审计 | `unknown` | 派生只读 | 缺包仍判offline PASS |
| `nativeArtifacts[]` | Native Owner | SHA256 / ABI /路径 | 资源清单草稿可改，测量只读 | 目标平台/实物缺失 |
| `workerArtifacts[]` | Worker Owner | SHA256 /协议版本 | 同上 | 未知worker字节/协议 |
| `targetTriple` | 发布目标 | 需显式输入 | 发布审核后不可变 | 从机器名称猜测 |
| `commitReceipt` | Host领域提交 | 无默认 | 系统只读 | `routeEpoch`晚到或CAS冲突 |

## 二、GUI/CLI/Agent共同的命令—查询—事件—回执

拟议Command：`release.profile.createDraft`、`release.source.selectExact`、`release.override.recordDevOnly`、`release.closure.verify`、`release.buildEvidence.attach`、`release.installEvidence.attach`、`release.profile.submitForReview`、`release.profile.approve`、`release.profile.activateIfRevision`、`release.profile.retire`。所有状态变更走Host统一用例，不允许GUI直接写数据库或Agent取得独立批准捷径。

拟议Query：`release.profile.getExact`、`release.profile.diffLocks`、`release.closure.getUnknowns`、`release.evidence.findByArtifact`、`release.rollback.listApproved`、`release.capabilities.queryReadyScope`；Event：`ProfileDrafted`、`ClosureFailed`、`BuildEvidenceRecorded`、`InstallEvidenceRecorded`、`ApprovalRejected`、`ProfileActivated`、`RollbackActivated`。所有事件带`requestId`, `editSessionId`, `routeEpoch`, `actorRef`, `expectedRevision`, `effectRevision`, `hash`, `createdAt`，不可凭Accepted假造Committed。

回执严格分`Accepted`、`JobStarted`、`ValidationFailed`、`Validated`、`Committed`、`Conflict`、`Cancelled`、`StaleResultDiscarded`。成功提交必须精确回传新revision与artifactHash；未经人工批准或有unknown闭包时不发`Committed(active)`。`Cancelled`后再收到`Validated`时保留诊断归档但不更新活动组合；如果实际提交先完成，撤销只能通过新修订和独立回退，而非重写历史。

## 三、五任务UnifiedTaskPanel（仅一个左侧容器）

1. **来源选择**：显示B0-01研发HEAD、集成锁、运行未知；选择CAM `git_exact|audited_source_archive|dev_override`。若选择dev_override，醒目显示`仅研发`；源代码hash/dirty派生只读，不显示假的PASS。
2. **锁与差异**：同时比较GUI根Cargo、Tauri Cargo、pnpm三种锁以及当前consumer refs；按源/锁/目标平台分组，点击显示Inspector中的精确commit/hash/证据来源；缺独立workspace标unknown。
3. **闭包核对**：折叠树列`CAM source→transitive Rust→pnpm store→Native OCCT→Worker→Bundle`；未知组不会自动绿色。选择资源在唯一Babylon场景中展示只读依赖映射/适用状态，不加载第二个3D Scene。
4. **验收与证据**：按照真实目标平台展示`planned/not_run/pass/fail/unknown`，将构建成功、离线安装成功分开；高亮具体缺失证据，操作可重新发起授权范围内验证任务，但不得假造日志/工件。
5. **批准、激活与回退**：提交前逐项显示锁变更、Native/Worker目标、风险、权限与批准策略；审查者签署exact组合，CAS激活；回退菜单仅列仍有完整验证证据的旧组合，执行时生成新审计事件。

GUI空态显示可行动作“请提供真实Native工件/授权来源”；Network Offline不是获得新的生产资格。3D流程为选择→展示来源覆盖（只读）→在任务面板明确确认→Host检查→回执。Overlay/Preview失效时释放渲染租约，完全不写领域事实。深浅主题与键盘焦点满足统一UI原则，ESC只退出预览，不悄然撤销真实已提交操作。

## 四、发布与研发组合隔离/并发/回滚

具有合法`dev_override`的开发者仍可在已授权本地目录编译验证，但其源/依赖hash写入独立研发观察而不是发布锁。发布策略由`ReleaseConsumptionProfile`正向列出合法source kind；任何额外`[patch]`、`path`或编译器环境重写需要枚举审计，否则fail-closed。新版本与旧版本并发时采用expectedRevision CAS；同requestId幂等返回原Committed回执，重复调用不能生成第二个激活事件。

发布配置变更、原生ABI、Worker协议、Cargo feature、编译器版本、锁内容、安装包字节任何一项变化，都触发相关`BuildEvidence`/`InstallEvidence`失效并生成新的候选版本；不能静默复用既有批准。回滚到旧版必须同时恢复其精确锁、native和worker bundle，且复检授权有效性。这里仅设计机制，不执行产品或用户数据写入。

**验证状态声明：** 本文件是L3设计提案。真实Host领域命令、CAS并发测试、GUI行为与离线安装产品测试均为`NOT_RUN`；任何`Validated`或`Committed`仅用于描述未来回执设计，而非本次执行结果。