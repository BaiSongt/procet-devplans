# B138｜CAP-07-05：粗/半精/精余量的方向、局部法向与阶段残料证据（2026-11-03）

> NEWLY_AUTHORED 规划研究补证，保持11域、88项CAP、36原编号工作包、17业务资产及L1/L2不变；F1-03/E3-01/U4-04原编号不改变，L3=PENDING_HUMAN。**规划PASS≠产品PASS**。

## 研究问题与反例

传统的“径向留0.30 mm、轴向留0.10 mm”**并不能推出任意倾斜曲面沿局部材料法线恒定留0.30 mm或0.10 mm**。Autodesk Fusion 2D Adaptive公开帮助指出Radial相对于刀轴垂直、Axial沿刀轴；在非竖直/非水平面上，该**厂商策略**会插值，径向实际留量受斜率及轴向留量影响。这不是本项目可照搬的Fusion精确插值公式。

规划教学模型（**不是Fusion或NX真实算法**）：对局部平面、右手固定Frame中的单位外法向 `n=(nx,ny,nz)`，以及假设的位移 `delta=(a_radial,0,a_axial)`，其局部有向投影 `d=n·delta=nx*a_radial+nz*a_axial`。只用于检查“方向投影≠任一参数”的逻辑，且须有材料侧；不能把它当成实际偏置曲面、去料体或刀具接触深度。

| 解析向量Golden | a_radial / a_axial (mm) | 单位外法向n | 投影(mm) | 解释 |
|---|---|---|---|---|
| G01垂直壁 | 0.30 / 0.10 | (1,0,0) | +0.300000000000 | 仅特例 |
| G02水平底 | 0.30 / 0.10 | (0,0,1) | +0.100000000000 | 仅特例 |
| G03 45°局部平面 | 0.30 / 0.10 | (1/√2,0,1/√2) | +0.282842712475 | 与参数均不同 |
| G04材料侧逆向 | 0.30 / 0.10 | (-1/√2,0,1/√2) | -0.141421356237 | 拒绝带负号候选，不宣称已实测过切 |
| G05–G07 | 同上 | 法向缺失/长度非1/材料侧未知 | UNKNOWN | 无权推断厚度 |
| G08双参数相等 | 0.20 / 0.20 | (1/√2,0,1/√2) | +0.282842712475 | 参数相等也不等于投影相等 |

解析1e-12舍入仅合成数值断言，不是加工公差。实际工具轴、球头有效接触半径、面片修剪/斜率、材料侧及真实Stock布尔关系均需独立B-Rep Oracle；需要保持真实 `D07 S_i^in→S_i^out` 的封存顺序，不能将理论的全局偏置壳充当某工序实际残料。

## 2026-11-03 官方资料实际阅读层次

| 来源 | 作者/版次/章节/阅读深度 | 可用结论与局限 |
|---|---|---|
| B138-S01 | [Autodesk Fusion 2D Adaptive](https://help.autodesk.com/cloudhelp/ENU/Fusion-CAM/files/GUIDA73542E9-ED9C-4BD9-A87D-3A0ECA8BEB41.htm)，在线无版号，Stock to Leave/Radial/Axial公开HTML指定章节**实读** | 方向定义及坡面插值仅支持该策略，不知道实现公式 |
| B138-S02 | [Autodesk Geodesic答疑](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/How-to-apply-Stock-to-leave-separately-into-Radial-and-Axial-when-creating-a-Geodesic-toolpath-in-Fusion.html)，发布页标2025-03-26，仅官方**搜索摘录**，直开正文0可读行 | 摘录称该策略仅单值，**未阅读正文**，不能推广 |
| B138-S03 | [OCCT8.0.1 MakeOffsetShape](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_offset_a_p_i___make_offset_shape.html)，8.0.1 API类描述/PerformByJoin/PerformBySimple**实读** | Simple不求交线；API可用≠曲面可靠或物理余量已验证 |
| B138-S04 | [Open-Cascade-SAS Modeling Algorithms](https://github.com/Open-Cascade-SAS/OCCT/blob/master/dox/user_guides/modeling_algos/modeling_algos.md)，master可变，Offset computation指定节**实读** | 简单偏置可增长容差，未固定commit，不能冒充8.0.1源码等价实测 |
| B138-S05 | [NIST Kramer, 1992 NISTIR 4809](https://www.nist.gov/publications/library-material-removal-shape-element-volumes-mrsevs)，仅出版日期、作者、报告号和关键词**目录元数据** | 仅提供MRSEV研究背景，未读PDF，不证明算法 |
| B138-S06 | [Autodesk Rapid collision with stock答疑](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Rapid-collision-with-stock-while-simulating-finishing-toolpath-in-Fusion-360.html)，检索页标2026-08-31，仅**搜索摘录**，直开0可读行 | 前序材料/刀柄碰撞需关注；不能当通用碰撞定律 |
| B138-S07 | [Procet原CAP-07-05固定Blob](https://github.com/BaiSongt/procet-devplans/blob/c5d36388978396c1053355408c1b3d5f0682b0db/docs/capabilities/CAP-07-05/README.md)，完整业务文档，Git Blob `79eb0e5a1efc867f991feab410bae6ef0b5b4558` | 同Owner、CAS、Frame、D04/D10、NC分层是本项目**内生设计**而非外部标准条款 |

上述7项为**来源登记记录**，非7篇独立论文全文。完整作者版本、URL、accessDepth及limits见[分级注册](../../../research/sources/CAP-07-05-stock-projection-b138.json)。

## 实施契约：来源→规则→字段→验收

[8条规则及32字段](../../../research/traces/CAP-07-05-stock-projection-b138-v08.json)涵盖：R01设计/Setup/D07前态及D08冻结；R02方向、单位、符号和所选策略能力；R03法向与材料侧Frame；R04数学投影只作示范；R05前阶段封存输出作为后阶段唯一输入；R06 OCCT偏置模式、容差、自交/保护体/Oracle；R07同一CAM Domain Owner的GUI/CLI/Agent提交安全；R08执行绑定、NC验证链及独立交接。每条均有1正4个**单字段独立反例**，共8正32反；另8项数值/UNKNOWN Golden，见[Fixtures](stock-projection-b138-fixtures-v08.json)和[只读Node工具](../../../tools/check_cap0705_stock_projection_b138_v08.cjs)。

建议新增的D09阶段候选字段：`d01GeometryExact:{revision,hash}`、`d04SetupExact:{revision,hash,frame}`、`d07PrestateExact:{revision,hash,frame}`、`d08FreezeExact`、`allowanceBasis:{radial,axial,units,toolAxis,signPolicy,strategyCapabilities}`、`surfacePatchRefs:{faceId,topologyRevision,normalFrame,normalOrientation}`、`materialSideEvidence`、`offsetComputation:{occtVersion,mode,join,tolerance,topologyChecks}`、`residualOracle:{status,sourceHash,consumerHash}`、`stageScope`、`taskGeneration`。未定义/缺失证据→UNKNOWN，不由3D画面补造。

D07（06域）Owner产出封存前后Stock与独立几何Oracle证据；D05/D08（05域）定义阶段意图及冻结；D09（07域）只产中立CL候选。07域`StageAllowancePort.preview({exactRefs,stagePolicy,normalEvidence})`、`inspectResidual`、`commitNeutralCLWithCAS`、`invalidate`、`cancel`由GUI/CLI/Agent**同一端口**接入。正式写入需重新验证ACL、expectedRevision/contentHash、Frame、ScopeEpoch、generation和cancelled，迟到回执REJECT；A/B共用同一事实，不覆盖D08冻结。唯一Babylon Engine/Scene/Canvas、统一左TaskPanel、字号最大12px、浅/深主题；3D只预览局部法线和残料候选，不授予工艺及工程PASS。

D04名义Setup与D10实际机床/装夹/控制器执行绑定继续分离；D09中立CL→D12最终NC后处理→D13独立控制器语义→D14物理Joint时序→D15工程验证→D16审批发布。D11/CL动画不等于D15/NC安全，未识别控制器指令为UNKNOWN，**不做材料扫掠仿真**。

## 独立消费者、迁移回退与残余风险

独立06域D07消费者须基于不同进程/实现读取被封存的同Hash材料前后态和Frame，使用非本判定函数的B-Rep/拓扑Oracle检查结果、保护体不侵入、残料连通性及工序顺序；07域D09消费者分别验证刀具接触与余量语义，08/09域须在**最终NC字节**重走D13/D14/D15。实际运行的进程、binary SHA、Input/Output exact HEAD、退出码、审批人及使用范围必须落证，不能用本报告脚本冒充。

旧数据没有法向/materialSide/strategy capability 时影子双读，结果标`UNKNOWN_LEGACY`而不是生成默认厚度；新读验证失败只回退**读取器与候选流程**，不删除旧D07、不覆写冻结D08/历史D16。变更D01/D03/D04/D05/D07/D08、刀具/策略/offset容差时按精确依赖失效，阶段前态无法锁定则下游候选失效。真实OCCT、Fusion/NX、NC、B5/OEM、17正式Owner签署和独立消费者**NOT_RUN**；L3=PENDING_HUMAN。**规划PASS≠产品PASS。**
