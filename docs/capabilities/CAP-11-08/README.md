# CAP-11-08｜人机授权与安全约束（V0.8实施级，L3待审）

**原88项业务定义**：「权限、冻结保护、审批和动作审计」，归属11域，保留[T5-01](../../work-packages/T5-01.md)与[T5-02](../../work-packages/T5-02.md)原编号。11域、88 CAP、36原编号工作包、17资产以及L1/L2都不改变；L3仅候选、未经人类审核。**这是规划，不是产品安全认证。**

## 业务威胁边界与状态机

Agent仅提出候选`ActionIntent`：绑定人类Principal与受约束Agent Delegation、Project、ScopeEpoch、ACL、Asset/Action、exact Revision/Hash/Frame/Unit、ChangeDigest、影响风险、Nonce、ExpiresAt、CancelGeneration及原始证据Hash。文档/RAG/工具返回/NC注释/现场事件均是不可信数据，不能成为授权指令；MCP网络令牌只证明指定资源的传输鉴权，不能跨资源透传，更不能代替本软件业务Owner审批。

受控状态为`REQUESTED→REVIEW_READY→PENDING_REVIEW→APPROVED→COMMIT_READY`，最终另由业务Owner提交产生不可变`COMMITTED Receipt`。`APPROVED`仅代表独立人类对**同一不可变Intent Digest和范围**授权；委托Agent不得替人类签署。业务Owner事务提交前必须重新校验ScopeEpoch/ACL、CAS的exact目标修订/Hash/Frame、Nonce时效及取消世代；人类提前批准不等于提交成功，也不等于获得机床实际启动权。任何撤权、失效、冲突或不明语义Fail-Closed为`REJECT/STALE/UNKNOWN`。网络超时不意味着业务未提交：已生效真实Owner回执仍须保留并对账，取消后的迟到ACK不得复活写入资格。

D08冻结A/B共享事实不原地覆盖，只能追加新修订或撤销记录。离线现场不能假定云端身份撤权可用；证据失效或无法校验时只能只读/人工复核，而非直接签发。任何明确安全拒绝均不能换CLI/API/账户绕过。

## 施工任务及来源→规则→字段→正反验收

|原任务|具体施工交付|追踪|正反验收|
|---|---|---|---|
| T01 | 身份主体、委托与Tenant隔离 | [R01](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T02 | Action/Asset/ScopeEpoch最小权限 | [R02](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T03 | 精确变更摘要、影响与指令污染 | [R03](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T04 | 独立人类审核与时效 | [R04](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T05 | A/B共享冻结和只追加修订 | [R05](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T06 | Owner Port提交前ACL/CAS/取消重验 | [R06](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T07 | 幂等Nonce/重放/取消晚回执 | [R07](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T08 | 最终NC语义与工程验证隔离 | [R08](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T09 | GUI/CLI/Agent与单Babylon世界 | [R09](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |
| T10 | 不可变审计与迁移独立消费者 | [R10](../../../research/traces/CAP-11-08.json) / 4字段 | 1正例+4单字段负例 |

[10份合法来源及章节/版本/访问限制](../../../research/sources/CAP-11-08.json) → [10条规则40字段、原包链接](../../../research/traces/CAP-11-08.json) → [50逐字段+31状态+6跨域共87项合成](fixtures.json) → [静态规划校验器](../../../tools/check_cap1108_planning.cjs) → [理论推导](../../../research/topics/R-HUMAN-AUTH-001.md)。合成Oracle仅判断规划数据与独立预期的一致性，不涉及真实密码学签名、人类身份或机床认证。

## 数据接口、3D和NC工程链

[业务契约样例](authorization-contract.example.json)与[17资产Owner候选](asset-owner-candidates.json)锁定原[D01-D17资产定义](../../architecture/v0.8/business-assets.json)。11域不取得原业务资产的新写权；CLI/GUI/Agent共同访问`11.ActionAuthorizationPort`，最终各域Owner Port独立事务重验并可拒绝。C0只共享身份、单位、Frame、Scope、Hash、Revision和协议，不发展巨型公用模型。[唯一Babylon/左TaskPanel](UI.md)使用单Engine/Scene/Canvas，横向切换工程/资源3D；最大12px、浅色/深色；3D拾取和动画均只读，不是提交。

D04名义Setup与D10实际执行绑定必须分别冻结。**中立D09 CL→D12 NC后处理→D13控制器执行语义→D14轴运动时序→D15独立最终NC工程验证→D16审核发布**。D11与CL动画不能替代D15，D13未知`UNKNOWN`不能发布，人工审批不能代替机床工程验证。不做材料扫掠仿真。

## 失效传播、回退和真实验收

原批准意图中任一ACL、SourceHash、D04/D10 Frame、NC Hash或人类ApprovalDigest发生改变，必须将后续派生证据标`STALE`并请求重新审核；冻结D08与旧D16包保持不可变。迁移采用影子读→新增readers→独立消费者签收→人类批准切写；消费者NACK退回旧只读，撤权后的写权限不能恢复。[独立消费者验收清单](independent-consumer-handoff.md)按05/08/09/10/01域分离。

规划测试入口 `node tools/check_cap1108_planning.cjs`。本轮V8等价**内存规划合成87/87**，真正Node文件运行、浏览器、身份服务、CAS事务、独立消费者、NC控制器和B5/三轴均`NOT_RUN`，L3和17资产Owner签署`PENDING_HUMAN`。**规划PASS≠产品PASS。**

## B54 增量：MCP跨Server工具身份/人类批准绑定

[专项证据](APPROVAL-TOOL-IDENTITY-B54-2026-10-31.md)固定Server/Tool/Schema/Catalog Epoch/参数/批准哈希与Owner CAS；本轮60为规划合成测试，原十规则与87项原验收不修改。独立Node、真实身份与17消费者NOT_RUN。
