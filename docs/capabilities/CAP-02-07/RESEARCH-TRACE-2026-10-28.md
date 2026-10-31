# CAP-02-07｜资源几何与参数化研究补证（2026-10-28）

**性质：新编V0.8研究、规则与合成案例，不是历史附件原字节恢复、真实CAD运行或标准认证。** 原[CAP规格](README.md)、[GUI/3D规格](UI.md)、[R-RG-001](../../../research/topics/R-RG-001.md)、[原追踪](../../../research/traces/CAP-02-07.json)和RG-T01～20保持原编号。

## 机器可追踪闭环

[8项公开来源、作者/版本/日期/章节深度及局限](../../../research/sources/CAP-02-07.json) → [10项规则40字段与CAP、原工作包F1-02/F1-06/E3-04](../../../research/traces/CAP-02-07-v08-supplement.json) → [10正40独立单字段反例及5数学、8待执行状态](research-fixtures-v08.json) → [独立消费者与回退](independent-consumer-v08.md)。`node tools/check_cap0207_research_v08.cjs`仅验证规划JSON，非OCCT/产品用例。

## 工程推论及其禁止扩大解释

1. **BRep合法性、Solid闭合、OEM来源可信、可制造与碰撞安全是不同证据。** OCCT 8.0.1 BRepCheck_Analyzer的IsValid检查定义范围内的几何拓扑问题；有效Shape不自动成为闭合实体或通过真实机床资格。
2. **AABB不是实体。** OCCT BRepBndLib的AddClose只适用于特定平面多边形面，算法不自动核验此前提。L形区域：0≤x,y≤3且(x≤1或y≤1)的AABB包括点(2,2)，但实际L形实体不包括该点。预筛包围盒不能代替B-Rep布尔、可达空间和碰撞判断。
3. **BRepMesh_IncrementalMesh的线性/角度离散是显示派生政策。** 源精确Hash、mesh Hash、LOD和Topo映射需要分开管理。改LOD不改BRep身份，丢失源拓扑映射不得把显示拾取提升为精确面基准。
4. **TopLoc_Location表达复合位置，不授权把镜像或参数形变当刚体安装。** 机床组件需具名parent-local Frame，刚体旋转det(R)=+1；D10负责实际安装，09域计算FK，Babylon Viewer只读投影。
5. **ISO 10303-242:2025第四版仅阅读官网Scope/Abstract，未读收费正文。** W3C PROV公开概要是来源血缘语义背景、RFC8785著录是规范化背景；NIST 2021研究仅阅读论文元数据与Abstract，不宣称标准条款、跨语言指纹或论文实测全部获得。
6. GUI/CLI/Agent通过D03统一Owner Port，单Babylon Engine/Scene/Canvas、统一左TaskPanel、字体不超过12px。3D拖动与预览不持久写；提交前重新验证ACL、ScopeEpoch、CAS、exactRevision/Hash/Frame和取消代际。取消后迟到ACK仅对账；已提交事实保留。
7. D04名义Setup与D10执行绑定分离。中立D09 CL→D12最终NC→D13控制器语义→D14轴时序→D15独立验证→D16发布；unknown阻断发布，CL播放不冒充NC验证，不规划材料扫掠仿真。A/B共享事实但冻结不得覆盖。

## 验收边界与移交

本轮55/55为远端规划数据准备的V8等价内存合成（10正、40独立负、5数学），8项状态仅设计。独立Node文件进程、真实OCCT/CAD、Rust/TS、真实三轴/B5/NC、独立消费者均NOT_RUN。17 Owner正式会签0/17、L3待审；125 Registry逐份终核、CAP-02-08同名研究、十原包直接映射、历史附件原字节、全仓链接和最终风险交接仍未完成。**规划PASS≠产品PASS。**
