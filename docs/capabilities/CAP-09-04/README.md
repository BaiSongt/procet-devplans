# CAP-09-04｜刀具安装与TCP核对（V0.8原编号，L3待审）
**原目标（原88项）**：主轴安装接口、刀柄、刀尖偏置一致性。归09机床运动与工程验证域；依赖原编号工作包F1-02、E3-04、E3-05、U4-04。保持L1/L2与CAP分母不变。

## 业务闭环与唯一Owner
D03（02域）定义可复用机床主轴、接口、刀柄、切削刀具和标称参数；D04（04域）仅管理名义Setup；D10（04域）拥有特定工单/机床/控制器/夹持和刀具安装**实际绑定及测量证据**。09域消费D10 exact引用，计算安装变换及TCP位姿，不能重写资源档案。C0仅共享ID、scope、units、Frame、revision/hash与事务基元，不建全局ToolAssembly巨对象。

采用右手系列向量：`T_world_TCP = T_world_spindle × T_spindle_gauge × T_gauge_TCP`。每条变换必须标记fromFrame/toFrame、单位、修订、方向与组合顺序。**Gauge长度、装夹伸出、刀具目录总长、补偿H值、RTCP**是不同语义；只有同一基准、受控实测与控制器解释一致时才可核对。无真实B5接口类型、刀柄实际安装测量、Gauge平面、偏置数据、控制器固件和选项则返回UNKNOWN，不假设ISO 26623接口或具体锥度。

## 十个实施任务（来源→规则→字段→正反例）
1. **资源与实际绑定**（CAP-09-04-R01）——字段`refs.d03ToolAssemblyExact、refs.d04NominalSetupOnly、refs.d10PhysicalInstallExact、refs.revisionHashFramePinned`；资产D03/D04/D10；来源C0904-S02/C0904-S04/C0904-S07；[P/N/M 01](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
2. **主轴接口与刀柄连接**（CAP-09-04-R02）——字段`interface.spindleInterfaceTyped、interface.holderMatingInterfaceTyped、interface.fitProfilePinned、interface.unknownCompatibilityBlocked`；资产D03/D10；来源C0904-S01/C0904-S02/C0904-S06；[P/N/M 02](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
3. **装配轴、顺序与变换**（CAP-09-04-R03）——字段`geometry.rightHandedSE3、geometry.gaugePlaneDeclared、geometry.holderToolChainOrdered、geometry.mirrorScaleRejected`；资产D03/D10/D14；来源C0904-S02/C0904-S06/C0904-S07；[P/N/M 03](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
4. **Gauge长度与刀尖定义**（CAP-09-04-R04）——字段`gauge.gaugeToTipMeasured、gauge.unitAndDirectionDeclared、gauge.sourceMethodCalibrated、gauge.uncertaintyIncluded`；资产D03/D10/D14；来源C0904-S01/C0904-S05/C0904-S07；[P/N/M 04](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
5. **实际安装与名义资源不可混用**（CAP-09-04-R05）——字段`mount.physicalMountVerified、mount.toolHolderCuttingPartIdsPinned、mount.projectionAndStickoutPinned、mount.nominalNotPhysicalEvidence`；资产D03/D10/D15；来源C0904-S01/C0904-S05/C0904-S07；[P/N/M 05](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
6. **刀长补偿模态与H映射**（CAP-09-04-R06）——字段`offset.finalNcBytesPinned、offset.d13G43HResolved、offset.controllerVersionAndOptionsPinned、offset.tHDisagreementFailClosed`；资产D10/D12/D13/D14；来源C0904-S03/C0904-S04/C0904-S05；[P/N/M 06](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
7. **TCP与RTCP状态**（CAP-09-04-R07）——字段`tcp.tipFrameFromMountedChain、tcp.rtcpSupportEvidenceOrUnknown、tcp.independentFrameRoundTrip、tcp.noClSafetyEquivalence`；资产D10/D13/D14/D15；来源C0904-S03/C0904-S06/C0904-S07；[P/N/M 07](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
8. **尺寸/磨损/测量及失效传播**（CAP-09-04-R08）——字段`measurement.gaugeEvidenceRevisionPinned、measurement.wearSeparateFromGeometry、measurement.unitToleranceUncertaintyPinned、measurement.changeInvalidatesDownstream`；资产D03/D10/D14/D15；来源C0904-S05/C0904-S07/C0904-S09；[P/N/M 08](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
9. **NC驱动核查与发布门禁**（CAP-09-04-R09）——字段`execution.d13ReparsesFinalNc、execution.d14AxisTraceFromD13、execution.d15IndependentEngineeringVerification、execution.d16UnknownBlocked`；资产D12/D13/D14/D15/D16；来源C0904-S03/C0904-S04/C0904-S08；[P/N/M 09](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。
10. **多入口一致性事务与回退**（CAP-09-04-R10）——字段`transaction.oneBabylonLeftTaskPanel、transaction.guiCliAgentSameOwnerPort、transaction.casAclEpochCancelOnCommit、transaction.frozenHistoryNonDestructiveRollback`；资产D08/D10/D15/D16；来源C0904-S08/C0904-S09/C0904-S01；[P/N/M 10](fixtures.json)，分别验证正例、缺必要字段、另一独立字段变异。

## 端口与交互
`ToolMountTcpPort.getAssemblyD03Exact`、`bindPhysicalMountD10CAS`、`measureGaugeEvidence`、`deriveTcpFrame`、`compareControllerHState`、`invalidateDownstream`、`previewReadOnly`。GUI、CLI、Agent同领域Owner Port，同一Scope、ACL、CAS、generation、cancel及commit瞬间权限重验；点击预览不会写入。每次变更保留D08冻结与旧D16证据，不覆盖旧版本，也不删除数据库。A/B共享事实且编辑仍需新revision。

## NC工程验证与两种显示态
D09中立CL可驱动D11预检（黄色“CL_ONLY / 不代表工程验证”），但**不能直接驱动D15**。最终NC D12经08域D13重新解释G43/G49、H寄存器、换刀、控制器动态偏置/RTCP（未知则UNKNOWN），09域D14使用D13事件及D10机床链展开轴时序，D15独立检查，D16仅在所有精准引用一致且已获授权确认时可发布。Haas设置/版本与LinuxCNC行为不可混为同一Dialect。禁止材料扫掠仿真。

## 工程验收与失效
[九份合法来源及访问限制](../../../research/sources/CAP-09-04.json) → [10规则和字段/关联原编号工作包](../../../research/traces/CAP-09-04.json) → [30正反独立变异+8合成反例](fixtures.json)；[任务界面](UI.md)、[合成合同](contract.example.json)、[失效矩阵](invalidation-matrix.json)、[17资产候选Owner](asset-owner-candidates.json)、[独立消费者交接](independent-consumer-handoff.md)、[研究专题](../../../research/topics/R-TOOL-ASSEMBLY-TCP-001.md)、[规划Node校验器](../../../tools/check_cap0904_planning_2026_10_27.cjs)。
真实B5安装接口/标定/运行、NC解释器、OCCT、浏览器、消费者均NOT_RUN。所有17资产会签、L3设计审批PENDING_HUMAN。**规划PASS≠产品PASS。**
