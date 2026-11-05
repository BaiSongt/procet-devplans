# CAP-08-07｜跨团队独立消费者验收与失效/回退

**生产者与签署（PENDING_HUMAN）**：07域D09 Owner必须提供有版本、hash、Frame、segmentId的只读引用；08域D12 Owner提供final NC字节hash、源byteSpan、后处理配置版本与`0..N`来源映射；D04与D10不得合并为一个配置。17资产候选Owner详见[签署候选](asset-owner-candidates.json)，未获得真实人类签署前不得标为ACCEPTED。

**消费者1：独立D13**，从D12最终原始字节+子文件闭包独立解释，不允许借D09“猜”控制器执行；记录物理字节span+调用栈+迭代号+模态态，验证一行多事件、一CL多行、生成性NC无CL源、重复N号、宏未知和控制器参数变化的反例。无厂商语义证明返回UNKNOWN。

**消费者2：独立D14/D15**，要求D10实际绑定、D13执行语义与D14实轴时序。D15验证范围必须由独立实现报告：碰撞、越限、可达性等尚未实现必须`NOT_RUN`，不能因CL动画看似正确给D16放行。D16还须检查D08冻结基线/签发权限/有效版本组合。

**消费者3：GUI、CLI、Agent**，均以同一领域Owner入口读取精确version；在单Babylon世界和左TaskPanel进行双向导航，负例含CAS冲突、ACL撤销、取消晚回执及Setup/后处理变更导致STALE。

**迁移与回退**：Expand→Migrate→Contract；保留旧Reader，旧历史CL/NC映射不得自动升格为强证据。缺原件时登记`MISSING_ORIGINAL`，可以另编候选但禁止称恢复原字节。错误后引用恢复到经验证的完整组合，并让D13–D16再次检查，不删除用户数据库、D08冻结或golden。

**可重复测试入口**：`node tools/check_cap0807_planning_2026_10_26.cjs`仅验合成规则/映射优先级。真实Node文件读取、LinuxCNC/Haas实际控制器、Babylon/OCCT/Win11/离线机床与跨团队消费者此轮**NOT_RUN**；L3审批和Owner签署仍**PENDING_HUMAN**。**规划PASS≠产品PASS**。
