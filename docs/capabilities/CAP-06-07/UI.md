# CAP-06-07｜GUI与3D工作流（待L3评审）
唯一Babylon世界+统一左TaskPanel，Ribbon、ActivityRail只改变导航/展示而不拥有制造数据。工作上下文显示project/document/setup/revision/contentHash/frameHash；依候选显示原Stock、目标、去料体、岛屿、保护区和差集，采用单Scene中的租约与同步选择高亮。

核验面板至少显示：原D06、父D07、Oracle二进制及OCCT构建哈希、检验版本、拓扑/体积/保护区逐门禁结论、政策容差来源、可靠值是否经独立留出校准、原始残差曲线含反弹点、UNKNOWN原因与可点击证据。UI绿色状态只表示得到真实Owner受管回执；未执行时显示NOT_RUN。GUI/CLI/Agent都调用相同`06.OracleVerificationPort.preview/submit`，Agent无冻结写权限。

选择预览不是提交；改Setup和切工程触发scopeEpoch变更并废弃晚回执；取消后仍完成的Worker不能绕过CAS/ACL/任务代次。CL播放不表示D15合格，D13未知控制器语义显示UNKNOWN。