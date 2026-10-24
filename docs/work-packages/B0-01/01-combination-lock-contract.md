# B0-01｜三组合基线字段、统一端口与五任务界面

## 1. 必须区分的对象与Owner

| 对象 | Owner | 谁生产 | 谁消费 | 默认与单位 |
|---|---|---|---|---|
| `ResearchSnapshot` | 各研发仓，01域仅登记观察引用 | Git HEAD+ref观察 | 集成Owner/质量 | `exactCommit`无默认；不涉及mm或角度 |
| `IntegrationManifest` | 01域集成Owner | GUI锁文件+manifest观察 | 构建、协议兼容检查 | `schemaVersion`显式；不接受`latest` |
| `SourceTreeDigest` | 产品构建/质量 | 检出目录独立摘要器 | 集成/现场 | 只有实际重算才能`verified` |
| `BinaryDescriptor` | 真实打包或发布Owner | 可访问安装包/Worker/native的字节测量 | 质量、发布和现场 | `digest`为带算法的内容Hash；`byteSize`整数≥0 |
| `CombinationLock` | 01域平台集成组合注册器 | 精确引用聚合+受控签署 | GUI/CLI/Agent、B0-02/B0-03 | `state=draft`，`runtimeVerification=unknown` |
| `EvidenceRecord` | 质量验证Owner | 带平台/工具链/命令的真实执行 | 审批、发布 | `executionStatus=not_run`起步 |

`runtimeBundleDescriptor=null`表示“当前未取得字节”，不是`sha256:000…`。`frameRef=not_applicable`且保留`reason`，C0不应要求基线清单拥有机床坐标。把依赖环境hash、工程Hash和实际运行二进制Hash混为一个指纹会造成验收不可信；锁可以拥有复合ID，但每个组件仍需独立原始摘要及可核查来源。

## 2. 拟议C0/C1最小报文

```json
{
  "schemaVersion": "procet-combination-lock-v1-proposal",
  "combinationLockId": "lock-review-20261019",
  "ownerDomain": "01",
  "revision": "draft-r1",
  "state": "draft",
  "researchSnapshotRefs": [
    {"repo": "BaiSongt/procet-gui", "commit": "4e8eec12a212fc9dc86f2d728762c852832eebdb"},
    {"repo": "BaiSongt/procet-cam", "commit": "fcec1c86047e6b11be35b8bb38971e3dfcffbd7b"},
    {"repo": "BaiSongt/procet-solver", "commit": "44172bc046bfd65c2a4fe36212536c70226be48f"}
  ],
  "declaredManifest": {
    "repo": "BaiSongt/procet-gui",
    "commit": "4e8eec12a212fc9dc86f2d728762c852832eebdb",
    "path": "integration-lock.json",
    "blobSha": "cb2c96019e4053437d668e230fa0e651f7d8d762"
  },
  "targetPlatform": "x86_64-pc-windows-msvc",
  "runtimeBundleDescriptor": null,
  "runtimeVerification": "unknown",
  "evaluationEvidenceRefs": [],
  "approvalRef": null,
  "warning": "本段只展示真实只读引用+拟议schema；不是可激活的正式组合锁"
}
```

该例的**研发SHA和声明锁文件Blob SHA确实已读**；`combinationLockId`仅示意，未实现业务分配。目标三元组来自GUI锁文件声明，非客户设备侦测。未知内容不得猜哈希。未来数据包按`ownerDomain/id/exact revision/descriptor`明确写边界；C0不处理“Solver已发布”之类审批语义。

## 3. GUI/CLI/Agent共用Query、Command、Event、Receipt

| 类型 | 名称（拟议） | 要点 | 成功终态判据 |
|---|---|---|---|
| Query | `GetCombinationSnapshot(lockRef)` | 返回各层观测、证据、unknown原因，不激活 | 已读取匹配exact revision |
| Query | `GetCombinationDriftReport(lockRef, comparisonRef)` | 仅比较引用/构建内容/协议，不默认兼容 | 差异含字段证据和未决项 |
| Command | `StartCombinationInspection(inputRefs, requestId)` | 创建审查会话，Host Job和租约 | `accepted/job_started`不是已核验 |
| Command | `RegisterCombinationDraft(expectedRevision, evidenceRefs, actor)` | Owner CAS产生新revision | `commitReceipt`包含新exact ref |
| Command | `AttachRuntimeEvidence(lockRef, descriptor, independentVerifier)` | 校验原始字节与目标平台，再附证据 | 文件真实可读、hash/size一致 |
| Command | `SubmitCombinationForApproval(exactLockRef, policyRef)` | 权限/测试闭包/签署角色独立检查 | 仅进入待批准，不越过人审 |
| Command | `ActivateApprovedCombination(exactLockRef, expectedActiveRevision)` | 提交点再次重验状态、权限和输入Hash | 持久激活回执才叫committed |
| Command | `RetireCombination(exactLockRef, reason)` | 保留历史；运行中断策略单独确认 | 旧历史只读保留 |
| Event | `CombinationInspected/Changed/Blocked/Activated` | 含`requestId, epoch, sourceRefs, resultRef` | 不许迟到回执提升过期lock |

所有命令应有`requestId`幂等、`sessionEpoch`和`expectedRevision`；无认证主体只可查询公开可见元数据。`capabilityAdvertised`、`backendReady`、`requestPermitted`与`committed`分开。拒绝/超时返回结构化`UNKNOWN_BINARY`, `STALE_REVISION`, `PERMISSION_DENIED`, `MISMATCHED_MANIFEST`, `WORKER_PROTOCOL_UNKNOWN`, `INSUFFICIENT_TEST_EVIDENCE`。Agent工具调用成功最多得到accepted/commitReceipt，不自动生成批准签名。数据库真值由Host工程事务管理，GUI状态/3D标记不成为第二套持久业务库。

## 4. UnifiedTaskPanel五页与单Babylon投影

| 任务页 | 用户问题和必填字段 | 只读派生/默认 | 3D与交互 |
|---|---|---|---|
| ① 采样基线 | `repo`、`branch`、`observedHead`、`observer`；不能默选旧HEAD | `shaVerifiedOnGitHub`和观察时间只读；默认状态draft | 主工作区高亮当前工程背景，不绑定制造几何 |
| ② 差异与消费 | `manifestRef`、`consumerRevision`、`compatibilityProfileRef` | `driftKind/lockSha`只读；缺未列模块显示unknown | 选依赖节点仅高亮影响模块，不生成新Babylon世界 |
| ③ 闭包与环境 | `targetTriple`、`nativeLibRef`、`workerRef`、`toolchainRef` | `digest/byteSize/availability`来自真实描述符；没有字节则unknown | 资源虚拟桌面横向切换；overlay是辅助可视化 |
| ④ 测试与证据 | `testPlanRef`、`runEnvRef`、`commandRef`、`oracleRef` | `executionStatus=not_run`；日志/数值只读 | 可联动案例截图与结果文件，禁止把预览动画记为PASS |
| ⑤ 批准与激活 | `exactLockRef`、`expectedActiveRevision`、`policyRef`、`actor`、`reason` | `canApprove`由领域权限查询生成只读结论；默认否 | 确认弹窗仍经同一命令；3D选中不会持久提交 |

深浅主题都用文字状态`draft/unknown/verified/tested/approved/active/blocked/retired`，不可单靠颜色。取消会话释放preview lease和异步Job订阅；Job已提交时取消只是请求，真正结果以Host统一回执仲裁；切工程、切文档/Setup或失去权限时`sessionEpoch`推进，迟到响应只可入审计，不更新当前可见状态。断网后离线读取已签署缓存，但不可将缓存当作实时批准。权限策略变化后必须在最终激活点重验。

## 5. 版本/协议兼容/迁移与回退

`combinationLockSchemaVersion`、`workerProtocolVersion`、`camSnapshotSchemaVersion`、`solverRunManifestVersion`、`nativeAbiProfile`分别版本化；未知必填schema或不能证明ABI匹配时阻断激活。迁移允许旧read adapter只读，新增exact lock revision而不是原地覆盖。`rollback`要求指向**先前已独立核验且可获得的版本**，目标不可得则进入blocked，而非指向某个最新研发HEAD。

不创建17种C0数据模型，不让中立CL绑定机床；D12最终NC→D13控制器语义→D14轴时序→D15工程验证→D16发布按各Owner独立验收。任何GUI“机床正在运动”的画面不得作为本包构建或NC执行证据。