# B170｜CAP-01-07 Babylon WebGPU后端资格、设备失联与可回退规划（2026-11-05）

> NEWLY_AUTHORED。保持原11域88CAP、36原工作包、17业务资产、L1/L2不变；L3待人类审批。规划PASS≠产品PASS。

## 论证与证据边界
WebGPU API存在、Adapter可用、Babylon Engine异步初始化完成、3D Pick有效、领域Owner提交成功是五个独立事实。W3C 2026-09-15 WebGPU CRD公开§4、§21，Babylon官方WebGPU Support与Breaking Changes（master滚动文档），MDN requestAdapter、GPUDevice.lost公开章节已于2026-11-05定点阅读。[7条来源含作者版本访问深度与局限](../../../research/sources/CAP-01-07-webgpu-backend-b170.json)。未获得Procet当前Babylon SDK/浏览器/驱动和性能实测，不能因WebGPU理论上更高效就给出产品加速百分比。Babylon官方说明readPixels异步Promise、initAsync及WebGL并存，Device lost需重建GPU资源。master文档不等于产品版本。

## 功能、GUI/3D、同领域Port与失效行为
1. RendererHost探测secure context、adapter、features/limits、fallback adapter，先完成异步init再建立唯一Engine/Scene/Canvas。工程与制造资源桌面仅切同Scene可见Root；ActivityRail、Ribbon和**唯一左侧UnifiedTaskPanel**保留，禁止多个主Scene或右Drawer。
2. 初始化失败可在Scene创建前走WebGL。运行中的Device lost先冻结旧readback/Pick/PreviewLease并推进gpuEpoch，转READ_ONLY_LOST；**不得对活动Scene原位热换WebGL**，必须dispose旧Renderer投影、完整重建Engine/Scene与GPU资源，并从D01/D03/D04 exact快照重投影。失败进入只读诊断或明确重载，不虚报已恢复。
3. 所有异步GPU拾取回执绑定rendererHostId、gpuEpoch、sceneRevision、sourceHash、FrameRef、scopeEpoch、PreviewLeaseId。回执到达须重验epoch/sourceHash/Frame/scope，失配只记STALE_RENDER_RESULT，不得自动成为3D选中或提交结果。
4. GUI/CLI/Agent共用Host Actor和领域Owner Port；D01/D03原始revision/hash/frame、D04工艺Setup、D10执行绑定由各自Owner负责。写入于提交点复验CAS、permissionEpoch/ACL、scopeEpoch及cancelFence；迟到回执只记诊断，A/B共享事实但不覆盖D08冻结。
5. D04 Setup≠D10实际执行绑定。中立CL→NC后处理→D13语义→D14轴时序→D15独立工程验证→D16发布；unknown必须阻断，CL动画和WebGPU高帧率不等于NC安全。本轮不做材料扫掠仿真。

## 可测性能与回退门禁（目标，不是现有测量）
| 场景 | 必须收集的证据 | 当前 |
|---|---|---|
| 同一STEP装配/PMI冷启动 | 产品exact HEAD、SDK、浏览器/Electron、GPU/驱动、冷启动P50/P95 | NOT_RUN |
| 两个Root切换与点线面Pick | 相同模型Hash、帧时间P95、拾取正确率、readPixels晚回执隔离 | NOT_RUN |
| Device lost与回退 | 注入故障前后只有1 Engine/Scene/Canvas，旧Promise拒采、冻结不丢 | NOT_RUN |
| GUI/CLI/Agent与NC | Owner CAS/ACL/取消重验，D13 unknown不能发布D16 | NOT_RUN |

U4-03/05/06先通过RendererPort适配层扩展，保留旧WebGL reader和独立回退feature flag；切旧渲染路径不迁移权威领域Revision、不重新授予撤销的权限。真实测试需独立Renderer、Host、D04 Owner、D10/D13/D15消费者在锁定产品HEAD运行，不能用单个模拟器自签。

## 来源→规则→字段→CAP/原工作包→验收
[8规则32字段追踪](../../../research/traces/CAP-01-07-webgpu-backend-b170-v08.json) → [8正32严格单字段反例8状态Golden](webgpu-backend-b170-fixtures-v08.json) → [Node只读规划校验器](../../../tools/check_cap0107_webgpu_backend_b170_v08.cjs) → [分层验收状态](../../../tracking/cap0107-webgpu-backend-b170-verification-2026-11-05.json)。本轮仅合成48/48；真实GPU、Node独立进程、17资产正式Owner签署0/17、真实独立消费者0/17、L3、全仓GFM AST与历史原件字节仍开放。规划PASS≠产品PASS。
