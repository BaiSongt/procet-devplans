# R-IK-BRANCH-001｜逆解多支路与奇异风险
**2026-10-27**，基于[9项来源与真实阅读深度](../sources/CAP-09-03.json)为[CAP-09-03](../../docs/capabilities/CAP-09-03/README.md)建立[10条可检设计规则](../traces/CAP-09-03.json)，原F1-02/E3-04/E3-05/U4-04。
ISO841:2001只读官网目录摘要，不能虚构收费正文条款；LinuxCNC2.9 Kinematics §1/2/4及switchkins §1/2/4/7公开正文描述joint/axis、正逆解与切换的同步风险，但**不是B5实际控制器指令能力**。Lynch/Park Modern Robotics Ch6仅公开视频教学页描述解析/迭代IK，5.3公共文字描述Jacobian奇异降秩；**未读书籍全文**。OCCT8.0.1 gp_Trsf API允许非刚体镜像/缩放，因此须拒绝非SE3，API成功不能当机床标定。Gao等NIST 2023**仅读出版元数据和摘要**，实际误差阈值须实测。RFC9110 If-Match和W3C PROV-O仅支持CAS与可追溯设计，不证明NC工程安全。
方程与反例：`FK(q)=T`可能多解、不解或在Jacobian失秩附近不稳定；单目标点(1,1)二维2R两解、(3,0)不可达、(2,0)全伸直Jacobian行列式为零，要求独立FK回代，周期角必须结合真实turnCount/软硬限位。算法不收敛、跨branch跳变或未知控制器语义应返回UNKNOWN/REJECT。D09 CL动画只可D11预检，D12最终NC→D13独立语义→D14轴时序→D15独立验证→D16发布。**规划验证与实际B5、产品验证分离**。
