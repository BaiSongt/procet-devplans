# B111｜CAP-03-07 共享拓扑边与周期缝、多面非流形分离（2026-11-02）

范围：V0.8原11域88CAP、36原编号工作包。L1/L2不变、L3待人工批准。本报告是新编研究及设计证据，不是工程产品测试。

## 研究发现

OCCT 8.0.1中，TopExp::MapShapesAndAncestors不自动清空输入Map；MapShapesAndUniqueAncestors允许按Orientation选项去重。共享边的原始edge incidence计数与独立Face数量不是同一事实。BRepTools::IsReallyClosed在同Face中检查同一Edge两次出现后检IsClosed；周期曲面seam的rawIncidences=2可以仅对应1个Face。不能将两次引用误判两张Face共边。

TopoDS_Shape::IsPartner只要求同TShape，IsSame还要同Location，IsEqual再要求同Orientation；TopTools默认ShapeMapHasher忽略方向。几何坐标相同、mesh靠近、IsPartner返回真，均不足单独证明同一装配实例的同一个TopoDS边。运行时shape identity也不能充当D01跨revision持久身份。

| 独立Face数/原始Edge引用 | 设计输出 | 不能做的事 |
|---|---|---|
| 2 / 2，证据齐全 | CANDIDATE_ONLY | 不能自动写已确认D02、D05工艺顺序 |
| 1 / 2，验证为seam | SELF_SEAM_ONLY | 不能误报两Face邻接 |
| 1 / 1，自由边 | BOUNDARY_ONLY | 不能伪造二元共享关系 |
| 3+ / 3+，非流形 | NONMANIFOLD_UNKNOWN | 不能拆分为确定双面关系 |
| 几何同位但非同TopoDS边 | NO_SHARED_EDGE | 不能用可视网格相交替代拓扑证明 |
| 输入或关联来源未知 | UNKNOWN或STALE | 不能把缺证当假/真通过 |

上述状态机是规划合成分类器，依赖人工指定的seam/退化/唯一Face事实，并未调用OCCT读取真实B-Rep。真正的Solid合法性、材料侧和加工可用性仍需独立几何Oracle；IsClosed(shell)无自由边不能证明工件可加工。

## Owner端口、数据及失效

03域D02唯一关系Owner候选接收来自D01的 {assetId,revision,contentHash,occurrencePath,frameId,topologySnapshotHash,kernelVersion} 和06域只读 {edgeExactRef,rawFaceIncidences:[faceExactRef,orientation,location],uniqueAncestorFaceRefs,seamEvidence,freeBoundEvidence,nonManifoldEvidence,algorithmVersion,sourceRefs,scopeEpoch,unknownReason}。跨实例或旧Hash为STALE；没证据为UNKNOWN。03域仅在CAS+ACL+exact frame/revision/hash/ScopeEpoch/取消Fence重验后才能采纳并发布D02修订，晚回执不能覆盖新头。A/B同一源事实，D08既有冻结不能越权更写；D04名义Setup不同于D10实际机床绑定。

原工作包 B0-02（数据Owner基线）、F1-03（消费许可面）、F1-04（输入资格/探索分离）、T5-02（合法样件与正反场景）分别承担审查与待实施条目。05域D05必须独立复核工序语义，06域候选不授予正式制造验证资格。

## GUI、Graph及迁移

GUI/CLI/Agent使用同一03域Owner服务。唯一Babylon Engine/Scene/Canvas及左侧UnifiedTaskPanel；Graph可以展开整个工作区但不可新建第二3D世界。显示Edge的真实Face实例、Orientation、seam回边、多面非流形UNKNOWN，近邻虚线与可信共边实线区分；仅浅/深主题、最大12px。旧资料按Expand→Migrate→Contract添加字段和旧Reader兼容/回滚，不对已批准D08/D16做静默覆盖。

## 来源→规则→字段→CAP/包→验收

[7条作者/版本/访问日期/阅读深度与限制](../../../research/sources/CAP-03-07-edge-incidence-b111.json) → [8条规则字段、CAP及原包](../../../research/traces/CAP-03-07-edge-incidence-b111-v08.json) → [32项带独立ID的正反/UNKNOWN/STALE](edge-incidence-b111-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0307_edge_incidence_b111_v08.cjs) → [验证等级](../../../tracking/cap0307-edge-incidence-b111-verification-2026-11-02.json)。OCCT 8.0.1六份公开API页面指定方法读取于2026-11-02；页面无独立发布日期。第七条为GitHub固定原CAP业务规格，CAS/GUI/Owner来自Procet内生需求而非外部标准。没有编造未读ISO条款。

## 工程验证分界

本次仅V8内同判定函数32/32规划合成预检。独立Node整文件、真实OCCT/STEP、真实D02与D05独立消费者、Owner正式签署0/17、L3、全仓GFM AST、历史附件原始字节均NOT_RUN/PENDING。保留中立CL→D12 NC后处理→D13独立执行语义→D14轴时序→D15独立验证→D16受控发布，未知语义UNKNOWN，CL预览不可冒充NC工程资格；不做材料扫掠仿真。**规划PASS≠产品PASS。**
