# R-ASM-001｜零件定义、装配发生实例、版本谱系与受控变更

**研究与编制日期：2026-10-18。** 对应[CAP-03-02](../../docs/capabilities/CAP-03-02/README.md)。本轮确实联网打开ISO目录、OCCT 8.0.1官方XDE与OCAF指南、XCAFDoc_ShapeTool API及W3C PROV-O；旧CAP-03-01登记`SRC-CAD-002`、`SRC-CAD-004`等按原访问深度复用，不伪称本轮重读旧原文。本文是规划工程推导，**不是对现有Procet产品的认证或标准正文的重现**。

## 1. 外部原始来源：访问深度、适用范围及局限

| 来源ID | 标题、机构、版次/日期 | 实际读取章节和深度 | 具体可支持的结论 | 局限与补证 |
|---|---|---|---|---|
| SRC-ASM-001 | Open CASCADE Technology 8.0.1 Extended Data Exchange (XDE)，OCCT3D；文档版次8.0.1，发布日期未标注 | 官方指南正文 `Basic terms`、`XDE Organization`、`Assemblies`、`Validation Properties`、`Names/Colors`、`Assembly and Components`；`section_text` | 定义Shape、Instance、Assembly，XDE形状定义与位置分开，允许多个根；XCAF文档保存颜色、层、装配描述与验证属性 | 不保证所有文件/实际Reader均完整读取，也不保证跨CAD文件修订的label稳定；产品内核版本仍待核 |
| SRC-ASM-002 | Open CASCADE Technology 8.0.1 API Reference: XCAFDoc_ShapeTool，OCCT3D；8.0.1，发布日期未标注 | 官方API `GetComponents`、`GetReferredShape`、`GetLocation`、`GetFreeShapes`、`GetUsers`、`GetExternRefs`；`section_text` | 装配组件查询、引用目标和实例位置是不同API语义，不能把合成TopoDS形状当唯一发生身份 | API调用细节须按产品实际绑定版本核；并非持久业务ID定义规范 |
| SRC-ASM-003 | Open CASCADE Technology 8.0.1 Open CASCADE Application Framework (OCAF)，OCCT3D；8.0.1，发布日期未标注 | 官方指南`Standard Document Services`、`Transaction mechanism`、`Document`、`Labels and Attributes`；`section_text` | OCAF数据框架支持文档内属性事务、撤销/重做、外部链接，但事务中心在单文档 | 不等同Host/Project与多个数据库/CAS/worker之间的原子提交；不能推断Prod实施可用 |
| SRC-ASM-004 | PROV-O: The PROV Ontology，W3C Recommendation，2013-04-30 | W3C正文`prov:Entity`、`prov:wasDerivedFrom`、`prov:wasRevisionOf`、`prov:wasInvalidatedBy`；`section_text` | 新实体可显式表示来自哪个旧实体及其修订/失效关系，支持单向来源图的设计理由 | W3C概念不规定Procet/CAD产品的ID、权限或SQLite实现，也不赋予制造验证资格 |
| SRC-CAD-002（复用） | ISO 10303-242:2025 Edition 4，ISO/TC 184/SC 4，2025-08 | 官方目录及摘要，`catalog_abstract`（本轮核对版本） | AP242包含零件、组件装配及产品数据管理相关主题；2025版为Edition 4 | **未获取付费正文**，不引用具体实体约束、版本编码或假称AP242全覆盖 |
| SRC-CAD-004（复用） | OCCT 8.0.1 STEP Translator，OCCT3D | 官方公开章节：assembly structure representation entities；`section_text` | STEP产品定义与发生关系/位置由多类实体承载，不能以单个flattened shape代理原语义 | 不保证实际文件的字段完整性或跨版本拓扑稳定，现有产品锁定库版本待核 |

以上新登记项详细机器元数据见[research/sources/CAP-03-02.json](../sources/CAP-03-02.json)。新注册4条；复用旧记录2条，**不能把记录数当独立文献数**。所有来源均为公开标准元数据或官方文档，未存储未授权付费标准正文。

## 2. 原理、公式与工程建模决策

### 2.1 定义（Definition）不等于发生实例（Occurrence）

XDE官方明确实例是对已有Shape的一次带位置引用；故数据模型需同时表达“是什么零件”和“这个零件在哪一个装配位置使用”。在同一装配修订中，`Definition`与`Occurrence`关系可多对一，但每个Occurrence的`occurrenceId/path/frame`必须可区分。源STEP里可能多次引用同一个定义；把两个实例合并仅因共享`shapeHash`会丢失数量、位置和局部标识。规则ASM-R01/ASM-R02，验收T01—T04。

### 2.2 层级Frame不是视图拖拽结果

约定列向量：`p_root = T_root_parent × T_parent_child × p_child`，其中`T_root_child = T_root_parent × T_parent_child`，每个变换为齐次刚体变换且有显式单位和frame引用。若改变左/右乘约定，必须通过F1-02批准的适配完成；不能因为Babylon场景显示偏差而隐式更改D01源坐标。多级装配不能把每级location直接求和，旋转与平移非交换。理论与设计假设分开：XDE/XCAF支持位置语义，具体矩阵约定是Procet内部C0/F1-02规则。ASM-R03，T05/T06。

### 2.3 结构图与生命周期图

在同一工程修订内，Occurrence层级形成根森林，多次引用使**Definition引用**成为共享结构，但祖先引用不得形成环。修订依赖图另有`revision A → revision B`来源链，不得把业务反馈循环转化为不可变修订环。W3C PROV-O可表示`wasRevisionOf`或`wasDerivedFrom`，但不证明重新导入后face/edge永远保持同一ID。实例搬移/重挂引起的`instancePath`改变必须显式处理，不可以用旧路径/旧Tree index假定新版本身份。ASM-R04/ASM-R06/ASM-R07，T07/T08/T11—T14。

### 2.4 元数据覆盖、旧修订和跨文档提交

XDE支持颜色、层、名称、装配和部分验证属性只是引擎**可表示**，不等于特定STEP已包含、Reader实际读取或可做工程资格判定。若新修订缺外链或无法解析，显示`partial/unknown`并阻断涉及的制造目标采纳。OCAF支持单文档事务；跨Host/CAS/资源外链的整体保存要按F1-06另建闭包检验与最终激活点，**不能以OCAF事务取代跨域一致性方案**。ASM-R05/ASM-R08/ASM-R10，T09/T10/T15/T16/T19/T20。

### 2.5 UI与写入主权属于系统设计选择

CAP-03-02沿用现有`procet-cad-input-v1`及Project/DocumentManager/RendererPort，`SelectionIntent`始终不写领域事实。选择、预览、差异查询和真正的写事务必须分开，提交按scopeEpoch/requestId/expectedRevision校验。此为Procet设计要求，不伪称ISO/XDE要求。ASM-R09，T17/T18。

## 3. 只读产品源码观察与研究边界

- `BaiSongt/procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`，`packages/renderer-port/src/cad-input.ts`：现有typed `CadInputDescriptor`有`descriptorId/modelId/revision/sourceArtifact`及`brep_and_mesh/mesh_only/unavailable`等级，并非完整Definition—Occurrence修订契约；应复用，而非新建第二份D00真值。
- 同版`apps/desktop/src/modules/cam/activeCad3dDocument.ts`通过活动`instanceId`选中cad3d文档；`apps/desktop/src/modules/documentProjection.ts`投影documentId/instanceId等上下文；需要沿用其scope一致性思路。
- 同版`apps/desktop/src/modules/cam/CamExplorerTree.tsx`树的数据构造使用`demoProcessNavigatorModel`，并非经校验的真实CAD装配实例目录；**不能将该demo作为已经具备装配树功能的证据**。
- 源码观察只对上述SHA成立，未运行源仓编译/真实OCCT STEP装配解析或Windows EXE；当前产品依赖实际OCCT版本/源码需下一轮Owner确认。不能声称所有项目已有同样行为。

## 4. 未决研究缺口、资料冲突和准入门

1. **产品确切内核版本与XCAF绑定**：OCCT官方网页为8.0.1，尚未证实现用本机SDK版本；适配需重核真实锁定版本。版本不符时本规划保留行为级接口、不冻结函数签名。
2. **跨版本Occurrence匹配**：源文件可能不给稳定ID，名称/label index可能改变；必须提供证据等级与人工确认，无法消歧时`ambiguous`，禁止自动搬迁制造特征、Setup或批准记录。
3. **真实装配数据与外链范围**：不同STEP生成器会输出不同覆盖，外链可能只在供应商授权环境可读；不能以网格或默认色补造。合成fixture只用于逻辑验证，真实认证需有许可证的工程样件。
4. **AP242正文未取得**：仅凭ISO目录不能声称符合具体装配AP实体约束、PMI传递或配置管理条款，需由标准Owner取得合法条款并定点阅读后再冻结L3。
5. **OCAF局部事务与Host跨域一致性**：两种机制作用域不同，不构成矛盾；需独立故障注入验证来源闭包、撤销和版本冲突。未完成时恢复资格显式unknown。

## 5. 来源→规则→字段→CAP/工作包→正反验收映射

- `SRC-ASM-001/002` → ASM-R01/R02/R03/R04/R05 → definitionRef/occurrenceId/instancePath/localToParentFrame/sourceMetadataCoverage → CAP-03-02、B0-02/F1-02 → T01—T10。
- `SRC-ASM-004` → ASM-R06/R07/R10 → revisionDiff/mappingEvidence/oldRef/newRef/impactSet → CAP-03-02、F1-01/F1-04 → T11—T14、T19/T20。
- `SRC-ASM-003` → ASM-R08 → closureRef/transactionGeneration → CAP-03-02、F1-06 → T15/T16。
- **内部设计/源码观察**（不伪充标准） → ASM-R09 → selectionIntent/scopeEpoch/commitReceipt → CAP-03-02、F1-03/T5-02 → T17/T18。

完整机器关联以[trace](../traces/CAP-03-02.json)为准。以上全部是**规格与研究证据**，产品实测验证为`not_run`，评审为`pending_human_review`。