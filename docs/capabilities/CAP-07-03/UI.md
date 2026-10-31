# CAP-07-03｜单Babylon世界的3+2定位刀路交互（L3待审）
最大字号12px；仅浅/深主题。左侧统一TaskPanel容纳07域“定位加工”任务；Ribbon/ActivityRail/Agent按钮复用`07.IndexedToolpathPlanningPort`，不新增并列右侧任务面板或第二Scene。显示世界与工艺Owner数据严格分离。

1. 选择D01几何、D02局部加工方向、D03机床候选与刀柄、D04当前Setup及D08冻结工序。任务栏始终展示`assetId + exact revision + contentHash + coordinateFrameId + frameHash`，切换Setup重新请求Owner读取。
2. 左TaskPanel按姿态列出目标面、刀轴法向、参考Frame、坐标矩阵、候选旋转轴分支、刀具/刀柄、夹具与局部可达性。未取得机床限位/碰撞证据的项标`UNKNOWN`，不擅自填写AC/BC角限、旋转次序和pivot。
3. 选择姿态后，三维OverlayLease只读显示索引姿态坐标系、固定刀轴加工段和跨姿态退刀/转接候选；视觉箭头、轴向和曲线不代表D14轴时序或D15安全结论。禁止显示“CL工程验证通过”。
4. 预览、采纳与发布严格分离：预览仅07候选；经CAS/ACL/generation重验产生新D09；最终NC按D12→D13→D14→D15→D16独立门禁。D13未知/缺控制器配置保留诊断并禁止D16。
5. 取消、离开Setup、权限变化、A/B切换后撤销OverlayLease与异步任务；旧回执`IGNORED_STALE`，不覆盖D08冻结、D04 Setup及用户数据。鼠标和键盘选择保持同一exact GeometryRef，面向DPI 100/125/150/200及屏幕阅读器另建真实回归。

CLI及Agent只通过同一领域Port提交结构化输入；Agent不能自动冻结、改变机床绑定或通过未知NC语义。交互/性能与GPU实测均NOT_RUN。
