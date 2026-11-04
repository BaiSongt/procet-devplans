# B163｜CAP-08-04 M0/M1暂停、M2/M30终止及跨方言模态复位证据
日期：2026-11-04；状态NEWLY_AUTHORED，L3待审；主题R-NC-PROGRAM-END-OPTIONAL-STOP-001。原始业务目标：“主轴换刀与辅助动作｜工具调用、冷却、M代码与动作序列”；原工作包E3-02、E3-03、U4-04。与B127 M6刀补和B162 G43栈互补，本项不改原11域/88 CAP/36包分母。

## 官方来源、实际阅读范围与局限
1. LinuxCNC Documentation Project，版本2.9，[M-Codes](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html)，2026-11-04指定**§2原文实读**：M0暂停保持Auto，M1只有optional-stop开关打开才暂停，恢复在后继行。未验证设备的暂停ACK，不推广到Haas。
2. 同版本同URL**§3原文实读**：M2结束程序，M30在LinuxCNC还包含托盘交换语义并结束程序；下次Cycle Start从程序开头开始。两者切Auto为MDI，明确复位默认G54、G17、G90、G94等，主轴停止和冷却关闭。**不由这些列举项推断所有TLO均被清除**，不将这组模态规则复制给其他厂商。
3. 同版本同URL**§6原文实读**：M6换刀与M30结束是不同事件，冷却可能保持。请求不等于I/O真实已完成。
4. Haas Automation，[Mill M-Code List](https://www.haascnc.com/service/service-content/guide-procedures/mill---m-codes.html.html)，2026-11-04仅**官方HTML目录指定条目实读**：列有M00/M01/M02/M30。目录不构成任意机型的完整控制器模态规则。
5. Haas Automation，[M30 Program End and Reset](https://www.haascnc.com/service/codes-settings.type%3Dmcode.machine%3Dmill.value%3DM30.html)，2026-11-04只能获得**官网原页的搜索摘录**，直接打开完整原页失败、未读PDF：摘录注明从软件`100.16.000.1041`起M30不再取消刀长补偿。仅将其作为**版本化证据风险和待核资格**，不推断旧固件或其他OEM行为，更不宣称具体B5实机认证。
6. 本仓[CAP-08-04业务原稿](https://github.com/BaiSongt/procet-devplans/blob/6eb3fa099d7f09a43c5363734d3e97c580c58ad7/docs/capabilities/CAP-08-04/README.md)（固定Git SHA 6eb3fa099d7f09a43c5363734d3e97c580c58ad7），2026-11-04连接器全文实读；Owner/CAS/CLI/左TaskPanel为**Procet内生设计决议**，不是LinuxCNC/Haas标准条款。没有取得付费ISO正文或第三方论文全文，均不伪称阅读。

## D13语义状态与相互独立的权威
D12发布候选NC原始字节、D10执行绑定（revision/hash/frame、机床配置、固件/选件Profile）、D13解释器版本/初始模态是**三个不同身份来源**。D13重新解释最终NC字节，以`ExecutionEvent{ncBytesHash,sourceLine,blockIndex,modalBefore,modalAfter,certainty,evidenceKind}`记录。M0输出PAUSED_REQUIRED_AUTO；M1依据受信任optional-stop开关值产生暂停或继续，开关未知必须`UNKNOWN_OPTIONAL_STOP_STATE`；M2/M30为终止，后继NC块不能继续被解释为可执行。重启前要重新核验D10、刀补和Owner权限，不能把程序指针复位说成机床已到安全位。Haas固件或选件不明则M30刀补后态`UNKNOWN_CONTROLLER_END_MODAL`，不得以LinuxCNC默认值补全。

## 来源→规则→字段→CAP/包→验收机器链
- **B163-R01 D10绑定/最终NC字节锁**：`binding.d10Revision`、`binding.d10Hash`、`binding.finalNcHash`、`binding.profileHash`；来源B163-S02/B163-S06；资产D04/D10/D12/D13；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R01-P，负例B163-R01-N1～N4。
- **B163-R02 M0无条件/M1条件暂停**：`pause.m0AlwaysStops`、`pause.m1SwitchRead`、`pause.resumeNextBlock`、`pause.ackNotInvented`；来源B163-S01/B163-S06；资产D13/D14；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R02-P，负例B163-R02-N1～N4。
- **B163-R03 M2/M30终止并阻断后续块**：`end.m2Terminal`、`end.m30Terminal`、`end.afterEndUnreachable`、`end.restartFromBeginning`；来源B163-S02；资产D12/D13/D14；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R03-P，负例B163-R03-N1～N4。
- **B163-R04 LinuxCNC2.9仅按明示模态复位**：`linux.m30PlaneG17`、`linux.m30DistanceG90`、`linux.m30FeedG94`、`linux.m30StopsSpindleCoolant`；来源B163-S02；资产D13/D14；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R04-P，负例B163-R04-N1～N4。
- **B163-R05 Haas M30刀补版本证据与未知**：`haas.versionGateRecorded`、`haas.newerTloRetention`、`haas.oldVersionNotAssumed`、`haas.otherControllerUnknown`；来源B163-S04/B163-S05/B163-S06；资产D10/D13/D15；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R05-P，负例B163-R05-N1～N4。
- **B163-R06 M6/名义规长/Setup不等于执行TLO**：`boundary.m6DistinctFromM30`、`boundary.gaugeNotAppliedH`、`boundary.d04DifferentFromD10`、`boundary.d15FinalNcOnly`；来源B163-S03/B163-S06；资产D03/D04/D10/D13/D15；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R06-P，负例B163-R06-N1～N4。
- **B163-R07 恢复/发布与证据栅栏**：`gate.sourceNcLineExact`、`gate.resumeNeedsRevalidation`、`gate.unknownBlocksRelease`、`gate.clAnimationNotEngineeringPass`；来源B163-S01/B163-S02/B163-S06；资产D12/D13/D14/D15/D16；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R07-P，负例B163-R07-N1～N4。
- **B163-R08 GUI/CLI/Agent共一Owner并条件提交**：`owner.singlePort`、`owner.exactRevisionHashFrame`、`owner.casAclCancelRechecked`、`owner.rollbackPreservesFrozen`；来源B163-S06；资产D08/D10/D12/D13/D16；CAP-08-04及原E3-02/E3-03/U4-04；正例B163-R08-P，负例B163-R08-N1～N4。

8条规则共32个字段，8个正例及32个**只改变一个字段**的负例，另外8个简化状态Golden覆盖M0、M1开/关、M2、LinuxCNC M30、Haas已核版本M30、Haas未知版本、终止后不可达。规则正反可用于规划静态校验，Goldens仅为简化内生模型，**不能替代真实LinuxCNC/Haas解释器及E3-03独立NC消费者执行**。

## 权限/GUI/CLI/Agent/失效及非破坏回退
GUI、CLI和Agent统一08域Owner Port，所有命令基于exact revision/hash/frame、scopeEpoch、taskGeneration、ACL、CAS及cancelled在提交时重新核验；取消后晚回执不能覆盖最新执行绑定。单Babylon Engine/Scene/Canvas仅表现真实来源D14姿态；统一左TaskPanel可显示NC源行→D13模态→D14时序→D15证据以及UNKNOWN，不能将CL播放冒充NC工程认证。D04工艺Setup不等于D10执行机床绑定，D03名义Gauge Length也不是D13已应用TLO。C0仅维持最小身份、单位、Frame、Hash、Revision、Scope；A/B共用冻结D08事实不覆盖。任何D12字节、D10固件/偏置、Frame、D13解释器版本变更使相关D13→D16资格失效；未知影响范围返回UNKNOWN。迁移采取Expand→Migrate→Contract，只读兼容旧格式`LEGACY_UNVERIFIED`，独立消费者通过前不得删除旧入口或修改历史D08与用户数据。

始终执行`D09中立CL→D12后处理→D13执行语义→D14轴时序→D15独立工程验证→D16受控发布`。CL动画不是工程验证；不做材料扫掠仿真。真实Owner、独立消费者、固件和设备I/O必须单独取证。

## 机器入口及核验层级
[6项来源](../../../research/sources/CAP-08-04-m30-lifecycle-b163.json) → [8规则32字段](../../../research/traces/CAP-08-04-m30-lifecycle-b163-v08.json) → [8正32反8Golden](m30-lifecycle-b163-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0804_m30_lifecycle_b163_v08.cjs) → [验证记录](../../../tracking/cap0804-m30-lifecycle-b163-verification-2026-11-04.json)。
本轮V8与拟提交检查器同判据**48/48合成符合预期**，独立Node完整文件、真实NC/OEM/机床、17业务资产Owner签署（0/17）、独立消费者验收（0/17）、L3审批、历史附件原字节与全仓GFM AST均**NOT_RUN/OPEN/PENDING**。**规划PASS≠产品PASS。**
