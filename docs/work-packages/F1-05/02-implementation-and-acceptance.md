# F1-05／02｜十个实施切口、依赖、测试入口和正反验收

> 本文件是实施规划，**不是任务已执行记录**。原依赖F1-01、B0-05保留；F1-03/facade迁移与F1-04探索输入拆分为重要接线前置，文档完成不表示产品依赖已经达到退出条件。

## 1. 十个可分派子任务

| 编号 | 主责/协作、生产→消费 | 进入条件 → 实施产物 → 退出条件/回退 |
|---|---|---|
| F1-05-S01 | Solver架构Owner；CLI/Host审查 | 读solver及CAM当前HEAD和能力边界 → 按算法/profile的现有能力矩阵、兼容条件、审计差异 → 3方签字后允许后续接口冻结；原有入口不动 |
| F1-05-S02 | Rust/native核Owner；发布/安全 | S01、可用目标机官方OCCT SDK → native-occt profile manifest（编译feature、OS/ABI、库size+SHA、worker可执行摘要） → 运行库错配可复现拒绝；恢复既有经认证分发包 |
| F1-05-S03 | C0契约+Solver；CAD/Setup | F1-01精确ref、F1-04输入语义评审 → typed请求字段与schema、完整几何/Stock/frame冻结 → 旧schema正反例+多Setup交叉引用拒绝；旧项目按只读适配 |
| F1-05-S04 | Solver worker；Host授权 | S02/S03就绪 → CLI/SDK/Worker单个真实执行入口与Host路由、资源预算 → 纯离线/干净目录可运行，不隐式pip/cargo或外网；失败保留旧运行 |
| F1-05-S05 | Solver Runtime；F1-06快照Owner | S03/04 → 完整run_manifest归档闭包、文件级size/SHA、来源DAG → 缺一字节即拒绝“完整可回放”；staging失败不暴露完整状态 |
| F1-05-S06 | Solver核验Owner；独立QA | S05与独立Oracle/Checker真实入口 → 资格证据+算法覆盖和独立路径对拍 → unverified/partial保持，不推工艺许可；核验异常状态独立保留 |
| F1-05-S07 | Solver worker；Host任务Owner | S04/S05 → requestId幂等、取消/超时/重启/晚回执隔离、资源清理 → Windows/Linux有界进程回归与同源receipt；超时不可留下“已完成”虚假run |
| F1-05-S08 | SDK/CLI/Host集成Owner；CAM | S03-S07 → SDK/CLI/Worker/(若有安全部署)HTTP语义同构、typed诊断和状态回执、CAM只读消费 → 端到端同一输入/版本工件对拍；HTTP未授权不进入生产 |
| F1-05-S09 | GUI设计与Host Owner；三维Renderer | S03/S06/S08 → 五任务单容器及单Babylon主世界多对象联动/范围/异常/恢复UI → 浏览器与Windows EXE专项、取消旧回执检查；撤回仅撤UI配置 |
| F1-05-S10 | 产品交付Owner；独立QA/工艺批准 | 所有测试证据、F1-06闭包核验 → 灰度路由、回退矩阵、能力边界证书与交接手册 → 仅对已验收profile/算法逐项放行；不得自动更新已批准Plan |

## 2. 按证据建立测试入口（执行前先确认现有命令）

**真实源码现存的候选入口（只读核实，下面命令本轮未运行）：** `cargo fmt --all -- --check`、`cargo check --workspace --locked`、`cargo test --workspace --locked`、`cargo clippy --workspace --all-targets --locked -- -D warnings`、`cargo build -p solver-cli --locked`、`procet-solver g5-solve <request> <output>`、`procet-solver g5-replay <archive> <out>`。原生几何需要`PROCET_OCCT_ROOT`指向已合法安装的匹配SDK与真实runtime库；专用脚本在仓库`scripts/test-native-occt.ps1`与`scripts/test-native-occt.sh`，是否覆盖全部target须在当前HEAD重新审计。**不得使用欠费CI验证，也不在规划任务擅自跑产品测试。**

**待建立或需增强的测试：** Host通过同一DTO对比SDK/CLI/Worker；不借实验工作目录的隔离分发包；1..5完整G5独立Oracle与多Solid/保护区/余量矩阵（超过1..5额外单模块能力必须另标）；manifest每文件断字节/篡改；动态库身份替换；Windows超时取消进程树/重启；两个项目/两个Setup并发、版本漂移、相同requestId不同输入冲突；不同UI/Agent/CLI入口不绕权限；归档到离线新机后的不依赖源文件重放；HTTP局域网未鉴权风险部署门；旧Python比对证明不会变成生产fallback。真实GLM exact-HEAD回执包含hash、测试环境、退出码、失败与跳过项。

## 3. 20条产品正反验收（未执行）

每对试验针对同一规则：奇数为正例、偶数为负例；详细输入与预期见[fixtures.json](fixtures.json)。检验对象是设计契约；当前没有声称测试入口均已实现。

| 规则 | 正例 | 负例 | 判定主题 |
|---|---|---|---|
| SOL-R01 | F1-05-AT01 | F1-05-AT02 | 原生profile显式选中与拒绝旧Python隐式回退 |
| SOL-R02 | F1-05-AT03 | F1-05-AT04 | 动态库/worker身份匹配与失配 |
| SOL-R03 | F1-05-AT05 | F1-05-AT06 | 冻结输入一致与跨Frame/Hash不符 |
| SOL-R04 | F1-05-AT07 | F1-05-AT08 | 完整manifest校验与篡改失败 |
| SOL-R05 | F1-05-AT09 | F1-05-AT10 | 算法有界覆盖与超范围假承诺 |
| SOL-R06 | F1-05-AT11 | F1-05-AT12 | 正确取消与晚回执越权复活 |
| SOL-R07 | F1-05-AT13 | F1-05-AT14 | 候选/证据正确标记与自动上升NC资格 |
| SOL-R08 | F1-05-AT15 | F1-05-AT16 | SDK/CLI/Worker同构和拒绝未知必需字段 |
| SOL-R09 | F1-05-AT17 | F1-05-AT18 | Solver唯一Owner与Plan只读消费/非法写入 |
| SOL-R10 | F1-05-AT19 | F1-05-AT20 | 原请求恢复/冻结run与冲突输入幂等键重用 |

## 4. 阶段退出条件及不可提前宣称的资格

规划退出：10子任务规格/20验收/研究/数据Owner/差分/回退已编制且可追踪。**产品退出**（本轮不满足）必须有当前exact HEAD的Rust构建、real OCCT+worker、manifest完整性、独立Oracle、负例、Windows/Linux封装、GUI与Host-CAM集成等真实验收；超出已核算法上限不授信。不得将单个算法bench、Rust编译PASS、展示3D动画、RunPackageView::open、Python对照PASS或CL生成，描述为机床NC执行认证。