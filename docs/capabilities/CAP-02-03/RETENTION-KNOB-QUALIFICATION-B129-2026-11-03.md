# B129｜CAP-02-03：拉钉、刀柄与机床主轴接口的OEM资格

日期：2026-11-03；基于exact HEAD `e8d772da20d42adb38886e9a317dccfcf9f41b1d`。**这是研究与规划增量，不是物理安全认证。规划PASS≠产品PASS。**

[7来源](../../../research/sources/CAP-02-03-retention-knob-b129.json) → [8规则与原编号包](../../../research/traces/CAP-02-03-retention-knob-b129-v08.json) → [8正32反单字段合成](retention-knob-b129-fixtures-v08.json) → [只读Node校验入口](../../../tools/check_cap0203_retention_knob_b129_v08.cjs) → [验证等级](../../../tracking/cap0203-retention-knob-b129-verification-2026-11-03.json)。

## 实质工程问题
ISO 7388-1:2007官方目录描述7/24锥柄类型，ISO 7388-3:2016描述对应拉钉形式；**只读合法目录/摘要，未读取收费正文或尺寸允差**。同为40号锥度不保证刀柄、拉钉、拉爪与刀库可互换。Haas特定CT40 TSC拉钉04-0201公开45度、5/8-11螺纹及TSC通孔，但这些值**仅限其SKU及OEM适用描述**，不得写为B5或所有BT/CT40的默认值。

Haas SMTC故障文档把错误刀柄/拉钉列为刀袋掉刀或取不出的可能原因，非普适因果证明；Haas维护文档要求检查磨损、损伤及扭矩，其建议维护周期不能替代现场OEM与实际检验证据。夹具、机床配置和实际工况未验证时返回UNKNOWN，而非凭渲染几何批准。

## 数据Owner/端口与失效
D03 Resources负责`machine.spindleHash/revision/frame`、`holder.hash/taper`、`knob.hash/part/angle/thread`与`compat.status/machineHash/oemEvidence`的精确不可变定义；D04只负责名义工艺Setup；D10负责`install.holderHash/knobHash/d10Receipt`的机床实际安装绑定；D17维护`inspection.done/wear/torqueEvidence`与TSC现场观测。名义发布/实装/现场保养/验证四种资格禁止互相替换。**C0只承载身份、单位、Frame、版本、作用域**，不能放入总装配业务巨型公共模型。

GUI/CLI/Agent通过同一`02.ToolAssemblyPort`领域入口执行；仅一个Babylon Engine/Scene/Canvas、横向切换3D世界、左侧唯一UnifiedTaskPanel，字体最大12px。3D预览只产生意图，服务端ACL、expectedRev CAS、ScopeEpoch及cancel/lateAck必须提交时重验。冻结的A/B工艺保留精确旧引用；新拉钉不得改写历史；来源不足的旧字节维持legacy_unknown并显式迁移/回退。

**D04 Setup≠D10执行绑定**。中立CL→NC后处理→D13语义→D14轴时序→D15独立验证→D16发布；CL动画与资源3D只说明显示正常，不得作为NC避碰或发布门禁。D13未知语义为UNKNOWN，不做材料扫掠仿真。

## 来源→规则→字段→原编号包→正反验收
- **RK129-R1**：机器/主轴唯一身份、精确修订、SHA和Frame必须具备。来源RK129-S7；字段machine.id、machine.revision、machine.spindleHash、machine.frame；资产D03、D10；原包F1-02、F1-06；1正/4个独立单字段反例。
- **RK129-R2**：刀柄锥、主轴范围与OEM适配矩阵分开，不可由40号推断互换。来源RK129-S1、RK129-S2、RK129-S5、RK129-S7；字段holder.taper、compat.status、compat.machineHash、compat.oemEvidence；资产D03、D10；原包F1-02、E3-04；1正/4个独立单字段反例。
- **RK129-R3**：Haas 04-0201具体45度和螺纹只用于对应SKU实例。来源RK129-S2、RK129-S3；字段knob.part、knob.angle、knob.thread、knob.hash；资产D03；原包F1-02、F1-06；1正/4个独立单字段反例。
- **RK129-R4**：现场磨损/扭矩检查是独立于资源目录的事实。来源RK129-S4、RK129-S7；字段inspection.done、inspection.wear、inspection.torqueEvidence、inspection.machineId；资产D03、D10、D17；原包F1-02、E3-04；1正/4个独立单字段反例。
- **RK129-R5**：TSC拉钉通孔不能取代管路与密封实际证据。来源RK129-S3、RK129-S4；字段knob.tsc、coolant.pathObserved、coolant.sealEvidence、coolant.claimUniversal；资产D03、D10；原包F1-02、E3-04；1正/4个独立单字段反例。
- **RK129-R6**：D03发布定义不等于D10主轴实装，D04 Setup不具实装写权。来源RK129-S5、RK129-S7；字段install.holderHash、install.knobHash、install.d10Receipt、install.d04AsReal；资产D03、D04、D10；原包F1-02、E3-04；1正/4个独立单字段反例。
- **RK129-R7**：Owner CAS与ACL、scopeEpoch、取消晚回执服务端重验。来源RK129-S6、RK129-S7；字段tx.expectedRev、tx.acl、tx.lateAck、tx.epoch；资产D03、D10；原包F1-02、F1-06；1正/4个独立单字段反例。
- **RK129-R8**：GUI/CLI/Agent共用Owner Port，单Babylon且左TaskPanel。来源RK129-S7；字段ui.gui、ui.agent、ui.worldCount、ui.panel；资产D03、D10、D15；原包F1-02、U4-02、U4-03；1正/4个独立单字段反例。

## 来源阅读深度
- **RK129-S1** ISO/TC 29/SC 9，《ISO 7388-1:2007》，Edition 2, 2007-08；目录/摘要：7/24锥柄类型，深度OFFICIAL_CATALOGUE_ABSTRACT；局限：未读付费尺寸表，非OEM许可。[官网/原页](https://www.iso.org/es/contents/data/standard/04/40/44098.html)，2026-11-03访问。
- **RK129-S2** ISO/TC 29/SC 9，《ISO 7388-3:2016》，Edition 3, 2016-02；目录/摘要：拉钉形式，深度OFFICIAL_CATALOGUE_ABSTRACT；局限：未读正文、无具体拉钉配合值。[官网/原页](https://www.iso.org/es/contents/data/standard/06/88/68845.html)，2026-11-03访问。
- **RK129-S3** Haas Tooling，《Haas CT40 TSC pull stud 04-0201》，online SKU, publication date unknown；Description/Technical Specs：CT40、45°、5/8-11、TSC，深度PUBLIC_SELECTED_HTML；局限：仅指定Haas SKU，不推广B5/OEM。[官网/原页](https://www.haastooling.com/p/04-0201)，2026-11-03访问。
- **RK129-S4** Haas Automation，《Tooling Maintenance - Mill》，Updated 2018-11-30；维护Step 2：拉钉磨损、损伤、扭矩检查，深度PUBLIC_SELECTED_HTML；局限：仅Haas维护参考，非本项目机器寿命认证。[官网/原页](https://haascnc.com/service/troubleshooting-and-how-to/how-to/mill---tooling---maintenance.html)，2026-11-03访问。
- **RK129-S5** Haas Automation，《SMTC Carousel and Pocket Troubleshooting TG0127》，Online revision date unverified；Tool Holders and Pull Studs故障章节，深度PUBLIC_SELECTED_HTML；局限：列举可能原因，不证明任意机床安全。[官网/原页](https://haascnc.com/service/troubleshooting-and-how-to/troubleshooting/side-mount-tool-changer---carousel-and-pocket---troubleshooting-.html)，2026-11-03访问。
- **RK129-S6** Fielding / Nottingham / Reschke，《RFC 9110 HTTP Semantics》，2022-06；§13.1.1 If-Match、§13.2前置条件，深度PUBLIC_SELECTED_SECTIONS；局限：CAS类比，不能代替真实Owner授权。[官网/原页](https://www.rfc-editor.org/rfc/rfc9110.html)，2026-11-03访问。
- **RK129-S7** Procet Planning Authors，《CAP-02-03 internal specification》，fixed blob cf5b23a1114ef58c2b8527bbb45a5995b4c7f8fa；§1-5：资源exact、D04/D10、GUI/CLI/Agent，深度INTERNAL_FIXED_BLOB；局限：内部规则，不归因于外部ISO。[官网/原页](https://github.com/BaiSongt/procet-devplans/blob/e8d772da20d42adb38886e9a317dccfcf9f41b1d/docs/capabilities/CAP-02-03/README.md)，2026-11-03访问。

## 独立验收与风险
合成基线为虚构Haas CT40及D03/D10引用；40例预期只产生`REVIEW_ONLY`或`REJECT_R...`，从不产生可生产安全许可。F1-02验OEM机床/主轴/拉钉和检验，F1-06验版本闭包/回滚，E3-04验D10实装及真实D13–D15独立消费者。下一步需要Node完整文件进程、故意错误变异、物理拉钉/拉爪/OEM/TSC资料、真实独立消费者与Owner会签。当前Owner 0/17、真实消费者0/17、L3待人审；全仓GFM AST与历史原件审计未闭，产品全部NOT_RUN。**规划PASS≠产品PASS**。
