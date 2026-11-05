# R-BASE-001｜研发—集成—运行三层产品身份与可复现证据

日期2026-10-19；状态：`drafted_pending_review`；对应原工作包[B0-01](../../docs/work-packages/B0-01.md)。**本轮仅规划和只读源码审查；所有产品验收NOT_RUN**。新增来源列表见[来源登记](../sources/B0-01.json)、逐规则正反验收见[追踪](../traces/B0-01.json)。

## 核心问题及结论

第一，Git Commit能确定仓库内容修订，却不能决定谁消费了它；消费者版本需要取程序对应Manifest、锁文件及实际编译输入。第二，即使构建配置中声明`native-occt`或Worker，也不能证明安装包内含原生DLL或Worker的具体字节；运行实例应按实际可获取字节计算hash、大小、平台，取得信任证据。第三，版本漂移和协议不兼容是两回事，旧研发HEAD与桌面消费Pin不同只应触发针对性验证，不应自动强制更新。第四，有完整来源谱系仍不等于已经通过实机/NC验证，也不等于已有人类批准。

## 本轮实际读取的官方文献（阅读深度有界）

| 来源 | 实读内容 | 可以支持 | 明确不能支持 |
|---|---|---|---|
| SRC-B001-001 SLSA v1.2 Build Provenance | 官方Approved页的Purpose、Model、BuildDefinition、RunDetails、验证概览（2026-10-19） | Build Type、输入resolvedDependencies、builder、subject必须分层描述；内外参数和构建事实应分离 | **没有真实签名attestation**，绝不能宣称Procet达到SLSA L1/L2/L3 |
| SRC-B001-002 OCI Content Descriptors | opencontainers官方仓main descriptor.md的Properties、Digests、Verification（2026-10-19） | 可借鉴媒体类型、digest、原始字节长度和读回校验思路 | 这不是Procet采用OCI镜像格式的声明；官方main可变，产品实施需锁定文档版次 |
| SRC-B001-003 Cargo Book | Rust官方cargo-build `--locked`、`--offline`、`--frozen`和workspace成员选择（2026-10-19） | Rust锁依赖解析与离线可用性是两个不同约束；双Cargo workspace需分别核验 | 没有本轮实际cargo运行；lockfile不锁动态库或用户安装包 |
| SRC-B001-004 pnpm 10.x install | 官方pnpm维护仓10.x版本文档的frozen-lockfile/workspace（2026-10-19） | pnpm-lock.yaml可能防止依赖漂移 | 无本轮pnpm执行；不说明Rust/Native/生产EXE可重复 |
| SRC-B001-005 NIST SP800-218 Final 1.1 | NIST官方出版元数据、2022年摘要（2026-10-19） | 安全软件开发须有可审计的过程和交付实践 | **只读摘要**，不宣称实施了任何NIST具体条款；SP800-218 Rev1在官方目录仍标Draft |

研究访问URL、版本及无法取得项在JSON登记，不转贴版权受限资料。网页的2026抓取/访问日期不是其出版日期，未知发布日期保留未知。SLSA v1.2虽为网页“current”，具体项目证明必须独立建立，不能把填一份自定义JSON视作SLSA合格认证。

## 只读源码观察（与外部来源、实施主张分开）

GitHub连接器对`procet-gui develop@4e8eec12a212fc9dc86f2d728762c852832eebdb`读取`integration-lock.json`，显示目标`x86_64-pc-windows-msvc`，solver-adapter/contracts消费修订`b7e8bfc5…`，CAM消费为`path+../procet-cam`，并有`workspaceDigest`的**声明值**。`Cargo.toml`列出根Rust workspace，不含桌面Tauri；`apps/desktop/src-tauri/Cargo.toml`另建独立workspace并通过相邻路径引用CAM。GUI package.json需Node>=22、pnpm>=10。上述是文件内容的定点观察，未核实Cargo.lock/pnpm-lock.yaml每一条依赖的真实性。

`procet-cam develop@fcec1c86047e6b11be35b8bb38971e3dfcffbd7b`和`procet-solver develop@44172bc046bfd65c2a4fe36212536c70226be48f`均由connector读到真实最新HEAD（只对该次读有效），Solver 0.4.1 SDK的default native-occt feature不意味着GUI在其Pinned adapter上消费同一能力。CAM集成锁中的`workspaceDigest`未由本轮独立重算，不能命名为verified。真实安装包/动态库/Worker字节未取得，运行真值始终unknown。

完整只读事实的结构化记录见[combination-observation.json](../../docs/work-packages/B0-01/combination-observation.json)；该JSON属于“本轮源码观察快照”，不是产品组合锁和发布凭据。仓库私有源码仅作局部解释，不移植源文件到本公开规划仓。

## 原理到工程规则的转化

1. `ResearchHeads`、`IntegratedConsumption`和`RuntimeBundle`字段必须互不隐式提升；对应R01和AT01/02。
2. 源码地址、path声明摘要、安装文件实际hash须分别保存和复核；对应R02/R05和AT03/04、AT09/10。
3. Rust根/Tauri工作区、前端pnpm锁与独立Native ABI组合不能缩减成单一“本地build PASS”；对应R03/R04、AT05/06和AT07/08。
4. 漂移检测只是来源差异，不是功能失效证明；对应R06、AT11/12。
5. 产品测试结果必须锚定真正的运行实物和执行命令，旧PASS不适用新组合；对应R07、AT13/14。
6. GUI/CLI/Agent只能经Host许可面提交组合审查，预览/3D不拥有生产写入权；对应R08、AT15/16。
7. 新组合激活需要CAS、权限重验、保留旧revision和异常回退；对应R09、AT17/18。
8. NC链路额外绑定最终G-code内容、控制器解释D13、轴时序D14和验证D15；对应R10、AT19/20，不能由CL显示代替。

## 已知缺口与后续补证

Q01 尚未获得Windows真实安装包、EXE和DLL字节；Q02 未见独立验证CAM `workspaceDigest`的记录；Q03 未运行root/Tauri Cargo和pnpm多工作区构建；Q04 实际发布是否包含Agent/Docs Worker及其协议握手尚无证据；Q05 GitHub分支可能漂移，任何重新提交或签署前必须再次读取当前HEAD与锁文件；Q06 客户环境离线及软件包来源许可需现场质量角色独立验证。

**验收状态：全部NOT_RUN；** 文件链接、数学/协议schema、合成反例检查为规划静态结果，不能写进产品PASS或硬件符合性结论。批准人、质量独立Reviewer和真实BuildID需在实施阶段填入，不虚构其身份或结果。