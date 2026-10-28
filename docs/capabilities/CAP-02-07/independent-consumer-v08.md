# CAP-02-07｜独立消费者/迁移与回退（候选，不是已实现API）

| 独立消费者 | exact Revision/Hash/Frame/证据 | 拒绝或回退 |
|---|---|---|
| D03资源Owner | ResourceRevision、SourceByteHash、Template/Kernel、purpose级资格 | 提交前ACL+ScopeEpoch+CAS+cancelGeneration重验；发布仅新Revision，迟到回执只对账 |
| D04名义Setup | ResourceExactRef、Part/Fixture Frame、SetupEpoch | 资源修订变动按精确依赖标STALE，不改毛坯、保留A/B冻结 |
| D10机床实际绑定 | MachineInstance、parent-local安装、OEM及控制器精确引用 | D10≠D04；UNKNOWN/UNSUPPORTED不从Babylon矩阵推导 |
| D09/D12/D13/D14/D15/D16 | 精确资源+CL→最终NC→模态/偏置→轴时序→独立验证→发布 | 未解释语义UNKNOWN阻D16；CL动画非NC工程验证 |
| GUI/CLI/Agent | 相同D03 Port、RequestId、expectedRevision、ScopeEpoch | 预览不写；取消/切项目的晚结果只审计 |
| 独立验证者 | 来源→规则→字段→正反合成，真实OEM/OCCT/机器证据另验 | 规划检查PASS不能替代真实产品验收 |

迁移采用旧Released只读、新Draft受控写并行；保留旧Setup exact refs、旧reader和A/B冻结；离线缺OEM原资产、失去TopoID/Hash或不合规时标`legacy_unresolved`，只降级显示，不赋予碰撞及NC资格。已提交事务不能假定灰度回退自动逆转。测试入口：`node tools/check_cap0207_research_v08.cjs`，真实消费者和实机均NOT_RUN。见[研究补证](RESEARCH-TRACE-2026-10-28.md)。
