# CAP-05-07｜统一TaskPanel/3D差异工作台
> 仅界面交互规格；未运行Babylon、Host或产品消费者。

**固定UI**：Ribbon顶层“工艺规划→修订比较”；ActivityRail选中工艺域；左统一TaskPanel承载全部任务，不再为修订功能另设第二侧栏。唯一Babylon世界全屏，右Agent独立显隐但走同一Port。浅/深两主题；最大字号12px；颜色为辅助信息，状态文字/图例始终可读。

1. **选择版本**：项目scope、A/B branch、baseExact/currentExact/proposedExact、D04 Setup/Frame列表、D08冻结来源；缺证据显示灰色“UNKNOWN/需要重绑定”，不隐藏错误。
2. **查看差异**：新增、移除、策略参数、依赖DAG、Setup Frame、来源变更、冻结受影响和未受影响两组列表；差异图层共享Babylon scene与当前几何selection，不创建第二个世界。Geometry匹配只展示候选、禁止自动确认stableId。
3. **定位/过滤**：点击diff行聚焦对应3D目标及工序树，未挂载几何时显示“仅文档差异”；选中/高亮绝不能写D05；支持比较左/右视角但仍共享同一世界。
4. **预览**：左TaskPanel显示审阅者、理由、冲突分类、拟生成新Revision、影响D06/D07→D09/D12/D13/D14/D15/D16闭包及可恢复子图。取消后不得接受晚回执。
5. **确认**：只有`commitRevision`执行时重新拿ACL、scopeEpoch、taskGeneration、CAS、Frame/hash；失败留在差异面板，状态不自称成功。成功回执展示新D05 exact ref、审计ID与明确需重跑的消费者。反向操作通过`forkRollback`新修订，保留旧D08/D16。
6. **受控迁移**：旧工程缺sourceStableId、Frame/hash时提供只读人工映射表和“导出审阅差异”；未取得证据不生成提交按钮和假PASS。

验收入口：`node tools/check_cap_05_07.mjs`仅检静态规格与合成正反样例。真实GUI交互、可访问性、CL/NC消费者和性能均NOT_RUN。
