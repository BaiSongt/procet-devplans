# E3-06｜受控发布与离线接收的GUI/3D/CLI/Agent契约

**仅规划，未连接真实发布或现场设备。** 单Babylon Scene、统一左侧TaskPanel，浅色/深色两主题，所有界面字号不大于12px；Ribbon/NC Workbench/Agent/CLI均进入D16同一领域Port，不另建第二套审批状态机。

## 六步业务向导
1. **选择范围**：工程→文档→工艺Setup→D08冻结基线→D12最终NC；展示D10执行偏置和机床D03构型引用。错机床必须人工显式重选，不自动代入“最近资源”。
2. **闭包诊断**：表格中逐行显示D12原始字节SHA、后处理配置、D13 profile和未知指令、D14运动时序、D15运行证据/验证策略，各项EXACT/STALE/UNKNOWN/NOT_RUN；某个必需UNKNOWN不可显示可发布。
3. **审查与批准**：独立QA消费者只读复算；申请人、审查人、批准人及策略版本都显示可审计身份，不自动生成批准。按钮依次为“请求复核”“提交人类审批”“生成候选包”，未有正式批准时禁用实际发行。
4. **离线包预检**：展示逐文件路径、长度和SHA、签名算法/密钥ID及接收方已预装的信任锚摘要。签名/吊销状态未知时为琥珀色UNKNOWN，不能与合成规划PASS共用绿色状态。
5. **现场接收回执**：区分已准备、已打包、已批准、已签发、已接收、已独立验签、已撤销；接收和验签成功依然不是已上机/已加工。
6. **回退/撤销**：列出事件时间线、旧包hash、撤销原因、接收站是否获知；只追加事件和生成新版本，不覆写D08或已发布原包。

## 三维视口与状态一致性
3D仅通过RendererPort在同一Babylon世界标亮D04夹具、工件、机床、D14时序对应对象及NC行引用，不渲染一个新的发布Scene。Overlay与TaskPanel共同消费revision，切换工程/Setup释放租约并丢弃晚回执；动画只能说明所显示输入，**绝不作为D15或D16的工程证明**。A/B模式共享同一制造事实，展示模式不改变业务状态。

## 统一Port示意（均属待实施契约）
- GUI：TaskContribution<ReleaseContext> → inspectReleaseClosure → requestEligibilityReview → requestHumanApproval → createOfflinePackage。
- CLI：release inspect/review/package/verify/receipt/revoke，所有写操作必须携带expectedRevision及权限重验结果。
- Agent：只能调用同域工具，工具等待状态显示当前步骤，cancelToken的晚回执丢弃；不得自签、代人审核或发送机床命令。

## 负例与用户提示
签名失配显示具体路径和期望摘要；未知信任根显示BLOCKED_TRUST；撤销快照过期显示UNKNOWN_REVOCATION；NC编辑自动使原资格STALE；并发CAS失败提供只读diff与重新申请而非覆盖。质量与现场操作员必须能导出可复核、无客户私密内容的审计摘要。
