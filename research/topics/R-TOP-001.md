# R-TOP-001｜拓扑命名、演化历史与跨修订实体引用

> 研究稿 v0.1｜2026-10-18｜已核对以下**OCCT8.0.1官方HTML指南和API页**；只对读取页面所列语义负责。未读取未授权标准正文、未运行OCCT原生试验，**不声称当前Procet产品锁定8.0.1或已经启用TNaming**。主关联[CAP-03-03](../../docs/capabilities/CAP-03-03/README.md)、[来源登记](../sources/CAP-03-03.json)、[规则映射](../traces/CAP-03-03.json)，上下游关联CAP-03-01/03-02/03-04/03-05、F1-01/03/04/06、T5-02。

## 1. 关键问题和外部证据

**问题A：同一快照局部引用与跨修订永久名字是否一样？不是。** `TopExp::MapShapes`是拓扑遍历/索引工具，返回的是该输入及算法上下文内的子形状位置；`TopoDS_Shape::IsPartner / IsSame / IsEqual`分别比较共享TShape、附加Location与Orientation，其原语不是跨重新导入STEP的PDM唯一标识（TOP-005/007）。因此`part+faceIndex+fingerprint`即使当前回读成功，也不能拿到下一文件直接追认批准面。`procet-cam@fcec1c86` 的`geometry_core/ids.rs`也**明确注释fingerprint为候选匹配、非稳定身份**，属于实际源码只读观察，而非外部公认标准。

**问题B：OCAF为拓扑演化提供什么？** 8.0.1 OCAF官方指南[Topological Naming/Shape Attributes]显示`TNaming_NamedShape`记录旧/新topological shape及`TNaming_Evolution`，而`TNaming_Selector`使用上下文、变化历史和命名结构重新求解选中拓扑（TOP-001/002/003）。这是一个**有建模过程和完整Data Framework前提**的解法，不保证任意外部STEP两版之间有足够历史，也不保证Selector调用成功等于工程语义相同。官方指南强调建模算法必须提供演化信息，故单靠读取文件不足以制造这类因果证据。

**问题C：变化是不是总能1:1对应？不能。** `BRepTools_History`记录`Generated/Modified/Removed`集合，受支持形状类型及方法语义所限；Split/merge可能令一个旧面对应多面或多个旧面合成一个面。`ShapeUpgrade_UnifySameDomain`记录合并导致的子形状历史。新增、删除、合并/分裂必须是**有向多对多图**，不能用单个replacement face填补。特别注意`Removed`不等于“绝不产生Generated输出”：官方API举例被移除边仍可能生成面，故用`deleted`含义时应区分是否还有来源演化关系（TOP-004/006）。

**问题D：什么时候能声称重绑定有工程证据？** 只有在指定旧新revision、Occurrence、source/target snapshot及版本化operation history都校验通过，且来源确有历史演化、结果能在目标快照确定解析时，才可称**`verified_history`仅局部历史有效**；跨独立文件或不确定计算只能`proposed/ambiguous/unmatched`。`manually_confirmed`说明人对特定用途和范围签认，并不使几何算法自动正确或赋予NC生产资格。此为Procet内部设计政策，不是TNaming官方定义的业务审批枚举。

## 2. 工程映射及失败边界

| 来源ID | 可核对知识点 | 推导的设计约束（决策） | 应触发的反例/留白 |
|---|---|---|---|
| SRC-TOP-001 OCAF | Reference-key，命名结构/历史维护及必要前提 | TOP-R03/R09/R10：只给有因果上下文的变化事实命名；原修订不覆盖 | arbitrary STEP新旧无history→proposed；异步旧视口不得写事实 |
| SRC-TOP-002 TNaming_Evolution | PRIMITIVE/GENERATED/MODIFY/DELETE/REPLACE/SELECTED定义及说明 | TOP-R03：不混淆来源类型与消费者资格 | 删除的旧面不可凭邻居面积补锚 |
| SRC-TOP-003 TNaming_Selector | Select、Solve及失败边界 | TOP-R04：Solve失败或无足够Naming结构则必须拒绝历史认证 | 旧上下文失败、无Selector历史仍报已验证 |
| SRC-TOP-004 BRepTools_History | Generated/Modified/Removed关系及Merge历史组合，支持类型限制 | TOP-R05/R08：集合有向关系/删除语义区分 | 1:2、2:1、removed+generated 均不能按唯一继承 |
| SRC-TOP-005 TopoDS_Shape | IsPartner/IsSame/IsEqual有不同Location/Orientation比较语义 | TOP-R01/R06/R07：固定实例Frame与源snapshot才能使用一致性判断 | 同TShape不同安装位置、反向朝向误判同一个业务实体 |
| SRC-TOP-006 ShapeUpgrade_UnifySameDomain | unification历史记录 | TOP-R05/R08：修补输出是新派生，保存历史工件与hash | 拓扑变化但维持旧hash、旧批准资格 |
| SRC-TOP-007 TopExp | MapShapes遍历索引语义 | TOP-R01/R02/R06：index仅快照上下文，指纹只是候选 | 重新排序/重新网格化后错选 |

来源读取深度为`section_text`；局部页面可能还有未研究API细节，不能上升为所有OCCT建模算法保证。8.0.1文档的`TNaming_REPLACE`见API枚举，但当前OCAF指南叙述的列表可能有差异，应遵循实际锁定版本的完整API而非假设列表永远一致。`std::hash`/TopoDS对象内部地址不是跨进程稳定业务身份。无真实源单位/容差档案/拓扑校验的纯几何指纹算法只能提出候选。

## 3. 与Procet现状对照（只读源码观察，不是PASS）

- `BaiSongt/procet-cam@fcec1c86047e6b11be35b8bb38971e3dfcffbd7b`：`src/cad/geometry_core/ids.rs`的GeometryRef含localIndex/fingerprint/sourceRevision且注释指纹不是稳定ID；`src/cad/mod.rs`的AnchorTarget3D仍有face_index/edge_index/geometry_fingerprint的向后兼容字段。
- 同版`src/cam/topology/snapshot.rs`记录Face/Edge/Wire/Solid及GeometryRef；`src/ports/geometry.rs`读取CAM快照并重算哈希、拒绝未知schema；`src/cam/topology/gate.rs`的单Part/单Solid门是CAM某一MVP输入资格，**不等于CAD所有图结构的读取能力**。
- `BaiSongt/procet-gui@develop`：`packages/renderer-port/src/port.ts`的PickResult、SceneRef/TopologySnapshotRef和mesh派生可复用；并不证明持久化跨修订映射/人工签认已存在。
- **待源码核查**：Native OCCT真实锁版本、外部STEP导入产生何种Naming/History、CAD Owner与CAM历史PMI数据写权限、完整消费者依赖及真实错误码。代码版本事实和官方8.0.1 API语义必须明确分栏。

## 4. 待验证的科学与工程问题

1. **跨两次独立STEP导入的无history映射**：应使用不同几何、对称、分裂、合并、曲面修补、不同容差/单位的合成BRep建立匹配能力矩阵；即使90%匹配也不能跳过单个影响制造用途的歧义，后续指标由实际评审确定。
2. **历史组合及回退**：多次布尔/修补的`BRepTools_History::Merge`，各阶段对`Modified/Generated/Removed`作用域，验证回放、长链source/target同一性与缺中间版本时的unknown。
3. **多实例**：同一个零件定义在两个位置的face0，测试Definition身份、Occurrence位姿、Frame及PMI/Setup的不同消费上下文。
4. **跨kernel/Reader版本**：锁定算法、单位profile与拓扑snapshot hash。不同数值结果需明确不可比较与重审，不以任意形状摘要“相等”遮蔽来源。
5. **消费者签字**：PMI锚、D02特征、D04加工面、D05顺序、D08冻结、D16发布采用不同风险门。由Owner签发`impactSet`，消费者自己审核其批准是否仍适用。

## 5. 研究结论及证据限制

满足固定上下文、精确快照与可校验历史，可**有条件地提高引用重绑可信度**；但通用永久拓扑命名在第三方CAD设计变更中不应被当前资料误认成已经解决。把`fingerprint`与`Index`区分、保存双向可追溯的变更图、保留歧义人工决定，比承诺“全自动稳定面号”更符合工程事实。本项源记录不是实机测试，也不代表通过ISO/CAD标准认证。