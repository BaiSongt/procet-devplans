> **B27增量（2026-10-30）：** [OCCT独立Oracle选项与零距离反例](ORACLE-OPTIONS-B27-2026-10-30.md) 补足原规格的调用参数、积分失效、体积守恒非充分性及同内核共因风险；2正37反+2解析AABB仅规划合成，不能替代真实OCCT或独立D07消费者。L3待审。

# CAP-06-07｜独立校验与收敛（V0.8；L3待审）

本项沿用原11域、88项CAP及36包基线：第06域“独立Oracle、可靠值、收敛和发散曲线”，原依赖F1-05、W2-02/03/06；关联CAP-06-02至06。**设计草案，不等于真实产品通过。**

## 1. 业务流程与独立性
D06可产生多条候选工序及B-Rep去料体；独立Oracle必须从Owner签发的Project/Document/Setup、原Stock、目标零件、D07父状态、候选去料体、保护区、余量、Frame、算法版本及容差策略的精确revision/hash重新读取，再以不同进程、不同执行路径独立复算。不能把Solver自己的成功标记当成Oracle证明；只是进程隔离而算法内核相同，仍需登记共同失效风险。执行顺序：readExact→BRep/Boolean参数前置检查→独立Boolean→后态有效性→守恒/岛屿/保护区→保存证据→06 Owner Stage/Seal/CAS/ACL/任务代次重验→持久回执→05域受控采纳。

几何门禁相互独立：BRepCheck分析实体合法/封闭状态；BRepGProp仅在闭合且取向正确实体上计算体积；BRepExtrema最小距离是辅助，不等于证明无相交。受控数学必要条件为`abs(V前Stock-V去料-V后Stock) ≤ ε绝对+ε相对*abs(V前Stock)`。阈值必须有单位、Owner审批与版本，不能编造ISO通用公差。**体积一致不能代替拓扑/形状等价**；多Solid、开口腔、嵌套岛、重叠去料和薄壁逐项判定。异常/未建模状况Fail-Closed，不自动修补旧D07或覆盖D08。

## 2. 可靠值及曲线
`reliability`只有经预注册标签的独立留出集，按零件类别与错误模式分层、样本量/校准误差/模型修订记录后才可称“校准概率”；Beam排名分不可冒充百分比概率。样本不足直接`UNSUPPORTED`。收敛展示保留每轮原始几何残差、预算、失败原因、保护区指标与可信度；任何反弹、发散点不可删改或强行平滑为单调曲线。稳定窗口+独立Oracle仅作为受控停机准则，不证明全局最优；预算耗尽`BUDGET_EXHAUSTED_UNKNOWN`，不能当`PROVEN_INFEASIBLE`。

## 3. 原编号十项实施与可证伪门禁
| 子项 | 规则 | 核心字段 | 合成正反与故意错误变异 |
|---|---|---|---|
| 1 | Owner签发Project/Document/Setup的exact revision/hash/frame/head闭包 | revision、contentHash、frameHash | CAP-06-07-T01 / CAP-06-07-T02 / CAP-06-07-M01 |
| 2 | Oracle必须独立进程、二进制和重算路径，不能自证通过 | processId、generatorProcessId、binaryHash | CAP-06-07-T03 / CAP-06-07-T04 / CAP-06-07-M02 |
| 3 | BRep合法闭合、全部Solid检查完成才允许判几何合格 | valid、closed、solidCount | CAP-06-07-T05 / CAP-06-07-T06 / CAP-06-07-M03 |
| 4 | 前Stock-实际去料-后Stock体积残差必须在受控阈值内 | before、removed、after | CAP-06-07-T07 / CAP-06-07-T08 / CAP-06-07-M04 |
| 5 | 保护区不得侵入且岛屿与多环结果必须保留 | intersection、maxIntersection、islandsBefore | CAP-06-07-T09 / CAP-06-07-T10 / CAP-06-07-M05 |
| 6 | 容差单位、政策版本、数值正区间必须显式锁定 | unit、sourceUnit、epsilon | CAP-06-07-T11 / CAP-06-07-T12 / CAP-06-07-M06 |
| 7 | 可靠值只能经独立留出集且足量样本完成校准 | holdoutDisjoint、n、minN | CAP-06-07-T13 / CAP-06-07-T14 / CAP-06-07-M07 |
| 8 | 完整迭代残差含反弹点，稳定窗且独立Oracle才准称观测收敛 | raw、iterations、stableSteps | CAP-06-07-T15 / CAP-06-07-T16 / CAP-06-07-M08 |
| 9 | 预算耗尽/未知是UNKNOWN，不是已证明无解且不得发布 | budgetExhausted、status、publishAllowed | CAP-06-07-T17 / CAP-06-07-T18 / CAP-06-07-M09 |
| 10 | Owner提交复核Seal、HEAD CAS、ACL、任务代次、取消状态与D08 | stageSealed、expectedHead、observedHead | CAP-06-07-T19 / CAP-06-07-T20 / CAP-06-07-M10 |

[10项可核查来源](../../../research/sources/CAP-06-07.json) · [来源→字段→CAP→验收追踪](../../../research/traces/CAP-06-07.json) · [20正反及10变异合成样例](fixtures.json) · [Node自检](../../../tools/check_cap0607_planning_2026_10_25.cjs)。这些合成案例不调用OCCT，也非独立产品消费者。

## 4. 数据与权限边界
D06候选、D07有序材料态、D08冻结事实分别由其领域Owner受管；GUI/CLI/Agent共用`06.OracleVerificationPort`和exact DTO；AI只有提案权限。提交时必须重验HEAD-CAS、ACL、任务代次与取消；迟到回执不得写入。A/B共享工程事实但不能覆盖冻结。D04名义Setup不同于D10执行绑定。中立D09 CL→D12 NC后处理→D13控制器语义→D14轴时序→D15独立工程验证→D16发布；未知语义`UNKNOWN`，CL动画不能冒充NC验证，不做材料扫掠仿真。

## 5. 失效、迁移与交接
Stock/Frame/保护区/容差/算法版本变化仅使依赖其exact闭包的候选与下游Oracle失效，D09-D16受影响分支分别STALE；无关Setup/D08历史冻结不可变。旧reader/旧几何原字节、来源DAG、失败回执和回退映射必须保留，禁止清理用户数据库。详见[唯一Babylon世界、左TaskPanel](UI.md)、[17资产Owner候选](asset-owner-candidates.json)、[独立消费者交接](independent-consumer-handoff.md)。L3与17资产正式签署待人类审批；OCCT/NC/真实GUI及消费者`NOT_RUN`。规划PASS≠产品PASS。
