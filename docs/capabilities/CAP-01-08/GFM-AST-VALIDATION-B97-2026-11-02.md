# B97｜CAP-01-08 GitHub Markdown AST路径与锚点保守核验研究补证

日期：2026-11-02。性质：**NEWLY_AUTHORED规划专项**；原CAP-01-08《扩展与集成入口》，关联原编号B0-05、U4-06、T5-06。此项为跨文件导航与审计工具的可靠性增量，**绝非产品或全仓GFM终验通过**。主读固定规划Commit 03c4943b18e35574fb5d27876a6a9521e5c2db07、Tree bb2e5d03c2871cfdb214fba7182238e75d6c0fe4，main/PR元数据另行回读。

## 差异与理论依据

- GitHub官方[Git Trees API](https://docs.github.com/en/rest/git/trees)将普通Blob文件模式100644/100755、符号链接120000及gitlink 160000区分。存在Blob不等于该链接必可点击，跨特殊模式的目标归UNKNOWN，不自动跟随。
- [GFM 0.29-gfm规范](https://github.github.io/gfm/) §4.5/§4.7/§6.6区分代码围栏、引用定义和真实链接节点。原B16/B18词法扫描可能将代码围栏中的Markdown示例误判为实际链接，本轮改为显式**Markdown AST抽取候选**。
- GitHub[官方相对链接与Section links说明](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)确认段落标题可生成锚点，但**当前工具的简化标题slug不是GitHub渲染器**；找不到候选锚点时只能UNKNOWN_ANCHOR_PARITY，不能断言官方页面404。
- Python markdown-it-py commonmark+table/strikethrough为选定本地解析子集，**不支持声称所有GFM扩展/HTML内链或自定义锚点均已覆盖**。如果依赖缺失，明确UNKNOWN_DEPENDENCY；只允许40位exact Commit，不接受可变分支名作为验收身份。
- [B18先前证据](../../architecture/v0.8/第十八轮Git链接对象模式与保守审计_2026-10-29.md)只做过Git对象模式合成与启发式链接，不覆盖真正的全仓GFM AST；本轮不覆写旧证据。

作者、来源版本/出版时间/2026-11-02访问章节深度及局限见[4条Registry](../../../research/sources/FINAL-MD-B97-AST-V08.json)。付费标准未参与，本专题不引用任何未读正文。

## 合同与六条机器可检规则

[追踪6规则](../../../research/traces/FINAL-MD-B97-AST-V08.json) → [12条路径正反UNKNOWN及3条AST断言](gfm-ast-b97-fixtures-v08.json) → [只读Python校验器](../../../tools/check_final_md_b97_ast_v08.py) → [执行等级记录](../../../tracking/final-md-b97-verification-2026-11-02.json)。

1. **R1**：link_open/image AST含引用式链接、表格链接；代码围栏和行内code不得误计。
2. **R2**：对固定Tree存在性与仓库根边界判定；精确缺文件/越根为REJECT。
3. **R3**：120000符号链接、160000 gitlink及目录跳转为UNKNOWN，不能伪PASS。
4. **R4**：含片段锚点只给候选；GitHub实际slug/重复标题/HTML锚点未复核时不得据简化slug判定最终渲染失效。
5. **R5**：绝对站内链接、外链及不安全URI不当作已通过的本地链接；危险URI拒绝，外链只标EXTERNAL_NOT_CHECKED。
6. **R6**：结果必须绑定exact Git Commit、Parser版本、来源修订/Hash、候选等级；禁止旧HEAD的PASS授予新HEAD、L3审批或17资产Owner签署。

本轮通过独立写定Expected的12个路径样例及3项AST断言；另在**临时合成Git仓库**实际执行git ls-tree和git show，得到1个普通PASS候选、1个缺失REJECT、1个符号链接UNKNOWN及1个目录UNKNOWN。Python语法编译通过。**真实规划仓624+份Markdown的整仓AST、GitHub rendered anchor parity、所有外链及17消费者均NOT_RUN**，不把合成Git测试当成真实规划仓检查。

## Owner/接口与回退

CAP-01-08扩展入口原规格与原U4-06保持不变。规划审计消费GitHub固定Git Tree/Blob及CAP导航文档，产出只读审计文件，不写D01/D16/D17产品资产，也不擅自变更17个正式Owner。GUI/CLI/Agent若展示审计，均经既有统一领域Host/Owner Port，单Babylon Engine/Scene/Canvas、统一左TaskPanel；链接预览绝不触发工程业务提交。权限、CAS、Frame、ScopeEpoch、取消代次在真实写入时重新校验，旧回执不授新HEAD通过。

若将来Parser/链接语义升级，旧审计保留固定SHA和Reader版本，Expand→Migrate→Contract并准备只读回退；旧未知不得自动提升为PASS。D04名义Setup与D10实际执行绑定仍隔离，中立CL→D12最终NC→D13解释→D14轴时序→D15独立验证→D16受控发布，CL播放非工程认证，不实施材料扫掠仿真。

**剩余门禁**：需要具备完整真实Git工作树及正确依赖才能执行仓库级扫描；必须对GitHub真实渲染锚点作独立抽查或等价官方渲染验证，再解决UNKNOWN与REJECT。17正式Owner会签0/17，17真实独立消费者0/17，L3待审；历史原件字节审计未闭。**规划PASS≠产品PASS。**
