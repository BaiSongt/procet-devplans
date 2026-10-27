# CAP-10-01｜独立消费者/迁移与回退交接

**Owner**：10域D16 PackageProducer仅创建候选，09域独立D15 Oracle不可由D16覆写；D03机床档案、D04名义Setup、D10实际执行绑定、D12最终NC原字节、D13语义与D14物理Joint时序都有各自Owner。17资产Owner候选见[登记](asset-owner-candidates.json)，正式签署全部PENDING_HUMAN。

**独立CAP-10-02审批消费者**：重新读取D08冻结、D10实际机床/刀具、D12文件原始bytes、D13未知宏、D15覆盖与独立Oracle；对生产者内存报告或合成Manifest不授信。正例须在真NC、真正实装及D15独立工程验证后申请人类审批；负例包括D11 CL_ONLY、未知宏、失效SHA、错机床、错Frame、缺刀具以及revoke/cancel/lateAck。

**独立CAP-10-03离线接收消费者**：在现场不联网时逐文件重新计算byte SHA，检查path、重复/大小写冲突、符号链接、签名信任根和禁止降级策略；复制成功、目录存在不等于校验通过。没有可用可信签名/吊销策略时必须记录边界和人工流程，不能伪造验证。

**测试入口**：`node tools/check_cap1001_planning_2026_10_27.cjs`（规划合成）；产品必须另提交Node独立文件/真实NC后处理、控制器解释、D15独立Oracle、B5/三轴、浏览器Babylon、离线现场受控介质的确切仓库HEAD、操作系统、真实输入SHA、命令/退出码、签名身份与正反验收证据。目前全部NOT_RUN。

**非破坏性迁移**：先vNext/vOld Reader双读核对修订/Hash/Frame，标注UNKNOWN与STALE，业务审批后再灰度写新候选；失败回退旧Reader与旧D16发布记录。D17执行/检测反馈只能新增追溯事件，绝不可修改原发布包。任何上游更新都产生新候选，不撤销可审计历史字节。规划PASS≠产品PASS。
