# R-GOLDEN-ORACLE-001｜制造黄金场景与独立证据链
2026-10-27 · 横向研究，关联原B0-03，**不增加第37项工作包**。L3 `PENDING_HUMAN`，消费者及产品 `NOT_RUN`。

## 核心推导
**黄金样例不是漂亮截图，而是一个可重放的、可反驳的工程命题。** 逐案必须具有许可合格的输入身份、明确版本/哈希/Frame/单位、运行环境与命令、预先确定的正向预测和至少一个会被拒绝的反例。计算过程由业务Owner发布不可变证据，再由独立消费者从同一精确输入核验。不得把运行结果复制到expected字段，也不得以相同求解实现自证正确。

研发资产分层：D04名义Setup，D10实际安装绑定；D09中立CL可连接D11`CL_ONLY`预检；**只有最终D12 NC经D13控制器语义解释、D14轴时序与D15独立工程验证后，才允许讨论D16发布**。未知宏、模态、机床真实枢轴、限位或无实测标定一律`UNKNOWN`，不被“视觉播放正常”覆盖。材料扫掠仿真不在本阶段设计范围。

## 具体约束与证据性质
- [ISO 10303-242:2025](../sources/B0-03.json)：官方目录确认第四版2025-08，2022版已撤销；**目录摘要**只支持产品/装配/长期归档的主题范围，不能替代收费正文的规则。
- [NISTIR 8620（2026）及2024 CNC digital twin](../sources/B0-03.json)：当前只读官方出版信息与摘要，明确可信性、VVUQ和实物数据需要分层；**未读全文**不引用案例实验结论。
- [OCCT 8.0.1 BRepCheck_Analyzer](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html) 可检查形体有效性，`SetExactMethod`影响检查；这并不能单独保证加工保护区、加工前后材料状态或布尔目标一致。
- [LinuxCNC 2.9 G-code Overview](https://www.linuxcnc.org/docs/2.9/html/gcode/overview.html) 描述模态组，仅能作为对应方言的一类Oracle；不得据此模拟未知B5控制器。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)提供实体/活动/派生关系，[RFC 9110 §13.1.1](https://www.rfc-editor.org/rfc/rfc9110.html)为条件更新CAS类比；协议一致性不是物理安全认证。
- [SLSA v1.2 Provenance](https://slsa.dev/spec/v1.2/provenance)说明产物来源追踪，供证据闭包借鉴；本规划**未实现签名或声称SLSA级别**。

## 十条机器追踪和十二对黄金案例
[原八任务](../../docs/work-packages/B0-03.md) → [8来源与访问深度](../sources/B0-03.json) → [10规则逐字段/原S01-S08及关联CAP](../traces/B0-03.json) → [30项正反独立变异](../../docs/work-packages/B0-03/fixtures.json) → [GOLD-01..12共12对正反场景](../../docs/work-packages/B0-03/golden-cases.json)。
强制记录Owner Port、`exactRevision/hash/frame`、CAS/ACL的提交瞬间重验、A/B共享事实但不覆盖冻结、单Babylon世界与统一左TaskPanel，以及GUI/CLI/Agent一致的领域入口。取消晚回执与过期generation不得写入。所有12对案例`executionStatus=NOT_RUN`，仅证明规划结构完整。

## 实际独立消费者、适用限制与交接
[交接说明](../../docs/work-packages/B0-03/independent-consumer-handoff.md)要求独立实测者记录工作区exact HEAD、输入哈希、容差策略、版本匹配、控制器/机床实测来源、每个命令退出码与跳过原因；旧发布冻结保留。独立Node规划文件测试、真实OCCT/NC/B5、浏览器与下游消费者均不能由本次内存规格验证自动判PASS。L3及17资产Owner正式会签继续待人类审查。
