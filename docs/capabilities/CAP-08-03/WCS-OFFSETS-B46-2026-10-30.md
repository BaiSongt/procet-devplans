# B46｜CAP-08-03 工件WCS、机器G53与G52/G92跨重启偏置专项补证（2026-10-30）

> **证据等级**：仅规划合成；L1/L2不修改，L3=PENDING_HUMAN。方言证据严格限LinuxCNC 2.9。D04 Setup位置与D10实机执行绑定**分离**；本研究不能声称控制器、OEM/B5、D15或生产NC已通过。

## 1. 本轮读取的合法来源、章节和限制

1. **LinuxCNC Documentation Project**，《Coordinate Systems》，LinuxCNC 2.9，[公开正文](https://linuxcnc.org/docs/2.9/html/gcode/coordinates.html)，2026-10-30实读§2–3、§3.2、§4.1、§5.3–5.4；G53仅本块，G54–G59.3是模态，G52和G92共享寄存器；G52省略轴不清零，G92偏置可按INI配置跨重启。源码/控制器未执行。
2. **LinuxCNC Documentation Project**，《G-Codes》，LinuxCNC 2.9，[官方正文](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)，2026-10-30实读§14、§17、§33、§57–58。G10 L2直接设置P对应WCS，L20依据当前位置求偏置；两者均不自动切换活动坐标系。G91不影响L2；G92.1清除，G92.2暂停并保留，G92.3恢复。只对给定方言成立。
3. **Kramer / Proctor / Messina**，NISTIR 6556，2000-08-01，[官方出版元数据与摘要](https://www.nist.gov/publications/nist-rs274ngc-interpreter-version-3)，仅核阅摘要；其“解释NC→Canonical functions”是架构背景，不承担具体G52/G92规则。
4. **Fielding / Nottingham / Reschke**，RFC 9110（2022-06），[官方公开文本](https://www.rfc-editor.org/rfc/rfc9110.html)，本轮仅核阅版本元数据；HTTP条件请求是并发类比，不能作为制造Owner/CAS安全认证。
5. **Procet规划自身**，[原CAP-08-03规格固定Git Blob](README.md)，本轮经GitHub读取，Blob `4f84d02d42f5618abc52af33bb0aed5b8207edf4`。统一Owner Port、A/B冻结、ACL和图形约束是**内生设计**，不是LinuxCNC规定。完整元数据：[5项登记](../../../research/sources/CAP-08-03-wcs-offsets-b46.json)。

## 2. 四个可反证的核心场景

- **G53与G55的持续性反例**：先处于G55，执行`G53 G0 X0`只把本块X当机器坐标；下一块不写G53仍使用G55，不得因动画出现一次机器位置就切换D04工件坐标。
- **G10 L2与L20不能混淆**：`G10 L2 P2 X3.5`设G55 X偏置3.5，不表示机床当前位置X3.5；`G10 L20 P2 X1.5`是在当前已知姿态下求使坐标显示1.5的偏置。仅在纯一维、无旋转、无G52/G92、无刀补的数学见证中，机器X=8得到偏置X=6.5；这**不是实际机器坐标变换通用公式**。
- **G52和G92状态共享陷阱**：设置G52 X1不应重置未写的Y偏置；跨重启持久性需要INI配置可核验。配置缺失返回`UNKNOWN`，不假设通用控制器自动清空；G92.1、G92.2、G92.3的存储/生效差异需分别记录。
- **状态可信度与计算结果分开**：D13必须以最终NC原始字节、逐块字节Span、模态前后态、WCS索引、G92寄存器状态及D10 Frame为输入；Profile未知时输出`UNKNOWN`，绝不把D11中立CL预览或D13计算当D14轴轨迹或D15独立安全验证。

## 3. 来源→规则→字段→CAP/原包→独立正反UNKNOWN验收

| 规则 | 含义 | 来源 | 字段 | 原编号包 | 机器可检 |
|---|---|---|---|---|---|
| B46-R1 | D12最终NC、D10实际绑定、Frame和Profile身份一致 | B46-S05 | `identity.d12Hash`、`identity.d12Revision`、`identity.d04Revision`、`identity.d10Revision`、`identity.frameFrom`、`identity.frameTo`、`identity.controllerProfileHash`、`src.ncHash`、`src.controllerProfileHash` | E3-02、E3-03、U4-04 | 8正/8负/1未知 |
| B46-R2 | G53机器坐标本块有效、G54–G59.3保持模态 | B46-S01、B46-S02 | `event.op`、`event.beforeWcs`、`event.afterWcs`、`event.nextBlockWcs`、`event.g53ThisBlock`、`event.motionFrame`、`event.motion`、`event.cutterComp` | E3-03、E3-04 | 8正/6负/1未知 |
| B46-R3 | G10 L2/L20 P索引、活动WCS不变、G91无关及有限1D算例 | B46-S02 | `event.p`、`event.targetWcs`、`event.requestX`、`event.offsetX`、`event.machineX`、`event.desiredX`、`event.g91Ignored`、`event.oldY`、`event.newY` | E3-02、E3-03 | 8正/8负/0未知 |
| B46-R4 | G52/G92共享寄存器、未指定轴保留与INI持久性 | B46-S01 | `event.sharedRegisters`、`event.oldX`、`event.newX`、`event.requestLocalX`、`event.oldY`、`event.newY`、`event.g92Persistence`、`event.resetWouldRetain` | E3-03、U4-04 | 8正/4负/1未知 |
| B46-R5 | G92.1清零与G92.2暂停、G92.3恢复语义不合并 | B46-S02、B46-S01 | `event.storedBefore`、`event.storedAfter`、`event.activeBefore`、`event.activeAfter`、`event.effectiveAfter` | E3-03 | 8正/8负/0未知 |
| B46-R6 | 逐块模态、NC字节和帧快照必须明确 | B46-S03、B46-S05 | `src.reparsed`、`src.modalSnapshot`、`src.byteStart`、`src.byteEnd`、`src.frameHash`、`event.motionFrame` | E3-03、U4-04 | 8正/5负/0未知 |
| B46-R7 | 单Owner CAS/ACL/ScopeEpoch/取消代次/晚回执重验 | B46-S04、B46-S05 | `owner.expectedRevision`、`owner.actualRevision`、`owner.expectedHash`、`owner.actualHash`、`owner.aclEpoch`、`owner.aclActual`、`owner.scopeEpoch`、`owner.scopeActual`、`owner.cancelGen`、`owner.ackGen`、`owner.cancelled`、`owner.lateAck`、`owner.cas` | E3-03、U4-04 | 8正/8负/0未知 |
| B46-R8 | GUI/CLI/Agent单域入口、Babylon、D15、冻结/旧Reader回退 | B46-S05 | `ui.channels`、`ui.ownerPort`、`ui.babylonWorlds`、`ui.leftPanel`、`ui.fontMaxPx`、`ui.previewWrites`、`handoff.freezeBefore`、`handoff.freezeAfter`、`handoff.readerRollback`、`gate.d14`、`gate.d15`、`gate.d16` | E3-03、E3-05、U4-04 | 8正/9负/0未知 |

[追踪](../../../research/traces/CAP-08-03-wcs-offsets-b46-v08.json) → [8正、56单字段反、3 UNKNOWN；合计67项V8同函数合成](wcs-offsets-b46-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0803_wcs_offsets_b46_v08.cjs) → [证据等级记录](../../../tracking/cap0803-wcs-offsets-b46-verification-2026-10-30.json)。各负例仅修改一个字段，保留base正例身份。测试数据中的64位SHA是虚构样本，不是产品源码或真实控制器配置哈希。

## 4. 数据责任、GUI/CLI/Agent及迁移回退

- **单一事实链**：D04名义Setup、D10精确机床配置及工装/执行Frame分离；D09中立CL → D12原NC字节（加子程序可追溯SHA）→ D13独立解释WCS/G53/G52/G92及补偿 → D14真实轴运动时序 → D15独立工程验证 → D16人工受控签发。未识别宏、RTCP或厂商偏置语义返回UNKNOWN。不做材料去除扫掠仿真。
- **Owner Port**：`08.NcSemanticOwner`为GUI/CLI/Agent同一领域入口；提交同时锁定`D12.revision/hash`、`D10.revision/profileHash/frameFrom/frameTo`、`D04.revision`、`D13.expectedRevision/hash`，重验CAS、ACL、ScopeEpoch、cancelGen/ackGen，取消后晚回执不得生效；输入变化依赖结果标STALE而非原位覆盖已冻结D08。
- **交互边界**：单Babylon Engine/Scene/Canvas，左侧唯一`UnifiedTaskPanel`，浅/深主题、字体上限12px；G53当前块与G54/G55模态用来源标记显示，3D选择/预览不写制造事实。业务责任不放进渲染层。
- **迁移和回退**：原Reader只读可用，新增WCS snapshot schema先影子读/写对照，再切换；若某工程缺失控制器Profile、旧G92寄存器或者偏置表，只允许`LEGACY_UNRESOLVED/UNKNOWN`，旧Revision保持可读，回退不删用户数据。A/B同事实接管不覆盖D08冻结。
- **独立消费者验收**：E3-03独立解析真实NC逐块WCS、E3-04运行D14解析姿态、E3-05独立D15覆盖与故意异常（G53后下块、重启G52未知、G10部分轴、G92.2/.3）、U4-04浏览器UI检查；所有真实消费者与Owner签署仍NOT_RUN/0，L3待审。

## 5. 本轮判定及风险

同判定函数V8合成67/67 PASS（8正、56单字段反、3 UNKNOWN；合计67项V8同函数合成）。独立Node文件进程、真实LinuxCNC/Python解释器、B5/OEM、真实D13–D16与17项消费者均**NOT_RUN**，不能把合成规则覆盖写成产品验收。重点残余风险：目标OEM方言及INI持久配置未锁定、真实坐标旋转/刀补耦合未验证、跨重启旧项目持久偏置不可推定。**规划PASS≠产品PASS。**
