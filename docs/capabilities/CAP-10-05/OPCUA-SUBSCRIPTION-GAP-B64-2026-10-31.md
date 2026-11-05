# CAP-10-05｜B64 OPC UA Publish/Republish时序、ACK和D17落盘资格（2026-10-31）

**属性：V0.8新增专项研究补证；L1/L2及原CAP-10-05十任务不改；L3仍待人审。** 与B63的OPC FileType文件短读不同，本轮研究MDC现场观测订阅。`D17`只是证据记录Owner，不因收到OPC状态或警报成为D13执行解释、D14物理Joint或D15工程验证。

## 必须区分的四个序列

1. **OPC UA NotificationMessage sequenceNumber**：在一个Subscription中从1递增，0不用，最大32位后回卷1；它不是MTConnect Agent的instanceId/sequence，也不是D17资产revision。
2. **keep-alive**：没有Notifications，却携带下一条Notification的序列号；不能据此生成新D17 Observation，也不能将心跳序号作为已持久化消息ACK。
3. **D17持久化序列**：由10域`MdcObservationPort.appendCAS`控制；含机床D03 Profile exact、namespace映射、raw digest、Source/Server/Ingest时间、StatusCode、Session/Subscription epoch及幂等键。网络接收成功不等于Owner提交成功。
4. **D13/D14/D15/D16业务链**：中立CL→NC后处理最终D12字节→D13控制器语义→D14轴时序→D15工程验证→D16发布；采样、keep-alive或D17工单关联不能升级为工程PASS，不做材料扫掠仿真。

## 反例：失联后错误ACK造成永久遗漏

| 步骤 | 客户端观察 | 正确记录/门禁 | 错误做法 |
|---|---|---|---|
| ① | Subscription收到seq=11，有原生状态字节及Hash | 先以D17 CAS+ACL+Scope+取消Fence持久化，附幂等键 | 收到即ACK，再异步落盘 |
| ② | seq=12是keep-alive且Notifications为空 | `CONTROL_ONLY`，不生成观测 | 将seq12写成机器运行证明 |
| ③ | 实际Notification seq12丢失，随后看到seq13 | 保留GAP，先Republish；缺失未知，不按连续插值 | 仅更新仪表盘到13并宣称无丢包 |
| ④ | Republish返回`Bad_MessageNotAvailable` | 历史GAP仍在；ResendData/Read只能帮助恢复**当前值**，不能补回丢失历史 | 用新快照填造旧观测或推断加工已完成 |
| ⑤ | Session转移成功 | 新epoch重新核对ACL/CAS、源Machine/Profile；旧epoch晚回执作STALE | 沿用旧会话回执进行D17提交 |

**重要限制：** `Bad_MessageNotAvailable`也可能出现在正常Republish循环结束；只有在**已知缺口且对应消息未恢复**的上下文中，本规则才将其判为GAP。此门禁是Procet内生业务状态推导，并非OPC逐字规定。

## 从来源到字段及反向验收

本轮规则B64-R01..R08各有源ID、精确字段、CAP和原E3-06/T5-03包以及互不合并的正/反/UNKNOWN/GAP/STALE案例；映射详见[结构化追踪](../../../research/traces/CAP-10-05-opcua-subscription-b64-v08.json)，原始输入见[合成样例](opcua-subscription-b64-fixtures-v08.json)，执行入口见[只读校验器](../../../tools/check_cap1005_opcua_subscription_b64_v08.cjs)。[作者、版本、访问日期及具体阅读深度](../../../research/sources/CAP-10-05-opcua-subscription-b64.json)与[分级核验](../../../tracking/cap1005-opcua-subscription-b64-verification-2026-10-31.json)独立保存。

**判定等级：** `CANDIDATE_ONLY`仅为规划输入在本规则满足条件，`CONTROL_ONLY`只控制状态；`GAP`表示不可作为连续历史消费；`STALE`拒旧会话/修订；`UNKNOWN`保留缺少协议能力或证据；`REJECT`阻断伪写入/权限或不变量。无一个状态表示D15工程通过。

## 执行合同与界面

- **10域Owner**：原生点位经D03设备UUID、固件Profile、namespaceMap revision和D10独立实际Frame（适用时）核实；D17只追加观测，不修改D04名义Setup，不能借DNC写权限写设备。`expectedRevision/hash/frame/scopeEpoch`、ACL、取消代次必须在真正append之前重新核对；晚ACK/旧Session消息仅可审计、不得复活冻结A/B结果。
- **UI**：ActivityRail「现场→MDC」仅切换左`UnifiedTaskPanel`，一个Babylon Engine/Scene/Canvas，最大字12px。以分开图层显示`SubscriptionID/SessionEpoch`、`Notification seq/GAP`、`D17提交/ACK`、质量时钟、独立D16关联；无真实D10 Frame时只给无锚点列表。
- **CLI/Agent**：通过同一个`10.MdcObservationPort`只读inspect或受控append；Adapter只发现能力与观测，不做控制器CycleStart、发布签发、自动D15 PASS。
- **失效迁移**：旧Reader并行影子比对、新Reader附新schema revision，未形成独立消费者证据不能移除旧Reader；GAP/Bad status/不可重传/断线均可回退为只读候选，不删除原始审计或冻结已签发字节。

## 来源阅读范围（2026-10-31联网核对）

- OPC Foundation, OPC 10000-4在线v1.05.07 [§5.14.1、§5.14.5](https://reference.opcfoundation.org/specs/OPC-10000-4/full) 公开HTML具体段落已读。其`availableSequenceNumbers`为空时表示无重传队列支持；并非任何OEM一定支持Republish。
- 同一官方公开正文[§5.14.6、§5.14.7、§6.7](https://reference.opcfoundation.org/specs/OPC-10000-4/full)实读，复连应优先重建SecureChannel/ActivateSession，再视失败转移/新建Subscription；当前值恢复不代表历史完整。
- MTConnect Institute [v2.5.0官方文档目录](https://docs.mtconnect.org/)本轮仅阅读目录版本与文件日期**未读PDF正文**；不从目录推断MTConnect协议行为。
- NIST [SP800-82 Rev3官方出版页](https://csrc.nist.gov/pubs/sp/800/82/r3/final)仅目录与摘要，**未读正文**。本轮`ACK-after-Owner-CAS`、权限重验、GUI/CLI/Agent共享入口等来自[原CAP固定Git Blob](https://github.com/BaiSongt/procet-devplans/blob/623e0252f40a74eca750f83f2fc12e6c223851e8/docs/capabilities/CAP-10-05/README.md)及Procet设计推导，不能称为OPC/NIST强制条款。官网OPC在线页不显示明确版本发布日期，不猜测。

## 尚未完成

本合成不执行实际OPC UA服务、MTConnect Agent、D17独立消费者、真实NC/控制器/B5/OEM或GPU。17资产Owner正式签署仍为0/17，真实独立消费者0/17、L3待人类批准；历史附件原始字节和全仓GFM AST终核仍待完成。**规划PASS≠产品PASS。**
