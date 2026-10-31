# CAP-04-02｜B09配准Frame数学与制造资格补证（2026-10-29）

**规划补证，L3待审，未修改任何产品事实。** 基于规划分支精确HEAD `f3551c6a6715f2e1b91092e3d4b106e6490377f0`、根Tree `2d22f81029db6c0ce15a51d7e2d702bdcd0a6894`，重新读取原[CAP业务规格](README.md)、[GUI及单Babylon约束](UI.md)、[原数学例](math-examples.json)、[原研究追踪](../../../research/traces/CAP-04-02.json)和[原B0-05工作包](../../work-packages/B0-05.md)。原文已有十规则/二十验收；本轮不复制或覆盖它们，而是针对可检验刚体变换、资格失效补入独立反例。

## 业务边界与工程判定

- **设计基准不等于物理配准验收。** ISO 5459:2024 第3版官方Abstract描述datum体系的规格定义，并明确其验证操作不在该标准范围；因此凭PMI/设计datum不能认定工件已实测就位。
- **显式三Frame：** `T^K_P=(T^S_K)^-1·T^S_P`，列向量左乘，P零件、K毛坯、S工艺Setup。合成例 `Rz(90°), t_SP=(50,20,4), t_SK=(40,20,0)` 结果 `t_KP=(10,0,4)`。不允许把缩放、镜像、NaN或渲染坐标系差异默认为可批准的工件刚体。
- **欠定、对称多解与BBox证据：** 约束rank不满6/冲突/多解时拒绝唯一定位资格；BRepBndLib边界包络即使完全包含，也只完成初筛，不能推断非凸毛坯或内孔真实实体包含，更不推断加工余量认证。nominal与measured必须保留证据分级。
- **D04独立写入：** D01和stock的exact revision/hash/occurrence/frame是候选资格，GUI/CLI/Agent统一调用StockPartRegistrationPort；只有D04 Owner经ACL、scopeEpoch、permissionEpoch、expectedRevision与CAS重验才能提交新D04修订。3D ghost、取消晚回执不产生正式写入。
- **执行链不越权：** D04与D10执行绑定分开；中立CL→D12后处理→D13控制器解释→D14轴时序→D15工程验证→D16发布。当前合成基线特意令D13=`unknown`，D14/D15=`NOT_RUN`，D16=`BLOCKED`。不采用材料扫掠仿真，LinuxCNC不能当OEM/B5机床认证。
- **冻结和回退：** A/B相同事实不得覆盖冻结；失效后保存旧revision、sourceClosure和rollbackRef；17 Owner正式签署0/17、17独立消费者0/17，L3待人审，原件原字节缺失继续作为风险。

## 机器追踪与测试

[5项官方来源+8条规则](../../../research/traces/CAP-04-02-frame-contract-b09-v08.json) → [1个合成正例+46个单字段独立反例](frame-contract-b09-fixtures-v08.json) → [只读Node验收工具](../../../tools/check_cap0402_frame_contract_b09_v08.cjs) → [状态记录](../../../tracking/cap0402-frame-b09-verification-2026-10-29.json)。测试入口：`node tools/check_cap0402_frame_contract_b09_v08.cjs`（真实完整checkout运行前须重新验证当前HEAD和文件，且Node测试不构成OCCT/NC/实机验收）。合成矩阵浮点断言采用1e-10仅供代数单元测试，**不是来源标准给出的工业容差**。无正式独立消费者对拍则本规划仅处于可审阶段。

## 2026-10-29官方公开资料实际阅读深度

| 作者/出版方 | 标识/时间/URL | 已核阅范围与不能推论 |
|---|---|---|
| ISO/TC 213 | [ISO 5459:2024 Edition 3（2024-10）](https://www.iso.org/standard/87855.html) | 官方目录、版本、Abstract；未读收费正文，不能引述未读条款或合格公差 |
| Open CASCADE | [gp_Trsf OCCT 8.0.1](https://occt3d.com/dev/doc/refman/html/classgp___trsf.html) | 在线变换组合与类方法概述；不能外推产品本地7.9.x已对拍 |
| Open CASCADE | [TopLoc_Location OCCT 8.0.1](https://occt3d.com/dev/doc/refman/html/class_top_loc___location.html) | 类概述与Transformation API；不保证跨CAD修订子形状持久ID |
| Open CASCADE | [BRepBndLib OCCT 8.0.1](https://occt3d.com/dev/doc/refman/html/class_b_rep_bnd_lib.html) | Add/AddClose/AddOptimal公开说明；未测试精确实体包含 |
| LinuxCNC文档团队 | [G-code 2.9](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html) | G52/G53/G54-G59.3章节；非其他控制器或B5认证 |

所有安全、CAS、权限、UI和分层判定为**Procet内部拟议工程规则**，不是声称标准原文逐条强制要求。外部来源为本次增量审计的局部已读清单，不擅自修改历史127份Registry、1075条登记或312条原CAP→包边。

**验证层次：** 本轮V8等价内存判定47/47为合成设计测试；独立Node完整文件系统进程与真实OCCT/NC/三轴/B5/OEM、17消费者全部`NOT_RUN`。规划PASS≠产品PASS。
