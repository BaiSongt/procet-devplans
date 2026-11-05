# B80｜CAP-11-03 多语种引用定位与Unicode代码点证据绑定

2026-11-01｜NEWLY_AUTHORED专项规划，L3待审，源分支exact HEAD `6445751b38417950e80d3a335256bce192ddf87a`。原CAP-11-03十规则、原T5-01/T5-02编号不变。

## 真实风险与数值反例

W3C Web Annotation Data Model（2017 Recommendation）§4.2.4强调文本选择按Unicode **code points**，不按code units；§4.2.5定义首端包含、末端排除的位置。ECMA-262 Edition17 §6.1.4规定JS String位置和长度以UTF-16 code units计。对合成文本`A😀e\u0301结构B`，代码点区间`[1,2)`为完整`😀`，但`text.slice(1,2)`只截取代理项的一半，不是合法证据片段。

此外`e\u0301`是两个Unicode代码点组成的可见字符；代码点位置切在组合标记处可破坏字素簇。Unicode Consortium UAX #29 Rev49（Unicode18.0，2026-09-01）发布扩展字素边界规则。本轮checker**仅处理合成组合标记反例**，遇ZWJ、区域指示符等复杂集群返回`UNKNOWN`，不宣称实现完整UAX29/ICU。

## 业务Owner与工程边界

D01/D02来源的`ownerRevision/currentRevision/rawHash/currentRawHash/snapshotId/frameOrNA/unitOrNA`必须保留exact身份；原始字节Hash与仅供定位的`normalizedText/normalizerId`不可混用。RFC8785 §3.2.1的JCS无Unicode自动归一化，不得借它推定HTML/PDF/OCR归一化一致。W3C TextQuoteSelector有`exact/prefix/suffix`，可能匹配多处；Procet若要求唯一的工程来源，重复且无法消歧时必须`CONFLICT`，这是内部保守门禁而非宣称W3C禁止多匹配。TextPosition的位置更新后脆弱，需绑定受控原件版本及State。

## 八规则及机器验收

|规则|设计规则/字段|失败处理|
|---|---|---|
|B80-R1|D01/D02 Owner精确修订、raw hash、Frame/NA|不一致STALE、缺失UNKNOWN|
|B80-R2|代码点半开区间、规范化器Profile|UTF16拒绝、未知Profile UNKNOWN|
|B80-R3|从代码点按位置提取与EXACT比对|CONFLICT|
|B80-R4|UAX版本、组合字符与可信边界证据|已知截断REJECT、其它复杂序列UNKNOWN|
|B80-R5|quote前后文唯一匹配；不能任取第一个|CONFLICT|
|B80-R6|索引撤权、原始Hash或snapshot变化|REJECT/STALE|
|B80-R7|检索后ACL、ScopeEpoch、租户、CAS和取消态|REJECT/STALE/CANCELLED|
|B80-R8|GUI/CLI/Agent同Owner入口、唯一活动Babylon世界及左TaskPanel；不覆D08、不宣称D15/D16|REJECT|

真实Owner还需在**提交瞬间**重新查询权限/CAS，不能仅依赖合成布尔字段；撤权先失效索引缓存，迁移必须影子读取、独立消费者签署后切换，失败回退旧只读Reader，A/B冻结事实不可覆盖。C0仅最小身份/hash/revision/unit/frame/scope/Port。D04名义Setup与D10执行绑定分离；中立CL→D12 NC→D13解释→D14轴时序→D15验证→D16发布，UNKNOWN不放行，不做材料扫掠仿真。CL动画不等于NC工程验证。

## 合成边界校正与验证层级

N10是范围逆序的负例，不能据此声称测过字素簇拆分。本轮补入N33（起点落在组合重音符上）与N34（终点落在组合重音符前）两个实际边界反例，要求REJECT。它们同时改变起止、quote及上下文以构成完整真实反例，不冒充单字段变异；40例原样保留，总计42例。完整UAX29库、Emoji ZWJ及复杂分词仍NOT_RUN或UNKNOWN。

## 来源—规则—字段—CAP/原包—正反验收

[7项来源/版本/阅读深度](../../../research/sources/CAP-11-03-unicode-selector-b80.json) → [8字段规则与T5-01/T5-02](../../../research/traces/CAP-11-03-unicode-selector-b80-v08.json) → [42合成案例](unicode-selector-b80-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap1103_unicode_selector_b80_v08.cjs) → [执行等级](../../../tracking/cap1103-unicode-selector-b80-verification-2026-11-01.json)。NIST AI600-1和Lewis2020仅出版摘要，未读全文或虚构条款。

V8内存同判定函数显式预期42/42符合；独立Node完整文件、实际归一化器和Unicode UAX29引擎、实际Owner ACL/CAS、真实浏览器与17消费者均`NOT_RUN`，正式Owner 0/17、L3待审，历史原件与全仓GFM AST仍未闭。**规划PASS≠产品PASS。**
