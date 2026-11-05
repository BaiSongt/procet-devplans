# CAP-07-03｜B60 3+2刀轴一致不代表定位平面一致

**日期：2026-10-31。状态：仅V0.8规划补证，L3/Owner待人类审批，产品、真实控制器、17项独立消费者均NOT_RUN。** 保留原11域/88 CAP/36工作包/17资产。

## 数学反例与工程语义

给定右手列向量约定，索引加工刀轴为 \(R e_z\)，只有刀轴无法唯一确定旋转矩阵，因为 \(R'=R R_z(\phi)\)仍满足 \(R'e_z=R e_z\)，但面内 \(R'e_x\)会随 \(\phi\)变化。合成Golden如下：

```text
RA = Ry(90°)       = [[0,0,1],[0,1,0],[-1,0,0]]
RB = Ry(90°)Rz(90°)= [[0,0,1],[1,0,0],[0,1,0]]
RA·ez = RB·ez = (1,0,0)  # 刀轴相同
RA·ex = (0,0,-1)
RB·ex = (0,1,0)          # 面内方向不同90°
det(RA) = det(RB) = +1
```

以上为本研究自己推导，不是ISO或OCCT标准规定的工业容差。**OCCT gp_Quaternion::SetRotation(from,to)最短弧只对齐方向，反平行向量时可依叉乘辅助向量决定转轴；不应据此静默生成满足任意加工面内走刀方向的完整3+2姿态。** 需持久化具名 `planeXAxis`、`toolAxis`、`R3x3`、`fromFrame/toFrame`、`units`与`poseHash`。`RᵀR=I`及`det(R)=+1`为候选刚体判定；当前合成测试容差1e-9为示意，非实测公差与机床校准证据。

## 原CAP实施约束与领域Port

1. D01/D03/D04/D07/D08精确修订、hash、frame、scope及授权；D04是名义工艺Setup，D10另存实际机器/刀补执行绑定。D09拥有索引定位**中立CL候选**，不得把B5、AC/BC、H值或控制器G指令提前写进CL。
2. 先退刀/转位，再锁定回转轴执行分段三轴切削；连续旋转切削不得标记3+2。面法向、面内X、转位姿态分支任一缺证时标`UNKNOWN`或`LOCAL_CANDIDATE`，不擅选默认roll。旧仅向量数据只读迁移候选，保留源字节/修订与回退记录。
3. LinuxCNC 2.9 G10 L2的`R`表示XY面绕Z转角，不是任意倾斜平面通用后置语义；其他控制器必须提供厂商/固件/选项和D10机床配置证据。真实机器运动学和伺服误差不能从CAD旋转矩阵推出。
4. `D09.IndexedPosePort.readExact/preview/stage/commitCAS/cancel/rollbackAsNewRevision`供GUI/CLI/Agent同域使用。一次Babylon Engine/Scene/Canvas，统一左TaskPanel，最多12px；点击/高亮不是提交。Owner提交瞬间再核ACL、expectedRevision、hash、frame、scopeEpoch、taskGeneration和cancelToken，取消晚回执无效；A/B同事实但不覆盖D08冻结。
5. 中立D09 CL → D12 NC后处理 → D13**最终NC**执行语义 → D14物理Joint时序 → D15独立工程验证 → D16受控发布。未知语义显式`UNKNOWN`，CL动画不当作NC工程PASS，**不做材料扫掠仿真**。改变roll/Frame使对应CL段与下游派生精确引用失效；保留历史冻结，失效传播和回退非破坏。

## 来源层级和局限（每项2026-10-31访问）

|来源|作者/版本/时间|实际阅读定位|局限|
|---|---|---|---|
|B60-S01|Open CASCADE Technology，8.0.1，出版日未核|gp_Ax3公开API Detailed Description、XDirection及Direct|可构造左右手Frame，不证明机床切削资格|
|B60-S02|Open CASCADE Technology，8.0.1，出版日未核|gp_Quaternion公开API SetRotation/SetMatrix|最短弧不隐含面内roll|
|B60-S03|LinuxCNC文档维护者，2.9，出版日未核|官方G-Code §14 G10 L2|不可外推到其他OEM|
|B60-S04|ISO/TC184/SC1，ISO 841:2001第二版，2023确认|**官方合法目录及摘要**|收费正文未读，不编造条款|
|B60-S05|Gao/Ibaraki/Donmez等10作者，2023-04-20，IJMTM 187，DOI:10.1016/j.ijmachtools.2023.104017|**NIST官方出版摘要**|论文全文未读，不引用未读误差量|
|B60-S06|Procet规划团队，原CAP07-03固定Git Blob 1caa5e9...|原业务规格完整段|ACL/CAS/GUI是项目规则，非外部标准|

来源作者、版本、URL、深度、限制逐条见[登记](../../../research/sources/CAP-07-03-indexed-roll-b60.json)。来源→[8规则与字段及原编号工作包](../../../research/traces/CAP-07-03-indexed-roll-b60-v08.json)→[41正反UNKNOWN案例](indexed-roll-b60-fixtures-v08.json)→[机器校验](../../../tools/check_cap0703_indexed_roll_b60_v08.cjs)→[核验等级](../../../tracking/cap0703-indexed-roll-b60-verification-2026-10-31.json)。原F1-02、F1-03、E3-01、E3-04、E3-05、U4-04均为原编号，不另立工作包。

## 真实独立消费者验收尚缺

D04 Owner需实际验证Frame和名义Setup；D09验证索引组与面内方向；D10提供真实执行绑定；D12/D13提供具体控制器后置和最终NC重新解释；D14实证物理Joint轨迹；D15独立检查D13/14的完整轴时序与碰撞资格；D16发布仅在签署闭包后执行。必须分别记录真实代码exact HEAD、Revision/Hash/Frame、正反用例、原始运行日志。**本轮没有产品级证明，规划PASS≠产品PASS。**
