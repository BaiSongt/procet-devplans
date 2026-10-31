# R-MULTISETUP-QUERY-001｜多Setup精确寻址与特征工序关联
[工作包](../../docs/work-packages/W2-05.md) · [来源](../sources/W2-05.json) · [规则追踪](../traces/W2-05.json)

研究问题：切换Setup为何依赖重新点击特征分析？可能是GUI隐式activeSetup/投影缓存与权威Owner查询耦合；**尚未读取产品运行结果，不能认定实际根因**。设计采用稳定WorkContext、不可变Owner修订、D02与D05双向多对多引用和只读可重建投影，机器检查了字段→规则→正反验收映射。

ISO 5459:2024官网只公开基准系统范围，ISO 10303-242:2025官网公开受管模型产品数据范围；不能据此断言具体CAM工序映射。OCCT 8.0.1 TopLoc_Location公开API支持变换表达，不等于已验证五轴坐标链。LinuxCNC2.9 G54至G59.3是控制器坐标偏置，不是Procet的D04 Setup对象，也不能推广实际B5。W3C PROV-O提供wasDerivedFrom谱系概念；RFC9110 If-Match适合作为CAS设计类比；RFC8785只规范JSON可规范化字节，BRep及最终NC另按原字节hash。NIST IR8536 2026-09最终版仅阅读官方摘要/作者及出版记录，主题为供应链追踪，非多Setup接口强制标准。

**风险**：AP242输入丢失特征StableUID需来源映射/版本迁移；Frame链乘法顺序和精度预算需真OCCT复核；共享D02变更可能影响多个Setup但独立D05不应自动跨Setup污染；分页/缓存/多进程一致性真实测试NOT_RUN。标准正文、产品代码和实机未读未测。L3及17资产Owner正式会签待人工。
