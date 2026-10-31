# CAP-08-08｜后处理配置与一致性（V0.8原编号，L3待审）

**原目标**：配置版本、语法静态检查和生成记录。原编号关联工作包 **E3-02 / E3-03 / U4-04**（据《03_三级能力映射_88项》原文）。本规格只规划，不暗改11域/L1/L2、88 CAP、36包和17资产分母；L3、17 Owner正式会签待人类决定。

## 业务定义与执行边界

07域产生中立D09 CL（非轴时序）；08域以冻结D08、精确D09、D03资源能力、D04 Setup上下文及D10执行绑定为输入，选择经校验的后处理插件、配置属性及控制器方言Profile，得到不可变D12最终NC字节、生成清单和静态诊断。D13独立**重新读取最终NC及子程序闭包**解释控制器语义，D14依D10展开机床轴时序，D15独立工程验证，D16受控发布。D11 CL动画始终标`CL_ONLY`。未知宏、循环、RTCP、坐标偏置等为`UNKNOWN`，不得从`STATIC_PASS`提升为NC/工程/发布PASS；不规划材料扫掠仿真。

配置不是单个名称或下拉选项：有效版本标识为`postPlugin.digest + postPlugin.version + configTemplate.digest + effectiveProperties.digest + controllerProfile.digest + machineProfile.digest + runtime.digest + closure.digest`以及D09/D08精确引用和Frame/单位/作用域。**内容摘要并不能自行证明插件可信或控制器兼容**；安全来源、批准清单、实际控制器能力需独立证据。

## 十项实施级子任务（每项规则→字段→独立正/反/差异变异）

1. **输入精确冻结与帧域一致**：D09与D08冻结输入必须各自锁定修订/内容哈希/Frame/作用域，A/B不得覆写原冻结。 规则`CAP-08-08-R01`；来源C088-S6、C088-S7；字段`input.d09RevisionExact / input.d09HashExact / input.d08FreezePinned / input.setupFrameScopeExact`；资产D08/D09/D04；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P01`/`CAP-08-08-T-N01`/`CAP-08-08-M01`。
2. **后处理制品锁定**：插件包、配置模板、版本、内容摘要和可执行环境均需固定，不以文件名或可见版本号替代字节身份。 规则`CAP-08-08-R02`；来源C088-S2、C088-S3、C088-S6；字段`post.pluginDigestExact / post.pluginVersionPinned / post.templateDigestExact / post.runtimeDigestPinned`；资产D09/D12；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P02`/`CAP-08-08-T-N02`/`CAP-08-08-M02`。
3. **属性白名单与单位规范化**：属性类型、默认值、显式覆盖及单位归一化均需由配置schema校验；未声明属性一律拒绝。 规则`CAP-08-08-R03`；来源C088-S2、C088-S5；字段`properties.schemaRevisionPinned / properties.unknownKeyRejected / properties.unitNormalized / properties.effectiveSetHashed`；资产D03/D12；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P03`/`CAP-08-08-T-N03`/`CAP-08-08-M03`。
4. **机床和控制器Profile兼容**：D03能力档案与D10执行绑定分别锁定，按控制器固件/选件/后处理适用范围校核；未知兼容性为UNKNOWN。 规则`CAP-08-08-R04`；来源C088-S1、C088-S4、C088-S8；字段`profile.d03CapabilityExact / profile.d10BindingExact / profile.controllerFirmwareOptionsExact / profile.unknownCompatibilityBlocked`；资产D03/D10/D12/D13；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P04`/`CAP-08-08-T-N04`/`CAP-08-08-M04`。
5. **语法静态检查与闭包**：按声明方言检查程序块、格式、模态冲突及子程序依赖闭包；静态检查只证明声明子集可解析，不证明控制器执行安全。 规则`CAP-08-08-R05`；来源C088-S1、C088-S4、C088-S5；字段`static.dialectParserVersionPinned / static.subprogramClosureHashed / static.blockSyntaxChecked / static.unknownTokenNotPass`；资产D12/D13；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P05`/`CAP-08-08-T-N05`/`CAP-08-08-M05`。
6. **可重复生成与差异解释**：固定输入/插件/配置/执行环境并复跑，逐字节比对；时间戳、序号等非确定性项必须显式标注并隔离。 规则`CAP-08-08-R06`；来源C088-S2、C088-S6；字段`repro.manifestPinned / repro.byteComparisonRecorded / repro.nondeterminismDeclared / repro.diffNoFalsePass`；资产D09/D12；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P06`/`CAP-08-08-T-N06`/`CAP-08-08-M06`。
7. **来源映射和字节身份**：D09至D12由生成活动建立谱系，保留真实NC字节hash、编码、换行及源片段映射；人工修改为新D12。 规则`CAP-08-08-R07`；来源C088-S4、C088-S6；字段`provenance.generationActivityId / provenance.finalNcBytesHash / provenance.mappingRevisionExact / provenance.manualEditCreatesRevision`；资产D08/D09/D12；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P07`/`CAP-08-08-T-N07`/`CAP-08-08-M07`。
8. **D13独立执行侧重读**：D13以最终NC原字节、Profile和全部子程序闭包独立重读；静态语法PASS不授予D13/D14/D15/D16通过。 规则`CAP-08-08-R08`；来源C088-S4、C088-S5、C088-S8；字段`execution.d13IndependentBytesRead / execution.d13ProfilePinned / execution.unknownRemainsUnknown / execution.noStaticToReleaseShortcut`；资产D12/D13/D14/D15/D16；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P08`/`CAP-08-08-T-N08`/`CAP-08-08-M08`。
9. **级联失效与可回退**：D09/插件/参数/Profile/D04/D10/NC人工编辑任一变化，旧D12-D16有效性状态必须重新审查；保留历史golden和已发布记录。 规则`CAP-08-08-R09`；来源C088-S6、C088-S7；字段`invalidate.dependencyClosureChecked / invalidate.downstreamStaleMarked / invalidate.historyImmutable / invalidate.rollbackPairVerified`；资产D04/D09/D10/D12/D13/D14/D15/D16；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P09`/`CAP-08-08-T-N09`/`CAP-08-08-M09`。
10. **唯一Owner与GUI事务**：GUI/CLI/Agent调用同一个08域Owner UseCase；统一左TaskPanel/单Babylon、提交前CAS/ACL/Frame/代次重验并拒绝取消晚回执。 规则`CAP-08-08-R10`；来源C088-S6、C088-S7；字段`ui.oneBabylonWorld / ui.unifiedLeftTaskPanel / commit.ownerAclCasRechecked / commit.cancelLateAckRejected`；资产D09/D12/D13；原包E3-02/E3-03/U4-04；合成验收`CAP-08-08-T-P10`/`CAP-08-08-T-N10`/`CAP-08-08-M10`。

## 真实用户流程及异常

在NC工作台选择D09精确修订→展示适用D03候选与D10执行绑定（两者独立）→选后处理版本/属性→审阅差异、静态诊断及UNKNOWN→**生成候选**→由08域Owner独立校验输入版本+ACL+CAS+Frame+作用域+任务代次+取消态后提交新D12修订→触发D13、D14、D15重新验证→符合D16审批条件再发布。GUI/CLI/Agent只作命令入口，不各自实现后处理决策。

冲突处理：缺失插件摘要/参数schema/固件选件/外部子程序时不默认为通过；同输入不同输出必须记录明确字节差异和非确定性来源，不能掩饰；取消后到达的Worker或Agent晚回执一律拒绝提交；A/B对同一事实使用Owner共用revision，回流不能覆盖D08冻结和已发布D16。后处理更新、新D09、D04 Setup、D10绑定、D03资源能力或D12人工编辑触发依赖闭包失效并保留不可变历史。支持Expand→Migrate→Contract和旧Reader回退，严禁删除用户数据库。

## 端口与最小公共结构

08域Owner：`readExact(inputRef, scope)`、`validateConfig(profileDigest,propertySchema)`、`generateCandidate(request)`、`staticAudit(finalBytes,profile)`、`commitCAS(candidate,expectedRevision,acl,taskGeneration)`、`invalidateConsumers(changedRefs)`。C0只含assetId、revision、hash、Frame、units、scopeEpoch、schemaVersion与最小消息契约；不将插件实现、控制器模态状态、渲染对象放入C0。D12只由08域Owner权威写入，D13消费者必须独立重读NC字节而非接受后处理器自报的PASS。

## 验收与真实交接

[GUI与3D交互](UI.md) · [机器可读合成合同](contract.example.json) · [30条规则正反字段变异](fixtures.json) · [研究来源](../../../research/sources/CAP-08-08.json) → [理论推导](../../../research/topics/R-POST-CONFIG-CONSISTENCY-001.md) → [规则追踪](../../../research/traces/CAP-08-08.json) → [独立校验器](../../../tools/check_cap0808_planning_2026_10_26.cjs) · [独立消费者与回退](independent-consumer-handoff.md)。

本轮只有规则合成/字段映射检查；真实Node文件执行、实际插件、NC解释器、控制器、机床、跨域消费者均`NOT_RUN`，Owner/L3为`PENDING_HUMAN`。**规划PASS≠产品PASS。**
