# B50｜CAP-01-07 三维尺寸直接编辑的语义锚点与再生契约

**日期：2026-10-31。原11域88 CAP/36工作包、L1/L2不变，L3待人类评审；本轮是规划规则、不是OCCT/Babylon产品实现。** 关联[原CAP-01-07](RESEARCH-BACKFILL.md)、[制造资源与毛坯CAP-02-05](../CAP-02-05/README.md)、[人工特征编辑CAP-03-06](../CAP-03-06/README.md)、[U4-02](../../work-packages/U4-02.md)、[U4-03](../../work-packages/U4-03.md)。

## 1. 从3D尺寸修改到业务数据：三类尺寸不能混淆

| 意图 | 来源与写Owner | 3D交互 | 能否直接修改几何 |
|---|---|---|---|
| `MEASURED` 几何测量 | CAD/资源exact B-Rep+Frame，计算值只读 | 画测量线和数值 | **否**。测量值是结果，不能把显示数值写回CAD |
| `REFERENCE_PMI` 设计/检验要求 | D01 CAD/PMI确切修订与拓扑附着 | 显示尺寸、公差和语义来源 | **否**。更改PMI属于03域另行受控操作，不能在本入口偷换几何 |
| `DRIVING` 参数驱动尺寸 | D03资源定义（刀柄长度/工具安装位置/夹具孔距等）或D04单Setup毛坯实例 | 3D尺寸输入框与Gizmo只生成提案 | **是，但必须有领域参数Ref、再生求解器、几何重绑与Owner提交** |

D01 imported STEP仅凭一个圆面或一根线的可测长度不能假装有可反向求解的参数化特征树。若无建模历史/参数驱动关系，返回`READ_ONLY`或`UNKNOWN`，不把缩放mesh当“修改CAD”。D03中的`released`资源改尺寸必须**派生新资源revision**；D04的当前毛坯修改必须**新Setup revision**，禁止后台把同一资源模板和所有已采用Setup一起修改。D10实际机床执行绑定独立于D04，需在后续重新适配。

## 2. 尺寸对象、端口与受管事务（L3待审提案）

`DimensionIntent={id,kind,sourceExact:{domain,assetId,revision,contentHash,geometryHash,occurrencePath,frameRef,frameRevision,frameHash,scopeKey}, anchor:{geometryRef,topologyRef,occurrencePath,frameRef,rebindState}, parameterRef?,sourceValue,requestedValue?,unit,displayUnit,numericPolicyRef,recomputeProfileRef,editAllowed}`。

`DimensionIntentPort`的候选职责：`inspectDimensions(exactRef)`（只读）、`resolveAnchor(exactGeometry)`、`proposeParameterChange(cmd)`、`evaluateRegeneration(proposal)`、`explainInvalidation(proposal)`、`commitDimensionChange(cmd)`、`getReceipt(requestId)`、`cancelPreview(scopeEpoch)`。GUI/CLI/Agent同一用例路径，Host提供Actor/scope，领域Owner判断权限与CAS；C0仅承载身份/单位/Frame/hash/作用域，不容纳实体建模图。

流程：选中具有源身份的尺寸 → 判断`READ_ONLY/DRIVING` → 输入数值（可从Gizmo拖动采样但拖动不写字段主权）→ 领域根据**原修订**生成绝对参数ChangeSet → 原几何再生与约束求解 → 新B-Rep Hash、拓扑重绑/几何有效性资格 → 左UnifiedTaskPanel显示新旧差异及`unknown` → 用户显式审阅 → Owner在真正提交时重新检查ACL、CAS、源Hash、Frame、scopeEpoch和取消态 → 返回新revision/receipt后再更新3D。这一流程不声明OCCT OCAF会自动实现完整CAD产品：函数驱动和求解器仍由应用实现。

## 3. 理论根据：为何必须分离显示值与驱动值

1. OCCT 8.0.1 [OCAF Function Services](https://occt3d.com/dev/doc/overview/html/occt_user_guides__ocaf.html) 定点公开正文说明`TFunction`驱动模型再生，参数改变后需要按依赖传播（例如面→棱柱→圆角）；故**用户修改尺寸数值不等于旧B-Rep自动变化**。这是API模型启示，不是Procet已有功能的证据。
2. [TDataXtd_Constraint](https://www.occt3d.com/dev/doc/refman/html/class_t_data_xtd___constraint.html) 区分尺寸约束、底层几何、数值和`Verified`状态；`Verified`默认可为true，**仅读取该标志不能作为工业验证通过**。Procet必须由建模驱动实际重算、几何检查、Owner结果复核。
3. [TDataStd_Real](https://occt3d.com/dev/doc/refman/html/class_t_data_std___real.html) 在8.0.1注明`SetDimension/GetDimension`废弃且其维度信息**不参与持久化**。因此单位`mm`、Frame、数值政策必须用Procet显式schema字段保存；不能用旧属性作为唯一单位凭据。
4. [TNaming_Tool](https://www.occt3d.com/dev/doc/refman/html/class_t_naming___tool.html) 与OCAF拓扑演化可追溯修改后的候选形状，**但不保证所有外来STEP或改参数后的Face锚点唯一**；分裂/合并、多解保持`UNKNOWN`并禁止自动重新附着PMI。
5. BabylonJS [AxisDragGizmo源码](https://github.com/BabylonJS/Babylon.js/blob/master/packages/dev/core/src/Gizmos/axisDragGizmo.ts)展示`dragBehavior`、`snapDistance`和`onSnapObservable`的呈现能力，不能证明数值已成为OCCT参数或通过CAS。该来源为未冻结master，实施时需以产品锁定版本复核。
6. W3C [WCAG 2.2 2.5.7官方说明](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)说明应提供无需拖拽的单指替代。**在3D尺寸旁提供可点击数值输入**同时解决精确尺寸修改与拖拽无法操作的可达性问题；字体最大12px的内部规范不等于命中目标12px。
7. NIST [Ruemler等2016 MBD报告](https://www.nist.gov/publications/promoting-model-based-definition-establish-common-information-model)本轮**仅阅读官方出版页及摘要**，用作跨生命周期语义背景；未读全文，不由其推导字段、尺寸精度或制造认证。

全部来源作者、版本、URL、访问日期、阅读深度和限制见[来源登记](../../../research/sources/CAP-01-07-dimension-edit-b50.json)。

## 4. 状态、不变量与独立消费者

- 状态：`INSPECTED → DRAFT → PROPOSED → REGEN_CHECKED → REVIEWED → COMMITTED`；缺精确B-Rep、定位歧义、约束状态不明走`UNKNOWN`；无驱动参数的测量/PMI走`READ_ONLY`；无权限、旧revision、取消晚回执则`REJECT`。同输入重复提案不累计缩放/位移。
- 单一Babylon Engine/Scene/Canvas和统一左TaskPanel。制造资源世界与工程世界仅切换同场景的活跃Root/摄像机会话；Inline尺寸文本、拖拽Gizmo、CLI参数输入和Agent命令必须采用相同DomainPort。Esc关闭Overlay但保留脏EditSession；脱离旧scope立即释放租约。
- **Owner exact闭包**：D03参数资源包含`resourceId/revision/hash/geometryHash/frameRef+revision/hash`；D04 Setup修改另取`setupId/revision/hash/stockFrame`。Renderer和旧`meshId`只有投影，不得拥有写入权。D08/D16冻结只追加来源记录；D04/D07/D09以及引用它们的D10/D13/D14/D15按依赖失效，不把D09 CL预演冒充D15 NC工程验证。
- **独立消费方最低矩阵**：02域资源Owner以不同会话重取exact D03新旧版本与真实B-Rep对比；04域按Setup确切revision验证D03变更只标stale而不暗改D04；03域验证PMI锚点不从mesh索引重绑；06域独立再算使用新/旧数据的几何和材料合法性；09域验证D15由最终NC的D12→D13→D14重建而非读取3D动画。测试命令待各产品Owner定版。
- **离线/遗留迁移**：旧尺寸若只存浮点数、meshId或OCCT废弃dimension域则保持只读；先保留旧raw及原修订、声明单位/拓扑恢复证据，生成受控迁移Proposal及rollbackRef；无法证明不以最新几何顶替历史。

## 5. 逐项证据与验收

[10条规则及字段/原编号包](../../../research/traces/CAP-01-07-dimension-edit-b50-v08.json) → [3正例、48单字段反例、5未知，共56项规划合成](dimension-edit-b50-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0107_dimension_edit_b50_v08.cjs) → [分级核验](../../../tracking/cap0107-dimension-edit-b50-verification-2026-10-31.json)。反例独立改变源身份、只读与驱动语义、废弃单位维度、拓扑、再生、GUI、CAS/取消、冻结、D04/D10和NC门禁。V8同一`judge`函数可验证**规范合成一致性**，独立Node进程、真实OCCT、Babylon/GPU、GUI/CLI/Agent产品接线、17资产Owner会签与消费者验收均**NOT_RUN**。**规划PASS≠产品PASS。**
