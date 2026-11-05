# CAP-09-06｜跨域消费者、独立验收与非破坏迁移

## 实际Owner签署目标（目前全部PENDING_HUMAN）
08域D12最终NC字节Owner → **独立08域D13执行适配** → 09域D14运动展开 → **独立09域D15工程Oracle** → 10域D16发布审批；02域D03机床资源与04域D04名义Setup、D10实际执行绑定分别提供只读快照。各Port的返回均带exact revision/hash/Frame/错误枚举，Owner间不得通过复制松散对象字段隐藏版本。候选Owner见[17资产矩阵](asset-owner-candidates.json)；未经签署不标正式完成。

## 由不同实现/人员的消费者执行
- 输入独立：读取真实最终NC字节，而非信任D13输出的自述SHA；核对控制器固件、选件、Remap依赖和Frame。
- 解释独立：使用明确已核方言的程序，验证G20/21、G90/91、G43/H、WCS、modal group、子程序调用实例、换刀及循环；宏未知/展开预算超限=UNKNOWN。
- 运动独立：D14必须从D13 typed events生成物理Joint时序，针对3轴及B5独立FK/IK回代、轴限位、动态约束与速度/加速度不确定性。
- 安全独立：D15用独立Oracle校核Joint/行程和碰撞覆盖，静态形状最近距不可证明连续安全；真实测量不足=UNKNOWN；不得以同一生成器产物自签PASS。
- 事务独立：GUI/CLI/Agent同域Port，撤权/CAS冲突/取消晚ACK/跨Setup或A/B冻结交接产生REJECT/STALE；合成与历史只读。
- 发布独立：D16必须审查原始NC→D13→D14→D15完整签证及当前权限，合成/UNKNOWN/STALE不能提交发布。D17现场签收不等于机床加工验证。

建议真实验收入口（**规划命令，非当前已存在功能**）：`node tools/check_cap0906_planning_2026_10_27.cjs`仅可检查规划合成结构；真实D13/D14/D15应由项目后续提供单独可重复脚本与golden结果，登记操作系统、控制器、机床、精确HEAD/sha256、Frame、Oracle身份、退出码。当前真实Node执行、产品、控制器和消费者均`NOT_RUN`。

## 向后兼容/回退
新旧D12/D13/D14/D15 Reader及控制器Profile按revision成对迁移（Expand/Migrate/Contract），先双读验证旧D08冻结、旧NC及D16历史可恢复，再换写端；不可删除用户数据库。任何字段无法理解=UNKNOWN而非忽略字段假PASS。恢复需包含断电中断、部分写、重复执行和取消晚回执；所有证据强制可追溯。
