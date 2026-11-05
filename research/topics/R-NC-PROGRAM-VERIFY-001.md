# R-NC-PROGRAM-VERIFY-001｜NC最终字节驱动的独立机床工程验证

## 研究结论与适用限制
1. ISO 6983-1:2009的**官网目录摘要**说明其为NC程序字地址/格式的国际标准背景；其公开介绍不定义具体控制器所有扩展，更不允许推断B5机床Profile（来源C0906-S01）。完整收费正文未读。
2. LinuxCNC 2.9公开G-code、O-code和Remap文档表明，程序字顺序和实际执行顺序、子程序调用实例、模态和重映射需要明确解释（S03–S05）。这是**方言例子**，不能套用其他厂商。
3. LinuxCNC运动学文档将笛卡尔程序轴和实际Joint区分开（S06），因此D13解释结果不等于D14实际物理关节时序；D10实际机床数据仍需测量。
4. NIST IR6556 (Kramer/Proctor/Messina，2000)官方记录提供独立解释器研究的著录背景，**仅摘要和元数据已读**，不据此声称本仓实现了NIST解释器（S07）。
5. OCCT 8.0.1 `BRepExtrema_DistShapeShape` 公开API描述的是两形状静态最小距离及`IsDone`，不能对未覆盖时段的动态碰撞给安全保证（S08）。
6. RFC9110条件请求与PROV-O证据谱系可用于构建CAS与追踪方法（S09–S10），不是NC安全合格证。**来源事实≠本项目工程规则**：各条R01–R10是由上述事实推导出的Procet设计要求，尚待产品验证。

## 工程推导的门禁公式
- 令 `K = H(D12.rawBytes || D12.encoding || dependencies || postConfig || D10.actualBinding || interpreterVersion)`，工程中各部分须记录独立SHA与结构化规范，避免字符串无分隔拼接歧义；规范编码/哈希算法须由Owner会签，示意公式**不表示已实施**。
- `D13 = Interpreter(D12.rawBytes, controllerProfile, dependencyClosure)`，任何未知语义设 `knownness=UNKNOWN`，不能自行将循环体标为“已执行”。
- `D14 = ExpandKinematics(D13.typedEvents, D10.binding, D03.machineModel)`；需要关节/轴单位、分支、时序约束、旋转中心及不确定度，未知返回UNKNOWN。
- `D15 = IndependentOracle(D12Hash,D13Hash,D14Hash,physicalModels,coverage)`；Oracle不得复用D13/D14生成器自身的判断给出独立PASS。
- 发布候选判定：`ReleaseCandidate = exactInputs && allModeled && coverageComplete && independentlyReviewed && !stale && !cancelled`；即便真值成立，D16仍需**人工授权**，合成规划没有发布资格。

## 时间线与责任
D04只代表名义Setup，D10才是实际控制器/机床/刀柄安装；D12由08域生成或受控人工编辑；D13由08域NC执行适配；D14和D15属于09域但在工程验证中必须由**独立消费者**重新检查；D16由10域发布。CL/D11预演不是NC工程验证，不做材料扫掠仿真。D01–D17资产候选Owner需正式跨域会签，L3人类评审仍待办。论文全文/厂商B5手册/现场实测没有读取时不生成认证阈值。

## 证据与可机检链
[来源](../sources/CAP-09-06.json) → [规则及字段](../traces/CAP-09-06.json) → [合成正反与状态例](../../docs/capabilities/CAP-09-06/fixtures.json) → [独立消费者与回退](../../docs/capabilities/CAP-09-06/independent-consumer-handoff.md)。每条规则必须来源非空、字段非空、资产及原包关联非空；`tools/check_cap0906_planning_2026_10_27.cjs`仅检验规划一致性。**规划PASS≠产品PASS**。
