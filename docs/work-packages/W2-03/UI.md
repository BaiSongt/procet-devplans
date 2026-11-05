# W2-03｜单Babylon世界与统一左TaskPanel失效溯源交互（规划）
[实施](../W2-03.md) · [契约](contract.example.json) · [合成场景](fixtures.json)

- **入口共用**：工程/Setup/工艺/刀路/NC/验证活动轨道在同一左侧TaskPanel切换“依赖图—失效原因—修订对比—消费者复核”。CLI/Agent使用同一DependencyImpactPort，不另建隐形写通道。最大字号12px、仅深浅主题；主题切换纯外观，不使任何制造资产失效。
- **唯一Babylon世界**：只存在一个3D世界对象，用可见层与Camera切换D01目标、D04毛坯/Setup、D07有序去料体、D09中立CL、D14轴时序等。3D选择只变选择上下文，不改变权威资产与CAS头；左TaskPanel可调宽，工具等待和进度动画不等于提交完成。
- **关键面板字段**：`graphRevision/rulesetHash/projectId/branchId/setupId`、变更资产`id/revision/hash/frame/unit`、变化类型、旧版消费者引用表、每条`reasonPath`、`ELIGIBILITY_REVIEW/STALE/QUARANTINED/UNKNOWN`、权限/CAS/任务代次/晚回执阻断及“独立消费者尚未验证”红色文字。
- **失效动画**：NC编辑只高亮D12→D13→D14→D15→D16，D09/D11保持正常；主题变化所有业务节点保持正常；资源离线显示D03状态和资格审查，不改变D03文件内容hash；D10修改仅影响执行绑定与子链，不自动改变D04名义Setup；任何D13未知显示UNKNOWN。
- **冲突/回退**：D08冻结节点仅只读且带精确hash；当来源版本或Frame不符时禁用提交按钮，展示具体差异；取消晚回执标灰并保持不可采纳。旧索引可重建/只读回放，不原位覆盖冻结修订。
- **验证入口**：GUI仅展示本地正反合成用例结果与真实Consumer的独立认证状态两列，后者在产品执行前始终NOT_RUN；不因CL动画、B-Rep显示或规划PASS解锁发布。
