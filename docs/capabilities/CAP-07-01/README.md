# CAP-07-01｜2.5D特征刀路（V0.8；L3待审）

**原88项映射原文：** 平面、外轮廓、型腔、孔、槽；原工作包 F1-03 / E3-01 / U4-04。仅是正式实施级**规划**，不代表CAM、NC或机床产品验收。L1/L2保持、L3待审。此项属于07域D09中立刀路Owner，不新增第18类资产或将07域提升为NC执行域。

## 业务范围与工序工作流
用户选取已确认的D02制造特征，读取D04名义Setup、D03刀具完整装配/能力、D07按前序工序有序Stock、D08已采纳/冻结工艺快照，生成工序级D09**候选**。A模式若无D05计划，可从D06候选衔接，但必须经05域采纳/冻结后才取得B模式同一事实上的正式工序资格；不能因切到模式B就复制或覆盖冻结D08。
- 平面/端面：确定可达平面、加工范围、往复或单向层次；壁精加工≠底面精加工，最终深度要求独立判断。若跨行保留切削高度经包络/保护区证明安全，**不强制每行提刀**，否则必须退至证实安全的高度。
- 外轮廓/槽：区分内外侧补偿、顺铣/逆铣策略意图、开口槽与封闭槽的端部安全；偏置自交、尖角窄槽或工具半径过大返回`GEOMETRY_UNCERTIFIED`，绝不靠任意容差或BBox伪成功。
- 型腔/台阶腔/嵌套岛：受控闭合轮廓、包含树/内孔岛、D07前序余料、D08保护区和径/轴余量；先分层清根再侧壁与底面精加工，禁止生成穿越孔/岛的伪刀路。进刀路线不能只看XY轮廓忽视Z层。
- 孔特征：按精确Frame与工序建立孔深、尖端深度、回退高度和逐孔碰撞先验；此阶段只表达中立钻削语义，G81/G83的具体循环由D12后处理及D13控制器解释，不能把LinuxCNC手册行为推广到实际B5。
- 所有类型：先检查每步的刀具可达性与保护区近似条件，输出`CANDIDATE`、`REJECTED`或`UNKNOWN_UNVERIFIED`三态。D09几何候选不是D15工程验证，也不模拟材料扫掠；真实几何包络检查/真实设备运动交独立消费者完成。

## 10条可落地规则与验收映射
|规则|施工/审核重点|机器校验字段（示例提案）|正/反/独立变异|
|---|---|---|---|
| C0701-R01 | 精确输入与冻结签名 | `assetId`, `revision`, `contentHash`, `frameHash`, `setupRevision` | T01/T02/M01 |
| C0701-R02 | 闭合轮廓、偏置及岛屿保护 | `wireClosed`, `selfIntersection`, `offsetStatus`, `islandCount`, `protectedIslands` | T03/T04/M02 |
| C0701-R03 | 加工步距、切深和余量单位 | `toolDiameterMm`, `stepoverMm`, `stepdownMm`, `radialAllowanceMm`, `axialAllowanceMm`, `unit` | T05/T06/M03 |
| C0701-R04 | 型腔覆盖与保护区禁切 | `stockStateHash`, `containerCheck`, `remainingIslandCount`, `overcutCount`, `coverageVerified` | T07/T08/M04 |
| C0701-R05 | 端面与轮廓分离及有条件提刀 | `strategy`, `floorPassEnabled`, `finalDepthReached`, `liftEveryRow`, `linkSafetyCertified` | T09/T10/M05 |
| C0701-R06 | 孔位、底深及回退安全 | `holeCount`, `allHoleFramesExact`, `safeRetract`, `tipDepthMm`, `targetDepthMm`, `precheckCollision`, `frameHash` | T11/T12/M06 |
| C0701-R07 | 切入、链接、保护区与抬刀策略 | `entryEnvelopeVerified`, `linkClearanceVerified`, `protectedZoneIntersections`, `redundantLiftCount` | T13/T14/M07 |
| C0701-R08 | 中立CL弧线及明确坐标帧 | `primitive`, `frameHash`, `sourceHash`, `controllerId`, `arcSweepDeg`, `feedMmMin` | T15/T16/M08 |
| C0701-R09 | CL预览与NC工程资格硬隔离 | `clOwner`, `sourceD08Hash`, `freezeBytesPreserved`, `clPreviewEngineeringPass`, `controllerStatus`, `d15Status`, `releaseEligible`, `materialSweepSimulated` | T17/T18/M09 |
| C0701-R10 | Owner-CAS、权限与取消恢复 | `expectedHead`, `actualHead`, `aclAllowed`, `taskGeneration`, `receiptGeneration`, `cancelled`, `lateReceiptAction`, `rollbackNonDestructive` | T19/T20/M10 |

**实施次序：** 0701-S01统一D02/D03/D04/D07/D08 exact读取；S02轮廓闭合/岛屿拓扑；S03刀径、径轴余量与层切；S04型腔覆盖；S05端面/外轮廓切削与抬刀策略；S06孔位置和深度；S07切入退刀/跨区链接；S08中立直线/弧/孔CL序列与来源；S09独立D12/D13/D15资格门禁；S10 Owner-CAS/ACL/generation、迁移回退及独立消费者签收。每项包含成功、退化、取消、权限撤销和失效用例。

## 领域接口与统一数据
`07.ToolpathPlanningPort.preview(exactWorkContext, featureRefs, stockStateRef, toolAssemblyRef, frozenRouteRef, strategyParams)` 返回只读候选、拒绝原因、段来源、未证实检查项；`07.ToolpathOwnerPort.stage→seal→commitCAS` **只写新D09修订**，写入时重验预期HEAD、ACL/审批、scopeEpoch、任务generation、cancelled、幂等回执。D03资源和刀具由02域持有，D04 Setup/毛坯由04域，D07材料状态由06域，D08冻结由05域；不得跨域直接写或删除用户数据。示例见 [contract.example.json](contract.example.json)，17类资产的Owner候选见 [asset-owner-candidates.json](asset-owner-candidates.json)，尚待跨域会签。

所有`ExactRef`应含`assetId,revision,contentHash,hashKind,scope,coordinateFrameId,frameRevision,frameHash`；`D09`还应含算法版本/参数哈希、刀具/工序/特征引用、段序、段类型、源状态、单位、进给及NC前置资格。跨工艺Setup变换须组合FrameGraph并记录链路修订；D04名义工艺Setup与D10机床执行绑定**不合并**。公共C0仅存identity/units/frame/revision/hash/scope和协议，不变成通用工艺巨型Store。

## 数据流、GUI与失效
[GUI/3D交互](UI.md)坚持单Babylon世界与唯一左TaskPanel：各入口都通过相同07域Port，D09草稿不覆盖旧已冻结工序。可视化显示真实已存CL段、岛与保护区，不以几何动画标D15 PASS。
`D02/D03/D04/D07/D08`任一精确输入变更 → 失效受影响D09候选/已算衍生链 → 必要时重做D11/D12/D13/D14/D15/D16；在没有完整依赖图的情况下返回`UNKNOWN_SCOPE`。不重写D08或无关Setup的同名特征，旧证据保持可回查。取消后的late receipt只进入历史记录，不重绘新上下文。

**NC全链路明确分层：** `D09(中立CL) → D12(最终G-code) → D13(控制器执行语义) → D14(轴运动时序) → D15(限位/碰撞/姿态覆盖验证) → D16(发布)`。D11仅CL级预验证；D13遇宏、专有G/M、循环或偏置未知即`UNKNOWN`。不实现材料扫掠仿真，也不把刀路直接驱动机床场景当工程通过。

## 理论证据与验收
[理论专题](../../../research/topics/R-25D-TOOLPATH-001.md) → [8份合法资料、版本与访问深度](../../../research/sources/CAP-07-01.json) → [10规则/字段/来源](../../../research/traces/CAP-07-01.json) → [10正+10反+10独立变异](fixtures.json) → [可本地运行的规则检查器](../../../tools/check_cap0701_planning_2026_10_25.cjs) → [独立消费者/迁移](independent-consumer-handoff.md)。可执行`node tools/check_cap0701_planning_2026_10_25.cjs`，**它只检查规划静态合成DTO；未运行真实OCCT、Post、NC控制器、机床或GUI，不能声明产品PASS。**
