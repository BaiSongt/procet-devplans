# CAP-02-06｜测量资源研究补证（2026-10-28）

**性质：新编V0.8规划研究，不是历史附件原字节恢复、ISO认证或产品测试。**

## 从来源到验收

[8项官方来源、作者/版本/访问深度](../../../research/sources/CAP-02-06.json) → [10规则/40字段/CAP及原工作包](../../../research/traces/CAP-02-06-v08-supplement.json) → [10正40独立单字段反例4数学与8状态待执行](research-fixtures-v08.json)。保留原[MET追踪](../../../research/traces/CAP-02-06.json)、[R-MET专题](../../../research/topics/R-MET-001.md)、[CAP规格](README.md)和[GUI规格](UI.md)，不改变原SRC-MET及MET-T编号。

## 工程结论

1. **ISO 230-10:2022官网摘要明确排除将NC机床作为CMM的整机测量性能评估。** 探测系统的重复性、整机测量能力与本次工件合格判定是三个不同事实。正文未合法取得，不能编造数值阈值。
2. NIST官网溯源政策区分测量结果、校准链与适用目的。资源Released、校准证书存在、某一意图有效是三个不同门禁；资源Owner D03不覆写D17测量结果。
3. ISO 14253-1:2017官网摘要与BIPM JCGM106:2012 DOI摘要只支持边界判定需要不确定度/规则的原则，**未读取ISO付费全文或JCGM PDF全文**。value=upperLimit且不确定度/规则未知时必须INDETERMINATE，不准按小于等于直接PASS。
4. NIST TN1297公开§5与§7说明标准/扩展不确定度、覆盖因子和协方差的区分。合成数学示例包括1 um=0.001 mm，以及uc²=u1²+u2²+2cov（两分量示意，不构成现场预算）。
5. LinuxCNC 2.9 G38.n文档列出了probe-input、触发失败与#5061..#5070，**仅对LinuxCNC 2.9有效**。未知控制器语义标D13 UNKNOWN，D09 CL预览不得替代D12最终NC→D13→D14→D15独立验证→D16发布。
6. GUI/CLI/Agent用一个受控业务Owner Port，唯一Babylon Engine/Scene/Canvas、左TaskPanel、最大12px；Preview无持久写。Owner提交时重验ACL、ScopeEpoch、exactRevision/Hash/Frame、CAS与取消代际，迟到ACK不能复权。
7. D04名义Setup与D10真实绑定分离；校准过期/装配变化/D10变化只使受影响消费者资格STALE，绝不能覆盖A/B冻结成果或历史检测原始值。遗留资源无精确身份应标legacy_unresolved。

## 缺口

[独立消费者交接](independent-consumer-v08.md)。真实计量证书、测针/接收器、控制器手册、Owner签署、独立Node文件运行与实机检测均NOT_RUN；8个状态仅为验收设计，17 Owner会签0/17，L3待审。规划PASS≠产品PASS。
