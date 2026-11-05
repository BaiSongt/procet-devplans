# E3-04｜B181 原编号实施补证：进给倍率与停机事件

**这是原E3-04的补证，不增加工作包编号。** F1-02/E3-05/U4-04作为上游及独立验收关联包，L3待审。

1. D13重读最终D12原始NC并按锁定D10/Profile/Frame解释M48/M49、M50/M51、M52 HAL动态输入、M53 feed-hold开关、M0/M1/M30；输出具runId、NC字节偏移、修订/Hash、未知原因的typed事件。
2. D14只根据这些事件和真实机床绑定展开物理Joint时序，不以UI倍率/名义F作为实测数据；D15使用独立实现/进程复核停机反馈、限位、时序完整性、权限/取消Fence，D16不得在UNKNOWN时发布。
3. GUI/CLI/Agent调用一个领域Owner Port；一个Babylon世界、左TaskPanel；旧D08冻结/NC历史只读保留。CAS revision/ACL/scopeEpoch在提交重验，晚回执IGNORED_STALE。
4. 机器验收：M50P0+M52外部输入、M53已启用但未获物理停证、M1开关有无、M30生命周期、倍率限额非实际速度等，8正32单字段反14语义Golden仅规划。真实OEM、D14/D15跨进程与Owner会签单独验收，回退旧revision而不改冻结或用户数据。

[研究](../../capabilities/CAP-09-06/FEED-OVERRIDE-B181-2026-11-05.md) · [9来源](../../../research/sources/CAP-09-06-feed-override-b181.json) · [8规则32字段](../../../research/traces/CAP-09-06-feed-override-b181-v08.json) · [54合成规格](../../capabilities/CAP-09-06/feed-override-b181-fixtures-v08.json)。

**规划PASS≠产品PASS。**
