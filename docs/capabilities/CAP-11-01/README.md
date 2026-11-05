# CAP-11-01｜AI工作台与自然交互（V0.8，L3待审）

**88项目标原文：**「人机协同、用户确认和3D上下文」。原编号工作包 [T5-01](../../work-packages/T5-01.md) / [T5-02](../../work-packages/T5-02.md)；不增加CAP、不改变11域/L1-L2/C0最小边界。此CAP解决**交互与授权入口**，工具自主编排另属CAP-11-04，知识库另属11-02/03。

## 业务流程与责任边界

**选择工程/3D对象 → 读取带Owner/exact Revision/hash/unit/Frame的受限只读上下文 → 自然语言生成解释或结构化草案 → 差异/影响域及来源显示 → 显式人类确认 → 业务Owner Port做CAS/权限/取消复核 → 返回受控结果**。AI仅提供建议和只读预览；3D拾取只更新候选选中状态，不能暗中修改工程对象、改变Frame或发送机床命令。

A/B同一事实源，冻结D08不得覆盖；D04名义Setup与D10执行Frame不能混用。D09中立CL→D11 CL_ONLY预检只是预演；D12最终NC原始字节→D13语义→D14Joint时序→D15独立工程验证→D16受控签发才有完整证据链。AI解释、播放、签名、设备运行及D17现场观测均不可自行赋予上机许可，UNKNOWN保留UNKNOWN，不做材料扫掠仿真。

## 失败与异常判别

* 上下文被撤权/跨租户：`REJECT`；原修订/hash/Frame缺失：`UNKNOWN`，不创建虚假默认值。
* 提案后Revision/hash或Scope变动：`STALE`，刷新差异/重新确认；取消后的晚回执：`CANCELLED`，不能落库。
* 检索或工具反馈带指令注入：标记不可信、拒绝越权执行；敏感客户数据不外发。
* 模型、网络、Local LLM或受管Port不可用：标注能力边界，允许明确的只读离线降级，不宣称成功。
* GUI、CLI、Agent经同一领域Port，Agent没有绕开权限的隐式管理员路径。

## 十项可施工任务及字段级门禁

### T01｜工程对象与上下文冻结
用户选择、对象Revision/hash、单位与Frame必须作为读取上下文单快照，拒绝靠文本猜测选择。证据：[C1101-S01、C1101-S07](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R01](../../../research/traces/CAP-11-01.json)；字段：`context.projectScope`、`context.assetExactRevision`、`context.geometryFrame`、`context.explicitSelection`；资产：D01/D04/D10；[1正4反独立变异](fixtures.json)。

### T02｜最小只读上下文
读取前及复用时检查真实Owner ACL、Scope Epoch、原始内容指纹，缺失显示UNKNOWN。证据：[C1101-S02、C1101-S04](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R02](../../../research/traces/CAP-11-01.json)；字段：`read.tenantAcl`、`read.scopeEpoch`、`read.sourceDigest`、`read.unknownOnMissing`；资产：D01/D02/D03；[1正4反独立变异](fixtures.json)。

### T03｜不可信输入隔离
文档、工具结果、屏幕识别均是数据，不得将其中注入文字升级为授权指令，敏感值默认脱敏。证据：[C1101-S04、C1101-S05](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R03](../../../research/traces/CAP-11-01.json)；字段：`input.trustLabels`、`input.injectionIsData`、`input.untrustedTextNoAuthority`、`input.sensitiveRedaction`；资产：D01/D05/D17；[1正4反独立变异](fixtures.json)。

### T04｜草案、预览与人类确认
自然语言仅形成结构化候选，需展示受影响资产、逐字段差异和风险，人类确认仅对确切提案有效。证据：[C1101-S01、C1101-S03、C1101-S04](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R04](../../../research/traces/CAP-11-01.json)；字段：`intent.draftActionOnly`、`intent.affectedAssets`、`intent.diffPreview`、`intent.highRiskHumanApproval`；资产：D05/D06/D08；[1正4反独立变异](fixtures.json)。

### T05｜Owner Port与提交重验
只有业务Owner域Port可提交；提交瞬间核对exact Revision/hash、ACL/scopeEpoch和取消回执。证据：[C1101-S02、C1101-S04、C1101-S08](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R05](../../../research/traces/CAP-11-01.json)；字段：`commit.ownerPortOnly`、`commit.casRevisionAndHash`、`commit.aclRecheckAtCommit`、`commit.cancelLateAckIgnored`；资产：D05/D08/D16；[1正4反独立变异](fixtures.json)。

### T06｜统一3D和面板
只复用活动Babylon世界、单左TaskPanel、最大12px的浅深主题，拾取仅形成只读选择。证据：[C1101-S01、C1101-S09](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R06](../../../research/traces/CAP-11-01.json)；字段：`ux.singleBabylon`、`ux.leftPanelOnly`、`ux.max12pxLightDark`、`ux.selectionReadOnly`；资产：D01/D02/D04；[1正4反独立变异](fixtures.json)。

### T07｜长任务可见状态
规划界面区分等待、工具调用、需确认、取消、重试与STALE，幂等重试不能重放已取消写入。证据：[C1101-S01、C1101-S04、C1101-S08](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R07](../../../research/traces/CAP-11-01.json)；字段：`flow.explicitStages`、`flow.pendingVisible`、`flow.retryIdempotent`、`flow.staleNeverSuccess`；资产：D05/D06/D17；[1正4反独立变异](fixtures.json)。

### T08｜建议可追溯、不冒充工程验证
保存模型/Prompt版本、输入证据及工具回执，不得把AI文字解释或CL动画算作独立D15验证。证据：[C1101-S06、C1101-S07、C1101-S01](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R08](../../../research/traces/CAP-11-01.json)；字段：`prov.promptModelVersions`、`prov.inputEvidenceRefs`、`prov.toolCallReceipt`、`prov.noFalseD15`；资产：D09/D11/D12/D15；[1正4反独立变异](fixtures.json)。

### T09｜离线与UNKNOWN边界
断网场景仅调用已存在离线能力并明示能力缺口，客户原始模型不上传，UNKNOWN不取得D16权限。证据：[C1101-S02、C1101-S04、C1101-S06](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R09](../../../research/traces/CAP-11-01.json)；字段：`offline.noNetworkFallback`、`offline.capabilityDisclosure`、`offline.dataBoundary`、`offline.unknownNoRelease`；资产：D01/D12/D16；[1正4反独立变异](fixtures.json)。

### T10｜同域三入口及迁移验收
GUI、CLI、Agent同业务Port；先影子只读比较，正式Owner会签及独立消费者验收前不切Writer。证据：[C1101-S01、C1101-S07、C1101-S08](../../../research/sources/CAP-11-01.json)；对应[规则 CAP-11-01-R10](../../../research/traces/CAP-11-01.json)；字段：`delivery.samePortAllEntrypoints`、`delivery.shadowOldReader`、`delivery.independentConsumer`、`delivery.ownerSignoffPending`；资产：D04/D10/D16；[1正4反独立变异](fixtures.json)。

## 交互、契约、交接与测试入口

[GUI/3D规格](UI.md) · [Port与安全状态模型](interaction-contract.json) · [17项资产Owner候选映射](asset-owner-candidates.json) · [50逐字段正反+20状态案例](fixtures.json) · [合成校验脚本](../../../tools/check_cap1101_planning_2026_10_27.cjs) · [独立消费者交接](independent-consumer-handoff.md)。

[9份联网合法来源](../../../research/sources/CAP-11-01.json) → [10规则、40字段及原编号工作包](../../../research/traces/CAP-11-01.json) → [70项合成验收](fixtures.json) → [研究推导与适用局限](../../../research/topics/R-AI-WORKBENCH-001.md)。**这里的70/70仅V8内存规划合成，不是Node真实文件运行、浏览器/机床/LLM/独立消费者PASS。**产品及实际Owner会签/L3仍待审。
