# CAP-07-02｜GUI/3D交互和字段设计（待L3审批）
仅保留**一个Babylon Scene和一个左TaskPanel**，由07域贡献工具项和只读3D overlay租约，不另建右侧任务面板。最大文字12px，浅/深主题；注意可访问焦点与对比度，不以12px豁免WCAG。

## 流程与界面动作
1. 从工程/Setup精确选择D01目标曲面和D02制造要求，显示几何、修订、Frame和有序D07 Stock来源及D08冻结工序；切Setup须重新获取Owner exact读，禁止隐式沿用。
2. 左TaskPanel选择三轴曲面策略（等高/平行/等残高/残料），明确加工阶段、刀具组件、曲面边界、加工坡度区间、清根前序、球半径/刀径、目标残高、走刀距、弦高与公差。单位与容差的说明就近显示，不用硬编码机床参数。
3. `计算候选`异步显示Job/代次/来源及进度；真实CL尚未生成时标`NOT_GENERATED`。3D层区分曲面片、陡缓区、刀心轨迹、面缝、余料、保护岛、局部碰撞风险和未认证段；只对已获得几何证据的部分显示绿色。
4. 在视图中选取局部面，TaskPanel同步显示Face引用、修剪状态、多投影候选、空间Frame、局部残高估计及Oracle状态，不能把规划合成值展示为实测。
5. 用户人工采纳只创建D09候选/新修订。触发CAD/Setup/Stock变更、取消、后退、权限撤销后必须丢弃过期回执并保留历史，视图租约由单Scene宿主回收。

## 命令与结果
`GUI→07.ToolpathPlanningPort`、`CLI→07.ToolpathPlanningPort`、`Agent→07.ToolpathPlanningPort`完全相同领域验证与CAS；Agent不可以绕过人工冻结和D13未知门禁。输入`expectedHead,scopeEpoch,taskGeneration,accessTokenContext,idemKey`；输出`CANDIDATE,REJECTED,UNKNOWN`、`geometryOracleStatus`、`sourceRefs`、`segmentDiagnostics`及`lateReceiptDisposition`。UI永远不直接写D04/D05/D08。Overlay颜色为视觉提示而非D15工程资格。

## 交互回归用例
跨Setup、A/B、主题切换、DPI 100/125/150/200、连续取消20次、迟到Worker回执、不可达倒扣、面缝跳跃、无剩余材料、超出修剪面、多投影歧义、独立消费者拒绝等均有明确可复现操作路径。工程GPU和屏幕阅读器实测`NOT_RUN`，不得虚报。
