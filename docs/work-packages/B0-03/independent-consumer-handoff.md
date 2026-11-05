# B0-03｜黄金案例独立消费者验收与移交
2026-10-27 · 紧贴原S05/S07/S08。角色：Quality Owner（策划，不替代批准）、独立OCCT几何核验、NC控制器语义Owner、GUI/CLI/Agent入口Owner、现场机床验证与发布审批者。

## 实施者必须回填的每例记录
`caseId`, `caseRevision`, `ruleIds`, `sourceIds`, `originLicenseEvidence`, `scopeId`, `assetType`, `ownerPort`, `assetId`, `exactRevision`, `contentHash`, `frameId`, `unit`, `inputArtifactRefs`, `tolerancePolicyRef`, `oracleImplementationRef`, `oracleIndependenceRationale`, `expectedOutcome`, `observedOutcome`, `productRepo`, `exactHead`, `environment`, `verifiedCommand`, `exitCode`, `skippedReasons`, `reviewerRole`, `reviewerSignature`, `executionStatus`。不能为NOT_RUN填写假exitCode。区分机床实测数据、仿真推导、外部标准目录、人工结论。

## 逐领域独立核验
D01统一事实、ACL、CAS和提交瞬间权限重验；D04 Setup与D10实际机床/工装/刀具绑定不可互作默认值。D06 B-Rep需反事实与独立拓扑/容差/保护区Oracle，单一体积相同并非足够。D08冻结工序保留历史，A/B对同一事实协作时只创建新修订。D09 CL/D11预检仅黄色`CL_ONLY`；最终D12必须重新经D13控制器方言独立解释、D14机床轴时序、D15真实工程范围核验、D16有权限放行；未知仍`UNKNOWN`，不做材料扫掠。GUI/CLI/Agent共用领域Owner入口，单Babylon世界和统一左TaskPanel；过时scope/epoch和取消晚回执禁止提交。

## 实际测试的安全顺序
1. 在产品仓由实施者只读核实各工作区及脚本/命令是否真实存在；本仓不预造cargo/pnpm命令。
2. 从合法合成数据重放GOLD-01..12全部正例及其负例；至少一名非生产者以独立方法检查数值和归属，记录容差与差异。
3. 每轮执行前后核对精确revision/hash/frame/ACL/Owner及版本变更失效矩阵，禁止复用旧D15和旧D16放行。
4. 真实B5控制器Profile、机床轴链、刀具TCP/工装、限位/测量证据没有取得时`UNKNOWN`并禁止D16放行；CL播放不冒充NC验证。
5. 失败保留日志与旧冻结/发布证据，新修订隔离，回滚不得删除用户数据库。交接后L3/Owner人类签署；产品PASS应由独立消费者单独记录。

状态：`PLANNING_SYNTHETIC_ONLY`；Node独立本地进程`NOT_RUN`；OCCT/NC/B5/浏览器/消费者`NOT_RUN`；Owner/L3`PENDING_HUMAN`。
