# B19｜CAP-01-07 单Babylon世界的WebGL上下文丢失与恢复资格

**2026-10-29 · NEWLY_AUTHORED · 研究补证，不覆盖原CAP-01-07/原U4编号；L3待人类审批。**

## 1. 为什么需要这个补证

已有CAP-01-07定义唯一Engine/Scene/Canvas、项目/资源Root顺序切换、左侧UnifiedTaskPanel、SceneRevision、PreviewLease、D04的Scope/CAS及D09与D13—D16隔离。但没有细化WebGL绘图上下文丢失、GPU资源重建、恢复前后拾取/预览回执的身份资格。**即使重建画面成功，也不能以GPU视觉恢复证明业务对象、机床资源、NC执行或安全验证恢复成功。**

## 2. 已核对的公开依据与阅读边界

详见[逐来源作者、版本、日期、实际阅读章节、局限及八条规则](../../../research/traces/CAP-01-07-webgl-recovery-b19-v08.json)。本轮只引用合法公开内容，不照搬规范正文。

- **Khronos Group / Dean Jackson (editor), WebGL Specification 1.0.3, 2014-10-27**：[官方公开HTML](https://registry.khronos.org/webgl/specs/1.0.3/)，定点阅读Context Lost/Restored事件及旧GPU资源失效。它不规定Babylon实现及D04 CAS。
- **Khronos WebGL Working Group / Glenn Maynard, WEBGL_lose_context Revision 15, 2020-02-06**：[官方扩展规范](https://registry.khronos.org/webgl/extensions/WEBGL_lose_context/)，阅读Version/Overview/New Functions：restoreContext只排队事件，不能同步视为已恢复；正确的lost事件处理影响可恢复资格。扩展是否可用须真实环境检测。
- **MDN contributors, webglcontextrestored**：[公开开发参考](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event)，实读Syntax/恢复后资源失效；在线版无冻结修订。
- **BabylonJS maintainers, Babylon.js README master**：[官方公开仓](https://github.com/BabylonJS/Babylon.js)，仅读Usage中Engine/Scene/Canvas示例；master可变，**未读取确切Babylon版本的Engine恢复实现**，不声称自动恢复全部纹理、Mesh、Worker。

## 3. 工程场景和模块交接

| 阶段 | 单世界行为 | 领域、权限和回执行为 |
|---|---|---|
| 正常运行 | 单Engine/Scene/Canvas；项目/资源Root只激活一个；统一左TaskPanel | Host持有scope/Actor，D01/03/04各自维护exact revision/hash/frame |
| 接收lost | Engine所属Canvas挂起渲染；等待浏览器恢复事件；显示诊断 | 不抹除D04/D08冻结；不凭画面变化取消领域Job |
| 等待恢复 | 拾取与GPU预览候选冻结；缓存requestId及gpuEpoch | GUI/CLI/Agent继续由同一领域Port决定权限，不自授Actor |
| 接收restored | 按实际所用Babylon版本重新建立或验证GPU资源；推进gpuEpoch | 旧pick、旧preview与跨Setup晚回执全部重新核验 |
| 恢复后再次提交 | 当前sceneRevision、源D01 exactRef与Frame仍对应才允许选择 | D04重验scopeEpoch、permissionEpoch、exact revision/hash/frame及CAS；失败不覆盖他人冻结 |
| D09/NC展示 | GPU可恢复CL/NC可视化，仅为视图 | D13 unknown仍unknown；D14/D15/D16只接受独立真实NC工程证据，不做材料扫掠仿真 |

**C0最小字段候选**：rendererHostId、gpuEpoch、sceneRevision、sourceExactRef、sourceFrame、scopeEpoch、permissionEpoch、ownerExactRevision、PreviewLeaseId、cancellationId。GPU epoch属于Renderer派生状态，不能擅自成为制造资产的新权威revision；L1/L2保持不变。

**GUI/CLI/Agent**：三入口显示不同但调用同一D04 OwnerPort；GUI恢复的是Renderer，CLI/Agent无需GPU即可查询领域状态；恢复后的UI不可自动重放已取消或被撤权的领域写命令。D04 Setup与D10机床执行绑定不合并，A/B同事实不覆盖冻结。

## 4. 实施、迁移及回退

- U4-03负责gpuEpoch/sceneRevision/源ref和预览lease隔离；U4-05负责浏览器失上下文注入、可访问故障提示及GPU对象回收；U4-06负责统一接口、异常/旧消费者适配和跨端一致性。每个切口必须由GUI、领域Owner与独立消费者确认具体源码HEAD和测试入口。
- 首期只建立无破坏的RenderRecoveryPort适配，保留旧RendererPort/旧任务入口。新路径不可靠时关闭恢复特性开关、返回可诊断只读或重新加载当前UI；**不能以回退方式恢复失效权限、替换冻结修订、越过D15或者生成静默业务写入**。
- 测试入口候选：浏览器受控`WEBGL_lose_context`注入（若支持）、长时异步拾取在lost/restored期间竞争、切Setup晚回执、取消/撤权与资源恢复竞争、10次重复失上下文后单Engine/Scene/Canvas与左TaskPanel计数、D13未知语义阻断发布。缺乏可用扩展时记录`NOT_RUN`，不得伪造通过。

## 5. 来源→规则→字段→独立正反验收

[8条B19规则及来源和字段](../../../research/traces/CAP-01-07-webgl-recovery-b19-v08.json) → [1正26独立单字段反例](webgl-recovery-b19-fixtures-v08.json) → [只读Node规划校验器](../../../tools/check_cap0107_webgl_recovery_b19_v08.cjs) → [等级记录](../../../tracking/cap0107-webgl-recovery-b19-verification-2026-10-29.json)。

规划合成例为**已收到restored事件的业务快照**，不是浏览器/WebGL/Babylon真实恢复事件。当前规则中Frame、owner hash的实装检查需要真实Owner对照及独立消费测试，合成`expectedOwnerRevision`不能替代密码学hash核验。

**状态：规划合成通过≠真实浏览器或产品PASS。** 17资产正式Owner签署仍未确认，L3待人审；OCCT、NC、B5/OEM、真实消费者仍未运行；完整全仓Markdown AST及历史附件原字节未闭合。
