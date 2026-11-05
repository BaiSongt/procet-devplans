# B178｜CAP-10-03 离线U盘设备/端点隔离与扫描证据资格
日期：2026-11-05。以分支固定提交 `11e6e0f77a79418430850fc6bb119ea009774540` 为原规格；原CAP-10-03、E3-06/T5-03不变，L1/L2不改，L3待人审。

## 实质研究缺口与威胁边界
B48已覆盖Windows路径别名，B100已覆盖D17独立签收，B149已覆盖Flush/重插。本项单独补足物理USB设备类型伪装（HID/Composite、Rubber Ducky）、隔离接收主机、扫描引擎与病毒库版本，以及扫描时原始字节绑定。白名单VID/PID/Serial只是设备准入过滤线索，扫描`CLEAN`只是特定时点的可核对证据；两者不能单独证明设备安全，更不能为机床NC放行。

**四层独立信任**：
1. 设备与接收主机：允许的介质Owner和类型，受控隔离工位，拒绝HID/Composite，禁AutoRun，受控只读或隔离挂载，未知不接触生产设备。
2. 原始字节/签名：D16冻结NC和Manifest分离，对原始NC/子程序逐字节哈希；RFC8785 JCS仅适用于符合I-JSON的Manifest元数据；在离线信任根/有效期/撤销证据不足时阻断。
3. 工程资格：D04工艺Setup不等于D10实际装机绑定；中立CL→D12最终NC→D13解释→D14物理Joint轴时序→D15独立工程验证→D16人工受控签发。CL动画或防毒阴性绝不替代真实NC验证，不做材料扫掠仿真。
4. 现场交接：D17是与发布方独立的接收消费者；旧代次、取消后的ACK仅追加审计，不能反写当前界面、更改D08冻结或伪造上机安全。

## 官方来源核对与阅读限制
| ID | 作者/版本/时间 | 真正读到的内容 | 不能宣称 |
|---|---|---|---|
| B178-S01 | CSA Singapore, 2024-04-24 | [官方USB恶意软件公告](https://www.csa.gov.sg/alerts-and-advisories/advisories/ad-2024-009/)威胁、§1–8卫生建议公开正文 | 扫描阴性/VID白名单即硬件可信 |
| B178-S02 | NIST Ross/Pillitteri SP800-171 Rev3, 2024-05 | [官方出版页](https://csrc.nist.gov/pubs/sp/800/171/r3/final)与摘要；§03.08.07只有搜索摘录，直开HTML未成功 | 不能称阅读控制正文或中国项目合规 |
| B178-S03 | Rundgren/Jordan/Erdtman RFC8785, 2020-06 | [官方RFC](https://www.rfc-editor.org/rfc/rfc8785.html) §1/§3.1/§3.2公开HTML | 元数据规范化等于实际USB或NC认证 |
| B178-S04 | Chandramouli/Hibbard NIST SP800-88 Rev2, 2025-09 | [官方出版页](https://csrc.nist.gov/pubs/sp/800/88/r2/final)摘要/元数据，未读PDF正文 | 不编造清除循环、设备命令和擦除有效性 |
| B178-S05/06 | 原规划固定Git SHA `11e6e0f77a79` | [CAP10-03原规格](https://github.com/BaiSongt/procet-devplans/blob/11e6e0f77a79418430850fc6bb119ea009774540/docs/capabilities/CAP-10-03/README.md)及[88项原文](https://github.com/BaiSongt/procet-devplans/blob/11e6e0f77a79418430850fc6bb119ea009774540/docs/architecture/v0.8/03_三级能力映射_88项.md) | 内生设计不是外部标准，也非产品接口PASS |

完整作者/版次、URL、指定章节、深度及局限见 [source registry](../../../research/sources/CAP-10-03-usb-quarantine-b178.json)。不复制受保护正文。

## 规则—字段—CAP/原工作包—独立正反测试
8规则、32可检查字段、每规则1正4独立单字段反、8组合状态Golden，总计48条规划合成。规则均指向CAP-10-03及原E3-06/T5-03，业务资产D04/D10/D12/D13/D14/D15/D16/D17逐项声明；严格未把外部USB防护建议冒称Owner CAS标准原文。

| Rule | 业务行为 / 关键字段 | 失败态 |
|---|---|---|
| B178-R01 | 精确D16/NC与D04/D10分离：`identity.d16Revision`、`identity.ncSha`、`identity.d04Separate`、`identity.d10Binding` | Blocked/Unknown，禁止静默发布 |
| B178-R02 | 介质Owner/类别/白名单：`media.ownerRef`、`media.approvedId`、`media.deviceClass`、`media.allowlistVersion` | Blocked/Unknown，禁止静默发布 |
| B178-R03 | 隔离工位与USB HID阻断：`endpoint.station`、`endpoint.usbPolicy`、`endpoint.autoRunDisabled`、`endpoint.quarantineMounted` | Blocked/Unknown，禁止静默发布 |
| B178-R04 | 扫描引擎定义库和原始受检字节：`scan.engineVersion`、`scan.definitionsRevision`、`scan.scannedPayloadSha`、`scan.result` | Blocked/Unknown，禁止静默发布 |
| B178-R05 | 签名、原始NC与离线撤销三证据：`integrity.manifestSignature`、`integrity.rawNcShaEqual`、`integrity.manifestCanonicalized`、`integrity.revocationState` | Blocked/Unknown，禁止静默发布 |
| B178-R06 | 最终NC独立工程验证/人工签发：`execution.d13`、`execution.d14`、`execution.d15`、`execution.authority` | Blocked/Unknown，禁止静默发布 |
| B178-R07 | 领域Port/CAS/ACL/取消Fence：`transaction.ownerPort`、`transaction.aclRechecked`、`transaction.casExpected`、`transaction.cancelFence` | Blocked/Unknown，禁止静默发布 |
| B178-R08 | D17独立消费者/接收代次/只追加：`receipt.consumer`、`receipt.encounterEpoch`、`receipt.state`、`receipt.historyAppendOnly` | Blocked/Unknown，禁止静默发布 |

[Trace](../../../research/traces/CAP-10-03-usb-quarantine-b178-v08.json) → [40正反+8 Golden fixtures](usb-quarantine-b178-fixtures-v08.json) → [Node只读门禁](../../../tools/check_cap1003_usb_quarantine_b178_v08.cjs) → [执行等级](../../../tracking/cap1003-usb-quarantine-b178-verification-2026-11-05.json)。固定`epoch:17`与`D16:r17`仅为**合成向量**，真实实现必须与活跃ScopeEpoch、真实修订、设备枚举事件及签收证明动态匹配，不能写死数值。

## OwnerPort与UI/CLI/Agent、CAS/回退
D16发布方和D17接收方分别由10域业务Owner候选管理；扫描器、USB驱动、Agent都不是持久权威。统一拟议`OfflineDeliveryPort`供GUI/CLI/Agent调用，Host/Owner提交点核对`requestId+payloadHash`幂等、`expectedD16Revision`、D10实际资源/Frame/NC SHA、actor/policyRef/ScopeEpoch、权限重验、取消Fence和证据时效。相同请求/同Hash查询实际receipt；同请求异Hash拒绝；切工程后的晚回执不能改变当前状态。

唯一Babylon世界（Engine/Scene/Canvas），统一左TaskPanel显示设备、隔离/扫描、签名/NC及D15资格的分层状态，12px字体限制不变，3D预览只读。旧Reader保留，新增USB证据字段先双读/影子核对，旧记录缺证显示`UNKNOWN_LEGACY`；回退新Reader不覆盖冻结D08/D16或删除D17历史。失效显式传播，禁止带旧批准状态跨版本复用。

## 实施与独立消费者验收入口
`node tools/check_cap1003_usb_quarantine_b178_v08.cjs` 为**计划中的独立Node整文件进程**；本次只以V8相同静态判定逻辑校验48/48合成，实际Node文件、真实USB枚举/HID欺骗、病毒扫描/扫描签名版本、隔离Windows/Linux接收工位、D17独立签收、D13–D15最终NC/B5/OEM、Owner正式签署均标`NOT_RUN`。测试时记录原文件Hash、扫描范围/引擎/definitions、固件与USB类别、时间可信度、D10 Frame、策略Revision及失败/拒绝回执。需要独立消费者以真实数据反向签收，不能自证。

**88/88 CAP和36/36原工作包为规划详编，不代表产品验收。17正式Owner 0/17、独立消费者 0/17；L3、历史原件字节及全仓GFM AST未闭。规划PASS≠产品PASS。**
