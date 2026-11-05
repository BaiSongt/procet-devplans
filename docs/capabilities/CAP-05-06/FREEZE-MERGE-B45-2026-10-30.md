# B45｜CAP-05-06三方合并与D08冻结依赖闭包（2026-10-30）

> 本轮只做规划研究补证。原11域88 CAP、36原工作包、17类业务资产不变；L3待审、Owner正式签署与产品测试未完成。**规划PASS≠产品PASS。**

## 新增工程判据与可证伪反例

传统三方文本合并不能直接替代D05工序依赖图校验。假定共同base工序A/B/C/D且A→B，冻结B时其前置依赖闭包应为{A,B}。当前A分支新增D→C并修改C，B提案新增工序E及C→E：合成D→C→E可保持无环、未触碰冻结前置依赖。若B提案再新增C→D，A/B分支**各自DAG无环但合并产生C↔D环**；仅检查变更工序ID无交集会误判安全。若修改A或新增B→E则违反冻结约束；D08原快照不得原地覆盖。

对节点采用稳定ID与Hash三方比较，对边采用base→current/base→proposed差分再构造合并候选，检查端点存在、整体有向无环、冻结目标前置依赖闭包及上下文exact revision/hash/frame。候选可合并只意味着**规划冲突规则满足**，不能证明D07去料体、D13控制器语义、D14轴时序或D15 NC工程验证合格。

## 合法来源、版本与阅读限制

- [Git merge官方手册](https://git-scm.com/docs/git-merge)：TRUE MERGE、冲突表示和ort正文已读，文本合并不保证制造约束。
- [Git merge-base官方手册](https://git-scm.com/docs/git-merge-base)：读描述及多个最佳共同祖先示例；交叉合并时不可以假定唯一base。在线手册页面版本未固定。
- [RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110)，R. Fielding/M. Nottingham/J. Reschke，2022-06：§13.1.1及§13.2.1/2.2实读，If-Match强比较能避免lost update，不等于跨Owner授权事务。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)，2013-04-30 Recommendation：修订wasRevisionOf、失效信息等定点实读，不能将来源关系直接视作审批。
- [NIST SP 800-53 Rev.5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)：仅出版目录、摘要和2025-08-27 Release 5.2.0说明；**CM-3控制正文未读**。
- [原CAP-05-06精确Blob](https://github.com/BaiSongt/procet-devplans/blob/3d5c386526b508bef0aeeeb47b6b2ef705e06cea/docs/capabilities/CAP-05-06/README.md)：冻结、CAS、A/B、GUI、下游失效和迁移为Procet内生规则，不归因于外部标准。

作者、版本、具体章节/阅读深度、限制、访问日逐项见[6份来源](../../../research/sources/CAP-05-06-freeze-merge-b45.json)；[10条规则/字段/资产/原W2-02、W2-03、W2-05及正反验收映射](../../../research/traces/CAP-05-06-freeze-merge-b45-v08.json)、[2正27反4未知合成样本](freeze-merge-b45-fixtures-v08.json)、[只读Node检查器](../../../tools/check_cap0506_freeze_merge_b45_v08.cjs)独立保存。

## 领域实现交接

05域候选Port `ProcessPlanFreezeDomainPort.previewThreeWayMerge`只读返回common ancestor/差异/冻结闭包/冲突分类，`commitResolvedPlanCAS`在提交瞬间重验ACL、expectedRevision、sourceHash、scopeEpoch、taskGeneration和取消标志；失败不得让晚回执写入D05。D05新修订与D08不可变快照分离，解冻须人工批准，回退追加新事件不删除历史。A人工与B求解共用事实和冻结，不共享可写修订头。

GUI/CLI/Agent必须通过同一05域Owner Port，左侧唯一TaskPanel，单Babylon Engine/Scene/Canvas，3D预选不是提交；仅深浅主题、最大字号12px。D04名义Setup与D10执行绑定不得混同。失效闭包D05→D06/D07→D09中立CL→D12后处理NC→D13执行解释→D14轴时序→D15验证→D16发布。D13未知明确UNKNOWN、D16阻断；CL动画不冒充NC验证，不进行材料扫掠仿真。

**独立消费者**：D06应另实现冻结硬约束审查，D08验证历史只追加，D07验证几何材料来源，D09/D12-D16逐步验证精确输入Hash/Frame、版本与反例；参见[独立验收清单](independent-consumer-handoff.md)。真实消费者0/17、Owner正式签署0/17、L3待人审、真实NC/OCCT/B5/OEM/浏览器与历史原字节审计仍待执行。
