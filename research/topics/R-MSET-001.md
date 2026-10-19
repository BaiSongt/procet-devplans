# R-MSET-001｜多Setup与转序的理论边界
## 实际阅读范围（2026-10-19）
**ISO 841:2001**（官方目录/Abstract）限定机床坐标命名；2023确认现行。不支持由它直接推导“每个工艺Setup必对应G54/G55”。**ISO 5459:2024**（官方目录/Abstract）讨论设计基准与datum系统的规定，verification operator不属于该目录可据以推定的算法。两份标准均未读取收费正文、不编造条款。
**OCCT 8.0.1 gp_Trsf**（公开API的SetTransformation、SetDisplacement、Multiply/PreMultiply、Inverted）用于建立名义Frame组合的工程可实现性，但接口支持镜像/缩放等，D04排除它们是Procet设计决策。**LinuxCNC stable coordinates及G-code**（G53、G54-G59.3、G10 L2/L20、G52/G92）说明同一控制器里机床/工作偏置和模态语义不同；不能当通用所有机床控制器规则。
**NIST IPPS（2004）**官方出版摘要讨论利用公差分析选择Setup与规划表示；**2026年Wakhare等开放文章**读取Abstract/Introduction与研究范围，面向3/4轴棱柱件的按刀具接近方向、公差/precedence进行Setup分组与排序；不能据此声称完成通用五轴全自动求解。**NIST Open Systems（1996）**公开摘要强调中立过程规划数据与跨系统集成，具体Host授权CAS仍是本项目额外业务要求。
## 不应混为一谈的理论/工程层
1. D01设计datum和D04名义Setup pose不是重装夹实测。
2. 工序序列DAG提供先后约束，不等于完成D07材料状态递推。
3. D04名义姿态和D10真实机床执行绑定/偏置是不同Owner的数据。
4. D09 CL动画和D15基于D13/D14实际NC解释的工程验证完全不同。
5. 静态夹具避让/碰撞预筛≠受力稳定≠程序全模态覆盖；未知即unknown。
6. 所有文献阅读深度、作者、版本、访问日期、可引用范围和局限均在[来源登记](../sources/CAP-04-05.json)中；这份专题不是产品代码验收。
## 可复现实验
使用[合成转序矩阵](../../docs/capabilities/CAP-04-05/transfer-examples.json)对T_S2_P的180°绕Y旋转/平移进行正反变换；在负例输入镜像、无D07、循环precedence、跨Setup迟到回执，预期被拒绝或UNKNOWN。20组产品正反验收目前为[规格](../../docs/capabilities/CAP-04-05/fixtures.json)，未执行。
