# R-TOOLPATH-LOCAL-REGEN-001｜局部编辑依赖闭包的理论与限制

核对2026-10-26。[8合法来源的版次/章节/阅读范围](../sources/CAP-07-08.json)→[十条规则/字段/正反变异](../traces/CAP-07-08.json)→[CAP实施](../../docs/capabilities/CAP-07-08/README.md)。

Autodesk官方Help S01/S02/S03确认保护操作、操作过期和按需生成的产品行为，但Protect保留已执行轨迹并不表示几何更改后的路径仍然安全；这是本规划额外严格门禁。OCCT8.0.1 S04 Copy可派生Shape，TopTools S05哈希依据TShape/Location/Orientation的内部拓扑语义，不能充跨修订制造段stable ID。

定义依赖DAG G=(V,E)，变化种子S的脏闭包为S与从S可达下游节点的并集；段相邻连续性、Setup Frame、D07材料前态、刀具装夹都属于潜在依赖边。缺边、环、旧revision或无法证明独立的子图应扩大到整个工序/Setup或UNKNOWN。合成四例检查局部传播、上游保留、全部扩散和空集合，但不证明真实几何安全。

W3C PROV-O S06公开wasRevisionOf/wasDerivedFrom/invalidatedAtTime可支持派生谱系；RFC9110 §13.1.1 S07条件写强比较仅作CAS类比，不能代替Owner ACL/撤权/取消代次。NIST IR8536最终版2026-09 S08本轮只读官方摘要和著录，不能臆造论文中的具体NC、CL条款。

D04 Setup与D10执行绑定分离；修改后新D09必须重新经过D12最终NC→D13控制器解释→D14轴时序→D15工程验证→D16发布。D11动画只是预览，UNKNOWN和NOT_RUN阻发布，不做材料扫掠仿真。所有规划样例不是已验证产品。
