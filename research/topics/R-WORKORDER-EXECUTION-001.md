# R-WORKORDER-EXECUTION-001｜现场作业指导、工单状态与制造证据
**研究对象**：CAP-10-06（原基线“作业指导、交付记录及工单关联”，E3-06/T5-03），不改变既有11域/88CAP/36包/17资产。
## 证据分类、版本与阅读边界
- **C1006-S01 OPC UA for Machinery - Part 3: Job Management**；OPC Foundation；版本1.0.1；发表2024-05-01；2026-10-27访问[原址](https://reference.opcfoundation.org/specs/OPC-40001-3/full)；范围公开HTML §6.2/§6.4/§7.2/§8.1；用于JobOrderControl/Results区分，执行顺序、ERP OrderNumbers及Good/ProducedQuantity；**局限**是否有实际服务器实现JobOrderControl必须能力探测；规范不能证明生产完成。
- **C1006-S02 OPC UA for ISA-95 - Part 4: Job Control**；OPC Foundation；版本2.00.0；发表2024-01-31；2026-10-27访问[原址](https://reference.opcfoundation.org/specs/OPC-10031-4/full)；范围公开HTML §1、§6.2.1、§6.2.7/§6.2.8；用于JobOrderReceiver状态控制与JobResponse机制分层；2.0相对1.0不兼容；**局限**StoreAndStart可选接口不意味着机床允许远程启动；不得自动执行。
- **C1006-S03 OPC UA for Machine Tools - Part 1: Machine Monitoring and Job Management**；OPC Foundation / VDW；版本1.02.0；发表2024-11-01；2026-10-27访问[原址](https://reference.opcfoundation.org/specs/OPC-40501-1/full)；范围公开HTML §8.4.1/§8.4.3/§8.4.9及Annex B.2；用于旧ProductionJob模型1.02已弃用；RunsCompleted不代表件合格；迁移到OPC 40001-3；**局限**旧设备可能仅实现旧节点，迁移需逐厂商兼容及只读映射。
- **C1006-S04 ISO 22400-2:2014 KPI definitions and descriptions**；ISO/TC 184/SC 5；版本2014 Edition 1，2017 Amd 1另列；发表2014-01；2026-10-27访问[原址](https://www.iso.org/standard/54497.html)；范围合法官网目录/摘要与生命周期：正文未获得；2026 ISO/DIS修订中；用于KPI需有公式、单位量纲和时间行为；仅作为字段建模依据；**局限**不引用未读标准公式、条款或具体默认阈值；草案未生效。
- **C1006-S05 On-Machine Measurement Use Cases and Information for Machining Operations**；John A. Horst、Thomas D. Hedberg、Allison Barnard Feeney；版本NIST AMS 400-1；发表2019-08-02；2026-10-27访问[原址](https://www.nist.gov/publications/machine-measurement-use-cases-and-information-machining-operations)；范围NIST出版著录、作者与摘要；未读取论文PDF全文；用于在机检测需要独立信息元素与数字线程语义；测量事实不等于设备运行状态；**局限**摘要不能替代计量误差、试验设计或合格判定依据。
- **C1006-S06 RFC 9110 HTTP Semantics**；R. Fielding、M. Nottingham、J. Reschke；版本RFC 9110；发表2022-06；2026-10-27访问[原址](https://www.rfc-editor.org/rfc/rfc9110.html)；范围公开HTML §13条件请求/§15.5.13 412；用于If-Match条件更新避免lost update；引申为业务CAS设计思路；**局限**HTTP原语不自动提供工厂Owner权限、离线幂等或事件一致性。
- **C1006-S07 PROV-O: The PROV Ontology**；Timothy Lebo、Satya Sahoo、Deborah McGuinness；版本W3C Recommendation；发表2013-04-30；2026-10-27访问[原址](https://www.w3.org/TR/prov-o/)；范围公开正文§2、§3.1；未验证现场PROV实例；用于Entity/Activity/Agent及wasGeneratedBy/wasAssociatedWith支持事实来源追踪；**局限**PROV图并不证明物理真实性、质量认证或生产完成。
- **C1006-S08 DIGITAL MANUFACTURING: REQUIREMENTS AND CHALLENGES FOR IMPLEMENTING DIGITAL SURROGATES**；Guodong Shao、Deogratias Kibira；版本NIST出版研究；发表2018-12-12；2026-10-27访问[原址](https://www.nist.gov/publications/digital-manufacturing-requirements-and-challenges-implementing-digital-surrogates)；范围NIST公开著录/摘要；未读全文；用于动态设备数据和真实工厂运行状态协调是独立研究问题；**局限**摘要不能推导具体时钟精度、生产模型真实性或现场执行认证。
## 工程推导（非标准原文复制）
1. OPC 40001-3将JobOrderControl与JobOrderResults建模分离，结合OPC 10031-4的JobOrder/JobResponse机制，故10域区分“工单排队/准备/现场实际执行/结果回执”。但协议可选能力不能证明具体机床可接受JobStore/Start；不得以工单系统直接远程启机。
2. OPC 40501-1 v1.02中旧ProductionPlan/ProductionJob已弃用，且RunsCompleted不表示Part质量。工厂旧数据必须做版本化adapter映射，不把废弃结构当统一标准，不把任何ProducedQuantity自动升格为质量合格。
3. ISO22400-2:2014合法官网摘要说明KPI公式有单位、时间行为和量纲，故规划独立记录produced/good/scrap/rework及证据；**未读全文，绝不填入所谓ISO公式或阈值**。NIST AMS 400-1仅有出版摘要，支持质检语义与车间信息元素需专门建模的研究方向，不能承诺误差或检验合格。
4. RFC9110 §13的If-Match防丢失更新启发CAS；但公开协议只保障适用的HTTP条件操作，业务Owner必须额外重验ACL/scopeEpoch/frame/cancelToken。PROV-O支持实体、活动、代理及来源关系，仍不能证明现场真实NC执行。
5. 一致性事实图：外部MES工单→10域投影→D16**已签发**发布包→D12最终NC raw digest→D13执行语义→D14 Joint时序→D15独立Oracle；实际D10 Frame是现场执行引用，D04是名义工艺Setup；D17现场观察与交接回执仅append。**CL动画、遥测、工单完工、签收不能替代D15**，不做材料扫掠仿真。
## 反例与研究未闭项
- 机床只支持旧OPC 40501或只上报观测：无法证明可用JobOrderReceiver，则`UNKNOWN`，不猜厂商私有指令。
- ERP单号复用、程序名称相同、D10错Frame或D16签名失效：独立消费者必须拒绝关联/阻断上机；所有关联要externalJobId+sourceRevision+machineProfile+NC原始字节。
- 现场断网、事件延迟、OPC时钟异常或质检晚于机床工序完工：保存不同时间与质量、追踪source，禁止将缺口填充为执行证据。
- 实际厂商Controller、OPC服务器和MES实例、现场权限、质检Oracle及Win/GPU产品全部**NOT_RUN**；L3与17Owner待人类会签。**规划PASS≠产品PASS**。

[原业务规格](../../docs/capabilities/CAP-10-06/README.md) · [8来源可机检登记](../sources/CAP-10-06.json) · [10规则40字段](../traces/CAP-10-06.json) · [72合成案例](../../docs/capabilities/CAP-10-06/fixtures.json)。
