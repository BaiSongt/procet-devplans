# CAP-04-05｜多Setup与转序（V0.8详细实施规划）

**原88项CAP的04域第05项；2026-10-19新增规划。L1/L2不变；L3待人工评审，产品与独立消费者均NOT_RUN。**

导航：[五任务界面](UI.md) · [八项来源及阅读边界](../../../research/sources/CAP-04-05.json) · [十规则映射](../../../research/traces/CAP-04-05.json) · [二十正反验收](fixtures.json) · [合成转序算例](transfer-examples.json) · [研究专题](../../../research/topics/R-MSET-001.md)。

## 1. 业务目标与范围
本项解决**同一CAD零件在多个Setup之间翻面、重装夹、工序转接、材料状态与基准继承**的问题。用户在Setup任务区可以直接切换和新增第二序、第三序，不再退回特征识别才能回到工艺规划。业务Owner为04域D04（工艺Setup与毛坯）且仅04域可提交转序图修订；03域D01/D02提供设计、PMI及特征exact引用，02域D03提供可用夹具资源，05域D05/D08持有工序/冻结决策，06域D07给出材料状态证据。下游D09刀路、D10执行配置和NC验证仅消费快照，不共同写D04。

**多Setup不是将G54依次改为G55，也不等于D10机床执行设置。** 本项只决定名义工艺Setup、翻面关系、转序次序与责任交接。前置CAP-04-04具名FrameGraph当前为待入库待审规划，不假定它已产品实现；若缺此能力，返回FRAME_GRAPH_NOT_READY而非猜测变换。联系CAP-04-01/02/03/04/06与F1-02、F1-04、W2-05、E3-04、U4-02原工作包，不新增编号或扩张36项分母。

## 2. 业务数据及Owner
建议L3候选：
- SetupSequenceSnapshot = {projectId,documentInstanceId,cadExactRef,setupSequenceId,revision,contentHash,scopeEpoch,stageNodes,stageEdges,authoringOrigin,sourceRefs}。
- StageNode = {stageId,setupExactRef:{id,revision,contentHash,frame},fixtureInstanceExactRefs,frameGraphExactRef,partPoseRef,stockStateExactRef,entryMaterialExactRef,exitMaterialExactRef,datumEvidenceRefs,stageApproval,classification}。
- StageEdge = {predecessorStageId,successorStageId,reason,featurePrecedenceRefs,datumContinuityEvidence,materialTransferPolicy,oldNewDependencyHashes}。
- TransferProposal = {requestId,scopeEpoch,expectedSequenceRevision,expectedD04Hashes,stageEdits,frameConversions,unresolvedEvidence,affectedConsumers,approvalFingerprint}。
- CommitTransferReceipt = {newD04Revision,newD04ContentHash,changedStageIds,invalidationManifest,receiptId,transactionId}。

上述字段是04域候选契约，不是已冻结schema。**exactRef同时固定标识、revision、contentHash、所在Frame与实例路径**，不可仅凭零件名称/shapeHash或文件名匹配不同occurrence。公共C0仅保留作用域、修订、单位、Frame、身份、协议；材料递推、工序顺序和夹紧证据留在对应Owner。D04若记录前序几何结果只保存D07 exact引用，不自行覆盖D07数据。

## 3. 状态流转（单机3轴与五轴适用的有限MVP）
1. Read：锁定工程、文档实例、D01修订、Setup-A和已有D04 sequence revision。检查工件ID、材料/单位/Frame。多个已存在Setup必须直接可选；无有效源时显示UNKNOWN、允许只读。
2. Add：添加Setup-B（或C），选翻面/重装夹/同位置再加工类型。每个Stage使用稳定唯一stageId与独立fixture instance；继承的是精确设计来源和受控关系，不是上序测量或夹紧力结论。
3. Orient：引用CAP-04-04 FrameGraph求T_S2_P与T_S1_P，合成T_S2_S1 = T_S2_P·(T_S1_P)^-1；禁止镜像、缩放和未声明单位。自动落座/对中只生成幂等候选，重复点击不累计平移、不自动改毛坯尺寸。
4. Transfer：引用前序D07的确切材料状态/工序输出作为下一序候选输入。D07缺失或多个顺序分支无法唯一确定时标MATERIAL_HANDOFF_UNKNOWN，不能伪造扫掠/材料去除结果，也不能默认未经加工的CAD即真实在制品。
5. Sequence：建立先后有向无环图，登记关键PMI公差、制造特征访问方向和夹具变更。允许人类重排候选，但必须保留冲突的因果关系与被人工否决的依据；多Setup不能自动合并D08冻结工序。
6. Review：统一展示旧/新StageGraph差异、缺证、D05/D06/D07/D09/D10失效清单、已有D08冻结及D16发布阻断。静态几何检查仅能说明有限几何关系，不能宣称D15机床工程验证。
7. Commit：GUI/CLI/Agent复用04域服务port；Host在提交时重新核对权限、scopeEpoch、expectedRevision、依赖哈希及审批，CAS原子生成D04新修订。取消、离开工程、切Setup后的迟到回执丢弃；CAS冲突保留候选不偷改。
8. Propagate：依据确切依赖标记消费者stale。D08旧冻结成果和D16历史发布绝不被覆盖；D10的执行配置需独立重新配对后，由中立D09 CL→D12 NC后处理→D13执行语义→D14轴时序→D15工程验证→D16发布，未知控制器指令标UNKNOWN。本项**不做材料扫掠仿真**。

## 4. 模块边界、端口与失败治理
候选领域端口 MultiSetupPort：readSequence(exactRef)、proposeStage(command)、proposeTransfer(command)、validateFrameAndPrecedence(proposal)、previewImpact(proposal)、commitTransfer(command,CAS)、cancelPending(requestId,scopeEpoch)、readSnapshot(exactRef)、proposeLegacyMigration(rawRef)。RendererPort只负责单Babylon世界的3D选择/预览，禁止写领域快照；A/B探索共享工程事实但分别保留proposal和冻结D08对象，接管须生成显式审查记录。

主要错误：STAGE_IDENTITY_SCOPE_CONFLICT、NON_RIGID_OR_UNKNOWN_FRAME、MATERIAL_HANDOFF_UNKNOWN、REFIXTURE_EVIDENCE_MISSING、SETUP_PRECEDENCE_CYCLE、PROCESS_EXECUTION_BOUNDARY_BROKEN、STALE_SCOPE_OR_CAS、PERMISSION_REVOKED、FROZEN_OR_PUBLISHED_OVERWRITE、LEGACY_OR_NC_SEMANTIC_UNKNOWN。旧schema缺阶段顺序、坐标方向或材料来源的记录只读保留legacyRaw，逐项补证形成迁移proposal与rollbackRef，不能默认identity或用临时渲染坐标补齐。

## 5. 独立消费者与验收责任
03域核CAD occurrence、PMI相依及旧数据不变；04域Host/Setup核CAS权限、Frame、stage DAG；05域核工序重排和冻结不被覆盖；06域核真实有序材料状态exact引用；07域核CL作废与重生成；08域核NC变更和D13控制器未知语义不可误过；09域核D14轴时序与D15覆盖并证明不是CL动画；10域核发布快照闭包。每个消费者应记录**代码exact HEAD、D04/D07/D10修订/哈希/Frame、失败注入入口、正反判定和实际回执**。此文件的20个场景目前全为验收规格，不能视为真实执行。

## 6. 可核验规则矩阵
| 规则 | 工程门禁 | 关键字段 | 来源 | 正反验收 |
|---|---|---|---|---|
| MSET-R01 | 多个Setup有不同stageId、唯一作用域和不可变身份 | setupId, stageId, documentInstanceId | SRC-MSET-006, SRC-MSET-007 | CAP-04-05-T01 / CAP-04-05-T02 |
| MSET-R02 | 转序必须携带具名刚体变换，禁止在渲染空间偷偷改轴 | T_S2_P, T_S1_P, frameGraphExactRef | SRC-MSET-001, SRC-MSET-003 | CAP-04-05-T03 / CAP-04-05-T04 |
| MSET-R03 | 下一序毛坯状态须由上序精确几何状态证据显式交接 | previousMaterialStateExactRef, nextInputStockStateRef, materialEvidenceStatus | SRC-MSET-006, SRC-MSET-007 | CAP-04-05-T05 / CAP-04-05-T06 |
| MSET-R04 | 翻面重装夹独立建立定位与夹具实例，设计datum不冒充实测接触 | fixtureInstanceRef, datumExactRef, contactEvidenceRef | SRC-MSET-002, SRC-MSET-007 | CAP-04-05-T07 / CAP-04-05-T08 |
| MSET-R05 | 工序转序遵守precedence DAG、先后关系和关键公差关联 | stageEdges, featurePrecedenceRefs, datumContinuityEvidence | SRC-MSET-006, SRC-MSET-007 | CAP-04-05-T09 / CAP-04-05-T10 |
| MSET-R06 | 工艺Setup保持机床中立，G54/G55只能由D10及控制器策略产生 | processSetupExactRef, machineExecutionBindingExactRef, controllerDialectStatus | SRC-MSET-001, SRC-MSET-004, SRC-MSET-005 | CAP-04-05-T11 / CAP-04-05-T12 |
| MSET-R07 | GUI/CLI/Agent用同一个04域受管端口，3D和任务区不重复 | domainPortCommand, scopeEpoch, previewLeaseRef | SRC-MSET-008, SRC-MSET-007 | CAP-04-05-T13 / CAP-04-05-T14 |
| MSET-R08 | 提交执行Host权限重验和CAS，取消/撤权后的晚回执弃置 | expectedRevision, dependencyHashes, scopeEpoch | SRC-MSET-008, SRC-MSET-006 | CAP-04-05-T15 / CAP-04-05-T16 |
| MSET-R09 | 变更逐exact依赖失效且不覆盖已冻结D08/已发布D16 | changeImpact, frozenProcessRefs, publishedReleaseRefs | SRC-MSET-006, SRC-MSET-008 | CAP-04-05-T17 / CAP-04-05-T18 |
| MSET-R10 | 旧多Setup数据未知坐标/顺序必须只读迁移，NC未知语义不通过 | legacyRawRef, migrationProposalRef, unknownSemantics | SRC-MSET-003, SRC-MSET-005, SRC-MSET-008 | CAP-04-05-T19 / CAP-04-05-T20 |

## 7. 限制与交接
研究只采用合法公开ISO目录、LinuxCNC章节、OCCT 8.0.1 API、NIST出版摘要与Springer开放正文的实际阅读部分，具体深度见registry；不会编造付费标准条款。合成180度翻面验证矩阵乘序与反解，不证明机床装夹、实际测量公差或刀路安全。Python规划校验脚本是文档检查入口，**产品Rust/TS/OCCT、Windows、Babylon、实际NC与实机测试NOT_RUN；L3待审批**。
