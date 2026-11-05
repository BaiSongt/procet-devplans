# B76｜CAP-08-05 子程序调用闭包、参数作用域与嵌套展开

日期：2026-11-01。**规划研究补证，L3待人类评审；产品/实机/17独立消费者均未验。** 原编号工作包：E3-02、E3-03、E3-04、E3-05、E3-06、U4-04。继承11域88 CAP、36工作包、17数据资产、L1/L2不动。本专题不同于既有B47 G83啄钻专项。

## 核心反例：同一程序调用结构不等于相同参数作用域

LinuxCNC 2.9的O-call在返回时恢复#1—#30局部参数；Fanuc风格的M98编号程序中#1—#30写入为全局持续副作用。官方O Codes §4.1示例：外层重复5次、每次内层5次，内层总计5×5=25次；初值#1=0，外层各加1、内层各加0.01，最终#1=5.25。不能把25误算成5+5=10，也不能对M98错误套用O-call的返回恢复。O-call依然可以写全局命名参数，故局部恢复不等于整个程序状态无副作用。

Haas车床官方§11.5中，M97 P引用本地N行，M98 P引用O程序；L指重复调用。外部M98程序文件可由活动目录、Setting 251/252解析，未经固定的搜索根、原始文件字节哈希和控制器Profile，不允许通过只核对P值就宣布程序闭包完整。LinuxCNC主程序中M99可造成重回程序起点，而非自然退出；未知OEM行为返回UNKNOWN。

## 可实现的责任边界

D12封存**最终NC原字节**和所需子程序的精确闭包（原字节Hash、规范路径、查找配置、依赖版本、Profile）。D13以最终NC字节重新解释，记录physicalLine、callStack、iteration、参数读写前后、returnTarget和程序包Hash；不能由D09中立CL/G-code动画代替解释。重复计数与深度预算属于Procet保守软件限制，不是机床厂商的认证限值。

D04名义Setup与D10实际机床绑定分别保存revision/hash/Frame/scopeEpoch。D12/外部子程序字节、D04、D10及控制器Profile任一变化使D13–D16旧证据STALE；D08冻结与A/B共有事实保留历史，不直接覆盖签署记录。D14只据D13合法事件结合D10生成轴时序；D15独立验证最终NC，D16根据授权和真实证据签发。未知语义UNKNOWN，不做材料扫掠仿真。

GUI/CLI/Agent共用08域Owner Port；唯一Babylon Engine/Scene/Canvas、统一左UnifiedTaskPanel、浅深主题和≤12px。任何预览不直接修改D13；提交前重新核对ACL、CAS、Frame、scope代次、任务generation和取消，迟到ACK不获取提交资格。旧Reader维持Expand→Migrate→Contract回退路径。

## 来源、规则与验收闭环

[7份分级来源](../../../research/sources/CAP-08-05-subprogram-b76.json) → [8条字段级可追溯规则](../../../research/traces/CAP-08-05-subprogram-b76-v08.json) → [合成正反/STALE/UNKNOWN测试](subprogram-b76-fixtures-v08.json) → [只读Node规划校验器](../../../tools/check_cap0805_subprogram_b76_v08.cjs) → [验证等级](../../../tracking/cap0805-subprogram-b76-verification-2026-11-01.json)。

LinuxCNC 2.9 §4/4.1/9与Haas车床§11.5公开正文定点阅读；W3C PROV-O及RFC 9110公开指定章节仅作来源/CAS设计参考。NISTIR6556仅出版摘要、ISO6983-1:2009仅官方合法目录，不冒称读过全文，厂商手册亦不等于现场控制器/固件证据。正式Owner 0/17、独立消费者0/17、L3 PENDING_HUMAN；**规划PASS≠产品PASS。**
