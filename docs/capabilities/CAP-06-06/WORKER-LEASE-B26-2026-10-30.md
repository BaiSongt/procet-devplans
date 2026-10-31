# CAP-06-06｜B26 Worker失联预算与取消Fence

> 2026-10-30研究补证，基于原[多路径预算与并行](README.md)。不改变原88 CAP、36包、17资产、L1/L2和待审L3。**规划PASS≠产品PASS**。

## 设计发现

原设计要求reserve→dispatch→settle和取消晚回执，但缺少Worker已执行却失联/终态ACK丢失的**不确定预算结算**形式化案例。Python官方Future.cancel/shutdown和Tokio官方abort都不保证杀死已运行中的阻塞工作；OCCT SetRunParallel只是布尔算法并行开关。不能把「取消已请求」「进程消失」或「超时」作为Boolean任务没有执行或成本可释放的证明。

本轮新增`RESERVE → DISPATCH → SETTLE`、`RESERVE → DISPATCH → LOSS → UNKNOWN_SETTLEMENT`两条状态转移，验证相同SHA的终态`DUP_ACK`只读幂等，失联后`LATE_ACK`仅记录`IGNORED_NO_COMMIT`。信用预算恒等式：`limit = used + held + free`，`uncertain ≤ held`。**失联释放Worker槽位不等于释放预留成本**；禁止持有未确认Token再次发起同一个执行。等到独立Owner对账，再产生新修订与回退记录，不覆盖原已冻结D08。

## 具体示例与工程回退

两任务各预留2，总额度5。T1成功结算2，同SHA重复ACK不增费；T2调度后异常退出、迟到ACK被忽略，最终`used=2,held=2,uncertain=2,free=1`且`UNKNOWN_SETTLEMENT`。对照双任务正常结算为`used=4,held=0,uncertain=0,free=1`，状态`LEDGER_SETTLED`**只说明合成账本事件一致**，不认证OCCT几何或者D07消费者。超过额度、重复token、变更回执hash、错误代次或强制归零隔离额均应拒绝。

D06由`06.SolverCandidatePort`拥有写权限；GUI、CLI、Agent必须共用Owner端口并在提交时重新检查HEAD-CAS、ACL Epoch、Scope Epoch、Task/Cancel Generation和exact D01/D04/D07/Frame/Unit/Scope。单Babylon Engine/Scene/Canvas、左UnifiedTaskPanel仅做状态展示。D04工艺Setup与D10机床执行绑定分离；A/B共享来源事实但不能覆盖冻结D08。D09中立CL→D12 NC后处理→D13执行语义→D14轴时序→D15真实NC工程验证→D16发布，unknown显式阻断；CL动画≠NC验证，禁止冒充材料扫掠仿真。

恢复时必须保留原事件及Token、Worker进程/退出码、OCCT build SHA、BRep输入与输出hash、checkpoint、持久化终态ACK，独立对账后方可结案。后续运行层应做真实Worker强杀、并发乱序100次、双Setup、重启、撤权/晚回执与D07独立进程核验，必要时按L3人工批准。该文没有运行真实SQLite/OCCT/GUI/NC/OEM。

## 官方公开来源阅读深度（2026-10-30）

- [OCCT 8.0.1 BOPAlgo_Options](https://occt3d.com/dev/doc/refman/html/class_b_o_p_algo___options.html)：API章节`SetRunParallel`、`SetParallelMode`、报告接口；不证跨进程幂等。
- [Python 3.14.10 concurrent.futures](https://docs.python.org/3.14/library/concurrent.futures.html)：`Future.cancel`与`shutdown(cancel_futures)`及进程Executor章节；只作并发模型对照，未声称产品用Python。
- [Tokio 1.54.1 task](https://docs.rs/tokio/latest/tokio/task/)：取消及`spawn_blocking`章节；`abort`非强制终止已运行阻塞任务，未确认产品Rust版本。
- [SQLite Atomic Commit](https://www.sqlite.org/atomiccommit.html)：§1、§3、§4、§5；数据库事务不自动证明跨Worker的恰好一次。
- [固定CAP-06-06 Git Blob](https://github.com/BaiSongt/procet-devplans/blob/ed66ac4c71ac7c8063cb72ccdcac99c4fdcde97e/docs/capabilities/CAP-06-06/README.md)：内生设计来源，不归因于任何外部标准。作者/时间/版本/URL/访问深度/局限见[来源登记](../../../research/sources/CAP-06-06-worker-lease-b26.json)。

## 可机器复核

[5来源](../../../research/sources/CAP-06-06-worker-lease-b26.json) → [8规则/字段/CAP/原包](../../../research/traces/CAP-06-06-worker-lease-b26-v08.json) → [2正31反](worker-lease-b26-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap0606_worker_lease_b26_v08.cjs) → [执行等级](../../../tracking/cap0606-worker-lease-b26-verification-2026-10-30.json)。合成评估不代表真实Worker退出、数据库原子恢复、OCCT/NC/B5/OEM或17资产消费者签署。Owner签署0/17、独立消费者0/17、L3待人类，全仓GFM AST与历史附件原字节待验。