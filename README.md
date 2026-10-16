# Procet Studio｜开发规划与业务设计

本仓维护Procet-*新架构的业务能力、界面交互、数据与模块边界、实施工作包和可追溯理论依据。逐项更新，不再以ZIP为主要交付，也不等待凑满10项。

## 从这里开始

| 入口 | 内容 |
|---|---|
| [架构基线V0.8](docs/architecture/v0.8/README.md) | 11个能力域、88项候选、36个工作包与17类业务资产 |
| [业务能力导航](docs/capabilities/README.md) | 已编制的逐项规格和下一项 |
| [工作包导航](docs/work-packages/README.md) | 实施级子任务、依赖、验收和回退 |
| [理论与参考证据](research/README.md) | 来源注册、研究专题、规则与验收追踪 |
| [进度台账](tracking/progress.json) | 编制、研究追踪、评审和产品验证分开记录 |
| [定时规划任务](tracking/planning-automation.json) | 每小时逐项推进与自动结束条件 |
| [维护规则](AGENTS.md) | 并发提交、安全、版权和范围 |
| [迁移记录](tracking/migration-2026-10-16.md) | 实际入库范围和仍待审计的历史支持附件 |

## 最新交付｜F1-06离线快照与资源闭包

- [F1-06实施总览](docs/work-packages/F1-06.md)、[闭包/恢复GUI](docs/work-packages/F1-06/01-closure-and-ui.md)、[10个开发切口](docs/work-packages/F1-06/02-implementation.md)、[20条正反验收](docs/work-packages/F1-06/03-acceptance.md)：严格按同一工程generation的exact资源与依赖恢复，缺必需工件不授予制造就绪。
- [R-SNAP-001理论专题](research/topics/R-SNAP-001.md)与[证据追踪](research/traces/F1-06.json)：7项新注册权威来源；SQLite单库备份不等于跨库/CAS原子，资源定义、Schema和内容摘要必须与领域消费能力一致。
- 核对procet-gui的ProjectService/manifest/.pct结构存在，不重造宿主；发现需要核验provider记录required=false与多阶段恢复的失败原子可见语义，**没有宣称产品事故已发生**。

## 前轮交付｜CAP-02-06测量与检测资源

- [CAP-02-06业务规格](docs/capabilities/CAP-02-06/README.md)与[界面字段](docs/capabilities/CAP-02-06/UI.md)：7项子能力、10条规则、20条正反产品验收规格；目录能力、校准证据、在机执行和D17现场结果严格分离。
- [R-MET-001理论依据](research/topics/R-MET-001.md)与[规则追踪](research/traces/CAP-02-06.json)：核对10项ISO/NIST/厂商原始来源；在机探测性能≠CMM性能，重复性≠结果不确定度，资料缺失不可判合格。
- 代码核对：procet-resources当前8个resource kind**没有**测量资源；正式接入需typed schema＋发布/派生/迁移同步，不得只改枚举。

## 前轮交付｜F1-01统一引用与契约实施设计

- [F1-01工作包](docs/work-packages/F1-01.md)：10项实施子任务、18项产品正反例（尚未执行）；复用既有C0 v1，不重复造公共协议。
- [R-REF-001](research/topics/R-REF-001.md)及[规则追踪](research/traces/F1-01.json)：7项原始权威资料，明确DomainRef与工件Hash及JCS/生产requestHash区别。
- [17类业务资产Owner映射](docs/architecture/v0.8/C0-C1-reference-crosswalk.md)：逐项登记并保留原基线。

## 前轮交付｜毛坯与材料目录

- [CAP-02-05 毛坯与材料目录](docs/capabilities/CAP-02-05/README.md)与[UI字段](docs/capabilities/CAP-02-05/UI.md)：区分材料资源、Setup初始Stock、Solver有序材料状态；禁止系统自动扩毛坯。
- [R-MS-001材料与初始几何理论](research/topics/R-MS-001.md)：ISO 10303-45、ISO 14649-10、ISO 80000、ISO 6508、ISO 513与OCCT原始资料；6项新增，明确目录阅读边界。
- [本轮核验](tracking/verification-CAP-02-05-2026-10-17.md)：规格/ID一致性检查，产品验证未执行。

## 前轮交付｜夹具、定位与统一Frame

- [CAP-02-04 夹具与工装资源](docs/capabilities/CAP-02-04/README.md)：6项子能力、8条规则、18条产品验收规格，资源定义/Setup/运行状态分离。
- [五任务界面与字段](docs/capabilities/CAP-02-04/UI.md)：目录、总成、接口、能力、检查与采用；规定单一3D空间和跨Setup返回。
- [R-WH-001 定位与受限载荷](research/topics/R-WH-001.md)：7项新增原始来源，明确定位满秩、一阶形封闭、有限载荷和实际夹紧的不同结论。
- [F1-02 Frame与单位](docs/work-packages/F1-02.md)：8项实施子任务、10条产品验收规格、跨语言适配及迁移/回退。

当前计数：详细功能规格14/88；工作包4/36；来源注册45项；CAP研究追踪4项及工作包追踪2项。前10项仍待补证。下一项：CAP-02-07「资源几何与参数化」，工作包随后优先F1-03。全部设计待评审，产品未验收。

## 前轮交付

[CAP-02-03 刀柄与刀具总成](docs/capabilities/CAP-02-03/README.md)｜[R-TA-001 安装链与补偿](research/topics/R-TA-001.md)｜[B0-03 黄金样例与规范追踪](docs/work-packages/B0-03.md)。历史原稿与核验记录保留，不被本轮计数覆盖。

## 界面原型与检查

原第01批[界面总图](docs/capabilities/batch01-v0.9.1/02_界面设计/业务驱动界面总图.md)及[交互HTML](docs/capabilities/batch01-v0.9.1/02_界面设计/交互评审工作台.html)仍为历史示意原型，未接入真实后端。GitHub默认展示HTML源码，尚未部署在线预览。本轮新增的是UI规格，不是新的可运行原型。

本轮实际执行[22项合成数学检查](tracking/verification-CAP-02-04-2026-10-16.md)，脚本blob与本地执行版本已核对一致；未执行产品、OCCT、控制器、浏览器、Windows EXE或全仓文档检查。前轮[6项检查记录](tracking/verification-2026-10-16.md)保留，本轮未重跑，不累加通过数。

## 持续交付

每项同时完成业务流程、GUI/3D、权威数据、领域端口、异常/失效、理论来源、扩展边界、验收和工作包关联。GUI/CLI/Agent共用领域入口；公共层统一身份、单位、坐标与协议，不建立巨型业务对象。规划阶段完成后停止规划任务，产品实现、设计批准和实机验证仍按各自流程推进。

本仓按公开仓库管理。不得上传密钥、带授权参数的URL、客户生产资料、私有源码整段镜像或未经许可的标准/手册全文。不修改产品仓库和数据库，不启动付费CI。
