# T5-06｜独立消费者、版本化质量门禁和回退
**前提**：质量组拿到合法脱敏STEP/真实D07有序材料状态、D04 Setup、D10执行绑定及可用控制器说明。Producer与独立Consumer应在不同进程、不同责任人下读取相同确切输入revision/hash/Frame，记录两侧仓exact HEAD、Native ABI、二进制hash、环境、退出码、日志hash。不得依赖付费CI；允许在Win11离线本地执行。

**故障矩阵**：ACL/scope撤销、CAS冲突、Frame改变、超时取消回执、D08冻结冲突、D13未知模态、D14轴限、D15旧证据、恢复中断，各自产生真实Owner回执与独立消费者否定证据。所有UNKNOWN不可默认为PASS。

**NC链**：D09中立CL→D12最终G-code→D13执行语义→D14轴运动时序→D15最终NC程序级独立验证→D16发布；D04工艺Setup与D10执行绑定分离。禁止CL播放充当验证，不做材料扫掠仿真。OCCT几何API、静态距离和离散检查均不代替NC安全性证明。

**性能**：每Golden锁输入规模、CPU/GPU、系统版本、工具链ABI、并发、预热、统计窗口、样本数和单位；只与同环境已审案例阈值比较。对新机型、控制器或新策略重新获取正反Golden、Owner批准、真实独立Consumer PASS，不能沿用旧B5或3轴的绿色状态。

**回退**：用T5-03安装包+版本组合锁成对回退，保留T5-04兼容Reader、用户原数据库、D08冻结及D16/D17历史。SQLite仅提供单库备份依据，真实恢复及跨存储一致性须独立演练；任何未执行项目记录NOT_RUN。本轮真实产品、消费者、性能、NC、Win11、实机全部NOT_RUN；17Owner与L3待人工审批。

[规划](../T5-06.md) · [资产Owner候选](asset-owner-candidates.json) · [合成数据例](contract.example.json)。
