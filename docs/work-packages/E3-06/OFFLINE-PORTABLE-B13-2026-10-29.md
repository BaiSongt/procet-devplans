# E3-06 / CAP-10-01、02、03｜离线NC交付包路径别名与接收前复验（B13）

> **新增实施补证，NEWLY_AUTHORED，仅V0.8的L3待审提案，不替换原E3-06十项任务。** 业务Owner候选是10域程序发布与现场协同；D16生产者、D17独立接收者及现场审批者待正式签署。规划PASS≠产品PASS。

## 一、解决的独立问题

原[E3-06](../E3-06.md)已禁止路径穿越及符号链接，并要求逐字节Hash，但**仅禁止双点路径仍不保证Windows/Unix离线复制时ZIP成员有唯一稳定的落盘身份**。例如 nc/program.nc 与 NC/program.nc 在默认不区分大小写的Win32语义下可能成为别名；NUL.nc属于Windows设备保留名；一些解包器会清洗非法文件名后落盘。原ZIP清单两个摘要合法，不能证明落盘两份文件仍分别存在。这是**设计风险，不是已经确认的Procet产品事故**。

本轮提出非标准的 PROPOSED_ASCII_SAFE_V1_PENDING_L3：仅ZIP内存储成员路径使用ASCII字母/数字与句点、下划线、连字符、正斜杠；禁止空段、单点/双点、末尾点、Windows设备保留基名；180字符为合成政策预算，绝非Win32/ISO普遍路径极限。中文GUI标题、NC显示名及工艺元数据可独立保留。未来若现场需要Unicode存储成员，必须另建经目标OS、U盘、DNC/OEM验证的版本化profile，**不能静默自动更名或自动归一化**。

## 二、七条规则与可机检字段

| Rule | 字段 | 独立拒绝与后续验证 |
|---|---|---|
| E306-B13-R01 | policy.profile、archive.entries[].path、manifest.paths[] | Win32设备名、盘符、路径穿越、非法段拒绝 |
| E306-B13-R02 | archive.declaredEntryCount、archive.entries[].path、manifest.paths[] | 成员与清单一一对应，ASCII小写别名/普通文件前缀冲突拒绝 |
| E306-B13-R03 | archive.entries[].kind/isLink、receiver.archiveIndexReopened | 只允许普通文件并由接收者重新读取ZIP目录；真实TOCTOU另验 |
| E306-B13-R04 | maxEntryBytes/maxTotalBytes/maxExpansionRatio、各成员长度 | 总量、逐项及扩张比政策上限，合成512/1024/25不是标准阈值 |
| E306-B13-R05 | 文件expectedSha256/observedSha256、D12/D15精确摘要、closure | 错NC/验证报告与未知D13/D14/D15阻断；本轮仅比较**合成摘要字符串**而非真实Hash |
| E306-B13-R06 | expectedRevision/currentRevision、roleAllowed、两端permissionEpoch、cancelled/lateReceipt | 发布/接收最后提交点CAS和权限重验；取消晚回执只入审计不推进 |
| E306-B13-R07 | receiver.pinnedTrustRootConfigured、revocationFreshness、reportKind、machineExecution | 包内自带公钥不得充当信任根；撤销未知阻断；收件不能冒充设备运行 |

[四个原始来源、7条规则和字段/CAP/原包映射](../../../research/traces/E3-06-offline-portable-b13-trace-v08.json) → [1基线、7合法正例、23独立单字段反例](offline-portable-b13-fixtures-v08.json) → [只读Node校验器](../../../tools/check_e306_offline_portable_b13_v08.cjs)；仅规划预检，禁止生成真实D16发布。新增规则关联原编号E3-06、T5-03和CAP-10-01/02/03/06，不暗改88/36/17分母。

## 三、统一入口、Owner、失效与回退

GUI同领域在**左侧UnifiedTaskPanel**显示ZIP成员、大小写冲突、保留名、每项原始字节摘要与验证级别；只用一个Babylon Engine/Scene/Canvas。D15可视证据在同一3D只读定位，不因预览完成发布。CLI与Agent使用同一个受管 D16.ReleasePackagePort.preflightPortableArchive 领域Schema；Agent仅提出建议，不能绕开审批或下发设备。C0只共用身份、exact revision/hash、frame、scope、权限Epoch，ZIP路径策略、Manifest和签名状态属D16。

D04 Setup定位≠D10机床执行绑定；D09中立CL→D12最终NC→D13解释→D14物理Joint时序→D15独立工程验证→D16审批与发布→D17独立验签/接收。CL动画或规划测试不能替代NC工程验证。A/B同一工程事实，不覆盖D08冻结版本。

旧离线包标记 LEGACY_UNVERIFIED 并只读展示，必须从源包和现场实际字节重新核验；没有原始字节就UNKNOWN。被拒文件保留可审计诊断，绝不静默改名/覆盖。撤销事件追加、不擦除已发历史，D17是否实际上收到撤销始终独立确认。用户取消后的晚回执只作审计，不可变成发布成功；CAS或权限失效必须建立新候选。Owner正式签署、实机与现场离线消费者测试是独立待办。

## 四、2026-10-29公开来源实际阅读范围

| 作者/机构、版本/日期 | 阅读范围 | 局限 |
|---|---|---|
| Microsoft Learn / Microsoft，Win32文档2024-08-28更新 | [Naming Files, Paths, and Namespaces](https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file)，File and Directory Names / Naming Conventions正文 | 非特定U盘/SMB/OEM文件系统验证 |
| Python Software Foundation，Python 3.13.18文档，页面未单列发布日期 | [zipfile](https://docs.python.org/3.13/library/zipfile.html)，extract、extractall及Path警告HTML正文 | 不代表所有解包器，未对真实ZIP作安全测试 |
| CNCF TUF编辑Justin Cappos、Trishank Karthik Kuppusamy、Joshua Lock、Marina Moore、Lukas Pühringer，1.0.36（2026-08-05） | [TUF](https://theupdateframework.github.io/specification/v1.0.36/) §3.1.1、§5.7正文 | 仅目标内容长度/Hash与唯一身份的工程借鉴，不宣称TUF实现 |
| A. Rundgren、B. Jordan、S. Erdtman，RFC8785（2020-06） | [JCS](https://www.rfc-editor.org/info/rfc8785/) 摘要、§3.1/§3.2正文 | 仅JSON规范化；没有实现JCS、签名、流式NC Hash |

**产品状态：** 本地Node已独立执行合成31案例；不是精确Git checkout整仓验收，不触及真实ZIP、文件系统重解析、签名/信任根、Windows现场、DNC/控制器或真实D17消费者。L3待审批；正式17 Owner会签0/17、真实独立消费者0/17、OCCT/NC/B5/OEM均NOT_RUN。规划PASS≠产品PASS。
