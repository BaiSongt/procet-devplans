# B53｜CAP-09-03 物理Joint回零、龙门同步与软限资格

日期：2026-10-31；状态：**NEWLY_AUTHORED 规划研究、L3待人审、产品与真实独立消费者NOT_RUN**。这是对[原CAP-09-03](README.md)与原F1-02/E3-04/E3-05/U4-04的专项补证，不改11域88 CAP/36包/17资产分母。

## 已核官方证据及不可外推范围

- LinuxCNC 2.9 [Homing Configuration](https://linuxcnc.org/docs/2.9/html/config/ini-homing.html) §1/2、§6.1–6.14：G53机器原点是软限基准；§6.7的`HOME_OFFSET`是开关/编码器索引捕获后赋予的Joint坐标，§6.8的`HOME`是后续最终到达的位置。**不可混为一字段**，`HOME-HOME_OFFSET`只是名义坐标差，不能冒充真实伺服行程；官方允许开关坐标位于软限外，软限判定必须落在最终HOME及物理Joint的位置。
- 同文§6.11：负`HOME_SEQUENCE`同步具有相同绝对序号的Joint最终移动，双驱龙门若丢失同步可能发生racking；§6.12`VOLATILE_HOME`在机床关机时失去回零状态；§6.5`HOME_USE_INDEX`需要HAL与encoder索引连接。§6.10绝对编码器模式1/2存在不同的最终移动动作，本合成不替代相应控制器证明。
- LinuxCNC 2.9 [INI Configuration](https://linuxcnc.org/docs/2.9/html/config/ini-config.html) §1.2/§2.13：`[JOINT_n]`与`[AXIS_l]`需分开，回零配置是具体控制器Profile。ISO 230-2:2014 [官方目录](https://www.iso.org/standard/55295.html)只读版次、状态、摘要，付费正文/2016修正案未读；NIST Gao等(2023) [出版记录](https://www.nist.gov/publications/machine-tool-calibration-measurement-modeling-and-compensation-machine-tool-errors)只读元数据与摘要，论文全文未读。**回零布尔状态不等于机床测量定位精度或OEM认证。**

## 合成Golden与可反驳条件

一个编程Y轴由J1/J2两个不同的物理Joint驱动：两者软限均为[-3,7]mm，J1`HOME_OFFSET=-2.3mm`、`HOME=0mm`、名义差2.3mm；J2对应-2.1mm、0mm、2.1mm。两Joint同回零代次，`HOME_SEQUENCE=-1`并显式`syncFinal=true`，回零方式为SWITCH_INDEX、索引连线有独立字段。此数据标记`SYNTHETIC`，不是B5实机测量，1e-9比较只限规划算术。

可反驳反例：J1的`HOME_OFFSET=-3.5mm`虽在软限外，只要最终HOME及实际位置仍合格，本例不会错误拒绝；J2实际位置8mm即使聚合Y=0也必拒；取消双驱末段同步必拒；`VOLATILE_HOME=true`后断电却复用旧`homed`必拒；索引线不明/回零代次缺失返回`UNKNOWN`。绝对编码器、真实开关过冲、同步误差及夹具/刀柄实机干涉在此均未校验。

## 业务Owner/单GUI与NC链

D03资源Owner（02域）管理真实Joint树与回零/软限档案的exact revision/hash/frame；D04（04域）是**名义Setup**；D10（04域）另行管理实际机床/控制器/工件/刀具执行绑定和回零代次，禁止用D04填D10。09域D14必须读两个物理Joint的真实状态和D13逐块事件，不允许单编程Axis表示双驱完成。GUI/CLI/Agent共享领域`InverseKinematicsPort`，单Babylon Engine/Scene/Canvas、统一左`UnifiedTaskPanel`、最多12px字体；Ghost和CL只是只读预览。

业务Owner提交时再次检查ACL、CAS expected revision/hash、scopeEpoch、generation及cancel Fence；晚回执不得复活回零，A/B共享事实不得覆盖D08冻结。配置、权限或回零事实变化使D14/D15/D16资格STALE，保留历史NC/冻结并提供成套schema/reader迁移与回退。**中立CL D09→D12后处理最终NC→D13控制器执行语义→D14物理Joint时序→D15独立验证→D16发布**。本合成没有最终NC：D13=UNKNOWN、D14/D15=NOT_RUN、D16=BLOCKED。不做材料扫掠仿真。

## 规则/来源/验收和执行等级

[6来源及逐条阅读局限](../../../research/sources/CAP-09-03-homing-b53.json) → [8规则字段与原编号包](../../../research/traces/CAP-09-03-homing-b53-v08.json) → [4正/25反/11 UNKNOWN合成](homing-b53-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap0903_homing_b53_v08.cjs) → [核验记录](../../../tracking/cap0903-homing-b53-verification-2026-10-31.json)。执行命令`node tools/check_cap0903_homing_b53_v08.cjs`。当前仅在连接器V8中执行同一`judge`逻辑40/40合成PASS；独立Node文件、真实LinuxCNC/HAL、B5/OEM、D14/D15/17消费者**NOT_RUN**，Owner正式签署0/17、L3待审。**规划PASS≠产品PASS。**
