# W2-01 独立消费者验收协议（规划待执行）
真实产品交接必须由不同Owner和QA独立验收，**没有执行记录不得标PASS**。
| 独立消费者 | 固定输入 | 正例 | 反例及阻断 |
|---|---|---|---|
| 06域 Solver（A首消费者） | D01 exact、可选D02/D04/D05冻结范围、预算/能力支持矩阵 | 未批准D05的适用A探索获得JobRef、D06仅候选/材料结果另验 | 缺真实毛坯仍报告材料计算就绪、跨Frame、无能力证据 |
| 05域 Planning（A→B首消费者） | D06 candidateId/hash + D05 expected revision + D08 freeze | 05域新建Draft、Host写HandoffRecord，旧D08不变 | Solver或Agent直接写D05、D08、CAS过期仍采纳 |
| 01域 Host（B直达/取消） | Project exact/ACL/generation/cancel race | 不运行Solver可建D05草稿；取消只产生一个终态 | 晚回执变完成、撤权后成功、双工程事实 |
| 07域 CL（仅后续） | D03/D04/D07/D08 exact完整 | 接受真实D07有序材料与D08冻结后独立再算D09 | 只凭D05 READY或CL动画直接宣称加工可行 |
| 08/09/10域NC→发布 | D09中立CL、D10执行绑定、D12最终NC、D13解释、D14轴时序、D15验证 | 独立控制器/机床子集证据+人类批准后才D16 | D13未知、D15缺失、最终NC被改仍沿用旧PASS |
每条验收单必须记录产品仓与工具**exact HEAD**、环境版本、真实输入hash/revision/frame/单位、脚本命令、日志hash、操作者与QA签署、变异负例及结果；允许失败/UNKNOWN，不得制造通过。新旧快照迁移的权限与兼容必须独立测试。当前QA、Owner、L3均PENDING；实际产品与实机 NOT_RUN。
