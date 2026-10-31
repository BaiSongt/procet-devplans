# CAP-07-04｜四/五轴连续刀路GUI/3D交互（L3待审）
复用唯一Babylon Scene、统一左侧TaskPanel、ActivityRail、Ribbon及独立Agent浮窗；**最大字号12px**，仅浅色/深色主题。显示坐标系通过显式右手Frame映射，不因Babylon渲染手系改变OCCT/几何Owner事实。一个TaskPanel中区分准备、姿态场、生成、独立校验、后处理、执行诊断。

1. **准备与参数**：左TaskPanel展示D01/02目标曲面与PMI修订、D03刀具组件、D04 Setup/Frame、D07有序材料态、D08冻结版本，分别列出`assetId/revision/contentHash/hashKind/coordinateFrameId/frameRevision/frameHash/scope`。支持四轴或五轴模式、球头点接触/侧刃接触策略、工艺公差、前倾/侧倾约束，未配置留UNKNOWN不可静默填默认。
2. **面选择与方向场**：3D选择和列表使用同一exact GeometryRef。显示CC点/刀具TCP/局部法向/刀轴方向，区分“几何局部检查”和“机床尚未验证”；刀轴切换时只更新OverlayLease，不提交Owner资产。独立勾选显示刀柄/夹具、保护区，缺模型标证据缺口。
3. **五轴路径预览**：按路径参数播放TCP与刀轴取向、姿态角跳变诊断和段内进给请求，警示附近奇异位形、多姿态分支与关节限位未知。**CL动画不是D14真实轴运动，也不是D15工程验证**。不得把未证明的光滑画面标为无碰撞/已认证。
4. **提交与执行**：生成候选经07 Owner CAS/ACL/generation/cancel重验后产生新D09；后续独立查看D12最终NC字节Hash、D13未知控制器语义、D14时序、D15验证状态及D16发布许可。UNKNOWN与NOT_RUN均使用明确提示，不显示绿色PASS。
5. **异步与恢复**：Agent/CLI/GUI走`07.ContinuousToolpathPort`，等待时显示实际当前阶段与队列/工具调用流光动画；取消、切换Setup、权限撤销或新一代任务使旧回执失效，释放Observer/Gizmo/OverlayLease但不删除用户草稿、旧D09或冻结D08。支持键盘、焦点恢复、浅深主题及DPI 100/125/150/200，均列为真实UI回归待跑。

本GUI是设计要求；浏览器GPU、键盘/屏幕阅读器、性能、真实机床均NOT_RUN。关联[CAP正文](README.md)和[消费者检查](independent-consumer-handoff.md)。
