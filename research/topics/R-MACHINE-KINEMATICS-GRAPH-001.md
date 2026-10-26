# R-MACHINE-KINEMATICS-GRAPH-001｜运动链拓扑、正解与标定边界

ISO 841:2001官网仅核对官方目录、摘要、2001版与2023年确认；未读取付费正文，不编造轴向标准条款。LinuxCNC 2.9 Kinematics §1-4及5-Axis Kinematics §2-5、§7说明笛卡尔空间与物理joint区别、FK/IK、机床链与Frame变换；kins(9)说明一个逻辑轴可由多个joint驱动。这些仅是已读实现范例，非B5 OEM校准。

OCCT 8.0.1 gp_Trsf、TopLoc_Location公开API可对照坐标变换，不能提供机床实际旋向、物理行程、控制器RTCP解释。NIST刊载Gao等2023论文仅阅读官方摘要：轴内、轴间、体积误差概念，不可将理论FK视为真实机器标定。She与Chang 2007论文只读出版社摘要和开放片段，不假称获得完整分析公式与实验。PROV-O表示来源，RFC 9110 If-Match仅是条件写入类比。

项目自身模型合同：单根DAG、物理joint唯一ID、右手列向量左乘、未知枢轴为UNKNOWN；T_world_child=T_world_parent·T_parent_pivot·JointMotion(q)·T_pivot_child。合成XYZ与AC向量检查数学公式，不证明现场安全。D03≠D10、D11 CL预检≠D15独立NC验证，D13→D14→D15链不可跳过，不做材料扫掠。

[逐条合法来源、作者版本及阅读深度](../sources/CAP-09-01.json) → [字段/规则/原包](../traces/CAP-09-01.json) → [30正反差异与5向量](../../docs/capabilities/CAP-09-01/fixtures.json) → [独立消费者](../../docs/capabilities/CAP-09-01/independent-consumer-handoff.md)。真实B5旋向、枢轴、限位、回零同步、RTCP及可靠误差界限仍未获证。