# B184｜CAP-06-02 工序与几何联合搜索：支配证书、下界剪枝与Beam不完整性
> 2026-11-05；V0.8原编号不变，L3待人类评审；**规划PASS≠产品PASS**。

## 1. 为什么不能按最小成本或BBox剪枝
D06搜索一个候选状态并不只含去料体大小。其可继续加工的语义状态至少包括**不可变材料B-Rep来源与hash、D04 Setup/Frame、剩余Operation集、前序边、保护区、余量、公差预算、D08冻结集、算法Profile与适用范围**。同一BBox或同一个体积并非同一材料集合；相同Operation名称也非同一StableUID。只有相关事实均获得Owner的exact revision/hash/frame及完整条件指纹后才具备比较资格。观察差异为UNKNOWN，不用默认零公差替代。

同状态下多目标代价向量 A支配B 的**必要数值条件**为 `∀i costA[i]≤costB[i]` 且 `∃i costA[i]<costB[i]`。此外需有同目标、同单位、非负且有界的代价、相同可行的后继集合及未来代价单调性证明；本轮fixture仅检查前置守卫，并不证明真实加工代价的可加性或后继等价。对未来代价不具可比性、材料误差或保护区证据有缺口时两分支都要保留，不能冒称“数学已证明支配”。

## 2. 成本下界与不完整搜索
若有真实可行解代价U，且状态n在**同一目标函数及相同硬约束**下可采纳下界L(n)，在只求至少一个最优值且不要求枚举并列解时，`L(n)≥U`可用于受证的分支定界；若需保留多方案多样性，相等也要按明确政策处理。下界不可采纳、软约束混进硬约束或无已证明的可行上界时，不允许有保证的裁剪。该门槛是Procet自行设计的算法证书条件，不是Google或NIST对Procet的认证。

Beam设宽度K后舍弃仍未验证不可行的候选，应记录`truncated=true`、`omittedCount`、前沿/淘汰证据及随机种子/择序Profile，最终未找到解只可为**UNKNOWN**。预算中止同理，不得自动升级为INFEASIBLE。Google OR-Tools CP-SAT把FEASIBLE、OPTIMAL、INFEASIBLE和UNKNOWN分开，但它并不将其求解保证赋给Procet Beam。<https://developers.google.com/optimization/cp/cp_solver/>

## 3. 几何和各域数据隔离
Open CASCADE OCCT 8.0.1 `BRepAlgoAPI_Cut`公开API只说明布尔差运算入口，不保证某次运算完成后的shape、保护区与D07剩余量可认证。必须绑定精确before/removed/after几何及操作历史、独立BRep有效性Checker、保护区约束；无法认证时UNKNOWN/REJECT，不静默提高fuzzy或跳过布尔。<https://www.occt3d.com/dev/doc/refman/html/class_b_rep_algo_a_p_i___cut.html>

D04只负责工艺Setup与名义Frame；D10具体机床执行绑定须分离。06域只生产D06候选/D07证据，05域独立采纳成新D05并保留D08冻结原值；A/B共用工程事实而不覆盖。07域D09仅在独立认证D07和D08后生成中立CL，再经D12 NC后处理→D13执行解释→D14物理轴时序→D15验证→D16发布；CL动画与Beam候选评分均不能授予NC工程验证。本规划不做材料扫掠仿真。

## 4. 实际交互、取消与恢复
GUI / CLI / Agent同用`JointSearchDomainPort.inspectRequirements/previewSearch/submitSearch/cancelSearch/listFrontier/compareCandidates/getProof`，无第二个权威writer。全局仅一个Babylon活动3D世界，左侧统一TaskPanel展示可展开的候选证明与被剪枝原因；用户可查看同一材料/约束证书，不能仅依据分数Badge确认剪枝。预览3D租约不写数据库。正式采纳需05域重新读取D05/D08、Scope、ACL、CAS、ExactRef/Frame和任务代次；取消、撤权、切Setup以及迟到ACK必须阻断旧结果写入。迁移缺sourceHash/模型Frame/前序边的历史前沿先只读UNKNOWN，恢复经人工确认重算证书，不自动继承“支配”标志。

## 5. 规则、资产、原编号包与独立验收
[机器规则链](../../../research/traces/CAP-06-02-dominance-b184-v08.json)固定8条规则、32字段，分别覆盖同BRep/Frame、剩余工序/Guard、Pareto、可采纳下界、Beam截断、OCCT有效性、D05采纳冻结、受管Port/NC资格；[fixtures](dominance-b184-fixtures-v08.json)含8正例、32逐字段负例及8个数学/状态Golden；[只读Node门禁](../../../tools/check_cap0602_dominance_b184_v08.cjs)。联系原F1-05/W2-02/W2-03/W2-06，并单列[原W2-02交接](../../work-packages/W2-02/DOMINANCE-HANDOFF-B184-2026-11-05.md)。真实独立消费者应以相同OCCT与D04/D08 exact来源重复执行：06域消费者独立确认被删分支没有不同后继，05域消费者检查冻结与局部采纳，09/10域确认UNKNOWN阻断D15/D16。当前正式Owner签署0/17、真实消费者0/17、独立Node文件、真实OCCT/B5/NC均NOT_RUN。

## 6. 来源阅读范围和限制
[7份分级登记](../../../research/sources/CAP-06-02-dominance-b184.json)：Google OR-Tools官方HTML CP-SAT return values实读；OCCT8.0.1 BRepAlgoAPI_Cut官方HTML类说明实读；NIST Feng/Song(2001)与Kramer等(2001)仅读官方题录摘要；Hart/Nilsson/Raphael 1968仅索引摘要（直开405），没有阅读全文；原CAP和原W2-02通过GitHub固定Blob读取。**没有把这些来源说成Procet支配判据、数控安全或优化保证的外部认证**。本轮日期只代表访问/登记，原论文发表日期见来源表。
