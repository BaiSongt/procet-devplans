# CAP-10-03｜Windows离线介质路径别名与封闭收方提取（B48，2026-10-31）

> **本轮性质：规划研究增量；L3 PENDING_HUMAN。** 保留原CAP-10-03及原E3-06/T5-03；不改变11域88 CAP、36包、17资产。原[R05/T05](README.md)仅提出路径隔离要求，本轮将Windows别名与归档成员身份落实为可重复负例。**规划PASS≠产品PASS**。

## 为什么补证

离线现场可能只通过U盘/ZIP交付D16签发包。即使归档成员SHA或签名校验正确，文件系统仍可能把不同名称解析成同一实体、重解析到隔离目录之外，或由解压库自动改名。签发Manifest必须绑定**原始归档成员名、原NC字节和解包后的同一文件对象**；不允许把“清洗后碰巧可解压”直接当成相同D16。离线接收者必须先枚举成员，拒绝危险元数据、预算超限与别名，再按原清单匹配；OS句柄级再核查是另一层，**仅字符串校验不能抵抗TOCTOU**。

## 可复查的公开来源与边界

| ID | 作者/版本、访问章节 | 规则与限制 |
|---|---|---|
| B48-S01 | Microsoft Learn《Naming Files, Paths, and Namespaces》，更新2024-08-28；实读Naming Conventions / Short vs. Long Names；2026-10-31访问 | 设备名CON/NUL、COM¹/LPT²，`NUL.txt`仍别名；尾点空格、大小写、8.3别名风险；不同卷配置未知 |
| B48-S02 | Microsoft Learn《File streams》，公开HTML，实读Naming Conventions for Streams | `filename:stream:$DATA`是NTFS命名流；本策略拒绝任意成员名冒号，不能据此推断实机验证 |
| B48-S03 | Microsoft Learn《Hard links and junctions》（2025-07-08）与《Reparse Points and File Operations》（2021-01-07）公开HTML所示章节 | 同实体多路径、junction与reparse点需要句柄级核验；未验证真实Windows API或竞态 |
| B48-S04 | Python Software Foundation《zipfile》，Python 3.13.18网页，实读extract/extractall/Path | 提取方法可能改变成员名；`zipfile.Path`不代替使用者的路径校验；不是Procet产品运行证据 |
| B48-S05 | Node.js contributors File system v26.13.0，实读lstat/open文档入口 | 只能作为预期实现接口线索；一次lstat不足以证明抗reparse和竞态 |
| B48-S06 | [原CAP-10-03固定Git Blob](https://github.com/BaiSongt/procet-devplans/blob/643d077c65bad2b5710dbd37a4ba0a2d47db22d8/docs/capabilities/CAP-10-03/README.md)，本轮GitHub原连接器完整回读 | D04/D10隔离、CAS/ACL、三入口、冻结等属Procet内生规则，不归因于Windows文档 |

完整作者、时间、URL、访问深度、局限见[来源元数据](../../../research/sources/CAP-10-03-windows-path-b48.json)，不是未经授权的付费标准全文复制。

## 八条来源→规则→字段→原包→正反验收

| 规则 | 字段与判据 | 原包 / 独立正反样例 |
|---|---|---|
| B48-R1 | `archive.entries[].name`只许POSIX相对路径、禁止绝对/盘符/UNC/`..`/反斜杠，不自动重命名成别的签发路径 | E3-06/T5-03；P01，N01–N05 |
| B48-R2 | Windows设备名（含扩展、上标数字）、冒号ADS、尾点/空格、非法字符/控制字符拒绝 | E3-06/T5-03；P01，N06–N11 |
| B48-R3 | 大小写等价文件冲突、文件充当目录祖先拒绝；未核Unicode或8.3等价保持UNKNOWN | E3-06/T5-03；P01，N12–N13、U01 |
| B48-R4 | `kind`仅regular，symlink、hardlink、junction、reparse拒绝；host/reparse核证不足UNKNOWN | E3-06/T5-03；P01，N14–N17、U02–U04 |
| B48-R5 | ZIP成员数量、每文件/总解压预算、原名/大小/原字节hash与Manifest逐项匹配 | E3-06/T5-03；P01，N18–N22 |
| B48-R6 | D16/D12原字节、D10实际Frame和revision exact，收方签名证据不足UNKNOWN | E3-06/T5-03；P01，N23–N26、U05 |
| B48-R7 | Owner提交前重验ACL、CAS、ScopeEpoch、cancel、late ACK；保留D08冻结和旧Reader回退 | E3-06/T5-03；P01，N27–N33 |
| B48-R8 | GUI/CLI/Agent统一`10.OfflineTransferPort`、单Babylon/左TaskPanel；D15未实测不能解禁D16 | E3-06/T5-03；P01，N34–N37 |

[机器字段追踪](../../../research/traces/CAP-10-03-windows-path-b48-v08.json) → [1正37反5 UNKNOWN、43合成向量](windows-path-b48-fixtures-v08.json) → [只读Node校验入口](../../../tools/check_cap1003_windows_path_b48_v08.cjs) → [分级验证报告](../../../tracking/cap1003-windows-path-b48-verification-2026-10-31.json)。每个反/未知用例**只改变P01的一条叶字段**，判定函数固定在工具中，不从用例预期反推。

## 安全的责任与状态链（拟实施，不代表产品现状）

**工程端**：D16 Owner冻结D12最终NC、调用文件、签名Manifest的完整字节和来源；D04仅为名义Setup，D10另持实际机床/夹具/刀柄/控制器Profile的revision/hash/Frame。只有人类批准后的受控发布能够进入离线流程。**U盘导出成功只是COPY_SUCCESS，不是D15 PASS。**

**收方**：10域独立`OfflineTransferPort.inspectManifest/inspectArchive/preflightPaths/verifyReceiverHashes/verifyInstalledFileHandles/appendD17ReceiptCAS`；先检查路径/类型/预算、随后受保护隔离目录中的原字节与签名、实际文件对象和允许的目标工位。拒绝归档硬链接/符号链接/重解析点与Windows设备路径；不能证实卷配置、Unicode重合、实际文件句柄绑定、撤销可信时间即UNKNOWN、禁上机。归档本身、解包后的文件集合与Manifest三者不能相互替代。签收D17仅追加，不具有CycleStart权。

**交互**：GUI/CLI/Agent都通过相同10域Owner Port；单Babylon Engine/Scene/Canvas和唯一左侧TaskPanel，最大字体12px，3D预览只读，任何可视化颜色不能成为安全证明。提交前再次检查expectedRevision/hash/Frame、ACL、scopeEpoch、cancelGeneration；late ACK丢弃，A/B共享事实不覆写D08冻结；旧Reader双读影子核对，失败时非破坏回退。

**严格验证链**：中立D09 CL → 后处理D12最终NC原始字节 → D13解释 → D14真实Joint轴时序 → D15独立工程验证 → D16发布。CL动画、归档SHA、签名、D17签收互相不可冒充，不做材料扫掠仿真。当前合成P01仅意味着元数据政策可机检，D13/D14/D15产品与D16签发仍均`NOT_RUN/BLOCKED`。

## 尚缺独立实证（必须作为工程交接风险）

1. Windows NTFS/exFAT/U盘上的真实命名、8.3别名、case mode、Unicode与重解析点/目录句柄操作；文件创建过程抗TOCTOU、链接跳转、防文件覆盖。**NOT_RUN**。
2. 真实ZIP解包库、压缩炸弹预算、流/文件句柄独立哈希及签名/可信撤销/离线接收端负例。**NOT_RUN**。
3. D10实际安装、D13/D14/D15/真实B5/OEM、17资产独立消费者与正式Owner签署0/17，L3审批未发生。**NOT_RUN / PENDING_HUMAN**。

此方案是一项保守可执行规划子集，不宣称Windows所有有效路径均应被拒绝，也不构成生产安全或安全认证。
