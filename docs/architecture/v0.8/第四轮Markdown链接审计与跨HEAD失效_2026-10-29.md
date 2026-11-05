# V0.8第四轮：Markdown链接增量审计与跨HEAD证据失效（2026-10-29）

## 1. 冻结现场与实际结果

本轮从公开规划仓GitHub连接器读取规划分支exact HEAD `ddb7d3105b5fc476162157a0d789d7b3a2985a86`，根树SHA `61ead620f589fb410def33804b6324ac7f1b6327`（Git Tree未截断）。在按UTF-16代码点序排序的**531份Markdown快照**中，实际逐份读取索引90—185的**96份Git Blob**，远端文件SHA与Tree条目**96/96相符**。简单行内/单行参考式正则识别的相对链接目标**290项**，已识别目标不存在**0项**、越仓根**0项**、GitHub读取失败**0项**。具体路径、Blob SHA和每文件计数见 [B04机器审计清单](../../../research/audits/FINAL-HISTORY-LINK-B04-2026-10-29.json)。

这不是全仓Markdown链接PASS：正则没有覆盖复杂括号、跨行参考式、HTML href、锚点、站外链接有效性，更没有验证CommonMark AST。当前快照尚有435份**未被本轮96项清单证明**。上一轮旧快照150项扫描虽然曾报告局部PASS，但原报告只记索引区间，未冻结每项路径/SHA，且`README.md`在两个快照之间变化；若假设旧排序与本轮完全一致，理论上可得244个当前有效的不同文档样本、287个剩余，但**这仅是附条件推算，不计为正式全仓核验结果**。

## 2. 关键工程修订：路径存在≠证据持续有效

1. **B04-R01** 在exact HEAD下冻结路径、Tree SHA和逐文件Blob SHA，HEAD或Blob变化应按影响范围重新核实；不能将不同时点无路径清单的扫描结果直接相加。
2. **B04-R02** 链接验证分层：Git Tree路径存在性→CommonMark/GFM解析和锚点→外链存活与源证据完整性。当前仅第一层中受正则识别的部分。
3. **B04-R03** 单字段破坏SHA/相对目的地/越根/计数都应使本批证据失效。资料载入/GUI预览不是事务提交。
4. **B04-R04** 三份旧架构JSON、CAP-01-02旧补证和早期部分脚本原字节未恢复；新编件不得冒充历史原件。缺失风险仍交人类处置。
5. **B04-R05** 链接审计不覆盖CAS权限重验、Owner exact revision/hash/frame、单Babylon与左TaskPanel、D04与D10分离、D13→D16执行验证，也不自动授予L3批准、实机/独立消费者或发布资格。

[五条机器追踪规则](../../../research/traces/FINAL-HISTORY-LINK-B04-V08.json)关联来源→字段→CAP/原编号包→[25项设计门禁](final-history-link-b04-fixtures-v08.json)，其中2项合成正例、1项现状非全量例、22项单字段反例。本轮仅执行V8等价纯内存判定**25/25**；仓内独立Node文件进程和产品Rust/TS/OCCT/NC/B5均**NOT_RUN**。

## 3. 官方公开资料与阅读深度

| 来源 | 作者/版本/日期 | 本轮确实阅读的公开范围 | 明确限制 |
|---|---|---|---|
| [CommonMark](https://spec.commonmark.org/0.31.2/) | John MacFarlane，0.31.2，2024-01-28 | HTML目录、§4.7参考式定义、§6.3链接主题 | 不代表GFM和完整AST解析已执行 |
| [GitHub Git Trees API](https://docs.github.com/en/rest/git/trees) | GitHub Docs，2026-10-29在线页 | Get a tree的truncated/recursive、Create a tree的base_tree/content | 只证明对象路径，不能证实链接锚点 |
| [W3C PROV-O](https://www.w3.org/TR/prov-o/) | Timothy Lebo、Satya Sahoo、Deborah McGuinness编辑，2013-04-30 Recommendation | 标题、摘要及PROV概念和术语目录 | 只提供溯源建模依据，非字节恢复鉴定 |
| [NIST SP800-218](https://csrc.nist.gov/pubs/sp/800/218/final) | M. Souppaya、K. Scarfone、D. Dodson，1.1 Final，2022-02-03 | 官网著录、Document History、摘要 | **未读PDF正文**，不引述具体未读实践条款 |

所有研究记录均为设计推导，不是ISO/OCCT/NIST标准正文认证，也不证明产品运行。当前17项Owner正式会签0/17、独立消费者实测0/17、L3待人审；D13未知执行语义必须维持UNKNOWN并阻断D16，不用CL动画代替NC工程验证。

## 4. 工程交接与下一批

后续以此**显式每文件路径+Blob SHA清单**延续索引186以后及旧快照缺口，并把经真正AST解析的内链、锚点、HTML、外链分开计数。最终审计必须以提交后的实时HEAD重新算分母；旧缺失附件只能迁移真实字节或由人类明确接受风险，不能改状态伪闭合。**规划PASS≠产品PASS。**
