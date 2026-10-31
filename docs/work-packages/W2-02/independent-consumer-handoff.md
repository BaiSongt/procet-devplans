# W2-02｜独立消费者交接
**生产者**：06域D06候选、06域D07材料证据、05域D05现行计划与D08冻结快照；**写入Owner**：05域受管采纳Port。跨模块边界不允许06域直接改D05/D08。独立消费者是05域真实持久层与06域约束接收端，后续07域D09仅在D07+D08闭合后读取。

## 冻结前置和原子条件
输入必须带project scope、A/B branch、D01/04/05/06/07/08每一个实际使用引用的id/revision/hash/frame/unit、stableStepUID映射、base/head/proposed diff、FreezeSet exact revision/hash、D07 checker结果、actor权限、idempotencyKey、taskGeneration。preview是只读；commit必须重读current head与ACL并按领域事务/可恢复协议保证“新D05修订+AdoptionRecord”一致出现，否则保持原head。跨库事务不得凭SQLite名称宣称原子。

## 反例交接表
| 触发 | 必须的消费者可观测结果 |
|---|---|
| 工序重排使index变化，UID未变 | UID绑定不变，不重复工序 |
| UID缺失或引用发生漂移 | REJECTED，不创建任何D05修订 |
| D07 checker UNKNOWN或Frame不一致 | UNKNOWN，不能进入批准计划 |
| 触碰冻结工序、三方语义冲突 | CONFLICT显式解决/拒绝；旧D08 hash不变 |
| 重放相同key+payload | 返回相同采纳记录，无第二次append |
| 同key不同payload，CAS失配或权限撤销 | REJECTED，不改变head |
| 取消后异步晚回执 | 状态为LATE_QUARANTINED，不产生新的D05/D08 |
| 修改D05但D09未有D07/D08闭包 | D09 BLOCKED；D15/D16不会继承通过资格 |

## 验收入口
规划：`python3 tools/check_w202_planning_2026_10_25.py`（不得称产品通过）。产品：05域无界面真实Port用冻结历史数据的隔离副本执行；06域独立查询D05 revision；07域独立负例拒绝不完整材料/冻结；08/09/10域确认旧NC资格不继承。测试执行与作者/环境/固定commit记录须另行提交。尚未运行这些产品验收，不触碰用户数据。
