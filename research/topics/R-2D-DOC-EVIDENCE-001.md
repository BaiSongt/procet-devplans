# R-2D-DOC-EVIDENCE-001｜2D/DXF/PDF/OCR证据到设计修订
> 2026-10-26；仅公开可读章节、合法目录及出版摘要。不复制第三方正文，不把候选或规划测试当工程证明。

Autodesk 2026 DXF Group Code值类型与BLOCK_RECORD提供原始实体handle、数值类型和插入单位的可核依据；2024 OCS arbitrary-axis说明法向与右手坐标轴构造。**设计推导**：需要保留`OCS→WCS→ProjectFrame`、块实例路径、单位与来源字节hash；源资料不保证所有自定义DXF实体可转，也不说明GUI px到mm的安全假设。

ISO 32000-2:2020仅核对官网合法**目录与摘要**；PDF Association仅读**版本索引**，绝不引用未阅读的收费正文。W3C SVG2 2026-10-06候选推荐§8.1、§8.5、§8.6说明viewport/viewBox/transform的显式映射：这是规划页面显示标定的类比，**不是PDF坐标标准条款**。扫描页无实物尺寸标定不得产生权威尺寸。

Tesseract 5.x用户手册为OCR候选提取参考，当前未固定具体运行版本。OCR置信与bbox只能辅助人工审核，不等于尺寸和公差真值。NIST数字线程项目（2018结项，官网2025更新）说明跨生命周期信息连接意义，NISTIR 7796仅阅读出版**摘要**，强调MBE/PMI验证挑战；这两份均非产品验收证据。

W3C PROV-O正式推荐可表示Entity/Activity/Agent及衍生关系，不能证明源正确；RFC 9110 §13.1.1 If-Match为条件写提供类比，领域Owner仍必须CAS/ACL/Frame/scope/cancel真实事务。十规则`R01–R10`的来源ID、字段、17资产链接与30个合成验收见[追踪](../traces/T5-02.json)，[来源登记](../sources/T5-02.json)与[测试场景](../../docs/work-packages/T5-02/fixtures.json)。

固定边界：L1/L2不变、L3待审、C0最小；A/B同事实不覆盖D08；D04≠D10，D09 CL→D12 NC→D13执行语义→D14时序→D15验证→D16发布；unknown阻发布，不做材料扫掠仿真。产品NOT_RUN。
