# B123｜CAP-10-06：OPC JobOrder非绝对排序、AllowedToStart与Run/Item证据分离

> 2026-11-03｜V0.8研究增量，原11域、88 CAP、36原编号包、17资产不变；L1/L2不改，L3待人类审查；本文件及配套来源/规则/fixtures均为NEWLY_AUTHORED，不冒充恢复的历史原字节。**规划PASS≠产品PASS。**

## 本轮独立问题与原规划边界

原[CAP-10-06实施级规格](README.md)与B73已有离线事件重放、幂等收件以及StoreAndStart安全边界。本轮不重复这些内容，而专门解决**工单管理接口返回接受、队列列表、运行次数、产出数量及响应体缺失**造成的现场执行状态误判：

- OPC Foundation《OPC UA for Machinery Part 3: Job Management》**v1.0.1，2024-05-01**，公开HTML §6.4明示可以并行处理作业；多个可开始的JobOrder按StartTime再按Priority比较，但二者相同则选择归应用定义；JobOrderList**并不构成绝对执行顺序**。读取列表顺序或UI拖拽不能生成唯一下一作业的事实。
- 同一规范§3.2与§6.2区分`JobOrder`、`Run`、`Item`以及作业控制与作业结果；例如3个Run可对应15件Item，但不能直接导出15件合格品，更不能据此推断NC程序已经在某台机床完整执行。
- OPC Foundation《OPC UA for ISA-95 Part 4: Job Control》**v2.00.0，2024-01-31**，公开HTML §6.2.1.5中`Start`成功进入`AllowedToStart`，并非物理`Running`、`CycleStart`或操作员授权。v2与v1不兼容，接口类型与Namespace必须现场探测，不能按方法名猜测。
- 同规范§6.3.4/§6.3.5中`JobOrderDataType`与`JobResponseDataType`分层；响应的`StartTime`、`EndTime`等字段可能可选。缺少`EndTime`并不能被自动补造，也不能据`JobState`推断独立质检合格。
- NIST Pease等《Supply Chain Traceability Principles: A Manufacturing Meta-Framework》，**NIST IR 8536，2026-09-09**，本轮只读NIST官方作者、出版元数据和摘要，作为制造事件追踪背景，**未读报告PDF正文**，不把内生门禁归因于NIST标准。

## 8项规则与8来源/字段/原编号包

|规则|可证伪设计要求|关键字段与反例|
|---|---|---|
|B123-R01|锁定ISA-95版本/Namespace与设备能力探测，不把v1当v2|`profile.modelRead`、`profile.isaVersion`、`profile.profileHash`、`profile.namespaceMatchesPinned`；每字段1独立单点反例|
|B123-R02|MES工单外部Owner与本地投影必须有来源和精确Revision映射|`identity.issuerId`、`identity.mappingProof`、`identity.displayNameOnly`、`identity.revisionCurrent`；每字段1独立单点反例|
|B123-R03|ISA-95 Start接受只证明AllowedToStart，不是Running和CycleStart|`start.responseObserved`、`start.readbackState`、`start.claimRunning`、`start.remoteCycleStart`；每字段1独立单点反例|
|B123-R04|JobOrderList排序不是绝对执行队列，并行同级无确定下一工单|`queue.snapshotExact`、`queue.eligibleA.state`、`queue.absoluteNextClaim`、`queue.unqualifiedSelection`；每字段1独立单点反例|
|B123-R05|Run、Item、数量单位及质检合格结论分别追溯|`quantity.units`、`quantity.runIdsUnique`、`quantity.conflatedRunItem`、`quantity.qualityFromCount`；每字段1独立单点反例|
|B123-R06|JobResponse必须逐工单对账，缺EndTime时不得推完成/质量|`response.jobResponseId`、`response.jobOrderId`、`response.finalClaim`、`response.qualityClaim`；每字段1独立单点反例|
|B123-R07|现场作业状态不取代D10实装、最终NC字节与独立D15批准|`release.d10Exact`、`release.finalNcShaExact`、`release.d15Independent`、`release.claimCycleStartFromOrder`；每字段1独立单点反例|
|B123-R08|10域同Owner Port的提交点重验ACL/CAS/取消Fence与单Babylon|`control.aclCurrent`、`control.casMatch`、`control.cancelled`、`control.sameOwnerPort`；每字段1独立单点反例|

完整来源记录含作者、具体版本、出版日期、实际访问章节/深度、URL及局限：[8条分级登记](../../../research/sources/CAP-10-06-job-order-b123.json)。同一OPC规范不同章节登记**不等于独立出版物数量**。逐项来源→规则→字段→`CAP-10-06`/原`E3-06`、`T5-03`→合成正反：[Trace](../../../research/traces/CAP-10-06-job-order-b123-v08.json)、[Fixtures](job-order-b123-fixtures-v08.json)、[只读Node入口](../../../tools/check_cap1006_job_order_b123_v08.cjs)、[验证等级](../../../tracking/cap1006-job-order-b123-verification-2026-11-03.json)。

## 领域模型、Owner签署与实现入口（全部拟议）

1. `WorkOrderProjectionKey`固定外部MES/ERP的`issuerId/jobOrderId/externalRevision`与受控接收端/项目/机床作用域；`D17`仅有事实投影与append事件权，不能覆盖外部工单Owner，也不是第18资产。设备Session与控制器Profile必须以D03、Namespace版本和Schema精确绑定；未探测或两版本混用返回`UNKNOWN`。
2. `StartCommandEvidence`记录请求ID、服务端方法/响应/实际回读状态、来源时钟、Controller/Profile修订；`AllowedToStart`仅作候选资格。**禁止把方法返回、JobOrderList顺序、MDC运行灯或工单Ready映射成`CycleStart`**；不接入远程启机。`JobOrderScheduleWitness`必须保留StartTime、Priority、同级平局、应用自身择序证据与多机并行能力；同级无额外证据=`TIE_UNKNOWN`。
3. `JobOrderResultEvidence`分别固定`runInstanceId`、`runsCompleted`、`producedItemCount`、计数单位、重复/重启及撤销；`JobResponseID`与精确`JobOrderID`逐个匹配。数量、完成状态、质量报告与检测证据不可互相替代；缺可选实际时间只可显示`PARTIAL_UNKNOWN`。
4. `WorkOrderExecutionPort`是10域唯一写入口；GUI、CLI、Agent共享同一Owner Port及CAS/ACL/ScopeEpoch/CancelGeneration的原子提交重验。撤权或取消后的晚回执仅供审计对账，不可新建D17权威状态。旧Reader保留、Expand→Shadow双读→新revision→Contract，失败回退旧只读投影，保留A/B同事实与冻结D08。
5. GUI仅在唯一Babylon Engine/Scene/Canvas显示3D只读现场上下文；主工程/制造资源横向切换只有一个活动世界，统一左`UnifiedTaskPanel`的「发布/现场→工单」子页展示`Eligible / AllowedToStart / ActualRunning / QualityUnknown`及证据缺口；不得新增右Drawer或并排3D。深浅双主题、最大字体12px；工单排序操作只是候选，显式提示并行和平局未知。
6. D04名义Setup与D10实际机床、刀具、装夹Frame及绑定分离，`D09`中立CL→`D12`最终NC原始字节后处理→`D13`控制器解释→`D14`物理Joint时序→`D15`独立工程验证→`D16`人类签发。D17事件不能跳过这条闭包；CL动画、播放或工单Ready不构成NC工程验证。未知控制器语义统一`UNKNOWN`，不做材料扫掠仿真。

## 独立正反与交接

固定Fixture以**8条正例+32条各单点字段负例+4项择序数学Golden**检验候选判断，并故意覆盖版本不兼容、缺来源映射、Start伪运行、列表伪绝对排序、Run/Item混淆、JobResponse缺失、NC校验缺口、撤权CAS取消后写入。唯一正常结果只可称`CANDIDATE_ONLY`，不是物理安全或上机批准。

拟议独立消费者：`10域 CAP-10-06 Owner -> 10域之外的D17现场采集/09域D15验证接口/现场OEM适配器独立测试组`，需使用有权访问的OPC UA测试Server验证v1/v2差异、并行job执行、Tie处理、重启/分段响应和无EndTime；用工单与原NC/D10/D13/D15/D16精确哈希闭包核对，并记录操作员权限及可回退迁移。测试工具只读规划资料，**不连接真实机床，不下发Start/StoreAndStart**。

验收等级：本轮仅同一判定逻辑V8内存正反与解析数学Golden预检；真实独立Node整仓文件执行、OPC服务器/厂商控制器、真实生产工单、D17消费者与D15工程验收`NOT_RUN`。17资产正式Owner签署`0/17`、真实独立消费者`0/17`，L3待人类评审；历史附件原始字节及全仓650份Markdown GFM AST终核未闭。**规划PASS≠产品PASS。**
