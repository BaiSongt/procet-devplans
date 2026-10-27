# R-AGENT-ORCHESTRATION-001｜Agent工具编排的受控副作用、取消竞争与证据闭包

2026-10-27；研究类型：公开规范定点核对＋本仓工程设计推导（非产品实测）。[合法来源及实际阅读深度](../sources/CAP-11-04.json) → [字段规则](../traces/CAP-11-04.json) → [正反固定案例](../../docs/capabilities/CAP-11-04/fixtures.json)。

## 技术推导

1. MCP 2025-11-25 **Tools**包含工具枚举、元数据和输入Schema，以及人类可拒绝调用的人机交互建议。它没有保证某一工具在Procet内拥有业务Owner资格。实现层必须把Tool声明映射到指定`OwnerPort`，使能力发现与单次执行授权分离。
2. MCP **Authorization**明确HTTP传输授权可选；STDIO有不同凭据处理。跨域权限应由最终业务Owner基于当前Principal、ScopeEpoch、对象ACL重验，不能把模型选择工具、OAuth Token存在、缓存ACL三者误认为提交许可。
3. MCP **Cancellation**通知可到达过晚甚至被忽略，**Tasks**当前为实验性，和普通请求有不同取消语义。编排必须在Owner最终commit时进行CAS/取消重验；若之前已提交，必须对账或补偿，不能将已发生事实伪称未执行；队列后续动作在取消后不得再发。
4. OWASP 2025 **LLM06**把功能过宽、权限过高、自主程度过大列为风险根因；**LLM01**指出外部工具结果可携带间接提示注入。工具结果一律不可信数据，只有结构验证与Owner Receipt能驱动系统状态，而非模型生成文字。
5. RFC 9110 §13.1.1和§13.2说明If-Match防并发丢失更新是HTTP条件语义。Procet扩展到业务CAS、ScopeEpoch、幂等Digest只是**设计决定**，不是RFC规定制造端语义。
6. W3C PROV-O的Entity/Activity/Agent关系适合表示用户、工具动作、Owner结果来源。NIST AI 600-1仅官方出版著录摘要作风险管理背景，不引用未读PDF章节；OpenTelemetry 1.44.0 GenAI语义仅用于关联Span，不替代D17业务审计或D15工程验证。

## 适用域、限制与负例

- **同事实A/B**：只持引用/新修订，不覆写冻结D08；检索/模型更换不能提升权限。
- **坐标与执行绑定**：Frame连同revision/hash随行动封存；D04 Setup和D10执行绑定独立，UNKNOWN控制器语义不可默认为已支持。
- **工具/模型中断**：重试同idempotencyKey必须锁定同actionDigest；取消与写入竞态区分`CANCELLED_BEFORE_COMMIT`、`COMMITTED_BEFORE_CANCEL_RECONCILE`。
- **工程闭包**：CL/Agent路径预览无安全结论，最终NC必须完整D12→D13→D14→D15再由D16独立批准；本规划不做材料扫掠仿真。
- **待实证**：真实Agent模型抵抗注入、权限竞态、异步取消、Rust/TS Port、NC与B5、独立消费者、离线资源均`NOT_RUN`。所有标准公开网页仅是引用版本阅读范围，不可据此作产品认证。

## 接口验证

理论的10项工程规则均为可反证的具体布尔要求与独立枚举门禁；必须实现为实际结构字段/业务约束后再测试，当前的50+24规划案例不是产品执行。L3与17资产Owner会签`PENDING_HUMAN`。
