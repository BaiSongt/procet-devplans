# CAP-08-04｜GUI/3D与非破坏操作
NC ActivityRail使用**统一左侧UnifiedTaskPanel**，不得再造第二套NC编辑工作台或独立Babylon Scene。紧凑视图分五区：①D03/D04/D10/Profile exactRef状态②真实NC程序物理行及M代码③D13意图/UNKNOWN、主轴/冷却/手动换刀/ATC的回执来源④D14经证实的动作时序及机床姿态⑤D15独立验证/ACL/CAS/发布资格。

用户切换机型、配置、刀具或Setup时，该面板显示版本锁改变和相关证据STALE；设备事件没有真实ACK应标为`EXPECTED_ONLY`而非“已换刀”。3D叠加只读视口并可点回NC行，不能由动画生成回执。GUI/CLI/Agent通过同一08域Owner Port读写，所有提交执行CAS/ACL/Frame/scope/代次/取消重验。字体≤12px，仅浅/深主题。