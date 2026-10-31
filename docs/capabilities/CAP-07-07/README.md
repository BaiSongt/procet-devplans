# CAP-07-07｜中立CL轨迹契约（V0.8，L3待审）

**B44专项研究**：[中立CL刀轴与后处理机床角隔离](CL-POST-SEMANTICS-B44-2026-10-30.md)。六来源八规则及合成正反未知；原十任务未改，L3/Owner/真实消费者待审。

**原88项业务目标原文**：中立CL轨迹契约｜TCP位姿、刀轴、进给、运动类型与帧。关联原编号 F1-03 / E3-01 / U4-04。11域/88 CAP/36原工作包/17资产分母不变；此页属**详细规划而非设计批准/产品实现**。

## 业务定位与确定的边界
07域CAM Owner将已核对的D01/D03/D04/D05/D07/D08输入生成**新D09中立CL**。D09是编程运动意图，不承诺目标控制器的G/M码、实际机床A/B/C轴、RTCP/TCP控制器行为或执行时序。D04工艺Setup与D10执行绑定分离，不把机床实装偏置写回Setup。三轴/3+2/连续五轴可以共用typed段契约，但姿态方式必须显式，缺运动学证据不可提升为工程验证。

## 十项实施子任务
| 编号 | 必需输入/实现交付 | 异常与验收 |
|---|---|---|
| C0707-01 | 读取D01/D03/D04/D05/D07/D08的revision、contentHash、Frame、scope与冻结闭包 | 旧D08被修改、缺Hash、换Setup不得继续（R01） |
| C0707-02 | 确立右手Setup局部Frame、长度mm、刚性矩阵、单位正交与往返逆变换 | 左右手混淆、镜像、缩放或坐标单位不明则FRAME_UNKNOWN（R02） |
| C0707-03 | 定义TCP为刀尖参考点、刀轴TIP_TO_HOLDER、有符号向量与刀触CC分离 | CC≠TCP，长度/Gauge未确认不得提交（R03） |
| C0707-04 | typed segment序号、起止Pose、运动类型与几何连续性 | 缺段、重复id、端点不连续必须阻断（R04） |
| C0707-05 | 进给意图单位、切削/链接/非切削状态与NC模态隔离 | feed缺单位或直接下发G94/G1不可当中立（R05） |
| C0707-06 | 线性/平面圆弧/螺旋扩展约束，平面、法向、圆心/半径/角度和容差 | 半径、端点、转角矛盾不得静默折线化（R06） |
| C0707-07 | 三轴、3+2、五轴切削姿态标签与D10实际机床执行配置分离 | 3+2索引阶段刀轴不固定不得冒充固定姿态（R07） |
| C0707-08 | 每段绑定D05工序、D07真实前态和D08冻结快照的来源边 | 源版本变化或A/B接管不能偷覆盖冻结（R08） |
| C0707-09 | D11为CL预验证、D12 NC后处理、D13执行语义、D14轴时序、D15验证、D16发布 | D13未知必须UNKNOWN，动画不能给D15 PASS（R09） |
| C0707-10 | CAM领域Owner统一GUI/CLI/Agent提交、ACL/CAS/作用域/代次/取消晚回执和无损回退 | 失效回执拒绝入库，保留旧Revision和旧Reader（R10） |

## 数据模型、数学约束和字段责任
- **精确来源引用**：assetId/revision/contentHash/hashKind/scope/coordinateFrameId/frameRevision/frameHash须来自各业务Owner；读取与提交为两个时点，CAS时重验，禁止“最新默认值”代替exact引用。D08冻结指纹不得被D09更新覆盖。
- **右手与坐标**：Frame含单位、原点、3×3方向基和来源Hash，约定行基还是列基（合成例为行向量列表），要求正交归一、det(R)=+1、无镜像/缩放且往返误差在显式预算内。渲染坐标变换只在RendererPort边界；Babylon坐标不作为数值数据真值。
- **刀具语义**：TCP为经工具组件声明的刀尖参考位置，CC刀触点另列引用，刀轴为从TIP指向HOLDER的单位向量；不得把刀尖到机床轴位置的转换伪装成D09字段。Gauge length需源自D03实际组件。
- **运动片段**：每段含stableSegmentId、序号、start/end、刀轴、运动类型CUT_LINE/CUT_ARC/LINK_RETRACT及可扩展类型、速度意图及单位、Frame和工序材料来源。相邻段连接一致；若有工艺允许的不连续必须为显式跳转与可验证重定位，禁止默认连接。
- **曲线**：圆弧显式圆心、平面法向、半径、方向、扫角和容差；半径须与起终点圆心距一致。Helix另加pitch、层面与端点闭包，属于扩展，**不以圆弧样例冒充Helix认证**。几何检查只证明合成数学结构，不证明加工安全。
- **进给**：标注切削/退让/链接的feedIntent与计量单位，不能把控制器模态G94/G95、G0/G1/G2/G3作为中立内容；后处理拥有方言输出责任，D13再做控制器语义解释。

## 数据流、接口与一致性
GUI/CLI/Agent都调用07域同一Owner Port：`CAMDomainPort.previewNeutralCL/readExactNeutralCL/commitNeutralCLWithCAS`。接口按WorkContext与exact revision返回typed状态，不允许面板或Agent写D04/D08；D09 revision不可变追加，Source→D09 segment血缘可查询。提交前07域Owner必须再次核验ACL、scopeEpoch、expectedHead、taskGeneration、receiptGeneration和取消状态。A/B共享确切工程事实、审查D08冻结范围，不因模式回流覆盖已冻结成果。

**中立CL→D12 NC后处理→D13控制器执行语义→D14机床轴时序→D15独立NC工程验证→D16发布**。D11可用CL预验证，但不进入D15判定。未知指令/偏置/宏/循环必须标`UNKNOWN`并阻断D16，不推测某台机床的实际行为；不做材料扫掠仿真。D10机床执行绑定必须在后处理/解释边界以独立版本引入。

## 失效、迁移与审查门禁
任何Frame/刀具组件/工序顺序/D07材料前态/D08冻结/控制器兼容变更都使相应D09/D11/D12/D13/D14/D15/D16证据链按依赖失效，不能以“重画3D”清除失效。Expand→Migrate→Contract：旧CL reader保留，v0.8新增typed字段通过新D09 revision有来源迁移，独立消费者验收和L3审查通过前不删除旧接口；回退引用旧revision及匹配的派生证据，不删客户数据库。

## 验收、研究与界面导航
[同一Babylon世界与左TaskPanel](UI.md) · [只作合成数据的D09结构](contract.example.json) · [17资产候选Owner](asset-owner-candidates.json) · [独立D12/D13/D14/D15/D16消费者](independent-consumer-handoff.md) · [9项来源及深度](../../../research/sources/CAP-07-07.json) · [理论](../../../research/topics/R-NEUTRAL-CL-CONTRACT-001.md) · [10规则与30正反变异](../../../research/traces/CAP-07-07.json) · [fixtures](fixtures.json)。

规划工具入口：`node tools/check_cap0707_planning_2026_10_26.cjs`；本轮V8等价结构/规则合成检查，**真实OCCT、控制器后处理、Win11/B5、跨域消费者与真实Node文件执行NOT_RUN**；所有Owner会签与L3=PENDING。**规划PASS≠产品PASS。**
