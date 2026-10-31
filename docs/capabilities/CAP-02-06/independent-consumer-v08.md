# CAP-02-06｜独立消费者与回退要求

本接口属于规划候选，非已实现API。

| 独立消费者 | 输入精确引用 | 拒绝及回退 |
|---|---|---|
| D04 Setup | D03资源Revision/Hash、具名Frame、校准引用 | 切换Setup或撤销后STALE；保留冻结A/B |
| D10实际安装 | 机床实例、测针组件/接收器parent-local Frame、控制器精确修订 | 不兼容返回UNSUPPORTED，不用D04冒充实际安装 |
| D13/D14/D15 NC验证 | 最终D12 NC hash、控制器支持指令及探测输入语义 | 未建模UNKNOWN阻D16；CL动画不等于NC验证 |
| D17质量结果 | 原始观测、器具序号、校准链、不确定度、经授权判定规则 | 未知/缺证返回INDETERMINATE，不回写D03定义 |
| GUI/CLI/Agent | 同Owner Port、ScopeEpoch、expectedRevision、cancelGeneration | 事务时重验权限/CAS；取消后晚ACK只对账 |

只读规划检查入口：`node tools/check_cap0206_research_v08.cjs`，详见[研究规则](../../../research/traces/CAP-02-06-v08-supplement.json)和[正反样例](research-fixtures-v08.json)。此命令不是计量软件、机器许可或产品PASS。真实设备、独立消费者、NC/B5及人类审核均NOT_RUN。
