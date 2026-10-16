# F1-01｜公共引用与提交规则

状态：评审稿；非产品测试结果。主责平台与集成，所有领域Owner及GUI/CLI/Agent消费者共同评审。

| 规则 | 必须遵循的语义 | 证据 |
|---|---|---|
| REF-R01 | 业务对象ID、不可变revision、Artifact的byte hash、Schema版本、producer与审批相互独立；同hash不能合并业务身份。 | RFC 6920；C0 DomainRef/ArtifactDescriptor |
| REF-R02 | 旧工程精确引用domain/kind/id/revision；provider核查真实存在性及Owner；不得使用latest替代。 | C0 DomainRef |
| REF-R03 | C0只传身份、scope、Schema、命令、诊断、结果与receipt；17类D数据各由C1写入。 | 17类业务资产基线 |
| REF-R04 | raw JSON拒绝重复键、NaN、非法UTF-8、超出2^53-1或非整数token、null假缺省。 | RFC 7493；C0协议README |
| REF-R05 | fileSha256按Schema文件原字节计算；canonicalSha256是现有Python辅助值，不是JCS或生产requestHash。JCS须另建跨语言Golden。 | RFC 8785；C0 catalog |
| REF-R06 | PROJECT_BOUND的写采用generation CAS；GLOBAL_DOMAIN有独立域CAS；EPHEMERAL_JOB无写；同幂等键异payload冲突。 | RFC 9110 If-Match原理；C0 InvokeRequest |
| REF-R07 | 执行完成、领域状态、审批、执行资格四维独立；已提交回执不可由迟到cancel抹除。 | C0 InvokeResult |
| REF-R08 | 按实体修订、生产活动与来源对象记录不可变provenance DAG；未知失效不能标无影响。 | W3C PROV-DM |
| REF-R09 | C1不兼容schemaMajor/未知必需字段按能力拒绝或只读，不静默忽略；保留旧reader与隔离adapter。 | JSON Schema；C0现状 |
| REF-R10 | Host验证可信actor、scope和能力权限；跨Setup晚回执重核caller epoch；显示选择/预览不写D资产。 | Procet内部架构决策 |

与F1-02的Frame数学、F1-06的快照闭包、F1-04的Setup与执行拆分接线；不建立第二套Host。详情参见[研究专题](../../../research/topics/R-REF-001.md)。
