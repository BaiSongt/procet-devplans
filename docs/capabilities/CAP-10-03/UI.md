# CAP-10-03｜无网络工位的GUI/CLI/Agent/3D一致入口

全屏始终是**一个Babylon World**；ActivityRail“发布 → 离线交付”只打开**统一左侧TaskPanel**，不创建新Viewer/隐形并行场景。浅色/深色两主题，最大字体12px。右侧Agent只提供证据差异解释/起草签收，不可自动验签放行、签发或操控机床。CLI示意`procet release receive --media ... --expected-revision ...`尚未实现，不提供真实可绕权限的替代入口。

TaskPanel纵向步骤：①已签D16精确对象（包含hash/签署者/审批链）②介质账本与双人交接③隔离提取安全检查④**接收端独立**逐文件Hash+Manifest JCS+签名/预置信任根/吊销快照/可信时间⑤现场设备/控制器/D10实装Frame与D04名义Setup差异⑥D15独立NC工程验证覆盖⑦D17签收与离线回传。每步显示`VERIFIED`/`REJECTED`/`UNKNOWN`/`STALE`，不能用单一绿色或播放动画合并含义。

GUI/CLI/Agent均调用10域`OfflineTransferPort`；用户选择介质和工位只是草稿，最后提交重新执行ACL+CAS(exactRevision/hash/frame)+scopeEpoch+cancelToken。取消、撤权、切项目或晚ACK不提交。D16冻结包与A/B共享事实不覆盖，D17追加回执不改D16。Babylon仅只读高亮装夹/目标工位和D10 Frame；D14播放和D11 CL_ONLY不是可上机证据。

重点真实测试待办：浏览器单世界不重建、键盘焦点/低分辨率、Windows U盘路径与Unicode规范化、Linux文件权限、浏览器刷新与取消、不同Receiver权限、双人交接、接收端可信时钟及离线吊销。全部`NOT_RUN`；不得声称已支持真实U盘硬件或控制器。
