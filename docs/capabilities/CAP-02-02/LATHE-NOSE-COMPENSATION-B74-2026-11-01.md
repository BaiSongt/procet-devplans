# B74｜CAP-02-02 两轴车床刀尖圆弧半径与控制器偏置语义（2026-11-01）

原11域/88 CAP/36原编号工作包/17资产与L1/L2保持不变；L3待人工审批。针对F1-01/F1-02/F1-06、U4-02/U4-03/T5-01及E3-02/E3-03补证。**规划PASS≠产品PASS。**

## 核心反例

LinuxCNC 2.9工具表的`D`为**刀具直径**，车刀半径`r=0.4mm`对应工具表直径`D=0.8mm`；而`G41/G42 D7`里的`D7`是**工具号7**，不是0.8mm。工具表`I/J`是前/后角、`Q`取向整数0–9。将r直接当成工具表D、将G码D当成直径或将LinuxCNC Q套成Haas虚拟刀尖号，都可能改变D13补偿路径。Haas Group07公开说明G41/G42与`Tnnxx`偏置号配套；没有充分证据将厂商取向代码和偏置映射直接跨方言继承。

直径40mm的车削目标在LinuxCNC `G7 X40`与`G8 X20`的物理径向位置相同，坐标编程模式变化**不应修改D03刀尖半径或目录几何**。LinuxCNC Lathe模式仅影响显示，不自动将平面设为G18。

LinuxCNC 2.9官方G-Code §26规定G41/G42导入长度至少刀具半径；§25中G40结束补偿后下一条需**线性**运动并长于刀具直径。合成r=0.4、导入0.5、退出0.9mm仅为数学案例。Haas控制器不沿用LinuxCNC该阈值，未知具体OEM方言、刀片装夹及补偿初态一律`UNKNOWN`。

## 八条规则/字段/机器验收

| ID | 设计规则及字段 | 来源 |
|---|---|---|
| B74-R1 | 车刀R与铣刀D不混用；`cutter.kind / cutter.noseRadiusMm / cutter.unit` | B74-S05, B74-S07 |
| B74-R2 | LinuxCNC工具表D=2R、Q取向而G41 Dn是工具号；`bind.tableDiameterMm / bind.tableQ / cutter.orientationQ` | B74-S01, B74-S02 |
| B74-R3 | Haas Tnnxx偏置非LinuxCNC Q工具号；`bind.controller / bind.haasOffset / bind.haasTip / nc.dialect` | B74-S04, B74-S06, B74-S07 |
| B74-R4 | G7直径与G8半径仅是位置换算；`nc.xMode / nc.xWord / nc.partDiameterMm` | B74-S02, B74-S03 |
| B74-R5 | G41/G42进入G40退出依OEM语义判定；`nc.comp / nc.entryMm / nc.exitMm / nc.exitMotion / nc.d15` | B74-S02, B74-S04 |
| B74-R6 | D03名义刀片与D10实装及实际偏置必须精确；`bind.cutterRevision / bind.cutterHash / bind.physicalInstall / bind.offsetEvidence` | B74-S01, B74-S07 |
| B74-R7 | Owner CAS/ACL与迟到回执重新检查；`gate.currentRev / gate.acl / gate.cas / gate.scope / gate.receiptGen` | B74-S07 |
| B74-R8 | 同领域三入口、单Babylon左TaskPanel与冻结回退；`ui.channels / ui.sceneCount / ui.panel / compat.newReader / compat.freezeUnchanged` | B74-S07 |

规划候选状态`CANDIDATE_ONLY`并不证明刀具实际安装、NC执行或安全；`REJECT`为已知违反、`STALE`为修订/任务代次过期、`UNKNOWN`为缺失证据、`DISPLAY_ONLY`仅3D只读。以上枚举是Procet内生L3提案，不属于任何厂商标准的原生定义。

## Owner与消费者合同

D03资源Owner发布类型化刀片、鼻圆半径、角度、制造商/材质和Profile的revision/hash；D10执行绑定Owner保存真实刀架、装夹、刀具安装位置、工具表和控制器Profile、Frame、Offset/Wear测量凭证。D04只负责名义Setup，不能取代D10。D03目录不等于现场测量；资源Revision新发布不能篡改冻结D05/D08。A/B共享同一工程事实，C0只保留ID、单位、Hash、Revision、Frame、Scope基元。

D12最终NC→D13按控制器模态及刀具补偿解释→D14轴时序→D15独立工程验证→D16发布。中立CL与Babylon动画不构成NC PASS，不做材料扫掠仿真；任何未知语义`UNKNOWN`，禁止D16通过。D10换刀和参数变更触发精确依赖失效，不自动重写已签发NC。

所有GUI/CLI/Agent操作统一进入`Resources.CutterProfilePort`与Host受管领域流程。界面唯一Babylon Engine/Scene/Canvas、左侧统一TaskPanel，浅/深主题、字体≤12px；刀具3D半透明高亮只是preview。写入前二次校验exact revision/hash/frame、Host ACL、CAS、scopeEpoch、cancelled与lateAck，晚回执绝不提交。旧新Reader并行兼容、冻结回退仅改变读路径，不删除历史工程或原有资产。

## 研究来源与限制

2026-11-01经联网阅读LinuxCNC 2.9工具表§2.1、G-Codes§25–27及Lathe User§1–3、Haas Group07官方公开HTML正文；ISO13399-1:2006仅官方目录与摘要，Gao 2015论文仅出版平台摘要及DOI。不能冒称已读ISO收费正文或真实LinuxCNC/Haas机床固件。项目Owner/CAS/GUI和消费门禁属于内生设计，不归因于ISO。

[7项合法来源/实读深度](../../../research/sources/CAP-02-02-lathe-tnc-b74.json) → [8条可追踪规则](../../../research/traces/CAP-02-02-lathe-tnc-b74-v08.json) → [26项独立期望合成](lathe-tnc-b74-fixtures-v08.json) → [Node只读工具](../../../tools/check_cap0202_lathe_tnc_b74_v08.cjs) → [验收分级](../../../tracking/cap0202-lathe-tnc-b74-verification-2026-11-01.json)。

本轮仅同一`judge`函数合成26/26符合预期。独立Node完整文件、真实D10/NC/机床/17消费者未执行；Owner0/17、L3待审批、全仓GFM AST与历史原件审计未闭。**规划PASS≠产品PASS。**
