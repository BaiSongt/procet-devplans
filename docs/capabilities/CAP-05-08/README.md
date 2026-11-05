# CAP-05-08｜规划校核与交接（V0.8原编号）
> 05域D05业务Owner，L1/L2原基线不变，L3与全部17资产会签待审。本文是实施前的业务规格，不是产品PASS。

## 业务边界和准入状态
工艺计划提交前要验证“**可移交下一领域**”而不是“工件可加工或NC已验证”。状态枚举：`INCOMPLETE`（显式缺项）、`UNKNOWN`（证据不足）、`BLOCKED`（已知冲突）、`READY_FOR_HANDOFF`（规划输入符合交接前提）、`CONSUMER_ACCEPTED`（D06先独立接收求解输入；D09另需D07/D08 exact证据，仍非工程验证）。异常码有Owner、来源、受影响工序、下一可行动作。跨域提升资格需由相应领域提供独立证据，不能由05域自行颁发。

## 责任与统一数据结构
05域仅写D05校核记录/受控交接与新的D05 revision；D08已冻结快照不可变。D01/D02由03域、D03由02域、D04与D10按其原Owner区分、D06/D07由06域、D09由07域、D12/D13由08域、D14/D15由09域、D16/D17由10域提供精确只读输入或独立回执。C0最小公共`ExactRef{id,revision,hash,frame,schemaVersion,scope}`、单位、CAS与身份，不承载整个制造领域。正式字段/Owner会签另行完成。

`PlanReadinessCheck{scope,branch,planExactRef,sourceExactRefs[],requiredOps[],dependencyEdges[],featureOccurrenceBindings[],setupFrameProof,resourceCapabilityRefs[],freezeRefs[],changeClosure[],actor,expectedRevision,taskGeneration,scopeEpoch,dimensionResults[],nextActions[]}`；`PlanHandoffReceipt{newD05ExactRef,producerPort,consumerDomain,consumerAck,status,sourceHashes,provenance,auditId}`。任何参照latest、缺hash/frame或不明单位都必须UNKNOWN，不能捏造默认值。结构化摘要Profile版本化（参考RFC8785），原NC字节不得改写。

## 业务流程（必须独立验收）
1. `inspect`固定D01/D02/D03/D04/D05/D08及B分支人工工序或A分支求解后采纳来源；D05可为空时A允许启动D06求解但不得假称已有可交接计划，B可直接创建受控D05计划。
2. `preview`依次核对稳定工序ID和无环DAG、特征occurrence与目标、策略和余量单位、D03支持矩阵及刀具装配、D04名义Setup/Frame和夹具保护证据、D08冻结/审批。D10只作为后续执行绑定，不反向填充D04。
3. 展示受影响子图与不受影响资产；D05变更只让相关D06/D07及D09→D12→D13→D14→D15→D16失效，历史D08/D16保持不可变。D13任何unknown禁止复用D15旧PASS和D16发布，D11 CL演示不等于NC验证，不做材料扫掠仿真。
4. `commitHandoff`必须在提交瞬间重新验证权限、scopeEpoch、taskGeneration、expectedRevision及全部source hash。取消、撤权、CAS失败、旧generation回执均拒绝；写入append-only审计，新D05修订仅由05域写。A/B可共用事实但不覆盖另一分支头。
5. D06独立消费D05计划就绪引用后才从READY_FOR_HANDOFF变为CONSUMER_ACCEPTED；D07有序材料状态和D08冻结快照都具备exact证据后，D09才能作为后续消费者接收输入并自行生成中立CL。拒收可恢复待处理并保留失败原因。回退总是fork新修订，旧工程缺身份/hash/frame采用只读versioned adapter出UNKNOWN和人工迁移任务，不删用户数据。

## GUI/CLI/Agent与可扩展性
三个入口共用`PlanReadinessDomainPort`，Host做权限/CAS/取消仲裁；单Babylon世界、统一左TaskPanel，右Agent显隐独立，浅/深主题与最大12px字体。未来FMS/DNC/MEMS可作为**下游独立消费者**订阅明确版本事件，不额外绕开领域Port或覆盖已冻结工艺。工具执行等待、取消和错误状态都必须可见，3D选择只读。

## 原编号包、规则和测试入口
本CAP映射原W2-02（冻结与接管）、W2-03（依赖失效）、W2-05（跨Setup可寻址），不新造工作包，也不把原W2-01/02/03算实施完成。独立测试需包括实服务、消费者隔离环境与反例；参见[界面](UI.md)、[DTO](contract.example.json)、[门禁](handoff-gates.json)、[17资产候选Owner](asset-owner-candidates.json)、[研究来源](../../../research/sources/CAP-05-08.json)、[规则/20正反](../../../research/traces/CAP-05-08.json)、[测试输入](fixtures.json)、[独立消费者交接](independent-consumer-handoff.md)、[研究边界](../../../research/topics/R-PLAN-GATE-001.md)。

规划工具：`node tools/check_cap_05_08.mjs`（规划数据/合成fixture，只在本地实际运行后能标记文件执行PASS）；真实Rust/TS/OCCT/NC/机床/独立消费者均NOT_RUN。