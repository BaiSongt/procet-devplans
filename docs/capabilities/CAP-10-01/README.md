# CAP-10-01｜程序发布包（L3待审）

**原目标**：| CAP-10-01 | 程序发布包 | NC、刀具清单、装夹说明与指纹 | E3-06 / T5-03 | 基础边界与有限场景接入；完整能力需独立验证 |

本条是原88项中的第71项实施级详编，不改变11域、L1/L2、36原编号工作包、17资产或L3待审事实。10域D16只形成**不可变的发布候选包**，与CAP-10-02人类授权签发及CAP-10-03离线介质接收分开；规划包、合成示例、历史软件测试都不能直接取得上机资格。

## 十项实施任务（关联原E3-06、T5-03）
T01. **NC文件闭包**：锁定D12主程序、子程序、二进制原字节SHA、格式Profile及依赖清单；缺失文件时标UNKNOWN。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T02. **工具清单**：D13逐调用实例提取T/H等语义，在D10实装和D03刀具档案中交叉核对，不能由NC行号推断真实刀具。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T03. **装夹说明**：为多个D04 Setup分别记录名义Frame、工件基准与D10实际夹具/机床/坐标偏置，保持物理与名义分离。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T04. **独立验证引用**：D12实际NC SHA和D10绑定必须被D15独立Oracle原样覆盖；CL_ONLY与未覆盖未知不得变为安全PASS。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T05. **冻结与版本图**：绑定D08冻结与D12生成修订，A/B保持同一工程事实且旧发布候选不能被新草稿覆盖。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T06. **Manifest与校验和**：定义文件指纹域、JCS规范化域、签名域与不可循环自哈希布局，禁止示例伪造有效Hash。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T07. **离线交付边界**：设计便携目录、防遍历/软链接、大小写冲突、接收端重哈希和离线签收；现场无网不可用在线服务冒充。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T08. **同域交互**：10域ReleasePackagePort服务GUI/CLI/Agent；Babylon显示只读3D装夹示意，统一左TaskPanel最大字号12px。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T09. **权限与并发**：候选封装与审批分层，冻结版本CAS+ACL+scopeEpoch+cancelToken提交前重验，撤权晚ACK拒写。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。
T10. **独立消费者与回滚**：10-02审批及10-03离线接收分别运行正反例，旧包只退役/撤销不删除，Reader双读可回退。验收必须有正例、缺失或错配负例、独立消费者入口，真实执行状态NOT_RUN。

## 来源→规则→逐字段→工作包→验收
- **CAP-10-01-R01 原始NC字节闭包**：D16包必须逐字节固定D12主程序和外部子程序；编码及换行不可静默转换。 字段：`contents.ncRawShaPinned`、`contents.encodingAndLineEndingsPinned`、`contents.subprogramClosureComplete`、`contents.noSilentRewrite`；来源C1001-S01 / C1001-S02 / C1001-S03；资产D12/D13/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R02 刀具清单不得猜测**：刀具列表由D10实际装配、D03目录和D13已解释的最终NC调用闭合；T/H、规长与实测字段须区分。 字段：`tools.machineResourcesExact`、`tools.actualAssemblyPinned`、`tools.ncToolCallsResolved`、`tools.unknownToolBlocksReview`；来源C1001-S02 / C1001-S06 / C1001-S09；资产D03/D10/D13/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R03 名义Setup与实装分离**：每个工序Setup的名义D04和实际D10绑定独立引用，保留Frame变换、单位、轴链版本与多Setup关系。 字段：`setup.nominalSetupFramePinned`、`setup.actualBindingFramePinned`、`setup.machineKinematicsRevisionPinned`、`setup.multiSetupNotCollapsed`；来源C1001-S06 / C1001-S09 / C1001-S01；资产D03/D04/D10/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R04 独立D15验证门禁**：CL_ONLY、D11预检和D14动画不能替代D15；结果必须绑定最终NC字节、D10实际绑定及覆盖与Oracle版本。 字段：`validation.d15OracleIndependent`、`validation.coverageForExactNc`、`validation.actualMachineBindingMatched`、`validation.unknownCannotPass`；来源C1001-S02 / C1001-S09 / C1001-S06；资产D11/D12/D15/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R05 冻结A/B共享事实不覆盖**：发布候选引用D08精确冻结，A/B模式和不同生产者只可并存、衍生新修订，不可回写已冻结工艺或旧D16。 字段：`freeze.d08Immutable`、`freeze.modeSharedSameFact`、`freeze.exactRevisionDependencies`、`freeze.noOverwriteExistingRelease`；来源C1001-S06 / C1001-S05 / C1001-S04；资产D08/D12/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R06 可重复指纹但不混Hash域**：manifest JCS规范化和原始NC、附件逐文件SHA须分别计算；manifest签名材料不能包含自身待算摘要形成循环。 字段：`manifest.jcsSchemaPinned`、`manifest.payloadHashesIndependent`、`manifest.canonicalDigestExplicit`、`manifest.noCircularSelfHash`；来源C1001-S03 / C1001-S04 / C1001-S05；资产D12/D15/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R07 离线包拒绝路径欺骗**：仅接受包内相对路径、去重与大小写折叠冲突检查，拒绝symlink/路径逃逸；接收端离线重算摘要。 字段：`offline.safeRelativePaths`、`offline.noSymlinkTraversal`、`offline.caseFoldCollisionRejected`、`offline.receiverRehashRequired`；来源C1001-S04 / C1001-S05 / C1001-S08；资产D12/D16/D17；原工作包E3-06/T5-03。
- **CAP-10-01-R08 统一业务端口与只读预览**：GUI、CLI、Agent共用10域ReleasePackagePort；唯一Babylon世界/左TaskPanel呈现装夹，不得以3D选中当作签发。 字段：`ui.singleOwnerPort`、`ui.onlyOneBabylonWorld`、`ui.leftTaskPanelUnified`、`ui.previewNotSignoff`；来源C1001-S06 / C1001-S07 / C1001-S08；资产D04/D10/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R09 提交时ACL与CAS重验**：生成候选提交时须重验权限、expectedRevision/hash/Frame、scopeEpoch、取消令牌；晚回执不能落库。 字段：`transaction.aclRecheckedAtCommit`、`transaction.expectedRevisionHashFrameCAS`、`transaction.cancelEpochChecked`、`transaction.lateAckNoMutation`；来源C1001-S07 / C1001-S08 / C1001-S06；资产D08/D10/D16；原工作包E3-06/T5-03。
- **CAP-10-01-R10 候选/签发/回退隔离**：CAP-10-01只生成候选包，CAP-10-02人类授权签发另行设计；上游失效后STALE，历史发布不删除，D17回执不改写包。 字段：`lifecycle.candidateNotSigned`、`lifecycle.staleInvalidated`、`lifecycle.oldReleaseImmutable`、`lifecycle.d17FeedbackSeparate`；来源C1001-S04 / C1001-S05 / C1001-S06；资产D12/D15/D16/D17；原工作包E3-06/T5-03。

## 冻结业务流程
1. 由10域读端口选择D08受控工艺、D04名义Setup、D10实际装夹/机床/刀具、D12**最终NC原始字节**及全部子程序。所有引用必须带exact revision、hash、Frame、scope，不得从浮动develop读取。
2. D13按最终NC解释控制器语义，D14展开实际轴时序，09域独立D15验证覆盖范围；任一未知宏、机床配置缺口、时间/碰撞覆盖不完整，保持BLOCKED_UNKNOWN。D11中立CL预检、D14动画只读，不能作为NC工程PASS；不做材料扫掠仿真。
3. 10域候选构建生成受控目录、工具清单、分Setup装夹说明、D15验证摘要（保留独立Oracle与未知范围），形成逐文件**原始字节SHA**与另行规范化的manifest指纹；绝不可将manifest摘要写入自身再求哈希。
4. 先构造候选，再在提交时重新检验ACL、CAS(expectedRevision/hash/Frame)、scopeEpoch和cancelToken，拒绝取消/撤权后的晚ACK；只允许新增不可变候选记录。禁止覆盖A/B共享的D08冻结或既有已签发D16。
5. GUI/CLI/Agent只调用同一10域ReleasePackagePort；CAP-10-02另行审核签发；CAP-10-03离线接收端必须逐文件重算摘要并核验信任根、签收身份和现场适用性。USB复制成功不等于校验通过。

## 关键负例与非目标
- 相同显示NC文本但换行或编码不同、调用的子程序缺失、T/H错误、D04与D10 Frame不一致、D15引用旧NC、验证Oracle不是独立执行、静态距离当连续安全、D11 CL_ONLY冒充通过：全部拒绝或UNKNOWN。
- 路径`../`、符号链接、大小写文件名冲突、包内重复路径、摘要不一致、审批撤销、并发变更、取消晚ACK、旧包反写冻结、离线现场无可信验签机制：不发上机包。
- 不设计MDC/DNC设备联网、实机加工、材料扫掠、自动人类签名；这些分别属于后续CAP-10-02/03/04/05及产品验收。

## 交互、接口与独立验收
[单Babylon世界与统一左TaskPanel](UI.md) · [10域D16接口合同](package-contract.json) · [显式不可发布的合成Manifest](manifest.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者与迁移回退](independent-consumer-handoff.md)。GUI/CLI/Agent均不具有绕过Owner服务的签发权限，3D选取、预览及Agent意见不作批准。最大字号12px、浅/深色主题；CLI示意`procet release package --candidate --d12-ref ... --d15-ref ...`未实现。

[9份官方合法来源与阅读深度](../../../research/sources/CAP-10-01.json) → [10规则×4字段](../../../research/traces/CAP-10-01.json) → [30固定正反+40全字段独立变异+18门禁案例](fixtures.json) → [专题](../../../research/topics/R-RELEASE-PACK-001.md)。命令`node tools/check_cap1001_planning_2026_10_27.cjs`为后续独立文件校验入口；**本轮仅V8等价内存规划88例**，独立Node、真实NC/OCCT/B5/浏览器/离线消费、D16人类签署全部NOT_RUN/PENDING_HUMAN。**规划PASS≠产品PASS**。
