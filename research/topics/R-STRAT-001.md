# R-STRAT-001｜工艺策略与参数理论追踪
[9项合法来源](../sources/CAP-05-02.json)→[10规则/字段/验收](../traces/CAP-05-02.json)→[CAP-05-02](../../docs/capabilities/CAP-05-02/README.md)。
ISO 14649-10/11公开目录给出一般过程数据与铣削工艺语义（**未读正文**）；ISO 13399-1公开摘要用于资源数据分层。Sandvik Coromant公开“铣削公式与定义”§Table feed明确vf=fz×n×Zeff以及切深/步距/速度单位，不等于特定材料刀具推荐。NIST Kramer/Proctor 2009工艺规划及Michaloski等2009 STEP-NC出版摘要支持工艺意图/加工实现信息分层，但未读全文。OCCT 8.0.1 TopoDS_Shape.IsPartner/IsSame/IsEqual区分拓扑共享及定位关系，不能代替CAD exact revision。W3C PROV-O定义来源表达背景；RFC8785 §3提供候选确定性JSON规范化（Informational），具体业务CAS/冻结规则由Procet自行制定。
**不确定性**：物理材料状态、质量测量、刀具载荷、五轴运动及NC语义皆未测试；在原理或来源不足时返回UNKNOWN。来源登记9条非9篇论文，ISO全文合法获取未做，产品/独立消费者/L3/Owner均NOT_RUN。
