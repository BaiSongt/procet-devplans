# R-DIGITAL-THREAD-AUDIT-001｜制造数字主线与审计证据

对应[CAP-10-08](../../docs/capabilities/CAP-10-08/README.md)，不新增D18或改变11个L1/L2域。

**公开正文实读**：W3C PROV-O（2013-04-30）§2/3.1的Entity、Activity、Agent、wasDerivedFrom、wasRevisionOf支持有类型来源/修订关系。项目的业务反馈可有环、实例化不可变revision来源DAG无环是本项目额外设计规则，不宣称PROV-O直接授予几何安全；OPC10000-5 v1.05.06 §6.4.3、§6.4.27可参考ActionTimeStamp、Status、服务器/客户端审计身份及部分可选方法字段。OPC事件不是加工执行事实，设备Profile必须探测。

RFC 8785（2020，Informational）§3是JSON审计metadata规范化的参考，不能替代D12最终NC或子程序原始字节hash；RFC 9162（2021，Experimental）§2.1.4的Merkle一致性是算法参考而非已实施CT系统；RFC 9110（2022）§13.1.1强If-Match只能协助并发写入，业务仍需Owner ACL/scopeEpoch/CAS/撤权/取消重验。

**仅摘要/目录**：NIST Hedberg/Bajaj/Camelio 2019论文与NIST IR8536 Final（2026-09-09）只阅读官方著录及摘要，不冒称已经看过完整算法/实验。ISO23247-1:2021、ISO23247-4:2021只查官网合法目录/摘要，未读付费正文，不造标准条款、传感器阈值、控制器兼容认证或验收要求。

[10份真实阅读层级](../sources/CAP-10-08.json) → [10规则40字段](../traces/CAP-10-08.json) → [77项规划正反与图场景](../../docs/capabilities/CAP-10-08/fixtures.json)。现场事件源真假、NC解释器、机床控制器、独立D15、安全结论及正式17资产Owner/L3都不可能由这些文档证明，产品/消费者NOT_RUN；**规划PASS≠产品PASS**。
