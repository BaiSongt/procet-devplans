# U4-05｜独立消费者验收与渐进迁移
> 规划交接，不声称产品运行。U4-05不能被仅运行本包fixtures判为产品完成。

## 独立验收消费者
由非实现者控制、在隔离工程数据副本和独立进程中运行真实GUI/CLI/Agent领域Port；输入固定的`WorkContextRef`和至少一个具有真实hash/frame的合法非客户公开测试模型。独立生成`manifest.json`：消费者源码/二进制hash、产品exact HEAD、测试素材bytesHash、环境、操作序列、起止时间、退出码、Owner写入前后摘要、Browser Heap Snapshot及GPU可观测计数。录屏/截图只能辅助审查，不能替代Owner持久回执。

正例覆盖：两主题逐Token对比度；Tab/ESC/脏稿/模态焦点恢复；键盘分栏替代；四档DPI安全区；减少动效模式；30次切空间后Observer/OverlayLease归零并比对Heap/GPU；GUI/CLI/Agent相同scope与权限响应，U4-03/04消息流跨panel不串上下文。

反例覆盖：不足4.5:1、漏焦点、ESC丢未保存草稿、按钮不足尺寸且无适用例外、低DPI遮挡、缩放后错误命中、旧异步回执冲掉新Context、未释放Observer、误释放共享材质、跨版本性能数据硬比较、UI直接Owner写入、D09 CL预演误认D15 PASS。不能观察到GPU指标记`UNKNOWN`而不是PASS。

## 渐进迁移与回退
**Expand：** 新主题令牌与焦点状态只读接入，原样式/旧控制继续工作；引入安全区定义但不切换Scene。**Migrate：** 双读UI视图状态做差异日志（不可双写领域Owner）；AssetRef和Frame按exact读取，给每个Overlay绑定generation。**Contract：** 只有经人工批准的独立消费者通过才移除旧样式适配；若失败仅回退CSS/动画/渲染租约配置，恢复旧展示，不回滚/删除D08冻结或用户数据库。失效或不兼容时返回`STALE_REVISION/UNKNOWN_SCOPE`，不能选择“最近版本”替换。

Owner提交由相应领域实现验证CAS、ACL、taskGeneration、scopeEpoch和取消；GUI未获权限即使渲染按钮也不可写。D04 Setup与D10执行绑定分离；D09→D12→D13→D14→D15→D16工程链独立验证，未建模控制器语义`UNKNOWN`阻断D16，禁用材料扫掠仿真。最终交付需真实证据清单、阈值批准记录、Owner签署和L3审批；现状态全部未完成。
