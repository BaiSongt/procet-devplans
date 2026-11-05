# CAP-02-05｜独立消费者/迁移回退与真实Owner验收入口

| 资产/消费者 | 精确数据与权限 | 独立正反要求（均NOT_RUN） |
|---|---|---|
| D03材料/毛坯资源Owner | material definition/lot/condition分离；StockTemplateRevision与精确geometryHash | 同名不同标准不得自动合并；旧版能按hash重放 |
| D04工艺Setup Owner | setupId+expectedRevision+ScopeEpoch+materialRevisionRef+stockSolid/Frame；显式采用才写入 | 取消bbox候选不写；CAS失败、旧ScopeEpoch拒绝 |
| D07几何求解 | Part/Stock有效封闭Solid与统一Frame、Cut残差、容差和算法版本 | bbox或仅网格不可提供passed；无精确几何返回unknown |
| D05/D06工艺消费者 | Exact材料属性/试验条件、StockRevision；冻结A/B保留 | 材料属性更改使切削建议stale但不覆写CAD |
| D09/D12 CL/NC消费者 | D04 Setup与D10机床绑定分别引用；NC版本衍生 | CL_ONLY不得冒充最终NC与执行解释 |
| D13/D14/D15/D16工程消费者 | 最终NC→控制器语义→轴时序→独立工程验证→签发 | unknown/未支持控制器语义必须阻止发布 |
| GUI/CLI/Agent入口 | 使用同域Port及ACL/ScopeEpoch/Rev/Hash/Frame/CAS/cancelGeneration | 晚ACK无权写；已提交Receipt保留并对账 |

迁移：保留legacy material_id与原始审计，无法恢复历史revision置legacy_unresolved；新端口先影子读比对再批准切换写入，回退读适配不改Approved。失效事件须包括生产者old/new exact revision、变更字段、消费者版本、原因、状态和实际Receipt。

静态测试入口仅为`node tools/check_cap0205_research_v08.cjs`（完整checkout时运行）；Native OCCT、D04服务、GUI/CLI/Agent、D15 NC与三轴/B5的实际测试入口待Owner核定，不编造命令。17资产正式会签0/17、真实独立消费者0/17，L3待审，规划PASS≠产品PASS。