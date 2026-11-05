# CAP-04-07｜17资产候选Owner接口、独立消费与安全回退

原资产基线：[business-assets.json](../../architecture/v0.8/business-assets.json)。原编号不变；此表为**候选责任**，人类正式签署仍PENDING_HUMAN。

|资产|读写责任|此CAP跨域合同及消费者|
|---|---|---|
|D01/D02|03域只读设计与特征|不因装刀更改CAD/PMI与特征|
|D03|02域写制造资源|实际刀具、刀柄、主轴接口的exact resource/Revision/Hash/Frame；04域只读|
|D04|04域写名义Setup|只读参照，不变为D10工具表|
|D05/D08|05域写决策与冻结|D08冻结不因拆装而覆写|
|D06/D07|06域写求解/有序材料|只评估依赖失效；不得宣称材料扫掠仿真|
|D09|07域写中立CL|只重新绑定工具参考点与策略依赖，不变成控制器偏置|
|D10|04域候选Owner写执行配置|ToolMountPort CAS提交具名主轴接口、刀柄总成、Gauge与TCP新修订|
|D11|09域写CL预验证|CL-only结果非真实NC工程许可|
|D12/D13|08域写NC/控制器解释|从D10和最终NC求T/H、G43/G49及未知/附加模态；不靠3D猜测|
|D14/D15|09域写轴时序与独立验证|消费者核FK/IK、主轴工具装配、包络、H有效状态及验证证据|
|D16/D17|10域写发布/现场反馈|D16签发必须引用D08/D12/D13/D14/D15 exact证据；D17只记录反馈|

所有跨域合同必须带 `ownerDomain,assetId,exactRevision,contentHash,sourceFrame,targetFrame,instancePath,unit,scopeEpoch,provenance,validity`；Owner签署不由自动任务代替。独立消费者最低验收：02域不匹配锥柄的反例、04域缺量测与CAS/撤权、08域T/H与动态补偿/UNKNOWN、09域刀轴变换和三轴/五轴FK/IK、10域旧D16字节冻结以及晚ACK处理；分别提供**产品exact HEAD、测试入口、expected/actual、artifact hash、机器型号与控制器版次、消费者ACK/NACK**。

迁移时旧工具表或历史安装关系缺Gauge datum/Frame或T/H来源→标记`LEGACY_UNKNOWN_READ_ONLY`，保留原字节并生成migrationProposal、旧versionRef及rollbackRef；待Owner人工确认+独立消费者真实ACK再切写。NACK/失效恢复只读旧状态，不把未验证值自动写入机床。规划合成80项不能冒充这些产品验收。
