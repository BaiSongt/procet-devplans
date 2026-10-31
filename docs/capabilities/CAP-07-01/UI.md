# CAP-07-01｜GUI/3D和四入口同一事实（规划稿）
- 唯一Babylon Scene由宿主管理，07域仅挂载预览OverlayLease；不新增第二画布、第二Scene或复制业务Store。统一左TaskPanel由`TaskContribution`承载特征/工艺/刀路与参数，右Agent独立窗口只是命令发起者。
- GUI、CLI、Agent、批处理均调用`07.ToolpathPlanningPort.preview`及Owner受控的`commitCAS`；Ribbon、ActivityRail与Agent不得各自实现刀路算法或绕过审批。最大字号12px，浅/深主题，参数紧凑布局；键盘导航/等待与错误回执不得只靠颜色区分。
- 主视图按Setup/Step显示D07前序Stock只读、D02特征轮廓、岛屿/孔/保护区、D09待确认中立CL。图例明确`CANDIDATE / REJECTED / UNKNOWN`、`CL_PREVIEW_NOT_NC_VERIFIED`。绘制弧线必须来自有记录的D09几何参数，不准平滑伪造圆弧。
- 参数表按工具直径、径向步距、轴向切深、径/轴余量、切入方式、进退刀高度、端面连刀策略、轮廓内外偏置、钻孔回退逐项绑定受控字段，失效时显示精确旧修订及重算原因；不可与D10真实机床执行配置混放。
- 点选段时联动FeatureUID/StepUID/ToolRef/FrameHash/前序StockHash和独立状态；OverlayLease拥有明确dispose，切Setup/取消/卸载释放GPU资源/监听器，迟到worker返回必须比较scopeEpoch、generation、hash并忽略。
- 编辑器使用EditSession草稿→预览→人工审批→Owner提交；CAS冲突、ACL撤销、D08冻结冲突和未知语义显示阻断提示与恢复动作，不自动清空草稿或重写冻结事实；需要NC级结果请跳转D12-D15诊断而不是绿色打勾。
- 验收：Tab键全流程、2×切工程的租约回收、快速取消及晚回执、双入口同结果指纹、1000段/多岛局部选择性能基准（阈值需产品团队批准，不能编造）均为产品待测。
