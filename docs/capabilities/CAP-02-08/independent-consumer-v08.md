# CAP-02-08｜候选消费者接口与回退边界

| 责任主体 | exact Revision/Hash/Frame/证据 | 独立消费者拒绝与回退 |
|---|---|---|
| D03资源Owner | Released资源修订、Axis/Joint/接口和OEM来源 | 仅维护资源事实；无OEM凭据则UNKNOWN |
| D04名义Setup | Setup修订、Part/Fixture Frame、ScopeEpoch | 资源失效只重新评估，不自动改Setup和冻结A/B |
| D05/D08工艺要求 | RequirementSet修订、Must/Prefer与单位 | Must冲突不以评分覆盖；旧冻结只读 |
| D10机床实际绑定 | MachineInstance、parent-local安装、Controller/Post exact refs | GUI/CLI/Agent使用D10 Owner CAS，不能由D03候选Badge自动提交 |
| D09→D12→D13→D14→D15→D16 | 中立CL、最终NC、控制器语义、轴时序、独立验证及签发 | UNKNOWN/CL_ONLY不得签发，不以CL动画充当NC验证 |
| 统一GUI/CLI/Agent | 相同Owner Port、RequestId、ACL、ScopeEpoch、CAS与cancelGeneration | 单一Babylon/左TaskPanel；取消晚ACK不复权 |

旧Released/旧消费者保留只读；新DTO或离线来源未识别时返回legacy_unresolved而非读取latest、覆盖已冻结数据或伪造安全资格。已提交真实事务不因回退而被假定撤销。机器校验入口：node tools/check_cap0208_research_v08.cjs；真实性及17个消费者均NOT_RUN。见[研究补证](RESEARCH-TRACE-2026-10-28.md)。
