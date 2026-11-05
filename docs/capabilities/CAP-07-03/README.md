> **B60专项研究：** [3+2完整姿态/面内方向歧义](INDEXED-ROLL-B60-2026-10-31.md)，6来源8规则41项正反/未知合成，仅规划不代表产品通过。

# CAP-07-03｜3+2定位加工：加工方向、定位姿态与分段刀路
**原始目标：** [V0.8的88项原映射](../../architecture/v0.8/03_三级能力映射_88项.md)的CAP-07-03，关联原 F1-03/E3-01/U4-04。本项属于长期扩展，**L3待人类审批；仅规划规格，不是产品完成证据**。复用[CAP-07-01 2.5D](../CAP-07-01/README.md)与[CAP-07-02 三轴曲面](../CAP-07-02/README.md)中立刀路原则，不将三轴刀路视为已实现3+2。
## 业务场景与边界
面对航空框类侧面、斜面及多个姿态才能接触的腔体，人工选择目标面/加工方向后，将工件局部加工面按**离散定位姿态(indexed pose)**分组；先姿态定位和确认，再在该姿态下以固定刀轴运行三轴刀路。**3+2不是连续五轴**：切削段期间两回转轴保持已索引姿态，不应产生隐含回转插补。多候选姿态、AC/BC构型差异、极限姿态和切换路线只输出有证据的候选或UNKNOWN，不作通用逆运动学已通过承诺。

D04的工艺Setup定义零件/毛坯/夹具/Frame事实；D10是**独立的执行侧机床绑定/偏置**，不允许提前把控制器G代码参数混入D09。D08冻结只读，A/B协作同一工程事实且不覆盖冻结。D03机床构型不默认写死B5、AC旋转次序、限位或旋转中心。未经真实机床几何和控制器配置验证，仅能证明候选几何坐标一致性，**不授D15/D16工程资格**。

## 十项可实施任务
|序|内容|可核输入与交付|异常与回退|
|---|---|---|---|
|S01|精确读D01/02/03/04/07/08|revision/hash/frame、单位、保护区与冻结锁|失配STALE_REF，保留所有旧资产|
|S02|加工面法向与候选姿态|Face/局部法向、刀轴夹角、索引坐标系|多解需选分支；未知法向UNKNOWN|
|S03|手系/变换矩阵校核|3×3刚性右手旋转、FrameGraph组合及逆变换|镜像与数值非正交一律拒绝|
|S04|读取真实机床运动配置的候选|运动链版本、旋转轴范围、选择分支/可达标记|未建模控制器或轴限位标UNKNOWN|
|S05|锁定回转姿态与分组|indexedPoseRef、旋转停止、切削段三轴不变|动态回转切削拒绝；不冒充五轴|
|S06|对每姿态分段生成D09中立CL|segmentGroup、姿态来源hash、局部刀轴、进给|不把D10轴坐标预写为CL来源|
|S07|跨姿态转移与安全退刀候选|离料、局部夹具/刀柄包络与索引次序|未有真实D14轴展开只标LOCAL_ONLY|
|S08|局部防过切与保护区|D03装配、D04夹具/禁入区、D11局部Oracle|3D显示代理不可替代真实几何|
|S09|严格NC后处理与工程发布门禁|D09→D12→D13→D14→D15→D16|任何D13未知语义或D15未通过禁止发布|
|S10|单域API与GUI/CLI/Agent/验收|owner CAS/ACL/代次/幂等键/取消/兼容reader|晚回执丢弃、可审计非破坏回退|

## 几何与控制器语义分层
约定姿态变换用明确父子Frame和右手刚性旋转矩阵描述，变换链按文档声明的源→目标方向组合，逆变换与单位校验须独立测试。OCCT 8.0.1的gp_Trsf、gp_Ax3和BRepBuilderAPI_Transform是候选实现依据，但不保证具体机床轴运动正确；Babylon仅做**单Scene的显示坐标适配**，禁止因渲染手系引入镜像。ISO 841:2001本轮只取公开目录摘要的机床坐标定义，**没有取得付费标准条文**。

Siemens SINUMERIK的CYCLE800只是*特定系统*倾斜工作平面的厂商示例，本轮仅获取官方网页搜索摘要；LinuxCNC 2.9的G10 L2 R为**XY绕Z**旋转，不能推广为通用3+2倾斜面指令。后处理必须按确切控制器类型、软件版本、配置和功能授权选择策略。未知CYCLE/PLANE、刀补、宏、工件偏置和旋转联动的执行语义统一为`UNKNOWN`，绝不推断机床已安全。**CL动画≠D15 NC工程验证；不做材料扫掠仿真**。

## 领域Port及所有权
`07.IndexedToolpathPlanningPort.preview(exactWorkContext,faceRefs,setupRef,kinematicCandidateRef,indexPolicy)`只返回姿态候选、分组、局部预检、未知状态和来源；`07.ToolpathOwnerPort.stage→seal→commitCAS`只允许生成新D09修订，提交时再次验证expectedHead、ACL、scopeEpoch、taskGeneration、cancelled和幂等键。不允许GUI/CLI/Agent向D04、D08、D10写入。D04 Setup变更使D09精确依赖及其派生D11—D16失效；如果影响范围不可证，回退`UNKNOWN_SCOPE`，冻结旧D08不变。C0最小公用只容纳身份/单位/Frame/Hash/Revision/Scope，不增加私有旋转策略对象。
GUI细节见[界面规格](UI.md)、[合成数据合同](contract.example.json)、[17资产Owner候选](asset-owner-candidates.json)、[来源与限制](../../../research/sources/CAP-07-03.json)、[规则/字段/正反/差异变异](../../../research/traces/CAP-07-03.json)、[独立消费者](independent-consumer-handoff.md)，[机器合成校验](../../../tools/check_cap0703_planning_2026_10_26.cjs)。
## 规则→字段→三重合成验收
|规则|主题|关键字段/正例/反例/差异变异|
|---|---|---|
|C0703-R01|精确工程来源与冻结只读|`revision`, `frameHash`, `stockHash`, `frozenUnchanged`；CAP-07-03-T01 / CAP-07-03-T02 / CAP-07-03-M01|
|C0703-R02|定位加工刀轴与目标面法向夹角|`toolAxisLocal`, `targetNormalLocal`, `angleToleranceDeg`, `indexedMode`；CAP-07-03-T03 / CAP-07-03-T04 / CAP-07-03-M02|
|C0703-R03|右手刚性Frame变换与逆变换|`rotationMatrix`, `frameHandedness`, `roundTripErrorMm`, `frameToleranceMm`；CAP-07-03-T05 / CAP-07-03-T06 / CAP-07-03-M03|
|C0703-R04|机床姿态解与候选分支显式性|`kinematicModelStatus`, `poseBranch`, `axisLimitsCandidateOk`, `poseClaim`；CAP-07-03-T07 / CAP-07-03-T08 / CAP-07-03-M04|
|C0703-R05|定位旋转与切削段锁止分离|`rotaryMovesDuringCut`, `rotaryLockedForCut`, `indexChangeStage`；CAP-07-03-T09 / CAP-07-03-T10 / CAP-07-03-M05|
|C0703-R06|每个定位姿态对应局部定轴CL段|`segmentAxisMode`, `poseRefHash`, `clHasMachineAxes`, `segmentGroupRecorded`；CAP-07-03-T11 / CAP-07-03-T12 / CAP-07-03-M06|
|C0703-R07|定位切换的进退刀与过渡未知状态|`retractedBeforeIndex`, `transitionPrecheckStatus`, `d15CertifiedByClPreview`；CAP-07-03-T13 / CAP-07-03-T14 / CAP-07-03-M07|
|C0703-R08|夹具刀柄与盲区独立局部预检|`localAssemblyPrecheck`, `protectedZoneIntact`, `sceneProxyIsEvidence`；CAP-07-03-T15 / CAP-07-03-T16 / CAP-07-03-M08|
|C0703-R09|NC语义与轴展开/发布的硬边界|`clControllerNeutral`, `d13Unknown`, `releaseEligible`, `materialSweepSimulated`；CAP-07-03-T17 / CAP-07-03-T18 / CAP-07-03-M09|
|C0703-R10|Owner CAS权限、取消晚回执与非破坏回退|`expectedHead`, `actualHead`, `aclAllowed`, `taskGeneration`, `receiptGeneration`, `cancelled`, `rollbackNonDestructive`；CAP-07-03-T19 / CAP-07-03-T20 / CAP-07-03-M10|
**风险及验证：** 面法向多解、姿态多解/奇异位形、碰撞体不完整、控制器差异、回执晚到与并发覆盖均须真实独立消费者重验。本轮只有10正/10反/10差异变异的**合成静态规划检查**，真实OCCT、Node文件运行、后处理、机床、D15消费者、L3/Owner会签均为NOT_RUN/PENDING。**规划PASS≠产品PASS。**
