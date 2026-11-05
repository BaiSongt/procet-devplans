# B171｜CAP-11-05 工艺推荐证据适用、同口径排序与D05真实采纳（2026-11-05）

> NEWLY_AUTHORED研究补证，原11域88CAP、36原包、17资产及L1/L2不变；L3待人类审批。规划PASS≠产品PASS。

## 失效问题：候选排序正确并不代表已采纳工艺
A与B合成估计10/8分钟，算法优选B；这只在目标、计量口径、材料、刀具、机床、工序和数据修订可比时成立。估算分钟不是生产节拍，未知功率须明确`POWER_UNKNOWN`。排序不得自动写D05、更改D08冻结或冒称真实D15 NC安全通过。候选等值按ID字典序只是Procet内生确定性规则，不是标准要求。

## 8项外部/内部证据（逐项阅读深度）
- **B171-S01** [AI RMF 1.0 Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)；作者：NIST / Elham Tabassi；版本：NIST AI 100-1 (2023-01-26)；2026-11-05访问；定位：Govern/Map/Measure/Manage；阅读`SPECIFIED_PUBLIC_SECTION`；边界：自愿框架，不是制造安全认证。
- **B171-S02** [AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/)；作者：NIST AI Resource Center；版本：Rolling public page；2026-11-05访问；定位：Introduction/Use；阅读`SPECIFIED_PUBLIC_SECTION`；边界：自愿工具，公开页面持续更新。
- **B171-S03** [Four Principles of Explainable Artificial Intelligence](https://www.nist.gov/publications/four-principles-explainable-artificial-intelligence)；作者：P. J. Phillips et al. / NIST；版本：NISTIR 8312; 2021-09-29；2026-11-05访问；定位：Official abstract and publication metadata；阅读`METADATA_ABSTRACT_ONLY`；边界：仅官方摘要，未读取PDF全文。
- **B171-S04** [ISO 13399-1 Cutting tool data representation and exchange](https://www.iso.org/standard/36757.html)；作者：ISO/TC 29；版本：2006-02 Edition 1; confirmed 2021；2026-11-05访问；定位：Official legal catalog/abstract；阅读`CATALOG_ONLY`；边界：未读付费正文，不援引未读规范字段。
- **B171-S05** [CoroPlus Tool Guide](https://www.sandvik.coromant.cn/en-gb/tools/digital-machining/coroplus-tool-guide)；作者：Sandvik Coromant；版本：Public landing; publish date unspecified；2026-11-05访问；定位：Sparse landing and official search excerpt；阅读`LANDING_EXCERPT_ONLY`；边界：只有限官网页面及搜索摘要，没有可用的特定刀具参数。
- **B171-S06** [PROV-O](https://www.w3.org/TR/prov-o/)；作者：Timothy Lebo; Satya Sahoo; Deborah McGuinness et al. / W3C；版本：W3C Recommendation 2013-04-30；2026-11-05访问；定位：Abstract/Entity/Activity/used/wasDerivedFrom；阅读`SPECIFIED_PUBLIC_SECTION`；边界：溯源数据结构不能单独证明工艺适用。
- **B171-S07** [CAP-11-05 original V0.8 specification](https://github.com/BaiSongt/procet-devplans/blob/9c0211b248a5a6fef510990583e351caf44117f3/docs/capabilities/CAP-11-05/README.md)；作者：BaiSongt/Procet；版本：9c0211b248a5a6fef510990583e351caf44117f3；2026-11-05访问；定位：T01-T10; ProcessRecommendationPort；阅读`FIXED_INTERNAL_FULL_BLOB`；边界：完整实读固定Blob 5d7ba41c3cd9f84f41176d28133d9fcfdeca40aa；内生规格。
- **B171-S08** [T5-01 original numbered work package](https://github.com/BaiSongt/procet-devplans/blob/9c0211b248a5a6fef510990583e351caf44117f3/docs/work-packages/T5-01.md)；作者：BaiSongt/Procet；版本：9c0211b248a5a6fef510990583e351caf44117f3；2026-11-05访问；定位：T501-01...T501-10; DomainToolIntent；阅读`FIXED_INTERNAL_FULL_BLOB`；边界：完整实读固定Blob ba1811494247e227e96dc6844a5da6ef4ed652c2；内生规格。

NIST AI RMF与Playbook为自愿风险管理参考，不是加工认证。NISTIR 8312仅官方出版摘要，ISO13399-1仅合法目录，Sandvik只获得稀疏官网介绍及搜索摘录，W3C PROV-O溯源不证明真实切削正确。排序、Owner权限/CAS和取消规则归于本仓内生推导。

## 机器可核验合同
[8规则32字段与原T5-01/T5-02](../../../research/traces/CAP-11-05-comparable-b171-v08.json)→[8正32严格单字段反例8排序Golden](comparable-b171-fixtures-v08.json)→[Node只读门禁](../../../tools/check_cap1105_comparable_b171_v08.cjs)→[核验分级](../../../tracking/cap1105-comparable-b171-verification-2026-11-05.json)。
|规则|验收边界|资产|
|---|---|---|
|B171-R01|设计/材料SHA、Frame、精确Revision必须不漂移|D01/D04/D07|
|B171-R02|引用需要受控定位、版本、可见范围及advisory身份|D03/D17|
|B171-R03|知识、工艺、刀具和材料适用性独立判断|D01/D03/D05|
|B171-R04|对同口径估计采用确定性排序，不混用真实节拍|D05/D06|
|B171-R05|转速和进给边界必须同时显式满足|D03/D10|
|B171-R06|保留备选、同分母和未知功率风险，禁默默采纳|D05/D08/D17|
|B171-R07|05域Owner在提交点做CAS、撤权与取消重验|D05/D08|
|B171-R08|同一领域入口、单Babylon、左TaskPanel及NC unknown阻断|D09/D13/D14/D15/D16|
Golden包括同值ID排序、0分钟、空候选及重复ID，异常值为UNKNOWN；全为合成估算，不代表模型、刀具或实机认证。来源→规则→字段→CAP/原包→单字段独立正反验收均写入JSON。

## GUI/CLI/Agent统一、Owner与失效传播
唯一Babylon Engine/Scene/Canvas及统一左侧TaskPanel，Ribbon/Agent独立窗口/CLI调用同一个11域推荐只读Port。读取D01、D03、D04、D05、D07、D08、D10的Owner exactRevision/contentHash/FrameRef/unit/scope；不建万能C0对象或第二主Scene。推荐只保留可追踪候选，用户明确采纳后由05域D05 Owner执行新Draft CAS，并在**提交点**复验ACL/permissionEpoch、scopeEpoch、exact hash/frame、taskGeneration与cancelFence；取消晚回执只进入旧任务审计，不冒充提交。A/B共享事实不覆盖D08冻结。
源Hash、材料、刀具、工况、实际D10绑定及控制器变化则使建议STALE，保留旧候选、已冻结结果与审计；旧Reader先只读Expand，影子比较、真实独立消费者签收后才Migrate/Contract，故障回退只读，不删用户数据。
D04工艺Setup≠D10执行绑定；中立D09 CL→D12后处理NC→D13最终NC解释→D14轴时序→D15独立工程验证→D16人工批准发布。CL动画、排序与公式不是NC安全，未知语义`UNKNOWN`不可提升PASS；不做材料扫掠仿真。

## 证据分层与独立消费者
规划入口`node tools/check_cap1105_comparable_b171_v08.cjs --root .`；仅内存同判据合成48/48符合预期，独立Node文件执行、实际D03/D10、D05受控Owner、不同进程D16消费者、三轴/B5和真实NC均NOT_RUN。正式Owner签署0/17、真实消费者0/17、L3、历史附件原字节审计、全仓GFM AST仍开放。独立验收需锁定产品exact HEAD、Schema ABI、日志Hash、撤权/取消/冻结冲突反例。**规划PASS≠产品PASS。**
