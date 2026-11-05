# B154｜CAP-04-04 FrameGraph动态观测时间见证、共同采样区间与缓存失效

**2026-11-04 · 原CAP增量研究 · NEWLY_AUTHORED · L3待人工审批 · 规划PASS≠产品PASS**。原编号工作包：F1-02、F1-04、W2-05、E3-04、U4-02。**与[B112静态SE(3)双路径闭环](FRAME-PATH-CLOSURE-B112-2026-11-02.md)不同，本轮仅解决“每条空间边都正确，但它们不属于同一时间/同一修订”的证据缺口**。不改L1/L2、11域/88 CAP/36包/17资产分母。

## 1. 可证伪的失效场景

- 静态名义D04坐标图可在指定修订成立；来自机内测头、现场复位、夹紧状态、临时校准的观测边，必须记录采样时间、有效时窗、时钟域、来源hash、校准状态及适用范围。**静态空间闭环相等并不能证明多源观测在同一时刻共同有效**。
- 设A观测边有效区间[100,180]ms，B观测边[140,220]ms，共同有效区间为[140,180]ms；请求t=160ms可构造仅供校验的候选见证。若A变为[100,120]ms，B保持[140,220]ms，则交集为空，必须返回`NO_COMMON_TIME_WITNESS`，不能把各边“最近一次”观测凑成同一工件姿态。这些数值**仅合成样例**，不是采样周期或制造公差。
- 请求时间160ms，测量采样150ms，用户自定义最大样本年龄20ms，年龄10ms满足样例；若请求改到200ms则超期40ms返回`MEASUREMENT_STALE_OR_UNKNOWN`。时钟不同源且未证明同步关系，即使两记录时间戳数值相同也返回`CLOCK_SKEW_UNQUALIFIED`。
- 时间t=0或`latest`在某些ROS tf2用法中是最新可用变换，**Procet D04精确时间查询不得默默转换为latest**，重放/撤权后的缓存也不得静默给当前工程决策。缺失观测历史为`UNKNOWN`，版本漂移为`STALE`，与合法`PASS`严格分级。

## 2. 官方资料与阅读边界

本轮核对：ROS 2 Rolling [tf2时间旅行公开教程](https://github.com/ros2/ros2_documentation/blob/rolling/source/ROS-Framework/client-libraries/Working-with-Client-Libraries/Tf2/Time-Travel-With-Tf2-Cpp.rst)的指定时刻/固定参考Frame与历史不足失败；[OCCT 8.0.1 TopLoc_Location](https://www.occt3d.com/dev/doc/refman/html/class_top_loc___location.html)的纯空间复合与反算；[Eigen 3.4.1 Transform](https://libeigen.gitlab.io/eigen/docs-3.4/classEigen_1_1Transform.html)的Isometry假设；[W3C PROV-O 2013](https://www.w3.org/TR/prov-o/)的Entity/Activity/invalidatedAtTime来源表达。ROS rolling版本浮动，**无法证明所用文档与具体ROS2发布包的完全一致**；OCCT/Eigen不定义采样时间及NC资格，PROV-O不规定业务CAS。所有具体Owner/门禁/字段属于本仓业务推导。六项分级记录逐项包含作者、版本、日期、URL、章节及未读范围：[登记](../../../research/sources/CAP-04-04-temporal-witness-b154.json)。

## 3. 数据合同和8条独立机器规则

建议D04新增只追加`TemporalFrameWitness={d04Exact:{revision,contentHash,frameId,scopeEpoch},sourceExact,clockId,clockDomain,sampledAt,validFrom,validUntil,calibrationExact,measurementHash,allowExtrapolation:false,cacheEpoch,pathEdgeRefs,provenance,uncertaintyStatus,proposedStatus}`，时钟单位与偏移方向明确；真实机床、控制器、G54及工件装夹的**执行绑定**始终由D10拥有。建议新字段必须经L3评审，现有Reader先忽略新增可选见证，不能假设已兼容。

| 规则 | 约束 / 失败状态 | 主要来源 |
|---|---|---|
| B154-R01 | 精确D04 revision/hash/Frame；`SOURCE_REVISION_OR_FRAME_STALE` | 内部CAP/B112 |
| B154-R02 | 请求时刻须在指定观测窗口；`FRAME_TIME_OUT_OF_RANGE` | ROS tf2类比+内生要求 |
| B154-R03 | 实测采样有年龄预算和hash；`MEASUREMENT_STALE_OR_UNKNOWN` | ROS/PROV/内生要求 |
| B154-R04 | 多条边有效时窗交集不为空；`NO_COMMON_TIME_WITNESS` | 交集数学推导 |
| B154-R05 | 跨设备时钟来源、同步和偏移预算均有效；`CLOCK_SKEW_UNQUALIFIED` | 内生规则，ROS仅类比 |
| B154-R06 | 不能以latest或无凭据外插代替精确时间；`TEMPORAL_FALLBACK_UNSAFE` | ROS/OCCT/Eigen适用边界 |
| B154-R07 | ACL/CAS/取消Fence必须原子重验；`STALE_CAS_OR_REVOKED` | 原CAP内生 |
| B154-R08 | D04、D10、D15及独立消费者资格分离；`EXECUTION_QUALIFICATION_CONFLATED` | 原CAP/B112内生 |

完整的`sourceIds→ruleIds→4 fields→CAP及5个原编号包→1正4个独立单字段负例`关系：[可机检追踪](../../../research/traces/CAP-04-04-temporal-witness-b154-v08.json) → [8正+32独立反+8数值Golden](temporal-witness-b154-fixtures-v08.json) → [Node只读测试入口](../../../tools/check_cap0404_temporal_witness_b154_v08.cjs) → [核验等级](../../../tracking/cap0404-temporal-witness-b154-verification-2026-11-04.json)。本轮合成校验器是**限定规则子集**；不实现真实tf2 Buffer、SE3时间插值或设备时钟同步，不声称与OEM一致。

## 4. GUI/CLI/Agent、状态迁移与消费者验收

同一04域FrameGraphPort提供`readExactSnapshot`、`proposeTemporalWitness`、`previewTimeWindow`、`commitWithCAS`，GUI/CLI/Agent**均不得绕开Owner**。ActivityRail→Setup→统一左UnifiedTaskPanel的“来源/时间窗/不确定/冲突/受影响资产”面板；全局**单Babylon Engine/Scene/Canvas**仅显示动态观测的时序叠层/UNKNOWN遮罩，12px上限、浅/深主题，无右侧Drawer。鼠标拾取/播放不提交领域修订。

Owner提交重新读取D01、D03、D04、ScopeEpoch、ACL、expectedRevision/hash/frame、当前时钟证据与取消generation，CAS后才能追加新不可变D04Revision；撤权、取消或迟到ACK只能留下审计，不得写入业务结果。A/B共享同工程事实，已冻结D08与已发布D16不可被新测量覆写。旧Reader采取Expand→Migrate→Contract：新增见证与旧格式双读、静态名义图保留、未知动态历史仅标UNKNOWN，不能填假时间或回填历史签名；异常可回退到旧快照但不得自动恢复已失效执行许可。

D04是名义Setup；D10才绑定现场设备/刀具/真实坐标。任何受影响D10、D12或D04 exact修订变化都必须独立重跑**最终D12 NC字节→D13模态语义→D14物理轴时间序列→D15工程校核→D16审批发布**，CL动画和浏览器播放只可标PREVIEW/CL_ONLY。未建模控制器语义必须UNKNOWN，不做材料扫掠仿真。

**独立消费者必测**：跨域D05/D09及D14分别验证新旧时间窗交集、相同hash但scopeEpoch变化、未知同步、过期采样、取消晚ACK、双Reader迁移和A/B冻结。消费者须固定自己的代码exact HEAD、D04/D10原始revision/hash/frame、测试命令/环境与独立Oracle输出，再由Owner签署；本轮这些真实签署与实现均**NOT_RUN**。

## 5. 核验等级

本轮仅在V8环境用相同纯函数进行**8正、32独立反、8数值Golden=48/48规划合成符合预期**，另检查每负例仅变一个字段。**不是独立Node完整文件进程执行，更不是真实ROS/OCCT/CAD、时钟同步、D13/D14/D15或B5/OEM测试**。17项正式Owner签署0/17、独立消费者0/17、L3人审、原历史附件原始字节及全仓Markdown GFM AST仍待。**规划PASS≠产品PASS**。
