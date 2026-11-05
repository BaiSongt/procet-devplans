# W2-01｜GUI/3D交互与三入口同域契约
- 单个Babylon世界保留当前模型/Setup/候选的统一Scene和Frame，A/B切换只改变业务视图，不克隆几何、3D renderer或工程数据源；统一左TaskPanel承载需求、分阶段缺项、候选比较、接管和任务状态，右侧Agent仅为同Port客户端。
- **面板步骤**：选择当前工程及目标操作→运行 `inspectRequirements` 显示具体SATISFIED/MISSING/UNKNOWN/BLOCKED→显示明确可行动作及证据缺口→A候选选择或B直接起Draft→三方差异预览、受影响D05/D08冻结边界→确认后CAS/ACL重验与事件回执→浏览新D05 Draft及下游待验。
- **紧凑交互**：最大文字12px，浅/深主题；3D高亮属于预览，不触发提交；左侧滚动任务层统一呈现异步取消与过期回执，显示Job ACCEPTED/RUNNING/CANCELLED/FAILED/UNKNOWN；不要以转圈动画暗示工程PASS。
- **命令一源**：GUI `useABHandoff`、CLI `ab-handoff inspect|preview|commit|cancel`、Agent `abHandoff.*` 统一指向受管 `ABHandoffDomainPort`，不能直接修改D05/D08/Host journal；提交时同等scope/ACL/CAS/generation检查，无用户授权的Agent不能自行发布。
- **编辑权限**：D04 ProcessSetup/FrameGraph只读显示；D10 ExecutionBinding单独受控页签，不混成Setup字段。D09轨迹预览标注 `CL_ONLY`，D13 UNKNOWN和D15 NOT_RUN不得通过动画变PASS。
- **失败与回退**：源revision/hash或Frame漂移显示原值/当前值/可重试操作；被撤权、任务取消、旧回执只读审计，无自动覆盖当前Plan；旧快照缺hash显示迁移待确认，不删除用户数据。L3/产品可视交互验收NOT_RUN。
