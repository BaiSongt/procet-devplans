# CAP-10-06｜现场执行/工单GUI与交互合同
ActivityRail「发布/现场→工单执行」仅激活一个左侧`UnifiedTaskPanel`：①工单/MES来源与不可变revision ②D16正式签发包及NC SHA核验 ③D04名义Setup和D10真实Frame对照 ④冻结作业指导/机床/刀具/夹具核对 ⑤D17事件时间轴与报警/缺口 ⑥检验、交接和ERP回执。单Babylon Engine/Scene/Canvas，不开右Drawer/第二3D；主工程/制造资源两个世界横向切换时只有一个活动世界；浅/深主题，最大字号12px。
3D显示仅是“已核D10 Frame上的只读设备/装夹高亮”；D10缺失则只显示无锚点的清单和`UNKNOWN`，禁止按D04名义姿态伪造实装。CL轨迹回放不可冒充D13最终NC执行、D14关节时序或D15工程验证；绝不以播放按钮映射现场`CycleStart`。
CLI规划入口：`procet field workorder inspect --job-ref ... --release-sha ... --expected-revision ...`；`procet field workorder receipt-append --event-ref ... --expected-revision ...`仅走10域`WorkOrderExecutionPort`。Agent与GUI同样使用这一Port；写入前Owner重新检验ACL/scopeEpoch/CAS/hash/Frame和cancelToken；权限丢失或迟到回执不得复活。
A/B同事实但保留已冻结方案，多个Setup必须保持SetupId与D10实际执行绑定显式对应；离线可排队保存草稿，不可本地伪造审批/签名/启动事实。无实机或GPU浏览器验收记录时UI状态只能`DESIGN_DRAFT`。
