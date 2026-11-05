# CAP-02-08｜资源能力与兼容性研究补证（2026-10-28）

这是原有[业务需求](README.md)、[UI](UI.md)、[原10规则](../../../research/traces/CAP-02-08.json)、[原20验收](fixtures.json)与[原研究专题](../../../research/topics/R-RC-001.md)之增量；历史原件字节未改，本轮为NEWLY_AUTHORED。正式Owner及L3待审。

## 来源→工程规则→字段→CAP/原包→正反验收

[10项已核对的合法公开资料](../../../research/sources/CAP-02-08.json) → [12条规则、48个字段、原F1-02/F1-06/E3-04](../../../research/traces/CAP-02-08-v08-supplement.json) → [12正48单字段独立反例及8数学案例](research-fixtures-v08.json) → [独立消费者与回退](independent-consumer-v08.md)。ISO 841/230-1只读官方摘要；NIST 2007/2015论文只读官方著录摘要而非全文；LinuxCNC 2.9、OCCT 8.0.1、W3C PROV-O及RFC8785只引用所列公开章节。不编造收费条款、设备行程或OEM证明。

## 不得互相替代的证据资格

- L0为D03发布资源结构事实，已有的结构Verified/Unverified非当班可用、非本任务可加工，绝不二次写入MachineCapability真值。现场Availability单列；缺失就是UNKNOWN，不能将Unverified变成物理能力不支持。
- L1按D03 Resource exact Revision/ContentHash、D04名义Setup、D05/D08冻结任务要求、Policy/单位/Frame来源生成只读CompatibilityAssessment。Must先判INCOMPATIBLE，再STALE，再UNKNOWN；Prefer仅排序。对0.5m=500mm只做数学演算，不能冒充真实机床额定行程。
- 名义5轴轴数、兼容Key相等、AABB/OBB相交不能证明实际FK/IK、接口几何、TCP姿态可达或无干涉。L2需D10真实机床绑定与确切控制器版本，以及下游独立证据。
- GUI/CLI/Agent共用领域Owner Port；预览不能业务提交，提交重验ACL/ScopeEpoch/CAS/cancelGeneration，迟到ACK仅对已经提交的事务对账，不可复权。新资源修订令旧结论STALE，不能回写旧A/B冻结修订或静默切换latest。
- GUI坚持单Babylon Engine/Scene/Canvas、左统一TaskPanel、浅/深主题、字体最大12px；工程/资源3D世界横向切换，不并排。
- D04 Setup与D10实际执行绑定分离。D09中立CL→D12最终NC后处理→D13控制器模态/偏置/刀补→D14轴时序→D15独立工程验证→D16发布；UNKNOWN/CL_ONLY阻断发布；不做材料扫掠仿真。

## 验收范围

本轮V8内存对GitHub规划数据等价断言68/68（12正、48独立负、8算术），8状态场景仅设计。独立Node文件进程、真实OCCT/NC/控制器/三轴/B5、独立消费者均NOT_RUN；17资产Owner正式签署0/17，L3 PENDING_HUMAN。规划PASS≠产品PASS。后续仍需126 Registry逐份终核、10工作包原映射消歧、历史原件审计、全仓链接和最终风险/交接。
