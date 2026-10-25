# R-3AXIS-SURFACE-001｜三轴自由曲面刀路的理论依据与应用边界
**核对日期：2026-10-26。** 原编号[CAP-07-02](../../docs/capabilities/CAP-07-02/README.md)要求等高/平行/清根/残料，是长期扩展规划项，不等于MVP已实现。来源原文见[10份Registry](../sources/CAP-07-02.json)，工程规则见[逐项追踪](../traces/CAP-07-02.json)。

## 理论推导
(1) ISO 14649-11:2004官方摘要包括freeform milling，但仅表达铣削工艺数据的概念层，不授权推导具体表面刀位规划算法，也不代表控制器语言可直接复用。
(2) OCCT的GeomAPI_ProjectPointOnSurf可提供投影解和U/V域选择；支撑曲面的投影并不自动判定Topological Face的有效trim/边界/周期缝。刀心偏移与过切必须考虑工具形状、邻接曲面及保护区。BRepExtrema最小距离仅给有限查询，不足以证明连续机床运动。
(3) Autodesk官方Contour与Steep-and-Shallow说明了等高优先陡面，Parallel/Scallop更常见于缓面，且接缝尖顶的残高需特殊处理。这些是厂商公开工艺族参考，不能继承其私有计算器/认证。
(4) Suresh与Yang 1994关于恒残高曲面刀位的论文，本轮**仅见书目和摘要**：等参数步距与等残高非等价。可做后续文献阅读申请，不抄写未读公式。球头在局部平面近似h=R−sqrt(R²−s²/4)且小步距h≈s²/(8R)来自基础圆几何；对复杂曲面仅用作候选步距初值，不得当形貌验收真值。
(5) 有序余料D07由06域维护，跨Setup和前序刀具尺寸变化都需精确传递。Autodesk支持案例（2026-08-25）仅展示错误选择残料来源可使策略异常，不能用于证明Procet具体程序已正确。
(6) W3C PROV-O的谱系模型、RFC 9110强条件更新与NIST IR8536官方摘要为跨域追踪与并发防覆盖的背景，不等于B-Rep/NC安全标准；NIST仅读出版摘要。

## 证据和验收层级
`catalog_abstract`（ISO）/ `api_reference`（OCCT）/ `public_manual_section`（厂商）/ `bibliographic_abstract`（论文）/ `public_standard_section`（RFC/W3C）/ `publication_abstract`（NIST）均已逐条标识。任何来源不得推导实测表面粗糙度Ra、五轴可达性或实际B5机床无碰撞。下一步需独立测试球面/鞍面/倒扣/多刀具余料及CAD面缝，结果为`NOT_RUN`。
