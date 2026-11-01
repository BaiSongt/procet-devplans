# B85 CAP-10-07 现场异常变更JSON Patch原子性与并发CAS

**2026-11-01实施级研究**；原88项与E3-06/T5-03不重编号，11域/17资产不扩分母。L3/Owner/实际消费者未审批。

## 实际工程问题

D17报告建议将D05的`OP/A`工序策略由ROUGH调整为FINISH。并发修改期间仅发送新值会覆盖其他人工决策；10域直接写D05也越过Owner。JSON Pointer `OP~1A`指`OP/A`，而`OP~01`指`OP~1`，转义顺序不能交换。

## 来源阅读范围与产品内生策略

RFC6901 §3–4明确`~1`先解成`/`、`~0`后解成`~`；RFC6902 §3/4.6/5有`test`失败及Patch原子语义；RFC7396 §2使用不同媒体类型且`null`表示删除；RFC9110 §13.1.1涉及If-Match强比较；W3C PROV-O §3提供派生/修订关系，不能证明实机安全。NIST资料仅阅官网出版摘要。**只允许`test→replace`、稳定对象字段**是本项目主动限定的安全子集，不能当成RFC的完整操作定义。

## 来源→规则→字段→原CAP/工作包→正反验收

- CP85-R01：现场D17来源、哈希与质量不明不写新工程状态；来源`P85-S05,P85-S06,P85-S07`；字段`incident.id`,`incident.hash`,`incident.d17`,`incident.sourceOwner`,`incident.frame`,`incident.quality`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-P01,B85-N01,B85-N02,B85-N03,B85-N04,B85-N05`。

- CP85-R02：JSON Patch媒体类型与Merge Patch隔离，拒绝不支持操作；来源`P85-S01,P85-S03`；字段`patch.type`,`patch.ops`,`patch.ops[*].op`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-N06,B85-N07,B85-N08,B85-N09`。

- CP85-R03：Pointer须正确处理~1/~0及稳定工序键，不接收危险或含混路径；来源`P85-S02,P85-S07`；字段`patch.ops[*].path`,`document.operations`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-P02,B85-N10,B85-N11,B85-N12,B85-N13,B85-N14`。

- CP85-R04：必须test先校旧值且replace目标一致，单项原子拒绝；来源`P85-S01,P85-S07`；字段`patch.ops[0].value`,`patch.ops[1].value`,`patch.ops[1].path`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-N15,B85-N16,B85-N17,B85-N18,B85-N19,B85-N20`。

- CP85-R05：05域拥有D05唯一写侧，提交点ACL/CAS/Frame/Scope/代次重验；来源`P85-S04,P85-S07`；字段`command.expectedRevision`,`command.expectedHash`,`command.expectedFrame`,`command.scope`,`command.generation`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-N21,B85-N22,B85-N23,B85-N24,B85-N25,B85-N26`。

- CP85-R06：D04名义Setup和D10实装隔离，冻结、未知D13与CL动画不能发布；来源`P85-S07,P85-S05`；字段`boundary.d04`,`boundary.d10`,`boundary.frozenWrite`,`boundary.d13Known`,`boundary.claimD16`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-N27,B85-N28,B85-N29,B85-N30,B85-N31,B85-N32,B85-N33`。

- CP85-R07：GUI/CLI/Agent统一10域Port、单Babylon世界和左TaskPanel，取消晚ACK拒绝；来源`P85-S07,P85-S04`；字段`ui.gui`,`ui.cli`,`ui.agent`,`ui.worldCount`,`ui.panel`,`command.cancelled`,`command.lateAck`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-P03,B85-N34,B85-N35,B85-N36,B85-N37,B85-N38,B85-N39,B85-N40`。

- CP85-R08：保留旧Reader和无损回退，真实独立消费者未跑不得虚构PASS；来源`P85-S07,P85-S05`；字段`migration.readerPreserved`,`migration.rollbackRef`,`migration.claimConsumerPass`；CAP-10-07 / E3-06 / T5-03；机器预期`B85-N41,B85-N42,B85-N43`。

## 数据与跨Owner事务

10域`FieldEngineeringChangePort.preview/propose/cancel`仅可管理D17事件及新变更请求，05域`ProcessPlanPort.applyApprovedChangeWithCAS`才允许追加D05新revision；旧D08冻结/A-B历史保留。逐层强检D17 exact hash/quality、D05 expected/current hash+revision、Frame、ACL、scopeEpoch、taskGeneration、cancel和迟到ACK。错误test或指针不匹配整体拒绝，不允许部分写。

GUI/CLI/Agent调用同10域受管入口；唯一Babylon World和统一左TaskPanel，浅/深主题及≤12px字号。预览只有只读差异。D04名义装夹与D10实际机床绑定独立；改变D05若影响D09 CL，必须重新后处理得到D12最终NC，再经D13执行语义→D14轴时序→D15独立验证→D16审批发布。D13未知必须UNKNOWN；D11 CL动画不得冒充NC工程验证，不做材料扫掠仿真。

迁移采用Expand→Migrate→Contract，旧Reader、原D17异常事实、D08冻结及旧D16批准版不可破坏，独立消费者验证前不得收缩或宣称通过。

## 检验与局限

46项合成（3候选/展示+43拒绝/未知），同一判定函数检查并不能替代真实应用、标准全实现或工业现场测试。17正式Owner签署0/17、真实消费者0/17、人类L3待审，**规划PASS≠产品PASS**。

[分级来源](../../../research/sources/CAP-10-07-change-patch-b85.json) → [8规则追踪](../../../research/traces/CAP-10-07-change-patch-b85-v08.json) → [正反fixture](change-patch-b85-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap1007_change_patch_b85_v08.cjs) → [测试等级](../../../tracking/cap1007-change-patch-b85-verification-2026-11-01.json)
