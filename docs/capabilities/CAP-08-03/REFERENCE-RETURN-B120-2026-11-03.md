# B120｜G28/G30参考点返回与G53非模态机器坐标：D13双段语义边界

> 2026-11-03｜CAP-08-03增量研究，原E3-02/E3-03/E3-04/E3-05/U4-04；只改规划仓。L1/L2、88CAP、36包、17资产编号不变，L3待人工审。

## 1. 问题与严格边界

同一NC中 `G90 G28 Z0`、`G91 G28 Z0`、`G53 G0 Z0` 可导致不同的中间点、模态留存和控制器行为。不能把G28/G30简化为“单段直达机床原点”，更不能从端点无碰推断两段快速运动全程安全。本专题不声称真实Haas、LinuxCNC或B5轴运动合格。

原CAP-08-03已规定WCS、G53、G90/G91与D04/D10分离；B46覆盖G53与寄存器偏置，B118覆盖G00快速非直线。本轮**新增**G28/G30预存参考点、G90/G91中间段、G53单块效力、Haas Setting108及后续模态污染的端到端机器契约，不重复改写原十任务。

## 2. 2026-11-03实际来源与适用深度

| 来源 | 定点范围与阅读层级 | 能支撑的结论 / 严格局限 |
|---|---|---|
| B120-S01 LinuxCNC 2.9 在线官方G-Codes | §20 G28/G28.1、§21 G30/G30.1，网页章节已读 | 先经中间点再到预存机床坐标；G28.1/G30.1存储参考位置。网页先称5161–5169后又称5161–5166，具体轴/寄存器表要与版本和INI交叉核；绝不猜目标硬件。 |
| B120-S02 LinuxCNC 2.9同页 | §33 G53、§54 G90/G91，章节已读；与S01同文档不计独立出版物 | G53为单块机器坐标、需当前G0/G1、刀径补偿开启报错；控制器特例不外推。 |
| B120-S03 Haas Mill G28 官方页 | 仅官方网页搜索摘录（直接打开失败） | `G28 G90 Z0`与`G28 G91 Z0`的中间段语义、G29保存中间点；未读完整页与固件。 |
| B120-S04 Haas Mill G53 官方页 | 仅官方网页搜索摘录（直接打开失败） | 本块机器坐标并忽略工作/刀具偏置；不能外推LinuxCNC刀补实现。 |
| B120-S05 Haas Setting108 | 官方搜索摘录 | Quick Rotary G28影响旋转轴回零，示例不能当B5的角度范围或实际轨迹。 |
| B120-S06 ISO 6983-1:2009 Edition2，2025复审确认 | ISO官方目录与摘要 | 仅程序数据格式标准范围，付费正文未读；不声称G28/G53的ISO统一控制器实现。 |
| B120-S07/S08 本规划仓确切Git Blob | CAP-08-03规格和E3-03原工作包已读取 | Owner、A/B冻结、CAS/ACL、GUI/3D是Procet内生要求，不是外部G码标准。 |

完整作者、版本、发布日期（未知则null）、访问日期、原始URL、所读章节及局限逐条见[来源登记](../../../research/sources/CAP-08-03-reference-return-b120.json)。

## 3. 两段命令的反例与解析模型

受控数学演示仅用**合成一维Z平移**：设机床Z起点M145mm、工件零点相对机床偏移+100mm、预存G28参考M0mm，不含刀长、刀径、回转轴、伺服加减速或机床干涉。绝不可直接执行这些示例NC。

| 片段 / 合成初态 | 经过的机器Z（mm） | 证明的漏洞 |
|---|---|---|
| G90 G28 Z0 | M100 → M0 | 中间点是工件Z0，不是机床Z0；可能扫过工件 |
| G91 G28 Z0 | M145 → M0 | 中间段零距离，但G91仍可能影响后续块 |
| G53 G0 Z0；随后G0 Z10（G90） | M0 → M110 | G53仅当块；下一块恢复工件坐标 |
| G91 G28 Z0；随后G0 Z10（没写G90） | M145 → M0 → M10 | 把后续Z10误当绝对工件目标会发生严重偏差 |
| G90 G30 Z0，预存参考M20 | M100 → M20 | G30不能简单当G28或固定机器零点 |

以上只证明坐标代数与潜在风险；真实快速运动轨迹须由已签控制器Profile、参数、D03轴树及D10安装绑定交给D14独立展开，D15验证覆盖不足只能UNKNOWN。8个固定Goldens见[机器样例](reference-return-b120-fixtures-v08.json)，并非实际CNC仿真。

## 4. 新增八条可检查规则

| 规则 | 关键契约 | 原工作包与业务消费 |
|---|---|---|
| B120-R01 | G28/G30不混用方言缺省值；`controllerProfileRevisionHashPinned` / `controllerFirmwareOptionPinned` / `referenceCommandSupportDeclared` / `noVendorFallbackGuess` | E3-02、E3-03；D03、D10、D13 |
| B120-R02 | G90/G91中间点和后续模态分别留痕；`distanceModeBeforeAfterPinned` / `g90G91IntermediateResolved` / `wcsTransformOnceAndFrameExact` / `nextAbsoluteBlockHasG90OrExplicitIntent` | E3-03、U4-04；D04、D10、D13 |
| B120-R03 | G28/G30必须保留双段快速运动；`intermediateLegRecorded` / `intermediateInActiveWorkFrame` / `finalReferenceMachineFrameResolved` / `bothLegsEvidenceRetained` | E3-03、E3-04；D10、D13、D14 |
| B120-R04 | LinuxCNC预存机床参考点不可默认推定安全；`linuxcncStoredParameterRevisionPinned` / `homedRepeatabilityEvidenceKnown` / `g28AndG30StoresSeparated` / `defaultOriginIsNotSafetyProof` | E3-03、E3-04；D03、D10、D13 |
| B120-R05 | Haas G28/G29和旋转Setting108须有独立Profile；`haasIntermediateG29ProfilePinned` / `setting108ExactWhenApplicable` / `rotaryJointAndWrapEvidenceKnown` / `noSimultaneousLinearPathAssumption` | E3-03、E3-04；D03、D10、D13、D14 |
| B120-R06 | G53仅当前块有效且前置条件按控制器判定；`g53OnlyCurrentBlock` / `g53MachineFrameNotWcs` / `activeG0G1AndCompPreconditionsKnown` / `toolOffsetHandlingProfilePinned` | E3-02、E3-03；D04、D10、D13 |
| B120-R07 | NC字节双段事件到物理轴时序分层核验；`d12ByteSpanAndD13ModalEventsExact` / `d14UsesD10D03JointReferenceHashes` / `unmodeledRapidLegRemainsUnknown` / `d15D16IndependentNeverFromCl` | E3-03、E3-04、E3-05；D12、D13、D14、D15、D16 |
| B120-R08 | 统一入口与提交权限CAS取消及回退；`guiCliAgentOneD13Port` / `singleBabylonLeftUnifiedTaskPanel` / `aclCasScopeCancelFenceAtCommit` / `versionedReaderRollbackProtectsD08D16` | E3-03、U4-04；D08、D12、D13、D16 |

全部通过[JSON规则追踪](../../../research/traces/CAP-08-03-reference-return-b120-v08.json)建立“来源ID→规则ID→四个字段→CAP与原编号包→独立正例/四项单字段反例”；[只读Node入口](../../../tools/check_cap0803_reference_return_b120_v08.cjs)仅检查规划契约和8个合成Golden，40/40规则案例属于同判定函数预检，不能代替独立D13/D14/D15消费者。

## 5. D04/D10、NC执行语义与UI/CLI/Agent

**D04**持有工艺Setup与设计WCS，**D10**由04域Owner保存实际机床、控制器固件/选件、已参考回零状态、预存G28/G30位置、机床位置坐标Frame、刀具偏置和相关精确revision/hash；D03由02域Owner持有机床轴树和旋转轴资源。不得从D04名义值自动覆盖D10实测值。D12完整NC原字节/编码/文件依赖由08域持写；D13同域NC解释端口独立重读最终D12并输出每段 `NcExecutionEvent{sourceByteSpan,callInstance,modalBefore,modalAfter,referenceRegisterSnapshotHash,intermediateFrame,finalMachineFrame,knownness,controllerProfileHash}`，保留G28两段与是否激活G91；D14消费D13和D10/D03的精确版本产生joint时序；独立D15检查各段覆盖和真实机床证据，D16发布重新核验全部证据及权限。

GUI从NC ActivityRail进入**唯一左UnifiedTaskPanel**展示NC源码、双段事件、预存参考点版本、D14时间轴、UNKNOWN及证据缺口；**单Babylon Engine/Scene/Canvas**仅显示已获证据的轨迹或明确水印的合成预览，最大字号12px、浅/深主题。CLI与Agent只能通过与GUI同一个08域 `NcExecutionPort.interpret`，不增加第二领域写路径；前述命令与DTO是设计契约，非已实现产品。

## 6. 失效、回退和独立正反验收

- D12 NC字节、G90/G91初态/模态、D03轴树、D04 WCS、D10控制器Profile/回零与存储参数、G53偏置行为、Setting108或Schema版本任一变更，均需按精确依赖链标记D13→D14→D15→D16 **STALE**；历史D08冻结和既有D16签发记录只读保留，不回写、不复用资格。
- 读旧快照若无预存参考坐标、Profile精确Hash或G91前后态，标`LEGACY_REFERENCE_UNKNOWN`，版本化Reader/shadow试跑，失败只读退回；任何UNKNOWN/REJECT/STALE不生成工程PASS。
- 处理异步提交时，在08域Owner实际提交点重新验证Actor ACL代际、expected revision+hash、Frame/Scope、取消Fence与事件代次；取消晚回执或权限撤销不得写D13。A/B同一来源事实不覆盖冻结。
- **独立消费者分层**：08域D13解释器对真实厂商NC片段和OEM参数做正反校验；04域D10所有者核对实际回零/偏置/Frame；09域D14独立按真实轴树展开两段与旋转；D15独立对每段工程风险校核；10域D16复核授权和exact发布资格。工厂实际程序与真实机床测试全部`NOT_RUN`。不做材料扫掠仿真。

## 7. 验证等级、风险与交接

规划同一逻辑40例+一维数学8 Golden仅用于数据/公式一致性；本轮不声称独立Node文件进程、Haas/LinuxCNC解释器差异、B5旋转参数、实体干涉、Owner签署或17消费者产品验收。ISO收费正文未读；Haas三页仅官方搜索摘录。下一步优先真实全仓GFM AST、历史原始附件及17业务资产Owner交叉会签。**规划PASS≠产品PASS。**

