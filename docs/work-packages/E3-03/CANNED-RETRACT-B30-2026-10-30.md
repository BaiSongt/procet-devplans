# E3-03｜B30 G81返回平面与L重复：保守数值资格专项

**2026-10-30；原工作包E3-03、CAP-08-05/CAP-08-07增量研究。** 原11域、88 CAP、36原编号工作包、17业务资产与L1/L2均不变；L3待人类审批。[原工作包](../E3-03.md) · [原CAP](../../capabilities/CAP-08-05/README.md)。

## 实际阅读的证据边界

LinuxCNC文档团队[2.9 G-Codes](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)官方HTML §43.1–43.6、§44、§45、§61已经逐段阅读，页面显示2026-10-26更新。NIST Kramer/Proctor/Messna [IR 6556官方出版页](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)仅核阅目录元数据，**未读PDF正文**；不引用未读的控制器条款。W3C [PROV-O](https://www.w3.org/TR/prov-o/) §2/§3可见谱系属性已读，但只是源→事件建模启示，不能作为安全认证。内生D04/D10、CAS和GUI规则仅归[内部E3-03](../E3-03.md)与[CAP-08-05](../../capabilities/CAP-08-05/README.md)。[作者、日期、访问章节和局限逐条登记](../../../research/sources/E3-03-canned-retract-b30.json)。

## 本轮纠正的工程风险

**G98不总是回到每孔进入时的Z。** 对G17平面连续孔循环，先保存整个连续系列启动之前的`OLD_Z`。G98最终返回`max(OLD_Z,R_abs)`，G99返回`R_abs`。当`OLD_Z < R_abs`时，即使G98也退回R，而非旧Z。G81切换G83不重设该系列初始高度；显式G80或其他组1运动退出当前循环，才重置连续系列生命周期。若误把每行当前高度写成OLD_Z，会漏判夹具让刀与多孔连动风险。

**G90与G91的R/Z和L不相同。** G90使用绝对R、Z，L>1在同位置重复。G91对本轮G17/G81示例：`R_abs=startZ+Rword`、`Z_abs=R_abs+Zword`，孔XY随L次数按平面增量推进，而R、Z不累加，L不粘滞。LinuxCNC官方样例起点(1,2,3)，`G91 G98 G81 X4 Y5 Z-0.6 R1.8 L3`的孔位置(5,7)/(9,12)/(13,17)，R=4.8，深度4.2，最终抬4.8。若原Z低于R，还需先Z快移至R；这与最终返回高度是两种不同事件。

**对未知严格保守。** 本轮只验证结构化G17/G81、G90/G91、G98/G99、G94、G40，不解析原始G-code，不展开连续D14轴运动。G83、扩展平面及未支持方言返回UNKNOWN；非法L、R不高于Z、G93/刀补/旋转/宏或来源不符REJECT。合成L最多16次是本地预算，**非控制器规定**。必须追踪G80/其它组1退出后不再把下行坐标解释为孔循环；部分真实厂商控制器行为、模态持久化及实际几何限位仍待独立解释器验证。

## 落地与验收责任

D09中立CL→D12最终NC→**D13独立解释最终NC**→D14实际D10运动轴时序→D15 NC级工程验证→D16经Owner批准的发布。D04工艺Setup不兼任D10执行绑定，冻结D08/A/B不能覆写。每次解释固定D12 SHA256、D04/D10独立Revision+Hash+Frame、Profile、物理NC行及Block/Modal前后Hash、连续循环Epoch；所有GUI/CLI/Agent从同一`08.NcExecutionPort.interpret`调用，只有一个Babylon世界与左侧UnifiedTaskPanel（最大12px），3D仅预览。提交CAS必须重验ACL/scopeEpoch/取消代次并拒收晚回执；迁移异常旧Reader只读回退，修改上游使D13–D16旧资格STALE且保留历史。

[8条来源→字段→CAP/原包→正反](../../../research/traces/E3-03-canned-retract-b30-v08.json) → [7正47反1未知合成](canned-retract-b30-fixtures-v08.json) → [可独立运行的只读Node工具](../../../tools/check_e303_canned_retract_b30_v08.cjs) → [验证等级记录](../../../tracking/e303-canned-retract-b30-verification-2026-10-30.json)。真实独立D14/D15消费者仍需使用实际NC与控制器/Profile、D10绑定、夹具/进给/轴限位开展正反验证，不以CL动画或样例轨迹冒充NC安全通过，不做材料扫掠仿真。当前仅V8同函数合成；独立Node文件进程、真实NC、B5/OEM、Owner/17消费者与L3均未验收。**规划PASS≠产品PASS。**
