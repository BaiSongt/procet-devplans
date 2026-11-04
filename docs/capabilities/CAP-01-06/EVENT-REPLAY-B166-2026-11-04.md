# B166｜CAP-01-06 事件重连与Host Journal补全资格（2026-11-04）

**定位**：原CAP-01-06及B0-01、F1-05、W2-04、U4-02、U4-04、T5-01专项研究补证。11域/88CAP/36原包/17资产编号不变，L1/L2冻结、L3待审批，规划PASS≠产品PASS。

## 研究发现与反例

WHATWG HTML Living Standard（2026-11-04，§9.2.3–9.2.6）规定EventSource的id、Last-Event-ID与重新连接。特别是事件流的**空id会清除浏览器传输游标**。所以**浏览器携带Last-Event-ID=11不证明Host持久Journal仍拥有事件12和13**，也不证明计算成果已经提交。SSE是可选展示传输而非业务Journal的存储或Exactly-once协议。来源：[WHATWG](https://html.spec.whatwg.org/multipage/server-sent-events.html)；[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)。

Procet内生策略以`(streamId,scope,epoch,sequence,exactRevision)`约束事件归属。相同流已采纳11：接收12才可前进；收到13先查12；收到11或10做幂等忽略；过期或日志持久证据不足返回`UNKNOWN_RESYNC`、需固定版本快照对账，不能直接跳到latest。换工程、重试新Job、撤权和取消必须更新Fence，不能让旧流回执覆盖当前领域版本。这一策略是**本仓规划提案**，不是外部标准规定的业务序号格式。

## 可追踪的规则、字段与负验收

| 规则 | 要求 | 领域与字段 |
|---|---|---|
| B166-R01 | 任务流不能跨工程Scope复用 | D01/D06；`stream.id`、`stream.scope`、`stream.epoch`、`stream.revision` |
| B166-R02 | 游标单调前进但不能越过缺口 | D06；`cursor.lastApplied`、`cursor.received`、`cursor.contiguous`、`cursor.gapPolicy` |
| B166-R03 | Last-Event-ID须受Host持久Journal见证 | D06；`resume.lastEventId`、`resume.journalPersisted`、`resume.replayComplete`、`resume.expiryPolicy` |
| B166-R04 | Job成功和成果提交是两种事实 | D06/D09；`result.jobState`、`result.adoptionState`、`result.ownerReceipt`、`result.autoAdopt` |
| B166-R05 | 取消Fence拦截迟到回执 | D06；`cancel.fence`、`cancel.receiptEpoch`、`cancel.lateCommit`、`cancel.disposition` |
| B166-R06 | 单Babylon世界、左TaskPanel与礼貌状态播报 | D01/D06；`ui.taskPanel`、`ui.sceneCount`、`ui.liveRegion`、`ui.fabricatedPercent` |
| B166-R07 | GUI/CLI/Agent使用相同领域Owner并重验 | D01/D06；`owner.samePort`、`owner.exactRevision`、`owner.aclRechecked`、`owner.frameFresh` |
| B166-R08 | 版本迁移与NC下游安全资格独立 | D06/D09/D12/D13/D14/D15/D16；`migration.dualRead`、`migration.frozenUnchanged`、`migration.rollbackTest`、`migration.ncIndependent` |

每条1正4独立单字段反例（合计8正32反），并有8个状态Golden。`cursor`样例为特定规划场景，不是通用状态机定理或实际浏览器协议一致性。完整字段与机器追踪见下方JSON。

## 统一入口及真实Owner责任

Host Job/Dispatcher/Journal持有运行事件，MessageBus仅供视图投影。GUI/CLI/Agent必须通过同一Host/领域Port提交动作；任务详情在统一**左侧TaskPanel**，右侧不建Drawer；工具控件浮于唯一Babylon Engine/Scene/Canvas；任务列表/问题/日志/输出计数可在底部同行显示。W3C [ARIA25](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25) 2026-03-09建议使用`aria-live=polite`播报阶段变动而非每帧抢占焦点；没有分母的进度只能显示阶段，**不制造数字百分比**，真实性能和读屏器仍待测试。

计算`SUCCEEDED`≠领域`ADOPTED`：Owner在提交前重新核对exact Revision/Hash/Frame/ACL/scopeEpoch/取消Fence/CAS，回执持久化后才可改变采纳事实。晚回执隔离；已提交副作用不能通过“取消成功”抹掉。RFC 9110 §9.2.2禁止将未知结果的非幂等重试随意当作安全重放（[原文](https://www.ietf.org/ietf-ftp/rfc/rfc9110.html)），Host具体幂等回执为Procet内生契约。

Expand→Migrate→Contract：旧Task流与新Journal快照先双读对账，保留历史和回退，在独立消费者真实验收之前不拆旧读。A/B共享事实不能覆盖冻结成果。D04工艺Setup≠D10执行绑定；中立CL→NC后处理→D13解释→D14轴时序→D15独立验证→D16发布。CL播放不能冒充NC工程验证，未知语义明确UNKNOWN，不做材料扫掠仿真。

## 来源阅读深度与局限

- **B166-S01**：WHATWG HTML Standard Editors，《HTML Living Standard — Server-sent events》（Living Standard 2026-11-04），§9.2.3–9.2.6（重连/Last-Event-ID/事件流解析）；2026-11-04 公开HTML指定章节实读。[原文](https://html.spec.whatwg.org/multipage/server-sent-events.html)。**边界：**浏览器的重连ID不代表Host Journal持久或业务Exactly-once
- **B166-S02**：Mozilla MDN contributors，《Using server-sent events》（网页访问2026-11-04），Event stream format：id/data/retry；2026-11-04 官方文档指定章节实读。[原文](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)。**边界：**教学文档不承诺有持久事件存储
- **B166-S03**：W3C AG WG，《ARIA25 Using an ARIA live region to convey the status of a progress bar》（WCAG 2.2 Technique，2026-03-09），Description / Tests；2026-11-04 公开页面全文实读。[原文](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA25)。**边界：**非强制技巧示例，实际读屏器合格未验证
- **B166-S04**：R. Fielding, M. Nottingham, J. Reschke，《RFC 9110 HTTP Semantics》（RFC9110，2022-06），§9.2.2 Idempotent Methods；2026-11-04 公开标准指定章节实读。[原文](https://www.ietf.org/ietf-ftp/rfc/rfc9110.html)。**边界：**HTTP方法幂等与领域事务是不同命题
- **B166-S05**：BaiSongt / Procet V0.8，《CAP-01-06 统一任务与事件中心原规格》（9d2394662975f86e82b3183db9a1b8cb46929474），§1–11，L4-04和AT-01..08；固定Git Blob 3ddda5fd98644d10d3347ae38e64c04fc98ae32d；2026-11-04 GitHub固定HEAD规格全文阅读。[原文](https://github.com/BaiSongt/procet-devplans/blob/9d2394662975f86e82b3183db9a1b8cb46929474/docs/capabilities/batch01-v0.9.1/01_功能规格/CAP-01-06_统一任务与事件中心.md)。**边界：**业务Journal/ACL/CAS/Host的内生设计，不冒称外部条款
- **B166-S06**：BaiSongt / Procet V0.8，《AGENTS.md规划协作约束》（9d2394662975f86e82b3183db9a1b8cb46929474），§1–6；Blob ee331883cdcac4c48ae0a5dd73c7c384fed16fe3；2026-11-04 GitHub固定HEAD完整文档阅读。[原文](https://github.com/BaiSongt/procet-devplans/blob/9d2394662975f86e82b3183db9a1b8cb46929474/AGENTS.md)。**边界：**仅本规划仓文档，不意味着产品功能落地

## 验收入口及剩余阻断

[来源](../../../research/sources/CAP-01-06-event-replay-b166.json) → [规则/字段/原包/验收ID](../../../research/traces/CAP-01-06-event-replay-b166-v08.json) → [8正32反及8 Golden](event-replay-b166-fixtures-v08.json) → [只读Node](../../../tools/check_cap0106_event_replay_b166_v08.cjs) → [分层核验](../../../tracking/cap0106-event-replay-b166-verification-2026-11-04.json)。

本轮规划V8内存检查40个规则正反、8个Golden符合预期；**独立Node完整文件进程NOT_RUN，真实浏览器/SSE、Host Journal强杀恢复、权限撤销、17资产真实消费者与Owner签署、全仓GFM AST、历史附件原始字节、L3均未通过**。规划PASS≠产品PASS。
