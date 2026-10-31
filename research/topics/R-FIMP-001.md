# R-FIMP-001｜装夹调整的静态几何证据与增量失效边界
检查日期：2026-10-20；本专题为规划证据，不是运行验证。
## 七项实际公开来源
- **ISO 5459:2024，Edition 3**：仅官方目录与Abstract。设计datum的规定与物理测量/装夹证据不能混为一谈；付费正文未读。
- **OCCT 8.0.1 BRepExtrema_DistShapeShape**：读取官方类API的Perform、IsDone、Value与结果支持点；它计算非负最小距离，值为零不能证明“安全接触”，更不能证明动态避让。输入、输出和精度策略需随结果持久化。
- **OCCT 8.0.1 BRepCheck_Analyzer**：读取IsValid及ExactMethod语义；形状valid只是几何计算前提之一，不保证接触力学与机床动作安全。
- **OCCT 8.0.1 BRepAlgoAPI_Common**：公开API说明布尔交集候选，可用于辅助区分体积重叠；但本轮未进行可计算性、容差和退化接触鲁棒性测试。
- **NIST 2016 Testing the Digital Thread**：只读NIST出版页摘要；制造/检测完整追踪的研究背景，不构成Procet影响闭包算法的实验结论。
- **NIST Digital Thread for Manufacturing**：读取项目说明，公开记录了身份、PMI、跨链集成和数据可信的研究缺口。D04 exact hash及CAS是我们自主设计，不是NIST强制条款。
- **LinuxCNC stable Coordinate Systems**：读取G53与G54–G59.3、G92等公开章节；D10执行偏置独立于D04工艺Setup。该控制器特定语义不可推广到所有B5和商业控制器。
## 可否证明的分层
1. **仅视觉/包围盒**：给出候选，无实体验证结论。
2. **OCCT静态**：只能在特定revision、Frame、几何品质、公差、实体范围成立时谈静态间隙/相交。
3. **D11 CL级预检**：可能暴露运动意图不合理，但不覆盖NC模态/宏/机床执行。
4. **D13→D14→D15工程验证**：需实际NC和控制器语义覆盖；不明行为UNKNOWN。
5. **现场实测/物理验收**：完全独立于以上计算；装夹力、变形及工艺风险必须另取证。
影响计算取不可变版本依赖的图闭包，不是碰到资源变更就“清空全部”；[影响算例](../../docs/capabilities/CAP-04-08/impact-matrix.json)展示不相关Setup不失效。人类L3评审、产品独立消费者及实际几何运行均NOT_RUN。完整逐项来源/版本/阅读深度见[来源登记](../sources/CAP-04-08.json)。
