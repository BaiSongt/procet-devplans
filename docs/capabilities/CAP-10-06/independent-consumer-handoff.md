# CAP-10-06｜独立消费者与迁移交接（必须验收但未执行）
## D16/D17责任与上游
外部ERP/MES拥有原始JobOrder真值；10域`WorkOrderExecutionPort`只做一致性投影、现场确认流程，D16受控发布及D17追加事件是本仓既有资产，不新增D18。D03机床资源由02域Owner；D04名义Setup、D10实装绑定独立；D12/D13/D14/D15分别由08/09域Owner，以上全部exact `revision/hash/frame/scopeEpoch`绑定。**17资产正式会签PENDING_HUMAN**。

## Port候选（GUI/CLI/Agent同源，不旁路）
`getOrderProjection(externalJobId,sourceRevision)`、`readApprovedRelease(d16ExactRef)`、`previewInstructions(immutableInstructionDigest)`、`compareExecutionSetup(d04NominalRef,d10ActualExactRef)`、`appendFieldEventCAS(expectedD17Revision,expectedD17Hash,aclEpoch,scopeEpoch,cancelToken)`、`exportJobResponse(readOnlySnapshot)`。
Port拒绝`remoteCycleStart`和未获厂商/工厂授权的`StoreAndStart`；要求机床控制指令另行人类审批、安全认证和控制器适配，不能借本CAP授权。

## 独立消费者测试入口（产品与实机NOT_RUN）
仅在授权模拟MES/OPC服务器及独立签名样例环境操作；记录生产者/消费者实现SHA、JobOrder/JobResponse版本、D12最终NC原始字节SHA、D10 Frame/刀具/机床Profile、事件UTC时钟与质量、D15独立Oracle身份、D16审批签名、工单读权限与operator签收、命令、exitCode和日志SHA。
- 正例：ERP工单ID+revision唯一、D16真实签发包、D10实际绑定、扫码指导签收和D17 append按序关联。**结果只表示证据闭包，不提供CycleStart。**
- 反例：旧OPC 40501被弃用节点但新40001-3不存在、JobId跨机器碰撞、重复签收、撤销工单、NC同名不同原始字节、D04/D10错Frame、D15 UNKNOWN、D16缺人类签发、权限撤回、切换工程、CAS冲突、取消晚ACK、离线时钟漂移/MTConnect GAP、暂停/中止后无证据复产、质检延迟/返工、ERP回执失败。期待`REJECT/STALE/UNKNOWN/BLOCK_RELEASE`，不得假造质量PASS。
- 独立质量Owner需要重新核验合格/报废/返工数据；OPC JobResult Successful不是零件全检通过，MTConnect运行灯不是NC执行。消费者验收由另一实现/团队执行，合成fixtures及生成器自测均不能自证明工程通过。

## Expand/Migrate/Contract
先维护旧MES Reader、旧发布单据和D17历史append；新增Port影子读，将原工单/NC/Frame/身份按hash比对，不回写冻结A/B状态。由独立消费者和跨域Owner会签后才灰度启用新Writer；失败回退旧Reader，原版本、授权链、D16签发、D17事件历史及回执均不删除。不可找到的旧源附件登记为缺失，绝不凭补稿伪称旧字节恢复。
