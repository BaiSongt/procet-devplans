# CAP-09-08｜统一3D播放、事件与校验报告

只使用现有RendererPort绑定的**一个Babylon Scene**，不再创建第二个3D窗口。左UnifiedTaskPanel宽度可调整，界面12px最大字，浅/深主题，紧凑无卡片堆叠。

左TaskPanel依次为：**01 输入版本**（D12最终NC字节SHA/D10实际机床绑定，D04名义Setup只读）；**02 时间轴**（D14绝对时间、t0/t1、PhysicalJoint、停顿/换刀）；**03 NC文本**（ByteRange+callInstanceId防重复子程序合并）；**04 独立验证**（D15 findings、UNKNOWN/STALE/REJECT、Oracle版本、覆盖缺口）；**05 证据报告**（Frame、来源哈希、生产命令、实际退出码）；**06 D16跳转**（不可越权发布）。

Babylon中心场景仅显示D14真实已知Joint事件与D03机床连杆、D10刀柄/夹具/工件实际绑定的姿态；缺模型不补造枢轴，显示UNKNOWN。选中Joint→时间轴→NC字节区间→独立finding双向联动；颜色不是安全证据。seek、暂停、倍速、倒回修改本地游标，不重解释NC、不写D15、不改变冻结结果。

GUI/CLI/Agent统一`PlaybackEvidencePort`领域入口。导出报告时CAS expectedRevision、ACL、Frame、scopeEpoch、取消重检；取消后晚回执不可覆盖。正常与反例涵盖重复调用实例、G4停顿、未知宏、反向seek、缺D15 Oracle、变更D10安装、取消及撤权。浏览器、真实B5、控制器和独立消费者NOT_RUN。

## B70｜显示原始Joint累计角（2026-10-31）
左UnifiedTaskPanel时间轴显示`jointId/unwrappedDeg/normalizedDisplayDeg/timebase/intervalCoverage`；D14已给定0→180→360度时必须按Joint时间轴演示整圈，而不是以首尾Quaternion.Slerp伪装静止。350→370度的累计角保留370度，屏幕可显示10度。无D14真实来源必须`UNKNOWN`且不得选择默认最短弧。唯一Babylon Engine/Scene/Canvas，仅浅/深主题、文字≤12px；GUI/CLI/Agent同`PlaybackEvidencePort`，seek不修改D14/D15，不授予D16发布。见[B70专项](ROTARY-WINDING-B70-2026-10-31.md)。
