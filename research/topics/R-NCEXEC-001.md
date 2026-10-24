# R-NCEXEC-001｜控制器执行语义与D13边界
研究对象：从实际D12 NC程序＋D10执行配置解释规范化D13事件；不包括D14机床运动学、D15工程验证、D16程序发布。
[9项原始官方/研究来源](../sources/E3-03.json) · [来源→规则→字段→20正反合成验收](../traces/E3-03.json) · [工作包](../../docs/work-packages/E3-03.md)。
理论重点：ISO 6983-1:2009仅公开摘要提供NC格式背景；NISTIR 6556本轮只核对出版记录，出版页存在RS274NGS/常见NGC和作者拼写差异，不编造正文。LinuxCNC 2.9公开手册明确模态、偏置、补偿、O码及Remap行为，但不得当作任意FANUC/SINUMERIK或B5机床控制器规范。PROV-O作为来源追踪的概念依据，RFC 8785作为确定性JSON哈希方式的参考，不等于已实现JCS。
设计推导：分离原始NC字节和解释状态；UNKNOWN fail closed；源行+模态演化；D13不授D15 PASS。所有真实控制器试验、D14/D15独立消费、L3审批状态 NOT_RUN/PENDING。
