# B173｜CAP-10-07 报警历史Branch与ConditionRefresh复工阻断研究

2026-11-05｜原E3-06、T5-03实施补证。不变更11域88CAP、36包、17资产与L1/L2，L3待人类评审；不是产品或机床验证。

## 风险及可证伪案例

OPC UA Part9将ConditionId（同一Condition）与EventId（每次事件通知）分离。当前BranchId为NULL、历史需关注分支有非NULL BranchId，合成Fixture中CURRENT只代表NULL，不能直接序列化回OPC类型。旧分支Retain=true可能与Inactive并存。
合成SpindleTemp案例：当前evt-004已ACK且Inactive，历史ns=2;s=branch-7仍Retain、未ACK；仅用ConditionId去重最后一条通知会漏掉旧告警。ACK/可选Confirm也不能冒充维修结束、D15安全或复工授权。
ConditionRefresh返回RefreshStart/End，并可能与实时live事件交错；缺End/断点/历史Branch未交接不得静默清告警。所有缺口应UNKNOWN_RESYNC或BLOCK_OLD_BRANCH，不能覆盖已接收的更新事件。

## 来源作者、版次、章节、访问深度及局限

| ID | 作者、版本 | 网址/阅读范围/局限 |
|---|---|---|
| B173-S01 | OPC Foundation v1.05.06 | https://reference.opcfoundation.org/specs/OPC-10000-9/5；§5.5.2–5.5.3；SPECIFIED_PUBLIC_SECTION，访问2026-11-05；Retain不是Active；客户控制器支持未知 |
| B173-S02 | OPC Foundation v1.05.06 | https://reference.opcfoundation.org/specs/OPC-10000-9/4.3；§4.3/§5.7；SPECIFIED_PUBLIC_SECTION，访问2026-11-05；ACK/Confirm不证明维修或复工 |
| B173-S03 | OPC Foundation v1.05.06 | https://reference.opcfoundation.org/specs/OPC-10000-9/5.5.7；§5.5.7 RefreshStart/End与live Event交错；SPECIFIED_PUBLIC_SECTION，访问2026-11-05；真实Server未实测 |
| B173-S04 | OPC Foundation v1.05.06 | https://reference.opcfoundation.org/specs/OPC-10000-9/4.4；§4.4 Previous States；SPECIFIED_PUBLIC_SECTION，访问2026-11-05；历史Condition分支不是维修事实 |
| B173-S05 | K. Stouffer et al., NIST SP800-82r3 final, 2023-09 | https://csrc.nist.gov/pubs/sp/800/82/r3/final；官方摘要与著录；OFFICIAL_ABSTRACT_ONLY，访问2026-11-05；未读正文措施；Rev4仅初稿 |
| B173-S06 | T. Lebo; S. Sahoo; D. McGuinness et al., W3C Recommendation 2013-04-30 | https://www.w3.org/TR/prov-o/；prov:wasRevisionOf/qualifiedRevision；SPECIFIED_PUBLIC_SECTION，访问2026-11-05；仅描述谱系，非实机认证 |
| B173-S07 | BaiSongt/Procet b15822d5f637c3208e7e77f80148fc142db911dc | https://github.com/BaiSongt/procet-devplans/blob/b15822d5f637c3208e7e77f80148fc142db911dc/docs/capabilities/CAP-10-07/README.md；T01-T10及Owner/变更回流；FIXED_INTERNAL_BLOB，访问2026-11-05；内生规则；blob 5c527812ddf5d12f9af7350f31d46967601228a9 |
| B173-S08 | BaiSongt/Procet b15822d5f637c3208e7e77f80148fc142db911dc | https://github.com/BaiSongt/procet-devplans/blob/b15822d5f637c3208e7e77f80148fc142db911dc/docs/architecture/v0.8/04_开发工作包_36项.md；§E3-06/§T5-03；FIXED_INTERNAL_BLOB，访问2026-11-05；内生接口/回退；blob 45c897339bb51a574d94a13c1cd378f9b2539c5a |

NIST仅官方摘要/著录，未引用任何未读PDF正文条款；W3C PROV来源修订不证明现场事实。CAS/ACL、三入口和复工门禁属本仓业务设计，不冒称外部标准要求。

## 来源→规则→字段→CAP/原包→验收

| 规则 | 四个独立字段 | 来源 |
|---|---|---|
| B173-R01 事件与原始指纹 | identity.serverUri / identity.conditionId / identity.eventId / identity.rawSha | B173-S01, B173-S07 |
| B173-R02 当前与历史Branch严格隔离 | branch.currentId / branch.oldId / branch.oldPending / branch.noCollapse | B173-S01, B173-S04 |
| B173-R03 Inactive/Retain与旧Ack分离 | retain.oldInactive / retain.oldRetained / retain.oldAckPending / retain.noAutoClose | B173-S01, B173-S07 |
| B173-R04 Ack/Confirm不自动消缺或启机 | ack.currentAcked / ack.currentConfirmed / ack.notRepair / ack.noCycleStart | B173-S02, B173-S07 |
| B173-R05 刷新边界与实时Event交错保护 | refresh.startSeen / refresh.endSeen / refresh.liveNotOverwritten / refresh.oldBranchesIncluded | B173-S03, B173-S04 |
| B173-R06 D17追加和D01新修订、A/B冻结 | change.d17AppendOnly / change.newD01Revision / change.d08Immutable / change.provenanceExact | B173-S06, B173-S07 |
| B173-R07 D04/D10分离与最终NC独立验证 | execution.d04D10Separated / execution.finalNcBytePinned / execution.unknownBlocksRelease / execution.independentD15 | B173-S05, B173-S07, B173-S08 |
| B173-R08 Owner CAS/ACL与取消晚ACK | tx.ownerAclRecheck / tx.casRevisionHashFrame / tx.scopeCancelFence / tx.lateAckReadOnly | B173-S07, B173-S08 |
| B173-R09 GUI/CLI/Agent同Port单Babylon左TaskPanel | ui.samePort / ui.worldCount / ui.panelCount / ui.unknownVisible | B173-S07, B173-S08 |
| B173-R10 旧Reader影子读/独立消费者/回退 | migration.shadowReader / migration.independentConsumer / migration.noRewriteOnRollback / migration.syntheticNotProductPass | B173-S05, B173-S07, B173-S08 |

每条规则1正+4个独立单字段负例，共10正40负，另8状态Golden：INTEGRITY_FAILED、UNKNOWN_RESYNC、BLOCK_OLD_BRANCH、ACTIVE_ALARM、RETAINED_UNACKNOWLEDGED、ACKED_UNCONFIRMED、CHANGE_REVIEW_REQUIRED、OBSERVATION_ONLY。最后一项是观测资格，并非机床放行。

## Owner、Port、GUI及回退

10域D17只追加原始现场事件，D03机床能力仍属02域，D01/D05/D08由其原Owner管理；D08 A/B冻结不可覆盖。D04是名义Setup，D10为实际执行绑定；D12最终NC→D13未知语义检查→D14轴时序→D15独立工程验证→D16批准发布不可跳过，CL动画不能冒充工程认证，不做材料扫掠仿真。
FieldEngineeringChangePort的observeAlarmBranch只接收机器/服务器身份、ConditionId/BranchId/EventId、原始字节SHA、时钟质量、Adapter精确版本、Scope/必要Frame或显式N/A以及expectedRevision/hash与取消Token；提交D17 Append前重验Owner ACL/CAS、scopeEpoch、取消Fence，晚ACK仅诊断不可回写。
GUI、CLI、Agent均走该受管Port。单Babylon世界/Scene和统一左TaskPanel（最多12px、浅深色），并展示旧Branch与Unknown；选择/预览不是领域提交。旧Reader继续影子读，只有独立真实OPC消费者验证分支/Refresh/断网/ACL撤销后才迁移，失败回退旧Reader且不删旧事件。

## 实施与验收等级

[来源](../../../research/sources/CAP-10-07-alarm-branch-b173.json) → [规则](../../../research/traces/CAP-10-07-alarm-branch-b173-v08.json) → [Fixture](alarm-branch-b173-fixtures-v08.json) → [只读Node](../../../tools/check_cap1007_alarm_branch_b173_v08.cjs) → [分级](../../../tracking/cap1007-alarm-branch-b173-verification-2026-11-05.json)。
内存JS同判据58/58，独立Node完整文件进程NOT_RUN。真实OPC/D17消费者、机床NC、17正式Owner会签0/17和真实消费者0/17、L3、历史原字节、全仓GFM AST未闭合。**规划PASS≠产品PASS。**
