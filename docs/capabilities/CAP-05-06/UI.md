# CAP-05-06｜统一GUI与3D交互（规划）
只使用现有Host/RendererPort、单Babylon世界、ActivityRail和统一左TaskPanel；不得引入新的3D场景容器。浅/深双主题，所有文字最大12px，右Agent可独立显隐。
1. **读取**：工程/Setup/D05/D08的exact revision/hash/frame、任务scopeEpoch明显可见；切换即清除3D临时选择/租约。
2. **冻结选择**：树形工序stable ID勾选，3D用现有高亮层显示D02真实occurrencePath、D04 Frame、冻结范围和依赖闭包。未知Frame不伪显示定位正确。
3. **三方冲突**：base/current/proposed同屏差异，NODE_OVERLAP、DEPENDENCY_CROSS、SOURCE_STALE和UNKNOWN明确展示；人工解决须原因与签署权。
4. **受控提交**：点击“预览”只读，点击“提交”重新校验CAS/ACL/sourceHash，显示执行工具、等待动画、取消和迟回执状态；成功才展示新D05修订及D08快照。
5. **解冻及历史**：单独审批入口；冻结历史仍可按旧修订查看，A/B分支不互盖；D15/NC未验证显示NOT_RUN/UNKNOWN而非安全绿色PASS。
GUI、CLI、Agent完全共用`ProcessPlanFreezeDomainPort`，Agent只生成建议不越权；3D高亮不能代替业务提交。
