# CAP-11-08｜统一GUI/CLI/Agent授权与3D说明

使用唯一Babylon Engine/Scene/Canvas，工程世界与制造资源世界横向切换、只保留一个活动3D；禁止并排两个Canvas或右侧Drawer。左侧`UnifiedTaskPanel`唯一容器复用ActivityRail/Ribbon，字体不超过12px，浅/深双主题；Agent独立窗口仅可发起候选。

|状态|统一左面板字段及操作|3D可见反馈|授权/异常|
|---|---|---|---|
|ActionIntent|Principal/Delegation/Project/ScopeEpoch、Dxx exact Revision/Hash/Frame、动作类型|定位目标零件，仅预览|外部文本不得触发权限升级|
|Preflight|ACL、Action Allowlist、Token Audience、DiffDigest、Nonce/Expiry|当前与候选差异叠加|已连接不等于有写权限|
|人类审核|风险、副作用、冻结D08、批准摘要、审批人|冻结部分只读锁标|审批人≠Agent代签，审批非业务提交|
|提交|Owner Port、CAS/ACL/Frame/ScopeEpoch/CancelGeneration重验|Receipt确认后才显示生效|晚回执只可对账，不能复活提交资格|
|NC验证|D04名义Setup/D10机床执行绑定、D12/13/14/15 Hash|CL动画显示CL_ONLY，NC验证独立|D13 UNKNOWN阻D16|
|撤销回退|失效依赖、审计/独立消费者签收|已冻结成果只读保留|NACK返回只读，不得重放撤权写入|

GUI、CLI、Agent都调用相同 `11.ActionAuthorizationPort.propose/preflight/requestHumanDecision/readDecision/reconcile`，实际写入只能到对应的业务Owner Port。模拟画面不表示实际产品实现。界面取证与最大12px约束均需产品独立验证。
