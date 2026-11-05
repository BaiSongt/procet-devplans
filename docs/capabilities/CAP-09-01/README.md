# CAP-09-01｜机床运动学模型解析（V0.8原编号，L3待审）

**原目标**：轴树、旋转中心、正负方向、机械限制；原包 F1-02 / E3-04 / E3-05 / U4-04。保持11域88 CAP、36原包、17资产原编号不变。

02域Owner写D03资源机床运动链，04域Owner维护D04 Setup及D10实际机床执行绑定，09域只读其精确revision/hash/Frame并建立运动学计算证据。物理joint/link与逻辑轴字母明确分开，双驱龙门不得压缩成单个物理Joint；不能从STL网格/资源名称推导旋转中心、真实行程、刀长或控制器RTCP。未测真实B5配置必须UNKNOWN。

## 十项实施任务和机器验收链

1. **模型来源与D10绑定**（CAP-09-01-R01）：核查 `machine.d03Exact`、`machine.d10Independent`、`machine.revisionHashExact`、`machine.controllerExact`；正反/独立字段变异 CAP-09-01-T-P01/CAP-09-01-T-N01/CAP-09-01-M01；来源 C0901-S01、C0901-S07、C0901-S09。
2. **单根无环运动链**（CAP-09-01-R02）：核查 `graph.singleRoot`、`graph.uniqueJointParent`、`graph.noCycles`、`graph.branchesExplicit`；正反/独立字段变异 CAP-09-01-T-P02/CAP-09-01-T-N02/CAP-09-01-M02；来源 C0901-S02、C0901-S03、C0901-S08。
3. **轴标识及单位手系**（CAP-09-01-R03）：核查 `axis.jointIdsStable`、`axis.labelNotJointId`、`axis.unitsAndRightHandedness`、`axis.normalizedDirection`；正反/独立字段变异 CAP-09-01-T-P03/CAP-09-01-T-N03/CAP-09-01-M03；来源 C0901-S01、C0901-S02、C0901-S04。
4. **枢轴、旋向与配置证据**（CAP-09-01-R04）：核查 `pivot.centerKnown`、`pivot.positiveDirectionKnown`、`pivot.calibrationVersionPinned`、`pivot.noInventedB5Values`；正反/独立字段变异 CAP-09-01-T-P04/CAP-09-01-T-N04/CAP-09-01-M04；来源 C0901-S01、C0901-S03、C0901-S08。
5. **软硬限位的可追溯范围**（CAP-09-01-R05）：核查 `limit.hardSoftDistinct`、`limit.unitNormalized`、`limit.sourceVersionPinned`、`limit.unknownBlocksPass`；正反/独立字段变异 CAP-09-01-T-P05/CAP-09-01-T-N05/CAP-09-01-M05；来源 C0901-S01、C0901-S07。
6. **多驱龙门回零与耦合**（CAP-09-01-R06）：核查 `gantry.multiJointExplicit`、`gantry.homingSequenceKnown`、`gantry.couplingVerified`、`gantry.singleLetterNotSingleJoint`；正反/独立字段变异 CAP-09-01-T-P06/CAP-09-01-T-N06/CAP-09-01-M06；来源 C0901-S02、C0901-S04。
7. **正解数学与独立Oracle**（CAP-09-01-R07）：核查 `fk.framesOrdered`、`fk.inverseChecked`、`fk.determinantPositive`、`fk.independentMathOracle`；正反/独立字段变异 CAP-09-01-T-P07/CAP-09-01-T-N07/CAP-09-01-M07；来源 C0901-S03、C0901-S05、C0901-S06、C0901-S08。
8. **D13到D14的NC执行链**（CAP-09-01-R08）：核查 `pipeline.finalNcBytesExact`、`pipeline.d13Independent`、`pipeline.d14ConsumesD13`、`pipeline.clNotNcVerification`；正反/独立字段变异 CAP-09-01-T-P08/CAP-09-01-T-N08/CAP-09-01-M08；来源 C0901-S02、C0901-S03、C0901-S08。
9. **变化失效与成套回退**（CAP-09-01-R09）：核查 `change.dependencyClosure`、`change.downstreamStale`、`change.freezePreserved`、`change.rollbackPairVerified`；正反/独立字段变异 CAP-09-01-T-P09/CAP-09-01-T-N09/CAP-09-01-M09；来源 C0901-S09、C0901-S10。
10. **单Babylon GUI与提交事务**（CAP-09-01-R10）：核查 `ui.oneBabylonWorld`、`ui.unifiedLeftTaskPanel`、`commit.casAclFrameEpochChecked`、`commit.cancelLateAckRejected`；正反/独立字段变异 CAP-09-01-T-P10/CAP-09-01-T-N10/CAP-09-01-M10；来源 C0901-S09、C0901-S10。

## 数据、接口、算法与事务

运动链必须有唯一root Link、stable JointID、parent/child无环、axis单位向量、关节类型、枢轴修订与运动范围证据。数学约定为右手系、列向量和左乘，`T_world_child=T_world_parent*T_parent_pivot*JointMotion(q)*T_pivot_child`；这是项目模型选择，非ISO未读条款。矩阵逆一致性/正交性、det>0和三轴/合成AC向量可由独立数学Oracle验证，但不证明真实机床几何或安全。

D03是资源能力档案，D10是执行机床/刀具/控制器Profile/偏置绑定；C0仅公共assetId/schemaVersion/revision/hash/frame/units/scope，不放机器拓扑、Babylon节点或NC控制器模态。09域建议Port：`readExact(D03,D10)`、`validateJointTree()`、`resolveFrameGraph()`、`computeFK()`、`commitCandidateCAS()`、`invalidateConsumers()`。GUI/CLI/Agent同领域入口，提交瞬间重验ACL、CAS、Frame、scopeEpoch、generation、cancelled，拒绝撤权和取消晚回执。A/B共享事实不覆盖D08冻结，旧Reader/旧schema和Profile成套回退，不删除用户数据库。

业务链：D09中立CL只可用于D11 CL级预检查；最终工程验证必须D12最终NC→D13控制器语义独立重读→D14轴运动时序→D15工程验证→D16发布。未知语义UNKNOWN不发布，CL动画不冒充D15；不做材料扫掠仿真。

## 研究与验收导航

[单Babylon/左TaskPanel](UI.md) · [合成机床](contract.example.json) · [正反及数学向量](fixtures.json) · [候选Owner](asset-owner-candidates.json) · [失效回退](invalidation-matrix.json) · [10来源](../../../research/sources/CAP-09-01.json) → [理论](../../../research/topics/R-MACHINE-KINEMATICS-GRAPH-001.md) → [规则](../../../research/traces/CAP-09-01.json) → [机器校验](../../../tools/check_cap0901_planning_2026_10_26.cjs) · [消费者交接](independent-consumer-handoff.md)。

仅规划合成30例与5数学样例；真实Node脚本运行、OCCT、NC、控制器、B5、GUI及独立消费者NOT_RUN。17资产Owner与L3正式签署PENDING_HUMAN。**规划PASS≠产品PASS**。
