# CAP-07-08 B93｜D09局部编辑DAG依赖闭包、段血缘、旧NC证据失效（2026-11-01）

**范围**：保留V0.8原11域/88 CAP/36原编号包/17资产；本补证属CAP-07-08，关联F1-03、E3-01、U4-04，L3待人类审批；**规划PASS≠产品PASS**。

## 研究问题与分层资料
只改一段CL，却可能影响后继端点、链接、D07材料前态及D12最终NC映射。不能根据画面只修改的段数复用旧D15认证。建模有向依赖边`u→v`表示修改u可能令v失效；当完整度可证明且无环时 `Affected(S)=S∪Descendants_G(S)`。如边缺失、跨Setup、材料状态/夹具/刀柄引用未知，扩大整工序/Setup或UNKNOWN；有环REJECT。

- NetworkX开发团队，[3.7 DAG文档](https://networkx.org/documentation/stable/reference/algorithms/dag.html)，在线版本未注明发表日，2026-11-01访问、选定正文实读：库的很多DAG算法不检查输入无环。**不证明业务依赖边完整**。
- W3C Timothy Lebo/Satya Sahoo/Deborah McGuinness，[PROV-O 2013-04-30](https://www.w3.org/TR/prov-o/)，实体/活动/derived/revision选段正文实读：区分谱系和版本。**不自动生成D09制造段身份**。
- Paul Bryan/Mark Nottingham，[RFC 6902，2013-04](https://www.rfc-editor.org/rfc/rfc6902.html)，§4.6 test与§5异常公开正文实读：前提失败不能当作部分成功。**Owner CAS和ACL属本产品规划规则**。
- Open CASCADE Technology，[OCCT 8.0.1 BRepTools_History](https://occt3d.com/dev/doc/refman/html/class_b_rep_tools___history.html)，Generated/Modified/IsRemoved官方API实读：TopoDS子形状历史非跨版本`stableSegmentId`。
- NIST，Hedberg等，[2016数字线程](https://www.nist.gov/publications/testing-digital-thread-support-model-based-manufacturing-and-inspection)、[2021设计制造检验信息集成](https://www.nist.gov/publications/defining-requirements-integrating-information-between-design-manufacturing-and)：**仅公开出版元数据与摘要**，没有读论文全文，不能推导具体DAG算法。
- Fielding/Nottingham/Reschke，[RFC 9110，2022-06](https://www.rfc-editor.org/rfc/rfc9110.html) §13.1.1、§13.2：If-Match前提语义类比，**非业务Owner权限证明**。
- [CAP07-08内部原业务规格固定SHA](https://github.com/BaiSongt/procet-devplans/blob/169acc8fbe7f81d6e6909196b3868ad1cfb09a73/docs/capabilities/CAP-07-08/README.md)：Blob `b6b4424bd704ac37a5acff98c1af2c87af15f58e`，内部要求不归因外部标准。详见[8来源登记](../../../research/sources/CAP-07-08-edit-dag-b93.json)，逐条记录作者、时间、版本、URL、章节、阅读深度和局限。

## 手工图Golden与反例
合成节点A,B,C,D,E,F，依赖`A→C,B→C,C→D,B→E,E→F`。编辑B，dirty精确闭包为`B,C,D,E,F`；编辑C为`C,D`，编辑A为`A,C,D`。这是**人工显式期待的数学图示例，不是实际刀具包络认证**。B新修订可拆分`B-v2a,B-v2b`，C/D/E/F各有新的不重复段身份，A保持原ID与Hash。禁止以OCCT拓扑Hash、屏幕对象ID或NC源行号充当同一制造段。

## 8条源→规则→字段→原包→独立验收
|规则|字段及具体责任|原包|反例/未知|
|---|---|---|---|
|B93-R1|D09旧revision/hash、D04 frameHash、scopeEpoch、D08冻结|E3-01|Hash不一致STALE；缺失UNKNOWN|
|B93-R2|graph.nodes、edges、complete与DAG无环|F1-03|反向环/重复ID拒绝；不完整UNKNOWN|
|B93-R3|种子seeds与dirty/affected严格相等|F1-03|少D或误加A均拒绝|
|B93-R4|old→new一对多血缘、唯一新段ID|E3-01|重复、漏段拒绝；无谱系UNKNOWN|
|B93-R5|未影响A段ID和Hash不变|E3-01|新Hash变拒绝；外源变化STALE|
|B93-R6|新D09使旧D11–D16全部失效|U4-04|遗漏D15或发布资格未撤销拒绝|
|B93-R7|07域Owner CAS/ACL/generation/取消晚回执|U4-04|权限拒绝、取消旧回执STALE|
|B93-R8|A/B共享事实、D04/D10分离、最小C0、旧Reader/非破坏回退|U4-04|混写拒绝；迁移未知UNKNOWN|

**所有正反/未知均合成**：[字段和8条追踪](../../../research/traces/CAP-07-08-edit-dag-b93-v08.json)→[8正16反8未知、3图Golden](edit-dag-b93-fixtures-v08.json)→[Node只读入口](../../../tools/check_cap0708_edit_dag_b93_v08.cjs)→[执行等级](../../../tracking/cap0708-edit-dag-b93-verification-2026-11-01.json)。

## GUI/CLI/Agent、数据事务与失效传播
D01/D02/D03/D04/D05/D07/D08各业务Owner提供`assetId/revision/contentHash/frameRevision/frameHash/scope` exact引用，D09由07域独占提交新revision。三入口统一`07.CAMDomainPort.previewEdit/assessAffectedSegments`只读预览，`07.ToolpathOwnerPort.stage→seal→commitCAS`写入时重验expectedHead/ACL/Scope/Frame/任务代次/取消/幂等键；取消晚回执IGNORED_STALE，旧D08冻结不覆盖。一个Babylon Engine/Scene/Canvas、左UnifiedTaskPanel、仅浅/深主题、字号最大12px；全工作区展开Graph不另建第二3D。

D04名义Setup和D10真实执行绑定严格分离。新D09中立CL→D12 NC后处理→D13方言模态解释→D14机床轴时序→D15独立验证→D16审批发布；D11 CL动画不能冒充D15。未知语义维持UNKNOWN，D16阻断；不进行材料扫掠仿真。迁移Expand→Migrate→Contract保留原D09字节、D08冻结、旧Reader和历史NC；17独立消费者未验不能声称Contract完成。

**执行等级**：32项V8同判定函数合成符合预期、3项图Golden符合预期；独立Node仓库整文件、真实CAM/OCCT/NC/D13–D16、17资产正式Owner签署与消费者、全仓GFM AST及GitHub渲染对等、历史附件原始字节和L3均**NOT_RUN或PENDING**。规划PASS≠产品PASS。
