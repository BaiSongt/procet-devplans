# CAP-05-03｜B66 显式工艺前置边与传递约简隔离（2026-10-31）

> V0.8原编号不变；L1/L2不变、L3待人类审查。**规划PASS≠产品PASS。**

## 可复核的反例

存在显式人工前置 `A→B`、`B→C` 和具有独立夹紧来源的 `A→C`。NetworkX 3.6 的 `transitive_reduction` 将其缩为 `A→B, B→C`，保持可达性却**删除人工记录的直接边A→C与来源/理由**；该API亦说明默认不会保留edge attributes。因而该算法仅可服务于**只读展示或派生索引**，不能以“拓扑等价”为由覆盖D05的显式业务边集。NetworkX只提供算法语义，保护人工制造证据是Procet内生规则，绝非NetworkX的工艺规范。

Python 3.12 `TopologicalSorter`也只保证拓扑序遵从所有前置关系，不保证存在唯一排序；不相关的Operation D可出现在不同位置。**拖拽displayOrder、业务precedenceEdges、资源排程和D14真实轴时序绝不能混同。** 本轮单独以本地Python/NetworkX 3.6.1执行A/B/C三点反例，结果为两边 `A→B,B→C`，属于独立数学演示而非真实产品测试。

## 8条可证伪的工程规则

| 编号 | 规则 | 关联原工作包 |
|---|---|---|
| B66-R01 | 稳定Operation/显式Edge身份 | W2-03、W2-05 |
| B66-R02 | 来源级直接约束保护 | W2-02、W2-03 |
| B66-R03 | DAG与环见证 | W2-03 |
| B66-R04 | 显示顺序/传递约简只读 | W2-03、W2-05 |
| B66-R05 | 跨Setup Frame与D04/D10隔离 | W2-05 |
| B66-R06 | ACL/CAS/Scope/取消晚回执 | W2-02、W2-03 |
| B66-R07 | 精细失效/冻结/CL隔离 | W2-02、W2-03 |
| B66-R08 | 三入口同领域Port/单Babylon | W2-03、W2-05 |

权威显式边必须保存 `edgeId/from/to/reason/sourceRef/actor` 和保护状态，Graph必须无自环/悬空/重复ID/环，返回可复核闭环路径（不能静默修复）。对 `A→C` 即使存在 `A→B→C`，删除仍必须走独立人工理由、审批及已保护边的新D05修订fork；D08冻结/旧D16发布不可原地覆盖。W3C PROV-O（2013 Recommendation）可表达Entity/Activity/Agent/派生关系，但这些D05字段强制性来自原CAP和原W2-02/03/05，而不是W3C规范。

GUI、CLI、Agent经05域同一个 `D05.RouteEditDomainPort`，统一单Babylon Engine/Scene/Canvas、左TaskPanel，禁止右Drawer与双世界。提交瞬间复核expected/current `revision/hash/frame`、D04 Setup exact、D08 freezeHash、Owner ACL、ScopeEpoch、Generation、取消/晚回执。RFC 9110 §13.1.1只为强比较并发前置条件的理论参考，无法证明Procet已实现CAS或权限。跨Setup还须真实D04变换Frame/单位/校准资格；D04名义Setup≠D10实际机床执行绑定。

**状态分级：** `DISPLAY_ONLY`（纯UI拖拽/约简投影、无业务失效）；`CANDIDATE_ONLY`（来源和DAG局部候选，仍需Owner审批及真实独立消费者）；`REJECT`（无权限、改写冻结、错误执行验证/边身份、闭环）；`STALE`（CAS、ACL/Scope、取消或晚回执）；`UNKNOWN`（Frame/迁移/影响闭包缺证据）。真实依赖变更仅对精确受影响的D06/D07/D09/D12→D13→D14→D15重新判定，未证明闭包不能假定为空。中立CL、NC后处理、D13解释、D14时序、D15验证、D16发布职责保持隔离；CL播放不是工程验证，不做材料扫掠仿真。

旧规划缺稳定OperationId/来源边时只读迁移并标UNKNOWN，人工映射后fork新版、影子Reader核对，保留A/B共用事实和D08冻结回退，不伪造丢失历史原附件。

## 原始来源到正反验收

[来源（9项，5外部+4内部固定Blob）](../../../research/sources/CAP-05-03-explicit-edges-b66.json) → [8条规则/字段/CAP/原包](../../../research/traces/CAP-05-03-explicit-edges-b66-v08.json) → [56项合成正反与UNKNOWN](explicit-edges-b66-fixtures-v08.json) → [Node校验器](../../../tools/check_cap0503_explicit_edges_b66_v08.cjs) → [分级核验](../../../tracking/cap0503-explicit-edges-b66-verification-2026-10-31.json)。

外部实际阅读：NetworkX 3.6 API、Python 3.12 graphlib、W3C PROV-O相关公开正文、RFC 9110 §13.1.1/13.2；NIST Gupta等1994仅官方出版摘要，没有读整章，也没有由摘要推断专门算法。作者、版本、访问日期、章节、阅读深度及限制逐条登记。56/56只为**同一judge函数、固定独立期望值的规划合成测试**；Node完整文件进程、真实D05 CAS、独立消费者0/17、NC/OCCT/B5/OEM及浏览器产品测试均NOT_RUN，正式资产Owner签署0/17、L3待审，全仓GFM AST与历史附件字节审计未闭。
