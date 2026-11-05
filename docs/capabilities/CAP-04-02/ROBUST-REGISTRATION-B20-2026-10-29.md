# B20｜CAP-04-02 毛坯/零件配准非退化证据与刚体资格补证

日期：2026-10-29。分类：**NEWLY_AUTHORED研究补证，L3待人类评审，产品未实现/未验收**。不修改原88 CAP、36工作包、17资产分母及历史来源登记。本页补强 [CAP-04-02](README.md) REG-R02/R03/R06/R07，不重编原有20个验收。

## 发现及工程决策候选

**第一，配准输入可辨识性与刚体解的唯一性必须分开。** 2个不同点的配对固定一条基线，但仍允许绕基线旋转；3个非共线且语义正确的配对点可以约束理想刚体位姿。然而实际测量噪声、错误对应、零件对称、CAD实例错配仍可能导致错误结果。故规划要求标识 CAD occurrence、拓扑来源、对应集修订/hash、单位，先检查几何非退化，再判候选残差和业务资格。合成校验器**只验证给定候选矩阵**，并未实现或证明最优配准算法。

**第二，严格区分 SE(3) 刚体定位与含镜像/缩放/剪切的变换。** 业务配准必须要求原输入变换的旋转部分满足 RᵀR≈I 且 det(R)≈+1，同时限制配对点残差。Eigen 3.4 `umeyama` 的API默认 `with_scaling=true`，需要显式关闭缩放。OCCT 8.0.1 `gp_Trsf::SetValues` 文档描述对输入矩阵进行正交化：因此必须在传入该API前校验**原始输入**，不可把SDK自动修正后的矩阵当成原输入合规的证明。镜像即使矩阵可逆也不满足该纯旋转约束。

**第三，ICP优化质量不等于设计基准、测量认证或机床坐标验证。** Open3D的RANSAC/ICP教程显示对应点检查、残差和后续精化属于配准算法流程，不代表设计datum确认、实测装夹资格或D13-D16 NC工程通过。源CAD/stock和算法版本仍要冻结到D04独立新修订。D04不写入D10、G54或机床运动偏置；控制器语义unknown时D15/D16继续阻断。GUI/CLI/Agent复用D04.OwnerPort，唯一Babylon Engine/Scene/Canvas及左侧UnifiedTaskPanel；ghost预览不得存盘，提交前重验CAS/ACL，取消或跨scope的晚回执无效。

## 合成数学校验（不得外推为工业公差）

合成数据为mm单位的四组非共面点 `(0,0,0),(1,0,0),(0,1,0),(0,0,1)`，目标为纯平移 `t=(10,20,30)`；另独立正例用绕Z轴90°旋转。计算 `p_target=R*p_source+t`、`det(R)` 和 `RᵀR-I`。本合成任务将最小叉积模方设为 `1e-16 (mm⁴)`、矩阵阈值 `1e-10`、逐点距离阈值 `1e-8 mm`，仅为方便重现正反例，**不是机床、测量、CAD或加工公差**；任何实际公差/不确定度必须由独立Owner和测量/几何政策确定。

## 规范、论文、内生规划约束与实际阅读范围（2026-10-29联网核对）

| 来源 | 作者/版本时间/URL | 实读深度 | 支持范围与限制 |
|---|---|---|---|
| B20-S01 ISO 5459:2024 Geometrical tolerancing — Datums and datum systems | ISO/TC 213；Edition 3, 2024-10；2024-10；[链接](https://www.iso.org/standard/87855.html) | official_catalog_abstract: 官方Abstract与出版目录 | 收费115页正文未读；不能从目录推出具体定位公差或检验操作 |
| B20-S02 gp_Trsf Class Reference | Open CASCADE SAS / OCCT maintainers；OCCT 8.0.1 online；not_stated；[链接](https://occt3d.com/dev/doc/refman/html/classgp___trsf.html) | public_API_method_text: Detailed Description, SetValues, IsNegative, ScaleFactor, Multiplied | SetValues会正交化; API并非产品版本OCCT实测；须在入库前验证原始矩阵 |
| B20-S03 Eigen 3.4 Geometry Module — umeyama | Eigen contributors; algorithm referenced to Shinji Umeyama；Eigen 3.4 reference；not_stated；[链接](https://libeigen.gitlab.io/eigen/docs-3.4/group__Geometry__Module.html) | public_API_function_text: umeyama(src,dst,bool with_scaling=true); with_scaling=false sets c=1 | Eigen接口与SVD说明不证明制造现场配准唯一性、精度或OCC兼容性 |
| B20-S04 Global registration tutorial | Open3D contributors；Open3D 0.19.0 published manual；version_release_not_checked；[链接](https://open3d.org/docs/release/tutorial/pipelines/global_registration.html) | public_tutorial_RANSAC: RANSAC correspondence checks and local refinement discussion | 教程阈值为演示配置而非Procet生产公差；不能把fitness当datum验收 |
| B20-S05 registration_icp API | Open3D contributors；Open3D 0.16.0；not_stated；[链接](https://open3d.org/docs/0.16.0/python_api/open3d.pipelines.registration.registration_icp.html) | public_API_parameters: initial transform、correspondence threshold、estimation method without scaling default | 仅文档行为，不代表真实装夹测量或NC验证 |
| B20-S07 CAP-04-02 毛坯/零件定位配准（内生业务与接口约束） | Procet V0.8 规划编制组（L3未审）；2026-10-19文档；固定Blob `b57eb25a59abdb8e483c8f75501e0060f9038f80`；[固定文档](https://github.com/BaiSongt/procet-devplans/blob/6d27c9f94fed16cf1ebd9a830fe7baa2a1cbe597/docs/capabilities/CAP-04-02/README.md) | 完整读取 §1/3/4/5 | **内生需求**而非外部标准：GUI/CLI/Agent、CAS/取消晚回执、D04≠D10；仍为规划候选，不能当实装与批准证据 |
| B20-S06 Least-squares estimation of transformation parameters between two point patterns | Shinji Umeyama；1991, DOI 10.1109/34.88573；1991；[链接](https://doi.org/10.1109/34.88573) | citation_only_via_Eigen_reference: 仅由Eigen官方API引用确认论文题目/DOI，未读取论文正文 | 不得冒称看过算法原文、误差界或实验验证 |

本轮严格分层：`B20-S01..S06`为6项外部来源（其中Umeyama原论文仅二次引用），`B20-S07`为带确切Blob身份的**内部规划原文**。R07/R08/R09仅以内部原文为约束来源，**不从ISO、Eigen或OCCT推导权限、UI或D04/D10架构规则**。所有规则的 `derivation` 字段分别记录算法事实与内部设计决议。

ISO 5459:2024只读官方115页标准的**目录/摘要**，没有读取收费正文。Umeyama 1991论文仅通过Eigen官方API中的引用得到题目和DOI，**没有读论文正文**。OCCT在线参考版本与本地原生SDK可能不一致；未读取产品OCCT构建版本、未进行本地数学内核对拍；Open3D教程样例阈值不可直接照搬。

## 来源→规则→字段→CAP/工作包→正反验收

[9条规则及6项外部+1项内生来源详细证据](../../../research/traces/CAP-04-02-robust-b20-v08.json) → [4正例、35单字段反例](robust-b20-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap0402_robust_b20_v08.cjs) → [本轮验证等级](../../../tracking/cap0402-robust-b20-verification-2026-10-29.json)。映射原CAP-04-02、F1-02/F1-04/U4-02（含关联W2-05/E3-04），不新增编号。

接口候选：`RegistrationEvidence={cadExactRef,stockExactRef,cadOccurrencePath,topologySource,correspondenceDigest,sourceFrame,targetFrame,sourceUnit,targetUnit,algorithmProfileRef,scalePolicy,rawCandidateTransform,observabilityReport,residualReport,qualification:"candidate",scopeEpoch,expectedD04Revision}`。计算返回候选，不能暗写业务；消费者须对exact D04修订/Frame/权限独立验收，不得复用预览资格。

## 未完成门禁

真实产品矩阵输入与OCCT SetValues前检查、真正Umeyama/ICP计算、含噪声与对称件测试、测量不确定度、STEP装配实例、B5/其他机床Frame往返、GUI/CLI/Agent端口、独立D06/NC消费者、完整仓库AST均为NOT_RUN。17个正式Owner签署与17个独立消费者仍为0，L3 PENDING_HUMAN。**规划PASS≠产品PASS。**
