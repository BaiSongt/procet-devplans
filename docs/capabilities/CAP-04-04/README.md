# CAP-04-04｜工件坐标系与变换图（V0.8）
> 第04域原编号详细稿；本次由2026-10-19真实待入库包的业务约束重新核对编制。L1/L2冻结、L3待人工评审，规划PASS≠产品PASS。

[GUI/3D与多入口](UI.md) · [数学样例](math-examples.json) · [来源](../../../research/sources/CAP-04-04.json) · [10规则](../../../research/traces/CAP-04-04.json) · [20正反验收](fixtures.json) · [理论专题](../../../research/topics/R-FRAME-001.md)

## 一、任务与权责
建立Part、Setup、Fixture、Stock及CAD occurrence间的**可溯源FrameGraphSnapshot**，供特征、工艺、刀路等领域以exact revision/hash消费。D04为唯一持久化写Owner；03域提供CAD occurrence及基准身份、02域提供夹具资源，05/06/07域只读D04快照。D10机床执行绑定（设备、控制器、实际偏置、工具安装）另由执行侧Owner批准；D13控制器执行语义、D14机床轴时序、D15工程验证、D16发布均不在D04伪装完成。17资产、11域、88项能力与36包的既有分母均不变。

公用C0只持有身份、单位、Frame、scope、revision/hash和协议；不要复制工艺、机床、几何大对象。A/B同一工程事实共享、候选可以重新计算，但不得改写已冻结D08（NC）与D16（发布）。

## 二、数据与运算约定
采用列向量左乘：`p_A = (^A T_B) p_B`，`^S T_C = (^S T_P)(^P T_C)`；业务持久化仅允许有限的右手SE(3)刚体，mm/rad，矩阵末行(0,0,0,1)，`RᵀR≈I`、`det R≈+1`。输入UI的degree须显式转rad。OCCT gp_Trsf本身支持镜像和缩放，此处排除是**项目数据契约选择**，不能归咎于API限制。

`FrameGraphSnapshot={projectId,documentInstanceId,setupId,scopeEpoch,revision,contentHash,ownerDomain,unitSystem,nodes,edges,sourceRefs}`。
`FrameEdge={edgeId,sourceFrame,targetFrame,matrix4x4,fromExactRef,toExactRef,sourceHash,occurrencePath,rotationConvention,translationUnit,originKind,quality,evidenceRef}`。
`originKind`限定为CAD_DATUM、FIXTURE_NOMINAL、ENGINEERING_PROPOSAL和MEASURED_WITH_EVIDENCE。CAD/夹具/毛坯引用须包含exact revision、hash、occurrencePath；仅名称或mesh选择不产生持久业务边。循环多路径不一致报FRAME_CYCLE_CONFLICT，无解/歧义报FRAME_AMBIGUOUS；无测量来源不得标为实测。阈值仅按具体测试用例，合成误差阈值不得当制造公差。

## 三、完整业务流程
1. 获取工程、文档实例及Setup的完整scopeEpoch、ACL、expectedRevision/hash，读取D01/D03/D04来源快照；允许直接切换多个Setup，不必回到特征页。
2. 选择具名Frame节点，检查CAD occurrence来源、单位、右手性和多路径一致性；对来源为unknown的边禁用工程确认。
3. 输入矩阵/轴角/四元数及绝对锚点；`落座/对中`只生成幂等proposal，不能隐式平移已有候选、修改毛坯尺寸或伪装接触测量。
4. 3D中展示PreviewLease、原始与候选坐标、异常和受影响资产清单；3D是**预览**，不得因旋转视口而变更CAD/OCCT业务坐标。
5. GUI/CLI/Agent统一走Host→04域的Read/Propose/Preview/Commit；提交前由服务端重新检查ACL、L3审批需求、scopeEpoch、expectedRevision/hash和CAS；取消、切Setup、撤权使旧PreviewLease及晚回执失效。
6. 成功提交追加新的不可变D04修订与影响清单；05/06/07/08/09/10等消费端按exact hash决定重算或显式unknown。失败必须保留原修订及冻结成果，可安全回退候选。

## 四、边界与异常
- 工艺Setup旋转/翻面不等于真实控制器G54、G52、G92；D04不得直接给D10写机床绑定。LinuxCNC的公开语义只能作为该控制器的证据，不能泛化。
- 中立CL→传统NC后处理→D13执行语义→D14轴时序→D15独立工程验证→D16发布；CL动画不得冒充最终NC运行结果。未覆盖宏、刀补、循环时状态为unknown，不通过。
- 实施必须记录FRAME_AMBIGUOUS、SOURCE_STALE、NON_RIGID_MATRIX、FRAME_CYCLE_CONFLICT、EVIDENCE_NOT_MEASURED、D10_BINDING_REQUIRED、RENDER_FRAME_LEAK、STALE_SCOPE_OR_CAS、FROZEN_REVISION_CONFLICT和NC_SEMANTIC_UNKNOWN。
- 无材料扫掠仿真，只有坐标关系与下游失效编排；生成视口预览不构成几何、碰撞或机床认证。

## 五、实施、测试与交接
关联原编号工作包F1-02、F1-04、W2-05、E3-04、U4-02，不新增工作包编号。先冻结FrameGraph契约/样例，再接Host/04域接口、Babylon单世界层、独立消费者及失效清单，最后按fixtures执行20个真实正反用例。业务Owner与独立跨域消费者各自签字，不能用Mock UI覆盖缺少独立消费者的门禁。每条用例的`testEntry`当前为TODO，产品Rust/TS/OCCT/GUI/NC及实机NOT_RUN。由人类评审L3后方可转入代码实施。
