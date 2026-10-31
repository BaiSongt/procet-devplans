# CAP-02-03｜2026-10-28 研究证据与机器追踪补证

本稿是原V0.10《刀柄与刀具总成》与 [R-TA-001](../../../research/topics/R-TA-001.md) 的**增量证据导航**。原[references.json](../../../research/references.json)的SRC-TA-001..008仍为合法历史入口，本轮不重写旧来源字节、不假装重获2002年厂家手册。新增Registry为本轮重新核阅的**6条登记记录，不是6篇不同论文**。

## 可验证路径

[官方公开来源、版本和真实阅读深度](../../../research/sources/CAP-02-03.json) → [10条规则、40个字段、关联原包及TA-AC](../../../research/traces/CAP-02-03.json) → [10正40独立负变异、8状态验收设计](research-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0203_research_v08.cjs)。

规则涵盖：精确子件修订与冻结A/B、配合证据、具名parent-local右手Frame、TCP语义、Gauge/Stickout/Engagement/H区分、D03/D04/D10/D13写权、Owner ACL/ScopeEpoch/CAS、取消晚回执与撤销、GUI/CLI/Agent单Port与单Babylon/统一左TaskPanel、D09 CL→D12最终NC→D13→D14→D15→D16。未知D13语义不能发布，CL动画不代表D15，禁止材料扫掠仿真。

新校验器检查**规划谓词与变异覆盖，不执行NC控制器、真实Owner事务或机床测试**。原TA-AC-01..16保持产品级待执行；10正40负的“PASS”也不能推导出产品PASS。8个状态案例是具名工程测试设计，不是Worker/机床模拟实跑。

## 来源阅读边界与未决

- ISO 13399-1:2006与ISO/TS 13399-60:2014只读官方目录与Abstract；前者2021确认，后者官网显示under review，不臆造付费词典尺寸或接口兼容结果。
- OCCT 8.0.1 gp_Trsf公开方法与LinuxCNC 2.9 §28–31已核，前者**可表示镜像/缩放**，应用层必须另行检查SE(3)；后者只代表LinuxCNC，不推广Fanuc/Siemens/B5。
- RFC9110 §13的If-Match、W3C PROV-O来源关系仅为接口及证据模型参照，并不证明已执行Owner CAS或真实校准。
- 缺少实际B5主轴接口、真实刀柄及刀具量测、控制器方言和独立消费者签字，仍按UNKNOWN或NOT_RUN保留。

**L1/L2不变，L3待人类审查；C0最小公共、D04≠D10、A/B冻结不覆盖。规划PASS≠产品PASS。**
