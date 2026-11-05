# U4-02｜独立消费者交接（NOT_RUN）

产品测试需锁`guiBuildHash/ownerBuildHash/schemaVersion/contractHash`，隔离数据库副本，不删除原用户数据库；记录真实命令、进程PID、退出码、Owner提交前后hash、回执和GUI屏幕记录。

消费者一：04域D04真实Owner负责Setup草稿和Frame修订；消费者二：05域D05负责工艺草稿/人工批准/D08不可变冻结；消费者三：01域Shell仅持有导航/Session投影；CLI与Agent必须执行相同Port，不能直写。D10执行绑定、D09 CL、D12 NC、D13执行语义、D14轴时序、D15验证、D16发布均是其他域Owner的精确引用，本包不得授资格。

正例：Ribbon/Rail/TaskPanel/Agent/CLI调用同一用例、保存草稿只生成新Draft、确认脏稿动作一致、文档切换重启恢复exact Setup/Frame、单Scene租约释放、同幂等键只一持久回执。反例：撤权/Head前移/Frame失效、Esc静默丢稿、保存变批准、A/B覆盖冻结、取消晚回执污染新文档、同键异载荷双写、V1/V2两个Writer同时写。由Owner独立断言，不能用Mock UI冒充。

迁移expand先保留旧V1 reader兼容；migrate逐Setup关联新Session并对账修订；contract只能在所有消费者真实测试通过后删除旧写入口。任何失败保留冻结历史与MIGRATION_REQUIRED/UNKNOWN_RECOVERY诊断，禁止覆盖客户数据。全部产品与独立消费者验收NOT_RUN，17Owner/L3待人工。
