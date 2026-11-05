# CAP-03-02｜B106 XDE装配SHUO实例外观与源可见性资格补证

> 2026-11-02 · NEWLY_AUTHORED · 11域/88 CAP/36原工作包/17资产不变；L1/L2冻结、L3待审；关联原B0-02、F1-03、F1-04、T5-02。不代表OCCT/STEP/产品通过。

## 核实的关键问题：false不等于源实例明确隐藏

OCCT 8.0.1的`XCAFDoc_ColorTool::IsInstanceVisible(theShape)`公开文档明确：没有SHUO组件时会返回false。若直接用布尔结果控制装配树和3D，可能误隐藏真实存在的Occurrence。`GetInstanceColor(theShape,ColorType,...)`也可能在**不存在SHUO或该ColorType未命中**时返回false，不能据此证明源STEP没有颜色。`IsVisible(TDF_Label)`与上述实例查询是不同入口，不能混作一份来源证据。

`STEPCAFControl_Reader::SetColorMode(false)`关闭颜色读取；此时导入结果没有颜色不能证明源文件本来无颜色。8.0.1构造器默认ColorMode=true，但每次导入应锁定`GetColorMode`及Reader版本/参数，不能凭默认值授予来源资格。

## 官方来源与实际阅读分级

- [OCCT XDE 8.0.1](https://dev.opencascade.org/doc/overview/html/occt_user_guides__xde.html)：实读Basic terms、Instances and References for Components，确立Definition引用与Occurrence位置区分；[ShapeTool API](https://dev.opencascade.org/doc/refman/html/class_x_c_a_f_doc___shape_tool.html)只确认SHUO与引用探测入口存在，不保证源文件含SHUO。
- [OCCT ColorTool 8.0.1](https://dev.opencascade.org/doc/refman/html/class_x_c_a_f_doc___color_tool.html)：实读GetInstanceColor/IsInstanceVisible/IsVisible和GetColor所示返回语义。**单独探测SHUO的三值分类是本规划额外防错设计**，非OCCT直接提供的三态API。
- [OCCT STEPCAF Reader 8.0.1](https://dev.opencascade.org/doc/refman/html/class_s_t_e_p_c_a_f_control___reader.html)：实读构造默认值及Set/GetColorMode指定公开段；不能外推所有内核/固件。
- [NIST STEP File Analyzer and Viewer](https://www.nist.gov/services-resources/software/step-file-analyzer-and-viewer)：官方软件简介显示5.41及装配/PMI/属性用途，**未下载运行**，不能冒充真实目标STEP测试。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)（Timothy Lebo等，2013-04-30）：仅读摘要与状态，支持来源表达思想，不产生Procet CAS/权限规则。
- [原CAP-03-02固定业务规格](https://github.com/BaiSongt/procet-devplans/blob/52c636fab9f1572629b7ec2854b3eb79ca3bbba2/docs/capabilities/CAP-03-02/README.md)：Blob `2bd4e7e214ac45ff649aaf60bfea9ce1c4b3054e`；其Owner权限、冻结、GUI/CLI/Agent入口与D04/D10分离属于本系统内生业务设计。

[7项来源（作者/版次/访问日/章节与阅读限制）](../../../research/sources/CAP-03-02-instance-style-b106.json) · [8规则/字段/CAP/原工作包/正反验收](../../../research/traces/CAP-03-02-instance-style-b106-v08.json) · [50规划合成与18外观Golden](instance-style-b106-fixtures-v08.json) · [只读Node](../../../tools/check_cap0302_instance_style_b106_v08.cjs) · [验证等级](../../../tracking/cap0302-instance-style-b106-verification-2026-11-02.json)。

## L3拟议数据字段、状态规则和业务界限

| 层级 | 明确字段 | 资格及禁止行为 |
|---|---|---|
| D01源与Reader | `source.sha256/readerVersion/readerOptionsHash/readerColorMode` | 原始STEP字节、Reader设置、解释结果分别追踪；ColorMode=false时缺色=UNKNOWN，不得伪装源无色 |
| D01发生实例 | `occurrence.{id,definitionRef,instancePath,frameRef,exactRevision}` | 同一PartDefinition可有多个Occurrence，显示Mesh/名称/颜色不是工程身份；父子Frame保持精确 |
| 源实例SHUO | `shuoPresence=FOUND/NOT_FOUND/UNKNOWN`、`instanceVisibleRaw`、`visibilityEvidence` | NOT_FOUND+false为`UNKNOWN_NO_SHUO`而非`SOURCE_HIDDEN`；FOUND+可验证证据方可报告源显隐 |
| 实例及定义颜色 | `instanceColorHit/definitionColorHit/colorType`与`colorOrigin` | 实例未命中且定义色已证可标`DEFINITION_FALLBACK`；缺少来源为`UNKNOWN_COLOR`，不能推导材质/公差/刀路 |
| VIEWER投影 | `appearance.scope`、`viewHidden`、主题色和高亮 | 返回`DISPLAY_ONLY`；隐藏/隔离/ghost不会删除Occurrence、修改D01或形成NC工程认证 |
| Owner提交上下文 | `expectedRevision/currentRevision`、`aclAllowed/casAllowed`、`scopeEpoch/receiptEpoch`、`cancelFence/lateAck` | GUI/CLI/Agent调用同一CAD Owner端口，提交点CAS/ACL与exact hash/frame重验；取消晚回执拒绝重写 |

规则R01–R08源自上述官方API事实与内部受控政策，字段和每个正反/UNKNOWN案例均可通过Trace JSON逐项检查。UNKNOWN语义必须保持独立：SHUO未观察≠明确源隐藏，Reader关闭色彩读取≠源缺色，默认渲染颜色≠源颜色，VIEWER隐藏≠设计或制造数据删除。

GUI遵守**唯一Babylon Engine/Scene/Canvas**，装配实例/颜色证据在左侧统一TaskPanel中呈现，资源与主工程3D空间横向切换，字体最大12px。3D拾取只是SelectionIntent；正式修订由D01唯一业务Owner持有。A/B共享工程事实不覆盖冻结D08/D16。源实例缺新字段时旧schema仍可只读迁移，显示UNKNOWN，不将其写作FALSE。

D04计划Setup和D10真实机床执行绑定分离；中立CL动画并非最终NC经D13执行解释→D14轴时序→D15独立验证→D16发布的证据，不做材料扫掠仿真。状态不明阻止制造资格升级。失效后保持原工程快照，清理视图Overlay和过期回执；恢复时按exact revision/hash/frame重新校验。

## 机器正反门禁与后续独立消费者

本轮50个NEWLY_AUTHORED合成用例：8个`DESIGN_OK`、2个`DESIGN_OK_LIMITED`、2个`DISPLAY_ONLY`、30个`REJECT`、8个`UNKNOWN`；18项可见性/颜色来源Golden。上述均属**同一judge纯逻辑规划测试**，不称已通过独立Node完整文件/异构Oracle。后续需以合法原始STEP字节、真实XDE SHUO及双Occurrence和ColorMode两状态执行OCCT/另一个D01消费者，再覆盖Babylon GUI切文档晚回执与D04消费者，仅此才可能提升证据等级。

**仍待：** 历史原始附件字节审计、全仓GFM AST与GitHub渲染一致性、17资产Owner正式签署0/17、真实独立消费者验收0/17、L3审批，以及实际STEP/OCCT/Windows/NC/OEM。规划PASS≠产品PASS。
