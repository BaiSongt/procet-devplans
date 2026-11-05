# CAP-06-05｜不可变制造状态（V0.8，L3待审）
> 原始三级定义“来源DAG、Stock快照与状态指纹”；第06域，关联原F1-05、W2-02、W2-03、W2-06。保持11域/88 CAP/36包/17资产及L1/L2不变。[三级原文](../../architecture/v0.8/03_三级能力映射_88项.md)。

## 1. 业务场景及不能退让的边界
给定一个Project/Document/Branch/Setup、固定StepUID以及D04毛坯/Setup修订，06域维护每道候选工序前后D07**不可变有序材料状态**及其父修订谱系。候选A/B可从同一已封存父状态分叉，重算只产生新D07修订，不回写父B-Rep或05域D08冻结。用户查看历史状态与仿真预览不能触发Owner写入。无批准D05时A模式也可求解，但必须有D01目标、D04实际毛坯/物理Frame；D04工艺Setup与D10机床执行绑定永远分开。

状态语义：`S(k+1) = S(k) \ R(k)` 为**项目几何设计不变量**，其中R(k)是已约束的局部去料实体。每一条边保存输入Stock、去料体、输出Stock的封存字节证据及独立验证需求；保护区`P∩R(k)=∅`。这不是材料扫掠动画、刀具可达性判定或OCCT已验证结论；薄壁、岛屿、台阶与多Solid仍需真正B-Rep布尔和检查。

## 2. D07精确状态身份与序列化
- **最小引用C0**：`assetId=D07 / stateUid / revision / exactContentHash / hashKind / physicalFrame / unit / project / document / branch / setup / scope / schemaVersion / ownerPortVersion`。revision是Owner分配的稳定修订，不用最后一次GUI选择或搜索排序位置替代。
- **几何实体**：sealed `stockBrepBytesRef`（字节哈希）、`removedBrepBytesRef`（可为空的Genesis）、`inputStateRef`、`booleanHistoryRef`、`prePostBRepCheck`、`fuzzyPolicyRef`、`toleranceEvidence`、`occtEngineVersion`。状态内容哈希与输入B-Rep文件字节哈希各自有域分隔，禁止直接对TopoDS内存地址、显示Mesh或仅BBox做指纹。
- **不可变不等于字节格式跨版本稳定**：固定BRepTools::Write的格式、OCCT版本、是否带网格/法向、单位及Frame；先封存实际原始字节再计算SHA-256，读取时逐字节复核。不同版本的相同几何可能序列化不同；不能把相同体积/可视结果判为相同指纹。JSON元数据可在明确I-JSON条件下选JCS；JCS**不**覆盖B-Rep二进制。
- **Genesis**：D04毛坯经Owner授权封存为首个D07引用，记录D04 exact输入及变换；不能因为D07缺失自动改毛坯尺寸，也不能用D01最终CAD直接代替前序材料。

## 3. 有序状态DAG、搜索分叉与局部冻结
1. **读取封存**：从04域读取D04工艺Setup、真实毛坯、从03域读D01设计目标及必要保护区；按physicalFrame有向变换核实单位/手系，渲染坐标转换独立。
2. **分叉**：D06候选路径引用已封存D07父状态；edge上固定`parentStateHash,stepUid,removalHash,algorithmVersion,constraintHash`。同一父状态允许多子状态；同一修订子图不允许有环或悬空父引用。业务类型图中的反馈必须跨新修订，不能在单实例DAG中制造环。
3. **计算与审计**：局部CUT/COMMON结果保留布尔历史、错误及Warning/容差；`BRepCheck_Analyzer::IsValid`仅为拓扑检查的一环，不证明加工可行。ShapeFix、非破坏copy或fuzzy变化都生成**新**候选和修订，不能改变旧状态。
4. **双通道检查**：合成集合差集仅验证设计逻辑；真实OCCT/独立D07消费者必须从封存原始字节另行读取、复算或检验输入闭包、保护区、后继Solid和体积预算。任何失配`FAIL`，无法判定`UNKNOWN`，禁止吞错视为PASS。
5. **提交**：计算仅产Staging候选；Seal前后必须由06域Owner受管Port对expectedHead、aclEpoch、taskGeneration、取消代次和idempotencyKey进行提交瞬时重验，产单一权威回执。被撤销、晚回执或Head变化不得写入冻结D08。多数据库不可默称ACID；强杀恢复不明时`UNKNOWN_RECOVERY`。
6. **精细失效**：D07 S1某一子状态改变只失效依赖该state exactHash的S1后续D07、D09以及D12→D13→D14→D15→D16；不改S2不相关状态、D04原始Setup或既有D08历史快照。已有D09、D12等资产不删除，只标失效待再判。
7. **下游资格**：06域D07不得自行授予冻结和加工准入。05域产生D08精确冻结；07域D09只认独立核验合格D07+D08。D09中立CL→08域D12最终NC→D13控制器语义→09域D14轴时序→D15独立NC验证→10域D16发布，全部使用原始字节/配置和作用域hash闭包。D11 CL播放不是D15，未知NC语义`UNKNOWN`必须阻断D16。**不做材料扫掠仿真**。

## 4. 十项落地任务（可单独施工与回退）
S01 冻结StateRef/Owner最小字段与版本兼容策略；S02 Genesis来源/毛坯授权及双Setup Frame用例；S03 锁版B-Rep原始字节Seal/读取复核；S04 构造stateUid/parent DAG及分支支配输入；S05 顺序真实CUT/保护区和有效性证据；S06 Copy/ShapeFix/布尔History不变性回归；S07 受管D07提交+CAS/ACL/取消晚回执；S08 精细失效图和跨Setup不可污染；S09 GUI/CLI/Agent统一工作流与预览租约；S10 独立D07进程消费者及强杀重放报告。每项交付DTO、正反证据与可回退旧reader，**不得删除用户数据库或旧修订**。

## 5. GUI/3D 与独立交接
[统一左TaskPanel及单Babylon世界](UI.md) · [请求/回应/StateRef契约](contract.example.json) · [分叉/失效矩阵](invalidation-matrix.json) · [独立消费者实施规范](independent-consumer-handoff.md) · [17资产Owner候选](asset-owner-candidates.json)。GUI、CLI、Agent共用06域`ManufacturingStatePort`（`getExact / fork / stage / seal / commit / cancel / readReceipt`），3D高亮与历史对比只是只读投影，无写权限。C0不建立巨型万能制造对象。

## 6. 证据与验收
[10份公开来源（含阅读深度）](../../../research/sources/CAP-06-05.json) · [10规则20正反链路](../../../research/traces/CAP-06-05.json) · [仅合成fixtures](fixtures.json) · [规划检查工具](../../../tools/check_cap0605_planning_2026_10_25.cjs) · [理论专题](../../../research/topics/R-IMMSTATE-001.md)。验收须锁真实STEP、OCCT构建SHA、产品二进制SHA及样本/预期hash，覆盖双Setup、A/B分叉、取消晚回执、引用链断裂、跨版本序列化、局部重算、保护区、退化几何及消费者独立验算。**规划合成校验仅验证规则，真实产品、OCCT、独立D07、NC和机床仍NOT_RUN；17 Owner签署和L3人工评审PENDING。规划PASS≠产品PASS。**
