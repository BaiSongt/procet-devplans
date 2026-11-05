# CAP-02-02｜刀具与切削参数：专项研究导航

原V0.8业务能力不变；原功能规格见[批次01原规格](../batch01-v0.9.1/01_功能规格/CAP-02-02_刀具与切削参数.md)。L3待人工审查。

- [B165 周刃铣削有效直径、切速、每齿进给、显式采纳的公式与单位](FEED-KINEMATICS-B165-2026-11-04.md)：7分级来源、8规则/32字段、8正32反8独立Golden，仅规划。
- [B74 车刀刀尖半径与控制器偏置](LATHE-NOSE-COMPENSATION-B74-2026-11-01.md)：独立于铣削周刃公式的车削补证。

GUI/CLI/Agent调用领域Owner同一用例，单Babylon世界与统一左TaskPanel不变，D04 Setup≠D10执行绑定，中立CL动画≠最终NC验证，未知为UNKNOWN。Owner/真实独立消费者均0/17，**规划PASS≠产品PASS**。
