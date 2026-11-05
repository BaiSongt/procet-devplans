# B184｜原W2-02的联合搜索支配证据交接
2026-11-05 · 原工作包编号不变；L3/Owner待会签，不增加36的分母。

06域候选在交给W2-02前附 `DominanceWitness`：candidate exact D06/D07/sourceScope/stockBRepHash、D04 Frame/Setup、remainingStepUID、constraintsHash(余量/保护区/冻结/公差/前序边)、objective/profile/units、Pareto各项代价、admissibleBound来源及Beam截断/被弃候选清单。缺任意证据，写UNKNOWN而不是猜“同约束”。该证书仅供比较与人工采纳查看，不自动取得D05写权限。

05域W2-02从D05 head与D08 freeze exact SHA重新验证CAS/ACL和owner receipt；必须保留候选base/head/proposed及旧冻结不可变。若强制保留候选多样性，cost相等的分支不能因下界等号隐形删除。A/B采用不覆盖已冻结工程事实。预览到提交间修订变更需重算证书，晚ACK与取消拒绝。

测试入口：`node tools/check_cap0602_dominance_b184_v08.cjs`（只校验新规则和合成fixtures）。真实消费者须由06域和05域各独立复演两Setup、圆弧岛、不可见保护区、Beam截断及冻结冲突，最终D09/NC/D13-D15资格仍另行执行。**规划PASS≠产品PASS**。

[专项研究](../../capabilities/CAP-06-02/DOMINANCE-CERTIFICATE-B184-2026-11-05.md) · [规则](../../../research/traces/CAP-06-02-dominance-b184-v08.json) · [正反样例](../../capabilities/CAP-06-02/dominance-b184-fixtures-v08.json)。
