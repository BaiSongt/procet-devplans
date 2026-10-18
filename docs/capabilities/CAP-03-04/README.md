# CAP-03-04｜PMI与设计约束：从设计标注到可追溯的制造要求

> V0.1，2026-10-18；**文档已编制／L3待评审／产品未实现或验收不由本规划保证**。原V0.8第03域第04项，保持88项总数不变。关联原工作包B0-02、F1-03、F1-04、T5-02；基础研究见[R-PMI-001](../../../research/topics/R-PMI-001.md)、[界面细则](UI.md)、[规则追踪](../../../research/traces/CAP-03-04.json)、[20个合成场景](fixtures.json)。

## 1. 目标、角色、边界与反目标

CAD/PMI工程师负责从CAD/AP242和工程文档接收语义PMI并复核；工艺工程师只读取**明确冻结**的设计要求以决定加工特征、工序和检验关联；质量工程师评审GPS/GD&T解释、基准系统和测量可行性；项目Owner管理变更、版本、审批及来源许可。GUI、CLI、Agent使用同一Owner用例。**03域CAD/PMI子域**是PMI定义和语义的权威Owner；CAM/工艺规划/NC/验证只消费其exact冻结结果，无权重新解释或写PMI底表。

D01为含设计基线的源模型，D02为设计要求与制造特征相关语义，D04工艺Setup是实际装夹配置，D05/D08为工艺候选/冻结，D17为真实测量结果。**设计基准 ≠ Setup WCS ≠ 机床执行坐标系 ≠ 测量的实际基准建立过程**；由F1-02和F1-04表达转换和适用性。PMI的有无、图形可见、语义可解析、关联面确切、解释已审查、可被制造消费，是六个独立状态，不得通过一个`hasPmi`布尔掩盖。

内部子能力（不增加CAP总数）：P4-01 AP242及其他受控来源接收；P4-02 图形PMI/语义PMI区分；P4-03 尺寸及公差表达；P4-04 基准与基准引用框架；P4-05 几何公差与修饰符；P4-06 拓扑锚点及装配实例引用；P4-07 审核、冻结、失效传播；P4-08 制造/检验精确消费与回退。

**不做**：从屏幕文字/几何猜造全部GD&T；用视觉标注自动签发制造公差；把GD&T名义值直接当作刀具余量；在CAP03-04里实现材料扫掠仿真、CAM路径、NC控制器解释或CMM验证；假设所有AP242版次/供应商Reader已完全一致。

## 2. 主业务流、替代流及异常

1. 从文档视图选择D01 CAD `modelRef + sourceHash + exactRevision + assemblyOccurrencePath`；显示可用的PMI载荷来源、导入器版本和读取范围，不能仅凭`.stp`认定语义完整。
2. 导入预解析，分别报告`semantic / presentation_only / none / partial / unsupported / unknown`。保留源Annotation原文、source entity引用、DIM/GDT/Datum分类、单位、符号及sourceContentHash；对未识别修饰符产生可见诊断，**不默默降级为普通线性公差**。
3. 绑定D01的确定几何快照、装配实例、TopoDS精确拓扑引用和标注空间Frame；Display锚点与几何锚点分别记录。依CAP03-03只认explicit exact/ref演化证据，指纹相似只作为待确认候选。
4. 结构化校验：尺寸型式及上下限、单位、是否公差与名义值分开、符号类型、目标对象集、基准先后顺序、修饰符是否由当前解析器支持、相关几何域是否有效；缺关键信息进入`needs_review`，不得自动补齐。
5. PMI工程师在左侧UnifiedTaskPanel审查并可提出**带来源的人工补录修订**；编辑不回写原STEP字节，必须生成新PMI revision，保留源文本、原始/人工分量、作者及理由。
6. 质量工程师确认标准体系及版次（ISO GPS / ASME Y14等不能混合套用默认语义）；标准未知或混用冲突仅能保持unknown/受限状态。系统不因ISO公开目录就声称已实现其具体算子。
7. 在Host提交点检查`expectedRevision`、来源闭包、拓扑映射、对象/规则适用、Actor权限、批准记录和幂等请求ID；经明确**批准冻结**产生`FrozenPmiPackageRef`及可查询receipt。预览/高亮不写领域数据，批准与存储是不同步骤。
8. CAM/特征识别/工艺规划/检验通过`PmiPort.resolve_frozen_pmi(exactD01Ref)`读取冻结包。没有已绑定provider时`missing_provider`，有provider但字段unsupported仍应返回相应诊断，不得回落至CAM历史PMI副本悄悄成功。下游只生成建议，不能改源PMI。

**替代路径**：无PMI模型仍可浏览CAD与几何探索；只有图形标注则以`presentation_only`呈现，人工确认后才能形成独立来源的结构化要求，绝不能把OCR当原CAD语义。不同CAD导入器支持集部分相交时列出支持矩阵并保留unknown；工程本地离线时冻结数据及必要源工件需有完整快照闭包。

**异常与时序**：撤销预览、Worker被取消、关闭文档、跨Project/Setup切换、网络断开、并行编辑、解析超时、迟到响应、原CAD设计修订变更、TopoFace分裂/合并、原Datum目标被删除、审批中策略版本变化都应保留已提交历史，通过`requestId + scopeEpoch + exactRevision`判定当前视图是否采用新结果。失败不可产生“批准”条目。异步任务完成应明确区分`accepted / running / completed / committed / rejected`。

## 3. 数据Ownership、字段与跨域契约（L3候选，非实现宣称）

| 字段/对象 | 必需 / 来源 / 单位 | 真值及验证 |
|---|---|---|
| `pmiId, pmiRevision, schemaVersion, status` | 必需，CAD/PMI Owner生成，无单位 | exact修订；`draft/needs_review/approved/stale/rejected`不可由界面自行升级 |
| `modelRef, modelRevision, sourceHash, geometrySnapshotRef` | 必需，D01/CAP03-01，hash=sha256 | PMI不得与不同模型/拓扑快照混用 |
| `occurrencePath, topologyEntityRefs, topologyMapEvidence` | 条件必需，CAP03-02/03-03 | 同定义多实例应可区分；缺exact拓扑证据标`unresolved` |
| `sourceEntityRef, sourceAnnotationBytesHash, producer, readerVersion` | 条件必需，源CAD/Reader | 来源身份和具体解析器版本；散列不等于正确解释 |
| `representationKind, semanticCoverage, graphicCoverage` | 必需，Reader返回 | 分开统计语义/图形两种覆盖，不能以显示推断全语义 |
| `standardSystem, standardEdition, interpretationProfile` | 必需或unknown，人工审查 | GPS/Y14等解释依赖明确标准体系/版本；未定阻断制造资格 |
| `dimension.kind, nominal, lower, upper, unit` | 条件必需，源语义或人工输入，mm/deg等 | 字段单位须带来源；角度与长度不能直接比较 |
| `gdt.kind, toleranceValue, zoneType, modifiers` | 条件必需，源/标准读取，mm/deg或语义枚举 | 未支持zone/modifier标unknown，不降级为普通尺寸误差 |
| `datumFeatureRef, datumSystem, precedence, constraints` | 条件必需，源语义和模型拓扑 | 基准名、基准特征、基准系、Setup实际定位分开 |
| `annotationFrameRef, displayProjectionRef` | 条件必需，源/GUI | 图形放置与几何语义锚定双轨；Display无权写业务 |
| `approvalRef, approver, policyRef, frozenPackageRevision` | Approved状态必需，受管Host/领域 | 审批对象绑定目标Hash与policy修订，提交点重验 |
| `consumptionQualification, issueCodes, affectedDownstreamRefs` | 只读派生，领域评估 | `usable/partial/blocked/unknown/stale`；由exact输入和消费契约计算 |

数据交换建议：`PmiImportRequest`、`PmiParsingReport`、`PmiDraft`、`PmiReviewDecision`、`FrozenPmiPackage`、`PmiConsumptionFinding`。公共C0仅承载通用`DomainRef/ArtifactDescriptor/FrameRef`；PMI具体字段由CAD Owner维护C1，**不进通用巨型common**。查询/命令/事件候选（明确为TODO接口）：`pmi.preview_import`、`pmi.get_revision`、`pmi.propose_annotation`、`pmi.validate_revision`、`pmi.freeze_requirements`、`pmi.get_frozen`、`pmi.rebind_topology`、`PmiRequirementsFrozen`、`PmiDependenciesInvalidated`、`PmiCommandReceipt`。所有Host写命令需expectedRevision+requestId+Actor+scope，不允许前端直接写数据库。

## 4. 现有源码复用与差距（只读证据，不等于产品资格）

| 证据ID | 指定仓/文件 | 看到的事实 | 本轮需解决的边界 |
|---|---|---|---|
| E-PMI-01 | `procet-cam@fcec1c8` `src/pmi/ap242_import.rs` | 已有`Ap242PmiResult → PmiCreateInput`映射、尺寸/GDT/Datum转换；部分类型无映射或输入非法会被过滤 | 对跳过条目产显式loss/unsupported报告；不能认为导入列表为空等于源无PMI |
| E-PMI-02 | 同版 `src/pmi/geometry_locator.rs` | 已有exact snapshot定位、model mismatch/ambiguous错误；局部索引不满足唯一时拒绝 | 应复用，不让单一face index冒充跨revision稳定引用 |
| E-PMI-03 | 同版 `src/pmi/mod.rs` | CAM物理仓内保留legacy PMI实现、`review_annotations`历史桥接 | CAD领域Owner归属不因物理归档变成CAM所有权；遗留兼容要有退役台账 |
| E-PMI-04 | 同版 `src/ports/pmi.rs` | 新`PmiPort`只有`package_revision_id`占位，`UnboundPmiPort`明确`missing_provider`，X01正式提供者未绑定 | X01真实provider及schema能力不能虚写“已实现”；不可fallback legacy副本 |
| E-PMI-05 | `OCCT 8.0.1` XDE官方指南 | XCAFDoc_DimTolTool管理dimension、geometrical tolerance、datum；可保留语义与presentation | 支持列表仅参考该文档版本，当前Procet实际OCCT配套依赖须独立核实 |

**注意现实风险**：`ap242_import.rs`的`classify_gdt_kind`未映射的kind返回None，部分value或face_idx不满足时filter_map跳过。规划要求统计“已读取／被拒绝／未支持／人工复核”数量和原因，而不是从成功条数推断源文件全量PMI。源码观察范围有限：没有执行Native OCCT解析、不是对全部制造消费路径的审计。

## 5. 规则、验收与失效传播

10条规则及双向验收ID见[机器追踪JSON](../../../research/traces/CAP-03-04.json)，20组可执行规格见[合成数据](fixtures.json)。产品验收必须同时存正向与反向结论，使用NIST/CAx-IF公开许可的测试模型或自造数据，固定Reader/native版本与sourceHash、单位、Frame、版本、工作包提交SHA、预期错误码。文档中使用的`CAP-03-04-T01..T20`仅为**尚未开发执行的测试规格**。

CAD源变更→PMI引用及必要拓扑重绑定标`stale/ambiguous/unknown`→D02制造特征与D05工艺计划受影响→D08冻结计划及D16发布包仅提出重评，不可静默篡改；D17测量结果不能反向修改历史公差。真正工序实施须按制造要求消费粒度决定是否blocked，而非“任何PMI缺失全系统不能工作”。

## 6. 实施计划、依赖、回退与退出

关联工作包B0-02（Owner/边界）、F1-03（CAM旧副本退出）、F1-04（探索/生产门分离）、T5-02（CAD/PMI回归）；依赖CAP-03-01 D01源模型、CAP-03-02定义/实例、CAP-03-03稳定拓扑引用及F1-01精确引用。顺序：P4-01源语义/图形读与loss报告；P4-02版本化结构化语义；P4-03拓扑与frame绑定；P4-04审批冻结；P4-05真实PmiPort生产adapter；P4-06GUI/CLI/Agent一致接入；P4-07NIST测试与负例；P4-08离线恢复和旧版reader受控兼容。

**准入**：CAD/PMI Owner确认schema边界，锁定真实OCCT/STEP reader版本和公开测试许可，记录旧数据可读方式，F1-03确认合法消费者；**退出**：20项产品正反验收在冻结的Windows/Linux可支持环境实际执行、故障注入及复现证据可回读；关键unsupported不被无证据提升为usable，评审签字。回退允许禁用新生产route恢复旧只读查看，已经发布的冻结包及批准记录仍保持可查；**禁止无声改写已批准D05/D08/D16**。