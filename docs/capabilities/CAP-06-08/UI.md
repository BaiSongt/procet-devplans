# CAP-06-08 GUI/3D/Agent统一任务方案
Ribbon、ActivityRail、左侧**唯一TaskPanel**的`06.incremental`贡献项显示：精确源与Frame、D08冻结树、受影响UID树、候选/旧状态对比、独立Oracle和冲突原因。最大字体12px，浅/深主题，不另起业务容器或第二个Babylon世界。
3D仅通过`OverlayLease`预览D06拟去料和D07原Stock的差异；拾取事件统一`GeometryRef{project,document,setup,asset,revision,frameHash}`，列表和3D双向同步。预览不写D04/D05/D08；切换Setup或取消任务立即释放mesh/observer/Gizmo/selectionMap，scopeEpoch/taskGeneration旧回执一律忽略。
CLI、GUI、Agent共用`06.IncrementalSolvePort.preview`及受管写入Port；Agent只能建议，05域人工采纳/解冻必须显式授权。保存草稿≠批准冻结。D04 Setup≠D10执行绑定，D09 CL动画不是D15 NC验证；未知控制器语义UNKNOWN。
