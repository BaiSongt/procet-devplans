# R-UI-QA-001｜紧凑工业GUI、可访问性与三维资源生命周期
> 2026-10-25查阅公开合法资料9项；本记录只支持设计与回归方案，非产品测试/法律认证。

## 研究问题与区分
1. **规范证据。** W3C WCAG2.2 1.4.3普通小字号文字4.5:1，1.4.11UI状态对比度，2.4.7焦点可见，2.4.11焦点不能被作者内容完全遮蔽，2.5.7拖拽替代，2.5.8命中目标24 CSS px或有严格例外；12px最大字体不能成为豁免。W3C WCAG2ICT 2024-10-08是指导性Note，并非桌面认证。
2. **交互模式。** WAI-ARIA APG modal dialog提示Escape、Tab序列和关闭后复焦。但普通TaskPanel不是modal，禁止默认把整个左TaskPanel锁成焦点陷阱；脏稿保留和Owner不写是Procet额外领域规则。
3. **实现与测量。** MDN介绍`prefers-reduced-motion`检测，而实际WebGL动画仍需专门处理。Babylon官方Optimize说明mesh dispose和Instrumentation，但API可用不证明某锁版无GPU泄漏。Chrome Heap Snapshot Comparison用于寻找JS DOM引用增长，不可代替GPU显存与Owner持久测试。
4. **内部产品取舍。** 双主题、最大12px、单Babylon Scene、唯一左TaskPanel、租约释放/资源拥有者、D04/D10分离、A/B不覆盖D08、NC工程链与CAS/ACL是Procet自主设计和领域合同；不能归因于W3C/Babylon强制要求。

## 来源→规则→字段→验收
[合法来源9条](../sources/U4-05.json)登记作者、版本/日期、访问日期、公开章节、阅读深度及局限；[规则10条](../traces/U4-05.json)具有具体`sourceIds/fields/criteria`、正反Fixture及独立字段变异。[独立消费者](../../docs/work-packages/U4-05/independent-consumer-handoff.md)仍需真实产品/Babylon/GPU/Owner交叉验证。合成验收只测试合同自洽，不保证符合WCAG或FPS指标。

## 待补证
锁定实际procet-gui Babylon/Electron依赖版本与目标设备；冻结参考模型授权、确切SHA、浏览器/GPU驱动与阈值；实施真实窗口/DPI/辅助技术矩阵和30次空间切换循环；由独立测试者审阅WCAG适用例外与实际界面结果。所有缺失状态明确`NOT_RUN/UNKNOWN/PENDING_HUMAN`。
