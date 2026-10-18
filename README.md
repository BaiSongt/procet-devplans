# Procet Studio｜开发规划与业务设计

## 2026-10-19｜规划分支新增入库（以进度台账为准）

本次已通过同一个Draft PR分支入库 **CAP 22/88、实施级工作包 6/36、研究来源登记 120 条**；main未合并。新增加5项完整CAP：CAP-03-02、CAP-03-03、CAP-03-04、CAP-03-05、CAP-03-07，以及F1-04工作包。CAP-01-04与CAP-01-05已有规格的研究补证已入库。另有部分项目仅主文或追踪入库、缺少来源或附件，详见[缺口登记](tracking/pending-source-gaps-2026-10-19.json)；不得据此增加完整项计数。L3待评审、全部产品验收未执行。

## 以下为2026-10-18历史进度快照（非最新）


本仓维护Procet-*的业务、界面、数据、模块接口、实施任务和研究依据。逐项Git交付，不打ZIP；文档编制、设计批准、产品实现和验收分别记录。

## 最新交付：CAP-03-01 CAD导入与几何读取

2026-10-18新增[业务规格](docs/capabilities/CAP-03-01/README.md)、[GUI/3D任务与字段](docs/capabilities/CAP-03-01/UI.md)、[R-CAD-001理论专题](research/topics/R-CAD-001.md)、[正反例](docs/capabilities/CAP-03-01/fixtures.json)与[逐项规则追踪](research/traces/CAP-03-01.json)。**纠偏：AP242现行引用应以2025 Edition 4为准**，2022版已撤回；CAD导入不应自动等于CAM Job/Setup/制造资格。详细规格17/88、工作包5/36；产品尚未验收。

## 前轮交付：F1-03公共面与领域副本

2026-10-18完成原本地草案复核与入库整理：[F1-03实施规划](docs/work-packages/F1-03.md)、[接线与边界审计矩阵](docs/work-packages/F1-03/01-boundary-audit-and-contracts.md)、[R-BOUND-001研究](research/topics/R-BOUND-001.md)、[来源登记](research/sources/F1-03.json)、[规则追踪](research/traces/F1-03.json)。10项实施子任务、10条设计规则、20条产品验收规格，均待评审/产品执行。

本轮复读CAM现有CamService、ports和边界审计：复用既有服务；修正“能力登记等于本次调用许可”的歧义；增加固定审计文件列表、内联path、请求路由和回退的覆盖要求。只修改规划仓，不修改产品代码。

## 统一导航

| 入口 | 内容 |
|---|---|
| [架构基线V0.8](docs/architecture/v0.8/README.md) | 11域、88项候选、36个工作包、17类业务资产 |
| [业务能力导航](docs/capabilities/README.md) | 当前16项详细稿，未列能力仍待深化 |
| [实施工作包](docs/work-packages/README.md) | 当前5项详细稿，原编号与依赖保留 |
| [数据Owner映射](docs/architecture/v0.8/C0-C1-reference-crosswalk.md) | 17类数据责任；不是字段级冻结 |
| [研究工作台](research/README.md) | 9个专题与规则追踪，前10项CAP补证仍待办 |
| [研究来源总索引](research/source-index.json) | 原61条登记＋本轮8条补充，按记录数统计，非去重原文数 |
| [进度台账](tracking/progress.json) | 编制/研究/评审/实现/验收分别计数 |
| [持续规划任务](tracking/planning-automation.json) | 范围、节奏和结束条件；实时状态以自动任务服务为准 |
| [协作规则](AGENTS.md) | 只改规划、安全、版权、非强制提交和回读要求 |
| [迁移待办](tracking/migration-2026-10-16.md) | 核心已迁，历史JSON/示例/脚本/支持附件尚待审计 |
| [变更记录](CHANGELOG.md) | 本轮和完整历史记录 |

## 进度与分支

规划分支包含详细CAP16/88、实施级工作包5/36、CAP研究追踪6项、工作包追踪3项。源记录合计69条，其中原61条访问记录原样保留，本轮重新读取8个专题来源。全部设计待评审、产品未验收，不能按来源数量认定领域研究完成。

本轮维护分支为gpt-ai/plans/cap-02-07-20261017。开始时main为271f2ad0、分支为6f906e32，main尚不含CAP-02-07/08。是否合并或存在PR必须读取GitHub实时状态，不能从本README自动推定。

下一项CAP-03-01「CAD导入与几何读取」；相关工作包F1-04按依赖推进，前10项研究补证和必要附件迁移穿插进行。

## 原型与验证边界

首批[界面总图](docs/capabilities/batch01-v0.9.1/02_界面设计/业务驱动界面总图.md)和[交互HTML](docs/capabilities/batch01-v0.9.1/02_界面设计/交互评审工作台.html)仍为示意原型，不是生产接线。GitHub展示HTML源码，未部署在线预览。

本轮核验见[记录](tracking/verification-F1-03-2026-10-18.md)。旧22项或6项数学测试是历史记录，不自动算本轮PASS。没有运行产品Rust/TS/OCCT/Windows EXE、真实动态消费者图或数据库回退验收。

公开仓库禁止密钥、授权URL、客户数据、未授权模型、私有源码整段镜像或标准手册盗版全文。保持一个Babylon主交互世界、统一任务容器与领域入口；CL→NC→执行语义→轴运动→验证→发布的责任边界不变。
