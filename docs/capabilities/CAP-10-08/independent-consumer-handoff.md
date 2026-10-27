# CAP-10-08｜17资产Owner候选与独立消费者交接

按[原始D01-D17业务Owner清单](../../architecture/v0.8/business-assets.json)逐项映射[17资产候选接口](asset-owner-candidates.json)，**这些是待会签候选而非签署结果**。10域仅写追加审计边、查源证据投影，不接管D01设计、D02制造特征、D03资源、D04名义Setup、D05/D08工艺与冻结、D06/D07求解材料、D09 CL、D10执行绑定、D11预检、D12/D13 NC、D14/D15运动验证、D16发布及D17现场原始事实。C0保持最小identity/revision/hash/unit/frame/scope/protocol。

拟定同域Port：`DigitalThreadAuditPort.queryForward(exactRef, viewerACL)`、`queryBackward`、`inspectMissingEvidence`、`draftTypedLink`、`appendAuditLinkCAS(expectedRevision,expectedHash,aclEpoch,scopeEpoch,cancelToken,idempotencyKey)`、`verifyAuditBundle(rootHash,sourceProofs,independentConsumer)`。不允许Agent越权直接改D08、D16或者调用remoteCycleStart。

**独立消费者验收入口（NOT_RUN）**：另一个进程、另一个业务Owner读取两Setup、三轴与B5机床场景及最后NC原始字节：正向/反向边对照、业务回流与实例DAG环、D04/D10 Frame错误、跨机床Profile不同、D13宏/模态UNKNOWN、D14 Joint错序、D15不独立、D16过期授权、D17时间重放与质量问题、CAS/权限撤销及取消晚回执。必须提供生产者与消费者exact SHA/binary hash、模型来源许可、控制器选件、Frame、命令、退出码、原始日志及独立结果，不能用本规划fixtures冒充。

**Expand/Migrate/Contract**：保留原各域Writer及旧Reader，先实现新审计Reader影子读取并比对原字节digest、Revision、Frame、访问控制和关系方向；真实Owner会签与独立消费验证未通过前不切新Writer。失败恢复旧Reader，但不删D08冻结、D12最终NC、D16签发或D17追加历史。历史未找回原始附件见[原字节审计缺口](../../../tracking/pending-source-gaps-2026-10-19.json)，不能伪造迁移或声称已恢复。
