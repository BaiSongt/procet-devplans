# CAP-06-01｜无规划自主求解（V0.8原编号）
> 业务原文：模型+约束直接探索工序组合。本文件只是业务与接口规划；L1/L2不变、L3待审、产品NOT_RUN。

## 业务链路
A模式无需先创建或批准D05，可直接提交D01目标+必要的D04名义Setup/毛坯、原始几何、约束和资源能力证据作受限探索；无人工计划不等于没有输入条件。材料去除求解缺D01目标/Stock、Frame单位不明、protected volume未获得或stock仅bbox时必须MISSING/UNKNOWN/BLOCKED，不自动扩展毛坯。不因未绑定D10机床/控制器而禁止抽象几何探索，但不能把探索结果升格为加工许可。
06域专门写D06候选和经过独立有效性验证的D07有序材料状态；只按exact revision/hash/frame/unit/scope引用03域D01/D02、04域D04、可选02域D03和05域D05/D08。A/B共享同工程事实，Solver不能直接写D05、解冻D08或覆盖历史冻结快照。01域Host负责任务协调；GUI/CLI/Agent共用SolverDomainPort，不直写任何域数据库。

## 几何与算法
B-Rep中的目标实体、毛坯实体、去料体、保护域均带坐标帧与公差预算。OCCT Boolean CUT/COMMON/FUSE以及BRepCheck报告用于局部几何正反核验，不借Mesh外观、bbox包含或静默fuzzy扩张代替实际布尔；薄壁、斜切、岛屿、多Solid及嵌套圆弧需分别建立真实产品Oracle。搜索保存Beam/时间/Boolean调用预算、分支DAG、可行/未知/已证明不可行区分以及不可变候选身份。FEASIBLE仅为已声明的求解模型找到候选；UNKNOWN/ERROR不得升格PASS。独立D07材料状态校验不等于刀具可达或材料扫掠仿真。

## Owner、接口、权限及回退
C0最小公共引用包含id/revision/hash/frame/unit/schemaVersion/scope，领域协议额外带actor/expectedRevision/scopeEpoch/taskGeneration。接口：SolverDomainPort.inspectRequirements/previewSolve/submitSolve/cancelSolve/listCandidates/getProof，05域PlanAdoptionPort.previewCandidate/commitDraft。提交瞬间重验CAS、ACL、源哈希、任务代次与取消状态，迟到回执隔离；用户原工程、D08冻结和D16历史只读保留。旧版本缺证据只读迁移并标UNKNOWN，不捏造原字节或生成新“通过”记录。

## 工程交接资格与可视化
同一Babylon世界呈现Stock、Target、保护区、每步去料体与残余几何，唯一左TaskPanel负责状态与交接；GUI显示不授权限。D06候选仅向05域提交人工接管草稿预览，D05 Ready可独立交D06；D09必须额外取得D07有序材料与D08冻结的exact证据。然后中立CL(D09)→D12后处理生成NC→D13控制器语义→D14轴时序→D15独立验证→D16发布；D11 CL演示不冒充NC工程验证，未知控制器语义UNKNOWN。本规划不做材料扫掠仿真，也不预设实际B5机床参数。
关联原F1-05/W2-02/W2-03/W2-06，不改原88 CAP与36原编号工作包分母。

[GUI/3D](UI.md) · [DTO](contract.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [正反验收](fixtures.json) · [研究来源](../../../research/sources/CAP-06-01.json) · [规则追踪](../../../research/traces/CAP-06-01.json) · [独立消费者](independent-consumer-handoff.md) · [研究专题](../../../research/topics/R-AUTOSOLVE-001.md)。
