# R-QUALITY-BASELINE-001｜长期质量基线与新能力准入
本研究建立 **来源→可证伪工程规则→确切字段→十项施工→正反+独立字段变异**，不宣称执行任何真实产品测试。

1. ISO/IEC 25010:2023（2023-11版次2）**只核对官方目录和Abstract**：九项质量特征是质量模型，不是本项目的固定性能、公差或安全认证阈值，支持R05/R09。
2. NIST SP800-218 v1.1 Final（2022-02-03）**只核对官方出版页及摘要**：提供安全开发过程背景，不引用未读实践条款，支持R01/R02/R03/R06/R10。
3. OCCT 8.0.1 BRepCheck_Analyzer公开IsValid/ExactMethod API可支持局部形体有效性检查，但**不可推出去料可行/NC安全**，支持R02/R07/R09。
4. LinuxCNC 2.9官方G-code Overview §11/§13涉及模态组；只代表该控制器软件，真实B5/其他厂商语义未建模即UNKNOWN，支持R03/R07/R09。
5. SQLite在线备份API §1提供单SQLite文件一致性快照机制，不提供跨存储ACID，必须用真实恢复hash独立验证，支持R04/R10。
6. OpenTelemetry官方指标语义页面包含单位和Instrument types，页面当前状态Mixed；应记量纲、样本数和环境，不能空口设定统一p95目标，支持R05/R08。
7. SLSA v1.2 provenance与W3C PROV-O Entity/Activity/Agent可记录源代码/构建/业务证据链，但不是独立工程Oracle，支持R01/R02/R04/R10。
8. RFC9110 §13.1.1 If-Match是HTTP条件语义借鉴；不能取代领域Owner在提交当刻的CAS/ACL/Frame/scopeEpoch/取消回执重验，支持R03/R06/R08。

[合法来源与逐条访问深度](../sources/T5-06.json) · [10条规则、字段、资产和30规划合成](../traces/T5-06.json) · [原T5-06规划](../../docs/work-packages/T5-06.md)。没有NIST/ISO收费/正文摘录或实机结论；**规划PASS≠产品PASS**。
