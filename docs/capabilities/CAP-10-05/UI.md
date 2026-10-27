# CAP-10-05｜MDC监控统一GUI/CLI/Agent与3D

ActivityRail的「现场→MDC监控」只切换**唯一左UnifiedTaskPanel**，不新建右Drawer或第二3D；主工程/制造资源横向切换，一个活动Babylon Engine/Scene/Canvas。浅/深主题，最大字体12px。

左侧顺序：①D03设备身份与只读Profile②点位映射/单位/数据质量③MTConnect instanceId/sequence/buffer缺口④OPC Source/Server/Ingest时钟和StatusCode⑤报警生命周期与D17 append⑥工单/D16独立关联核对/导出。显示GAP/UNKNOWN/STALE而非默认绿色。

CLI**规划**入口：`procet field mdc inspect --machine-ref ... --expected-revision ...`，Agent只能经同一10域`MdcObservationPort`查询或受控append，禁止直连设备写端口或CycleStart。

3D只读叠加经独立D03+D10 Frame校核的设备；D10 UNKNOWN时以无锚点列表呈现，采集图形**不是**D14物理轴时序或D15工程证据。ACL/CAS/scopeEpoch取消晚回执阻提交，离线/旧Reader回退无损，浏览器NOT_RUN。
