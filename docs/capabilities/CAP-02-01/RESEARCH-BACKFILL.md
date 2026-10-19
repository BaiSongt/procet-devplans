# CAP-02-01｜机床资源与构型：理论研究与业务契约补证
2026-10-20编制。本补证保留[原详细业务规格](../batch01-v0.9.1/01_功能规格/CAP-02-01_机床资源与构型.md)的八项AT，不冒称旧丢失文件已恢复。

**Owner和生命周期**：D03唯一持有机床MachineDefinition，Draft→Validated→Released后按(id,revision,contentHash,unitSystem,topologyHash)锁定。D04只持有工艺Setup；D10独立持有MachineExecutionBinding(machineExactRef,controllerExactRef,setupExactRef,frameGraphRef)。D13最终NC语义解释→D14轴时序→D15工程验证→D16发布，各阶段独立签名；中立CL和三维播放不等于最终NC验证。L1/L2不变，L3待审；C0只承载identity/revision/hash/unit/frame/scope/CAS基础字段，不增巨型common。

**领域数据**：物理关节jointId与程序轴字母axisLetter不可默认一一对应。轴树parentJointId必须无环，包含线/旋运动类型、方向、零位、真实行程、pivotFrame、spindleInterfaceFrame及单位/来源。未知数据=unknown，不按机器名猜B5五轴或默认实机精度；B5只是一种配置和演示范围，三轴不可绕过能力校验。机床实体与行程包络代理分开，渲染手系仅限Babylon适配，不混入OCCT业务Frame。

**Host入口与失效**：GUI/CLI/Agent共同调用Resources领域createDraft/updateDraft/validate/release/resolveExact，均基于真实Host身份进行权限与scopeEpoch重验，CAS expectedRevision/idempotencyKey防止并发重放；SelectionIntent和3D仅预览，不能算发布。取消、项目切换后的晚回执无效。Machine R1→R2只触发下游D10/D14/D15候选失效传播，不覆盖已冻结Setup/NC/审批结论；A/B同事实不重写冻结。历史离线闭包可只读，迁移回退须保留R1。

**GUI/3D**：左侧唯一UnifiedTaskPanel五步“目录→轴树→Frame→能力来源→发布及返回Setup”，Ribbon联动；全局唯一Babylon世界，没实体几何仅显示线框并标明代理。用户资源不因默认3轴/B5资源变化而删除。

**证据与验收**：ISO 841只读目录，ISO 230-1与ISO 10791-1用于界定检验范围，LinuxCNC公开文档说明joint/axis差异，OCCT 8.0.1只支持数学API，NIST仅论文摘要。不能以这些证明具体机床性能。[来源与阅读深度](../../../research/sources/CAP-02-01.json)→[10规则/字段/资产/工作包](../../../research/traces/CAP-02-01.json)→[20正反规格](fixtures.json)→[研究专题](../../../research/topics/R-MACH-001.md)。独立消费者真实产品/NC/机床测试NOT_RUN，L3待人类审议。
