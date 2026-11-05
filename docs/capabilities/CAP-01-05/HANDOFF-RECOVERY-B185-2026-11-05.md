# B185｜CAP-01-05 A/B接管：跨域双见证、ACK丢失与恢复证明



> 2026-11-05｜研究/实施补证，L3待评审，不改变11域、88 CAP、36原包及17资产。规划PASS≠产品PASS。



## 1. 新增问题：领域已写入但工程未发布

A探索和B生产共用一套Project业务事实。D06候选只能由05域Owner显式采纳到D05新草稿，D08冻结不可被新候选或模式切换原位覆盖；01域Host拥有接管编排及可见性索引，不获得D05/D08写权。应把PREVIEWED、STAGED、DOMAIN_COMMITTED、PUBLISHED_VISIBLE分成不同的逻辑状态，而不是跨库单一ACID事务。

SQLite官方WAL §1明确多ATTACH库在WAL下仅各库分别原子，不保证多库整体原子；真实应用是否使用WAL尚未核实。[SQLite WAL](https://www.sqlite.org/wal.html)。因此05域commitMarker与01域Project visible pointer必须分别由Owner提供可核验记录：前者成功、后者缺失时只允许UNKNOWN_RECOVERY，不能把领域写成功误报为接管成功，也不可强行逆写冻结事实。



## 2. 提交和恢复顺序

预览：UI 选择和3D高亮只存SelectionIntent/PreviewLease，不提交。密封：Staging记录逐文件raw-byte hash、长度、Owner、sourceExactRevision/hash/frame、Scope、manifest版本和实际字节；不完整不能SEALED。提交前：服务端重取Host认证主体、权限与ACL epoch，同时由05域重读D05/D08冻结和D06来源，比较Project expected/current Head、Frame、hash、task generation及取消Fence。RFC9110 §13.1.1和§13.2.1为HTTP条件更新与前置条件提供参考，但并非Procet领域事务标准。[RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html)。

05域写入：合法时以唯一commitId产生新D05 Draft，不能直接把D06候选标为已批准。01域发布：读取05域持久commitId及D05 exact revision/hash，写入Project可见关系；两条证据一致才能产生COMMITTED_DRAFT回执，仍不得授NC资格。ACK丢失：客户端按idempotencyKey及原payloadHash查询原commitId；相同键不同字节拒绝重放。取消先赢：旧generation晚回执仅入审计；若提交已胜出，取消不得撤销历史，只能走新修订撤回流程。

重启：独立消费者对比05域commitMarker、01域visible pointer、sealed manifest真实字节与generation。任何缺失、跨Setup或冲突均UNKNOWN_RECOVERY并隔离未采纳工件；不假称数据回滚或恢复完成。W3C PROV-O支持来源表达，但不定义Procet接管状态机，[PROV-O](https://www.w3.org/TR/prov-o/)。



## 3. 字段、端口、GUI与适用边界

机器链将8规则映射32个领域字段：来源project/revision/hash/frame；密封与字节；CAS与ACL epoch；稳定候选与D08冻结；取消代次；幂等键与载荷；双Owner提交见证；三入口/NC边界。C0只保留公共Identity/Revision/Hash/Frame/Scope/CAS，D05/D08归05域，D04名义Setup与D10机床执行绑定分离。GUI、CLI、Agent共用ABHandoffDomainPort.inspect/preview/commit/cancel/reconcile，禁止绕过Owner直写DB。

唯一Babylon活动Engine/Scene/Canvas、统一左侧TaskPanel显示冻结差异、源修订、冲突、恢复指令；主题浅/深。切换Setup后scopeEpoch不同的异步回执不改变当前现场。旧工程缺业务Hash/Frame/Idempotency元数据先只读UNKNOWN_MIGRATION，经Owner迁移生成新修订；不覆盖原冻结计划。A/B同事实，两个展示模式不改变制造批准。

成功接管仅为D05草稿；D07有序材料、D08冻结和D09中立CL仍需按各域验证。最终D12 NC后处理→D13执行语义→D14物理轴时序→D15独立验证→D16发布。D13未知循环/宏/补偿保持UNKNOWN，CL动画不作为NC工程PASS；规划不做材料扫掠仿真。



## 4. 研究阅读与机器验收

[5分级来源](../../../research/sources/CAP-01-05-handoff-recovery-b185.json) → [8规则32字段及原工作包](../../../research/traces/CAP-01-05-handoff-recovery-b185-v08.json) → [8正32独立单字段反例+10状态Golden](handoff-recovery-b185-fixtures-v08.json) → [只读Node检查器](../../../tools/check_cap0105_handoff_recovery_b185_v08.cjs) → [W2-04专项交接](../../work-packages/W2-04/HANDOFF-RECOVERY-B185-2026-11-05.md)。原CAP AT01–20维持不变。

来源：RFC9110（Fielding等，2022-06）官方§13.1.1/13.2.1正文；SQLite（官方滚动HTML）§1实际正文；PROV-O（Lebo/Sahoo/McGuinness，2013-04-30）本轮标题/摘要，不编造未读条款；原CAP与W2-04固定Git Blob在6175001ee64d544bb52026693c6ead9274b50119读取。以上皆是借鉴或Procet内部设计，不代表标准认证。

合成同判据V8 50/50符合预期；独立Node整文件、真实多SQLite断电/强杀、不同进程消费者、真实NC/机床、17资产Owner会签、L3及全仓GFM AST均NOT_RUN/PENDING。**规划PASS≠产品PASS。**
