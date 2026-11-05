# CAP-06-04｜B24保护区残余材料与OCCT Glue前提研究
> 2026-10-30；L1/L2及11域88 CAP/36原包/17资产不变，L3待人审。**规划PASS≠产品PASS**。

## 新的必要工程证据
原[CAP-06-04有效加工域](README.md)定义`R=(S_prev\\E)\\P`。在同一物理Frame的离散集合中，以S=当前D07材料、E=目标保留包络、P=本Setup保护区，有
```
R = (S \ E) \ P
After = S \ R = (S ∩ E) ∪ (S ∩ P)
Residual = After \ E = (S ∩ P) \ E
```
因此`R∩P=∅`仅证明**当前工序不侵入保护区**，不能证明终态`After=E`。具体：S={a,b,c,d,e}、E={a,b}、P={d}，移除{c,e}后仍剩{d}。在另一Setup夹具保护解除前只能记录`PARTIAL_BLOCKED`，绑定下一Setup、D07候选Exact Hash、目标与Scope、D08冻结状态；没有下一Setup时必须保留阻断。若P={a}而Residual为空，最多标记候选待独立D07消费者验收，不能冒称产品合格。

## 2026-10-30合法公开来源与访问限制
- Open CASCADE官方文档组，[OCCT 8.0.1 Boolean Operations](https://www.occt3d.com/dev/doc/overview/html/specification__boolean_operations.html)：实读Overview Operators、Fuzzy Operation、Gluing Operation/Usage、Safe processing mode。**Glue模式的真实几何重合前提由调用者保证，算法不代为检查**，误用可能给错误结果；本轮合成Oracle禁止据此启用GlueShift/GlueFull。
- Open CASCADE官方文档组，[OCCT 8.0.1 Modeling Algorithms](https://www.occt3d.com/dev/doc/overview/html/occt_user_guides__modeling_algos.html)：实读Boolean Operations、Input and Result Arguments、Implementation，确认CUT/COMMON基础运算。不是对具体产品BRep或NC的认证。
- Lebo/Sahoo/McGuinness，[W3C PROV-O](https://www.w3.org/TR/prov-o/)（2013-04-30）：实读Abstract、Entity、wasDerivedFrom、wasRevisionOf；只借鉴修订来源关系，不包含CAS/ACL。
- [原CAP-06-04](README.md)内部固定Git Blob `dbd35f602ca859ffaf55de21897c44a60c9c7347`，业务、Owner、验收全文实读。集合等式、跨Setup交接、D04/D10分离、单Babylon世界、CAS权限重验属于Procet数学推导与内部设计，不能归因于OCCT/W3C规范。OCCT HTML未见明确发布日期，按8.0.1标识；没有阅读付费标准正文。

## 7条独立可检规则与责任
B24-R1：D01/D04/D07的exact revision/hash/frame/unit/scope闭包；R2：R/After/Residual集合守恒及保护相交拒绝；R3：有Residual必须将候选D07准确交给后续Setup，冻结D08不可修改；R4：终态资格需要真实独立消费者而不是合成；R5：Glue缺乏重合证明则OFF，fuzzy审批、non-destructive及警告单列；R6：GUI/CLI/Agent同一`EffectiveMachiningDomainPort`，提交时CAS、ACL、scope epoch、job generation和取消晚回执重验；R7：唯一Babylon Engine/Scene/Canvas、统一左TaskPanel与12px最大字号，D04 Setup≠D10执行绑定，A/B同事实不覆盖冻结，C0最小公用。中立CL→D12 NC→D13语义→D14时序→D15独立验证→D16发布，D13 UNKNOWN则BLOCKED；CL动画不代表NC工程验证，不做材料扫掠仿真。

[4项来源](../../../research/sources/CAP-06-04-residual-glue-b24.json) → [7规则/字段/原F1-05/W2-02/03/06包](../../../research/traces/CAP-06-04-residual-glue-b24-v08.json) → [2正30个单字段反例](residual-glue-b24-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0604_residual_glue_b24_v08.cjs) → [执行等级](../../../tracking/cap0604-residual-glue-b24-verification-2026-10-30.json)。

## 真实验收门槛
使用固定真实STEP+OCCT8.0.1进行CUT/COMMON、近切/共面/岛屿/薄壁/多Solid、fuzzy与非破坏性、历史/体积/BRepCheck审计，再由**独立进程D07消费者**重读序列化字节，完成跨Setup/撤权/并发回退/A-B冻结交接。真实OCCT、STEP、NC/B5/OEM、独立Node文件进程和17消费者均NOT_RUN；正式Owner0/17、L3待审，历史原始附件与全仓AST未闭。