# CAP-10-07｜跨域Owner/独立消费者/迁移交接
## 职责与exact证据
- 外部机床OPC/厂商报警、MES工单、质检报告均保留**各自系统Owner**；D17在10域只追加证据。D01工程修订归01域，D03资源归02域，D04名义Setup和D10真实执行绑定均归04域但**独立对象、独立revision/hash/frame**，D08原冻结A/B不可被覆盖；D12/D13归08域，D14/D15归09域，D16/D17归10域。
- 17资产正式Owner签署仍`PENDING_HUMAN`；本表只为接口签署草案。原E3-06/T5-03的施工签收须与独立需求/安全/质检Owner会签。
## 同域Port候选
`inspectSourceEvent(rawDigest,EventId,quality)`、`appendIncidentEvidenceCAS(expectedD17Revision,hash,scopeEpoch,aclEpoch,cancelToken)`、`previewImpactGraph(baseRevision,baseHash,baseFrame)`、`forkEngineeringChange(baseExactRef,newBranchName)`、`submitHumanDisposition(issueId)`、`readRevalidationRequirements(newRevision)`。GUI/CLI/Agent同一个Port，禁止绕过人类审批或直接`remoteCycleStart`。
## 外部独立消费者验收（全部NOT_RUN）
独立OPC报警模拟服务器、独立质量系统及NC后处理/控制器消费者必须按真实授权环境记录：生产者和消费者二进制SHA、D03机床及控制器Profile/选件、D04与D10两个exact Frame、D12原始NC bytes SHA、D13解释器版本、D14物理Joint轨迹、D15独立Oracle身份、D16人工签发、D17原始EventId/时间质量、Git revision与日志hash、运行命令和exitCode。
正例：异常事件进入append-only D17→新ECN派生→影响图→新NC→独立验证→新签发→独立质检，**不得自动CycleStart**。
反例：旧报警EventId重放、Ack冒充维修、来源时间UNKNOWN、质检无结论、不同机床同名工单、D04/D10混同、D13漏模态/宏、D14未重算、D15复用生成器Oracle、D16旧签名、新版本覆盖冻结A/B、取消晚ACK、撤权、CAS冲突、离线丢包和接口能力未知。预期`REJECT/STALE/UNKNOWN/BLOCK_CHANGE/BLOCK_RELEASE`，若事实不能确认不得给出PASS。
## Expand/Migrate/Contract
保留旧MES Reader、原D17历史及旧工程只读快照，新Port先影子读取/对比来源hash；差异列清单，禁止直接覆盖。独立消费者及正式Owner签署之前不切新Writer；失败恢复旧Reader，原A/B、D16签发、D17追加事件及外部质检回执均不删。未恢复的历史附件只在历史审计登记缺失，不伪称字节恢复。
