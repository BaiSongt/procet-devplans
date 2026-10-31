# CAP-08-07｜CL与NC映射溯源（V0.8原编号，L3待审）

**原始目标**：程序段回到轨迹片段/工序/Setup；原关联工作包 **E3-02 / E3-03 / U4-04**。本次只细化此目标，不更改11域/L1/L2/88 CAP与36原编号包；L3继续人工审查。设计文件不表示产品已实现。

## 业务边界与不变量

D08冻结工艺及D04 Setup由原Owner持有，D09为07域的中立CL意图。08域D12把CL转换为最终NC字节及其后处理记录，D13必须独立读取最终NC及闭包解释控制器语义；09域D14以D10执行绑定展开轴时序，D15独立工程验证后D16才可发布。D11 CL动画/高亮只能标记`CL_ONLY`，不能冒充D15通过；未知控制器语义为`UNKNOWN`，本项不规划材料扫掠仿真。

**追溯是证据路径，不是等式**：后处理可能拆分、合并、重排CL、插入换刀/冷却/头尾程序，子程序/循环也使同一NC原始行产生多次执行。关系为多对多，`N`号可能重复/缺失，不能把行号、文本相似或画面轨迹当可靠映射。只能显示经版本化manifest证明的链接，未证明明确`UNMAPPED`并解释原因。

## 十项实施任务与字段级验收

1. **冻结输入四类权威引用**：由D08/D09/D04 Owner读取精确revision/hash/frame/scope，拒绝预览对象自动变成权威记录。 规则`CAP-08-07-R01`，来源`C087-S1/C087-S5`，字段`origin.d09RevisionPinned / origin.d09HashPinned / origin.d08FreezeRefPinned / origin.d04FramePinned`，资产`D08/D09`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P01/CAP-08-07-T-N01/CAP-08-07-M01`。
2. **建立D12物理byteSpan索引**：D12最终NC以原字节哈希+闭包哈希定位物理行/文件；重复N号仅显示，不用作主键。 规则`CAP-08-07-R02`，来源`C087-S1/C087-S2/C087-S5`，字段`nc.finalBytesHashPinned / nc.physicalByteSpanExact / nc.subprogramClosureHashPinned / nc.postConfigRevisionPinned`，资产`D09/D12`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P02/CAP-08-07-T-N02/CAP-08-07-M02`。
3. **输出类型化多对多源映射**：支持单NC块合并多个CL段、单CL段拆多个NC块、post自生头尾和无来源原因。 规则`CAP-08-07-R03`，来源`C087-S2/C087-S4/C087-S5`，字段`map.multiToMultiTyped / map.generatedNoOriginReason / map.unmappedExplicit / map.confidenceNotPass`，资产`D09/D12/D13`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P03/CAP-08-07-T-N03/CAP-08-07-M03`。
4. **后处理配置与生成活动留痕**：存D09→D12生成活动、后处理Profile与配置修订以及不可变来源关系。 规则`CAP-08-07-R04`，来源`C087-S5/C087-S6`，字段`provenance.generatedActivityId / provenance.revisionChainAcyclic / provenance.manualEditBreaksCertainty / provenance.oldMappingImmutable`，资产`D08/D09/D12`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P04/CAP-08-07-T-N04/CAP-08-07-M04`。
5. **D13独立重读最终NC**：控制流宏/循环按控制器Profile展开物理行+调用栈+迭代序号，UNKNOWN不能伪装源映射完整。 规则`CAP-08-07-R05`，来源`C087-S2/C087-S3/C087-S7/C087-S8`，字段`exec.finalNcReadIndependent / exec.callStackOccurrenceTyped / exec.modalSnapshotLinked / exec.unknownSemanticsPreserved`，资产`D12/D13`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P05/CAP-08-07-T-N05/CAP-08-07-M05`。
6. **坐标与真实运动分离**：D04工艺Setup/D03资源/D10执行绑定分别追踪；D14不能从D09 CL推轴时序。 规则`CAP-08-07-R06`，来源`C087-S1/C087-S5`，字段`frame.d04SetupExact / frame.d10ExecutionBindingExact / frame.d03ResourceRefExact / frame.noInferredAxisFromCL`，资产`D03/D04/D10/D14`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P06/CAP-08-07-T-N06/CAP-08-07-M06`。
7. **执行血缘失效传播**：D09编辑、D12人工修订、Profile/Setup/闭包变化，标记映射及D13–D16下游陈旧。 规则`CAP-08-07-R07`，来源`C087-S5/C087-S6`，字段`invalidate.repostInvalidatesMapping / invalidate.manualEditReevaluatesSource / invalidate.profileChangeStalesD13ToD16 / invalidate.historyNotOverwritten`，资产`D09/D12/D13/D14/D15/D16`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P07/CAP-08-07-T-N07/CAP-08-07-M07`。
8. **明确独立工程验证**：D11 CL预览只用于交流；D15必须依赖D13+D14和独立消费者证据，D16遇UNKNOWN阻断。 规则`CAP-08-07-R08`，来源`C087-S3/C087-S4/C087-S7`，字段`verify.d14NeedsRealAxisEvidence / verify.d15IndependentGate / verify.clPreviewLabeled / verify.unknownBlocksD16`，资产`D11/D13/D14/D15/D16`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P08/CAP-08-07-T-N08/CAP-08-07-M08`。
9. **Owner提交事务和回退**：同一领域UseCase重验ACL/CAS/revision/hash/frame/taskGeneration/cancelled，拒绝取消晚回执。 规则`CAP-08-07-R09`，来源`C087-S5/C087-S6`，字段`commit.casAclRechecked / commit.revisionHashFrameExact / commit.taskGenerationRechecked / commit.cancelLateAckIgnored`，资产`D09/D12/D13`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P09/CAP-08-07-T-N09/CAP-08-07-M09`。
10. **GUI/CLI/Agent交互一致性**：NC页面与唯一Babylon Viewer双向联动，无法定位展示原因，独立消费者及离线回退作为验收前置。 规则`CAP-08-07-R10`，来源`C087-S4/C087-S5/C087-S6`，字段`ui.singleBabylonRenderer / ui.leftUnifiedTaskPanel / ui.sameDomainUseCase / ui.independentConsumerPlanned`，资产`D09/D12/D13/D14/D15/D16`，原包`E3-02/E3-03/U4-04`，正反及独立变异`CAP-08-07-T-P10/CAP-08-07-T-N10/CAP-08-07-M10`。

## 使用者流程、异常与事务

在唯一左侧UnifiedTaskPanel的NC页选择`D09精确版本→D12最终字节→映射片段→D13调用实例→D14轴时序→D15验证`。双向选择只有精确映射才高亮，缺源、后处理插入、重复行、宏展开、失效来源分别有专用诊断。预览仅产生候选，不改D08冻结，A/B两模式消费同一权威revision，不允许局部回流覆盖A/B之外的冻结事实。

08域Owner提供`readExact()`、`resolveSourceSpan()`、`proposeMapping()`、`commitCAS()`、`invalidateConsumers()`；07/09域通过各自Owner端口参与，不把跨域运行态塞进C0。C0仅负责身份、单位、Frame、修订、作用域与最小消息。外部同步按If-Match类比重验CAS；真实ACL、taskGeneration与取消必须在Owner提交时再审，过期晚回执不得写新记录。显示/存储/运行不可混为一个revision。

后处理重跑、NC人工修改、D09段变更、D04 Setup、D10机床安装、Profile选件、外部子程序闭包哈希更改，均创建新证据版本并将依赖映射/D13–D16标记STALE；发生未知语义则`UNKNOWN`。失效后按Expand→Migrate→Contract保留旧Reader/历史golden/已发布引用；回退必须指向经验证的历史完整版本组合，不删除用户数据库、不改写D08冻结。

## 端口、样例、测试与理论链

[GUI及单Babylon联动](UI.md) · [候选接口](asset-owner-candidates.json) · [精确字节及多对多合成示例](contract.example.json) · [独立消费者和回退交接](independent-consumer-handoff.md)。

[8份研究来源与阅读深度](../../../research/sources/CAP-08-07.json) → [理论专题](../../../research/topics/R-CL-NC-PROVENANCE-001.md) → [10项规则与字段](../../../research/traces/CAP-08-07.json) → [30项正反独立字段变异、12项语义负例、5项映射样例](fixtures.json) → [校验工具](../../../tools/check_cap0807_planning_2026_10_26.cjs)。

本轮仅规划合成验证。**独立Node文件执行/控制器/真实OCCT、NC、机床与独立消费者测试NOT_RUN；17资产正式Owner签署与L3 PENDING_HUMAN；规划PASS≠产品PASS。**
