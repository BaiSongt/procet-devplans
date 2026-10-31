> **B70（2026-10-31）新增：** [Joint整圈旋转与Babylon端点姿态不可混同](ROTARY-WINDING-B70-2026-10-31.md) → [7来源](../../../research/sources/CAP-09-08-joint-winding-b70.json) → [8规则](../../../research/traces/CAP-09-08-joint-winding-b70-v08.json) → [55条规划合成](joint-winding-b70-fixtures-v08.json)。真实D15/D16及B5/OEM未验，L3待审。

# CAP-09-08｜仿真播放与校验报告（L3待审）

**原目标**：| CAP-09-08 | 仿真播放与校验报告 | 统一3D播放、事件证据、可追溯结论 | F1-02 / E3-04 / E3-05 / U4-04 | 基础边界与有限场景接入；完整能力需独立验证 |  
本条是原88 CAP中的第70项详细规划，不变更11域/L1/L2/36原编号包/17资产。业务边界：08域D12最终NC→D13控制器语义→09域D14物理Joint时序→09域不同实现D15独立工程验证→10域D16受控发布。D11的CL_ONLY动画、D14纯播放与D15工程校验不得混同，不做材料扫掠仿真。

## 十项施工任务（对应原F1-02/E3-04/E3-05/U4-04）
1. **T01 冻结输入闭包**：准确绑定D10/D12/D13/D14/D15的revision、SHA、Frame；缺失UNKNOWN；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
2. **T02 D14时间轴统一读**：区分时间戳/时基、停顿/换刀事件、未知时长和插值误差；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
3. **T03 NC行与子程序调用实例**：同一字节多次调用实例保留身份、关联Joint事件和独立finding；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
4. **T04 D03/D04/D10姿态转换**：机床轴树、名义Setup、实际机床偏置分离；缺B5尺寸不补造；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
5. **T05 可控播放**：暂停、seek、单步、倍速、倒回不改D14、D15，只改游标；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
6. **T06 单Babylon诊断呈现**：唯一全屏世界、统一左TaskPanel，联动刀具/刀柄/夹具/物理Joint；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
7. **T07 D15工程证据叠加**：UNKNOWN/STALE/REJECT及时间覆盖缺口明确显示，绿色不能作安全PASS；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
8. **T08 可回溯报告草案**：报告记录字节SHA、Frame、调用实例、Oracle版本、运行证据与未覆盖范围；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
9. **T09 CAS/ACL/取消并发**：提交前重验expectedRevision/Frame/epoch、权限、取消令牌，晚ACK不能写；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。
10. **T10 迁移与独立D16交接**：V-next成对Reader双读、保留冻结与旧数据，独立消费方负例验收；由领域Owner定义独立正例、缺失/过期反例和消费者回退证据，规划合成不当产品PASS。

## 原理与逐字段可机检工程规则
- **CAP-09-08-R01 NC输入闭包只读**：仅D12最终NC字节和D13执行实例、D14时序、D10绑定的精确引用允许进入播放；D11 CL_ONLY不得被提升为工程验证。 字段`closure.finalNcShaExact` / `closure.d13CallInstancesExact` / `closure.d14JointTimelineExact` / `closure.d10ExecutionBindingExact`；来源C0908-S01, C0908-S02, C0908-S09，资产D10/D12/D13/D14，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R02 合法时基与未知区间**：D14提供时间单位、基准、t0/t1与缺失片段；固定FPS/插值不能推断控制器真实时间。 字段`timeline.timebaseExact` / `timeline.segmentMonotonic` / `timeline.timeUnitKnown` / `timeline.unknownIntervalsPreserved`；来源C0908-S02, C0908-S03, C0908-S04，资产D13/D14，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R03 NC行与调用实例一对多定位**：保留NC字节区间、重复子程序callInstanceId、D14 jointEventId、D15 findingId；同一文本行的多次调用不能合并。 字段`mapping.ncByteRangePinned` / `mapping.callInstanceExact` / `mapping.jointEventExact` / `mapping.findingReverseLink`；来源C0908-S02, C0908-S07, C0908-S09，资产D12/D13/D14/D15，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R04 Frame与机床几何独立核对**：02域D03机床轴树、04域D04名义Setup和D10实装绑定不同；Babylon姿态变换保存修订、单位/手系，不补造B5枢轴。 字段`kinematics.machineRevisionPinned` / `kinematics.nominalActualSeparated` / `kinematics.transformUnitsPinned` / `kinematics.missingGeometryUnknown`；来源C0908-S02, C0908-S05, C0908-S06，资产D03/D04/D10/D14，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R05 播放不生成工程证据**：seek、暂停、单步、快慢放与倒回只修改本地视口时间游标，保留换刀/停顿；不可写D12/D14/D15。 字段`playback.seekReadOnly` / `playback.dwellAndToolChangeVisible` / `playback.speedDisplayOnly` / `playback.reverseNoEngineeringWrite`；来源C0908-S02, C0908-S03, C0908-S04，资产D12/D14/D15，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R06 独立D15结果仅原样呈现**：独立Oracle、碰撞/限位、验证覆盖及UNKNOWN/STALE来自D15；视觉颜色、帧率或静态采样不得成为PASS。 字段`evidence.d15OracleSeparate` / `evidence.findingHashExact` / `evidence.coverageGapsVisible` / `evidence.visualGreenNeverPass`；来源C0908-S05, C0908-S06, C0908-S07，资产D14/D15，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R07 报告源证据闭包**：报告应含D12字节hash、调用实例、时间区间、Frame、独立Oracle版本和真实测试入口，合成示例水印不可发布。 字段`report.provenanceClosure` / `report.timeSourceAndFrame` / `report.oracleScopeRecorded` / `report.syntheticWatermark`；来源C0908-S01, C0908-S06, C0908-S07, C0908-S09，资产D12/D13/D14/D15/D16，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R08 统一GUI/CLI/Agent及单Scene**：三入口共用09域PlaybackEvidencePort，唯一Babylon世界/统一左TaskPanel，3D选择只读不作批准。 字段`ui.sameOwnerPort` / `ui.oneBabylonScene` / `ui.oneLeftTaskPanel` / `ui.selectionCannotApprove`；来源C0908-S02, C0908-S03, C0908-S05，资产D14/D15，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R09 CAS权限与取消晚回执**：导出/保存前再次校验ACL、expectedRevision/Frame CAS、scopeEpoch、取消Token；晚ACK不得写D15/D16。 字段`tx.aclRecheck` / `tx.revisionFrameCas` / `tx.epochCancelChecked` / `tx.lateAckNoCommit`；来源C0908-S07, C0908-S08，资产D08/D10/D15/D16，原工作包F1-02/E3-04/E3-05/U4-04。
- **CAP-09-08-R10 失效传播与独立消费者**：D03/D10/D12/D13/D14/D15变化报告STALE，双Reader灰度迁移与回退保留A/B冻结；10域独立消费真实D15证据。 字段`migration.exactInvalidation` / `migration.pairedReaderRollback` / `migration.independentD16Negative` / `migration.frozenHistoryUnchanged`；来源C0908-S06, C0908-S07, C0908-S08, C0908-S09，资产D03/D08/D10/D12/D13/D14/D15/D16，原工作包F1-02/E3-04/E3-05/U4-04。

## 流程/异常
选择D12最终NC SHA及D10实际机床、刀柄、装夹Frame→D13重读原始NC并保存调用实例/模态→D14提供真实可解释的时间、物理Joint和辅助动作→唯一Babylon世界按已知时基回放→只读定位D15独立Oracle的限位/干涉/可达性/缺失时间区间→输出含来源和局限的报告草案→D16独立读取真实且已获人类许可的证据。D04名义Setup不是D10执行绑定，D03资源档案不是实机安装证明；相同NC字节区间在两个子程序实例里必须能定位不同执行事件。

异常流：控制器未知宏、时间轴缺失、D14虚构Joint、连杆B-Rep/机床几何不完整、刀柄夹具碰撞只采样端点、时间区间/换刀跳过、Frame手系错误、A/B冻结冲突、版本变更STALE、撤权/取消后的晚ACK。任何UNKNOWN不得声明D15通过，不得打开D16放行；显示颜色和流畅度不作验证依据。

## GUI/接口/验收与回退
[唯一Babylon世界与统一左TaskPanel](UI.md) · [领域读接口](interface-contract.json) · [合成报告](report.example.json) · [17资产候选Owner](asset-owner-candidates.json) · [独立消费者交接](independent-consumer-handoff.md)。GUI/CLI/Agent共用09域`PlaybackEvidencePort`，纯读取；示意CLI命令`procet verify report --d12-ref ... --d15-ref ...`尚未实现。最大字体12px，浅/深主题，统一3D选择不提交。CAS/ACL/scopeEpoch/cancelToken每次导出前重验，晚回执只读；V-next Reader先双读旧新，字段未知则UNKNOWN，故障可回退旧Reader，绝不覆盖D08冻结或D16历史。

[9来源的作者版本/时间/访问深度与限制](../../../research/sources/CAP-09-08.json) → [10规则×4字段](../../../research/traces/CAP-09-08.json) → [30字段正反独立变异+14状态门禁](fixtures.json) → [专题](../../../research/topics/R-SIM-PLAYBACK-EVIDENCE-001.md)。合成脚本`node tools/check_cap0908_planning_2026_10_27.cjs`不是工程安全验证。规划L3`PENDING_HUMAN`，17 Owner`PENDING_HUMAN`，真实Node/NC/OCCT/B5/浏览器/消费者`NOT_RUN`。**规划PASS≠产品PASS**。
