# CAP-10-05｜B65 MTConnect V2.5全局uint64游标、筛选稀疏序列与Agent换代（2026-10-31）

**性质：V0.8补充研究证据，L1/L2、原88 CAP/36原编号包、CAP-10-05原十任务及17资产均不改；L3待人审。** B64研究的是OPC UA Subscription；本轮仅针对MTConnect REST Agent/Streams，**两种协议的序列与checkpoint不可共用**。

## 易出错的数学与协议边界

1. **高精度序列不能使用JS Number**：官方V2.5公开模型将Agent sequence及Streams Header的`firstSequence`、`lastSequence`、`nextSequence`定义为无符号64位值。`2^53-1=9007199254740991`是JS安全整数上限；`9007199254740993`被Number化后会舍入到`9007199254740992`，使去重/续采错乱。Procet内部合同采用规范十进制string保存与BigInt比较，不在JSON中直接序列化BigInt；这是内部技术设计，不是MTConnect要求的JavaScript写法。
2. **Agent实例代次**：官方Agent模型要求在数据buffer清空、重新收集时调整`instanceId`，不能推断每次进程重启都必然清buffer。D03设备UUID/Agent endpoint/Profile/Probe schema与采集检查点同时绑定，旧代次回执返回STALE而非覆写D17。
3. **sample窗口与404**：只有证实`OUT_OF_RANGE`（并结合HTTP响应及规范版本）才记为buffer缺口；普通404可能是资源、路径、路由错误。官方REST Agent允许请求`from=0`经服务端解释为first，本轮B65固定**内部已归一化checkpoint合同**要求from为非零；不能误述成MTConnect禁止合法0请求。
4. **经path过滤的稀疏样本**：Agent全局序列用于多DataItem；选中单DataItem的序列`10,13,17`可合法，不应单凭该序列不连续认定Agent历史丢失。判断GAP需要Header、同Agent实例窗口、传输及明确错误代码证据。若模型不清楚，必须UNKNOWN。
5. **Header next与末尾边界**：只有响应确实包含buffer最后一条Observation时，才能以`lastSequence+1`校核nextSequence。处理uint64最大值缺可核实回卷策略时返回UNKNOWN。空heartbeat是传输控制，不生成新D17机器观测，也不构成D15工程PASS。
6. **先受管落盘后游标前移**：本项目规定D17 `MdcObservationPort.appendCAS`在确切raw hash、revision/hash/frame/scope、ACL/scopeEpoch、cancelEpoch/idempotency通过后受管提交，之后才保存新的续采游标。断线/OUT_OF_RANGE后读取current只是最新快照，不可补造已丢历史或证明NC已经执行。

## 来源→规则→字段→原工作包→独立验收

[六份来源，含作者/版本/时间/URL/实际阅读深度](../../../research/sources/CAP-10-05-mtconnect-u64-b65.json) → [八项字段规则及D03/D17与E3-06/T5-03原编号映射](../../../research/traces/CAP-10-05-mtconnect-u64-b65-v08.json) → [74项固定合成正反/UNKNOWN/STALE/GAP边界](mtconnect-u64-b65-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap1005_mtconnect_u64_b65_v08.cjs) → [分级核验记录](../../../tracking/cap1005-mtconnect-u64-b65-verification-2026-10-31.json)。

各规则具有独立单字段反例及缺证UNKNOWN用例；高位uint64、非法十进制前导零、超限、一般404、已归一化from0、path筛选稀疏、空heartbeat及取消回执单独构造。仅`CANDIDATE_ONLY`指规划候选；`GAP`表示明确缺口，`STALE`表示过期，`UNKNOWN`表示证据不足，`CONTROL_ONLY`不是Machine Observation；全部不代表产品或NC安全通过。

## 界面、Owner与迁移

- 02域D03负责Machine/Agent/Profile/数据项映射，10域D17唯一受管追加观测及检查点。D04仅名义Setup，D10是实际机床执行绑定；二者修订、Frame必须各自引用。
- GUI ActivityRail「现场→MDC」切换左侧统一TaskPanel，唯一Babylon Engine/Scene/Canvas，字体最大12px。将Agent instance、uint64十进制原值、buffer首末、筛选条件和D17持久化状态分开呈现；无有效D10实际Frame就只能无锚点展示。
- CLI、Agent和GUI同用10域`MdcObservationPort`，不能绕过ACL/CAS/Scope或因自动拾取/3D显示取得写权限。
- A/B模式共用事实且不覆盖冻结D08，保留旧Reader影子双读和可回退checkpoint；撤销权限、Scope变化、Agent buffer换代后重读重验，取消晚回执只审计，不覆写冻结数据。
- 中立CL→D12最终NC后处理→D13控制器执行语义→D14轴时序→D15独立验证→D16受控发布，MDC心跳、运行灯及Agent数据不代替NC工程验证，不发CycleStart，不做材料扫掠仿真；未知语义为UNKNOWN。

## 官方资料阅读层级与限制

MTConnect Institute/AMT官方Version2.5 [Agent公开模型](https://model.mtconnect.org/Version2.5/Fundamentals/MTConnectProtocol/RESTProtocol/Agent/)和[Streams Header公开模型](https://model.mtconnect.org/Version2.5/Fundamentals/MTConnectProtocol/MTConnectStreamsResponseDocument/Header/)为本轮实读具体段落，官网未给出可核实正式发布日期不编造。[2.5.0资料目录](https://docs.mtconnect.org/)本轮只读公开文件列表，未读其PDF正文。[Apache Camel Next实现文档](https://camel.apache.org/components/next/mtconnect-component.html)仅为预发布工程对照，不当标准；[NIST SP800-82 Rev3](https://csrc.nist.gov/pubs/sp/800/82/r3/final)只读官方出版摘要，不把Procet业务权限控制冒称NIST正文要求。原[CAP-10-05固定Blob规格](https://github.com/BaiSongt/procet-devplans/blob/2d0d95ca659f5d5fb439eaab7ea915fad4eac29c/docs/capabilities/CAP-10-05/README.md)是内生规则来源，不是实机认证。

**本轮74项只在生成器同一判定函数中执行规划合成检查。独立Node读取远端完整文件、MTConnect实际Agent/多设备压力/重启、D17真实消费者、OCCT/NC/B5/OEM、17正式Owner签署和L3人类审批均NOT_RUN / PENDING。历史附件原始字节与全仓GFM AST也未闭合。规划PASS≠产品PASS。**
