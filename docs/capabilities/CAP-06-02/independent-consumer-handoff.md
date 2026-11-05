# CAP-06-02｜独立消费者与真实验收合同（规划）
**权威写入**：D01/D02由03域，D03由02域，D04由04域，D05/D08由05域，D06/D07由06域，D09由07域，D12/D13由08域，D14/D15由09域，D16/D17由10域分别持有；01域Host只能调度和维护日志。17 Owner候选尚未跨域正式签署。

**输出契约**：CandidateBundle含候选immutable id/revision/hash/frame/unit/scope/branch、sourceClosure、algorithmVersion、stepUid/predecessors/alternativeGroup、stateFingerprint、stockBefore/removed/after三份B-Rep引用、fuzzy预算、protectedZones、D07 Checker报告、searchBudget、dominanceProof、frontierReplayKey、terminalStatus、actor/expectedRevision/scopeEpoch/taskGeneration。哈希区分字节哈希与确定性对象规范化算法，不能通过BBox取代几何hash。

**独立D07消费**：用相同固定STEP/OCCT版本核对每一步材料状态与保护区/余量；对薄壁、岛屿、斜面、多Solid、旋转Setup注入反例。不得信任06域自报VALID，也不做材料扫掠仿真。

**独立05消费**：仅走PlanAdoptionPort，对同工程事实的A/B并行支线、工序UID和D08冻结做真实CAS、ACL撤权、cancel/lateAck及断网重启试验；Reject不得改写历史。C0只提供最小公共标识与坐标引用。

**独立07/08/09/10消费**：无精确D07+D08则D09 fail-closed；独立D12→D13→D14→D15→D16需真实NC与目标控制器/机床版本，D11 CL动画禁止替代D15。未知宏/补偿/循环返回UNKNOWN。三轴及B5实机均未测。

**当前状态**：规划源/规则/合成案例存在；独立D07/05/09消费者、Rust/OCCT/GUI、NC、机床与L3批准**NOT_RUN/PENDING**。