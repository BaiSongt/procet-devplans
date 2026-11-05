# B181｜CAP-09-06 NC倍率与停机回执研究补证（2026-11-05）

> 原11域88 CAP、36原编号工作包、17资产保持；L1/L2不改，L3待人审。**规划PASS≠产品PASS。**

## 业务目的、增量与争议

原CAP-09-06的目标为“解释/执行NC并检查控制器级运动”；关联F1-02、E3-04、E3-05、U4-04。B90已讨论G93/G94/G95名义进给时间、B101讨论Joint限位、B177讨论G61/G64、B180讨论G28/G30/G53。本轮只补**M48–M53、操作员实时倍率与暂停恢复事件**。

错误的工程结论包括“关闭M50便证明实际速度严格等于程序F”“打开M53就表示伺服已停住”“NC有M1就一定停机”“重启后旧D15 PASS仍然可用”。

## 外部资料来源、阅读深度及限制

[9项分级来源](../../../research/sources/CAP-09-06-feed-override-b181.json)包含作者、版本、时间、URL、实际阅读章节、局限。LinuxCNC Documentation Project 2.9 M-Code官方HTML§9–13已定点阅读：M48/M49统一使能进给与主轴倍率；M50/M51分别控制；M52使用HAL `motion.adaptive-feed`，官方指出负adaptive反向功能尚未充分测试；M53使能对`motion.feed-hold`的响应而非无条件停止。§2–3规定M0/M1（后者受可选停止开关约束）与M30终止/模态重置。其2.9 INI §DISPLAY的`MAX_FEED_OVERRIDE`是可选择的倍率上限，并非实测Joint速度。**上述仅适用于核对过的LinuxCNC 2.9文本，不可泛化到Haas/FANUC/B5等机床**。

W3C PROV-O (Lebo/Sahoo/McGuinness，2013-04-30)的公开Abstract只支持来源/活动追踪概念；RFC9110 (Fielding等，2022-06) §13只提供条件并发类比，均非Procet工业控制规范。NIST Albus/Proctor《A Reference Model Architecture for Intelligent Hybrid Control Systems》1996-07-05官方出版页仅核对作者与摘要，**没有读论文PDF正文**，不能据此声称硬件周期、数控动态或机床安全已认证。固定Git HEAD上的CAP09-06原文为内部领域约束，不是外部标准。来源登记是重复章节级记录，**非9篇去重论文**。

## 算法界限与数据字段

D13从D12最终NC**原始字节SHA**和子程序闭包重新解释，钉住D10实际机床Profile、版本、Frame、scopeEpoch，形成`{runId,ncByteRange,modalBefore,modalAfter,overrideFeedEnabled,overrideSpindleEnabled,adaptiveHalSource,holdGate,optionalStopSwitch,unknownReason}`有来源的事件。M48/49与M50/M51分别记录开关及主轴作用域；M52缺实时HAL数据为`UNKNOWN_LIVE_HAL`，负adaptive为`UNKNOWN_REVERSE_ADAPTIVE`；M53 hold=true仅标记`HOLD_REQUEST_NOT_STOP_PROOF`，不能当作真实伺服已停。M1是否暂停取决于当次可选停止开关；M30结束不代表设备已获安全许可。未知Profile、运行时信号、时间窗或未建模语义都标UNKNOWN，禁止D16自动发布。

明确分离`RequestedFeed`、`ConfiguredOverrideLimit`、`MeasuredOverrideFactor`、`CommandedJointTrace`和`FeedbackJointTrace`，不存在直接以名义F或界面倍速推导物理D14/D15 PASS的规则。14个Golden仅为**自建解释器数学/状态机示例**，不是厂家插补器输出。规划不做材料扫掠仿真。

## 模块Owner与交互/失效/回退

D04只存名义Setup，D10单独持有真实机床绑定；D12 NC后处理→D13最终NC字节解释→D14物理轴时序→**独立实现**D15安全验证→D16发布。D09中立CL动画不可替代最终NC验证。A/B读取同一工程事实，不能覆盖D08冻结。事件附exact Revision/Hash/Frame/ScopeEpoch/时间戳与来源，Profile/HAL、D10绑定、权限、指令或测量证据变化时旧D14/D15标STALE；旧冻结、NC及发布历史保留，资格重建或回退而不覆盖旧版本。C0保持最小身份/Frame/修订协议。

GUI、CLI、Agent调用同一个09领域Owner Port；单一Babylon Engine/Scene/Canvas，统一左TaskPanel区分“名义、计划、实测、未知”，非真正停机反馈不许显示“安全复工”。提交时重验ACL、CAS expectedRevision、任务Fence与取消状态，晚ACK不落库；L3人工审批。恢复必须在同一运行实例明确有安全反馈，或创建新实例重新验收，不能由暂停按钮回执直接放行。

## 来源→规则→字段→正反测试

[来源9条](../../../research/sources/CAP-09-06-feed-override-b181.json) → [8规则32字段、资产/原包映射](../../../research/traces/CAP-09-06-feed-override-b181-v08.json) → [8正例/32单字段独立负例/14 Golden](feed-override-b181-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap0906_feed_override_b181_v08.cjs) → [执行等级](../../../tracking/cap0906-feed-override-b181-verification-2026-11-05.json) → [E3-04实施补证](../../work-packages/E3-04/FEED-OVERRIDE-B181-2026-11-05.md)。V8同判据合成54/54符合预期；**Node独立整文件、真实D13/D14/D15/控制器/17消费者均NOT_RUN**。

交接验收必须在独立D15进程检验M50P0与M52仍启用、M53 hold=true而反馈未知、M1可选开关两态、M30后状态、权限取消晚回执与错Frame，并通过实际NC与机床样本复核。拒绝借助CL播放代替执行验证。正式Owner签署0/17、真实独立消费者0/17，历史原附件及全仓GFM AST终核待办。规划PASS≠产品PASS。
