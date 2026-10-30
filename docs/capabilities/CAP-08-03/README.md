# CAP-08-03｜坐标与运动指令（V0.8原编号，L3待审）

> 2026-10-26横向纠错：刀具/刀柄资源应引用D03，实际机床刀具安装绑定由D10持有；D06仍然是求解候选。`toolLength.d03Exact`替代错误的`d06Exact`，属于候选契约更正；尚未执行真实消费者迁移与兼容测试。

**原始业务定义**：WCS、刀长/半径补偿、插补和轴命令；原工作包E3-02、E3-03、U4-04。本文件是工程设计，不声明任何目标控制器或B5机床通过。

## 端到端职责
D04 Setup（零件/毛坯定位）和D10执行绑定（控制器/运动链/刀具装配）必须分离。D09中立CL→D12后处理生成原始NC字节→D13**独立重读最终NC**并解释模态/偏置/补偿→D14由09域运动学展开实际轴时序→D15独立NC工程验证→D16受控发布。D11中立CL动画不属于NC工程验证，未知宏/RTCP/循环/补偿一律UNKNOWN，不能宣称PASS，不做材料扫掠仿真。C0只保存版本、单位、Frame、scope、ACL/CAS等最小共用元数据；A/B共享事实、D08冻结不可原位覆盖。

## 十项工作任务、字段与反例
1. **D04 Setup与D10执行机床配置独立锁定**：`binding.d04Exact`, `binding.d10Exact`, `binding.frameHashKnown`, `binding.profilePinned`, `binding.noFrameGuess`；证据C083-S4、C083-S2，资产D04、D10，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
2. **WCS与G53机器坐标、G52/G92临时偏置分离**：`wcs.selectedKnown`, `wcs.snapshotHashed`, `wcs.g53Separate`, `wcs.temporaryOffsetsKnown`, `wcs.frameInverseChecked`；证据C083-S2、C083-S4，资产D04、D10、D13，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
3. **G90/G91、弧心和单位模态各自跟踪**：`modal.linearKnown`, `modal.arcCenterKnown`, `modal.unitsKnown`, `modal.initialStatePinned`, `modal.transitionLogged`；证据C083-S2、C083-S3，资产D12、D13，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
4. **G2/G3圆弧/螺旋的平面半径方向校核**：`arc.planeKnown`, `arc.radiusConsistent`, `arc.directionKnown`, `arc.helicalIntentKnown`, `arc.profilePinned`；证据C083-S1、C083-S2，资产D09、D12、D13，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
5. **G43刀长使用D03资源档案与D10实际刀具安装绑定精确关联**：`toolLength.d03Exact`, `toolLength.gaugeKnown`, `toolLength.tableHashKnown`, `toolLength.compModeKnown`, `toolLength.unknownBlocked`；证据C083-S2、C083-S3，资产D03、D10、D13，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
6. **G40/G41/G42刀具半径补偿进入与退出**：`toolRadius.radiusExact`, `toolRadius.leadInChecked`, `toolRadius.leadOutChecked`, `toolRadius.cancelTracked`, `toolRadius.controllerSpecific`；证据C083-S2、C083-S3，资产D03、D09、D13，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
7. **G0/G1、进给和轨迹控制与碰撞结论分离**：`motion.g0Distinct`, `motion.feedModeKnown`, `motion.pathControlPinned`, `motion.unknownBlocks`, `motion.noFakeCollisionProof`；证据C083-S2、C083-S3，资产D12、D13、D15，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
8. **机床轴与回转方向须以D10+D14证明**：`axes.axisSetKnown`, `axes.rotarySignKnown`, `axes.travelBoundKnown`, `axes.d14Independent`, `axes.noFakeFiveAxis`；证据C083-S2、C083-S4，资产D03、D10、D14，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
9. **D13独立重读最终NC字节并生成可追溯动作**：`lineage.ncHashExact`, `lineage.reparsedIndependently`, `lineage.lineMapped`, `lineage.d14ConsumesEvents`, `lineage.editsForked`；证据C083-S5、C083-S7，资产D09、D12、D13、D14，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。
10. **同一Owner入口CAS/ACL/取消晚回执及UNKNOWN阻发布**：`gate.singlePort`, `gate.casAclRechecked`, `gate.generationRechecked`, `gate.unknownBlocksD16`, `gate.d15Independent`；证据C083-S6、C083-S7，资产D12、D13、D15、D16，原包E3-02/E3-03/U4-04。条件失配按独立正反夹具拒绝。

## 精确数据与接口
每个生产引用必须带`{assetId,revision,contentHash,frameId,scopeEpoch,schemaVersion}`。D13通过`interpretNc(ncBytesHash,dialectProfileExact,d04Exact,d03Exact,d10Exact)`获取原始字节，记录NC物理行、模态前态/后态、WCS/offset snapshot、补偿状态、规范运动事件及UNKNOWN理由；不允许D09画面推断。Frame必须明确变换方向、右手性、复合次序与逆校核；例如`T_machine_work=T_machine_setup*T_setup_work`需要定义来源/目标Frame，绝不固定世界Z。G90/G91与圆弧中心模态分开；G2/G3核验平面、圆心/半径、方向和螺旋轴；G43、G40/41/42依赖D03已记录的刀具/刀柄参数、D10实际安装Gauge与目标控制器配置。D14不得仅把运动指令字当五轴关节指令。

## GUI/事务/失效/回退
GUI/CLI/Agent共用08域Owner Port和UseCase，不独立写D12/D13；NC ActivityRail进入**统一左UnifiedTaskPanel**，**单Babylon世界**仅显示来源轨迹、Frame和真实D14轴结果，最大字体12px、浅/深主题。预览只读，提交时再次验证CAS、ACL、Frame、scopeEpoch、任务代次和取消标识；取消晚回执拒绝。D03资源档案/D04 Setup/D09中立CL/D10执行绑定/Profile/WCS/刀补表/NC字节任一变更使依赖D13-D16证据STALE，但旧版本、D08冻结和已发布结果不可原位覆盖。旧工程数据不全仅LEGACY_UNRESOLVED只读，Expand→Migrate→Contract保留旧Reader和非破坏回退，不删除用户数据库。

## 研究和独立验收
[7项合法公开来源与访问深度](../../../research/sources/CAP-08-03.json) → [推导专题](../../../research/topics/R-WCS-MOTION-001.md) → [10条规则/字段/原工作包映射](../../../research/traces/CAP-08-03.json) → [10正/10反/10不同字段变异](fixtures.json) → [Node规划校验器](../../../tools/check_cap0803_planning_2026_10_26.cjs)。[GUI/3D](UI.md)及[独立消费者和回退](independent-consumer-handoff.md)待产品团队实施。Owner仅候选、L3待人类评审；真实产品/NC/控制器/机床/独立消费者/独立Node文件执行均NOT_RUN。**规划PASS≠产品PASS。**

## 2026-10-30｜B37 G93/G94/G95进给模态专项补证

[LinuxCNC2.9公开条款与名义时间算例](FEED-MODES-B37-2026-10-30.md) → [8规则](../../../research/traces/CAP-08-03-feed-modes-b37-v08.json) → [4正39反1未知合成用例](feed-modes-b37-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap0803_feed_modes_b37_v08.cjs)。G93 F的1/F分钟是**指令名义值**，G95需主轴速度反馈；**不能直接当D14轴时间或D15独立安全资格**。独立Node、真实NC/OEM/17消费者NOT_RUN，L3/Owner待审。

## 2026-10-30｜B46 G53/G54-G59.3、G10及G52/G92共享寄存器专项补证

[官方证据和有界算例](WCS-OFFSETS-B46-2026-10-30.md) → [5来源](../../../research/sources/CAP-08-03-wcs-offsets-b46.json) → [8规则](../../../research/traces/CAP-08-03-wcs-offsets-b46-v08.json) → [8正、56单字段反、3 UNKNOWN；合计67项V8同函数合成](wcs-offsets-b46-fixtures-v08.json) → [只读Node](../../../tools/check_cap0803_wcs_offsets_b46_v08.cjs)。INI未知、OEM方言未知均不自动PASS；独立Node、D13–D15与真实消费者NOT_RUN，L3/Owner待审。**规划PASS≠产品PASS。**
