# CAP-06-02｜工序与几何联合搜索（原88 CAP编号）
> 原始三级定义：次序、组合、替代方案和路径支配；关联F1-05/W2-02/W2-03/W2-06。保持11域/L1/L2原文，L3待审；本文件为规划，不是产品实现。

## 业务流程与可证伪边界
1. 输入03域D01制造目标、可选D02制造特征、04域D04 Setup和**真实毛坯B-Rep**、Frame/单位/保护区/余量，02域D03资源能力只作候选约束，不与D10实际机床执行绑定混用。A模式可没有D05直接探索；B模式可读D05人工工序和D08冻结子图，但不得复制工程事实或覆盖D08。
2. 对工序UID建立前序有向无环图与替代Operation组。每个不可变搜索节点包含`(stockBRepHash,remainingOperations,frame,setupRef,protectedZones,allowance,freezeSet,algorithmVersion,toleranceBudget)`及精确id/revision/hash/schemaVersion/scope/branch来源。CAD目标、D07过程材料及渲染Mesh必须区分。拓扑有效不是可加工性。
3. 逐节点按条件执行OCCT CUT/COMMON/FUSE，保留before/removed/after去料体、布尔报告及独立BRepCheck状态；若薄壁、岛屿、多环、多Solid、斜面或保护区证据不足，返回UNKNOWN/REJECT，不允许自动扩大毛坯或私改fuzzy。
4. 联合搜索多候选共存：路径支配剪枝必须确认材料状态、剩余工序、Frame、保护区、余量/公差及冻结集等价，且具有可审计代价界。不能只因候选费用或BBox相似删除分支。记录Beam/Boolean调用/时间预算、frontier及回放；资源耗尽只能UNKNOWN，INFEASIBLE要求受限模型已充分证明。
5. 06域负责D06不可变候选和D07材料状态证据；D07仍须独立Checker复核。06域**不得直接写D05或D08**；采纳只能经05域PlanAdoptionPort生成新D05修订，base/head/proposed冲突及冻结继续有效。更改只局部失效，不影响另一Setup或冻结历史。
6. GUI、CLI、Agent共用`JointSearchDomainPort.inspectRequirements/previewSearch/submitSearch/cancelSearch/listFrontier/compareCandidates/getProof`。提交瞬时重验ACL、CAS、scopeEpoch、taskGeneration、取消与晚回执；作废回执ORPHANED，历史任务不可覆写工程头。
7. D09生成中立CL前必须独立取得D07有序材料+D08冻结的exact引用；然后D09→D12最终NC→D13控制器执行语义→D14轴时序→D15独立验证→D16发布。D11 CL动画不能充当D15；未建模语义UNKNOWN。本规划不做材料扫掠仿真。

## 对接与验收
目标工况：两Setup、多Solid、腔体/圆弧岛、薄壁/斜面、冻结工序、预算中断及取消晚回执。06域Owner负责候选状态，04域拥有D04事实，05域拥有冻结和采纳；17资产Owner映射均未会签。**规则合成PASS不等于真实OCCT、NC、B5及独立消费者PASS**；旧原字节丢失只能标UNKNOWN并登记风险。
[GUI与3D](UI.md) · [DTO](contract.example.json) · [20正反](fixtures.json) · [搜索边界](search-vectors.json) · [17 Owner候选](asset-owner-candidates.json) · [消费者](independent-consumer-handoff.md) · [10来源](../../../research/sources/CAP-06-02.json) · [10规则追踪](../../../research/traces/CAP-06-02.json) · [研究](../../../research/topics/R-JOINT-SEARCH-001.md)。
