# R-FRAME-001｜FrameGraph坐标语义与证据边界
关联[CAP-04-04](../../docs/capabilities/CAP-04-04/README.md)、[7项来源](../sources/CAP-04-04.json)、[规则追踪](../traces/CAP-04-04.json)与[20例独立验收](../../docs/capabilities/CAP-04-04/fixtures.json)。

2026-10-19重新核对：ISO 841:2001第2版官方**公开目录和摘要**，2023年确认现行；未获付费正文。OCCT 8.0.1公开gp_Trsf、gp_Ax3、TopLoc_Location API；有镜像/比例方法，不等于项目持久化数据可允许镜像。LinuxCNC stable坐标章节对G53机器坐标、工件偏置及G52/G92的控制器特定语义有说明，但不是其它机床统一控制器规范。NIST两篇登记仅取官方出版元数据/摘要，不据此宣称容差、算法收敛性能或可靠测量认证。

数学约定：列向量左乘、右手、业务mm/rad；`^S T_C=^S T_P · ^P T_C`。合成场景：Part相对Setup平移(10,20,30)，CAD相对Part绕Z旋90°并平移(2,0,0)，CAD点(1,0,0)转为Setup点(12,21,30)，逆应还原。数值断言阈值1e-9仅限测试，不是工程公差。

证据拆分：外部来源只证明公开可见的数学/API或控制器语义；D04 Owner、Host CAS、冻结A/B、单Babylon世界、D10分离是Procet设计决策；Native OCCT版本、真实NC执行、3D渲染消费者及实机均NOT_RUN。不得将数学样例PASS写成产品PASS。
