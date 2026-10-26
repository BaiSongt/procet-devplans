# CAP-09-07｜干涉、限位与可达性（V0.8原编号；L3待人类评审）

**原88项目标原文**：干涉、限位与可达性——“机械软硬限位、刀具夹具工件碰撞”。归09域；关联原工作包 **F1-02 / E3-04 / E3-05 / U4-04**。L1/L2不变，L3仍待评审；不增加CAP或工作包编号。

## 业务目标与已知边界
从**D12最终NC的精确字节**出发，经08域D13控制器语义解释、09域D14真实物理Joint轴时序展开，09域**独立D15工程Oracle**对时间覆盖、限位、干涉与可达性证据进行审查，最后由10域D16独立审批。D11中立CL预检和Babylon播放只能供分析，**不能冒充NC工程验证**。不实现材料扫掠仿真，不宣称OCCT静态距离可证明连续轨迹无碰。B5实际限位、枢轴、夹具、刀柄、控制器与误差若无实测则`UNKNOWN`，不能使用任意演示数字伪造工程PASS。

## 十项实施任务、工程字段与理论-验收映射
1. **CAP-09-07-R01 冻结执行证据闭包**：仅接受D12最终NC字节→D13语义→D14物理Joint时序，并绑定D10实际执行配置与D08冻结。不可由中立CL/D11预检查提升为工程验证。 字段：`inputs.finalNcRevisionHashPinned`、`inputs.d13ExecutionEventsHashPinned`、`inputs.d14PhysicalJointTimelineHashPinned`、`inputs.d10ActualBindingFrameExact`；来源：C0907-S03、C0907-S04、C0907-S09、C0907-S10；资产：D08、D10、D11、D12、D13、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
2. **CAP-09-07-R02 双层限位与物理归零状态**：轴字母软限位与每个物理Joint限位、归零、旋转周数、行程单位独立检查；A/B共享来源但各自运行绑定不得借用。 字段：`limits.axisEnvelopeRevisionPinned`、`limits.physicalJointEnvelopeRevisionPinned`、`limits.homedStateProvenancePinned`、`limits.rotaryWrapAndUnitsKnown`；来源：C0907-S01、C0907-S03、C0907-S04；资产：D03、D10、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
3. **CAP-09-07-R03 运动连续性与动态不确定性**：分段覆盖D14时间区间与速度/加速度/暂停/换刀运动；不具控制器时间或动态参数证据时标UNKNOWN，不以端点跳帧插值代替。 字段：`motion.t0t1CoverageComplete`、`motion.jointVelocityAccelerationEnvelopePinned`、`motion.ikBranchContinuousOrExplicitBreak`、`motion.unknownTimingFailClosed`；来源：C0907-S03、C0907-S04、C0907-S06、C0907-S08；资产：D10、D13、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
4. **CAP-09-07-R04 完整几何对象与碰撞对**：校核刀具、刀柄、主轴、机器运动部件、夹具、毛坯和保护几何；排除对只可来自经审核的结构拓扑，未建模/未标定形状=UNKNOWN。 字段：`collision.toolHolderSpindleGeometryPinned`、`collision.machineJointLinksPinned`、`collision.fixtureStockProtectedPairsPinned`、`collision.exclusionsAuditableAndScoped`；来源：C0907-S05、C0907-S06、C0907-S07；资产：D01、D03、D04、D10、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
5. **CAP-09-07-R05 静态距离与连续轨迹覆盖分离**：OCCT DistShapeShape仅核对指定姿态的静态距离；连续无碰结论必须有独立时间段覆盖证书/有界保守证明，端点采样和静态最小距不升级安全PASS。 字段：`clearance.staticOracleAndIsDoneRecorded`、`clearance.intervalCoverageCertificatePinned`、`clearance.sampleOnlyNeverPromoted`、`clearance.uncertaintyAndMarginBudgetPinned`；来源：C0907-S05、C0907-S08、C0907-S06；资产：D10、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
6. **CAP-09-07-R06 碰撞接触、切削和允许域分类**：将受控切削刀尖接触与刀柄/机床/夹具危险干涉分离；允许的刀具工件接触只在冻结工序范围有效，不能全局关闭碰撞检测。 字段：`contact.allowlistOperationScopePinned`、`contact.toolTipMaterialIntentSeparated`、`contact.holderFixtureMachineAlwaysChecked`、`contact.protectedGeometryNoBypass`；来源：C0907-S05、C0907-S07、C0907-S08；资产：D07、D08、D10、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
7. **CAP-09-07-R07 工程结果分级与发布隔离**：有独立危险证据则REJECT_ENGINEERING；证据不充分、未建模控制器行为或覆盖缺口=UNKNOWN；STALE/取消/撤权优先；仅真实独立验证且人工复核后才可能交D16。 字段：`result.rejectUnknownStaleDistinct`、`result.independentD15OracleIdentity`、`result.evidenceCoverageAndKnownnessPinned`、`result.d16NeverAcceptsSyntheticOrClOnly`；来源：C0907-S03、C0907-S05、C0907-S07、C0907-S09；资产：D11、D13、D14、D15、D16；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
8. **CAP-09-07-R08 同域入口与可交互诊断**：GUI/CLI/Agent只能调用09域SafetyVerificationPort；单Babylon世界与左TaskPanel；诊断从NC调用实例映射D14关节、时间区间和危险几何对。 字段：`ui.guiCliAgentSameOwnerPort`、`ui.singleBabylonAndLeftTaskPanel`、`ui.ncCallInstanceTimelineJointPairLinked`、`ui.no3DColorEquivalentToSafetyPass`；来源：C0907-S04、C0907-S07、C0907-S09；资产：D12、D13、D14、D15；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
9. **CAP-09-07-R09 事务取消与并发重验**：提交之前Owner再次核对ACL、CAS expectedRevision、Frame、scopeEpoch和取消令牌；晚回执只读不能触发D15新版本，也不能修改冻结记录。 字段：`tx.aclAndRoleRecheckOnCommit`、`tx.expectedRevisionCasAndFrameExact`、`tx.scopeEpochAndCancellationChecked`、`tx.lateAckNoCommitOrRelease`；来源：C0907-S09、C0907-S10；资产：D08、D10、D14、D15、D16；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。
10. **CAP-09-07-R10 失效迁移与独立消费者交接**：D03/D04/D10/D12/D13/D14及碰撞模型/算法/阈值变化按依赖图标STALE，新旧Reader配对迁移可回退；独立消费者正反、窗口覆盖和伪证反例必须实测而非自签。 字段：`handoff.dependencyInvalidationExact`、`handoff.pairedSchemaReadersRollback`、`handoff.separateOracleAndNegativeTests`、`handoff.frozenHistoryPreserved`；来源：C0907-S06、C0907-S07、C0907-S09、C0907-S10；资产：D03、D04、D08、D10、D12、D13、D14、D15、D16；原工作包：F1-02 / E3-04 / E3-05 / U4-04；机器正反验收见[fixtures.json](fixtures.json)。

## 验证业务流
用户选择FinalNC SHA与D10实际机床/刀柄/装夹绑定 → 读取D13执行实例与D14时间轴 → 冻结对象形状/碰撞允许配对/限位证据 → D15独立双限位和IK可达检查 → 对每段运动记录几何对、时间区间、静态观测与连续覆盖证明来源 → 产生REJECT_ENGINEERING/UNKNOWN/STALE/人工复核候选 → 提交前CAS/ACL/epoch/取消再次检查 → 仅真实独立验证有效且经人类审批的D15证据才可移交D16。

**异常流**：未知控制器模态、缺少真实机器参数、只检查端点、形状已失效、物理Joint越界、准许切削接触范围外、双驱门架一侧未建模、换刀运动缺失、A/B冻结版本冲突、取消后的晚ACK、离线校验无法获得签署证据。每项必须有独立Oracle、状态原因和可重现的时间/NC字节关联；几何证据未知不能“按安全处理”。

## 不共享写权的数据与DTO
- D03资源能力与`MachineGeometryRef{revision,linkGraphHash,limitSource,nominalFrame}`由02域Owner维护；不是实际本次机床执行绑定。
- D04`NominalSetupRef{revision,stockFrame,fixtureFrame}`由04域维护；D10`ActualExecutionBindingRef{revision,sha256,controllerProfile,fixtureMeasuredFrame,toolAssembly,homedStatus}`由04域另一个执行绑定端口维护。
- D12字节闭包/D13解释实例分别由08域产生；D14 `PhysicalJointSegment{jointId,t0,t1,q0,q1,wrap,ikBranch,velocityEnvelope,evidenceHash}`由09域运动展开Owner产生。
- D15 `NcSafetyEvidence{inputsRevisionClosure,frame,collisionPairs,axisLimits,jointLimits,intervalCoverage,uncertainty,oracleHash,status}`由09域**独立消费者**产生，不能让D14生成器自签。
- D16发布包仅消费经人工批准且未失效的D15真实证据，不消费此处的合成`REVIEW_READY_SYNTHETIC_ONLY`。
- 端口、字段及消费者见[可机读接口合同](interface-contract.json)和[17资产Owner候选](asset-owner-candidates.json)，Owner正式会签尚未发生，状态`PENDING_HUMAN`。

## 几何与算法路线
几何检测拆成Broad Phase（运动部件AABB/BVH候选集合）和Narrow Phase（选定姿态B-Rep静态距/重叠检查），再做**时间区间覆盖层**：需要外部已验证的运动/位姿上界或独立连续碰撞Oracle；不能用均匀采样替代。合成一维界示例：若两端距离最小值为`d_min`、已被独立验证的全区间最大距变化上界`Δ`、不确定性/安全裕量`m`，只有`d_min-Δ>m`才可能是**数学候选**，仍需几何/数据适用性证明及独立Oracle。缺乏有效`Δ`即UNKNOWN；此简式不是OCCT安全证明、也不是当前产品算法。

`MechanicalLimitFinding`分笛卡尔AxisLimit、物理JointLimit、速度/加速度与归零；旋转周数/双驱龙门不可折叠成“XYZ在范围内”。对有危险接触证人的区间明确REJECT；对不完整区间/未建模几何UNKNOWN；不以NIST论文或ISO公开摘要推导具体B5工程数值。

## GUI / CLI / Agent
入口统一09域`SafetyVerificationPort.request`；左侧唯一TaskPanel选择NC、机床、时序、物理对象和证据；全局唯一Babylon Scene展示时间轨迹及碰撞对，不产生第二场景。CLI示意`procet verify collision --d12-ref ... --d10-ref ...`只是**设计接口，非已实现命令**；Agent同域Port、不可越过人工复核。详见[UI.md](UI.md)。

## 异常、失效、迁移及独立验收
精确revision/hash/Frame不一致时转STALE；取消/撤权/CAS冲突不提交；新旧Schema Reader成对灰度迁移，未能证明的旧内容只读并回退，D08冻结、D16历史绝不覆盖。独立消费者须用真实NC/控制器与分开的碰撞Oracle产生相反/阳性案例；不运行不得记PASS。详见[独立消费者交接](independent-consumer-handoff.md)、[10来源](../../../research/sources/CAP-09-07.json)、[10规则追踪](../../../research/traces/CAP-09-07.json)及[专题研究](../../../research/topics/R-LIMIT-COLLISION-001.md)。

**验证边界**：30个字段合同+20个状态门禁+6个保守界数例仅规划合成规格；`node tools/check_cap0907_planning_2026_10_27.cjs`为待执行/可执行的规划校验器，不证明产品NC、OCCT或机床。所有实际产品与Owner会签`NOT_RUN/PENDING_HUMAN`。**规划PASS≠产品PASS**。
