> **B58专项补证（2026-10-31）：** [G61/G61.1/G64及前瞻轨迹资格](TRAJECTORY-MODES-B58-2026-10-31.md) → [8规则追踪](../../../research/traces/CAP-09-06-trajectory-modes-b58-v08.json) → [61合成验收](trajectory-modes-b58-fixtures-v08.json)。实际NC/D15/B5/OEM仍NOT_RUN，L3待审。

# CAP-09-06｜NC程序驱动验证（V0.8原编号；L3待人类评审）

**原88项原文目标**：解释/执行NC并检查控制器级运动。归09机床运动与工程验证域；原关联工作包 **F1-02 / E3-04 / E3-05 / U4-04**。不重排L1/L2，不以规划通过替代产品验收。

## 业务入口与可信分层
用户从NC工作台选取 **D12最终NC的原始字节修订**，选择D10实际机床执行绑定，发起“解释并验证”。08域独立D13重新读取D12字节并按Controller Profile解释模态、循环、换刀、宏及Remap，生成带证据的typed执行事件；09域D14只根据这些事件展开物理Joint时序；09域另一个独立D15消费者检查运行覆盖、轴限位、危险路径及支持的静态干涉证据；10域D16独立审批受控发布。**D11 CL_ONLY/刀路动画/NC静态语法通过不属于D15通过**。未知控制器功能、未标定B5物理参数、轨迹采样空白和未建模安全行为必须标 `UNKNOWN` 且阻止发布。不实施材料扫掠仿真，也不假装动态碰撞连续安全已证实。

## 原编号十项实施任务（直接映射R01–R10）
1. **冻结最终NC输入（CAP-09-06-R01）**：D12最终NC原始字节与编码、文件依赖闭包及D08冻结来源精确绑定，禁止使用CL或文件名代替字节SHA。 工程字段：`input.d12FinalNcBytesHashExact`、`input.d12ByteEncodingLineMapPinned`、`input.d08FrozenReferencePinned`、`input.subprogramClosureHashPinned`；资产D08/D09/D12/D13；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S01/C0906-S02/C0906-S07/C0906-S10；[正反及字段独立变异](fixtures.json)。
2. **执行绑定及Profile（CAP-09-06-R02）**：D03资源能力、D04名义Setup和D10实际执行绑定分别校验，控制器固件/选件/后处理Profile在本次NC解释前锁定。 工程字段：`profile.d03ResourceRefExact`、`profile.d04NominalSetupSeparate`、`profile.d10ActualMachineBindingExact`、`profile.firmwareOptionsDialectHashPinned`；资产D03/D04/D10/D12/D13；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S01/C0906-S03/C0906-S05/C0906-S06；[正反及字段独立变异](fixtures.json)。
3. **最终NC模态解释（CAP-09-06-R03）**：D13重新读取最终D12字节并按方言解释G20/21、G90/91、G17、G54、G43/H、G61/64，逐块保留前后模态快照。 工程字段：`modal.d13ReparsesFinalBytes`、`modal.unitsAndDistanceModesModeled`、`modal.wcsAndToolOffsetModeled`、`modal.modalBeforeAfterRecorded`；资产D12/D13；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S02/C0906-S03/C0906-S07；[正反及字段独立变异](fixtures.json)。
4. **宏循环与重映射界限（CAP-09-06-R04）**：O/M98子程序、循环与Remap依据已锁Profile及外部依赖闭包有界展开，未知代码或递归预算耗尽UNKNOWN。 工程字段：`flow.callStackIterationRecorded`、`flow.remapDependenciesPinned`、`flow.expansionBudgetEnforced`、`flow.unknownMacroFailClosed`；资产D12/D13；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S03/C0906-S04/C0906-S05/C0906-S07；[正反及字段独立变异](fixtures.json)。
5. **控制器语义事件（CAP-09-06-R05）**：D13输出具名typed执行事件，含NC字节偏移、调用实例、模态、辅助动作与证据来源，不能采用CL片段作为执行事件。 工程字段：`events.typedD13EventsOnly`、`events.ncByteOffsetAndCallPathRetained`、`events.modalAuxiliarySemanticsRecorded`、`events.clAnimationNotExecutor`；资产D09/D12/D13/D14；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S03/C0906-S04/C0906-S05/C0906-S10；[正反及字段独立变异](fixtures.json)。
6. **独立轴时序展开（CAP-09-06-R06）**：D14只能消费D13的执行语义；按机床运动链与D10安装绑定生成关节时序，解释缺口、速度/加速度不明或未建模行为标UNKNOWN。 工程字段：`timeline.d14ConsumesD13EventHash`、`timeline.fkIkBranchAndWrapPinned`、`timeline.jointTimestampEnvelopeRecorded`、`timeline.unmodeledMotionUnknown`；资产D03/D10/D13/D14；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S05/C0906-S06/C0906-S07；[正反及字段独立变异](fixtures.json)。
7. **NC程序工程几何门禁（CAP-09-06-R07）**：D15独立检查D14轴时序与物理Joint限位、干涉覆盖，静态OCCT距离与端点取样都不构成连续安全证明。 工程字段：`engineering.jointAndAxisLimitsIndependent`、`engineering.collisionCoverageIntervalExplicit`、`engineering.unknownPhysicalModelBlocksPass`、`engineering.staticDistanceNotContinuousProof`；资产D10/D14/D15；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S06/C0906-S08/C0906-S07；[正反及字段独立变异](fixtures.json)。
8. **证据闭包与发布资格（CAP-09-06-R08）**：D15必须有独立Oracle与实际验证覆盖；UNKNOWN/STALE/REJECT无法授予D16可发布资格，D11 CL_ONLY不得替代。 工程字段：`gates.d13D14D15EvidenceClosure`、`gates.oracleIndependentOfGenerator`、`gates.unknownStaleRejectBlocksD16`、`gates.d11ClOnlyNoPromotion`；资产D11/D13/D14/D15/D16；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S07/C0906-S08/C0906-S10；[正反及字段独立变异](fixtures.json)。
9. **三入口一致与取消事务（CAP-09-06-R09）**：GUI、CLI、Agent使用同一09域Owner Port；单Babylon世界与统一左TaskPanel，提交再次重验ACL/CAS/epoch及取消晚回执。 工程字段：`transaction.guiCliAgentOneOwnerPort`、`transaction.oneBabylonLeftTaskPanel`、`transaction.aclCasEpochRecheckOnCommit`、`transaction.lateAckCancelNoWrite`；资产D13/D14/D15；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S09/C0906-S10；[正反及字段独立变异](fixtures.json)。
10. **迁移失效独立验收（CAP-09-06-R10）**：任何最终NC、控制器、D10、算法或依赖修订变化需标记D13–D16相关证据失效；配对Schema Reader可回退，不覆盖D08/D16历史。 工程字段：`handoff.dependencyGraphExactAndStale`、`handoff.pairedReaderSchemaRollback`、`handoff.independentPositiveNegativeOracle`、`handoff.originalFreezeAndReleasePreserved`；资产D08/D12/D13/D14/D15/D16；原包F1-02/E3-04/E3-05/U4-04；来源C0906-S08/C0906-S09/C0906-S10；[正反及字段独立变异](fixtures.json)。

## 接口/DTO与版本合同
- D12 `FinalNcSourceRef{revision,sha256,encoding,byteSpanMap,subprogramClosureHash,postProfileHash}` 仅08域持写权，NC行号不作主键；人工编辑创建新D12 revision，不覆盖D08冻结。
- D10 `MachineExecutionBindingRef{machineId,controllerFirmware,optionsHash,toolAssembly,HOffset,frame,revision,hash}` 由04域Owner维护，D04 `NominalSetupRef` 不得冒名实际绑定；D03资源档案只提供能力。
- D13 `NcExecutionEvent{ncByteSpan,callInstance,modalBefore,modalAfter,operation,controllerProfileHash,sourceNcHash,knownness}` 由08域独立NC执行适配产生，subprogram调用必须有实例编号，不得用CL转换结果伪造。
- D14 `AxisTimeline{sourceD13Hash,kinematicsRevision,ikBranch,jointId,t0,t1,axisUnits,positionBounds,uncertainty}` 由09域运动子模块生成；轴空间不等于Cartesian工作坐标。
- D15 `NcEngineeringEvidence{d12Hash,d13Hash,d14Hash,oracleVersion,coverage,assumptions,unknownSegments,result,consumerSignatureStatus}` 由**独立于D13/D14生成器**的09域验证消费者完成；结果枚举 `REJECT_ENGINEERING`、`UNKNOWN`、`STALE`、`REVIEW_READY`（仅在完成真实验收和人工审阅后）；规划合成 `REVIEW_READY_SYNTHETIC_ONLY` 严禁用于发布。
- D16只读取D15已签署、未失效且完整的证据闭包，在审批权限及发布前重新核对所有exact revision/hash/Frame；D17接收回执不等于上机加工通过。

## 业务流与异常流
导入锁定 → D12校验字节及依赖闭包 → D10锁定机床/控制器 → D13解析及执行适配 → 识别UNKNOWN/预算溢出并停机闭锁 → D14物理Joint轨迹展开 → D15独立核对 → 用户复核差异/证据 → 仅符合门禁时移交D16。每一节点保存输入revision、SHA-256、Frame、控制器Profile SHA及generation。D13循环导致同一NC字节位置多次执行，必须保存每次调用实例。
- 控制器未建模的G/M、宏、循环和Remap不得“跳过后继续给PASS”；参数值、固件扩展和子程序依赖不全均返回UNKNOWN。
- D14多IK分支/角度wrap不唯一、关节行程缺失、轨迹时间未知/速度与加速度证据不全都无法获得最终工程PASS。
- D15仅静态OCCT测距或稀疏插补点扫描时标明不足，不能推断路径全时段无碰；拒绝将屏幕绿色轨迹作为安全证明。
- D04或D10变化使相应D13–D16证据STALE，保留旧D08冻结、旧NC、旧D16发布历史而不沿用旧发布资格。
- 用户撤权、scopeEpoch变化、expectedRevision/CAS冲突、取消后晚ACK在**提交时**重验且不写入。A/B读同一工程事实、B不能覆盖A的D08冻结。

## 接口实现分步和交付物
先写read-only `NcVerificationPort` 及typed DTO/schema，接入D12字节锁和D10绑定；再建设D13扩展注册与未知门禁，最后逐步接通D14和独立D15。共享C0只含身份/Frame/修订/错误、事件协议，不建立巨型common实体。复用现有Host/Project、ModuleRegistry、RendererPort。每一阶段保留旧Reader可读与旧冻结快照；任何真实B5性能/碰撞结论需要独立机床测量和控制器厂家资料，当前均NOT_RUN。

## 文件与验收导航
[UI/3D交互](UI.md) · [合成DTO](contract.example.json) · [失效矩阵](invalidation-matrix.json) · [17资产Owner候选](asset-owner-candidates.json) · [合法官方来源及阅读界限](../../../research/sources/CAP-09-06.json) → [10工程规则及字段/原包追踪](../../../research/traces/CAP-09-06.json) → [30正反独立字段变异+16门禁向量](fixtures.json) · [理论分析](../../../research/topics/R-NC-PROGRAM-VERIFY-001.md) · [独立消费者/迁移](independent-consumer-handoff.md) · [Node自检](../../../tools/check_cap0906_planning_2026_10_27.cjs)。
L3与17资产正式Owner签署 `PENDING_HUMAN`；真实NC解释器/OCCT/三轴与B5/浏览器/跨域消费者 `NOT_RUN`。**规划PASS≠产品PASS**。
