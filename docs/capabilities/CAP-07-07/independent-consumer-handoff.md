# CAP-07-07｜独立消费者和兼容迁移交接

| 独立消费方 | 必须留存真实exact证据 | 否证/预期 |
|---|---|---|
| D03/D04/D07/D08 Owner（跨02/04/05/06域） | revision、hashKind/contentHash、Frame、scope、D07有序前态、D08冻结证明 | Frame变化/ACL撤销/源陈旧→拒绝D09提交 |
| 07域另一进程的CL reader | 真实D09字节与版本、typed段有序、TCP/刀轴单位、arc圆心半径闭包、Frame往返计算 | 重复段、弧不自洽、CC冒充TCP→失败 |
| 08域D12独立后处理 | 在D09不可变revision与**独立D10**机床执行绑定上生成真实NC字节和映射、post版本 | D09直接出现G1或A/B/C轴 → 不接受 |
| 08域D13独立控制器执行适配 | 控制器方言、模态、偏置、循环、宏、行段来源和UNKNOWN定位 | 未实现M/G/专有语义→UNKNOWN，不伪装PASS |
| 09域D14/D15独立验证器 | 与D12真实NC字节/D13回执/D10配置完全一致的轴时序、限位/碰撞证据及覆盖率 | CL动画通过而最终NC失败→D15不得PASS |
| D16/D17发布与回传 | D09/D10/D12/D13/D14/D15 exact闭包、人工审批、离线可信交付与恢复回执 | 任一消费者NOT_RUN/UNKNOWN或权限改变→阻发布 |

**验收记录模板**：consumerRepo、exactHEAD、binarySHA256、contractVersion、inputD09Revision、inputD09Hash、D10Revision+Hash、controllerProfileHash、frameRevision+Hash、command、exitCode、observedResult、reviewer、executedAt、artifactsHash；未执行保持`NOT_RUN`，不可虚构。

**兼容窗口**：Expand 新增D09 typed段Reader与来源引用；Migrate写新增D09 revision及旧→新派生边，原有CL保留只读；Contract仅在独立消费者同时通过新旧读取、Owner批准、可恢复演练与版本锁后执行。回退只切换引用指针且对应NC证据重新验证，不删除用户库/旧golden/冻结快照。D04与D10互不覆盖，A/B共享同事实。产品验收和17Owner会签均PENDING/NOT_RUN。
