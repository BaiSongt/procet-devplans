# CAP-03-04｜B22 PMI导入损失清单与制造资格门禁
> 2026-10-29 · V0.8增量研究 · L1/L2不变、L3待人类评审 · **规划PASS≠产品PASS**

## 真实问题
原CAP-03-04已有“导入不能静默丢弃PMI”要求，本次补上机器可核的**分母账本**：从源文件先枚举并固定原始注释ID，再逐项记录`semantic / graphic_only / unsupported / rejected / unread`，以及失败原因；最后独立计算分类统计。只统计Reader成功返回的两个条目而无源3个条目的分母，会把2/3误报成2/2；源枚举不完整时必须标`UNKNOWN`，不能声称100%覆盖。

## 2026-10-29实际联网核阅
- **OCCT 8.0.1 STEP Translator**：Open Cascade，网页未列出版日期，[官方公开正文](https://www.occt3d.com/dev/doc/overview/html/occt_user_guides__step.html)，实读“Geometric dimensions and tolerances / Dimensions / Datums / Tolerances / Presentations”。文档说明部分presentation格式和形状关联存在导入限制（例如字符型presentation未实现）；不能推导任何CAD导入均完整。
- **NIST PMI测试集目录**：NIST，[官方网页](https://www.nist.gov/ctl/smart-connected-systems-division/smart-connected-manufacturing-systems-group/mbe-pmi-0)，实读“Types of Test Cases / FTC / STC”，FTC/CTC为历史互操作测试，STC为2023简化案例；官方提示不是最佳GD&T实践。未下载测试模型。
- **ISO 10303-242:2025 第4版**：ISO/TC 184/SC 4，2025-08，[官方目录及Abstract](https://www.iso.org/standard/84300.html)。仅核对应用范围、出版信息，**未读付费标准正文**；不得编造实体条款或产品符合性结论。
- **NIST AMS 100-10**：Robert R. Lipman、James J. Filliben，2017-10-05，[官方著录/摘要](https://www.nist.gov/publications/guide-nist-pmi-cad-models-and-cad-system-pmi-modeling-capability-verification-testing)；未读PDF正文，支持分开看CAD模型验证与衍生STEP校验，不将源可视标注视为语义无损证明。
- **内部CAP-03-04固定Blob**：`edca5b1b3e1142488760c1a33d14ab46703a76fb`，实读§2/§3/§4/§5；CAS、Owner、GUI/CLI/Agent与D04/D10边界来自Procet自己的设计，不错误归因ISO/OCCT。

所有5项的作者、版本、时间、URL、阅读章节及限制见[来源注册](../../../research/sources/CAP-03-04-pmi-loss-b22.json)。

## 工程措施
8条规则逐项连接外部/内部来源、具体字段、原`B0-02 / F1-03 / F1-04 / T5-02`工作包和独立正反用例，见[规则追踪](../../../research/traces/CAP-03-04-pmi-loss-b22-v08.json)。关键门禁：
1. 精确的sourceArtifactHash、D01 Revision、装配Occurrence、物理Frame与Topology锚点；不得由mesh或Renderer World近似代替。
2. 各source ID的Reader结果不能被filter_map静默过滤；分类计数需从原清单与结果复算，graphic-only和未知修改符不可自动授予制造约束。
3. 锁Reader/解释Profile及源字节哈希，审批`FrozenPmiPackage`必须绑定Source、Profile、Policy。配置升级只能派生新修订，旧冻结与D08/D16历史不得覆盖。
4. GUI/CLI/Agent统一调用03域Owner Port；服务端在真实提交点重新验证CAS、ACL、scopeEpoch、任务代次与取消晚回执。统一左侧TaskPanel内分别展示语义、图形、失败原因和实际来源；只使用单Babylon Engine/Scene/Canvas。
5. D04名义Setup与D10机床执行绑定严格分离；中立D09 CL→D12 NC→D13解释→D14物理轴时序→D15独立验证→D16发布，CL画面不可冒充NC验证，unknown阻断，不做材料扫掠仿真。

## 验收范围
[1正29个独立单字段反例](pmi-loss-b22-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0304_pmi_loss_b22_v08.cjs) → [验证等级](../../../tracking/cap0304-pmi-loss-b22-verification-2026-10-29.json)。合成正例有3项源载荷（2 semantic、1 graphic-only），其hash仅是符合格式的示意文本，并非实际STEP字节。校验器不调用OCCT、不解析真实STEP；独立Node文件执行与NIST模型、GUI、消费者、机床/NC均须单独验收；正式Owner签署0/17，独立真实消费者0/17，L3待人类审批。历史附件原始字节与全仓GFM AST仍未闭合。
