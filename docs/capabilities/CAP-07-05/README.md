# CAP-07-05｜粗半精精策略族（V0.8，L3待审）
**原88项编号及业务原文**：粗半精精策略族｜层切、余量、加工阶段与质量要求。关联原工作包 **F1-03 / E3-01 / U4-04**。保持11域、88 CAP、36包、17资产的L1/L2不变；此处是详细规划，不是产品实现或批准。

## 业务目的与策略边界
面向航空整体结构件的端面、侧壁、深腔、台阶腔及曲面，从精确设计目标D01/D02、制造资源D03、Setup毛坯D04、工艺路线/质量意图D05、局部材料状态D07和冻结基线D08生成**阶段有序**的D09中立CL候选。粗加工偏去料效率和安全，半精加工保证后续均匀可加工余量，精加工满足几何公差与表面质量意图。不同阶段不是一键参数替换；同一刀路不因阶段名称自动合格。完整自由曲面/五轴/不同材料刀具组合需要独立验证。

## 十项施工任务与可交接成果
| 子任务 | 具体输入与实现切口 | 结果/异常及验收 |
|---|---|---|
| C0705-01 阶段策略建模 | D05有序StagePlan（ROUGH/SEMI/FINISH）、作用域、策略版本、层切方向/步距/刀具与目标修订 | 阶段顺序不合法或缺来源拒绝；R02 |
| C0705-02 余量语义 | 明确侧壁径向/底面轴向、相对工件坐标与修剪曲面解释；保存独立值与单位 | 余量单调仅为本规划约束，工艺例外需新审核策略；R03 |
| C0705-03 有序Stock入口 | 以D07每阶段**真实前态精确Revision/Hash**绑定后继阶段，附D04 Setup Frame | 不能把初始毛坯当成残料；前态缺失标UNKNOWN并暂停；R04 |
| C0705-04 粗加工规划 | 按几何局部可达性选层切/自适应/平面或型腔策略，含侧壁、岛屿、窄槽及保护体 | 不编造万能载荷参数，保护区及几何Oracle失败拒绝；R05 |
| C0705-05 半精转换 | 评估前阶段剩余材料、局部台阶和连续残高，选择清根/补刀、相容刀具与有效域 | 无法证明局部残料一致则拒绝“已均匀余量”；R04、R07 |
| C0705-06 精加工分层 | 路径覆盖、刀具接触与Ra目标/几何公差分别存储；允许底面/侧壁不同策略 | 仅表示质量意图；实际表面粗糙度需测量，不能标产品PASS；R06 |
| C0705-07 资源与工况边界 | 消费D03刀具/刀柄、D11夹具与保护几何精确引用，刀具变化产生新策略修订 | 缺刀柄/夹具真实性或资源失效则安全未知，限制投产；R07 |
| C0705-08 中立CL生成 | D09每阶段带TCP、刀轴、运动段、进给意图、Frame与父D07，支持审阅差异 | 禁直接写机床A/B/C轴G代码，阶段CL不是D15验证；R08 |
| C0705-09 工程链路门禁 | 独立D12后处理→D13语义→D14轴时序→D15验证→D16发布 | 未知语义UNKNOWN，D16 BLOCKED；不做材料扫掠仿真；R09 |
| C0705-10 并发、取消与回退 | Owner CAS/ACL/scope/taskGeneration精确校验，旧读兼容，新CL修订追加 | 取消晚回执不得提交；旧D08冻结不变，回退非删除；R01、R10 |

## 工作流、异常与工程公式
计划阶段序列 $P=(p_1,\dots,p_n)$，对每阶段保存 $S_i^{in}$ 与 $S_i^{out}$（均为D07来源指纹），要求下一阶段输入引用前一阶段**已封存**的同一材料状态；不允许用CAD目标实体代替真实Stock。可选验算应由独立OCCT B-Rep Oracle检查 $S_i^{out}=S_i^{in}\\setminus V_i$ 的几何及拓扑有效性（此公式是规划数学表达，**不是**材料扫掠仿真实现）。为普通逐级粗→半精→精方案，允许用 $a_{r,rough}>a_{r,semi}>a_{r,finish}\ge0$ 与轴向对应的规划阈值；该单调条件是**本阶段特定流程策略**，不适用于所有再加工/特种工艺。合成样例余量数值绝不成为真实切削参数。局部偏置/残高无法证真时直接标UNKNOWN。

失败码：SOURCE_REVISION_CONFLICT、FRAME_MISMATCH、STOCK_PRESTATE_UNKNOWN、UNSAFE_PROTECTED_ZONE、QUALITY_NOT_MEASURED、D13_SEMANTICS_UNKNOWN、CAS_REJECTED、CANCELLED_STALE_RECEIPT。支持安全重算、只读诊断和持久化草稿，禁止自动覆盖D08冻结或其他Setup。

## 数据端口、范围及权限
业务Owner分工：D04属于04域Setup毛坯与Frame；D10是执行绑定且不得塞入D04；05域负责D05/D08冻结决策；06域拥有D07不可变材料状态；07域只通过 `CAMDomainPort.previewStageSequence/readStageEvidence/commitNeutralCLWithCAS` 生成D09候选。GUI、CLI、Agent走同一Port；每次持久化Owner必须重新验证expectedRevision/hash/frame、权限、scopeEpoch、taskGeneration及取消状态，HTTP条件更新不代替内部事务。D03刀具和D11夹具均只能精确读取。A/B模式复用同一事实链与冻结D08，不得分别维护影子Stock。

## 验收与边界
[10条来源→规则→字段→30正反/差异变异](../../../research/traces/CAP-07-05.json) · [机器可检合成场景](fixtures.json) · [GUI/3D](UI.md) · [接口实例](contract.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者](independent-consumer-handoff.md) · [研究专题](../../../research/topics/R-STAGE-MACHINING-001.md) · [9条合法来源](../../../research/sources/CAP-07-05.json)。
测试入口：`node tools/check_cap0705_planning_2026_10_26.cjs`。规划正10/反10/差异变异10，提交前可仅在隔离V8环境执行；真实OCCT/NC/机床/消费者全部NOT_RUN，L3待审、17Owner待正式签署。**规划PASS≠产品PASS。**
