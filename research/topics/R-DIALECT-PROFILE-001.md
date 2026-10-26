# R-DIALECT-PROFILE-001｜数控控制器方言的版本化与未知语义边界

**阅读日期**：2026-10-26；**实施映射**：CAP-08-02、E3-02/E3-03/U4-04；研究并非特定控制器认证。

## 已核官方文献与证据层级

- **DIA-SRC-ISO6983**｜ISO 6983-1:2009 Program format and definitions of address words（ISO/TC 184/SC 1；ISO；2009-12-07；Edition 2; last confirmed 2025-10-17）。[原网页](https://www.iso.org/standard/34608.html)；阅读级别`catalog_abstract`，定位：Abstract; General information; Life cycle。**可据此**：仅说明NC地址字程序格式与适用范围，不能推得具体厂商方言。**不能据此**：未获授权的收费正文未读，不能援引条款或声称满足控制器语法。
- **DIA-SRC-LINUX-MODAL**｜LinuxCNC 2.9 G-code Overview（LinuxCNC Project；LinuxCNC；unknown；2.9 HTML manual）。[原网页](https://www.linuxcnc.org/docs/2.9/html/gcode/overview.html)；阅读级别`section_text`，定位：§2 Format; §11 Commands and Machine Modes; §13 Modal Groups; §21 File Requirements。**可据此**：模态组、指令组合、程序终止和初态显式化的可见实例。**不能据此**：只适用LinuxCNC 2.9；不得套用FANUC/SINUMERIK或真实B5。
- **DIA-SRC-LINUX-GCODES**｜LinuxCNC 2.9 G-Codes（LinuxCNC Project；LinuxCNC；unknown；2.9 HTML manual）。[原网页](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)；阅读级别`section_text`，定位：§1 Conventions; §2 G-Code Quick Reference Table。**可据此**：控制字、坐标偏置、弧/孔循环需声明语义子集。**不能据此**：列表不是全部机床厂商的语义规范；不含目标现场控制器试验。
- **DIA-SRC-HAAS-MCODE**｜Haas Mill Operator's Manual — 18 Mill M-Codes（Haas Automation；Haas Automation；unknown；Online Mill Operator Manual; exact controller software release not specified）。[原网页](https://www.haascnc.com/service/online-operator-s-manuals/mill-operator-s-manual/mill---m-codes.html)；阅读级别`section_text`，定位：§18.1 Introduction and M-Codes table。**可据此**：M类辅助动作与程序示例依赖厂商控制器上下文。**不能据此**：Haas示例不含真实工装、刀补与材料，不能推广到非Haas机床。
- **DIA-SRC-SIEMENS-INDEX**｜Technical documentation for SINUMERIK 828D, Version 5.24（Siemens AG；Siemens Industry Online Support；2024-09-23；SINUMERIK 828D Version 5.24 documentation index）。[原网页](https://support.industry.siemens.com/cs/document/109972772/technical-documentation-for-sinumerik-828d-version-5-24?dti=0&lc=en-WW)；阅读级别`search_result_only`，定位：官方检索页标题及手册目录命中，正文页面打开失败。**可据此**：表明厂商手册以控制器及版本区分，应获取目标手册确证方言。**不能据此**：未读取厂商编程手册正文，不据此承诺任何SINUMERIK具体指令/模态支持。
- **DIA-SRC-NIST6556**｜The NIST RS274NGC Interpreter — Version 3（Thomas R. Kramer、Frederick M. Proctor、Elena R. Messina；NIST；2000-08-01；NIST IR 6556, publication page）。[原网页](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3)；阅读级别`catalog_abstract`，定位：Publication metadata; Authors; Abstract。**可据此**：说明数控代码解释为规范动作的独立解释器研究路径。**不能据此**：只读官网摘要，未读报告正文；NGC方言不等于通用机床控制器。
- **DIA-SRC-RFC9110**｜RFC 9110 HTTP Semantics（R. Fielding、M. Nottingham、J. Reschke；IETF RFC Editor；2022-06；RFC 9110）。[原网页](https://www.rfc-editor.org/rfc/rfc9110.html)；阅读级别`section_text`，定位：§13.1.1 If-Match。**可据此**：条件更新与并发版本匹配作为CAS协议类比。**不能据此**：HTTP语义不是跨本地SQLite或领域事务的自动保证。
- **DIA-SRC-PROVO**｜PROV-O: The PROV Ontology（Timothy Lebo、Satya Sahoo、Deborah McGuinness (editors)；W3C；2013-04-30；W3C Recommendation）。[原网页](https://www.w3.org/TR/prov-o/)；阅读级别`section_text`，定位：Abstract; Introduction; Entity/Activity/Agent overview。**可据此**：独立生成活动及输入产出谱系表达。**不能据此**：PROV-O没有强制Procet内部Schema或认证NC安全。
- **DIA-SRC-OCCTTRSF**｜OCCT gp_Trsf Class Reference（Open CASCADE Technology；Open CASCADE；unknown；OCCT 8.0.1 API）。[原网页](https://occt3d.com/dev/doc/refman/html/classgp___trsf.html)；阅读级别`section_text`，定位：gp_Trsf Detailed Description; Multiply/Transforms API。**可据此**：有序Frame变换需要明确方向与复合次序。**不能据此**：几何变换API不是控制器补偿、RTCP或真实轴限位证明。
- **DIA-SRC-HAAS-GCODE**｜Haas Mill G-Codes (official listing)（Haas Automation；Haas Automation；unknown；Online service G-Code table; exact software release not specified）。[原网页](https://www.haascnc.com/de/service/service-content/guide-procedures/mill---g-codes.html)；阅读级别`section_text`，定位：Mill G-Codes listing (German edition)。**可据此**：与LinuxCNC公开指令列表比较应使用逐厂商能力白名单。**不能据此**：不同产品系列、选件与版本均需进一步查证，不得跨控制器直接复用。

## 从来源到设计规则的推理边界

ISO 6983-1目录只定义数控程序格式的标准适用域，没有说明每家设备的扩展指令都一致。LinuxCNC §13给出本系统的模态组示例，Haas在线M代码表则展示另一家厂商的辅助命令集合；两个文本的交集不是通用安全子集。Siemens支持页面本轮仅检索到官方手册目录，打开正文失败，**未把任何SINUMERIK指令作为已阅读的结论**。NIST IR 6556官方摘要表明从RS274方言到规范动作解释器的研究路径，但NIST不为现场B5控制器提供适配担保。因此设立`D12 profile白名单`与`D13独立执行解释`双层边界，所有不完备语义UNKNOWN。

OCCT 8.0.1 gp_Trsf只支持坐标几何变换的设计依据，不可推出控制器补偿、RTCP或实机轴时序；RFC 9110的If-Match是CAS协议设计类比，具体业务事务依然需要Owner实现；PROV-O用于策划来源谱系而非工程验收依据。模型供应商与机床厂商具体配置须补签目标固件、选件、手册版本、实测golden、独立D13/D14/D15消费者及安全评审。

详见[来源JSON](../sources/CAP-08-02.json)、[逐项机器规则](../traces/CAP-08-02.json)、[CAP业务正文](../../docs/capabilities/CAP-08-02/README.md)。所有规则与样例均为**NEWLY_AUTHORED**，不是历史文件恢复。