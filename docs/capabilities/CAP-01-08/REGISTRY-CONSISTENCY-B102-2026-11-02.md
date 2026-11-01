# CAP-01-08｜B102 研究Registry、Git Tree与进度三方一致性

> 2026-11-02 · NEWLY_AUTHORED · 原11域88 CAP、36原编号工作包、17资产不变；L1/L2冻结、L3待审。此轮只处理规划证据可审计性，不声称产品能力PASS。

## 实质发现：结构化数值正确、描述性文字仍可能漂移

以原规划分支提交 `2141b8ba894448795befacb8ee7ea8a0d1f83826`（真实Commit Tree `e74b69fcf6a791321049c85ed5916a3b6838bca4`）从GitHub连接器精确读取：研究索引有**207份Registry、1591条登记记录**，逐Registry `registeredRecords` 求和同为1591，207个路径不重复，Git Tree `truncated=false`、2142项、629份Markdown，全部207登记路径存在且均为`100644/blob`。与此同时，`tracking/progress.json` 的 `research.registeredSourceCountMeaning` **仍写206份/1584条**，落后一轮；而`registeredSources=1591`、`additionalRegistries=207`实际正确。不是失踪7条登记，更不是7篇新论文；这是会误导评审、自动停止判断和跨文件导航的**文字台账漂移**。本轮随新增5项登记同步修正为**208份Registry/1596条登记**。不更动历史 `research/references.json` 原字节。

## 公开资料与来源层级

- [GitHub 官方 Git Trees](https://docs.github.com/en/rest/git/trees)（网页当前页，2026-11-02访问；“Get a tree”“Create a tree”“truncated”“mode/type”公开章节）：区分目录、普通Blob、软链接`120000`及子模块`160000`；截断时不能以部分列表宣布全量覆盖。对固定Tree读取不等于逐Blob内容解析。
- [JSON Schema draft 2020-12 Validation](https://json-schema.org/draft/2020-12/json-schema-validation)（A. Wright、H. Andrews、B. Hutton，2022-06-16，Internet-Draft，访问§6.1、§6.2、§6.4.3、§6.5）：`uniqueItems`可表达数组项唯一；**本项目要求按path唯一**是内部业务规则，不能把JSON Schema的对象项唯一算法直接等同路径唯一。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)（Timothy Lebo等编辑，2013-04-30 Recommendation，访问Abstract、Status、来源关系选段）：证明来源/派生信息可以独立表达；不提供Procet规划数量、工程审批或真实消费者验收规则。
- 固定内部原件：[B101研究索引](https://github.com/BaiSongt/procet-devplans/blob/2141b8ba894448795befacb8ee7ea8a0d1f83826/research/source-index.json)（Blob `f8451473a88475b44b01a4f7b18075976e568135`）与[进度](https://github.com/BaiSongt/procet-devplans/blob/2141b8ba894448795befacb8ee7ea8a0d1f83826/tracking/progress.json)（Blob `eb6619f58d999241b167296252b7188cebfb563e`），均通过连接器按exact Commit回读；内部规则不能归因于GitHub、W3C或JSON Schema规范条款。

[逐项合法来源、作者、版本、访问深度和限制](../../../research/sources/CAP-01-08-registry-consistency-b102.json) · [7条可机读规则及字段、CAP/工作包和正反映射](../../../research/traces/CAP-01-08-registry-consistency-b102-v08.json) · [1正12反合成夹具](registry-consistency-b102-fixtures-v08.json) · [只读Node校验入口](../../../tools/check_registry_consistency_b102_v08.cjs) · [分级验证](../../../tracking/registry-consistency-b102-verification-2026-11-02.json)。

## 机器可验的完整性门禁

令 `R=index.registries`、`T=GitTree(exact HEAD.tree)`、`P=progress`。需同时满足：

1. `Tree.sha==commit.tree.sha` 且 `truncated===false`；每个 `r.path` 是安全限定路径且在T中模式`100644/blob`，路径唯一。不以HTTP能打开代替固定Git Tree资格。
2. `∀r, registeredRecords(r) ∈ Z≥0`，`sum(R[*].registeredRecords)==index.registeredRecords==P.research.registeredSources`；注册份数等于`P.research.additionalRegistries`。
3. 文字标签 `registeredSourceCountMeaning` 必须与结构字段同步生成；其中**非去重**不能被误当成已阅读论文篇数。JSON Schema结构校验不自动处理跨文件和Git引用关系。
4. 保持 `11/88/36/17` 原分母。签署0/17和真实消费者0/17时 `stopConditionMet`不能因合成通过变true；批准和实机测试独立于登记审计。
5. 初次系统读取异常、Git树截断或路径特殊对象mode为明确FAIL，不自动用另一账户、未授权渠道或变动分支补齐未知Blob；不修改生产仓与数据。

**CLI入口**：在规划仓检出后使用 `node tools/check_registry_consistency_b102_v08.cjs`，只调用本地`git rev-parse HEAD^{tree}`及`git ls-tree -r -z HEAD`，读取两份JSON与fixture，不写文件、不执行CI。此工具对任意当前HEAD做树内一致性，独立外部原文内容校核需要另一验收器；提交后应另行通过GitHub原连接器复核exact HEAD与新Blob。

## 产品与交互边界

本工具归CAP-01-08的扩展/证据导航，原工作包**B0-05、U4-06、T5-06**。GUI/CLI/Agent通过同一只读PlanningEvidencePort查询，不得凭旧计数缓存授予Owner写权限。导览可在左侧统一TaskPanel显示“注册表路径全在Tree/原文阅读未全核/OWNER待签”等**独立状态**；3D仅复用唯一Babylon世界，不新建二级Scene或右Drawer。真实领域提交仍以业务Owner的exact revision/hash/frame、ACL/CAS和scopeEpoch重验为准，取消晚回执不能覆盖旧D08冻结或当前工程。D04工艺Setup不等于D10执行绑定；CL预览不代表D13→D14→D15→D16 NC验证，未知语义继续UNKNOWN，不做材料扫掠仿真。

## 验证层级与待办

原B101快照真实Git Tree/路径/登记和数值计数核验属于**远端结构核验**，仅发现并纠正进度文字漂移；V8的1正12反为同一函数的合成变异，非独立异构Oracle，也非完整Node文件进程运行。研究Registry其余文件的内容级ID、引文合法性、链接真实渲染仍未全量复检；629份Markdown的全仓GFM AST及GitHub标题锚点对等**NOT_RUN**；历史原始JSON附件字节审计、17正式Owner签署与17真实独立消费者、L3人审和产品/NC/实机均待完成。**规划PASS≠产品PASS。**
