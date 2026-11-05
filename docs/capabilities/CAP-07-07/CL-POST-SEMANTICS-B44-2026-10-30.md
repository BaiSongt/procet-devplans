# CAP-07-07｜B44 中立CL刀轴、Roll与后处理机床角语义隔离

2026-10-30研究补证；原CAP十项任务保持。**规划PASS≠产品PASS，L3待人审。**

## 关键发现
Autodesk PostProcessor官方onLinear5D接收位置及刀轴向量，但在启用机床配置和角度优化之后，这些参数可映射为机床旋转角。六个数字的语义取决于数据所在阶段和Post Profile，不能仅从类型形状辨识。**Procet D09中立CL必须固定TCP刀尖和TIP_TO_HOLDER单位刀轴，物理B/A/C轴解只属于D10绑定后的后处理/NC执行层。**
单位刀轴只固定轴线，不能唯一决定绕刀轴的Roll；非轴对称刀具若无完整姿态来源应UNKNOWN，而不默认Roll=0。这是几何与内部合同推导，不是外部产品认证。

## 合成数学反例和应用范围
| 测例 | 可得结果 | 不能推断 |
|---|---|---|
| R=I, det=+1, RᵀR=I | 合成右手刚体 | B5已正确装夹 |
| R=diag(-1,1,1), det=-1 | 镜像，拒绝D09 | OCCT允许左手坐标不等于业务通过 |
| R=diag(2,1,1), det=2 | 缩放，拒绝D09 | gp_Trsf可缩放不等于D09合法 |
| 两段3+2刀轴均(0,0,1) | 索引切削轴固定 | 五轴逆解/软硬限位已通过 |
| 10 mm、120 mm/min | 名义5秒 | D14真实Joint时间或D15 NC验证 |

## 规则、字段、资产及验收链
R1 六输入D01/D03/D04/D05/D07/D08由Owner exact revision/hash重验，冻结D08只读；R2 Frame有向、mm、正交det+1；R3 TIP_TO_HOLDER与非轴对称Roll UNKNOWN；R4 TCP与CC分开，D03名义Gauge≠D10实机校准；R5 3+2有序段与连续五轴分级；R6 进给意图/量纲与名义算式；R7 D09不能含NC/G码、机器轴或D10绑定，D11 CL动画≠D15，D13未知就不能签发D16；R8 07域同CAMDomainPort供GUI/CLI/Agent、单Babylon世界/左TaskPanel、最大12px字体、CAS/ACL/Scope及取消晚ACK，Expand→Migrate→Contract不删除旧Reader和冻结成果。

固定原工作包F1-03、E3-01、U4-04，原11域88CAP/36工作包/17资产与L1/L2不变。完整阶段：中立CL D09 → D12后处理（另绑定D10） → D13最终NC解释 → D14物理Joint时序 → D15独立验证 → D16授权发布。材料扫掠仿真不在范围内。

## 来源及阅读局限
Autodesk PostProcessor HTML指定onLinear5D/optimizeMachineAngles公开函数正文，未运行Post。Open CASCADE 8.0.1 gp_Ax3左右手和gp_Trsf镜像/缩放API正文，未实跑OCCT。LinuxCNC 2.9 G-code G43/G53/G93/G94/G95公开正文，只对LinuxCNC适用。NISTIR 5970（Frederick M. Proctor、Thomas R. Kramer、John L. Michaloski，1997-01-31）**仅官方著录和摘要，未读报告正文**。原CAP-07-07固定Git Blob内部十任务及交接经GitHub连接器阅读，CAS/ACL/单世界属于内部规则。

## 独立消费者与回退门禁
07域其他进程D09 Reader、08域D12/D13、09域D14/D15及10域D16均须独立锁定revision/hash/frame/Profile并记录consumer exactHEAD、命令、退出码、实际证据及人类审批。真实Post/OCCT/NC/B5/17消费者**NOT_RUN**，正式Owner **0/17**；规划合成不得升级为机床资格。取消或撤权后晚回执不提交；A/B同事实不覆盖D08冻结。

[6份来源](../../../research/sources/CAP-07-07-cl-post-b44.json) · [8规则及原包追踪](../../../research/traces/CAP-07-07-cl-post-b44-v08.json) · [正反未知合成fixtures](cl-post-b44-fixtures-v08.json) · [只读Node工具](../../../tools/check_cap0707_cl_post_b44_v08.cjs) · [分级验证记录](../../../tracking/cap0707-cl-post-b44-verification-2026-10-30.json)
