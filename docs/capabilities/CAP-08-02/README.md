# CAP-08-02｜控制器与机床方言（V0.8原编号，L3待审）

**业务来源**：11域88 CAP中的08域第02项“控制器与机床方言”，原文定义“FANUC、SINUMERIK等命令适配”，原编号工作包 E3-02 / E3-03 / U4-04。当前是规划，不代表支持任何特定控制器。

## 一、业务能力与边界

同一控制器品牌下不同型号、NC软件版本、授权选件、参数配置可能产生不同的NC语义。建立`ControllerDialectProfile`不可变版本，包括`vendor/controllerModel/firmwareRevision/optionSetHash/dialectId/profileRevision/profileHash/supportMatrix/initialModalState/semanticProviderVersion`，由D03资源能力引用，D10执行绑定锁定；D09仍是无机床绑定的中立CL。不得凭机床名称或类似G/M字母假定兼容。公开LinuxCNC、Haas和Siemens资料只能作为**不同版本方言的证据样本**，并非实际B5或FANUC/SINUMERIK通过证书。

权威链路必须保持`D09中立CL → D12实际NC生成 → D13独立逐字节重新解析并执行控制器语义 → D14轴运动时序 → D15 NC级工程验证 → D16签发`；D11只负责CL预检查。D04 Setup及工件局部坐标、D10机床/控制器/装配执行绑定分离。未知宏、循环、RTCP、坐标补偿、控制器选件一律明确`UNKNOWN`并阻断需要对应语义的发布，不得使用“通用G代码”默认值抹去未知。禁止用CL动画或材料扫掠画面冒充工程验证。

## 二、十项可实施任务与拒绝逻辑

1. **精确控制器方言与配置组合锁**：缺D10、固件/选件或Profile精确版本不得获得已支持资格。消费字段 `binding.d10Hash`、`dialect.profileHash`、`dialect.versionKnown`、`dialect.controllerOptionKnown`；源证据 DIA-SRC-ISO6983、DIA-SRC-SIEMENS-INDEX、DIA-SRC-RFC9110；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
2. **D09中立CL不得夹带机床方言**：D09保持刀位意图，目标控制器语法只能进入D12及D13。消费字段 `cl.machineSpecificCode`、`cl.frameKnown`、`cl.owner`、`post.usesExactCl`；源证据 DIA-SRC-NIST6556、DIA-SRC-ISO6983；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
3. **逐字法与指令白名单及选件适用性**：未列出指令、选件与控制器行为须UNKNOWN/阻断而非按类似G码猜。消费字段 `coverage.lexicalSubsetKnown`、`coverage.requiredCodesDeclared`、`coverage.unlistedCodeBlocks`、`coverage.licenseAndOptionKnown`；源证据 DIA-SRC-LINUX-GCODES、DIA-SRC-HAAS-GCODE、DIA-SRC-HAAS-MCODE；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
4. **模态组、初态、单位及WCS显式定义**：缺模态初态不能沿用其它控制器默认值。消费字段 `modal.initialStateKnown`、`modal.groupTableVersioned`、`modal.unitsKnown`、`modal.wcsKnown`、`modal.arcCenterModeKnown`；源证据 DIA-SRC-LINUX-MODAL、DIA-SRC-LINUX-GCODES；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
5. **方言模式切换必须有目标版本支持证据**：不可根据相似厂牌或G代码编号自动切方言。消费字段 `switch.modeExplicit`、`switch.versionedManualEvidence`、`switch.noImplicitFallback`、`switch.controllerIdentityPinned`；源证据 DIA-SRC-SIEMENS-INDEX、DIA-SRC-HAAS-GCODE、DIA-SRC-LINUX-MODAL；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
6. **宏、循环、子程序和预算上界**：未知分支/宏变量/循环绝不可静默当G1通过。消费字段 `flow.expansionBounded`、`flow.parametersResolved`、`flow.callBudgetKnown`、`flow.unmodeledIsUnknown`；源证据 DIA-SRC-NIST6556、DIA-SRC-LINUX-GCODES、DIA-SRC-HAAS-MCODE；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
7. **WCS、刀补、RTCP与运动学边界**：OCCT刚体变换不能冒充控制器刀补/RTCP或轴运动判定。消费字段 `frame.d04D10Separated`、`frame.compensationDefined`、`frame.rtcpUnknownExplicit`、`frame.exactVersionPinned`；源证据 DIA-SRC-OCCTTRSF、DIA-SRC-LINUX-GCODES；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
8. **原始NC字节不可变与逐行双向溯源**：手工修改NC必须分叉修订，合成行记录原因。消费字段 `mapping.ncBytesImmutable`、`mapping.lineProvenanceComplete`、`mapping.syntheticLineReason`、`mapping.d13ReReadsExactBytes`；源证据 DIA-SRC-PROVO、DIA-SRC-NIST6556；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
9. **同Owner领域端口的CAS/权限及取消晚回执**：GUI/CLI/Agent不能越过08域Owner提交，撤销与晚回执不写入。消费字段 `commit.expectedRevision`、`commit.authorized`、`commit.scopeFrameRechecked`、`commit.generation`、`commit.cancelled`；源证据 DIA-SRC-RFC9110、DIA-SRC-PROVO；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。
10. **独立D13/D14/D15阻断D16、变更失效与回滚**：D11/CL预览不等同最终NC验证，UNKNOWN和旧版本证据不能授权发布。消费字段 `gate.d13ReadsExactD12`、`gate.d14AndD15Independent`、`gate.unknownBlocksD16`、`gate.clPreviewNotNcApproval`、`gate.immutableHistoryAndRollback`；源证据 DIA-SRC-NIST6556、DIA-SRC-PROVO、DIA-SRC-RFC9110；实施归属E3-02（版本化后处理配置）、E3-03（独立NC语义）、U4-04（来源和诊断联动）。

## 三、领域数据、接口与状态机

建议端口：`DialectProfilePort.readExact(controllerId,firmwareRevision,optionSetHash,revision,hash)`只读；`D12.Postprocess.preview(clExactRef,d10ExactRef,profileExactRef)`只生成候选NC；`D13.Execute.parseAndNormalize(ncBytesHash,d10ExactRef,profileExactRef,initialModalState)`独立消费NC原始字节并生成规范动作与模态日志；`Owner.commitCAS({actor,scopeEpoch,expectedRevision,frameRef,taskGeneration,cancelled,candidateHash})`负责事务提交。GUI/CLI/Agent调用同一08域用例，不另外建一个Agent可写接口。

状态建议：`UNRESOLVED_PROFILE → STATIC_CANDIDATE → D12_GENERATED → D13_UNKNOWN|D13_KNOWN → D14_NOT_RUN|D14_READY → D15_NOT_RUN|D15_VALIDATED → D16_ELIGIBLE`。任何未建模或失配状态维持UNKNOWN/NOT_RUN，不能被UI展示换成PASS；D16资格由独立09、10域Owner校验且按原文要求人工审批。D12源程序Hash、D13解释器版本及D10控制器/Frame精确版本须互相绑定，`N`行号不可假设全局唯一。

独立Owner：D03由02域，D04/D10由04域，D09由07域，D12/D13由08域不同子模块，D14/D15由09域，D16由10域。C0只承载标识、版本、单位、Frame、scope、权限与CAS，不存储全部方言语义。A/B共用源事实，D08冻结及历史D12/D16不可原位改写。

## 四、事务、失效、迁移与回退

预览仅输出只读草稿与风险说明；commit时重验ACL、CAS、Frame、scopeEpoch、任务代次及cancel token。Abort只是尽力中止计算，已到达Owner的迟到回执必须比对任务代次；取消后不提升采纳。厂商方言Profile、D10机床执行绑定、NC原始字节、D09源修订任一变化，将旧D13-D16证据标STALE，历史版本保持追加只读。旧工程无控制器版本时按`LEGACY_UNRESOLVED`只读加载并要求人工选择，不批量重写数据库；Expand→Migrate→Contract需保留旧Reader、回退组合锁和离线凭证。

## 五、GUI/3D与操作动作

NC ActivityRail进入**统一左UnifiedTaskPanel**：控制器型号+固件+选件Hash、方言/支持范围、模态初态、NC逐行来源、D13语义事件和UNKNOWN原因。单Babylon世界仅显示轨迹/Frame选中叠加和轴播放结果；不能新建第二Scene或把D13当作渲染端推断。最大字体12px，仅浅深主题，进度仅显示真实阶段。具体见[UI实施](UI.md)。

## 六、来源、规则、独立验收

[10项真实核对来源](../../../research/sources/CAP-08-02.json) → [专题研究与阅读限制](../../../research/topics/R-DIALECT-PROFILE-001.md) → [10条字段级可执行规则](../../../research/traces/CAP-08-02.json) → [30项正反、独立变异合成夹具](fixtures.json) → [独立消费者与回退](independent-consumer-handoff.md)。[17资产候选Owner](asset-owner-candidates.json)待跨域签署；[本轮合成校验器](../../../tools/check_cap0802_planning_2026_10_26.cjs)只检规划规则。真实FANUC/SINUMERIK/B5手册适用性、D13解析器、NC、D14/D15与现场独立消费者`NOT_RUN`；L3/Owner`PENDING_HUMAN`。**规划PASS≠产品PASS。**