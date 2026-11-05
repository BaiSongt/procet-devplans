# B152｜CAP-08-03 圆弧模态/平面/R与IJK方言资格（2026-11-04）
 
> 原编号不变：CAP-08-03、E3-02/E3-03/U4-04；11域/88 CAP/36包/17资产分母不变，L3待审。**规划PASS≠产品PASS**。
 
## 业务问题和定界
NC的G2/G3不只是两端点和一个圆半径。解释必须绑定**最终D12原始字节、D10实际控制器/刀表/WCS/Frame、方言及固件配置哈希**，先由08域D13重读后输出类型化的圆弧/螺旋规范事件，再由09域D14展开真实机床Joint时序，D15独立工程验证；D16不能基于D09中立CL动画或前端插值发布。D04名义Setup不是D10机床执行绑定；未知功能必须显式UNKNOWN。
 
## 公开资料的真实证据等级
- [LinuxCNC 2.9 G-code HTML](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)：项目文档作者LinuxCNC Documentation Project，2.9在线版，2026-11-04定点实读§5、§5.1、§5.3和§5平面说明；具体发布日期未核定。G17/G18/G19分别使用IJ/IK/JK，G90.1/G91.1区分圆心绝对/增量；G2/G3有半径格式与圆心格式，R正负标示小/大弧，半径格式同起终点是错误。LinuxCNC的P整数可表达多圈，**不能类推Haas或其他OEM支持P**。官网§5所述半径误差条件是该版本解释器规则，不是本自编合成容差的来源。
- [Haas Mill G02/G03官方帮助](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG02.html)：Haas Automation，未核定适用固件、网页发布日期；本轮官方搜索摘录可见R正负和全圆需要IJK，但正文直开重定向失败，**仅搜索摘录**，不宣称读过全文或控制器实测。
- [NISTIR 6556（Kramer、Proctor、Messina，2000-08-01）](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3)：仅官方摘要及元数据实读。RS274NGC解释器产生Canonical machining functions的历史架构，与Procet D13规范事件有启发关系；**不代表现行各OEM兼容**。
- [CAP-08-03原规格，固定Blob](https://github.com/BaiSongt/procet-devplans/blob/17480e8e62b9ad7b116a546c20d10340e8cbe290/docs/capabilities/CAP-08-03/README.md)：GitHub固定HEAD正文实读。Owner/CAS、GUI/CLI/Agent及D04/D10分离均属于Procet内生规则，而非外部标准。
 
## 实施规则与精确字段
| ID | 规则和出错资格 | 核心字段 |
|---|---|---|
| B152-R01 | 最终NC和执行配置三重固定来源；`FINAL_BYTES_OR_BINDING_UNKNOWN` | `d12Hash / d10Hash / profileHash / sourceKind` |
| B152-R02 | 平面、弧心距离、线性距离和单位四组模态分离；`ARC_MODAL_UNKNOWN` | `plane / arcCenterMode / linearDistanceMode / units` |
| B152-R03 | G17/G18/G19平面字母与R/IJK互斥；`ARC_PLANE_OR_WORD_CONFLICT` | `plane / offsetWords / mixedRadius / centerOffsetsPresent` |
| B152-R04 | G90.1绝对弧心与G91.1增量弧心的独立计算；`CENTER_MODE_MISMATCH` | `mode / start / offset / declaredCenter` |
| B152-R05 | 平面圆心半径一致性与配置误差界；`ARC_RADIUS_MISMATCH` | `start / end / center / maxMismatch` |
| B152-R06 | R弧弦长可行域及正负R小大弧资格；`R_ARC_GEOMETRY_INVALID` | `start / end / signedRadius / arcClass` |
| B152-R07 | LinuxCNC版本限定的P多圈扫角；跨厂商未知不推断；`DIALECT_TURN_COUNT_UNKNOWN` | `dialect / turnCount / partialSweepDeg / totalSweepDeg` |
| B152-R08 | D13→D14→D15独立资格和Owner提交时重验；`NC_QUALIFICATION_OR_OWNER_UNKNOWN` | `d13Source / d14Source / d15Gate / ownerCommit` |
 
完整机器路径：[4项分级来源](../../../research/sources/CAP-08-03-arc-dialect-b152.json) → [8规则32字段及原编号包](../../../research/traces/CAP-08-03-arc-dialect-b152-v08.json) → [8正32单字段反与8解析Golden](arc-dialect-b152-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0803_arc_dialect_b152_v08.cjs) → [证据级别](../../../tracking/cap0803-arc-dialect-b152-verification-2026-11-04.json)。
 
## 算法必要条件（限定在二维G17数学样例，不冒充OEM解释器）
1. G91.1下圆心二维坐标`C=S+(I,J)`；G90.1下`C=(I,J)`。G90与G91的**终点**距离模式独立于弧心模式。G18是XZ，G19是YZ，严禁将固定G17的I/J当所有平面。
2. 圆心格式：`r_s=||S-C||`、`r_e=||E-C||`，`|r_s-r_e|≤ε_profile`是必要的几何资格；本示例ε=0.001仅是**内生测试设定**，真实解释器误差阈值、数字格式与单位必须读取当前Profile，不得偷用这个常数。
3. 半径格式：`d=||E-S||`，必要条件`0<d≤2|R|`；`S=E`的全圆不能用R混过去，必须显式读取支持的IJK完整圆心格式。单凭R与端点有两中心候选：`M=(S+E)/2`、`h=sqrt(R²-d²/4)`、`C±=M±h·perp((E-S)/d)`。有向G2/G3与R符号才有可辨的路径，靠近180°/360°的数值敏感性不能冒称安全。
4. LinuxCNC 2.9的P计圈示意：`sweepTotal=sweepPartial+360°×(P−1)`，例如90°+P2=450°。这是已声明方言下的**合成表示**，不保证对应其他控制器解释或最终物理轴转数；不支持的语义标UNKNOWN。
 
## UI/接口、失效与独立验收
- 同一`NcExecutionPort.interpretFinalNc()`服务GUI/CLI/Agent，唯一Babylon Engine/Scene/Canvas和左侧UnifiedTaskPanel显示NC原字节、平面/弧心/单位/线性模态、圆心两候选、方言证据、D13 UNKNOWN与D14真实Joint来源。纯CL示意必须标`CL_ONLY`，界面无法生成D15/发布PASS。
- 08域D13写事件必须在**业务Owner提交瞬间**重新校验ACL、CAS、ScopeEpoch、revision/hash/frame、taskGeneration与取消Fence，晚回执仅审计不得提交。D12编辑、D10偏置/刀表更改、Profile版本/控制器变更、D04 Frame修改均产生新精确版本、失效D13→D14→D15→D16，不覆盖D08冻结或A/B共同事实。
- 兼容过程按Expand→Migrate→Contract：保留旧弧事件Reader只读，新增带plane/arcCenterMode/format/turnCount/byteSpan的事件，影子比较不匹配返回UNKNOWN；回退到已有完整证据的旧版只读组合，不删除历史数据。09域D14及D15、10域D16是独立消费者，正式签署0/17、真实验收0/17。
- 工程测试入口：`node tools/check_cap0803_arc_dialect_b152_v08.cjs --root .`仅验证合成规划；另需LinuxCNC目标版本解释器、明确授权的Haas/其他OEM实际固件与G2/G3程序、单位/补偿/多圈边界、三轴和B5的真实D13→D14/D15反例及独立验收。**本轮真实控制器/NC、OEM、B5、浏览器及消费者均NOT_RUN。** 不做材料扫掠仿真。
