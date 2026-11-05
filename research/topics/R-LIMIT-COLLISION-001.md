# R-LIMIT-COLLISION-001｜NC机床限位、干涉与连续性证据

**范围**：09域CAP-09-07；研究记录不直接修改产品、L1/L2、17资产Owner签字或实机配置。

## 研究问题与可推导结论
1. ISO 230-1:2012只以公开Abstract讨论无载/准静态几何准确度测试，不是机器运行碰撞安全规范；ISO 10791-1:2015公开摘要强调水平主轴加工中心几何验证与运行测试分离。因此，本系统不得引用其未读正文承诺B5龙门AC动态安全。来源C0907-S01/S02。
2. LinuxCNC2.9 INI明确笛卡尔Axis和物理Joint限位层不同，非恒等运动学下符合Cartesian区间仍可能物理Joint违规；这支持双层检查合同，但不得把LinuxCNC行为推断成真实B5控制器。来源C0907-S03/S04。
3. OCCT8.0.1 `BRepExtrema_DistShapeShape`是固定姿态Shape静态距离查询，`IsDone`表示本次计算完成，并非连续轨迹安全证书。arXiv:2405.00362摘要解释离散采样可能漏中途碰撞；具体连续检测方法未读正文、未验证，不能据此宣称已实现。来源C0907-S05/S08。
4. NIST Kibira/Shao 2026研究摘要强调按使用目的选定数字孪生数据与充分性；NIST Shao/Lee/McLean 2003摘要支持制造数据发布前模拟与检查清单，但两者都不是B5限位或碰撞实验数据。来源C0907-S06/S07。
5. PROV-O `wasDerivedFrom`可描述D12→D15证据溯源；RFC9110 §13.1.1 If-Match支持条件更新防丢失，但两者不是权限CAS和独立NC物理Oracle的替代品。来源C0907-S09/S10。

## 落地为可检证据链
[登记10来源](../sources/CAP-09-07.json) → [10规则/40字段/原包映射](../traces/CAP-09-07.json) → [30字段正反/20状态/6数学反例](../../docs/capabilities/CAP-09-07/fixtures.json) → [独立消费者与历史迁移](../../docs/capabilities/CAP-09-07/independent-consumer-handoff.md)。设计阈值不能取自不存在的机床手册。实际机床碰撞/NC和独立消费者均NOT_RUN，17 Owner和L3 PENDING_HUMAN。**规划PASS≠产品PASS**。
