# CAP-07-08｜轨迹编辑与局部再生（V0.8，L3待审）

**原88项业务目标原文**：轨迹编辑与局部再生｜路径编辑、可视预览及变化影响。关联F1-03 / E3-01 / U4-04。L1/L2及88 CAP、36原工作包、17资产不变。该文仅实施规划，不是设计批准或产品PASS。

## 业务流程与关键边界

07域CAM Owner只在精确D09不可变修订上创建编辑草稿。用户或Agent定位stableSegmentId，进行替换、插入、删除、分段或同工序重排，再按D04 Frame、D03刀具、D05工序、D07有序材料前态、D08冻结及段依赖图判定受影响闭包。局部再生必须输出新D09 revision/hash与old→new段映射，原轨迹、D08冻结、已执行/发布证据保留。

不确定几何边、跨Setup坐标、刀具组件或材料前态发生变化时，不得声称未变化部分仍安全；保守扩大到整个工序/Setup或返回UNKNOWN。OCCT内部拓扑哈希不是跨修订稳定制造段ID。Protect历史轨迹只是保留历史，不是新几何下的工程安全证明。

## 十项实施子任务与拒绝条件

| 编号 | 工作内容 | Owner输入、异常及机器校核 |

|---|---|---|

| C0708-01 | 精确源和D08冻结绑定 | 旧D09必须通过revision/hash引用且D08不可修改，不能使用最新默认。 正反及独立变异：C0708-R01 |
| C0708-02 | 局部编辑段和坐标锚点 | 编辑仅作用于稳定段ID，左右手Frame或端点未知不得局部提交。 正反及独立变异：C0708-R02 |
| C0708-03 | typed运动与中立语义 | 不以G代码取代中立CL，圆弧/连续性/进给必须验证。 正反及独立变异：C0708-R03 |
| C0708-04 | 有向依赖闭包和保守再生 | 按段依赖传播脏标记，缺边或环则升级整工序或UNKNOWN。 正反及独立变异：C0708-R04 |
| C0708-05 | 冻结及已执行的不可变性 | 保护历史操作并不赋予新几何的安全验证资格。 正反及独立变异：C0708-R05 |
| C0708-06 | 唯一Babylon预览与左TaskPanel | GUI/CLI/Agent同Port，预览租约不是持久业务提交。 正反及独立变异：C0708-R06 |
| C0708-07 | 新D09及old-new段血缘 | 新D09保留真实来源和旧→新段映射，不能覆盖旧快照。 正反及独立变异：C0708-R07 |
| C0708-08 | CAS权限代次和取消晚回执 | 提交时重新校验权限、Frame、scope与任务代次。 正反及独立变异：C0708-R08 |
| C0708-09 | NC证据链按新D09失效 | CL动画不得提升为D15 NC工程验证，UNKNOWN阻断发布。 正反及独立变异：C0708-R09 |
| C0708-10 | Reader兼容与非破坏回退 | 恢复保留用户库、旧golden、D08冻结和历史NC，未测试的Consumer不能作PASS。 正反及独立变异：C0708-R10 |

## 数据与接口

编辑命令包括workContext、D09 baseRevision/hash、D08 frozenHash、D04 Frame revision/hash、scopeEpoch、taskGeneration、receiptGeneration、cancelRequested、editKind、stableSegmentId、操作前后TCP/刀轴/进给和预期D09 head。刀轴、位置在右手Setup局部坐标，Babylon手系变换只由RendererPort适配；CC不能充TCP。

先经CAMDomainPort.previewEdit与assessAffectedSegments在只读快照上执行图闭包，regenerateEditedCL产生候选，commitEditedNeutralCLWithCAS才允许写07域D09。GUI/CLI/Agent必须调用同一Port。提交瞬间重新校验ACL、scopeEpoch、Frame/材料来源hash、D08冻结、CAS expectedHead、任务及回执代次、取消状态；晚回执不写入。A/B共用精确事实，不覆盖冻结。

有向依赖图以段、工序、材料与装夹引用为节点，dirty从变更种子沿有向边前向传播，加入相邻端点和进退刀连接；缺边、环及来源过期必须fail-closed。受保护已执行段仅保持旧revision，修改需新修订而非静默覆盖。

## D09中立CL与NC资格

编辑新D09必使原D11 CL动画预验证、D12 NC字节、D13控制器执行语义、D14轴时序、D15独立NC程序验证、D16发布资格按新D09失效。D04工艺Setup与D10实际机床执行绑定分离；D09不能混入控制器G/M代码，D11动画不得声称D15 PASS。未知控制器宏/循环/偏置按UNKNOWN阻断发布，不做材料扫掠仿真。

## 迁移、回退及验收

Expand旧Reader与新编辑DTO并存；Migrate只追加D09派生修订及段级谱系；Contract须真实独立消费者验收、新旧Reader回放、原始字节Hash和离线恢复均通过，经人类审批再退出旧实现。回退切回旧revision和与之匹配的派生证据，禁止删除用户数据库、历史NC、D08、golden。

导航：[GUI与3D](UI.md) · [合成编辑DTO](contract.example.json) · [失效矩阵](invalidation-matrix.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者](independent-consumer-handoff.md) · [8来源](../../../research/sources/CAP-07-08.json) · [理论](../../../research/topics/R-TOOLPATH-LOCAL-REGEN-001.md) · [10规则及30变异](../../../research/traces/CAP-07-08.json) · [fixtures](fixtures.json)。

独立Node磁盘执行、实际OCCT/NC/机床/跨域消费者为NOT_RUN，L3及17Owner正式会签PENDING，规划PASS≠产品PASS。
