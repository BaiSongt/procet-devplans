# B137｜CAP-06-08：负依赖、动态读集与冻结增量求解的真实失效闭包（2026-11-03）

> NEWLY_AUTHORED 研究补证；不新增L1/L2、CAP、原工作包或业务资产；CAP-06-08与F1-05/W2-02/W2-03/W2-06原编号不变。L3=PENDING_HUMAN。**规划PASS≠产品PASS。**

## 新问题：没有读取到的数据也是依赖

原[CAP-06-08规划规格](README.md)规定完整实例DAG的反向依赖闭包，却没有单独定义**查询未命中、集合范围/排除谓词、动态分支换边**的观察身份。示例：B模式读取D05“Setup-A不存在人工工序”，于是从D07生成候选D06；之后工程师为Setup-A添加D05工序。如果只记录已存在对象的read edge，D05“此前不存在”的事实不会出现在图中，新工序无法触发候选失效。输出看似最小增量，实为**漏失效**。本轮采用内生的版本化否定读取标记：`{owner:"D05",scope:"Setup-A",selector:"manual-plan",observation:"ABSENT",snapshotRevisionHash}`，由Owner将创建/删除/集合成员变更事件映射到同一token，再作反向闭包。只是规划模型，不是Bazel/Salsa替Procet证明的算法。

## 官方证据（访问于2026-11-03）

|ID|作者/版本/阅读深度|直接可支持与限制|
|---|---|---|
|B137-S01|[Bazel Project / Skyframe 7.2.0固定源码](https://bazel.googlesource.com/bazel/+/e93ea272d303248862ce5682863df05d9ee4ae36/docs/versions/7.2.0/reference/skyframe.mdx)，Data model/Evaluation/Incrementality公开正文|依赖完整登记是精确失效前提；Bazel build DAG不直接等同OCCT求解搜索|
|B137-S02|[Salsa维护者 / docs.rs 0.28.5](https://docs.rs/salsa/latest/salsa/index.html)，Input/Tracked与字段依赖段正文|按读取字段追踪可缩小重算；不是Procet已部署Salsa，latest链接可能更新|
|B137-S03|[Salsa项目 / Red-green算法](https://salsa-rs.github.io/salsa/reference/algorithm.html)，指定章节正文|backdating依赖查询结果等价与边完整，不能补救未登记的ABSENT读取|
|B137-S04|[W3C PROV-O 2013-04-30](https://www.w3.org/TR/2013/REC-prov-o-20130430/)，used/derived/invalidated公开节|业务谱系可表达，但不规范缺失查询token或D08冻结CAS|
|B137-S05|[Rundgren/Jordan/Erdtman RFC8785 (2020)](https://datatracker.ietf.org/doc/html/rfc8785)，摘要及规范化章节|跨语言签名Hash需要字节规范；这是Informational RFC，本轮未运行JCS|
|B137-S06|[Pease等 NIST IR8536 Final 2026-09-09](https://csrc.nist.gov/pubs/ir/8536/final)，**仅正式出版元数据及摘要**|支持制造谱系可独立核查的研究方向；未读正文/代码，不证明本算法|
|B137-S07|[Procet固定原CAP业务Blob](https://github.com/BaiSongt/procet-devplans/blob/228de7cbf877d99e93a849d0b69f9d7ef87e9f71/docs/capabilities/CAP-06-08/README.md)，Blob 147f96695e594b2eec0309b83d7cd86f085baeb3 全文|CAS/ACL/Frame/单Babylon/D04≠D10属于**本项目内生规则**，不归给外部资料|

完整[结构化7来源](../../../research/sources/CAP-06-08-negative-reads-b137.json)登记作者、版本/时间、URL、章节、阅读深度、支持与局限；7登记**不是7篇独立研究全文**。

## 业务与数据设计

- D06的候选版本依赖记录必须保留 `readObservationId`、`ownerAssetId`、`exactRevisionHash`、`frameHash`、`setupScope`、`selectorVersion`、`predicateDigest`、`observedExistence`、`readSetDigest` 和 `sourceEventId`。只记录存在资产的ID不可证明无关数据稳定；读取空间或选择谓词未知返回 `UNKNOWN_SCOPE`。
- 原始**实例依赖**方向固定 `producer → consumer`。对归一化变更集合 `Changed`，在完整读集前提下 `Affected=Reachable_G(Changed)`。动态控制分支变化必须由新查询生成新版本读集，并**原子替换有效边**；旧读集仅审计保留，不能继续参与有效版本最小闭包。
- `ABSENCE_READ` 捕获 `scope+selector+owner+revision`；**新增D05工序**、删除D05工序、谓词成员资格改变都可能影响读取不存在的旧结果。未捕获或不能确定事件→token映射，则阻断局部重用并标 `UNKNOWN_SCOPE`，不默认“无影响”。模型不对未观察的全局未知进行猜测。
- D08冻结节点若出现在受影响集合，结果 `CONFLICT_REQUIRES_HUMAN`，附精确StepUID/旧冻结Hash/冲突根因；不绕开冻结、自动解冻或写回旧版本。未触及的其他Setup仍稳定，但须有足够完整的Scope边证据。
- checkpoint复用必须完整匹配D07父Stock内容Hash、Frame、Solver/成本函数/容差与约束Hash；缓存等值优化不得跳过精确Revision身份重验或独立D07几何Oracle。图算法判定不证明B-Rep布尔、NC或机床安全。
- D06 Owner Port `previewIncremental({exactRefs,readSetSnapshot,changedEvents,frozenD08Refs})` 仅候选；`stage→seal→commitCAS` 再次重验expectedHead、ACL、ScopeEpoch、taskGeneration、cancelled和幂等；迟到回执拒绝。GUI/CLI/Agent共用06域Owner，唯一Babylon Engine/Scene/Canvas及左侧TaskPanel只呈现候选，不绕过写端；A/B同事实，冻结历史不覆盖。
- D04名义Setup与D10真实执行绑定继续分离。D06→D07独立Oracle→D08采纳→D09中立CL→D12 NC后处理→D13独立语义→D14轴时序→D15验证→D16发布。D13未知语义=UNKNOWN，禁止CL动画或本轮图Golden冒充NC工程验证；不做材料扫掠仿真。

## 独立测试与迁移交接

[8条字段规则/32个反例](../../../research/traces/CAP-06-08-negative-reads-b137-v08.json) → [8正32单字段反及8图Golden](negative-reads-b137-fixtures-v08.json) → [只读Node工具](../../../tools/check_cap0608_negative_reads_b137_v08.cjs) → [执行等级](../../../tracking/cap0608-negative-reads-b137-verification-2026-11-03.json)。图Golden覆盖A链、读缺失后新增、读集缺口、无关Setup、冻结冲突、有环、未锁版及无法归一事件。示例中的`D05:ABSENT:A`是**预归一化token**，不证明真正D05 Owner事件实现正确，必须单独做真实消费者测试。

17项资产的D05/D06/D07/D08独立消费者必须在**不同进程/不同实现**读取相同已封存字节，触发新增/删除/变更谓词/冻结冲突、跨Setup隔离、撤权、切换修订、取消后晚回执、强杀重启；报告consumerBinarySHA、Input/Output HEAD、Frame、ACL、实际退出码及历史Hash不变。影子reader先行、无损双读比对，失败只切回legacy reader，不删除旧数据、不双写。真机、OCCT、独立Node完整文件和实际消费者均NOT_RUN；Owner签署0/17、L3待人审。

