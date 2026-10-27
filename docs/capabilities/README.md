## CAP-10-06｜现场执行与工单（仅规划，L3待审）
[原88项目标和十子任务](CAP-10-06/README.md) · [GUI/3D](CAP-10-06/UI.md) · [现场工单合同](CAP-10-06/workorder-contract.json) · [10规则40字段](../../research/traces/CAP-10-06.json) · [72合成验收](CAP-10-06/fixtures.json)。详细CAP **76/88**、原包36/36；产品/MES/NC/机床NOT_RUN，Owner/L3待审。

## CAP-10-01 程序发布包（L3待审）
| [CAP-10-01](CAP-10-01/README.md) | [GUI/3D](CAP-10-01/UI.md) | [指纹与离线闭包](CAP-10-01/package-contract.json) | 10规则40字段/88规划合成（仅内存）；不代替人类签发/产品验收 |

## 2026-10-27｜[CAP-09-04刀具安装与TCP核对](CAP-09-04/README.md) · [界面](CAP-09-04/UI.md) · [规则追踪](../../research/traces/CAP-09-04.json)
**66/88详细CAP、36/36原包**；主轴-刀柄-刀尖装配、Gauge实测、H与RTCP语义分离。产品/独立消费者NOT_RUN，L3及17资产Owner待审；下一CAP-09-05。旧数字仅历史快照。

## 2026-10-27｜[CAP-09-03逆运动学与解分支](CAP-09-03/README.md) · [单Babylon/统一左TaskPanel](CAP-09-03/UI.md) · [十条理论追踪](../../research/traces/CAP-09-03.json) · [30+5合成反例](CAP-09-03/fixtures.json)
当前**65/88**项详细CAP，36/36原工作包；下一个CAP-09-04。多支路连续性、Jacobian奇异与角度周期纳入规划，不臆造B5枢轴/限位，产品NOT_RUN、17资产Owner/L3待审。下方数字为历史快照。

## 2026-10-26｜[CAP-07-08轨迹编辑与局部再生](CAP-07-08/README.md) · [GUI与3D](CAP-07-08/UI.md) · [正反变异和依赖图](CAP-07-08/fixtures.json)
55/88 CAP，17Owner/L3待审，真实产品NOT_RUN。后续旧数字仅历史快照。

## 2026-10-26｜[CAP-07-05 粗半精精策略族](CAP-07-05/README.md) · [GUI/3D](CAP-07-05/UI.md) · [10规则30正反变异](CAP-07-05/fixtures.json)
阶段有序D07材料谱系、独立径向/轴向余量与质量目标；详细**52/88**、原编号包**32/36**，仅规划合成PASS、产品NOT_RUN，L3及17Owner待评审。下文为历史快照。

## 2026-10-25｜[CAP-05-08 规划校核与交接](CAP-05-08/README.md) · [GUI/3D](CAP-05-08/UI.md) · [10规则20合成正反](CAP-05-08/fixtures.json)
九维度交接门禁、D09独立消费者、17资产候选Owner；详细CAP39/88（仍待L3），真实产品NOT_RUN。下文历史快照以tracking/progress.json为准。

## 2026-10-25｜[CAP-05-07 计划修订与差异](CAP-05-07/README.md) · [GUI/3D](CAP-05-07/UI.md) · [20合成正反](CAP-05-07/fixtures.json)

## 2026-10-24｜[CAP-05-04 工艺模板与复用](CAP-05-04/README.md) · [GUI/3D](CAP-05-04/UI.md) · [合成验收](CAP-05-04/fixtures.json)

## 2026-10-24｜[CAP-05-03人工编辑与重排](CAP-05-03/README.md) · [GUI](CAP-05-03/UI.md)

## 2026-10-24：[CAP-05-02策略与工艺参数](CAP-05-02/README.md) · [GUI](CAP-05-02/UI.md) · [研究](../../research/traces/CAP-05-02.json)

## 2026-10-24：[CAP-05-01 工艺路线与工序树](CAP-05-01/README.md) · [GUI/3D](CAP-05-01/UI.md) · [概念原型](CAP-05-01/prototype.html)

## 2026-10-24：[CAP-08-01 后处理管线](CAP-08-01/README.md) · [GUI/3D](CAP-08-01/UI.md)

## CAP-04-08｜装夹影响检查（2026-10-20新增）
[业务规格](CAP-04-08/README.md) · [统一左侧任务区/单Babylon世界](CAP-04-08/UI.md) · [正反验收](CAP-04-08/fixtures.json)。原L1/L2不变、L3待审批；详细规划30/88，非产品实现。

## 2026-10-19｜CAP-04-04新增详细规划
[工件坐标系与变换图](CAP-04-04/README.md) · [交互](CAP-04-04/UI.md) · [数学算例](CAP-04-04/math-examples.json)；最新详细CAP **29/88**（旧导航段落保留为历史快照）。

## 2026-10-19｜新增CAP-04-05（以tracking/progress.json为准）

[CAP-04-05 多Setup与转序](CAP-04-05/README.md) 已完成原创详细规划：分序姿态与D07材料转接、夹具重新约束、时序DAG、D04/D10分离、单Babylon世界和统一任务容器、8来源10规则20正反验收。CAP-04-04仍待入库，依赖未通过产品验收；L3待评审。

# 88项业务能力｜逐项导航

原始编号与名称见[88项基线](../architecture/v0.8/03_三级能力映射_88项.md)。候选目录不是已实现清单。每项完成需要业务、界面、数据、模块、研究、验收形成对应关系。

## 已编制详细规格

| 编号 | 入口 | 编制/评审 | 新版研究追踪 |
|---|---|---|---|
| CAP-01-01 | [项目与工程空间](batch01-v0.9.1/01_功能规格/CAP-01-01_项目与工程空间.md) | 已编制/待评审 | 待回补 |
| CAP-01-02 | [工程对象与文档](batch01-v0.9.1/01_功能规格/CAP-01-02_工程对象与文档.md) | 已编制/待评审 | 待回补 |
| CAP-01-03 | [版本、变更与回退](batch01-v0.9.1/01_功能规格/CAP-01-03_版本、变更与回退.md) | 已编制/待评审 | 待回补 |
| CAP-01-04 | [权限、审批与审计](batch01-v0.9.1/01_功能规格/CAP-01-04_权限、审批与审计.md) | 已编制/待评审 | 待回补 |
| CAP-01-05 | [A/B工作模式编排](batch01-v0.9.1/01_功能规格/CAP-01-05_A-B%20工作模式编排.md) | 已编制/待评审 | 待回补 |
| CAP-01-06 | [统一任务与事件中心](batch01-v0.9.1/01_功能规格/CAP-01-06_统一任务与事件中心.md) | 已编制/待评审 | 待回补 |
| CAP-01-07 | [工作台与3D交互](batch01-v0.9.1/01_功能规格/CAP-01-07_工作台与3D交互.md) | 已编制/待评审 | 待回补 |
| CAP-01-08 | [扩展与集成入口](batch01-v0.9.1/01_功能规格/CAP-01-08_扩展与集成入口.md) | 已编制/待评审 | 待回补 |
| CAP-02-01 | [机床资源与构型](batch01-v0.9.1/01_功能规格/CAP-02-01_机床资源与构型.md) | 已编制/待评审 | 待回补 |
| CAP-02-02 | [刀具与切削参数](batch01-v0.9.1/01_功能规格/CAP-02-02_刀具与切削参数.md) | 已编制/待评审 | 待回补 |
| CAP-02-03 | [刀柄与刀具总成](CAP-02-03/README.md) | 已编制/待评审 | 规则追踪已编制，工程补证门保留 |
| CAP-02-04 | [夹具与工装资源](CAP-02-04/README.md)；[UI字段](CAP-02-04/UI.md) | 已编制/待评审 | R-WH-001及逐项规则追踪已编制，工程补证门保留 |
| CAP-02-05 | [毛坯与材料目录](CAP-02-05/README.md)；[UI字段](CAP-02-05/UI.md) | 已编制/待评审 | R-MS-001及规则追踪已编制，工程补证门保留 |
| CAP-02-06 | [测量与检测资源](CAP-02-06/README.md)；[UI字段](CAP-02-06/UI.md) | 已编制/待评审 | R-MET-001及规则追踪已编制，需实机与计量补证 |
| CAP-02-07 | [资源几何与参数化](CAP-02-07/README.md)；[GUI/字段](CAP-02-07/UI.md) | 已编制/待评审 | R-RG-001及规则追踪已编制，真实资产/OCCT/单世界待工程补证 |
| CAP-02-08 | [资源能力与兼容性](CAP-02-08/README.md)；[GUI/字段](CAP-02-08/UI.md) | 已编制/待评审 | R-RC-001、10规则/20验收追踪已编制，真实设备及控制器执行需补证 |

| CAP-03-01 | [CAD导入与几何读取](CAP-03-01/README.md)；[GUI](CAP-03-01/UI.md) | 已编制/待评审 | R-CAD-001与10规则/20正反验收追踪已编制；实际解析/离线/安全依赖待产品验收 |

全部产品验收仍为未执行；旧历史测试报告、合成数学检查和规划JSON检查不代表这些新规格已通过。

## 下一项与接续

2026-10-18：[F1-03公共面工作包](../work-packages/F1-03.md)已完成实施级细分编制，仍待设计评审和产品实施。下一项详细CAP-03-02「零件/装配及版本」；后续相关F1-04按依赖推进。前10项研究追踪回补和必要历史附件迁移继续穿插；未列的72项仍只有基线描述，不计入详细设计完成。

新项使用`docs/capabilities/CAP-xx-xx/`。历史批次保留，修改时记录原因。每项引用[研究目录](../../research/README.md)与对应[工作包](../work-packages/README.md)。分支是否进入main按GitHub实时状态判断，不根据文档数自动推定。

## 2026-10-19新增完整CAP（规划分支已提交、待评审）

- [CAP-03-02](./CAP-03-02/README.md) · [GUI](./CAP-03-02/UI.md) · [理论](../../research/topics/R-ASM-001.md) · [规则追踪](../../research/traces/CAP-03-02.json)
- [CAP-03-03](./CAP-03-03/README.md) · [GUI](./CAP-03-03/UI.md) · [理论](../../research/topics/R-TOP-001.md) · [规则追踪](../../research/traces/CAP-03-03.json)
- [CAP-03-04](./CAP-03-04/README.md) · [GUI](./CAP-03-04/UI.md) · [理论](../../research/topics/R-PMI-001.md) · [规则追踪](../../research/traces/CAP-03-04.json)
- [CAP-03-05](./CAP-03-05/README.md) · [GUI](./CAP-03-05/UI.md) · [理论](../../research/topics/R-MFR-001.md) · [规则追踪](../../research/traces/CAP-03-05.json)
- [CAP-03-07](./CAP-03-07/README.md) · [GUI](./CAP-03-07/UI.md) · [理论](../../research/topics/R-FREL-001.md) · [规则追踪](../../research/traces/CAP-03-07.json)

目前**22/88**项详细规格具备完整本轮登记与追踪；其余已提交但来源/附件不齐的草案不列入完整计数，见[缺口登记](../../tracking/pending-source-gaps-2026-10-19.json)。历史上方“下一项”等数字保留作原快照，不再代表实时进度。

## 2026-10-19 补证与新增完整项

- [CAP-01-01研究回补](CAP-01-01/RESEARCH-BACKFILL.md)、[CAP-01-02独立新补证](CAP-01-02/RESEARCH-BACKFILL.md)、[CAP-01-03研究回补](CAP-01-03/RESEARCH-BACKFILL.md)：历史编号及原8项验收保留，新研究追踪逐项完成；不新计CAP。
- [CAP-03-06人工特征编辑](CAP-03-06/README.md)、[CAP-03-08语义输出与溯源](CAP-03-08/README.md)、[CAP-04-01工艺Setup](CAP-04-01/README.md)：均有完整本轮来源/规则/验收，设计待评审、产品NOT_RUN。

**当前完整详细 CAP 25/88**。仍缺63项完整规格；上文旧数字为历史快照。

## 2026-10-19 新编 CAP-04-02

[业务规格](CAP-04-02/README.md) · [界面与3D](CAP-04-02/UI.md) · [研究专题](../../research/topics/R-STOCKREG-001.md) · [规则追踪](../../research/traces/CAP-04-02.json) · [20项正反场景](CAP-04-02/fixtures.json)。当前**26/88**项详细CAP，均待设计评审，产品NOT_RUN；旧历史快照保留。


- **2026-10-19 CAP-01-07补证**：[原业务规格与研究追踪](CAP-01-07/RESEARCH-BACKFILL.md)、[7项来源](../../research/sources/CAP-01-07.json)、[20正反验收](CAP-01-07/fixtures.json)。原CAP计数不增；研究/人类批准/产品测试分离。

## 2026-10-19 CAP-01-08研究补证

[原CAP补证](CAP-01-08/RESEARCH-BACKFILL.md) · [来源](../../research/sources/CAP-01-08.json) · [追踪](../../research/traces/CAP-01-08.json) · [20项正反场景](CAP-01-08/fixtures.json)。原CAP已计数，不增加26/88；产品NOT_RUN。
