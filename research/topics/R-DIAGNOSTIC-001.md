# R-DIAGNOSTIC-001｜执行链溯源、失效和求解诊断
日期：2026-10-25。原编号U4-04，领域01/06/08/09。仅外部公开资料与合成规则，L3及真实产品待审。
 
## 已核对的公开证据与边界
LinuxCNC 2.9 [G-code Overview](../sources/U4-04.json)说明行内可含多个命令，N号可重复、乱序；因此用N号作为D12/D13唯一主键会产生伪链接，必须采用实际NC bytes hash与字节区间。此结论只是Procet的保守工程推导，不能由LinuxCNC文档推断所有控制器实现相同。NIST IR 6556只读官方著录页，没有读报告全文；ISO 14649-10:2004只核对目录摘要，不引用付费条款。
 
W3C PROV-O提供Entity/Activity/Agent与wasDerivedFrom关系语义，适用于“谁以哪些修订生产了何物”的记录模型；**不能独立证明hash、坐标转换或机床验证有效**。OpenTelemetry 1.62.0 API提供Span/Link/Event/Status，SDK允许采样DROP/不记录，因此可观测链只能辅助调查，不是唯一来源。即使Span.Status=Ok也不是D15的工程认证结论。NIST IR 8536于2026-09-09发布最终版，当前只阅读官方新闻摘要，不能宣称其要求U4-04所有字段或测试。
 
RFC9110的If-Match提供条件更新语义类比，但独立Owner CAS还必须在最终提交时间点核验ACL epoch、scopeEpoch、任务代次/取消、冻结D08和回执。WCAG2.2的键盘与焦点规则用于GUI设计，实际达标需GUI回归。
 
## 理论到规则的推导
可追溯链图边须带`{fromAsset,fromRevision,fromHash,fromFrame,fromByteRange,toAsset,toRevision,toHash,transformVersion,coverage}`；观测边与权威衍生边必须分类型，状态`EXACT/STALE/GAP/UNKNOWN`与工程`PASS/FAIL/PARTIAL/NOT_RUN`不能混称。**类型图可以反馈，精确修订DAG必须无环**。
 
映射可为一对多/多对多：最终NC Block定位、D13规范动作、D14时间区间和D15验证事件的基数不同，不能凭最近时间或同名N号强行配对。D12精确NC改动时，依赖传播只影响同Setup的D13、D14、D15、D16派生版本；不直接修改D09 CL、D08冻结、其他Setup。未经独立校准的D06搜索评分只是评分，预算耗尽返回UNKNOWN，不能声称安全概率/已证明无解。
 
## 逐项追踪与反例
[9条来源与阅读深度](../sources/U4-04.json)→[10规则到字段及D资产](../traces/U4-04.json)→[20正反+10独立变异](../../docs/work-packages/U4-04/fixtures.json)→[10项实施](../../docs/work-packages/U4-04.md)→[独立消费者](../../docs/work-packages/U4-04/independent-consumer-handoff.md)。校验为静态规划合成，不存在对真实NC解释器、Babylon/机床或产品Owner的PASS声明。
