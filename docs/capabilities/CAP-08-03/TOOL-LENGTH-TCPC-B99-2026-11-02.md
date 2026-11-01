# B99｜CAP-08-03 刀长补偿、G43动态模态与Haas G234 TCPC

2026-11-02｜**NEWLY_AUTHORED**规划证据补齐，父HEAD `af46934ed2a91319014602159650b8bd4c8ee257`。原11域/88 CAP/36原工作包/17资产编号不变；本增量关联原 E3-02、E3-03、U4-04、F1-02。L1/L2不变，L3仍须人工批准。**规划PASS≠产品PASS。**

## 一、重要结论及官方正文核对

**D03刀柄总成的量规长度不等于D10现场刀补表当前H，也不等于D13实际有效补偿或D14已验证的刀尖轨迹。** D04是名义Setup，D10才是真实机床/工装/刀具安装和控制器Profile。中立D09 CL→D12最终NC原字节→D13重解释→D14运动轴时序→D15独立验证→D16审批发布；D11 CL画面不是NC工程认证，UNKNOWN不得进入发布，不做材料扫掠仿真。

- [LinuxCNC 2.9 G-Codes §28–31](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：G43应用H索引，G43.1**替换**动态偏置，G43.2**叠加**偏置，G49取消。上述偏置代码本身不直接移动机床，后续相关轴运动才体现。G43 H0在随机与非随机刀库行为有差异；未知换刀构型不得假定H0=0。
- [Haas官方G43](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG43.html)指明NGC从软件版本100.21.000.1100起，默认刀补状态、换刀更新和跨开机持续行为有所变化；[官方G49](https://haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG49.html)还列H0/M30/RESET取消。不可从某一说明推断全部固件当前实际模态，必须固定固件和初始化/接收时的模态快照。
- [Haas G234 TCPC官方UMC分节](https://haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG234)明确G234 H同块、MRZP/WCS来源、G43/G254不共用，以及快速回转不保证刀尖位置保持、启用后可能超轴限。G234并非所有OEM五轴G43.4的统一解释；缺机型适配时**UNKNOWN**。
- [NIST IR6556](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)本轮只阅读公开书目/摘要，未读PDF正文；没有假称NIST给出上述Haas条款。具体来源作者、版本、日期及阅读深度见[登记](../../../research/sources/CAP-08-03-tlo-tcpc-b99.json)，内生权限与3D约束来自[既有CAP原稿](README.md)。

## 二、几何Golden反例与Frame边界

仅定义一个合成右手Frame：主轴规范点`p`、从刀尖指向主轴的单位向量`a`和量规长度`L`（mm），刀尖`tip=p−L·a`。`p=(0,0,120)`、`a=(0,0,1)`，L=100得到(0,0,20)，L误配105得到(0,0,15)；把轴设为`a=(1,0,0)`、`p=(120,0,0)`，相同5mm偏差转为X方向(20,0,0) vs (15,0,0)。这是几何解析例，不是任何Haas/LinuxCNC/B5物理轴的FK，也不能替代D14/D15。

## 三、字段、同域入口、失效与迁移

D13建议输入`{ncRawSha256,controllerDialect,machineModel,firmware,initialModalSnapshotRevision,hIndex,toolTableSha256,toolChangerClass,d03Exact,d04Exact,d10Exact,unit,frameRef,wcsRef,mrzpRef,scopeEpoch}`，输出`{lineOccurrence,activeLengthMode,effectiveOffsetProvenance,toolAxisFrameRef,unknownReason,interpretationRevision}`。不同H/表SHA、G43.1覆盖误当叠加、G234/G43双开或缺MRZP拒绝；控制器方言/开机模态/快速回转无法解释时UNKNOWN。D14必须避免对D13已解释的位姿重复补偿。

GUI/CLI/Agent全部通过08域同一受管Owner Port；左侧唯一UnifiedTaskPanel展示H有效值、原表Hash、D03与D10差异、G43/G234状态及未知原因。全局单活动Babylon Engine/Scene/Canvas，浅/深主题、最大12px；预览不产生D15签署。提交瞬间ACL、scopeEpoch、expectedRevision/hash/frame CAS与取消代次重验；撤权或取消晚ACK仅写审计而不复活资格。A/B共享事实但不覆盖D08冻结。

迁移先旧新解释器影子对读→D14/D15真实独立消费者用最终NC正反验证→人工批准切换；任一机床/刀补/Frame变化仅失效必要D13–D16，失败回退旧Reader与旧精确Revision（只读），历史签发/现场事实不被覆盖。

## 四、可机检链路与限制

[6来源](../../../research/sources/CAP-08-03-tlo-tcpc-b99.json)→[8规则、16字段、关联CAP与原工作包](../../../research/traces/CAP-08-03-tlo-tcpc-b99-v08.json)→[合成正反/UNKNOWN](tlo-tcpc-b99-fixtures-v08.json)→[只读Node](../../../tools/check_cap0803_tlo_tcpc_b99_v08.cjs)→[分级验证](../../../tracking/cap0803-tlo-tcpc-b99-verification-2026-11-02.json)。V8同一judge规划合成及几何Goldens不等于独立Node进程、真实LinuxCNC/Haas/B5、D13–D16或17消费者验收；全部**NOT_RUN**。
