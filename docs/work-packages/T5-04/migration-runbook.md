# T5-04｜迁移与失败恢复操作手册（规划）

## 准备与准入
Inventory固定17资产Owner、原入口/最后消费者/协议版本、Schema/hash/Frame、旧工程与故障golden。没有合法旧原件标UNKNOWN，不能假造恢复附件。以T5-03 ReleaseCompositionLock明确产品组合；所有私有受控SHA不上传公开规划仓。

## Expand / Migrate / Contract
Expand先版本化新Port、旧Reader只读兼容、明确旧Schema诊断。Migrate需真实受控备份、checksum/恢复演练、单Owner CAS，记录源与目标Revision/Frame/数据hash及处置日志。SQLite备份使用官方Online Backup API或VACUUM INTO候选，实际要验证WAL、恢复成功和主数据完整性；SQLite/PG/对象文件跨存储事务视为UNKNOWN而非自然ACID。Contract仅在旧/新独立消费者进程同一真实版本组合PASS、Win11离线发行包验证及人类批准后允许退出旧入口；历史golden永久保留。

## 必须实现的真实产品反向验收（全NOT_RUN）
P01旧工程/失效schema→明确诊断或旧Reader仍可读；P02迁移中断/断电→原库一致且幂等恢复；P03撤销ACL、错Frame/Hash/scope、取消后晚回执→Owner拒绝；P04独立旧Reader与新消费者各固定生产者版本及二进制Hash测试；P05重生NC的D12与D13不一致/未知→D15 STALE、D16阻断；P06 Win11离线回退同时切换installer和组合锁，用户工程/D08/D16不变。

## 恢复与交接
明确SourceHash、RollbackSnapshotId、备份存放和访问授权、校验和、Reader版本、恢复日志/复盘责任人。真实恢复失败不得批准Contract，不得删除数据库以假装重建成功；旧golden/故障证据、D08冻结、已发布D16保留。

[原实施](../T5-04.md) · [理论](../../../research/topics/R-CONTROLLED-MIGRATION-001.md) · [独立消费者](independent-consumer-handoff.md)。
