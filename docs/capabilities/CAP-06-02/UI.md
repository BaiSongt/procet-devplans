# CAP-06-02 GUI/3D交互
唯一全屏Babylon Scene/Engine；ActivityRail入口汇入**同一个左UnifiedTaskPanel**，右Agent浮窗和CLI只调06域Port，不生成第二个三维世界。浅/深主题，最大字体12px；3D选择/动画均为只读预览，不得触发业务提交。
| 状态 | 左侧任务面板字段 | 单世界可视化 | 行为 |
|---|---|---|---|
| SELECT | D01目标/D04 Setup、Stock-BRep、Frame、保护体 | 毛坯/目标/保护区颜色分层 | inspectRequirements |
| READY | DAG前序边、替代组、Beam/布尔/时限 | 方案候选虚线与材料剩余可切换 | previewSearch |
| RUNNING | 分支数、布尔次数、队列、时限、异步流光和当前工具 | 每步可切Stock_before/remove/after | submit/cancel |
| UNKNOWN | BRepCheck报告/预算耗尽、精确失败码 | 对未知几何不绘制“已验证”色 | 修改约束开新修订 |
| CANDIDATES | A/B对比、支配证据、独立D07状态、冻结锁 | 同一Scene切换候选，冻结原件只读 | compareCandidates |
| CONFLICT | base/head/proposed、CAS和ACL、撤回与回退 | 旧D08灰色不可编辑 | 05域人工采纳 |
| ORPHANED | lateAck/取消/断线恢复消息 | 清理暂存预览、保留审计历史 | 仅查询与重试新任务 |
未完成D07+D08时D09按钮禁用且显示原因；D13语义UNKNOWN时D15/D16均不可获得PASS；不承诺机床仿真能力。
