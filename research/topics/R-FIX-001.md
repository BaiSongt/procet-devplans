# R-FIX-001｜定位、夹紧与工艺约束的理论追踪
**证据访问日期：2026-10-19；专题状态：规划编制完成，L3待审；产品测试NOT_RUN。** 适用于原CAP-04-03，关联F1-02/F1-04/W2-05/E3-04/U4-02。[机器追踪](../traces/CAP-04-03.json) · [来源登记](../sources/CAP-04-03.json)。

| ID | 作者/机构与版本 | 本轮可见章节与证据深度 | 可用结论和局限 |
|---|---|---|---|
| SRC-FIX-001 | ISO/TC 213, Edition 3, 2024-10 | catalog_abstract; 官方目录摘要：datum specification operator；verification operator并非本标准定义的实现 | 支持设计datum语义与实际夹具定位实体区别；未取得收费标准正文，不引用条款、公差或夹具算法 |
| SRC-FIX-002 | Carr Lane Manufacturing, 厂商在线工程指南；页面修订号unknown | section_text; Locating from External Surfaces；3-2-1；Positioning the Clamps | 3-2-1常见定位法及夹紧向支撑传力的工程建议；厂商建议非ISO规范，不证明具体零件的刚度、摩擦与夹紧载荷 |
| SRC-FIX-003 | Walter W. Nederbragt / Bahram Ravani, 1998会议论文 | catalog_abstract; NIST出版页摘要：接触几何方程与空间约束 | 为接触方程、几何定位约束建模提供研究背景；未读论文PDF正文；Jacobians和rank样例属于本规划推导，不冒称原文算法 |
| SRC-FIX-004 | Jonathan W. Lee / L. Haynes, 1987期刊论文 | catalog_abstract; NIST出版页摘要：线弹性有限元、夹紧力与Coulomb摩擦 | 线性刚体约束的rank不能取代载荷、变形与摩擦评价；未读论文全文，未有任何产品工况、材料与载荷实测 |
| SRC-FIX-005 | Open CASCADE SAS, OCCT 8.0.1 API | section_text; 8.0.1 API: Perform / IsDone / Value / InnerSolution；形状间最小距离 | 静态最小距离需检查IsDone，距离不自带整机执行时序证据；未对产品锁定的OCCT版本做编译/数值回归；距离0不等于接触安全 |
| SRC-FIX-006 | Open CASCADE SAS, OCCT 8.0.1 API | section_text; 8.0.1 API BRepAlgoAPI_Common接口说明 | 实体静态公共体计算可作为相交证据候选；退化实体、坏形状、容差与机床运动时序需单独验证 |
| SRC-FIX-007 | ISO/TC 39/SC 10, Edition 2, 2022-11；英语更正2023-10 | catalog_abstract; 官方scope包括数控铣床和带动力夹紧机构等设备类别 | 工艺静态装夹规划不是实际机床安全认证，执行侧需独立验证；未取得正文，不能据此判定具体机床符合任何条款 |

## 不可混淆的推导
ISO 5459:2024摘要描述datum的技术文件定义方法和specification operator，不代表该标准定义了实际夹紧力或机器验证操作。Carr Lane的3-2-1是常见平面定位策略，非全部夹具几何的充分法则。NIST 1998出版摘要描述接触/几何约束方法；`J_i=[n^T,(r×n)^T]`及有限合成秩计算是本规划自建教学样例。rank=6只能说明理想局部线性约束的六个自由度约束独立，不能证明单向接触有正反载荷支持、摩擦与变形安全。NIST 1987论文摘要显示摩擦、夹紧力、变形与有限元分析属于另一层证据，没有真实数据即为unknown。

OCCT 8.0.1公开API有`BRepExtrema_DistShapeShape.Perform/IsDone/Value/InnerSolution`和`BRepAlgoAPI_Common`。这些操作生成带容差与几何资格条件的静态距离/公共形状结果，而不是轴级运动/NC控制器语义的时间展开。真实产品的OCCT版本锁定及其BRep算法边界仍需单独实测。ISO 16090-1:2022官方scope包含铣床/加工中心及动力夹紧装置，但标准正文和客户设备均未审核，绝无设备安全符合性主张。

**项目内的设计决策而非外部强制条款：** C0最小公共引用；D04/D10分离；唯一Babylon世界；UnifiedTaskPanel；GUI/CLI/Agent单Port；权限CAS重验与晚回执隔离；A/B冻结保护；D12→D13→D14→D15→D16的工程验证边界。以上需产品独立实现验证。研究证据、源码观察、数学样例和产品测试分层登记，不把设计意图冒充行业标准。
