# B0-06｜代码PR审查模板（仅规划，不自动安装至产品仓）

- [ ] 原CAP/工作包和业务Owner exact映射可追溯，账号与业务批准区分
- [ ] 产品仓/分支/父HEAD/变更HEAD都固定完整40位SHA
- [ ] D01..D17准确输入修订、Hash、Frame、units，以及消费者版本
- [ ] 代码CODEOWNERS与GitHub保护策略实测（没有则UNKNOWN）
- [ ] 设计L3、作者自测、独立消费者、D15与D16资格分别登记
- [ ] 至少一项正例与一项误版本/错帧/未知语义反例，有原始日志Hash
- [ ] 取消/晚回执、CAS与权限撤销实际受管入口验证
- [ ] D04 ProcessSetup与D10 ExecutionBinding未混淆；CL动画不是最终NC验证
- [ ] A/B共享事实、冻结历史、离线迁移和逐版本回退不被覆盖
- [ ] 未启付费CI，未自动合并，发布需真实签署而非PR审批推断

**结论：** DRAFT / READY_FOR_REVIEW / CHANGES_REQUESTED / APPROVED（必须由实际复核者操作）；不得预填。
