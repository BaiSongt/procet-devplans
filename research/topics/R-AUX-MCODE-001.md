# R-AUX-MCODE-001｜主轴换刀与辅助动作的控制器执行语义
日期：2026-10-26。范围：原CAP-08-04/E3-02/E3-03/U4-04。此为面向架构设计的公开资料研究，不是B5实机参数、控制器认证或制造安全报告。

## 证据分级
- ISO 6983-1:2009：仅取得官方**目录和摘要**，标准规定数控地址字格式范围；未购买/阅读收费正文，**不得引用未读条款**。[S1](../sources/CAP-08-04.json)
- LinuxCNC 2.9：M-Codes官方**§2/3/5/6/7/8正文已读**。该实现明确M6与T选择、G43分离、冷却可能继续；M19存在设备定向确认/超时条件。这证明“是否在某系统出现”而不是“所有厂商都应如此”。[S2](../sources/CAP-08-04.json)
- Haas Mill M-Codes：官方在线手册18节正文已读，允许的M命令/程序块规则可以作为**Haas示例**；详细M06/M08专页检索摘要可见，但跳转后正文读取失败，**降级为search_excerpt_only**，不采信具体实机选件。[S3–S5](../sources/CAP-08-04.json)
- NIST IR6556：仅著录/出版页面，未读报告算法。RFC 9110 §13.1.1用于CAS协议类比，PROV-O的Entity/Activity/Agent可支持来源事件表达，但**两者不证明真实控制器行为**。[S6–S8](../sources/CAP-08-04.json)

## 关键技术推导
1. 将M码抽象为`CommandIntent → ControllerInterpretation → ExpectedDeviceTransition → ObservedAcknowledgement`。真实`ACK`必须携设备源与确切时间/序号，否则只能EXPECTED_ONLY。M19无反馈则UNKNOWN。
2. 将选刀T、换刀M6、刀库槽位、装夹/Tool Gauge、G43补偿分离。D03含刀具刀柄能力，D10含实际装夹/执行绑定；V0.8 D06是求解候选，**先前CAP-08-03表述的“D06刀具总成”属于需人工评审的交叉域不一致，不能复制**。
3. 区分控制器Profile的M6后冷却、程序块M码数、暂停结束状态与设备选件。对照测试必须绑定LinuxCNC/Haas准确资料阅读深度，禁止推断B5配置。
4. 建立D12最终NC字节→D13独立解释/来源行→D14机器动作事件→D15独立验证→D16发布门禁；不让CL动画、静态OCCT距离或合成ACK冒充NC工程验证，不做材料扫掠仿真。
5. 变更Profile、工具资源、D04/D10、NC、作用域/权限后，失效链要重新获取证据；CAS、ACL、taskGeneration、取消晚回执均在Owner事务入口重验。

## 待验证边界
Haas详细M06/M08正文未读取，目标B5控制器手册、固件、I/O、刀库、主轴定向与换刀行为均UNKNOWN/NOT_RUN。真实跨域消费者、节点校验器独立进程、NC回放及实机验收未完成。来源索引条数非去重文献数，来源→规则→字段→独立正反测试见 [trace](../traces/CAP-08-04.json)。