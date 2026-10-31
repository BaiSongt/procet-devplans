# CAP-04-06｜GUI/3D详细交互

最大字体12px，浅/深主题，**唯一Babylon Engine/Scene/Canvas**。工程3D与资源3D如macOS桌面横向切换，只能有一个活动世界；不出现并排3D。所有业务面板切换于左侧**唯一UnifiedTaskPanel**，无右Drawer。

任务顺序：①机床实例与资源exact版本（D03）→②工作台/回转载体树和home FK→③D04名义Setup与D10执行绑定双修订、具名坐标矩阵→④3D ghost/原旧位置对拍及UNKNOWN控制器提示→⑤影响清单、批准、04域提交CAS与回执。3D中选择机器/夹具只改变预览Lease，不写D04/D10，不自动求毛坯尺寸。各状态按DRAFT、UNKNOWN、STALE、APPROVED分色但不能用颜色冒充D15认证。

传统Workbench、AI+3D和演示/仿真三模式遵守同一Port，AI仅生成提案；纯演示模式只读，Esc退出。Ribbon与单TaskPanel联动，工具条避开内容。切换项目/Setup、取消、撤权后旧generation晚回执可审计但不得复活写权。三轴与五轴的3D运动仅表现已建模的FK，未证实机床/控制器行为标UNKNOWN。

验收：浏览器单Canvas计数、12px、统一左面板、两世界独立激活、D04/D10 revision/hash并列、GUI/CLI/Agent同域、故意ACL撤权/CAS冲突/late ACK注入；当前产品NOT_RUN。
