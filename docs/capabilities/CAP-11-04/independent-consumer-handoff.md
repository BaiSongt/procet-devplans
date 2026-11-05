# CAP-11-04｜跨域独立消费者、失效/回退与Owner候选交接

## Owner候选与精确合同

编排自身由11域负责**计划与候选**，不是17资产全部Owner。D01工程/审计Scope由01域、D02原件由其业务来源域、D03制造资源由02域、D04工艺Setup由04域、D05特征由03域、D06刀具资源由02域、D07材料过程由06域、D08冻结工序由05域、D09中立CL由07域、D10执行绑定由04/09域按待批准接口切分、D11预检查由09域、D12最终NC由08域、D13语义由08域、D14轴运动由09域、D15独立验证由09域、D16签发由10域、D17现场回执由10域。**以上是候选映射，不代表正式会签**；须在全量17资产接口复核矩阵确认单一写Owner及读Consumer。

共同接口：`ProjectId/Principal/ScopeEpoch`、`OwnerPortId`、`AssetKind/AssetId`、`exactRevision/contentSha256/frameId/unit`、`actionDigest/idempotencyKey/cancelEpoch`、`approvalReceiptId`、`ownerReceipt`与`traceId`；Frame无意义的非几何资产需显式`frameNotApplicable`，不能伪造坐标系。所有跨域副本为读投影，修改必须回到Owner。

## 独立消费者验收入口（真正实现前NOT_RUN）

1. 测试平台从`agent-orchestration-contract.json`建立冻结快照与权限上下文；绕开编排器直调业务Owner模拟Port，采集真实Owner Commit Receipt，不能以Agent自身回执冒充。
2. 正向：read-only工具取得精确修订与可解析Schema，选择/预览不触发写入；高风险动作经过独立人类确认、CAS、ScopeEpoch和Owner现时ACL后才提交。
3. 负向：跨Project、撤权、并发Revision变更、Frame偏差、异Digest同幂等键、取消晚回执、间接Prompt注入、D15 UNKNOWN以及CL_ONLY分别拒绝或未知。
4. 回退：新编排器先影子执行（只读不写），对比旧路径相同业务事实/指纹；完成对账后独立撤销新适配器路由，旧Owner真值未丢、不改写冻结A/B。已实际提交的副作用需要补偿/修订，**不得暗中删除业务事实**。
5. 除规划合成脚本外，浏览器GUI/CLI/Agent三入口、TS/Rust、数据库CAS/竞争、真实机床以及独立消费者均`NOT_RUN`；17资产Owner与L3`PENDING_HUMAN`。

## 失效传播

`REV_CHANGED`→STALE并使后续依赖待重建；`ACL_REVOKED`→REJECT且隔离索引/缓存；`SCOPE_EPOCH_CHANGED`→STALE；`CANCELLED_BEFORE_COMMIT`→阻止后续发送与晚回执激活；`ALREADY_COMMITTED_BEFORE_CANCEL`→保留Receipt/待对账；`UNKNOWN_CONTROLLER_SEMANTICS`→D15 UNKNOWN阻D16。日志和D17只追加，不能充当安全许可。
