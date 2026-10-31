# W2-06｜无界面闭环与GUI/3D一致性

验收入口以独立CLI与真实领域Port为准，不通过视觉点击或Mock组件判定业务PASS。GUI、CLI、Agent共用同一领域Query/Command Port、CAS、ACL、generation与取消回执裁定；三种入口的返回码、领域事件和revision/hash要一一对应。

**GUI仅呈现**：唯一Babylon Scene/world；左侧统一TaskPanel按“模式A求解→候选→受控采纳→D08冻结→模式B补全→局部回流→验证级别”显示任务序列；右侧Agent为独立浮窗，不创建第二3D世界。Setup切换请求采用scopeKey+generation隔离，晚到结果不得覆盖当前Setup。

**3D行为**：将D01目标、D04毛坯/Frame、D06候选去料体、D07有序状态与D08冻结对照作为带exact-revision的Overlay；选择/高亮/预览既不写Owner，也不更新D08。A/B共享事实但允许独立规划视图；旧Snapshot可回放，不改变历史Hash。

**验收视图**：从harness真实回执读取PASS/FAIL/UNKNOWN/NOT_RUN，按Owner来源和每步Port显示证据链；缺少真实进程证据时只能标为“规划合成通过/产品未运行”。D11仅标“CL预演”，D13未知语义显示UNKNOWN，D15工程NC验证、D16发布必须独立签章，不得从几何动画自动绿灯。

异常：强杀/掉电、ACL撤销、CAS冲突、取消晚回执/幂等重放按同一错误码渲染，灰显受影响的提交按钮，保留历史D08可读。浅/深色主题；文案紧凑、最大字号12px。无新的领域可写store或跨域隐藏状态。
