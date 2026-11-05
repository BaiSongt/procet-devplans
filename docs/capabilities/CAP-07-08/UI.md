# CAP-07-08｜单Babylon世界与统一左TaskPanel
入口为已有ActivityRail的CAM路径任务，复用唯一Babylon Scene和RendererPort，不再创建独立3D世界。统一左TaskPanel负责D09修订选择、stableSegmentId列表、编辑参数、变更范围预览、确认/撤销与历史版本；最大字号12px，仅浅色/深色主题。
| UI位置 | 必备字段/行为 | 失败状态 |
|---|---|---|
| 上下文头 | project、Setup与D04 frameHash、D08冻结hash、D09 exact baseRevision/hash | 任一来源缺失不可提交 |
| 段级编辑 | old/new TCP、刀轴、feedIntent、运动typed kind、段ID、相邻连接 | 弧参数不完整、端点不连续或跨Frame明确拒绝 |
| 影响分析 | dirtySeeds、传递闭包、scope升级、逐级D11至D16的STALE/UNKNOWN | 图缺边不能以仅可视段代表真实影响 |
| 3D预览 | 旧段灰色ghost，新段高亮，邻段和连接叠层，租约生命周期 | 预览无业务提交资格，取消释放资源 |
| 审批区 | expectedHead、ACL、scopeEpoch、receiptGeneration、taskGeneration与cancelRequested | CAS失败/撤权/晚回执均REJECT |
| 历史回退 | 原/新D09派生链、旧发布证据及重验需求 | 旧D15 PASS不能复用为新NC验证 |
预览流动等待态须分别显示队列、局部求解、验证、提交和取消状态。Agent/CLI/GUI相同Owner Port；Babylon只是渲染，不是几何或业务事实。D11 CL播放不冒充D15机床验证。
