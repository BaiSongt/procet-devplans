# R-SIM-PLAYBACK-EVIDENCE-001｜播放与NC工程证据的可验证边界

研究目标是让用户在同一3D世界中回溯最终NC、执行实例、物理Joint时序和独立验证，而不是用一段漂亮动画代替机床工程验证。

1. **NC格式与执行语义（S01/S09）**：ISO 6983-1:2009官方仅开放目录/摘要；NIST IR6556仅官方著录。两者不能推出具体B5控制器行为、NC解释器已实现或安全通过。D13必须是单独控制器语义解释层。
2. **预览不等于实际轨迹（S02）**：LinuxCNC 2.9 AXIS公开手册把预览、backplot、NC文本选中及Commanded/Actual位置分开，支持在GUI明确“预计事件”和“实机反馈”。它不构成Procet机床验证。
3. **时间轴与渲染（S03/S04）**：Babylon Lite的goToFrame、AnimationGroup时间/播放字段可作为交互概念依据，但Lite与目标完整版Babylon并非可直接互换，必须锁实际版本再测；倍速/FPS不定义D14物理时基。
4. **显示与几何检查（S05）**：OCCT8.0.1 AIS_InteractiveContext具有显示/高亮能力，不意味着Babylon呈现已执行碰撞检测，更不意味着连续运动无碰证明。
5. **数据充分性与验证目的（S06）**：NIST Kibira/Shao 2026官网摘要强调数字孪生数据应按应用目的匹配，支持报告显式暴露未建模区间和证据类型，不可转译为机床认证。
6. **证据与并发（S07/S08）**：W3C PROV-O可描述D12→D13→D14→D15谱系，RFC9110 If-Match提供条件更新参考；ACL、事务取消、独立Oracle与人类审批仍属于业务系统独立责任。

[来源登记与阅读限制](../sources/CAP-09-08.json) → [10规则40字段](../traces/CAP-09-08.json) → [30正反独立变异+14状态](../../docs/capabilities/CAP-09-08/fixtures.json) → [独立消费者](../../docs/capabilities/CAP-09-08/independent-consumer-handoff.md)。未读付费标准、NIST论文正文均明确保留未读；真实NC/机床/消费者NOT_RUN，L3待审。**规划PASS≠产品PASS**。
