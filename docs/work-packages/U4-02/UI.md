# U4-02｜GUI/3D紧凑TaskPanel与EditSession
复用**唯一Babylon Scene、唯一左TaskPanel**；Ribbon/ActivityRail/Task按钮与Agent/CLI共享Owner领域命令。浅色/深色两主题，界面最大字号12px；密集信息按业务层级对齐，避免新建第二套Setup控制器/卡片。

Ribbon展示保存草稿与人工批准两个独立用例，非两个触发同一写函数的按钮；左TaskPanel展示精确Document/Setup/Frame、Owner Ready、Dirty状态、真实任务回执与待处理冲突；3D Overlay仅临时预览/选择，取消或关闭释放租约，**零制造事实写入**。

交互1：进入任务→复查Owner readExact与能力→注册贡献。交互2：脏稿切文档→模态三选SAVE_DRAFT/DISCARD_CONFIRMED/CANCEL_NAVIGATION；Esc默认取消导航并恢复原焦点。交互3：批准→确认人类审批、Head/ACL/代次/冻结证据，失败显示ACCESS_REVOKED/CONFLICT_HEAD。交互4：取消后迟到回执→旧任务日志隔离；同键重试取同一Owner Receipt；无法恢复状态显示UNKNOWN_RECOVERY。

WAI APG Dialog指导焦点圈与Escape；WCAG2.2要求焦点顺序/焦点不遮挡/状态反馈；Vue Router路由守卫、Vue onUnmounted解除订阅不能代替Owner事务仲裁。真实屏幕阅读器、Babylon GPU和Owner运行未测试。参考[8份来源](../../../research/sources/U4-02.json)。
