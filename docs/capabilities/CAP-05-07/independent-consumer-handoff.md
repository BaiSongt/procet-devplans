# CAP-05-07｜独立消费者交接（待执行）
**规划接口**：05域`PlanRevisionDomainPort`是唯一D05写侧，提交者不能自身宣称下游独立PASS。17资产Owner会签、L3审批、产品测试均未执行。

| 独立消费者 | 必须读取的exact输入 | 正例门 | 至少一个反例与必须拒绝 |
|---|---|---|---|
| 06域D06/D07 | D05修订、冻结D08、D01/D02、D04 Frame proof | 不改未影响节点并重算受影响材料状态 | 旧来源/保护区失配不可继续按旧几何PASS |
| 07域D09 | D05节点ID、策略、源hash、Setup | 新中立CL引用新D05 | 旧CL仍引用被改策略则失效 |
| 08域D12/D13 | 新D09、D10实际执行配置、最终NC原字节 | 新NC有逐行来源并独立解释 | 未知方言/补偿/宏返回UNKNOWN |
| 09域D14/D15 | D13执行语义、机床轴树/安装与新时序 | 覆盖声明和检查证据分别可追 | CL动画或离散采样不能冒充连续NC安全 |
| 10域D16 | D12字节、D13/D14/D15 exact证据 | 人工审批且所有证据版本一致才有资格 | 旧验证引用新修订时禁止发布 |

**交接必含**：source exact hash+revision+frame+schemaVersion+scope、diff摘要（stable ID与依赖边）、数据Owner、actor/ACL/CAS、taskGeneration、scopeEpoch、取消审计、affected/unaffected、错误码、回退新revision。提供正反输入及独立测试者、实际产品commit SHA、运行时间、命令、日志/结果hash；无记录状态一律NOT_RUN。

**独立验收出口**：至少并行编辑两方、跨Setup变更、D08冻结冲突、旧任务晚回执、不可识别stable ID、真实D13 UNKNOWN、D15不能复用旧PASS、D16发布失效、GUI/CLI/Agent同Port、断网离线工程迁移10组正反及回退；外部Consumer签名由实际工程团队负责。计划检查PASS不能升级产品PASS。
