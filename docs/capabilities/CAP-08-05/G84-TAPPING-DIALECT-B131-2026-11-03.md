# B131｜CAP-08-05 攻丝 G84/G33.1 跨控制器同步语义

**2026-11-03；仅规划合成，L3待审，产品NOT_RUN。** 原11域/88 CAP、36原编号包不变；本项关联系统包E3-02、E3-03、U4-04，原[业务规格](README.md)保留。

## 官方证据及适用范围

1. [LinuxCNC 2.9公开G代码手册 §23](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：`G33.1`为主轴索引同步刚性攻丝，`K`代表每转距离；反转、超越终点和返回需要运动时序，不是仅一个Z直线。
2. [同手册§48](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：`G84`明确**不采用同步运动**，用于浮动夹头并在底部暂停；同字面`G84`不得被统称刚性攻丝。
3. [同手册§59](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)：`G94`每分钟、`G95`每转进给；进给每转模态不自动证明主轴同步。
4. [Haas Mill G84官方公开HTML](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type=gcode.machine=mill.value=G84.html)：G84可自行启动/停止主轴，带`F/S/R/Z`及OEM特定字段；[Haas RD0047 §16.4，更新2025-11-11](https://haascnc.com/service/troubleshooting-and-how-to/reference-documents/mill---rigid-tapping-.alarm=ngc_9918-0000.html)将刚性同步定义为特定选件能力。没有真实机型、固件/许可证证据只能UNKNOWN。
5. [Haas Lathe G代码§16](https://haascnc.com/service/online-operator-s-manuals/lathe-operator-s-manual/lathe---g-codes.html)的`G95`是端面动力刀刚性攻丝，与Haas Mill的G95进给每转含义不同。

以上六份章节登记包括同根页面，不等于六篇独立出版物；LinuxCNC、Haas厂商公开段落已阅读，未阅读任何收费标准正文。B5/齐二及其他OEM**没有**通过任何实机认证。完整[作者/版本/访问章节/局限](../../../research/sources/CAP-08-05-g84-tapping-b131.json)。

## 工程字段、Owner、状态与可验收链

[8条来源→规则→24字段→CAP/包→正反测试](../../../research/traces/CAP-08-05-g84-tapping-b131-v08.json)；[8正+24独立单字段反例、10个方言/选件语义Golden、3个数学Golden](g84-tapping-b131-fixtures-v08.json)；[只读Node检查入口](../../../tools/check_cap0805_g84_tapping_b131_v08.cjs)。

- **D03/D10**：真实controller+machineKind+interpreterHash、编码器与主轴索引、刚性选件、浮动/刚性夹头、实际机床Frame和安装证据，分别精确修订；D04仅名义Setup，不能代替D10。
- **D12→D13**：锁定最终NC byteHash、控制器/Profile/固件、cycle.code与motion语义，分离G33.1的K与G84的F；D13按**最终NC原始字节**重解析循环与反转状态，不能照搬中立CL动画。
- **D14→D15→D16**：反转超越、主轴加减速、轴进给与卡盘风险都应由D14展开，D15独立消费者重读NC/机器参数后验证。`UNKNOWN/STALE/NOT_RUN`阻发布；本轮最高级别`QUALIFIED_CANDIDATE_NOT_D15`，不是产品PASS。
- **共用入口/一致性**：GUI、CLI、Agent经08域`NcCycleInterpreterPort`，单Babylon世界和左侧`UnifiedTaskPanel`，全局≤12px浅/深主题。Owner写事务在提交时核ACL、scopeEpoch、expected revision/hash/frame及CAS、cancelGeneration，晚ACK不得恢复资格。A/B同事实不覆盖冻结D08；旧Reader双读与回退保留。

单位化名义关系：`v(mm/min)=S(rev/min)×p(mm/rev)`。例如500×1.25=625。**G33.1使用K=1.25而非自动F625**；真实进给取决于控制器硬件/模态与运动学，数值只是合成Golden，不能当OEM安全阈值。Profile、固件、选件、工具或NC改变，D13、D14、D15及D16旧证据沿来源DAG逐级失效。无材料扫掠仿真。

## 真正验收尚缺

独立Node完整文件进程、LinuxCNC/Haas/B5硬件与真实主轴同步、OEM选件/编码器检查、D14 Joint时序、D15独立消费者、17资产人类Owner签署、历史附件原字节及全仓GFM AST均NOT_RUN/未闭。详见[验证记录](../../../tracking/cap0805-g84-tapping-b131-verification-2026-11-03.json)。**规划PASS≠产品PASS。**
