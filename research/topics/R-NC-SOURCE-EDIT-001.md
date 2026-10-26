# R-NC-SOURCE-EDIT-001｜NC源码编辑、字节保真与失效传播

**观察层（2026-10-26）**：[ISO 6983-1:2009官方目录](https://www.iso.org/standard/34608.html)仅取得Edition 2、范围及2025确认状态，**未读收费标准正文**，不引用具体条文。[LinuxCNC 2.9 G-code Overview](https://www.linuxcnc.org/docs/2.9/html/gcode/overview.html) §2可见块删除、可选且可能重复的N号、换行、注释与空行；§1明确程序可跨文件与M2/M30结束范围。[LinuxCNC 2.9 AXIS GUI](https://linuxcnc.org/docs/2.9/html/gui/axis.html) §2.1.1明确编辑后要Reload才影响运行实例，这说明“磁盘新字节/进程旧程序”是需要显式建模的两种版本状态。[Tool Edit GUI](https://linuxcnc.org/docs/2.9/html/gui/tooledit.html) §1提供外部变更检测与ReRead/ReloadTable的辅助类比，不把它认作NC程序编辑规定。[M Codes](https://linuxcnc.org/docs/2.9/html/gcode/m-code.html) §3涉及M2/M30终止，不能在文本变更后套用旧D13执行结果。

**来源推导**：[W3C PROV-O](https://www.w3.org/TR/prov-o/) §2及prov:wasRevisionOf允许把原NC、手工编辑修订与执行验证活动建链；[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) §13.1.1/13.2.2条件写入可借鉴为外部API预条件，但内部CAS和权限仍须独立实现。[NIST IR6556](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)本轮**只读官方著录/作者/年份**，不假装读过解析算法。

**规划规则**：D12原字节与编辑后字节一律不可变、具有精确哈希；前台显示编辑≠运行态更新；编辑结果经08域Owner CAS写新revision，D13重读最终NC，D14/D15/D16旧证据失效并重新验收。静态词法诊断不是控制器实际语义；不推定跨厂商兼容、无材料扫掠仿真。对用户可理解的证据闭环为“来源→规则→字段→CAP/包→独立正/反/变异/消费者”。

[8条合法来源及限度](../sources/CAP-08-06.json) → [10规则及字段](../traces/CAP-08-06.json) → [30规则正反变异+9合成语义](../../docs/capabilities/CAP-08-06/fixtures.json)。产品真实测试NOT_RUN；L3/17Owner PENDING_HUMAN。
