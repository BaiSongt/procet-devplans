# B165｜CAP-02-02 周刃铣削切速、有效直径、进给的量纲与采纳边界（2026-11-04）

**定位：** V0.8原能力CAP-02-02的新增专项研究补证，不增加88项分母；映射原F1-01/F1-02/F1-06/U4-02/U4-03/T5-01。L1/L2不变，L3仍待人审。**规划PASS≠产品PASS。**

## 1 真实问题与结论

同一个CAM工序可以具备正确的理论RPM而产生不正确的F：例如把**每齿进给**错当**每转进给**、把刀具**名义外径**当**当前ap下的有效切削直径**、把**转速限幅后旧进给值**直接沿用。更严重的是，从厂商公式算出候选值，不能代表已验证的材料切削窗口或机床能力。

仅对定义清晰的**周刃铣削示例**：`n = 1000·vc / (π·D_eff)`，其中vc[m/min]、D_eff[mm]、n[rev/min]；`vf = fz·z_eff·n`，其中fz[mm/齿]、z_eff[齿]、vf[mm/min]。Sandvik H79指定的是**ap处切削直径Dcap**，不能对球头、锥刀、可变接触角、非旋转刀具默认使用名义直径。Haas速查表使用318≈1000/π；数值Golden采用精确π，舍入只发生在展示或真实控制器Profile确定的阶段。

### 独立算术反例

D_eff=10mm、vc=100m/min、fz=0.05mm/齿、z_eff=4：理论n≈3183.099r/min、vf≈636.620mm/min。若**已知D10机床最大3000r/min且用户显式接受**，采纳后的n=3000、vf=600mm/min，实际vc≈94.248m/min。不能把旧vf≈636.620保持不变、不能静默夹紧后仍显示100m/min、不能从未知机床或未知材料生成生产建议。以上纯算术，不是该材料/刀具的推荐工况。

Sandvik的Q=ap·ae·vf/1000只适用于对应切削几何/材料去除率的估算，不能代替D07实际局部B-Rep去料体、D15程序工程验证，亦不得引入材料扫掠仿真。

## 2 规则—字段—验收

| 规则 | 字段（完整清单见机器Trace） | 关键拒绝 |
|---|---|---|
| B165-R01 | tool.ref/revision/sha/diameterMeaning | 不能拿名义外径或未知D_eff替换有效切削直径 |
| B165-R02 | formula.vcMpm/diameterMm/rpm/units | 单位、零直径、错误转速拒绝 |
| B165-R03 | feed.fzMmPerTooth/effectiveTeeth/spindleRpm/vfMmPerMin | 不能把齿数或主轴转速误换 |
| B165-R04 | limit.maxRpm/requestedRpm/approvedRpm/userConfirmed | 限幅须用户确认、重算进给并记录新工序修订 |
| B165-R05 | mode.feedUnit/dialectPinned/d10Exact/noImplicitG95 | D12 F与控制器每分/每转语义必须单独绑定 |
| B165-R06 | provenance.source/materialCondition/evidenceGrade/noAutoApproval | 厂商公式或NIST研究摘要非加工审批 |
| B165-R07 | owner.port/expectedRevision/scopeFrameFresh/cancelFencePassed | Owner提交前精确CAS、ACL、Frame、取消Fence重验 |
| B165-R08 | handoff.sameOwnerPort/singleBabylonLeftPanel/ncChainIndependent/frozenRevisionsUnchanged | UI预览不代替NC与冻结工序资格 |

每条1正例、4个严格单字段反例；另8个独立预期数值Golden。Fixture及只读Node检查器可在规划仓运行；本轮仅同逻辑V8在内存中48/48，**未运行独立Node完整文件进程，未运行真实工序消费者**。业务Owner、独立消费者签署均0/17。

## 3 实施接口、界面与失效

D03(Resources)是刀具和CuttingProfile来源Owner，输出`{cutterRef,exactRevision,sha,diameterMeaning,effectiveTeeth,source,materialCondition}`。D05(CAM Planning)仅在用户显式采用后创建`{operationRevision,adoptedSpindleRpm,adoptedFeedMmPerMin,feedMode,sourceProfileHash,reason}`；新资源档案不覆盖冻结D05/D08。D04工艺Setup包含工件/毛坯位置，不等于D10实际机床、刀具安装、控制器Profile执行绑定，数据中的Frame/单位必须随精确修订贯通。

GUI：资源树或统一左TaskPanel展示**来源建议→推导预览→机床约束冲突→显式采纳**；属性可用独立浮窗但归同一TaskHost/Owner用例，Ribbon/CLI/Agent通过相同Port；保持唯一Babylon Engine/Scene/Canvas、浅深主题和≤12px字级。**PreviewLease仅显示，不生成真实采纳回执。**提交之前领域Owner再校验expectedRevision、content SHA、ACL、scopeEpoch、Frame、cancelled、taskGeneration；取消后的晚回执不得误采纳。

采纳改变D05工序参数，应使受影响D09中立CL与D12后处理派生物按依赖图STALE。只有D13重读最终NC及实际D10控制器模式、D14展开轴时序、D15独立工程验证后，D16才有资格另外审查发布。未建模刀具/材料/Profile/F模态均显式UNKNOWN。采用Expand→Migrate→Contract让旧reader只读兼容、历史档案/冻结成果不改写，消费者在新旧两条路径下做数值、Frame和失败回滚验证。

## 4 合法来源、读到哪里、不能推断什么

- **Sandvik Coromant H79**，`Formulas and definitions for milling - METRIC`，厂商公开单页PDF，2026-11-04文本与截图实读：vc、Dcap、n、fz、zc、vf、Q等。出版年月未在该页发现。只能支持公式与量纲，不能证明数值推荐、安全或精度。
- **Haas Automation**，`Mill Speeds and Feeds – Metric`，公开一页速查PDF，2026-11-04文本与截图实读。318为近似系数，不扩展到任意控制器F/工况。
- **ISO 3002-1:1982**（第2版，2024复审确认），仅读ISO官网合法目录和摘要；**付费标准正文未读，未引用条款**。
- **Vogl/Regli/Corson (NIST, 2022)**，切削力估计论文官方出版摘要，非全文。提醒工况评估需独立测量/建模，**未把摘要推断成铣削功率公式认证**。
- **Heigel/Ivester (NIST, 2007)**，车削过程模型自适应论文官方摘要，非全文、非铣削特定材料的切速建议。
- **原CAP-02-02规格**（Git Blob `91da6acdbb121e7cee8d7f3ca9035a8f98c023b3`）与**17资产表**（Git Blob `dad461aec34aefa773a9a22b07b6b742be60e052`）从原GitHub连接器固定HEAD读取；业务Owner/GUI/事务门禁属于**Procet内生规范**，不归因于ISO或NIST。

[7份分级来源](../../../research/sources/CAP-02-02-feed-kinematics-b165.json) → [8条规则及原编号工作包](../../../research/traces/CAP-02-02-feed-kinematics-b165-v08.json) → [8正32单字段反例+8算术Golden](feed-kinematics-b165-fixtures-v08.json) → [Node只读测试入口](../../../tools/check_cap0202_feed_kinematics_b165_v08.cjs) → [验证状态](../../../tracking/cap0202-feed-kinematics-b165-verification-2026-11-04.json)。

**仍待：** 独立Node全文件、D03/D05真实消费、D10实机上限/装夹、D13–D16最终NC、17正式Owner签署、17独立消费者、L3、全仓GFM AST、历史原附件字节。
