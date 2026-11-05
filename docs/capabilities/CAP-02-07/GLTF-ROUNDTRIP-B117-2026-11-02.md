# B117｜CAP-02-07：glTF米/毫米、镜像与TRS派生资格专项（2026-11-02）

> 适用V0.8、L1/L2不变、L3待人类审批。此次是**研究补证和规划判定工具**，不是改产品几何引擎，也不是glTF读取器的产品通过记录。所有新增附件均为NEWLY_AUTHORED，非历史原字节恢复。

## 一、原目标与新发现

原[CAP-02-07业务规格](README.md)要求D03资源几何按用途分为显示、精确计算、碰撞候选、工作/安全包络，D04显式采用，09域负责运动学。B59已经解决“共享Mesh拾取不能冒充源B-Rep Face”，本轮**不重复B59**，而是补上显示交换链路的单位、层级变换、负行列式、读写器配置与制造用途隔离。

Khronos glTF 2.0.1指定右手坐标、长度米、节点本地T·R·S和父变换乘局部变换。节点可以复用Mesh；实例全局变换行列式为负时三角绕序应翻转。这些是显示/交换语义，**不能据此认定OEM资源、CAD B-Rep、真实装夹Frame或刀柄安全包络成立**。同一个3D文件中`node.name`可能重复，不是持久资源ID。

设局部点p(m)、parent T_p、child T_c（每个变换按T·R·S），则显示坐标`p_global(mm)=1000·(T_p·T_c·p)`，转换只在约定边界执行一次。实例绕序按**全局变换**det(RS)奇偶处理，不能仅查看当前child；两次镜像可能得到正行列式。零行列式非可逆；非均匀缩放虽可显示，不给刚性制造Frame放行。对制造Frame须另证SE(3)的det(R)≈+1、RᵀR≈I、单位和Frame版本；数值阈值由产品策略/工程审批而非glTF或OCCT默许。

**解析反例：** child绕Z旋转90°、parent沿X平移0.1m、局部点(0.002,0,0)m，正确结果(100,2,0)mm；错误把父平移也旋转则是(0,102,0)mm。一次米→毫米：0.002m=2mm，重复乘1000会错成2000mm。镜像两层(-1,1,1)×(-1,1,1)全局正奇偶，不能盲目每层翻一次而仍声称与单层相同。

## 二、已访问的原始来源及深度、边界

| ID | 作者/版本/时间 | URL/已读范围 | 限制 |
|---|---|---|---|
| B117-S01 | Khronos 3D Formats Working Group；glTF 2.0 Specification v2.0.1（官网页标记2021-10-11）；发表2021-10-11；访问2026-11-02 | [原始来源](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)：§3.4坐标与单位；§3.5.2节点树；§3.5.3矩阵/TRS与父子组合（official_public_html_selected_sections_read） | 仅glTF显示与互换坐标语义；米单位和右手系不等于Procet制造Frame已注册，算法容差非规范给出 |
| B117-S02 | Khronos 3D Formats Working Group；同一glTF 2.0.1规范，独立登记§3.7.4并非独立出版物；发表2021-10-11；访问2026-11-02 | [原始来源](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)：§3.7.4 Instantiation；global transformation负行列式改变绕序（official_public_html_selected_section_read） | 与B117-S01同根文档不能计两篇文献；负奇偶影响栅格面朝向，不授B-Rep拓扑或机床安全资格 |
| B117-S03 | Open CASCADE Technology / OCCT3D；OCCT 8.0.1 RWGltf_CafReader API Reference；发表官网未标定；访问2026-11-02 | [原始来源](https://www.occt3d.com/dev/doc/refman/html/class_r_w_gltf___caf_reader.html)：SetToApplyScale/ToApplyScale、SetLoadAllScenes、SetSkipEmptyNodes及XDE mesh reader说明（official_8_0_1_public_api_selected_methods_read） | 接口文字只表示设置语义和缺省值；未运行实际导入/XDE形体，不能据此声称无损还原B-Rep |
| B117-S04 | Open CASCADE Technology / OCCT3D；OCCT 8.0.1 RWGltf_CafWriter API Reference；发表官网未标定；访问2026-11-02 | [原始来源](https://occt3d.com/dev/doc/refman/html/class_r_w_gltf___caf_writer.html)：CoordinateSystemConverter、SetTransformationFormat、SetToMergeFaces、Perform及预三角化要求（official_8_0_1_public_api_selected_methods_read） | 没有验证不同转换器与mergeFaces真实输出及反读；面合并后源Face关系不可凭名称推断 |
| B117-S05 | Open CASCADE Technology / OCCT3D；OCCT 8.0.1 gp_Trsf Class Reference；发表官网未标定；访问2026-11-02 | [原始来源](https://occt3d.com/dev/doc/refman/html/classgp___trsf.html)：IsNegative、ScaleFactor、Transforms、TrsfForm和镜像/缩放API（official_8_0_1_public_api_selected_methods_read） | OCCT支持镜像/缩放类型不意味着可作Procet生产右手刚性机床Frame；需自行资格判定 |
| B117-S06 | Evgeni_Popov（Babylon.js官方社区讨论）；Babylon.js forum comment 2023-09-19；发表2023-09-19；访问2026-11-02 | [原始来源](https://forum.babylonjs.com/t/automatically-convert-instances-to-thin-instances/44236/6)：实例/薄实例负determinant与base mesh处理的工程讨论（public_forum_single_comment_read_informative_only） | 非规范、非官方制造手册；只提示显示实例奇偶风险，不用作安全/性能量化 |
| B117-S07 | BaiSongt/procet-devplans 原CAP-02-07规格维护者；Git Blob 55d4ce4a96692b2282f29dd6a400bf226d3d6068；发表2026-10-17；访问2026-11-02 | [原始来源](https://github.com/BaiSongt/procet-devplans/blob/511371c1302008c336fcc17aa4c5b3fa017509db/docs/capabilities/CAP-02-07/README.md)：业务规格§1-7、RG-R01/R04/R05/R06/R09、D03/D04 Owner和产品验收边界（exact_git_blob_read） | 内部业务需求非外部标准、L3未批；旧代码观察只是固定历史快照、非今日产品现状 |

**证据分层：** S01/S02属同一Khronos出版物的不同章节，不可当两份独立实证；S03–S05是OCCT8.0.1 API文档，不是实际Reader/Writer测试；S06为论坛信息性讨论；S07为规划仓固定Git Blob内生政策。没有阅读任何未获授权收费正文，未验证OEM或用户资源、未声称ISO公差。规则中Owner/CAS/GUI/NC分离全部是Procet自身设计约束，**不能归为Khronos、OCCT或论坛强制要求**。

## 三、来源→规则→字段→CAP/原包→独立正反验收

| 规则 | 本轮新资格门禁 | 字段（各独立反例） | CAP与原包 |
|---|---|---|---|
| B117-R01 | 米→毫米换算仅一次并锁定轴系及源身份 | `sourceMeters`, `unitConversionOnce`, `coordinateBasisPinned`, `sourceDigestPinned` | CAP-02-07/CAP-04-04；F1-02/F1-06 |
| B117-R02 | 节点必须单父无环并按父变换乘局部T·R·S | `acyclicNodes`, `singleParent`, `parentTimesLocal`, `trsOrderPinned` | CAP-02-07/CAP-04-04；F1-02/F1-03 |
| B117-R03 | 全局负行列式影响三角面绕序但不自动批准制造 | `globalDeterminantComputed`, `windingParityCorrect`, `mirrorDisplayOnly`, `singularMatrixRejected` | CAP-02-07/CAP-01-07；F1-03/U4-03 |
| B117-R04 | 非均匀缩放及反射不得升级为制造刚性Frame | `manufacturingRigidValidated`, `nonUniformScaleNotCertified`, `negativeDetNotManufacturing`, `displayTransformSeparated` | CAP-02-07/CAP-04-04；F1-02/E3-04 |
| B117-R05 | Reader场景选择、节点跳过及缩放策略必须同源固定 | `readerVersionPinned`, `applyScaleModePinned`, `sceneSelectionPinned`, `skipEmptyPolicyPinned` | CAP-02-07/CAP-03-01；F1-03/F1-06 |
| B117-R06 | Writer网格/合并/坐标策略完整记账，glTF不可冒充BRep | `writerVersionPinned`, `triangulationHashPinned`, `faceMergeMappingExplicit`, `meshNotExactBrep` | CAP-02-07/CAP-03-03；F1-03/F1-06 |
| B117-R07 | GUI/CLI/Agent同Owner Port并在提交点重验CAS权限和晚回执 | `ownerExactRevisionHashFrame`, `sameDomainPort`, `singleBabylonLeftTaskPanel`, `commitCasAclCancelRechecked` | CAP-02-07/CAP-01-07；U4-03/F1-06 |
| B117-R08 | 显示世界与D04/D10、D09中立CL及D13-D16工程签发隔离 | `d04D10Separated`, `neutralClNotNc`, `d13UnknownBlocksD16`, `frozenD08Preserved` | CAP-02-07/CAP-09-06；E3-04/F1-03 |

[分级来源JSON](../../../research/sources/CAP-02-07-gltf-b117.json) → [8条机器追踪](../../../research/traces/CAP-02-07-gltf-b117-v08.json) → [40正反/UNKNOWN/STALE及5数值Golden](gltf-b117-fixtures-v08.json) → [Node只读规划校验器](../../../tools/check_cap0207_gltf_b117_v08.cjs) → [验证层级](../../../tracking/cap0207-gltf-b117-verification-2026-11-02.json)。每条规则一正四负，负例一次改变一个指定字段；不能以“标记通过”的boolean等同真实CAD或WCS有效性。

## 四、业务Owner和交互/执行边界

D03 Resources Owner拥有资源定义、Reader/Writer算法配置、原始字节Hash、派生显示Mesh与用途证据；D04 Setup只持资源**exact revision/hash/frame**的采用关系；D10 MachineExecutionBinding只在执行环节绑定实机控制器、偏置与实际装夹。GUI、CLI、Agent调用同一Resources领域Port，3D只可视化候选，唯一Babylon Engine/Scene/Canvas、多资源空间横向切换、统一左TaskPanel、最大12px字体、浅深主题。

候选Port：`ReadGltfDerivationEvidenceExact` / `PreviewDisplayTransform` / `RequestResourcePurposeQualification` / `AdoptExactResourceRevisionWithCAS`；输出必须含`assetRevision,sourceBytesHash,readerVersion,writerVersion,unitPolicy,sourceAxis,sceneSelection,skipEmptyNodes,applyScaleMode,globalTransform,detSign,triangulationHash,topologyMappingProof?,scopeEpoch,frameRevision,frameHash,taskGeneration`。其中`meshNotExactBrep`和`displayTransformSeparated`拒绝显示Mesh越权；负行列式可显示但不得按生产右手Frame确认，错单位不得通过silent修正。

写入时由D03/D04各自Owner执行expectedRevision+contentHash+frameHash+scopeEpoch+ACL+取消Fence的**提交点重验**；晚到回执无权覆盖新修订。已发布资源修改派生新revision、旧D08冻结和A/B共用事实保留；迁移旧glTF显示缓存时若缺导入配置/原字节Hash则`UNKNOWN`，仅作显示，允许回退旧显示投影但不回退Owner事实。D09中立CL不携控制器轴，D04≠D10，中立CL→D12后处理→D13解释→D14轴运动→D15独立工程验证→D16发布；CL动画/镜像正确显示**不能**冒充NC或材料去除验证。

## 五、规划测试与独立消费者手工入口

规划可复现：`node tools/check_cap0207_gltf_b117_v08.cjs`（仓库根执行）；合成中一正四负覆盖每规则共40项，另5组解析数学golden，状态CANDIDATE/REJECT/UNKNOWN/STALE明确。测试并不调用真实glTF Reader、STEP/OCCT、Babylon、NC/OEM或D03/D04真实服务。后续由**D04 Setup真实消费者、09域D14/D15以及D03独立验证者**各从冻结原始glTF字节、原始B-Rep来源和实际OEM资源包验收；不能由D03自己签自己收，正式Owner签署和消费者通过仍为0/17。必要回归：单位错1000倍、轴旋转与平移顺序、层级双反射、非均匀显示缩放、Reader applyScale及scene开关切换、Writer mergeFaces丢来源映射、过期Job撤权后晚回执、旧D08冻结不变、UNKNOWN不发布。

**执行等级：** 本轮同判定函数V8 40/40与作者数学算式5/5仅为规划预检；独立Node完整文件进程、真实glTF roundtrip、真实OCCT/模型、Babylon浏览器、Owner/跨域消费者、D13–D16、实机及全仓GFM AST均NOT_RUN。**规划PASS≠产品PASS。**
