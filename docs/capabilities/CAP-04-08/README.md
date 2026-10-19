# CAP-04-08｜装夹影响检查（V0.8详细实施规划）
**基线定位：04域第08项，原业务定义为“调整引发的规划/求解/刀路失效分析”。规划编制2026-10-20。L1/L2不变，L3待人工评审；规划PASS≠产品PASS。**
导航：[五任务界面](UI.md) · [7个合法来源](../../../research/sources/CAP-04-08.json) · [10条规则追踪](../../../research/traces/CAP-04-08.json) · [20项正反验收](fixtures.json) · [影响矩阵](impact-matrix.json) · [研究边界](../../../research/topics/R-FIMP-001.md)。

## 1 业务目标与不做什么
当用户改变夹具实例、夹紧保护区、毛坯定位或Setup pose时，系统应回答：**改变了什么、影响哪些工艺/求解/刀路/执行/发布对象、哪些证据仍然有效、哪些结论必须重新算或复审**。D04独占名义装夹状态写入；D03提供夹具资源只读精确版本；D05持有工艺决策与D08冻结；D06/D07是求解及有序材料结果Owner；D09是中立CL Owner；D10仍是机床执行绑定，D12-15构成NC验证链，D16为发布Owner。任何域不得替另一个域覆盖修订。
本项仅提供**静态几何/保护区的受限预筛与精确依赖失效分析**，不做真实夹紧力与变形校核、不做刀具/机床动态扫掠、不做材料扫掠仿真；未知检查一律UNKNOWN。**近似bbox阴性只能表示该bbox策略下的候选排除，不能当作所有几何/控制器的无碰撞证明**。OCCT最短距离=0也不能独立区分穿透和接触；需结合有效B-Rep、布尔相交和公差配置，在算法失败时UNKNOWN。
## 2 业务契约与精确版本
候选L3模型（未冻结）：
- FixtureImpactRequest = {requestId,projectId,documentInstanceId,setupExactRef:{id,revision,contentHash,frame,occurrencePath},cadOccurrenceExactRef,fixtureInstanceExactRef,fixtureAssetExactRef,oldD04ExactRef,newProposalHash,scopeEpoch,actorEntry,checkPolicyVersion}。
- StaticCheckEvidence = {operandExactRefs,sourceFrames,conversionChain,unit,representationQuality,brepValidity,method,algorithmVersion,tolerancePolicy,distResult,intersectionStatus,coverage,confidenceStatus,diagnosticRefs}。
- DependencyImpactManifest = {oldDependencyGraphHash,newProposalHash,changedOwnerFacts,exactConsumerEdges,affectedRefs,unaffectedRefs,needsRevalidation,unknownReasons,prohibitedOverwrites,generatedAtRevision}。
- FixtureChangeCommitReceipt = {newD04Revision,newD04ContentHash,impactManifestHash,scopeEpoch,requestId,transactionId,rollbackRef}。
- ConsumerAck = {consumerDomain,consumerExactHEAD,assetExactRevisionHashFrame,positiveNegativeTestIDs,result,evidenceLocation,unknownCoverage}。
Frame不是Babylon renderer坐标；零件名、资源显示名、当前目录latest版本、单一shapeHash均不能替代**工程+实例路径+修订+哈希+Frame**的复合identity。旧schema若缺Frame/质量/来源，只读隔离，生成migrationProposal，不默认identity。C0只放身份、修订、作用域、单位、Frame和受管端口，不把全域影响矩阵做成巨型common。
## 3 业务步骤及交付判定
1. **Read**：锁定工程/Setup/D04 revision与D03资源hash，读取D01 occurrence和保护区快照，辨别A/B工作模式。历史D08冻结与D16发布标只读。
2. **Change**：用户在统一左侧TaskPanel中拖动/输入偏移/选择已发布夹具实例。3D中仅产生ghost/preview lease；自动对中与落座独立操作且幂等，不自动扩展毛坯尺寸。所有输入保存新旧Frame、单位及身份。
3. **StaticCheck**：先做B-Rep合法性和坐标/单位门禁，再做宽相筛选与OCCT精确距离/交集。报告可检测的几何对、间隙/相交/未知和算法版本/容差；非Solid、容差含糊、内部穿透歧义或未计算成功必须标UNKNOWN。不作工件刚度与动态碰撞承诺。
4. **Impact**：依据资产Owner已经登记的exact dependency edge求变更集与增量失效闭包；无边的对象保持有效。将D05工序约束、D06求解候选、D07材料结果、D09 CL避让、D10绑定、D11 CL预验证、D12 NC、D13控制器模态、D14轴时序、D15工程证据及D16发布分别标current/stale/unknown，展示原因；**不误写D08/D16旧修订**。
5. **Review**：同时列静态结果、可追溯的已影响/无关边、冻结/发布风险、待独立验证责任。用户可以选择保留候选、撤销或提交新的装夹修订。A/B共享工程事实，但A新候选不得覆盖B冻结基线，接管须显式审查。
6. **Commit**：GUI/CLI/Agent一律调用受管FixtureImpactPort；Host重验权限、scopeEpoch、expected revision/hash、依赖图CAS及审批指纹。取消后迟到回执丢弃、撤权后拒绝。仅D04持久化新revision与manifest，消费者各自基于exact引用重新生成，不允许交叉Owner写入。
7. **Downstream**：需要机床验证的应遵守中立D09 CL→D12后处理NC→D13实际控制器执行语义→D14轴运动时序→D15工程检查→D16审批发布；D11/CL动画或静态预览不冒充D15。未建模控制器指令一律UNKNOWN，不得强制PASS。
## 4 模块和端口
候选FixtureImpactPort：readFixtureSnapshot(exactRef)、createChangeProposal(command)、runStaticEvidence(proposal,policy)、computeExactImpact(proposal,dependencyGraph)、previewImpact(manifest,scopeEpoch)、commitChange(expectedRevision,dependencyHashes,approval,CAS)、cancel(requestId,scopeEpoch)、proposeLegacyMigration(rawRef)、readConsumerEvidence(exactRef)。预览不得提交；RendererPort只使用现有唯一Babylon世界。统一左TaskPanel、Ribbon和消息中心按同一领域状态展示；切工程/切Setup均废弃旧scopeEpoch。
错误：STALE_OR_CROSS_SCOPE_REFERENCE、GEOMETRY_QUALITY_UNKNOWN、STATIC_INTERFERENCE_UNKNOWN、PROTECTION_OR_COVERAGE_GAP、IMPACT_GRAPH_INCONSISTENT、FROZEN_OR_RELEASE_OVERWRITE、DOMAIN_ENTRY_BYPASS、STALE_SCOPE_PERMISSION_OR_CAS、NC_ENGINEERING_EVIDENCE_MISSING、LEGACY_EVIDENCE_OR_CONSUMER_MISSING。失败保留原D04和可审计proposal，禁止静默覆盖。
## 5 原工作包与独立验收
仅映射原编号F1-02/F1-04/W2-05/E3-04/U4-02；不新增第37工作包。04域验本地CAS与坐标/夹具；05域独立消费工序/冻结证据；06域独立对拍solver/material精确依赖；07域验CL作废清单；08域验NC/解释器版本；09域独立检查D13→D14→D15覆盖边界；10域验发布历史不变。交付消费端报告需含产品exact HEAD、资源/Setup/NC真实revision/hash/Frame和正反场景执行结果，不能从本规划静态校验继承PASS。
## 6 10规则与20场景
- **FIMP-R01** 固定装夹影响检查的工程/文档/Setup作用域及D04、资源和CAD精确revision/hash/frame，不能用同名形状替代；字段：fixtureExactRef, setupExactRef, cadOccurrenceExactRef, dependencyHash, frameId；来源：SRC-FIMP-001, SRC-FIMP-006；正反：CAP-04-08-T01 / CAP-04-08-T02；拒绝码：STALE_OR_CROSS_SCOPE_REFERENCE。
- **FIMP-R02** 精确几何检查必须先确认B-Rep有效与表达质量，粗网格/包围盒只允许预筛；字段：brepValidity, representationQuality, fixtureBodyExactRef, partBodyExactRef；来源：SRC-FIMP-003, SRC-FIMP-002；正反：CAP-04-08-T03 / CAP-04-08-T04；拒绝码：GEOMETRY_QUALITY_UNKNOWN。
- **FIMP-R03** 静态实体的间隙、接触与体积相交必须区分算法证据和容差，计算失败显式UNKNOWN；字段：distanceResult, intersectionStatus, tolerancePolicy, contactClassification；来源：SRC-FIMP-002, SRC-FIMP-004, SRC-FIMP-003；正反：CAP-04-08-T05 / CAP-04-08-T06；拒绝码：STATIC_INTERFERENCE_UNKNOWN。
- **FIMP-R04** 保护区、夹紧点及刀具接近方向只能据已建模范围形成受限风险候选，不承诺动态全程安全；字段：protectedVolumeExactRef, accessDirection, toolAssemblyExactRef, checkCoverage；来源：SRC-FIMP-001, SRC-FIMP-002, SRC-FIMP-004；正反：CAP-04-08-T07 / CAP-04-08-T08；拒绝码：PROTECTION_OR_COVERAGE_GAP。
- **FIMP-R05** 以old/new exact依赖图区分改变项/受影响项/无关项，逐Owner产生原因可追溯的失效传播清单；字段：changeSet, consumerDependencyEdges, oldDependencyHash, newDependencyHash, impactManifest；来源：SRC-FIMP-005, SRC-FIMP-006；正反：CAP-04-08-T09 / CAP-04-08-T10；拒绝码：IMPACT_GRAPH_INCONSISTENT。
- **FIMP-R06** 失效重算不能覆盖D08冻结工艺或D16已发布记录，发布须新版本和审批闭包；字段：frozenProcessExactRef, publishedReleaseExactRef, supersedesRef, rollbackRef；来源：SRC-FIMP-005, SRC-FIMP-006；正反：CAP-04-08-T11 / CAP-04-08-T12；拒绝码：FROZEN_OR_RELEASE_OVERWRITE。
- **FIMP-R07** GUI/CLI/Agent统一经04域Host port执行预览与提交，单Babylon世界及统一左TaskPanel；字段：domainPortCommand, previewLease, selectedOccurrence, taskPanelScope；来源：SRC-FIMP-006, SRC-FIMP-007；正反：CAP-04-08-T13 / CAP-04-08-T14；拒绝码：DOMAIN_ENTRY_BYPASS。
- **FIMP-R08** 权限重验、scopeEpoch、依赖CAS与取消竞态构成单次提交门禁，晚回执不得改变活动工程；字段：expectedRevision, expectedDependencyHashes, scopeEpoch, requestId, commitReceipt；来源：SRC-FIMP-005, SRC-FIMP-006；正反：CAP-04-08-T15 / CAP-04-08-T16；拒绝码：STALE_SCOPE_PERMISSION_OR_CAS。
- **FIMP-R09** D04装夹影响为规划预筛，D10机床绑定独立，D09 CL动画不替代D12→D13→D14→D15 NC验证；字段：processSetupExactRef, machineExecutionExactRef, controllerSemanticCoverage, verificationGrade；来源：SRC-FIMP-007, SRC-FIMP-006；正反：CAP-04-08-T17 / CAP-04-08-T18；拒绝码：NC_ENGINEERING_EVIDENCE_MISSING。
- **FIMP-R10** 旧装夹文件缺Frame/资源版本时只读迁移，独立消费者正反验收含失败注入与回退入口；字段：legacyRawRef, migrationProposal, unknownSemantics, consumerEvidence, rollbackRef；来源：SRC-FIMP-003, SRC-FIMP-005, SRC-FIMP-006；正反：CAP-04-08-T19 / CAP-04-08-T20；拒绝码：LEGACY_EVIDENCE_OR_CONSUMER_MISSING。
## 7 研究、风险和交接
研究源见[登记](../../../research/sources/CAP-04-08.json)，ISO目录不等于标准全文、NIST出版页不等于论文全文，OCCT 8.0.1网页版本不代表产品实装版本；LinuxCNC不代表B5商业控制器。实验场景、Owner签署、Rust/TS/OCCT、GUI、NC与实机均待执行；本轮只做规划静态关联核验，L3需要人工审核。依赖CAP-04-06/07当前可能未入库；不得因此伪称执行绑定和刀具安装已产品完成。
