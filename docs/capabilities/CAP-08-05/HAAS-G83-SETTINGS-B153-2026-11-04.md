# CAP-08-05｜B153 Haas G83递减啄钻与Setting 22/52/57的真实适用边界

**2026-11-04 · 新编规划补证 · L3待审 · 规划PASS≠产品PASS**。关联原编号E3-02、E3-03、U4-04；不修改11域/88 CAP/36原包/17资产编号。与既有[B47 LinuxCNC G83中间退R及0.254mm重进](PECK-MOTION-B47-2026-10-30.md)、[B131 G84](G84-TAPPING-DIALECT-B131-2026-11-03.md)和[B113 G98/G99车铣语义](RETURN-ROLE-B113-2026-11-02.md)区分，本轮专补**Haas Mill G83 IJK递减啄深、Q互斥、P持续状态与三个Setting的不同角色**。

## 核查来源与适用域

本轮按官方公开HTML实际阅读：[Haas Mill G83](https://legacy-aem.haascnc.com/content/haascnc/en/service/codes-settings.type=gcode.machine=mill.value=G83.html)的字地址、IJK/Q、P持续和Setting52；[Haas Setting52](https://haascnc.com/service/codes-settings.type=setting.machine=mill.value=S52.html)的R平面上方清屑；[Haas Setting22](https://haascnc.com/service/codes-settings.type=setting.machine=mill.value=S22.html)明确描述G73的Z小退；[Haas Setting57](https://haascnc.com/service/codes-settings.type=setting.machine=mill.value=S57.html)说明循环启动XY精停；[LinuxCNC 2.9 §43/44/47/61](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)只用作对照。Haas网页未核得适用机型/固件发布日期，LinuxCNC 2.9网页标示最后更新2026-11-01；**不能把两个厂商的G83路径当作同一个定义，更不能用LinuxCNC 0.254mm直接参数化Haas**。6份分级登记逐项记录作者、访问日期、版本、章节与局限：[research/sources](../../../research/sources/CAP-08-05-haas-g83-b153.json)。

## 新工程发现与推导

1. **固定Q vs 递减IJK必须作为两个独立Profile模式**。Haas Mill公开帮助允许I首啄、J递减、K最小啄深，且声明IJK方式与Q不可同用。教学合成采用 `step_i=min(remaining,max(K,I-(i-1)J))`。例如总深11mm、I4/J1/K2得到`[4,3,2,2]`mm，最后剩余量允许小于K；这个数学枚举只证明规则内部一致，不构成Haas真实插补路径、进给控制或切削安全的实现证据。D13不可把同名G83转换成LinuxCNC Q-only形式。
2. **P为模态状态而非仅本行文字**。Haas G83说明当前指定的P可延续到未重新指定P的后续块；后续行省略P必须从实际D13前态读取，若初值、重启/块删除路径或Profile作用域不明则`UNKNOWN`。不得由GUI预览推测补全。
3. **Setting52控制清屑时R平面上方的回退**，数值、单位、机器Setting快照都由D10实际绑定固定；`R+52`只能作为已约定正向Z合成示意，真实运动方向、边界、控制器分支及限位必须D13/D14真实解释，独立D15再判，不直接授予安全标签。
4. **Setting22不能由G83示意图标签误读成G83通用清屑退让值**。Haas Setting22在线正文描述的是G73短退；G83设计图存在#22标记不等于该Setting自动控制G83全回R。若固件差异导致真实影响，必须以具体Profile与实机日志另建证据，不能默认为真。
5. **Setting57改变循环起始位置是否精停**。OFF时官方警告Z可能在XY未精确到达时开始，不能据NC静态序列把各段视为天然完全停稳；ON也只是控制器设置候选，不是碰撞安全证书或D15 PASS。

## 字段、责任、Owner和接收者

八条规则按`来源ID→规则ID→四个机检字段→CAP-08-05/原E3-02 E3-03 U4-04→8正+32独立单字段反例`落在[追踪JSON](../../../research/traces/CAP-08-05-haas-g83-b153-v08.json)；另有8个算法/状态Golden。[测试夹具](haas-g83-b153-fixtures-v08.json)和[只读Node工具](../../../tools/check_cap0805_haas_g83_b153_v08.cjs)可供独立消费者复核。B153只检合成对象，不实现G-code词法/表达式/真实回退加减速。

- D04持有设计态Setup及名义Frame；D10持有上机实际控制器Profile、Setting22/52/57、刀具安装、机床Frame与scopeEpoch，二者不能合并。
- D09中立CL→D12最后后处理NC字节→D13独立读取最终字节及Profile展开`{sourceByteSpan,physicalLine,cycleEpoch,peckIndex,modalBefore/After,settingEvidence,d10Revision,frameId,scopeEpoch,semanticStatus}`→D14真实Joint时序→D15独立运动/干涉/限位验证→D16人工发布证据。CL动画/浏览器播放只是预览，未实现语义返回`UNKNOWN`、变更返回`STALE`，不做材料扫掠仿真。
- GUI/CLI/Agent仅经08域Owner Port调用；同一Babylon Engine/Scene/Canvas和左侧UnifiedTaskPanel，文字≤12px、浅/深主题；在任务面板分别标注`G83-IJK`、`Q`、`Setting52未知`、`XY精停未知`，预览不能修改业务事实。
- 每次提交重读最小C0 identity/revision/hash/frame/scopeEpoch、权限与CAS，对取消generation施加Fence；迟到ACK不得污染D13事实。A/B共享事实且不覆盖D08冻结。D10 Settings/Profile、最终NC、D04 Frame或产品Reader版本变化必须使相应D13–D16资格失效；Expand→Migrate→Contract，保留旧Reader/旧修订及可回退记录。
- 独立消费者D14必须按`NC byte span + cycleEpoch + peckIndex`核对D13重复事件且验证连续性；D15不能只消费本工具返回的`PASS`，需独立D10/NC/物理Joint Oracle。D16拒绝`NOT_RUN/UNKNOWN/STALE`和未签署Owner。

## 验收等级与边界

本轮只构造8正、32个各改一个字段的反例和8个算法/配置Golden（`48/48`V8内存规划验证）；没有目标Haas Setting快照、真实LinuxCNC/Haas执行器、Node完整文件进程、现场机床/夹具/主轴/PLC实证，也没有D14/D15或17类资产真实消费者签署。**Owner正式会签0/17、独立消费者0/17、L3人工待审，历史附件原始字节及全仓Markdown AST仍未闭合。规划PASS≠产品PASS。**
