# B0-04｜实施切分、测试入口与正反验收规范

母文：[B0-04](../B0-04.md)，[机器读取的十个子任务](subtasks.json)，[20组正反例](fixtures.json)，[10条规则追踪](../../../research/traces/B0-04.json)。均为**规划规格；真实产品验收全部NOT_RUN**。

## 准入要求

B0-01的研发/集成/运行三层审查材料应存在并已由集成负责人审核；**当前仅有本地B0-01草案、未证明运行组合**，所以产品实施准入未满足。获得源码与Native/Worker合法使用及离线分发许可；不可把未授权标准/机床模型/私有源代码放入公开仓。明确Windows `x86_64-pc-windows-msvc`是否为批准目标，避免借由集成锁的声明误作用户合同。

## 十项分派

| 子任务 | 真正负责人/消费方 | 工作和可审查产物 | 真实测试入口 | 失败回退 |
|---|---|---|---|---|
| S01 | 平台集成→B0-01/B0-05 | 固定GUI/CAM与三锁SHA、区别研发和发行事实；`build-dependency-snapshot.json` | 待建：两个Cargo metadata只读采样 | 不改原锁 |
| S02 | CAM Owner→桌面/后处理消费者 | 发行消费`git_exact`或合法vendor选择、CAM features/protocol对账；`cam-consumption-profile.json` | 待建：干净检出+删兄弟目录的Cargo解析正负例 | 研发path仅隔离dev |
| S03 | 集成工程师→质量组 | 根Cargo与Tauri Cargo双入口、两Cargo.lock、工具链清单；`workspace-lock-matrix.json` | 待建：各workspace `cargo metadata/build --locked` | 回到旧已验证锁 |
| S04 | 前端构建Owner→桌面 | pnpm 10冻结锁/预置store及缺缓存失败模式；`frontend-offline-contract.json` | 待建：`pnpm install --frozen-lockfile --offline` | 不影响用户store |
| S05 | Native Owner→桌面验证 | `PROCET_OCCT_ROOT`编译路径/运行DLL/ABI/Hash清单；`native-bundle-descriptors.json` | 待建：Windows装载器与DLL实物hash校验 | 恢复旧Native文件 |
| S06 | Worker Owner→Host调用方 | Agent/Docs/Solver Worker协议、sidecar及安装位置；`worker-bundle-manifest.json` | 待建：目标平台二进制启动/协议握手负例 | 禁用未证Worker |
| S07 | 质量组→发布Owner | 干净目录、无网/缓存、双Cargo、pnpm、目标安装包回归；`clean-room-acceptance.json` | 待建：隔离Windows环境，日志+artifact SHA | 失败不更换活动组合 |
| S08 | 平台治理→GUI/CLI/Agent | 01域发布命令/事件/回执、CAS/权限重验；`release-gate-contract.json` | 待建：Host领域服务集成/权限故障注入 | 旧reader兼容 |
| S09 | GUI Owner→质量/操作员 | 五任务UnifiedTaskPanel、单Babylon只读资源投影；`gui-tasks.md` | 待建：浏览器/桌面E2E多窗口/晚回执 | UI入口可独立降级 |
| S10 | 发布审核者→离线现场 | 版本/签署/闭包报告与可撤销旧包；`release-handoff-report.md` | 待建：离线安装/实际回滚演练 | 成对恢复旧installer/原生/Worker |

上述产物文件名是**未来产品/发布工作的交付规范**，不是本地规划目录已经生成同名的真实运行日志。子任务依赖顺序：S01→S02/S03/S04，S03→S05/S06，S02...S06→S07，S07/S08/S09→S10；S08/S09可与闭包核验并行开发，但激活逻辑必须等待S07的真实证据。

## 关键场景组合与退出门槛

1. **正例**：指定CAM git精确revision，在非兄弟布局能解析；双Cargo+pnpm各自冻结；目标Windows installer存在完整Native/Worker和来源记录；独立测试及批准后可激活。
2. **负例**：仅本地兄弟CAM可编、删除兄弟目录失败；不准将其标为release ready。
3. **负例**：只跑根Cargo、Tauri未测；`build_tested`必须阻断。
4. **负例**：pnpm锁未改变但store不含必需包；`offline_build_ready`不得出现。
5. **负例**：SDK编译成功但Native DLL缺失/ABI错误；`install_tested`必须阻断。
6. **负例**：Worker仅存在manifest声明，二进制未随installer；对应模块必须`unknown/disabled`。
7. **负例**：批准后CAM revision、feature或OCI/Native artifact哈希改变；旧证据与批准失效，不能silent overwrite。
8. **负例**：取消任务后迟到Completed，或审批引用旧expectedRevision；必须拒绝业务提交并保留原活动组合。
9. **负例**：回退仅恢复Cargo.lock而未恢复Native/Worker/installer；必须拒绝假回退成功。
10. **负例**：三维预览选中某依赖组件；只允许只读Inspector显示，不触发发布激活。

机器可读[fixtures](fixtures.json)将10规则各自绑定一对正反验收ID；`kind=POS|NEG`是设计断言，`actualExecution=NOT_RUN`不会被检查器提升为产品PASS。

## 运行证据与验收形态

产品测试脚本与真实产物现在不可访问；明确标记`TO_BE_CREATED`，不得自动运行或冒称存在。将来合法产品实施后，quality report至少存目标平台、完整Git SHA、manifest与Cargo.lock/ pnpm-lock digest、crate features、tools版本、CLI/stdout/log hash、构建产物/installer/native/worker SHA256、运行覆盖、负例结果、测试签署者、文件合法来源和不足项。执行过的测试入口需固定exact HEAD，历史PASS不能无条件授予新HEAD。

**退出标准：** 十项产物及其真实测试附件具备、路径依赖在发行profile消除且开发覆盖仍可用、无兄弟目录构建通过、两Rust workspace与pnpm冻结/离线验证通过、真实目标平台安装闭包和回滚被独立验证、用户角色已批准、剩余未知项按能力明确阻断；以上本轮**全部尚未通过产品验收**。