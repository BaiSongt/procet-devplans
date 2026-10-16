# R-MET-001｜测量资源、在机探测与计量证据的适用边界

编制于2026-10-17；**理论梳理已编制、待人类及计量Owner评审，未实施任何产品测试或计量认证**。关联[CAP-02-06](../../docs/capabilities/CAP-02-06/README.md)、[追踪JSON](../traces/CAP-02-06.json)。

## 1. 本轮新核对的10项一手来源

| ID | 版本／阅读深度与读取范围 | 支持结论 | 不能推定 |
|---|---|---|---|
| SRC-MET-001 | ISO 230-10:2022 Ed3，2022-03；ISO目录摘要 | NC机床集成探测系统的测试对象含接触探针、扫描、孔规、接触测刀和激光光栅测刀 | “在机探测系统通过”=“机床可作合格CMM” |
| SRC-MET-002 | ISO 10360-2:2009 Ed3，2009-12；ISO目录摘要，2026确认 | CMM线性尺寸测量的验收和复核 | NC机床有探针就等于有同等CMM性能 |
| SRC-MET-003 | ISO 10360-5:2020 Ed3，2020-03；ISO目录摘要，2025确认 | 接触式球/半球测针CMM系统验收和复核，有组合系统性能概念 | 用该标准证明非接触探测或单个测针的全部误差 |
| SRC-MET-004 | ISO 14253-1:2017 Ed3，2017-10；ISO目录摘要，2023确认 | 接近规格限时的合格/不合格判定要考虑不确定度 | 未读正文直接写固定guard band、判定公式和合规证书 |
| SRC-MET-005 | ISO 15530-3:2011 Ed1，2011-10；ISO目录摘要，2022确认 | CMM以已校准相近零件/标准评估测量不确定度的技术及限制 | 移植到任何在机测量都适用 |
| SRC-MET-006 | ISO 23952:2020 Ed1，2020-07；ISO目录摘要，2026确认；另DMSC官网介绍 | QIF面向制造质量的资源、计划、结果等信息联通 | 本项目已完成QIF XML、DMIS执行或GPS解释 |
| SRC-MET-007 | NIST Policy on Metrological Traceability，网页更新2024-06-17；全文网页相关段落 | 溯源是结果属性，需无间断校准链与每步不确定度；溯源不足以证明适用目的 | 设备挂名NIST即可让所有测量结果合格 |
| SRC-MET-008 | Renishaw官网Standard-accuracy machine tool touch probes；官网网页性能段落与产品展示 | 厂商给1.00µm 2σ单向重复性例，校准与组件配置会影响测量 | 把该值当Procet默认探针准确度、整个机床的不确定度或任何温度下保证 |
| SRC-MET-009 | ISO 10012:2026 Ed2，2026-02；ISO官方介绍与摘要，**取代2003版** | 测量管理体系旨在保障测量过程和设备适用性 | Procet资源生命周期已经符合整个质量管理体系 |
| SRC-MET-010 | ISO/IEC 17025:2017 Ed3，2017-11；ISO官方介绍/摘要，2023确认 | 检测和校准实验室能力及公正性要求 | 所有车间操作者/设备都需要或者已经获得实验室认可 |

注：付费ISO标准没有获取完整正文，不能擅自写入标准具体条款；这里只保存官方元数据与自编说明。NIST、Renishaw网页信息按具体读取页面引用，不对当前产品背书。完整元数据、URL和访问深度见[references.json](../references.json)。

## 2. 最重要的理论区分

### 2.1 仪器性能不能替代某次测量可信度

标称重复性、最大允许误差、校准得到的设备性能、一次测量结果的标准/扩展不确定度属于**不同量**，需要分别记录`measurand, statistic, confidenceContext, mode, testMethod, environmentalConditions, calibrationRef`。Renishaw公开的1.00µm 2σ是指定探针系列的性能描述，不可以改写成“实际测孔直径误差±0.001mm”或“机床能保证0.001mm同轴度”。[SRC-MET-008]

ISO 230-10:2022目录特别指出，将带探测器的数控机床当CMM来评估整个测量性能**不属于该文件直接覆盖的范围**。这意味着在机找正可用、在机测量结果可用于过程监控、作为最终产品合格证据是逐层需要更多工程证据的不同场景。[SRC-MET-001/002/003]

### 2.2 测量结果溯源与不确定度链

NIST政策强调计量溯源是特定测量结果的属性：从本次测量结果，经文档化不间断校准链回到所声明参考，每一步关联测量不确定度；NIST不替所有其他组织认证其测量结果。即使溯源链成立，也不自动说明不确定度足以满足工件公差。[SRC-MET-007]

ISO 15530-3:2011讨论以校准工件/测量标准估计**CMM测量结果**不确定度的方法；其适用范围不能无证据拓宽到所有在机测量或任意工况。具体公式、试验设计和相似度标准必须取得合法正文及计量专家评审后再制定，不能用“厂家重复性×系数”代替。[SRC-MET-005]

### 2.3 临界判定与灰区

ISO 14253-1:2017的官方摘要已明确规格边界附近要考虑测量不确定度。CAP选择将`measuredValue`、`uncertaintyStatement`、`decisionRuleRef`、`assessedAt`以及`conformityResult`作为不同字段，并要求只在判定规则被确定且证据有效时才给肯定合格/不合格。具体不确定度覆盖因子与边界算法必须有获授权标准正文或质量规范，不从这份摘要写通用公式。[SRC-MET-004]

**独立反例**：测量结果恰在公差上限，未知不确定度／未选择规则。比较`value<=upperLimit`可能返回true，但这不构成具有有效计量依据的“合格”。本CAP只定义`indeterminate`路径及错误原因，不执行实际合格判定计算。

### 2.4 QIF可组织质量信息但不是NC执行

ISO 23952:2020官方目录与DMSC官网说明QIF横跨制造质量、测量资源/计划/结果。Procet选D03管资源、D17管结果与反馈，采用精确引用串联，不凭QIF的存在自动实现DMIS测量机控制、G-code宏执行、CMM数据采集或完整GPS语义。先明确可表达字段和schema版本，按需求另提与QIF互操作的开发包。[SRC-MET-006]

## 3. 推导出的架构/字段约束

| 规则 | 一手来源与设计类型 | 形成的字段或边界 | 正/反验收 |
|---|---|---|---|
| MET-R01 | 001/002/003范围比较 | resourceKind、purpose、executionCategory | T01、T10、T15 |
| MET-R02 | 008厂商产品资料 | statisticDefinition、conditions、sourceRevision | T05、T06 |
| MET-R03 | 007/010溯源及实验室范围 | calibrationChainRef、resultUncertainty、status | T07、T08、T09 |
| MET-R04 | 004/005标准摘要 | uncertaintyStatement、decisionRuleRef、indeterminate | T14 |
| MET-R05 | 006 QIF范围摘要 | resourceMetadata、measurementPlanRef、D17resultRef | T16 |
| MET-R06 | 009质量体系主题 + E-MET-01内部状态机 | releasedStatus、eligibilityAt、certificateState | T03、T17 |
| MET-R07 | F1-02设计推导（非ISO强制条款） | frameRef、tipCenter、effectiveRadius | T04、T11、T12 |
| MET-R08 | Procet内部CL→NC→语义→运动原则 | controlledProbeSemantics、unsupportedFlag | T10、T19 |
| MET-R09 | E-MET-01/02已有exact引用和用户流程 | exactRevision、expectedLock、requestId、scopeEpoch | T03、T13、T17 |
| MET-R10 | 007/009能力适用条件＋内部fail-closed决策 | missingEvidence、unsupported、offlineClosure | T02、T18、T20 |

模型适用性与算法证据分别归档。上述表里的“T01”均指完整`MET-T01`。未执行的产品测试不得标PASS。

## 4. 真实数据接入前需取得的证据

实际仪器序列与配置；测针球头/延长杆/接收器接口、机床轴树和控制器支持指令的官方手册；有权限的校准证书和校准链；完整可用的不确定度方法与判定规则；环境、温度、触测/扫描工况与实际有效期策略；历史资源版本与证书的保留政策；D17现场质量数据Owner与审批程序。资料缺失可先完成规划，但不能据此放行检测结论、修改机床偏置或发表计量合规声明。

## 5. 进一步研究缺口

需要在后续工程前评审ISO标准正文：在机测头检查的统计指标、CMM应用限制、校准过程、扩展不确定度和判定区域。低成本设备可先做资源目录和版本查询，但不得把支持传感器I/O和支持实际NC探测循环混为一项能力。任何正式引进的QIF profile先建立最小真实往返样本（源→导出→独立reader→差异）并锁定版本。
