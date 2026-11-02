# B125｜CAP-05-03 稳定拓扑择序及并发锚点（2026-11-03）

**V0.8研究补证，L3待审，原11域/88 CAP/36工作包/17资产不变；原W2-02/W2-03/W2-05。**

## 研究新问题

旧B66已证明显式前置边不得因传递约简删除。本轮聚焦另一问题：**人手拖动工序显示顺序，不能隐式修改其工艺先后图，也不能使过期锚点写入新的D05修订**。

设操作图为\(G=(V,E)\)，\(A\to C,B\to C\)，则\([A,B,C]\)和\([B,A,C]\)都是合法拓扑序；用户把B移至A前只能影响界面偏好。采用固定\(tieKeyVersion=B125-1\)的确定性零入度择序：每步只从当前无前驱节点中按版本化preference、StableOperationId决胜，删除已选节点出边并继续；遇到环、悬空边、重复ID、失效偏好直接REJECT。即使偏好为\([C,B,A]\)，若\(A\to B,A\to C\)，结果仍为\([A,C,B]\)。**此序不是资源调度计划、D14轴时序或实际机床执行许可**。如需真正修改优先约束，应通过独立\(semanticEdgePatch\)请求并重算依赖闭包。

## 8项来源、作者版本和实际阅读层级

|ID|访问范围|局限|
|---|---|---|
|S01 A. B. Kahn，1962-11-01，CACM 5(11)|ACM官方书目/摘要|未读全文；不能冒称原文规定业务偏好|
|S02 NetworkX 3.7维护者|lexicographical_topological_sort官方API、key与异常|滚动网页未锁源码SHA，算法例不证明产品|
|S03 P. Bryan、M. Nottingham RFC6902（2013-04）|§4.4 move正文，§5标题|数组位置JSON Patch不等于业务稳定ID|
|S04 R. Fielding、M. Nottingham、J. Reschke RFC9110（2022-06）|§13.1.1 If-Match及条件求值|只是并发防丢更新参考，不直接规定D05业务CAS|
|S05 H. Cho、A. W. Jones、P. Y. Jang NIST（2001-06-01）|非线性工艺路线与precedence官方摘要|未读全文|
|S06 W3C PROV-O，T. Lebo等编者（2013-04-30）|wasDerivedFrom/wasRevisionOf属性|来源关系不能充当授权或冻结证明|
|S07 S. Breiner、E. Subrahmanian、A. W. Jones NIST（2018-11-19条目/2019期刊）|串并行工艺模型官方摘要|未读全文，不能声称类论定义本系统拓扑算法|
|S08 本仓CAP-05-03原规格|GitHub固定Blob `b45dfb307554ed7a0f1f110533645a65b729e406`全文|内部业务要求，不是独立标准|

全部原始URL、版次、访问日期、章节/摘要与局限：[分级来源清单](../../../research/sources/CAP-05-03-stable-topo-b125.json)。

## 工程Owner、接口、异常与回退

05域D05是唯一写入Owner，D08冻结不能因模式A/B切换覆写。GUI、CLI、Agent统一调用\`RouteEditDomainPort.preview/commitCAS/cancel\`；D01/D02/D04/D05/D08输入要求exact `id/revision/hash/frame`与工程scope，同名不等于同一发生位置。分离显示投影\`displayOrder\`、原业务\`precedenceEdges\`和独立资源调度。移动锚点必须用OperationStableId、原D05修订及anchorStableId，旧位置下标不能经重排偷复用。

提交瞬间重新获取ACL、expected/current D05 Head、scopeEpoch、task/receiptGeneration与取消状态；撤权REJECT、过期STALE、取消CANCELLED，晚ACK无写入资格。跨Setup必须有04域D04转序精确Frame，**D04名义Setup不包含D10实际机床绑定**；缺证UNKNOWN。任何成功只追加新D05 immutable revision和血缘，D08冻结和原D16发布原样保留；失败则不提交。纯UI排序不会触发NC业务失效；真改边或装夹/材料才使受影响D06/D07/D09/D12/D13/D14/D15依赖STALE并阻新D16，不能原地修改已发布成果。

界面沿用**唯一Babylon世界、统一左TaskPanel、仅浅/深主题、最大12px**，显示“原precedence / UI偏好 / 当前合法拓扑序”三个不同概念，预览3D租约取消后释放，所有点击和晚回执经受管Port。A/B共享事实，不覆盖冻结。中立D09 CL→D12 NC后处理→D13执行语义→D14轴时序→D15独立验证→D16发布；D11/CL动画不能当D15工程PASS，控制器未知语义UNKNOWN，不做材料扫掠仿真。

历史Reader Expand→Migrate→Contract，缺OperationId或Frame的旧计划只读UNKNOWN，批准后fork修订；未证独立消费者通过之前禁止关掉旧Reader。回退引用历史修订及匹配的证据，不删除用户库。05域、06/07、08/09及10域应由**独立消费者**以正反例、真实修订和取消/撤权/迁移回归签收，当前0/17。

[来源→8规则/32字段→原包→8正32独立字段反例](../../../research/traces/CAP-05-03-stable-topo-b125-v08.json) → [另6项图Goldens](stable-topo-b125-fixtures-v08.json) → [只读Node验收入口](../../../tools/check_cap0503_stable_topo_b125_v08.cjs) → [核验等级](../../../tracking/cap0503-stable-topo-b125-verification-2026-11-03.json)。V8同判定函数规划合成不等于独立Node运行，更不等于真正的工序、NC或机床验收。**规划PASS≠产品PASS。**
