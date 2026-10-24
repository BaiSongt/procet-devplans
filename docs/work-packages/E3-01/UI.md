# E3-01｜GUI/3D/CLI/Agent 同一领域入口
> 规划，不是生产UI。**单个Babylon世界**、统一左侧TaskPanel，浅/深主题且所有字号≤12px；不新建第二个3D Scene或私有编辑状态机。

- 工序/策略页：选择D05 `operationExactRef`与D04名义Frame，显示D08冻结状态、sourceHash和生成器版本。工艺字段分首刀/道间/换腔/末刀，进刀/连接/提刀与切削策略在同一工作流明确。
- 圆弧与螺旋页：显示源曲线、中心、扫角、平面、轴向变化、容差和post支持；CL真正ARC/HELIX和显示三角化预览分开，unsupported/UNKNOWN醒目标注，不能偷换为直线。
- 结果页：按CUT/APPROACH/RETRACT/LINK/TRAVERSE区别显示轨迹，单RendererPort持有Overlay/Selection租约并与列表共享segmentId/revision。选中一段看到工序/策略/来源/错误；跨Setup切换释放旧预览，取消/晚回执不更新当前视口。
- D12接口页：只读呈现D12支持矩阵和CL↔NC行段溯源，D11动画只有“CL预览”状态，不能显示“NC验证PASS”。实际验证只从最终NC→D13→D14→D15。
- 持久交互：Ribbon、ActivityRail、TaskPanel、CLI `cl inspect/generate/validate/rebuild`及Agent同走`ToolpathPlanningPort`；预览不落库，保存前CAS/ACL/actor与cancelToken重验。Agent显示当前执行工具及等待动效但不能自行批准或写库。