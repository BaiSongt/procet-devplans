# CAP-05-02｜GUI / 3D / Agent实施规格
**统一入口**：ActivityRail 工艺规划→单`UnifiedTaskPanel` Operation→“策略参数”。从多Setup切换不再强制返回特征分析；Ribbon为策略工具组；右侧Agent仅辅助且可独立关闭；字体不超过12px，紧凑布局。
**单一Babylon世界**：复用Host/RendererPort同一Scene及相机。叠加只读加工区域、受保护区、区域余量与工具姿态预览；切换策略只改投影，不产生第二3D世界。严禁用材料扫掠伪装真实去料。
**参数区**：Stage（ROUGH/SEMI_FINISH/FINISH）、Operation ExactRef、D03刀具/材料、ap/ae（mm）、vc（m/min）、fz（mm/tooth）、区域余量/Frame、质量目标、保护PMI、来源与人类采纳状态。对比“当前/模板/用户覆盖/候选”并列显示来源与修订。
**交互状态**：READING_SOURCE→CHECKING_UNITS→CHECKING_REGIONS→READY 或 UNKNOWN/BLOCKED。工具执行显示具体操作和等待动画；取消后递增generation，晚回执必须丢弃。任何来源hash变化突出“旧版本”；重新校核前不可提交。
**受管端口**：GUI/CLI/Agent共同调用`StrategyDomainPort.query/preview/commit/cancel/compare`；提交时CAS+权限重验，收到采纳receipt才更新权威D05，预览高亮不写数据库。验证负例含无权限、过期CAS、错Frame、单位混淆、保护区越权、局部余量反增、已取消任务、无证据宣称D15 PASS。
**独立消费者验收**：D06/D09消费者按精确revision读取，核对局部失效图且不动冻结D08；D13/14/15/16不得从参数图直接标已验证。Babylon真运行、Rust/TS与产品端测试仍NOT_RUN。
