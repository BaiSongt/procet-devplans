# U4-05｜统一桌面紧凑GUI/3D回归约束（规划稿）
> 最大字号12px；只有浅/深两个主题；单Babylon Scene、统一左TaskPanel，容许右侧Agent浮窗但不得重复领域任务容器。

## 布局与视口
Ribbon横向任务栏保持焦点顺序；ActivityRail控制左侧唯一TaskPanel显示，TaskPanel拖拽宽度可键盘调整（方向键步进，Enter确认，Esc回退未提交尺寸）；右侧Agent输入、工具状态、取消按钮不遮挡右下角3D工具；3D左上/左下/右下定义`ViewportSafeInsets(top,left,right,bottom)`。模型世界、资源根节点与工艺预览共享单Babylon Scene；可使用`renderRoot/OverlayLease`切换，不出现第二Engine/Scene当作临时“性能优化”。

|情景|预期可观察行为|
|---|---|
|浅/深主题切换|普通12px文字有符号和文字说明，4.5:1对比度逐token实际测量；Warning/UNKNOWN不能只靠红绿|
|窗口缩放及DPI 100/125/150/200%|聚焦元素、Agent面板、NC日志与3D工具条不互遮；控制最小命中区不随DPR错误缩小|
|Tab/Shift+Tab、ESC与未保存EditSession|非modal不陷阱焦点；modal依APG关层和复焦；ESC不能丢Draft/改D08|
|Agent工具等待/取消|真实Owner回执前只显示RUNNING/QUEUED/CANCELLING；取消后晚回执不刷新当前Context|
|prefers-reduced-motion: reduce|停止非必要流光、闪烁、3D穿梭过场，但文字、取消和错误详情均可用|
|深色主题GPU资源切换|复用材质须保留共享引用；关闭Overlay释放Observer/Gizmo及派生材质，受控Owner资产不被删|

## 可访问性与测量分层
**规范层：** WCAG2.2普通小字4.5:1、焦点可见/不完全遮挡、键盘可操作、24 CSS px目标或有证据的例外、拖拽替代。**产品选择：** 12px字号上限、两主题、单Scene、紧凑密度是内部规范，不能宣称W3C要求。**人工测试：** 浏览器/Electron、放大缩小和系统缩放、实际GPU/鼠标/键盘、屏幕阅读器抽样。WCAG2ICT属于Note，不能代替软件认证。

所有状态必须有文字符号和可读原因；禁止用假的进度条、生成的曲线或FPS推测误导。显示真实来源`assetId/revision/contentHash/frameRef`；3D可视化只读，不因选中或ESC写D04/D05。视觉材质变化不等于几何、NC或工程状态变化。验证缺口始终显示`NOT_RUN/UNKNOWN/PARTIAL`。
