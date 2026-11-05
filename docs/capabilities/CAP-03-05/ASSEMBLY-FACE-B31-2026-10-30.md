# CAP-03-05｜B31 装配实例及制造特征Face重绑证据专项

**2026-10-30；原CAP-03-05、原B0-02/F1-03/F1-04/T5-02；L3待审。** 原11域88 CAP、36原编号包、17资产均不变，L1/L2不变。原[业务规格](README.md)与[单容器GUI](UI.md)保留。

## 本轮真实公开证据及其局限

OCCT 8.0.1 [XCAFDoc_ShapeTool](https://occt3d.com/dev/doc/refman/html/class_x_c_a_f_doc___shape_tool.html)实读GetComponents、GetReferredShape、GetLocation与GetShape：**一个零件定义可由不同装配组件Label引用，并附各自Location**。OCCT 8.0.1 [TopExp](https://occt3d.com/dev/doc/refman/html/class_top_exp.html)的cumLoc/cumOri决定位置和朝向传播，MapShapes索引本身不提供跨修订稳定ID。OCCT 8.0.1 [BRepTools_History](https://occt3d.com/dev/doc/refman/html/class_b_rep_tools___history.html)有Modified/Generated/Removed/Merge，但只对有真实操作历史的拓扑变化可建谱系，不能对重新导入的无历史CAD猜测。

[ISO 10303-242:2025官方目录](https://www.iso.org/standard/84300.html)第4版2025-08将part/assembly及occurrence/mating纳入公开Scope；**未阅读收费正文，不声称标准规定本地字段**。NIST Trainer/Feeney/Hedberg [2015论文出版摘要](https://www.nist.gov/publications/validation-downstream-computer-aided-manufacturing-and-coordinate-metrology-processes)仅支持下游CAD→CAM/CMM互操作验证的动机，未读全文。[来源登记](../../../research/sources/CAP-03-05-assembly-face-b31.json)逐项记录作者、版本、发布日期、访问日期、阅读深度与局限。CAS/Owner/UI来自[原CAP业务约定](README.md)，不是ISO或NIST规定。

## 工程示例及不可越权的判定

同一D01定义在`ASM/A`与`ASM/B`装配出现两次。即使两者的原始BRep SHA与`faceIndex=2`相同，**制造特征候选不能合并**；必须区分`AssemblyOccurrencePath + ComponentLabel + ReferredDefinitionLabel + LocationHash + Frame + D01 revision/hash + FaceRef + historyRun`。只保存`faceIndex`无法判明哪个装配实例。对应的GUI中仅高亮来源面，不改变业务数据。

| 历史及证据 | 规划判定 | 禁止操作 |
|---|---|---|
| 完整一对一修改历史 | REVIEW_READY | 仍需03域Owner人工采纳，不能自动Approved |
| 一对多Split或Merge | NEEDS_REBIND | 不自动把D02/PMI旧绑定搬到新Face |
| 无操作历史或未知映射 | UNKNOWN | 不因同faceIndex或同外观伪造新身份 |
| Occurrence、Frame、SHA或版本等不符 | REJECT | 不通过另一入口或晚ACK绕过CAS |

C0保持最小Ref/Revision/Hash/Frame/Unit/Protocol，具体Occurrence/History属于03域C1。GUI/CLI/Agent共用`03.FeatureOwner`领域命令，单Babylon Engine/Scene/Canvas与左侧唯一UnifiedTaskPanel，最大字体12px；资源空间横向切换但不并排3D。可预览、拾取、取消；仅Owner在提交时以exact Revision/Hash/Frame、ACL、scopeEpoch、requestGeneration和取消Fence复核后写D02；旧冻结D08不可覆盖，晚回执不落地。D04 Setup与D10执行绑定各自修订，不能让缺机床阻断几何浏览，更不能以CL预览冒充D13→D14→D15 NC验证。不做材料扫掠仿真。

[8条来源→规则→字段→CAP/包链](../../../research/traces/CAP-03-05-assembly-face-b31-v08.json) → [4正50反合成](assembly-face-b31-fixtures-v08.json) → [Node只读检查器](../../../tools/check_cap0305_assembly_face_b31_v08.cjs) → [核验等级](../../../tracking/cap0305-assembly-face-b31-verification-2026-10-30.json)。正例包括不同Occurrence、分裂待审、缺历史UNKNOWN；负例逐字段变异。该测试**仅V8同函数合成**，所有SHA都是合成样例，独立Node真实文件运行、OCCT、17正式Owner/消费者、L3及产品测试仍NOT_RUN/PENDING。**规划PASS≠产品PASS。**
