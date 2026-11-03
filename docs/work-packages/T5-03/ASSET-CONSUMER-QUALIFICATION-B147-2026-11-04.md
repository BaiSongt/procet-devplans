# B147｜T5-03 17类业务资产Owner/独立消费者资格矩阵（2026-11-04）

**规划补证，L3待人类评审；不改变11域/88 CAP/36原编号包/17资产及L1/L2。** 这是对原T5-03《跨仓发布列车与兼容窗口》的跨域验收落地，不是新增工作包或真实签署。

## 1. 发现与决策

已有D01—D17候选Owner列表虽完整，但同域团队自测、字段存在或生成签收回执，都**不能证明**另一实现能读取完全相同的业务事实。为此新增[17资产逐项交接矩阵](asset-consumer-matrix-b147-v08.json)：每个D资产保留[基线](../../architecture/v0.8/business-assets.json)中原Owner及上/下游，明确Producer Owner Port、拟验Consumer Port、必须交接的精确字段、至少四种负例、回退机制以及现实签署状态。所有Consumer只是**候选**，正式Owner签名0/17，独立消费者真实运行0/17。

特例：D12→D15绕过同域D13自证，D14→D15虽在09域但必须**不同代码实现/进程**独立验收；D04名义Setup不许冒充D10实装，D11 CL_ONLY不提升D15。D12原NC→D13语义→D14Joint时序→D15独立验证→D16授权发布，不作材料扫掠仿真。

## 2. 外部研究与能引用的边界

[5条分级来源](../../../research/sources/T5-03-consumer-qualification-b147.json)：JSON Schema Draft 2020-12官方入口（Wright等，2022-06-16）阅读版本、Core/Validation概述；RFC 9110（Fielding等，2022-06）实读§13.1.1的**强比较 If-Match**，其为CAS类比而非本软件的实现；W3C PROV-O（Lebo等，2013-04-30）仅著录与基础Entity/Activity/Agent概念；NIST SP 800-218 v1.1（Souppaya等，2022-02-03）只读官方出版摘要，不引述未读正文；本仓固定HEAD T5-03和17资产基线为内生业务来源，非外部论文。日期、URL、章节点和局限逐条在来源JSON。2025-12-17 SP800-218 Rev.1仍为Draft，不能把它当Final。

**来源不自动授权规范扩展**：17个Owner Port名称、候选Consumer、CAS与NC工程门禁都是本规划设计，待产品团队独立验证，不归因于RFC或NIST已认证。

## 3. 来源→字段级规则→原工作包→正反验收

|规则|工程决策|字段数|机器判定|
|---|---|---:|---|
|B147-R01|17资产ID与候选Owner枚举保持不变|4|1正4个独立单字段反；失败为 `ASSET_SET_MISMATCH`|
|B147-R02|每资产指定唯一生产者Owner Port与跨域读契约|4|1正4个独立单字段反；失败为 `OWNER_PORT_UNRESOLVED`|
|B147-R03|独立消费者具备可核进程/算法/Fixture来源|4|1正4个独立单字段反；失败为 `INDEPENDENCE_NOT_PROVEN`|
|B147-R04|任何交接对象以exact Revision/hash/Frame及schema锁定|4|1正4个独立单字段反；失败为 `EXACT_REF_MISSING`|
|B147-R05|提交前CAS权限重验与取消晚回执必须拒绝|4|1正4个独立单字段反；失败为 `STALE_OR_REVOKED`|
|B147-R06|D04/D10与CL/NC链分层且UNKNOWN阻发布|4|1正4个独立单字段反；失败为 `NC_GATE_UNVERIFIED`|
|B147-R07|所有入口共域Owner且渲染只有单Babylon左容器|4|1正4个独立单字段反；失败为 `UI_PORT_DIVERGENCE`|
|B147-R08|真实签署/消费者仍未发生时不得由规划判为通过|4|1正4个独立单字段反；失败为 `FALSE_PRODUCT_ACCEPTANCE`|

[8条规则/32独立字段与来源映射](../../../research/traces/T5-03-consumer-qualification-b147-v08.json) → [8正32反+17资产静态样本+8状态Golden](consumer-qualification-b147-fixtures-v08.json) → [只读Node检查器](../../../tools/check_t503_consumers_b147_v08.cjs) → [执行分级](../../../tracking/t503-consumer-qualification-b147-verification-2026-11-04.json)。

## 4. 17资产签署与独立消费者交接门槛

每个资产需由真实业务Owner签署精确版本/内容Hash/Frame/Unit/Scope/Schema及ACL策略；消费者在**不同实现路径**实际读取原始业务对象，对错版、错帧、撤权、取消晚回执、旧reader回退给出独立日志与可定位失败。会签证据至少包含受控标识、实际build hash、环境、执行命令/退出码、测试向量digest、审核主体及日期。私有制品SHA不得放在公开规划仓；只能记录审核流程和不敏感结果。当前所有签署与真实消费者仍0/17。

GUI/CLI/Agent共用业务Owner Port，单一Babylon Engine/Scene/Canvas与左UnifiedTaskPanel；仅预览零写入。Owner事务提交前按scopeEpoch/ACL/CAS expected head、Revision/hash/Frame、取消世代重验；已提交真实Receipt保留对账，旧任务晚ACK不得晋升新事务。Expand/Migrate/Contract保持双读与旧Schema回退，D08冻结和用户工程不受损。

## 5. 验收与不能替代的步骤

本轮只检查矩阵17唯一ID、字段规则来源引用、8正32独立单字段反及跨域候选声明的**结构性一致**。40个Fixture全是合成，Goldens为状态期望，Node独立文件进程、17资产实际读取、GUI、真实NC/OCCT、B5/OEM、Windows安装包、完整GFM AST及历史附件原字节均未运行或未审计。资料和编排规划即使PASS，产品仍NOT_RUN；L3待人工。**规划PASS≠产品PASS**。
