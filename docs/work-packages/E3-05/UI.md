# E3-05｜GUI、CLI、Agent和单Babylon世界交互契约
**仅交互规划，尚无真实Babylon/NC运行。** 遵循统一左侧TaskPanel + 唯一Babylon Scene；左侧Rail的“NC验证”入口与NC Workbench的“验证”按钮汇入同一个领域用例。

## 任务与状态
1. 选择工程→文档→Setup→D12 NC精确修订；可直接查看D13未知行、D14时序覆盖和D10/D03资源版本；不能默认绑定最近机床。
2. TaskPanel顶部固定“NC字节SHA、方言SHA、机床构型hash、WCS、刀具/刀柄、Frame”。每项分为EXACT、STALE、UNKNOWN；UNKNOWN不得出现绿色通过标签。
3. 中间维度表：NC语义、Frame/偏置、限位/奇异、几何有效性、离散干涉、连续证明、控制器对照；分别标注PASS/FAIL/UNKNOWN/NOT_RUN和覆盖片段、容差、采样。
4. 3D 复用RendererPort的同一个Babylon world，通过事件ID/NC行定位时序和相关实体；颜色表示检查结果**不表示认证**。预览Overlay有租约和销毁，切换文档/Setup释放旧选择，不写业务真值。
5. 明确区分“播放成功”“离散样点未观测碰撞”“连续路径有证明”“D15验证记录已审”“D16可发布”；这些状态不可相互替代。
6. 工具调用/Agent操作展示执行进度、取消与当前工具；Host重验权限、expectedRevision和cancelToken；晚回执记录但不采纳。
7. CLI：`verification request|inspect|recheck`；Agent用同一D15命令schema，不得直接写数据库、变更D08冻结数据或下发机床。
8. A/B模式同一事实，主题仅浅/深，最大字号12px；GUI切换不引发制造资产变更。

## 异常分支
- NC字节SHA或方言改变→STALE来源，旧Run保留只读；禁止自动继承D15/D16资格。
- 真B-Rep无效/只有mesh→UNKNOWN_GEOMETRY；显示3D不作为认证证据。
- 控制器专有宏未解释→UNKNOWN_SEMANTIC，并标注行/块/方言；禁止从CL补数据。
- 仅有限采样无保守误差界→CONTINUOUS_UNKNOWN，不允许展示全轨迹安全。
- D16独立消费方未执行→PENDING_CONSUMER_REVIEW，禁止显示“可下发”。
