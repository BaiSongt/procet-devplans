# R-STOCKREG-001｜毛坯与CAD目标的定位配准、几何资格和执行坐标隔离

**检索访问：2026-10-19。范围：ISO公开目录/摘要、OCCT8.0.1在线API局部函数、LinuxCNC stable公开章节、NIST论文出版元数据。不是付费标准正文、生产Native版本对拍或真实机床校准。** 关联[CAP-04-02](../../docs/capabilities/CAP-04-02/README.md)、[来源文件](../sources/CAP-04-02.json)、[规则追踪](../traces/CAP-04-02.json)。

## 1. 工程概念辨析

- CAD模型的**设计datum**用于表达GPS设计公差语义。ISO 5459:2024 Edition 3 的公开摘要明确规范说明specification operator而不提供各种现实verification operator，因此不能直接推断实体毛坯装夹量具已测得符合要求。
- ISO 841:2001 Edition 2（2023确认有效）公开Abstract谈数控机床运动坐标。制造Setup中零件与stock相对位置并非控制器实际G54/G55寄存器，D10配置和D13模态解释必须独立完成。
- OCCT gp_Trsf 8.0.1 API的`SetTransformation`对应同一物理点在不同坐标表达的映射，`SetDisplacement`移动坐标架；`Multiply`（当前*右）与`PreMultiply`（左*当前）次序不同。仅凭“变换矩阵能显示正确”无法证明Frame语义一致。
- 对源装配体的**定义几何**与**出现实例**必须分离：同shapeHash不能替代occurrencePath；`TopLoc_Location`可辅助表达组件相对位姿，但对跨版本拓扑引用的持久有效性没有承诺。

## 2. 两实体三坐标架的数学契约

令P=CAD目标局部帧、K=毛坯几何局部帧、S=当前Setup帧，列向量齐次坐标左乘：

`p_S = T^S_P p_P`，`k_S = T^S_K k_K`，`T^K_P = (T^S_K)^(-1) T^S_P`。矩阵的3x3旋转块应正交、行列式为+1、尺度因子1，且平移有限；这里是Procet拟议**刚体安全契约**，不是OCCT库默认拒绝所有镜像或缩放。单位换算通过显式units处理，不将mm↔inch倍数塞进刚体变换。

对于局部bbox，先在S中计算点/几何，再取extrema。将原bbox 8角变换得到的是原外包盒的变换后保守bbox，不等于复杂BRep的紧包围。OCCT `BRepBndLib::Add`按面/边/点及其容差扩张，`AddOptimal`使用更精细几何算法，`AddClose`要求全多边形平面面但**不自动检查**此前提；API指出Add可能给出比真实物体更大的边界。本CAP要求记录算法、三角剖分/精度来源、容差政策；不得无说明地以BBox与stock相交⇒材料包含。非凸stock、内部孔/空腔、损坏或仅mesh都需要显式局限。

以合成矩形体在P中`x∈[-10,10],y∈[-5,5],z∈[0,12]`为例，若`T^S_P=Rz(+90°),t=(50,20,4)`，则在S中bbox是`x∈[45,55],y∈[10,30],z∈[4,16]`，非简单复用`20×10×12`轴尺寸。若stock在S中bbox为`[43,57]×[8,32]×[0,20]`，bbox**必要筛查**通过；将stock x最小值改为46则筛查失败。样例数学通过也不能声称精密BRep余量已验收。

## 3. 标称、测量、未知的证据等级

所谓毛坯位置“配准”必须带来源资格：名义目录尺寸、BRep已知空间几何、测量坐标和测量不确定度为不同层级。只有形状匹配或手动拖拽不能生成`measured=true`。欠约束时可能有无限多个相同几何的姿态候选：方案应报告约束剩余自由度、对称性/多解与缺失的测量依据，不允许从单点拟合出获批六自由度姿态。

自动落座/居中返回 `Solve(sourceCadRevision,stockRevision,stockGeometry,datumRefs,constraints,algorithmRev)`，每次从原始来源求解，不读取ghost或上次提案结果。禁止导入时自动改库存毛坯、自动放大以覆盖CAD，更不能将negative allowance默改为zero。

## 4. 控制器/验证不越界

LinuxCNC稳定版坐标说明的§2 G53、§3 G54–G59.3、G52/G92展示控制器特有的执行偏置；其他控制器（Fanuc/Siemens/Heidenhain）不可直接复用这段语义作为机床认证。NIST IR 6556当前只核对作者、2000-01发表与DOI，**并未读取论文正文**，不引用其未读的G-code条款。

完整工程链为`D04计划配准 + D10机床执行绑定 → D09中立CL → D12 NC后处理 → D13控制器执行语义 → D14轴时序 → D15 NC工程验证 → D16发布`。未知宏、刀补、机床坐标和TCP校准时必须`unknown/fail-closed`；CL预览≠D15证明。本CAP不做材料扫掠仿真。

## 5. 来源、读取深度与不可外推范围

| ID | 著者/版次/日期 | 已读部分 | 不能推出 |
|---|---|---|---|
| SRC-REG-001 | ISO/TC213，ISO5459:2024 Ed3，2024-10 | 官方目录/Abstract，catalog_abstract | 未读付费正文；不得捏造具体条款或制造计量公差 |
| SRC-REG-002 | ISO/TC184/SC1，ISO841:2001 Ed2，2023已确认 | 官方Abstract及edition，catalog_abstract | 不能确定实际B5轴树/机床零位 |
| SRC-REG-003 | Open CASCADE，OCCT API8.0.1 | gp_Trsf具体API签名与变换、反射，section_text | 不能当产品锁定Native7.9.x通过 |
| SRC-REG-004 | Open CASCADE，OCCT API8.0.1 | BRepBndLib::Add/AddClose/AddOptimal/AddOBB，section_text | 不能说明所有实体满足某工业精度 |
| SRC-REG-005 | Open CASCADE，官网API | TopLoc_Location变换反向与复合，section_text；复用既有研究 | 不支持永久face身份 |
| SRC-REG-006 | LinuxCNC stable，版本未锁定 | 坐标文档§2/3及G52/G92，section_text | 不覆盖别的控制器方言 |
| SRC-REG-007 | Kramer/Proctor/Messna，NIST IR6556，2000-01-01 | NIST出版元数据+DOI，catalog_abstract | 没读论文正文，不引用G-code具体章节 |

**本文中由来源直接支持的能力边界，与Procet内部选择严格区分。** 领域契约（CAS/权限重验、单Babylon世界、D04/D10分离、绝对幂等配准和不自动扩容）是系统工程设计规则，须在人类L3评审及产品实测中独立验证。逐项ID→字段→正反测试由[机器追踪](../traces/CAP-04-02.json)关联；源码、设备参数、控制器版本待实施时核对exact SHA。
