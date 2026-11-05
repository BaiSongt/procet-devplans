# CAP-07-04｜B61 连续四/五轴G93逆时间进给与实际轴时序分层

**2026-10-31；V0.8规划研究补证，不代表产品实现。** 原11域/88 CAP/36包/17资产、L1/L2不变，L3待人审。关联CAP-08-02、原F1-03/E3-01/E3-02/E3-03/E3-04/E3-05/U4-04，不新立编号。

## 可复现的反例：名义F不等于物理Joint速度

在已**明确锁定LinuxCNC 2.9**的G93 inverse-time语义下，一段 G1 F2 的**编程名义时长**为 `1/F = 0.5 min = 30 s`，后一段继承G1但写 F4 为 `15 s`，两段相加45秒；它不含机床真实加减速、各Joint行程、控制器前瞻、进给覆盖倍率、伺服误差以及换刀/停顿。G93下每个G1/G2/G3块（**包括省略G1字母的模态继承运动块**）都必须给自己的F；G0快速定位不受G93影响。G94为单位/分钟进给、G95为每转进给；切换G94/G95后应有新的F。不同控制器、软件版本、选件、硬件配置不能默认继承LinuxCNC语义。

反例：`G93; G1 X10 F2; X20; G0 X30 F99` 中 `X20` 仍是G1却没有F，不能因前块F2或末块G0上的F99而放行；而 `G93; G1 X10 F2; X20 F4` 的两个名义时间分别30和15秒，**绝不推出实际五轴关节能在此时间完成**。本专项的结构化块判定器只覆盖上述有限语义，**不是NC逐字节解释器**；真实G02/G03几何、G93模态组合、宏/子程序及OEM执行参数必须由D13独立实现并验收。B28既有圆弧模态/全圆/R病态补证不重复。

## 字段、Owner、执行顺序与危险状态

- D09由07域持有中立TCP、刀轴、工艺进给意图；**不存G93/F行、物理Joint速度或控制器专有命令**。D04只持名义Setup；D10单独持控制器固件、选件、实际刀补/机床执行绑定。D12后处理在精确CL/后置配置/D10下生成不可变NC字节与SHA，D13必须**从最终D12字节独立解释**，记录G93/G94/G95模态和逐块名义时间与来源行；D14才依据真实运动学、轴加减速/控制器配置推轴时序；D15作独立NC工程验证、D16受控发布。
- `D13.FeedSemanticPort.readExact/preview/stage/commitCAS/cancel/rollbackAsNewRevision`为GUI、CLI、Agent共享的领域入口。单Babylon Engine/Scene/Canvas、统一左UnifiedTaskPanel、最大字体12px。界面分别展示“G93名义30s”和“D14实际Joint时序 NOT_RUN”，不得显示为同一个PASS。CL动画与材料扫掠不等于NC验证；**本规划不做材料去除扫掠仿真**。
- 所有写入由业务Owner重核ACL、CAS expected/current Revision、Hash、Frame、scopeEpoch、taskGeneration/cancelToken。取消晚回执与版本过期只能STALE/REJECT；A/B同工程事实且不可覆盖D08冻结。配置/Profile/NC字节/Frame变化必须使派生D13–D16按精确引用失效并保留历史，旧数据只读`UNKNOWN`，迁移Expand→Migrate→Contract且可非破坏回退。
- 对未识别宏、G95主轴信号、OEM G93差异、真实Joint动态与机床限位均保留`UNKNOWN`/NOT_RUN。即使本样例计算正确，不能批准发布、不能声称B5/OEM已按G93执行。

## 正反与机器门禁

[5项分级来源](../../../research/sources/CAP-07-04-inverse-time-b61.json) → [8规则/字段/原编号包](../../../research/traces/CAP-07-04-inverse-time-b61-v08.json) → [结构化正反过期未知夹具](inverse-time-b61-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0704_inverse_time_b61_v08.cjs) → [验证等级](../../../tracking/cap0704-inverse-time-b61-verification-2026-10-31.json)。

本轮已只在同一判定函数中合成验证 **47/47**：LOCAL_FEED_CANDIDATE 4、REJECT 27、STALE 8、UNKNOWN 8。不能把同函数自测冒充独立Node进程或真实解释器。实际独立D13、D14、D15的正反日志、真实D10控制器版本、NC原始SHA、完整展开运动记录、17资产独立消费者签署、L3审批及OEM测试均为**NOT_RUN/待人类**。

## 外部来源阅读深度与严格归属

|ID|来源/版本/出版时间|本轮实际可访问章节|适用限制|
|---|---|---|---|
|B61-S01|LinuxCNC Project，2.9，页面发布日期未核|官方G-Codes §59 G93/G94/G95公开正文|仅LinuxCNC，不可泛化Fanuc/SINUMERIK/B5|
|B61-S02|LinuxCNC Project，2.9，发布日期未核|官方G-Codes §5/§5.1/§5.3、§55|圆弧拓扑/控制器插补另需验证|
|B61-S03|Kramer/Proctor/Messina，NIST IR6556，2000|**仅NIST公开出版页及作者元数据**|PDF正文未读，不提取条款|
|B61-S04|Procet CAP-07-04 fixed Blob 293bf580…|完整原业务规格S01–S10与边界|CAS/GUI/D04-D10为项目规则|
|B61-S05|Procet CAP-08-02 fixed Blob 8a805c5c…|完整原方言规划|不是实际产品或OEM通过|

访问日期均为2026-10-31；精确URL和阅读限制见来源登记。**规划PASS≠产品PASS。**
