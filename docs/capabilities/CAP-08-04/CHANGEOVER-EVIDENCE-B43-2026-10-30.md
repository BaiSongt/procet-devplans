# CAP-08-04｜B43 M6配置覆盖、HAL回环与真实换刀证据边界

**2026-10-30；原E3-02/E3-03/U4-04；L1/L2不变、L3待审，规划PASS≠产品PASS。**

## 本轮新增的外部证据与反例

1. [LinuxCNC 2.9 M-Codes §6–8](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html)描述通常M6后主轴停止、冷却可继续且G43不自动改变；但[同版本INI §2.15](https://linuxcnc.org/docs/2.9/html/config/ini-config.html)明确有`TOOL_CHANGE_WITH_SPINDLE_ON=1`配置。故“LinuxCNC M6在所有配置中必停主轴”并不成立。对未知INI、固件、机型选件应返回UNKNOWN，不可凭默认文档将执行认证升级。
2. [LinuxCNC HAL Examples §2](https://linuxcnc.org/docs/2.9/html/hal/hal-examples.html)可见`iocontrol.0.tool-change → iocontrol.0.tool-changed`软件回环。回环可推进软件状态，**绝非实物换刀、夹紧或安全位姿完成证明**。人工确认与真实传感器也应分别记录来源和资格。
3. [M-Codes §8](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html)描述M19的R/P/Q、`is-oriented`信号和故障/超时；请求不代表完成。[Tool Compensation §1–2](https://linuxcnc.org/docs/2.9/html/gcode/tool-compensation.html)支持将T选刀、M6、刀具表与G43补偿区别建模。
4. Haas [M06官网索引](https://www.haascnc.com/service/codes-settings.type%3Dmcode.machine%3Dmill.value%3DM06.html)仅搜索摘要可见，正文直接访问失败（500/重定向）；仅作差异线索，**不得声称阅读官网全文或据此认定B5/OEM行为**。

[6项来源：作者、版本、时间、URL、章节阅读深度及局限](../../../research/sources/CAP-08-04-changeover-b43.json)包含4项LinuxCNC公开HTML定点实读、1份Haas索引摘要及1份原CAP固定Git Blob；没有援引任何未读收费标准条款。CAS/Owner/GUI及D04/D10隔离是Procet内生设计，而非厂商安全认证。

## 来源→规则→字段→CAP/原工作包→正反验收

| 规则 | 业务义务 | 字段与资产 |
|---|---|---|
| B43-R1 | 配置版本/INI选件覆盖一般M6停主轴语义；CAP-08-04、E3-02/E3-03/U4-04 | `profile.dialect`, `profile.iniHash`, `profile.firmware`, `profile.optionKnown`, `profile.keepSpindleOn`；D03/D10/D13 |
| B43-R2 | T准备/M6请求/HAL软件回环不是物理换刀；CAP-08-04、E3-02/E3-03/U4-04 | `tool.number`, `tool.magazineHash`, `tool.prepare`, `tool.change`, `tool.ackOrigin`, `tool.physicalClaim`；D03/D10/D13 |
| B43-R3 | M6主轴冷却效应按控制器Profile隔离；CAP-08-04、E3-02/E3-03/U4-04 | `coolant.afterM6`, `spindle.afterM6`, `nc.reparseFinal`, `nc.bytesHash`；D10/D12/D13 |
| B43-R4 | M19定向请求/超时与真实反馈分离；CAP-08-04、E3-02/E3-03/U4-04 | `orient.qSeconds`, `orient.rDegrees`, `orient.ack`, `orient.physicalClaim`, `orient.faultClear`；D10/D13/D14 |
| B43-R5 | M6不自动修改G43偏置与真实Gauge；CAP-08-04、E3-02/E3-03/U4-04 | `length.g43Separate`, `length.offsetHash`, `length.modalHash`, `length.provenance`；D03/D10/D13 |
| B43-R6 | D04 Setup与D10实机绑定/换刀位姿分离；CAP-08-04、E3-02/E3-03/U4-04 | `binding.d04`, `binding.d10`, `frame.machine`, `safety.poseQualification`；D04/D10/D15 |
| B43-R7 | 08域Owner通用GUI/CLI/Agent单Babylon左TaskPanel；CAP-08-04、E3-02/E3-03/U4-04 | `ui.port`, `ui.channels`, `ui.worlds`, `ui.leftPanel`, `ui.fontMaxPx`；D10/D13 |
| B43-R8 | CAS/ACL/代次取消与D08冻结D15D16隔离；CAP-08-04、E3-02/E3-03/U4-04 | `owner.casExpected`, `owner.casCurrent`, `owner.aclExpected`, `owner.aclCurrent`, `owner.generation`, `owner.ackGeneration`, `owner.cancelled`, `owner.lateAckAdopted`, `owner.d08Untouched`, `result.d15`, `result.d16Released`；D08/D12/D13/D14/D15/D16 |

[Trace：来源与每条正反ID](../../../research/traces/CAP-08-04-changeover-b43-v08.json) → [固定合成单字段变异](changeover-b43-fixtures-v08.json) → [只读Node校验入口](../../../tools/check_cap0804_changeover_b43_v08.cjs) → [分层验证等级](../../../tracking/cap0804-changeover-b43-verification-2026-10-30.json)。

## Owner契约、执行链与回退

D03资源与D04工艺Setup各自带`ExactRef{assetId,revision,contentHash,frameId,scopeEpoch,schemaVersion}`，D10另行绑定实际机床、控制器/INI及刀具安装。**中立D09 CL → D12最终NC字节 → D13独立重读NC并解释typed M/T/G状态 → D14真实轴与辅助动作时间线 → D15独立工程验证 → D16受控发布**。D11/CL动画不能冒充NC工程验证；不做材料扫掠仿真，未知语义保持UNKNOWN。

事件提议：`AuxIntent{ncHash,line,callInstance,profileHash,iniHash,taskGeneration}`与`AuxAck{source,sequence,observedAt,frame,ackGeneration,qualifier}`分开；NONE、HAL_LOOPBACK、OPERATOR_CONFIRMATION、REAL_SENSOR不能等同，真实传感器也需独立验证才可决定物理状态。GUI、CLI、Agent只能经同一08域`AuxActionPort`写；唯一Babylon Engine/Scene/Canvas、统一左TaskPanel、字体≤12px、浅/深主题。3D仅展示事实，不生成ACK。

每次CAS/ACL/Frame/scope/taskGeneration/取消与晚回执重验；D03、D04、D10、INI、最终NC或权限变更触发D13→D16 STALE，保留D08冻结和A/B共享的独立版本。旧数据只读LEGACY_UNRESOLVED，Expand→Migrate→Contract，回退不删原证据。安全位姿不得仅由INI设置证明。

## 机器合成与独立验收

本轮1正、40反、4 UNKNOWN，总计45个合成用例；`profile.keepSpindleOn=true`及`tool.ackOrigin=HAL_LOOPBACK`各自单字段触发UNKNOWN，`owner.cancelled=true`触发CANCELLED。固定快照的PLANNING_ONLY只证明规划门禁逻辑，不是G-code解释器/硬件模拟器或安全认证器。独立Node文件进程、真实LinuxCNC/HAL、Haas、B5/OEM、D13–D16、17消费者均NOT_RUN；正式Owner签署0/17，L3人工待审，全仓GFM AST与历史附件原字节未闭。**规划PASS≠产品PASS。**
