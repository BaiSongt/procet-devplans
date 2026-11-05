> **B74新增专项研究（2026-11-01）**：[车床刀尖半径与LinuxCNC D/Q、Haas Tnnxx方言边界](LATHE-NOSE-COMPENSATION-B74-2026-11-01.md)。7来源、8规则、26个合成正反/UNKNOWN样例；独立Node/NC/OEM/17消费者未测，L3待审。**规划PASS≠产品PASS。**

# CAP-02-02｜刀具与切削参数研究补证（2026-10-19）
原始业务规格： [CAP-02-02评审稿](../batch01-v0.9.1/01_功能规格/CAP-02-02_刀具与切削参数.md)。本文件是**新编研究补证**，不替换原8个AT场景、不升级产品实现状态。

## 决策与边界
**唯一写入Owner**：Resources管理CutterDefinition与切削Profile版本，Planning以CAS维护采纳后的OperationRevision。知识/Agent仅建议；刀柄、装配Gauge Length及TCP属于CAP-02-03/Setup；D13对控制器执行语义负责，D15负责NC工程验证。
**exact引用**：CutterRef=(id,revision,contentHash,unitSystem)，CuttingProfileRef=(id,revision,contentHash,applicabilityHash)，OperationRef及MachineCapabilityRef都必须在采纳时重新验证；显示模型仅作3D代理，不能认证切削有效直径。
**业务状态**：Draft→Validated→Released与Operation Adopted分离；参数档案发布不自动修改已冻结Operation或CL。A/B共享同事实，采纳只新增修订，冲突/解冻需要显式流程。
**推导适用**：仅在铣削工况已知有效切削直径Dcap(mm)和有效齿数z_eff时，可按官网公式 n=1000vc/(πDcap)、vf=fz·n·z_eff计算。忽略球头实际接触Dcap、跳动/薄屑、机床扭矩、刀具寿命均不得声称可生产。样例Dcap=10、vc=100、fz=0.05、z_eff=4得到n≈3183.1rpm、vf≈636.6mm/min，**纯数学样例，不是切削推荐值**。机床3000rpm上限时需人类确认以n=3000计算vf=600，不能静默限幅。
**界面**：左侧唯一UnifiedTaskPanel内分目录、类型几何、建议区间与来源、工序采纳四任务；3D仅单一Babylon世界，选择SelectionIntent、预览PreviewLease，不添加并列Scene。GUI/CLI/Agent均通过Host授权与Resources/Planning同一领域用例，服务端做CAS/权限重验；跨工程scopeEpoch晚回执拒绝写入。
**依赖传播**：刀具Profile变更先使依赖工序候选失效，已冻结工序保留原exact引用；明确迁移/重评估及回退策略。NC链路严格中立CL→NC后处理→D13执行语义→D14轴时序→D15验证→D16发布，CL动画不得冒充NC工程验证；未知语义unknown，不做材料扫掠仿真。
**测试责任**：Resources Owner签字段与有效直径，Planning Owner签采纳/影响集，GUI Owner签三入口一致，NC Owner签D13未知语义，独立消费者分别执行正反例；当前均未执行。L1/L2不变，L3待人类评审，C0不新增领域大对象。

## 可追踪资产
- [7项公开来源/实际读取深度](../../../research/sources/CAP-02-02.json)
- [10条规则与字段/包映射](../../../research/traces/CAP-02-02.json)
- [20项具体正反验收](fixtures.json)
- [理论专题](../../../research/topics/R-CUT-001.md)
- [机器可检规则](../../../tools/check_cap_02_02_planning.py)

## 待决
实际软件字段适配映射、机床参数能力快照来源、切削Profile推荐数据供应方授权、不同刀型Dcap算法、真实独立消费者及回退恢复试验均待产品实现/人类审查，**规划PASS≠产品PASS**。
