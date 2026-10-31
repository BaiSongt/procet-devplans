# CAP-08-04｜B67 辅助I/O同步栅栏与M66观测资格（2026-10-31）

**原基线保持**：CAP-08-04《主轴换刀与辅助动作》，原工作包 E3-02/E3-03/U4-04，业务Owner D13。不是修改11域/88 CAP/36包/17资产分母；L1/L2不变，L3待人类评审。只产生规划设计与合成校验，不发送任何可上机NC，不读取客户配置。

## 一、专项难点：NC中的M码意图不等于设备时序

在LinuxCNC **2.9**公开M-code手册中，M62/M63数字输出被排队，到**下一条运动开始**触发；对同一通道的后续写入会覆盖先前排队值；如果此后没有运动，排队输出不会触发。相反M64/M65属于立即输出，不随运动同步，并会打断连续轨迹混合。M67模拟输出随下一运动；M68模拟输出立即生效。这里的触发语义是**解释器/运动控制器的规划事实**，不是外部设备实际收到信号或刀具机构完成动作的证书。[LinuxCNC 2.9 §15—18](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html)。

构造三种可核查反例（只读概念序列，绝不发送机床）：

- **有排队无运动**：M62 P0 → M2；不得将P0状态标为已切换，应返回`UNKNOWN/QUEUED_WITHOUT_NEXT_MOTION`。
- **同通道覆盖**：M62 P0 → M63 P0 → G1 X10；按照LinuxCNC 2.9文档，下一运动前只有最后的关输出值生效，不得绘出一次开/一次关的物理切换。
- **即时与同步不可互换**：M64 P0 → G1 X10 不可转译成M62的下一运动同步事件；它将影响路径混合，D14须重新展开实际时序。

M66的P数字输入与E模拟输入互斥；L0立即采样，L1—4用于数字条件等待，**模拟仅允许L0**；非L0的等待要求正的Q超时。等待超时后`#5399=-1`，不能判作动作完成；即使返回输入值，也只是所接HAL输入的状态，不足以证明ATC物理完成，更不能当作安全实时互锁。[LinuxCNC 2.9 §16](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html)。HAL各针脚须由具体机器配置连接；手册不会证明B5/OEM接线。[HAL §1—2](https://linuxcnc.org/docs/2.9/html/hal/intro.html)。

## 二、D13 typed事件与八项待审工程规则

每个事件需保留`ncByteHash`、`lineOrdinal`、`blockId`、`dialectProfileHash`、`d10Exact`、`frameId`、`ioChannel`、`ioMode`、`motionAnchorId`和`interpretationStatus`。`IO_INTENT_QUEUED` / `IO_INTENT_IMMEDIATE` / `WAIT_INPUT_REQUESTED` / `INPUT_OBSERVED` / `DEVICE_COMPLETED`为不同事件类型，不得根据脚本计划推断后两者。输入采样需独立记录源pin、采集时间、D10机床配置修订及有效性。具体实现前需订立严格schema并做消费者评审。

| 规则 | 业务判据与字段 | 对应原包 |
|---|---|---|
| B67-R01 | D04 Setup与D10机床绑定分离；最终NC字节、Profile、Frame exact revision/hash可回读；`source.*`, `program.reparsedFinalNc` | E3-02/E3-03 |
| B67-R02 | M62/M63排队以**下一真实运动段ID**为锚，后写覆盖，不能虚构不存在的运动；`program.blocks/expectedEvents` | E3-03/U4-04 |
| B67-R03 | M64/M65标记`IMMEDIATE_BREAKS_BLENDING`，要求D14/D15按新轨迹资格复核 | E3-03/U4-04 |
| B67-R04 | M67/M68模拟输出分同步/即时，验证E通道与有限Q数值，实际输出量程依机床配置 | E3-02/E3-03 |
| B67-R05 | M66 P/E/L/Q、`#5399`超时和HAL输入时间戳证据分级；没有实际采样返回UNKNOWN | E3-03/U4-04 |
| B67-R06 | 解释器`AuxIntent`、HAL pin与设备`ACK_OBSERVED`不可混写；未收实证禁止声称换刀完成 | E3-03/U4-04 |
| B67-R07 | CAS/ACL/scopeEpoch/taskGeneration与取消Fence在提交和晚回执重新确认；冻结旧版不覆盖，新版本失效传播、迁移与回退留痕 | E3-02/E3-03/U4-04 |
| B67-R08 | GUI/CLI/Agent统一D13领域Port；一个Babylon Engine/Scene/Canvas及左UnifiedTaskPanel，3D与CL仅显示候选状态 | U4-04 |

**Owner数据契约**：D03维护刀具及资源参数、D04保存Setup几何定位、D10保存最终实际机床/控制器/HAL配置、D12保存后处理最终NC字节、D13输出带来源及等待栅栏的解释事件、D14将NC解释结果展开为轴/辅助动作时间线、D15独立对机床验证、D16按相同证据版本发布。中立CL→NC后处理→D13→D14→D15→D16边界不变。未知OEM语义明确UNKNOWN，不做材料扫掠仿真。

GUI在左侧统一任务面板只读显示 **NC物理行→待触发I/O队列→锚定运动段→观察反馈→D15资格**；单Babylon世界仅显示可信姿态，排队未触发时不得绘制装置已动作。CLI/Agent同一UseCase调用，不能各实现一套解释器。Legacy格式使用`LEGACY_UNRESOLVED`；Expand→Migrate→Contract需独立收方验证，保留旧数据回退。输入观测与NC状态变化仍需CAS/ACL和取消代次重验。

## 三、资料、阅读深度与适用限制

| ID | 来源/作者、版次与日期 | 本轮实际读取 | 不可推断 |
|---|---|---|---|
| B67-S01/S02/S03 | LinuxCNC Project，2.9 M-Codes在线版本，访问2026-10-31 | §15—18公开**具体正文**，同步/即时、M66和模拟输出 | 非LinuxCNC控制器、OEM改造及物理安全资格 |
| B67-S04 | LinuxCNC Project，2.9 HAL Introduction，访问2026-10-31 | §1—2公开具体正文 | 未读B5真实HAL，不构成接线证据 |
| B67-S05 | Kramer/Proctor/Messina，NISTIR 6556，2000-08-01 | NIST**出版元数据与摘要** | 未读NIST PDF全文，不将M62/M66归因于NIST |
| B67-S06 | ISO/TC184/SC1，ISO 6983-1:2009，Edition 2，2025确认 | ISO**官方目录和公开摘要** | 26页收费正文未读，不编造M码条款 |
| B67-S07 | Procet CAP-08-04原规格，固定GitBlob `9388f3f099ed3954cd53cb3fe89cb50d0cf54cae` | 内生业务规则原文实读 | 内生规则不是外部标准、不是产品实现 |
| B67-S08 | Fielding/Nottingham/Reschke，RFC 9110，2022-06 | §13.1.1/§13.2.2公开文本，作CAS类比 | HTTP条件语义不是SQLite/Owner原子性的证明 |

[完整8份来源记录](../../../research/sources/CAP-08-04-io-fences-b67.json) → [8条字段/工作包/样例映射](../../../research/traces/CAP-08-04-io-fences-b67-v08.json) → [逐项明确预期的合成样例](io-fences-b67-fixtures-v08.json) → [可在独立Node进程运行的只读脚本](../../../tools/check_cap0804_io_fences_b67_v08.cjs) → [分级验证记录](../../../tracking/cap0804-io-fences-b67-verification-2026-10-31.json)。

## 四、正反验收与严格边界

正例包含M62/M63后写覆盖、M64立即打断混合、M67同步模拟输出、M66有版本化HAL观测及GUI/CLI/Agent同Port；反例分别改变通道、运动锚、模拟Q、P/E互斥、L/Q、假ACK、NC字节、Profile/Frame、撤权/取消等单项字段，所有预期**人工明确写入fixture**而非由判定器自动补答案。无下一运动、未观测输入、M66超时、HAL缺连线、未知OEM返回UNKNOWN，不被弱化为PASS。

本轮用例只是D13辅助动作**意图分类**，`CANDIDATE_ONLY`不是物理I/O或NC验证通过。测试等级：规划合成与trace结构可检查；独立远端Node文件运行、真实LinuxCNC HAL、M66超时实测、D14/D15、B5/OEM、17项独立消费者均NOT_RUN。Owner正式签署0/17，L3待审；**规划PASS≠产品PASS**。
