# R-CL-PRECHECK-001｜中立CL的机床运动预检与安全断言边界
**2026-10-27；对应CAP-09-05与原F1-02/E3-04/E3-05/U4-04；L3待人工审批。**
从[来源登记](../sources/CAP-09-05.json)逐项记录访问深度，经[10条规则与字段](../traces/CAP-09-05.json)连接[实施文档](../../docs/capabilities/CAP-09-05/README.md)和[正反向量](../../docs/capabilities/CAP-09-05/fixtures.json)。

**运动学层次**：ISO 841:2001公开目录确认数控机床运动与坐标命名的主题，不可据目录还原B5运动轴配置。LinuxCNC 2.9《Kinematics》§1.1明确关节Joint与字母轴可能不同，2.9《INI Configuration》[TRAJ]/[JOINT_n]/[AXIS_l]讲解轨迹规划与Joint约束的差别：仅XYZABC等指令轴未越限不能证明机床物理Joint在限位内。软件实现必须依D03具体机床配置、D10实际机床绑定和精确Frame核查，缺任一项为UNKNOWN。
**离散样本与连续轨迹**：CL提供TCP/刀轴运动意图，但真实关节解可多分支，旋转轴可跨周期。只有“所有采样端点在界内”并不推出所有中间状态或动力学极值合法；因此需标明采样参数区间、容差、关节速度/加速度预算和未覆盖区域，未构造可信边界时最多CL_ONLY且未覆盖结论UNKNOWN。D11不提供安全认证。
**几何初筛**：OCCT 8.0.1的BRepExtrema_DistShapeShape公开API可求两个静态Shape的最小距离（检查Perform/IsDone后取Value），但每帧静态距离与整个运动路径下刀柄/刀具/夹具连续无碰是不同命题；不能用此API声明完整连续碰撞PASS。Gao等2023在NIST的论文仅阅读官方摘要和书目信息，不能推定B5的误差、测量公差或真实轴限位。
**审计与事务**：RFC 9110 If-Match启发Owner CAS协议；W3C PROV-O描述实体和活动之间的谱系。二者均不是机械安全认证。D03/D04/D08/D09/D10/运动学算法任何revision或hash变化均让D11旧推断STALE；旧D08与D16冻结历史保留。GUI/CLI/Agent同09域Owner Port并在提交时重验ACL、Scope、generation和取消，取消后迟到ACK不能写回。
**最终证据链**：D11为中立CL只读预检查，可返回CL_ONLY、REJECT_PRECHECK、UNKNOWN、STALE；最终NC经D12后处理后必须由D13重读实际字节及控制器语义、D14生成机床轴时序、D15独立验证、D16受控发布。禁止用D11或CL动画充当D15证据，禁止以材料扫掠模拟弥补未知控制器语义。本专题[规划40项合成案例](../../docs/capabilities/CAP-09-05/fixtures.json)只用于计划与门禁，不证明B5、真实OCCT/NC/机床/独立消费者实现通过。
