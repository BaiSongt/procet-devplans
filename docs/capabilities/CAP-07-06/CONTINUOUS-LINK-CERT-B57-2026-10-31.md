# CAP-07-06｜B57 连续进退刀与保持下刀的区间保守证明（2026-10-31）

**范围：** V0.8原编号CAP-07-06及F1-03/E3-01/U4-04补证；11域、88 CAP、36包、17资产与L1/L2均不变，L3继续待人类审批。本文仅为局部D09链路资格设计，不进行材料去除扫掠仿真，也不声称真实机床安全。

## 1. 研究发现与阅读深度

OMPL的[State Validity Checking](https://ompl.kavrakilab.org/stateValidation.html)在MotionValidator/DiscreteMotionValidator公开章节明确指出，离散步长过粗可能漏掉沿程无效状态。OCCT 8.0.1的[BRepExtrema_DistShapeShape](https://dev.opencascade.org/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html)提供静态两形体的`Perform/IsDone/Value/InnerSolution`；`IsDone`成功**不能**认定全段无碰或一个严格可证的误差界。FCL[固定版本README](https://github.com/flexible-collision-library/fcl/blob/ae86ecde788086110f8a4cea54ae1949df8a21d3/README.md)将静态distance与`continuousCollide`列为不同查询，但不能直接推出任意BRep/机床运动已获认证。

## 2. 内生数学推导（非厂商/标准承诺）

对完整刀具、刀柄、接杆组合刚体`T`与静态夹具/保护区/有序材料障碍`O`，若两端最近距离观测值为`c0,c1`，且**有独立证明**的测距误差上界`e`，整段平移总弧长上界`L`，相对旋转中心最大半径`R`，累计角路程上界`θ`，则按集合距离的1-Lipschitz连续性质与最近端点的位移界可构造：

```text
B = (L + R·θ)/2
c_lower = min(c0,c1) - e - B
仅在形体完整、静态障碍、Frame/运动边界和e真实可证，且c_lower > margin时允许LOCAL_ONLY候选
已认证碰撞 → REJECT；证据不足、无收敛或c_lower ≤ margin → UNKNOWN（退刀或继续分段取证）
```

假设段内路径/角度分配存在可证明的从任意点到某个端点不超过该总路程一半的上界；任意插补、动态障碍、变形、未证实的`SetDeflection`数值精度不可套此式。递归子区间必须重新取端点及误差证据，计算预算耗尽绝不自动PASS。

**合成数值**：`c0=c1=2mm,L=1mm,R=20mm,θ=0.02rad,e=0.1mm,margin=0.1mm`时，`B=0.7mm,c_lower=1.2mm`；只说明公式候选。改为`L=10mm`，`B=5.2mm,c_lower=-3.3mm`，两端均无碰也必须返回UNKNOWN，不能靠稀疏采样伪认证。合成布尔`distanceLowerBoundCertified`仅表示假设，**不是OCCT真实数值证书**。

## 3. 业务与交互数据合同

D03刀具刀柄完整组件、D04工艺Setup/Frame、D07有序Stock与保护区、D08冻结工序均以`revision/hash/frame/scope`定位，D10实际机床安装另由执行域绑定；A/B共享冻结事实而不得覆盖。D09 Owner提交新不可变候选`LinkCertificate{sourceRefs,toolholderHash,obstacleHash,setupFrame,segmentId,linearArcUpperMm,angularArcUpperRad,toolRadiusUpperMm,endpointDistanceSamples,errorUpperBoundMm,marginMm,coverageProofId,oracleVersion,status,taskGeneration}`。C0只复用最小身份/Frame/版本协议，不携带碰撞算法运行态。

GUI/CLI/Agent共用同一个`proposeLink/validateLocal/commitCAS` Owner UseCase，唯一Babylon Engine/Scene/Canvas、左UnifiedTaskPanel，字不超过12px；3D高亮、动画、点击选段仅是预览。提交时重审ACL、CAS、revision/hash/frame/scope/taskGeneration，取消晚ACK不入库；变更刀柄/夹具/Stock/姿态，旧证书及依赖NC标记STALE，Expand→Migrate→Contract保留旧读者/不可变回退。

**中立CL(D09) → NC(D12) → D13最终NC解释 → D14真实轴时序 → D15独立工程验证 → D16发布**。D09的LOCAL证书不能替代真实D15，也不做材料扫掠去料仿真；未知控制器语义与未验证轴状态必须阻断D16。

## 4. 独立消费者反例和收件

D07 Owner应在真实OCCT/经版本锁定几何库上验证细凸台在两样点间造成碰撞的反例、真实刀柄包络、测距误差上界；D09 Owner必须验证区间自适应覆盖/预算耗尽；D12/D13以最终NC字节复核后处理与宏/循环语义；D14/D15根据D10真实设备构型检查轴限与完整运动；D16不得把CL动画充作工程验证。收件要附消费者仓库exact HEAD、运行环境/命令/退出码、二进制哈希、正反样例和签署人。当前17正式Owner签署0/17，17真实独立消费者0/17，L3待审，所有产品验证NOT_RUN。

[5项来源（含NIST 1998论文**只读摘要**）](../../../research/sources/CAP-07-06-continuous-b57.json) → [8条来源/规则/字段/原包](../../../research/traces/CAP-07-06-continuous-b57-v08.json) → [8正27反14 UNKNOWN](continuous-link-b57-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap0706_continuous_link_b57_v08.cjs) → [等级记录](../../../tracking/cap0706-continuous-link-b57-verification-2026-10-31.json)。NIST [A Framework for Component-based CNC Machines](https://www.nist.gov/publications/framework-component-based-cnc-machines)出版1998-12-01、作者Michaloski等，仅作为组件化架构背景，不为碰撞公式背书。**规划PASS≠产品PASS。**
