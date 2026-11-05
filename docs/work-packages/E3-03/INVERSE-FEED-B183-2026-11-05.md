# E3-03｜B183 G93/G94/G95执行语义增量签收条目

日期2026-11-05，保留E3-03原编号。D13以最终D12 NC byte SHA、控制器Profile/Options、D04名义Setup和D10实际执行绑定的精确revision/hash/Frame为输入，重新解释G93/G94/G95及F值。G93每插补块强制F、G0例外；G95主轴反馈失联输出UNKNOWN。Haas NGC 2025 G234/Reset/F45000必须锁Profile，不推断B5。

D13只输出有物理NC行/字节范围/模态/名义段时间/反馈质量的事件；D14用真实运动学与D10物理轴展开时序，D15作为独立消费者完成最终NC工程资格，D16在D15与Owner确认前不得发布。GUI/CLI/Agent同Owner入口，单Babylon世界/左TaskPanel；提交CAS/ACL/撤权/取消Fence/晚ACK重验。A/B同事实，D08冻结不覆盖，遗留记录可双读回退但不得自动标PASS。

[专题报告](../../capabilities/CAP-08-03/INVERSE-FEED-B183-2026-11-05.md) → [来源](../../../research/sources/CAP-08-03-inverse-feed-b183.json) → [规则/包映射](../../../research/traces/CAP-08-03-inverse-feed-b183-v08.json) → [50正反Golden](../../capabilities/CAP-08-03/inverse-feed-b183-fixtures-v08.json) → [校验器](../../../tools/check_cap0803_inverse_feed_b183_v08.cjs)。正式Owner 0/17、真实消费者0/17、独立Node与机床NC/L3未验。**规划PASS≠产品PASS。**
