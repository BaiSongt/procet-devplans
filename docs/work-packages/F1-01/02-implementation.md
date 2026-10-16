# F1-01｜实施切口与责任

版本0.1，2026-10-17。规划完成待评审，不等于产品已实施。依赖B0-02与B0-04。

| 子任务 | 生产者与审查方 | 交付物 |
|---|---|---|
| S01 | 平台、11域Owner | 真实组合SHA、旧引用和consumer审计 |
| S02 | Contracts、Rust/TS/Worker | 现有C0 v1 Schema、DTO、fixture与Hash核对 |
| S03 | 各领域、Project | D01—D17 exact revision与legacy适配 |
| S04 | Host、Agent/CLI | raw JSON、可信Actor、schema/handler绑定 |
| S05 | Project与领域Store | CAS、持久receipt、超时和并发恢复 |
| S06 | 契约与安全、TS/Rust | JCS数值/Unicode Golden及requestHash决议 |
| S07 | Project、Resources/CAM | Artifact和SourceRef必需闭包、失效规则 |
| S08 | GUI、CLI/Agent | 跨Setup作用域、只预览不提交、四维状态 |
| S09 | 独立验证者、三运行时 | 正反fixture、真实Host消费与exact-HEAD证据 |
| S10 | 平台与发布Owner | 灰度writer、历史reader、数据迁移回退演练 |

完整标识为F1-01-S01至F1-01-S10。顺序S01→S02→S03/S04/S06→S05/S07/S08→S09→S10。每项均须生产者与至少一个真实消费者审查；S09在真实仓库核实测试入口。S01开始只读；退出需接口、正反验收、迁移回退证据，不能以文档或静态fixture当作产品通过。

已在procet-contracts协议README核对存在的命令包括python protocol/tools/contract_tool.py check、python protocol/tools/test_contract_tool.py -v、cargo test --locked；**本轮未执行**。历史用户工程不原地改写；缺版本映射时unknown/只读，回退不能只做git revert。
