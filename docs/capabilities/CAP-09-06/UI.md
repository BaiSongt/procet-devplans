# CAP-09-06｜同域GUI、CLI、Agent与3D

单一Babylon Scene由RendererPort承载，仅允许从左侧统一TaskPanel切换工程/NC/机床仿真任务；最大字号12px、浅/深主题、左右面板可调宽；不得再建第二3D视口或独立任务容器。**视觉颜色不代表NC安全**。

## 状态模型
左TaskPanel分为最终NC输入(来源D12修订/hash)、实际D10绑定(机床/控制器Profile/刀具H/WCS与D04名义对照)、D13解释器(模态/调用栈/未知语义)、D14轴时序(轴值/轴限位/时间轴/IK分支)、D15独立检查(coverage/Oracle/风险/UNKNOWN)、D16发布门禁(仅导航到10域审批)。NC源码行、源字节偏移、执行实例、D14时序、3D当前姿态与D15证据逐事件联动，支持一对多调用及相同字节的多次执行。切换时不得改变运行结果。

显示优先级：`STALE`/撤权/取消 > `REJECT_ENGINEERING` > `UNKNOWN` > 合成预演状态。仅当真实独立D15证据有效，才允许显示“待人工批准”；合成数据恒显示水印“示例/不可发布”，禁用D16。未经控制器支持不可显示“NC验证通过”。

## 领域端口与交互
GUI按钮、CLI `procet nc verify --d12-ref ... --d10-ref ...`（**设计命令，非存在的可执行产品**）、Agent工具 `NcVerificationPort.request` 必须共用09域同一提交Port，Agent不能绕过人类发布审批；D13解释由08域Owner Port处理。
所有提交由领域Owner核验`expectedRevision`、`rawNcSHA`、`controllerProfileHash`、`Frame`、ACL、scopeEpoch/generation、cancel token。用户切Setup或重载NC后旧响应仅只读，LateACK不得写入。3D播放为D14事件/状态可视化，不提供材料扫掠仿真；若轨迹时序来自合成D11，则强制“CL ONLY，非NC”。

## 异常及验收
- 同一源码块由子程序执行两次：事件表出现两个callInstance，点击分别定位不同时间戳。
- 模态未知或未展开宏：标UNKNOWN，不能绘制虚构确定轴动作。
- 轴/joint越限：显示具体joint、值、阈值来源与版本；没有真实限位只能UNKNOWN。
- NC修订变化、权限撤销、取消晚ACK：结果失效且禁发布，历史快照仍可读。
- UI验收由独立浏览器测试执行（NOT_RUN），静态规划校验器不能证明3D真实运行或可访问性PASS。
