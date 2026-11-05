# CAP-10-05｜独立消费者与历史兼容

D17 Owner候选为10域，D03由02域读；D04名义Setup不得冒充D10现场绑定，D12/D13/D14/D15所有既有Owner独立。**17资产正式跨域会签仍PENDING_HUMAN**。

**端口提案**：`10.MdcObservationPort.discoverReadOnly(D03ExactRef)`、`readCursor(instanceId,sequence)`、`appendCAS(expectedRevision/hash,scopeEpoch,aclEpoch,cancelToken)`、`queryProjection(qualityPolicy)`。单一D17 Writer，不允GUI/Agent/CLI旁路。原始包与加工证据严格分层。

**真实独立消费者要求（NOT_RUN）**：在非生产模拟器/获授权设备上记录机床固件、Profile、Agent instanceId、NodeId映射、raw数据SHA与采集时间；由另一实现验证正常样本、Agent重启、firstSequence丢包、OUT_OF_RANGE、OPC Bad/Uncertain/Overflow、SourceTimestamp null、跨时钟漂移、警报clear、断网、ACL撤销、切工程、取消晚ACK、D10错帧、D12 NC字节错配及工单误关联。记录测试命令、exitCode、logDigest与独立Oracle身份，不填充虚构PASS。

**Expand/Migrate/Contract**：先双读旧采集器与新Port，按设备/映射hash/单位/时戳/质量影子比较；独立消费者及人类审查通过才切换唯一D17 Writer。失败回退旧Reader，保留原始日志、D08 A/B冻结、D12 NC字节和D16发布历史，不删客户数据、不变更机床程序。实机机床、浏览器及Node独立进程NOT_RUN；规划PASS≠产品PASS。
