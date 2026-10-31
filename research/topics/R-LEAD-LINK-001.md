# R-LEAD-LINK-001｜链接与进退刀的可证伪边界
核对日期：2026-10-26。 [CAP施工](../../docs/capabilities/CAP-07-06/README.md) · [9来源及阅读深度](../sources/CAP-07-06.json) · [机器规则](../traces/CAP-07-06.json)。

ISO 14649-11:2004仅读官网目录摘要（S01），不能推导具体安全高度或刀具坡度条款。Autodesk Fusion官方2D Contour/Trace帮助的Safe Distance、Keep Tool Down、Lead-In/Out、Allow Rapid Retract与High Feedrate可支撑将进退刀和链接独立建模，但属于特定厂商软件操作语义，不等于通用无碰证明（S02-S03）。

LinuxCNC 2.9官方G0/G1/G2/G3章节与模态组说明控制器解释、坐标模式会影响实际运动；不能泛化到目标真实机床（S04-S05）。OCCT 8.0.1的BRepExtrema_DistShapeShape提供给定两个B-Rep形体的静态最短距离及IsDone，**不保证**沿连续运动刀具、刀柄、夹具包络全时域安全（S06）。从静态采样证据不能推导连续无碰。未知则UNKNOWN/Fail-Closed，不以材料扫掠仿真代替。

W3C PROV-O支持实体派生溯源（S07）；RFC 9110 §13.1.1支持If-Match强条件更新（S08），但两者均不取代领域Owner ACL/CAS/scope/generation和D08冻结；NIST 2023论文仅读官网著录及摘要，说明NC与控制器实际观测可单独关联，**未核读完整实验**（S09）。

**规划推导**：端面相邻走刀保留“已可靠证明的局部保持下刀”能力，证明不了就安全退让或UNKNOWN；D09中立CL与D10机床绑定分离，D12后处理→D13语义→D14轴时序→D15独立验证后才允许D16。R01-R10含10正例/10反例/10不同字段故意错误变异；其PASS绝不证明真实几何、NC、机床安全。
