# B0-01｜十项实施任务、测试入口与失败回退

## 1. 依赖图与职责

原B0-01依赖“无”，但实施内部有严格顺序：`S01→S02→S03/04→S05→S06→S08→S10`；`S01→S07`；`S03+S07→S09→S10`。平台集成组Owner组合锁；GUI/Worker/Native/质量各对自身产物真实性负责。后续B0-02依赖的是**经相关负责人接受的实际三组合锁**，不是本设计文件已生成。真实测试入口必须到实际仓README/Cargo/pnpm与本地Windows测试环境获取后才登记，不在这里虚构已可运行的测试程序。

| 子任务 | 进入条件 | 工程实施动作/实际产物 | 独立退出/失败判定与回退 |
|---|---|---|---|
| S01 | 对三仓有合法只读权限 | Git ref SHA快照、负责人/观察时间/精确URI | 不能读取ref→保持unknown；历史观察不覆盖 |
| S02 | S01 | 对比GUI锁json与root/desktop Cargo、Worker声明 | 不在锁中不等于不存在；疑问登记不改manifest |
| S03 | S02 | 干净checkout并验证path+CAM目录原始字节、依赖digest算法说明 | 失败则manifest`declared_only`，不篡改源文件 |
| S04 | S02 | 独立root Rust、Tauri Rust、pnpm lockfile与toolchain矩阵 | 漏一个workspace则不得`full-build-pass` |
| S05 | S04 | Native动态库（OCCT7.9.3产线锁应实读确认）、Worker EXE、licenses/运行环境表 | 只有Cargo feature没有DLL文件→不准标packaged |
| S06 | S05且合法获得离线包 | 独立计算安装包、EXE、子二进制SHA256+字节数；核验目标平台 | 文件/签名/哈希未取得→`UNKNOWN`；旧包保留 |
| S07 | S01 | compare准确consumer pin和研究HEAD/未合PR | 仅记录差异，不引发隐式升级 |
| S08 | S04、S06 | 带组合ID的真实命令、环境、结果、独立Oracle、跳过列表 | `NOT_RUN`/`FAIL`/`BLOCKED`分别保留，不能改成PASS |
| S09 | S03、S07 | 与Host/Project共用命令、审查和激活CAS/权限重验 | 失败保留旧active，日志隔离，3D零业务写入 |
| S10 | S08、S09 | 审查责任签署、范围/已知阻断、ADR和B0-02交接 | B0-01未真实验证，B0-02仍标前置待满足 |

## 2. 多工作区/Native/Worker真实测试入口规划

检查实施时需先从每个仓**精确SHA**读取真实`Cargo.toml`、`Cargo.lock`、`pnpm-lock.yaml`、`pnpm-workspace.yaml`、构建脚本、Native查找与Tauri打包配置，然后按环境运行。拟议测试类别如下，命令只是操作建议，**本轮全部NOT_RUN**：

- GUI根Cargo workspace：在洁净检出上运行`cargo metadata --locked`和按真实成员登记的`cargo test --locked --workspace`；不要默认为桌面workspace。
- GUI桌面Tauri workspace：在`apps/desktop/src-tauri`独立运行`cargo metadata --locked`与针对真实目标的构建/合同测试；不得靠根目录Cargo测试代替。
- GUI pnpm workspace：在有合法依赖缓存和正确pnpm版本时`pnpm install --frozen-lockfile`、`pnpm -r --if-present run typecheck/test`；无锁或锁不匹配应失败，不静默更新。
- CAM/Solver独立研发配置：在各自exact SHA上按Cargo feature/原生依赖Profile运行tests；分别标生产Rust Native、Python/OCP独立对照，不自动升级GUI pin。
- 打包与离线恢复：由Windows质量验证Owner在与目标架构匹配的干净机器上检查EXE、OCCT DLL、Worker、签名/哈希、无网络启动与实际协议握手；费用CI禁止，本规划不运行。
- NC能力证明：在同一final NC bytes/hash和受控控制器语义配置上单独执行D13→D14→D15，不将CL动画纳入此“组合锁已经运行通过”的证据。

记录必填：`caseId`、`testedCombinationLockId`、`sourceCommitRefs[]`、`manifestDigest`、`binaryDescriptors[]`、`toolchain`、`hostOS/arch`、`command`、`args`、`timestamp`、`exitCode`、`stdout/stderr logRef`、`independentOracle`、`observedOutcome`、`expectedOutcome`、`coverageLimit`、`signer/reviewerRole`；`NOT_RUN`则`exitCode=null`，不得填模拟0。

## 3. 二十组独立正反验收规格

机器规格见[fixtures.json](fixtures.json)，与[规则追踪](../../../research/traces/B0-01.json)一一对应。AT01/02核对三层身份隔离，AT03/04拒绝path伪摘要，AT05/06核对双Cargo和pnpm，AT07/08检查Native实物，AT09/10拒绝空哈希，AT11/12识别Solver漂移，AT13/14防止旧PASS复用，AT15/16拒绝UI写业务，AT17/18校验失败回退，AT19/20防止CL动画冒充NC验证。

每组必须独立准备最少正反样本、预期拒绝码和实际结果证据；不能使用同一实现自证自身。规划校验可以检查规则/来源/正反链路是否完整，不能代替动态环境、构建或实物验证。实现后的测试由质量验证角色复核，并保存准确提交SHA和组合ID；工程Owner的审批又与产品测试回执分离。

## 4. 恢复协议、回滚与风险收口

风险Q1：研发Solver与桌面声明版本存在差异（当前确实有SHA不一致，非BUG证据）→交由组合兼容回归验证而不是自动同步；Q2：CAM path依赖在不同checkout下可能无法干净打包→以来源树内容指纹/隔离构建证据解决；Q3：根/桌面双workspace遗漏测试→将两组命令分别入Manifest；Q4：Native OCCT/Worker运行包不可得→unknown并阻断发布声称；Q5：长期离线环境证据可过期→以真实包内容而非URL/ref名称为依据；Q6：签名/证据不可获得→缺证据不阻止继续规划，但产品审批不得通过。

回滚只改变“当前active指向哪一个经批准且有字节证据的组合”，保留原锁revision、原Worker/二进制哈希和原始验收报告；不强制修改`develop`、不替换客户工程数据库、不以快照外观推定安装已经成功。来源和软件签名一致性需要由运行验证人员在具体目标平台确认。旧工具链产生不同bytes时记录不同BuildID，不强称可重复字节完全一致。