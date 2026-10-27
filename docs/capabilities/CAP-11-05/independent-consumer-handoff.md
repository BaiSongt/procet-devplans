# CAP-11-05｜Owner接口候选、独立消费者、失效与回退

**17资产只按[既有Owner基线](../../architecture/v0.8/business-assets.json)登记候选**，非团队批准。逐资产候选机器索引见[asset-owner-candidates.json](asset-owner-candidates.json)。D05/D08由05领域写，D03由02领域维护资源定义，D04由04领域维护工艺Setup，D10仍由04域组织实际绑定并引用02域资源、09域运动能力；D12/D13归08域，D14/D15归09域，D16/D17归10域。11域推荐模块对上述资产只有Owner认可的只读Port。

## 受控接口草案

`ProcessRecommendationPort.recommend()`返回多候选、计算证据、适用域、UNKNOWN和显式风险；`SourceEvidencePort.resolve(exactRevision,hash,selector)`只读，并在ACL撤销时拒绝缓存；`ProcessPlanningOwnerPort.proposeDraft()`是唯一D05 Draft写入口，提交时按principal/ScopeEpoch、Asset exactRevision/hash/Frame、CAS、cancelEpoch、批准动作摘要重验。GUI、CLI、Agent全部复用这三类Port，不允许直接写D08、D12、D16或从检索索引复制“Owner真值”。

## 不经推荐模块的独立消费者验收

1. 05域独立测试服务从合成合同读取推荐，重算vc/vf/Q/Pc的单位及边界，不采信推荐服务`PASS`字符串；按D03/D10 Owner原件验真后才能提出新D05草案。
2. 06域求解器分别以D05 Draft及不带D05场景运行，核验A/B同事实、D07来源DAG及D08冻结不被覆盖；3D预览层不写业务资产。
3. 08/09/10域使用**最终D12 NC字节**、D13解释、D14轴时序和D15独立Oracle，验证D16必须拒绝仅有D09/CL动画、控制器未知语义、设备过期和D15 UNKNOWN。
4. 负例：切削模式G93/G94/G95混用、材料硬度缺失、工具伸出不明、超转速、Frame错配、跨Project、撤销ACL、CAS冲突、取消晚回执、伪造引用与提示注入，分别给出`REJECT/STALE/UNKNOWN`，不能补默认值冒充确定。
5. 分阶段迁移：只读影子推荐→逐字段比对旧工艺事实/指纹→独立业务Owner评估→人工准入；回退撤销新建议路由并保留旧业务数据。若写操作已提交，必须以新修订/补偿与真实Receipt对账，不得静默删除或覆写A/B冻结。

独立Node进程/OCCT真实几何、刀具数据库、机床/NC与跨域消费者尚`NOT_RUN`；Owner正式会签、L3`PENDING_HUMAN`。**规划PASS≠产品PASS。**
