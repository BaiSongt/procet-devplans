# B90｜CAP-09-06 反时进给与真实NC轴时序的证据边界

> 2026-11-01。V0.8既有CAP-09-06研究补证，关联原编号F1-02/E3-02/E3-03/E3-04/E3-05/U4-04；L1/L2不变、L3待审。**规划PASS≠产品PASS**。

## 工程结论

`G93`反时进给的`F2`表示指令块**名义**30秒（`60/F`），不是2mm/min，更不保证真实机床在30秒内完成运动。D12最终NC由08域D13按锁定Controller Profile解释、输出每执行实例的feed模态、原始NC字节位置/调用实例、F词和名义秒数；09域D14必须另从D03机床轴树、D10实际安装及加减速/轴限/前瞻规划产生轴时序；独立D15检验、10域D16签发。**CL动画、静态NC语法、G93名义时间都不是NC工程验证**。未建模语义与实机物理效果记`UNKNOWN`，不做材料扫掠仿真。

特别注意G94跨方言：LinuxCNC与Haas铣床G94是每分钟进给；Haas车床的G94为端面车削固定循环，不能仅按代码数值解析。Haas设备型号、Firmware/选件和Profile未锁时只作`UNKNOWN`，不能沿用铣床解释。

## 逐项合法来源、访问时间及读取限制

- **B90-S01** [LinuxCNC 2.9 §59 G93/G94/G95](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：2026-11-01已读取公开正文L1659–1669；G93每个G1/G2/G3插补块必须带F，G0不受影响，切换G94/G95后需新进给，G95有主轴反馈依赖；不能外推所有OEM控制器。
- **B90-S02** [LinuxCNC 2.9 §35–37 G61/G61.1/G64](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：2026-11-01已读正文L1012–1038；G64不带正P不等于受控偏差上界，与B90-S01同网站同文不同章节，登记不算不同论文。
- **B90-S03** [LinuxCNC 2.8 Important User Concepts §1.1–1.3](https://linuxcnc.org/docs/2.8/html/user/user-concepts.html)：2026-11-01已读正文；加减速/角点/前瞻会使程序进给与实际时间不同，2.8介绍不能替代2.9实机测量。
- **B90-S04** [Haas铣床G93官网](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG93.html)及**B90-S05** [Haas车床G94官网](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dlathe.value%3DG94.html)：2026-11-01只读取**官方搜索摘录**，原文跳转失败；没有声称已读完整手册，也不据此断言所有固件行为。
- **B90-S06** [Haas铣床G94官方公开正文](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG94.html)：已读公开页面，确认铣床G94退出G93，不可冒充车床含义。
- **B90-S07** [既有CAP-09-06固定Git Blob](https://github.com/BaiSongt/procet-devplans/blob/f1074c4de6cbf62f429f5441210116a0bfc57850/docs/capabilities/CAP-09-06/README.md)：已读取原十项业务工作与D13/D14/D15分离规则；ACL/CAS/GUI及Owner归属为Procet内生规则，**不是ISO或厂商原文**。作者、版本/日期、章节深度详见[登记JSON](../../../research/sources/CAP-09-06-feed-time-b90.json)。

## 指令公式与独立验收

`G93`名义`t=60/F`秒；`G1 F2`=30s；`G0`没有G93计时。合成线性例`G94`在mm模式下`t=60·L(mm)/F(mm/min)`，10mm/F120=5s。合成`G95`在**已锁rpm及主轴反馈**条件下`t=60·L(mm)/(F(mm/rev)·rpm)`，10mm/F0.1/rpm600=10s。三者都**不是实际物理时钟**；轴旋转、前瞻、override、加减速和真实B5/OEM约束尚未验证。

[7份来源](../../../research/sources/CAP-09-06-feed-time-b90.json) → [9规则/字段/原包/Owner](../../../research/traces/CAP-09-06-feed-time-b90-v08.json) → [27显式正反与3数值Golden](feed-time-b90-fixtures-v08.json) → [只读Node程序](../../../tools/check_cap0906_feed_time_b90_v08.cjs) → [验证分级](../../../tracking/cap0906-feed-time-b90-verification-2026-11-01.json)。B90-R1至R9依次为D12/D10精确身份、跨机种G94异义、G93逐块F、G0豁免及60/F、切换G94、G95反馈、G64偏差、名义与真实D14/D15、统一事务入口。每规则1正2反，候选只标`CANDIDATE_ONLY`。独立Node文件进程与真实控制器/轴时序仍NOT_RUN。

## Owner、GUI/CLI/Agent、迁移与安全

D04名义Setup与D10实际绑定严格分离；D08冻结事实不因A/B接管或Agent建议被覆盖。D12`FinalNcSourceRef{revision,rawSha256,subprogramClosureHash}`、D13`ExecutionEvent{byteSpan,callOccurrence,modalBeforeAfter,feedMode,feedWordPresent,nominalSeconds,profileHash}`、D14`AxisTimeEnvelope{d13EventHash,d10Hash,plannerHash,jointLimitRef,actualTimeStatus,coverage}`的Owner分别为08/08/09域；D15、D16要有独立资格与人类签发。三入口共用09域Owner Port，同一Babylon Engine/Scene/Canvas，统一左TaskPanel只展示当前受控快照/UNKNOWN原因；预览不提交。CAS+ACL+taskEpoch提交重验，取消晚ACK禁止写入；源Revision/Hash/Frame变化触发STALE和显式Reader迁移/原D08回退。不能用合成数据授予真实Owner会签或消费者PASS。

## 规划与产品分级

本轮合成同函数`27/27`及3个独立数学预期的数值计算完成，但远端Node完整文件、真实D13/D14/D15、LinuxCNC/Haas/B5/OEM、17资产Owner正式签署、17消费者实测、L3审核、全仓GFM AST与历史附件原字节均未闭合。**规划PASS≠产品PASS。**
