# R-PMI-001｜PMI语义、GPS与AP242交换可用性专题

日期：2026-10-18。范围：支撑[CAP-03-04](../../docs/capabilities/CAP-03-04/README.md)的实施设计；**不等于ISO/ASME符合性认证，不等于Procet产品通过。** 本次仅阅读ISO官方公开目录/摘要、OCCT 8.0.1官方XDE相应章节、OCCT公开STEP读写指南、NIST/MBx-IF测试资源目录；没有取得付费ISO正文。相关来源的完整访问深度、链接与限制见[登记文件](../sources/CAP-03-04.json)和[机器追踪](../traces/CAP-03-04.json)。

## 1. 五种经常被错误合并的对象

1. **模型几何**：B-Rep实体与拓扑对象；可以存在完全无PMI的CAD文件。
2. **图形PMI（presentation）**：标注在视图里的字形、线、面、箭头或三角网格；“可以看到”不是“机器理解了”。
3. **语义PMI（representation）**：机器可识别的尺寸、公差、基准、修饰符、Datum Reference Frame、几何目标关联；须保留类型与解释配置。
4. **制造适用要求**：被指定设计修订、质量人员、标准体系及几何绑定批准的冻结要求；来源语义正确只是前提之一，不能把原始导入即视为生产放行。
5. **验证结果**：真实测量或独立计算按指定解释器、基准建立与方法得到的结论；不由PMI数值在GUI自动宣告合格。

OCCT XDE指南区分机器可消费的semantic presentation与人可读的tessellated presentation，`XCAFDoc_DimTolTool`负责关联dimensions、geometrical tolerance、datums；其能力属于OCCT 8.0.1文件/配置范围。`STEPCAFControl_Reader`语义GD&T支持仍有类型、datum target、构造辅助几何等限制，不应据一个“读取成功”认为完整。Procet现有legacy PMI实现与正式X01 `PmiPort`尚不同步：必须明列`parsed / unsupported / skipped / orphan / manually_confirmed`差异而不是悄悄filter_map丢失。

## 2. 主要标准的准确定位与当前版次

- **ISO 10303-242:2025 Edition 4**：2025年8月发布的AP242受管三维模型应用协议，2022版已撤回。公开摘要可支持交换协议主题与当前版次；没有阅读正文，不能从摘要保证某个Reader支持所有语义PMI实体或自定义修饰符。已有登记`SRC-CAD-002`复用，不重计新增原文。
- **ISO 1101:2017 Edition 4**：2022年审查后确认仍现行，定义几何规格符号表达体系。目录支撑对象范围，未读145页正文，不能编造规则条款、容差区域计算细节或工程默认值。
- **ISO 5459:2024 Edition 3**：GPS基准和基准系统的表示与理解；官方摘要区分specification operator与verification operator。Datum Feature并非机床WCS，展示的A/B/C符号也不等于真实测量建立的基准。
- **ISO 14405-1:2025 Edition 3**：替代2016版的线性尺寸规格（重点涉及圆柱、球及相对平行平面），不能简单把全部长度标注/径向轮廓/功能要求等同于一个“尺寸上下限”模型。
- **ISO 16792:2021 Edition 3**：数字产品定义数据编制、修订和表达实践；截至本次官方目录显示下一版本仍为DIS草案，不可把未正式发布的草案版写成当前已发布标准。ISO 16792支持数据表达流程，几何公差具体解释仍回到ISO 1101/5459等定义标准。

ISO体系与ASME Y14标注语义不能未经核实直接兼容；本专题未取得ASME全文，也不声明跨标准映射通过。**公差值单位、名义尺寸、局部基准、图形呈现、制造目标、控制器偏置**是不同对象，应在语义与端口上显式分开。

## 3. 来源、规则与产品验证桥接

| 规则组 | 来源证据 | 设计选择 | 待测边界 |
|---|---|---|---|
| PMI4-R01/02 | ISO AP242、OCCT XDE/STEP | 拆分semantic、presentation与lossReport | 只有图形标注不能自动生成冻结公差 |
| PMI4-R03/04 | ISO 14405-1、1101 | 结构化尺寸、几何公差与标准解释profile | 线性/角度单位混用、未知修饰符拒绝 |
| PMI4-R05 | ISO 5459、OCCT XDE | Datum Feature、Datum System、WCS分离 | 同名基准不同实例不应误绑定 |
| PMI4-R06 | CAP-03-03与OCCT拓扑参考 | 拓扑绑定必须exact，可失败/歧义 | CAD修订后face split必须人工复核 |
| PMI4-R07/08 | ISO 16792、NIST PMI数据 | 源不可篡改、人工编辑新修订；包冻结受控 | 拟测20正反场景不算当前产品PASS |
| PMI4-R09/10 | 内部F1-01/F1-03/F1-06决策 | typed消费、fail-closed、离线闭包与回退 | CAM legacy副本不构成正式PMI生产适配 |

`ISO公开目录 → 工程设计建议`与`OCCT文档 → 实现可选API`之间没有自动对应。拟议`FrozenPmiPackage`的内容字段、消费门以及批准来源校验是**Procet设计决策**，不能标注“ISO强制要求”。

## 4. 测试与数据许可

NIST MBE PMI项目产生的FTC/CTC（2015年前后）与2023年STC，现经MBx Interoperability Forum提供部分CAD/STEP案例。该网站明确说明原FTC不是GD&T最佳应用范例；应用时需检查具体文件许可、AP版本、semantic/graphic属性和期望解释。利用它们做互操作负例，不意味着通过一组样例就满足ISO、ASME或航空行业认证。可以配合自造“孔径+位置公差+基准A/B/C”模型、仅图形标注案例、孤立datum目标、重复实例和修订后拓扑分裂案例，冻结fixture字节Hash与预期诊断。

## 5. 未决事项（必须显式阻断）

- 实际Procet二进制锁定的OCCT构建、编译flag、AP242 Reader的类型覆盖和数值语义需真实产品核验；官网8.0.1文档不是Procet运行内核证明。
- 正式X01 CAD/PMI Owner的`FrozenPmiRequirements` typed schema尚未冻结、生产provider未绑定；不能把当前`review_annotations`历史桥接提升成唯一真值。
- GD&T中非标准修饰符、基准目标、复合公差区以及ISO/ASME混合解释由质量Owner参与逐类批准。具体数学验证算子及结果不在本CAP范围。
- 独立跨版本拓扑映射、CAD导入loss数、审批资格和离线恢复必须进入真实端到端测试；未建测试标`TODO_TEST_ENTRY`。

## 6. 本次阅读层级声明

ISO五项为官方`catalog_abstract`，未取得付费正文；OCCT 8.0.1 XDE为`section_text`，GitHub OCCT STEP官方源码文档为`section_text`但分支master可能随时间变化；NIST/MBx-IF资源为`section_text`页面目录，没有本轮下载执行其CAD测试文件。2026-10-18查验，不回填旧来源访问日期，也不对厂商控制器/机床做合规承诺。