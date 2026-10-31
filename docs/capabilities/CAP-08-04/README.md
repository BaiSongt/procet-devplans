# CAP-08-04｜主轴换刀与辅助动作（V0.8原编号，L3待审）

**目标原文**：主轴换刀与辅助动作｜工具调用、冷却、M代码与动作序列；原工作包E3-02 / E3-03 / U4-04。实现状态与B5实机支持均未知。本规划不生成可上机NC，不模拟实际换刀机构。

## 业务场景与正确性边界
面向人工换刀的三轴机床与自动换刀设备建立**能力声明后再解释**的事件契约。程序请求、控制器预计动作、I/O反馈和实机已完成是四类不同事实；后处理给出的M代码是意图，不是完成回执。具体M6是否关闭冷却存在控制器差异：LinuxCNC 2.9 M6说明冷却可继续；Haas官方M06搜索摘要提示可自动停止冷却；因此只能按`profileHash`、固件/选件、机型支持范围、实机验证配置判定，不能自定全球统一行为。M6也**不等于自动应用G43刀长补偿**。

## 技术数据流与唯一职责
C0只放身份、单位、Frame、revision/hash、scope、ACL/CAS最小元数据；业务Owner保持独立。D03含机床/刀具/刀柄资源档案，**D06在V0.8是求解候选，绝不是刀具总成Owner**。D04 Setup记录工件和毛坯定位；D10才记录实际机床、控制器、刀具安装、刀库/手动换刀约束。D09中立CL → D12后处理生成真实NC字节 → D13独立重读**最终NC字节**并解释G/M语义、I/O期待、未知动作 → D14将被建模的执行事件与运动链展开为机床轴/动作时序 → D15独立验证 → D16按同版本证据审批发布。D11 CL级动画只标预验证，不能冒充D15 NC工程验证；未知M码、互锁、定向反馈与工具状态一律`UNKNOWN`，不做材料扫掠仿真。

## 十项实施任务与规则字段
1. **D04 Setup与D10实际机床绑定分离并锁定控制器配置**：字段 `identity.d04Exact`、`identity.d10Exact`、`identity.profileHashPinned`、`identity.frameAndScopeChecked`；来源 C084-S1、C084-S7；资产 D03、D04、D10、D12；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T01/CAP-08-04-T02，差异字段变异：CAP-08-04-M01。
2. **T选刀、M6换刀执行、刀位/刀具安装及G43补偿分离**：字段 `toolSelection.tSelected`、`toolSelection.magazineSnapshotExact`、`toolSelection.activeToolAfterAck`、`toolSelection.manualOrAutomaticKnown`、`toolSelection.noImplicitG43`；来源 C084-S2、C084-S3、C084-S4；资产 D03、D10、D13；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T03/CAP-08-04-T04，差异字段变异：CAP-08-04-M02。
3. **S字主轴速度与M3/M4/M5方向/停止独立解释**：字段 `spindle.speedKnown`、`spindle.directionSupported`、`spindle.maxRpmChecked`、`spindle.stopEventEmitted`、`spindle.noRunAssumptionFromS0`；来源 C084-S2、C084-S3；资产 D10、D12、D13；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T05/CAP-08-04-T06，差异字段变异：CAP-08-04-M03。
4. **M19主轴定向等待反馈，超时不能虚构完成**：字段 `orient.profileSupported`、`orient.targetKnown`、`orient.timeoutExplicit`、`orient.feedbackRequired`、`orient.unknownFailClosed`；来源 C084-S2、C084-S3；资产 D10、D13、D14；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T07/CAP-08-04-T08，差异字段变异：CAP-08-04-M04。
5. **M7/M8/M9冷却状态按控制器选件解释，M6后不假设普适状态**：字段 `coolant.profileSpecific`、`coolant.optionPinned`、`coolant.stateEventsEmitted`、`coolant.afterM6Explicit`、`coolant.noGenericM7`；来源 C084-S2、C084-S3、C084-S5；资产 D03、D10、D13；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T09/CAP-08-04-T10，差异字段变异：CAP-08-04-M05。
6. **同一程序块动作顺序、栅栏及机床回执区别于解释器预测**：字段 `sequence.blockOrderSupported`、`sequence.waitFenceExplicit`、`sequence.mCodesPerBlockValid`、`sequence.noPhantomAck`、`sequence.sourceLinesMapped`；来源 C084-S2、C084-S3、C084-S8；资产 D12、D13、D14；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T11/CAP-08-04-T12，差异字段变异：CAP-08-04-M06。
7. **人工换刀与ATC分支、互锁及安全位姿均需设备证据**：字段 `changer.modeKnown`、`changer.deviceCapabilityExact`、`changer.safePoseEvidence`、`changer.interlockPreconditions`、`changer.unknownStops`；来源 C084-S2、C084-S3；资产 D03、D10、D13、D15；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T13/CAP-08-04-T14，差异字段变异：CAP-08-04-M07。
8. **M0/M1可选暂停与M2/M30终止/重置由Profile定义**：字段 `lifecycle.optionalStopGate`、`lifecycle.programEndKnown`、`lifecycle.noPostEndExecution`、`lifecycle.stateResetPerProfile`、`lifecycle.noImplicitVerification`；来源 C084-S2、C084-S3；资产 D12、D13、D15；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T15/CAP-08-04-T16，差异字段变异：CAP-08-04-M08。
9. **D13独立解析最终NC并产出typed辅助事件，未知与未收设备反馈不可判PASS**：字段 `interpreter.ncBytesReparsed`、`interpreter.eventsTyped`、`interpreter.ackNotInvented`、`interpreter.unknownPreserved`、`interpreter.d14NoFakeMove`；来源 C084-S6、C084-S8、C084-S2；资产 D12、D13、D14、D15；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T17/CAP-08-04-T18，差异字段变异：CAP-08-04-M09。
10. **同一08域Owner入口、权限CAS取消回执重验、失效传播及保守发布**：字段 `commit.singleOwnerPort`、`commit.casAndAclRechecked`、`commit.epochAndGenerationRechecked`、`commit.unknownBlocksD16`、`commit.rollbackPreservesHistory`；来源 C084-S7、C084-S8；资产 D08、D12、D13、D15、D16；原包 E3-02/E3-03/U4-04。正反测试：CAP-08-04-T19/CAP-08-04-T20，差异字段变异：CAP-08-04-M10。

## 主轴/换刀状态机（设计端口）
`interpretFinalNc({ncBytesHash,dialectProfileExact,d03Exact,d04Exact,d10Exact,toolAssemblyExact})` 应解析实际字节，生成`AuxIntent{sourceLine,blockOrdinal,mCode,modalBefore,modalAfter,expectedDeviceTransition,profileHash}`，引用强类型`ExactRef{assetId,revision,contentHash,frameId,scopeEpoch,schemaVersion}`。D13的`TOOL_CHANGE_REQUESTED`、`SPINDLE_ORIENT_REQUESTED`与真实设备`ACK_OBSERVED`不能合成一个`DONE`。设备事件由明确I/O来源/时间戳/序列号/能力证据区分，回执晚到必须先比对取消代次与当前配置，否则拒绝。没有真实I/O接入时仅`EXPECTED_ONLY`，不能隐含`ACK_OBSERVED`。

解释器不得通过OCCT可视化或CL预览推断M19回执/ATC安全位姿。刀位号码、物理刀具、Gauge长度/装夹与刀长补偿表分别引用版本化资源；T选择和M6执行先后、M19定向超时、M0/M1暂停、M2/M30终止及程序块中M码个数必须由控制器Profile决定。暂停后的重新启动需要重新验证状态，不能直接拼接旧回执。

## GUI/CLI/Agent、版本失效与回退
GUI、CLI、Agent均调用同一08域Owner UseCase，不可各自实现M代码解释。单Babylon世界只显示有证据的D14姿态与独立D15结论；统一左UnifiedTaskPanel的NC任务区呈现`NC行→D13动作意图→设备反馈状态→D14时序→D15证据`，预览、编辑与正式提交相互隔离。最大字号12px、仅浅/深主题；等待动画显示实际工具/阶段，不虚构执行百分比。提交时重验CAS、ACL、Frame、scopeEpoch、taskGeneration、cancel标记；拒绝晚回执。D03/D04/D10/NC bytes/Profile/刀库/刀具总成/权限任一变更，标记D13→D16相关证据STALE，旧NC、D08冻结和已发版本不可覆盖。旧格式只读`LEGACY_UNRESOLVED`，Expand→Migrate→Contract需独立消费者通过，再做非破坏回退，不删除用户数据库。

## 验收与风险
- 机器追踪： [8项来源](../../../research/sources/CAP-08-04.json) → [技术推导](../../../research/topics/R-AUX-MCODE-001.md) → [10规则/字段/原包](../../../research/traces/CAP-08-04.json) → [30正反与不同字段变异＋8条语义序列](fixtures.json) → [Node规划校验器](../../../tools/check_cap0804_planning_2026_10_26.cjs)。[合成契约](contract.example.json)；[17资产候选Owner](asset-owner-candidates.json)；[GUI/3D](UI.md)；[独立消费者/迁移与回退](independent-consumer-handoff.md)。
- 风险：LinuxCNC与Haas M6冷却行为差异不得掩盖；Haas详细M06/M08目前仅官方搜索摘要（直接访问失败），不能据此宣称已确认具体选件。公开仓不得提交客户机床真实参数、安装编码/刀库映射与私有NC。B5控制器实际规则、主轴定向、ATC/人工换刀、机床动作回执均`NOT_RUN`或`UNKNOWN`。
- 规划与验收状态：仅原创新编规划，非历史原件恢复；L3及17 Owner签署`PENDING_HUMAN`。规划合成通过不等于独立Node文件、真实控制器、工厂机床或消费者测试通过。**规划PASS≠产品PASS**。


## B67专项研究：运动同步I/O、输入等待及不可冒充的设备回执

[研究与阅读分级](AUX-IO-FENCES-B67-2026-10-31.md) → [8项来源](../../../research/sources/CAP-08-04-io-fences-b67.json) → [8条规则/原编号包](../../../research/traces/CAP-08-04-io-fences-b67-v08.json) → [53项显式预期正反样例](io-fences-b67-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0804_io_fences_b67_v08.cjs)。M62/63排队至下一运动，M64/65即时；M66超时/未接HAL为UNKNOWN，意图不等于设备真实完成；L3待审、实机NOT_RUN。**规划PASS≠产品PASS。**
