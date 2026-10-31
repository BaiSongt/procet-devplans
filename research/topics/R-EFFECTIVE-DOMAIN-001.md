# R-EFFECTIVE-DOMAIN-001｜有效加工域及几何门禁
2026-10-25联网阅读OCCT 8.0.1 Boolean Operations和Cut/Common/BRepCheck/BOPAlgo/BRepGProp相关API，另查W3C PROV-O、RFC9110公开正文；ISO 14649-11:2004仅官方目录/摘要，NIST IR8536仅2026-09-09最终版官网摘要。出处作者、版次、日期、URL、实读章节深度和不能外推的局限逐条载于[来源](../sources/CAP-06-04.json)，不冒充标准付费全文。
**设计推导**：在数学集合层，当前有序Stock S_prev、保留包络E(T,A)、保护区P得R=(S_prev\\E)\\P；目标T必须包含于Stock，R不能越出Stock或侵入P。这个公式是项目设计模型，不是ISO强制条款，更不证明任意非均匀余量可以形成合法B-Rep。近切、相切、退化拓扑、多Solid、局部Face偏置均需OCCT和独立D07证据。
[规格](../../docs/capabilities/CAP-06-04/README.md) · [10规则/20正反](../traces/CAP-06-04.json) · [独立消费者](../../docs/capabilities/CAP-06-04/independent-consumer-handoff.md)。产品、NC、机床未运行。
