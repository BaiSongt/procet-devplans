# CAP-06-03｜局部 B-Rep 去料计算（V0.8 L3待审）
> 原11域、88 CAP中的第06域原编号条目；原始描述为“交并差、修补、岛屿、多环及容差处理”。关联原F1-05/W2-02/W2-03/W2-06；不更改L1/L2和资产Owner。原文见[88项映射](../../architecture/v0.8/03_三级能力映射_88项.md)。

## 业务目标与非目标
对于指定Setup中的真实毛坯、上一工序有序材料状态及候选局部去料体，以**OCCT真实B-Rep布尔**计算CUT、COMMON、FUSE后的 D07 材料状态，保留可复核的布尔历史、局部几何修补版本及精确来源；支持薄壁、台阶复合腔、孔中岛屿、多环、斜面、多Solid及旋转Setup。**这是一份实施规格，未执行真实内核计算；合成单元格集合验证只证明集合分解逻辑。**不通过屏幕上的网格或BBox假装证明实体布尔。绝不提供体素化材料扫掠仿真；不自动认证刀路、NC或实机。

## 业务流程、用户可见异常与受管端口
1. **L0读取**：由03域 D01、04域 D04、06域 D06/D07 的Owner签名引用获得exact id+revision+bytesHash/hashKind+frame+unit+scope+branch+Setup；坐标变换必须显式受控，并与 D10 实际机床执行绑定分离。
2. **L1隔离输入**：06域 LocalBRepRemovalDomainPort 从上一不可变Stock B-Rep、局部候选体、保护区及余量策略构造单次计算上下文；由契约指定OCCT版本、单位、拓扑容差预算，不从UI选择推算阈值。
3. **L2几何分解**：为重叠A、B去料体，计算 A\\B、A∩B、B\\A 三个无重叠集合区，再按可证明的并集重组；基本恒等式 A∪B=(A\\B)∪(A∩B)∪(B\\A)。这仅是集合关系，实际N个重叠体必须有区域划分方案、OCCT历史、累积误差限与顺序对账；不能把两两拆分自动推广为通用可行证明。
4. **L3布尔核算**：使用 BRepAlgoAPI_Cut/Common/Fuse 或 BOPAlgo_BOP，记录输入、SetNonDestructive、fuzzy、是否启用反转检查、Build/HasErrors/Warnings、历史Generated/Modified/Deleted；禁止不明原因吞掉WARN与ERROR。
5. **L4几何审查**：分别对输入与结果运行BRepCheck_Analyzer（拓扑及几何检查），比对岛屿保留、多环闭合、Solid身份、保护区不相交、目标/余量及材料体积守恒**误差界**。体积只对适用的闭合实体在独立容差下对账，不能把计算量当证明。
6. **L5修补**：若失败，可显式进入ShapeFix候选支线；必须输出新Revision、前后哈希、修补操作+版本+修改面集及再校验证据。无法恢复返回 UNKNOWN_GEOMETRY/REJECT，而非静默覆盖毛坯、D08或人为扩大fuzzy。
7. **L6冻结与交接**：06域只保存D06/D07不可变候选，D05采纳需05域PlanAdoptionPort、D08冻结继续由05域持有；D09仅接独立D07验证且D08 frozen exact；D09 CL→D12 NC→D13执行语义→D14轴时序→D15独立验证→D16发布资格逐级分离。D13未知语义为UNKNOWN，D15/D16不得因CL动画过关。
8. **L7异步收尾**：写入时重读当前HEAD、ACL/授权代次、Job generation、取消/晚回执，CAS失败隔离staging，可重放审计不可重放权威冻结；双Setup、A/B同事实不互相覆盖。

## 字段和精度策略
输入StockRef与TargetRef：`assetId/revision/hash/hashKind/frame/unit/project/branch/setup/scope`；BooleanTask：`candidateId/stepUid/sourceClosure/occtVersion/operation/setNonDestructive/fuzzyBudget/protectionVersion/allowancePolicy`；输出：`stockBeforeRef/removeRef/stockAfterRef/booleanReport/checkerReport/historyMap/repairNewRevision/volumeAudit/decision/invalidates`。C0仅标识、单位、Frame、scope与修订协议，具体布尔参数归06域。相同语义不同内容不可共用hash；哈希前明确规范化与字节种类。候选分支与真实冻结D08分开，不共享可变TopoDS句柄。**所有容差数值来自用户批准的单位化政策或实测，样例数值仅为合成示意。**

## 工程边界与失败矩阵
- 多环/岛屿拓扑变化、非封闭Solid、跨Frame的保护区比较、无合法fuzzy额度、超Boolean预算、ShapeFix失去历史，返回 UNKNOWN 或受控 REJECT；可在GUI呈现失败位置与最小复现来源，不给PASS。
- 保留修改前D07和D08的只读历史；对改变的工序UID向后精细失效，不能扩大到无关Setup或D01 CAD基线。
- 强调实际OCCT在目标航空复杂零件、薄壁、斜面、圆角等的鲁棒性属于产品验证，不以静态逻辑检查代替。
- 不承诺实时材料去除扫掠、高速切削物理仿真、控制器宏支持、五轴RTCP能力。

## 追踪与验收
[GUI/3D](UI.md) · [协议合成示例](contract.example.json) · [规则10条、独立正反20项](../../../research/traces/CAP-06-03.json) · [合成fixtures](fixtures.json) · [10条合法公开研究来源](../../../research/sources/CAP-06-03.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者交接](independent-consumer-handoff.md) · [本地校验工具](../../../tools/check_cap0603_planning_2026_10_25.cjs)。

**验收层次**：A结构/集合合成Oracle可通过，不意味着B真实OCCT局部布尔已跑。B需两个固定STEP及至少12类工况：相交+不相交双去料体、近切接触、薄壁、子腔/孔中岛屿、三层多环、台阶面、斜面、圆弧底角、两个Solid、旋转Setup与保护区，逐类正反成对；C是由**独立进程**D07消费者打开序列化B-Rep并重算拓扑和材料，核对体积/版本；D才是07/08/09/10的独立NC消费者和三轴/B5工程验证。当前B/C/D全部NOT_RUN，L3/Owner待人工签署。
