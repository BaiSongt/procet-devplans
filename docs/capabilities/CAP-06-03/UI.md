# CAP-06-03｜GUI与单Babylon世界交互（设计，非实现）
**场景边界**：唯一Babylon 3D世界，三模式（传统工作台、AI+3D、仿真演示）只切状态，不新建第二个世界；统一左侧 TaskPanel 负责工作流，右侧Agent浮窗只提交受管命令。最大字号12px，浅/深主题；无卡片瀑布。GUI、CLI与Agent使用同一个 `LocalBRepRemovalDomainPort`。
| 状态 | 左 TaskPanel | 同一Babylon视口 | 权限门禁 |
|---|---|---|---|
| SOURCE | Setup、Stock-before、Candidate、Frame与Hash只读 | 毛坯/目标/待去料交叠、透明度滑杆 | 来源闭包/04域Setup精确匹配 |
| BOOLEAN_PENDING | 当前OCCT工具、操作、版本、预算、队列流光 | 原几何仍可观测，不能先显示成功后状态 | taskGeneration及取消按钮 |
| BOOLEAN_DIAGNOSTIC | CUT/COMMON/FUSE、warnings、BRepCheck、fuzzy | 对导致失败的面/边高亮，禁止给绿色“验证通过” | UNKNOWN/REJECT保留审计 |
| REPAIR_BRANCH | ShapeFix前后差异、修改Face数、容差对比、是否批准 | 双版本Ghost，仅预览，不修改D08 | 人工显式新Revision |
| REVIEW | 多Solid/多环/岛屿计数与保护区、独立D07结果 | 切StockBefore/Removed/StockAfter；相同camera/frustum | 05域采纳CAS/ACL重新检查 |
| STALE_CANCELLED | stale HEAD/晚回执/权限撤销/迁移回退 | 隔离预览、冻结旧画面只读 | 拒绝写入、新任务新代次 |
显示独立校验标识 `SYNTHETIC_PASS / PRODUCT_NOT_RUN / D07_CONSUMER_NOT_RUN`，不可将几何着色或CL播放冒称D15 NC工程验证。D04名义工艺Setup和D10机床执行绑定分别展示。
