# R-AB-E2E-001｜A/B闭环无界面验收的证据层级与事务界限

目标：将W2-06的三个原始验收要求拆成可追溯、可反证的端到端证据，不允许UI mock或规划fixture代替真实领域服务。

## 来源层级
[ISO 14649-10](https://www.iso.org/standard/40895.html)官方目录仅描述workplan/workingsteps一般工艺数据背景，未读付费正文；[OCCT 8.0.1 BRepCheck_Analyzer](https://occt3d.com/dev/doc/refman/html/class_b_rep_check___analyzer.html)仅API，有效形体≠可加工或机床安全；[W3C PROV-O](https://www.w3.org/TR/prov-o/)§2–3用于revision/derivation来源链映射，但不提供事务；[RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html)§13.1/13.2用于强条件更新对照，不等于分布式提交；[RFC8785](https://www.rfc-editor.org/rfc/rfc8785.html)§3.2为JSON清单稳定序列化，不能改写BRep/NC字节。[SQLite WAL](https://www.sqlite.org/wal.html)§1明示跨附加数据库事务不能整体原子，[Atomic Commit](https://www.sqlite.org/atomiccommit.html)§1主要对rollback journal；据此定义Staging+Receipt恢复设计而非声称SQLite天然跨域ACID。[LinuxCNC2.9](https://www.linuxcnc.org/docs/2.9/html/gcode/coordinates.html)§2–3仅其坐标偏置实现，不外推真实B5；[NIST IR8536最终版](https://csrc.nist.gov/pubs/ir/8536/final)仅读2026-09官方出版摘要，强调可验证来源而不授Procet产品合格；[Node test runner](https://nodejs.org/download/release/v26.9.0/docs/api/test.html)仅参考独立进程执行模型。

**2026-10-25实际联网查阅范围**：上述10个官方目录、API与公开正文；每项作者、版本、章节、访问深度、局限见[来源登记](../sources/W2-06.json)。没有读取收费ISO正文、NIST全文、真实产品源代码，也没有实跑内核和进程强杀。

## 设计推导与检查链
- 研究来源→工程设计：前提条件检查+Owner单写+精确引用才能描述A→B，特别将D06候选、D07几何、D05采纳、D08冻结分别作为独立资格。
- 几何与控制器分离：CL预演是D11，真实NC需D12→D13→D14→D15，UNKNOWN不会因动画消失。D16人工发布独立。
- 反证优先：UI-only、缺hash、06域直写冻结、跨Setup串写、取消晚回执、未证恢复、CL伪NC PASS、删除历史DB、合成数据标产品PASS各给一条独立反例。
- 记录版本化关系：D08只读历史，B回流产生新D05而非覆写，跨域关联可反馈但不可变revision provenance实例无环。
- 机器检查入口为[10规则20正反+10变异](../traces/W2-06.json)、[合成向量](../../docs/work-packages/W2-06/fixtures.json)和[校验工具](../../tools/check_w206_planning_2026_10_25.mjs)。

所有合成通过仅代表规划自洽；真实Owner签署、L3、独立产品harness、强杀恢复及NC与机床均**NOT_RUN/PENDING**。
