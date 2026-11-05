# CAP-02-04｜B78夹具OPC UA观测证据与时间资格（2026-11-01）

本项是[B36额定/计划/实际状态分离](WORKHOLDING-B36-2026-10-30.md)的**增量研究**：B36核对传感证据存在性；B78补充**OPC Service结果、单项操作StatusCode、DataValue质量、sourceTimestamp、serverTimestamp和信号物理身份**细粒度责任。原11域、88 CAP、36原编号工作包、17资产、L1/L2不变，L3待审。**规划PASS≠产品PASS。**

## 可复核反例

OPC 10000-4 v1.05.07 §5.3明确Service Good允许部分操作成功，仍须检查每个操作StatusCode；§7.11的DataValue还拥有独立StatusCode。Service GOOD、Operation UNCERTAIN、DataValue GOOD**不是可靠闭环观测**，判UNKNOWN。即使三者GOOD且数值CLOSED，该结果只可成为有条件的 `OBSERVATION_CANDIDATE`，绝非物理夹紧力、工件安全、D15或D16通过证据。

时间数学：合成读值source 06:25:00Z、consume 06:25:02Z、时钟不确定500ms、freshness预算10000ms，保守age=2500ms，候选。若source为06:24:00Z但serverTimestamp为06:25:01Z，则真实来源age=62000ms，返回STALE。不可只取“服务器刚刚知晓值”代替“值由数据源生成的时间”。10秒/500毫秒只是**规划演示策略参数**，不是OPC或OEM安全规格；来源时钟、采样链与硬件实际精度未实测。

Carr Lane CL-165-TV特定产品表将推荐扭矩与近似夹紧力分别给出；它们并非实际已夹紧或切削载荷承载合格的自动证明。NIST SP800-82 Rev3仅阅读官方出版元数据/摘要，不能借其未读正文编造时延阈值。W3C PROV-O的Entity/Activity/Agent可以表达来源链，不构成设备控制或写入授权。

## 领域数据契约、8条规则及回退

| 规则 | 业务边界 | 机器字段 |
|---|---|---|
| B78-R1 | 资源能力为额定资料非实测 | `resource.revision`, `resource.hash`, `resource.published`, `resource.ratedSource` |
| B78-R2 | D03资源、D04计划与D10真实安装精确区分 | `setup.resourceRevision`, `setup.frame`, `execution.bindingResourceHash`, `execution.actualInstalled` |
| B78-R3 | Service/Operation/DataValue三层状态不得混写 | `sensor.serviceResult`, `sensor.operationResult`, `sensor.dataValueStatus` |
| B78-R4 | sourceTimestamp不由serverTimestamp代替，加入时钟不确定度 | `sensor.sourceTimestamp`, `sensor.serverTimestamp`, `sensor.observedAt`, `sensor.maxAgeMs`, `sensor.clockUncertaintyMs` |
| B78-R5 | 机器夹具Node极性及观测来源exact绑定 | `sensor.machineId`, `sensor.fixtureId`, `sensor.nodeId`, `sensor.polarity`, `sensor.provenanceHash` |
| B78-R6 | CLOSED最多只读观测候选，不产生D15/D16通过 | `sensor.value`, `assessment.safetyClaim`, `assessment.d15`, `assessment.d16` |
| B78-R7 | Owner ACL/CAS/修订作用域及取消晚回执重验 | `gate.acl`, `gate.cas`, `gate.expectedRevision`, `gate.currentRevision`, `gate.cancelled`, `gate.receiptGen` |
| B78-R8 | GUI/CLI/Agent单一Owner端口+单Babylon世界+左TaskPanel和回退 | `ui.channels`, `ui.sceneCount`, `ui.panel`, `migration.rollbackSafe`, `migration.freezeUnchanged` |

D03唯一Owner维护夹具额定定义与immutable revision/hash，D04 Owner维护名义Setup、Frame和计划开口，D10 Owner核实指定机床、接口、实际安装及信号绑定，D17记录物理采集原始状态、Source/Server/Consume时间与 provenance，D15/D16独立工程验证和发布。C0只存身份/单位/帧/Hash/作用域；CAS、ACL、scopeEpoch、cancelFence、晚回执在Owner事务重新检查。异步回执与3D预览无持久化权。

GUI/CLI/Agent共用资源Owner Port，唯一活动Babylon Engine/Scene/Canvas及统一左TaskPanel、12px最大字体。旧Reader保留可回退、A/B同事实不覆盖冻结；不把传感器Good/夹具显示动画、CL播放当NC工程验证。链路保持中立CL→NC后处理→D13解释→D14轴时序→D15验证→D16发布；未建模语义显式UNKNOWN，不做材料扫掠仿真。本规格**不含远程夹紧/启机执行动作**。

## 来源及验收边界

[7条分级来源/作者/版次/访问章节](../../../research/sources/CAP-02-04-opc-observation-b78.json) → [8字段规则对应CAP/原包](../../../research/traces/CAP-02-04-opc-observation-b78-v08.json) → [32独立预期样例](opc-observation-b78-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0204_opc_observation_b78_v08.cjs) → [执行分级](../../../tracking/cap0204-opc-observation-b78-verification-2026-11-01.json)。本轮仅**相同judge函数32/32规划合成一致**，没有独立Node文件执行、真实OPC数据、夹具受力、D13–D16、B5/OEM或17真实消费者验收，Owner正式签署0/17、L3待人审，全仓GFM AST/历史原件仍未闭。**规划PASS≠产品PASS。**
