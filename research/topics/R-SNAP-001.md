# R-SNAP-001｜离线工程快照的依赖闭包、一致性与故障恢复

2026-10-17｜研究编制已完成、待领域评审；**不是恢复链端到端实测报告**。关联[F1-06](../../docs/work-packages/F1-06.md)、[规则追踪](../traces/F1-06.json)、[来源注册表](../references.json)。

## 1. 原始资料与读取边界

| 来源 | 本轮已核对的章节 | 可支持结论 | 不能推定 |
|---|---|---|---|
| SRC-SNAP-001 | IETF RFC 8949 §4.2.1/4.2.3，官方全文HTML | Core deterministic CBOR与旧length-first排序不是一回事；键序、最短编码及浮点规则均影响字节稳定性 | 本项目现有ciborium输出已全面符合其中某一种规则 |
| SRC-SNAP-002 | OCI Image Spec Descriptor，OCI官网 | content descriptor包括mediaType、digest与raw size，树状内容寻址支持可验证引用 | .pct已符合OCI或能直接互通OCI客户端 |
| SRC-SNAP-003 | SQLite Online Backup API官网，§1 | 在线备份在单DB读取切面产生一致副本 | 多DB、CAD文件与各域CAS天生一笔事务 |
| SRC-SNAP-004 | SQLite WAL官网，Overview/How WAL Works/Limitations | reader end mark是特定SQLite DB的快照点，多ATTACHed WAL数据库不保证作为整体原子提交 | 整个Procet是分布式ACID |
| SRC-SNAP-005 | SQLite Atomic Commit官网，§5及前文 | 跨DB原子性在特定回滚日志条件下受底层机制限制 | 任意FS rename就使多个独立库事务原子 |
| SRC-SNAP-006 | W3C PROV-O Recommendation（2013-04-30）§2–3 | Entity/Activity/Agent、wasDerivedFrom、wasGeneratedBy表达来源语义 | 来源关系能独立断定某资产必需或保证内容正确 |
| SRC-SNAP-007 | SQLite How To Corrupt... §1.2–1.4 | 直接复制活动DB不带WAL/journal可能产生不一致；在线备份更适合 | 损坏一定可恢复；单文件校验即可代替恢复审计 |

全部从发布机构的可公开HTML阅读，未下载或转载规范全文。具体URL及访问深度见references.json；未知发布日按官方标记，不以访问日代替。

## 2. 区分三种“完整”

(1) **字节闭包完整**：所有required descriptor都有可解码字节、正确digest/size/media/schema。 (2) **语义闭包完整**：各字段解析为同一exact修订，必要组件与Frame/执行配置依赖均能消费。 (3) **任务资格完整**：对于指定操作，具有已建模检查、权限与适用控制器语义/签名证据。三者不可相互替代。成功打开包不能推出可以发布NC、可以加工或测量合格。

将引用定义为有向图G=(V,E)，对某任务q，Owner指定带版本的必要性函数req(e,q)。最小必需闭包C_q是包含选中根R且对req为required的边递归闭合的最小节点集。**这是Procet领域方案，不是OCI或W3C标准直接给出的现成算法**。求解复杂度O(V+E)+哈希读取的O(B)，需记忆已访问节点、检出同精确身份不同内容与被禁循环。optional可省，不代表能删原引用事实。

CAS digest是**按具体字节**计算。领域修订与批准状态属于独立维度；两件同字节也可能是不同审批/来源的业务对象。不要用JSON字段排序替代二进制manifest规范；不要把前轮F1-01未认证的辅助canonicalSha256当生产Hash。若未来签名或交换使用JSON须核对SRC-REF-001（RFC8785，已有注册来源），**这不代表当前.pct使用JCS**。

## 3. 一致切面与跨持久层的危险假设

SQLite Online Backup API能稳定一个源数据库的备份状态。若CAD/Resources/CAM各有独立持久化、CAS和后台生成器，则读取时点t1的工程头与t2的资源子件可能不属于同一个合法消费版本。现有ProjectService可见generation、provider收集和SQLite备份，但这三件不自动构成跨资源一致事务。

建议保存流程**先决定需保证的一致性范围**：capture exact root set与expectedGeneration、以Owner版本化依赖枚举证明全部工件已发布或固定、锁定/校验这些不可变内容、重复读取根与generation并比对、在完成前不推进“可交付”标志。发生变更必须重试或失败，绝不把一套自相矛盾引用写进可生产包。

在SQLite WAL模式下，各独立数据库的原子性不能扩大为整组数据库的原子性；有锁与rsync/Backup也不能让多个外部CAS自动与数据库单事务提交。宿主需明确一处**可见激活提交点**，其余staging可重放/清理；崩溃后的日志恢复是否完全正确必须靠杀进程测试确认。

## 4. 恢复语义必须分两阶段

阶段一：对包字节、manifest、schema、插件能力、依赖闭包预检，并在隔离空间恢复。阶段二：各领域Owner按其实际reader确认结构能被消费，宿主重检目标epoch并推进可见active ref。阶段一失败不污染现有工程；阶段二失败保留可重试的staging审计，不给GUI错误成功回执。事务完成但响应丢失使用requestId找receipt，不能把重试变成第二个可见版本。

可选UI相机/缩略图与必需制造资源有不同失败传播。未知必需解释器影响NC执行模拟，但不一定阻断纯只读几何查看。对批准/发布的历史工件，原资源退休不应偷偷替换新版；若相应reader无法理解旧schema，只读或拒绝写入是可证明的降级，而不是删manifest元数据。

## 5. 来源→设计规则→验收

| 规则 | 来源/推导 | 字段/公式 | 正反验收 |
|---|---|---|---|
| SNAP-R01 | 内部根集冻结策略 + E-SNAP-01/02 | R(g)、rootHash、savedGeneration | T01/T20 |
| SNAP-R02 | SRC-SNAP-002/006 + 领域依赖推导 | closureEdges、requiredFor、C_q | T02/T03/T04 |
| SNAP-R03 | 内部分级策略 + E-SNAP-01 | required、optional、unknown、policyRevision | T03/T11/T12 |
| SNAP-R04 | SRC-SNAP-003/004 + 保存算法 | expectedGeneration、providerDigestSet | T07/T20 |
| SNAP-R05 | SRC-SNAP-002/007 | digest、byteSize、logicalPath、owner | T05/T06/T08/T10 |
| SNAP-R06 | SRC-SNAP-001 | canonicalEncodingVersion、schemaVersion | T09 |
| SNAP-R07 | SRC-SNAP-004/005/007 | stagingRef、commitMarker、restoreJournal | T15/T16/T18 |
| SNAP-R08 | 内部迁移与兼容策略 + E-SNAP-02 | migrationPolicy、readOnlyReason | T11/T13/T14 |
| SNAP-R09 | SRC-SNAP-006 | provenanceEdges、sourceRefs、receipt | T01/T20 |
| SNAP-R10 | 内部GUI/Host共用用例 | requestId、epoch、cancelState | T16/T17/T18/T19 |

W3C/OCI提供**来源表达与描述符模型的借鉴**，没有强制Procet实施上述算法或界面；内部约束单独标注，避免“引用即合规”。新增逻辑方法名均为提案，未核验具体产品代码现有对应入口。

## 6. 未决事项

- 完整读取并核对ProjectService/Provider类型的真实工作区版本及全链调用，尤其required=false具体影响；本轮只读了指定路径和局部段落。
- 与F1-03明确多库、CAS、内嵌工件之间的提交权限和一致性协议；数值限制与实际磁盘空间的生产策略需可测版本。
- 需要CAD/Setup/资源/NC/验证Owner给出必要资产矩阵和可复现的独立golden；不得把未获得私有设备/客户数据当作“已证实”。
- 跨平台fsync/rename耐久性不能只从单个POSIX示例推广至Win11/WSL/网络盘，必须分环境实测与限制。
