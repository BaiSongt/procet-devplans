# CAP-11-04｜工具注释不可信与OAuth资源受众/Owner双授权补证（B104）

> 2026-11-02；沿用11域88项CAP、36原编号工作包、17类资产；L1/L2不变，L3待审。关联原T5-01/T5-02，D01/D05/D08/D10/D13/D14/D15/D16/D17。**规划PASS≠产品PASS。**

## 业务反例与新的工程防线

**Tool标注readOnlyHint=true并不证明真实无副作用。** MCP 2025-11-25 Tools公开章节和2026-03-16维护者文章分别界定Tools Annotations与风险提示：来自不可信server的注释不能作为授权。11域Agent先固定Tool注册名称、Schema Digest，调用目标领域Owner Port取独立确认的`ownerEffect`。如果OWNER实际是WRITE，即使hint显示只读，仍要用户独立确认同一ActionDigest/Scope、业务Owner在提交点ACL/ScopeEpoch/Revision/原字节Hash/Frame/CAS/取消世代重验。反向Owner READ但Hint写风险也不能被模型注释强改身份。

**A资源Token被转发给B资源的Confused Deputy风险。** MCP Authorization 2025-11-25公开受众约束以及RFC8707 §1–3用于HTTP OAuth Resource Audience/Resource参数防跨资源误用；禁止Token Passthrough。STDIO按本地进程身份另外绑定，不套HTTP假Token。**即使OAuth验证PASS，也不等于Procet Project/Domain Owner有写权限。**

**工具目录变更与晚回执风险。** 复核tools/list与tools/call的name/schemaDigest，如发生漂移返回STALE；不可信工具结果仅数据，不把其文本晋升授权命令或Owner Receipt。真实Owner已在取消之前提交时必须RECONCILE并保留回执；取消先到不允许迟来ACK恢复写资格，同idempotencyKey不同payloadDigest必须REJECT。

## 可施工的八条新增规则（不改变既有十项任务）

|规则|约束和可测字段|原工作包|
|---|---|---|
|B104-R01|readOnlyHint只是未经可信Owner核实的风险提示；WRITE仍须人审；`tool.hint / tool.ownerEffect / approval.human`|T5-01 / T5-02|
|B104-R02|tools/list与tools/call的name及schemaDigest严格一致，漂移为STALE；`tool.schema / intent.schema / tool.name / intent.name`|T5-01 / T5-02|
|B104-R03|HTTP OAuth目标Audience校验且不得Token Passthrough；STDIO用本地身份；`auth.kind / auth.audience / auth.expectedAudience / auth.passthrough / auth.localIdentity`|T5-01 / T5-02|
|B104-R04|Owner提交前重验ACL/Project/ScopeEpoch/exact Revision/原字节Hash/Frame；`owner.acl / owner.scopeEpoch / owner.currentScopeEpoch / owner.hash / owner.currentHash / owner.frame`|T5-01 / T5-02|
|B104-R05|Tool结果不执行指令、不冒充Owner Receipt，回执锁定Task Generation；`result.dataOnly / result.receiptValid / result.generation / result.currentGeneration`|T5-01 / T5-02|
|B104-R06|真实WRITE需要独立人类同一ActionDigest确认以及业务Owner CAS；`approval.human / approval.digest / intent.digest / owner.cas`|T5-01 / T5-02|
|B104-R07|取消晚回执不可新写；取消前真实已提交必须RECONCILE，重试同Digest；`commit.cancelled / commit.committedBeforeCancel / commit.cancelEpoch / intent.replayDigest`|T5-01 / T5-02|
|B104-R08|GUI/CLI/Agent共用Port；单Babylon和左TaskPanel；D04不等于D10；D13未知阻D16；旧读回退；`ux.commonPort / ux.babylonWorlds / ux.leftPanel / nc.d04D10Separated / nc.d13Known / nc.d15Real / migration.rollbackRef`|T5-01 / T5-02|

[七项合法分级来源](../../../research/sources/CAP-11-04-tool-hint-b104.json) → [八规则/字段/原包](../../../research/traces/CAP-11-04-tool-hint-b104-v08.json) → [42项正反与UNKNOWN/取消/对账合成](tool-hint-b104-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap1104_tool_hint_b104_v08.cjs) → [验证等级](../../../tracking/cap1104-tool-hint-b104-verification-2026-11-02.json)。本轮V8同一judge合成42/42符合预期，类别PASS:9；REJECT:16；STALE:8；UNKNOWN:6；CANCELLED:2；RECONCILE:1；不是独立Node整文件执行或产品通过。

## GUI/CLI/Agent、Owner、迁移及NC边界

GUI、CLI、Agent使用同领域唯一Owner Port，3D仅一个Babylon Engine/Scene/Canvas，左统一TaskPanel，不出现右Drawer，浅/深主题，字号≤12px。工具风险提示和Owner可信副作用应同时显示但不能互相替代。Agent只有草案/只读预览权限，无隐含超级管理员。C0仅放身份、Scope、Revision、Hash、Frame与协议，不塞工具/NC领域巨型对象；A/B共享同一事实、禁止覆写D08冻结。旧Gateway Expand为只读兼容→独立消费者新旧比对→人审批准Migrate→Contract；出现失效就rollbackRef回旧读路径，不删旧原字节。

D04工艺Setup≠D10实际机床执行绑定；D09中立CL→D12最终NC后处理→D13控制器执行语义→D14Joint时序→D15独立NC工程验证→D16发布。D13未知为UNKNOWN且阻止D16；CL动画不冒充D15，**不做材料扫掠仿真**。D17现场接收必须由独立进程/消费者证明，不可用发布端ACK代替。

## 来源阅读深度与局限

- MCP Tools、Authorization、Security Best Practices：仅2025-11-25版本合法公开HTML指定章节；指导工具与传输权限，不证明Procet SDK实现。
- Ola Hungerford / Sam Morrow / Luca Chang，2026-03-16维护者博客定点阅读；其中提案不是已生效协议条款。
- Brian Campbell / John Bradley / Hannes Tschofenig，RFC8707（2020-02）§1–3公开正文；是OAuth资源受众设计，不是工程或机床许可。
- Anders Rundgren / Bret Jordan / Samuel Erdtman，RFC8785（2020-06）仅§1与§3结构/简介；尚未执行规范化算法，不能宣称JCS Digest兼容。
- [原CAP-11-04内部规划](README.md)的Git Blob `afbb467e0b60f9ceb6a2d50c4004f25fbec9ed15`真实回读，Owner/GUI/NC边界属于本产品内生约束，不转嫁给外部规范。

待实际固定代码SHA与schema/profile，独立Agent/Owner/消费者执行伪造Hint、OAuth跨Audience、权限撤销、schema漂移、真实CAS、取消竞态和NC D15验收。**独立Node整文件、真实MCP/OAuth/Owner/Agent、D15/B5/OEM、17独立消费者仍NOT_RUN，正式Owner0/17、L3待审、历史附件原始字节及全仓GFM AST未闭合。**
