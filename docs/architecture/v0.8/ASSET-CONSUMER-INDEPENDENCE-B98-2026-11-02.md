# B98｜17资产实际独立消费者的同域盲点与签署证据终核补证

2026-11-02｜**NEWLY_AUTHORED规划补证**。关联CAP-01-04、CAP-10-08、CAP-09-03与原编号B0-02/F1-01/E3-05/E3-06/T5-03。原11域88 CAP、36工作包、17资产均未改编号。参考exact父HEAD `eeaa10c0d1f736d035ca6de840f9547a7399e109`，原资产业务图Git Blob `dad461aec34aefa773a9a22b07b6b742be60e052`，Owner候选Blob `17e5dba8e767e7a9ac8f6cb0fb07b2c5ee281c22`。

## 新增发现：17项资产并非全部天然具备跨域消费者

GitHub固定原文[业务资产定义](business-assets.json)具有17资产、44条有向输出边且每条输入反向列示一致。[候选Owner Port](owner-interface-review-v08.json)可导出**15份可选择的跨域业务消费者 + 2份只有同域输出的资产**：

- **D14→D15（09域内）**：轴时序生产与NC工程验证同属09域。必须指定**独立的D15读取实现/二进制/测试执行者**及不同代码修订、运行日志，不能用D14自测替代D15；否则状态是`NOT_RUN`。
- **D16→D17（10域内）**：审批发布与现场反馈同属10域。必须由**独立现场读取/交接实现**核实D16确已交付的NC与回执；不能用D16本地写入成功动画冒充D17现场执行。

这里“跨域”只是领域Owner不同，不自动证明人员、执行进程或实现独立；其他15份同样需要真实独立Consumer验收。对于D14与D16，不擅自修改原44条边，不虚构新的第18项资产或新Consumer责任人；先标记必须证明**同域不同实现**，若组织明确要求完全跨域，由人类评审补充新只读审计消费者契约。

## 17项独立验收优先矩阵

[机器可读矩阵](asset-consumer-independence-b98-v08.json)对D01—D17各选一条实际原有消费边、锁定候选Owner读Port、Frame义务及**各自独有的业务负例**；[合成测试集](asset-consumer-independence-b98-fixtures-v08.json)仅验证结构和伪造审批的拒绝，不能证明这些17个真实业务负例已经跑过。每条需要记录双方团队、两个不可变代码修订、实际Object Revision/Hash/Frame、Scope、环境、单项正反日志、rollbackRef与审批时间。签署前一律`PENDING_HUMAN / NOT_RUN`。

**关于哈希**：固定Git Blob SHA用于证明这次规划表的原始Git对象；产品CAD/CL/NC必须按**原字节的明确算法与域**绑定内容摘要。JSON若采用[RFC8785](https://www.rfc-editor.org/rfc/rfc8785.html)标准化，必须另列canonicalization profile；无版本的`JSON.stringify`不能冒充JCS或业务签名。NIST IR 8536（2026-09-09）官方摘要讨论可验证溯源与选择性披露，是**方向参考**而不是已对Procet的具体字段或设备做了认证。

## 证据→规则→字段→CAP/包→正反验收

[7条分级合法来源](../../../research/sources/FINAL-ASSET-INDEPENDENCE-B98.json) → [8条可追踪规则](../../../research/traces/FINAL-ASSET-INDEPENDENCE-B98-V08.json) → [1正+46独立单字段反例](asset-consumer-independence-b98-fixtures-v08.json) → [只读Node脚本](../../../tools/check_asset_consumer_independence_b98_v08.cjs) → [执行层级记录](../../../tracking/asset-consumer-independence-b98-verification-2026-11-02.json)。

本次在V8中用与脚本相同的`judge`规则得到**47/47合成预期一致**，17项资产业务负例**只编成验收规格，尚未执行**。独立Node整文件进程、任何真实生产/消费二进制、ACL撤权回放、真实NC/机床均`NOT_RUN`。本轮没有人类Owner会签，也没有提交可信消费者证据。

## 统一入口、数据修订与工程限制

GUI/CLI/Agent复用同领域Owner `readExact`，统一左`UnifiedTaskPanel`，单Babylon Engine/Scene/Canvas、只一个活动3D，浅/深主题、字体≤12px。业务写入由Owner Port做ACL/ScopeEpoch/expectedRevision/Hash/Frame、CAS及取消代次重验；晚ACK不能恢复撤销的许可。A/B共用工程事实，冻结D08不得覆写。D04名义工艺Setup与D10具体机床执行绑定严格分离；D09中立CL→D12最终NC→D13模态与控制器语义→D14轴时序→D15独立验证→D16批准发布，D11仅CL预检查；UNKNOWN不能放行D16；不做材料扫掠仿真。

**迁移/回退**：任何消费者新接口先影子读取→旧新Schema并行比对→独立真实验收→人类批准→切换；失败根据旧Revision/Receipt/Reader版本回退，不反写冻结、保留来源审计。L1/L2维持原文，L3待人审；历史附件原始字节仍有待审计项。**规划PASS≠产品PASS。**
