# W2-04｜独立进程消费者交接（规划）
[实施](../W2-04.md) · [正反与强杀场景](fixtures.json) · [追踪](../../../research/traces/W2-04.json)
01域协调器不拥有任何其他领域Owner写权。04域提供D04名义Setup与D10机床执行绑定两个精确引用；05域提交D05后继草稿且验证D08冻结只读；06域独立核对D06/D07候选与代次；07域在D07有序材料、D08冻结闭包完整后才生成中立D09；08域按最终D12 NC真实字节生成D13语义，09域独立展开D14、验证D15；10域只在D15与权限证据有效时发布D16。UNKNOWN不继承PASS。
无界面消费者应在独立进程、两Setup中读取真实持久层、回执、Head和manifest，注入强杀于Seal之前、Seal之后CAS之前、CAS之后ACK之前，并在明确VFS/journal/synchronous条件下实测掉电。方案建议接口而不宣称已有harness。重试须幂等；跨库不承诺XA；失败隔离未采纳资产，不删除用户库和冻结历史。产品/跨域消费者/实机 NOT_RUN，Owner签署/L3 PENDING。