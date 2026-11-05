# CAP-07-04｜B168 五轴刀轴姿态双覆盖、SLERP最短弧与几何角步长

**2026-11-05；V0.8原CAP的新增研究补证（NEWLY_AUTHORED），L3待人类审批。** 原编号工作包F1-03、E3-01、U4-04；不改11个L1/L2域、88个CAP、36原包、17业务资产分母。设计稿、合成验收与实际产品验证分开。

[7项官方与固定内生来源](../../../research/sources/CAP-07-04-quaternion-shortarc-b168.json) → [8规则/32字段/来源ID](../../../research/traces/CAP-07-04-quaternion-shortarc-b168-v08.json) → [8正32独立单字段反例及8数学Golden](quaternion-shortarc-b168-fixtures-v08.json) → [只读Node检查入口](../../../tools/check_cap0704_quaternion_shortarc_b168_v08.cjs) → [分层验证记录](../../../tracking/cap0704-quaternion-shortarc-b168-verification-2026-11-05.json)。

## 1. 新补证：几何姿态连续不等于机床工程安全

三维旋转由单位四元数表示时，`q`与`-q`是**同一SO(3)姿态**。输入按`[x,y,z,w]`的明确布局，要求每分量有限、模长为1并附精确Frame与source revision/hash。无单位/无Frame或零范数拒绝，不以隐藏归一化修改源数据；跨原有布局的转换须版本化、保留原字节和来源。

两个单位四元数的最短旋转角（弧度）可按 `Δθ=2 acos(clamp(abs(q0·q1),0,1))` 求值。合成解析向量：`q0=[0,0,0,1]`，`q1=[0,0,√3/2,1/2]`，即绕Z轴120°；取半球后按球面插值`SLERP(t=0.5)`得到绕Z轴60°的中点姿态`[0,0,1/2,√3/2]`。以`-q1`替代终点，SO(3)中点仍代表60°；`q1=-q0`时角度为0，而非360°，不可直接沿未处理负点的线性插值导致零向量或除零。极近同向采用稳定小角分支；180°附近的分支和局部刀触倾角约束需显式复核，不让3D显示层私自更改权威刀轴场。

对这条**特定SLERP几何轨迹**，120°总角度、最大角步长15°要求`ceil(120/15)=8`段，预算20°要求6段。但插值后每段端点角步长满足门槛只是**必要的局部几何采样条件**：不代表曲面刀触、过切/碰撞、刀具组件与夹具间隙、逆运动学分支、轴速度/加速度、实际插补周期或NC运行的认证。不能自行设置无OEM证据的统一工业安全角阈值。

## 2. 原CAP/E3-01工程职责、入口与保守迁移

D01 CAD曲面与PMI、D03刀具/组件、D04**名义**ProcessSetup、D07有序材料态、D08冻结成果均须记录exact `id/revision/hash/frame/unit/scope`；D10真实机床/刀具安装、零点与控制器执行绑定**不能混入D04**。07域`ContinuousToolpathPort.proposeOrientationField(exactInputs,orientationPolicy)`输出候选中立D09 CL、方向场及独立可复核的姿态采样证据；只有Owner端`commitCAS()`重验精确输入、ACL、CAS、作用域代次、任务取消Fence后才可形成新不可变修订及持久回执。迟到ACK须`LATE_ACK_IGNORED`且不得覆盖A/B同事实的冻结D08；Preview不等于提交。

**GUI/CLI/Agent**三入口共用07域Owner端口。唯一Babylon Engine/Scene/Canvas、统一左侧TaskPanel及轻量Ghost刀轴/角度覆盖层，最大字号12px、浅/深主题；3D pick/gizmo的渲染缓存不反写几何Owner。切换Setup、撤权、旧generation或取消后所有旧回执失效。旧记录无四元数布局/Frame标`LEGACY_ORIENTATION_UNKNOWN`并只读隔离；采用Expand新Reader和schema→双消费者同修订对比→获批准入→Contract，旧Reader/旧冻结及历史资产保留，失败只切读取版本不删用户数据。

**D09中立CL→D12最终NC后处理→D13重新解释最终NC bytes/模态和补偿→D14读取D10实际机床轴树形成轴时序→D15独立工程验证→D16发布**。D11仅CL几何动画，不能从画面平滑推断D13/14/15为PASS。未知控制器/五轴选支/机床参数一律`UNKNOWN`且阻断D16；本CAP不做材料扫掠仿真。生产安全还需要独立OCCT、后处理、OEM实机及工艺验证。

## 3. 八项规则、字段、正反验收与独立消费者

| 规则 | 内容及核心字段 | 正反用例 | 责任/消费者 |
|---|---|---|---|
| B168-R01 | 四元数有限单位、XYZW：`q.start/q.end/q.layout/q.unitNormChecked` | R01-P及N1–N4 | 07域 → D09与09域 |
| B168-R02 | q/-q双覆盖、最短角：`hemisphere.*` | R02-P及N1–N4 | 07域 → D09 |
| B168-R03 | 合法t和中点：`slerp.*` | R03-P及N1–N4 | 07域 → D09与D14 |
| B168-R04 | 分段上限非认证：`sampling.*` | R04-P及N1–N4 | 07域 → D11 |
| B168-R05 | 精确Frame/修订/Scope与D04/D10分离：`refs.*` | R05-P及N1–N4 | D04/D10 → 07域 |
| B168-R06 | GUI/CLI/Agent单端口和单世界：`ui.*` | R06-P及N1–N4 | 07域/UI/Agent |
| B168-R07 | 中立CL/最终NC独立验收：`nc.*` | R07-P及N1–N4 | D12→D13→D14→D15→D16 |
| B168-R08 | CAS/ACL/取消晚回执：`commit.*` | R08-P及N1–N4 | 07域Owner/独立消费者 |

fixture共8正、32**逐个独立单字段**反例和8解析Golden，校验脚本只读规划JSON，不写产品数据。真实D09/OCCT、D12-D16 NC/OEM、Node完整文件执行、17正式Owner会签和17真实独立消费者验收**未执行**。人类L3、全仓Markdown GFM AST、旧历史文件原始字节审计仍待闭合。规划PASS≠产品PASS。

## 4. 官方来源、作者版本、访问时间、深度及局限

全部访问日期2026-11-05。下表逐项界定**公开可用正文/API或内部固定文档**，不是ISO受版权限制的未读条款。

| 来源 | 作者/版本/URL | 访问深度 | 局限 |
|---|---|---|---|
| B168-S01 | SciPy contributors，1.18.0，[Rotation.as_quat](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Rotation.as_quat.html) | scalar_first/canonical及double cover官方API正文 | SciPy行为不是Rust/OCCT产品实测 |
| B168-S02 | SciPy contributors，1.18.0，[Slerp](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.transform.Slerp.html) | shortest path/Parameters官方API正文 | 不保证机床关节速度 |
| B168-S03 | OCCT contributors，8.0.1，[gp_QuaternionSLerp](https://occt3d.com/dev/doc/refman/html/classgp___quaternion_s_lerp.html) | InitFromUnit/Interpolate及t范围 | Native未运行 |
| B168-S04 | Eigen contributors，nightly 5.0.1-dev+7c7d8473，[QuaternionBase](https://libeigen.gitlab.io/eigen/docs-nightly/classEigen_1_1QuaternionBase.html) | slerp API公开说明 | 不是五轴刀触认证 |
| B168-S05 | ROS2 contributors，rolling，[Quaternion fundamentals](https://github.com/ros2/ros2_documentation/blob/rolling/source/ROS-Framework/interfaces/Working-with-interfaces/Quaternion-Fundamentals.rst) | XYZW/normalize官方源码教程（docs.ros.org页面访问受限） | rolling非固定控制器版次 |
| B168-S06 | BaiSongt/Procet，固定HEAD `87524fa...`，[原CAP-07-04](README.md) | 业务S03–S10、来源/端口全文；Blob da97f825... | 内部设计非外部标准 |
| B168-S07 | BaiSongt/Procet，固定HEAD `87524fa...`，[原E3-01](../../work-packages/E3-01.md) | CL、后处理、回退原包全文；Blob 4b7c4c81... | 原计划非产品实现 |

其中ROS2滚动页固定发布信息无法证明2026-11-05具体提交SHA；不能以rolling教程推导OEM机床默认限制。NIST/ISO未读取任何受保护正文，不制造条款。**规划PASS≠产品PASS。**
