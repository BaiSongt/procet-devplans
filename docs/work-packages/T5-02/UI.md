# T5-02｜GUI与3D证据校对设计
唯一Babylon Scene和唯一左TaskPanel；Ribbon/ActivityRail/Agent浮窗/CLI共用03域EvidenceOwnerPort。2D/PDF仅是有精确来源的显示纹理/二维层，不得新建第二Scene或将屏幕高亮当几何事实。最大字号12px，仅浅色和深色两主题；聚焦状态与权限提示须可键盘访问。

工作流：文件→页/图层→OCR候选→CAD精确引用→人工决定→新D01/D02版本。左TaskPanel内同排呈现原图crop/page/Rotate与DXF实体handle、OCR框与解析置信说明、3D GeometryRef（revision/geometryHash/frameHash）及差异。若单位或比例UNKNOWN禁用尺寸采纳。悬停叠层OverlayLease只持有选择租约，关闭/取消释放纹理、Observer、Gizmo而不改变业务事实。

任务等待状态`READING→OCR_RUNNING→MATCHING→AWAITING_HUMAN→COMMITTING→COMMITTED`，失败/UNKNOWN/CANCELLED均显示实际回执，不使用虚构百分比。ESC先取消预览再退出编辑；脏草稿留存。CAS、ACL、taskGeneration、scopeEpoch、取消晚回执均Owner二次校验，Agent和CLI不能绕过人类确认。

GUI回归包括同文不同页、镜像block、尺寸OCR错读、旋转PDF、跨工程晚回执、重复采纳、恢复版本漂移、GPU Overlay 30次开闭；需要固定测试机器/GPU/浏览器/产品HEAD和日志hash。均NOT_RUN。
[工作包](../T5-02.md) · [独立消费者](independent-consumer-handoff.md)。
