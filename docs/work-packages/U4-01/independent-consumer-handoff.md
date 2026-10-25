# U4-01｜独立消费者交接（尚未执行）
## 交接对象
- procet-gui Shell/WorkContextResolver 读取03域D01和04域D04 exact revision/hash/frame；05域D05仅按同一上下文只读查询，写入必须走05域Port。
- ModuleRegistry/ContributionHub复用现有贡献协议；TaskPanel、Ribbon、Agent与CLI共享领域入口和权限，只有3D选择/布局是Shell私有投影。
- D10机床执行绑定是独立实体；此导航不能令D04自动获得D10的NC/机床资格。
## 跨进程真验收（产品环境必须执行）
产品组合锁定 `guiBuildHash / hostBuildHash / resourcesBuildHash / dataSchemaVersion`，采用隔离数据库副本，不删用户原库；本地真实GUI+Owner Port进程启动，记录命令行/退出码、二进制hash、数据库读写前后hash/Revision及回执。执行：文档A/S-A→文档B/S-B→Focus3D→退出→重启→打开B/S-B；验收恢复exact hash、无隐式D05/D08写入、同一Scene。
负例：A旧请求在B界面之后才返回、权限中途撤销、D04修订改变、用户脏草稿未确认、旧书签失效、两次切空间、Agent跨作用域调用。业务Owner接收端必须独立断言而非UI mock。异步取消需对照持久回执，不能仅凭AbortSignal认定底层停止。
## 真实测试状态
`NOT_RUN`：独立进程、SQLite/PG持久层、实际RendererPort、W2-06端到端闭环、GPU内存/卸载及NC/机床。规划合成仅检查字段语义，不授予产品PASS。
## 迁移与回退
expand：旧route adapter同时可读旧书签；migrate：显式生成新的非权威路由线索，Owner immutable revision不改；contract：各消费者真实回归后再移除旧接口。任何失败保留旧版本历史和明确MIGRATION_REQUIRED诊断，不删除数据。
