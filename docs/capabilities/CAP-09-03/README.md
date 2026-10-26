# CAP-09-03｜逆运动学与解分支（V0.8原编号，L3待审）
**原目标**：轴解、连续性、奇异点和角度规划；原包F1-02、E3-04、E3-05、U4-04。L1/L2及11域88 CAP编号不变，L3仍待人类审查。

## 业务范围与工程事实
02域D03拥有机床轴拓扑与资源限位，04域D04是**名义Setup**，D10是**实际机床/工件/刀具/控制器执行绑定**。09域从精确revision/hash/Frame推导逆解候选；08域D13必须**独立解释D12最终NC字节**；09域D14以D13事件展开轴位姿时序、D15独立做NC级工程验证，10域D16受控发布。D09中立CL仅形成D11预检，不得将其动画等同D15；任何未知RTCP、枢轴、限位或固件行为都保持UNKNOWN，不做材料扫掠仿真。

`IKRequest`至少具有D03/D04/D10 exact引用及scopeEpoch、目标`T_work_tcp`（右手系列向量，`T_A_B`将B转A）、D13模式/控制器Profile、上一个已执行Joint完整周数、求解预算和取消代次。`IKCandidateSet`持有全部candidateId/branchId、关节位置和turnCount、FK独立残差、Jacobian秩/条件值、限位证据、连续性代价、unknown原因、算法版本。多支路不可默认筛掉；数值不收敛不能伪装成功。机床B5具体参数/奇异阈值未经真实标定不得设定。

## 逐项实施、字段与机器追踪
1. **精确来源与D04/D10职责** `CAP-09-03-R01`：`refs.d03Exact`、`refs.d04NominalOnly`、`refs.d10PhysicalExact`、`refs.hashFrameRevisionExact`；来源C0903-S01/C0903-S02/C0903-S08；正反不同字段变异 P01/N01/M01。
2. **NC目标与控制器语义** `CAP-09-03-R02`：`target.rightHandedSE3`、`target.frameDirectionDeclared`、`target.d13FromFinalNc`、`target.rtcpModeKnown`；来源C0903-S01/C0903-S02/C0903-S06；正反不同字段变异 P02/N02/M02。
3. **多初值候选枚举** `CAP-09-03-R03`：`solver.methodDeclared`、`solver.multiseedBounded`、`solver.allBranchesRetained`、`solver.nonConvergenceUnknown`；来源C0903-S02/C0903-S04/C0903-S05；正反不同字段变异 P03/N03/M03。
4. **独立FK回代残差** `CAP-09-03-R04`：`oracle.independentFK`、`oracle.positionResidual`、`oracle.orientationResidual`、`oracle.unitTolerancePinned`；来源C0903-S04/C0903-S06/C0903-S07；正反不同字段变异 P04/N04/M04。
5. **多解ID与旋转周期** `CAP-09-03-R05`：`branch.stableId`、`branch.turnCountPreserved`、`branch.periodicWrap`、`branch.noImplicitFlip`；来源C0903-S02/C0903-S04/C0903-S05；正反不同字段变异 P05/N05/M05。
6. **连续性与速加速度** `CAP-09-03-R06`：`motion.seedExact`、`motion.periodicDeltaCorrect`、`motion.velocityAccelerationChecked`、`motion.noTeleport`；来源C0903-S02/C0903-S03/C0903-S04；正反不同字段变异 P06/N06/M06。
7. **Jacobian奇异判定** `CAP-09-03-R07`：`singular.rankOrCondition`、`singular.thresholdProfileExact`、`singular.nearRiskDisplayed`、`singular.unknownBlocks`；来源C0903-S03/C0903-S05/C0903-S07；正反不同字段变异 P07/N07/M07。
8. **限位不可达和碰撞** `CAP-09-03-R08`：`limits.realEvidenceOrUnknown`、`limits.axisJointBoth`、`limits.unreachableRejected`、`limits.collisionD15Separate`；来源C0903-S01/C0903-S02/C0903-S07；正反不同字段变异 P08/N08/M08。
9. **NC轴时序与验证隔离** `CAP-09-03-R09`：`nc.finalD12HashPinned`、`nc.d13Reinterprets`、`nc.d14FromD13Events`、`nc.d15RequiredBeforeD16`；来源C0903-S02/C0903-S03/C0903-S08；正反不同字段变异 P09/N09/M09。
10. **事务、GUI、撤权与回退** `CAP-09-03-R10`：`access.oneWorldLeftPanel`、`access.guiCliAgentSamePort`、`access.casAclCancelEpochCheck`、`access.frozenHistoryPreserved`；来源C0903-S08/C0903-S09；正反不同字段变异 P10/N10/M10。
每条规则对应[来源登记](../../../research/sources/CAP-09-03.json)→[逐字段规则](../../../research/traces/CAP-09-03.json)→[30项正反独立变异+5数学向量](fixtures.json)。这些是**规划合成门禁**，非真实产品算法验收。

## 独立数学反例与约束
合成平面二连杆L1=L2=1，TCP目标(1,1)至少两支解：(θ1,θ2)=(0,π/2)、(π/2,−π/2)，须各自FK回代；(3,0)不可达；伸直(2,0)时Jacobian行列式=L1L2sinθ2=0；179°到−179°周期最短差为+2°而非−358°，但是否允许动作必须再查turnCount、限位、速度、加速度、干涉。该**2R例不构成AC龙门五轴认证**，实际阈值依Profile而不是硬编码。解分支切换须显式控制、保留来源和前后完整状态。

## 系统端口、UI、失效与回退
09域`InverseKinematicsPort`提供`enumerateCandidates/independentFKCheck/analyzeSingularity/chooseBranchCAS/preview/invalidate`，GUI/CLI/Agent同一Owner入口。C0仅包含身份/单位/Frame/revision/hash/scope，绝不建立巨型机床或NC领域对象。所有写入瞬间重验ACL、CAS、scopeEpoch、generation、cancel，撤权和取消晚回执不得覆盖新场景；预览只读。A/B共享事实不覆盖D08冻结。D03/D04/D10/D12/D13/算法Profile变化传播STALE并对旧Reader/schema/Profile做成套回退，不删用户数据库；详见[失效矩阵](invalidation-matrix.json)。
[统一左TaskPanel与单Babylon](UI.md) · [合同样例](contract.example.json) · [17资产候选Owner](asset-owner-candidates.json) · [独立消费者交接](independent-consumer-handoff.md) · [专题研究](../../../research/topics/R-IK-BRANCH-001.md) · [Node规划校验入口](../../../tools/check_cap0903_planning_2026_10_27.cjs)。
**规划PASS≠产品PASS**：独立Node文件、真实OCCT/NC、B5实机、浏览器和跨域消费者NOT_RUN；17资产会签和L3 PENDING_HUMAN。
