# CAP-04-05｜多Setup与转序的GUI、3D和三入口
**原则：只用主Babylon 3D世界与唯一左侧UnifiedTaskPanel；Ribbon联动Stage任务，不建第二个3D，也不要求先返回特征分析。**
## 五个任务页面
1. **Setup序列**：左侧序列树显示Setup-A/B/C和stageId、当前D04 revision/hash、cad occurrence、已冻结标记；单击条目在同一3D世界切换预览。点击“添加Setup”仅创建草稿，禁止隐式迁移前一Setup的夹紧证据。跨Setup切换提升scopeEpoch并废弃旧PreviewLease。
2. **翻面与定位**：3D显示旧/新名义姿态的半透明ghost、Part/Stock/Fixture坐标三轴和差异。选择“绕轴翻面/重新夹紧/同向下一序”；给出mm/rad、Frame方向与det(R)有效性。自动落座/对中是独立按钮，重复操作幂等且不改stock尺寸。
3. **转序与材料**：左侧列前序D07 exact输出→后序候选毛坯、工序/特征precedence、PMI datum关联；没有材料去除证据时明确UNKNOWN，禁止显示自动完成的“已加工实体”。支持仅显示未完成候选。
4. **约束与依赖**：显示Stage DAG，不允许环；列受影响的D05/06/07/09/10、D08冻结与D16已发布快照，提示D10待重绑定。静态几何警告单独分区，不展示虚构的D15工程通过。
5. **差异、审批与提交**：old/new D04 diff、依赖哈希、scopeEpoch、待决证据与迁移回退。用户显式Commit；Host重新验权限与CAS，返回revision/hash/receipt；失败保留原快照和待办，不跳过审批。
## 三入口一致性与事件时序
活动Rail→Setup→MultiSetupTask。统一领域命令 propose/validate/commit/cancel；CLI建议形态为“procet setup sequence propose --setup-id … --expected-rev …”，Agent也必须经同一Host授权port；均是**设计建议，非现有CLI能力证明**。
3D选中信息固定为{projectId,documentInstanceId,setupId,scopeEpoch,sourceExactRef,occurrencePath,topologySnapshotRef,representationQuality,sourceFrame}。Canvas/mesh pick本身不能替代真实CAD拓扑来源；3D ghost不保存。切换项目/Setup/权限或ESC取消AI+3D后，旧请求的响应不进入当前面板。
支持键盘顺序切换、浅/深主题、狭窄屏幕调宽左任务区；导出给独立消费者的验收证据包含截图关联到具体D04快照，而非仅图片。
