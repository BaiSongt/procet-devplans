# R-FRAMEGRAPH-FK-001｜FrameGraph与正解理论、证明深度及局限

2026-10-27实际联网核对：ISO 841:2001官网**仅合法目录摘要**（第2版2001-10、2023确认）；LinuxCNC 2.9 Kinematics §1/1.1/2/4读取物理Joint与指令轴的区别，Coordinate Systems §1–5读取G53、G54、G52/G92的控制器特有偏置行为。OCCT 8.0.1 gp_Trsf、gp_Ax3**公开API**说明变换/轴帧方法，不能当实机标定依据；gp_Trsf可表示镜像/缩放，必须另做SE(3)约束。

Lynch/Park《Modern Robotics》2017年Ch4只读Northwestern公开**章节与视频介绍**，不冒称收费正文；其正解非交换思路对应项目自编的合成矩阵向量。Gao、Ibaraki、Donmez等2023年机床标定综述只读**NIST著录及摘要**，仅作区分名义模型与轴内/轴间/体积误差的证据，未读论文全文，不编造B5误差精度。W3C PROV-O公开章节用于证明源→衍生证据链；RFC9110 §13.1.1仅借鉴If-Match强CAS，并不是机床规范。

本项目自定义右手列向量`T_A_B`（B→A）、`T_A_C=T_A_B*T_B_C`、`T_work_tcp=inverse(T_machine_work)*T_machine_tcp`，并按物理joint顺序合成；该公式是工程合同，**不宣称ISO未读条款**。Frame路径唯一、旋转正交、det+1和精确revision等必须单独检验。D04名义Setup≠D10实际绑定，D13解最终NC模态后D14正解，D15才工程验证；UNKNOWN不能发布、不做材料扫掠仿真。

[来源/作者版本/访问章节](../sources/CAP-09-02.json) → [规则字段和原包](../traces/CAP-09-02.json) → [30正反变异+8数学向量](../../docs/capabilities/CAP-09-02/fixtures.json) → [独立消费者](../../docs/capabilities/CAP-09-02/independent-consumer-handoff.md)。实机与产品NOT_RUN。
