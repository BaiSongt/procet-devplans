# F1-01｜正反验收目录

以下18项均为NOT_RUN_PRODUCT_TEST。静态Schema和本文核对不能代替Host、领域或离线产品验收。

| ID | 业务行为与反例期待 |
|---|---|
| F1-01-T01 | 历史r1与目录r2并存，旧引用仍r1；缺r1不取latest |
| F1-01-T02 | 两对象同byte hash不合并逻辑身份或审批 |
| F1-01-T03 | 同ID不同domain/kind时拒绝跨域猜同名 |
| F1-01-T04 | DomainRef JSON合法但无provider时业务解析失败 |
| F1-01-T05 | C0整数2^53、7.0或bool必须拒绝，不丢精度 |
| F1-01-T06 | 原始JSON重复键、NaN或非法UTF-8被拒绝 |
| F1-01-T07 | 非BMP键、Unicode组合与浮点边界的跨语言Golden一致后才采用JCS |
| F1-01-T08 | Schema只改空白，fileSha256变化；辅助Hash不是requestHash |
| F1-01-T09 | 过期工程generation写入，拒绝覆盖并保留草稿 |
| F1-01-T10 | GLOBAL_DOMAIN伪造projectId/工程receipt拒绝 |
| F1-01-T11 | 同幂等键相同请求查同receipt；不同body冲突 |
| F1-01-T12 | Worker succeeded但Solver partial仍未获得生产资格 |
| F1-01-T13 | 已提交后晚到cancel不能抹除commit |
| F1-01-T14 | 离线恢复缺必需子件或hash错误，原工程头不变 |
| F1-01-T15 | Setup-A晚回执不得写入Setup-B |
| F1-01-T16 | 未知必需C1字段/major不兼容，拒绝或安全只读 |
| F1-01-T17 | 手改D12 NC，新D13—D15检查stale，历史D16不变 |
| F1-01-T18 | 静态fixture通过但无真实handler不能标READY |

测试证明需有组合锁、精确输入Hash、跨语言命令/退出码、预期与观察结果、独立核验者。没有执行不填PASS。研究和设计规则见[规则](01-rules.md)与[理论](../../../research/topics/R-REF-001.md)。
