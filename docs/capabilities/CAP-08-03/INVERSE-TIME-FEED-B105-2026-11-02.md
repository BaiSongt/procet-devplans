# B105｜CAP-08-03 G93逆时间进给与D14轴时序独立证据

2026-11-02｜NEWLY_AUTHORED补证，父HEAD `a54b7c4bd68936967f54a22eb2aa45899f9ec548`；11域、88 CAP、36原工作包、17类资产不变，关联原E3-02、E3-03、U4-04、F1-02。L1/L2不变，L3待审。**规划PASS≠产品PASS。**

## 一、数学与控制器反例

`G93 F4` 是**15秒/插补块**，`G93 F120`是**0.5秒/插补块**，不可按120 mm/min（G94语义）解释。假设纯直线30mm且`G94 F300 mm/min`，理想时间`60×30/300=6秒`；若混合回转/未知路径度量，则不套用该公式，保持`UNKNOWN`。G0快移不受LinuxCNC2.9 G93影响，不从F字推算时间；本轮输出`DESIGN_OK_NO_TIME`、秒数null。所有计算仅为**编程目标时长**，没有进给倍率、速度规划、加减速及真实伺服反馈，不能当D14/D15产品认证。

## 二、来源与阅读深度

- [LinuxCNC 2.9 §59](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)已读公开正文：G93的1/F分钟，G1/G2/G3显式或隐式插补块各需F，G0不受影响，转入G94/G95后需要新F；另读§4 G1模态省略示例、§5 G2/G3开头。上述转入新F约束**只据LinuxCNC2.9**，不能套给全部OEM。
- [Haas G93官方](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG93.html)实读60/F秒、每插补块F、RESET→G94；[Haas G94](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG94.html)实读退出G93返回每分钟模式，**未**说明LinuxCNC式转换新F条件。
- [NIST IR6556](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)本轮**只读官方书目/作者/年份**，未打开PDF正文，不冒称有具体控制器条款；内部事务/GUI/Owner依据[既有CAP业务规格](README.md)。[六条来源逐条列出作者、版本、访问日期、章节、局限](../../../research/sources/CAP-08-03-inverse-time-b105.json)。

## 三、工程契约与入口

D09中立CL→D12后处理**最终NC原字节SHA256**→D13重新读取NC解释G93/G94初始模态、逐块原F与隐式插补→D14以D10实际机床运动链展开轴时序→D15独立消费者核验轴限位、速度、加速度→D16受控发布。D11 CL动画不是工程认证；不做材料扫掠仿真，未支持G95、宏、G5及混合回转时间明确`UNKNOWN`。

D13建议输入`{ncRawSha256,controllerProfileExact,firmwareExact,initialModalSnapshotExact,blockOccurrence,modalBefore,modalAfter,rawFWord,implicitMotionMode,d04Exact,d10Exact,frameId,unit,scopeEpoch,expectedRevision,cancelGeneration}`，输出`{programmedTargetSeconds,nominalOnly:true,unknownReason,modalEvidence,d13InterpretationHash}`。D04仅名义Setup，D10才持有机床执行绑定；Profile/NC字节/D10 Frame改变，D13–D16按依赖失效，不原位改D08冻结事实。

GUI、CLI、Agent调用08域同一受管Owner Port；唯一活动Babylon Engine/Scene/Canvas、左侧UnifiedTaskPanel、浅深主题、最大12px，显示G93/G94/每块F/目标秒数及UNKNOWN。提交边界重验ACL、ScopeEpoch、Revision/Hash/Frame CAS与取消Fence，晚ACK不复活资格。A/B共享事实但不覆盖冻结；迁移采用旧新Reader影子双读，旧版本只读回退、不覆盖历史D17现场记录。

## 四、正反与独立验收

[8条规则、字段与原工作包](../../../research/traces/CAP-08-03-inverse-time-b105-v08.json) → [39合成正反/UNKNOWN夹具](inverse-time-b105-fixtures-v08.json) → [只读Node](../../../tools/check_cap0803_inverse_time_b105_v08.cjs) → [验证分级](../../../tracking/cap0803-inverse-time-b105-verification-2026-11-02.json)。反例包括G93无F、隐式续行偷F、F0、G0伪估时、LinuxCNC切G94未新F、Haas RESET后仍按G93、G94混合回转、实际时间未认证。V8同judge内存合成39/39、6目标时间Golden；**独立Node整文件、真实OEM/B5及D14/D15、17 Owner与消费者、全仓GFM AST、历史原字节、L3均未验证**。规划PASS≠产品PASS。
