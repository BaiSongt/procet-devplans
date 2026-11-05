# B130｜CAP-04-02 配准目标点不确定度、相关性与留出点证据

2026-11-03；NEWLY_AUTHORED增量研究，L3待人类评审。只修改规划仓。原11域88 CAP、36工作包、17资产以及L1/L2和原规则REG-R01..R10保持不变。**规划PASS≠产品PASS。**

## 1. 与历史补证的区别

B20已经处理非退化对应点、刚体正交/镜像与初始残差；B75已经分离D04名义Setup和D10执行WCS。本轮新问题是：**即使配准后的fiducial残差很小，远离拟合点的制造目标点仍可能有较大且各向异性的误差；协方差交叉项和系统偏差不可由拟合RMS替代**。

NIST Franaszek与Cheok 2017论文的官方摘要明确区分用于求解的fiducials和未参与求解的targets的RMS；另一篇ICCV 2017摘要指出方向不确定度向空间目标点的传播依赖位置。两篇论文仅核对NIST著录和摘要，**未读论文全文**。NIST公开数据集目录显示125个fiducial点、16个留出目标点，但CSV尚未下载或运行，不得把目录内容写为本轮实测。

## 2. 一阶传播与合成数学Golden

对于D04列向量左乘约定 p_S=R p_P+t，采用小角扰动的一阶候选模型 J=[I,-R[p]×]，Σ_target≈J Σ_pose Jᵀ+Σ_meas，须先锁定该Jacobian所用姿态扰动定义、源/目的Frame、毫米/弧度与协方差分量的单位。**此3D矩阵关系为本轮独立工程推导，不声称是对前述论文正文的引用。**

NIST TN1297（Taylor、Kuyatt，1994版）公开HTML Appendix A §A.1–A.3明确采用一阶敏感度和输入协方差项；§5论述合成标准不确定度，§6论述扩展不确定度，§7要求报告覆盖系数、分量及评价依据。不能在缺少输入相关性、标定、系统性偏差和分布假设时自动将未知误差设为0，也不能把k=2的所有结果都标注为95%安全认证。

一个**纯合成二维截面**：y=t_y+rθ，r=100mm，σ_t=0.02mm，σ_θ=0.001rad，ρ=0.5，k=2。

- var=σ_t²+(rσ_θ)²+2rρσ_tσ_θ=0.0114 mm²；
- u=sqrt(var)≈0.10677078mm；U=k·u≈0.21354156mm；
- 名义间隙c=0.25mm时，候选筛查余量c-U≈0.03645844mm；
- c=0.20mm时余量≈-0.01354156mm，不满足本合成政策；
- 错误省略ρ时U≈0.20396078mm，会低估此反例中扩展量；
- r=0时U=0.04mm，说明仅以拟合原点附近的数值不能概括远端点误差。

上述参数完全为数学Golden，非任何设备的实际公差、校准证书、加工余量或碰撞安全阈值。U与材料实际包含/无碰撞没有自动等价关系。

## 3. 七项有界来源登记（B130-S01..S07）

| ID | 作者、版本、发表时间 | URL、此次合法访问深度 | 支撑与限制 |
|---|---|---|---|
| B130-S01 | Barry N. Taylor / Chris E. Kuyatt，NIST TN1297，1994版，1994-09 | https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty ，2026-11-03实读Appendix A.1–A.3 | 一阶敏感度与相关项；不规定机床公差 |
| B130-S02 | 同作者/同出版物，1994版 | https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty ，2026-11-03实读§5.1–5.5 | 合成标准不确定度；不是第二篇独立文献 |
| B130-S03 | 同作者/同出版物，1994版 | https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-7-reporting-uncertainty ，2026-11-03实读§7.1–7.4；§6.1–6.2另见NIST官方对应页 | k及报告；同根第三章节，非独立文献 |
| B130-S04 | Marek Franaszek / Geraldine S. Cheok，NIST，2017-03-23 | https://www.nist.gov/publications/precision-vs-accuracy-dilemma-point-based-rigid-body-registration ，2026-11-03仅官方摘要 | fiducial与target误差不等；正文未读 |
| B130-S05 | Marek Franaszek / Geraldine Cheok，ICCV2017，2017-10-28 | https://www.nist.gov/publications/propagation-orientation-uncertainty-3d-rigid-object-its-points ，2026-11-03仅官方摘要 | 空间非各向同性；正文未读 |
| B130-S06 | NIST/Data.gov，数据目录更新2017-03-02，联络Geraldine Cheok | https://catalog.data.gov/dataset/3d-data-for-the-evaluation-of-point-based-rigid-body-registration-error-3d02a ，2026-11-03仅目录和资源元数据 | 125/16点集；CSV未下载 |
| B130-S07 | Procet V0.8规划编制组，内部CAP-04-02已知Git Blob e861116adefcc63264417f9e3201cd859eb656b9 | https://github.com/BaiSongt/procet-devplans/blob/670d62c0affee8195692d629d46a6d438e4e3ab8/docs/capabilities/CAP-04-02/README.md ，2026-11-03实读§1–7 | 业务Owner/CAS/单Babylon/回退属项目决议，不冒充NIST标准 |

## 4. 规则→字段→CAP/原包→验收

| 规则 | 来源 | 关键字段 | 原编号工作包 | 合成正反验收 |
|---|---|---|---|---|
| B130-R01 双源exact身份 | S07 | cadRev/cadHash, stockRev/stockHash, occurrencePath | F1-02/W2-05 | AT01-P；N1缺CAD hash、N2缺stock hash、N3缺实例路径→UNKNOWN |
| B130-R02 Frame与单位 | S01/S07 | sourceFrame,targetFrame,unit,angleUnit | F1-02/F1-04 | AT02-P；N1机器Frame替代、N2方向反置、N3无单位→REJECT |
| B130-R03 协方差与相关项 | S01/S02 | sigmaT,sigmaTheta,rho,poseCovarianceRef | F1-02/E3-04 | AT03-P；N1负方差、N2负sigma、N3绝对rho大于1→REJECT |
| B130-R04 留出点而非拟合误差冒充 | S04/S05/S06 | heldOutTargetsRef,biasAssessmentRef,metric | F1-02/E3-04 | AT04-P；N1无留出点、N2偏差未知→UNKNOWN；N3只上报拟合RMS→REJECT |
| B130-R05 版本化覆盖政策 | S01/S03 | policyHash,k,nominalClearance,uncertaintyMargin | F1-02/E3-04 | AT05-P；N1 k=0→REJECT、N2无政策Hash→UNKNOWN、N3余量负→REJECT |
| B130-R06 单世界与同端口 | S07 | babylonWorldCount,taskPanel,ownerPort,channels | F1-04/U4-02 | AT06-P；N1两世界、N2右Drawer、N3私有UI端口→REJECT |
| B130-R07 Owner写入重验 | S07 | acl,cas,scopeEpoch,ackEpoch,cancelled | W2-05/U4-03 | AT07-P；N1撤权/N2 CAS不符→REJECT；N3取消晚ACK→STALE |
| B130-R08 失效回退与工程验证分离 | S07/S04 | d10Separate,clIsNc,freezeUnchanged,rollbackRef | F1-04/E3-04/E3-05 | AT08-P；N1自动改WCS/N2 CL认证NC→REJECT；N3缺rollbackRef→UNKNOWN |

正反场景只采用显式合成数据与自定数学政策，**每个N例单改一字段**。目标点误差不能凭3D半透明椭球或渲染拾取认证；D06独立消费者须复算同一exact D04，不可借用生产Owner自身的合成断言。

## 5. 应用、事务与跨域边界

D04的StockPartRegistrationPort读取D01 occurrence、Stock exact revision/hash/frame、测量与拟合证据，返回RegistrationUncertaintyProposal，包括fitFiducialRms、heldOutTargetEvidenceRef、biasEvaluationRef、poseCovarianceRef、covarianceUnits、jacobianVersion、uncertaintyPolicyHash、coverageFactor、qualification、affectedExactRefs。候选状态仅QUALIFIED_CANDIDATE/UNKNOWN/REJECT/STALE，永不代替正式测量认证。

GUI/CLI/Agent使用同一D04 Owner Port；单Babylon Engine/Scene/Canvas，统一左侧UnifiedTaskPanel，亮暗色与最大12px字体。Ghost/余量颜色不写入业务记录；CAS提交需服务端重验权限、scope、exact revision/hash/frame、撤权和epoch，取消后晚回执无效。A/B共享事实而不覆盖冻结D08、已发布D16；旧工程无计量协方差或校准证据时仅只读UNKNOWN，保留旧raw与rollbackRef，不填伪sigma。

D04 Setup名义配准与D10机床实装/WCS独立。中立CL→D12后处理NC→D13执行语义→D14轴时序→D15独立工程验证→D16发布；CL动画不代表NC PASS，未知语义必须unknown，不做材料扫掠仿真。

## 6. 验收等级和未完成

本轮数学与决策规则只允许“规划合成预检”；独立Node完整文件进程、NIST数据CSV、真实计量标定、OCCT、B5/OEM、D06独立消费者、D13–D15真实NC均NOT_RUN。17资产正式Owner签署0/17、实际独立消费者0/17；全仓Markdown GFM AST、历史原字节审计、L3人工批准仍待办。**规划PASS≠产品PASS。**
