# B103｜CAP-03-04 AP242版次与Datum Target覆盖资格专项补证

2026-11-02｜**NEWLY_AUTHORED规划证据**，原关联包B0-02/F1-03/F1-04/T5-02；不变更11域88 CAP、36原编号包、17资产及L1/L2；L3待人审。研究父HEAD `e819076828a325511e19dacbd4765221c4826526`。**规划PASS≠产品PASS。**

## 新增研究发现：STC全部通过也无法说明Datum Target互操作可用

NIST官方[Free CAD Models and STEP Files](https://www.nist.gov/ctl/smart-connected-systems-division/smart-connected-manufacturing-systems-group/mbe-pmi-0)明确：FTC/CTC属2015年结束的PMI验证项目，2023年推出的STC是FTC的简化版本，**删除包括全部datum targets在内的部分复杂PMI**。因此若把STC作为唯一Datum Target回归集，哪怕STC样件全部“PASS”，该语义维度仍应为`UNKNOWN_UNTESTED_DATUM_TARGET`而不是PASS。不能推断任意具体FTC一定包含Datum Target；必须逐文件核对实际STEP字节Hash、实体清单和期望语义。此处只读NIST网页，**没有下载样件或执行文件分析**。

## ISO与推荐实践的版次责任

[ISO 10303-242:2025](https://www.iso.org/standard/84300.html)官方公开目录显示**Edition 4、2025-08、Published**；[ISO 10303-242:2022](https://www.iso.org/standard/84667.html)是Edition 3、**Withdrawn**，目录指向2025版。旧2022 STEP模型可按历史版次受控接收，但不能假定等同于2025最新版或宣称已通过新版本覆盖；`originalFileSha256 / apEdition / producer / headerDeclaredPractice / readerSupportedEditionSet`必须锁定，缺来源为UNKNOWN。ISO收费正文未读，绝不虚构DATUM_TARGET实体编码、公差或强制条款。

[CAx-IF推荐实践归档](https://www.mbx-if.org/home/cax/recpractices/archive/)说明推荐实践适用版本通常在STEP Part21/XML头部，并列出AP242 PMI Representation & Presentation v4.1（2024-06-20）。本轮仅阅读合法版本表，不声称阅读PDF正文，不把当前v4.1静默覆盖存量文件的历史标头。

## OCCT对象API不是产品Reader/PMI互操作验收证据

OCCT 8.0.1 [XCAFDimTolObjects_DatumObject](https://www.occt3d.com/dev/doc/refman/html/class_x_c_a_f_dim_tol_objects___datum_object.html)公开`IsDatumTarget`、`GetDatumTargetType`、`GetPosition`、`GetModifiers`、`GetPresentation`等接口；[XCAFDoc_DimTolTool](https://www.occt3d.com/dev/doc/refman/html/class_x_c_a_f_doc___dim_tol_tool.html)管理GD&T标签与关系。但对象可表达不意味着任一AP242文件已被Procet的实际版本Reader完整导入。NIST [STEP File Analyzer and Viewer](https://www.nist.gov/services-resources/software/step-file-analyzer-and-viewer)官网页面列5.41版与semantic/graphic PMI区分；本轮只读页面、未运行该工具或OCCT。

## 拟议C1契约及正反门禁

由03域CAD/PMI Owner维护`PmiDatumTargetEvidence`：`D01:{projectId,modelRef,exactRevision,originalFileSha256,apEdition,producerProfile,occurrencePath,topologySnapshotRef,frameRef,unitRef}`；`target:{sourceEntityRef,datumKind,positionIndex,modifierSequence,semanticGeometryRef,semanticFrameRef,displayAnnotationFrameRef}`；`coverage:{sourceTargetCount,parsed,skipped,ambiguous,unsupported,corpusFamily,sourceCaseHash}`；`reader:{occtVersion,readerVersion,runId,resultsHash}`；`qualification:{state,issueCodes,approverRef}`。这是L3接口**提案**，不是已发布产品DTO。C0只承载身份/单位/Frame/修订/作用域/协议，不创建巨型PMI common。

**规则集8项与字段/原包追踪：**
- **B103-R01** 标准版次及历史上下文不可被当前版覆盖；字段：`source.edition / source.claimsCurrent`。
- **B103-R02** STC不含Datum Targets，不能将STC全通过当Datum Target覆盖；字段：`corpus.family / corpus.targetPresent / corpus.rawHash / corpus.claimsTargetCoverage`。
- **B103-R03** 目标来源实体、装配实例、确切拓扑、语义Frame与单位必须绑定；字段：`target.sourceEntity / target.topologyRef / target.occurrence / target.frame / target.unit`。
- **B103-R04** Datum Target类别与位置以及修饰符原有顺序分别保留；字段：`target.kind / target.position / target.modifiers`。
- **B103-R05** Graphic PMI不能作为Semantic PMI完整覆盖或制造消费资格；字段：`semantic.kind / semantic.claim / semantic.sourceEntity`。
- **B103-R06** OCCT对象API存在不能代替固定Reader进程实际测试；字段：`reader.apiPresent / reader.run / reader.version / reader.coverage / reader.claimsPassed`。
- **B103-R07** 来源分母与解析/跳过/不支持/歧义四分项守恒，零目标非正向通过；字段：`coverage.expected / coverage.parsed / coverage.skipped / coverage.unsupported / coverage.ambiguous`。
- **B103-R08** D02唯一Owner重新校验D01原字节Hash与ACL/CAS/取消，禁止冻结覆盖及假D16发布；字段：`commit.d01Expected / commit.d01Read / commit.writer / commit.acl / commit.cas / commit.epoch / commit.frozen / commit.releaseClaim / commit.independentReal`。

**处理流：**D01 exact文件+Header→独立语义与图形PMI两张账→Datum Target真实实体/装配实例/拓扑History与Frame绑定→逐语义分母核对、缺失原因列表→人工预览和审查→Host提交点重新核对身份ACL/ScopeEpoch、D01原字节Hash、D02 expectedRevision CAS与cancelEpoch→唯一03域D02 Owner追加新Revision/Receipt→独立05/06域消费者确认。仅网格/图形PMI仍可查看，但`PRESENTATION_ONLY`不得升级语义资格。

**GUI/CLI/Agent**从同一`PmiEvidenceOwnerPort`读写，唯一左`UnifiedTaskPanel`中按“版次→FTC/STC适用性→实体语义→图形锚点→缺口→采纳回执”展示，唯一Babylon Engine/Scene/Canvas仅用于高亮，不并列第二3D或右Drawer，浅/深主题、字号≤12px。UI取消后晚回执不能套到新scope；若真实Owner已提交，只能以receipt重新对账而非抹去。A/B同一事实不覆盖冻结D08；旧数据只读迁移→影子diff→独立正反测试→人类批准→新Reader切换，失败回退旧读路径并保留所有版本。

**D04工艺Setup ≠ D10实际执行绑定**。D09 CL动画和D11初筛不等于D15 NC工程合格；D12最终NC→D13解释→D14关节轴时序→D15独立工程验证→D16授权发布，未知为UNKNOWN；本项不做材料扫掠仿真。

## 可机器检验的分层证据

[七条分级来源](../../../research/sources/CAP-03-04-datum-target-b103.json) → [八规则与字段和包映射](../../../research/traces/CAP-03-04-datum-target-b103-v08.json) → [35个显式正反及UNKNOWN合成](datum-target-b103-fixtures-v08.json) → [只读Node校验脚本](../../../tools/check_cap0304_datum_target_b103_v08.cjs) → [本轮验证等级](../../../tracking/cap0304-datum-target-b103-verification-2026-11-02.json)。与已有[PMI loss账本](PMI-LOSS-LEDGER-B22-2026-10-29.md)、[标注平面](ANNOTATION-PLANE-B83-2026-11-01.md)衔接；**B103解决测试集覆盖资格与标准版次，新问题而非重复补数**。

规划同判定函数35项合成校验预期一致；独立Node文件进程、真实FTC/STEP原字节、NIST Analyzer、OCCT Reader/Windows、17资产正式Owner和真实消费者、L3人工批准均`NOT_RUN/PENDING_HUMAN`。下一阶段应先选实际含Datum Target的FTC/合法自建STEP样件，固定原始SHA与测试许可，再由与Reader不同实现的独立消费者核对实体/位置/单位/Frame/修饰符，跑缺失和图形伪语义负例；未拿到样件不得虚构已验收。**规划PASS≠产品PASS。**
