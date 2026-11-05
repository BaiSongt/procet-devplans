# B182｜CAP-07-05 球刀理论残高与表面计量分层（2026-11-05）

> 原11域88 CAP、36原编号包、17资产的L1/L2与编号不变，L3待人类审查。**规划PASS≠产品PASS。**

## 增量的工程问题
粗/半精/精策略中，名义横向步距、理论几何波纹残高、路径离散公差和实际表面粗糙度属于不同证据域。**球头刀理论残高不是Ra/Rz实测值，也不能证明NC的机床动态/碰撞安全。**本项新增有界数学模型及独立正反门禁，链接原E3-01；不重复最近B168姿态四元数、B177轨迹混合与B181进给倍率。

## 官方资料与阅读范围
[8条分级来源](../../../research/sources/CAP-07-05-scallop-quality-b182.json)记录作者/机构、版本、发布日期、访问时间、合法URL、实际章节与限制。Autodesk Fusion CAM官方Scallop资料明确Stepover、接触边界、网格/路径容差、Smoothing等控制项，属于特定软件指南而非通用加工标准。NIST Vorburger等2014年表面粗糙度校准与Renegar等2012年测针尖端影响仅阅读**官方出版页摘要及作者日期**，没有读取PDF论文全文；可据此区分几何残高与独立测量，不外推任何机床容差。ISO 21920-2:2021（2022-06勘误版）仅核对官方目录、摘要及修订状态，未阅读付费正文，不引用未读条款。OCCT 8.0.1 `BRepExtrema_DistShapeShape`公开API只给形体最小距离，不是连续残高Oracle或真实粗糙度认证。内部CAP原文只提供Procet领域约束，非ISO结论。

## 数学模型、定义域、可反证场景
**仅对理想球头半径R、刀轴垂直局部平面、等距两条平行走刀中心s、无倾角/偏摆/弹性变形**的圆截面几何，设计自己的理想残高`h=R−sqrt(R²−s²/4)`，有效域`R>0, 0≤s≤2R`。逆推名义步距`s=2sqrt(2Rh−h²)`，有效域`0≤h≤R`。这些方程为二维几何推导而非援引厂商公式，不保证真实工况。样例R=5mm、s=2mm，h=0.1010205144mm；目标h=0.1mm可推s=1.9899748742mm。s>2R、R≤0拒绝；倾斜球刀、局部曲率变化、非理想刀刃、转角/台阶或曲面接触不符合假设则返回`UNKNOWN_MODEL`，不可外推。边界s=2R只用于数学退化回归，绝非推荐切削参数。

字段区分`scallopHeightIdealMm`、`cutToleranceMm`、`triangulationToleranceMm`、`smoothingToleranceMm`、`measurementRef`及真实质量结论。分量容差可按Procet策略保守累计，但并不能把和直接视为真实机床精度、Ra或Rz。D17必须接入独立测量及不确定度、量仪配置与评价Profile；07域只能提供数学候选。

## 业务Owner/界面/执行链/失效/回退
07域Owner消费D01设计目标、D02质量要求、D03刀具球径与几何、D04名义Setup、D07有序残料、D08冻结的exact `id/revision/hash/frame/scopeEpoch`引用；提供`evaluateIdealBallScallop()`和`planStepoverCandidate()`的候选服务。C0只负责最小公共身份/Frame/Revision/单位，不合并业务对象。D04名义Setup不能冒充D10具体机床、刀具安装及控制器绑定；模型适用性缺失、来源漂移或质量测量未知必须显示UNKNOWN。

GUI/CLI/Agent走同一个07域`ToolpathPlanningPort`，单Babylon Engine/Scene/Canvas、统一左TaskPanel显示理论h及其假设，3D预览没有提交权。A/B同事实不覆写冻结D08。完整链路`D09中立CL→D12后处理最终NC→D13重新解释最终NC原始字节→D14机床物理轴时序→D15独立验证→D16受控发布`，D11/CL动画非NC工程验证，不做材料扫掠仿真。UNKNOWN不得晋升为D15/D16 PASS。

写入须07域Owner重验ACL/CAS expectedRevision、Frame/Hash/scopeEpoch、任务generation、cancelFence；取消后晚回执忽略。源工具、D07、Frame或模型Profile变化使旧证据STALE并派生新revision，保存旧冻结，按Expand/Migrate/Contract安排旧Reader兼容与回退，不覆盖原数据。真实D08/D12/D15/D17独立消费者、正式Owner会签及L3未执行。

## 可机检证据
[8条来源](../../../research/sources/CAP-07-05-scallop-quality-b182.json)→[8规则32字段与E3-01/F1-03/U4-04](../../../research/traces/CAP-07-05-scallop-quality-b182-v08.json)→[8正32独立单字段反例+10 Golden](scallop-quality-b182-fixtures-v08.json)→[Node只读检查器](../../../tools/check_cap0705_scallop_quality_b182_v08.cjs)→[执行等级](../../../tracking/cap0705-scallop-quality-b182-verification-2026-11-05.json)→[原E3-01实施补证](../../work-packages/E3-01/SCALLOP-QUALITY-B182-2026-11-05.md)。V8同判据数学/结构合成50项并不证明真实OCCT、NC、测量、机床或产品通过，完整Node独立进程与全仓GFM AST仍NOT_RUN，历史缺失原字节继续审计。**规划PASS≠产品PASS。**
