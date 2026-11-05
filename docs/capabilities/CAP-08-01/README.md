# CAP-08-01 后处理管线｜实施级规划（V0.8原编号）

**状态**：规划编制完成、L3待评审、产品验收NOT_RUN。保留11域88 CAP/36原编号包/17资产语义。

## 业务目标
消费第07域的D09中立CL（刀位/TCP、刀轴、运动段和Frame），结合第04域持有的D10机床执行配置（引用第02域制造资源），按明确版本的后处理Profile生成第08域持有的**D12 NC源文本、不可变生成记录及逐行CL溯源**。D04工艺Setup和D10执行绑定分离，D08确认与冻结结果只读引用；A/B工作模式共享同一工程事实，不覆盖冻结成果。

必须保持：**D09(CL)→D12(NC后处理)→D13(独立控制器执行语义)→D14(轴运动时序)→D15(NC工程验证)→D16(受控发布)**。CL动画/D11预检查不能充当D15验证；未知专有宏、循环与五轴RTCP语义标UNKNOWN。不得宣称做过材料扫掠仿真。

## 业务流程（6步）
1. 选择D08已采纳工序及D09精确CL版本，核验clRevision、clHash、frameId、unit、segmentId和冻结作用域。不得从项目最新别名猜测。
2. 选择D10机床执行绑定与后处理Profile（controllerDialect、profileVersion/hash、supportedKinds、WCS/刀具安装）。D09绝不被改写为绑定具体机床；非法Frame与未声明方言返回UNKNOWN。
3. 无副作用检查顺序、单位转换、显式单位/平面/距离/进给/WCS模态、线/圆弧、全刀具总成与切削方式支持边界。未知策略不得隐式线性化或声称已认证。
4. 生成临时NC候选，保存每条NC物理行→CL segmentId的映射；合成Header等行记录SYNTHETIC + reason；给出静态错误与覆盖矩阵，不能调用D15“自测PASS”。
5. UI显式采纳时通过统一DomainPort重验CAS(expected==current)、actor权限、四类exact SHA、取消代次；无效晚回执丢弃。提交得到不可变D12原始NC字节/hash/来源表/生成Journal。
6. D13**独立重新读取NC**并解释控制器模态；D14展开轴时序；D15验证轴限位/干涉/语义覆盖。D16只消费同NC、同D10的独立结论，未覆盖语义保持UNKNOWN/NOT_RUN。

## 统一输入输出与Owner
输入：`{projectScope, actor, d08ExactRef, d09ExactRef{revision,hash,frame,units},d10ExactRef{revision,hash,frame},postProfileExactRef{revision,hash,capabilitySet},casExpected,taskGeneration}`。
输出D12：`{immutableNcArtifact, ncBytesHash, parentClExactRef, d10BindingExactRef, postProfileHash, lineToClSegment[], sourceJournal, validationScope:"STATIC_ONLY", invalidationGraph, revision}`。
Owner：D09=07 CAM，D10=04装夹与坐标，D12/D13=08后处理与执行语义**不同模块**，D14/D15=09运动工程验证，D16=10程序发布。C0仅共享身份/hash/坐标单位/修订/作用域/CAS，禁止新建全域大Common对象。

## GUI/CLI/Agent与3D
GUI的NC ActivityRail只展开统一左TaskPanel；3D保持单Babylon世界，点击NC行高亮同一世界中的CL段/Frame（可视化≠验证）。GUI/CLI/Agent使用同一后处理领域端口：`preview,commit,cancel,forkManualEdit`；Agent不得越权采纳。最大字体12px，只有浅色/深色；等待时显示任务阶段流光与明确UNKNOWN。见[交互说明](UI.md)。

## 异常、迁移与回退
失败码：`STALE_INPUT, FRAME_MISMATCH, UNSUPPORTED_DIALECT, UNKNOWN_MACRO, ARC_UNCERTIFIED, CAS_CONFLICT, UNAUTHORIZED, CANCELLED, LATE_ACK_DISCARDED`；明示错误及定位行。CL/D10/Profile变更后，旧D12和关联D13–D16标失效，但**保留历史原文**；NC人工编辑只能fork新修订并重新验证。老项目无法确认控制器Profile时只读导入并标UNKNOWN，不得清空数据库。回退仅撤销本轮新候选/引用，不覆盖冻结的A/B工程数据。

## 追踪、包与独立验收
原工作包`E3-02 / E3-03 / U4-04`；分派子任务：冻结数据端口、Profile支持矩阵、Frame与模态生成、Line/Arc、NC↔CL来源、失败语义、CAS/取消、失效/迁移、D13独立Consumer及D15演示阻断。完整追踪：[8来源](../../../research/sources/CAP-08-01.json) → [10规则](../../../research/traces/CAP-08-01.json) → [20正反用例](fixtures.json)；[研究阅读边界](../../../research/topics/R-POST-001.md)。
仅合成规划测试，不代表真实OCCT/NC、D13消费端、D14/D15实机PASS。
