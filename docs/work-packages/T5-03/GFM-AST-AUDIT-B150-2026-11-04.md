# B150｜T5-03：固定Git树的Markdown令牌预审与独立交接资格（2026-11-04）

> 新编规划补证（NEWLY_AUTHORED），不改变L1/L2、11域88 CAP、36原编号包、17资产；L3待人类审批。**规划PASS≠产品PASS**。

## 新增问题与与B16/B18的边界

B16/B18已涉及Markdown链接与Git对象mode。本轮不重做其既有结论，而把“**全仓AST终核NOT_RUN**”从笼统待办拆成可执行且显式分级的T5-03质量交接：固定40位commit SHA→以Git `ls-tree -r -z`枚举实际blob/mode→逐份读取Markdown文本→以markdown-it-py令牌解析普通链接、图片、引用定义和表格→解析相对路径/部分标题锚点→输出BROKEN/UNKNOWN清单及独立验收入口。新工具与旧工具互为交叉审查候选，不将其视为GitHub渲染同构。

**已验证的局限**：GitHub Flavored Markdown 0.29-gfm语法包含扩展；当前可选依赖只使用CommonMark+table+strikethrough，未完整实现GitHub自动链接/任务表/原始HTML、HTML id/定制锚点。标题slug为GitHub帮助页规则的保守近似；遇锚点不一致时标记`FRAGMENT_BROKEN_OR_RENDERER_DIFF`，不能自动定性文件损坏。相对Git路径大小写严格；symlink/gitlink不跟随，返回UNKNOWN。外部链接另作联网可达性验证。本轮没有完整checkout，故**完整规划仓677份Markdown的实际AST与GitHub渲染等价均为NOT_RUN**。

## 研究来源的真实阅读等级

| ID | 作者、版本、时间、URL及阅读范围 | 可以支持的设计 / 局限 |
|---|---|---|
| B150-S01 | GitHub/CommonMark贡献者，[GFM 0.29-gfm，2019-04-06](https://github.github.io/gfm/)，阅读§4.5/4.7/4.10、§6.6–6.9 | 引用定义/围栏/表格语义；不保证GitHub当前页面渲染完全同构 |
| B150-S02 | GitHub Docs，[Basic writing syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)，2026-11-04访问，Section/Relative links | 重复标题锚点、相对链接；未提供固定发行版号 |
| B150-S03 | Git项目，[git-ls-tree手册](https://git-scm.com/docs/git-ls-tree)，2026-11-04访问，OPTIONS/Output Format | Git对象mode与NUL分隔路径；不是已执行本仓完整树的证据 |
| B150-S04 | Executable Books，[markdown-it-py Using](https://markdown-it-py.readthedocs.io/en/latest/using.html)，2026-11-04访问，Parser/Tokens | 令牌解析API；并非GitHub扩展100%兼容实现 |
| B150-S05 | 本仓B18固定[源码Blob](https://github.com/BaiSongt/procet-devplans/blob/624ac53dc2ea2e7374baf8e3ceab3659929391c6/tools/check_final_md_b18_gitmode_v08.py)，实际GitHub读取；非外部学术文献 | 旧工具模式感知规则；本轮只补独立解析/分级和可复审状态 |

每一条作者、版本、发布日期（缺失则不杜撰）、URL、实际阅读章节及局限可在[5项登记](../../../research/sources/T5-03-gfm-ast-b150.json)检索。同属GitHub的来源不宣称为独立出版物数量。

## 来源→规则→字段→原编号包→独立正反

[8条字段规则](../../../research/traces/T5-03-gfm-ast-b150-v08.json)与[8正32单字段负例+8语义Golden](gfm-ast-b150-fixtures-v08.json)为T5-03实施交接的机器可读规范：

- **B150-R01 固定HEAD与对象树闭包**：`tree.headPinned` / `tree.completeTree` / `tree.modeEnumerated` / `tree.noSyntheticFiles`，来源B150-S03/B150-S05, 失效`TREE_SCOPE_UNKNOWN`；[B150-R01-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R02 语法令牌与引用完整性**：`parser.commonmarkAst` / `parser.tableRule` / `parser.fencedCodeIgnored` / `parser.referenceLinksResolved`，来源B150-S01/B150-S04, 失效`AST_COVERAGE_UNKNOWN`；[B150-R02-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R03 源目录路径与编码**：`links.sourceRelative` / `links.percentDecoded` / `links.caseSensitive` / `links.escapeRejected`，来源B150-S01/B150-S02, 失效`LINK_TARGET_UNRESOLVED`；[B150-R03-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R04 Git对象mode及外链**：`objects.fileModes` / `objects.symlinkUnknown` / `objects.gitlinkUnknown` / `objects.externalSeparate`，来源B150-S03/B150-S05, 失效`MODE_UNQUALIFIED`；[B150-R04-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R05 标题锚点与渲染差异**：`fragments.headingSlugs` / `fragments.duplicateCounters` / `fragments.htmlIdsCaveat` / `fragments.rendererParityUnknown`，来源B150-S02/B150-S04, 失效`ANCHOR_UNQUALIFIED`；[B150-R05-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R06 全仓覆盖与来源审计**：`coverage.allMarkdown` / `coverage.nonMarkdownTargets` / `coverage.provenanceIncluded` / `coverage.unreadFilesUnknown`，来源B150-S03/B150-S05, 失效`INCOMPLETE_AUDIT`；[B150-R06-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R07 独立反例与消费者签收**：`acceptance.nonzeroOnBroken` / `acceptance.syntheticIndependentNegatives` / `acceptance.consumerIndependent` / `acceptance.notProductPass`，来源B150-S01/B150-S05, 失效`QUALIFICATION_UNPROVEN`；[B150-R07-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。
- **B150-R08 多入口与事务/旧Reader**：`flow.guiCliAgentSameOwner` / `flow.singleBabylonLeftPanel` / `flow.aclCasCancelFence` / `flow.migrationRollback`，来源B150-S05, 失效`WORKFLOW_GATE_UNKNOWN`；[B150-R08-P与四个单字段N](gfm-ast-b150-fixtures-v08.json)；CAP-01-02/03、CAP-10-08与原T5-03。

只读工具[check_t503_gfm_ast_b150_v08.py](../../../tools/check_t503_gfm_ast_b150_v08.py)提供`--selftest`、`--fixtures`与`--ref <40位exact SHA>`。可选依赖是`markdown-it-py`；环境缺失直接`NOT_RUN`、不调用安装服务；需要用完整规划仓真实checkout，且必须固定HEAD再运行。无损报告含未知/断链列表，不写入业务数据或回写规划文件。独立消费者必须用另一个实现抽样核对“引用定义、标题重复、表格链接、原始HTML、GitHub站点渲染差异”，不能靠本工具自评PASS。

## Owner、GUI与交接边界

T5-03 Owner只维护**规划证据审计工具**及跨团队交接，D01文档业务Owner的具体签署仍为0/17的候选，不自动授予生产项目写权限。GUI/CLI/Agent进入同一领域Host/Port：本工具仅只读Git树；未来GUI/3D用唯一Babylon Engine/Scene/Canvas与左UnifiedTaskPanel显示报告，最大字体12px、浅/深主题；预览、绿色状态、AST静态检查均不等于发布。

正式业务写提交须经Owner重查exact Revision/hash/Frame、ACL、CAS、scopeEpoch、任务代次及cancel，晚回执禁止覆盖。迁移保留老Reader与新Reader双读、A/B原冻结D08和原D16交付，失败非破坏回退。D04 Setup与D10执行绑定分离，中立CL→D12后处理→D13最终NC独立解释→D14轴时序→D15独立验证→D16发布；本报告无任何NC/机床资格，unknown不升级PASS，不做材料扫掠仿真。

## 分级验收与未闭合

本轮[验证等级](../../../tracking/t503-gfm-ast-b150-verification-2026-11-04.json)记录：规则8正32反是构造性字段检查，9项小型解析器语义断言**仅本地等价草稿调试**，不能冒充仓库内文件进程已执行。完整规划仓全Markdown AST、GitHub GFM渲染差异、历史原始附件字节、17 Owner正式签署、17真实消费者及L3均未完成。需独立消费者复审误报及锚点算法、再对远端HEAD的完整checkout实际运行并保存SHA/环境/差异清单。真实产品Rust/TS、OCCT、NC、B5/OEM均`NOT_RUN`。
