# B158｜D07局部去料体积账本及几何真值独立资格

2026-11-04；CAP-06-03／原F1-05、W2-02、W2-03、W2-06；**新编补证 NEWLY_AUTHORED，L3待审，规划PASS≠产品PASS。**

## 新证据缺口
原CAP已经有局部CUT/COMMON/FUSE及B87 Fuzzy。**OCCT VolumeProperties算出的体积不等于已证明有效的实体、保护区无损或下游NC工程PASS。**[OCCT 8.0.1 BRepGProp官方API](https://occt3d.com/dev/doc/refman/html/class_b_rep_g_prop.html)明确提醒：有限闭合实体、一致定向前提不由算法检查；`OnlyClosed`、`SkipShared`、`UseTriangulation`改变积分语义；`Eps>0.001`存在非自适应分支。必须在积分前验证形状合格、单位和Frame一致以及共享实例去重策略，不能用网格包围盒或负质量掩盖错误。

## 数学和边界
对单Setup中第i个有序工序：`S_before`来自前一步确切D07 B-Rep；`R_i=S_before∩ToolRemoval_i`是**实际相交去料体**，`S_after=S_before\\ToolRemoval_i`。在三个体均是同单位、Frame下的有效封闭实体时，可对账`|V_before−V_removed−V_after|≤B_ledger`。候选ToolRemoval体积不等于与当前材料的交集体积；同一刀路可能伸出毛坯、穿过已有空腔或与旧工序去料体重叠。对多Solid、岛屿和有空腔的零件，**体积相等只是必要证据之一，不能证明空间包含或局部形状正确**。每步还需独立OCCT Checker/保护区交集Oracle及来源哈希。

数值账本记录`OCCT版本、OnlyClosed、SkipShared、UseTriangulation、Eps、估计积分误差、获证的绝对误差预算来源、mm³单位、三体分项、残差与判定`。不把Eps直接当全局真实误差保证；误差预算缺失必须UNKNOWN。Fixture中的`1000−200−800=0mm³`和`0.05mm³`门槛只是虚构标量测试，非生产允差。

## 依据、真实访问范围
[OCCT 8.0.1 BRepGProp](https://occt3d.com/dev/doc/refman/html/class_b_rep_g_prop.html) 的`VolumeProperties`重载正文、[BRepCheck_Analyzer](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html)的`IsValid/SetExactMethod`、[BRepAlgoAPI_Cut](https://occt3d.com/dev/doc/refman/html/class_b_rep_algo_a_p_i___cut.html)的`HasErrors/HasWarnings/History`均已定点实读；ExactMethod只影响特定边检查。Lubell/Hartman/Cheney的[NISTIR 7796](https://www.nist.gov/publications/mbe-standardization-and-validation)（2011-07-06）**仅阅读官方书目摘要**，不虚构标准条款或验证结论。原[CAP-06-03固定HEAD](https://github.com/BaiSongt/procet-devplans/blob/d023e800d3f0c3c27682ee315180b92f9c330c67/docs/capabilities/CAP-06-03/README.md)为内生业务目标；来源的作者/版本/URL/章节/局限见[登记](../../../research/sources/CAP-06-03-volume-ledger-b158.json)。

## 数据合同和Owner
06域D06/D07是材料计算结果的唯一写Owner；D01、D04、D03均以scope/id/revision/hash/frame/unit精确引用；C0仅通用身份/Frame/单位协议，不接管数值算法。D07VolumeLedgerCandidate包括`sourceD07Exact,setupId,booleanReport,shapeValidity,orientation,occtOptions,volumePolicy,volumeBefore,volumeIntersectRemoved,volumeAfter,ledgerResidual,independentOracleRef,ownerReceipt,status`。状态`CANDIDATE→CHECK_PENDING→QUALIFIED_FOR_D07_REVIEW`，不可冒充D15_PASS；没有完整误差/几何证明则UNKNOWN，有明确矛盾则REJECT。

GUI、CLI、Agent通过同一`D07LedgerPort.preview/inspect/commitCAS`，单Babylon世界，左侧统一TaskPanel的体积账本逐工序对齐before/removed/after和数值来源，3D仅高亮候选，不能提交。Owner提交时重验ACL、CAS、scopeEpoch、taskGeneration和取消Fence，旧Scope晚ACK不得采纳。源变更局部失效D07→D09及下游，冻结D08与A/B共享事实不覆盖；旧schema先双读/只读UNKNOWN、expand→migrate→contract保留raw和回退。D04名义Setup与D10实际执行绑定分离，D09中立CL→D12最终NC→D13解释→D14轴时序→D15独立验证→D16发布；CL动画不能代替NC验证，不做材料扫掠仿真。

## 机器追踪与独立验收
[10规则40字段/原四包](../../../research/traces/CAP-06-03-volume-ledger-b158-v08.json) → [10正40独立单字段反+8数学Golden](volume-ledger-b158-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0603_volume_ledger_b158_v08.cjs) → [验证等级](../../../tracking/cap0603-volume-ledger-b158-verification-2026-11-04.json)。真实D07独立消费者必须在**另一进程**打开序列化BREP，对12类含薄壁、多Solid、空腔、岛屿、开Shell、反面、共享形体重复及保护区情况重做积分和空间检查；检查D09/NC链的exact来源与状态失效。正式Owner签署0/17、真实消费者0/17；真实OCCT、Node独立完整文件进程、B5/OEM、L3、全仓GFM AST、历史附件原始字节均NOT_RUN。
