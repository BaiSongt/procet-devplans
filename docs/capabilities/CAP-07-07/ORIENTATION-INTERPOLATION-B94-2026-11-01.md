# CAP-07-07｜B94 五轴中立CL姿态插值、反平行刀轴和Roll歧义补证

日期：2026-11-01。原11域/88 CAP/36工作包/17资产编号与L1/L2不变，L3待人审；关联原F1-03、E3-01、U4-04。**规划PASS≠产品PASS。**

## 重要新增设计约束

**端点刀轴相同或已知，并不保证完整工具姿态、插值路径及机床轴运动已确定。** 对非轴对称刀具/角度头，单个单位刀轴只约束两自由度，绕该轴Roll仍未知。D09区分`SPHERE_TOOL_AXIS`仅刀轴插值与`QUATERNION_FULL_POSE`完整姿态插值；不可将后处理计算的A/B/C值偷写到D09。控制器/机床执行资格只允许D10→D12→D13→D14→D15独立获得。

| 合成反例 | 数学结果 | 业务否证 |
|---|---|---|
| u=(0,0,1), v=(0,0,-1) | 线性中点(0,0,0)，不能归一化；180°大圆弧有无数选取 | 缺参考方向`UNKNOWN`，OCCT默认选轴不等于工艺选轴 |
| q=(0,0,0,1), -q=(0,0,0,-1) | 同一个SO(3)旋转；直接线性中点是零四元数 | 必须明确XYZW单位化与半球规约 |
| 起终刀轴差90°，t=0.25 | 归一化线性方向角18.434948823°，最短球面角22.5°，差4.065051177° | 不能把分量插值标成球面插值或真实D14轴时序 |
| 刀轴不变，Roll改变90° | 两个完整工具姿态不同 | 非轴对称总成缺D03完整Pose/Frame来源必须`UNKNOWN` |

角误差预算、反平行所用`reference`、Roll证据字段与拒绝状态是Procet**内生规划规则**，不是ISO、NIST或OCCT给出的通用公差。合成数值不认证真实几何、连续碰撞或机床动态。

## 数据、Owner、接口与NC边界

07域CAM Domain Port拥有新D09 revision：`previewNeutralCL/readExactNeutralCL/commitNeutralCLWithCAS`。D01/D03/D04/D05/D07/D08来自各自Owner的**exact revision、contentHash、hashKind、frameRevision、frameHash、scope**，D08冻结不允许回写，A/B共享同一工程事实。工具`TIP_TO_HOLDER`轴和TCP/CC分开。提交时重读Owner ACL/CAS、Frame/Scope/任务及回执代次；取消后晚回执、撤权、来源陈旧均不得采纳。

GUI/CLI/Agent使用同一07域入口；唯一Babylon Engine/Scene/Canvas、左TaskPanel、最大字号12px。预览OverlayLease只借阅显示世界，界面注明「CL轨迹预览，不是最终NC工程验证」并显示Roll缺失和反平行`UNKNOWN`，不能用绿色路径伪装D15 PASS。

**D04名义Setup ≠ D10实际机床执行绑定；D09中立CL → D12 NC后处理 → D13最终NC方言/刀补/宏执行语义 → D14关节时序 → D15独立NC验证 → D16受控发布。** D13未建模语义维持UNKNOWN且阻断D16；不进行材料扫掠仿真。旧D09 Reader、旧NC和D08冻结字节保留；Expand→Migrate→Contract需独立消费者通过和人工批准，回退仅切换引用，不删用户数据库。

## 合法来源及阅读边界

[8项分级登记](../../../research/sources/CAP-07-07-orientation-b94.json)：OCCT8.0.1 `gp_Quaternion::SetRotation`公开API和SciPy1.18 `Slerp`指定说明、W3C PROV-O及RFC9110指定公开正文已读；Eigen官方文档打开超时，仅搜索结果摘录；Lavernhe/Tournier/Lartigue(2009)仅arXiv摘要；NISTIR5970仅官方著录与摘要；原CAP目标为GitHub固定Blob。**未读论文、付费标准或手册全文不得冒充已读；没有真实Eigen/OCCT运行。**

## 来源→规则→字段→原包→独立正反验收

[8规则追踪](../../../research/traces/CAP-07-07-orientation-b94-v08.json) → [35明确期望的正反/UNKNOWN样例](orientation-b94-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap0707_orientation_b94_v08.cjs) → [核验等级](../../../tracking/cap0707-orientation-b94-verification-2026-11-01.json)。工具命令`node tools/check_cap0707_orientation_b94_v08.cjs`，需在完整规划仓根目录独立运行。另有3个解析数学Golden；机器可检不等于实际运行过独立Node进程。

下游独立消费者需固定D09 exact Hash、Frame、D10实际绑定、post/controller Profile、运行代码HEAD、正反输入、退出码、产物SHA；分别执行D12/D13/D14/D15/D16，真实Owner0/17、真实消费者0/17、L3待人审，**规划PASS≠产品PASS**。
