# B128｜CAP-08-03 G10 L2/L20与G52/G92持久化：控制器方言差异补证

> 日期：2026-11-03。基于规划分支 B127 exact HEAD `25a911f758490424956e4f6cd7289bf3f64a4197` 的原规划增量；不改变11域、88 CAP、36原编号包、17资产分母。L1/L2不动，L3待审；**规划PASS≠产品PASS**。

[7条分级来源](../../../research/sources/CAP-08-03-wcs-offset-b128.json) · [8规则/32字段/原编号包](../../../research/traces/CAP-08-03-wcs-offset-b128-v08.json) · [8正32反/8解析Golden](wcs-offset-b128-fixtures-v08.json) · [只读Node校验器](../../../tools/check_cap0803_wcs_offset_b128_v08.cjs) · [执行等级](../../../tracking/cap0803-wcs-offset-b128-verification-2026-11-03.json)

## 一、与B120和B127的实质差异

B120解释G28/G30回参考点和G53单块机器坐标；B127锁定换刀/刀长补偿。此轮针对**NC可修改控制器坐标寄存器本身**及**跨程序/重启残留局部偏置**。即使最终NC字节不变，执行前控制器G54/G52/G92寄存器发生改变，也会造成D13解释输入与D14运动轨迹、D15验证结果失效。唯一D04名义Setup没有现场寄存器写权，D10绑定必须容纳当前实际控制器WCS快照。

## 二、已读官方章节与不能外推的结论

| 指令或状态 | LinuxCNC 2.9/官方stable | Haas Mill官方公开G10页 | 规划门禁 |
|---|---|---|---|
| `G10 L2 P1 X...` | LinuxCNC 2.9 §14：设置G54对应的原点偏置；G91**不改变**L2设值语义 | Haas G10举`G10 L2 P1 G91 X6`的示例：G54偏置作增量变化 | 必须锁ControllerProfile，不能依据相同G字做跨方言转换 |
| `G10 L20 P...` | LinuxCNC 2.9 §17：从当前位置反算使当前坐标显示为目标值的WCS偏置 | Haas G10页：L20指向G110–G129或G154的**辅助WCS类别** | 同码异义，无法锁定方言就UNKNOWN |
| `P0/P1` | LinuxCNC 2.9 §14：P0为活动坐标系、P1为G54；G10写入**不自动选择**G54 | Haas L2表：P0为G52、P1为G54 | P命名空间必须随方言/模式解码 |
| `G52/G92` | 2.9 G92与stable §4/§5：共享参数；G92可跨程序恢复，G52可能随INI配置残留 | 本轮未获得Haas同等跨重启共享寄存器正文 | 不可假定复位、M30或重启清除偏置 |
| `G92.1/.2/.3` | 2.9 §57/58：.1清除存储，.2停用而保留，.3从存储恢复 | 本轮没有读取可等价的Haas完整语义 | D13逐个生成不同的有界状态事件，未知UNKNOWN |

外部引用：LinuxCNC公开HTML `https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html` 的§14、§17、§56–58；LinuxCNC stable `https://linuxcnc.org/docs/stable/html/gcode/coordinates.html` 的§4.1、§5.3–5.4；Haas官方Mill G10 `https://haascnc.com/service/codes-settings.type=gcode.machine=mill.value=G10.html` 的L2/L20/P映射及示例。网页未标精确发布日则`publishedOn:null`，访问日期2026-11-03；stable不是LinuxCNC 2.9的固定发行快照。未阅读任何收费ISO正文、NIST PDF全文，也未获得Haas全部机型固件矩阵。上述外部文献**不直接规定**Procet的Owner/CAS/审批；以下协议是本项目工程推导。

## 三、业务Owner、版本及状态机

D04 `NominalSetupFrameRef{revision,contentHash,frameId}`只描述工件名义配准，不自动等同现场G54。D10 `ActualWcsBinding{machineId,controllerFamily,firmwareRevision,optionsHash,iniHash,coordinateRegisterSnapshotHash,activeWcs,g52g92RegisterState,resetPersistencePolicy,frameId,revision,contentHash,scopeEpoch}`为运行绑定权威Owner，其中`iniHash`主要适用于LinuxCNC；其他控制器必须提供等价配置来源或UNKNOWN。D12 `FinalNcSourceRef{bytesHash,dependencyClosureHash}`不通过文件名匹配。D13 `OffsetEvent{ncByteSpan,callInstance,dialectProfileHash,preRegistersHash,postRegistersHash,gCode,wcsSelection,knownness}`仅08域解释，D14 `AxisTimeline{d13EventHash,d10BindingHash,frameId,jointTimeEvidence}`仅09域展开。D15需要独立消费者、覆盖及exact输入；D16仅接受未失效的独立工程证据。

事件必须区分`OFFSET_REGISTER_WRITE`、`ACTIVE_WCS_SWITCH`、`LOCAL_OFFSET_APPLY`、`LOCAL_OFFSET_DISABLE_KEEP`、`LOCAL_OFFSET_CLEAR`、`LOCAL_OFFSET_RESTORE`、`CONTROLLER_RESET`，不能用一个通用`SET_G54`事件替代。读取之前的`G52/G92`是否遗留，以及G92持久化启停配置，属于D10实际状态证据，不可从CL画面猜测。

## 四、8条规则/回归入口

| 规则 | 具体强制条件 | 必须验收的反例 |
|---|---|---|
| B128-R01 | 区分控制器与固件Profile，禁止凭同名G10套用默认规则；`profile.controllerFamilyExact`, `profile.firmwareOptionsHashExact`, `profile.g10DialectSelected`, `profile.noCrossDialectFallback` | B128-N01-1 / B128-N01-2 / B128-N01-3 / B128-N01-4 |
| B128-R02 | G10 L2的P编号及绝对/增量语义须按方言分支；`l2.pTargetNamespaceResolved`, `l2.linuxG91IgnoredForL2`, `l2.haasG91IncrementModeExplicit`, `l2.offsetBeforeAfterCaptured` | B128-N02-1 / B128-N02-2 / B128-N02-3 / B128-N02-4 |
| B128-R03 | 同为G10 L20，LinuxCNC计算当前点与Haas辅助WCS不得同判；`l20.linuxCalculatedFromCurrent`, `l20.haasAuxiliaryWcsMapping`, `l20.currentMachinePoseAndFrameExact`, `l20.ambiguousDialectUnknown` | B128-N03-1 / B128-N03-2 / B128-N03-3 / B128-N03-4 |
| B128-R04 | 改写非活动WCS与选择活动WCS是两件事；`wcs.selectedBeforeAfterSnapshot`, `wcs.p0ActiveMappingQualified`, `wcs.p1G54MappingQualified`, `wcs.noImplicitWcsSelection` | B128-N04-1 / B128-N04-2 / B128-N04-3 / B128-N04-4 |
| B128-R05 | G52与G92在LinuxCNC共享槽位且持久化受INI配置影响；`local.g52G92SharedRegisterModeled`, `local.persistenceIniRevisionExact`, `local.restartRegisterSnapshot`, `local.abortDoesNotAssumeClear` | B128-N05-1 / B128-N05-2 / B128-N05-3 / B128-N05-4 |
| B128-R06 | G92.1清零、G92.2停用保留、G92.3恢复需独立模态事件；`g92.g921ClearsSavedRegisters`, `g92.g922DisablesButKeeps`, `g92.g923RestoresSaved`, `g92.g54UnaffectedByG921` | B128-N06-1 / B128-N06-2 / B128-N06-3 / B128-N06-4 |
| B128-R07 | D04名义Frame不可冒充D10实际偏置，变更失效必须按exact沿依赖传播；`binding.d04NominalFrameExact`, `binding.d10ControllerOffsetsExact`, `binding.d12FinalNcBytesHashExact`, `binding.d13D14D15RecomputedOrStale` | B128-N07-1 / B128-N07-2 / B128-N07-3 / B128-N07-4 |
| B128-R08 | 同Owner多入口提交必须重验ACL/CAS与取消晚回执，CL不能冒充工程验证；`commit.guiCliAgentOneOwnerPort`, `commit.oneBabylonLeftTaskPanel`, `commit.casAclEpochCancelRecheck`, `commit.d15IndependentNoClPass` | B128-N08-1 / B128-N08-2 / B128-N08-3 / B128-N08-4 |

每条规则有**1个完整正例 + 4个独立单字段反例**，变异只翻转该字段，其他字段不变；脚本检查来源ID、CAP/原包ID、缺字段时的`STALE/UNKNOWN/REJECT`资格，不把合成CANDIDATE当实机PASS。另8个标量Golden故意限定为**假想一维无旋转、无刀补、零其他偏置**，不宣称可直接模拟真实机床。

## 五、数值反例与方言边界

1. 假定旧G54 X偏置=10，执行`G10 L2 P1 G91 X6`。LinuxCNC 2.9按§14得到新偏置6；Haas官方Mill例示G91为增量，示例简化成10+6=16。两个控制器执行**相同的文字而寄存器不同**；真正语义必须以OEM Profile与实际参数测量为准。
2. 在假想一维`X_machine= X_work + offset`、机器坐标20、局部偏置0的条件下，LinuxCNC`G10 L20 P1 X1.5`解析反算偏置18.5；Haas`G10 L20 P2 G90 X10`面向辅助坐标G111，并非给G55反算。这个数学算例未处理R旋转、G52/G92、RTCP和实际伺服。
3. 对LinuxCNC G92寄存器数值3，执行`G92.2`再`G92.3`恢复3；执行`G92.1`再`G92.3`只能恢复0。G52共享寄存器是否跨重启由INI策略决定；**不以“程序结束=零偏置”作为放行断言**。

## 六、交互、失效、回退及独立验收

GUI的WCS状态编辑/查看放在统一**左侧TaskPanel**，单Babylon Engine/Scene/Canvas显示名义与实际Frame差异，最大文字12px，浅深主题；CLI/Agent调用相同D10 Owner Port，预览只读，禁止3D拖动即提交。任何写入须带预期`revision/contentHash/frameId/scopeEpoch`，服务端CAS与ACL重验；切Setup、撤权、取消、旧PreviewLease及晚回执不得写。A/B共享事实，不覆盖D08冻结或D16旧发布历史。

执行变化矩阵：D10坐标寄存器快照、INI持久化配置、OEM Profile、D12最终NC及D04来源任何一项变化，都须触发D13重新解释/标STALE，并使依赖D14、D15、D16资格失效；旧修订只读保留，配对版本Reader迁移失败可回退旧Reader但不得重授旧发布资格。异常码：`UNKNOWN_G10_DIALECT`、`G10_P_NAMESPACE_AMBIGUOUS`、`G52_G92_RESIDUAL_UNOBSERVED`、`WCS_REGISTER_STALE`、`PROFILE_MISMATCH`、`CAS_CONFLICT`、`CANCELLED_LATE_ACK`、`D15_INDEPENDENT_NOT_RUN`。

独立验收要求真实Haas/LinuxCNC机器或可证明等价的控制器级解释器、固定具体固件/INI/寄存器读回、最小正反NC程序及D13-D14-D15独立消费者的before/after证据；先观察/只读，不下发未经批准的坐标偏置写入。当前测试入口仅`node tools/check_cap0803_wcs_offset_b128_v08.cjs --root .`（规划），工程层`NOT_RUN`。不做材料扫掠仿真。**规划PASS≠产品PASS。**
