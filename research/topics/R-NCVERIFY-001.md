# R-NCVERIFY-001｜D15独立程序级验证的证据边界（2026-10-24）
本研究是E3-05的理论依据，不声明实现。依据ISO 6983-1:2009公开目录确认NC格式规范范围；NIST IR 6556仅读出版记录，不推导其未读细节；LinuxCNC 2.9的G0/G1/G2/G3、G53/WCS、模态与补偿按手册具体语义定位，**仅在该控制器范围有效**。来源定位和阅读深度统一登记在JSON中。

OCCT 8.0.1 BRepCheck_Analyzer可作为几何有效性前置、BRepAlgoAPI_Common检查静态交集、BRepExtrema_DistShapeShape辅助间隙。**有限离散样点无碰撞不能证明连续路径安全**，且距离算法不自动证明无内部穿透；实际设备制造安全需要独立过程与实测证据。W3C PROV-O提供来源语义参考；RFC8785提供JSON规范化hash实现选项（原始NC必须对原始字节hash）；规则、审批与业务Owner属于本项目设计而不是外部规范条款。

链路：来源登记 `research/sources/E3-05.json` → 规则 `research/traces/E3-05.json` → 字段和D03/D04/D08/D10/D12/D13/D14/D15/D16 → 正反fixtures → D16独立消费者计划。标准正文、真实B5、产品Rust/TS/OCCT/NC/浏览器、独立D16实测均未执行或未取得。