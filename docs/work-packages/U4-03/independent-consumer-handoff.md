# U4-03｜独立消费者与迁移交接

### 锁定真实执行组合
交付给GUI/Renderer消费方需锁`guiExactHEAD,buildHash,BabylonVersion,rendererPortSchema,ownerD01/D03/D04BuildHash,fixtureHash`，开隔离工程副本，切勿删除客户工程库。消费者一：01域Shell/RendererPort，须在同一真实Engine内验证Scene唯一、lease、observer/GPU释放；消费者二：02域D03真实资源Owner，提供机床/刀具/夹具exact GeometryRef；消费者三：04域D04 Setup Owner，核对Frame/毛坯/装夹受控修订；03域D01为CAD目标与PMI唯一写Owner。D15验证消费者只核查显示资格不能由Renderer授证。

### 真实正反验收（NOT_RUN）
正例：连续100次工程↔资源切换后Scene计数恒1、旧lease/Gizmo/pickMap全被释放；列表/3D键盘单选同`{assetId,revision,hash,frame}`；取消预览Owner提交计数0；GUI/CLI/Agent同领域查询得到同一来源资格。
负例：变更Frame revision但仍用旧mesh映射、文档切换后晚回执、取消与pointercapture结束、stencil关闭导致高亮不可用、简化机床STL代理误标碰撞已验证、撤权之后EditSession晚提交、D10执行绑定与D04写入混淆。每个负例由独立Owner/进程返回`STALE_REF/UNKNOWN/REJECT`，不得静默PASS。

### 验收采集与预算
记录真实进程PID、退出码、shader/scene/activeMeshCount、观察者数、Overlay/GPU句柄、前后GC及显存观测方法、每个操作的scopeEpoch/generation/leaseId、渲染前后Owner revision/hash。GPU释放需实测并允许驱动缓存；**不能仅以JS对象减少证明无显存泄漏**。性能阈值先由目标机器基线评审批准，不编造FPS或内存上限。

### 安全迁移
Expand：旧Picking/Viewer适配读旧映射，唯一新RendererPort只读投影；Migrate：逐Setup exact Frame和资源修订对账，不批量覆盖；Contract：真实GUI/资源Owner/Setup Owner/离线恢复及负例回归通过且人工签署后才废弃旧适配。任一步失败恢复旧读取映射，保留D08冻结、所有历史Owner修订及客户数据库。产品/消费者/L3验证均PENDING/NOT_RUN。
