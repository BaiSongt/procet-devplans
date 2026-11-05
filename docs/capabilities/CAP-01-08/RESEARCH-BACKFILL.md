# CAP-01-08｜扩展与集成入口研究补证

原详细规格已经计入26/88，本补证不增加CAP计数，L3待评审、产品NOT_RUN。

[原业务规格](../batch01-v0.9.1/01_功能规格/CAP-01-08_扩展与集成入口.md) · [研究专题](../../../research/topics/R-EXT-001.md) · [7来源](../../../research/sources/CAP-01-08.json) · [追踪10规则](../../../research/traces/CAP-01-08.json) · [20正反验收](fixtures.json)。

业务Owner：平台Host拥有模块注册、贡献、集成组合锁和Gateway，但制造C1资产仍由对应领域Owner唯一写入。公共C0只有身份、单位、Frame、修订和作用域。GUI/CLI/Agent同一领域入口；ActivityRail和唯一左TaskPanel，单Babylon世界。UI激活/Worker就绪/当前权限/领域提交是独立状态，A/B共享事实不覆盖冻结。3D预览只形成租约，不是Approved数据。

## 规则→字段→来源→工作包→正反验收

**EXT-R01** 检查模块manifest的ID、权限、Producer hash、命名空间并拒绝冲突

字段：moduleId、producerHash、permissionScopes、manifestVersion；资产：D17；包：B0-04、U4-06；来源：SRC-EXT-003、SRC-EXT-004；测试：CAP-01-08-AT-03、CAP-01-08-AT-09。

**EXT-R02** UI激活与Host backendReady独立；无Worker握手禁止写操作

字段：uiState、backendState、workerExactHash；资产：D17；包：U4-06；来源：SRC-EXT-001、SRC-EXT-002、SRC-EXT-003；测试：CAP-01-08-AT-01、CAP-01-08-AT-10。

**EXT-R03** GUI/CLI/Agent均经Host真实Actor、scope和权限重验

字段：sessionActor、scope、operation；资产：D01、D17；包：B0-01、U4-06；来源：SRC-EXT-001、SRC-EXT-002；测试：CAP-01-08-AT-06、CAP-01-08-AT-11、CAP-01-08-AT-14。

**EXT-R04** 比较expectedRevision、确切hash和frame才CAS提交；成功依Owner回执

字段：expectedRevision、sourceHash、frameRef、commitReceipt；资产：D04、D10；包：F1-01、U4-06；来源：SRC-EXT-002、SRC-EXT-005；测试：CAP-01-08-AT-12、CAP-01-08-AT-13。

**EXT-R05** 注册single-flight及贡献唯一Owner；停用必须撤销3D/事件租约与迟到回调

字段：leaseId、activationEpoch、disposeReceipt；资产：D17；包：U4-06、T5-03；来源：SRC-EXT-002、SRC-EXT-003；测试：CAP-01-08-AT-02、CAP-01-08-AT-05。

**EXT-R06** 组合锁需记录源码SHA、二进制hash、schema、旧Reader和逆迁移

字段：producerCommit、binaryHash、schemaVersion、rollbackRef；资产：D16、D17；包：B0-04、T5-06；来源：SRC-EXT-004、SRC-EXT-006；测试：CAP-01-08-AT-07、CAP-01-08-AT-16。

**EXT-R07** 结构化错误含字段和恢复动作，不外泄客户路径或凭据

字段：errorCode、fieldPath、recoverAction；资产：D17；包：T5-03；来源：SRC-EXT-002、SRC-EXT-007；测试：CAP-01-08-AT-04、CAP-01-08-AT-15。

**EXT-R08** 取消或跨工程后迟到回执只审计，不采用；按scopeEpoch隔离

字段：projectId、scopeEpoch、adoptionState；资产：D01、D04；包：W2-04、U4-06；来源：SRC-EXT-002、SRC-EXT-005；测试：CAP-01-08-AT-13、CAP-01-08-AT-18。

**EXT-R09** 单Babylon世界及统一左TaskPanel；3D预览不提交；共享域端口

字段：rendererHostId、taskPanelId、previewLease；资产：D04、D17；包：U4-01、U4-06；来源：SRC-EXT-001、SRC-EXT-003；测试：CAP-01-08-AT-08、CAP-01-08-AT-17。

**EXT-R10** 外部适配限制最小授权；D04/D10分离；CL→NC→D13→D14→D15→D16未知语义保留unknown

字段：adapterTrust、dataScope、D04Ref、D10Ref、D13Status、D15Ref；资产：D04、D10、D13、D14、D15、D16；包：T5-06、U4-06；来源：SRC-EXT-001、SRC-EXT-006、SRC-EXT-007；测试：CAP-01-08-AT-19、CAP-01-08-AT-20。

## 业务恢复和实施门禁

Actor取Host session，不相信客户端payload。保存前CAS比较确切revision/hash/frame与授权；失败保留原草稿。停用释放贡献/Overlay/PreviewLease，取消后成功回执只留审计。升级/回退锁定Producer exact SHA/二进制hash、schema与逆迁移，旧Reader和独立消费者验收必须实际执行。D04工艺Setup不得冒充D10机床执行绑定；NC工程验证要解释最终NC，不由CL动画取代，控制器未知语义显式unknown。客户数据不外传。

本轮只完成规划结构及6次故意错误变异校验，未运行Rust、TS、Tauri、Babylon、CLI/Agent、NC、Windows或实机；独立消费者/人类审查待办。
