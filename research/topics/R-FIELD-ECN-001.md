# R-FIELD-ECN-001｜现场异常到工程新修订的证据链
本主题对应[CAP-10-07](../../docs/capabilities/CAP-10-07/README.md)，不创建D18。
## 已查证事实与工程推导
1. **报警状态不是故障消除证明**。OPC 10000-9 v1.05.06 §4.3公开正文区分AckedState和可选ConfirmedState，服务端状态需能力探测；据此把现场确认、维修排障、独立验证拆成三份事件，不把Ack当复工许可。
2. **设备告警语义有边界**。OPC 40501-1 1.02.0 §5.7/8.6/9对Error/Warning/Notification/Interruption建模；只能用于事实标签，不能推出D12最终NC字节实际执行或D15工程安全PASS。
3. **配置变更不应覆盖已批准版本**。ISO 10007:2017只读官方摘要，支持“生命周期中的配置管理”这一适用范围；独立fork、影响闭包、双签与回退均为**本项目设计推导**，不是声称具体ISO条款。
4. **数字主线保留上下游身份**。NIST Hedberg/Bajaj/Camelio 2019仅官方出版摘要描述设计、制造、质量往返图关联；W3C PROV-O公开规范的Entity/Activity/Agent和wasRevisionOf支持溯源关系，但均不认证现场事实。
5. **CAS与重试取消**。RFC 9110 §13.1.1 If-Match避免lost update；本项目额外要求Owner ACL/scopeEpoch/CAS+cancelToken/幂等键，不声称HTTP替代授权。
6. **工单与报警隔离**。OPC 40001-3 1.0.1 §6/7中JobOrders/Responses分层；从工单响应不能推出独立质量PASS或现场再启动权。
7. **MTConnect只读版本索引**。官网2.5.0 PDF目录在本轮可访问，但没在本轮阅读其中Condition字段，不能造出枚举、设备安全阈值或实测结论。
## 可证伪规则链
[逐条八份来源](../sources/CAP-10-07.json) → [十规则×四字段](../traces/CAP-10-07.json) → [50字段独立正反+20门禁](../../docs/capabilities/CAP-10-07/fixtures.json) → [仅规划合成校验器](../../tools/check_cap1007_planning_2026_10_27.cjs)；任意字段独立转false应有单独REJECT，不允许多个字段同时翻转伪覆盖。工程安全和独立质检一律NOT_RUN。
