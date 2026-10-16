# D01—D17｜C0/C1精确引用与Owner对照

评审稿，2026-10-17。依据现有business-assets.json逐项生成名称、Owner和边界，不改变原V0.8基线。**D分类不等于17张表、17个微服务或17种C0 DTO**。具体C1字段待Owner评审，不把此对照表直接用作数据迁移。

| 数据编号 | 权威资产 | 唯一领域Owner | C0引用/传输与C1内容边界 | 原基线提醒 |
|---|---|---|---|---|
| D01 | 设计基线与制造目标 | 03 CAD / PMI 与制造特征 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 设计基线与派生加工结果必须分离 |
| D02 | 制造特征与加工要求 | 03 CAD / PMI 与制造特征 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 特征识别不等于已经确认工序 |
| D03 | 制造资源能力档案 | 02 制造资源 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 资源定义不等于任务中已绑定资源 |
| D04 | 工艺 Setup 与毛坯 | 04 装夹与坐标系 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 与具体机床执行配置分开，可阶段性完善 |
| D05 | 工艺规划与人工决策 | 05 工艺规划 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 规划可缺省；不阻断无规划自主求解 |
| D06 | 求解候选与搜索结果 | 06 工艺与几何求解 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 允许不经人工规划直接运行；冻结不可被静默覆盖 |
| D07 | 有序材料状态与局部几何 | 06 工艺与几何求解 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 材料状态不等于目标 CAD 几何 |
| D08 | 工艺确认与冻结快照 | 05 工艺规划 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 局部冻结和条件变更应可追踪与重新判定 |
| D09 | 中立刀路 CL | 07 CAM 刀路 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 刀路是运动意图，不是具体机床实际轴运动 |
| D10 | 机床执行配置 | 04 装夹与坐标系（引用 02 制造资源） | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 后处理和控制器解释引用同一版本的控制器语义与机床配置 |
| D11 | CL 级运动预验证 | 09 机床运动与工程验证 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | CL 验证不能替代实际 NC 的控制器级仿真 |
| D12 | NC 程序与后处理记录 | 08 NC 与后处理 · NC 生成 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | NC 是拟上机程序；后续适配不得在无记录情况下修改原程序 |
| D13 | NC 控制器执行语义 | 08 NC 与后处理 · NC 执行适配 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 独立执行后置模块，负责控制器语义而非三维画面；未知专有指令必须显式失败 |
| D14 | 机床轴运动时序 | 09 机床运动与工程验证 · 运动学展开 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 必须区分轴地址命令与 TCP/RTCP 等需要运动学求解的指令 |
| D15 | NC 程序级仿真与验证记录 | 09 机床运动与工程验证 · 程序验证 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 验证只覆盖所建模的控制器行为，不能宣称未实现语义也通过 |
| D16 | 程序发布与审批包 | 10 程序发布与现场协同 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 发布需核对同版本 NC、机床执行配置和验证结论 |
| D17 | 现场执行与检测反馈 | 10 程序发布与现场协同 | C1领域修订或结果工件；由Owner选择DomainRef和需要的ArtifactDescriptor | 反馈须经明确工程变更决策才能修改被冻结的工艺 |

**共通要求**：跨Owner交接传exact DomainRef(domain/kind/id/revision)；若为文件型不可变工件另关联ArtifactDescriptor内容Hash、Schema版本和sourceRefs。D05↔D06的业务反馈可循环，派生版本的直接来源不可成环。D09的CL中立，D12最终NC→D13解释→D14轴时序→D15验证不能反向从3D画面冒充执行语义。D10属于机床执行配置但工艺Setup D04应与其解耦。历史数据缺精确修订时只读/待核对，不默认latest；退役与修订内容改变分别处理。

本表是**Owner级映射**而非字段级冻结。F1-01-S03逐域补schema、生成者、消费者和失效用途，F1-06补快照闭包，F1-02补Frame/单位。全表来源为[原基线](business-assets.json)，需求与测试见[F1-01](../../work-packages/F1-01.md)。
