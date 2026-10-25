# U4-04｜GUI与3D：诊断联动布局及交互
> 单Babylon Scene、统一左TaskPanel、浅/深主题；界面最大字号12px，紧凑无第二Shell。所有内容为规划原型，不是运行截图。
 
## 空间与组件
统一左侧TaskPanel内分层折叠：**① 来源链**（D08→D09→D12 NC原文只读BlockRange→D13规范动作→D14轴时序→D15结论；D16仅展示发布资格）；**② 失效原因**（精确D12旧/新hash、依赖闭包、受影响Setup、旧证据）；**③ 求解观测**（D06 residual/预算/Beam/异常及样本计数）；**④ 执行诊断**（D13未知码、机床轴限位、D15覆盖/工程风险）。NC行号只是可读标签：主键为bytesHash + byteRange，允许重复N号。选择Action/轴采样可反向定位多条NC Block或显示一对多集合。
 
唯一Babylon世界使用U4-03的SelectionIntent和OverlayLease显示相应修订的轴姿态/Frame代理；不得把CL动画、简化STL或渲染路径描述为程序级NC工程验证。视图右侧仅详情面板/状态栏，不另开含领域Store的第二TaskPanel。Ribbon的“诊断”入口和Agent消息可激活同一个DiagnosticQuery，但只读不自动APPROVE。
 
## 状态词与错误处理
`EXACT_LINKED` 精确连通；`SOURCE_GAP` 缺关键边；`STALE_REVISION` 旧版本；`FRAME_MISMATCH` 坐标不符；`UNKNOWN_SEMANTICS` 控制器语义未知；`PARTIAL` 已验证部分覆盖；`NOT_RUN` 没有真实工程试验；`UNKNOWN_RECOVERY` 事务终态不可证明。统一诊断等级，不以红绿单色表示，也不能因为Span=OK给D15染绿。
 
曲线仅由D06 Owner已保存样本画折线，旁列迭代ID、runHash、算法、时间/预算/队列、样本缺口，**零点数据绝不渲染示意曲线**。可靠值若没有独立统计校准就标“评分/未校准”，绝不标“安全概率”。异步滚动/NC全文分页每次校验scopeEpoch、ACL epoch、NC hash、selectionGeneration，旧回执不渲染于新Scope。
 
## 键盘、资源与可访问性
Tab切换链节点，Enter展开来源，Esc取消焦点预览但保留EditSession脏稿；聚焦与选择分离，状态文字始终可读，不遮挡3D边界工具条。关闭诊断释放时间轴观察者、Highlight、订阅与暂存Overlay，权威证据不释放/不删除。大NC及事件流需虚拟列表和分页，但不能过滤掉未知/失败。3轴/B5屏幕数据只能在真实机床绑定已锁版后显示，否则UNKNOWN。
 
## 通道一致性
`GUI/CLI/Agent→DomainDiagnosticQuery→D06/D12/D13/D14/D15 Owner`，均使用同一scope/ACL和只读合同；修复入口`EditSession→Owner.commitCAS`独立授权。真实端到端的检索速度、键盘/DPI、3D/GPU释放、消费者CLI输出仍待独立测试。
