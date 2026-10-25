## 2026-10-26｜原U4-06模块SDK与贡献验收
[原10子任务](U4-06.md) · [统一GUI](U4-06/UI.md) · [生命周期及回退](U4-06/adapter-and-lifecycle.md) · [Owner候选](U4-06/asset-owner-candidates.json) · [来源及规则](../../research/traces/U4-06.json) · [独立消费者](U4-06/independent-consumer-handoff.md)。工作包30/36，真实模块/产品NOT_RUN，L3及Owner待签。

## 2026-10-25｜W2-01实现A/B接管（原编号）
[实施级任务](W2-01.md) · [领域GUI](W2-01/UI.md) · [17资产候选](W2-01/asset-owner-consumer-matrix.json) · [10规则/20正反](../../research/traces/W2-01.json) · [独立验收协议](W2-01/independent-consumer-handoff.md)。当前19/36、L3/产品NOT_RUN。

## 2026-10-25｜E3-02后处理与NC行来源
[10子任务](E3-02.md) · [统一GUI](E3-02/UI.md) · [规则](../../research/traces/E3-02.json) · [独立D13交接](E3-02/independent-consumer-handoff.md)。原工作包18/36，产品NOT_RUN。

## 2026-10-25｜E3-01中立CL/链接实施级规划（原编号）
[业务与10子任务](E3-01.md) · [统一TaskPanel/3D](E3-01/UI.md) · [17资产Owner](E3-01/asset-owner-consumer-matrix.json) · [8来源10规则20正反](../../research/traces/E3-01.json) · [D12独立消费](E3-01/independent-consumer-handoff.md)。正式原编号17/36，L3与产品NOT_RUN。以下为历史快照。

## 2026-10-24｜E3-06 D16受控发布与离线交付（原编号）
[实施包](E3-06.md) · [GUI/3D](E3-06/UI.md) · [领域契约](E3-06/contract.example.json) · [离线包合成清单](E3-06/offline-manifest.example.json) · [D17独立交接](E3-06/independent-consumer-handoff.md) · [10规则/20正反](../../research/traces/E3-06.json)。正式原编号工作包16/36；真实签名、审批与独立接收NOT_RUN。

## 2026-10-24｜E3-05 独立NC程序级验证（原编号）
[E3-05主规格](E3-05.md) · [GUI/3D](E3-05/UI.md) · [覆盖矩阵](E3-05/verification-matrix.json) · [独立交接](E3-05/independent-consumer-handoff.md) · [研究追踪](../../research/traces/E3-05.json)。工作包15/36，产品/独立D16 NOT_RUN。

## 2026-10-24｜E3-04 两机型轴运动展开（原编号）
[E3-04主规格](E3-04.md) · [GUI/CLI/Agent](E3-04/UI.md) · [17资产Owner候选](E3-04/asset-owner-consumer-matrix.json) · [9来源/10规则/20正反](../../research/traces/E3-04.json)。正式原工作包14/36，真实B5构型和独立D15验收NOT_RUN；下方历史快照以tracking/progress.json为准。

## 2026-10-24｜E3-03 独立NC执行语义适配（原编号实施规划）

[E3-03业务与实施子任务](E3-03.md) · [NC执行端口](E3-03/contract.example.json) · [17资产候选Owner](E3-03/asset-owner-consumer-matrix.json) · [10规则20正反](../../research/traces/E3-03.json)。工作包13/36、工作包研究追踪11项、产品NC/消费者 NOT_RUN；以下历史进度以tracking/progress.json为准。

## 2026-10-24｜B0-06 原编号实施规划已编制

[B0-06责任、ADR与本地验收](B0-06.md) · [GUI/CLI/Agent共域接口](B0-06/contracts-and-ui.md) · [ADR模板](B0-06/adr-template.md) · [本地manifest样例](B0-06/local-acceptance-manifest.example.json) · [来源/正反验收](../../research/traces/B0-06.json)。已正式入库原工作包**12/36**；其中10项有研究追踪；人类签署和产品测试NOT_RUN。旧导航数字视为历史快照。

## 2026-10-19｜新增原B0-05实施级规划（最新进度）

[B0-05｜整理PR与exact-HEAD验收](B0-05.md) · [来源](../../research/sources/B0-05.json) · [10规则/20正反验收](../../research/traces/B0-05.json) · [机器快照](B0-05/observed-pr-snapshot-2026-10-19.json)。原编号11/36项完整细化；L3及产品独立验收仍未执行，Solver#125现为已合并历史PR而非Draft。下面旧统计为历史快照，以tracking/progress.json为准。

# 36项开发工作包｜实施级细分导航

完整原计划：[V0.8工作包](../architecture/v0.8/04_开发工作包_36项.md)。B0、F1、W2、E3、U4、T5每阶段6项，编号保持不变。

## 已完成实施级细分编制

| 编号 | 文档 | 当前含义 |
|---|---|---|
| F1-01 | [C0/C1与公共精确引用](F1-01.md) | 10个子任务、18项正反验收规格；已有C0协议复用；产品待实施 |
| B0-03 | [建立业务黄金样例与规范追踪](B0-03.md) | 8项子任务、12组场景规格；待评审，产品未执行 |
| F1-02 | [统一Frame、单位与安装变换数学](F1-02.md) | 8项子任务、10条产品验收；数学检查不等于产品通过 |
| F1-03 | [收敛CAM公共面与领域副本](F1-03.md) | 10项子任务、10条规则、20条产品验收；附接线和审计覆盖；待评审、产品未执行 |
| F1-06 | [离线快照与资产闭包](F1-06.md) | 10项子任务、20条验收；闭包/恢复界面及研究追踪；产品未执行 |

其余31项仍为原计划粒度。CAP内部子任务及首批30项实施切口不自动使父工作包完成。文档编制完成不代表依赖已开发就绪。

每项明确业务Owner、真实生产者/消费者、前置条件、产物、实施子任务、测试入口、正反验收、迁移/回退和不在范围。不存在的测试或接口明确标为待建立。后续F1-04按依赖深化；实际队列见[台账](../../tracking/progress.json)。

## 2026-10-19新增完整实施级工作包

- [F1-04｜探索输入、ProcessSetup与MachineExecutionBinding分离](F1-04.md) · [研究](../../research/topics/R-PS-001.md) · [追踪](../../research/traces/F1-04.json)，10子任务/20正反验收规划，待评审、产品未实现/验收。

目前完整详细工作包**6/36**。B0-01、B0-02、B0-04、F1-05等已提交部分正文，但关键研究来源或验收附件未全部入库，仍在[缺口登记](../../tracking/pending-source-gaps-2026-10-19.json)；不得当作工作包实现或完整编制。上文旧数字为历史快照。

## 2026-10-19 研究与正反验收补齐

- [B0-01三层组合基线](B0-01.md)、[B0-02能力与数据Owner](B0-02.md)、[B0-04发行闭包](B0-04.md)、[F1-05受管求解接入](F1-05.md)。
- 4项均补充了[研究来源登记](../../research/source-index.json)和每项20条正反验收规格，实施及验收仍NOT_RUN、L3待评审。

**当前完整实施规划10/36**，仍有26项待细化。原文件和历史上方旧数字不重写。
