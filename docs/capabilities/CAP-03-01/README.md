# CAP-03-01｜CAD导入与几何读取：从外部设计文件到版本化D01输入

**v0.1，2026-10-18，已编制待评审；产品能力及验收均未由本规划执行。** 维持原88项CAP编号；研究见[ R-CAD-001 ](../../../research/topics/R-CAD-001.md)、[交互UI](UI.md)及[机器追踪](../../../research/traces/CAP-03-01.json)。关联原工作包B0-02、F1-03、F1-04、T5-02；详细责任不能由CAP文档替代工作包退出门。

## 1. 用户、角色与业务目标

设计工程师导入外部CAD并辨认零件/装配，工艺工程师确认加工目标是否具备可追溯B-Rep，质量/PMI工程师审查附带的设计语义是否可读，项目Owner控制来源许可和修订，Host负责快照与权限；GUI、CLI和Agent只能调用相同领域命令，不得单独创造第二份CAD真值。D01是设计基线与制造目标；其确认后的派生特征属D02；D04 Setup以及D10机床执行绑定均**不应随导入自动形成**。

内部子能力（原CAP不增加分母）：CI-01文件选择与格式辨识；CI-02受控接收/去重/CAS；CI-03解析能力与版本评估；CI-04装配实例与拓扑读取；CI-05单位/Frame/公差证据；CI-06有效性/修补/能力诊断；CI-07模型浏览、选择与输入确认；CI-08快照、变更、离线恢复与回执。

### 主流程：八个可审查阶段
1. 项目工程工作台→打开/导入CAD，可先选择源文件并以预览态审查；缺项目则只允许非持久预览，正式入库前选择Project。
2. 记录原始字节sha256、大小、媒体类型、声明路径、来源许可、导入请求ID、读写范围；不上传客户模型，也不以文件名作为身份。
3. 识别交换格式/协议/Reader实际覆盖；导入格式不支持时返回unknown/unsupported及可恢复动作，不发生领域写入。
4. 解析几何及装配：定义/实例/层级/原始局部Frame/实例位姿分离；同时记录名称、颜色、层与PMI是否实际读取，不凭格式名称补造。
5. 记录源单位（长度/角度）、显式变换到工程单位，保留源unit和转换证据；没有可信单位不得默许1:1。
6. 独立检查B-Rep有效性与拓扑/网格产物；可选修复必须新派生及差异，不得更改源字节或偷换已确认版。
7. 用户在同一Babylon交互世界预览/拾取/检查属性后按“确认导入”，Host提交点重验项目、权限、exact revision、来源闭包及requestId；显示投影不写业务。
8. 正式回执包含descriptor、实际修订/哈希、按角色可恢复CAS refs和状态。**导入提交**不自动产生CAM Job/Setup/Plan/制造资格。

### 替代/异常流程
- 旧STEP/AP版本、未知协议或外部引用：仅按实际Reader能力部分读取，显示不可解析引用，不伪造完整组件。
- IGES/mesh/native_brep为现有合同可声明的格式类型，**不等于当前UI已实现相应生产导入**；接入属于独立能力受控扩展。
- 同文件异导入参数或源相同但配置变化：可以重用源CAS，派生结果保留不同algorithm/configHash；不覆盖旧拓扑。
- 取消/超限/Worker失败：未激活的staging作废，可查询确切失败回执；成功后取消不得伪造“未提交”。
- 失效：源变更只影响依赖本CAD修订的D02、D04、D05等后续资产；已批准D08/D16不可静默改写，按W2-03规则列影响并重审。

## 2. 现有源码复用与差距（只读、特定提交）

| 证据 | 已核实文件/版本 | 可复用事实与范围边界 |
|---|---|---|
| E-CAD-01 | procet-gui@4e8eec12... `apps/desktop/src-tauri/src/commands/cad_input.rs` | 已有typed`cad_input_import`、Project/CAS恢复和`CadInputDescriptor`；入口先检查`cam_job_create`及CAM backend，导入与CAM Job登记耦合；当前`MAX_STEP_SOURCE_BYTES`为256 MiB，**不是全系统新标准默认限制**。 |
| E-CAD-02 | 同版`apps/desktop/src/modules/cam/modelInput.ts` | 文件选择器目前只开放step/stp；输入按`capability.cam.job.create.ready`阻断，前端已有Project/sessionEpoch晚响应保护与文档实例身份。 |
| E-CAD-03 | 同版`packages/renderer-port/src/cad-input.ts` | 已有`procet-cad-input-v1` typed镜像、`CadInputDescriptor`及brep_and_mesh/mesh_only/unavailable语义；`GeometryDerivation`关联TopologySnapshotRef与MeshBundleRef。 |
| E-CAD-04 | OCCT8.0.1官方STEP与XDE文档 | 参考可支持reader、装配与单位转换设计；**当前产品Native内核具体版本尚须依实际锁定文件确认，不能直接套用8.0.1 API**。 |

差距/建议：保留现有D00 descriptor/CAS/Host/RendererPort真值；以受控用例分离**CAD源登记、只读浏览与CAM Job资格**，而非删除CAM写门。Host写事务与Project文档恢复由既有服务提供；CLI/Agent走同一个领域入口，不能新建平行CAD缓存库。若现有版本无法无CAM后端独立完成CAD导入，应在接口评审中列为依赖解耦任务，未开发前显示blocked，不在UI伪造功能。

## 3. D01数据、字段和Owner边界

Owner为03域CAD/PMI与制造特征中的**设计输入子域**；由Project/Host管理存储与修订，不意味着CAM可越权修改CAD真值。沿用已有D00 typed descriptor作输入边界；新增字段均为提案，L3待审核、L4未冻结。入口`ImportCadSource`、`PreviewCadParse`、`GetCadInputAtRevision`、`CommitCadInput`、`CadInputCommitted`均为**候选命令/查询/事件名称**，非已实现产品API。

| 属性/业务对象 | 必需与来源 | Owner/含义 |
|---|---|---|
| sourceArtifact.contentHash,sizeBytes,mediaType | N；实际文件内容/受控CAS | 原始文件字节指纹与资源上限，不等于CAD认可或数字签名 |
| declaredSourcePath,sourceLicense,sourceLabel | C；操作者声明 | 仅审计元数据，离线恢复不能依赖此路径 |
| descriptorId,modelId,revision,providerId,schemaVersion | N；Host/CAD Owner派生 | 精确修订与schema，旧版descriptor必须可追溯 |
| applicationProtocol,readerVersion,readerOptionsHash | C；解析器返回，未识别为unknown | 版本化解析证据，不按文件名猜协议 |
| assemblyDefinitionRef,instancePath,instanceLocalFrame | C；XDE/Reader | 定义与实例关系不能合并，保留多实例引用 |
| sourceUnits,normalizedUnits,unitConversion | N或unknown；源representation及显式选择记录 | 符合前提才能进行转换；手动覆盖需留说明、批准角色及新修订 |
| topologySnapshotRef,brepRef,meshBundleRef | 按能力层级条件必需；转换器产物 | BRep真值与显示mesh分别存储，派生保持sourceHash |
| validationStatus,validationDiagnostic,shapeHealingRef | C；检查器/修补器 | 三态valid/invalid/unknown、诊断和衍生记录，不授予制造安全结论 |
| pmiAccess,metadataCoverage | C；源数据与Reader | no_data/partial/full均需有读取证据，PMI由所属Owner后续决定采纳 |
| WorkContext/requestId/expectedRevision/scopeEpoch/receipt | 命令必需（拟议契约），Host与领域Owner | 并发、取消、晚响应、幂等与真实提交身份 |

跨域消费：D01→D02/D04/D05/D06使用exact ref；“sourceHash相同但解析选项不同”需把派生解析配置版本入来源图。Topology内核ID不自动保证跨模型修订的face永久稳定；CAD更新后的对应需要显式匹配/人工确认。缺失PMI仅标unknown，不阻断合理的3D几何浏览；没有可验证B-Rep不得进入制造特征Accepted。

## 4. 十条规则与独立证据

| 规则 | 设计规则（论文/官方支持不等于产品实现） | 关键字段 | 原始来源 | 正反验收 |
|---|---|---|---|---|
| CAD-R01 | 保留原始源文件CAS和确切哈希/媒体类型，外部引用缺失必须显示UNKNOWN，导入路径不是恢复依赖。 | sourceArtifact.contentHash、sizeBytes、declaredSourcePath | SRC-CAD-001 | CAP-03-01-T01、CAP-03-01-T02 |
| CAD-R02 | STEP/AP版本与OCCT读取覆盖按实际文件与导入引擎声明，不因扩展名声称支持全部AP242 2025。 | applicationProtocol、readerVersion、parseCoverage | SRC-CAD-002、SRC-CAD-003、SRC-CAD-004 | CAP-03-01-T03、CAP-03-01-T04 |
| CAD-R03 | 单位由源实体和明确变换来源裁决；未知单位禁止暗默mm/英寸混淆，显示frame与几何frame不可混用。 | units.source、units.canonical、frame.source | SRC-CAD-004 | CAP-03-01-T05、CAP-03-01-T06 |
| CAD-R04 | 装配实例、零件定义和颜色/名称保持来源链，Reader/XDE与扁平化形状之间明确功能损失。 | assemblyPath、instanceTransform、name/colourEvidence | SRC-CAD-004、SRC-CAD-005、SRC-CAD-007 | CAP-03-01-T07、CAP-03-01-T08 |
| CAD-R05 | 验证、修补、导入成功、制造可用是不同事实；修补必须生成新派生身份与日志，禁止原地替换源。 | shapeValidation、healingProvenance、geometryHash | SRC-CAD-006 | CAP-03-01-T09、CAP-03-01-T10 |
| CAD-R06 | 导入Worker有资源上限/超时/取消和参数快照；进程级共享静态参数不能冒充按请求隔离。 | importParameters、workerRevision、cancelEpoch | SRC-CAD-004、SRC-CAD-005 | CAP-03-01-T11、CAP-03-01-T12 |
| CAD-R07 | B-Rep拓扑真值与渲染mesh派生区分，选择仅在exact拓扑映射有效时参与制造。 | topologySnapshotRef、meshBundleRef、sourceGeometryHash | SRC-CAD-005、SRC-CAD-007 | CAP-03-01-T13、CAP-03-01-T14 |
| CAD-R08 | 网格可视性、BRep有效性、PMI可读取性与制造资格分别判断，部分能力不得自动提升为Approved。 | geometryCapability、pmiAccess、manufacturingApproval | SRC-CAD-002、SRC-CAD-006 | CAP-03-01-T15、CAP-03-01-T16 |
| CAD-R09 | GUI/CLI/Agent共用Owner提交口：注册/就绪/许可/真实提交四层独立；迟到回执不污染其他Project/Setup。 | requestId、expectedRevision、commitReceipt、scopeEpoch | SRC-CAD-001 | CAP-03-01-T17、CAP-03-01-T18 |
| CAD-R10 | 旧工程精确输入引用与兼容读保持，不以最新解析或自动修补静默覆盖历史工程。 | schemaVersion、migrationRecord、rollbackRef | SRC-CAD-003 | CAP-03-01-T19、CAP-03-01-T20 |

ISO的目录阅读只支撑标准的身份/范围/代际关系，不是具体格式字节、尺寸、公差条款。规则中的Hash、幂等、权限与Host原子激活是Procet内部架构决策，应按F1-01/F1-06签发，不伪称标准规定。

## 5. 20组可执行正反验收（均为待实施产品场景）

| 用例 | 正向应通过 | 反向必须拒绝/显示未知 |
|---|---|---|
| CAP-03-01-T01 | 选择本地STEP文件，源字节归CAS并生成sha256及文件大小 | 仅保存外部路径而不保存字节仍宣称可离线恢复 |
| CAP-03-01-T02 | 同源重新导入生成明确去重候选，不隐式覆盖已有工程版本 | 恶意扩展引用/超限大文件导致持久半成品或未记录下载 |
| CAP-03-01-T03 | 公开声明AP242协议识别和Reader能力边界 | 仅文件名.stp即宣称支持完整AP242 PMI |
| CAP-03-01-T04 | 历史2022版来源显示其版本并受现有Reader能力限制 | 把已撤回2022版写为最新或将未知协议解析为成功 |
| CAP-03-01-T05 | 从源声明与翻译器日志确定长度/角度单位并生成明确单位链 | 源单位缺失仍静默按毫米完成制造许可 |
| CAP-03-01-T06 | 正负方向及实例坐标变换在源/工程frame往返一致 | 靠Babylon相机反转或交换轴修复单位/手系差异 |
| CAP-03-01-T07 | 同一零件定义在装配中两个实例保留不同位姿与路径 | 按单一solid哈希合并后错误丢失实例坐标 |
| CAP-03-01-T08 | 源颜色/名称不存在时以缺省显示标记而非伪称源属性 | 把面片显示色当作受控材料或PMI证据 |
| CAP-03-01-T09 | BRepCheck检查结果和失败子形状诊断可回溯 | 形状通过IsValid就授予可加工或碰撞PASS |
| CAP-03-01-T10 | ShapeFix可选修补生成独立派生、差异与来源 | 修补时无记录地改源且破坏原始几何回读 |
| CAP-03-01-T11 | 导入参数、预算、Worker版本可重放，超限显示阻断 | 后台超时后留下被声明完整的损坏CAS工件 |
| CAP-03-01-T12 | 导入过程中切Project/关闭标签，迟到结果只回原scope | 迟到Worker回调把A模型写入B工程 |
| CAP-03-01-T13 | 拓扑选择携带exact BRep/face来源和拓扑snapshot | 仅mesh三角面index创建制造特征并入批准Plan |
| CAP-03-01-T14 | mesh重生版本变更只重建投影，BRep真值保留 | 新mesh sourceHash不匹配旧Topology仍强行选择 |
| CAP-03-01-T15 | brep_and_mesh/mesh_only/unavailable边界完整呈现 | mesh_only被当作可执行CAM几何 |
| CAP-03-01-T16 | 导入CAD及PMI缺失仍允许正确展示已获得部分 | 无来源PMI通过界面自动生成受控制造公差 |
| CAP-03-01-T17 | 工程导入与CAM Job生成的能力资格分别判定 | CAM后端离线时CAD只读/导入被硬性假判CAM已批准 |
| CAP-03-01-T18 | GUI/CLI/Agent的导入提交接收同scope与权限，重试按requestId查回执 | 二次点击/响应丢失导致重复登记或跨工程落库 |
| CAP-03-01-T19 | 旧D00 descriptor/revision原样可读，导入新版本只追加派生 | schema升级直接覆盖老批准项目源引用 |
| CAP-03-01-T20 | 离线恢复BRep、mesh与源文件闭包，缺件明确降级/阻断 | 源文件被删除后依靠历史绝对路径假恢复成功 |

执行证据要求：冻结完整源码组合SHA/Cargo.lock、OCCT native版本、平台、源fixture SHA、导入选项、单位/Frame、期望错误码及退出状态。建议最少包含单Solid、壳/无封闭体、多Solid多实例、英寸与毫米混合历史源、PMI缺失、外部引用缺失、拓扑非流形、源hash相同解析配置不同、跨Project迟到回执、断网恢复、恶意/超限文件。测试文件必须合成或许可可公开，不使用客户模型。产品测试入口由F1-03/T5-02核对后列真实命令，未存在的单测以`TODO_TEST_ENTRY`登记；**此规划无实际产品PASS**。

## 6. 实施切口、准入/退出与回退

实施角色：CAD领域Owner主责、Host/Project负责原子提交和恢复、CAM及Solver是消费者、GUI/RendererPort负责投影，产品验证人员独立测正反例。准入：B0-02所有权确认、F1-03公共面边界检查、F1-01精确引用规则具备生产适配评审、真实CAD backend/OCCT版本锁具备。建议任务顺序：CI-01文件接收与格式探测→CI-02单位/Frame与XDE导入→CI-03BRep/mesh能力及来源→CI-04Host提交流程独立化→CI-05GUI/CLI/Agent一致接线→CI-06离线闭包与可回退旧格式reader→CI-07独立正反回归；不得一次性重写D00和CAM。
退出需20条场景在冻结组合上执行并保留失败证据，且Owner和下游消费评审签字。回退保留旧`procet-cad-input-v1`读取、历史BRep/mesh CAS闭包，必要时禁用新导入路由但不可删除已入库的新修订。正向仿真/NC资格仍在09/08/10独立审批，不作为CAD导入天然结果。
