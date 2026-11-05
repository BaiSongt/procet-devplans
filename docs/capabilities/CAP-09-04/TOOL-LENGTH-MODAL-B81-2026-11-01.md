# B81｜CAP-09-04 刀长补偿模态与真实刀具安装的证据隔离（2026-11-01）

> **仅V0.8规划补证，L3待人审。** 原CAP目标「刀具安装与TCP核对」和F1-02/E3-04/E3-05/U4-04编号不变。未批准修改任何产品代码、刀具库或实机配置。规划PASS≠产品PASS。

## 核心业务问题及分层事实

D03是刀具、刀柄、主轴接口的**标称资源能力**；D04是工艺名义Setup；D10才拥有实际刀具组件安装、量规基准、实测伸出、控制器版本、刀具表与实际偏置绑定。D03标称长度≠D10现场测量≠D13解释器当前生效的补偿。任何一项不能从3D可视化长度反推。

LinuxCNC **2.9**官方G-code页§28–31：`G43 Hn`从表读取刀长偏置（无H时使用当前已装刀，H0取决于是否随机换刀）；`G43.1 axes`是**替换**当前相应轴补偿，`G43.2 Hn`或轴词是**追加**，`G49`取消刀长补偿。上述G43变更本身不发生运动，而影响后续运动。G43.1同块运动为错误；G43.2同块H和轴词混用为错误；两种动态指令不写刀具表。**不能将G43.1误写成增量叠加，也不能将G43.2误写为覆盖。**

Haas**铣床**官方G43/G44 Group 08页面说明G43正向、G44反向；从NGC软件`100.21.000.1100`起默认应用刀具长度偏置（除非显式G49/H00等），换刀更新刀长，当前刀长和Group 8状态**跨电源周期保留**。因此不得把重新上电直接认定为零偏置，须读取明确的本次控制器实态；没有控制器修订、实态观察与机床适用性则`UNKNOWN`。LinuxCNC与Haas G43/H0、G49、RTCP/G143的兼容边界**不可照抄互换**。

## 仅为Z向合成数学见证

假设受控工具表T1=50.000mm、T10=0.200mm，当前施加的Z刀补为50mm。执行`G43.2 H10`后只在**本合成模型**中得到50.200mm；之后`G43.1 Z0.25`按替换语义得到0.250mm，**不是50.450mm**；`G49`后为0。G43.1/G43.2均不自动移动。输入数值没有取自实机，且本模型仅代表单轴补偿算术，不是完整G-code解释、物理TCP、运动学或安全放行。

## 来源与实施边界

[7项分级来源](../../../research/sources/CAP-09-04-tool-length-modal-b81.json) → [8条追踪规则、字段和原包](../../../research/traces/CAP-09-04-tool-length-modal-b81-v08.json) → [34合成正反/UNKNOWN/STALE](tool-length-modal-b81-fixtures-v08.json) → [规划Node只读校验](../../../tools/check_cap0904_tool_length_modal_b81_v08.cjs) → [分级执行记录](../../../tracking/cap0904-tool-length-modal-b81-verification-2026-11-01.json)。ISO 6983-1:2009只核官方合法目录/摘要；NIST Gao等2023只读官方出版摘要，**均未阅读收费标准正文/论文全文**，不将内生CAS门禁归因于ISO/NIST。

## 数据契约、入口及验收资格

- **固定字段**：`d03Revision/hash/expectedHash`、`d10Revision/hash/expectedHash`、`d12Revision/NCBytesHash`、`toolTableRevision/hash`、`controllerSoftware/interpreterBuild`、`gaugeMeasuredZ/gaugeFrame`、`scope`、`frame/unit`、`currentAppliedOffset`、`changerKind`、`loadedTool`、`sourceNCLine`、`motionEpoch`。示例工具只覆盖Z轴，不默许X/Y/五轴等效。
- **唯一写端口**：D03 ResourceOwner负责资源，D10 MountBindingOwner负责实际装夹与测量引用，D12 PostOwner写最终NC，D13 ControllerSemanticOwner解释最终字节的模态、H选项及版本，D14依D13输出物理Joint时序，D15**独立消费者**作实际验证，D16需审批才发布。未知语义显式`UNKNOWN`；**CL级动画/D11不是D15证据**。不做材料扫掠仿真。
- **GUI/CLI/Agent**在同一个09域工作任务和D13状态只读检查视图中使用同一领域Port：`inspectExactMountEvidence`、`inspectCurrentModalOffset`、`previewOffsetDeltaReadOnly`、`requestD13Reinterpret`；唯一活动Babylon世界、左TaskPanel（文字≤12px）。CLI/Agent无特殊绕权写通道。提交瞬间重验Owner ACL、expected revision/hash、scope/frame、generation、cancelEpoch；取消晚回执拒绝。
- **失效与迁移**：刀具表、H映射、Gauge、机床控制器版本、NC字节/Revision、D10现场偏置变更使D13→D14→D15→D16候选资格失效，A/B共享事实不得覆盖D08冻结快照。旧schema只读保留，回退旧解释器须生成新run，禁止旧验证自动复活。
- **独立消费者收件**：08域用真实NC/控制器Profile给出包括同块错误、换刀H0差异、断电实态不明的正反文件；09域独立测试D14轴时序、D15真实Oracle及10域D16发布拒绝。需实测B5/OEM测量、复核原始NC、真实Host授权和多版本结果。当前均`NOT_RUN`，Owner签署0/17、独立消费者0/17、L3待审。
