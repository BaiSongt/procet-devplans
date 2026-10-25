# R-CONTINUOUS-5AXIS-001｜连续四/五轴刀轴场与机床可执行性分层
**核对日 2026-10-26；对应CAP-07-04，L3待审。** [9项公开来源与阅读深度](../sources/CAP-07-04.json) → [10条规则与字段](../traces/CAP-07-04.json) → [业务规格](../../docs/capabilities/CAP-07-04/README.md) → [20正反/10独立错误变异](../../docs/capabilities/CAP-07-04/fixtures.json)。

## 来源实际可读范围及未读事项
- ISO 14649-11:2004官方页面显示2004年12月Edition 2、2024年确认且有后继修订项目；**仅目录与摘要**，没有将付费标准条款当作已读。
- LinuxCNC 2.9 [五轴运动学](https://linuxcnc.org/docs/2.9/html-12086382747/motion/5-axis-kinematics.html)第1–3、5、7节说明刀位可由尖点与方向向量描述，并给出特定机构正逆解和旋转偏置；[运动学](https://www.linuxcnc.org/docs/2.9/html/motion/kinematics.html)说明Cartesian到joint分层。示例不是B5专用实机标定。
- OCCT 8.0.1 `gp_Quaternion` API提供单位化、矩阵和等价旋转，`GeomLProp_SLPropsBase`提供局部曲面法向存在性；不保证trim、gouge和机床运动。
- Autodesk Fusion公开帮助列出Swarf/Flow/Contour和避碰设置，只能作为**厂商能力场景**，不能用来认证通用算法或“勾选即可安全”。
- Sun、Sun、Lee（2019，ASME，DOI 10.1115/1.4043266）的文章本轮只核第三方开放著录与摘要，讨论奇异姿态下刀轴重定向与过切约束；**未读论文全文、公式或实验原始数据**。
- W3C PROV-O公开Intro/wasDerivedFrom及RFC9110 §13.1.1支持来源与条件提交设计，但不代替几何Oracle或Owner事务实现。

## 逐项推导与边界
1. CC位于真实B-Rep修剪面上的几何接触点，TCP位于刀具定义的参考点；二者偏移依赖刀形、刀轴与法向，不能用`TCP=CC+R*n`冒充普适公式。
2. `S_u×S_v`用于局部法向候选，但当导数退化或在接缝/修剪边时需Fail-Closed；局部法向不能自行推断为刀具可进给姿态。
3. 对单位四元数`q_i`、`q_(i+1)`，几何姿态最短差角可由`2acos(clamp(|q_i·q_(i+1)|,0,1))`获得，q/-q不是真实跳变；方向变化有界不等于线/回转关节速度有界。
4. 真实机床运动学映射依赖D03拓扑与D10绑定，近奇异可能导致轴角速度升高或分支跳跃。CAM只给候选/未知，下游D14才有执行侧轴时序，真实D15只能以最终D12 NC经D13控制器语义解释后判定。
5. D11 CL局部预检与D15真实NC验证分离。若刀具组件、夹具B-Rep、控制器宏循环语义或偏置未知，应保持UNKNOWN，不用材料扫掠或CL动画伪造完成。

合成[验证规则](../traces/CAP-07-04.json)使用模型自编样本，真实几何/后处理/控制器/机床/独立消费者仍未执行。**规划PASS≠产品PASS**。
