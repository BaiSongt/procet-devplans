# CAP-10-07｜现场异常与工程变更GUI、CLI、Agent
ActivityRail「发布/现场 → 异常反馈」只切换左侧`UnifiedTaskPanel`（字宽最大12px、浅/深主题）；步骤：①事件时间线/原始来源与质量 ②报警Ack与实际维修分栏 ③D17附件及Owner责任 ④新ECN变更单与受影响图 ⑤旧A/B冻结只读与新分支对比 ⑥D04名义Setup与D10实装Frame差异 ⑦D12→D13→D14→D15→D16重新验收队列 ⑧独立质量/人工审批/回退。
始终保持**单个活动Babylon Engine/Scene/Canvas**；工程与资源3D横向世界切换不能并列两个3D，不许右Drawer。3D仅对已有可验证Frame作只读高亮，UNKNOWN显示缺证据提示；任何预览、告警确认和播放按钮**不构成物理机床控制命令**。
CLI候选`procet field issue inspect --event-ref ... --revision ...`、`procet field change fork --source-issue ... --base-revision ... --base-hash ...`与Agent调用同一10域`FieldEngineeringChangePort`。端口在写入瞬间重新检查身份、scopeEpoch、aclEpoch、CAS及cancelToken；异步迟到ACK不可复活。未获Owner/独立消费者批准前只读或草稿；回退保留D17所有历史。
