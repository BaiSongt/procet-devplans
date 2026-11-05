# Procet V0.8 B14｜541份Markdown固定快照Git Blob身份闭环与AST未完成门禁

**2026-10-29，NEWLY_AUTHORED；规划审计、L3待人审。** 固定原规划分支 `e591be97249c74e2a6a8252ca03709be9f3cbbb1`、Git Tree `3f215b6a3ae7ebe0a82c0c3889bd5e6a5b0cd552`（1615项，未截断），不是提交后HEAD。原11域88 CAP、36原编号包、17资产不变。

## 1. 本轮取得的可复核事实

[541路径SHA完整清单](../../../research/audits/FINAL-MARKDOWN-B14-2026-10-29.json) · [旧SHA索引](../../../research/audits/FINAL-MARKDOWN-B14-BASE-INDEX.json) · [新增读取证据A](../../../research/audits/FINAL-MARKDOWN-B14-READS-A.json) · [新增读取证据B](../../../research/audits/FINAL-MARKDOWN-B14-READS-B.json)。历史B04—B08逐文件清单288份，精确新HEAD对比**286份SHA不变**，两份变动必须重新读取：`docs/work-packages/E3-04.md`及`E3-05/independent-consumer-handoff.md`。剩余253份也由本轮GitHub connector按exact HEAD读原文件；**255/255新增读取SHA匹配**，路径不重叠、没有读取失败，故固定快照**541/541 Markdown路径+Git Blob身份闭合**。不是541份在同一轮全部重读：286份继承原Blob读取证据并在当前树重新比SHA。

对两份导航 `README.md` 和 `research/README.md` 在本快照共用启发式识别1176项行内相对路径、缺失目标0；255份新文档中的2367个 `]`+`(` 字符模式仅供后续解析定位，**不等于2367条实际链接或已确认有效**。本轮没有对541份运行GFM AST、锚点、HTML href和参考式链接终核；GitHub渲染对重名标题自动编号，不能凭SHA或正则推断导航全PASS。

## 2. 历史附件原字节的独立边界

当前Git Tree明确缺失三个旧路径：`docs/architecture/v0.8/capability-map.json`、`work-packages.json`、`code-evidence.json`。旧README虽有文件名说明，**不构成原字节存在**；另有CAP-01-02此前补证包及部分旧脚本找不到原字节。只保留MISSING和可用新规格引用，不编造恢复证明；找到原字节后按SHA、来源和签署重新迁移。

## 3. 来源→规则→字段→CAP/原包→正反验证

[7条研究规则和5项来源](../../../research/traces/FINAL-MARKDOWN-B14-V08.json) → [1正12反设计](final-markdown-b14-fixtures-v08.json) → [只读Node checker](../../../tools/check_final_md_b14_v08.cjs) → [本轮验证等级](../../../tracking/final-md-b14-verification-2026-10-29.json)。本地独立Node脚本使用相同校验逻辑执行**self-test 1正12反PASS**，不等于在完整GitHub checkout上运行。规则覆盖exact树身份、跨HEAD失效、GFM/锚点资格、历史原件真实性、Owner审批分离及NC/CL验证门禁。

来源（2026-10-29访问）：John MacFarlane [CommonMark v0.31.2，2024-01-28](https://spec.commonmark.org/0.31.2/) §4.7/§6.3；[GitHub Flavored Markdown v0.29-gfm，2019-04-06](https://github.github.com/gfm/) §4.7/§6.6；GitHub [Git Trees REST文档](https://docs.github.com/en/rest/git/trees)的Get a tree/truncated说明；GitHub [Markdown页面](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)的Section/Relative links。二份GitHub在线页未标注固定版次或发布日期；未读的收费标准正文不作条款引用。

## 4. 尚未通过的最终交接

下一步对**提交后新HEAD**重新比对全路径SHA并执行真正GFM AST、参考式/HTML/锚点测试；独立Node完整仓库文件进程待执行。17正式Owner签署0/17，真实独立消费者0/17，L3待人类，历史原字节未恢复，NC/OCCT/B5/OEM和D16产品发布均NOT_RUN。单Babylon/左TaskPanel、C0最小公用、CAS/ACL撤权、A/B冻结与D04 Setup≠D10执行绑定保持约束；中立CL→最终NC→D13→D14→D15→D16，CL动画不能冒充NC验收。不做材料扫掠仿真。**规划PASS≠产品PASS。**
