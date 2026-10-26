# CAP-09-02｜统一坐标与运动正解（V0.8原编号，L3待审）

**原目标**：基于FrameGraph求主轴、刀具、工件位姿；原工作包 F1-02、E3-04、E3-05、U4-04。11域88 CAP、36原包、17资产与L1/L2保持原样。

## 职责和数学校核

D03（02域）负责机床拓扑/刀具能力档案；D04（04域）负责名义Setup/毛坯；D10（04域）负责**真实装夹/机床/刀具执行绑定**。09域只读exact revision/hash/Frame/scope并计算运动学。D04不是D10，也不是控制器G54实际偏置；D13须独立重读最终D12 NC及控制器模态，D14才形成实际轴时序与位姿，D15独立工程验证，D16门禁发布。UNKNOWN不得视为PASS；D11 CL动画不等于NC工程验证。

项目Frame约定：**右手系、列向量、`T_A_B`把B坐标转换到A**，`T_A_C=T_A_B*T_B_C`，`T_work_tcp=inverse(T_machine_work)*T_machine_tcp`。物理Joint顺序、枢轴、工具安装与工件摆放分别解析；`R^T R≈I`、`det(R)≈+1`，拒绝镜像缩放/错手系/路径歧义。OCCT的gp_Trsf API允许非刚体变换，不等于所有变换都符合机床FK。B5旋转中心、软硬限位、RTCP、误差容差未经实测一律UNKNOWN；不实施材料扫掠仿真。

## 十项施工、证据与逐项正反验收

1. **精确来源及Owner**（CAP-09-02-R01）：字段 `refs.d03Exact`, `refs.d04Separated`, `refs.d10Physical`, `refs.revisionHashFrameExact`；关联来源 C0902-S01、C0902-S02、C0902-S08；正反/独立变异 CAP-09-02-T-P01 / CAP-09-02-T-N01 / CAP-09-02-M01。
2. **FrameGraph DAG唯一通路**（CAP-09-02-R02）：字段 `graph.framesStable`, `graph.acyclic`, `graph.singlePath`, `graph.scopeExact`；关联来源 C0902-S04、C0902-S05、C0902-S06；正反/独立变异 CAP-09-02-T-P02 / CAP-09-02-T-N02 / CAP-09-02-M02。
3. **右手SE3及单位**（CAP-09-02-R03）：字段 `se3.rightHanded`, `se3.orthogonalR`, `se3.detPlusOne`, `se3.unitsDeclared`；关联来源 C0902-S01、C0902-S04、C0902-S05、C0902-S06；正反/独立变异 CAP-09-02-T-P03 / CAP-09-02-T-N03 / CAP-09-02-M03。
4. **父子方向/逆闭环**（CAP-09-02-R04）：字段 `multiply.columnVectors`, `multiply.frameDirectionDeclared`, `multiply.multiplicationOrderFixed`, `multiply.inverseRoundTrip`；关联来源 C0902-S04、C0902-S05、C0902-S06；正反/独立变异 CAP-09-02-T-P04 / CAP-09-02-T-N04 / CAP-09-02-M04。
5. **Joint顺序与枢轴**（CAP-09-02-R05）：字段 `joints.physicalJointSequence`, `joints.pivotsFromEvidence`, `joints.axesNormalized`, `joints.dualDrivePreserved`；关联来源 C0902-S02、C0902-S04、C0902-S06、C0902-S07；正反/独立变异 CAP-09-02-T-P05 / CAP-09-02-T-N05 / CAP-09-02-M05。
6. **TCP对工件的相对变换**（CAP-09-02-R06）：字段 `tcp.toolMountExact`, `tcp.d03ToolArchiveExact`, `tcp.d10ToolInstalledExact`, `tcp.workTcpRelativeComputed`；关联来源 C0902-S01、C0902-S02、C0902-S04、C0902-S07；正反/独立变异 CAP-09-02-T-P06 / CAP-09-02-T-N06 / CAP-09-02-M06。
7. **WCS及模态偏置隔离**（CAP-09-02-R07）：字段 `wcs.nominalD04Only`, `wcs.d13ParsesControllerOffsets`, `wcs.d10PhysicalFrameExact`, `wcs.unknownPreventsPass`；关联来源 C0902-S02、C0902-S03、C0902-S07；正反/独立变异 CAP-09-02-T-P07 / CAP-09-02-T-N07 / CAP-09-02-M07。
8. **独立正解向量与实测界限**（CAP-09-02-R08）：字段 `oracle.xyzAndAcChecked`, `oracle.orderNonCommutative`, `oracle.inverseAndDetChecked`, `oracle.b5UnmeasuredUnknown`；关联来源 C0902-S04、C0902-S05、C0902-S06、C0902-S07；正反/独立变异 CAP-09-02-T-P08 / CAP-09-02-T-N08 / CAP-09-02-M08。
9. **NC轴时序/验证分离**（CAP-09-02-R09）：字段 `nc.finalNcBytesPinned`, `nc.d13Independent`, `nc.d14FromD13Events`, `nc.d15D16Independent`；关联来源 C0902-S02、C0902-S03、C0902-S07、C0902-S09；正反/独立变异 CAP-09-02-T-P09 / CAP-09-02-T-N09 / CAP-09-02-M09。
10. **统一入口事务与回退**（CAP-09-02-R10）：字段 `access.oneBabylonLeftPanel`, `access.sharedGuiCliAgentPort`, `access.casAclEpochCancelGate`, `access.preserveFreezeAndRollback`；关联来源 C0902-S08、C0902-S09；正反/独立变异 CAP-09-02-T-P10 / CAP-09-02-T-N10 / CAP-09-02-M10。

## 统一端口/事务/回退

09域`FrameGraphPort`提供 `readExact(D03,D04,D10)`、`validateFrameGraph()`、`composeFrames()`、`computeFK()`、`computeRelativeTCP()`、`commitCandidateCAS()`、`invalidateDownstream()`。GUI/CLI/Agent统一调用，C0仅放公共身份、单位、Frame、revision、hash、scope等，不放机床拓扑/NC语义。提交瞬间重验ACL/CAS/Frame/scopeEpoch/generation/cancelled，撤权/取消晚回执拒绝提交；A/B共享事实不覆盖D08冻结。版本失效依[矩阵](invalidation-matrix.json)，支持Expand/Migrate/Contract与旧Reader+schema+Profile成套回退，不删用户数据库。

## 导航

[单Babylon/统一左TaskPanel](UI.md) · [合成Frame合同](contract.example.json) · [30规则例/8数学向量](fixtures.json) · [17资产候选Owner](asset-owner-candidates.json) · [独立消费者验收](independent-consumer-handoff.md) · [9官方来源](../../../research/sources/CAP-09-02.json) → [理论推导](../../../research/topics/R-FRAMEGRAPH-FK-001.md) → [逐项规则与字段](../../../research/traces/CAP-09-02.json) → [Node规划校验](../../../tools/check_cap0902_planning_2026_10_27.cjs)。

所有规划正反例仅**合成**，Node独立文件/真实OCCT/控制器/三轴及B5/消费者**NOT_RUN**。17 Owner与L3**PENDING_HUMAN**。规划PASS≠产品PASS。
