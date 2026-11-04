# B159｜CAP-04-01 工艺Setup：旋转实体后的包围证据、毛坯候选与采用资格

**日期：2026-11-04｜性质：NEWLY_AUTHORED追加研究，L1/L2不变、L3待人审；88 CAP、36原编号包、17业务资产均不增加。规划PASS≠产品PASS。**

[5份分级来源](../../../research/sources/CAP-04-01-rotated-bounds-b159.json) → [8规则、32字段、原工作包](../../../research/traces/CAP-04-01-rotated-bounds-b159-v08.json) → [8正32独立单字段反例和8数学Golden](rotated-bounds-b159-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0401_rotated_bounds_b159_v08.cjs) → [验证等级](../../../tracking/cap0401-rotated-bounds-b159-verification-2026-11-04.json)。

## 1. 新增问题：包围盒旋转与形状旋转后重新求盒不是同一数值任务

D04在创建Setup时不得自动扩展/猜测毛坯。显式“计算毛坯候选”时，应根据 **已定位的权威D01 CAD实例、指定的Setup局部Frame、单位和实体容差** 对变换后的形状重新计算范围，而不是旋转旧局部AABB再将得到的保守外包误报为“最紧”“最佳毛坯”。

- OCCT 8.0.1 `Bnd_Box::Transformed` 文档明确指出旋转既有包围盒通常增大范围，并不适合对紧致性敏感的算法；转旧AABB可以做**保守预览**，不能据其最小化毛坯。
- `BRepBndLib::Add` 会因曲面三角网格偏差、边/面公差放大范围；`AddOptimal`提供更精细的算法，但具体`useTriangulation`和`useShapeTolerance`必须固定入证据；不推导绝对“最优盒”结论。
- `AddClose` 只适用于满足文档前提的多边形平面面表示，且不会自动做与`Add`相同的公差扩张；**不能当任意混合曲面B-Rep的快速替代**。
- `Bnd_Box::Get()`已包含gap；还需先检查`IsVoid`、`IsOpen`。不把gap、几何算法误差、加工余量和真实毛坯尺寸混为一个隐式padding。
- OCCT指南对`AddOBB`算法亦明确说明结果不一定具有全局最小表面积；OBB用于方向建议，不等于可采购实际毛坯。文档API版本8.0.1，产品Native实际版本未锁定，也不能据此宣称运行PASS。

## 2. 解析反例与可复算Golden

仅为**二维平面三角形横截面**的数学教学样例，原始顶点为(0,0)、(2,0)、(0,1)mm；绕Z轴旋转45°。几何点变换后：`x' = cosθ·x − sinθ·y`, `y' = sinθ·x + cosθ·y`。

- 变换**实际三顶点**得到的X范围 `[-√2/2, √2]` mm，Y范围 `[0, √2]` mm。
- 将**原AABB四角**一起旋转得到X范围同上，但Y范围 `[0, 3√2/2]` mm。后者保守包含却多出约0.7071mm的Y外包，不能称紧致结果。
- 不据此三角截面的顶点枚举推论一般曲面、TrimmedFace或任意三维Solid真实极值已认证；曲面必须通过真实内核调用、独立Oracle及误差策略验收。
- Golden使用`1e-9`仅为数学合成浮点容差，**不是工业几何公差/加工余量**。8例覆盖零角、45°、90°、保守过包、漏包、缺角及假冒全局最优。

## 3. 来源→规则→字段→原CAP/工作包→验收

| 规则 | 关键合同字段 | 失败策略 |
|---|---|---|
| B159-R01 CAD/Occurrence真实来源 | `cadExactRef`、`occurrencePath`、`sourceFrameExact`、`unitCode` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R02 Setup刚体Frame与变换方向 | `setupFrameExact`、`transformKind`、`transformDirection`、`frameWitness` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R03 几何包围方法的安全资格 | `bboxAlgorithm`、`triangulationPolicy`、`shapeTolerancePolicy`、`occtApiEvidence` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R04 BBox有限性与Gap | `boxState`、`gapRecorded`、`boundsOrder`、`boundsFrame` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R05 重算边界与不过度认证 | `candidateMethod`、`shapeSourceKind`、`enclosureDecision`、`tightnessClaim` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R06 工艺毛坯显式操作 | `autoOnSetupCreate`、`explicitCalculate`、`explicitAdopt`、`stockIntentState` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R07 Owner CAS、取消与权限 | `ownerDomain`、`casAtCommit`、`aclAtCommit`、`lateAckHandling` | 少证据=UNKNOWN；假来源或冲突=REJECT |
| B159-R08 同入口、唯一3D与工程资格 | `singleBabylonWorld`、`leftTaskPanel`、`guiCliAgentSamePort`、`ncVerificationState` | 少证据=UNKNOWN；假来源或冲突=REJECT |

上述每条规则关联固定[原CAP-04-01](README.md)及原编号 F1-02 / F1-04 / W2-05 / E3-04 / U4-02，1正4负的字段对与完整来源ID写入可机器读取的Trace和Fixture。来源S01–S04为官方API定点正文，S05为本仓原CAP业务约束；“用户显式采用”“领域CAS”和“单Babylon”是Procet内生设计，**不是OCCT/ISO强制条款**。

## 4. 领域Owner与UI/CLI/Agent受管协议

D01持有CAD实体/Occurrence精确revision/hash和原坐标，02域D03持有资源定义，**04域D04唯一Owner**持有`ProcessSetup`与毛坯采用状态；06域D06/D07仅消费确切毛坯几何快照。契约候选：`ComputeStockBoundsCandidate({targetCadExact, occurrencePath, T_SetupFromPart, targetSetupExact, bboxPolicy, shapeTolerancePolicy, requestId, scopeEpoch}) → {candidateBounds, method, nativeVersion, sourceExact, frameExact, gap, toleranceBudget, status}`。本命令**只读生成候选**；UI“采用”才走`AdoptStockDraft`，审批/正式提交另走D04 `CommitProcessSetup`。

写入点必须重新核对当前Actor ACL代次、D01 exact revision+hash/Occurrence、D04 Setup exact revision+hash/frame、expected CAS、scopeEpoch、取消代次、真实回执；旧scope晚回执丢弃，不将候选关联到当前另一Setup。GUI、CLI、Agent通过同一个D04领域Port，不能三套算法各自计算并持久化。

UI继续只有**单一Babylon Engine/Scene/Canvas**，工程与制造资源为互斥活动Root；唯一左UnifiedTaskPanel展示 `CAD真值 / 保守预览 / 待验证毛坯候选 / 已采用草稿` 四种状态、bbox六个极值及单位、方向、gap、余量、方法、误差来源和独立确认入口。字体不超过12px，不增加右Drawer。Mesh包围只显示DISPLAY_ONLY，不能当D01 CAD真值。

## 5. 失效、回退与独立消费者门禁

不同Setup持有不同exact Frame/stock-candidate；CAD重新定位、修改Occurrence、改变容差策略/Native算法、转换单位或撤销ACL时必须使受影响候选STALE，不能重新使用缓存或追加新修订覆盖冻结D08/D16。旧字段仅包含三轴尺寸、没有Frame/方法/公差来源时以`LEGACY_BBOX_UNKNOWN`只读保留，采用Expand→Migrate→Contract及旧Reader回退，不杜撰原包围数据。

独立验收：04域Owner从另一个进程读取原CAD/Setup exact快照；06域独立实现对旋转CAD原实体而非显示Mesh重算bbox，并核对数学Golden、gap一次性、特殊曲面、混合单位、空/Open盒、退化、不同Occurrence/多Solid、越权、取消/晚回执、撤销与回退。需要锁定真实OCCT Native库版本、二进制、CAD fixture授权、计算命令、执行者和日志；**本轮均NOT_RUN**。

D04工艺Setup与D10实机执行绑定保持分离。中立CL→D12 NC后处理→D13最终NC模态解释→D14物理轴时序→D15独立工程验证→D16发布。不能用新bbox、渲染预览或CL动画把未知控制器语义升格为工程PASS，不做材料扫掠仿真。

## 6. 阅读范围、测试范围与审批

官方来源作者/版本、2026-11-04访问、URL、具体API及限制见来源JSON；未取得付费标准正文，不编造条款。规划8正32独立单字段反例与8数学Golden只证候选约束**同谓词合成**；独立Node全文件、真实OCCT/产品Owner、17实际消费者、B5/OEM、历史原字节与完整仓GFM AST均未运行。L3依然待人工签审；规划PASS≠产品PASS。
