# B136｜CAP-07-02：球头等残高平面公式的适用域与曲面独立验证（2026-11-03）

> NEWLY_AUTHORED规划研究，原07域CAP-07-02及F1-03/E3-01/U4-04不变；L1/L2不变，L3仍待人类评审。**规划PASS≠产品PASS**。

## 新增工程决策

前序[CAP-07-02原业务规格](README.md)已列出球头平面残高公式；B92解决修剪Face/UV投影的资格，本轮专门将**理想平面残高值、曲面局部残高、表面粗糙度Ra、D15真实机床工程验证**四种不同证据解耦。厂商Fusion的Stepover/Cusp Height输入存在，但不构成对任意自由曲面/实际加工质量的数学认证。BobCAD V32还明确不同路径模式的Stepover度量不同。单凭UV参数间距、面中心点RMS或刀路画面不允许自动给“等残高已验证”。

## 实际读取7项来源（2026-11-03）

| 来源 | 作者、版本和实际深度 | 合法支持/不能支持 |
|---|---|---|
| B136-S01 | [Autodesk Fusion Scallop步骤](https://help.autodesk.com/cloudhelp/ENU/Fusion-CAM/files/3D-SCALLOP-STEPS.htm)，Autodesk，在线文档，步骤3–6 HTML实读 | Stepover、加工边界、Contact Point Boundary是不同参数；不含全曲面验证证明 |
| B136-S02 | [Autodesk Fusion Morph步骤](https://help.autodesk.com/cloudhelp/ENU/Fusion-CAM/files/3D-MORPH-STEPS.htm)，Autodesk，步骤3–5 HTML实读 | Cusp Height可作为步距输入；不等于已读具体内部算法 |
| B136-S03 | [BobCAD-CAM V32 Step Over](https://bobcad.com/components/webhelp/BobCADCAMV32/en/Content/Merge/CAM/Mill/Mill_Wizard/Mill_Multiaxis/Mulitaxis_Wizard/Settings/Surface_Paths_Linked/Step_Over.htm)，官方Help，指定Stepover章节 | 不同路径策略量度不相同；厂家产品行为不是普适标准 |
| B136-S04 | [NIST Davies等2001](https://www.nist.gov/publications/tool-wear-and-surface-finish-high-speed-milling-aluminum-bronze-0)，出版页摘要 | 加工表面质量受磨耗/工艺与测量影响；**全文和实验数据未读** |
| B136-S05 | [Kharat等SAGE](https://journals.sagepub.com/doi/10.1177/09544054231202386)，首次上线2023-10-21，2024卷次，出版页摘要 | 自由曲面残高与走刀策略存在联系；本轮**仅使用摘要** |
| B136-S06 | [Suresh/Yang 1994 CiNii记录](https://cir.nii.ac.jp/crid/1363388844950883072)，二级索引目录及摘要 | 常步距与等残高的研究背景；**原论文ASME正文未读** |
| B136-S07 | [Procet固定原业务Blob](https://github.com/BaiSongt/procet-devplans/blob/724355d2a221ae59e607e719499dcdfd8d597438/docs/capabilities/CAP-07-02/README.md)，原Blob SHA `528da654297a970d2b3ace5a02b741a2cfcf95a1`逐字读取 | Owner/CAS/D04/D10/单Babylon属于项目内生规范，而不是NIST或厂商规定 |

完整结构化元数据在[7来源登记](../../../research/sources/CAP-07-02-scallop-boundary-b136.json)。7条为登记次数而非去重论文数，没有引用ISO收费标准条款或厂商未公开实现。

## 数学可证伪：平面球头理想几何不等于产品质量

固定条件：球头球面半径 `R>0` mm，局部平面上两条等高平行相邻刀轨的**实际横向距离**`0≤s<2R` mm，理想刚体球面切触且不考虑磨损、跳动、弹性、进给与材料。球面圆截线的几何残高为：

`h=R−sqrt(R²−s²/4)`，为减小`s≪R`时相消误差，校验器采用完全等价的`h=(s²/4)/(R+sqrt(R²−s²/4))`；反算仅在`0≤h<R`时`s=2sqrt(h(2R−h))`。小步距近似`h≈s²/(8R)`仅是局部估计，不得当作实测Ra或几何允差证明。

固定数学Golden：`R=5mm，s=1mm`，`h≈0.02506281447mm`；反算回`s=1mm`。当`s≥2R`、`R≤0`或`h≥R`，按本规划**保守返回UNKNOWN_DOMAIN**，不是声称几何绝对不存在。曲面、姿态、刀具非球头、边界修剪、刀具/刀柄干涉、装配或前序D07余量有缺口，不能拿这一平面公式授权全曲面完成/放行。

## 来源→规则→字段→原编号包→正反测试

[8条字段规则](../../../research/traces/CAP-07-02-scallop-boundary-b136-v08.json) → [8正32个单字段反例与9数学/资格Golden](scallop-boundary-b136-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap0702_scallop_boundary_b136_v08.cjs) → [验证等级](../../../tracking/cap0702-scallop-boundary-b136-verification-2026-11-03.json)。机器检测的是**规划契约自洽及理想数学恒等式**，没有运行OCCT的裁剪、曲面求交、STEP或真实进给与表面测量。

| 规则 | 精确字段组 | 后续证据/原包 |
|---|---|---|
| B136-R01 | `refs.designRevisionHashExact`、`refs.setupFrameExact`、`refs.finishToleranceFromD02`、`refs.d08FrozenUnchanged` | D01/D02/D03/D04/D07/D08必须持有精确revision/hash/frame与保护冻结；F1-03/E3-01/U4-04 |
| B136-R02 | `tool.actualBallGeometryPinned`、`tool.radiusDiameterConsistent`、`tool.wearNotAssumedZero`、`tool.assemblyHashExact` | D03球头半径、直径、实际工具组件与磨耗资格分别固定；F1-03/E3-01/U4-04 |
| B136-R03 | `metric.localStepInMm`、`metric.parallelPlanarEvidence`、`metric.realContactNormalQualified`、`metric.uvDistanceNotSubstituted` | 侧向间距的度量、局部平面假设与接触几何必须明确；F1-03/E3-01/U4-04 |
| B136-R04 | `math.radiusPositive`、`math.stepStrictlyWithinDiameter`、`math.stableSagittaFormula`、`math.inverseDomainGuarded` | 理想平面球头残高函数的定义域、稳定计算、反算及版本固定；F1-03/E3-01/U4-04 |
| B136-R05 | `oracle.trimmedFaceCertified`、`oracle.curvatureVariationQualified`、`oracle.holderFixtureIndependent`、`oracle.unknownStopsQualityCertification` | 修剪区域、曲率和刀柄夹具独立Oracle缺失不能凭平面残高认证；F1-03/E3-01/U4-04 |
| B136-R06 | `stock.orderedD07HashExact`、`stock.d04SeparateFromD10`、`stock.protectionAndRestKnown`、`stock.noMaterialSweepClaim` | 有序D07剩余材料和D04 Setup边界保持准确，不做材料扫掠仿真；F1-03/E3-01/U4-04 |
| B136-R07 | `commit.casRevisionHashFrameExact`、`commit.aclFreshAtWrite`、`commit.scopeEpochAndCancelFence`、`commit.freezeHistoryRollback` | 07域Owner提交时重验CAS、ACL、Scope与取消Fence并可非破坏回退；F1-03/E3-01/U4-04 |
| B136-R08 | `handoff.guiCliAgentSamePort`、`handoff.oneBabylonLeftPanel`、`handoff.d13D14D15IndependentFromNc`、`handoff.unknownBlocksD16` | 统一07域三入口/单Babylon左TaskPanel及D12–D16实际NC链独立；F1-03/E3-01/U4-04 |

## D04、D10与跨域验收/回退

1. 07域`ToolpathPlanningPort.preview3AxisSurface`仅提供D09**候选中立CL**与理想残高估计；D03有效半径、完整刀具装配、D01 TrimFace、D02目标、D04名义Setup和有序D07残料需锁定exact revision/hash/frame。单Babylon世界与统一左TaskPanel显示`ESTIMATE_ONLY`，GUI/CLI/Agent共用Owner端口，不允许UI自签制造质量PASS。A/B共用冻结D08只读。
2. D10才是实际机床/控制器/刀柄装配绑定。成品几何资格需独立曲面Oracle（Trim边界、接触点、相邻走刀实际度量、曲率与刀柄/夹具保护区），没有则`UNKNOWN_NONPLANAR_ORACLE`。不做材料扫掠仿真。
3. NC按`D09→D12最终后处理→D13独立控制器语义→D14真实Joint时序→D15独立验证→D16受控发布`。CL动画不是工程验证，D13未知功能显式`UNKNOWN`；理想平面残高不等于D15通过、D16签发或D17现场实测。
4. Owner写端事务内重验ACL/CAS expected revision/hash/frame、scopeEpoch、taskGeneration、cancelled；取消晚回执丢弃。D01/02/03/04/07/08变化只传播受影响的D09及下游证据，失效数据保持历史可读、旧D08/D16冻结不覆盖；成对Reader影子迁移，独立消费者需另进程/另实现实际验收。
5. 独立执行建议：固定曲面、倾斜面、周期缝、内孔边、不同刀径与已磨损球头，记录独立OCCT/B-Rep Oracle与实测表面轮廓、源SHA、Frame、设备版本/批次；另测真实D12-D16及17项正式Owner消费者。当前全部`NOT_RUN`，L3`PENDING_HUMAN`。

无变更产品仓、无真实机床授权承诺；规划所用数学结果不可当最终产品的数控安全资格。
