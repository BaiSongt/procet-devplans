# CAP-02-07｜资源几何与参数化

版本：v0.1，2026-10-17；状态：**规格编制完成、待评审、产品验收未执行**。沿用原CAP-02-07编号及F1-02/F1-06/E3-04工作包关联。

关联：[GUI与字段](UI.md)｜[R-RG-001理论研究](../../../research/topics/R-RG-001.md)｜[规则/来源追踪](../../../research/traces/CAP-02-07.json)。

## 1. 角色、目标及边界

资源工程师维护机床、刀具、刀柄、夹具、毛坯及检测资源的几何；工艺工程师选精确资源版本与Setup安装关系；几何/验证团队需要区分显示、精确计算和工程资格；离线工作间需要同一输入版本的资源资产闭包。

资源几何不是一份同时承担全部用途的Mesh。明确拆为：**参数/受控源CAD → 版本化精确或抽象派生 → 可显示网格、包络 → 按用途的真实性/质量证据**。

内部9项子能力（不增加88项分母）：RG-01参数模板，RG-02资产/来源登记，RG-03有界几何构造，RG-04网格派生与LOD，RG-05组件装配/接口，RG-06运动/工作/安全包络，RG-07用途资格与发布，RG-08版本/离线闭包/失效，RG-09单世界交互与参数编辑。

本项不开发通用CAD建模器、任意自由曲面求解、完整机床IK、全物理碰撞或材料扫掠仿真；不凭机床名称/外观猜轴树、接口和碰撞数值。

## 2. 实际代码观察（只读，非验收）

2026-10-17核对私有仓库 `procet-resources@b861efee9c84a99eba1fbee2c8749e60576fb93f` 和 `procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`，本公开文档不包含其源文件全文。

| 证据 | 路径与可复用能力 | 设计差距 |
|---|---|---|
| E-RG-01 | resources:`src/cam/geometry_assets/types.rs`：format、kernelCapability、fidelity与registration分开 | STEP/BREP能被内核读取，不等于工程已认证 |
| E-RG-02 | resources:`src/cam/geometry_assets/service.rs`：内容寻址与来源证据分别存储 | 使用端必须综合用途/完整性/真实性门禁 |
| E-RG-03 | resources:`src/cam/resources/machine/types.rs`：组件树、parent frame、display/collision资产及三类AABB | 可视包络不等于全轴FK/IK可达空间 |
| E-RG-04 | resources:`src/cam/resources/machine/template.rs`：机床typed模板编译 | 不重造机床拓扑与Frame真值 |
| E-RG-05 | gui:`apps/desktop/src/modules/resources/preview/parametricGeometry.ts`：stock/machine/cutter/holder/fixture示意生成 | 文件已明确参数示意绝不授予几何/制造资格 |
| E-RG-06 | gui:`apps/desktop/src/modules/resources/preview/ResourcePreviewViewer.tsx`：独立交互式Engine/Scene | 与未来唯一主交互3D世界目标有待处理差距；缩略图可隔离离屏渲染 |
| E-RG-07 | gui:`apps/desktop/src/viewport/geometry/geometryResolver.ts`：有hash复核与显示来源关联 | 复用RendererPort，不由UI新造几何真值 |

以上仅说明观察到的源码结构，**不证明已经实现通用资源参数编辑、真实碰撞或单世界全部集成**。

## 3. 数据、版本和唯一Owner

D03(Resources)持有 `ResourceDefinitionRevision`、组件/接口/参数模板、`GeometryAsset`和来源证明；D04(Setup)持有exact资源引用、安装配置和工件位置；09域持有运动学计算与最终验证，D13/D14持有解释后的执行状态。公共C0仅共享身份/修订/hash/Frame/协议，领域typed参数留在C1。

参数模板建议字段（**拟议DTO，不是已存在API**）：`templateExactRef, schemaVersion, parameterSpec{key,unit,bounds,expression?,sourceRef}, kernelVersion, algorithmVersion`；派生结果另有`inputHash, outputAssetHash, resultKind, topologyDerivation?, validity, provenance`。业务revision、Draft编辑lockVersion、实体字节hash、审批状态不可互相代替。保存旧exact ref而不以latest重放。

资产用途分开为`display`、`exact_geometry`、`collision_candidate`、`work_envelope`、`tool_motion_envelope`、`safety_envelope`；同一资产可多用途，但每个用途必须独立资格与条件。几何参考来源可无Project；Setup采用必须有Project/document/Setup作用域和expected revision。

## 4. 规则、依据和验收

**RG-R01** 参数定义、输出形体、来源真实性、空间注册和使用资格必须正交；任何`is_collision_capable`不能独自给生产碰撞绿灯。（源码E-RG-01/02；内部设计）

**RG-R02** 生成和缓存键包含exact模板/资产、规范化参数、几何源hash、kernel及算法/Frame政策版本；实际工件字节hash另校验，不凭lockVersion推测。（F1-01；内部设计）

**RG-R03** 参数需单位、有效域、来源与表达式依赖；NaN/Inf、非正体积、表达式环和不合法镜像拒绝，生产默认数值需工程审批。（内部设计）

**RG-R04** 精确B-Rep独立有效性检查；Location/拓扑变化分别追踪，`IsValid`不等于工艺或碰撞认证。（SRC-RG-002/003/005/006）

**RG-R05** B-Rep→Mesh显式记录线性/角度离散、算法和mesh hash；显示网格/法向不能替代精确曲面，丢失拓扑映射禁止精确面选择。（SRC-RG-004/005/008）

**RG-R06** 组件localFrame在父系；机床轴运动复用09域权威FK而非Renderer自行计算；抽象模型不冒充实体机床。（E-RG-03/04，F1-02）

**RG-R07** 工作/刀具运动/安全包络是具条件声明的AABB，不证明全部可达/无碰撞；`AddClose`有特定前提，不默认用于一般曲面。（SRC-RG-007）

**RG-R08** UI选择、拖拽、预览只改候选；保存/发布按Host命令、expected lock与requestId；已发布修改派生新revision，晚到结果和重试不覆盖。（F1-01/F1-06；内部设计）

**RG-R09** 主3D资源空间与工程空间共享一套互动Babylon Engine/Scene；隔离缩略图可保留，但不可构成第二个对等制造交互世界。（E-RG-06；产品设计共识）

**RG-R10** 缺必需几何、hash不符、来源未证、超出算法适用范围→明确failed/unknown/unsupported，离线恢复必须按exact资产闭包；用途证据失效按消费者传播。（E-RG-01/02/07，F1-06）

## 5. 主流程、命令与异常

主流程：资源精确修订选择→读取可用来源→填写Draft typed参数→请求有界派生→服务端几何有效性/资格分项检查→3D临时展示→保存Draft→发布新revision→Setup显式采用→下游依赖检查。已发布只读；无正式几何时可预览示意但不能制造放行；缺离线闭包不偷偷联网补齐。

拟议端口（尚未核对真实IPC）：`QueryGeometryRoles`、`GetParameterTemplateExact`、`ValidateParameterDraft`、`RequestGeometryDerivation`、`VerifyGeometryForPurpose`、`PreviewAssembly`、`ReleaseResourceRevision`、`AdoptResourceForSetup`、`ExplainGeometryImpact`。各命令标注`requestId, callerScope, expectedRevision, inputHash`；响应含Job/receipt、fieldPath、错误码和恢复建议。GUI/CLI/Agent同一领域入口，3D只消费投影。

异常：非法尺寸、丢来源、开壳/非流形、近容差失败、异步任务取消、切换Setup的迟到结果、并发编辑冲突、发布后响应丢失、离线缺资产、B-Rep变形失去稳定TopoID。必须提供“保留草稿/重新校验/选择正确资产/人工认领”的恢复动作，不能填默认立方体冒充成功。

## 6. 产品正反验收（**20项均NOT_RUN**）

| ID | 预期 |
|---|---|
| RG-T01 | 同exact模板/输入/版本派生一致；改kernel版本指纹随变 |
| RG-T02 | Draft lock变化不改历史Released revision与旧Setup解析 |
| RG-T03 | 零尺寸、NaN、单位错及参数环被拒绝，无占位实体 |
| RG-T04 | 程序化代理只可显示，不授予生产碰撞 |
| RG-T05 | OEM几何未注册空间仍不得生产认证 |
| RG-T06 | STEP可读但BRep无效/资格缺失，不可凭格式通过 |
| RG-T07 | 已发布改参数创建新Draft/修订，不覆盖历史 |
| RG-T08 | 同输入连续3次绝对定位，不累积偏移/扩大毛坯 |
| RG-T09 | 非单位父Frame与子接口正确组合，不复制FK |
| RG-T10 | AABB显示正确但不可达时不授信机床可达 |
| RG-T11 | 显示资产与碰撞资产任一缺失独立诊断 |
| RG-T12 | 改mesh LOD不改变exact B-Rep制造hash |
| RG-T13 | mesh拾取缺真实topology关联时不可确认基准 |
| RG-T14 | 资产缺失/同身份不同Hash时离线恢复阻断 |
| RG-T15 | 切换工程或资源后旧异步结果被忽略 |
| RG-T16 | 并发冲突和requestId幂等重试不重复发布 |
| RG-T17 | 无OEM外观的机床显示抽象部件/线框，不伪造实物 |
| RG-T18 | 资源空间横切时仍只一套主互动世界，状态恢复正确 |
| RG-T19 | thumbnail取消/关闭释放资源，不影响主3D |
| RG-T20 | 纯显示更改仅刷新投影；精确接口改变使依赖证据stale |

## 7. 实施切口与回退

RG-I01盘点现有types/GUI/消费者；I02定义typed参数与版本；I03几何派生/核验；I04mesh/拓扑映射；I05单世界3D接线；I06资格发布与离线闭包；I07跨域兼容和反例回归。生产者Resources/Geometry，消费者CAM/Setup/09/GUI和独立验证者必须共同评审。涉及Frame由F1-02负责，资源闭包由F1-06负责，稳定拓扑与F1-03协调，不能把同一逻辑复制多仓。

迁移保留旧reader、programmatic示意、受控缩略图和旧版本引用；新Writer按feature flag灰度打开，工程数据回退独立于代码回退。未批准：参数化Schema最终wire名称、OEM资产准入政策、locked OCCT版本、拓扑映射与网格细分默认值、双预览视口迁移计划。现阶段没有运行Rust/TS/OCCT/Windows产品测试。


## V0.8研究补证（2026-10-28）
[8来源](../../../research/sources/CAP-02-07.json) → [10规则40字段](../../../research/traces/CAP-02-07-v08-supplement.json) → [55规划合成](research-fixtures-v08.json) → [研究](RESEARCH-TRACE-2026-10-28.md)与[消费者](independent-consumer-v08.md)。原RG-R与RG-T保持，真实产品未验收。
