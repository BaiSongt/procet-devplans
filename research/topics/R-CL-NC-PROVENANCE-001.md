# R-CL-NC-PROVENANCE-001｜CL与NC映射的证据语义与独立执行链

本专题服务[CAP-08-07](../../docs/capabilities/CAP-08-07/README.md)，2026-10-26在线核对资料；来源著录、推导、源代码观察、实际测试分开记录，不能把外部文档直接当本产品验证报告。

1. [ISO 6983-1:2009](https://www.iso.org/standard/34608.html)，Edition 2（2009-12，2025确认），**仅合法目录、范围与生命周期**。它给出NC程序格式标准背景，但未读收费全文，**未获得关于CL映射的条款证据**。
2. [LinuxCNC 2.9 G-code Overview](https://www.linuxcnc.org/docs/2.9/html/gcode/overview.html) §1/§2.1/§2.2，物理行与`N`号不是同一个身份，N可能重复/缺失，块删除与注释影响源解释。该事实只适用于LinuxCNC 2.9，不应扩展为全控制器保证。
3. [LinuxCNC 2.9 O Codes](https://linuxcnc.org/docs/2.9/html/gcode/o-code.html) §1–4中子程序/调用/循环的示例提示“一行源码可能被执行多次”；这支持`byteSpan+callStack+iteration`这一**设计推导**，并非官方规定的跨厂商trace schema。
4. [AXIS GUI 2.9](https://linuxcnc.org/docs/2.9/html/gui/axis.html) §2/Preview/Backplot/Interacting具图形↔文本同步高亮，可作为交互参考，但不能证明CL→NC→轴轨迹的工程等价或安全。
5. [W3C PROV-O](https://www.w3.org/TR/prov-o/)（2013-04-30，Recommendation）`wasDerivedFrom/wasRevisionOf/wasGeneratedBy`可表示来源的有向派生与修订，不能证明哈希签署或机器运动结果。
6. [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html)（2022-06）§13.1.1/§13.2.2的If-Match预条件可防止外部接口丢失更新，但应用内Owner CAS和ACL须另实现。
7. [NIST IR 6556](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)（Kramer/Proctor/Messna，2000-01-01）仅阅读官方著录/DOI，**正文未读**，不声称借用解释器内部映射算法。
8. [LinuxCNC 2.9 M Codes](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html) M2/M30终止信息要求解释器重新判定程序可达性，文本中存在的NC行不等于实际执行事件。

**OCCT访问限制**：尝试访问`https://dev.opencascade.org/doc/occt-8.0.1/refman/html/classgp___trsf.html`，本轮返回不可访问，因此不引用OCCT8.0.1的具体API条目，不将坐标转换结果视为已验证。需后续补充可合法访问的官方手册或独立计算证据。

**独立工程推导**：D09原始中立CL段到D12 NC字节是非双射；D12程序具有header/footer与人工编辑差异，D13执行又有控制流展开。故定义`D09(segment/revision/hash/frame)→D12(finalBytesHash,byteSpan,postConfig,closure)→D13(callStack,iteration,modalSnapshot)→D14(axisEvents)→D15(independentEvidence)`，每跳有未知和失效状态。源映射不能代替D15 NC工程验证，不能以CL动画、产品预览或NIST著录充当实机认证。

[8条来源的作者/时间/阅读深度/局限](../sources/CAP-08-07.json) → [10规则/字段](../traces/CAP-08-07.json) → [30正反变异、12语义、5映射合成案例](../../docs/capabilities/CAP-08-07/fixtures.json)。L3与17资产Owner正式会签`PENDING_HUMAN`；真实产品/独立消费者`NOT_RUN`。**规划PASS≠产品PASS**。
