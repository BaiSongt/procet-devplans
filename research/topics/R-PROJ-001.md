# R-PROJ-001｜工程身份、可见保存点、来源谱系与离线恢复

**编制：2026-10-18｜CAP-01-01 研究证据回补，待业务／Host／领域消费者评审；不宣称代码实现或产品测试通过。**

原CAP规格已存于 `docs/capabilities/batch01-v0.9.1/01_功能规格/CAP-01-01_项目与工程空间.md`。本专题仅回补来源和独立验收，不变更历史规格、原88项分母或L1/L2归属。阅读：[逐项补证规格](../../docs/capabilities/CAP-01-01/RESEARCH-BACKFILL.md)｜[规则追踪](../traces/CAP-01-01.json)｜[本轮新来源](../sources/CAP-01-01.json)。

## 1. 研究问题与证据等级

工程容器的“可以解压”、业务工作区的“可正常消费”、本次操作的“可以提交/发布”是三种不同事实。工程恢复要求对选定 generation 的**引用闭包、持久化快照、可见激活与来源**分别证明，不能仅依据3D画面或单个SQLite快照。Project身份、显示名称、存储位置和派生谱系必须分开；已有批准与制造资格也不能随“另存为”自动转授。

以下外部来源为可公开原始资料，本轮已联网打开指定章节。**访问深度为阅读到相关网页段落的section_text，不代表完成对整个网站/产品的认证。**

| 来源ID | 发布机构/版次及本轮阅读位置 | 支持的技术结论 | 不能推断 |
|---|---|---|---|
| SRC-SNAP-003（复用） | SQLite官方Online Backup API §1，网页无明示发布日 | 在线备份对单个源DB形成一致目的快照，运行期间可容忍并发更新 | 对多个独立业务数据库、CAS、机器文件形成天然同一事务 |
| SRC-SNAP-004（复用） | SQLite官方WAL文档Overview/How WAL Works/Limitations，网页无明示发布日 | WAL的读快照和多ATTACH数据库整体原子限制有明确适用条件 | 所有SQLite组合都不可能跨文件原子；不能忽略回滚日志super-journal特例 |
| SRC-SNAP-005（复用） | SQLite官方Atomic Commit §1及§5 Multi-file Commit，网页无明示发布日 | 通过ATTACH与回滚日志满足条件时多DB可原子提交 | 每个独立连接/任意CAS写入都加入同一SQLite事务 |
| SRC-SNAP-007（复用） | SQLite官方How To Corrupt §1.2-1.4，网页无明示发布日 | 活动DB直接复制或日志错误配对会破坏恢复一致性 | 能由事务文档替代现场跨平台崩溃/磁盘断电测试 |
| SRC-REF-001（复用） | Rundgren/Jordan/Erdtman，RFC 8785（2020-06）§3.1-3.2 | JSON JCS规定确定性排序、序列化及UTF-8输出，有前置I-JSON条件 | 当前`.pct` CBOR manifest或辅助Python JSON hash已采用JCS |
| SRC-SNAP-006（复用） | W3C PROV-O Recommendation（2013-04-30）§2-3 | 可表达Entity、Activity、Agent、派生/修订来源 | 直接规定Procet ProjectId、批准资格或数据原子性 |
| **SRC-PROJ-001（本轮新增）** | SQLite，Transactions §2-2.3，官方HTML，日期未标注 | BEGIN/COMMIT/ROLLBACK、DEFERRED/IMMEDIATE及SQLITE_BUSY的条件 | `expectedGeneration`或跨领域CAS是SQLite自带的全局语义 |
| **SRC-PROJ-002（本轮新增）** | W3C PROV-DM Recommendation（2013-04-30），§2实体/活动/生成/派生 | 衍生来源可与新实体身份同时保留，便于fork追踪 | `forkOf`必须映射某一特定数据库字段或可复用已有审批 |

所有URL、作者、实际读取深度及局限在[注册元数据](../sources/CAP-01-01.json)中列出。旧来源保留原`research/references.json`中的历史版本、访问日期；本轮只是**重新查看其特定网页内容**，不修改旧记录。

## 2. 形式化工程不变量（设计推导，不冒称外部标准）

定义 `ProjectId = opaque UUID`、`WorkspaceGeneration = g`、`CurrentHeads(g) = { (owner, entityId, revision, artifactHash) }`，以及选定任务q的必需依赖闭包 `C_q(g)`：对每个工作区根递归追踪拥有领域声明的required边，并验证内容摘要/Schema/可消费性。闭包枚举属于Procet设计策略，不是W3C或OCI要求的法定算法。

**I-01 独立身份**：新建/真正fork分别产生ProjectId；重命名与在新路径保存同一个工程并不自动改变ProjectId。领域实体的内容Hash不能替代ProjectId与approval状态。

**I-02 同一可见代数**：提交前使用 `expectedGeneration` 核对本次读到的根集合；对同一generation的可见工程头只允许一份正式确认的回执。允许领域工件先生成但保持“未采纳”，不能宣称多库与CAS自然ACID。

**I-03 两阶段恢复**：先对包字节、manifest、C_q、required模块及reader作隔离预检，再由Host在作用域与可见头重验后激活。可选模块缺失与必需制造工件缺失须依据具体消费能力降级，不用单一`isComplete`布尔宣称制造就绪。

**I-04 显式fork**：`Project.fork`创建新的身份/来源边，继承仅可继承的工件字节；对历史批准、NC发布资格与运行时锁逐项重判；`Project.save_as`如只更换容器路径，不得伪装为fork。

**I-05 会话分离**：相机、布局、当前任务/Setup选择属于可恢复会话视图；领域revision/generation仅由真实业务变更/保存协议推进。选中或预览、面板关闭、换工程后的迟到回执不直接写领域真值。

**I-06 字节格式**：当前仓库manifest声明Canonical CBOR。JSON JCS仅在明确采用并能与原字节算法复现时适用于JSON摘要；不能将Python `json.dumps(sort_keys=True)`的哈希当作`.pct`/CBOR生产摘要。

## 3. 现有源码观察与适用性（只读，不是测试）

已读取 `BaiSongt/procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`：

- `crates/procet-project-runtime/src/service.rs`约1—220行及220—850行所选段：已有`ProjectService`、`ProjectSnapshotProvider`注册、路径锁、故障注入点、保存的tmp→Reader回读→rename→savedGeneration确认、`open_and_mount`及会话恢复逻辑。**应直接复用，禁止在CAP-01-01另造Project Runtime**。
- 同文件中 `save_as(&Project, &Path)`调用 `save_internal(project, path, &[])`，从所读片段**看不到**新ProjectId分配；所以原CAP拟定的“另存为副本=fork新身份”不可直接认定已经实现。必须将“保留ProjectId的另存路径”与“显式派生ProjectId”的业务命令区分，并由Owner评审。
- `save_with_providers`生成记录时有 `required:false`，而后续实际写入又读取`record.required`；这是需要查清“provider required粒度／下游领域required边”是否贯通的风险线索，**不是已经证实生产丢数据**。
- 当前 `save_internal`在保存流程内先增加 working generation，然后走写盘/确认savedGeneration。失败时不能仅凭此静态代码声称“所有generation均不变化”；应分别测试`workingGeneration`与`savedGeneration`、容器旧版和恢复日志。
- `crates/procet-project-contracts/src/manifest.rs`定义 `Manifest{ projectId, savedGeneration, currentHeads, compatibility, originalSource }`与`HeadRef{owner,entity_id,revision,artifact_hash}`；manifest用Canonical CBOR表达，不直接等于JCS JSON。`requiredModules`与`optionalModules`区分已有字段，应复用。

这些只读证据为**指定旧提交**而非2026-10-18实时产品HEAD认证，实施前必须重新核对消费分支。GUI/CLI/Agent的目标能力名称是**规划建议**，不得虚称已存在对应完整API。

## 4. 来源冲突与需要明确验证的边界

1. **SQLite不是“永远只能单库事务”**：回滚日志+ATTACH满足前提可形成多文件原子提交，但各连接、WAL、外部CAS与`.pct`并非因此统一原子，参见SRC-SNAP-004/005。设计需记录具体journal mode、连接与OS/VFS前提。
2. **文件rename≠跨平台持久性承诺**：不同文件系统、Win11、WSL、可移动盘及网络盘有不同能力，不能凭POSIX或单次单元测试承诺断电安全。仅列可执行的故障注入/恢复工况供工程验收。
3. **Provider required=false与具体任务required不等价**：Provider条目与依赖边的必要性粒度不同，需按消费域和用途定义，并从打开/保存的完整代码链证实。不能一律提高或一律忽略。
4. **项目名称/存储位置与主键分离不属于PROV强制字段**：这是Procet选择；PROV仅辅助表征派生谱系，不授予原项目的人工批准资格。
5. **后端许可及运行状态与界面状态不同步时，应以后端提交点判定为准**。异步晚回执按`projectId/requestId/scopeEpoch`隔离；恢复后旧数据不可自动改写已冻结结果。

## 5. 工程与评审缺口

- Project/Host负责人确认`save_as`行为与fork命令边界；确认generation与savedGeneration故障行为、对外receipt是否带请求幂等键。
- CAD/Resources/CAM/NC消费者分别提供required子资产样例、旧版本reader和实际依赖闭包；没有样例的具体资源不得标已验收。
- GUI负责人审查统一左容器+唯一Babylon世界的项目切换体验、scopeEpoch与旧回执抑制。
- 独立验证者补齐本地原工程保护、不同文件系统断电故障注入、active project不可污染及Hash/Schema真实复算测试。
- F1-06继续负责跨领域闭包测试，本回补不重复编制工作包或虚构已有测试入口。

评审结论：**研究补证编制完成、领域评审待进行、产品测试未执行**；不自动改变既有CAP-01-01批准状态或主分支计数。