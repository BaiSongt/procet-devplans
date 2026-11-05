# B180｜CAP-07-06 G28/G30参考点与G53非模态退刀

日期：2026-11-05；业务基线固定Git `6ac447287b191e49b6cad61a7bb7da1c32aef2ca`。仅新增规划补证，**L1/L2不变、L3待审**，非原历史附件字节恢复。

## 工程发现与关键反例

**回到机器参考点不意味着安全退刀**。LinuxCNC 2.9 G28读取已存储的机器坐标参数5161–5169（G28.1设置）；G30使用另一组5181–5189（G30.1），并受TOOL_CHANGE_AT_G30配置影响。命令带轴字时，先沿当前坐标/偏置解释出中间点，再到预存机器点；不带轴字时也不能假定“机床原点就是安全区”。在未读取当前机器参数与是否归零时必须`UNKNOWN_REFERENCE`。

Haas铣床G28示例区分`G28 G90 Z0`与`G28 G91 Z0`：前者先去当前工件系Z0，再回机器原点；后者先进行零长度增量移动再归零；旋转轴的Setting108与控制器设置必须单独钉住。**厂商行为不能推广到其他控制器或B5**。LinuxCNC2.9 G53是非模态机器坐标选择，必须与活动G0/G1及刀补条件一起解析；下一程序段重新按其当前坐标模式解释。Haas G53本轮仅官方搜索摘录，完整正文加载失败，不能冒称实读其偏置细节。

示意（假定初始机器Z120mm，工作坐标零点机器Z100mm，LinuxCNC G28存储Z20mm，G30存储Z40mm，Haas回零目标机器Z0mm）：

| 合成单轴语义 | 中间及最终目标机器Z（mm） | 限制 |
|---|---|---|
| LinuxCNC `G28 G90 Z0` | 100 → 20 | 当前工作偏置仅按平移示意 |
| LinuxCNC `G28 G91 Z0` | 120 → 20 | 必须有已知存储值 |
| LinuxCNC `G30 G90 Z4` | 104 → 40 | 不得混用G28目标 |
| Haas Mill `G28 G90 Z0` | 100 → 0 | 中间段不是机器零点 |
| Haas Mill `G28 G91 Z0` | 120 → 0 | 另有旋转轴设置分支 |
| LinuxCNC `G53 G0 Z0`；下一行`G0 Z0` | 0；下一行100 | G53非模态 |

**这些仅是人为设定单轴平移模型的10个状态Golden，不是实际控制器解释器、TLO/G92、旋转、加减速、机床运动或安全认证。** 机器终点都在0也无法确定途中有无障碍；D15需另证物理关节全时域包络，不能以端点替代。

## 官方资料的可核阅读深度

| 来源 | 作者/版本/发布日期 | 已读位置 | 局限 |
|---|---|---|---|
| B180-S01/S02/S03 | LinuxCNC Documentation Project，2.9，页面日期未知 | [官方G-Code §20 G28、§21 G30、§33 G53](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)正文 | 同一出版物分三条登记，不是三篇论文；未读取实际INI/参数 |
| B180-S04 | Haas Automation，Mill G28，日期未知 | [官方G28 G90/G91/G29示例](https://legacy-aem.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG28.html) | 不代表所有机型和真实轴轨迹 |
| B180-S05 | Haas Automation，Mill G53，日期未知 | [官方搜索摘录](https://www.haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG53.html)，正文未成功打开 | 不依赖未读条款作判断 |
| B180-S06 | Haas Automation，Setting108，日期未知 | [公开Setting108](https://haascnc.com/service/codes-settings.type%3Dsetting.machine%3Dmill.value%3DS108)指定段落 | 真实值和旋转回零未验 |
| B180-S07 | 本仓维护者，固定Git `6ac447287b19` | [CAP-07-06原规格](README.md)实际回读 | CAS/ACL/GUI为内生设计，不是外部工业标准 |
| B180-S08 | Schmitz、Davies、Dutterer、Ziegert，2001-06-01 | [NIST官方出版元数据及Abstract](https://www.nist.gov/publications/application-high-speed-cnc-machining-prototype-production) | 未读期刊正文，不声称G28/G53术语或安全认证 |

[8条分级登记](../../../research/sources/CAP-07-06-reference-return-b180.json)记录访问时间、来源范围、局限；本轮无付费标准正文引用。

## 原编号工作包、字段与责任链

[8规则32字段](../../../research/traces/CAP-07-06-reference-return-b180-v08.json)分管最终NC来源指纹、G28、G30、Haas中间点、G53、完整安全证据、D04/D10分离及Owner入口。8正32个**单字段**反例，加[10语义状态Golden](reference-return-b180-fixtures-v08.json)和[只读Node校验器](../../../tools/check_cap0706_reference_return_b180_v08.cjs)，关联原F1-03/E3-01/E3-03/E3-04/E3-05/U4-04，特别补充[E3-03原包](../../work-packages/E3-03/REFERENCE-RETURN-B180-2026-11-05.md)。

D04属于名义Setup，D10独立管理真实执行绑定：Controller Profile、机器Frame、模态、预存G28/G30坐标、H表、G52/G92、归零状态与版本。D09仅保存中立CL（TCP、刀轴、进退刀意图），不注入G28等机床语义。D12产出最终NC字节Hash，D13重新解释NC，D14展开物理轴时序，D15独立检查完整刀具刀柄/工装/余料的连续风险，D16仅能发布通过的最终NC验证结果；语义未知`UNKNOWN`且阻断发布。CL预览与Babylon动画、OCCT静态距离均不冒充NC认证；不做材料扫掠仿真。

GUI/CLI/Agent复用07域Owner Port与统一CAS/ACL/ScopeEpoch/TaskGeneration/CancelFence，异步晚回执弃用；一个Babylon Engine/Scene/Canvas，左UnifiedTaskPanel、浅深主题、最大12px文字。A/B共享同一冻结事实，D08不可覆盖；D10参考点或配置变更须使旧NC执行派生失效，按旧新Revision影子迁移，回退只读老修订且保留历史D16发布证据。业务Owner需提供exact revision/hash/frame与独立消费者正反运行记录。

## 执行等级

V8同判定函数人工合成50/50符合预期；**独立Node整文件进程NOT_RUN、真实LinuxCNC/Haas/B5/控制器/D13/14/15与17资产消费者均NOT_RUN**；正式Owner签署0/17，L3人工审批、历史附件原始字节和全仓GFM AST终核待办。规划PASS≠产品PASS。
