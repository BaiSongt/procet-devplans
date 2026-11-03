# B151｜CAP-09-08播放时钟与NC工程时间隔离（2026-11-04）

> NEWLY_AUTHORED规划研究补证。保持原11域88 CAP、36原编号包、17资产与L1/L2不变；L3人审待定。**规划PASS≠产品PASS**。

## 新增问题与B70边界

B70已补旋转Joint整圈/短角错配，本轮不重复。新缺口是**播放画面在浏览器隐藏、丢帧、倍速、seek之后，可能悄悄跳越D14未覆盖时间段**。浏览器显示时钟与D14工程时序是两个域，前者不允许写入后者。rAF连续、Babylon平滑、高亮绿色都不能证明D15无碰撞，更不能提升D16发布。

只读播放映射：`displayTime = anchorVirtual + (performanceNow - anchorMonotonic)*rate`。暂停/hidden保持虚拟时间，恢复重新锚定；倍速/seek只作用显示光标，**不改变D14已证实的时间、Joint和SourceSpan**。区间`[start,end)`的缺失部分输出`UNKNOWN_GAP`，不得用直线/样条跨孔补出安全结论。实际控制器时钟若没有厂商/现场同步证据，则`controllerTime=UNKNOWN`，不要把Date.now或rAF帧数当真实时基。

## 已核阅资料（阅读深度/局限）

来源校正：旧W3C Page Visibility页面标注**已退役且MUST NOT用于新技术工作**；故B151-S02以WHATWG HTML Living Standard（2026-11-03更新）§6.2为当前规范来源；旧页仅作为废止识别，不列为设计依据。

| ID | 作者/文档/章节与时间 | 适用与禁止外推 |
|---|---|---|
| B151-S01 | W3C Web Animations Working Group，Web Animations Level 1，W3C TR在线版，日期未固定；访问2026-11-04；[原始URL](https://www.w3.org/TR/web-animations-1/)；§4.3.2 §4.4.3 §4.4.4 §4.4.15 | 官方公开HTML指定章节实读；hold/seek/playbackRate仅是浏览器播放时钟模型，非NC轴控制器标准 |
| B151-S02 | WHATWG HTML Standard editors，HTML Living Standard — 6.2 Page visibility，HTML Living Standard（2026-11-03更新，2026-11-04访问）；访问2026-11-04；[原始URL](https://html.spec.whatwg.org/multipage/interaction.html#page-visibility)；§6.2 Page visibility（Document.visibilityState/hidden、visibilitychange），§6.2.1 VisibilityStateEntry | WHATWG官方Living Standard公开HTML指定章节实读；§6.2有明确规范算法；替代原W3C已退役Page Visibility草案（原页明确MUST NOT用于新技术工作）；只为网页显示时钟事件提供事实，不证明真实Browser行为/OEM机床 |
| B151-S03 | Mozilla/MDN contributors，Window.requestAnimationFrame，在线文档未标固定版次/日期；访问2026-11-04；[原始URL](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)；timestamp/背景标签页/高刷新率 | 官方开发者文档指定章节实读；rAF后台常暂停、帧率不定，不能推NC时标 |
| B151-S04 | Mozilla/MDN contributors，High precision timing，在线文档未标固定版次/日期；访问2026-11-04；[原始URL](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing)；Performance.now vs Date.now; Time origins | 官方开发者文档指定章节实读；单调显示时钟非机器控制器时钟同步证据 |
| B151-S05 | BaiSongt/procet-devplans，CAP-09-08原业务规格，exact 35a24b79c00b2d2da8a451a4ca7ce05d3ec42ecf; blob d10b5b53ecf98e86d9dd6d15424343fea349ac19；访问2026-11-04；[原始URL](https://github.com/BaiSongt/procet-devplans/blob/35a24b79c00b2d2da8a451a4ca7ce05d3ec42ecf/docs/capabilities/CAP-09-08/README.md)；T02/T03/T05/T06/T07与R02/R03/R05/R06 | GitHub固定HEAD Blob全文实读；单Babylon、左TaskPanel、D14/D15隔离、ACL/CAS均为本仓内生规则，非外部标准 |

本轮实读W3C Web Animations、WHATWG HTML §6.2、MDN指定公开章节和固定HEAD原CAP，不编造标准页码/未读正文/厂商参数。源详细元数据见[5项来源](../../../research/sources/CAP-09-08-playback-clock-b151.json)。

## 规则、端口与可验收字段

[8规则32字段映射](../../../research/traces/CAP-09-08-playback-clock-b151-v08.json) → [8正32单字段反与8个数学Golden](playback-clock-b151-fixtures-v08.json) → [只读Node](../../../tools/check_cap0908_playback_clock_b151_v08.cjs) → [核验等级](../../../tracking/cap0908-playback-clock-b151-verification-2026-11-04.json)。R01时钟域、R02暂停seek、R03可变帧率、R04缺口、R05物理Joint/NC调用实例、R06安全证据、R07Owner事务、R08迁移与独立消费者各自含4字段和1正4反。

候选只读DTO：`PlaybackCursor{d14Revision,d14Hash,sourceTimebase,d10BindingFrame,callInstanceId,jointEventId,rotaryWinding,anchorMonotonic,anchorVirtual,playbackRate,visibility,coverageStatus}`。08域D13提供NC物理字节位置+调用实例，09域D14提供物理Joint时序/来源，09域D15**独立实现**工程Oracle，10域D16独立审批。D04名义Setup与D10实装绑定不同；D09中立CL与D11画面仅CL_ONLY。不做材料扫掠仿真。绝不从屏幕画面反写D14/D15。

GUI/CLI/Agent调用相同09域PlaybackEvidencePort。UI仅一个Babylon Engine/Scene/Canvas、统一左侧TaskPanel，字体≤12px、浅/深主题，显示UNKNOWN覆盖区间、精确NC行、调用实例和不可信时间颜色；预览不是提交。业务Owner操作提交前重验ACL、CAS、exact Revision/hash/Frame、scopeEpoch、取消Token；晚回执只可审计。A/B共享事实不覆盖冻结；老Reader+新Reader成对兼容和非破坏回退，失效旧证据降STALE。

## 验收等级

本轮同判据规划合成8正/32独立单字段反/8算术Golden符合预期，仅说明**规划资料可机器检查**。Node完整文件进程、真实Babylon后台、D14时间轴/机床运动、实际B5/OEM、D15独立消费者与D16发布均`NOT_RUN`。17 Owner正式会签0、独立消费者0、L3人审、历史原字节及全仓Markdown AST均待闭合。**规划PASS≠产品PASS。**
