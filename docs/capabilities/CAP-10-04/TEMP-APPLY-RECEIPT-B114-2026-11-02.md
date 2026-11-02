# B114｜CAP-10-04 OPC UA 临时文件异步应用与D17独立收方资格

**2026-11-02｜NEWLY_AUTHORED｜L3待人类审批；原CAP-10-04与E3-06/T5-03编号不变。** B63已覆盖普通FileType Session、短读/EOF、SetPosition越界与收方字节验证；本轮只新增 `TemporaryFileTransferType` 的生成→写入→`CloseAndCommit`后端异步应用、`FileDirectoryType.MoveOrCopy` 的NodeId变更，以及应用成功≠接收/签发/执行成功的分层边界，避免重复B63。原11域88 CAP、36工作包、17资产及L1/L2不变；L3待审批。

## 1. 官方案例为何会误判

OPC Foundation《OPC UA Part 20: File Transfer》v1.05.06的§4.4.1说明临时文件对象不是可浏览常规节点，客户端必须在同一Session用生成接口返回的 `fileNodeId` 和 `fileHandle`访问。§4.4.5的 `CloseAndCommit` 可返回异步的 `completionStateMachine`：若返回非空NodeId，后续处于 `ApplyWrite` 不表示事务已经应用，需跟踪该事务进入 `Idle` 或明确 `Error`；返回空NodeId是协议意义上的服务端同步完成，不是业务接收端独立验收。§4.3.6 `MoveOrCopy` 的输出 `newNodeId` 需要重定位，即便移动也可能改变NodeId。没有任何一条可用来推断厂商程序加载/激活/CycleStart或原子覆盖保证。

**反例A：** 上传写入返回Good且 `CloseAndCommit` 已响应，但完成StateMachine仍在 `ApplyWrite`。错误做法将D17记录为已完成并发布绿色上机资格；正确结果是 `UNKNOWN`，只记录服务端异步处理中。 **反例B：** Stage目录经 `MoveOrCopy` 后沿用旧File NodeId，旧读句柄证据与新目标不再一致，应判 `STALE` 并重新定位，不能沿用缓存SHA。 **反例C：** HTTP `Content-Digest` 完整不代表后端应用成功、接收端全NC+子程序原字节一致或D16签名有效；必须分别出具事实。

## 2. 来源、合法阅读深度、归属边界

| ID | 作者/版本/公开日期 | URL与实际访问范围（2026-11-02） | 局限 |
|---|---|---|---|
| B114-S01 | OPC Foundation；OPC 10000-20 v1.05.06（官网版次）；官方版次目录显示2025-10-22；当前章节页未单列发布日期 | [来源](https://reference.opcfoundation.org/specs/OPC-10000-20/4.4)；§4.4.1、§4.4.3、§4.4.4，TemporaryFileTransferType与GenerateFileForWrite；官方公开HTML正文及方法签名实读 | 仅协议模型；不能证明具体CNC有该ObjectType、写许可或任何NC激活接口 |
| B114-S02 | OPC Foundation；OPC 10000-20 v1.05.06；章节页未单列发布日期，沿用版本索引2025-10-22 | [来源](https://reference.opcfoundation.org/specs/OPC-10000-20/4.4)；§4.4.5 CloseAndCommit、§4.4.6 FileTransferStateMachineType；官方HTML方法签名、同步空NodeId/异步StateMachine、ApplyWrite/Idle/Error段落实读 | 服务器ApplyWrite完成不证明D15验证、D16签发、收方原字节一致或设备已获运行授权 |
| B114-S03 | OPC Foundation；OPC 10000-20 v1.05.06；章节页未单列发布日期，沿用版本索引2025-10-22 | [来源](https://reference.opcfoundation.org/specs/OPC-10000-20/4.3)；§4.3.6 MoveOrCopy（含newNodeId及move后NodeId可能变化的说明）；官方HTML签名和newNodeId正文实读 | 没有把目录MoveOrCopy定义为通用原子替换、受保护active程序操作或激活许可 |
| B114-S04 | OPC Foundation、VDW；OPC 40501-1 v1.02.0；官网章节未单列发布日期 | [来源](https://reference.opcfoundation.org/specs/OPC-40501-1/8.1)；§8.1 MachineToolType及可选FileSystem引用；官方HTML指定公开章节读取与B63已登记证据交叉核对 | 机床支持OPC UA不等于具有可写FileSystem，更不等于支持自动程序选择或CycleStart |
| B114-S05 | Roberto Polli、Lucas Pardue（IETF）；RFC 9530，2024-02；2024-02 | [来源](https://www.rfc-editor.org/rfc/rfc9530.html)；§1、§2、§3及§6目录/摘要；IETF HTML定义、Content-Digest/Repr-Digest用途及安全考量目录实读 | HTTP Digest语义不是OPC UA规范要求，也不是数字签名、授权或D16应用闭包验签 |
| B114-S06 | Keith Stouffer等（NIST）；NIST SP 800-82 Rev.3；2023-09-28 | [来源](https://csrc.nist.gov/pubs/sp/800/82/r3/final)；官方出版元数据、摘要（仅摘要）；NIST合法公开出版页摘要实读，未读取PDF正文 | 不引用未读章节，不把通用OT安全建议冒充DNC/OEM适用性或现场验收标准 |
| B114-S07 | BaiSongt/procet-devplans原V0.8 CAP-10-04规划作者；Git Blob b3d607735ba7fe42065353ff5d1d5ca475f30f61；原规格未注明单篇正式发布日期 | [来源](https://github.com/BaiSongt/procet-devplans/blob/5782dc8c464aa5b3cb83cf052f4ee33872cab405/docs/capabilities/CAP-10-04/README.md)；十项实施任务、R01-R10、D16/D17、D04/D10、GUI及迁移；GitHub连接器固定exact HEAD全文读取 | 内生设计且L3未批准，不能作为官方OPC协议规定或产品运行证明 |
| B114-S08 | BaiSongt/procet-devplans原V0.8 CAP-10-03规划作者；Git Blob a6c7db45416b0cde8d71896a89c3565c54dfe373；原规格未注明单篇正式发布日期 | [来源](https://github.com/BaiSongt/procet-devplans/blob/5782dc8c464aa5b3cb83cf052f4ee33872cab405/docs/capabilities/CAP-10-03/README.md)；离线接收方、完整文件闭包、独立回读、撤销时间与D17事实；GitHub连接器固定exact HEAD原业务全文读取 | 独立接收与签发门禁是Procet内生设计，不是RFC9530或OPC强制流程 |

8条登记中OPC Part20同一版次的不同章节会重复计入登记，**不是8篇不同论文**。ISO付费正文、OEM非公开手册及真实控制器接口均未读取，不能臆造标准条款或设备选件。NIST仅官方摘要；RFC9530的HTTP Digest机制属于不同协议，不声称OPC UA强制采用它。业务ACL/CAS/取消和GUI是Procet原有内生要求，绝非OPC或NIST替我们认证。

## 3. 八项可追溯实施规则（原T01–T10不删）

| 规则 | 工程界限 | 关键字段 | 原编号包 |
|---|---|---|---|
| B114-R01 | 目标Profile与可选临时文件端口显式确认；无自动激活 | `profilePinned` / `methodDiscovered` / `tempTypeSupported` / `autoActivation` | E3-06、T5-03 |
| B114-R02 | 不可浏览临时NodeId/FileHandle局限同Session及代次；旧回执失效 | `activeSession` / `handleSession` / `currentEpoch` / `handleEpoch` / `handleValid` / `lateAck` | E3-06、T5-03 |
| B114-R03 | CloseAndCommit异步应用需到Idle并核对同一事务；不等于NC批准 | `completionToken` / `observedState` / `serverApplied` / `transactionExact` | E3-06、T5-03 |
| B114-R04 | MoveOrCopy后NewNodeId重定位与Stage保护；不声称通用原子重命名 | `pathScoped` / `activeOverwrite` / `newNodeIdResolved` / `claimsAtomic` | E3-06、T5-03 |
| B114-R05 | HTTP传输Digest不替代应用原字节独立回读 | `receiverReadback` / `sourceHash` / `receiverHash` / `applicationShaVerified` | E3-06、T5-03 |
| B114-R06 | 全部子程序闭包和签发Manifest比对，Stage不触发激活 | `allFilesPresent` / `closureHashMatches` / `manifestSignedExact` / `activated` | E3-06、T5-03 |
| B114-R07 | Owner exact D16/D10 Frame及权限CAS/取消Fence提交瞬间重验 | `d16Exact` / `d10Exact` / `frameExact` / `aclCurrent` / `scopeEpochMatches` / `casMatches` / `cancelled` | E3-06、T5-03 |
| B114-R08 | D17真实独立收方与统一入口；单Babylon/左Panel且禁止自动CycleStart | `samePort` / `singleBabylon` / `leftPanel` / `receiverIndependent` / `autoSelect` / `cycleStart` / `claimD15` | E3-06、T5-03 |

[分级来源](../../../research/sources/CAP-10-04-temp-apply-b114.json) → [8规则/字段/CAP/原包/独立ID](../../../research/traces/CAP-10-04-temp-apply-b114-v08.json) → [9正25负合成案例](temp-apply-b114-fixtures-v08.json) → [Node只读校验入口](../../../tools/check_cap1004_temp_apply_b114_v08.cjs) → [分级记录](../../../tracking/cap1004-temp-apply-b114-verification-2026-11-02.json)。每条规则至少一正三负，输入单字段故障注入；测试的Oracle仍与规则函数同源，**绝不叫真实独立消费者PASS**。

## 4. 领域事实、ACL/CAS与GUI/3D

- **D16**为已受人类批准的不可变最终NC/子程序、D10实装、D13解释/D14轴时序/D15独立证据的闭包；**D17**只能追加 *传输发起、服务端Stage、异步Apply、设备实际回读、收方核验及签收* 各自事实，`STAGED`、`SERVER_APPLIED`、`RECEIVER_VERIFIED`不互相替代，更不等于`CYCLE_START_AUTHORIZED`。只读D03机床Profile及控制器能力；未发现接口不能试写。
- `TransferIntent`（**拟议Port DTO非既有API**）含 `requestId, principal, scopeEpoch, cancelEpoch, expectedD16Revision, d16RawFileHash, d10BindingRevision/Hash/Frame, profileExact, sessionId, sessionEpoch, temporaryFileNodeId, fileHandle, completionStateMachineId?, transferActionDigest`；结果含 `serverState, receiverReadbackHash?, receiverClosureHash?, ownerReceiptExact?, unknownReasons[]`。业务Owner写D17前重验ACL、ScopeEpoch、D16/D10 exact、Frame、CAS、task generation/取消Fence；晚ACK不复活提交。已经完成的真实Owner写入只追加对账，不宣称回滚。
- **GUI、CLI、Agent** 只调用同一个`10.DncTransferPort`候选/受控动作，允许只读观察，不为Agent另建直接机床写通道。ActivityRail的发布区、统一左TaskPanel展示 `CapabilityUnknown / STAGED / APPLYING / SERVER_APPLIED / RECEIVER_UNVERIFIED / RECEIVER_VERIFIED`，单Babylon Engine/Scene/Canvas只作3D选点和状态投影，不能创建第二对等3D世界；最大字号12px、浅/深主题，3D拾取不提交。未知项要显示证据及恢复动作。
- **D04名义工艺Setup != D10真实机床执行绑定**。A/B共享相同输入事实但不能覆盖已冻结D08。D09中立CL→D12 NC后处理→D13按最终NC及OEM Profile执行语义→D14 Joint时序→D15独立程序验证→D16受控人工签发。D11/CL动画不能伪称NC工程PASS，未知控制器语义`UNKNOWN`并阻断D16；不做材料扫掠仿真。

## 5. 真实独立消费者验收入口与迁移回退

应由**不同于发送器的受控实验室接收端进程**、获组织授权的非生产控制器或厂商模拟器执行：①实际设备Profile和可写端口只读发现；②固定D16/D10精确版本与原NC/完整子程序原字节hash；③测试 `CloseAndCommit`同步、异步 `ApplyWrite`→`Idle`、`Error`、Session重连后旧句柄、客户端超时和取消晚ACK；④`MoveOrCopy`返回新NodeId后重新读定位；⑤独立收方重新读取实际Stage文件，检查逐字节、清单及签名闭包，并故意改一字节、丢子程序、乱序和权限撤销；⑥确定未执行程序选择、激活或CycleStart；⑦将真实退出码/时间/固件/证据写入受控D17，审查人签署。没有合法接口与审批时这些步骤标`NOT_RUN`，不可在生产机床擅自尝试。

迁移使用旧DNC/离线介质读取器影子并行、双读差异核查、单Owner Writer切换；任何不支持、断电、撤权或回执冲突回退为**只读加CAP-10-03离线交付**，保留D16不可变原件、D17真实历史以及A/B冻结，不能静默改写已签发NC。独立消费者正式通过后仍需Owner会签和L3审查。

## 6. 验证等级

本轮只可声称34项**同一判定函数**机器合成数据符合所写规则、来源与字段索引可静态解析；独立Node整文件进程、OPC UA实际Server、OEM控制器、NC/D15、17资产正式Owner/实际独立消费者、全仓GFM AST/锚点及历史附件原始字节均`NOT_RUN/PENDING_HUMAN`。 **规划PASS≠产品PASS。**
