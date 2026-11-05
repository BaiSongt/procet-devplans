# CAP-03-03｜B145 Wire遍历完整性及累计方向的安全资格补证
**2026-11-04｜L3待审｜V0.8原编号**；原包 B0-02 / F1-03 / F1-04 / T5-02，不改变11域88 CAP与36包。

## 新研究发现
OCCT 8.0.1 的 `TopoDS_Iterator` 通过cumOri/cumLoc控制方向和位置累计；`TopExp`普通成员枚举**不是**有向连通Wire次序。OCCT的`BRepTools_WireExplorer`按连接探索，但在错误方向、分叉、断线等缺陷下**可能只返回部分Edge**，因此返回非空、遍历结束均不能当“线框完整”证明。另一方面，`TopExp::MapShapesAndAncestors`不会清空已有映射，复用缓存时应显式清空及记录生成代次。`TopoDS_Shape::IsPartner/IsSame/IsEqual`分别涉及TShape、Location、Orientation，不能当跨STEP/Occurrence永久身份。`BRepCheck_Wire`是候选独立几何检查入口，本轮**仅阅读API，未执行真实算法**。W3C PROV-O仅用于描述证据的派生，并未规定几何合法性。

## Owner数据/流程合同
D01 CAD Owner管理 `ExactTopologyRef{sourceRevision,sourceSha,snapshotHash,occurrencePath,frameRef}` 及 `WireTraversalEvidence{wireRef,faceRef,cumOri,cumLoc,memberEdgeOccurrences,visitedEdgeOccurrences,orderedEndpoints,algorithmVersion,checkStatus}`。Edge本体和有向出现须区分；多pcurve/seam需固定Face和UV语义，不能将普通Set去重结果宣称真实遍历正确。先冻结源和装配实例，再读取成员与遍历顺序，按有向端点、成员出现次数、分叉/断口、实际独立Wire检查闭包判断。无法解释的状态为UNKNOWN而非PASS；跨修订的形状指纹只是候选，不自动继承旧PMI/D02/D08批准。

GUI/CLI/Agent共用CAD领域Owner Port；单一Babylon Engine/Scene/Canvas和左UnifiedTaskPanel只渲染只读证据，预览不写权威。提交必须重验exact revision/hash/frame、ACL、scopeEpoch、CAS、cancelFence；撤权与晚回执失败不得重新激活旧请求，迁移需保留旧Reader/schema及A/B冻结事实。D04名义Setup与D10实际执行绑定隔离；D09中立CL→D11预检不等于D12最终NC→D13解释→D14轴时序→D15独立验证→D16发布；不做材料扫掠仿真。

## 来源→规则→字段→独立正反验收
- **B145-R01**：源修订/实例/Frame必须exact；字段`revisionExact`, `occurrencePathExact`, `snapshotHashExact`, `frameDirectionExact`；失败`UNKNOWN_SNAPSHOT`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R02**：方向与位置累计标志明确；字段`cumOriKnown`, `cumLocKnown`, `orientationComposed`, `locationComposed`；失败`UNKNOWN_TRAVERSAL_MODE`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R03**：成员枚举不代表连接顺序；字段`enumerationNotConnection`, `membershipDigest`, `localIdNotPermanent`, `orderingModePinned`；失败`UNKNOWN_EDGE_ORDER`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R04**：遍历必须覆盖成员集；字段`memberCount`, `visitedOccurrences`, `noSilentTruncation`, `defectsUnknown`；失败`UNKNOWN_INCOMPLETE_WIRE`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R05**：Face/UV上下文精确；字段`faceExact`, `faceExplorerIfNeeded`, `uvDirectionPinned`, `seamUnknownBlocked`；失败`UNKNOWN_FACE_CONTEXT`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R06**：有向连接与分叉多重边资格；字段`directedVertices`, `branchDetected`, `duplicateOccurrenceHandled`, `disconnectedRejected`；失败`UNKNOWN_CONNECTIVITY`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R07**：同TShape不等于跨修订同业务对象；字段`partnerSameEqualDistinct`, `revisionsSeparate`, `provenancePinned`, `noCrossFileAutoApproval`；失败`UNKNOWN_IDENTITY`，原包 B0-02/F1-03/F1-04/T5-02。
- **B145-R08**：同域Owner交易与NC验证资格；字段`guiCliAgentOwnerPort`, `singleBabylonLeftPanel`, `aclCasEpochCancelRecheck`, `d04D10AndClNcSeparated`；失败`REJECT_OWNER_COMMIT`，原包 B0-02/F1-03/F1-04/T5-02。
[7条分层来源](../../../research/sources/CAP-03-03-wire-traversal-b145.json) → [8规则与32个字段](../../../research/traces/CAP-03-03-wire-traversal-b145-v08.json) → [8正32单字段反+8图Golden](wire-traversal-b145-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0303_wire_traversal_b145_v08.cjs)。

八个Golden仅使用A→B→C→A教学有向图及缺成员、成员枚举乱序、端点断口、分叉、缺Face、未知cumOri和空Occurrence；**不包含真实OCCT、STEP、周期面Seam或机床安全认证**。S01–S05同属OCCT8.0.1一个开源工程的五个API页，不能算五篇独立论文，网页无明确单独发布日期；S06为W3C PROV-O 2013-04-30官方HTML引言/§2有限阅读；S07是固定Git Blob原CAP规范而非外部标准。未读任何收费标准正文。正式Owner签署0/17、独立消费者实际验收0/17，L3、历史附件原字节、全仓GFM AST、独立Node完整文件和真实OCCT/D15/OEM均待审/NOT_RUN。**规划PASS≠产品PASS。**