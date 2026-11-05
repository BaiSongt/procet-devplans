# B167｜CAP-05-05 选择性采纳的传递前驱闭包与D07材料前态（2026-11-04）

> NEWLY_AUTHORED规划研究。11域88CAP/36原编号工作包/17资产不变，L1/L2不变L3待审；规划PASS≠产品PASS。

## 本轮纠正的实际逻辑缺口

D06候选优先关系为 `A→C、B→C、C→D`，X为不相关工序。若仅选D且旧D05已满足A、B，仍**缺少间接必需前驱C**。仅检查DAG无环或检查D的直接入边、仅显示拓扑顺序，不能颁发局部接管资格；所选节点的传递祖先必须全部由**本次选中**或**同Setup且材料前态精确匹配的基线**满足。对边集增加D→A形成环，需拒绝。图库的图算法只能证明图关系，不证明去料体或切削安全。

Rust [petgraph 0.8.3 toposort](https://docs.rs/petgraph/latest/petgraph/algo/fn.toposort.html)公开API明确有环返回Err，时间O(V+E)；[NetworkX 3.7 DAG](https://networkx.org/documentation/stable/reference/algorithms/dag.html)提供ancestors、topological_sort与DAG检测。该算法不能代替D07实体几何验证。Google [OR-Tools Job Shop](https://developers.google.com/optimization/scheduling/job_shop)将任务优先约束和机器NoOverlap独立处理；Procet D05材料工序因果图不得误写成设备作业排程。

**原W2-02**负责候选到D05新修订的局部接管及冻结；**W2-03**提供实例级依赖图/失效闭包；**W2-05**保障Setup稳定身份与三入口交互。这是同一11域内既有CAP/包补证，没有增设编号。

## 强契约与反例

- 精确来源：D06候选run/算法与原生拓扑，D04名义Setup Frame、D07前后状态及保护区独立Oracle，D08不可变冻结及旧D05 expectedRevision、全部scope/revision/hash；不得使用`latest`、列表位置或Render face索引充当稳定ID。工艺A/B共享事实，不能共享互相覆盖的可写HEAD。
- 有序去料前态：D07工序i的postState必须被实际后继j按exact ref作为preState读取；多前驱不许未经几何组合证明即声称同一材料快照，图无环不能解除这一条件。无证据为`UNKNOWN_MATERIAL_STATE`，禁止假定Stock已去料。
- 左TaskPanel展示`Selected / BaseSatisfied / MissingAncestors / Unaffected`；只用单Babylon Engine/Scene/Canvas，GUI、CLI、Agent走同一D05 Owner Port，3D拾取只是提案。
- D05 Commit必须在写点重验CAS expectedRevision、ACL、取消/任务代次、Frame与source hash，成功后真实持久回执并仅追加新修订。迟到回执拒绝，冻结D08和发布D16历史保留，旧Reader兼容/只读双读后再迁移，失效仅传播受影响依赖闭包。
- D04 Setup≠D10执行机床绑定；中立D09 CL→D12后处理→D13最终NC执行语义→D14轴时序→D15独立NC验证→D16发布。UNKNOWN阻断发布，CL动画不冒充NC工程验证，不做材料扫掠仿真。

## 来源→规则→字段→CAP与原工作包→机器正反

|规则|主题|字段|
|---|---|---|
|B167-R01|候选DAG顶点端点与拓扑序固定身份|`graph.nodes`, `graph.edges`, `graph.order`, `graph.sourceHash`|
|B167-R02|所选稳定工序须覆盖传递先祖或有精确基线满足|`pick.selected`, `pick.baseSatisfied`, `pick.ancestorClosure`, `pick.complete`|
|B167-R03|D07有序去料前后状态及保护区资格|`stock.preRef`, `stock.postRef`, `stock.frame`, `stock.protection`|
|B167-R04|D08冻结隔离与A/B分叉不可原位覆盖|`freeze.exactRef`, `freeze.unchanged`, `freeze.noCollision`, `freeze.forkMode`|
|B167-R05|D06/D04/D07跨域精确来源绑定|`source.d06`, `source.d04`, `source.d07`, `source.scope`|
|B167-R06|GUI/CLI/Agent单Owner入口与单场景左TaskPanel|`preview.sameOwnerPort`, `preview.noWrites`, `preview.singleWorld`, `preview.leftPanel`|
|B167-R07|D05提交CAS/ACL/取消晚回执双重栅栏|`commit.expectedRevision`, `commit.aclRechecked`, `commit.cancelFenceFresh`, `commit.persistedReceipt`|
|B167-R08|D09中立CL与D13-D16工程验收分离|`handoff.d08Immutable`, `handoff.d13UnknownBlocks`, `handoff.noClAsD15`, `handoff.d16NotApproved`|

[8份来源及阅读限制](../../../research/sources/CAP-05-05-dag-closure-b167.json) → [8规则32字段、CAP/原包及验收ID](../../../research/traces/CAP-05-05-dag-closure-b167-v08.json) → [8正32独立单字段反例、8图Goldens](dag-closure-b167-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0505_dag_adoption_b167_v08.cjs) → [分层核验](../../../tracking/cap0505-dag-adoption-b167-verification-2026-11-04.json)。

合成Goldens验证四节点依赖闭包及孤立X、反向成环、错误拓扑序、冻结冲突和D13 UNKNOWN发布阻断。字段反例每次仅改动一个字段。数学案例均是**虚构必要条件演示，不构成产品算法或加工验证**。

## 作者、版本、时间、访问范围与局限

|来源ID|公开证据/阅读范围|局限|
|---|---|---|
|B167-S01|petgraph contributors；0.8.3；2026-11-04访问；[链接](https://docs.rs/petgraph/latest/petgraph/algo/fn.toposort.html)；Returns/Complexity；公开API章节实读；有环返回Err，O(V+E)|仅拓扑性质，不证明加工安全|
|B167-S02|NetworkX contributors；3.7 stable；2026-11-04访问；[链接](https://networkx.org/documentation/stable/reference/algorithms/dag.html)；ancestors/topological_sort/is_directed_acyclic_graph目录；公开稳定算法目录实读；未逐一打开全部API实现|祖先关系不证明D07材料几何|
|B167-S03|Google OR-Tools team；网页无固定版次；2026-11-04访问；[链接](https://developers.google.com/optimization/scheduling/job_shop)；Constraints / AddNoOverlap / precedence；官方Job Shop教程对应段落实读|机床排程资源互斥不是D05材料依赖关系|
|B167-S04|Thomas R. Kramer等 / NIST；ICRA 2000；网页2017-02-17更新；[链接](https://www.nist.gov/publications/automated-hierarchical-process-planning-system)；作者/出版时间/Abstract；NIST官方摘要实读，论文全文未读|只能支撑Setup/特征分层规划的研究背景|
|B167-S05|ISO / TC184；Edition 2，2004-12；2024复审确认；[链接](https://www.iso.org/standard/40895.html)；目录Abstract: workplans, workingsteps；官方合法目录摘要实读，付费正文未读|不得编造条款或由目录推出Procet事务语义|
|B167-S06|Luc Moreau、Paolo Missier / W3C；Recommendation 2013-04-30；[链接](https://www.w3.org/TR/prov-dm/)；Abstract / derivation / revision；W3C公开标准首页及派生/修订概念定点实读|不规定Procet ACL、CAS或业务冻结|
|B167-S07|BaiSongt / Procet；0260ab49c8b2903714bf61b4d8b1e1ae9ab3bbc9；[链接](https://github.com/BaiSongt/procet-devplans/blob/0260ab49c8b2903714bf61b4d8b1e1ae9ab3bbc9/docs/capabilities/CAP-05-05/README.md)；业务流程/数据/Owner/验收；固定GitHub HEAD全文实读；Blob 2cb5780b916e6cc085c124df7b5406aa6d7432d5|内生GUI/领域约束不是外部标准|
|B167-S08|BaiSongt / Procet；0260ab49c8b2903714bf61b4d8b1e1ae9ab3bbc9；[链接](https://github.com/BaiSongt/procet-devplans/blob/0260ab49c8b2903714bf61b4d8b1e1ae9ab3bbc9/docs/work-packages/W2-02.md)；原子任务/候选采纳/冻结/回退；固定GitHub HEAD全文实读；Blob df516bbd879c4537e528724bb3729d0d0c9252dc|人类Owner正式签字仍0/17|

NIST Kramer等[2000分层计划论文](https://www.nist.gov/publications/automated-hierarchical-process-planning-system)仅官方摘要；[ISO 14649-10:2004](https://www.iso.org/standard/40895.html)仅合法目录摘要，未获得付费条款全文，故不宣称阅读或引述未读条款；W3C [PROV-DM 2013](https://www.w3.org/TR/prov-dm/)仅支持来源派生表示，不规定Procet授权CAS、D08冻结和GUI。

## 交付与真实测试界限

本轮V8内存同判据48/48规划Fixture符合预期。独立Node完整文件执行、D05 Owner服务、D07真实OCCT几何、D09–D16最终NC独立消费者、17资产正式签署均为NOT_RUN；L3人工审批、全仓GFM AST、历史原附件原始字节仍开放。独立消费者应另行以相同exact源产生正反/取消/撤权/版本漂移回执，不得复用本合成PASS作为跨域签署。**规划PASS≠产品PASS。**
