# U4-06｜SDK状态机、版本能力门禁、卸载合同与回退
`ModuleManifest`最小字段：schemaVersion、moduleId、moduleVersion、sdkRange、capabilityContractRange、bundleLockHash、entry、requestedCapabilities。其签署/lockHash由B0-01锁定组合提供；本例中所有hash为合成示意。Registry按(moduleId,version,contentHash)幂等挂载；相同ID不同hash返回CONFLICT，不自动替换。

**状态及异常：** DISCOVERED只读清单→SCHEMA_VALID查required/unknown必需能力→COMPATIBLE检查SDK/Capability范围与本地Tauri权限→REGISTERED从ContributionHub领取RegistrationToken→ACTIVE绑定TaskPanel和单Scene OverlayLease→DISABLING先冻结新命令再取消待办→DISPOSED注销命令/事件/Observer/Gizmo/Overlay。非法输入走DECLINED并记录精确错误。失去后端能力时呈现NOT_READY而非重试绕过权限；迟到回执只记录旧scope，不改变新Context。

**隔离边界：** Module SDK仅申报端口，Host/Tauri做窗口命令能力检查，业务Owner以expectedHead、ACL、scopeEpoch、taskGeneration、cancelToken复验；同一Event/Listener有唯一dispose责任。不能自行释放共享Babylon Scene、不能创建第二Scene，不能修改D08冻结。Node包exports不是恶意代码防护，TS类型与JSON Schema不证明运行行为，版本号不证明合同通过。

**迁移：** Expand保留旧贡献只读适配；Migrate固定exact revision/hash/frame对比新旧只读投影，字段不一致UNKNOWN；Contract仅在真实独立消费者证明安全且人类审批后退休reader。禁双写Owner、禁删除用户数据或重建业务库。回退仅回退壳层/贡献适配和注册版本，D04/D08/D12所有受控原字节不变。详见[独立消费者](independent-consumer-handoff.md)。
