# R-ASSET-OWNER-INTERFACE-001｜17资产Owner/Port/消费者受控契约的理论与工程边界

2026-10-28。研究性质：公开资料阅读 + 原业务图推导；**非标准合规认证，非真实Owner签字**。

## 定点阅读与推导

1. [W3C PROV-O（2013 Recommendation）](https://www.w3.org/TR/prov-o/)的Entity/Activity/Agent与`prov:wasDerivedFrom`可作为资产版本来源关系的表达参考，但“每D唯一写入域”“D04/D10拆分”是Procet业务设计而非其规范原文。
2. [W3C PROV-CONSTRAINTS（2013）](https://www.w3.org/TR/prov-constraints/)描述一致性约束体系；本轮只读摘要与开篇，不宣称所有PROV约束已经落地。业务类型图有反馈环而`(ID,Revision)`来源DAG须无环，是内部设计选择。
3. [RFC 8785 §3.1/3.2](https://www.rfc-editor.org/rfc/rfc8785.html)处理JSON确定性序列化；格式、字符与浮点限制不适用于未声明为JCS的任意STEP/NC/B-Rep字节。内容哈希与业务Revision是两个独立事实。
4. [RFC 9110 §13.1.1/13.2](https://www.rfc-editor.org/rfc/rfc9110.html)If-Match与预条件可防止丢失更新，但Owner仍须另外建立ACL/ScopeEpoch/CAS事务与取消代；请求发送方认可不等于业务Owner实际提交。
5. [OPC UA Part4 v1.05.07 §5.3](https://reference.opcfoundation.org/specs/OPC-10000-4/full)明确区分ServiceResult与单项StatusCode；对D17遥测/交换构建失败分层，不能据通信成功推导NC执行、机床许可或质量合格。实际厂商支持范围仍UNKNOWN。
6. [OCCT8.0.1 TopLoc_Location](https://dev.opencascade.org/doc/refman/html/class_top_loc___location.html)提供复合变换表达参考，但D04/D10需明确Frame语义、版本、parent-local与独立机床标定；此网页不证明B5实际运动。
7. [NIST SP800-53 Rev5出版页](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)仅核对出版信息与2025年变更摘要，**未读取控制正文**，因此只提示最小权限/审计需人工评审，不声称符合具体AC/AU项。

## 本项目的十项工程规则与可反驳性

- **ASOWN-R01 资产唯一写入域及非签署占位**：D01/D03/D10/D16；原包B0-02/F1-01；来源ASOWN-S01/ASOWN-S07；验收关注contracts[].assetId、contracts[].ownerCandidate、contracts[].ownerDomain、contracts[].ownerSignoff；至少一正一反例。
- **ASOWN-R02 输入/输出交叉边保持原17资产基线**：D05/D06/D12/D15；原包F1-01/W2-03；来源ASOWN-S01/ASOWN-S02；验收关注contracts[].inputs、contracts[].outputs、contracts[].producerPort、contracts[].consumerAcknowledgement；至少一正一反例。
- **ASOWN-R03 读取使用exact ID/revision/hash/schema/Frame与显式hash档案**：D01/D04/D10/D14；原包F1-01/F1-02；来源ASOWN-S03/ASOWN-S06；验收关注globalPolicies.commonReferenceFields、globalPolicies.mutableLatestAliasAllowed、globalPolicies.artifactHashMode、contracts[].framePolicy；至少一正一反例。
- **ASOWN-R04 Owner Port提交重验ACL/ScopeEpoch/CAS及撤销代**：D05/D08/D16/D17；原包W2-04/B0-06；来源ASOWN-S04/ASOWN-S07；验收关注globalPolicies.commitChecks、globalPolicies.lateAckRestoresWrite、contracts[].writeAuthority、globalPolicies.humanOwnerSigningStatus；至少一正一反例。
- **ASOWN-R05 D04名义Setup与D10执行绑定隔离**：D04/D10；原包F1-02/F1-04；来源ASOWN-S06/ASOWN-S01；验收关注globalPolicies.d04D10Separate、contracts[D04].ownerDomain、contracts[D10].ownerDomain、contracts[D10].producerCapabilities；至少一正一反例。
- **ASOWN-R06 A/B共事实且冻结D08只经新Revision变更**：D05/D06/D08；原包W2-02/W2-06；来源ASOWN-S01/ASOWN-S02；验收关注globalPolicies.immutableABFreeze、contracts[D08].ownerDomain、contracts[D05].writeAuthority、contracts[D06].writeAuthority；至少一正一反例。
- **ASOWN-R07 中立CL与NC全链端口独立**：D09/D12/D13/D14/D15/D16；原包E3-01/E3-03/E3-04/E3-05/E3-06；来源ASOWN-S01/ASOWN-S05；验收关注globalPolicies.ncChain、globalPolicies.clAnimationGrantsNcPass、contracts[D13].ownerDomain、contracts[D15].ownerDomain；至少一正一反例。
- **ASOWN-R08 未支持执行语义保持unknown且阻断D16**：D11/D13/D15/D16；原包E3-03/E3-05；来源ASOWN-S05/ASOWN-S07；验收关注globalPolicies.unknownExecutionGrantsRelease、contracts[D11].invariant、contracts[D13].invariant、contracts[D16].invariant；至少一正一反例。
- **ASOWN-R09 GUI/CLI/Agent同Owner端口、唯一Babylon与左容器**：D01/D04/D09/D10；原包U4-01/F1-03；来源ASOWN-S04/ASOWN-S06；验收关注globalPolicies.singleBabylonWorld、globalPolicies.unifiedLeftTaskPanel、globalPolicies.entrypointDomainPortUnified、contracts[].readEntry；至少一正一反例。
- **ASOWN-R10 独立消费者验收、旧数据回退、审计结论分级**：D12/D15/D16/D17；原包F1-06/T5-03；来源ASOWN-S02/ASOWN-S07；验收关注globalPolicies.independentConsumerRequired、globalPolicies.legacyUnknownWriteAllowed、globalPolicies.migrationRequiresRollbackRef、globalPolicies.productStatus；至少一正一反例。

完整链路：[研究登记](../sources/ASSET-OWNERS-V08.json)→[规则](../traces/ASSET-OWNERS-V08.json)→[17资产矩阵](../../docs/architecture/v0.8/owner-interface-review-v08.json)→[正反Fixture](../../docs/architecture/v0.8/owner-port-review-fixtures.json)→[静态校验器](../../tools/check_asset_owner_ports_v08.cjs)。检验通过只能说明候选契约未违反当前原基线和显式负例，不推定接口代码存在、消费者已签或最终NC安全。
