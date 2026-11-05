# B27｜CAP-06-07 独立Oracle：OCCT选项、积分误差与距离零陷阱

- 日期：2026-10-30；研究状态：**SYNTHETIC_PLANNING_ONLY**；L3：**PENDING_HUMAN**。
- 既有CAP-06-07详细规格不重写。针对已登记10来源、10规则的Oracle方案，补足实际调用参数、返回值资格与“零距离不能证明无穿透”的对照证据。
- 原编号关联：**F1-05、W2-02、W2-03、W2-06**。17资产仅候选Owner，正式会签0/17、真实独立消费者0/17。

## 1. 工程结论及可证伪边界

1. **BRepCheck_Analyzer** 的`GeomControls=false`仅进行部分拓扑检查；默认`theIsExact=false`使用离散检查，在特定边的SameParameter情形可选择更严格检查；记录`GeomControls`/`ExactMethod`及每个Solid的valid/closed/取向，但即便`IsValid`返回真也不等于去料正确。根据[S01]与[S04]，不编造隐藏条款。
2. **BRepGProp::VolumePropertiesGK** 文档的`OnlyClosed`默认false、`SkipShared`默认false、`Eps`默认0.001；对不闭合或取向错的形体不能仅凭`Mass()`作为体积认证。项目必须显式记录`OnlyClosed=true`、`SkipShared`策略、积分误差返回（负值失败）和每次独立的属性累积器。**GK签名没有UseTriangulation参数**，不得将其他重载的参数拼成不存在的调用。[S02]
3. 数学上`|V_before-V_removed-V_after|≤ε_abs+ε_rel |V_before|`仅是必要条件。两个互相平移、体积完全相同的实体即使体积误差为0也不代表形状/位置正确。容差`0.01 mm³`和`0.0001`仅用于明确标记的合成策略，不是ISO/机床通用验收阈值。[S02][S06]
4. 两个单位正方体：相切时最小距离0、交集体积0；沿X重叠0.5时最小距离仍0、交集体积0.5。这两个**解析AABB数学样例**都不是OCCT运行；故`BRepExtrema_DistShapeShape`得到0不能证明保护区无穿透，须独立布尔/拓扑检查。[S03][S06]
5. 不同进程但共用同一OCCT内核只能暂称`PROCESS_ONLY`独立，保留共同失效风险。NISTIR 8298只阅读**出版摘要**（2020-03-24，DongHun Yeo；原研究针对CFD），不能宣称该报告规范了Procet的OCCT Oracle。[S05]

## 2. Owner、GUI/3D、权限与工程闭包

GUI/CLI/Agent经统一`06.OracleVerificationPort`读取D01/D04/D07的exact Revision/Hash/Frame/Scope；只有一个Babylon 3D世界，所有业务设置置于左侧UnifiedTaskPanel。独立Oracle的候选结果不能自行签发D07、D05/D08或机床许可。Seal之后提交需CAS Head、ACL、ScopeEpoch、任务代次和撤权/取消重验；旧代迟到ACK只可供对账，不得写入新Owner修订。冻结A/B保留原有不可变字节。D04名义Setup不等于D10执行绑定。

中立D09 CL→D12最终NC后处理→D13语义解释→D14轴时序→D15独立工程验证→D16发布。D13未知标为`UNKNOWN`并阻断后续，CL演示不能替代NC工程验证，本工作不做材料扫掠仿真。

## 3. 来源、规则、字段与验收

[6条来源及访问局限](../../../research/sources/CAP-06-07-oracle-options-b27.json) → [8条规则/字段及原包](../../../research/traces/CAP-06-07-oracle-options-b27-v08.json) → [2正37反+2 AABB](oracle-options-b27-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0607_oracle_options_b27_v08.cjs) → [执行等级](../../../tracking/cap0607-oracle-options-b27-verification-2026-10-30.json)。

来源条目记载作者、出版/版本、URL、读取范围及限制。其中S05只读NIST公开摘要；S06为仓库固定Blob；其他仅阅读OCCT 8.0.1公开API文字。无付费标准正文、真实OCCT、B5、STEP、NC、产品仓数据或真实消费者被读取/执行。脚本仅校验合成DTO和解析几何。所有真实测试、兼容性回退、L3正式签署与独立消费者仍待执行；规划PASS≠产品PASS。
