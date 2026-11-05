# B88｜CAP-08-07 执行实例身份、NC物理字节溯源与独立消费者门禁

**2026-11-01｜原编号 CAP-08-07／E3-02、E3-03、U4-04｜L3 PENDING_HUMAN。**

## 新补证为何必要

[LinuxCNC 2.9 O Codes](https://linuxcnc.org/docs/2.9/html-11684128649/gcode/o-code.html) §4.1明确：M98子程序L重复执行，可由外层5次调用叠加内层5次调用形成25次执行；[G-code Overview](https://www.linuxcnc.org/docs/2.9/html/gcode/overview.html) §2.2允许N行号省略、重复或乱序。**静态相同NC物理行 ≠ 相同的运行实例**，因此单纯按N号/行号/CL片段反查 D13 事件会漏掉循环、子程序和宏调用链。

建议两个键：静态源键为`finalD12RawHash + sourceFileHash + byteSpan[begin,end) + closureHash`；动态实例键在静态源键上增加`controllerProfileHash + callPath(调用位置/每层次数/循环次数) + eventOrdinalDecimalString`。同一源行出现多次执行应给出多条事件，不能覆盖。序号如`9007199254740993`超过JavaScript安全整数上界，必须以十进制字符串传输，不能先转Number。此格式是Procet候选，不是LinuxCNC公开输出数据结构。

## 状态与业务契约

1. D09、D12原字节、后处理配置及子程序闭包须以exact Revision/Hash固定，D04名义Setup与D10实际机床绑定分离；Frame不明确时`UNKNOWN`或拒绝，不能靠当前3D拾取推断。
2. byteSpan按原NC物理字节计数，CR/LF、BOM、编码不由显示字符串重新推导；重复N号不是identity，超文件边界立即拒绝。
3. 调用路径必须保存嵌套调用位置、迭代号和动态执行序号；同键事件重复属于冲突，调用路径缺失为`UNKNOWN`。
4. OEM宏、间接O调用、外部文件加载、递归/无限循环预算或控制器Profile未确认时`UNKNOWN`，不调用CL动画补齐。
5. W3C PROV-O中的Activity/Usage/Generation为D09→Post→D12提供来源表达；[PROV约束](https://www.w3.org/TR/prov-constraints/) §6.2.2提供顺序约束。后处理自行生成行标`GENERATED_ONLY`，多源争议标`AMBIGUOUS`，无原始来源标`UNMAPPED`，禁止静默选择唯一源。来源图不覆盖冻结D08。
6. D12人工编辑/再后处理产生新修订，使D13解释、D14轴时序、D15验证、D16发布资格全部STALE。保留旧Reader/旧映射和历史完整版本回退，不删除原D08冻结，也不改动已发布证据。
7. GUI、CLI、Agent统一调用08域Owner UseCase；CAS/ACL/Frame/ScopeEpoch/taskGeneration/取消在实际提交点重验，取消晚回执不得重新写入。C0只存最小身份、修订、Frame和消息，不存全NC语义。
8. 唯一Babylon Engine/Scene/Canvas，统一左UnifiedTaskPanel显示CL→NC源span→D13调用实例→D14/D15证据。双向高亮仅为只读提示；D11/CL_ONLY和D13映射成功**不能**推出D15工程验证通过，更不能允许D16发布。本项不做材料扫掠仿真。

## 来源分层与严格访问限制

[8项来源（作者、版本、日期、URL、访问章节、局限）](../../../research/sources/CAP-08-07-occurrence-b88.json)：
- LinuxCNC2.9 G-code Overview §1/2.2/2.4、O Codes §4/4.1/7—9：2026-11-01读取公开指定HTML正文；仅此版本公开语义，不泛化为Haas/FANUC/SINUMERIK。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/) qualifiedDerivation 与[PROV Constraints](https://www.w3.org/TR/prov-constraints/) §6.2.2：读取公开Recommendation指定正文，不能由此声称数控程序已经验证。
- [RFC8785](https://www.rfc-editor.org/rfc/rfc8785.html) §3.1/Appendix D：公开正文已读，大整数作为字符串及JSON语义限制；本轮不声称完成JCS序列化器。
- [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html) §13.1.1/13.2：已读If-Match正文，仅作CAS类比；Owner ACL/取消是Procet内部要求。
- [NIST IR6556官方页](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)：Kramer/Proctor/Messna, 2000；仅出版著录，**未阅读完整报告**，不援引隐藏正文条款。
- [CAP-08-07固定GitBlob](https://github.com/BaiSongt/procet-devplans/blob/658b26a375c19edb823c6ced0f15bbdcf125b085/docs/capabilities/CAP-08-07/README.md)：已全读原规格及十规则，L1/L2、88 CAP/36原包和17资产编号不变。

## 字段规则→正反验收→Owner交接

[八条机器可读字段规则](../../../research/traces/CAP-08-07-occurrence-b88-v08.json) → [33项显式期望的合成正反用例](occurrence-b88-fixtures-v08.json) → [可独立执行的Node只读校验入口](../../../tools/check_cap0807_occurrence_b88_v08.cjs) → [验证等级](../../../tracking/cap0807-occurrence-b88-verification-2026-11-01.json)。

独立收方：07域D09 Owner提交CL精确段引用；08域D12/D13 Owner据最终原始NC字节与闭包形成生成关系和完整运行事件；09域D14/D15独立验证真机轴树与碰撞/限位；10域D16复验D08冻结、签发权限和同版本验证。GUI/CLI/Agent消费同一个领域契约；旧Reader走Expand→Migrate→Contract。所有签署均仍是候选，17资产正式Owner签署0/17、真实消费者0/17。

33项为合成判定函数检查，**独立Node完整文件执行、真实LinuxCNC/OEM、D13–D16、单Babylon交互及全仓GFM AST均NOT_RUN**。历史附件原字节审计与L3审批未闭。**规划PASS≠产品PASS。**
