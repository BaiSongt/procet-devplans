# CAP-07-07｜统一刀路任务编辑与单世界3D预览
入口：ActivityRail「刀路」→唯一左侧TaskPanel，展示CL段表（序号/类型/起点/终点/刀轴/进给/Frame）、D04 Setup、D05工序、D07材料前态、D08冻结、D09修订、D12–D16验证门禁。GUI/CLI/Agent读取同一07域Owner Port，不各建数据副本。整体紧凑、**最大字号12px**、仅浅/深主题；错误图标需伴随文字与键盘状态，不仅靠颜色。

单Babylon Scene与唯一RendererPort：借阅`OverlayLease(workContext,setupId,clRevision,taskGeneration)`画段类型/刀轴向量/工具TCP，预览层不得写D09；切换Setup/取消/失败/晚回执时释放Observer、Geometry、Gizmo和租约。CL预览须常显「**仅中立CL预览，不是最终NC工程验证**」，不允许用绿色轨迹表示D15 PASS。D13 UNKNOWN、D15 NOT_RUN显示为阻断状态。

操作：选择D04 Setup→选择D08已冻结工序→精确读取D03/D07→填写中立feed/帧→本地数学校验→预览→明确采纳→Owner重新ACL/CAS/Scope/Generation校验→追加D09 revision；后台工具调用显示阶段、排队、取消和回执代次。UI不展示G0/G1为CL编辑字段，也不提供让模型在UI直接创建D14轴时序的路径。真实DPI、键盘和GPU复用测试NOT_RUN。
