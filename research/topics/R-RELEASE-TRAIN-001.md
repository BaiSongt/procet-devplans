# R-RELEASE-TRAIN-001｜跨仓组合发布、供应链来源与离线兼容
研究日期2026-10-26。10项来源均是公开网页，访问深度、作者、版本及局限见[登记](../sources/T5-03.json)，未复制标准正文。

**来源→规则→字段→正反验收**：SemVer2.0.0仅约束公开API的版本意图，因此R01/R02要求`lock.*`精确仓SHA、ABI与真实`compat.*`独立消费回归；SemVer数字相符不足以证明兼容。SLSA v1.2公开Build Provenance描述构建来源和输出证据，RFC8785著录摘要说明规范化意义，R03对应`integrity.*`，若未实际取得签名、制品或规范化实现，就不能宣称认证。
NIST SP800-218 v1.1 2022-02 Final与Rev.1 2025-12 Draft状态通过官方目录核对，未读PDF条款；R04/R10由发布治理需求推导`gates.* / handoff.*`，要求逐域可见证据、真实测试和人类审批，绝不能引用未读的具体条款。
TUF v1.0.37（2026-10-08）官方第2/5/6节提及更新信任角色、回滚/冻结/混搭等威胁。Tauri v2 Updater官方公开签名/Windows bundle章节及GitHub官方离线attestation验证手册支持R05/R09中的`offline.* / migration.*`，但本项目未部署TUF、未生成attestation、未实际发布任何更新；离线吊销风险必须保留。SPDX 3.0只读取版本索引，不代表SBOM已核。
W3C PROV-O 2013-04-30公开溯源定义、RFC9110条件请求正文支持把版本链接和条件检查作为工程设计输入；Owner数据CAS/ACL的原子性必须由独立业务验证，不能仅据HTTP/本体下结论，故R08要求`auth.*`重验。R06中立CL→D12后处理→D13执行语义→D14轴时序→D15程序验证→D16发布来自**本仓内部业务架构**，而非这些软件安全标准；D04与D10分离、未知语义UNKNOWN、CL动画非NC验证、无材料扫掠仿真。
R07单Babylon世界与统一左TaskPanel亦为Procet内部UI架构决定，不误称Tauri规定，`gui.*`仅做规划正反检查。A/B共享事实且不得覆盖冻结D08。
[十条规则与字段](../traces/T5-03.json) → [20正反/10差异变异](../../docs/work-packages/T5-03/fixtures.json) → [原T5-03实施规划](../../docs/work-packages/T5-03.md)。**规划PASS≠产品PASS**，独立消费者与产品一律NOT_RUN。