# B177｜CAP-08-03 G61/G61.1/G64轨迹控制、偏离容差与D15验证隔离

日期2026-11-05。原编号E3-03/E3-04/E3-05/U4-04；V0.8，L3待人审；新编专题并非历史字节恢复或NC安全认证。

## 实读依据与边界

- [LinuxCNC G-Codes 2.9](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html) §35–37（LinuxCNC Documentation Team；官网指定正文）：G61精确路径并非逐段必停，G61.1逐段末停；G64为路径混合，P是轨迹规划容差、Q是Naive CAM简化容差；未写Q的默认语义受P影响，Q0关闭Naive CAM。裸G64与G64 P0没有正的数值偏离资格；LinuxCNC而非所有OEM适用。
- [LinuxCNC User Concepts 2.9](https://linuxcnc.org/docs/2.9/html/user/user-concepts.html) §1.1–1.3（官网指定正文）：轨迹规划中的速度/转角取舍，G0快速亦受规划模式约束；G64 P不是测得的伺服误差，也不承诺刀具/夹具净空。
- [NISTIR 5738](https://www.nist.gov/publications/nist-rs274kt-interpreter)，Kramer/Proctor，1995-10-26：**仅核对官方出版元数据**；未读PDF正文，严禁据此引用G64的具体算法条款。
- [固定CAP原规格](README.md)及[原E3-03](../../work-packages/E3-03.md)：Owner/ACL/CAS、D04/D10分离、NC→D13→D14→D15→D16是Procet内生设计，不冒称外部标准。

作者、版次、访问日期2026-11-05、URL、章节深度及限制详见[5项分级来源](../../../research/sources/CAP-08-03-path-blending-b177.json)。

## 数学示例：折线程序≠圆角执行轨迹

合成90°折线的角内，若人为构造切线半径r的1/4圆角，圆心与顶点距离r√2，距离顶点最近的圆弧点偏离量δ=r(√2−1)。r=1mm得到0.4142135624mm，r=0.1mm得到0.0414213562mm。这**仅证明本构造的几何偏离**，不是LinuxCNC G64规划器真正采用的圆角半径、实际NC路径、G64 P值或机床净空。D15绝不据这个数学例子发布安全结论。

## 来源→规则→字段→CAP/原包→正反验收

|规则|主题|四个独立字段|
|---|---|---|
|B177-R01|固定NC字节、Profile、Setup/执行绑定|`identity.ncSha`、`identity.profileExact`、`identity.d04Separate`、`identity.d10Exact`|
|B177-R02|G61/G61.1/G64模态与冲突阻断|`modal.current`、`modal.initialKnown`、`modal.transitionsLogged`、`modal.conflictRejected`|
|B177-R03|G64 P>0与单位及Q显式来源|`blend.pSpecified`、`blend.pMm`、`blend.units`、`blend.qExplicit`|
|B177-R04|Q默认值、Naive CAM与原行谱系|`naive.qMm`、`naive.qDefaultKnown`、`naive.arcRewriteLogged`、`naive.originalSpansPreserved`|
|B177-R05|90度圆角偏离仅数学Golden|`geometry.cornerDeg`、`geometry.radiusMm`、`geometry.cornerDeviationMm`、`geometry.mathOnly`|
|B177-R06|裸G64/P0无有界证明，精确与停机差异|`semantics.noPUnbounded`、`semantics.pZeroUnbounded`、`semantics.exactVsStopDistinct`、`semantics.rapidBlendingConsidered`|
|B177-R07|同Owner入口、CAS/ACL、取消与晚回执|`commit.sameOwnerPort`、`commit.casAclAtCommit`、`commit.cancelFence`、`commit.lateAckIgnored`|
|B177-R08|独立D13/D14/D15与UNKNOWN阻D16|`release.d13FromFinalNc`、`release.d14FromPhysicalAxes`、`release.d15Independent`、`release.d16UnknownBlocked`|

[追踪文件](../../../research/traces/CAP-08-03-path-blending-b177-v08.json)对8规则、32字段逐项绑定来源、CAP-08-03、原E3-03/E3-04/E3-05/U4-04及独立正反case ID。[Fixture](path-blending-b177-fixtures-v08.json)为8正32个单字段反例、10个状态/几何Golden。[Node只读校验](../../../tools/check_cap0803_path_blending_b177_v08.cjs)只验证规划契约与合成数值，不是NC执行解释器。

## 数据所有权与统一界面

D12拥有最终原始NC字节、programSha及物理行号；D13必须按精确`{ncSha,profileSha,firmwareOptionsSha,scopeEpoch,d04Revision,d10Revision,frameId}`**重新读取最终NC**，记录`PathControlModal{mode,pOriginal,qOriginal,pResolved,qResolved,units,physicalLine,modalBefore,modalAfter,rewriteLineage}`。P/Q缺省必须与解出的默认值分开，UNKNOWN不得猜测；D14从D10真实机床物理Joint和机床坐标链求轴时序，D15独立消费最终NC重新核验含连续运动净空，D16由Owner批准。D04 Setup不等于D10执行装配绑定，A/B共享修订事实且D08冻结不可覆盖；中立CL预览绝不代替NC验证，不做材料扫掠仿真。

GUI/CLI/Agent统一调用08域`NcExecutionPort.interpret`，不得绕过业务Owner改写D13/D15。单Babylon Engine/Scene/Canvas，左UnifiedTaskPanel展示“NC原行/模态和Naive CAM合并谱系/D14轴资格/D15结果”，≤12px、浅深主题、禁止右侧Drawer。接管提交前重验expected revision/hash/frame、scopeEpoch、ACL/CAS、取消generationFence，晚ACK只诊断不采纳。NC/Profile/P/Q/单位/机床D10任何变更使派生D13–D16标STALE。旧模型缺P/Q记录则`LEGACY_UNVERIFIED/UNKNOWN`只读；采用Expand→Migrate→Contract影子双读，失败回退旧Reader但不能恢复旧PASS；不得覆盖D08冻结。

## 验收与风险交接

V8内存按同判定逻辑**50/50合成符合预期**，只证明字段规则和解析构造。独立Node完整文件执行**NOT_RUN**；真实LinuxCNC、NIST报告正文、目标OEM、D14时间轴、D15独立动态验证及17资产真实消费者**NOT_RUN**；正式Owner签署0/17，L3待人审，历史原附件字节与全仓GFM AST均OPEN。真实验收需冻结NC字节、控制器配置和D10运动链后，分别用D13与独立D14/D15消费者测试正常、取消、失效、UNKNOWN、越权；提供日志和固定revision/hash/frame。**规划PASS≠产品PASS。**
