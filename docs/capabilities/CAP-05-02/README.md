# CAP-05-02｜策略与工艺参数（V0.8原编号）
> **状态：仅规划已编制，L3/Owner待审，产品、NC、独立消费者与机床均NOT_RUN。** 不修改11域88 CAP、36原编号工作包、17业务资产。
## 业务目标与职责
本能力围绕D05人工工艺意图管理粗/半精/精加工策略，显式记录余量、精度、区域、受保护PMI、切削要求、适用条件及参数来源。允许用户比较经验模板、人工覆盖及D06候选后选择采纳，并只追加新的D05不可变修订。D03刀具与材料由02域所有，D04名义工艺Setup属04域，D07有序材料状态属06域，D09刀路属07域，D10执行绑定与D12/13/14/15/16另行处理。**D05参数预览既不是材料去除结果也不是NC工程验证。**
## 完整业务流程及异常
1. 工艺人员从当前Setup或Operation进入左侧统一TaskPanel，绑定D01 CAD occurrence、D02特征、D04工艺Setup精确id/revision/hash/frame/units；同名或相同shape不表示同一修订。
2. 建立Stage策略意图（粗/半精/精为常见组合，但不是所有工序都必须三段，本轮合成用例专门验证三段示例），每个阶段对应加工区域、保留余量、质量目标、D03刀具/材料适用依据；无证据标UNKNOWN。
3. 输入ap轴向切深、ae径向步距、vc切削速度、fz每齿进给，分别带数值、单位及来源。厂商公布`vf=fz×n×Zeff`仅在转速与有效齿数有据、材料和几何条件匹配时使用；数值是待验证工艺意图，不构成生产安全承诺。
4. 对**同一区域/同Frame/同度量**比较各阶段余量，不能仅检查平均余量。D07材料状态缺失时显示“目标余量”而非“实际已达到”。保护区释放需要CAD/PMI准确引用及独立签署，不得把质量目标标成检测合格。
5. GUI/CLI/Agent通过相同`StrategyDomainPort.query/preview/commit/cancel/compare/rollbackAsNewRevision`。Agent负责建议/对比；采纳需业务授权，提交瞬间重新检查CAS expected/current、权限、source exact hash及taskGeneration，取消后的晚回执不准覆盖新修订。
6. 采纳只新增D05 PlanRevision、差异与审计日志；旧D08冻结结果、D16发布及A/B两种流程共享事实不得覆盖。无人工规划的模式A允许独立D06探索，模式B写D05后触发精确依赖事件。
7. 下游受影响D06搜索、D07状态、D09 CL和D12-D16按源引用进行局部失效，未受影响分支保留。D09中立CL→D12后处理→D13控制器执行语义→D14轴时序→D15验证→D16受控发布，UNKNOWN保留；不做材料扫掠仿真冒充验证。
8. 异常迁移：旧字段/缺单位/错Frame/未知刀具/权限撤销/CAS冲突/版本变更均禁止默默采纳；提供旧schema只读兼容与新修订回退，不修改历史冻结对象。
## L3候选数据与接口（待审，不代表冻结schema）
`StrategyIntent={projectScope,id,revision,contentHash,routeExactRef,operationExactRef,d01ExactRef,d02ExactRef,d04ExactRef,stageIntents[],parameterSet,toolExactRef?,materialExactRef?,protectionEvidence[],overrideJournal,qualityIntent,phaseStatus}`。
`StageIntent={phase,regionExactRefs[],frame,allowances[{regionId,unit,value,evidenceKind}],materialStateRef?,parameterSetRef}`；`Parameter={kind,value,unit,sourceRef,materialApplicability,toolApplicability,derivation?,approvalState}`。
`AdoptionReceipt={newD05Revision,contentHash,sourceHashes,actorAuditRef,taskGeneration,affectedIds,invalidationManifest,casReceipt}`。Hash仅采用显式声明的规范化协议（如JCS/I-JSON profile），不能把任意JS序列化当确定性协议。C0最小公用；领域参数不进入巨型common。
## 与GUI、3D及交接
见[UI](UI.md)：单Babylon世界，左UnifiedTaskPanel，Ribbon状态联动，右Agent面板只能提议；预览选择不是commit。来源/规则/字段/独立正反验收见[追踪](../../../research/traces/CAP-05-02.json)、[合成fixtures](fixtures.json)、[研究专题](../../../research/topics/R-STRAT-001.md)。
**机器入口：** `node tools/check_cap_05_02.mjs`，仅检查9来源、10规则、20合成正反用例、4个附加故障。实际Rust/TS/Worker消费者、物理切削参数校核、NC控制器与实机测试、L3批准全部NOT_RUN。
