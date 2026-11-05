# B122｜CAP-08-04 恒线速度（CSS）、主轴限速与车床进给模态补证

> V0.8增量设计，L1/L2不变、L3待审。新增设计规则/Fixtures，不承诺任何控制器固件已实现。2026-11-03。源文件均为NEWLY_AUTHORED，不冒充历史恢复。

## 关键工程结论与数学边界

车削G96的S字为切削线速度而非RPM；对公制**实际直径** D(mm) 与 Vc(m/min)，理想主轴转速 `n=1000×Vc/(π×D)`。示例 `Vc=180m/min` 时，直径80、40、20、10mm的理论RPM依次约716.20、1432.39、2864.79、5729.58。设合成限制2500rpm，转速上限对应直径约22.9183mm。**任何此类数值均是解析数学示例，2500rpm不是可用于实际机床的安全推荐值**。

- Haas Lathe官方G96/G97在线索引定义：G96启用CSS时S取长度/时间；G97后S为RPM；Haas G50 S给定主轴上限，其官方HTML表述包含副主轴说明。Haas G96/G97完整页发生不可访问跳转，仅读取搜索摘录，不伪称全文。
- LinuxCNC 2.9公开§60：G96采用可选`D`上限和`S`表面速度；必须明确G20/G21、旋转中心X0，§7/8的G7/G8直径/半径模式不能成为直接以程序X冒充物理直径的理由。相同编号G50不是LinuxCNC的CSS上限语法。
- 机械主轴额定、卡盘（夹爪与夹紧力）、夹具和不平衡工件约束应作为**Procet内生保守工程验收策略**的各独立额定证据。最终可批准上限不得超过可核实的最小额定值；缺任一关键来源应返回UNKNOWN，不由NC文本自行发放物理安全合格证。
- Haas车床G98/G99分别为每分钟/每转进给；LinuxCNC使用G94/G95；G96与G97不自动决定进给模态。理想每转进给`F(mm/rev)×n(RPM)`只给出瞬间每分钟进给候选，非D14实测时间或D15验证。

## 证据分级（按登记文件中的原始阅读深度）

[9项作者、版本、时间、URL、章节、深度与局限](../../../research/sources/CAP-08-04-css-spindle-b122.json)：LinuxCNC2.9 §60及G7/G8/G94/G95（同一出版物多段）、Haas G96/G97（官方搜索摘录，跳转不能全文访问）、Haas G50（官方HTML）、ISO 6983-1:2009（**仅合法目录摘要**）、Kramer/Proctor/Messina NIST IR 6556（**仅出版元数据/摘要，未读PDF正文**）、W3C PROV-O（公开来源关系）以及 [CAP-08-04原业务规格](README.md)。ISO不据目录推断G96/G50条款；W3C不规定安全阈值。资料不会替代控制器OEM、实测夹具与机床规格校核。

## typed数据字段、Owner和领域端口（拟议）

| typed对象 | 数据/不变量 | 唯一领域Owner及失败行为 |
|---|---|---|
| `CssSpindleIntent` | `D09 neutralClRef`、`D12 finalNcBytesHash`、`SValue`、`speedMode=CSS/RPM`、`unitSystem`、`spindleChannel`、`programBlockOrdinal` | D09由07域只管中立切削意图；D12经08域后置生成候选，D13必须读取**最终NC原字节**而非信任CL屏幕 |
| `ControllerCssProfileExact` | `D03 revision/hash`、`D10 binding revision/hash`、`controllerFamily/machineClass`、`firmware/optionSet/profileHash`、`G50_S/G96_D`枚举、`feedModeMap` | 02域负责资源档案，04域负责D10实际绑定，08域只读取精确Profile并解释，未知方言UNKNOWN |
| `PhysicalRpmLimitEvidence` | `spindle/chuck/fixture/workpieceRatingRpm`、`ratingDocHash`、`clampingStateRevision`、`approvedCapRpm`、`approvedBy`、`effectiveFrom` | D03与D10记录出处；完整额定集合不足UNKNOWN，数值不小于0且不超过最小可核实额定 |
| `TurningDiameterEvidence` | `D04 setupRevision/hash`、`D10 axisCenterFrame/hash`、`G7/G8`、`programX`、`physicalDiameterMm`、`frameEpoch` | D04工艺定位不能替代D10实际中心线；坐标位移/刀补变化旧直径证据STALE |
| `SpindleFeedback` | `expectedRpm`、`observedRpm`、`deviceAckId`、`timestamp`、`observedSpindleKey`、`D13 event`、`D14 timing` | D13解释意图不伪造设备回执；缺设备反馈不能判实际转速达标 |
| `OwnerCommitFence` | `actor`、`ACL/policyRevision`、`expectedRevision`、`contentHash`、`FrameHash`、`scopeEpoch`、`cancelGeneration`、`requestId` | GUI/CLI/Agent同08域Owner Port提交，提交点重验CAS/ACL；取消晚回执、撤权或历史修订只能回退/STALE |

## 规划操作流程 / GUI / 失败与迁移

1. 在唯一左`UnifiedTaskPanel`「NC→主轴」页选择目标实际车床机床与D10精确Profile，展示「G96恒线速度/G97恒转速」「G50/G96 D受控限速」「对应进给模态」和`UNKNOWN`原因。不得把机床名或当前CL动画推断为已验证方言。
2. 先读取D03物理额定来源，分别核实卡盘、夹具、工件装夹状态与主轴额定，再评估用户批准的有效上限。不能采用全项目写死的RPM门槛；合成2500只是验证工具数值。
3. 在D04/D10各自Frame内独立解释物理半径/直径；D04只负责Setup的规划定位，D10锁定真实执行WCS及主轴旋转轴，尤其注意G7/G8程序坐标模式和X0中心线资格。
4. D09中立CL保留工艺切削速度意图，D12依据固件/选件转为目标NC；D13独立重读NC原字节，恢复G96/G97、G20/G21、G50或D及进给模态历史；未建模控制器宏、限速持久性、多主轴等返回UNKNOWN。
5. D14独立消费D13解释事件、机床轴/时序与真实传感器来源，D15按exact NC+Profile+D10+安全额定的同一修订做工程验证，D16单独受控签发；D11 CL动画不能代替这条链，**不进行材料扫掠仿真**。
6. 单Babylon Engine/Scene/Canvas仅作为3D叠加世界，不新建并排3D，主工程和资源世界横切；右侧Drawer禁止。所有运行模式共享左TaskPanel和同Owner Port，浅/深主题、字号≤12px。
7. CAS/ACL/撤权与取消晚回执在Owner提交点重验；工件、卡盘、机床、固件、Profile、NC、D04/D10 Frame或物理额定哈希变化触发精确依赖STALE，保留D08冻结和A/B共同事实，不改写历史已签发NC。
8. 旧档无`spindleRating/chuckRating/fixtureRating/workpieceRating/centerlineHash`时`LEGACY_UNKNOWN`只读；迁移采用Expand→显式补证→新修订审查→Contract，并保留旧字节与Reader及Rollback。没有外部合法资料/实测不可凭算法出具安全证书。

## 独立验收门禁

[字段化8规则](../../../research/traces/CAP-08-04-css-spindle-b122-v08.json) → [8正35负 + 7解析Golden](css-spindle-b122-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0804_css_spindle_b122_v08.cjs) → [执行等级](../../../tracking/cap0804-css-spindle-b122-verification-2026-11-03.json)。

独立实施消费者建议`T5-03::lathe-css-post-d13-d15-independent`：使用有OEM配置、双主轴/单主轴差异、卡盘和夹具额定声明、两套Setup与更换工件前后Revision的受授权车床样件。由08域外的09域D14/D15消费者实际解析交付的最终NC，验证模式、单位、X中心线、瞬时转速上限与权限失效，并由10域D16独立判发布资格。拟议验收必须有独立消费者原始结果与电子签名，不能由本规则judge自证真实合规。

本轮只是作者同判定函数43项正反规划合成和7项独立预定数值Golden；**独立Node完整文件进程、真实LinuxCNC/Haas、真实机床卡盘/夹紧、17正式Owner签署及独立消费者均NOT_RUN；L3待人类批准；全仓GFM AST及历史附件原字节未核终。规划PASS≠产品PASS。**
