# CAP-09-03｜B89 近奇异逆解、阻尼步长与残差可信分层（2026-11-01）

> 交付身份：NEWLY_AUTHORED 研究补证；L1/L2和11域88 CAP、36原包、17资产编号不变；L3待人类审批。只做规划/解析合成，不是五轴控制器或机床认证。

## 问题与事实边界

在机床近奇异构型，微小的TCP方向变化可能要求很大的旋转Joint变化。**可计算一个有限的阻尼逆解**不等于**已满足目标姿态、关节速度限位或NC工程安全**。02域D03提供机床轴拓扑，04域D04仅为名义Setup，04域D10才是实际机床/控制器/夹具/刀具执行绑定。09域CAP-09-03只产生保留全部分支与不确定性的IK候选；D13仍需由08域独立解释最终NC，D14再计算物理Joint时序，D15另行独立验证，D16人类授权发布。

## 外部证据与读取深度

- [Northwestern《Modern Robotics》Chapter 5](https://modernrobotics.northwestern.edu/chapters/chapter5/)：Lynch/Park，2017-09-23，**仅公开章节文字简介**，含§5.1 Jacobian、§5.3 Singularities、§5.4 Manipulability；没有借此宣称已读书籍或视频全文（B89-S01）。
- [Northwestern Chapter 6](https://modernrobotics.northwestern.edu/chapters/chapter6/)：2017-09-23，§6.2 Numerical IK公开简介；数值Newton-Raphson是研究背景，不替代逆解工程认证（B89-S02）。
- [Eigen 3.3.9 JacobiSVD 官方文档](https://libeigen.gitlab.io/eigen/docs-3.3/classEigen_1_1JacobiSVD.html)：已读API Detailed Description、rank与setThreshold；rank由**调用者设定的阈值**决定，不能当不依赖量纲/配置的绝对物理性质（B89-S03）。
- [Cripps等，2017，IJMTM 116:40–51](https://researchportal.bath.ac.uk/en/publications/singularities-in-five-axis-machining-cause-effect-and-avoidance/)：仅读Bath机构仓摘要；指出转轴奇异附近轴运动不稳定，不能声称本轮重现论文试验或读取全文（B89-S04）。
- [NIST Moylan等，2011 五轴试件](https://www.nist.gov/publications/evaluation-proposed-test-artifacts-five-axis-machine-tools)：仅读出版摘要，改变工件倾角会改变轴轨迹；不提供Procet的默认轴速/限位或验证阈值（B89-S05）。
- [Cambridge 2024上线的《Modern Robotics》第6章目录](https://www.cambridge.org/core/books/abs/modern-robotics/inverse-kinematics/C98C1958551678B2C1ECE911C9CDA745)：只核对正式出版元数据，无付费正文读取（B89-S06）。
- [原CAP-09-03 exact Blob](README.md)：内生业务规则和Owner/CAS/GUI来源（B89-S07）。独立算法、量纲归一化、阻尼参数和动态预算是**Procet设计推导**，不得冒称来自ISO强制条款。

## 可复算对角矩阵反例

取**只用于数学教学的二维归一化Jacobian** `J=diag(1,0.001)`，目标局部增量 `e=(0.1,0.1)`。未阻尼伪逆的第二Joint增量为 `0.1/0.001=100`。采用合成参数 `λ=0.01` 的阻尼最小二乘（Tikhonov）：

`Δq_i = σ_i e_i/(σ_i²+λ²)`

则 `Δq₂=0.9900990099009901`，但第二分量局部残差 `r₂=e₂−σ₂Δq₂=0.09900990099009901`，即**步长受限同时远未完成目标运动**。一旦混合转角rad、线位移mm而未声明归一化矩阵，上述奇异值和λ的直接比较失去工程意义。合成阈值 `0.0001`、步长预算、尺寸均非B5或任一OEM机床实测、也非ISO阈值。

## 来源→规则→字段→CAP/原工作包→正反验收

[7份来源](../../../research/sources/CAP-09-03-ik-conditioning-b89.json) → [8条字段追踪](../../../research/traces/CAP-09-03-ik-conditioning-b89-v08.json) → [8正+24反+2解析Golden](ik-conditioning-b89-fixtures-v08.json) → [只读Node检查](../../../tools/check_cap0903_ik_conditioning_b89_v08.cjs) → [执行分级](../../../tracking/cap0903-ik-conditioning-b89-verification-2026-11-01.json)。

| 规则 | 业务输入/字段 | 结果与失效策略 | 原包 |
|---|---|---|---|
| B89-R1 | D03/D04/D10、Frame、Profile、exact Hash | 过期STALE，缺Profile UNKNOWN | F1-02 |
| B89-R2 | SVD维度、奇异值、显式阈值/数值秩 | 阈值缺失UNKNOWN，错误输入拒绝 | E3-04 |
| B89-R3 | Task/Joint归一化比例版本 | 混用量纲拒绝，比例缺失UNKNOWN | E3-04 |
| B89-R4 | λ、增益、步长及解析残差 | 有界候选≠收敛，未阻尼风险UNKNOWN | E3-04 |
| B89-R5 | 零奇异值及歧义方向 | 退化/方向丢失UNKNOWN | E3-05 |
| B89-R6 | 分支/完整周数/速度/加速度/限位 | 丢分支或超限不通过 | E3-04 |
| B89-R7 | 独立FK与残差/公差资格 | 规划数值不得写实测VERIFIED | E3-05 |
| B89-R8 | GUI/CLI/Agent、单Babylon、左TaskPanel、CAS/ACL/取消Fence | 晚回执拒绝，D15/D16不升级 | U4-04 |

## 用户可见逻辑与独立消费者

统一左TaskPanel中显示当前D03/D10 exact来源、奇异值区间、归一化Policy、完整Joint周数与候选分支、阻尼步长、**未消解的TCP残差**；在唯一Babylon Engine/Scene/Canvas上画风险位置而不叠建第二个3D。GUI、CLI、Agent通过同一09域Owner端口取得候选，点击预览与实际CAS提交必须分离。提交须再查Revision/Hash/Frame/scope、ACL、任务代次及取消Fence；取消后的迟到ACK不可发布，源配置改变标STALE，需显式回退到旧D08冻结成果或提示迁移。07域CL动画是D11预检而非D15 NC工程验证，未知控制器语义显式UNKNOWN，不做材料扫掠仿真。

真正E3-04和E3-05独立消费者验收应分别从最终D12原始NC→D13→D14时序重新计算，验证在奇异区间的Joint速度/加速度和连续性，再由D15独立执行工程检查；没有真实B5/OEM配置、计量数据及控制器Profile时仍为NOT_RUN。A/B共享事实但不可覆盖原冻结。

## 本轮执行等级

8规则、32条显式预期（8正24反）及2个手算Golden；同判定函数可做规划合成检验，但**不等于独立五轴数学Oracle或物理安全验收**。无实际五轴模型、OCCT、OEM、真实NC解释器、D15消费者签收、17资产Owner会签或L3设计审批。**规划PASS≠产品PASS。**
