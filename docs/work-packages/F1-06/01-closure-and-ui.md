# F1-06｜01 闭包判定、数据契约与界面

状态：评审用设计规格，不是已有产品接口。理论与来源：[R-SNAP-001](../../../research/topics/R-SNAP-001.md)。

## A. 资产分类：对象、字节和消费资格分别表述

跨域边界至少包括下表的概念，不把它们添加到一张不可维护的公共common大表：

| 概念 | 谁拥有 | 必需信息与不可推论 |
|---|---|---|
| RootRef | Project/域用例共同确定 | projectId、generation、domain/kind/id/exactRevision、expectedHash、用途；root是确切引用不是latest |
| DomainDependencyEdge | 唯一领域Owner | from→to、requirement (required/optional)、reason、consumerCapability、policyRevision；决定依赖边而非“资源kind全部必需” |
| ArtifactDescriptor | 不可变字节生产者 | hash算法/字节摘要、size、mediaType、schemaVersion、source/owner、稳定逻辑路径；引用不代表已经能被正确解释 |
| ClosureReport | Project协调器 | root与依赖统计、缺失/冲突/未知、能力分项状态、闭包指纹、generation、审计/补救建议 |
| RestorePlan | Host工作用例 | source package exact hash、targetWorkspaceId、expectedActiveProjectEpoch、请求幂等key、隔离恢复目标、权限 |
| RestoreReceipt | Host唯一提交点 | package hash、事务ID、commitGeneration、activatedProjectRevision、恢复结果、未支持能力与审计，不由前端拼造 |

当前C0接口如字段不支持需由F1-01 owner评审，F1-06只提出C1 edge/receipt扩展，**不是现在已经发布的DTO**。不同语言的同义字段有明确版本适配；hash是字节级绑定，revision是领域版本，checksum验证不赋予工程资格。

## B. 闭包算法（设计伪码与前置条件）

设冻结时间切面g，根集合R(g)由已选工程头、必须恢复的文档和领域Owner确认的附带根组成；E(g)是从exact版本工件出发的有向引用。对每一条边记录required、目的与能力政策：

~~~text
closure := empty map by (domain,kind,id,revision,hash)
queue := sorted verified RootRef(g)
while queue not empty:
  e := pop(queue)
  assert exact-ref immutable and owner known
  descriptor := ResolveExact(e, frozenGeneration=g)
  if descriptor missing/invalid:
      record missing/invalid with edge chain
      if incoming dependency is required: block its consumer capability
      else: mark optional projection degraded
      continue
  if same exact identity already mapped to another hash:
      record conflict and fail-closed
  verify actual bytes size/digest + schema identity + path policy
  for dep in owner.EnumerateExactDependencies(e, g):
      queue.add(dep.target, provenance=dep)
  add descriptor and dependency chain
if any required edge unresolved / unknown critical schema:
    block relevant capability / export-ready / write activation
else:
    issue immutable closure report with fingerprints
~~~

“required”属于**消费能力+依赖边**。例如渲染LOD可以optional，但实际生产Setup引用的精确工件和已批准机床运动验证的原始程序可能required；同一子件对不同消费者可以有不同资格。缺optional不能导致数据根的静默丢失，仍须保留原引用和不可用原因。环状来源依赖应审查并拒绝不支持的业务来源环；数据中可以有有意的双向导航链接，须标非闭包依赖。

**算法复杂度**为O(|V|+|E|)加验证字节O(B)，但不能因此推断内存零复制；资源和嵌套包须按配额做流式验证，防压缩炸弹和路径逃逸。闭包包含资源子件装配链、精确几何与使用该来源的制造方案、数据属性版本和必要的插件/解释器版本；不要求在包内嵌入有版权限制的外部设备手册，缺少这类必要批准证据时只说明不可制造就绪。

## C. 同一时间切面与快照边界

SQLite Backup API可为**单数据库**提供一致副本；不能自动保证多个领域DB、CAS、后台Worker产物和用户切换后得到同一切面。Procet设计：获取Project generation/头指纹→暂停或版本锁定各Owner引用集合→备份DB和读取CAS→复检generation/依赖指纹，任一不一致取消并重试有限次数。长时读取允许继续写入新的工作区代数，但保存点必须固定且所有写入有版本归属。

Provider snapshot记录的required目前可见统一写false（E-SNAP-01）；此字段必须审查是“模块可缺省”还是“领域工件对某用例可缺省”。补正确分类之前**不通过提升manifest required_modules或将所有provider全部设true粗暴修复**：需要由Owner生成消费能力限定的依赖清单，保存协调器检查二者一致。

## D. 五态离线恢复界面（无第二个世界）

入口：文件→打开工程→检查与恢复；或Setup资源选择→“缺少精确资源，打开修复”。ActivityRail和左侧统一任务容器投影以下五个任务页，不创建并行Babylon世界：①工程与包版本、只读原因；②资产闭包与冲突（按D01—D17过滤）；③兼容性与迁移影响；④隔离恢复进度与取消；⑤验证回执与激活。

| UI字段 | 必填/读写 | 来源、单位/含义及防误操作 |
|---|---|---|
| packageHash、projectId、savedGeneration | 派生只读 | Reader、Project manifest；不得在GUI重写 |
| restoreScope / targetWorkspace | 必填候选 | Host选择；禁止推断为当前工程uuid可覆盖 |
| referencedRevision / artifactHash / byteSize | 只读 | exact DomainRef+Descriptor；字节而非MB显示值作签名输入 |
| requiredFor、edgeReason、owner、policyRevision | 只读 | 对应领域Owner；来源缺失标unknown |
| missing、conflict、unsupported、stale | 只读分项 | Host预检真实输出，不能用显示成功覆盖失败 |
| migrationFrom→To、lossiness | 审批式选择 | 有版本迁移器；有损必须用户明确决策，不静默转成最新 |
| activationMode | 有条件可写 | 仅verified后启用；readOnly、staged、active区别清晰 |
| requestId / epoch、restoreReceipt | 派生只读 | Host；迟到请求不能改变另一个工程现场 |
| scene/selection/camera | 可选偏好 | UI工作现场；缺失可降级，不得修改业务hash |

3D在staging阶段只显示标记为隔离预览的模型；选择、预览、切换空间和相机不写业务状态。只有Host成功激活receipt后，主空间刷新有效模型；过程中当前已打开工程保持可使用。取消请求可以终止尚未commit的staging；提交后点击取消只能作为新工作流请求，不能假装已撤销历史事务。

状态图：idle→inspecting→closure_ready/blocked→staging→verifying→committing→active；另有readonly、cancelled、failed、needs_migration。failed不得自动跳active；blocked原因应能定位到第一个缺失依赖链。切换project/Setup后旧epoch任何回调只可写历史日志，不可替代当前选中项目。

## E. 恢复协议、隔离和失败传播

用现有Host ProjectService/CAS/Provider聚合入口扩展**逻辑用例**（不是已经存在的函数名）：InspectOfflineClosure、ExportExactPackage、PrepareOfflineRestore、VerifyStagedRestore、CommitOfflineRestore、RecoverRestoreJournal、GetRestoreReceipt。GUI/CLI/Agent统一走它们，不绕过read-only门禁或把load预览变为save。

验证先于可见提交：容器Header/Footer/TOC、路径和包大小→每个字节digest和schema→根和transitive exact闭包→隔离目标生成Working Store→按模块隔离hydrate→消费方自检→宿主提交点标记active generation→渲染刷新。若无法在一笔数据库事务内实现多个库的原子性，Host需恢复日志、提交标记与幂等重放，明确中断恢复状态，不声称全局ACID。权限/许可证不能由快照授予，未经授权的插件或手册应保留缺失信息。

**回退**：只清理有事务标识的staging资源，保留旧工程/备份和源CAS；发布成功的业务头永不在取消时倒写。旧Reader只读兼容窗口须按实际格式版本有测试；未知required插件不能通过删除manifest声明打开为可写，unsupported只用于不依赖它的消费能力。

## F. 明确失败边界

路径不存在但有同hash CAS副本可恢复；仅源文件路径不存在不应阻断。相反，“有显示Mesh但缺被工程计划引用的真实B-Rep”必须阻断相应制造消费。相同逻辑ID不同hash不可自动merge；同一hash但不同domain/revision也不能由字节一致假设身份相同。

不将W3C PROV-O“可表达来源关系”误当作“自动判定闭包所需资产”的算法。OCI descriptor设计只提供内容身份设计依据，不表示.pct成为OCI镜像格式。CBOR编码决定性必须指定具体子集并有跨语言字节对拍，不因当前容器注释写Canonical CBOR就直接认定符合RFC8949全部条件。
