# B87｜CAP-06-03 OCCT Fuzzy、Glue前提与简化后拓扑来源
> 2026-11-01｜V0.8增量研究；L1/L2不变，L3待人类审批。**仅规划合成，不是OCCT运行或产品PASS。**

## 新增的可证伪工程问题
B23已补布尔Generated/Modified/IsDeleted谱系，B27已补体积必要条件和距离为零陷阱；本轮不重复二者，新增**三种可在真实产品中造成错误结果但静态历史/体积检查未必暴露的配置前提**。

1. **Fuzzy不是免费修复**。[S01、S03] OCCT 8.0.1用户指南定义它为用于处理实际缝隙或嵌入的附加容差，建议先测量缺口再选择数值。若某薄壁的最小功能尺寸为0.003mm，而候选fuzzy为0.002mm，则项目保守规则$2f\ge w$标记`UNKNOWN_THIN_WALL`；这只是本项目**合成警戒准则**，既不是OCCT报错阈值，也不是通用制造公差。禁止无测量依据逐步调大fuzzy直到布尔偶然成功。
2. **GlueShift/GlueFull有严格几何前提**。[S01] 官方明确Gluing仅适用于存在重合但**没有真实子形状相交**的特殊情况，并且库不会替调用者验证使用前提；错误开启可能给出错误结果。本规划以`GlueOff`为默认。存在真实相交直接拒绝；未能独立证明共面/重合则`UNKNOWN_GLUE_PRECONDITION`，不自动开启性能优化。
3. **SetNonDestructive(true)保护原始输入，不保护语义映射天然稳定**。[S01、S02、S04] 06域必须隔离Stock、原Part与候选去料体不可变字节；实际写入前后分别记录内容Hash，不以TopoDS指针/GUI拾取代理充当稳定身份。启用`SimplifyResult`会合并共切面/边并将简化历史合入操作历史；要追溯**最终**结果而非简化之前的中间TopoUID。多原面合一不得谎称单一唯一来源。
4. **警告不是错误，但也不是验收PASS**。[S03、S05] `HasErrors`、`HasWarnings`与`GetReport`独立采集；警告按本项目质量策略转`UNKNOWN_OCCT_WARNING`，要求复核而不擅自静默通过。即使没有警告，仍必须独立检查B-Rep闭合/保护区/体积与D07来源。
5. **研究适用边界**。NIST Han/Pratt/Regli（2000-07-01）只读官方摘要，覆盖特征识别路线，不给Fuzzy/Glue或薄壁数值阈值；不得将论文当成具体容差算法的认证。[S06]

## 业务数据、Owner与失效传播
- 源闭包：`D01(target) + D04(setup frame/unit) + D06(candidate) + D07(parent stock)` 的exact id/revision/contentHash/hashKind/frame/scope；既有已冻结D08字节不能被改。06域`LocalBRepRemovalDomainPort`唯一计算Owner，D02拓扑身份由03域拥有，D05/D08决策由05域持有。
- 计算证据DTO建议：`boolean.op/occtVersion/fuzzy/unit/measuredGap/minFeature/policyVersion/glue/realIntersection/coincidenceProof/nonDestructive/argumentHashBefore/argumentHashAfter/simplify/mergedHistory/hasErrors/hasWarnings/messageReportHash/checks/repairRevision`。这些字段属06域，不扩充C0为万能领域对象。
- `fuzzy`、`glue`、`nonDestructive`、`simplify`、Frame或OCCT版本变化，令受影响D07候选及依赖其证据的D05/D08派生候选、D09及后续**新**工艺结果STALE；冻结D08历史和无关Setup不可变。必须先影子计算对照，再经Owner版本化迁移；无法复现退回旧reader、原B-Rep字节与旧证据。
- GUI/CLI/Agent均只调用06域同一命令；单一Babylon Scene/Engine/Canvas，左UnifiedTaskPanel显示`fuzzy实测依据/厚度预算/Glue资格/History冲突/Errors/Warnings`；不可将3D网格高亮当成布尔证明。字体不超过12px，浅深主题可辨。
- Seal之后D07 Owner在提交点再次检查ACL/ScopeEpoch、expectedHead-CAS、任务Generation及Cancelled；取消后迟到ACK只供审计。A/B只读同一冻结事实、不互相覆写。D04 Setup不等于D10 ExecutionBinding。
- 资格链：D09中立CL→D12最终NC后处理→D13控制器执行语义→D14轴时序→D15工程验证→D16发布。D11/CL动画不能代替D15，D13未知为`UNKNOWN`并阻断D16，不开展材料扫掠仿真。

## 来源→规则→字段→原包→正反验收
[7项分级来源](../../../research/sources/CAP-06-03-fuzzy-b87.json) → [8条可机器检查规则及F1-05/W2-02/W2-03/W2-06](../../../research/traces/CAP-06-03-fuzzy-b87-v08.json) → [32个手写独立预期、含REJECT/UNKNOWN的合成样例](fuzzy-b87-fixtures-v08.json) → [只读Node验收入口](../../../tools/check_cap0603_fuzzy_b87_v08.cjs) → [证据等级](../../../tracking/cap0603-fuzzy-b87-verification-2026-11-01.json)。

**可复现**：`node tools/check_cap0603_fuzzy_b87_v08.cjs --self-test`。本轮在连接器V8中以同一判定函数预检32/32，8个单字段故障注入均产生不同判定；完整仓库的独立Node文件进程、实际OCCT8.0.1/版本锁、STEP、异内核独立消费者、产品ACL/NC/B5/OEM均为`NOT_RUN`。合成`PASS_SYNTHETIC_ONLY`不允许提升17资产Owner正式签署或独立消费者计数。

## 分级来源与实际阅读
- **F87-S01** Open CASCADE Technology documentation contributors，Boolean Operations（官方用户指南），版本/日期：OCCT 8.0.1 online / page_date_not_specified；2026-11-01访问，[URL](https://occt3d.com/dev/doc/overview/html/specification__boolean_operations.html)；范围：Fuzzy Option; Gluing Operation; Safe processing mode; Result simplification; Errors and warnings; History；深度：PUBLIC_SELECTED_HTML_BODY；局限：示例说明容差/贴合与加速的适用前提，不保证任意航空薄壁零件成功；文档没有给出Procet通用fuzzy值。
- **F87-S02** Open CASCADE Technology documentation contributors，BRepAlgoAPI_BuilderAlgo API，版本/日期：OCCT 8.0.1 / page_date_not_specified；2026-11-01访问，[URL](https://occt3d.com/dev/doc/refman/html/class_b_rep_algo_a_p_i___builder_algo.html)；范围：SetNonDestructive/SetGlue/SetCheckInverted/SimplifyResult/SetToFillHistory/HasHistory/History；深度：PUBLIC_SELECTED_API_BODY；局限：明确非破坏和简化后的历史融合API，不证明运行结果或历史天然稳定。
- **F87-S03** Open CASCADE Technology documentation contributors，BOPAlgo_Options API，版本/日期：OCCT 8.0.1 / page_date_not_specified；2026-11-01访问，[URL](https://occt3d.com/dev/doc/refman/html/class_b_o_p_algo___options.html)；范围：SetFuzzyValue; HasErrors; HasWarnings; GetReport; SetRunParallel/SetUseOBB；深度：PUBLIC_SELECTED_API_BODY；局限：fuzzy为附加容差；错误和警告必须区分，不表明任何单一选项足以认证实体正确。
- **F87-S04** Open CASCADE Technology documentation contributors，BRepTools_History API，版本/日期：OCCT 8.0.1 / page_date_not_specified；2026-11-01访问，[URL](https://occt3d.com/dev/doc/refman/html/class_b_rep_tools___history.html)；范围：Generated/Modified/Removed; Merge; vertex/edge/face/solid; history relation examples；深度：PUBLIC_SELECTED_API_BODY；局限：TopoDS历史是关系图，不等于可跨文件直接复用内存ID或唯一上游归属。
- **F87-S05** Open CASCADE Technology documentation contributors，BRepAlgoAPI_BooleanOperation API，版本/日期：OCCT 8.0.1 / page_date_not_specified；2026-11-01访问，[URL](https://occt3d.com/dev/doc/refman/html/class_b_rep_algo_a_p_i___boolean_operation.html)；范围：CUT/FUSE/COMMON; valid arguments; Build; Shape; HasErrors/Warnings；深度：PUBLIC_SELECTED_API_BODY；局限：仅公开API文本；未执行OCCT真实Boolean，API成功并非保护区合格证明。
- **F87-S06** Jung-Hyun Han; Mike Pratt; William Regli，Manufacturing Feature Recognition from Solid Models: A Status Report，版本/日期：IEEE Transactions on Robotics and Automation (2000); NIST publication page / 2000-07-01；2026-11-01访问，[URL](https://www.nist.gov/publications/manufacturing-feature-recognition-solid-models-status-report)；范围：NIST publication abstract: graph-based, volumetric decomposition, hint-based geometric reasoning；深度：OFFICIAL_ABSTRACT_ONLY；局限：没有阅读全文，不援引其具体算法参数或作为OCCT fuzzy/glue算法认证。
- **F87-S07** BaiSongt/procet-devplans planning team，CAP-06-03固定业务规格及B23布尔历史补证，版本/日期：Git Blobs 3bd434372486cd0c08904a8f71e50f5362abd721 / 9895079f01b9684ac1bb9f4c964a625a31723ae3 at 0f86ab02f4d7c14d075a0e20f3e335fda10fd4b1 / 2026-10-29/2026-11-01；2026-11-01访问，[URL](https://github.com/BaiSongt/procet-devplans/blob/0f86ab02f4d7c14d075a0e20f3e335fda10fd4b1/docs/capabilities/CAP-06-03/README.md)；范围：L0–L7与B23§核心防误判/历史映射/回退；深度：INTERNAL_EXACT_GITHUB_BLOB_FULL_READ；局限：内生业务Owner/CAS/单Babylon/CL与NC分层，不归因于OCCT/NIST；不代表真实产品验证。

## 独立产品消费者待办
固定至少近切微隙、窄薄壁、真实面交、仅部分共面、完全重合、多环岛屿、双Solid、ShapeFix后简化、含警告/错误、并行与非并行对照。通过真实OCCT锁版二进制和隔离的STEP/B-Rep固定字节，分别记录`GlueOff`与有认证证据的`GlueShift/Full`、不同fuzzy的差异、输入Hash、最终TopoUID映射和警告、回退结果。由独立消费者复算保护区/体积/特征身份并提供自身进程、Git及二进制Hash、退出码、日志、签字；失败为FAIL/UNKNOWN不伪PASS。**规划PASS≠产品PASS。**
