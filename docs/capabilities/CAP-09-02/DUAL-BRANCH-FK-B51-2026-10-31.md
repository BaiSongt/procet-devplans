# B51｜CAP-09-02 双分支机床正解：工件旋转、刀具安装与独立Golden对拍

日期：2026-10-31。性质：**NEWLY_AUTHORED 规划补证 / L3待人类评审 / 产品NOT_RUN**。原[CAP-09-02规格](README.md)、[十项原追踪](../../../research/traces/CAP-09-02.json)、原36包编号和17资产Owner不变。与此前仅有单链SE(3)检查的合成覆盖不同，本轮新增**工具分支和工件分支相对TCP**的可反驳Golden向量。

## 1. 风险与计算约定

机床可以同时改变工具和工件位姿。若M为机床底座、S为主轴、T为TCP、W为工件：

`T^M_T = T^M_S · T^S_T`；`T^W_T = (T^M_W)^-1 · T^M_T`。

采用右手、列向量、毫米、角度输入显示度数而内核计算弧度；**不允许**用`t_M_TCP - t_M_W`代替左乘工件Frame的逆旋转，不允许将`T_A_B*T_B_C`交换次序。OCCT `gp_Trsf::Multiply`与`PreMultiply`不同，`gp_Trsf`也支持缩放/镜像，原始输入须先校验是否为SE(3)，不能因为SDK可以构造就当成合法机床FK。<https://occt3d.com/dev/doc/refman/html/classgp___trsf.html>

## 2. 合成Golden，不冒充B5五轴实机

静态合成分支：M→S平移(100,0,0)mm后绕S局部Z轴旋转+90°；S→TCP沿S局部X方向10mm；M→W平移(0,20,0)mm后W绕Z轴+90°。由父子变换得`p_M_TCP=(100,10,0)`，`p_M_W=(0,20,0)`，因此`p_W_TCP=(-10,-100,0)`、相对Yaw=0°。这是**两分支同旋转，结果不等于直接做世界系平移相减**的最小反例。零角对照为(110,-20,0)。

为使正反样例可重复，本工具限于SE(3)的**Z旋转＋XYZ平移子集**，1e-8为纯合成浮点核验阈值，非真实机床公差。该例不是B5实体旋转轴、真实Pivot、B5装夹或Controller轨迹。真实B5绕X/Y、枢轴偏置、RTCP、动态Joint限位/回零均须以后续3D Native/OEM证据对拍，**不能从二维算术PASS晋升实机PASS**。

## 3. 双驱与证据分层

LinuxCNC 2.9 的`trivkins`允许`coordinates=xyyzw`将两个physical joints关联同一Y坐标；但不代表所有机床均如此，也不能自动证明回零同步或不会发生龙门扭曲。规划必须保留`jointId/axisLetter/position/homeProfile/exactD03Hash`，缺校准和回零来源标记UNKNOWN，不从显示用XYZ推导物理Joint轴时序。<https://linuxcnc.org/docs/2.9/html/man/man9/trivkins.9.html>

NIST 2023关于机床校准的公开摘要讨论轴内/轴间及体积误差；NIST 2024公开摘要讨论含噪声的机器人模型误差评估。**两篇均仅读NIST元数据与Abstract**，不从摘要伪造误差数值。理论FK闭合不证明现场精度。

## 4. Owner、端口与提交失效

- **D03（02域）**：机床物理Joint/轴型/安装资源，需exact revision/hash/frame；**D04（04域）**：工艺Setup/毛坯与设计基准；**D10（04域独立资产）**：真实机床/工件/刀具绑定。09域`FrameGraphPort`仅消费其确切快照形成候选，不能把D04直接写成D10。
- GUI/CLI/Agent共用同一领域命令与`scopeEpoch`；唯一Babylon Engine/Scene/Canvas、统一左`UnifiedTaskPanel`显示`machine/tool/work/TCP` Frame及合成标签，禁止第二个3D。Ghost/CL播放为只读预览。
- 写操作由业务Owner再次核对ACL、permission epoch、CAS revision/hash、scope/取消Fence；晚回执不写新scope；任意源修订失效使下游D14/D15标记stale，保留A/B冻结及可回滚旧版，不覆盖已签D08/D16。
- 中立CL→D12后处理→**D13真实NC执行解释**→**D14轴时序**→**D15独立验证**→D16发布。当前合成没有最终NC，因此D13=UNKNOWN、D14/D15=NOT_RUN、D16=BLOCKED；不得以本数学Golden代签。无材料扫掠仿真。

## 5. 规则和可独立运行的入口

[6项来源和逐条阅读局限](../../../research/sources/CAP-09-02-dual-branch-b51.json) → [8规则/字段/原F1-02/E3-04/E3-05/U4-04追踪](../../../research/traces/CAP-09-02-dual-branch-b51-v08.json) → [2正、26反、3 UNKNOWN的合成输入](dual-branch-b51-fixtures-v08.json) → [只读Node判定工具](../../../tools/check_cap0902_dual_branch_b51_v08.cjs) → [执行等级](../../../tracking/cap0902-dual-branch-b51-verification-2026-10-31.json)。

测试入口：`node tools/check_cap0902_dual_branch_b51_v08.cjs`（需完整仓库checkout；工具只读JSON）。本轮在连接器运行环境执行`judge`同函数31/31；由于独立Node文件/Native/真实B5、双驱零位和17消费者未运行，记录`NOT_RUN`而非产品PASS。后续独立消费者至少由D14重新计算每个物理Joint Frame，D15用真实NC回放的不同来源时序验证，不得使用本工具的`expected`字段当生产Oracle。

## 6. 对L3的待审项

批准Frame组合方向、实际设备校准/误差政策、多个物理Joint耦合与回零的证据要求、D03/D04/D10/D14接口的版本迁移与Owner签署。真实独立Consumer至少以原生OCCT版本、三轴+B5实际D03/D10及最终NC制造证据跨进程复算；失败/不确定返回UNKNOWN并保留冻结。**规划PASS≠产品PASS。**
