# R-HUMAN-AUTH-001｜人机授权、撤权/审批竞争与Owner责任

关联[CAP-11-08](../../docs/capabilities/CAP-11-08/README.md)，原T5-01/T5-02。来源：[10项作者/版本/出版时间/URL/2026-10-27访问章节及局限](../sources/CAP-11-08.json)；规则：[10条40字段](../traces/CAP-11-08.json)；合成：[87项正反/状态/NC跨域](../../docs/capabilities/CAP-11-08/fixtures.json)。全部属于业务规则推导而非标准认证。

## 阅读深度及版本注意

NIST SP 800-63-4及63B-4为**2025-07 Final**，只核对官方出版信息/摘要；2026-10-06实施资源消息不是新标准版次。NIST SP800-53 Rev5官方出版目录及2025-08-27 Release5.2.0提示已核对，**未读具体控制条款**。OWASP Agentic Top10 2026与LLM Top10 2026仅查看官方资源简介，未阅读全文PDF。MCP**2026-07-28**授权/安全公开小节包括令牌Audience与Passthrough风险；与2025-11-25规范兼容性另审。RFC9110 §13.1.1、§13.2和RFC8785 §3用于条件更新/规范化摘要，W3C PROV-O用于来源关系。这些标准均**未**对Procet实际机床或产品作检验。

## 来源→工程推导

身份是谁、可访问指定网络资源、授权某个单独业务操作、Owner实际提交、D15工程验证、D16签发许可是六个不同证据域。构造`Intent=(Principal,Delegation,Project,ScopeEpoch,ACL,Action,Asset,ExactRevision,Hash,Frame,ChangeDigest,Nonce,Expiry,CancelGeneration)`，人类签名必须对绑定摘要和明确副作用。Agent只有Proposal能力，绝不能在Approval阶段自行声明人的许可；即使Approval有效，Owner仍要实时重验并可否决。要求无法实时验证撤权时离线只读，不能借网络不可用提升权限。

Race推导：提交先完成后取消，必须保留真实Receipt并对账；取消先到则禁止新事务提交；仅有迟到ACK而无已提交证据时`QUARANTINED`且不重试产生第二次副作用。Request超时≠Owner未提交。Http If-Match只覆盖Representational条件，不是多领域业务Owner事务CAS。Digest稳定比较不意味着真实人类已批准。

D04 Setup与D10机床执行绑定有不同Owner与修订。D09中立CL只代表运动意图，真正NC验证为D12→D13→D14→D15，未建模控制器命令为`UNKNOWN`并阻D16；CL动画和人类Approval均不冒充D15。A/B共享同一事实，不回写冻结D08，不开发材料扫掠仿真。UI单Babylon与左TaskPanel只是规划约束，实际产品尚未验证。

**证据局限：** [检查入口](../../tools/check_cap1108_planning.cjs)仅静态合成，真实账户、权限撤回竞态、NC/B5、独立消费者和审批签章均`NOT_RUN`；17资产Owner及L3仍`PENDING_HUMAN`。
