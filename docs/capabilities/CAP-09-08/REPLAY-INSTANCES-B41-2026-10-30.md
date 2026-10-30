# B41｜CAP-09-08：重复调用实例、播放Seek与NC报告资格隔离（2026-10-30）

**原范围**：CAP-09-08《仿真播放与校验报告》，原工作包F1-02/E3-04/E3-05/U4-04；不是新增第89项CAP。原[完整目标与十任务](README.md)保持不变。L1/L2不变、L3待评审，C0仅复用identity/hash/revision/frame/scope原语。

## 发现与可计算反例

LinuxCNC 2.9 O-code的`call`和`repeat`意味着**同一NC源行可对应多个执行实例**；将`sourceLine=42`作为唯一事件键将把`call/1`与`call/2`的Joint事件、D15 finding误合并。示例两次执行共享NC字节区间[40,64)，但调用ID与Joint事件必须不同，合成示例不代表真实D13解释结果。LinuxCNC方言事实不可推广其他控制器。

对D14名义时间区间采用半开区间：[0,4,000,000)µs已覆盖，[4,000,000,6,000,000)µs**未覆盖**，[6,000,000,10,000,000)µs已覆盖。按时长计算覆盖率为80%，不能写成“全覆盖”。seek到5,000,000µs正落在未覆盖区间，GUI须显式标UNKNOWN，不可显示插值成功；倍速2×、-1×或0暂停仅为呈现游标，不改变D14/D15原始Hash。微秒精度与缺口端点是**本轮合成设计约定**，不是LinuxCNC、W3C或NIST规定的控制器时间精度。

## 证据阅读深度

| 来源 | 核实内容 | 不能推出 |
|---|---|---|
| [LinuxCNC 2.9 O-codes](https://linuxcnc.org/docs/2.9/html/gcode/o-code.html) | 官方HTML§4 Subroutines、§7 Repeat、§9 Calling Files可见正文，版本2.9 | 真实B5的循环行为、原始行到事件的映射已经实现 |
| [W3C Web Animations WD 2023](https://www.w3.org/TR/web-animations-1/) | §4.4.3/.4/.15当前时间、seek及playback rate；**Working Draft** | Web浏览器播放时间就是D14物理时间 |
| [W3C PROV-O Recommendation 2013](https://www.w3.org/TR/prov-o/) | §2及`prov:wasDerivedFrom`类型与来源关系 | 来源关系自动证明D15安全/审批有效 |
| [OCCT 8.0.1 BRepExtrema_DistShapeShape](https://occt3d.com/dev/doc/refman/html/class_b_rep_extrema___dist_shape_shape.html) | 官方API `Perform/IsDone/Value`仅两静态形状间最小距离 | 动态关节轨迹连续碰撞安全 |
| [NIST IR 8536 Final](https://csrc.nist.gov/pubs/ir/8536/final) | 2026-09-09元数据、作者、**摘要** | 未读全文条款及制造机床验收 |
| [固定CAP-09-08原稿](README.md) | 读取Git Blob `f6c3e48...`及十任务、D14/D15和GUI边界 | 原稿代表已签署L3或已实现API |

每份来源的作者、版次、日期、URL、读取范围、局限与定位详见[六项登记](../../../research/sources/CAP-09-08-replay-instances-b41.json)。标准条款及生产阈值均未编造。

## 数据端口与责任

`09.PlaybackEvidencePort.queryReplay({d10Exact,d12ByteHash,d13Revision,d14Revision,d15Revision,frame,scopeEpoch})`为**待审批设计契约**，GUI/CLI/Agent使用同一只读端口，不各自解释NC。

- D04仅Setup名义工件坐标；D10才是实际机床/控制器绑定。D12最终NC字节是D13独立解释的唯一输入之一，D13保留子程序展开的`CallInstanceRef{ncByteSpan,callerPath,invocationOrdinal,executionEventId}`；`sourceLine`只是显示定位，不能作为唯一键。
- D14提供物理Joint事件与显式`Timebase{unit,origin,clockEvidence}`、已覆盖/未知区间。D15由另一个消费者独立验证，报告的`not_run/unknown/stale`从来源事实原样渲染。D11 CL_ONLY不得升级；静态最小距离、颜色、流畅帧率或寻址成功不构成工程验证。不做材料扫掠仿真。
- 页面仅一个Babylon Engine/Scene/Canvas世界与统一左UnifiedTaskPanel；支持按原始NC字节/调用路径/实例序号/Joint Event/Finding逆向定位。控件最大12px字体，命中区另外满足可访问性；seek暂停、变速、反向播放只影响渲染游标。未覆盖区间展示斜纹UNKNOWN，而非“已验证绿”。
- 导出草案带D10/D12/D13/D14/D15 exact revision、Hash、Frame、原行多实例和时间缺口、Oracle版本及测试入口；当前为`NC_PLAYBACK_UNVERIFIED`并保留`SYNTHETIC_ONLY`水印，**禁止机器发布**。D16必须独立核对真实D15证据与授权。
- CAS/ACL/Scope/Frame在提交瞬间重新验证，取消/换Project/晚回执不接管；D03/D10/最终NC/D13/D14/D15改变后将既有报告标记STALE。A/B共享事实不覆盖D08冻结。Reader按`expand→dual-read→independent-consumer-negative-tests→contract`灰度迁移；失败保留旧只读记录并回退，不删生产数据。

## 可机检规则与验收

[八条规则、逐字段、原包及正反映射](../../../research/traces/CAP-09-08-replay-instances-b41-v08.json) → [4正、49独立单字段反、3显式未知](replay-instances-b41-fixtures-v08.json) → [只读Node校验入口](../../../tools/check_cap0908_replay_instances_b41_v08.cjs) → [本轮等级](../../../tracking/cap0908-replay-instances-b41-verification-2026-10-30.json)。本轮V8同judge()合成56/56，`independent Node process`、真实D13/D14/D15、OCCT、机床/控制器、D16消费者全部**NOT_RUN**；17资产Owner正式签署0/17、L3待人审。**规划PASS≠产品PASS。**
