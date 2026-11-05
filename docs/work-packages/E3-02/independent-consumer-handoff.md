# E3-02→E3-03 独立D13验收（未执行）
D12 NC生成Owner(08域)提交最终NC原字节SHA、post二进制及配置SHA、D09/D10 exact引用、每NC物理行来源；独立D13(08域执行适配)必须重新解释NC原文，再由D14/D15(09域)验证，D16(10域)审批。
正例要求三轴真实控制器样例、B5实证轴树/RTCP样例，各自锁定product exact HEAD与post版本；检查同输入输出hash复现、每行CL/synthetic来源、D13模态事件及对照日志。
反例逐一注入错方言、post SHA、Frame、刀补/WCS、行映射、单字节篡改、未知宏/循环、人工未fork、ACL/CAS与取消晚回执；不得生成D15 PASS或D16发布。真实B5参数缺失时只允许UNKNOWN。
最终QA需独立签署测试指令、输入文件hash、环境、解释器二进制hash、运行日志、D10配置、消费者反例结果。**设计Owner、QA、L3均未签；真实产品/机床/独立消费者NOT_RUN。**