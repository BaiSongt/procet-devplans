# R-INDEPENDENT-SLICES-001｜可证伪的独立纵向切片协作

**目的**：证明A和B能在不修改对方私有代码条件下，通过版本化接口从真实制造输入交付；不能用合成JSON或同进程Mock代替独立消费者。

- GitHub官方分支保护文档支持代码审查、版本和stale变更管控；不等于当前仓已启用，映射T5-05-R01/R02/R10。
- Pact验证文档说明Consumer对Provider请求重放、响应验证；仅HTTP技术参考，原生OCCT/NC需要独立进程与实机证据，映射R03/R08。
- OpenAPI 3.1.1公开规范提供接口结构与Schema描述；不实现Owner语义，映射R03/R04/R06/R08。
- W3C PROV-O的Entity/Activity/Agent帮助记录来源谱系，不能证明真实性，映射R01/R03/R04/R09/R10。
- RFC9110 §13.1.1 If-Match是HTTP防失落更新规则；本系统业务CAS须额外检查Frame/scopeEpoch/aclEpoch/撤权/取消，映射R07。
- NIST SP800-218 v1.1**只读取官方目录与摘要**，不声称未读实践条款，映射R02/R07/R09。
- ISO14649-10:2004**只读ISO公开目录/摘要**；LinuxCNC2.9 G54-G59.3代表该软件的行为；OCCT8.0.1 TopExp_Explorer只证明API存在。不能用三者推断任意控制器验证通过，映射R05。

**正反验证设计**：A文档hash或Frame改变拒绝；B D13 UNKNOWN/NC与验证Hash不同拒绝；撤权后CAS和取消晚回执拒绝；A独立回退不得覆盖B发布。R01~R10映射到字段、来源及30项合成正反/变异，**规划30/30不等于产品/真实Consumer PASS**。

[来源阅读范围](../sources/T5-05.json) · [追踪规则](../traces/T5-05.json) · [工作包](../../docs/work-packages/T5-05.md)。
