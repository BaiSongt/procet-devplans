# R-OFFLINE-MEDIA-001｜无网络NC介质、离线信任与签收可审计性

核心问题不是“U盘能否读出来”，而是**授权真实性、字节完整性、离线新鲜度、现场适用性、独立D15证据和有Owner的签收活动互不替代**。同一签名能核对发行主体和签名体，却不能证明NC已在具体控制器和具体实装Frame安全执行。不能建立可信时间与有效撤销快照时，不应以“断网”豁免新鲜度检查。

**公开阅读依据**：NIST SP800-53 Rev5 Update1官方著录仅支持治理风险建模，官网另有2025年Release 5.2.0更新说明，本轮未读PDF控制正文；NIST SP800-88 Rev2在2025-09-26正式发布，官网摘要强调退役与重新使用介质的清理项目，本轮不自创擦除次数；RFC8032正文公开签名验证及向量，RFC8785明确JSON规范化不能替代原NC字节Hash；TUF公开v1.0.36的Root/Targets、版本/过期/阈值机制可用于**威胁分析类比**，不声称NC项目TUF合规。其它原登记有v1.0.37，本轮该固定URL未取得页面，登记为“版本核证差异，待后续复核”，不能擅自断言既有记录错误。OWASP WSTG和Path Traversal公开章节提供恶意归档路径测试思路；LinuxCNC2.9公开手册说明程序可能跨多个文件与行结束符语义，不能外推真实B5控制器；W3C PROV-O提供Activity/Entity/Agent区分，不能自动证明签发/机床安全。

**工程推导**：D16是不可变签发对象；介质复制、接收端再验、签收是分开的事件；D17只接受经过ACL/CAS/scopeEpoch/cancel重验的追加事实。关键绑定字段包含D12原NC/hash+子程序闭包、D04 nominalFrame、D10 actualFrame+ControllerProfile、D13语义Profile、D14 Joint时间、D15独立Oracle覆盖、D16签审/签名/密钥/时效和D17收方身份/介质/接收时刻。C0仅持对象/修订/单位/Frame/内容指纹等最小公用标识，不承载全领域签审对象。

**边界**：TUF软件更新威胁模型不是NC行业认证；未建立真实接收器/密钥/时钟，所有状态案例都只是静态规格。元数据过期策略、介质入厂规则、吊销有效时窗与实际机床上机规程必须由组织Owner及现场负责人批准。不得把`CL_ONLY`或材料扫掠结果当D15 NC工程验证，不实施材料扫掠仿真。

[来源记录](../sources/CAP-10-03.json) → [10条逐字段规则及原E3-06/T5-03](../traces/CAP-10-03.json) → [正反与状态样例](../../docs/capabilities/CAP-10-03/fixtures.json) → [独立消费者交接](../../docs/capabilities/CAP-10-03/independent-consumer-handoff.md)。
