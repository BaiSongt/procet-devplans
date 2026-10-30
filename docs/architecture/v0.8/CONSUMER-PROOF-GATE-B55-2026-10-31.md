# B55｜17资产独立消费者证据收件与防伪晋级门禁
> 2026-10-31｜CAP-10-08数字主线、CAP-01-04授权、原编号E3-06/T5-03｜L3待审；仅规划证据，不承认产品通过。

## 发现与实质增量
B17已经核对17候选Owner Port及44条业务类型边，但**候选接口结构合格不等于有真实独立消费者**。这一轮形成可机器枚举的[17项收件槽位](consumer-proof-b55-schema-v08.json)：每一行保留Owner Port、GUI/CLI/Agent共用`readExact`、实际输出边的可选消费者、Frame资格、7项必须由消费方独立运行的正反验收。所有正式Owner签署仍0/17、真实独立消费仍0/17。

收件字段必须绑定`assetId / objectId / exact revision / sha256 contentHash / schemaVersion / scope / named Frame`；双方Team、消费端与提供端代码revision、运行环境、不可变日志索引不能省略。提交实际Owner时还应重验ACL、ScopeEpoch、CAS、预期revision/hash/Frame、取消代际；撤权与晚回执不能变成成功。

## 2026-10-31合法来源复核及不能越过的推论
- [Pact How Pact works](https://docs.pact.io/getting_started/how_pact_works)：Pact Foundation文档，页面标注2024-12-23；实际阅读Consumer testing/Provider verification及Message Pact。**消费者Mock测试与提供方实际重放是不同层级**，本轮未安装Pact。
- [Pact Verifying Pacts](https://docs.pact.io/getting_started/verifying_pacts)：Pact Foundation / Elliott Murray，页面标注2020-08-19；实际阅读Provider states、请求重放、结果发布。合同分发本身不等于验收通过。
- [CNCF CloudEvents Core v1.0.2](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md)：固定tag公开§3.1定点阅读，source+id有事件唯一性约束，但不能证明Owner授权、设备动作。
- [W3C PROV-O](https://www.w3.org/TR/prov-o/)：Lebo/Sahoo/McGuinness，2013-04-30 Recommendation；实际阅读Entity/Activity/Agent、wasGeneratedBy/wasDerivedFrom。Procet Revision/Frame/ACL是本项目更严格规则。
- [RFC 9110](https://www.rfc-editor.org/info/rfc9110)：Fielding/Nottingham/Reschke，2022-06；公开§13.1.1 If-Match正文与出版页。此HTTP机制不能代替领域Port权限/CAS/取消。
- 两份固定Git Blob的[17资产原定义](business-assets.json)及[Owner候选](owner-interface-review-v08.json)已由GitHub连接器完整读取。完整作者/版本/URL/章节深度/局限见[7来源登记](../../../research/sources/FINAL-ASSET-CONSUMER-B55.json)，[8规则→字段→CAP/原包→正反](../../../research/traces/FINAL-ASSET-CONSUMER-B55-V08.json)。

## 分级与独立消费者验收
[固定fixture](consumer-proof-b55-fixtures-v08.json) → [只读Node校验器](../../../tools/check_final_asset_consumer_b55_v08.cjs) → [验证记录](../../../tracking/final-asset-consumer-b55-verification-2026-10-31.json)。一项结构合格的合成示例只得`PASS_SYNTHETIC_SHAPE_ONLY`；写`REAL`而无独立可验证实测与证据者只能`UNKNOWN_EXTERNAL_PROOF`，声称`SIGNED`或产品`PASS`直接拒绝。脚本可用`node tools/check_final_asset_consumer_b55_v08.cjs --self-test`独立执行，**本轮实际未在完整克隆仓库中启动Node文件进程**，只在工具V8运行相同判定函数。合成集合1正29反4 UNKNOWN共34项；这里任何一个合成成功都不能提升正式签署计数。

独立消费方必须实际测试：读exact与错误版本、撤权后不可写、取消后晚ACK、旧Schema、修订失效传播、迁移回退及D13语义未知不放行；还应独立核查真实二进制/业务对象、签署和权限。替换接口先影子读取、并行对照、独立消费者实测，再人类批准切换，失败按保留的旧Revision/Receipt回退。

## 不变架构边界
D04名义Setup与D10实际机床执行绑定分离；A/B相同事实不得覆盖D08冻结。D09中立CL/D11动画不构成最终NC工程PASS；必须最终D12 NC→D13语义→D14实际轴时序→D15独立验证→D16人审发布，未知是`UNKNOWN`，不做材料扫掠仿真。GUI/CLI/Agent共享业务Owner Port，Babylon只有一个活动Engine/Scene/Canvas，统一左TaskPanel，浅深主题和≤12px字体。**规划PASS≠产品PASS。**
