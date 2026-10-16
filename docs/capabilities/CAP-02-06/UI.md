# CAP-02-06｜测量与检测资源GUI、字段与3D交互

2026-10-17，评审稿；对应[领域规格](README.md)。本文件是交互设计，不是已开发的HTML或产品界面。仍采用**一个Babylon世界、固定宽左侧UnifiedTaskPanel、主/资源3D空间横向切换、浅/深主题**，3D只做业务投影。

## 1. 入口、上下文与五任务页面

入口A：ActivityRail→制造资源→测量与检测资源，脱离工程也能查看目录；入口B：Setup装夹/检测准备→选择测量设备，必须携带`callerScope={projectId,documentInstanceId,setupId,consumerRevision,editSessionId,epoch}`；入口C：质检反馈的资源引用只读回溯（如产品尚无入口，标future）。

| 左侧任务 | 用户动作/场景 | 3D空间行为（显示不承诺精度） |
|---|---|---|
| 01目录/版本 | kind、来源、状态、适用工况、exact修订对比、只读旧版 | 选中资源时切资源空间，只出现当前一种资源场景 |
| 02装配/安装 | 探针主体、测针/球头、延长杆、接收器、安装接口与相对Frame | 显示参考Frame、tip center、组件层级，拾取仅产生候选 |
| 03性能/校准 | 指标的单位/2σ定义、方向/范围/环境、证书及校准日期、适用组件和状态 | 显示有效测量方向/范围的**示意**；无资格不给绿色工程通过 |
| 04适用性与能力 | 选择intent（Setup找正、工件检测、测刀等）、机床/控制器/接收器、校准证据 | 只预览候选位置、行程/可达性风险，无法模拟真实触发与接收 |
| 05检查与采用 | 分项结果、缺少资料、比较版本、保存草稿/发布资源/采用到任务 | diff overlay + 问题高亮，确认前不会写领域数据 |

资源发布与Setup采用两个按钮，业务语义不同；仅允许在有效上下文出现。资源选择/预览属于无副作用的Query，不能从3D点击直接完成校准或D17写入。

## 2. 字段、单位、来源与读写权

N必填、C条件必填、O选填、D只读派生。新增字段是**拟议映射**，现有ResourceKind未包含Measurement。

| 字段 | 级别/显示单位 | 编辑权与验证 |
|---|---|---|
| resourceExactRef、revision、hash | D；精确标识 | 02域服务；历史不得解析latest |
| kind / family | N；枚举 | 触发测头/扫描/测刀/CMM/手动量具等；未知kind不冒充普通探针 |
| maker、model、serialNumber | C；文本 | 型号可做目录检索，校准按设备序列/组件精确身份，不凭型号推定 |
| measuringModes | N；受控集合 | touch-trigger、scanning、contact-tool-setter、laser-tool-setter、CMM、manual；未声明模式不默认支持 |
| interfaceRef / mountFrameRef | C；父帧/修订/mm | 绑定资源/机床接口；没有实际安装资料填未解而非单位矩阵 |
| body/tip/extension/componentRevision | C；exactRef | 引用版本化组件；换针头导致相关校准资格重新判定 |
| nominalTipRadius / calibratedEffectiveRadius | C；mm | 分别显示，标定值来源/条件必填，不能互相复制 |
| measurementRange / approachDirection | C；mm/轴向单位向量 | 方向定义的Frame、适用环境；非法数或翻转拒绝 |
| performanceQuantity/value/statistic | C；µm、mm、2σ等 | 必有测试条件、来源及统计定义；重复性不标“绝对准确度” |
| temperatureRange / conditions | O/C；°C及其他量纲 | 未给则显示来源不足，不生成默认室温资格 |
| calibrationEvidenceRef/reportHash | C；引用+hash | 质量Owner导入，资源侧只读引用；报告真实性待人工/专业验证 |
| calibrationDate、dueDate/expiryPolicy | C；ISO日期 | 适用规则由质量体系决定；无统一自动有效期 |
| uncertaintyStatement | C；被测量/单位/方法/适用条件 | 是相应结果或评价证据的属性，资源标称值不能自动填为测量结果不确定度 |
| controller/receiver compatibility | C；exact引用+能力声明 | NC语义未建模单项unsupported；缺真实手册不得猜 |
| decisionRuleRef / result | D；消费方 | 只有D17实际检测判定有权产生，不在资源草稿录入 |
| expectedLockVersion、requestId、callerScope | D/交易参数 | 服务端判并发和幂等；变化需重新拉取而非覆盖 |

## 3. 全交互状态

目录：loading/empty/ready/stale/read_error；编辑：readonly/clean/dirty/saving/conflict；校准资料：missing/declared/verified/expired/revoked/unknown（必须来自有权证据）；资格：not_requested/evaluating/eligible/blocked/unknown/unsupported/stale。状态各轴独立：例如资源Released + 校准expired + 接口unknown 不会产生一个含糊“资源OK”。

返回Setup时只写已确认`exactRef+selection`，再由后端核查精确rev/证据/适用范围。关闭脏草稿提供“保留草稿/放弃此次修改/取消关闭”；取消预览移除overlay，不触发领域撤销。服务端提交已成功而客户端超时，用requestId只读查原receipt，禁止重复发布。

`3D`行为：树/列表/3D共用领域实体引用，而非Babylon mesh ID。选择组件高亮，选取接口显示Frame箭头与精确版本；Esc退出拾取、焦点返回字段。资源与主世界切换保留各自相机和选择，但不新建第二Engine。无实体模型可显示明确**非计量用途**线框/尺寸标注，不能推定触发球心、误差或机械干涉真实通过。

## 4. 错误与权限恢复

| 场景 | 应呈现 |
|---|---|
| 无对应设备 | 目录空状态和外部资料导入建议；不能自动插入默认探针 |
| 证书缺失/失效 | 明确`missingCalibrationEvidence`或`expired`及受影响componentRef；目录仍可看 |
| 只有型号未绑定序列 | 历史引用只读待核，不提供“认证可用” |
| 测量模式/NC未知 | unsupported/not_modelled；仍能显示几何，但禁用“生成真实测量/可上机”表达 |
| Frame不合法 | 展示父帧、from/to、字段路径；不能通过翻转Babylon手系掩盖 |
| 同草稿多人改 | 保留本地差异、服务器revision、比较/重新应用明确按钮 |
| 切换Setup之后旧异步回执晚到 | 仅日志保留旧job，绝不更新新Setup/当前机床 |
| 临界判定缺不确定度 | 状态indeterminate/unknown；不擅自使用零不确定度判合格 |
| 离线证据闭包缺项 | staging失败保留当前工程；提供缺失hash清单，不加载伪造校准证书 |
| 退役资源重新采用 | 明确不可新采用；旧工程按exact历史只读可回放 |

状态栏承载单位、Frame、数据资格、任务状态；不要为本功能建立新的主3D屏角HUD。键盘Tab顺序为任务→目录→属性→错误摘要→主操作；错误不能只靠颜色。

## 5. UI正反验收走查（全未执行）

UI-MET-01：目录同名不同序列号→选择测头r1→换测针→旧校准提示不再适用（MET-T03/04/09）。
UI-MET-02：在资源空间显示厂家2σ重复性→尝试直接填写为测量结果的不确定度→UI不给该写入口（MET-T05/14）。
UI-MET-03：Setup-A开始预览后切Setup-B→A响应迟到→B一切领域内容不变（MET-T12/13）。
UI-MET-04：机床缺接收器/控制器探测循环→资源可查看、无法标记执行ready（MET-T10/19）。
UI-MET-05：校准PDF离线缺失、显示Mesh存在→只能浏览示意，不能“计量合格”（MET-T07/08/18/20）。
