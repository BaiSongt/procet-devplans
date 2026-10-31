> **B73研究补证（2026-11-01）**：[离线事件重放、OPC Store/StoreAndStart及D17收件资格](OFFLINE-EVENT-REPLAY-B73-2026-11-01.md) → [来源](../../../research/sources/CAP-10-06-offline-events-b73.json) → [规则/原E3-06、T5-03](../../../research/traces/CAP-10-06-offline-events-b73-v08.json) → [48规划合成](offline-events-b73-fixtures-v08.json)；独立Node/真实MES/OPC/17消费者NOT_RUN，L3待审。**规划PASS≠产品PASS。**

# CAP-10-06｜现场执行与工单（V0.8，L3待审）
**原88项基线原文**：作业指导、交付记录及工单关联；原编号E3-06 / T5-03。长期扩展能力；本次仅规划，不宣称MVP已实现或工厂现场已接入。

## 业务责任与不变边界
- 10域`WorkOrderExecutionPort`管理**本系统工单执行投影、作业指导冻结引用、现场签收请求**；ERP/MES工单ID及状态的源Owner仍在外部业务系统，不能被本地投影擅自覆盖。工单不是第18类资产，继续依托D16受控发布和D17现场事件记录；17资产编号不变。
- D03机床/Profile由02域Owner；D04是04域名义Setup，D10是独立现场执行机床/刀具/夹具/Frame绑定；D12最终NC原字节、D13语义解释、D14真实Joint运动时序、D15独立工程验证各保留Owner，D16受控发布，D17仅**append-only**现场反馈。中立CL播放或设备灯亮不能证明NC已执行；UNKNOWN/CL_ONLY不得申请上机许可，不做材料扫掠仿真。
- 排产工单`Ready`、作业指导签收、复制NC文件、DNC上传、实际`CycleStart`、NC工程安全和合格完工是**不同事实**。界面与Port只登记经独立证据的事件，**不提供远程启机权**。OPC ISA-95 JobControl的`StoreAndStart`是可选方法且须单独能力授权；本CAP不绑定或调用。
- C0仅identity、revision、SHA-256 byte digest、unit、frame、scope、protocol；严禁巨型common。A/B同事实只可非破坏引用冻结D08，不因现场投影生成而回写已批准计划。L1/L2不改，L3待人类审阅。

## 工作流与十项实施任务
**正常流程**：MES工单授权读取 → 10域创建只读投影 → 绑定D16签发包和D12字节 → 现场独立核验D10资源与Frame → 展示冻结作业指导/扫码签收 → 在显式授权下接收D17观察事件及人工交付记录 → 独立质检和ERP回执确认 → 结束投影但不自动启机、放行或覆盖原件。

**异常流程**：离线、旧协议只有已弃用的ProductionJob节点、不同设备jobId碰撞、工单撤销、NC换版、Frame不一致、报警中断、重做、质量检验滞后、复制成功却无机床响应、ACL被撤销、取消后晚到ACK。统一反馈`UNKNOWN`/`STALE`/`BLOCK_RELEASE`/`REJECT`；D17保留append事件，不臆造补齐执行或合格。

- **T01｜工单身份与MES来源**：原ERP/MES工单ID与修订/机床分派独立核对，名称相似不可自动关联。输入`workOrder.jobIdExact`, `workOrder.erpRevisionPinned`, `workOrder.assignmentMachineExact`, `workOrder.noDisplayNameOnlyJoin`；来源C1006-S01/C1006-S02/C1006-S07; 只允许10域工单协作端口提交，异常和拒绝按[R01](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T02｜作业指导冻结与离线交付**：作业指导与已签发NC/工具/工装引用版本和字节哈希冻结，离线收方重新校验，不因新指导覆盖A/B冻结。输入`instruction.revisionHashPinned`, `instruction.d16ApprovedPackageExact`, `instruction.offlineDigestRechecked`, `instruction.planAndAsBuiltSeparate`；来源C1006-S01/C1006-S03/C1006-S07; 只允许10域工单协作端口提交，异常和拒绝按[R02](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T03｜实际Setup与工装核验**：D04名义设置不冒充D10执行绑定；机床、夹具、刀具及Frame缺失必须UNKNOWN。输入`execution.d04NominalOnly`, `execution.d10ActualFrameExact`, `execution.toolFixtureMachineRevision`, `execution.unknownBlocksRelease`；来源C1006-S02/C1006-S05/C1006-S07; 只允许10域工单协作端口提交，异常和拒绝按[R03](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T04｜工单生命周期事件**：Queued/Ready/Running/Paused/Aborted/Completed等须有可核状态转移证据，不从排产状态触发机床动作。输入`lifecycle.stateGraphExplicit`, `lifecycle.transitionEvidenceRef`, `lifecycle.abortResumeDistinct`, `lifecycle.noImplicitMachineStart`；来源C1006-S01/C1006-S02/C1006-S03; 只允许10域工单协作端口提交，异常和拒绝按[R04](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T05｜上机授权与验证隔离**：D15独立NC工程验证、人类D16签发、现场操作者授权彼此不能替代，计划单无CycleStart权。输入`authorization.d15IndependentAccepted`, `authorization.d16HumanSigned`, `authorization.localOperatorAuthority`, `authorization.noPlanAsCycleStart`；来源C1006-S01/C1006-S02/C1006-S06; 只允许10域工单协作端口提交，异常和拒绝按[R05](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T06｜产量、质量与返工边界**：设备运行完成、产出件数、合格/报废/返工不能混同，质量依赖独立检验。输入`quantity.unitAndDimensionExplicit`, `quantity.goodScrapReworkSeparate`, `quantity.completionNotQualityPass`, `quantity.independentInspectionLinked`；来源C1006-S01/C1006-S04/C1006-S05; 只允许10域工单协作端口提交，异常和拒绝按[R06](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T07｜事件时钟、数据质量与来源**：D17事件追加记录时区/Source/Server/Ingest、质量与原始摘要，断网与迟到证据不伪造。输入`evidence.sourceTimeAndIngestSeparate`, `evidence.d17AppendOnly`, `evidence.unavailableGapVisible`, `evidence.deviceRevisionPinned`；来源C1006-S03/C1006-S07/C1006-S08; 只允许10域工单协作端口提交，异常和拒绝按[R07](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T08｜工单与最终NC执行关联**：最终NC原始字节与工单关联需要控制器/独立证据，MDC运行灯不得宣称程序已执行。输入`link.finalNcRawDigestExact`, `link.jobToProgramEvidence`, `link.d13d14d15ReadOnly`, `link.telemetryNotProof`；来源C1006-S01/C1006-S03/C1006-S05; 只允许10域工单协作端口提交，异常和拒绝按[R08](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T09｜CAS、权限与取消晚回执**：所有现场记录提交前重新核权限、scope、CAS exact修订/hash，撤权/取消/晚ACK拒绝写入。输入`auth.scopeEpochRechecked`, `auth.aclEpochRechecked`, `auth.revisionHashCAS`, `auth.cancelLateAckRejected`；来源C1006-S02/C1006-S06/C1006-S07; 只允许10域工单协作端口提交，异常和拒绝按[R09](../../../research/traces/CAP-10-06.json)及正反例检验。
- **T10｜同域Port、唯一3D与无损回退**：GUI/CLI/Agent经同一10域Port，唯一Babylon和左TaskPanel，旧Reader双读与回退不覆盖历史。输入`ui.singleDomainPort`, `ui.singleBabylonWorld`, `ui.leftTaskPanel`, `ui.shadowRollbackPreservesHistory`；来源C1006-S06/C1006-S07/C1006-S08; 只允许10域工单协作端口提交，异常和拒绝按[R10](../../../research/traces/CAP-10-06.json)及正反例检验。

## 来源→规则→字段→CAP/包→独立正反验收
| 规则 | 关键要求 | 已核来源ID | 字段路径（逐字段独立负例） | 业务资产 | 原编号包 |
|---|---|---|---|---|---|
| CAP-10-06-R01 | 工单身份与MES来源 | C1006-S01、C1006-S02、C1006-S07 | `workOrder.jobIdExact`，`workOrder.erpRevisionPinned`，`workOrder.assignmentMachineExact`，`workOrder.noDisplayNameOnlyJoin` | D01/D03/D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R02 | 作业指导冻结与离线交付 | C1006-S01、C1006-S03、C1006-S07 | `instruction.revisionHashPinned`，`instruction.d16ApprovedPackageExact`，`instruction.offlineDigestRechecked`，`instruction.planAndAsBuiltSeparate` | D08/D12/D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R03 | 实际Setup与工装核验 | C1006-S02、C1006-S05、C1006-S07 | `execution.d04NominalOnly`，`execution.d10ActualFrameExact`，`execution.toolFixtureMachineRevision`，`execution.unknownBlocksRelease` | D03/D04/D06/D10/D16 | T5-03 / E3-06 |
| CAP-10-06-R04 | 工单生命周期事件 | C1006-S01、C1006-S02、C1006-S03 | `lifecycle.stateGraphExplicit`，`lifecycle.transitionEvidenceRef`，`lifecycle.abortResumeDistinct`，`lifecycle.noImplicitMachineStart` | D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R05 | 上机授权与验证隔离 | C1006-S01、C1006-S02、C1006-S06 | `authorization.d15IndependentAccepted`，`authorization.d16HumanSigned`，`authorization.localOperatorAuthority`，`authorization.noPlanAsCycleStart` | D10/D12/D13/D14/D15/D16 | T5-03 / E3-06 |
| CAP-10-06-R06 | 产量、质量与返工边界 | C1006-S01、C1006-S04、C1006-S05 | `quantity.unitAndDimensionExplicit`，`quantity.goodScrapReworkSeparate`，`quantity.completionNotQualityPass`，`quantity.independentInspectionLinked` | D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R07 | 事件时钟、数据质量与来源 | C1006-S03、C1006-S07、C1006-S08 | `evidence.sourceTimeAndIngestSeparate`，`evidence.d17AppendOnly`，`evidence.unavailableGapVisible`，`evidence.deviceRevisionPinned` | D03/D17 | T5-03 / E3-06 |
| CAP-10-06-R08 | 工单与最终NC执行关联 | C1006-S01、C1006-S03、C1006-S05 | `link.finalNcRawDigestExact`，`link.jobToProgramEvidence`，`link.d13d14d15ReadOnly`，`link.telemetryNotProof` | D12/D13/D14/D15/D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R09 | CAS、权限与取消晚回执 | C1006-S02、C1006-S06、C1006-S07 | `auth.scopeEpochRechecked`，`auth.aclEpochRechecked`，`auth.revisionHashCAS`，`auth.cancelLateAckRejected` | D01/D10/D16/D17 | T5-03 / E3-06 |
| CAP-10-06-R10 | 同域Port、唯一3D与无损回退 | C1006-S06、C1006-S07、C1006-S08 | `ui.singleDomainPort`，`ui.singleBabylonWorld`，`ui.leftTaskPanel`，`ui.shadowRollbackPreservesHistory` | D01/D03/D10/D16/D17 | T5-03 / E3-06 |

- [8项合法来源及实际阅读范围](../../../research/sources/CAP-10-06.json) → [10规则40字段及原包映射](../../../research/traces/CAP-10-06.json) → [50正反字段用例＋22门禁](fixtures.json) → [独立消费者交接](independent-consumer-handoff.md)。**各规则每字段单独变异**，不使用“一项错、多字段一起错”的伪覆盖。
- 关键外部证据：OPC 40001-3 v1.0.1 §6.2/§7.2将JobOrderControl与Results区分；OPC 10031-4 v2.00.0 §1/§6.2描述JobOrder/Response与1.0不兼容；OPC 40501-1 v1.02.0 §8.4旧Job模型已弃用、完工计数不等于质量；ISO 22400-2:2014只读合法摘要（2026 DIS拟修订），不引用未读条款；NIST AMS 400-1仅著录摘要。
- **Machine guard**：对任何`D15 UNKNOWN`、`D16签发缺失`、`D10实际绑定未知`、`无现场操作者授权`，均不能由排产/工单/作业指导/UI/Agent/遥测生成`CycleStart`能力。本CAP规划检查绝不连接实机。

## UI、迁移与验收边界
[GUI/CLI/Agent与3D](UI.md) · [接口合成示例](workorder-contract.json) · [17资产候选Owner接口](asset-owner-candidates.json) · [源于业务的独立消费者测试清单](independent-consumer-handoff.md) · [专题推导](../../../research/topics/R-WORKORDER-EXECUTION-001.md) · [机器检验入口](../../../tools/check_cap1006_planning_2026_10_27.cjs)。
原D16/D17真值由Owner读，UI仅投影。Expand→shadow双读旧MES映射与新Port→独立消费者签收→逐步迁移；错误时回退旧Reader，不删除D17事实，不覆盖D08冻结、原工单或D16签发包。全部实际产品、工厂、NC/浏览器、独立Node文件执行**NOT_RUN**；17项Owner正式会签及L3批准**PENDING_HUMAN**。**规划PASS≠产品PASS。**
