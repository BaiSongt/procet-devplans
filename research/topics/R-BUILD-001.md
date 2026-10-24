# R-BUILD-001｜独立消费、可复现构建与离线安装闭包

**对应原V0.8 B0-04**。2026-10-19 实际在线核对官方Rust Cargo、pnpm、Tauri与SLSA公开文档；精确阅读深度见[来源登记](../sources/B0-04.json)。研究仅提供构建与供应链证据方法，不是软件可发布性或SLSA达标认证。关联[实施工作包](../../docs/work-packages/B0-04.md)与[可机器审查规则](../traces/B0-04.json)。

## 一、依赖来源与发布输入不得等同

Cargo Book《Specifying Dependencies》公开章节说明`path`相对当前Cargo.toml解析、`git+rev`消费Git上的确定修订，二者有本质差异。当前固定源码`apps/desktop/src-tauri/Cargo.toml`明确要求兄弟路径`../../../../procet-cam`，所以**提出**发布profile改为精确git source（或合法受管源码包），dev覆盖保持明确隔离。这是从官方行为和当前manifest推出的设计，非官方文档直接强制具体CAM部署方案。验证需在**无兄弟目录**的干净检出进行，而不能拿开发机已有CAM目录当证据。

`cargo vendor`可导出crate registry与git来源，支持跨多manifest同步，但其文档明确处理的是Cargo依赖源；**不保证**自己包含Native OCCT动态库、Windows编译器、Worker、许可证或pnpm store。源码供应包方式是否合法使用/再分发，需产品及许可证Owner审核。对发布模式必须消除隐式本地path override，但不能因此删除开发模式本地覆盖。

## 二、三个不同层级的复现性

1. `SourceClosure`：准确GUI/CAM git修订、Cargo/Pnpm锁、子模块、features和构建脚本，必须可枚举。
2. `BuildClosure`：上述源＋目标工具链与实际全部依赖/缓存/Native SDK，构建输出需要真实hash及日志。Cargo源缓存足够不证明pnpm已备齐；pnpm`--frozen-lockfile`只防止锁自动漂移，`--offline`只使用store并可能缺包失败。
3. `InstallClosure`：目标安装包、EXE、OCCT动态库、Worker sidecar、资源、ABI和运行启动验证。Tauri v2 `bundle.resources`及`bundle.externalBin`允许声明额外资产，但当前只读配置未见字段**不能证明产品最终打包了或没打包Worker**；其他打包阶段/生成配置可能存在，必须以安装包bytes为准。

三层可以形成有向来源图，但记录越全不代表已经通过全部平台验收；每个结论须附实际测试范围。SLSA v1.2的Build Provenance提出`buildDefinition`、构建输入与运行细节等来源信息，支持审查产物由何而来，不能由一份手写manifest推断获得SLSA等级。这里还需人为批准、许可审查、离线目标现场验证。

## 三、Native与Worker具体风险

当前Tauri`build.rs`对`PROCET_OCCT_ROOT`做条件编译，使用C++包含路径，但它不采集最终exe加载哪些`TK*.dll`、其ABI、发布许可、校验Hash或运行环境。CAM的Cargo features可能引入Solver adapter及其它git crate。Worker既可能作为sidecar，也可能由服务安装流程提供；Tauri文档对target-specific binary命名有要求，**未核对实际Windows bytes和流程以前一律`UNKNOWN`**。不能把`bundle.targets=all`理解成所有目标平台都构建成功。

## 四、研究来源细目与适用边界

| ID | 已读取公开内容 | 支持设计 | 不支持结论 |
|---|---|---|---|
| B004-S01 | Cargo Book `path/git/multiple locations`；在线现行版，确切页面发布日期未列 | 发布不依赖未知同级目录，精确pin、dev override分离 | 不证明Procet源码一定能以git方式无修改编译 |
| B004-S02 | Cargo vendor官方页面`DESCRIPTION/--sync`；日期未列 | vendor及多个manifest同步的候选离线依赖方案 | 不包含Native/Worker/前端依赖 |
| B004-S03 | pnpm 10.x安装官方文档`--offline/--frozen-lockfile`；日期未列 | 两种开关分别验锁和缓存充分性 | 没有实际执行/不证明store存在 |
| B004-S04 | Tauri v2配置官方参考`BundleConfig`字段；日期未列 | Native/外部资源需明确包内清单 | 不证明Procet真实bundle已附加资源 |
| B004-S05 | Tauri v2 External Binaries官方指南；日期未列 | target-specific sidecar入口和协议/平台 | 不强制所有Worker必须用sidecar |
| B004-S06 | SLSA v1.2 Build Provenance（批准的规范版本） | 记录buildDefinition、依赖输入、输出来源 | 不是对Procet的SLSA合规/认证声明 |

资料实读访问日是`2026-10-19`；旧源登记访问日完全不因本专题而改写。标准/规范与源码观察区分；在官方网页中未披露发布日期的项记`null`，不以访问日冒充发布日。`Cargo path`如何解析是外部理论，CAM当前path配置是源码观察，发布profile与证据门禁是**内部待评审设计**；`B004-ATxx`全是待执行规格，不能写“测试通过”。

## 五、设计决定及失败边界

推荐发布CI或本地release script从`IntegrationManifest`取受管pin，精确检出依赖，不读取上级目录中的任意同名CAM；正式构建须拒绝意外`[patch]`或用户级Cargo overrides。dev覆盖可以继续使用但出厂工件必须记录`development_only`。为两个独立Cargo workspace分别采集真实`cargo metadata/build --locked`证据，前端pnpm预热和空缓存负例分别测；发布流程再核对Native/Worker实物及目标ABI。每个构建候选必须能够返回`source_verified`、`build_tested`、`install_tested`各级证据，全部未执行时保持`NOT_RUN`。

未解决的适用边界：合法复用或打包授权、Windows签名主体、用户现场离线供应流程、Worker是否sidecar还是服务、部署目标是否单Windows平台、其它模块是否也存在隐式兄弟目录、已有实际安装包的位置。无证据不能冻结L3或给设备/控制器认证。任何未来改动需通过用户批准的产品开发任务执行，本次仅规划仓静态交付。