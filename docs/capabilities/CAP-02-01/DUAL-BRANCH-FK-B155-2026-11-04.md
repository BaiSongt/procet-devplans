# CAP-02-01｜B155 双分支机床运动学、parent-local Frame与原点/回零资格（2026-11-04）

> **规划补证，L3待人审。** 不改L1/L2/原88 CAP、36包或产品仓。B51在D14讨论双分支相对TCP，B53/B108讨论D14关节原点与分支；本轮区别是**D03机床资源发布前**必须定义与验证刚体树的父局部安装关系，并为跨Owner消费者提供与机型名无关的证据包。

## 1. 核心几何与工程判据

D03发布的MachineDefinition应固定 `machineExactRef=(id,revision,contentHash,topologyHash,unitSystem)`、父子刚体节点、每个Joint物理ID/type、`axisDirection@parent-local`、`parentFromChildAtZero`、真实旋转中心/pivot、Home来源以及spindle/workpiece两类接口Frame。物理Joint不等于NC程序轴字母；LinuxCNC 2.9 KINS官方示例允许两个物理Joint映射同一Y轴，此行为也不能直接外推其他OEM。

对一条刚体链，采用列向量、右乘局部姿态的**本项目约定**：`WorldFromChild(q)=WorldFromParent(q)*ParentFromChildAtZero*JointMotion(q)`。关节运动前后乘必须通过明确的Joint Frame定义，而不是把这一写法当所有厂商的默认惯例。对主轴末端 `S` 与工件承载端 `W`，只读资源正运动学产生 `WorldFromS` 与 `WorldFromW`，相对关系为 `WorkFromSpindle=inverse(WorldFromW)*WorldFromS`，绝不能直接相减欧拉角或只算主轴链；只有纯平移、共向时才能退化为一维差。世界/工件Frame的方向必须入契约。

旋转中心不在可视Mesh原点时，位置 `p'=c+R(q)*(p-c)`；忘记pivot会产生假TCP偏移。数学零位 `q=0` 不等于经过测量和回零程序验证的 `q_home`，两者各有来源修订。OCCT 8.0.1的gp_Trsf含ScaleFactor和Mirror能力，不能单凭API成功就把任意变换当刚体；应对正交性、单位、det与证据来源另设验证。

## 2. Owner与交互契约

| 环节 | 唯一业务Owner/消费者 | 精确输入与证据 | 失败路径 |
|---|---|---|---|
| D03资源定义/发布 | Resources Owner | machine exact revision/hash、物理树、spindle/work接口、parent-local轴、Home及来源、候选controllerProfile | 父链无根/有环、错帧、比例/镜像或pivot未知：`UNKNOWN_OR_REJECT`，不发布可执行能力 |
| D04工艺Setup | Setup Owner | D03 exact资源引用、名义Part/Stock与Setup Frame | 可看名义预览，但不得将D04名义偏置冒充机床安装 |
| D10实装执行绑定 | ExecutionBinding Owner | exact D03+D04、实装/回零/刀长及控制器profile | R1/R2或实际Home变化须生成新绑定候选，不覆盖冻结 |
| D13→D14→D15→D16 | 各独立Owner | 最终NC解释、物理Joint逐时样本、机床配置/阈值/独立验证及发布 | `UNKNOWN`不晋级，CL线框播放不等于NC安全 |
| GUI/CLI/Agent | 同一Resources领域命令 | Host身份、scopeEpoch、expectedRevision、idempotencyKey、ACL再检查 | 取消/切工程/撤权后晚回执丢弃，不将PreviewLease作为提交 |

**3D与资源世界**：只有一套活动Babylon Engine/Scene/Canvas，制造资源/主工程以世界切换而非并排两套3D；仅左侧统一TaskPanel控制机床目录→轴树→Frame→验证→发布。点击构件只修改SelectionIntent。真实显示几何缺失则显示代理轴/行程，不能标为碰撞或可达性PASS。机床B5/三轴可选默认资源只是演示清单，不为OEM实机赋值。字体遵守现有12px上限。

**迁移与回退**：发布后R1不原地重写；新pivot/关节方向/安装接口形成R2并由事件按依赖传播D10/D14/D15失效候选，A/B同一事实共享但不覆盖冻结快照；旧Reader保留R1解析/只读，不能默默升级latest。权限失败、旧scope晚返回均不可提交，需新发起权限/版本重验。L3继续待人审。

## 3. 分级来源（2026-11-04访问）

见 [6项精确来源、版本、作者、章节、访问深度与局限](../../../research/sources/CAP-02-01-dual-branch-fk-b155.json)。LinuxCNC 2.9 KINS和5-Axis Kinematics为同一项目不同章节，不算两篇实验论文；OCCT 8.0.1 `gp_Trsf`只提供API；Northwestern `Modern Robotics` Chapter 4仅阅读页面公开教学介绍、未播放视频或获取书籍全文；ISO 841:2001仅合法目录与摘要（2023确认），**不编造收费条款**。本仓原CAP-02-01固定Blob列为内生业务源，不归因于外部标准。

## 4. 可机检的独立正反与数学Golden

[8规则/32字段/原F1-02/F1-06/E3-04/U4-02/U4-03包](../../../research/traces/CAP-02-01-dual-branch-fk-b155-v08.json) → [8正+32单字段独立反+8解析Golden](dual-branch-fk-b155-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap0201_dual_branch_fk_b155_v08.cjs) → [等级记录](../../../tracking/cap0201-dual-branch-fk-b155-verification-2026-11-04.json)。一维线性与二维SE(2)公式仅是必要行为的教学合成，对空间SE(3)、真实pivot链、OCCT、真实MachineFK、实机奇异性/碰撞/轴软限位没有充分性证明。数值样例采用人为选定值，不能作为精度公差或Oem安全承诺。

独立消费者验收入口：F1-02使用真实D03发布Blob、F1-06用Setup原准确修订复现旧Reader回退，E3-04以独立D14 FK实现和两分支观测对照正逆、U4-02/U4-03做唯一Scene/左TaskPanel及取消晚回执端到端；D13最终NC→D14→D15仍须独立工程测试。上述真实消费者与正式Owner签署**0/17，NOT_RUN**。本次规划检查绝不改写此状态。**规划PASS≠产品PASS。**
