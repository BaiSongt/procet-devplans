# B21｜CAP-04-03 单侧接触与3-2-1形闭合资格补证（2026-10-29）

> 规划增量，原11域/88 CAP/36工作包/17资产编号不变；L3待人工批准。本文数学合成不等于夹具装夹安全、NC工程验证或产品验收。

## 新发现与必须落实的规则

**已有CAP-04-03的六接触3-2-1样例虽然Jacobian秩为6，但不是一阶形闭合的证明。** rank=6仅说明把接触当作双向等式的六自由度局部线性约束独立；真实的无粘附接触只能推，不能拉。若将接触间隙导数设为`ġ=Jv`，不穿透条件为`Jv>=0`。使用原`constraint-examples.json`的六条行向量，取`v=(1,0,0,0,0,0)`，六项`Jv=(0,0,0,0,0,1)`，一个定位端面正在分离，其余接触不穿透；另取`v=(0,0,1,0,0,0)`，得到`(1,1,1,0,0,0)`。这两个非零证据推翻该**线性摩擦零模型的一阶形闭合**，即使rank为6。不是判定真实夹紧后物体必定脱离；真实夹紧是另一个物理工况。

[Modern Robotics §12.1.7](https://modernrobotics.northwestern.edu/nu-gm-book-resource/12-1-7-form-closure/)明确一阶形闭合只有零Twist满足全部不穿透约束，三维六维wrench空间的一阶无摩擦点接触至少需要7个法线；还明确一阶条件失败不排除依赖接触曲率的更高阶形闭合。因此本轮只验证给定**分离见证**，既不提供通用LP求解器，也不将无见证升格PASS。

[Modern Robotics §12.2.3](https://modernrobotics.northwestern.edu/nu-gm-book-resource/12-2-3-force-closure/)将force closure与摩擦锥正张成及正系数平衡区分，并指出几何上的force closure不等于执行器一定产生所需力；[Carr Lane定位夹紧指南](https://www.carrlane.com/engineering-resources/fixture-design-principles/locating-clamping-principles)强调3-2-1最后仍有需由夹紧限制的方向。故D04应分别输出`bilateralRank`、`unilateralEscapeCertificate`、`firstOrderFormClosure: not_proven|unknown|verified_with_separate_evidence`、`physicalStability: unknown`，绝不把rank直接映射“安全通过”。

## 具体接口设计（待L3）

输入引用必须锁定D01 CAD/Datum及D03 Fixture exact revision/hash/拓扑快照，接触位置与法线转换到**同一D04 Setup Frame**；`normalPolarity`必须显式为间隙正方向，缺失返回unknown。候选检测顺序为：原始接触资格 → 由`[n, r×n]`计算rank → 线性化单侧约束检查/分离见证 → 夹紧力、摩擦、刚度及工况证据另外评价 → 只读UI/CLI/Agent审阅 → D04独立CAS提交。该候选公式与本轮合成阈值1e-9仅适用于输入整数矩阵，**不是设备公差**。

GUI在唯一Babylon Engine/Scene/Canvas中显示六个带来源的接触箭头、rank数字与x/z分离Twist的ghost动画；状态明确为“局部秩满 / 单侧见证存在 / 物理安全未知”，统一左TaskPanel和D04.OwnerPort是三入口唯一路径。不得创建第二个3D或从Babylon mesh faceIndex生成CAD拓扑凭据。取消、scope变化、权限撤回、旧expectedRevision必须拒绝迟到回执并保持已冻结A/B快照。

D04仅产生夹具候选及修订，D10实际机床装载与G54/G43执行绑定仍分离；中立CL→D12后处理NC→D13控制器解释→D14轴时序→D15独立验证→D16发布。CL动画、静态接触rank及OCCT静距不能代替NC产品验证，不执行材料扫掠仿真，未知语义保留unknown并阻断发布。D04更新将D05/D06/D07/D09消费者标stale并要求独立重验，不覆盖冻结D08或发布D16。

## 来源深度、作者版本与证据资格

| ID | 原始来源与作者/版次 | 2026-10-29实读范围 | 限制 |
|---|---|---|---|
| B21-S01 | Kevin M. Lynch / Frank C. Park，Modern Robotics §12.1.7，出版物教材配套页面，网页修订号未标注 | 公开HTML §12.1.7说明与文字稿、非下载教材全文 | 一阶形闭合理论；不认证实际夹具曲率/材料 |
| B21-S02 | 同作者，Modern Robotics §12.2.3，网页修订号未标注 | 公开HTML §12.2.3力闭合、摩擦锥与正张成 | 未解通用LP或力学平衡 |
| B21-S03 | Carr Lane Manufacturing，《Locating & Clamping Principles》，网站版次/发布日期未知 | 官方HTML 3-2-1和夹紧位置章节 | 厂商建议不是标准条款 |
| B21-S04 | Jonathan W. Lee / L. Haynes，NIST，1987-05-29 | [官方出版页](https://www.nist.gov/publications/finite-element-analysis-flexible-fixturing-system)摘要/作者/日期 | **论文正文未读**，不能借此宣称已验证有限元或摩擦 |
| B21-S05 | ISO/TC 213，ISO 5459:2024，第三版2024-10 | [官方目录与Abstract](https://www.iso.org/standard/87855.html) | **115页收费正文未读**，不推演3-2-1规范条款 |
| B21-S06 | Procet CAP-04-03业务规格，固定[Git Blob](https://github.com/BaiSongt/procet-devplans/blob/73e628aea0ada7222bc294c465763888c45741a4/docs/capabilities/CAP-04-03/README.md) `0727113f...`，2026-10-19 | §1—6完整读取 | 内生Owner/UI/CAS/NC分层要求，不归因于外部论文/ISO |

详细作者/URL/阅读深度、字段来源映射见[可机读追踪](../../../research/traces/CAP-04-03-unilateral-b21-v08.json)，[2正29反合成案例](unilateral-b21-fixtures-v08.json)和[只读Node校验工具](../../../tools/check_cap0403_unilateral_b21_v08.cjs)；[执行资格记录](../../../tracking/cap0403-unilateral-b21-verification-2026-10-29.json)。

**实施及独立验收入口：** `node tools/check_cap0403_unilateral_b21_v08.cjs`仅验证合成数据和追踪一致性。F1-02/F1-04、W2-05、E3-04、U4-02需新增真实“有/无夹紧力、逆向法线、共线/重复接触、接触脱离、权限撤销、D10旧绑定、D15未知NC”正反消费测试；消费者签署尚为0/17，实际产品Rust/TS/OCCT/NC/B5、GUI浏览器与机床测试`NOT_RUN`。历史文件原始字节未迁移，L3仍待人类审查。**规划PASS≠产品PASS。**
