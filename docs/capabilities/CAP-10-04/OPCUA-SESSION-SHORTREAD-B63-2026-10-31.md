# B63 CAP-10-04｜OPC UA FileType 会话句柄、短读和收方原字节闭环

**日期2026-10-31｜NEWLY_AUTHORED研究补证，L3待人审。** 不变更原11域88 CAP、36工作包、17资产编号；本研究关联原E3-06/T5-03，沿用原CAP-10-04十项实施任务，不覆盖原规则/冻结事实。

## 关键协议反例

根据OPC Foundation **OPC 10000-20 v1.05.06 §4.2.4**，`Read(length=4)`可以返回不足4字节，File位置按实际读取字节数推进。合成原始八字节`ABCDEFGH`可合法按`ABC`(3)、`DE`(2)、`FGH`(3)、空ByteString(EOF)读取，位置为3、5、8、8。错误实现把“短于请求长度”当EOF，会在收到`ABC`后截断，纵使每次Method响应Good；**空ByteString才表示EOF**。

§4.2.2：Open返回的fileHandle只在当前Session内有效，不能移植到重连的新Session；客户端须重新Open。§4.2.7：SetPosition超过文件末尾时实际位置被设置为EOF，不能把请求位置当恢复成功，需GetPosition独立回读。§4.2.1：Writable和UserWritable不同，写入期间Size可能不准确甚至返回Bad_NotSupported。**这些仅是OPC FileType语义，不是所有OEM机器都提供DNC写入**。OPC-40501-1 §8.1的FileSystem为可选组件。

## 来源、读取深度、适用边界

| ID | 官方/内生来源（作者/版本日期详见登记） | 本轮实读范围 | 局限 |
|---|---|---|---|
| B63-S01 | [OPC Foundation 10000-20 v1.05.06](https://reference.opcfoundation.org/specs/OPC-10000-20/4.2) | §4.2.1–4.2.7公开HTML正文 | 不证明B5/OEM实现 |
| B63-S02 | [OPC/VDW 40501-1 v1.02.0](https://reference.opcfoundation.org/specs/OPC-40501-1/8.1) | §8.1公开HTML | 可选文件端口≠可上机操作 |
| B63-S03 | [Polli/Pardue RFC9530，2024-02](https://www.rfc-editor.org/rfc/rfc9530.html) | 摘要及§1–3 | HTTP digest非OPC要求 |
| B63-S04 | [NIST FIPS180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) | 仅出版摘要 | 未读PDF正文 |
| B63-S05 | [NIST SP800-82r3](https://csrc.nist.gov/pubs/sp/800/82/r3/final) | 仅出版摘要及Rev4初稿提示 | 不宣称读过OT控制具体条款 |
| B63-S06 | [原CAP-10-04固定Blob](README.md) | 原T01–T10及R01–R10 | CAS/ACL/TaskPanel等是Procet内生规则，不是NIST/OPC条款 |

[6份完整研究来源含访问时间](../../../research/sources/CAP-10-04-opcua-file-b63.json)。

## 8规则与机器可检验设计

[8条来源→规则→字段→CAP/原E3-06/T5-03](../../../research/traces/CAP-10-04-opcua-file-b63-v08.json) → [54正反/STALE/UNKNOWN合成样例](opcua-file-b63-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap1004_opcua_file_b63_v08.cjs) → [验证等级](../../../tracking/cap1004-opcua-file-b63-verification-2026-10-31.json)。

- R01：FileType能力、目标机/Profile必须真实确认；未知返回UNKNOWN。
- R02：Session、fileHandle、ack代次和取消Fence绑定；旧Session回执STALE。
- R03：每次Read以返回的真实ByteString长度推进，只有空返回判EOF；非空短读不是EOF。
- R04：SetPosition请求不得超过源长，且必须有GetPosition实际观测证明；不凭Good盲重试。
- R05：Writable、UserWritable及业务Owner ACL分别核对；active NC不可覆盖。
- R06：先聚合原始字节、完整子程序闭包，再由**独立收方**重新计算原始字节Hash。SHA256(`ABCDEFGH`)=`9ac2197d9258257b1ae8463e4214e4cd0a578bc1517f2415928b91be4283fc48`；哈希相等不代表签发授权或NC语义等价。
- R07：提交时重验expected/current Revision/Hash/Frame/ScopeEpoch、ACL、taskGeneration及取消，晚回执不得提交。
- R08：只允许Stage-only候选，不能自动选择程序、CycleStart或授D15/D16资格；GUI/CLI/Agent调用同10域OwnerPort，唯一Babylon Engine/Scene/Canvas、左侧UnifiedTaskPanel、最大字号12px。

## 业务数据、生命周期与真实消费

D16持有已签发D12原始NC及子程序闭包和D15独立工程证据；D17追加收方事实而不覆盖原发布。D03机床资源与D10实际机床执行绑定保持精确Revision/Hash/Frame；D04工艺Setup不得冒充D10。D09中立CL→D12后处理→D13解释→D14 Joint时序→D15验证→D16发布；CL动画不冒充NC工程验证；未知控制器语义返回UNKNOWN，不做材料扫掠仿真。A/B共享事实但不覆盖冻结；旧Reader保留Expand→Migrate→Contract回退。GUI/CLI/Agent共用一个领域Owner，预览和拾取不能获得写权限。真实收方需独立进程读取文件、子程序闭包、设备身份、授权日志，检查断连、权限撤销、重放和字节不符。

**合成PASS等级仅为V8同一判定函数，不是独立Node完整文件执行。** 独立Node、真实OPC/HAL/CNC、Windows、B5/OEM、NC解释与17独立消费者均**NOT_RUN**；正式Owner签署0/17，L3待人工；规划PASS≠产品PASS。
