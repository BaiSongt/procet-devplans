# CAP-10-04｜GUI/CLI/Agent/3D统一交互

- ActivityRail“发布 → DNC交换”仅切换**唯一左UnifiedTaskPanel**的内容；主工程3D和制造资源3D横向世界切换但一个Babylon Engine/Scene/Canvas处于活动状态。浅/深两主题，**最大字体12px**；禁止两个并排3D、右侧Drawer重复TaskPanel、额外资源管理器。
- 左面板步骤：①D16已签发原字节hash/签名/D15证据②目标机床/控制器Profile/固件与D10实装Frame③能力发现与授权（只读→申请写入）④分块上送至staging⑤独立设备回读与NC字节+子程序闭包核对⑥D17接收回执与异常反馈。
- 明确显示DRAFT/UPLOADING/STAGED_UNVERIFIED/STAGED_VERIFIED/REJECTED/UNKNOWN/STALE。STAGED_VERIFIED不等于NC已装载或可运行；未知语义一律UNKNOWN。CL动画不作为NC验证。
- GUI/CLI/Agent都调用10域`DncTransferPort`；CLI仅预留`procet release dnc stage --release-ref … --expected-revision …`，并非已实现命令。Agent只提供差异说明或提出草案，禁止旁路直连CNC、自动点击启动和权限升级。
- 3D只读显示所选机床与D10 Frame/安装证据，不发CNC运动指令，保持场景拾取和任务选择一致；选择目标不产生提交。
- UI提交前CAS(expectedRevision/hash/frame)、ACL、scopeEpoch、cancelToken重新检查；取消/撤权/切工程/晚ACK不得覆盖A/B冻结或写旧D17。断电、断网后不能通过UI把上传状态伪装成完成。
- 真机权限、机床协议、浏览器键盘焦点/刷新/低分辨率/超时测试未执行，全部`NOT_RUN`。
