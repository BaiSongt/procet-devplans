# R-MACHINE-BIND-001｜从工艺名义Setup到机床执行绑定

ISO 841:2001官方Abstract只提供坐标及轴运动命名的标准语境；未读付费全文，不能从中填出B5机械正向及几何公差。ISO 230-1:2012的官网目录/Abstract关注无载/准静态几何精度，不能代替实机安装计量。OCCT 8.0.1 gp_Trsf官方API说明SetTransformation与SetDisplacement用途不同，Multiplied有明确顺序且API允许镜像/缩放；只允许SE(3)是Procet数据决策。

LinuxCNC 2.9坐标/G-code/FK-IK公开章节分别区分机床坐标、工作偏置和非平凡运动学，仅是特定控制器模型。RFC 9110 If-Match与RFC 8785规范化是并发/摘要理论支持，但需额外Owner ACL/Scope/CAS；W3C PROV-O帮助追踪新旧D10来源与失效。NISTIR 6556本轮仅可核著录/封面元数据，PDF正文尚未分析，不引用章节或技术结果。

右手列向量左乘：^M T_P(q)=^M T_Table(q) · ^Table T_Fixture · ^Fixture T_Setup · ^Setup T_Part。合成数学测试M01(110,25,5)、M02 Z+90°(100,10,0)、M03错误乘序(110,0,0)应拒绝、M04 Z+180°(-15,0,0)。Z回转只是教学Oracle，不代表B5实际运动链、RTCP、主轴安装或控制器偏置。

[10来源](../sources/CAP-04-06.json) → [10规则40字段/原5包](../traces/CAP-04-06.json) → [74正反/状态/数学](../../docs/capabilities/CAP-04-06/fixtures.json) → [独立消费者](../../docs/capabilities/CAP-04-06/independent-consumer-handoff.md)。这些为规划规格；实际物理测试与软件运行NOT_RUN，L3与Owner待人类。
