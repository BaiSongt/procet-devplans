# R-DEPENDENCY-INVALIDATION-001｜版本化依赖图、最小失效闭包和证据资格
[原W2-03](../../docs/work-packages/W2-03.md) · [9条来源](../sources/W2-03.json) · [10规则20正反](../traces/W2-03.json)

**理论问题**：制造工艺、几何、CL、最终NC与机床执行有不同事实Owner、修订、帧和缓存。在同一项目双Setup、多分支、局部冻结场景，如何既不漏判真实依赖，又不因界面变化/资源离线把所有结果宣告无效？

- **外部事实**：ISO 14649-10:2004官方Abstract介绍workplan/workingstep并声明需要技术特定分册，不能据此编造变更传播条款。W3C PROV-O的wasDerivedFrom/wasRevisionOf与invalidatedAtTime支持时间化谱系描述，但不负责领域ACL、CAS或材料状态正确性。
- **计算类比**：Bazel Remote Caching公开Overview强调动作显式输入/输出及内容寻址，借鉴“来源闭包决定缓存重用资格”，但软件构建可重复不等于NC程序可加工。Git rev-list的ancestry路径体现版本可达性的查询方法，不把Git提交关系直接当制造工艺依赖模型。
- **NIST时效性**：NIST IR 8536**最终版已于2026-09-09发布**，本轮仅阅读官网出版摘要/版本历史，不继续引用2025第二公开草案为“最新”；其供应链可追溯框架用于跨域证据背景，不是Procet具体DAG算法。NIST GCR24-057只核对出版条目/Abstract。
- **边界**：OCCT 8.0.1 BRepCheck_Analyzer::IsValid不构成求解可行或NC程序验证；RFC9110 §13条件头可类比CAS但不实现本地事务；RFC8785仅提供受I-JSON约束的序列化方案，未选择产品哈希编码前不得声称跨语言同字节。
- **Procet设计选择**：分离`business_type_graph`（允许跨修订反馈）与`immutable_revision_provenance_DAG`（无环）；失效依据实例级exact revision/hash/frame/branch/Setup/scope及边来源执行“最小可达旧消费者集合”。NC字节编辑不触及旧D09中立CL和D11 CL预演；D13/D14/D15/D16逐层重新验证，UNKNOWN不是PASS。不覆盖D08冻结原字节。
- **可证伪目标**：`W203-R01..R10`各具来源ID、字段、资产、1正1反合成样例；含环/失帧/窜Scope/过宽失效/丢失CAS/拒绝权限/取消晚回执/假PASS；合成测试≠产品验证。D17反馈历史不可变，新方案只能再生成后继修订。
