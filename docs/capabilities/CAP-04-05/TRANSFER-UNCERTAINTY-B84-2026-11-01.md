# CAP-04-05｜B84 多Setup转序测量不确定度、相关性与现场执行资格分离
> 2026-11-01｜V0.8原CAP及原F1-02/F1-04/W2-05/E3-04/U4-02增量补证；NEWLY_AUTHORED，不是历史原件恢复。L1/L2不变，L3待人审。**规划PASS≠产品PASS。**

## 一、真实问题与必要边界
已有CAP-04-05定义多Setup StageGraph、T_B_A刚体坐标转换与D07精确材料状态交接，却缺少**翻面/再夹紧后测量不确定度**的显式可传播模型。一个名义CAD基准相同的Setup-B，不能因为D04齐次变换能算出来，就推导D10实际工位、工件接触或刀具TCP已经校准。设计datum指示与实际verification不同，见ISO 5459:2024**仅官方目录摘要**，不冒充已读付费标准正文。

最小工程原则：D01设计源的revision/hash/occurrence/Frame与D04两个stage、测量记录和D07前序材料状态分别具名；04域可生成候选**转序风险报告**，不能写D10实装测量、更不能赋予D15验证或D16发布资格。三维坐标变换方向明确T_B_A，不允许把OCCT gp_Trsf.SetDisplacement替代SetTransformation；右乘/左乘次序改变含义。仅接受旋转部分属于SO(3)、单位/Frame明确的示例。C0维持最小身份、hash、unit、Frame、scope、protocol，领域测量预算留04域。

## 二、定量反例：相关输入不可默认独立
设两次定位沿B坐标系同一平移分量的标准不确定度u_A=0.04 mm、u_B=0.03 mm，线性合成模型y=x_A+x_B，相关系数ρ。按明确假设的二变量协方差模型：
`u_y²=u_A²+u_B²+2ρu_Au_B`。
- ρ=0（**经证据确认**互不相关）⇒u_y=0.050 mm；
- ρ=+1⇒u_y=0.070 mm；
- ρ=−1⇒u_y=0.010 mm；
- ρ未知、源校准未知、跨Frame或单位混用⇒`UNKNOWN_CORRELATION/UNKNOWN_MEASUREMENT/STALE_FRAME`，不能自作ρ=0。
演示风险预算`u_y≤0.060 mm`为**本轮合成用例自定义k=1演示条件**，不是ISO5459或客户检验公差。ρ=+1仅回`RISK_REVIEW_REQUIRED`，ρ=0或−1仅回`QUALIFIED_DRAFT`。**以上结果不构成实际工件尺寸合格、机床安全或CAP-09/D15工程验证。**

该例仅标量平移模型；旋转/平移耦合的完整SE(3) 6×6测量协方差须锁定扰动约定、Jacobian/Adjoint、跨阶段交叉协方差、校准和实际分布。在模型未实现前，`modelKind=FULL_SE3`必须返回`UNKNOWN_MODEL`，不得以三个平移标准差复制成全部六轴位置和姿态资格。Modern Robotics §3.3.1/3.3.2公开视频文字稿分别支持SE(3)乘法及6×6 Adjoint的数学背景；**没有**独立证明本项目测量模型。

## 三、8条规则→字段→CAP/原包→显式机器正反
|规则|业务约束与字段（字段详见机器Trace）|负例资格|
|---|---|---|
| TU84-R01 | D01 sourceHash/designRevision/occurrence与D04 stage完全一致 | 缺源UNKNOWN、错修订STALE |
| TU84-R02 | T_B_A方向与SE(3)正交、det=+1、单位mm | 镜像/缩放拒绝、位移语义UNKNOWN |
| TU84-R03 | 两次实测ID/哈希/校准来源与CURRENT齐备，设计Datum不是测量 | 缺测量UNKNOWN、旧测量STALE |
| TU84-R04 | 标量模型Frame、单位、u_A/u_B及ρ必须有效 | 6DoF UNKNOWN、越界ρ拒绝 |
| TU84-R05 | k=1合成预算只授风险复核/草稿，不宣称工艺放行 | 超限RISK_REVIEW_REQUIRED |
| TU84-R06 | D04/D07/D08/D10分离，禁止CL动画或草稿冒充D16 | 缺材料UNKNOWN、越界发布拒绝 |
| TU84-R07 | GUI/CLI/Agent同04域MultiSetupPort；单Babylon、唯一左TaskPanel | 双3D/右Drawer拒绝 |
| TU84-R08 | ACL/CAS/frame/scopeEpoch/cancel/晚回执重验；双Reader与保留回退 | 过期STALE、取消拒绝 |

链接： [9项来源/作者/版本/日期/阅读深度和局限](../../../research/sources/CAP-04-05-transfer-uncertainty-b84.json) → [8规则字段逐项映射](../../../research/traces/CAP-04-05-transfer-uncertainty-b84-v08.json) → [显式正反/UNKNOWN/STALE fixtures](transfer-uncertainty-b84-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0405_transfer_uncertainty_b84_v08.cjs) → [执行等级](../../../tracking/cap0405-transfer-uncertainty-b84-verification-2026-11-01.json)。

## 四、产品交接草案（没有声称已实现）
**04域Owner端口提案** `MultiSetupPort.proposeTransferUncertainty({sourceExact, stageAExact, stageBExact, T_B_A, measuredDatumAExact, measuredDatumBExact, modelVersion, sourceCalibrations, uncertaintyCorrelationEvidence, materialD07Exact, expectedD04RevisionHashFrame, scopeEpoch, aclEpoch, cancelToken})`。字段需保留ModelFrame、来源时间/校准时效和未知原因，而非直接生成“已批准Stage”。
**GUI**：ActivityRail→装夹→统一左TaskPanel 的“Setup转序 / 测量证据 / 不确定度 / 受影响资产”四个子视图；唯一活动Babylon世界仅预览两序工件和测量矢量，≤12px文字、浅/深主题；不另建右侧Drawer。**CLI/Agent**同04域Port，只读预算建议不得跳过Owner权限。
**提交**：D04新Revision通过Owner CAS重新核对expectedRevision、contentHash、Frame、ACL、ScopeEpoch、generation、取消，晚ACK只写原任务审计且不可覆盖冻结D08；D07上序材料缺证时不得自动宣称已完成加工。A/B共用事实，不覆盖已冻结对象。
**下游**：转序实质变化标记依赖D09中立CL、D10实际执行绑定与D12 NC下游证据失效。D12最终NC字节必须再走D13控制器语义→D14物理Joint时序→D15独立工程验证→D16人类批准发布，D11 CL_ONLY不得替代；未知必须UNKNOWN。**不实施材料扫掠仿真**。
**迁移和独立消费者**：旧StageGraph Reader与新字段并行双读影子比对，任何旧测量/Frame缺口只标UNKNOWN；原项目、golden、D08冻结、D16历史均保留。独立04/09/10域消费者实际回归须包含两Setup/错Frame/反向乘法/重复夹紧/相关未知/概率模型缺失/重校准/ACL撤销/取消后ACK/恢复旧Reader；保存两方代码exact HEAD、数据SHA、量测证书、执行入口及不同实现Oracle结果。本轮并未运行Node独立进程、真实测量、OCCT、B5/OEM、D13-D16或17资产独立消费者；Owner正式会签0/17，L3待审。

## 五、来源分级
所用ISO5459:2024与JCGM100:2008仅合法目录摘要；NIST Uncertainty Machine v1.6.4只阅读官网工具介绍和相关输入说明、NIST 2013手册只读出版摘要；Modern Robotics两节公开教学文字稿实读；OCCT8.0.1官方API指定函数定点阅读；NIST IPPS2004只读论文出版摘要；本项目CAP04-05原文为固定GitBlob。没有阅读受限标准正文或原论文全文，也没有运行NIST模拟程序、实机测量或独立消费者测试。
