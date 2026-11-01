# CAP-02-03 B86｜车床刀塔工位、刀具总成与控制器偏置索引的独立身份（2026-11-01）

**范围**：原CAP-02-03及F1-02、F1-06、E3-04、B0-03、E3-03、U4-02、U4-03；11域88 CAP/36包/17资产不改、L1/L2不改，L3待人类审批。本文只描述规划候选，不宣称产品实现。

## 官方证据和结论

Haas Lathe Operator's Manual §11.3 的 `Tnnoo` 将前两位作为所选刀塔工位、后两位作为工具几何/磨损偏置号。在该控制器语义中，**合成示意 `T0102` = 1号物理工位 + 2号偏置索引**，不是“2号刀具总成”，`T0100`的偏置禁用需显式声明。Haas §8.3 将 Active Tool、Tool Offset (T)、Turret Location、X/Z Geometry、X/Z Wear、刀尖半径和Tip Direction列为不同信息，特别指出同一刀塔工位可能在正反面有多把刀具。LinuxCNC 2.9 Lathe User §1–4及Tool Compensation公开章节采用工具表T/P/I/J/Q及`Tn M6 G43`，不能直接按Haas四位T字解析。

[Haas §11.3](https://haascnc.com/service/online-operator-s-manuals/lathe-operator-s-manual/lathe---programming.html) · [Haas §8.3](https://haascnc.com/service/online-operator-s-manuals/lathe-operator-s-manual/lathe---part-setup.html) · [LinuxCNC 2.9 Lathe](https://linuxcnc.org/docs/2.9/html/lathe/lathe-user.html) · [LinuxCNC Tool Compensation](https://linuxcnc.org/docs/2.9/html/gcode/tool-compensation.html)。

ISO 13399-1:2006仅读取[合法目录/摘要](https://www.iso.org/standard/36757.html)与2006-02版次（2021确认），**未读付费正文，不能编造车床T字字段条款**。RFC 9110 §13只供CAS前置条件类比；W3C PROV-O §3只供数据来源模型；NIST IR8536 Final 2026-09-09仅读官方出版元数据/摘要而非完整正文。完整作者/版本/时间/URL/访问深度和局限见[9项来源](../../../research/sources/CAP-02-03-lathe-turret-b86.json)。

## 业务Owner、数据契约和GUI/3D边界

D03由02域管理**名义刀塔配置、物理工位、刀具总成Revision/Hash和安装Frame**；D04是工艺Setup，绝不替代现场实际偏置。D10由执行绑定Owner签发具体机床、实际刀塔位置、刀具安装侧、Tool Offset Table精确Hash、测量与磨损快照；D12是最终NC字节；08域D13才可以按控制器Profile解释`T0102`，09域D14/15独立展开机床物理轴时序与验证，10域D16负责发布。D09中立CL动画、D11运动预检均不能冒充D15工程验证。未知方言和控制器专有T字行为为`UNKNOWN`，不做材料扫掠仿真。

**建议的非正式Schema**：
- `D03.TurretMount{machineExactRef,stationNumber,stationFrameRevision,face,assemblyExactRef,assemblyContentHash,capacityProfileRef}`；
- `D10.LatheExecutionToolBinding{d04SetupExactRef,machineExactRef,controllerDialectRevision,station,actualFaceEvidence,offsetIndex,offsetTableHash,geometrySnapshotRef,wearSnapshotRef,tipDirectionPolicyRef,frameHash,sourceTimestamp}`；
- `D13.InterpretedToolCall{finalNcByteHash,callInstanceId,tWord,parserVersion,station,offsetIndex,offsetMode,knownness,sourceRange}`。

真实机床工位数和几何偏置范围必须由机床Owner核对；**合成样例容量8、SHA及编号均不是默认资源真实配置**。GUI/CLI/Agent共用02域`ToolAssemblyPort`，制造资源与工程空间共用**单Babylon Engine/Scene/Canvas**横向切换，所有任务集中统一左TaskPanel，字体不超过12px；拖动/拾取只是候选，Renderer无业务写权限。

## 8条规则、独立正反验收与工程门禁

| 规则 | 决议 | 主要反例 |
|---|---|---|
| LT86-R01 | 物理Station、Assembly、机器Exact身份分列 | station=0 / 缺Hash / 缺revision |
| LT86-R02 | ControllerProfile与解析器必须吻合 | 未知/未锁Profile、以LinuxCNC解释Haas |
| LT86-R03 | T0102两部分分开；T0100偏置停用显式 | T0100未确认、工位变化、T字不完整 |
| LT86-R04 | Offset Index≠Station，表Revision/Hash准确 | 自称必同号、错Index、表Hash过期 |
| LT86-R05 | Geometry/Wear独立测量、独立Hash | 测量未知、Geometry/Wear失效 |
| LT86-R06 | tip方向映射方言化，禁止Mesh推导 | 把LinuxCNC Q直接当Haas方向 |
| LT86-R07 | 当前工位、正/反装刀和总成实装确证 | 工位变更、安装面不符、总成更换 |
| LT86-R08 | 统一入口、CAS/ACL/取消，不能合成晋级 | 撤权、取消、D16虚假发布 |

[来源](../../../research/sources/CAP-02-03-lathe-turret-b86.json) → [字段规则/原工作包/资产](../../../research/traces/CAP-02-03-lathe-turret-b86-v08.json) → [8正24负显式预期](lathe-turret-b86-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0203_lathe_turret_b86_v08.cjs)。合成对拍与checker使用同一个判定逻辑，**32/32仅是同函数规划自测**；真实独立Node文件、LinuxCNC/Haas/OEM D10偏置表、D13→D15及实机均未运行。

## 并发、失效、回退和独立消费

提交时重新读取D03/D10 exact revision+hash+frame、权限、CAS、scopeEpoch、任务代次及取消状态；迟到ACK只作历史事件，不能写新业务事实。更改Station、Assembly、Tool Offset Table、Geometry/Wear或ControllerProfile必须对依赖旧闭包的D12–D16分别标记STALE，保留D08冻结与A/B共享事实；旧Reader+旧偏置快照不可删除，未经签署的迁移只能只读回退。

验收分层：02域资源Owner核查真实刀塔和刀具组成；04域D10独立消费者读实际对刀及偏置表；08域D13独立解释最终NC并给出调用来源；09域D15用真实D14轴序列测限位与碰撞；10域D16复核签署。**17正式Owner签署0/17，真实独立消费者0/17，L3待人评审。规划PASS≠产品PASS。**
