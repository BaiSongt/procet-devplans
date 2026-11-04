## 2026-11-04｜B164 CAP-08-06 多文件NC原子Bundle与强CAS
[专题](docs/capabilities/CAP-08-06/BUNDLE-CAS-B164-2026-11-04.md) → [7来源](research/sources/CAP-08-06-bundle-cas-b164.json) → [8规则32字段](research/traces/CAP-08-06-bundle-cas-b164-v08.json) → [8正32反8 Golden](docs/capabilities/CAP-08-06/bundle-cas-b164-fixtures-v08.json) → [Node](tools/check_cap0806_bundle_cas_b164_v08.cjs) → [等级](tracking/cap0806-bundle-cas-b164-verification-2026-11-04.json)。跨文件撕裂快照不因单文件SHA正确而获批；RFC9110强CAS仅类比，真实D12原子持久化/消费者/NC/Owner均未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B163 CAP-08-04 M0/M1暂停、M2/M30终止及版本化刀补模态
[专项研究](docs/capabilities/CAP-08-04/M30-OPTIONAL-STOP-B163-2026-11-04.md) → [6来源](research/sources/CAP-08-04-m30-lifecycle-b163.json) → [8规则32字段](research/traces/CAP-08-04-m30-lifecycle-b163-v08.json) → [8正32反8状态Golden](docs/capabilities/CAP-08-04/m30-lifecycle-b163-fixtures-v08.json) → [Node只读工具](tools/check_cap0804_m30_lifecycle_b163_v08.cjs) → [核验等级](tracking/cap0804-m30-lifecycle-b163-verification-2026-11-04.json)。LinuxCNC2.9指定M-code公开正文、Haas官方M-code目录实读，Haas M30软件100.16.000.1041刀补NOTE仅**官方搜索摘录**、原页全文未读。V8合成48/48；独立Node、真实控制器、17Owner/消费者、L3、全仓AST与历史原字节未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B162 CAP-08-02 刀长补偿栈与控制器方言差异
[专项论证](docs/capabilities/CAP-08-02/TLO-MODAL-STACK-B162-2026-11-04.md) → [7项分级来源](research/sources/CAP-08-02-tlo-stack-b162.json) → [8规则32字段](research/traces/CAP-08-02-tlo-stack-b162-v08.json) → [8正32反8状态Golden](docs/capabilities/CAP-08-02/tlo-stack-b162-fixtures-v08.json) → [只读Node](tools/check_cap0802_tlo_stack_b162_v08.cjs) → [核验等级](tracking/cap0802-tlo-stack-b162-verification-2026-11-04.json)。LinuxCNC2.9官方G43/G43.1替换/G43.2追加/G49取消/G53单块与H0换刀差异，Haas NGC 100.21.000.1100刀补行为不能跨方言通用；NIST6556仅检索元数据。V8同判据48/48，独立Node与实机/OEM/Owner消费者、L3/全仓GFM AST/历史原字节仍待核验。**规划PASS≠产品PASS。**

## 2026-11-04｜B161 CAP-11-04 MCP工具可信元数据与Agent权限边界
[专项研究](docs/capabilities/CAP-11-04/MCP-TRUST-BOUNDARY-B161-2026-11-04.md) → [6来源](research/sources/CAP-11-04-mcp-trust-b161.json) → [8规则32字段](research/traces/CAP-11-04-mcp-trust-b161-v08.json) → [8正32反8状态Golden](docs/capabilities/CAP-11-04/mcp-trust-b161-fixtures-v08.json) → [只读Node门禁](tools/check_cap1104_mcp_trust_b161_v08.cjs) → [分层核验](tracking/cap1104-mcp-trust-b161-verification-2026-11-04.json)。官方MCP Tools/Authorization(2025-11-25)、安全建议(2026-07-28)的指定章节与OWASP LLM06公开正文实读；NIST AI600-1仅官方出版摘要。ToolAnnotations/工具结果不赋予写权限，Token不透传；业务Owner/CAS/撤权/NC工程链仍独立。V8内存合成48/48；独立Node、实际MCP、17 Owner/消费者、L3、全仓GFM AST与历史原字节仍开放。**规划PASS≠产品PASS。**

## 2026-11-04｜B160 T5-04历史三JSON原字节负证据审计
[专项调查](docs/work-packages/T5-04/HISTORICAL-ORIGINAL-AUDIT-B160-2026-11-04.md) → [6项来源](research/sources/T5-04-historical-original-b160.json) → [8规则字段](research/traces/T5-04-historical-original-b160-v08.json) → [8正32反8Goldens](docs/work-packages/T5-04/historical-original-b160-fixtures-v08.json) → [只读工具](tools/check_t504_historical_original_b160_v08.cjs) → [固定HEAD观察](tracking/historical-original-audit-b160-2026-11-04.json)。真实GitHub B159完整Tree 2494项不截断，旧三JSON皆不存在；规划分支/main三路径各查询历史0条，**并不证明其它重命名/外部原件不存在**，新补证不冒称原字节恢复。V8同谓词48/48，原字节缺失OPEN、真实Node/Owner/消费者/L3和全仓GFM AST未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B159 CAP-04-01 旋转B-Rep包围、gap与显式毛坯采用资格
[专项研究](docs/capabilities/CAP-04-01/ROTATED-BOUNDS-B159-2026-11-04.md) → [5份官方/内生来源](research/sources/CAP-04-01-rotated-bounds-b159.json) → [8规则32字段](research/traces/CAP-04-01-rotated-bounds-b159-v08.json) → [8正32负8数学Golden](docs/capabilities/CAP-04-01/rotated-bounds-b159-fixtures-v08.json) → [只读Node](tools/check_cap0401_rotated_bounds_b159_v08.cjs) → [分层核验](tracking/cap0401-rotated-bounds-b159-verification-2026-11-04.json)。OCCT8.0.1的Bnd_Box::Transformed转旧AABB不能认证紧致性；AddClose不适于任意BRep，AddOptimal也不构成实机认证。V8同判据48/48，独立Node及真实OCCT/Owner/消费者0/17、L3和全仓AST仍NOT_RUN。累计265 Registry/1973登记，非去重出版物。**规划PASS≠产品PASS。**

## 2026-11-04｜B158 CAP-06-03 D07体积账本与独立几何资格
[专项研究](docs/capabilities/CAP-06-03/VOLUME-LEDGER-B158-2026-11-04.md) → [5分级来源](research/sources/CAP-06-03-volume-ledger-b158.json) → [10规则40字段](research/traces/CAP-06-03-volume-ledger-b158-v08.json) → [10正40负8Golden](docs/capabilities/CAP-06-03/volume-ledger-b158-fixtures-v08.json) → [只读Node入口](tools/check_cap0603_volume_ledger_b158_v08.cjs) → [核验等级](tracking/cap0603-volume-ledger-b158-verification-2026-11-04.json)。修复source-index顶层累计1957与真实263份登记合计1963不符，新增5后累计264 Registry/1968条；V8内存58/58，独立Node/OCCT/17 Owner和消费者/L3/全仓AST仍未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B157 CAP-09-05 CL相邻取样之间连续间隙下界专项
[专项推导](docs/capabilities/CAP-09-05/INTERVAL-CLEARANCE-B157-2026-11-04.md) → [6来源](research/sources/CAP-09-05-interval-clearance-b157.json) → [8规则32字段](research/traces/CAP-09-05-interval-clearance-b157-v08.json) → [8正32独立反8数学Golden](docs/capabilities/CAP-09-05/interval-clearance-b157-fixtures-v08.json) → [Node规划入口](tools/check_cap0905_interval_clearance_b157_v08.cjs) → [核验等级](tracking/cap0905-interval-clearance-b157-verification-2026-11-04.json)。本轮CL_ONLY必要条件由OCCT单姿态距离和另证运动位移界保守合成；欠缺任一连续区间证据则UNKNOWN，不能冒充D13–D15最终NC工程验证。V8生成器同函数48/48，独立Node/真实OCCT、B5/OEM及17 Owner/消费者和L3/全仓AST仍未验。索引263 Registry、1963登记，非去重论文数。**规划PASS≠产品PASS。**

## 2026-11-04｜B156 CAP-07-07 弦高/Post线性化/G64轨迹误差分层
[研究报告](docs/capabilities/CAP-07-07/CHORD-BUDGET-B156-2026-11-04.md) → [6来源](research/sources/CAP-07-07-chord-budget-b156.json) → [8规则32字段](research/traces/CAP-07-07-chord-budget-b156-v08.json) → [8正32单字段反+8Golden](docs/capabilities/CAP-07-07/chord-budget-b156-fixtures-v08.json) → [Node只读工具](tools/check_cap0707_chord_budget_b156_v08.cjs) → [等级](tracking/cap0707-chord-budget-b156-verification-2026-11-04.json)。OCCT8.0.1 Quasi采样不等于全区间严格弦高认证；Autodesk后处理可另行线性化；LinuxCNC2.9 G64 P/Q不等于OEM真实轨迹。内存纯谓词48项符合预期，独立Node/真实NC及17Owner消费者、L3和全仓AST仍NOT_RUN。累计262 Registry/1957来源登记。**规划PASS≠产品PASS。**

## 2026-11-04｜B155 CAP-02-01 物理刚体双分支FK与parent-local配置资格
[B155专项研究与阅读局限](docs/capabilities/CAP-02-01/DUAL-BRANCH-FK-B155-2026-11-04.md) → [6来源](research/sources/CAP-02-01-dual-branch-fk-b155.json) → [8规则32字段及原F1-02/F1-06/E3-04/U4-02/U4-03包](research/traces/CAP-02-01-dual-branch-fk-b155-v08.json) → [8正32反8数学Golden](docs/capabilities/CAP-02-01/dual-branch-fk-b155-fixtures-v08.json) → [Node只读工具](tools/check_cap0201_dual_branch_fk_b155_v08.cjs) → [验证状态](tracking/cap0201-dual-branch-fk-b155-verification-2026-11-04.json)。LinuxCNC2.9两节、OCCT8.0.1 API实读；ISO841仅目录摘要，Modern Robotics只网页简介。不同物理Joint可映射相同程序字母；WorkFromSpindle必须由工件与主轴两条链组成，真实pivot、Home不由B5名称猜测。规划同算法**8正32独立单字段反8 Golden符合预期**；独立Node全文件、真实OCCT/B5/NC、17 Owner/消费者、L3/历史原字节/全仓GFM AST待审。累计261 Registry/1951登记，**规划PASS≠产品PASS**。

## 2026-11-04｜B154 CAP-04-04 动态Frame时间见证与来源登记对账
[时间窗口研究及真实阅读深度](docs/capabilities/CAP-04-04/TEMPORAL-SNAPSHOT-B154-2026-11-04.md) → [6分级来源](research/sources/CAP-04-04-temporal-witness-b154.json) → [8规则32字段](research/traces/CAP-04-04-temporal-witness-b154-v08.json) → [8正32单字段反+8Golden](docs/capabilities/CAP-04-04/temporal-witness-b154-fixtures-v08.json) → [只读Node工具](tools/check_cap0404_temporal_witness_b154_v08.cjs) → [分级核验](tracking/cap0404-temporal-witness-b154-verification-2026-11-04.json)。多路径空间闭环不证明观测同一时刻有效；不得取latest补历史缺口。B153进度台账错滞后于真实来源索引，本轮纠正到**260 Registry/1945登记记录**。独立Node全文件、真实时钟与机床、17Owner/消费者、L3、全仓AST及历史附件原字节仍未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B153 CAP-08-05 Haas G83 IJK递减啄钻及Setting角色资格
[阅读/版本边界](docs/capabilities/CAP-08-05/HAAS-G83-SETTINGS-B153-2026-11-04.md) → [6来源](research/sources/CAP-08-05-haas-g83-b153.json) → [8规则32字段](research/traces/CAP-08-05-haas-g83-b153-v08.json) → [8正32反8Golden](docs/capabilities/CAP-08-05/haas-g83-b153-fixtures-v08.json) → [只读Node](tools/check_cap0805_haas_g83_b153_v08.cjs) → [验证等级](tracking/cap0805-haas-g83-b153-verification-2026-11-04.json)。Haas G83 IJK≠Q，P值继承；S52控制G83退让、S22官方仅G73、S57影响XY精停。V8合成48/48不代表真实OEM或D15；独立Node、17Owner/消费者、L3与全仓AST仍待验。**规划PASS≠产品PASS。**

## 2026-11-04｜B152 CAP-08-03 圆弧R/IJK、平面与多圈方言的执行资格
[实读与访问层级](docs/capabilities/CAP-08-03/ARC-MODAL-DIALECT-B152-2026-11-04.md) → [4项来源](research/sources/CAP-08-03-arc-dialect-b152.json) → [8规则/32字段](research/traces/CAP-08-03-arc-dialect-b152-v08.json) → [8正32反8Golden](docs/capabilities/CAP-08-03/arc-dialect-b152-fixtures-v08.json) → [Node规划检查](tools/check_cap0803_arc_dialect_b152_v08.cjs) → [执行等级](tracking/cap0803-arc-dialect-b152-verification-2026-11-04.json)。LinuxCNC 2.9的P多圈不得推断Haas/OEM，D13必须重读最终NC；真实解释器、Owner/消费者/L3/全仓AST仍NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-04｜B151 CAP-09-08播放时钟与工程时序隔离
[研究/局限](docs/capabilities/CAP-09-08/PLAYBACK-CLOCK-B151-2026-11-04.md) → [来源](research/sources/CAP-09-08-playback-clock-b151.json) → [规则/字段](research/traces/CAP-09-08-playback-clock-b151-v08.json) → [48合成样例](docs/capabilities/CAP-09-08/playback-clock-b151-fixtures-v08.json) → [只读工具](tools/check_cap0908_playback_clock_b151_v08.cjs) → [核验等级](tracking/cap0908-playback-clock-b151-verification-2026-11-04.json)。暂停、seek、后台掉帧只影响显示，缺失D14时间段不能插值为安全；独立Node/实际浏览器、B5/OEM、17正式Owner与消费者、L3均未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B150 T5-03 Git树固定Markdown AST子集预审
[新研究及未覆盖边界](docs/work-packages/T5-03/GFM-AST-AUDIT-B150-2026-11-04.md) → [5分级来源](research/sources/T5-03-gfm-ast-b150.json) → [8规则32字段](research/traces/T5-03-gfm-ast-b150-v08.json) → [8正32单字段反+8Golden](docs/work-packages/T5-03/gfm-ast-b150-fixtures-v08.json) → [只读Python入口](tools/check_t503_gfm_ast_b150_v08.py) → [校验分级](tracking/t503-gfm-ast-b150-verification-2026-11-04.json)。独立markdown-it-py语法令牌预审区别于旧B16/B18；9项本地等价小样例，仅构造性规划证据。**完整677份Markdown真实AST、GitHub renderer parity、17 Owner/消费者与L3仍未验。规划PASS≠产品PASS。**

## 2026-11-04｜B149 CAP-10-03 离线介质写入耐久与重插接收资格
[专项研究及真实阅读深度](docs/capabilities/CAP-10-03/DURABLE-MEDIA-B149-2026-11-04.md) → [5分级来源](research/sources/CAP-10-03-durable-media-b149.json) → [8规则/32字段](research/traces/CAP-10-03-durable-media-b149-v08.json) → [8正32独立负+8状态Golden](docs/capabilities/CAP-10-03/durable-media-b149-fixtures-v08.json) → [Node只读门禁](tools/check_cap1003_durable_media_b149_v08.cjs) → [等级记录](tracking/cap1003-durable-media-b149-verification-2026-11-04.json)。写入、Flush、原子可见、安全移除、收件重读、D10/D15/D17分层；48/48内存合成，真实USB/OS/签名、17 Owner及消费者、L3/全仓GFM AST/历史原字节未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B148 CAP-03-02 装配Occurrence闭包与位置资格
[研究和阅读深度](docs/capabilities/CAP-03-02/OCCURRENCE-CLOSURE-B148-2026-11-04.md) → [5分级来源](research/sources/CAP-03-02-occurrence-closure-b148.json) → [8规则/32字段及原包](research/traces/CAP-03-02-occurrence-closure-b148-v08.json) → [8正32单字段反、5矩阵Golden](docs/capabilities/CAP-03-02/occurrence-closure-b148-fixtures-v08.json) → [只读Node入口](tools/check_cap0302_occurrence_closure_b148_v08.cjs) → [校验分级](tracking/cap0302-occurrence-closure-b148-verification-2026-11-04.json)。区分共享定义与多Occurrence、完整递归与默认一层、已定位Shape与重复Location；当前仅规划数学/字段合成，真实STEP/Owner及消费者0/17、L3与历史字节/全仓GFM AST待验。**规划PASS≠产品PASS。**

## 2026-11-04｜B147 T5-03 17资产Owner/独立消费者独立资格矩阵
[研究与阅读局限](docs/work-packages/T5-03/ASSET-CONSUMER-QUALIFICATION-B147-2026-11-04.md) → [5来源](research/sources/T5-03-consumer-qualification-b147.json) → [8规则32字段](research/traces/T5-03-consumer-qualification-b147-v08.json) → [17资产声明](docs/work-packages/T5-03/asset-consumer-matrix-b147-v08.json) → [8正32单字段反+17资产+8Goldens](docs/work-packages/T5-03/consumer-qualification-b147-fixtures-v08.json) → [Node只读规划入口](tools/check_t503_consumers_b147_v08.cjs)。完成正式会签/消费者**准备契约**，不制造签名。内存静态40正反与17矩阵结构符合预期；独立Node文件进程、真正17消费者/Owner、L3与产品均未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B146 CAP-02-06 在机热漂移模型与测量/NC资格隔离
[专项研究与阅读限制](docs/capabilities/CAP-02-06/THERMAL-DRIFT-BOUNDARY-B146-2026-11-04.md) → [7来源](research/sources/CAP-02-06-thermal-drift-b146.json) → [8规则/32字段](research/traces/CAP-02-06-thermal-drift-b146-v08.json) → [8正32独立单字段反+8Golden](docs/capabilities/CAP-02-06/thermal-drift-b146-fixtures-v08.json) → [Node只读入口](tools/check_cap0206_thermal_drift_b146_v08.cjs) → [验证记录](tracking/cap0206-thermal-drift-b146-verification-2026-11-04.json)。NIST2026仅著录摘要、ISO230-3仅公开目录；D03资源热漂移预测不冒充D17实际计量结果，也不替代最终NC D13→D14→D15→D16。48/48仅内存合成；独立Node、量仪/NC、17 Owner/消费者、L3、历史原字节和全仓GFM AST仍未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B145 CAP-03-03 Wire有向遍历与完整性补证
[专项研究与真实阅读范围](docs/capabilities/CAP-03-03/WIRE-TRAVERSAL-B145-2026-11-04.md) → [7来源](research/sources/CAP-03-03-wire-traversal-b145.json) → [8规则及原B0-02/F1-03/F1-04/T5-02](research/traces/CAP-03-03-wire-traversal-b145-v08.json) → [8正32反+8图Golden](docs/capabilities/CAP-03-03/wire-traversal-b145-fixtures-v08.json) → [只读Node入口](tools/check_cap0303_wire_traversal_b145_v08.cjs) → [验证等级](tracking/cap0303-wire-traversal-b145-verification-2026-11-04.json)。普通TopExp子形状列表不等于连通Wire次序，WireExplorer可能因拓扑缺陷提前停止。48/48内存规划合成；独立Node完整文件、真实OCCT、17 Owner和消费者、L3/全仓GFM AST/历史原始字节仍未验。**规划PASS≠产品PASS。**

## 2026-11-04｜B144 CAP-10-08 独立审计检查点与防双视图资格
[专项研究与边界](docs/capabilities/CAP-10-08/AUDIT-CHECKPOINT-WITNESS-B144-2026-11-04.md) → [5分层来源](research/sources/CAP-10-08-checkpoint-witness-b144.json) → [8规则32字段](research/traces/CAP-10-08-checkpoint-witness-b144-v08.json) → [8正32单字段反+10状态Golden](docs/capabilities/CAP-10-08/checkpoint-witness-b144-fixtures-v08.json) → [只读校验器](tools/check_cap1008_checkpoint_witness_b144_v08.cjs) → [验证状态](tracking/cap1008-checkpoint-witness-b144-verification-2026-11-04.json)。RFC9162的包含/一致性仅借鉴数据结构；RFC8785限定字节规范化；NIST只读摘要。原业务T04哈希链不能证明未回滚/无双视图，需要独立可信检查点与实际证明。V8内存50/50规划合成，独立Node文件/实际签名、D16/D17、17资产Owner与消费者、全仓AST及历史原件未验。**规划PASS≠产品PASS。**

## 2026-11-03｜B142 CAP-11-03 RAG间接注入与Owner权限隔离
[专项研究](docs/capabilities/CAP-11-03/RAG-TRUST-B142-2026-11-03.md) → [6来源](research/sources/CAP-11-03-rag-trust-b142.json) → [8规则32字段](research/traces/CAP-11-03-rag-trust-b142.json) → [8正32独立反10 Golden](docs/capabilities/CAP-11-03/rag-trust-b142-fixtures.json) → [校验入口](tools/check_rag_trust_b142.cjs)。RAG Chunk/MCP Hint不能赋予Agent业务写权限，Owner真实ACL/CAS重验；实际RAG、17消费者/Owner、Node/L3待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B141 CAP-08-08 后处理插件构建来源与离线验签资格
[专项研究与阅读深度](docs/capabilities/CAP-08-08/POST-PROVENANCE-B141-2026-11-03.md) → [7条分级来源](research/sources/CAP-08-08-post-provenance-b141.json) → [8规则/32字段/原E3-02 E3-03 U4-04](research/traces/CAP-08-08-post-provenance-b141-v08.json) → [8正32独立字段反+8状态Golden](docs/capabilities/CAP-08-08/post-provenance-b141-fixtures-v08.json) → [Node规划工具](tools/check_cap0808_post_provenance_b141_v08.cjs)。SLSA v1.2、Sigstore Bundle和NIST元数据证据分层；签名、构建级别、OEM兼容、NC工程验收不能互相替代。正式Owner/独立消费者0/17、真实离线验签与Node进程、L3/历史字节/全仓AST均未验。**规划PASS≠产品PASS。**

## 2026-11-03｜B140 CAP-07-01 2.5D螺旋入刀包络与每圈Z预算
[研究和真实阅读局限](docs/capabilities/CAP-07-01/HELIX-ENTRY-B140-2026-11-03.md) → [6条分级来源](research/sources/CAP-07-01-helix-entry-b140.json) → [8规则/原F1-03 E3-01 U4-04](research/traces/CAP-07-01-helix-entry-b140-v08.json) → [8正32独立单字段反+10数学/状态Golden](docs/capabilities/CAP-07-01/helix-entry-b140-fixtures-v08.json) → [只读Node入口](tools/check_cap0701_helix_entry_b140_v08.cjs)。区分Dpath与刀具扫掠外径、有效净空间/余量、倾角和每转深度；Fusion官方帮助实读，三篇2026年厂商支持页只有搜索摘录。Node完整文件进程/产品/17 Owner和消费者、L3/全仓GFM AST/历史原始字节仍未验。**规划PASS≠产品PASS。**

## 2026-11-03｜B139 CAP-05-07 三方D05工序DAG删改/跨边冲突
[专项研究与阅读分级](docs/capabilities/CAP-05-07/MERGE-GRAPH-B139-2026-11-03.md) → [7来源](research/sources/CAP-05-07-merge-graph-b139.json) → [8规则/32字段与原W2-02/03/05](research/traces/CAP-05-07-merge-graph-b139-v08.json) → [8正32单字段反例+8有向图Golden](docs/capabilities/CAP-05-07/merge-graph-b139-fixtures-v08.json) → [只读Node入口](tools/check_cap0507_merge_graph_b139_v08.cjs)。新增删除-引用悬挂边、两侧新增边合成环及冻结无损回退的机器合成，独立Node文件进程及实际D05/NC/17消费者仍NOT_RUN，正式Owner0/17、L3/全仓AST/历史原字节待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B138 CAP-07-05 斜面余量、局部法向投影与阶段D07残料分层
[专项研究和阅读深度](docs/capabilities/CAP-07-05/STOCK-ALLOWANCE-PROJECTION-B138-2026-11-03.md) → [7条分级来源](research/sources/CAP-07-05-stock-projection-b138.json) → [8规则/32字段](research/traces/CAP-07-05-stock-projection-b138-v08.json) → [8正32反+8解析/UNKNOWN Golden](docs/capabilities/CAP-07-05/stock-projection-b138-fixtures-v08.json) → [只读Node入口](tools/check_cap0705_stock_projection_b138_v08.cjs)。Autodesk Fusion帮助明确倾斜面径向/轴向余量插值；本轮法向点积只是自建教学模型，不冒充厂商算法或实测去料。正式Owner/消费者0/17、L3与全仓AST、历史原件待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B137 CAP-06-08负依赖、动态读集与冻结闭包
[专项研究和官方来源阅读分级](docs/capabilities/CAP-06-08/NEGATIVE-DEPENDENCIES-B137-2026-11-03.md) → [8规则字段](research/traces/CAP-06-08-negative-reads-b137-v08.json) → [40单字段正反+8图Golden](docs/capabilities/CAP-06-08/negative-reads-b137-fixtures-v08.json) → [只读Node检查入口](tools/check_cap0608_negative_reads_b137_v08.cjs)。动态D05不存在/新增会改变D06，不能因没读到对象就当没依赖；真实D05事件/Owner、Node独立文件进程、17签署/消费者、GFM全仓AST及历史字节仍未验。**规划PASS≠产品PASS。**

## 2026-11-03｜B135 CAP-08-06：Block Delete/M01现场运行模式的D13资格
[专项研究与阅读限制](docs/capabilities/CAP-08-06/BLOCK-MODE-B135-2026-11-03.md) → [7条分级官方/本仓来源](research/sources/CAP-08-06-block-mode-b135.json) → [8规则/32字段及原包](research/traces/CAP-08-06-block-mode-b135-v08.json) → [8正32单字段反例/13语义Golden](docs/capabilities/CAP-08-06/block-mode-b135-fixtures-v08.json) → [Node只读入口](tools/check_cap0806_block_mode_b135_v08.cjs)。LinuxCNC2.9行首/及M0/M1、Haas Settings17/18与斜杠预读副作用必须分开；实际开关/固件未知不可默认为OFF。本轮规划合成40/40+13/13符合预期；Node独立文件进程、真实控制器/D13-D15/17消费者均NOT_RUN；正式Owner0/17、L3、历史原字节及全仓AST待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B134 CAP-09-07 Axis/物理Joint限位非蕴含性研究
[专项研究](docs/capabilities/CAP-09-07/AXIS-JOINT-LIMIT-B134-2026-11-03.md) → [7来源及阅读限制](research/sources/CAP-09-07-joint-limits-b134.json) → [8规则/原编号包](research/traces/CAP-09-07-joint-limits-b134-v08.json) → [8正32独立单字段反+6Golden](docs/capabilities/CAP-09-07/joint-limits-b134-fixtures-v08.json) → [Node只读工具](tools/check_cap0907_joint_limits_b134_v08.cjs)。LinuxCNC2.9公开资料指出非identity构型Axis合格仍可能物理Joint越界；ISO仅目录、NIST仅摘要；正式Owner/消费者0/17，L3/全仓AST/历史字节与实机待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B133 CAP-02-05炉批与检验文件/硬度换算的证据准入

[专项研究与阅读限制](docs/capabilities/CAP-02-05/HEAT-LOT-HARDNESS-B133-2026-11-03.md) → [8条合法分级来源](research/sources/CAP-02-05-heat-lot-b133.json) → [9规则/36字段/原编号包](research/traces/CAP-02-05-heat-lot-b133-v08.json) → [9正36单字段反/4语义Golden](docs/capabilities/CAP-02-05/heat-lot-b133-fixtures-v08.json) → [只读Node](tools/check_cap0205_heat_lot_b133_v08.cjs) → [验证等级](tracking/cap0205-heat-lot-b133-verification-2026-11-03.json)。目录牌号不能冒充实际炉批，ISO 10474钢铁检验文件不能泛化所有材质，ISO 18265转换不替代正确材料的实际试验；ISO只官方目录、NIST仅摘要、W3C公开指定章节。累计239 Registry/1819登记非去重；正式Owner/消费者0/17、L3、历史字节、全仓GFM AST及产品待验。**规划PASS≠产品PASS。**

## 2026-11-03｜B132 CAP-03-04 大/小弧尺寸与二维Z-radius资格
[分层厂商研究/阅读限制](docs/capabilities/CAP-03-04/ARC-SPAN-B132-2026-11-03.md) → [7来源](research/sources/CAP-03-04-arc-span-b132.json) → [8规则/原B0-02 F1-03 F1-04 T5-02](research/traces/CAP-03-04-arc-span-b132-v08.json) → [8正24单字段反+6数学Golden](docs/capabilities/CAP-03-04/arc-span-b132-fixtures-v08.json) → [Node只读检查](tools/check_cap0304_arc_span_b132_v08.cjs)。区别Creo Parametric r12、Elements/Direct 20.8/20.9和Toolkit r12；同端点的大/小弧不可默认为短弧，Z-radius二维折线不改变真实圆心，B-Spline曲率半径必须有选点；ISO129-1:2018仅官方目录，未读收费正文。研究238份Registry/1811登记（非去重），17正式Owner及真实消费者0/17、L3/全仓AST/产品待验。**规划PASS≠产品PASS。**

## 2026-11-03｜B131 CAP-08-05 G84/G33.1刚性/浮动攻丝跨控制器语义
[厂商手册与工程边界](docs/capabilities/CAP-08-05/G84-TAPPING-DIALECT-B131-2026-11-03.md) → [7分级来源/访问范围](research/sources/CAP-08-05-g84-tapping-b131.json) → [8规则/24字段/原E3-02/E3-03/U4-04](research/traces/CAP-08-05-g84-tapping-b131-v08.json) → [32单字段正反、10语义+3算术Golden](docs/capabilities/CAP-08-05/g84-tapping-b131-fixtures-v08.json) → [Node只读入口](tools/check_cap0805_g84_tapping_b131_v08.cjs)。LinuxCNC2.9 G84非同步浮动而G33.1同步；Haas Mill G84刚性选件待实证、车床G95另义。**规划PASS≠产品PASS。** L3、真实Owner/消费者及NC工程验收未闭。

## 2026-11-03｜B130 CAP-04-02目标点不确定度与相关协方差
[专项研究/实际阅读深度](docs/capabilities/CAP-04-02/TARGET-UNCERTAINTY-B130-2026-11-03.md) → [7条来源](research/sources/CAP-04-02-target-uncertainty-b130.json) → [8条规则/字段/原包](research/traces/CAP-04-02-target-uncertainty-b130-v08.json) → [8正24反+5解析Golden](docs/capabilities/CAP-04-02/target-uncertainty-b130-fixtures-v08.json) → [只读Node工具](tools/check_cap0402_target_uncertainty_b130_v08.cjs) → [分级验证](tracking/cap0402-target-uncertainty-b130-verification-2026-11-03.json)。B20/B75以外新增fiducial/target分离与协方差相关项；NIST TN1297公开章节实读、两篇NIST论文仅摘要、NIST数据CSV未取。236 Registry/1797来源登记（非去重）；正式Owner/消费者0/17，L3、历史原字节、全仓GFM AST及产品验证待办。**规划PASS≠产品PASS。**

## 2026-11-03｜B129 CAP-02-03拉钉/刀柄/主轴接口资格
[研究与阅读限制](docs/capabilities/CAP-02-03/RETENTION-KNOB-QUALIFICATION-B129-2026-11-03.md) → [7来源](research/sources/CAP-02-03-retention-knob-b129.json) → [8规则](research/traces/CAP-02-03-retention-knob-b129-v08.json) → [8正32反](docs/capabilities/CAP-02-03/retention-knob-b129-fixtures-v08.json) → [只读Node](tools/check_cap0203_retention_knob_b129_v08.cjs)。Haas特定04-0201拉钉不能外推B5/OEM，ISO只读官方目录；真实主轴、Owner/消费者及L3待验。**规划PASS≠产品PASS。**

## 2026-11-03｜B128 CAP-08-03 G10 L2/L20跨控制器坐标偏置与G52/G92持久化
[研究报告及阅读限制](docs/capabilities/CAP-08-03/WCS-OFFSET-DIALECT-B128-2026-11-03.md) → [7分级来源](research/sources/CAP-08-03-wcs-offset-b128.json) → [8规则/32字段及原编号包](research/traces/CAP-08-03-wcs-offset-b128-v08.json) → [8正32反/8标量Golden](docs/capabilities/CAP-08-03/wcs-offset-b128-fixtures-v08.json) → [只读Node校验](tools/check_cap0803_wcs_offset_b128_v08.cjs)。LinuxCNC2.9 G10 L20计算当前点、Haas L20为辅助WCS；同名G10 L2在G91下行为不同。G52/G92残留不得被当作M30/重启自动清零。累计**234 Registry/1783条登记记录（非去重）**；正式Owner/消费者0/17，L3/全仓AST/历史原字节/真实NC NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-03｜B127 CAP-08-04 Haas NGC刀长偏置固件差异与LinuxCNC G43
[专项合同/阅读边界](docs/capabilities/CAP-08-04/NGC-TLO-PERSIST-B127-2026-11-03.md) → [7分级来源](research/sources/CAP-08-04-ngc-tlo-b127.json) → [8规则字段与原编号包](research/traces/CAP-08-04-ngc-tlo-b127-v08.json) → [8正32反/8合成Offset Golden](docs/capabilities/CAP-08-04/ngc-tlo-b127-fixtures-v08.json) → [Node只读校验](tools/check_cap0804_ngc_tlo_b127_v08.cjs)。Haas NGC 100.21.000.1100+自动TLO/跨上电状态与LinuxCNC的G43.1替换、G43.2叠加严格分流；ISO13399只官方目录摘要。累计**233 Registry/1776登记非去重**；17Owner签署0/17，独立消费者0/17，L3/全仓AST/历史字节和产品NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-03｜B126 17资产签署/独立消费者实证晋级门禁
[专项研究](docs/architecture/v0.8/第126轮17资产签署与独立消费者真实证据门禁_2026-11-03.md) → [17资产真实缺口清单](tracking/owner-attestation-readiness-b126.json) → [7来源](research/sources/FINAL-OWNER-ATTESTATION-B126.json) → [8规则](research/traces/FINAL-OWNER-ATTESTATION-B126-V08.json) → [8正32反/5结构Golden](docs/architecture/v0.8/final-owner-attestation-b126-fixtures-v08.json) → [只读Node工具](tools/check_final_owner_attestation_b126_v08.cjs)。本轮补的是实证晋级协议而非重复B17结构边校验；Owner/消费者0/17、L3、历史原件、全仓AST和产品测试待办。**232 Registry、1769登记（非去重）**，规划PASS≠产品PASS。

## 2026-11-03｜B125 CAP-05-03 稳定拓扑序、显示偏好与旧锚点CAS
[8来源/实际阅读限制](research/sources/CAP-05-03-stable-topo-b125.json) → [8规则/原W2-02/W2-03/W2-05](research/traces/CAP-05-03-stable-topo-b125-v08.json) → [40正反+6数学Golden](docs/capabilities/CAP-05-03/stable-topo-b125-fixtures-v08.json) → [专项研究](docs/capabilities/CAP-05-03/STABLE-TOPO-ORDER-B125-2026-11-03.md) → [只读Node工具](tools/check_cap0503_stable_topo_b125_v08.cjs)。B66显式边保留研究不重复；A/B冻结/名义D04与D10独立，不虚构产品结果。**累计231 Registry、1762登记记录（非去重）**，17正式Owner与消费者均0/17；L3、全仓AST、历史原字节、产品验收未闭。规划PASS≠产品PASS。

## 2026-11-03｜B124 CAP-09-05 连续区间漏采样与D11资格补证
[报告](docs/capabilities/CAP-09-05/CONTINUOUS-COVERAGE-B124-2026-11-03.md) → [7来源](research/sources/CAP-09-05-continuous-coverage-b124.json) → [8规则/原F1-02/E3-04/E3-05/U4-04](research/traces/CAP-09-05-continuous-coverage-b124-v08.json) → [40正反+4解析Golden](docs/capabilities/CAP-09-05/continuous-coverage-b124-fixtures-v08.json) → [Node只读工具](tools/check_cap0905_continuous_coverage_b124_v08.cjs)。解析例端点各1.75mm间隙，中点负0.25mm；FCL CCD≠实际NC轴时序，OCCT静态距离≠全程安全。累计230 Registry/1754来源登记（非去重），17正式Owner/17真实消费者0，L3与全仓AST/历史原字节待审，产品NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-03｜B123 CAP-10-06 JobOrder排序/Start/Run-Item语义防误判
[官方章节/阅读范围](docs/capabilities/CAP-10-06/JOB-ORDER-PARTIAL-ORDER-B123-2026-11-03.md) → [8来源](research/sources/CAP-10-06-job-order-b123.json) → [8规则/原E3-06/T5-03](research/traces/CAP-10-06-job-order-b123-v08.json) → [40正反+4择序Golden](docs/capabilities/CAP-10-06/job-order-b123-fixtures-v08.json) → [Node只读工具](tools/check_cap1006_job_order_b123_v08.cjs)。OPC40001-3 JobOrderList非绝对顺序、平局应用专属；ISA-95 Start只到AllowedToStart；Run≠Item≠质检合格。NIST8536仅官方摘要，OPC多章节不算独立论文。229份Registry/1747条登记；Owner/真实消费者0/17、L3/历史原字节/全仓AST待审，实机NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-03｜B122 CAP-08-04 车床G96/G97与方言限速/物理额定
[研究/阅读深度](docs/capabilities/CAP-08-04/CSS-SPINDLE-LIMIT-B122-2026-11-03.md) → [9来源](research/sources/CAP-08-04-css-spindle-b122.json) → [8规则/原包](research/traces/CAP-08-04-css-spindle-b122-v08.json) → [8正35反/7解析Golden](docs/capabilities/CAP-08-04/css-spindle-b122-fixtures-v08.json) → [Node只读工具](tools/check_cap0804_css_spindle_b122_v08.cjs)。Haas G96/G97仅官方搜索摘录，G50实读HTML；LinuxCNC2.9 G96 D与Haas G50 S不互推，物理夹具/卡盘限速缺证明UNKNOWN；228 Registry/1739登记，Owner/消费者0/17、L3/全仓GFM AST/历史原字节及实机未验。**规划PASS≠产品PASS。**

## 2026-11-03｜B121 CAP-03-04 按尺寸类型校核标注Plane及Ordinate Baseline
[专项研究与权威来源读取深度](docs/capabilities/CAP-03-04/DIMENSION-PLANE-COMPAT-B121-2026-11-03.md) → [9条官方/自有分级来源](research/sources/CAP-03-04-dimension-plane-b121.json) → [8规则/原编号B0-02 F1-03 F1-04 T5-02](research/traces/CAP-03-04-dimension-plane-b121-v08.json) → [40正反/6向量/4Baseline图](docs/capabilities/CAP-03-04/dimension-plane-b121-fixtures-v08.json) → [只读Node检查器](tools/check_cap0304_dimension_plane_b121_v08.cjs)。Creo版本限定，不泛化所有CAD；227 Registry/1730登记，正式Owner/实际独立消费者0/17，L3及全仓GFM AST、历史原字节、真实CAD测试待审。**规划PASS≠产品PASS。**

## 2026-11-03｜B120 CAP-08-03 G28/G30双段快速回参考点与G53单块坐标
[研究及合法来源阅读层级](docs/capabilities/CAP-08-03/REFERENCE-RETURN-B120-2026-11-03.md) → [8来源](research/sources/CAP-08-03-reference-return-b120.json) → [8规则/资产字段/原编号包](research/traces/CAP-08-03-reference-return-b120-v08.json) → [8正32反+8数学Golden](docs/capabilities/CAP-08-03/reference-return-b120-fixtures-v08.json) → [Node只读校验](tools/check_cap0803_reference_return_b120_v08.cjs)。新增预存G28/G30参考、G90/G91中间段、Haas Setting108、G53只影响当前块；旧D08冻结、D04/D10分离及D13→D16独立资格保持。真实Node/OEM/B5/Owner/17消费者/GFM AST均未通过，L3待审。**规划PASS≠产品PASS。**

## 2026-11-02｜B119 CAP-01-07 GPU异步Pick/ThinInstance索引与跨Root过期防线
[来源深度与实施契约](docs/capabilities/CAP-01-07/GPU-PICK-ID-B119-2026-11-02.md) → [6分级来源](research/sources/CAP-01-07-gpu-pick-b119.json) → [8规则字段/原编号包](research/traces/CAP-01-07-gpu-pick-b119-v08.json) → [40正反+9事件快照](docs/capabilities/CAP-01-07/gpu-pick-b119-fixtures-v08.json) → [只读Node入口](tools/check_cap0107_gpu_pick_b119_v08.cjs)。Babylon GPU picking的thinInstanceIndex是渲染槽位；切空间、更新PickList或重排实例后旧Promise必须STALE，不许偷换业务Occurrence。W3C PointerEvents3/cancel与WCAG拖拽替代分级引用。225 Registry/1713登记，Owner/消费者0/17；L3、全仓GFM AST、历史附件原字节未闭。**规划PASS≠产品PASS。**

## 2026-11-02｜B118 CAP-07-06 G00快速路径与D15验收隔离
[研究/官方章节深度](docs/capabilities/CAP-07-06/RAPID-PATH-B118-2026-11-02.md) → [8来源](research/sources/CAP-07-06-rapid-b118.json) → [8规则字段原包](research/traces/CAP-07-06-rapid-b118-v08.json) → [40正反/3解析Golden](docs/capabilities/CAP-07-06/rapid-b118-fixtures-v08.json) → [Node校验入口](tools/check_cap0706_rapid_b118_v08.cjs)。Haas G00不一定单直线，LinuxCNC2.9协调G0及G61/G64不能互推；端点无碰≠全程认证。224 Registry/1707登记；真实Owner/消费者0/17、L3/GFM AST/原字节未闭。**规划PASS≠产品PASS。**

## 2026-11-02｜B117 CAP-02-07 glTF米/毫米、层级TRS与镜像绕序资格
[研究与精确来源阅读层级](docs/capabilities/CAP-02-07/GLTF-ROUNDTRIP-B117-2026-11-02.md) → [7登记](research/sources/CAP-02-07-gltf-b117.json) → [8规则及原编号包](research/traces/CAP-02-07-gltf-b117-v08.json) → [40正反+5数学Golden](docs/capabilities/CAP-02-07/gltf-b117-fixtures-v08.json) → [Node只读入口](tools/check_cap0207_gltf_b117_v08.cjs)。glTF单位米与父×局部T·R·S一次换算；全局负行列式影响三角绕序但不授生产Frame或B-Rep资格。现223 Registry/1699登记，正式Owner/消费者0/17，L3/全仓AST/历史原字节待审。**规划PASS≠产品PASS。**

## 2026-11-02｜B116 CAP-11-03 引用谱系去重与独立根冲突门禁
[研究报告](docs/capabilities/CAP-11-03/LINEAGE-INDEPENDENCE-B116-2026-11-02.md) → [7分级来源](research/sources/CAP-11-03-lineage-independence-b116.json) → [8规则/字段/原T5-01/T5-02](research/traces/CAP-11-03-lineage-independence-b116-v08.json) → [45正反与4来源图Golden](docs/capabilities/CAP-11-03/lineage-independence-b116-fixtures-v08.json) → [Node只读工具](tools/check_cap1103_lineage_independence_b116_v08.cjs)。不同URL的转载不能当两份独立证据，矛盾需CONFLICT；本轮同步纠正progress旧220/1678至真实新222/1692。正式Owner/独立消费者0/17、L3/全仓AST及历史原字节未闭。**规划PASS≠产品PASS。**

## 2026-11-02｜B115 CAP-10-05 OPC UA质量位、语义/结构变更及作业模型迁移
[专项研究和阅读深度](docs/capabilities/CAP-10-05/OPCUA-SEMANTIC-QUALITY-B115-2026-11-02.md) → [7分级来源](research/sources/CAP-10-05-opcua-semantic-b115.json) → [8规则、字段/原E3-06与T5-03](research/traces/CAP-10-05-opcua-semantic-b115-v08.json) → [37项正反/UNKNOWN/GAP/STALE](docs/capabilities/CAP-10-05/opcua-semantic-b115-fixtures-v08.json) → [Node只读工具](tools/check_cap1005_opcua_semantic_b115_v08.cjs)。单位/结构变更不能以重订阅代替元数据重读；requested 50ms≠实际200ms；40501-1旧Production deprecated不等于已删除。17 Owner/消费者0、L3/全仓AST/历史原字节未闭；**规划PASS≠产品PASS。**

## 2026-11-02｜B114 CAP-10-04临时文件异步应用与收方闭环
[专项报告](docs/capabilities/CAP-10-04/TEMP-APPLY-RECEIPT-B114-2026-11-02.md) → [8分级来源](research/sources/CAP-10-04-temp-apply-b114.json) → [8规则/字段/原E3-06/T5-03](research/traces/CAP-10-04-temp-apply-b114-v08.json) → [34规划合成正反/UNKNOWN/STALE](docs/capabilities/CAP-10-04/temp-apply-b114-fixtures-v08.json) → [Node工具](tools/check_cap1004_temp_apply_b114_v08.cjs)。OPC Part20 CloseAndCommit异步应用≠D17接收证明/机床激活，MoveOrCopy更换NodeId不可复用旧定位；新220 Registry/1678条登记（非去重），0/17正式Owner及真实独立消费者。全仓AST、历史原字节与L3仍待；**规划PASS≠产品PASS。**

## 2026-11-02｜B113 G98/G99车铣同码异义与B112研究总数纠错
[研究/访问边界](docs/capabilities/CAP-08-05/RETURN-ROLE-B113-2026-11-02.md) → [8分级来源](research/sources/CAP-08-05-return-role-b113.json) → [8规则/字段原包](research/traces/CAP-08-05-return-role-b113-v08.json) → [24正反UNKNOWN/STALE](docs/capabilities/CAP-08-05/return-role-b113-fixtures-v08.json) → [Node只读工具](tools/check_cap0805_return_role_b113_v08.cjs)。Haas车G98/G99是进给单位、铣是固定循环退让；LinuxCNC2.9 G98取max(initialZ,R)。研究索引旧218 Registry合计1662但顶层误写1657，追加8后219 Registry/1670登记，非去重文献。真实OEM/17Owner与消费者/L3/全仓GFM AST未验，规划PASS≠产品PASS。

## 2026-11-02｜B112 CAP-04-04 多路径FrameGraph闭环与复合次序资格
[OCCT/Eigen/NIST/W3C研究与深度限制](docs/capabilities/CAP-04-04/FRAME-PATH-CLOSURE-B112-2026-11-02.md) → [5项合法分级来源](research/sources/CAP-04-04-frame-path-b112.json) → [8规则字段/原F1-02/F1-04/W2-05/E3-04/U4-02](research/traces/CAP-04-04-frame-path-b112-v08.json) → [32正反UNKNOWN/STALE合成+4解析Golden](docs/capabilities/CAP-04-04/frame-path-b112-fixtures-v08.json) → [只读Node工具](tools/check_cap0404_frame_path_b112_v08.cjs)。双路径数学一致≠D10实装/测量/NC工程认证；V8同judge规划预检32/32、数学解析Golden4/4，独立Node/真实OCCT/17 Owner/消费者/L3及全仓GFM AST未验。**规划PASS≠产品PASS。**

## 2026-11-02｜B111 CAP-03-07 周期缝/非流形共边资格
[7来源](research/sources/CAP-03-07-edge-incidence-b111.json) → [8规则](research/traces/CAP-03-07-edge-incidence-b111-v08.json) → [32规划合成](docs/capabilities/CAP-03-07/edge-incidence-b111-fixtures-v08.json) → [报告](docs/capabilities/CAP-03-07/EDGE-INCIDENCE-B111-2026-11-02.md) → [只读Node](tools/check_cap0307_edge_incidence_b111_v08.cjs)。同Face两次edge引用不等于两张面共边，真实OCCT/17Owner/消费者/L3/GFM AST未验；**规划PASS≠产品PASS**。

## 2026-11-02｜B110 CAP-05-06 ABA同Hash异修订与原子CAS/幂等对账
[研究与SQLite/RFC选段局限](docs/capabilities/CAP-05-06/ABA-CAS-B110-2026-11-02.md) → [7来源](research/sources/CAP-05-06-aba-cas-b110.json) → [8规则/原W2-02/03/04/05](research/traces/CAP-05-06-aba-cas-b110-v08.json) → [33正反UNKNOWN/STALE/RECONCILE](docs/capabilities/CAP-05-06/aba-cas-b110-fixtures-v08.json) → [Node只读工具](tools/check_cap0506_aba_cas_b110_v08.cjs)、[SQLite内存独立合成](tools/check_cap0506_sqlite_aba_b110_v08.py)。正式Owner/消费者0/17，L3、真实产品数据库及全仓AST未验。规划PASS≠产品PASS。

## 2026-11-02｜B109 CAP-03-05 圆柱面不是孔：材料侧/盲通孔边界
[OCCT/ISO/NIST公开章节与阅读限制](docs/capabilities/CAP-03-05/HOLE-MATERIAL-SIDE-B109-2026-11-02.md) → [7来源](research/sources/CAP-03-05-hole-material-b109.json) → [8规则字段/原B0-02 F1-03 F1-04 T5-02](research/traces/CAP-03-05-hole-material-b109-v08.json) → [36合成正反/UNKNOWN/STALE](docs/capabilities/CAP-03-05/hole-material-b109-fixtures-v08.json) → [只读Node](tools/check_cap0305_hole_material_b109_v08.cjs)。无原始OCCT/STEP/独立Owner实际验收，L3待审。规划PASS≠产品PASS。

## 2026-11-02｜B108 CAP-09-03 物理旋转整周数与IK支链连续性补证
[研究与公开章节限制](docs/capabilities/CAP-09-03/BRANCH-WINDING-B108-2026-11-02.md) → [7分级来源](research/sources/CAP-09-03-branch-winding-b108.json) → [8规则/字段/原F1-02 E3-04 E3-05 U4-04](research/traces/CAP-09-03-branch-winding-b108-v08.json) → [34正反/UNKNOWN/STALE与3解析Goldens](docs/capabilities/CAP-09-03/branch-winding-b108-fixtures-v08.json) → [Node只读检查器](tools/check_cap0903_branch_winding_b108_v08.cjs)。物理370°与显示10°不能按同一Joint位置去重；LinuxCNC WRAPPED_ROTARY不代表OEM通用短路径。V8同判定函数34/34预检，独立Node/真实D13–D15/Owner/消费者/L3及全仓GFM AST均未验。规划PASS≠产品PASS。

## 2026-11-02｜B107 CAP-02-06 测头/测刀系统资格与厂商台架2σ外推隔离
[研究与严格阅读范围](docs/capabilities/CAP-02-06/PROBE-QUALIFICATION-B107-2026-11-02.md) → [6分级来源](research/sources/CAP-02-06-probe-qualification-b107.json) → [8规则/原F1-02/F1-06/E3-04/T5-05](research/traces/CAP-02-06-probe-qualification-b107-v08.json) → [34合成正反STALE/UNKNOWN](docs/capabilities/CAP-02-06/probe-qualification-b107-fixtures-v08.json) → [只读Node入口](tools/check_cap0206_probe_qualification_b107_v08.cjs)。ISO230-10:2022仅读官网摘要，Renishaw CMM测试架2σ不等于NC整机/本件测量不确定度。同judge34/34仅规划合成，真实校准/Owner/独立消费者与L3未通过；**规划PASS≠产品PASS**。

## 2026-11-02｜B106 CAP-03-02 XDE/SHUO实例外观误隐藏防错
[官方API研究与阅读范围](docs/capabilities/CAP-03-02/INSTANCE-STYLE-EVIDENCE-B106-2026-11-02.md) → [7合法分级来源](research/sources/CAP-03-02-instance-style-b106.json) → [8规则及B0-02/F1-03/F1-04/T5-02](research/traces/CAP-03-02-instance-style-b106-v08.json) → [50正反/UNKNOWN及18来源Golden](docs/capabilities/CAP-03-02/instance-style-b106-fixtures-v08.json) → [只读Node](tools/check_cap0302_instance_style_b106_v08.cjs)。OCCT`IsInstanceVisible(false)`在无SHUO时不等于实例明确隐藏；ColorMode关闭无法证明源STEP缺色。独立Node/真实Reader/17Owner与消费者/L3未验，规划PASS≠产品PASS。

## 2026-11-02｜B105 CAP-08-03 G93逆时间F与D14时序隔离
[研究与官方章节](docs/capabilities/CAP-08-03/INVERSE-TIME-FEED-B105-2026-11-02.md) → [6来源](research/sources/CAP-08-03-inverse-time-b105.json) → [8规则/原E3-02、E3-03、U4-04、F1-02](research/traces/CAP-08-03-inverse-time-b105-v08.json) → [39正反/UNKNOWN](docs/capabilities/CAP-08-03/inverse-time-b105-fixtures-v08.json) → [Node工具](tools/check_cap0803_inverse_time_b105_v08.cjs)。G93 F的60/F是程序目标时长，非实测；同judge39/39，独立D14/D15、Owner、L3待验。规划PASS≠产品PASS。

## 2026-11-02｜B104 CAP-11-04 工具风险提示与OAuth资源受众隔离
[专项研究与章节局限](docs/capabilities/CAP-11-04/TOOL-HINT-AUDIENCE-B104-2026-11-02.md) → [7来源](research/sources/CAP-11-04-tool-hint-b104.json) → [8规则/原T5-01、T5-02](research/traces/CAP-11-04-tool-hint-b104-v08.json) → [42合成](docs/capabilities/CAP-11-04/tool-hint-b104-fixtures-v08.json) → [只读Node](tools/check_cap1104_tool_hint_b104_v08.cjs)。readOnlyHint不是授权，OAuth受众不等于Owner CAS；同judge规划合成42/42，真实Owner/消费者/L3未验。规划PASS≠产品PASS。

## 2026-11-02｜B103 CAP-03-04 Datum Target基准覆盖与AP242版次专项
[研究与来源深度](docs/capabilities/CAP-03-04/DATUM-TARGET-COVERAGE-B103-2026-11-02.md) → [7条分级来源](research/sources/CAP-03-04-datum-target-b103.json) → [8规则/原B0-02、F1-03、F1-04、T5-02](research/traces/CAP-03-04-datum-target-b103-v08.json) → [35合成正反UNKNOWN](docs/capabilities/CAP-03-04/datum-target-b103-fixtures-v08.json) → [只读Node](tools/check_cap0304_datum_target_b103_v08.cjs)。NIST官方明确2023 STC移除全部Datum Target，STC通过不等于该维度验证；ISO AP242:2025 Edition4已发布、2022 Edition3撤回但历史输入需保留原版次。独立Reader/FTC原始字节/Owner/消费者/L3未验。**规划PASS≠产品PASS。**

## 2026-11-02｜B102 CAP-01-08 研究注册表三方一致性与描述漂移修复
[固定Tree/官方章节专项](docs/capabilities/CAP-01-08/REGISTRY-CONSISTENCY-B102-2026-11-02.md) → [5分级来源](research/sources/CAP-01-08-registry-consistency-b102.json) → [7规则字段/原B0-05/U4-06/T5-06](research/traces/CAP-01-08-registry-consistency-b102-v08.json) → [1正12反](docs/capabilities/CAP-01-08/registry-consistency-b102-fixtures-v08.json) → [只读Node](tools/check_registry_consistency_b102_v08.cjs)。旧207 Registry/1591登记在Git Tree中路径全在且普通Blob、0缺失，修复progress文字仍停留206/1584；新增5登记后208 Registry/1596条。仅远端结构及V8同算法合成，不是逐来源全文或全仓GFM AST/产品PASS。17 Owner/消费者0、L3待审。

## 2026-11-02｜B101 CAP-09-06 非恒等Joint限位与D14→D15独立验证
[研究及官方阅读边界](docs/capabilities/CAP-09-06/JOINT-INDEPENDENCE-B101-2026-11-02.md) → [7分级来源](research/sources/CAP-09-06-joint-b101.json) → [8规则字段](research/traces/CAP-09-06-joint-b101-trace-v08.json) → [45合成正反UNKNOWN](docs/capabilities/CAP-09-06/CAP-09-06-joint-b101-fixtures-v08.json) → [只读Node](tools/check_cap0906_joint_b101_v08.cjs)。Cartesian软限位合格不意味着Joint安全；D15同域必须独立实现，真实消费者/Owner/L3/全仓AST待验。**规划PASS≠产品PASS。**

## 2026-11-02｜B100 CAP-10-03 D16→D17独立接收证明与幂等回执
[研究及真实独立消费者门禁](docs/capabilities/CAP-10-03/INDEPENDENT-RECEIPT-B100-2026-11-02.md) → [8分级来源](research/sources/CAP-10-03-independent-receipt-b100.json) → [8规则/字段/原E3-06、T5-03](research/traces/CAP-10-03-independent-receipt-b100-v08.json) → [37合成正反/UNKNOWN/幂等](docs/capabilities/CAP-10-03/independent-receipt-b100-fixtures-v08.json) → [只读Node](tools/check_cap1003_independent_receipt_b100_v08.cjs)。同judge预检不等于真实D17已验，Owner/消费者0/17，L3待人审。**规划PASS≠产品PASS。**

## 2026-11-02｜B99 CAP-08-03 G43刀长与G234 TCPC方言补证
[研究/厂商公开正文及限制](docs/capabilities/CAP-08-03/TOOL-LENGTH-TCPC-B99-2026-11-02.md) → [6来源](research/sources/CAP-08-03-tlo-tcpc-b99.json) → [8规则/16字段](research/traces/CAP-08-03-tlo-tcpc-b99-v08.json) → [36正反/UNKNOWN](docs/capabilities/CAP-08-03/tlo-tcpc-b99-fixtures-v08.json) → [只读Node](tools/check_cap0803_tlo_tcpc_b99_v08.cjs)；4几何Golden仅规划。真实OEM、独立Node、17 Owner/消费者及L3均未验。**规划PASS≠产品PASS。**

## 2026-11-02｜B98 17资产独立消费者同域盲点与证据矩阵
[专项补证](docs/architecture/v0.8/ASSET-CONSUMER-INDEPENDENCE-B98-2026-11-02.md) → [17优先消费边+2同域例外](docs/architecture/v0.8/asset-consumer-independence-b98-v08.json) → [7项分级合法来源](research/sources/FINAL-ASSET-INDEPENDENCE-B98.json) → [8规则](research/traces/FINAL-ASSET-INDEPENDENCE-B98-V08.json) → [47规划合成](docs/architecture/v0.8/asset-consumer-independence-b98-fixtures-v08.json) → [Node只读工具](tools/check_asset_consumer_independence_b98_v08.cjs)。17资产44边互反；D14和D16仅同域业务消费输出，须有独立实现与运行证据，正式Owner/消费者仍0/17；独立Node/真实NC/全仓GFM AST未验。规划PASS≠产品PASS。

## 2026-11-02｜B97 CAP-01-08 Markdown AST链接与特殊Git对象保守补证
[研究、阅读深度与独立验收边界](docs/capabilities/CAP-01-08/GFM-AST-VALIDATION-B97-2026-11-02.md) → [4合法分级来源](research/sources/FINAL-MD-B97-AST-V08.json) → [6规则/原B0-05、U4-06、T5-06包](research/traces/FINAL-MD-B97-AST-V08.json) → [12路径+3 AST合成](docs/capabilities/CAP-01-08/gfm-ast-b97-fixtures-v08.json) → [只读Python](tools/check_final_md_b97_ast_v08.py)。本地15项合成与临时真实Git四链接分类通过；**真实规划仓全仓GFM AST、GitHub锚点渲染对等NOT_RUN**。Owner/消费者0/17，L3待人审，规划PASS≠产品PASS。

## 2026-11-02｜B96 CAP-08-03 G41/G42半径刀补跨控制器语义
[LinuxCNC2.9/Haas Setting40、D号与G40退刀差异](docs/capabilities/CAP-08-03/CUTTER-COMP-DIALECT-B96-2026-11-02.md) → [9项分级来源](research/sources/CAP-08-03-cutter-comp-b96.json) → [9规则/原E3-02、E3-03、U4-04](research/traces/CAP-08-03-cutter-comp-b96-v08.json) → [38正反UNKNOWN/3数学Golden](docs/capabilities/CAP-08-03/cutter-comp-b96-fixtures-v08.json) → [只读Node工具](tools/check_cap0803_cutter_comp_b96_v08.cjs)。V8同judge合成38/38；真实控制器、Node独立文件进程、17 Owner/真实消费者/L3与全仓AST尚未验证。**规划PASS≠产品PASS。**

## 2026-11-01｜B95 CAP-08-03 G2/G3弧心双模态与LinuxCNC文档冲突
[研究报告/实际阅读局限](docs/capabilities/CAP-08-03/ARC-MODAL-B95-2026-11-01.md) → [8项来源](research/sources/CAP-08-03-arc-modal-b95.json) → [9规则字段/原包](research/traces/CAP-08-03-arc-modal-b95-v08.json) → [38显式正反与UNKNOWN/2数学Golden](docs/capabilities/CAP-08-03/arc-modal-b95-fixtures-v08.json) → [Node只读工具](tools/check_cap0803_arc_modal_b95_v08.cjs)。LinuxCNC2.9同页§5.1 G18 I/K与§55 G18 J/K冲突维持UNKNOWN；38合成仅同judge预检，真实NC、Owner0/17、消费者0/17、L3及全仓GFM AST待验。**规划PASS≠产品PASS。**

## 2026-11-01｜B94 CAP-07-07 中立CL反平行刀轴与姿态插值补证
[专题与合法来源分级](docs/capabilities/CAP-07-07/ORIENTATION-INTERPOLATION-B94-2026-11-01.md) → [8来源](research/sources/CAP-07-07-orientation-b94.json) → [8规则字段/原工作包](research/traces/CAP-07-07-orientation-b94-v08.json) → [35正反UNKNOWN/3解析Golden](docs/capabilities/CAP-07-07/orientation-b94-fixtures-v08.json) → [Node只读检查器](tools/check_cap0707_orientation_b94_v08.cjs)。仅V8同judge合成，Node独立进程/OCCT/NC/真实Owner/消费者/L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B93 CAP-07-08 局部编辑DAG闭包、段血缘与旧NC证据失效
[研究与限制](docs/capabilities/CAP-07-08/EDIT-DAG-LINEAGE-B93-2026-11-01.md) → [8来源](research/sources/CAP-07-08-edit-dag-b93.json) → [8规则/原F1-03、E3-01、U4-04](research/traces/CAP-07-08-edit-dag-b93-v08.json) → [32正反未知、3图Golden](docs/capabilities/CAP-07-08/edit-dag-b93-fixtures-v08.json) → [Node工具](tools/check_cap0708_edit_dag_b93_v08.cjs)。V8同judge规划合成32/32、数学图Golden3/3；真实Owner/独立消费者、NC、L3与全仓AST未完成。**规划PASS≠产品PASS。**

## 2026-11-01｜B92 CAP-07-02 修剪Face投影、孔环和周期UV缝专项补证
[研究与访问限制](docs/capabilities/CAP-07-02/TRIMMED-FACE-PROJECTION-B92-2026-11-01.md) → [8来源](research/sources/CAP-07-02-trim-projection-b92.json) → [8规则/CAP/原F1-03、E3-01、U4-04](research/traces/CAP-07-02-trim-projection-b92-v08.json) → [8正16反8未知/3解析Golden](docs/capabilities/CAP-07-02/trim-projection-b92-fixtures-v08.json) → [只读Node工具](tools/check_cap0702_trim_projection_b92_v08.cjs)。V8同判定合成32/32、解析Golden3/3，真实OCCT、独立Node、Owner/消费者与全仓AST均NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-01｜B91 CAP-07-01 多环岛屿偏置/窄通道/圆弧误差补证
[研究与限制](docs/capabilities/CAP-07-01/MULTIRING-OFFSET-B91-2026-11-01.md) → [7来源](research/sources/CAP-07-01-multiring-offset-b91.json) → [8规则/原F1-03/E3-01/U4-04](research/traces/CAP-07-01-multiring-offset-b91-v08.json) → [8正18反、3解析Golden](docs/capabilities/CAP-07-01/multiring-offset-b91-fixtures-v08.json) → [只读Node](tools/check_cap0701_multiring_offset_b91_v08.cjs)。限定平行通道及弦高合成，不宣称实际OCCT、D15或独立消费者通过。L3待审，规划PASS≠产品PASS。

## 2026-11-01｜B90 CAP-09-06 G93/G94/G95名义进给时间与NC执行分离
[报告](docs/capabilities/CAP-09-06/INVERSE-FEED-TIME-B90-2026-11-01.md) → [7来源](research/sources/CAP-09-06-feed-time-b90.json) → [9字段规则/原工作包](research/traces/CAP-09-06-feed-time-b90-v08.json) → [27正反+3数值Golden](docs/capabilities/CAP-09-06/feed-time-b90-fixtures-v08.json) → [Node只读入口](tools/check_cap0906_feed_time_b90_v08.cjs)。LinuxCNC G93 F2为30秒名义指令，不是实际轴时钟；Haas车床与铣床G94不同。规划同judge27/27、3公式Golden；真实D13–D15与Owner/消费者NOT_RUN，L3待审。**规划PASS≠产品PASS**。

## 2026-11-01｜B89 CAP-09-03 近奇异逆解的阻尼步长不等于残差达标
[研究与明确阅读深度](docs/capabilities/CAP-09-03/IK-CONDITIONING-B89-2026-11-01.md) → [7来源](research/sources/CAP-09-03-ik-conditioning-b89.json) → [8规则与原F1-02/E3-04/E3-05/U4-04](research/traces/CAP-09-03-ik-conditioning-b89-v08.json) → [8正24反+2解析Golden](docs/capabilities/CAP-09-03/ik-conditioning-b89-fixtures-v08.json) → [Node检查入口](tools/check_cap0903_ik_conditioning_b89_v08.cjs)。Eigen数值秩阈值与异量纲归一化需显式配置；阻尼使步长有界但残差仍可能显著。32项仅同函数合成，独立Node/Eigen/B5/OEM/真实D15/17消费者NOT_RUN，L3待人审，**规划PASS≠产品PASS**。

## 2026-11-01｜B88 CAP-08-07 NC宏循环执行实例与来源身份补证
[研究与限制](docs/capabilities/CAP-08-07/EXECUTION-OCCURRENCE-B88-2026-11-01.md) → [8来源](research/sources/CAP-08-07-occurrence-b88.json) → [8规则/原E3-02/E3-03/U4-04](research/traces/CAP-08-07-occurrence-b88-v08.json) → [33正反合成](docs/capabilities/CAP-08-07/occurrence-b88-fixtures-v08.json) → [Node只读入口](tools/check_cap0807_occurrence_b88_v08.cjs)。同一NC源行可对应多次执行，必须以原字节/闭包/Profile/调用路径/字符串事件号溯源；N号不是运行主键。V8同函数33/33，独立Node进程、真实D13–D16、Owner/消费者NOT_RUN，L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B87 CAP-06-03 OCCT布尔Fuzzy与Glue风险前提
[研究与实际来源深度](docs/capabilities/CAP-06-03/BOOLEAN-FUZZY-B87-2026-11-01.md) → [7来源](research/sources/CAP-06-03-fuzzy-b87.json) → [8规则/原W2-03/F1-05](research/traces/CAP-06-03-fuzzy-b87-v08.json) → [32显式正反/UNKNOWN](docs/capabilities/CAP-06-03/fuzzy-b87-fixtures-v08.json) → [Node](tools/check_cap0603_fuzzy_b87_v08.cjs)。Glue仅在无真实子形状相交且有重合证据时可启；fuzzy实测预算不能抹平薄壁；非破坏输入与简化后History分离。仅同判定函数合成32/32和8故障注入；真实OCCT/Owner/独立消费者及全仓AST仍NOT_RUN。**规划PASS≠产品PASS。**

## 2026-11-01｜B86 CAP-02-03车床刀塔与刀补Index分层
[报告](docs/capabilities/CAP-02-03/LATHE-TURRET-B86-2026-11-01.md) → [9来源](research/sources/CAP-02-03-lathe-turret-b86.json) → [8规则](research/traces/CAP-02-03-lathe-turret-b86-v08.json) → [32正反](docs/capabilities/CAP-02-03/lathe-turret-b86-fixtures-v08.json) → [Node](tools/check_cap0203_lathe_turret_b86_v08.cjs)。Haas§8.3/§11.3与LinuxCNC2.9官方正文定点阅读，ISO仅目录，NIST仅摘要。32/32同函数合成，真实Owner/消费者0/17、L3待审，**规划PASS≠产品PASS**。

## 2026-11-01｜B85 CAP-10-07现场变更补丁原子性与CAS
[研究](docs/capabilities/CAP-10-07/CHANGE-PATCH-B85-2026-11-01.md) → [7来源](research/sources/CAP-10-07-change-patch-b85.json) → [8规则](research/traces/CAP-10-07-change-patch-b85-v08.json) → [46合成](docs/capabilities/CAP-10-07/change-patch-b85-fixtures-v08.json)。Owner/真实消费者/L3未验；**规划PASS≠产品PASS**。

## 2026-11-01｜B84 CAP-04-05 多Setup转序相关测量不确定度
[研究与标量合成反例](docs/capabilities/CAP-04-05/TRANSFER-UNCERTAINTY-B84-2026-11-01.md) → [9项分级来源](research/sources/CAP-04-05-transfer-uncertainty-b84.json) → [8规则及原F1-02/F1-04/W2-05/E3-04/U4-02](research/traces/CAP-04-05-transfer-uncertainty-b84-v08.json) → [46个显式正反/UNKNOWN/STALE](docs/capabilities/CAP-04-05/transfer-uncertainty-b84-fixtures-v08.json) → [只读Node验收入口](tools/check_cap0405_transfer_uncertainty_b84_v08.cjs) → [验证等级](tracking/cap0405-transfer-uncertainty-b84-verification-2026-11-01.json)。相关性ρ未知不默认零；0.06mm是自设1σ合成预算非公差；D04与D10、D15/D16隔离，真实计量、独立Node、17正式Owner/消费者、全仓GFM AST与L3均未完成。**规划PASS≠产品PASS。**

## 2026-11-01｜B83 CAP-03-04 PMI标注平面与Saved View/ Capture分层
[B83 PMI标注平面、放置与Capture独立契约](docs/capabilities/CAP-03-04/ANNOTATION-PLANE-B83-2026-11-01.md) → [8项来源/访问深度](research/sources/CAP-03-04-annotation-plane-b83.json) → [8字段规则及原工作包](research/traces/CAP-03-04-annotation-plane-b83-v08.json) → [37项显式正反](docs/capabilities/CAP-03-04/annotation-plane-b83-fixtures-v08.json) → [只读Node工具](tools/check_cap0304_annotation_plane_b83_v08.cjs) → [合成验证等级](tracking/cap0304-annotation-plane-b83-verification-2026-11-01.json)。CAx-IF v4.0.8 for Review §9.4.2/Annex D与Creo R12公开手册定点阅读；Annotation Plane方向≠附件平行放置≠Capture Camera与成员；37项V8同判定函数仅合成，独立Node/真实CAD/GUI/消费者NOT_RUN，Owner0/17、L3待审、全仓AST未终核。**规划PASS≠产品PASS。**

## 2026-11-01｜B82 规划仓GFM锚点碰撞与保守终核资格
[研究](docs/architecture/v0.8/第八十二轮GFM锚点碰撞与终核资格_2026-11-01.md) → [6来源](research/sources/FINAL-MD-B82.json) → [8规则](research/traces/FINAL-MD-B82-ANCHOR-V08.json) → [22个独立预期](docs/architecture/v0.8/final-md-b82-anchor-fixtures-v08.json) → [Python只读工具](tools/check_final_md_b82_anchor_v08.py) → [执行等级](tracking/final-md-b82-verification-2026-11-01.json)。补足自动标题去重后缀与字面Slug冲突及重复HTML id的UNKNOWN分级；本地22/22合成、5故意错误变异拒绝、独立临时Git对象样例通过，**609份真实Markdown全仓GFM AST及GitHub渲染对等NOT_RUN**。正式Owner0/17、独立消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B81 CAP-09-04 G43.1替换、G43.2叠加与Haas NGC持久刀补
[专项研究](docs/capabilities/CAP-09-04/TOOL-LENGTH-MODAL-B81-2026-11-01.md) → [7分级来源](research/sources/CAP-09-04-tool-length-modal-b81.json) → [8规则及原E3-04/E3-05/U4-04](research/traces/CAP-09-04-tool-length-modal-b81-v08.json) → [34项合成用例](docs/capabilities/CAP-09-04/tool-length-modal-b81-fixtures-v08.json) → [只读Node工具](tools/check_cap0904_tool_length_modal_b81_v08.cjs)。LinuxCNC2.9 G43.1覆盖而G43.2追加，Haas NGC版本化的偏置可跨重启保留；单轴Z合成34/34本地Node通过，不等于真实G-code解释、五轴TCP或NC安全。Owner签署及独立消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B80 CAP-11-03 Unicode代码点与多语种引用归属
[专项研究](docs/capabilities/CAP-11-03/UNICODE-SELECTOR-B80-2026-11-01.md) → [7项分级来源](research/sources/CAP-11-03-unicode-selector-b80.json) → [8字段规则/原T5-01和T5-02](research/traces/CAP-11-03-unicode-selector-b80-v08.json) → [42项显式合成](docs/capabilities/CAP-11-03/unicode-selector-b80-fixtures-v08.json) → [只读Node校验](tools/check_cap1103_unicode_selector_b80_v08.cjs)。W3C代码点与JS UTF-16位置不同，字素簇处理未全覆盖须UNKNOWN；真实Owner、独立消费者与L3仍待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B79 CAP-01-06 SSE重连游标与Host持久事件补证
[研究](docs/capabilities/CAP-01-06/SSE-REPLAY-B79-2026-11-01.md) → [来源](research/sources/CAP-01-06-sse-replay-b79.json) → [8规则](research/traces/CAP-01-06-sse-replay-b79-v08.json) → [29合成](docs/capabilities/CAP-01-06/sse-replay-b79-fixtures-v08.json) → [Node](tools/check_cap0106_sse_replay_b79_v08.cjs)。Last-Event-ID不证明持久重放，空id重置游标，超2^53精确序列；真实Host/独立消费者未验。**规划PASS≠产品PASS。**

## 2026-11-01｜B78 CAP-02-04 OPC三层状态与夹具观测来源时钟
[专项研究](docs/capabilities/CAP-02-04/OPC-OBSERVATION-B78-2026-11-01.md) → [7分级来源](research/sources/CAP-02-04-opc-observation-b78.json) → [8规则/字段](research/traces/CAP-02-04-opc-observation-b78-v08.json) → [32正反/未知/过期](docs/capabilities/CAP-02-04/opc-observation-b78-fixtures-v08.json) → [只读Node](tools/check_cap0204_opc_observation_b78_v08.cjs)。OPC Service Good≠Operation Good≠DataValue Good，serverTimestamp不能代替sourceTimestamp。32/32仅同judge合成，真实OPC/独立消费者/Owner/L3未验。**规划PASS≠产品PASS。**

## 2026-11-01｜B77 CAP-01-07 三维尺寸标签CSS像素、遮挡和命中资格
[研究与DPR2投影(500,350)反例](docs/capabilities/CAP-01-07/DIMENSION-HUD-B77-2026-11-01.md) → [9分级来源](research/sources/CAP-01-07-hud-b77.json) → [8规则/字段/原U4包](research/traces/CAP-01-07-hud-b77-v08.json) → [48预期正反/STALE/UNKNOWN/只读合成](docs/capabilities/CAP-01-07/hud-b77-fixtures-v08.json) → [只读Node](tools/check_cap0107_hud_b77_v08.cjs) → [执行等级](tracking/cap0107-hud-b77-verification-2026-11-01.json)。字体≤12px，但交互命中≥24×24 CSS px；真实Babylon/DPI/跨域消费者与L3仍未验。**规划PASS≠产品PASS。**

## 2026-11-01｜B76 CAP-08-05 子程序调用参数作用域和闭包
[专项研究与5×5=25反例](docs/capabilities/CAP-08-05/SUBPROGRAM-CLOSURE-B76-2026-11-01.md) → [7份分级来源](research/sources/CAP-08-05-subprogram-b76.json) → [8规则与原工作包](research/traces/CAP-08-05-subprogram-b76-v08.json) → [43项显式正反/UNKNOWN/STALE](docs/capabilities/CAP-08-05/subprogram-b76-fixtures-v08.json) → [只读Node校验器](tools/check_cap0805_subprogram_b76_v08.cjs) → [证据等级](tracking/cap0805-subprogram-b76-verification-2026-11-01.json)。O-call局部#1–#30与M98编号全局副作用不能互换；Haas M97本地N行和M98外部O程序需要固定搜索根。仅V8同judge合成43/43，Node独立文件/真实NC、17Owner/消费者NOT_RUN；全仓GFM AST及历史附件原字节待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B75 CAP-04-02 D04配准与D10机器WCS偏置证据分离
[研究与后叠加反例](docs/capabilities/CAP-04-02/WCS-EVIDENCE-B75-2026-11-01.md) → [6来源](research/sources/CAP-04-02-offset-evidence-b75.json) → [8规则/字段](research/traces/CAP-04-02-offset-evidence-b75-v08.json) → [24独立预期合成](docs/capabilities/CAP-04-02/offset-evidence-b75-fixtures-v08.json) → [Node只读工具](tools/check_cap0402_offset_evidence_b75_v08.cjs) → [分级验收](tracking/cap0402-offset-evidence-b75-verification-2026-11-01.json)。G10 L2 P1不会自动选择G54，G52/G92持久寄存器和旋转后偏移不能由D04名义Frame推测。V8同judge 24/24；独立Node/真实NC/OEM/Owner/消费者均未验，L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B74 CAP-02-02车床刀尖半径与跨方言偏置
[数学及来源](docs/capabilities/CAP-02-02/LATHE-NOSE-COMPENSATION-B74-2026-11-01.md) → [7项来源](research/sources/CAP-02-02-lathe-tnc-b74.json) → [8规则/字段/原包](research/traces/CAP-02-02-lathe-tnc-b74-v08.json) → [26项合成样例](docs/capabilities/CAP-02-02/lathe-tnc-b74-fixtures-v08.json) → [只读Node](tools/check_cap0202_lathe_tnc_b74_v08.cjs) → [验收等级](tracking/cap0202-lathe-tnc-b74-verification-2026-11-01.json)。LinuxCNC工具表D为直径，但G41 Dn为工具号，Haas Tnnxx为另一方言偏置号；同judge合成26/26，真实独立Node/NC/消费者NOT_RUN，Owner0/17且L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B73 CAP-10-06 离线事件重放与工单收件证据
[专项研究](docs/capabilities/CAP-10-06/OFFLINE-EVENT-REPLAY-B73-2026-11-01.md) → [7项分级来源](research/sources/CAP-10-06-offline-events-b73.json) → [8项来源/规则/字段及原E3-06、T5-03映射](research/traces/CAP-10-06-offline-events-b73-v08.json) → [48合成正反/幂等/缺口/过期/未知](docs/capabilities/CAP-10-06/offline-events-b73-fixtures-v08.json) → [Node只读规划校验器](tools/check_cap1006_offline_events_b73_v08.cjs) → [实际执行分级](tracking/cap1006-offline-events-b73-verification-2026-11-01.json)。OPC ISA-95 `Store`不启动，`StoreAndStart`具启动效果且本CAP不调用；CloudEvents `source+id`不等于业务全序。V8同judge 48/48仅规划合成，独立Node/ERP-MES/OPC/NC/17消费者未测、正式Owner 0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-11-01｜B72 CAP-08-03车床G95/G99跨方言及G96恒线速证据

[研究与数学反例](docs/capabilities/CAP-08-03/LATHE-CSS-DIALECT-B72-2026-11-01.md) → [8项分级来源](research/sources/CAP-08-03-lathe-css-b72.json) → [8条字段规则/原工作包](research/traces/CAP-08-03-lathe-css-b72-v08.json) → [46项合成验收](docs/capabilities/CAP-08-03/lathe-css-b72-fixtures-v08.json) → [只读Node工具](tools/check_cap0803_lathe_css_b72_v08.cjs) → [证据分级](tracking/cap0803-lathe-css-b72-verification-2026-11-01.json)。LinuxCNC2.9 G95为每转进给，Haas车床G95为动力刀具攻丝、G99才为每转进给；LinuxCNC G96 D与Haas G50 S限速不能混写。V8同judge合成46/46预期一致，独立Node、真实NC/OEM和17消费者NOT_RUN；正式Owner0/17，L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B71 CAP-02-06不确定度与本件测量三区决策
[研究与数学反例](docs/capabilities/CAP-02-06/UNCERTAINTY-GUARD-B71-2026-10-31.md) → [6来源](research/sources/CAP-02-06-uncertainty-guard-b71.json) → [8规则/原包](research/traces/CAP-02-06-uncertainty-guard-b71-v08.json) → [58合成正反/未知](docs/capabilities/CAP-02-06/uncertainty-guard-b71-fixtures-v08.json) → [Node只读校验器](tools/check_cap0206_uncertainty_guard_b71_v08.cjs) → [验收等级](tracking/cap0206-uncertainty-guard-b71-verification-2026-10-31.json)。校准资源D03不等于D17实际观测；10.02±0.04mm与9.95–10.05mm公差存在不确定区域。仅V8同函数合成58/58；真实测量、Node文件、17消费者、Owner/L3仍未通过。**规划PASS≠产品PASS。**

## 2026-10-31｜B70 CAP-09-08 旋转Joint完整圈数与显示插值资格
[数学反例及阅读分级](docs/capabilities/CAP-09-08/ROTARY-WINDING-B70-2026-10-31.md) → [7来源](research/sources/CAP-09-08-joint-winding-b70.json) → [8规则/原F1-02/E3-04/E3-05/U4-04](research/traces/CAP-09-08-joint-winding-b70-v08.json) → [55合成正反/未知](docs/capabilities/CAP-09-08/joint-winding-b70-fixtures-v08.json) → [Node只读检查器](tools/check_cap0908_joint_winding_b70_v08.cjs) → [执行等级](tracking/cap0908-joint-winding-b70-verification-2026-10-31.json)。0°和360°同姿态不代表同一Joint运动，Babylon Slerp不能恢复累计圈数。V8同函数55/55合成；独立Node/实机/D15/D16/17消费者NOT_RUN、Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B69 CAP-05-04 工艺模板缺失事实三值适用性及英寸单位
[来源与数学反例](docs/capabilities/CAP-05-04/APPLICABILITY-THREE-VALUED-B69-2026-10-31.md) → [6来源](research/sources/CAP-05-04-applicability-b69.json) → [8规则/原W2-02/03/05](research/traces/CAP-05-04-applicability-b69-v08.json) → [40项五态合成](docs/capabilities/CAP-05-04/applicability-b69-fixtures-v08.json) → [只读Node](tools/check_cap0504_applicability_b69_v08.cjs) → [等级](tracking/cap0504-applicability-b69-verification-2026-10-31.json)。1in=25.4mm为NIST官方定义，JSON Schema default不是制造事实；UNKNOWN不被视为PASS。V8同函数规划合成40/40，真实Node/D05/17消费者/NC均NOT_RUN；正式Owner0/17，L3待审、历史原件与全仓GFM AST未闭。**规划PASS≠产品PASS。**

## 2026-10-31｜B68 CAP-11-07 不可信RAG知识反馈的来源洗白和晋级闸门
[定点研究](docs/capabilities/CAP-11-07/POISON-PROMOTION-B68-2026-10-31.md) → [7份阅读分级来源](research/sources/CAP-11-07-poison-gate-b68.json) → [8规则/字段/原T5-01/02/03/04](research/traces/CAP-11-07-poison-gate-b68-v08.json) → [49显式正反/STALE/UNKNOWN/只读合成](docs/capabilities/CAP-11-07/poison-gate-b68-fixtures-v08.json) → [只读Node](tools/check_cap1107_poison_gate_b68_v08.cjs) → [执行等级](tracking/cap1107-poison-gate-b68-verification-2026-10-31.json)。原检索文本即便Hash/引用正确也不具工具控制权；跨项目Chunk不能写回11域知识或提升D15/D16。49/49同judge规划合成，远端独立Node/真实RAG/17独立消费者NOT_RUN、正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B66 CAP-05-03 显式人工工序前置边与只读约简
[专项研究](docs/capabilities/CAP-05-03/EXPLICIT-EDGES-B66-2026-10-31.md) → [9来源](research/sources/CAP-05-03-explicit-edges-b66.json) → [8规则及W2-02/03/05](research/traces/CAP-05-03-explicit-edges-b66-v08.json) → [56规划合成](docs/capabilities/CAP-05-03/explicit-edges-b66-fixtures-v08.json) → [校验器](tools/check_cap0503_explicit_edges_b66_v08.cjs) → [执行级别](tracking/cap0503-explicit-edges-b66-verification-2026-10-31.json)。DAG可达性等价不保人工直接约束边来源；V8同judge规划合成通过，独立Node/真实D05/NC/消费者NOT_RUN，L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B65 CAP-10-05 MTConnect uint64游标/Agent代次/筛选稀疏流
[研究与数学反例](docs/capabilities/CAP-10-05/MTCONNECT-U64-FILTER-B65-2026-10-31.md) → [6来源](research/sources/CAP-10-05-mtconnect-u64-b65.json) → [8规则及原E3-06/T5-03](research/traces/CAP-10-05-mtconnect-u64-b65-v08.json) → [74合成](docs/capabilities/CAP-10-05/mtconnect-u64-b65-fixtures-v08.json) → [Node只读验证器](tools/check_cap1005_mtconnect_u64_b65_v08.cjs) → [分级验收](tracking/cap1005-mtconnect-u64-b65-verification-2026-10-31.json)。2^53+1不能用JS Number，筛选后稀疏序列≠流GAP，heartbeat≠观测/NC验证。74/74同判定函数规划合成，独立Node/Agent/17消费者NOT_RUN、Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B64 CAP-10-05 OPC UA订阅ACK/Republish断点与D17持久化
[专项研究](docs/capabilities/CAP-10-05/OPCUA-SUBSCRIPTION-GAP-B64-2026-10-31.md) → [6来源](research/sources/CAP-10-05-opcua-subscription-b64.json) → [8规则/字段/原E3-06/T5-03](research/traces/CAP-10-05-opcua-subscription-b64-v08.json) → [68正反/GAP/STALE/UNKNOWN合成](docs/capabilities/CAP-10-05/opcua-subscription-b64-fixtures-v08.json) → [Node只读校验器](tools/check_cap1005_opcua_subscription_b64_v08.cjs) → [核验分级](tracking/cap1005-opcua-subscription-b64-verification-2026-10-31.json)。OPC UA keep-alive≠Observation；数据入D17必须Owner CAS落盘后才考虑ACK，失联Republish缺消息的历史不能靠最新值补造。V8同函数合成68/68，独立Node/真实OPC/OEM/17消费者NOT_RUN、Owner0/17、L3待审。并修正source-index旧计数字段1299≠实际登记1317，现170 Registry/1323条。**规划PASS≠产品PASS。**

## 2026-10-31｜B63 CAP-10-04 OPC UA FileType短读与Session句柄
[研究](docs/capabilities/CAP-10-04/OPCUA-SESSION-SHORTREAD-B63-2026-10-31.md) → [6来源](research/sources/CAP-10-04-opcua-file-b63.json) → [8规则](research/traces/CAP-10-04-opcua-file-b63-v08.json) → [54合成正反未知](docs/capabilities/CAP-10-04/opcua-file-b63-fixtures-v08.json) → [只读Node工具](tools/check_cap1004_opcua_file_b63_v08.cjs) → [核验](tracking/cap1004-opcua-file-b63-verification-2026-10-31.json)。Read返回不足请求长度不是EOF；句柄不能跨Session；SetPosition越界钳到EOF。V8同判定函数54/54合成仅CANDIDATE_ONLY，独立Node/实际OPC设备/17独立消费者NOT_RUN，正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B62 CAP-07-05 球刀平面残高与表面纹理资格
[研究](docs/capabilities/CAP-07-05/SCALLOP-QUALIFICATION-B62-2026-10-31.md) → [7来源](research/sources/CAP-07-05-scallop-b62.json) → [8规则](research/traces/CAP-07-05-scallop-b62-v08.json) → [43项合成](docs/capabilities/CAP-07-05/scallop-b62-fixtures-v08.json) → [校验器](tools/check_cap0705_scallop_b62_v08.cjs) → [分级](tracking/cap0705-scallop-b62-verification-2026-10-31.json)。R5/s0.8理想h=0.016025682mm，s1为0.025062814mm超0.02目标；h不等于Ra。V8同函数43/43规划合成；真实Node/OCCT/NC/D17/OEM/消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B61 CAP-07-04 G93逆时间进给不是五轴Joint实际时序
[分层研究](docs/capabilities/CAP-07-04/INVERSE-TIME-FEED-B61-2026-10-31.md) → [5项来源](research/sources/CAP-07-04-inverse-time-b61.json) → [8规则](research/traces/CAP-07-04-inverse-time-b61-v08.json) → [47合成](docs/capabilities/CAP-07-04/inverse-time-b61-fixtures-v08.json) → [校验器](tools/check_cap0704_inverse_time_b61_v08.cjs)。LinuxCNC 2.9 §59公开正文实读；NIST IR6556仅出版页。G93 F2名义30秒、每个G1/G2/G3运动块须F，D14实际关节/NC工程验证均NOT_RUN，Owner及消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B60 CAP-07-03 索引3+2同刀轴不同roll反例
[研究与数学Golden](docs/capabilities/CAP-07-03/INDEXED-ROLL-B60-2026-10-31.md) → [6来源](research/sources/CAP-07-03-indexed-roll-b60.json) → [8规则](research/traces/CAP-07-03-indexed-roll-b60-v08.json) → [41正反未知合成](docs/capabilities/CAP-07-03/indexed-roll-b60-fixtures-v08.json) → [Node工具](tools/check_cap0703_indexed_roll_b60_v08.cjs) → [等级记录](tracking/cap0703-indexed-roll-b60-verification-2026-10-31.json)。两矩阵刀轴同为世界X，面内X相差90°。V8同judge 41/41仅规划合成；实际独立Node、OCCT/控制器/NC/B5/17消费者均NOT_RUN，Owner0/17、L3待审、历史附件与全仓GFM AST未闭。**规划PASS≠产品PASS。**

## 2026-10-31｜B59 CAP-02-07 3D资源Mesh复用实例拾取与B-Rep来源身份
[OCCT/glTF/Babylon/NIST阅读层级与数学Golden](docs/capabilities/CAP-02-07/RENDER-PICK-IDENTITY-B59-2026-10-31.md) → [6来源](research/sources/CAP-02-07-render-pick-b59.json) → [8条规则/字段及原包](research/traces/CAP-02-07-render-pick-b59-v08.json) → [44个正反/未知合成](docs/capabilities/CAP-02-07/render-pick-b59-fixtures-v08.json) → [Node只读检查器](tools/check_cap0207_render_pick_b59_v08.cjs) → [证据分级](tracking/cap0207-render-pick-b59-verification-2026-10-31.json)。**共享meshId≠装配实例，三角片≠权威B-Rep Face；GUI只读拾取不等于D15工程验证。** 本地等价Node独立进程44/44合成通过，提交文件完整独立Node运行未核；真实OCCT/Babylon/17消费者/Owner签署均未验、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B58 CAP-09-06 NC轨迹模式与前瞻资格
[专项研究](docs/capabilities/CAP-09-06/TRAJECTORY-MODES-B58-2026-10-31.md) → [5来源](research/sources/CAP-09-06-trajectory-modes-b58.json) → [8规则](research/traces/CAP-09-06-trajectory-modes-b58-v08.json) → [61正反UNKNOWN](docs/capabilities/CAP-09-06/trajectory-modes-b58-fixtures-v08.json) → [工具](tools/check_cap0906_trajectory_modes_b58_v08.cjs) → [核验](tracking/cap0906-trajectory-modes-b58-verification-2026-10-31.json)。LinuxCNC2.9 G61≠G61.1、G64无P/P0无有限误差保证、P/Q及INI差异；8正44反9 UNKNOWN共61项V8合成，实际Node/NC/B5/OEM/D15/17消费者NOT_RUN、Owner0/17，L3待审。**规划PASS≠产品PASS**。

## 2026-10-31｜B57 CAP-07-06 连续进退刀区间保守安全下界
[数学推导与阅读限制](docs/capabilities/CAP-07-06/CONTINUOUS-LINK-CERT-B57-2026-10-31.md) → [5来源](research/sources/CAP-07-06-continuous-b57.json) → [8规则](research/traces/CAP-07-06-continuous-b57-v08.json) → [8正27反14 UNKNOWN](docs/capabilities/CAP-07-06/continuous-link-b57-fixtures-v08.json) → [Node工具](tools/check_cap0706_continuous_link_b57_v08.cjs) → [验证等级](tracking/cap0706-continuous-link-b57-verification-2026-10-31.json)。仅V8同判定函数合成49/49，实际OCCT/FCL/NC/B5/OEM/17独立消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS**。

## 2026-10-31｜B56 CAP-08-06 NC原始字节补丁与Unicode边界专项
[研究与官方来源](docs/capabilities/CAP-08-06/BYTE-EDIT-B56-2026-10-31.md) → [5来源](research/sources/CAP-08-06-byte-edit-b56.json) → [8规则/字段](research/traces/CAP-08-06-byte-edit-b56-v08.json) → [5正62反5 UNKNOWN](docs/capabilities/CAP-08-06/byte-edit-b56-fixtures-v08.json) → [只读Node校验器](tools/check_cap0806_byte_edit_b56_v08.cjs) → [验证等级](tracking/cap0806-byte-edit-b56-verification-2026-10-31.json)。新增byteSpan/PREIMAGE SHA/UTF-8边界/BOM/EOL不改原NC字节的不变量，UTF-16索引不可当字节偏移；未知编码与控制器方言保守UNKNOWN。V8同判定函数72/72规划合成PASS，独立Node文件/NC/OEM/真实17消费者NOT_RUN，Owner正式签署0/17、L3待审；**规划PASS≠产品PASS。**

## 2026-10-31｜B55 CAP-10-08 17资产独立消费者证据防伪收件
[研究及真实阅读边界](docs/architecture/v0.8/CONSUMER-PROOF-GATE-B55-2026-10-31.md) → [7来源](research/sources/FINAL-ASSET-CONSUMER-B55.json) → [8规则](research/traces/FINAL-ASSET-CONSUMER-B55-V08.json) → [17资产收件槽位](docs/architecture/v0.8/consumer-proof-b55-schema-v08.json) → [1正39反4 UNKNOWN](docs/architecture/v0.8/consumer-proof-b55-fixtures-v08.json) → [只读Node](tools/check_final_asset_consumer_b55_v08.cjs) → [分级核验](tracking/final-asset-consumer-b55-verification-2026-10-31.json)。候选Port的17/44结构不等于真实消费者，Owner签署0/17，实际独立消费者0/17；V8同一函数44/44仅合成，真实Node/Pact/OCCT/NC/B5/OEM未运行，L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B54 CAP-11-08 MCP同名工具跨Server身份与批准意图
[专项研究](docs/capabilities/CAP-11-08/APPROVAL-TOOL-IDENTITY-B54-2026-10-31.md) → [8来源](research/sources/CAP-11-08-tool-approval-b54.json) → [9规则/原T5-01/T5-02](research/traces/CAP-11-08-tool-approval-b54-v08.json) → [3正48反9未知](docs/capabilities/CAP-11-08/tool-approval-b54-fixtures-v08.json) → [只读Node](tools/check_cap1108_tool_approval_b54_v08.cjs) → [核验](tracking/cap1108-tool-approval-b54-verification-2026-10-31.json)。同名工具换Server、Schema变化、批准后ACL撤权均不复用旧权限；V8相同judge 60/60仅合成，独立Node/真实MCP/OAuth/Owner CAS/消费者NOT_RUN，正式签署0/17、L3待人审。**规划PASS≠产品PASS。**

## 2026-10-31｜B53 CAP-09-03双物理Joint回零与负HOME_SEQUENCE门禁
[专项研究](docs/capabilities/CAP-09-03/HOMING-PHYSICAL-JOINT-B53-2026-10-31.md) → [6来源](research/sources/CAP-09-03-homing-b53.json) → [8规则/原包](research/traces/CAP-09-03-homing-b53-v08.json) → [4正25反11 UNKNOWN，共40合成](docs/capabilities/CAP-09-03/homing-b53-fixtures-v08.json) → [只读Node](tools/check_cap0903_homing_b53_v08.cjs) → [分级核验](tracking/cap0903-homing-b53-verification-2026-10-31.json)。LinuxCNC2.9官方公开章节已读，HOME_OFFSET不等于HOME，同序号负HOME_SEQUENCE对双驱同步与VOLATILE_HOME失效应有独立物理Joint证据；ISO230-2仅读合法目录、NIST论文仅读公开摘要。V8相同judge 40/40规划合成PASS；独立Node、真实HAL/B5/OEM/D14-D15及17消费者NOT_RUN，Owner0/17、L3待审、历史原字节与全仓GFM AST未闭。**规划PASS≠产品PASS。**

## 2026-10-31｜B52 CAP-02-06相关不确定度与D17判定规则分级
[专项研究](docs/capabilities/CAP-02-06/COVARIANCE-DECISION-B52-2026-10-31.md) → [8项来源](research/sources/CAP-02-06-covariance-b52.json) → [9规则字段/原F1-06/E3-04/T5-05](research/traces/CAP-02-06-covariance-b52-v08.json) → [5正36反6 UNKNOWN合成](docs/capabilities/CAP-02-06/covariance-b52-fixtures-v08.json) → [Node只读工具](tools/check_cap0206_covariance_b52_v08.cjs) → [核验等级](tracking/cap0206-covariance-b52-verification-2026-10-31.json)。NIST TN1297公开协方差项，ISO 230-10/10360-2/14253-1仅合法目录摘要；V8同函数47/47合成，**独立Node/真实校准、CMM/在机探测、D17消费者及NC工程均NOT_RUN**，正式Owner0/17、L3待审，历史原字节与全仓GFM AST未闭。**规划PASS≠产品PASS。**

## 2026-10-31｜B51 CAP-09-02 双分支机床正解、双驱Joint与相对TCP Golden
[专项研究](docs/capabilities/CAP-09-02/DUAL-BRANCH-FK-B51-2026-10-31.md) → [6来源](research/sources/CAP-09-02-dual-branch-b51.json) → [8规则/原F1-02/E3-04/E3-05/U4-04](research/traces/CAP-09-02-dual-branch-b51-v08.json) → [2正26反3 UNKNOWN](docs/capabilities/CAP-09-02/dual-branch-b51-fixtures-v08.json) → [只读Node入口](tools/check_cap0902_dual_branch_b51_v08.cjs) → [核验等级](tracking/cap0902-dual-branch-b51-verification-2026-10-31.json)。当前合成相对TCP=(-10,-100,0)mm，并发冻结/GUI/CLI/Agent规则联动均属设计合同；V8同函数31/31，独立Node、原生OCCT、B5/OEM、D14/D15和17消费者均NOT_RUN，Owner 0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B50 CAP-01-07 三维尺寸编辑：测量/PMI/驱动参数分离
[专项研究](docs/capabilities/CAP-01-07/DIMENSION-EDIT-B50-2026-10-31.md) → [9来源](research/sources/CAP-01-07-dimension-edit-b50.json) → [10规则/字段与原编号工作包](research/traces/CAP-01-07-dimension-edit-b50-v08.json) → [3正48反5 UNKNOWN合成](docs/capabilities/CAP-01-07/dimension-edit-b50-fixtures-v08.json) → [只读Node工具](tools/check_cap0107_dimension_edit_b50_v08.cjs) → [核验等级](tracking/cap0107-dimension-edit-b50-verification-2026-10-31.json)。OCCT OCAF再生与TDataStd_Real维度废弃问题已补证；V8 56/56同函数合成，不等于真实OCCT/Babylon/GUI/Owner验证，独立Node NOT_RUN。正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-31｜B49 CAP-03-07共边祖先与TopoDS同一性
[专项研究](docs/capabilities/CAP-03-07/TOPOLOGICAL-EDGE-ANCESTORS-B49-2026-10-31.md) → [6来源](research/sources/CAP-03-07-edge-ancestors-b49.json) → [8规则/原B0-02/F1-03/F1-04/T5-02](research/traces/CAP-03-07-edge-ancestors-b49-v08.json) → [1正34反5未知](docs/capabilities/CAP-03-07/edge-ancestors-b49-fixtures-v08.json) → [只读Node工具](tools/check_cap0307_edge_ancestors_b49_v08.cjs) → [分级核验](tracking/cap0307-edge-ancestors-b49-verification-2026-10-31.json)。40/40仅V8同判定函数规划合成；独立Node/OCCT/Owner/D05消费者NOT_RUN，正式Owner0/17、L3待审、历史字节与全仓GFM AST未闭。**规划PASS≠产品PASS。**

## 2026-10-31｜B48 CAP-10-03 Windows离线介质路径别名与收方封闭提取
[研究及已读章节](docs/capabilities/CAP-10-03/WINDOWS-PATH-ALIASES-B48-2026-10-31.md) → [6来源](research/sources/CAP-10-03-windows-path-b48.json) → [8规则字段/原E3-06与T5-03](research/traces/CAP-10-03-windows-path-b48-v08.json) → [1正37反5 UNKNOWN合成](docs/capabilities/CAP-10-03/windows-path-b48-fixtures-v08.json) → [Node校验器](tools/check_cap1003_windows_path_b48_v08.cjs) → [证据分级](tracking/cap1003-windows-path-b48-verification-2026-10-31.json)。Windows NUL.txt/LPT²/ADS/大小写碰撞/链接/ZIP自动改名/取消晚回执，V8固定Git Blob同判定器注入执行43/43合成PASS；独立Node进程/真实Windows收方/OEM/17消费者NOT_RUN，Owner正式签署0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B47 CAP-08-05 G83中间退R与0.254mm重进刀
[研究与阅读限制](docs/capabilities/CAP-08-05/PECK-MOTION-B47-2026-10-30.md) → [4来源](research/sources/CAP-08-05-peck-motion-b47.json) → [8规则与原E3-02/03/E3-04/05/U4-04](research/traces/CAP-08-05-peck-motion-b47-v08.json) → [6正37反3未知合成](docs/capabilities/CAP-08-05/peck-motion-b47-fixtures-v08.json) → [只读Node工具](tools/check_cap0805_peck_motion_b47_v08.cjs)。与B30 G81/L重复研究不重复；V8同判定函数46/46合成，独立Node/实际NC/D15/17消费者NOT_RUN，Owner0/17、L3待审。153 Registry/1216来源登记非去重。**规划PASS≠产品PASS。**

## 2026-10-30｜B46 CAP-08-03 G53/WCS与G52/G92跨重启偏置证据
[专项研究](docs/capabilities/CAP-08-03/WCS-OFFSETS-B46-2026-10-30.md) → [5项来源](research/sources/CAP-08-03-wcs-offsets-b46.json) → [8规则/原E3-02/03/04/05与U4-04](research/traces/CAP-08-03-wcs-offsets-b46-v08.json) → [8正、56单字段反、3 UNKNOWN；合计67项V8同函数合成](docs/capabilities/CAP-08-03/wcs-offsets-b46-fixtures-v08.json) → [只读Node工具](tools/check_cap0803_wcs_offsets_b46_v08.cjs)。LinuxCNC2.9官方正文定点实读，NIST仅摘要/RFC仅元数据；独立Node/OEM/D13-D16/17消费者NOT_RUN，Owner0/17，L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B45 CAP-05-06三方DAG与冻结冲突门禁
[研究](docs/capabilities/CAP-05-06/FREEZE-MERGE-B45-2026-10-30.md) → [6来源](research/sources/CAP-05-06-freeze-merge-b45.json) → [10规则/原W2-02/03/05](research/traces/CAP-05-06-freeze-merge-b45-v08.json) → [2正27反4 UNKNOWN](docs/capabilities/CAP-05-06/freeze-merge-b45-fixtures-v08.json) → [只读工具](tools/check_cap0506_freeze_merge_b45_v08.cjs)。同函数33/33规划合成PASS，独立Node/产品/Owner/消费者NOT_RUN；151 Registry/1207登记，L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B44 CAP-07-07中立刀轴与Post机器角隔离
[专项研究](docs/capabilities/CAP-07-07/CL-POST-SEMANTICS-B44-2026-10-30.md) → [6来源](research/sources/CAP-07-07-cl-post-b44.json) → [8规则及F1-03/E3-01/U4-04](research/traces/CAP-07-07-cl-post-b44-v08.json) → [1正44反4未知](docs/capabilities/CAP-07-07/cl-post-b44-fixtures-v08.json) → [Node只读入口](tools/check_cap0707_cl_post_b44_v08.cjs)。同判定函数49/49合成规划通过；真实Post/NC/B5及17消费者NOT_RUN。150 Registry/1201登记，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B43 CAP-08-04 M6配置覆盖、HAL回环与换刀证据
[专项研究](docs/capabilities/CAP-08-04/CHANGEOVER-EVIDENCE-B43-2026-10-30.md) → [6来源](research/sources/CAP-08-04-changeover-b43.json) → [8规则/原E3-02/E3-03/U4-04](research/traces/CAP-08-04-changeover-b43-v08.json) → [1正40反4未知](docs/capabilities/CAP-08-04/changeover-b43-fixtures-v08.json) → [只读Node](tools/check_cap0804_changeover_b43_v08.cjs)。V8同函数45/45合成PASS；真实HAL/OEM/17消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B42 CAP-11-02知识词表、SHACL资格与失效传播
[专项研究](docs/capabilities/CAP-11-02/KNOWLEDGE-CONFORMANCE-B42-2026-10-30.md) → [6来源](research/sources/CAP-11-02-knowledge-conformance-b42.json) → [8规则/原T5-01/T5-02](research/traces/CAP-11-02-knowledge-conformance-b42-v08.json) → [2正40反4未知](docs/capabilities/CAP-11-02/knowledge-conformance-b42-fixtures-v08.json) → [只读Node校验](tools/check_cap1102_knowledge_conformance_b42_v08.cjs)；V8同判定函数46/46合成通过，独立Node/SHACL/Owner/17消费者NOT_RUN；148 Registry/1189登记，正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B41 CAP-09-08重复调用实例、播放Seek与D15覆盖缺口
[专项研究](docs/capabilities/CAP-09-08/REPLAY-INSTANCES-B41-2026-10-30.md) → [6分层来源](research/sources/CAP-09-08-replay-instances-b41.json) → [8规则/字段/原包](research/traces/CAP-09-08-replay-instances-b41-v08.json) → [4正49反3未知](docs/capabilities/CAP-09-08/replay-instances-b41-fixtures-v08.json) → [Node只读工具](tools/check_cap0908_replay_instances_b41_v08.cjs)。同判定函数56/56合成PASS；真实NC/独立Node/D15/17消费者NOT_RUN；147 Registry、1183条来源登记（非去重），正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B40 CAP-10-07现场观察代次、非因果时间窗与D17新变更
[研究补证](docs/capabilities/CAP-10-07/EVENT-PROVENANCE-B40-2026-10-30.md) → [6项分层来源](research/sources/CAP-10-07-event-provenance-b40.json) → [8规则字段/CAP与原包](research/traces/CAP-10-07-event-provenance-b40-v08.json) → [4正69反4未知](docs/capabilities/CAP-10-07/event-provenance-b40-fixtures-v08.json) → [只读Node入口](tools/check_cap1007_event_provenance_b40_v08.cjs)。同函数77/77合成PASS；2.5目录与2.4例子分开，NIST IR8536 Final仅摘要；独立Node/MTConnect/D17消费者NOT_RUN。累计146 Registry、1177条登记（非去重），正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B39 原U4-05 Escape、IME和指针捕获与GUI焦点守门
[专项研究](docs/work-packages/U4-05/ESC-FOCUS-B39-2026-10-30.md) → [7来源](research/sources/U4-05-esc-focus-b39.json) → [8规则/字段/原编号包](research/traces/U4-05-esc-focus-b39-v08.json) → [7正53反4未知](docs/work-packages/U4-05/esc-focus-b39-fixtures-v08.json) → [只读Node工具](tools/check_u405_esc_focus_b39_v08.cjs)。WCAG2.2与PointerEvents3官方正式正文定点阅读，APG模式、MDN isComposing兼容限制；V8同函数64/64合成，独立Node/浏览器/Owner/17消费者NOT_RUN。研究登记145 Registry/1171条（非去重），L3待审。**规划PASS≠产品PASS。**

## 2026-10-30｜B38 CAP-10-02离线CRL、TSA与签发资格隔离
[专项研究](docs/capabilities/CAP-10-02/OFFLINE-REVOCATION-B38-2026-10-30.md) → [5合法来源](research/sources/CAP-10-02-offline-revocation-b38.json) → [8规则字段/原包](research/traces/CAP-10-02-offline-revocation-b38-v08.json) → [1正55反4未知](docs/capabilities/CAP-10-02/offline-revocation-b38-fixtures-v08.json) → [Node只读工具](tools/check_cap1002_offline_revocation_b38_v08.cjs)。同函数60合成PASS，独立Node/实际PKI/TSA/D15/17消费者NOT_RUN；144 Registry/1164登记，正式Owner0/17，L3待人审。**规划PASS≠产品PASS。**

## 2026-10-30｜B37 CAP-08-03进给模态G93/G94/G95与D14物理时间隔离
[专题研究](docs/capabilities/CAP-08-03/FEED-MODES-B37-2026-10-30.md) → [5项合法来源](research/sources/CAP-08-03-feed-modes-b37.json) → [8规则/字段/原包](research/traces/CAP-08-03-feed-modes-b37-v08.json) → [4正39反1未知](docs/capabilities/CAP-08-03/feed-modes-b37-fixtures-v08.json) → [只读Node](tools/check_cap0803_feed_modes_b37_v08.cjs)。LinuxCNC2.9公开§59与Overview§23–25定点实读、NIST仅摘要；V8同函数44/44合成，独立Node/真实NC/D14/D15/17消费者NOT_RUN。修正source-index历史汇总滞后，现143份Registry/1159条登记（非去重）。Owner0/17，L3待人审，**规划PASS≠产品PASS**。

## 2026-10-30｜B36 CAP-02-04夹具开口能力与实际观测隔离
[研究](docs/capabilities/CAP-02-04/WORKHOLDING-B36-2026-10-30.md) → [5来源](research/sources/CAP-02-04-workholding-b36.json) → [8规则/原包](research/traces/CAP-02-04-workholding-b36-v08.json) → [2正48反1未知](docs/capabilities/CAP-02-04/workholding-b36-fixtures-v08.json) → [只读Node校验](tools/check_cap0204_workholding_b36_v08.cjs)。V8同函数51/51合成，真实Node/OPC/NC/夹具/消费者NOT_RUN，Owner0/17，L3待审。规划PASS≠产品PASS。

## 2026-10-30｜B35 CAP-05-05候选Pareto与局部接管资格
[专项研究](docs/capabilities/CAP-05-05/PARETO-ADOPTION-B35-2026-10-30.md) → [5来源](research/sources/CAP-05-05-pareto-adoption-b35.json) → [7规则](research/traces/CAP-05-05-pareto-adoption-b35-v08.json) → [2正3未知45反](docs/capabilities/CAP-05-05/pareto-adoption-b35-fixtures-v08.json) → [只读校验](tools/check_cap0505_pareto_adoption_b35_v08.cjs)。OR-Tools OPTIMAL受模型/gap限制，非支配判断必须锁定单位与约束；V8同函数50/50合成PASS，Node文件/产品/真实消费者NOT_RUN，Owner0/17、L3待人审。规划PASS≠产品PASS。

## 2026-10-30｜B34 CAP-07-04 五轴姿态与实际关节连续性边界
[研究补证](docs/capabilities/CAP-07-04/ORIENTATION-IK-B34-2026-10-30.md) → [5来源](research/sources/CAP-07-04-orientation-ik-b34.json) → [8规则](research/traces/CAP-07-04-orientation-ik-b34-v08.json) → [2正1未知41反](docs/capabilities/CAP-07-04/orientation-ik-b34-fixtures-v08.json) → [校验工具](tools/check_cap0704_orientation_ik_b34_v08.cjs) → [执行等级](tracking/cap0704-orientation-ik-b34-verification-2026-10-30.json)。q/-q角差0°，+179°/-179°模角最短2°，均不证明D14真实Joint轨迹；V8同函数44/44规划合成，真实产品/独立Node/17消费者NOT_RUN，Owner0/17、L3待审。规划PASS≠产品PASS。

## 2026-10-30｜B33 CAP-09-07连续干涉区间证据与解析穿透反例
[专项补证](docs/capabilities/CAP-09-07/CCD-INTERVAL-B33-2026-10-30.md) → [5来源](research/sources/CAP-09-07-ccd-interval-b33.json) → [8条规则与字段](research/traces/CAP-09-07-ccd-interval-b33-v08.json) → [2正30反1D合成](docs/capabilities/CAP-09-07/ccd-interval-b33-fixtures-v08.json) → [只读Node](tools/check_cap0907_ccd_interval_b33_v08.cjs)。固定FCL Git commit官方README与OCCT8.0.1/MoveIt/Rapier公开正文分级；V8同函数32/32 PASS，真实Node文件/FCL/OCCT/B5/D15消费者NOT_RUN。正式Owner0/17，L3待审，**规划PASS≠产品PASS**。

## 2026-10-30｜B32 CAP-02-03量规/伸出/安装TCP与D10控制器H跨域隔离
[研究与阅读限制](docs/capabilities/CAP-02-03/GAUGE-OFFSET-B32-2026-10-30.md) → [6来源](research/sources/CAP-02-03-gauge-offset-b32.json) → [8规则](research/traces/CAP-02-03-gauge-offset-b32-v08.json) → [2正56反](docs/capabilities/CAP-02-03/gauge-offset-b32-fixtures-v08.json) → [只读Node](tools/check_cap0203_gauge_offset_b32_v08.cjs)。名义100mm不等于D10实测H、D13必须锁OEM版；V8同函数58/58合成，独立Node/OEM/实际消费者NOT_RUN，L3/Owner待审。累计138 Registry/1134登记。**规划PASS≠产品PASS。**

## 2026-10-30｜B31 CAP-03-05装配实例Face重绑证据
[专项补证及阅读限制](docs/capabilities/CAP-03-05/ASSEMBLY-FACE-B31-2026-10-30.md) → [6来源](research/sources/CAP-03-05-assembly-face-b31.json) → [8规则](research/traces/CAP-03-05-assembly-face-b31-v08.json) → [4正50反](docs/capabilities/CAP-03-05/assembly-face-b31-fixtures-v08.json) → [只读Node](tools/check_cap0305_assembly_face_b31_v08.cjs)。定义复用≠同一个制造特征实例；FaceIndex不跨Revision稳定；Split/无历史不自动采纳。V8同函数54/54合成，独立Node/OCCT/D02-D05消费者NOT_RUN，L3/17 Owner待审。累计137 Registry/1128登记。**规划PASS≠产品PASS。**

## 2026-10-30｜B30 原E3-03 G81循环G98/G99退刀与L重复
[研究](docs/work-packages/E3-03/CANNED-RETRACT-B30-2026-10-30.md) → [5项来源](research/sources/E3-03-canned-retract-b30.json) → [8规则及字段](research/traces/E3-03-canned-retract-b30-v08.json) → [7正47反1未知](docs/work-packages/E3-03/canned-retract-b30-fixtures-v08.json) → [只读Node](tools/check_e303_canned_retract_b30_v08.cjs)。LinuxCNC2.9限定语义，V8同函数合成55/55通过；实际Node进程、NC/Owner/L3仍未通过。**规划PASS≠产品PASS。**

## 2026-10-30｜B29 CAP-11-04 MCP2026版本漂移/工具目录隔离与MRTR
[专项研究与阅读限制](docs/capabilities/CAP-11-04/MCP-VERSION-CACHE-B29-2026-10-30.md) → [6来源](research/sources/CAP-11-04-mcp-version-cache-b29.json) → [8规则/字段/原T5-01/T5-02](research/traces/CAP-11-04-mcp-version-cache-b29-v08.json) → [3正45反合成](docs/capabilities/CAP-11-04/mcp-version-cache-b29-fixtures-v08.json) → [只读Node工具](tools/check_cap1104_mcp_version_cache_b29_v08.cjs)。当前MCP官方版2026-07-28，2025-11-25为旧协议；本轮V8同函数48/48合成PASS，独立Node/SDK/业务Owner/17消费者NOT_RUN，正式Owner0/17、L3待审。规划PASS≠产品PASS。

## 2026-10-30｜B28 原E3-03圆弧模态/半径病态专项
[研究](docs/work-packages/E3-03/ARC-MODAL-B28-2026-10-30.md) → [4来源](research/sources/E3-03-arc-modal-b28.json) → [8规则](research/traces/E3-03-arc-modal-b28-v08.json) → [5正16反合成](docs/work-packages/E3-03/arc-modal-b28-fixtures-v08.json) → [只读Node校验](tools/check_e303_arc_modal_b28_v08.cjs)。中心G90.1/G91.1不能混同轴G90/G91；R近半圆未知不得升格，实际NC/消费者NOT_RUN、Owner/L3待签。规划PASS≠产品PASS。

## 2026-10-30｜B27 CAP-06-07 独立Oracle的OCCT选项与零距离陷阱
[公开API与NIST摘要/内生设计边界](docs/capabilities/CAP-06-07/ORACLE-OPTIONS-B27-2026-10-30.md) → [6来源](research/sources/CAP-06-07-oracle-options-b27.json) → [8规则/字段/原F1-05/W2-02/03/06包](research/traces/CAP-06-07-oracle-options-b27-v08.json) → [2正37反+2 AABB](docs/capabilities/CAP-06-07/oracle-options-b27-fixtures-v08.json) → [只读Node](tools/check_cap0607_oracle_options_b27_v08.cjs)。V8同函数合成41/41通过；独立Node文件进程/OCCT/NC/B5/17实际消费者NOT_RUN、Owner0/17、L3待审。规划PASS≠产品PASS。

## 2026-10-30｜B26 CAP-06-06 Worker取消与不确定预算结算
[专项研究](docs/capabilities/CAP-06-06/WORKER-LEASE-B26-2026-10-30.md) → [5来源](research/sources/CAP-06-06-worker-lease-b26.json) → [8规则/字段/原包](research/traces/CAP-06-06-worker-lease-b26-v08.json) → [2正31反](docs/capabilities/CAP-06-06/worker-lease-b26-fixtures-v08.json) → [只读Node](tools/check_cap0606_worker_lease_b26_v08.cjs) → [执行等级](tracking/cap0606-worker-lease-b26-verification-2026-10-30.json)。失联held不释放、重复SHA回执不重复计费、取消晚ACK不得提交；V8同函数合成33/33 PASS；独立Node/OCCT/消费者/NC/B5/OEM NOT_RUN、Owner0/17、L3待审，规划PASS≠产品PASS。

## 2026-10-30｜B25 CAP-06-05原始BRep字节/状态双哈希
[研究](docs/capabilities/CAP-06-05/SEAL-HASH-B25-2026-10-30.md) → [5来源](research/sources/CAP-06-05-seal-hash-b25.json) → [7规则/原包](research/traces/CAP-06-05-seal-hash-b25-v08.json) → [1正47反](docs/capabilities/CAP-06-05/seal-hash-b25-fixtures-v08.json) · [Node只读工具](tools/check_cap0605_seal_hash_b25_v08.cjs)。同函数V8合成通过，独立Node文件/真实OCCT/消费者/NC NOT_RUN，Owner0/17、L3待审，规划PASS≠产品PASS。

## 2026-10-30｜B24 CAP-06-04余料/Glue前提补证
[研究](docs/capabilities/CAP-06-04/RESIDUAL-GLUE-B24-2026-10-30.md) → [来源](research/sources/CAP-06-04-residual-glue-b24.json) → [7规则与原包](research/traces/CAP-06-04-residual-glue-b24-v08.json) → [2正30反](docs/capabilities/CAP-06-04/residual-glue-b24-fixtures-v08.json) → [只读Node](tools/check_cap0604_residual_glue_b24_v08.cjs)。保护区不碰不代表终态完工；Glue必须有真实几何重合证据。仅V8同函数合成通过，Node/OCCT/D07/NC及17消费者NOT_RUN、Owner0/17、L3待审。规划PASS≠产品PASS。

## 2026-10-29｜B23 CAP-06-03 OCCT布尔历史/简化与独立D07资格
[研究及阅读深度](docs/capabilities/CAP-06-03/BREP-HISTORY-B23-2026-10-29.md) → [7份来源](research/sources/CAP-06-03-brep-history-b23.json) → [7条规则/原编号包](research/traces/CAP-06-03-brep-history-b23-v08.json) → [1正40反](docs/capabilities/CAP-06-03/brep-history-b23-fixtures-v08.json) → [只读Node](tools/check_cap0603_brep_history_b23_v08.cjs)。Generated为空不能断言Solid无变化，Deleted/Modified不混淆，SimplifyResult必须融合最终历史；V8同函数合成PASS，独立Node/真实OCCT/D07消费者NOT_RUN；Owner0/17、L3待审，规划PASS≠产品PASS。

## 2026-10-29｜B22 CAP-03-04 PMI解析损失账本
[专项研究与阅读限制](docs/capabilities/CAP-03-04/PMI-LOSS-LEDGER-B22-2026-10-29.md) → [5份来源登记](research/sources/CAP-03-04-pmi-loss-b22.json) → [8规则及原包](research/traces/CAP-03-04-pmi-loss-b22-v08.json) → [1正29反合成](docs/capabilities/CAP-03-04/pmi-loss-b22-fixtures-v08.json) · [只读Node](tools/check_cap0304_pmi_loss_b22_v08.cjs)。V8同函数30/30合成，独立Node/STEP/OCCT/17消费者NOT_RUN、L3待审，规划PASS≠产品PASS。

## 2026-10-29｜B21 CAP-04-03单侧接触的秩满不等于一阶形闭合
[来源与合成反例](docs/capabilities/CAP-04-03/UNILATERAL-CONTACT-B21-2026-10-29.md) → [6来源7规则字段/原包](research/traces/CAP-04-03-unilateral-b21-v08.json) → [2正29反](docs/capabilities/CAP-04-03/unilateral-b21-fixtures-v08.json) · [只读Node](tools/check_cap0403_unilateral_b21_v08.cjs)。3-2-1原六接触rank=6，但x/z两条非零Twist满足单侧不穿透，不能认证一阶形闭合、摩擦力闭合或实机稳定；V8同源码函数31/31合成通过，独立Node、真实夹紧/OCCT/NC/消费者NOT_RUN，正式Owner0/17，L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B20 CAP-04-02点集退化、刚体镜像/缩放与测量资格补证
[专项研究与公开来源边界](docs/capabilities/CAP-04-02/ROBUST-REGISTRATION-B20-2026-10-29.md) → [6项公开来源+1项内生规格、9规则/字段/原包](research/traces/CAP-04-02-robust-b20-v08.json) → [4正35反独立合成](docs/capabilities/CAP-04-02/robust-b20-fixtures-v08.json) → [只读Node工具](tools/check_cap0402_robust_b20_v08.cjs)。V8同函数合成39/39，独立Node真实仓库、OCCT/ICP/测量/产品NOT_RUN，L3/17 Owner待审；规划PASS≠产品PASS。

## 2026-10-29｜B19 CAP-01-07 GPU上下文失效、恢复后拾取/回执证据补证
[工程与来源](docs/capabilities/CAP-01-07/WEBGL-RECOVERY-B19-2026-10-29.md) → [8规则/4公开来源/字段/原包](research/traces/CAP-01-07-webgl-recovery-b19-v08.json) → [1正26独立单字段反例](docs/capabilities/CAP-01-07/webgl-recovery-b19-fixtures-v08.json) · [只读Node校验器](tools/check_cap0107_webgl_recovery_b19_v08.cjs)。本轮V8同函数合成27/27；独立Node和浏览器/Babylon真实恢复NOT_RUN，Owner/消费者0/17、L3待审，完整AST未闭。**规划PASS≠产品PASS。**

## 2026-10-29｜B18 Git符号链接/gitlink目标不得被Markdown链接误判PASS
[官方Git Trees对象模式与研究补证](docs/architecture/v0.8/第十八轮Git链接对象模式与保守审计_2026-10-29.md) → [5规则→字段/CAP/原包/案例](research/traces/FINAL-MD-B18-GITMODE-V08.json) → [13独立合成](docs/architecture/v0.8/final-md-b18-gitmode-fixtures-v08.json) · [只读Python封装](tools/check_final_md_b18_gitmode_v08.py) · [执行等级记录](tracking/final-md-b18-verification-2026-10-29.json)。当前固定HEAD无120000/160000模式；本地脚本13/13合成、合成Git库真实mode三例PASS，**Procet完整仓库AST与产品NOT_RUN**。Owner/消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B17 17资产44边候选Owner与独立消费者机器准入（非真实会签）
[17资产交接来源/限界](docs/architecture/v0.8/第十七轮17资产44关系边准入与撤权回执交接_2026-10-29.md) → [8规则映射](research/traces/FINAL-ASSET-B17-EDGE-HANDOFF-V08.json) → [1正39反合成门禁](docs/architecture/v0.8/final-asset-b17-edge-fixtures-v08.json) · [只读Node](tools/check_final_asset_b17_edge_v08.cjs) · [证据等级](tracking/final-asset-b17-verification-2026-10-29.json)。远端原文件17资产/44互惠边/17候选Owner Port结构一致；同源码V8执行1正39反；独立Node、签署与产品NOT_RUN，Owner和消费者0/17，L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B16 Markdown AST/跨文件锚点可执行初审（非全仓PASS）
[官方GFM/RFC/GitHub章节及本地运行边界](docs/architecture/v0.8/第十六轮GFM-AST链接与锚点初审_2026-10-29.md) → [6项来源6规则/字段/CAP/包](research/traces/FINAL-MARKDOWN-B16-AST-V08.json) → [18项独立合成+2惰性代码](docs/architecture/v0.8/final-markdown-b16-ast-fixtures-v08.json) · [只读Python AST工具](tools/check_final_md_b16_ast_v08.py) · [核验记录](tracking/final-md-b16-verification-2026-10-29.json)。发现GitHub仓根`/`路径与`a name`锚点需特殊处理；本地18/18合成通过，exact HEAD Tree为1629项/543 Markdown；完整checkout/全仓AST NOT_RUN，Owner/消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B15 修复B14 Git Commit/Tree SHA身份混淆
[现场核验与范围](docs/architecture/v0.8/第十五轮Git提交与Tree身份勘误_2026-10-29.md) → [来源→5规则/字段/CAP/原包](research/traces/FINAL-MARKDOWN-B15-TREE-V08.json) → [1正16反机器设计](docs/architecture/v0.8/final-markdown-b15-tree-fixtures-v08.json) · [只读Node](tools/check_final_md_b15_tree_v08.cjs)。原B14字段将commit SHA误填为Tree SHA，已依据GitHub原生commit/tree对象修正；固定541 Markdown路径身份不变，GFM AST/独立Node全仓及产品NOT_RUN，Owner与消费者0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B12 D15区间保守界/端点采样漏碰撞补证
[专项规格](docs/work-packages/E3-05/D15-INTERVAL-B12-2026-10-29.md) → [6规则/官方来源/字段与CAP原包](research/traces/E3-05-d15-interval-b12-v08.json) → [正反合成及中点碰撞反例](docs/work-packages/E3-05/d15-interval-b12-fixtures-v08.json) · [只读Node校验器](tools/check_e305_d15_interval_b12_v08.cjs) · [验证记录](tracking/e305-d15-interval-b12-verification-2026-10-29.json)。仅合成保守区间资格，不是连续安全认证；D16/产品NOT_RUN、正式Owner0/17，L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B11 E3-04 D14轴时序与编程轴/Joint映射的证据资格
[增量规格及ISO841/LinuxCNC 2.9实读范围](docs/work-packages/E3-04/D14-TIMING-B11-2026-10-29.md) → [7条来源/规则/字段/CAP/原包](research/traces/E3-04-d14-timing-b11-v08.json) → [1正、34独立单字段反例、6算术样例](docs/work-packages/E3-04/d14-timing-b11-fixtures-v08.json) · [只读Node](tools/check_e304_d14_timing_b11_v08.cjs) · [执行等级记录](tracking/e304-d14-timing-b11-verification-2026-10-29.json)。G93/G94/G95名义时间与实机节拍隔离；AXIS不凭名称等同物理Joint，G64路径混合不得冒充连续安全证书。V8合成41/41，独立Node、NC/B5/OEM/17消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-29｜B10 D13模态状态、刀长装载与D14/D15资格补证
[CAP-09-07/E3-04专题补证](docs/capabilities/CAP-09-07/D13-MODAL-B10-2026-10-29.md) → [6条来源/字段/规则追踪](research/traces/CAP-09-07-d13-modal-b10-v08.json) → [28项正反合成](docs/capabilities/CAP-09-07/d13-modal-b10-fixtures-v08.json) · [只读Node](tools/check_cap0907_d13_modal_b10_v08.cjs) · [验证记录](tracking/cap0907-d13-modal-b10-verification-2026-10-29.json)。最终NC及D13解释上下文不全时D14/D15/D16阻断；V8合成28/28，独立Node/真实NC/B5/OEM/17消费者NOT_RUN，Owner0/17，L3待人审。**规划PASS≠产品PASS。**

## 2026-10-29｜第七轮终核：B0-04真实缺失子任务与工作包SHA/链接补证
[36份原Blob/SHA及130个单行链接](research/audits/FINAL-HISTORY-LINK-B07-2026-10-29.json) → [新编B0-04十项机器子任务](docs/work-packages/B0-04/subtasks.json) → [六条来源/规则/字段/CAP/原包追踪](research/traces/FINAL-HISTORY-LINK-B07-V08.json) → [25项规划正反合成设计](docs/architecture/v0.8/final-history-link-b07-fixtures-v08.json) · [只读Node校验器](tools/check_final_history_link_b07_v08.cjs) · [研究/历史原件限制](docs/architecture/v0.8/第七轮B0-04缺失子任务与链接补证_2026-10-29.md)。本轮发现B0-04的`subtasks.json`真实缺失，依现有S01—S10表格**NEWLY_AUTHORED**补齐引用，非历史字节恢复；四批同一基线逐SHA路径232/534、尚有302，非GFM AST/全仓PASS。Node独立进程、真实产品和17消费者NOT_RUN，Owner0/17、L3待人类。**规划PASS≠产品PASS。**

## 2026-10-29｜第六轮终核：AI/早期规格Markdown路径解码与SHA链
[50份逐原Blob/SHA、403行内链接、1条%20误报修正](research/audits/FINAL-HISTORY-LINK-B06-2026-10-29.json) → [6规则](research/traces/FINAL-HISTORY-LINK-B06-V08.json) → [20项V8正反及8 URI、4设计门禁](docs/architecture/v0.8/final-history-link-b06-fixtures-v08.json) · [只读Node](tools/check_final_history_link_b06_v08.cjs) · [研究边界](docs/architecture/v0.8/第六轮AI与历史规格链接审计_2026-10-29.md)。当前HEAD旧B05索引移动已避重，B04+B05+B06在基线533份中**196份逐SHA清单**，其余337；尚非全仓AST或产品PASS，Node/NC/B5/17消费者NOT_RUN，17 Owner、L3待人审。

## 2026-10-29｜跨域终核第五轮：50份NC/发布领域Markdown路径SHA及执行语义补证
[50份逐文件Git SHA/283行内相对链接](research/audits/FINAL-HISTORY-LINK-B05-2026-10-29.json) → [六条领域/审计研究规则](research/traces/FINAL-HISTORY-LINK-B05-V08.json) → [18项合成正反、五项待运行状态门禁](docs/architecture/v0.8/final-history-link-b05-fixtures-v08.json) · [独立Node只读校验器](tools/check_final_history_link_b05_v08.cjs) · [中文审计/来源局限](docs/architecture/v0.8/第五轮NC与发布证据链接审计_2026-10-29.md)。旧B04 96路径SHA在同HEAD保持不变，跨批显式146份；仅启发式行内链接，非全仓/AST/产品PASS。17 Owner和17消费者0/17、L3待审、独立Node/NC/OCCT/B5 NOT_RUN。

## 2026-10-29｜跨域终核第三轮：150份Markdown原Blob读取与历史原字节边界
[150/530份Markdown样本、1273相对目的地与原历史附件缺口](research/audits/FINAL-HISTORY-LINK-B03-2026-10-29.json) → [6条研究/工程规则](research/traces/FINAL-HISTORY-LINK-B03-V08.json) → [17项合成正反门禁](docs/architecture/v0.8/final-history-link-b03-fixtures-v08.json) · [只读校验器](tools/check_final_history_link_b03_v08.cjs) · [中文审查及局限](docs/architecture/v0.8/最终附件原字节与链接闭环第三轮_2026-10-29.md)。**仅150份已读、余380未读，正则不是CommonMark AST，故全仓仍NOT_RUN**；三份有路径旧JSON确证缺失、另两类旧原件未定位，不假称恢复。Owner/消费者0，L3待审，产品NOT_RUN。

## 2026-10-29｜跨域终核首轮：88 CAP/36原包/17候选Owner/127 Registry精确路径审查
[静态Git Tree覆盖与来源版本审计](research/audits/FINAL-CROSS-COVERAGE-B01-2026-10-29.json) → [6条研究规则](research/traces/FINAL-CROSS-COVERAGE-B01-V08.json) → [6正10独立反例](docs/architecture/v0.8/final-cross-coverage-b01-fixtures-v08.json) · [审查报告](docs/architecture/v0.8/跨域终核首轮与证据升级_2026-10-29.md) · [Node只读工具](tools/check_final_cross_coverage_b01_v08.cjs)。首轮选定结构路径0缺失；旧首轮矩阵四项同名来源缺口在新索引已闭合；111/1075外部登记定点重访非全文，528份Markdown全仓链接与真实Node仍NOT_RUN；17正式Owner/消费者0，历史原字节及终风险交接未闭。**规划PASS≠产品PASS。**

## 2026-10-29｜Registry第十三批最后7份，来源结构覆盖127/127
[55登记及原/补充Trace关联](research/audits/REGISTRY-AUDIT-B13-2026-10-29.json) → [4跨资源规则](research/traces/REGISTRY-AUDIT-B13-CROSSRESOURCE-V08.json) → [35规划正反与门禁](docs/architecture/v0.8/registry-audit-b13-fixtures-v08.json) · [中文研究](docs/architecture/v0.8/研究注册第十三批证据审计_2026-10-29.md) · [Node只读](tools/check_registry_audit_b13_v08.cjs)。**127/127 Registry、1075/1075登记结构已审计**，外部定点重访仅111登记（非去重）；Node/产品/消费者NOT_RUN，17 Owner签署0、L3待审。原始附件、全仓链接及最终风险/交接未完成。规划PASS≠产品PASS。

## 2026-10-28｜第十二批Registry 111—120：ISO230-1与NIST解释器证据边界
[10份87条原Blob/Trace及7外页](research/audits/REGISTRY-AUDIT-B12-2026-10-28.json) → [CAP-04-06缺2来源/3增量规则](research/traces/CAP-04-06-b12-evidence-supplement-v08.json) → [35规划正反与门禁](docs/architecture/v0.8/registry-audit-b12-fixtures-v08.json) · [研究/交接](docs/architecture/v0.8/研究注册第十二批证据审计_2026-10-28.md) · [只读Node](tools/check_registry_audit_b12_v08.cjs)。累计**120/127 Registry、1020/1075登记**（非去重论文）；原Trace85/87补缺2。ISO只读目录、NIST只读出版摘要且日期分离；V8内存35/35，独立Node/产品/消费者NOT_RUN，Owner0/17、L3待审。规划PASS≠产品PASS。

## 2026-10-28｜第十一批Registry 101—110：工单偏序、TUF版本和RAG引用权限
[90条原源ID和8外页复核](research/audits/REGISTRY-AUDIT-B11-2026-10-28.json) → [4条跨域规则](research/traces/REGISTRY-AUDIT-B11-CROSSDOMAIN-V08.json) → [58规划正反门禁](docs/architecture/v0.8/registry-audit-b11-fixtures-v08.json) · [研究解释](docs/architecture/v0.8/研究注册第十一批证据审计_2026-10-28.md) · [只读Node](tools/check_registry_audit_b11_v08.cjs)。原同名Trace **90/90** 覆盖，累计**110/127 Registry与933/1075条来源登记**（不去重论文）。TUF latest1.0.37与固定1.0.36分离，JobOrder/报警ACK≠真实机床运行，RAG引用≠NC执行权；规划58/58内存断言，独立Node/产品/消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-28｜第十批Registry与ISO10791-1范围补证：100/127份、843/1075条
[原Blob/89登记与8项公开页](research/audits/REGISTRY-AUDIT-B10-2026-10-28.json) → [三规则补证](research/traces/CAP-09-07-iso10791-scope-supplement-v08.json) → [3正35独立反8门禁](docs/architecture/v0.8/registry-audit-b10-fixtures-v08.json) · [研究交接](docs/architecture/v0.8/研究注册第十批证据审计_2026-10-28.md) · [只读校验器](tools/check_registry_audit_b10_v08.cjs)。原Trace88/89、唯一C0907-S02增量补齐；ISO官网仅摘要，B5与角度头不得冒称已认证。V8内存46/46；Node/NC/机床/消费者NOT_RUN，Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-28｜第九批Registry原Trace缺口与NC工具表加载态：90/127份、754/1075条

[10份原Blob/84登记及7外部公开页](research/audits/REGISTRY-AUDIT-B09-2026-10-28.json) → [唯一缺口C086-S7三规则补证](research/traces/CAP-08-06-tooltable-loaded-state-supplement-v08.json) → [3正/30独立反/8门禁](docs/architecture/v0.8/registry-audit-b09-fixtures-v08.json) · [研究结论与交接](docs/architecture/v0.8/研究注册第九批证据审计_2026-10-28.md) · [Node只读校验器](tools/check_registry_audit_b09_v08.cjs)。原同名Trace83/84+补证1，不改原312条直接关系。规划V8内存断言41/41，独立Node文件进程、真实NC/B5/17消费者NOT_RUN；正式Owner0/17、L3待审。**规划PASS≠产品PASS。**

## 2026-10-28｜第八批Registry及T5-05独立消费者研究：80/127份、670/1075条
[原Blob/同名Trace 94/94与9合法公开页](research/audits/REGISTRY-AUDIT-B08-2026-10-28.json) → [T5-05三规则/字段/CAP候选与原包](research/traces/T5-05-independent-consumer-supplement-v08.json) → [36个正反/门禁案例](docs/architecture/v0.8/registry-audit-b08-fixtures-v08.json) · [研究与风险交接](docs/architecture/v0.8/研究注册第八批证据审计_2026-10-28.md) · [只读Node工具](tools/check_registry_audit_b08_v08.cjs)。原Trace 94/94结构显式不代表外部原文全核；V8规划内存合成36/36，独立Node/真实产品、Owner与L3未通过。规划PASS≠产品PASS。

## 2026-10-28｜第七批Registry原Blob审计：70/127份、576/1075条
[第61—70份91来源及10条外部官方公开页](research/audits/REGISTRY-AUDIT-B07-2026-10-28.json) → [U4-02原WCAG证据补证](research/traces/U4-02-accessibility-supplement-v08.json) → [34项规划正反/门禁合成](docs/architecture/v0.8/registry-audit-b07-fixtures-v08.json) · [研究结论](docs/architecture/v0.8/研究注册第七批证据审计_2026-10-28.md) · [只读Node校验器](tools/check_registry_audit_b07_v08.cjs)。原同名Trace90/91显式，补余下1条，历史字节/312映射不变。**内存规划断言通过≠Node进程执行≠产品通过**；Owner会签0/17、L3待审，旧原始附件/全仓链接与最终交接未闭合。规划PASS≠产品PASS。

## 2026-10-28｜第六批Registry跨Trace审计：60/127份、485/1075条
[92登记原Blob/同名Trace显式引用](research/audits/REGISTRY-AUDIT-B06-2026-10-28.json) → [U4-01 WCAG增量证据](research/traces/U4-01-accessibility-supplement-v08.json) → [29项可机检规划案例](docs/architecture/v0.8/registry-audit-b06-fixtures-v08.json) · [报告](docs/architecture/v0.8/研究注册第六批证据审计_2026-10-28.md)。原91/92显式，补第92条。Node与真实产品NOT_RUN、Owner/L3待审。规划PASS≠产品PASS。

## 2026-10-28｜第五批Registry证据审计：累计50/127份、393/1075条
[研究结论](docs/architecture/v0.8/研究注册第五批证据审计_2026-10-28.md) · [10份原Blob/10外部源/10规则/142规划案例](research/audits/REGISTRY-AUDIT-B05-2026-10-28.json) · [只读Node校验器](tools/check_registry_audit_b05_v08.cjs)。本批84条未内联rules待跨Trace；独立Node及产品/消费者NOT_RUN，Owner/L3待审。规划PASS≠产品PASS。

## 2026-10-28｜Registry第四批原Blob与工程研究：累计40/127份、309/1075条
[第四批审计结论](docs/architecture/v0.8/研究注册第四批证据审计_2026-10-28.md) · [十份原Blob/十条外页定点实读](research/audits/REGISTRY-AUDIT-B04-2026-10-28.json) → [10规则与字段/CAP/原包](research/traces/REGISTRY-AUDIT-B04-V08.json) → [148规划正反/门禁案例](docs/architecture/v0.8/registry-audit-b04-fixtures-v08.json)。本批52条无内联rules须逐项查跨Trace，不等于无研究；真实Node/产品/消费者NOT_RUN，Owner与L3待审。规划PASS≠产品PASS。

## 2026-10-28｜Registry第三批研究原字节审计：累计30/127份、225/1075条
[第三批证据、字段与失效风险](docs/architecture/v0.8/研究注册第三批证据审计_2026-10-28.md) · [10份原Blob与10条公开资料复核](research/audits/REGISTRY-AUDIT-B03-2026-10-28.json) → [10工程规则及字段/CAP/原包](research/traces/REGISTRY-AUDIT-B03-V08.json) → [118正反/门禁案例](docs/architecture/v0.8/registry-audit-b03-fixtures-v08.json)。本批71条中22条无内联rules，须跨Trace核对；Node、产品与独立消费者NOT_RUN，Owner与L3待审。规划PASS≠产品PASS。

## 2026-10-28｜127份Registry第二批证据审计：累计20份154条
[第二批研究结论及风险](docs/architecture/v0.8/研究注册第二批证据审计_2026-10-28.md) · [10份原Blob及10官方HTML证据](research/audits/REGISTRY-AUDIT-B02-2026-10-28.json) → [10规则/字段/CAP/原工作包](research/traces/REGISTRY-AUDIT-B02-V08.json) → [10正90反8门禁](docs/architecture/v0.8/registry-audit-b02-fixtures-v08.json)。累计20/127 Registry、154/1075登记结构审计；16项官方外页当轮重核；V8等价108/108，Node/NC/B5/消费者NOT_RUN，Owner和L3待审。规划PASS≠产品PASS。

## 2026-10-28｜127份Registry第一批证据审计（10份、117登记）
[逐文件Git Blob/字段缺口与6项官方重核](docs/architecture/v0.8/研究注册第一批证据审计_2026-10-28.md) · [审计明细](research/audits/REGISTRY-AUDIT-B01-2026-10-28.json) → [6规则及CAP/原包](research/traces/REGISTRY-AUDIT-B01-V08.json) → [54独立正反合成案例](docs/architecture/v0.8/registry-audit-b01-fixtures-v08.json) · [进度](tracking/registry-audit-progress-v08.json)。127 Registry/1075登记基数不变；10份117条仅结构/原Blob核验，6份官方网页重查，34条缺内联规则仅列审计问题，不冒称跨Trace缺失；独立Node/产品/消费者NOT_RUN，L3待审。规划PASS≠产品PASS。

## 2026-10-28｜原10项工作包零CAP直接边候选消歧
[逐包职责与独立Golden交接](docs/architecture/v0.8/10工作包零直接边候选映射_2026-10-28.md) · [5份公开来源](research/sources/ZERO-EDGE-WORKPACKAGES-V08.json) → [6规则](research/traces/ZERO-EDGE-WORKPACKAGES-V08.json) → [10包候选关系](docs/architecture/v0.8/zero-edge-workpackage-review-v08.json) → [62正反合成](docs/architecture/v0.8/zero-edge-workpackage-fixtures-v08.json)。原312边和10零边不动；1075登记/127 Registry（非去重），V8等价62/62，Node/产品/消费者NOT_RUN；Owner与L3待审。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-08《资源能力与兼容性》研究补证
[10份公开来源与阅读深度](research/sources/CAP-02-08.json) → [12规则48字段及原工作包](research/traces/CAP-02-08-v08-supplement.json) → [12正48独立负8数学](docs/capabilities/CAP-02-08/research-fixtures-v08.json) → [证据边界/独立消费者](docs/capabilities/CAP-02-08/RESEARCH-TRACE-2026-10-28.md)。原RC与RC-T01..20、旧references字节保留；累计**1070登记/126 Registry（非去重）**，02域同名研究来源补证齐全但未逐份终核。V8规划合成**68/68**，独立Node、真实NC/三轴/B5/17消费者NOT_RUN，Owner会签0/17、L3待审；历史附件、10包映射/全仓链接和最终风险交接未闭合。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-07资源几何与参数化研究补证
[8项官方/论文登记](research/sources/CAP-02-07.json) → [10规则40字段](research/traces/CAP-02-07-v08-supplement.json) → [55正反与算术合成](docs/capabilities/CAP-02-07/research-fixtures-v08.json) → [研究/禁用推论](docs/capabilities/CAP-02-07/RESEARCH-TRACE-2026-10-28.md)。来源累计1060条/125 Registry非去重；BRep合法性、Solid、Mesh、AABB、OEM与NC资格分开，V8规划合成55/55，独立Node与真实产品NOT_RUN。CAP-02-08研究Registry仍待补。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-06测量资源计量溯源、临界判定与控制器语义研究补证
[8项权威来源及合法阅读深度](research/sources/CAP-02-06.json) → [10规则40字段和原包](research/traces/CAP-02-06-v08-supplement.json) → [10正40独立反例4数学与8状态设计](docs/capabilities/CAP-02-06/research-fixtures-v08.json) → [专题、历史保护和Owner交接](docs/capabilities/CAP-02-06/RESEARCH-TRACE-2026-10-28.md)。累计**1052来源登记/124 Registry（非去重）**，02域还缺CAP-02-07..08同名来源。独立Node、实际检测/NC/B5/消费者均NOT_RUN；Owner会签0/17，L3待审。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-05毛坯/材料来源Registry与精确实体包含补证
[10来源及合法阅读边界](research/sources/CAP-02-05.json) → [10规则40字段/原包](research/traces/CAP-02-05-v08-supplement.json) → [10正40独立负4数学+8未运行状态](docs/capabilities/CAP-02-05/research-fixtures-v08.json) → [专题与交接](docs/capabilities/CAP-02-05/RESEARCH-TRACE-2026-10-28.md)。原R-MS与references原字节保留，**1044登记/123 Registry非去重**；02域剩3同名来源缺口。V8规划合成54/54，独立Node/真实OCCT/机床/消费者NOT_RUN；17Owner/L3待人类。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-04夹具研究同名来源补证与单边接触/失效追踪
[8项合法来源及真实阅读边界](research/sources/CAP-02-04.json) → [10规则40字段、原F1-02/F1-06/E3-04与WH-T映射](research/traces/CAP-02-04-v08-supplement.json) → [10正40独立负+6合成数学/8状态设计](docs/capabilities/CAP-02-04/research-fixtures-v08.json) → [补证审计说明](docs/capabilities/CAP-02-04/RESEARCH-TRACE-2026-10-28.md)。既有R-WH-001与原8条WH-R不改；**1034条登记/122 Registry，02域同名来源缺口5→4**。NIST与SAGE只读著录摘要、ISO只读官网目录，OCCT/LinuxCNC/RFC/W3C仅读公开指定部分。规划合成检查不等于Node独立文件执行或真实工装/NC验收；Owner正式会签0/17，L3待审。规划PASS≠产品PASS。

## 2026-10-28｜CAP-02-03刀柄总成同名来源、Trace补证与研究索引校正
[6项官方来源、合法阅读深度](research/sources/CAP-02-03.json) → [10规则40字段](research/traces/CAP-02-03.json) → [10正40独立负/8状态设计](docs/capabilities/CAP-02-03/research-fixtures-v08.json) → [新补证说明](docs/capabilities/CAP-02-03/RESEARCH-TRACE-2026-10-28.md)；既有R-TA-001、SRC-TA-001..008不变。上一轮source-index顶层1016与120份Registry逐项声明求和1020不一致，本轮纠正后新增6条，成为**1026条登记/121 Registry（非去重）**。02域同名Trace缺口由1降为0、同名Registry缺口由6降为5；10原工作包零直接边/55CAP无显式资产生产边不擅自补写。规划静态10正40独立负，Node文件执行与真实机床/消费者NOT_RUN，Owner签署0/17、L3待审，规划PASS≠产品PASS。

## 2026-10-28｜88CAP×36包×17资产首轮全量显式覆盖矩阵（非最终移交）
[结构化矩阵与风险](docs/architecture/v0.8/全仓交叉覆盖首轮_2026-10-28.md) · [312条CAP→包与33条资产→生产CAP](docs/architecture/v0.8/cross-coverage-v08.json) · [4官方来源](research/sources/CROSS-COVERAGE-V08.json) → [8规则](research/traces/CROSS-COVERAGE-V08.json) → [8正12负验收](docs/architecture/v0.8/cross-coverage-fixtures-v08.json)。88/88CAP、36/36原包、17/17候选接口不变；10包无原CAP直接边、55 CAP非资产显式producer，02域6个同名source与1个同名trace缺口须核旧专题。当前**1020来源登记/120 Registry，非去重**。V8静态PASS与12/12故意错误拒绝；独立Node、实际Owner/消费者/NC/机床、全仓502MD链接均NOT_RUN；L3、历史原件及最终交接未完成。规划PASS≠产品PASS。

## 2026-10-28｜11域跨域研究与来源链首轮复核（终核未完成）
[11域Owner/研究锚点与NC链](docs/architecture/v0.8/11域研究交叉复核_2026-10-28.md) · [结构化11域映射](docs/architecture/v0.8/11域研究交叉复核_2026-10-28.json) · [6官方来源及真实访问深度](research/sources/DOMAIN-CROSSCHECK-V08.json) → [11规则/CAP/原包](research/traces/DOMAIN-CROSSCHECK-V08.json) → [正反案例](docs/architecture/v0.8/11域研究交叉验收_2026-10-28.json) · [Node可运行只读校验器](tools/check_11domain_crosscheck_v08.cjs)。**88/88 CAP、36/36原包、17/17候选接口不变；11/11领域首轮研究锚点，非逐篇终核**；V8远端回读执行 **43/43规划静态检查**（24项正向/门禁、19项故意负向变异），**独立Node文件系统进程NOT_RUN**（容器网络无法获取GitHub），本轮仅为11域首轮锚点，不代表11域全部来源终核。1016登记/119 Registry（非去重）。正式Owner签署0/17、真实消费者0/17、L3待审，历史附件/全仓矩阵/风险交接未闭合；规划PASS≠产品PASS。

## 2026-10-28｜D01—D17资产Owner接口首轮跨域终核（待正式签署）
[17资产候选Owner/Port与独立消费者矩阵](docs/architecture/v0.8/17资产Owner接口交叉核验_2026-10-28.md) · [公开7来源+真实阅读范围](research/sources/ASSET-OWNERS-V08.json) → [10规则与字段](research/traces/ASSET-OWNERS-V08.json) → [正反合成/本地可运行Node校验器](tools/check_asset_owner_ports_v08.cjs)。**88/88 CAP及36/36原包不变；17/17仅候选接口列示，0/17人类Owner签署、0/17真实独立消费者验收**；原基线保持，来源登记1010/118 Registry（非去重）。V8静态正反只属规划；L3/历史附件/11域终核/全仓链接及风险交接未闭合，规划PASS≠产品PASS。

## 2026-10-28｜CAP-04-07《刀具安装关系》实施级规划（L3待审）
[十项施工](docs/capabilities/CAP-04-07/README.md) · [GUI/3D](docs/capabilities/CAP-04-07/UI.md) · [10官方来源及局限](research/sources/CAP-04-07.json) → [10规则40字段](research/traces/CAP-04-07.json) → [80项规划合成](docs/capabilities/CAP-04-07/fixtures.json) · [17资产候选Owner/交接](docs/capabilities/CAP-04-07/independent-consumer-handoff.md)。**88/88 CAP、36/36原编号包、1003来源登记/117 Registry（非去重）**；单Babylon/左TaskPanel、D03资源≠D10实装、H≠Gauge；L3/17Owner会签、11域终核、历史附件、全仓矩阵与实际NC/三轴/B5/消费者验收仍未完成。**规划PASS≠产品PASS**。

## 2026-10-28｜CAP-04-06《机床Setup绑定》实施规划（L3待审）
[十项施工](docs/capabilities/CAP-04-06/README.md) · [GUI/3D](docs/capabilities/CAP-04-06/UI.md) · [10合法来源](research/sources/CAP-04-06.json) → [10规则40字段](research/traces/CAP-04-06.json) → [74例合成](docs/capabilities/CAP-04-06/fixtures.json) · [17资产交接](docs/capabilities/CAP-04-06/independent-consumer-handoff.md)。累计87/88 CAP、36/36原包、993登记/116 Registry（非去重）；V8规划合成74/74，Node/真实NC/B5/三轴/消费者NOT_RUN。D04≠D10、NC未知阻D16，17Owner/L3及最终交接待审；规划PASS≠产品PASS。

## 2026-10-27｜CAP-11-08《人机授权与安全约束》（L3待审）
[原业务/十项施工](docs/capabilities/CAP-11-08/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-11-08/UI.md) · [10合法来源及访问限制](research/sources/CAP-11-08.json) → [10规则40字段](research/traces/CAP-11-08.json) → [50正反+31状态+6跨域合成](docs/capabilities/CAP-11-08/fixtures.json) · [17资产Owner候选及独立消费](docs/capabilities/CAP-11-08/independent-consumer-handoff.md)。累计**86/88详细CAP、36/36原包及研究追踪、983来源登记/115 Registry（非去重）**；V8等价规划合成87/87，Node/真实Owner/NC/B5/独立消费者NOT_RUN，17Owner正式会签及L3、最终全仓审计待办。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-07《知识反馈与版本管理》V0.8实施级规划（L3待审）
[十项任务/原业务](docs/capabilities/CAP-11-07/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-11-07/UI.md) · [版本候选合同](docs/capabilities/CAP-11-07/knowledge-feedback-contract.example.json) · [10份官方来源/合法阅读深度](research/sources/CAP-11-07.json) → [10规则40字段](research/traces/CAP-11-07.json) → [50独立正反+24状态+6血缘DAG](docs/capabilities/CAP-11-07/fixtures.json) · [17候选Owner及独立消费](docs/capabilities/CAP-11-07/independent-consumer-handoff.md)。累计**85/88详细CAP、36/36原包研究追踪、973登记/114 Registry**（非去重）；静态规划合成不等于实际独立Node、知识CAS、NC/B5或消费者PASS。新知识修订及撤销只追加，不能覆盖冻结A/B，D13 UNKNOWN阻D16；17Owner/L3、历史原始附件与最终11域矩阵待办。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-06《智能任务与长时作业》V0.8实施级规划（L3待审）
[十项施工及状态契约](docs/capabilities/CAP-11-06/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-11-06/UI.md) · [10官方公开来源](research/sources/CAP-11-06.json) → [10规则40字段](research/traces/CAP-11-06.json) → [50逐字段正反+28异步门禁+4 DAG](docs/capabilities/CAP-11-06/fixtures.json) · [17 Owner候选/独立消费者](docs/capabilities/CAP-11-06/independent-consumer-handoff.md)。**84/88 CAP、36/36原包追踪、963登记/113 Registry（非去重）**。V8合成82/82仅规划，独立Node文件/真实Worker/Owner事务/NC/B5/消费者NOT_RUN；MCP Tasks 2025实验版与SEP-2663 Extension不默认兼容。取消先对账、不删除已提交事实，迟到ACK不得复活任务；17资产正式会签/L3、11域终核、历史原字节、全仓矩阵仍待。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-05《工艺推荐与方案解释》V0.8实施级规划（L3待审）
[十项实施](docs/capabilities/CAP-11-05/README.md) · [GUI/3D](docs/capabilities/CAP-11-05/UI.md) · [精确合同](docs/capabilities/CAP-11-05/recommendation-contract.example.json) · [10合法来源](research/sources/CAP-11-05.json) → [10规则40字段](research/traces/CAP-11-05.json) → [50正反+24状态+2公式](docs/capabilities/CAP-11-05/fixtures.json) · [跨域Owner/独立消费者](docs/capabilities/CAP-11-05/independent-consumer-handoff.md)。累计**83/88 CAP、36/36原包研究追踪、953来源登记/112 Registry**（非去重）；76/76仅V8规划合成，独立Node/真实刀具数据库/NC/B5/消费者NOT_RUN。公式有单位但非推荐认证；17Owner/L3、历史原字节、11域终核、全仓矩阵仍待。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-04《工具调用与智能体编排》V0.8实施级规划（L3待审）
[十项实施](docs/capabilities/CAP-11-04/README.md) · [GUI/3D](docs/capabilities/CAP-11-04/UI.md) · [Agent合同](docs/capabilities/CAP-11-04/agent-orchestration-contract.json) · [10合法公开来源](research/sources/CAP-11-04.json) → [10规则40字段](research/traces/CAP-11-04.json) → [50逐字段正反+24门禁](docs/capabilities/CAP-11-04/fixtures.json) · [独立消费者](docs/capabilities/CAP-11-04/independent-consumer-handoff.md)。累计**82/88 CAP、36/36原包、943登记/111 Registry（非去重）**；V8合成74/74，独立Node/实际Owner/Agent/NC/B5/消费者NOT_RUN。17Owner正式会签、L3待人类；历史原字节/11域研究终核及全仓风险交接未闭合。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-03《检索增强与证据》V0.8实施级规划（L3待审）
[十项实施](docs/capabilities/CAP-11-03/README.md) · [单Babylon与左TaskPanel](docs/capabilities/CAP-11-03/UI.md) · [9份来源](research/sources/CAP-11-03.json) → [10规则40字段](research/traces/CAP-11-03.json) → [50独立字段正反+28门禁](docs/capabilities/CAP-11-03/fixtures.json) · [独立消费者](docs/capabilities/CAP-11-03/independent-consumer-handoff.md)。累计**81/88 CAP、36/36原包追踪、933来源登记/110 Registry（非去重）**；V8合成78/78，Node文件执行、真实RAG/NC/B5/独立消费NOT_RUN，17Owner及L3待人类。向量检索不是权限、引用不是NC验证，UNKNOWN阻发布。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-02《工艺知识与规则》V0.8实施级规划（L3待审）
[10项实施](docs/capabilities/CAP-11-02/README.md) · [唯一Babylon与左TaskPanel](docs/capabilities/CAP-11-02/UI.md) · [工艺知识合同](docs/capabilities/CAP-11-02/knowledge-contract.example.json) · [10合法来源/阅读深度](research/sources/CAP-11-02.json) → [10规则40字段](research/traces/CAP-11-02.json) → [50单字段正反+24门禁](docs/capabilities/CAP-11-02/fixtures.json) · [17资产Owner候选/独立消费](docs/capabilities/CAP-11-02/independent-consumer-handoff.md)。累计**80/88详细CAP、36/36原包及追踪、924登记/109 Registry（非去重）**；仅V8合成74/74。独立Node、真实SHACL/知识引擎/机床/消费者NOT_RUN；17Owner/L3待人类，最终研究/历史附件/全仓交叉未闭合。知识仅建议、不覆盖D08，不把CL模拟冒充D15，UNKNOWN阻D16。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-11-01《AI工作台与自然交互》V0.8实施级规划（L3待审）
[原目标/十项业务任务](docs/capabilities/CAP-11-01/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-11-01/UI.md) · [9来源及真实阅读深度](research/sources/CAP-11-01.json) → [10规则40字段](research/traces/CAP-11-01.json) → [50逐字段正反+20门禁](docs/capabilities/CAP-11-01/fixtures.json) · [17Owner候选与独立消费](docs/capabilities/CAP-11-01/independent-consumer-handoff.md)。累计**79/88详细CAP、36/36原编号包、914来源登记/108 Registry（非去重）**。本轮V8合成70/70，故意变异捕获，独立Node/浏览器/真实模型/NC/机床/消费者NOT_RUN，Owner/L3 PENDING_HUMAN。Agent仅建议/草案，Owner提交重验权限/CAS/取消；单Canvas/左容器/12px，D04≠D10，D11 CL_ONLY≠D15 NC验证。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-10-08《数字主线与审计》V0.8实施级规划（L3待审）
[原88项原文及十子任务](docs/capabilities/CAP-10-08/README.md) · [单Babylon/统一左TaskPanel](docs/capabilities/CAP-10-08/UI.md) · [10来源与阅读范围](research/sources/CAP-10-08.json) → [十规则/40字段](research/traces/CAP-10-08.json) → [50字段正反+8图+19门禁](docs/capabilities/CAP-10-08/fixtures.json) · [17Owner候选/独立消费](docs/capabilities/CAP-10-08/independent-consumer-handoff.md)。累计**78/88详细CAP、36/36原包及研究、905条来源登记/107 Registry**（非去重）；V8 77/77仅合成规划，独立Node、真实NC/OPC/B5/质量及消费者NOT_RUN，17Owner/L3待人类。反馈业务图可环、不可变实例来源DAG不可环，D04≠D10，CL动画≠NC独立D15安全验证。规划PASS≠产品PASS。

## 2026-10-27｜CAP-10-07《异常反馈与工程变更》实施级规划（L3待审）
[原目标/10项实施](docs/capabilities/CAP-10-07/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-10-07/UI.md) · [8项合法来源与阅读深度](research/sources/CAP-10-07.json) → [10规则40字段](research/traces/CAP-10-07.json) → [50逐字段正反+20门禁](docs/capabilities/CAP-10-07/fixtures.json) · [独立消费者与无损回退](docs/capabilities/CAP-10-07/independent-consumer-handoff.md)。累计**77/88详细CAP、36/36原包和研究追踪、895来源登记/106 Registry（非去重）**；70/70仅V8内存规划合成，独立Node进程/真实OPC/NC/机床/质检/消费者NOT_RUN；17Owner/L3待人类。报警Ack≠维修/放行，现场D17 append仅触发新ECN Revision，不覆盖冻结A/B。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-10-06《现场执行与工单》实施级规划（L3待审）
[10子任务与原88项目标](docs/capabilities/CAP-10-06/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-10-06/UI.md) · [8项来源及阅读深度](research/sources/CAP-10-06.json) → [10规则40字段](research/traces/CAP-10-06.json) → [50正反字段变异+22门禁](docs/capabilities/CAP-10-06/fixtures.json) · [独立消费者及旧MES回退](docs/capabilities/CAP-10-06/independent-consumer-handoff.md)。累计**76/88 CAP、36/36原包研究追踪、887条登记/105 Registry（非去重）**。72/72仅V8规划合成，Node文件进程/真实MES/NC/OPC/机床/独立消费者NOT_RUN；17Owner/L3待人类。外部MES工单真值不回写，旧OPC Job节点已弃用，工单完工≠NC执行/质检合格/机床启动。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-10-05《MDC数据采集》实施级规划（L3待审）
[十项实施与原目标](docs/capabilities/CAP-10-05/README.md) · [左TaskPanel/单Babylon](docs/capabilities/CAP-10-05/UI.md) · [MTConnect2.5.0及8份来源](research/sources/CAP-10-05.json) → [十规则四十字段](research/traces/CAP-10-05.json) → [68项合成场景](docs/capabilities/CAP-10-05/fixtures.json) · [独立消费者](docs/capabilities/CAP-10-05/independent-consumer-handoff.md)。累计**75/88详细CAP、36/36原包及研究、879来源登记/104 Registry（非去重）**。68/68仅V8内存规划合成；真实MTConnect/OPC、机床、独立Node与消费者NOT_RUN，17Owner/L3待审。**D17遥测≠D15工程验证，规划PASS≠产品PASS**。

## 2026-10-27｜CAP-10-04《DNC程序交换》详细规划（L3待审）
[十项实施与原目标](docs/capabilities/CAP-10-04/README.md) · [单Babylon/统一左TaskPanel](docs/capabilities/CAP-10-04/UI.md) · [10来源及阅读深度](research/sources/CAP-10-04.json) → [10规则40字段](research/traces/CAP-10-04.json) → [50独立字段正反+18传输门禁](docs/capabilities/CAP-10-04/fixtures.json) · [10域接口及独立收方](docs/capabilities/CAP-10-04/independent-consumer-handoff.md)。**74/88详细CAP、36/36原包追踪、871登记/103 Registry（非去重）**。68/68仅V8规划合成；真实DNC/OPC UA厂商适配/机床与独立消费者NOT_RUN，17资产Owner/L3待人类。**OPC可选文件树≠DNC传输实际可用≠控制器程序激活≠CycleStart≠D15工程安全。**规划PASS≠产品PASS。

## 2026-10-27｜CAP-10-03《离线介质交付》（L3待审）
[10项原目标实施](docs/capabilities/CAP-10-03/README.md) · [单Babylon/统一左TaskPanel](docs/capabilities/CAP-10-03/UI.md) · [9份官方公开来源与阅读深度](research/sources/CAP-10-03.json) → [10规则40字段/2原包](research/traces/CAP-10-03.json) → [10正40独立字段反例+25离线门禁](docs/capabilities/CAP-10-03/fixtures.json) · [独立消费者/回退](docs/capabilities/CAP-10-03/independent-consumer-handoff.md)。累计**73/88详细CAP、36/36原编号包及研究追踪、861来源登记/102 Registry（非去重）**。75/75为V8规划内存合成，Node文件、真实U盘/签名/机床/接收方均NOT_RUN；17Owner/L3待审。签名、哈希、介质签收和D15独立NC工程安全不能互相冒充；离线时间/撤销UNKNOWN不发上机资格。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-10-02《发布审批与签发》实施级规划（L3待审）
[10子任务与原目标](docs/capabilities/CAP-10-02/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-10-02/UI.md) · [9项官方来源及阅读深度](research/sources/CAP-10-02.json) → [10规则40字段](research/traces/CAP-10-02.json) → [70逐字段正反+14状态门禁](docs/capabilities/CAP-10-02/fixtures.json) · [独立收方与回退](docs/capabilities/CAP-10-02/independent-consumer-handoff.md)。累计**72/88详细CAP、36/36原工作包和追踪、852登记/101 Registry（非去重）**。仅V8等价内存84/84合成，独立Node/真实签名/控制器/B5/离线消费者NOT_RUN。CAP-10-01候选≠签发；签名数学正确≠D15物理工程安全；失效/撤权/UNKNOWN阻D16。17资产Owner/L3待人类，历史附件和全仓交叉未闭合。规划PASS≠产品PASS。

## 2026-10-27｜CAP-10-01《程序发布包》候选封装规划（L3待审）
[十项实施及原目标](docs/capabilities/CAP-10-01/README.md) · [单Babylon和左TaskPanel](docs/capabilities/CAP-10-01/UI.md) · [9官方合法来源](research/sources/CAP-10-01.json) → [10规则×4字段](research/traces/CAP-10-01.json) → [30正反+40全字段变异+18门禁](docs/capabilities/CAP-10-01/fixtures.json) · [独立消费者/回退](docs/capabilities/CAP-10-01/independent-consumer-handoff.md)。累计**71/88详细CAP、36/36原包研究追踪、843条来源登记/100 Registry（非去重）**。仅V8等价内存88/88合成，不等于独立Node、真实NC/OCCT/三轴/B5/离线消费者PASS。10域D16候选不等于CAP-10-02签发，UNKNOWN与CL_ONLY不得上机；17Owner与L3待人类。**规划PASS≠产品PASS**。以下历史快照。

## 2026-10-27｜CAP-09-08《仿真播放与校验报告》（L3待审）
[十项实施/原目标](docs/capabilities/CAP-09-08/README.md) · [唯一Babylon/左TaskPanel](docs/capabilities/CAP-09-08/UI.md) · [9官方合法来源](research/sources/CAP-09-08.json) → [10规则/40字段](research/traces/CAP-09-08.json) → [30正反独立变异+14状态](docs/capabilities/CAP-09-08/fixtures.json) · [报告与独立消费者](docs/capabilities/CAP-09-08/independent-consumer-handoff.md)。**70/88 CAP、36/36原工作包及研究追踪、834登记/99 Registry（非去重）**。仅规划V8等价44/44合成；独立Node、真实NC/OCCT/B5/浏览器/消费者NOT_RUN，17Owner/L3待审。D14动画≠D15独立工程PASS，UNKNOWN阻D16。历史附件与最终全仓交叉未完成。**规划PASS≠产品PASS**。下文为历史快照。

## 2026-10-27｜CAP-09-07 干涉、限位与可达性（L3待审）
[原业务目标与十项实施](docs/capabilities/CAP-09-07/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-09-07/UI.md) · [10来源](research/sources/CAP-09-07.json) → [10规则/40字段](research/traces/CAP-09-07.json) → [30正反变异+20安全门禁+6界限合成](docs/capabilities/CAP-09-07/fixtures.json) · [独立消费者](docs/capabilities/CAP-09-07/independent-consumer-handoff.md)。**69/88 CAP、36/36原工作包及研究追踪、825登记/98 Registry（非去重）**。Axis与Joint分别核验，静态OCCT不证明连续运动安全；UNKNOWN阻D16。所有实际Node/NC/OCCT/实机/消费者NOT_RUN、17资产Owner/L3待人类；历史附件和最终交叉未闭合。**规划PASS≠产品PASS**。

## 2026-10-27｜CAP-09-06 NC程序驱动验证（D12最终NC→D13→D14→D15→D16）
[十项施工与原目标](docs/capabilities/CAP-09-06/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-09-06/UI.md) · [10权威来源及阅读深度](research/sources/CAP-09-06.json) → [10逐字段工程规则](research/traces/CAP-09-06.json) → [30正反独立变异+16合成门禁](docs/capabilities/CAP-09-06/fixtures.json) · [独立消费者与回退](docs/capabilities/CAP-09-06/independent-consumer-handoff.md)。累计**68/88 CAP、36/36原包及研究追踪、815来源登记/97 Registry**（非去重）。本轮规划合成说明并不等于Node独立文件执行、真实NC/机床与独立D15 Oracle；这些均NOT_RUN，17资产正式Owner/L3待人类，全部历史附件与全仓覆盖仍未闭合。UNKNOWN/STALE/CL_ONLY不能进入D16，不做材料扫掠仿真；**规划PASS≠产品PASS**。下文为历史快照。

## 2026-10-27｜CAP-09-05 CL机床运动预验证（D11仅CL_ONLY；L3待审）
[十项实施与原目标](docs/capabilities/CAP-09-05/README.md) · [统一左TaskPanel与唯一Babylon](docs/capabilities/CAP-09-05/UI.md) · [8来源及访问边界](research/sources/CAP-09-05.json) → [10规则与原包](research/traces/CAP-09-05.json) → [30规则正反字段变异+10状态向量](docs/capabilities/CAP-09-05/fixtures.json) · [独立消费者与回退](docs/capabilities/CAP-09-05/independent-consumer-handoff.md)。**67/88 CAP、36/36原包及研究追踪、805来源登记/96 Registry（非去重）**。仅V8内存40/40合成，Node独立文件/实际NC/OCCT/B5/消费者NOT_RUN；17Owner/L3待人类。D04名义Setup≠D10实际机床绑定，D11预检≠D12→D13→D14→D15工程验证，UNKNOWN阻D16。不做材料扫掠仿真；规划PASS≠产品PASS。以下历史数据为快照。

## 2026-10-27｜原B0-03黄金样例与规范追踪补证（不新增工作包）
[原B0-03](docs/work-packages/B0-03.md) · [8来源/10规则/30合成/12对黄金案例](docs/work-packages/B0-03/RESEARCH-BACKFILL.md) · [独立消费者交接](docs/work-packages/B0-03/independent-consumer-handoff.md)。原包研究追踪已到**36/36**，CAP仍**66/88**；累计**797来源登记/95 Registry**（非去重）；产品/实机/独立消费者NOT_RUN、Owner/L3待人类。完整仓链接/最终交接未闭合。

## 2026-10-27｜原F1-02研究补证（不新增原编号包）
[保留原实施包](docs/work-packages/F1-02.md) · [研究补证/来源](docs/work-packages/F1-02/RESEARCH-BACKFILL.md) · [10规则和30+6合成](research/traces/F1-02.json)。CAP **66/88**、原包36/36、原包研究**35/36**，789登记/94Registry非去重，Owner/L3待审、产品NOT_RUN。其下旧数字为历史快照。

## 2026-10-27｜CAP-09-04刀具安装与TCP核对（L3待审）
[十项实施/原目标](docs/capabilities/CAP-09-04/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-09-04/UI.md) · [九来源](research/sources/CAP-09-04.json) · [10规则30正反变异+8合成数例](research/traces/CAP-09-04.json) · [独立交接](docs/capabilities/CAP-09-04/independent-consumer-handoff.md)。进度**66/88 CAP、36/36原工作包、781条来源登记/93 Registry**（非去重文献）。规划V8静态38案例，Node文件/真实NC/B5/消费者NOT_RUN；17资产Owner及L3待人类审批。CL_ONLY不得当NC工程验证，UNKNOWN阻D16。后续旧日期数据为快照。

## 2026-10-27｜CAP-09-03逆运动学与解分支（L3待审）
[十项实施及原目标](docs/capabilities/CAP-09-03/README.md) · [单Babylon世界/左TaskPanel](docs/capabilities/CAP-09-03/UI.md) · [9份官方来源与阅读限制](research/sources/CAP-09-03.json) → [10规则30正反变异+5个合成2R数学向量](docs/capabilities/CAP-09-03/fixtures.json) · [独立消费者和回退](docs/capabilities/CAP-09-03/independent-consumer-handoff.md)。累计**65/88 CAP，36/36原包，772登记/92 Registry（非去重）**；仅V8内存合成，独立Node文件/真实OCCT/NC/B5/消费者NOT_RUN；17资产Owner与L3待审。D13独立解释最终NC→D14轴时序→D15工程验证→D16发布；UNKNOWN阻放行，不做材料扫掠仿真，规划PASS≠产品PASS。下一CAP-09-04。

## 2026-10-27｜CAP-09-02统一坐标与运动正解（L3待审）
[实施与Frame合同](docs/capabilities/CAP-09-02/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-09-02/UI.md) · [9真实阅读层级来源](research/sources/CAP-09-02.json) → [10规则/30正反独立字段变异](research/traces/CAP-09-02.json) · [8数学向量](docs/capabilities/CAP-09-02/fixtures.json) · [独立消费者](docs/capabilities/CAP-09-02/independent-consumer-handoff.md)。正式**64/88 CAP、36/36原包、763登记/91 Registry（非去重）**，仅规划合成，Node独立文件、真实NC/机床/消费者NOT_RUN。D04≠D10，D13解释NC→D14轴时序→D15验证→D16发布，UNKNOWN不通过；17Owner/L3待审。下一CAP-09-03。规划PASS≠产品PASS。

## 2026-10-26｜CAP-09-01机床运动学模型解析（L3待审）
[十项实施及原目标](docs/capabilities/CAP-09-01/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-09-01/UI.md) · [10来源](research/sources/CAP-09-01.json) · [10规则/30正反独立差异变异](research/traces/CAP-09-01.json) · [5数学向量](docs/capabilities/CAP-09-01/fixtures.json) · [独立消费者](docs/capabilities/CAP-09-01/independent-consumer-handoff.md)。**63/88 CAP、36/36工作包、754来源登记/90 Registry（非去重）**。仅内存合成30/30，数学向量5条规格；独立Node文件、OCCT/NC/实机/B5/消费者NOT_RUN，17Owner/L3待会签。D03资源≠D10执行绑定，D13 NC→D14轴运动→D15验证→D16发布；UNKNOWN不放行。下一CAP-09-02。**规划PASS≠产品PASS**。

## 2026-10-26｜CAP-08-08《后处理配置与一致性》（L3待审）
[十项实施及原始目标](docs/capabilities/CAP-08-08/README.md) · [统一左TaskPanel/单Babylon](docs/capabilities/CAP-08-08/UI.md) · [8合法来源及阅读深度](research/sources/CAP-08-08.json) → [10规则与30正反独立变异](research/traces/CAP-08-08.json) · [独立消费者](docs/capabilities/CAP-08-08/independent-consumer-handoff.md)。累计**62/88 CAP、36/36原包、744登记/89 Registry（非去重）**；本轮V8内存合成30/30，不等于Node独立执行/真实后处理或NC工程PASS。配置闭包包含插件/模板/有效属性/固件选件/Runtime及输入修订；D13需独立重读NC，UNKNOWN阻D16。17Owner和L3待审，历史原始附件/11域研究/全仓交叉仍待闭合。下一CAP-09-01。**规划PASS≠产品PASS**。

## 2026-10-26｜CAP-08-07《CL与NC映射溯源》（L3待审）
[十项规划与原目标](docs/capabilities/CAP-08-07/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-08-07/UI.md) · [8来源及访问限制](research/sources/CAP-08-07.json) · [10规则/30正反变异+12门禁+5映射合成](research/traces/CAP-08-07.json) · [独立消费者](docs/capabilities/CAP-08-07/independent-consumer-handoff.md)。累计**61/88 CAP、36/36原包、736来源登记/88 Registry（非去重）**；规划合成47/47仅JS内存。ISO与NIST未读正文，OCCT8.0.1 API未读。真实Node、产品/NC/控制器/实机/独立消费者NOT_RUN，17Owner/L3待审批。D09中立CL↔D12最终NC为多对多关系，D13独立解释后才可衔接D14轴时序/D15独立验证；UNKNOWN阻D16。**规划PASS≠产品PASS**。下一CAP-08-08，以下历史快照。

## 2026-10-26｜CAP-08-06 NC源码与编辑（L3待审）
[十项实现与原目标](docs/capabilities/CAP-08-06/README.md) · [单Babylon/统一左TaskPanel](docs/capabilities/CAP-08-06/UI.md) · [8项来源阅读层级](research/sources/CAP-08-06.json) · [10规则/30正反变异+9语义场景](research/traces/CAP-08-06.json) · [独立消费者](docs/capabilities/CAP-08-06/independent-consumer-handoff.md)。
累计**60/88 CAP、36/36原工作包、728来源登记/87 Registry（非去重）**。规划合成39/39；独立Node文件运行、真实NC/控制器/机床/消费者NOT_RUN，17资产正式Owner会签和L3审批PENDING_HUMAN。源码编辑产生新D12修订，D13重解释→D14轴时序→D15独立验证→D16发布；未知阻断，CL动画不冒充NC工程验证，不做材料扫掠。**规划PASS≠产品PASS**。下一CAP-08-07；以下为历史快照。

## 2026-10-26｜CAP-08-05循环宏与子程序（L3待审）
[实施十项](docs/capabilities/CAP-08-05/README.md) · [单Babylon左TaskPanel](docs/capabilities/CAP-08-05/UI.md) · [8合法来源](research/sources/CAP-08-05.json) · [10规则/30正反变异](research/traces/CAP-08-05.json) · [8条宏循环合成](docs/capabilities/CAP-08-05/fixtures.json) · [独立消费者](docs/capabilities/CAP-08-05/independent-consumer-handoff.md)。累计**59/88 CAP、36/36原包、720来源登记/86 Registry（非去重）**；合成规划38/38，真实Node/控制器/机床/独立消费者NOT_RUN，17Owner/L3待审。CAP-08-03误将D06指刀具仍需横向纠正，不能标已修复。UNKNOWN阻D16，CL预览不充NC工程验证，不做材料扫掠仿真。**规划PASS≠产品PASS**。后续CAP-08-06。下文历史快照。

## 2026-10-26｜CAP-08-04 主轴换刀与辅助动作（L3待审）
[实施十项](docs/capabilities/CAP-08-04/README.md) · [单Babylon与统一左TaskPanel](docs/capabilities/CAP-08-04/UI.md) · [8项真实访问层级](research/sources/CAP-08-04.json) · [来源→十规则→字段→30验收](research/traces/CAP-08-04.json) · [8条换刀/冷却/定向语义合成](docs/capabilities/CAP-08-04/fixtures.json) · [独立消费者/回退](docs/capabilities/CAP-08-04/independent-consumer-handoff.md)。**58/88 CAP、36/36原包、712登记/85 Registry（非去重）**。纠正D06实为求解候选非刀具；M6冷却跨控制器差异需Profile，ACK不得伪造。V8规划合成38/38；真实Node/NC/控制器/机床/消费者NOT_RUN、17Owner/L3待会签。**规划PASS≠产品PASS**。后续CAP-08-05；下文为历史快照。

## 2026-10-26｜CAP-08-03 坐标与运动指令（L3待审）
[十项实施](docs/capabilities/CAP-08-03/README.md) · [单Babylon与统一左TaskPanel](docs/capabilities/CAP-08-03/UI.md) · [7合法来源](research/sources/CAP-08-03.json) · [10规则/30合成正反与独立字段变异](research/traces/CAP-08-03.json) · [跨域独立消费者与回退](docs/capabilities/CAP-08-03/independent-consumer-handoff.md)。累计**57/88 CAP、36/36原包、704来源登记/84 Registry（非去重）**。合成内存30/30，4份正文10条相对链接0缺失；非全仓测试。真实Node/NC/控制器/机床/消费者NOT_RUN，17资产Owner和L3待会签。下一CAP-08-04；**规划PASS≠产品PASS**。以下为历史快照。

## 2026-10-26｜CAP-08-02控制器与机床方言（L3待审）
[实施和十规则](docs/capabilities/CAP-08-02/README.md) · [单Babylon与左TaskPanel](docs/capabilities/CAP-08-02/UI.md) · [10合法来源及真实阅读层级](research/sources/CAP-08-02.json) · [30规划正反变异](docs/capabilities/CAP-08-02/fixtures.json) · [独立消费者交接](docs/capabilities/CAP-08-02/independent-consumer-handoff.md)。累计**56/88 CAP、36/36原编号包、697登记/83 Registry**（非去重）；修复旧研究索引累计678与实际687不一致。Siemens手册正文未读，真实NC/控制器/独立消费者NOT_RUN；17 Owner/L3待审。下一CAP-08-03；**规划PASS≠产品PASS**。以下旧段为历史快照。

## 2026-10-26｜原T5-06长期质量基线与能力扩展准入（L3待审）
[十项实施](docs/work-packages/T5-06.md) · [单Babylon与左TaskPanel](docs/work-packages/T5-06/UI.md) · [9项合法来源](research/sources/T5-06.json) · [十规则/30合成](research/traces/T5-06.json) · [独立消费者](docs/work-packages/T5-06/independent-consumer-handoff.md)。**36/36原编号工作包、55/88详细CAP、687条来源登记/82 Registry**（非去重）；仅规划V8合成30/30，真实产品/NC/SQLite恢复/消费者及Node独立执行NOT_RUN；L3和17Owner待会签。**规划PASS≠产品PASS**。尚余33 CAP及17接口、11域研究、历史附件、全仓覆盖/风险/交接。以下为历史快照。

## 2026-10-26｜CAP-07-08轨迹编辑与局部再生（L3待审）
[10实施](docs/capabilities/CAP-07-08/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-07-08/UI.md) · [8合法来源](research/sources/CAP-07-08.json) · [十规则/30正反变异](research/traces/CAP-07-08.json) · [独立消费者](docs/capabilities/CAP-07-08/independent-consumer-handoff.md)。累计55/88 CAP、35/36原编号包、678条登记/81 registry（非去重）。仅规划V8合成34/34，真实Node/产品/机床/独立消费者NOT_RUN；17Owner与L3待评审。规划PASS≠产品PASS。下一原T5-06。以下历史快照。

## 2026-10-26｜T5-05双纵向切片协作规划（L3待审）
[十项实施](docs/work-packages/T5-05.md) · [单Babylon/左TaskPanel](docs/work-packages/T5-05/UI.md) · [独立消费者](docs/work-packages/T5-05/independent-consumer-handoff.md) · [9来源](research/sources/T5-05.json) · [10规则30合成](research/traces/T5-05.json)。累计54/88 CAP、35/36原工作包、670登记/80 registry（非去重）。真实团队集成/产品/独立Consumer NOT_RUN、L3/17Owner待人类，规划PASS≠产品PASS。下一CAP-07-08再T5-06。下文均为历史快照。

## 2026-10-26｜CAP-07-07中立CL轨迹契约（L3待审）
[十项实施](docs/capabilities/CAP-07-07/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-07-07/UI.md) · [9来源](research/sources/CAP-07-07.json) · [10规则30合成正反变异](research/traces/CAP-07-07.json) · [独立消费者](docs/capabilities/CAP-07-07/independent-consumer-handoff.md)。累计**54/88 CAP、34/36原包、661条来源登记/79 registry（非去重）**。D09中立CL的TCP/Frame/刀轴/typed段与D10实际机床执行绑定分离；D13 UNKNOWN阻断D16、D11动画不冒充D15工程验证，不做材料扫掠仿真。仅规划合成30/30；真实Node/OCCT/NC/机床/消费者NOT_RUN，Owner/L3待人类。下一原T5-05后CAP-07-08。**规划PASS≠产品PASS**。下文为历史快照。

## 2026-10-26｜原T5-04受控迁移与旧实现退出（L3待审）
[十项实施](docs/work-packages/T5-04.md) · [迁移恢复手册](docs/work-packages/T5-04/migration-runbook.md) · [单Babylon/左TaskPanel](docs/work-packages/T5-04/UI.md) · [9来源](research/sources/T5-04.json) · [10规则30合成正反变异](research/traces/T5-04.json) · [17资产候选Owner](docs/work-packages/T5-04/asset-owner-candidates.json) · [独立消费者](docs/work-packages/T5-04/independent-consumer-handoff.md)。累计**53/88 CAP、34/36原包、652来源登记/78 registry（非去重）**。旧Reader、golden、用户库、D08冻结保留；D04 Setup≠D10机床执行配置，D09 CL→D12 NC→D13语义→D14时序→D15验证→D16发布，UNKNOWN阻断；仅V8规则合成30/30，真实Node/迁移/恢复/消费者/NC/实机NOT_RUN，17Owner/L3 PENDING。下一CAP-07-07后T5-05。**规划PASS≠产品PASS**。以下为历史快照。

## 2026-10-26｜CAP-07-06 进退刀与链接（L3待审）
[实施十项](docs/capabilities/CAP-07-06/README.md) · [GUI与3D](docs/capabilities/CAP-07-06/UI.md) · [9来源](research/sources/CAP-07-06.json) · [10规则及30合成正反变异](research/traces/CAP-07-06.json) · [独立消费者](docs/capabilities/CAP-07-06/independent-consumer-handoff.md)。累计**53/88 CAP、33/36工作包、643登记/77 registry（非去重）**。允许有证据保持下刀，禁止静态距离冒充连续安全；D09 CL到D16必须独立执行链。规划合成30/30，不是产品PASS，OCCT/机床/消费者NOT_RUN，L3/17Owner待审。下轮原T5-04后CAP-07-07，以下旧段为历史快照。

## 2026-10-26｜原T5-03 跨仓发布列车与兼容窗口（L3待审）
[十项规划](docs/work-packages/T5-03.md) · [GUI与3D](docs/work-packages/T5-03/UI.md) · [来源深度](research/sources/T5-03.json) · [十规则/三十合成验收](research/traces/T5-03.json) · [十七资产Owner候选](docs/work-packages/T5-03/asset-owner-candidates.json) · [独立消费者/回退](docs/work-packages/T5-03/independent-consumer-handoff.md)。累计**52/88 CAP、33/36原编号包、634登记/76 registry**（非去重）。V8内存合成30/30规划PASS，真实产品/签名/Win11/NC/独立消费者NOT_RUN，L3/Owner待人类会签。下一项CAP-07-06，后T5-04。**规划PASS≠产品PASS。** 下文历史进度仅快照。

## 2026-10-26｜CAP-07-05 粗半精精策略族（L3待审）
[十项施工及原88目标](docs/capabilities/CAP-07-05/README.md) · [GUI/3D](docs/capabilities/CAP-07-05/UI.md) · [9合法来源](research/sources/CAP-07-05.json) · [10规则/30正反差异变异](research/traces/CAP-07-05.json) · [独立消费者与回退](docs/capabilities/CAP-07-05/independent-consumer-handoff.md)。累计**52/88详细CAP、32/36原包、624来源登记/75 registry**（非去重文献）。阶段有序D07真实前后态、侧壁/底面独立余量、Ra目标非实测，D09中立CL到D16独立验证阻断严格区分。仅V8合成30/30规划PASS；Node独立文件、真实OCCT/NC/Owner/消费者/机床NOT_RUN，L3和17Owner正式会签PENDING。下一轮原T5-03后CAP-07-06；以下为历史快照。**规划PASS≠产品PASS**。

## 2026-10-26｜原T5-02 2D/Docs→设计证据（L3待审）
[实施十子任务](docs/work-packages/T5-02.md) · [单Babylon世界/左TaskPanel](docs/work-packages/T5-02/UI.md) · [11权威来源/阅读局限](research/sources/T5-02.json) · [10规则/20正反/10差异变异](research/traces/T5-02.json) · [17资产Owner候选](docs/work-packages/T5-02/asset-owner-candidates.json) · [独立消费者及迁移](docs/work-packages/T5-02/independent-consumer-handoff.md)。累计**51/88 CAP、32/36原编号包、615来源登记/74 registry（非去重）**。DXF/Docs来源锁、OCR人工确认、D01/D02 Owner CAS；30/30仅合成规划PASS，真实2D/OCR/Owner/消费者NOT_RUN，L3和17Owner待审。下一项CAP-07-05，下列进度为历史快照。

## 2026-10-26｜CAP-07-04 连续四/五轴刀路规划（L3待审）
[十任务与规则入口](docs/capabilities/CAP-07-04/README.md) · [唯一Babylon Scene/统一左TaskPanel](docs/capabilities/CAP-07-04/UI.md) · [合成中立CL合同](docs/capabilities/CAP-07-04/contract.example.json) · [9份合法来源](research/sources/CAP-07-04.json) · [10规则/20正反/10差异变异](research/traces/CAP-07-04.json) · [17资产Owner候选](docs/capabilities/CAP-07-04/asset-owner-candidates.json) · [真实消费者与回退](docs/capabilities/CAP-07-04/independent-consumer-handoff.md)。累计**51/88 CAP、31/36原包、604来源登记/73 registry（非去重）**。连续刀轴/刀触与3+2分界明确；D04 Setup≠D10绑定，D09 CL→D12 NC→D13语义→D14时序→D15验证→D16发布；UNKNOWN阻发布，CL动画非机床工程验证，不做材料扫掠仿真。30/30为内存规划合成PASS，真实OCCT/独立消费者/机床NOT_RUN、17Owner/L3待签署；规划PASS≠产品PASS。下一项原T5-02，随后CAP-07-05；以下为历史快照。

## 2026-10-26｜原T5-01 AI与知识受控能力（L3待审）
[十项实施规格](docs/work-packages/T5-01.md) · [唯一Babylon/左TaskPanel](docs/work-packages/T5-01/UI.md) · [合成工具回执](docs/work-packages/T5-01/contract.example.json) · [10来源](research/sources/T5-01.json) · [10规则20正反10差异变异](research/traces/T5-01.json) · [17资产候选](docs/work-packages/T5-01/asset-owner-candidates.json) · [独立消费者/回退](docs/work-packages/T5-01/independent-consumer-handoff.md)。当前累计**50/88 CAP、31/36原工作包、595条来源登记/72 registry（非去重论文）**。统一工具回执/证据scope、LLM Gateway、受控审批，RAG和工具输出不可信；A/B不覆盖D08，D04≠D10，D09 CL→D12 NC→D13语义→D14时序→D15验证→D16发布；未知UNKNOWN、CL动画非工程验证，不做材料扫掠仿真。合成30/30规划PASS；真实LLM/Owner、独立Node文件、消费者/NC/实机NOT_RUN，17 Owner会签与L3 PENDING。**规划PASS≠产品PASS。** 以下旧段为历史快照。

## 2026-10-26｜CAP-07-03 3+2定位加工（L3待审）
[原编号业务与十项施工](docs/capabilities/CAP-07-03/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-07-03/UI.md) · [9来源及真实阅读深度](research/sources/CAP-07-03.json) · [10规则→20正反/10差异变异](research/traces/CAP-07-03.json) · [17资产Owner候选](docs/capabilities/CAP-07-03/asset-owner-candidates.json) · [独立消费者、迁移与回退](docs/capabilities/CAP-07-03/independent-consumer-handoff.md)。**累计50/88 CAP、30/36原包、585登记/71 registry（非去重论文）**。定位回转与三轴切削分离；右手Frame与变换逆检、姿态分支、禁虚构AC参数；D04 Setup≠D10执行绑定，中立CL动画≠D15工程验证，D13 UNKNOWN阻D16；规划合成30/30，Node/OCCT/真实NC/机床/独立消费者NOT_RUN，17Owner签署及L3审批PENDING。**规划PASS≠产品PASS。** 下文为历史进度快照。

## 2026-10-26｜原U4-06 模块SDK与贡献验收（L3待审）
[原十项实施](docs/work-packages/U4-06.md) · [单Scene/左TaskPanel](docs/work-packages/U4-06/UI.md) · [合成Manifest](docs/work-packages/U4-06/contract.example.json) · [11合法来源](research/sources/U4-06.json) · [10规则/20正反/10变异](research/traces/U4-06.json) · [独立消费者](docs/work-packages/U4-06/independent-consumer-handoff.md)。累计**49/88 CAP、30/36原编号工作包、576条来源登记/70 registry**（非去重文献）；仅规划合成30/30，Node独立文件、真实Tauri、Owner、产品及独立消费者NOT_RUN，17Owner正式会签/L3审批PENDING。规划PASS≠产品PASS。以下为历史快照。

## 2026-10-26｜CAP-07-02三轴曲面加工（设计L3待审）
[三轴等高/平行/等残高/有序残料及10项实施](docs/capabilities/CAP-07-02/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-07-02/UI.md) · [10份官方/论文摘要来源](research/sources/CAP-07-02.json) · [10规则/20正反/10差异变异](research/traces/CAP-07-02.json) · [独立消费者/迁移与回退](docs/capabilities/CAP-07-02/independent-consumer-handoff.md)。累计**49/88详细CAP、29/36原编号包、565来源登记/69 registry**（非去重论文）；内存规划合成30/30，Node独立文件、真实OCCT/曲面残高/Owner/NC/机床均NOT_RUN，L3和17Owner正式会签PENDING。固定三轴不冒充五轴，局部球头残高近似不当真实几何认证，D09 CL不冒充D15验证；**规划PASS≠产品PASS**。下列段落为历史快照。

## 2026-10-25｜原U4-05交互/渲染/可访问性回归（仅规划、L3待审）
[原编号10实施任务](docs/work-packages/U4-05.md) · [单Babylon/左TaskPanel与键盘DPI](docs/work-packages/U4-05/UI.md) · [GPU/Heap测试协议](docs/work-packages/U4-05/performance-protocol.md) · [9份公开来源](research/sources/U4-05.json) · [10规则/20正反/10变异](research/traces/U4-05.json) · [独立消费者](docs/work-packages/U4-05/independent-consumer-handoff.md)。累计**48/88 CAP、29/36原编号工作包、555来源登记/68 registry**；仅30/30内存规划合成，真实WCAG/DPI/GPU/Node独立文件执行/Owner消费者NOT_RUN，17Owner正式会签及L3待审。12px上限不豁免对比度与可点击目标；**规划PASS≠产品PASS**。以下为历史快照。

## 2026-10-25｜CAP-07-01 2.5D特征刀路（L3待审）
[平面/轮廓/型腔/孔槽、10施工规则](docs/capabilities/CAP-07-01/README.md) · [单Scene/左TaskPanel](docs/capabilities/CAP-07-01/UI.md) · [8来源及实际深度](research/sources/CAP-07-01.json) · [10规则20正反10变异](research/traces/CAP-07-01.json) · [独立消费者](docs/capabilities/CAP-07-01/independent-consumer-handoff.md)。累计**48/88 CAP、28/36原编号包、546来源登记/67 registry**，本轮仅30/30**内存规划合成**；独立Node文件执行、OCCT/后处理/控制器/机床/消费者均NOT_RUN，L3与17Owner正式会签PENDING。**规划PASS≠产品PASS。** 以下为历史快照。

## 2026-10-25｜原U4-04来源/失效/执行诊断联动（L3待审）
[原10项实施](docs/work-packages/U4-04.md) · [单Babylon/左TaskPanel](docs/work-packages/U4-04/UI.md) · [9条已核来源与深度](research/sources/U4-04.json) · [10规则/20正反/10变异](research/traces/U4-04.json) · [独立消费者](docs/work-packages/U4-04/independent-consumer-handoff.md)。累计**47/88详细CAP、28/36原工作包、538条来源登记/66 registry**。仅规划合成30/30，NC/Owner/独立Node/GUI/机床NOT_RUN，17资产正式会签与L3待审。下方历史进度为快照。**规划PASS≠产品PASS。**

## 2026-10-25｜CAP-06-08 冻结约束增量求解（L3待审）
[业务、10项施工与30合成验收](docs/capabilities/CAP-06-08/README.md) · [单Scene/左TaskPanel](docs/capabilities/CAP-06-08/UI.md) · [8官方来源及局限](research/sources/CAP-06-08.json) · [规则追踪](research/traces/CAP-06-08.json) · [独立消费者](docs/capabilities/CAP-06-08/independent-consumer-handoff.md)。累计**47/88详细CAP，27/36原工作包，529来源登记/65 registry**（非去重论文）；修正上轮源索引顶层512与实际64 registry合计521不一致。合成规划30/30，Node独立执行/OCCT/Owner/NC/机床NOT_RUN，17Owner/L3待审。以下旧数字为历史快照，规划PASS≠产品PASS。

## 2026-10-25｜原U4-03统一单Scene选择与预览租约（L3待审）
[10项实施](docs/work-packages/U4-03.md) · [GUI/3D](docs/work-packages/U4-03/UI.md) · [9份公开来源](research/sources/U4-03.json) · [10规则20正反+10变异](research/traces/U4-03.json) · [独立消费者](docs/work-packages/U4-03/independent-consumer-handoff.md)。累计**46/88详细CAP、27/36原编号包、521条来源登记/64 registry**。合成规则30/30仅内存规划检查，独立Node/真实Babylon GPU/Owner/消费者/NC产品全NOT_RUN；17资产正式会签与L3待审。单Scene为Procet选择，Babylon官方允许多Scene；预览取消不修改业务Owner。规划PASS≠产品PASS，下文数字为历史快照。

## 2026-10-25｜CAP-06-07独立Oracle与收敛（L3待审）
[详细规格](docs/capabilities/CAP-06-07/README.md) · [单Babylon GUI](docs/capabilities/CAP-06-07/UI.md) · [10来源](research/sources/CAP-06-07.json) · [10规则20正反+10变异](research/traces/CAP-06-07.json)。累计**46/88 CAP、26/36原包、512来源登记/63 registry**。V8合成30/30，真实OCCT/消费者/校准/产品NOT_RUN；17资产Owner签署与L3待审，规划PASS≠产品PASS。以下旧数字为历史快照。

## 2026-10-25｜原U4-02 TaskContribution与EditSession（L3待审）
[实施十子任务](docs/work-packages/U4-02.md) · [单Scene/左TaskPanel](docs/work-packages/U4-02/UI.md) · [8公开来源](research/sources/U4-02.json) · [10规则/20正反/10变异](research/traces/U4-02.json) · [独立消费者](docs/work-packages/U4-02/independent-consumer-handoff.md)。累计**45/88详细CAP、26/36原编号包、502来源登记/62 registry**。V8等价合成30/30不代表Node独立执行或产品PASS，17资产会签/L3/真实GUI与Owner均待办。以下数字是历史快照。

## 2026-10-25｜CAP-06-06 有界多路径预算与并行（L3待审）
[规划规格](docs/capabilities/CAP-06-06/README.md) · [单Babylon/左TaskPanel](docs/capabilities/CAP-06-06/UI.md) · [9项权威来源](research/sources/CAP-06-06.json) · [10规则20正反+10变异](research/traces/CAP-06-06.json) · [独立消费者](docs/capabilities/CAP-06-06/independent-consumer-handoff.md)。累计**45/88 CAP、25/36原包、494条来源登记/61 registry**；仅规划合成30/30，真实OCCT/NC/产品/Node独立文件执行NOT_RUN；17 Owner正式会签及L3待人类，规划PASS≠产品PASS。以下旧段均为历史快照。

## 2026-10-25｜原U4-01 WorkContext作用域及正交导航（L3待审）
[原编号10项实施](docs/work-packages/U4-01.md) · [单Babylon/统一左TaskPanel](docs/work-packages/U4-01/UI.md) · [状态机](docs/work-packages/U4-01/navigation-state-machine.json) · [9项合法来源](research/sources/U4-01.json) · [10规则20正反](research/traces/U4-01.json) · [独立消费者](docs/work-packages/U4-01/independent-consumer-handoff.md)。累计**44/88 CAP、25/36原包、485条来源/60 registry**（非去重论文）。独立Node、真实GUI/Owner、GPU、消费者与NC均NOT_RUN；17Owner签署及L3待人工。30/30仅规划内存合成，规划PASS≠产品PASS。下方数字为历史快照。

## 2026-10-25｜CAP-06-05 不可变制造状态（仅规划，L3待审）
[来源DAG/Stock封存与分叉](docs/capabilities/CAP-06-05/README.md) · [单Babylon及统一左TaskPanel](docs/capabilities/CAP-06-05/UI.md) · [10项官网来源](research/sources/CAP-06-05.json) · [10规则20正反+10变异](research/traces/CAP-06-05.json) · [独立D07交接](docs/capabilities/CAP-06-05/independent-consumer-handoff.md)。累计**44/88 CAP、24/36原包、476来源登记/59 registry（非去重论文）**。V8等价合成30/30 PASS，不代表独立Node或真实OCCT运行；产品、Owner消费者、机床NOT_RUN，17Owner/L3待人类，规划PASS≠产品PASS。历史段落数字均为快照。

## 2026-10-25｜W2-06 A/B闭环无界面验收（仅规划，L3待审）
[原编号10项实施及真实harness要求](docs/work-packages/W2-06.md) · [单Babylon与左TaskPanel](docs/work-packages/W2-06/UI.md) · [10份官方来源](research/sources/W2-06.json) · [10规则20正反+10变异](research/traces/W2-06.json) · [独立交接](docs/work-packages/W2-06/independent-consumer-handoff.md) · [实际harness合同](docs/work-packages/W2-06/real-harness.contract.json)。详细CAP仍43/88、原工作包24/36、来源登记466条/58 registry（非去重论文）。规划合成30/30 PASS；真实独立进程/Owner存储/强杀/NC/机床和Node独立文件执行NOT_RUN，L3和17 Owner签署PENDING。历史正文为快照，当前进度以tracking/progress.json为准。规划PASS≠产品PASS。

## 2026-10-25｜CAP-06-04 有效加工域构建（仅规划，L3待审）
[规格及集合公式](docs/capabilities/CAP-06-04/README.md) · [统一左TaskPanel/单Babylon](docs/capabilities/CAP-06-04/UI.md) · [10来源](research/sources/CAP-06-04.json) · [10规则20正反](research/traces/CAP-06-04.json) · [独立D07交接](docs/capabilities/CAP-06-04/independent-consumer-handoff.md)。当前43/88 CAP、23/36原工作包、456条登记/57 registry。合成30/30通过，真实OCCT/独立Node/D07/NC均NOT_RUN；17资产正式会签及L3 PENDING。以下旧段落为历史快照。

## 2026-10-25｜W2-05多Setup Feature/Plan可寻址查询（L3待审）
[10项原编号实施任务](docs/work-packages/W2-05.md) · [GUI/单Babylon](docs/work-packages/W2-05/UI.md) · [8合法来源](research/sources/W2-05.json) · [10规则20正反](research/traces/W2-05.json) · [独立消费者交接](docs/work-packages/W2-05/independent-consumer-handoff.md)。新累计42/88 CAP、23/36原包、446来源登记/56 registry；规划合成20/20 PASS，真实产品/Node独立文件/消费者NOT_RUN，17Owner/L3待人工。以下旧数字均历史快照。

## 2026-10-25｜CAP-06-03 局部B-Rep去料计算（L3待审）
[业务规格](docs/capabilities/CAP-06-03/README.md) · [GUI/3D](docs/capabilities/CAP-06-03/UI.md) · [10项公开来源](research/sources/CAP-06-03.json) · [10规则20正反](research/traces/CAP-06-03.json) · [合成校验](tools/check_cap0603_planning_2026_10_25.cjs) · [独立交接](docs/capabilities/CAP-06-03/independent-consumer-handoff.md)。累计详细CAP42/88、原工作包22/36、来源438条登记/55 registry（非去重）；合成内存30/30 PASS，独立Node/真实OCCT/D07/NC/机床NOT_RUN，Owner/L3待人工审查。旧进度段落仅为历史快照。

## 2026-10-25｜原W2-04跨域回执与中断恢复（正式规划，L3待审）
[实施级10子任务](docs/work-packages/W2-04.md) · [GUI/单Babylon](docs/work-packages/W2-04/UI.md) · [8项公开来源](research/sources/W2-04.json) · [10规则20正反](research/traces/W2-04.json) · [独立消费者](docs/work-packages/W2-04/independent-consumer-handoff.md)。当前CAP41/88、原工作包22/36、来源428登记/54 registry（非去重论文）；规划同逻辑内存检查10正10反+10故意变异PASS，独立Node文件执行、真实数据库强杀、跨域消费者、17 Owner正式会签和L3评审均NOT_RUN/PENDING。

## 2026-10-25｜CAP-06-02工序与几何联合搜索（L3待审，仅规划）
[业务规格](docs/capabilities/CAP-06-02/README.md) · [GUI/3D](docs/capabilities/CAP-06-02/UI.md) · [10公开来源](research/sources/CAP-06-02.json) · [10规则/20正反](research/traces/CAP-06-02.json) · [独立消费者](docs/capabilities/CAP-06-02/independent-consumer-handoff.md)。累计详细CAP41/88、原包21/36、来源登记420条/53 registry；规划合成30/30 PASS，产品/消费者/Owner/L3 NOT_RUN/PENDING。历史数字见tracking/progress.json。

## 2026-10-25｜原W2-03版本化依赖图与局部失效（仅规划）
[10项原编号实施子任务](docs/work-packages/W2-03.md) · [单Babylon/左TaskPanel](docs/work-packages/W2-03/UI.md) · [9公开来源含2026年NIST最终版](research/sources/W2-03.json) · [10规则20正反](research/traces/W2-03.json) · [独立消费者](docs/work-packages/W2-03/independent-consumer-handoff.md)。规划进度CAP40/88、原包21/36、研究来源410条登记/52 registry；内存合成30/30 PASS，独立Node文件/真实产品/Owner/L3均NOT_RUN/PENDING。历史快照以progress为准。

## 2026-10-25｜原W2-02候选采纳、局部冻结与显式冲突（规划待L3）
[原编号实施10子任务](docs/work-packages/W2-02.md) · [单Babylon/左TaskPanel](docs/work-packages/W2-02/UI.md) · [8公开来源](research/sources/W2-02.json) · [10规则20语义正反](research/traces/W2-02.json) · [独立交接](docs/work-packages/W2-02/independent-consumer-handoff.md)。累计详细CAP40/88、原包20/36、来源401登记/51 registry；规划Oracle结构自查PASS，独立Python文件及真实产品/Owner/L3 NOT_RUN/PENDING。旧段落仅为历史进度快照。

## 2026-10-25｜CAP-06-01无规划自主求解（规划待L3）
[业务规格](docs/capabilities/CAP-06-01/README.md) · [单Babylon GUI](docs/capabilities/CAP-06-01/UI.md) · [10来源](research/sources/CAP-06-01.json) · [10规则20正反](research/traces/CAP-06-01.json) · [消费者](docs/capabilities/CAP-06-01/independent-consumer-handoff.md)。累计CAP40/88、原包19/36，来源393登记/50 registry（非去重论文）；独立Python/产品/Owner/L3均NOT_RUN/PENDING。以下历史数据以progress为准。

## 2026-10-25｜W2-01 A/B接管与分阶段流程（原编号、仅规划）
[实施及10子任务](docs/work-packages/W2-01.md) · [统一左TaskPanel/单Babylon](docs/work-packages/W2-01/UI.md) · [8合法来源](research/sources/W2-01.json) · [10规则20正反](research/traces/W2-01.json) · [独立D06/D05消费者](docs/work-packages/W2-01/independent-consumer-handoff.md)。正式详细CAP39/88、原包19/36、383条来源登记/49 registry。未启用CI，产品/Owner/L3/独立消费者NOT_RUN/PENDING；以下旧快照以tracking/progress.json为准。

## 2026-10-25｜CAP-05-08 D05规划校核与交接（仅规划）
[业务](docs/capabilities/CAP-05-08/README.md) · [单Babylon/统一左TaskPanel](docs/capabilities/CAP-05-08/UI.md) · [8合法来源](research/sources/CAP-05-08.json) · [10规则20正反](research/traces/CAP-05-08.json) · [D06首消费者、D09需D07/D08](docs/capabilities/CAP-05-08/independent-consumer-handoff.md)。正式详编39/88 CAP、原包18/36、研究375登记/48 registry。合成10正10反V8 PASS；Node文件执行、产品/Owner会签/L3全NOT_RUN/PENDING，规划PASS≠产品PASS；以下历史进度快照以tracking/progress.json为准。

## 2026-10-25｜CAP-05-07 D05计划修订与语义差异（仅规划）
[业务](docs/capabilities/CAP-05-07/README.md) · [单世界GUI](docs/capabilities/CAP-05-07/UI.md) · [8来源](research/sources/CAP-05-07.json) · [10规则20正反](research/traces/CAP-05-07.json) · [独立消费者](docs/capabilities/CAP-05-07/independent-consumer-handoff.md)。详细CAP38/88、原包18/36，研究登记367条/47 registry。Node文件执行/产品/Owner/L3均NOT_RUN/PENDING；历史段落数字为快照，以tracking/progress.json为准。

## 2026-10-25｜E3-02 D12后处理配置与NC来源（仅规划）
[原工作包](docs/work-packages/E3-02.md) · [GUI](docs/work-packages/E3-02/UI.md) · [9来源](research/sources/E3-02.json) · [10规则20正反](research/traces/E3-02.json)。CAP37/88、原包18/36、359来源登记/46 registry。纠正旧索引342与45 registry实和350不一致；产品/D13/Owner/L3未完成。

## 2026-10-25｜E3-01中立CL与进退刀/弧段策略（待L3）
[原工作包](docs/work-packages/E3-01.md) · [GUI/3D](docs/work-packages/E3-01/UI.md) · [8来源](research/sources/E3-01.json) · [10规则20正反](research/traces/E3-01.json) · [D12独立交接](docs/work-packages/E3-01/independent-consumer-handoff.md)。CAP 37/88，原包17/36，研究350登记/45 registry（非去重）；Node/Python独立文件测试、产品/Owner/L3均NOT_RUN/PENDING；main未合并。旧内容是历史快照。

## 2026-10-24｜CAP-05-06 局部冻结与冲突管理（规划待L3）
[规格](docs/capabilities/CAP-05-06/README.md) · [GUI/3D](docs/capabilities/CAP-05-06/UI.md) · [8来源](research/sources/CAP-05-06.json) · [10规则/20正反](research/traces/CAP-05-06.json) · [独立消费者](docs/capabilities/CAP-05-06/independent-consumer-handoff.md)。详细CAP**37/88**、工作包**16/36**，342登记/44 registry；Node独立执行/真实产品/Owner/L3仍NOT_RUN/PENDING。下文数字为历史快照。

## 2026-10-24｜CAP-05-05 求解候选接管（仅规划，待L3）
[业务规格](docs/capabilities/CAP-05-05/README.md) · [GUI/3D](docs/capabilities/CAP-05-05/UI.md) · [合成DTO](docs/capabilities/CAP-05-05/contract.example.json) · [7来源](research/sources/CAP-05-05.json) · [10规则20正反](research/traces/CAP-05-05.json) · [独立消费者](docs/capabilities/CAP-05-05/independent-consumer-handoff.md)。远端规划正式累计详细CAP36/88、原工作包16/36、研究334登记/43 registry；D06多解接管仅生成新D05修订，不覆盖D08冻结或伪授予NC验证。产品/Node文件/消费者NOT_RUN。以下旧数据均为历史快照。

## 2026-10-24｜E3-06 受控发布与离线交付（规划待L3评审）
[实施原工作包](docs/work-packages/E3-06.md) · [GUI/3D](docs/work-packages/E3-06/UI.md) · [离线清单](docs/work-packages/E3-06/offline-manifest.example.json) · [10来源](research/sources/E3-06.json) · [10规则/20正反](research/traces/E3-06.json)。正式详细CAP35/88、原工作包16/36，研究登记327条/42 registry；所有真实NC/签名/独立D17 NOT_RUN。旧段数字仅历史快照。

## 2026-10-24｜CAP-05-04 工艺模板与复用（规划待L3评审）
[业务规格](docs/capabilities/CAP-05-04/README.md) · [GUI/3D](docs/capabilities/CAP-05-04/UI.md) · [合成模板契约](docs/capabilities/CAP-05-04/contract.example.json) · [8来源](research/sources/CAP-05-04.json) · [10规则/20正反](research/traces/CAP-05-04.json)。正式详细CAP35/88、原编号工作包15/36，研究登记317条/41registry；Node文件/真实产品和独立消费者NOT_RUN。以下旧统计均为历史快照。

## 2026-10-24｜E3-05 独立NC程序级验证实施规划（仅规划）
[原工作包](docs/work-packages/E3-05.md) · [GUI/3D](docs/work-packages/E3-05/UI.md) · [8维覆盖](docs/work-packages/E3-05/verification-matrix.json) · [9来源](research/sources/E3-05.json) · [10规则/20正反](research/traces/E3-05.json)。正式详细CAP34/88、工作包15/36、研究登记309条/40 registry、工作包追踪13项。离散干涉不能冒充连续证明；控制器未知必须UNKNOWN；产品/独立D16 NOT_RUN。以下旧数字为历史快照。

## 2026-10-24｜E3-04 两机型轴运动展开（仅规划）
[原实施包](docs/work-packages/E3-04.md) · [界面/3D](docs/work-packages/E3-04/UI.md) · [三轴/AC合成样例](docs/work-packages/E3-04/machine-cases.json) · [9来源](research/sources/E3-04.json) · [10规则/20正反](research/traces/E3-04.json)。**详细CAP34/88、原工作包14/36、来源300条/39 registry、工作包研究追踪12项**；真实B5机床构型校准/产品D14/独立D15均NOT_RUN。以下历史统计仍是快照，以台账为准。

## 2026-10-24｜CAP-05-03人工编辑与重排（规划）
[业务](docs/capabilities/CAP-05-03/README.md) · [GUI/3D](docs/capabilities/CAP-05-03/UI.md) · [9来源](research/sources/CAP-05-03.json) · [10规则20正反](research/traces/CAP-05-03.json)。详细CAP34/88、工作包13/36、来源291条/38 registry；L3与产品/独立消费者NOT_RUN。以下为历史快照。

## 2026-10-24｜E3-03 NC控制器语义适配（原编号、仅规划）

[原工作包](docs/work-packages/E3-03.md) · [接口](docs/work-packages/E3-03/contract.example.json) · [9来源](research/sources/E3-03.json) · [10规则20正反](research/traces/E3-03.json)。正式详细CAP33/88、工作包13/36、研究登记282条/37 registry；D13未知语义UNKNOWN、真实控制器与独立D14/D15 NOT_RUN。以下为历史快照，实时以tracking/progress.json为准。

## 2026-10-24｜B0-06 团队责任、ADR与本地验收模板（仅规划）

[原工作包](docs/work-packages/B0-06.md) · [受管接口及GUI](docs/work-packages/B0-06/contracts-and-ui.md) · [17资产Owner候选](docs/work-packages/B0-06/owner-candidates.json) · [9来源](research/sources/B0-06.json) · [10规则20正反](research/traces/B0-06.json)。正式CAP33/88、原编号工作包**12/36**、来源登记**273条/36 registry**、工作包研究追踪10项，L3、人类签署、产品测试与独立消费者NOT_RUN。已有B0-02的R-GOV-001不覆盖，新增R-TEAM-GOV-001。后文旧统计为历史快照，实时以tracking/progress.json为准。

## 2026-10-24｜CAP-05-02 策略与工艺参数（仅规划）

[业务](docs/capabilities/CAP-05-02/README.md) · [GUI](docs/capabilities/CAP-05-02/UI.md) · [9来源](research/sources/CAP-05-02.json) · [10规则20正反](research/traces/CAP-05-02.json)。已入库详细CAP33/88、原工作包11/36、来源264条/35registry、CAP追踪33项；L3及产品/消费者NOT_RUN。下文旧快照以tracking/progress.json为准。

## 2026-10-24｜CAP-05-01 工艺路线与工序树（仅规划）

[业务规格](docs/capabilities/CAP-05-01/README.md) · [GUI/3D](docs/capabilities/CAP-05-01/UI.md) · [离线概念原型](docs/capabilities/CAP-05-01/prototype.html) · [8来源](research/sources/CAP-05-01.json) · [10规则20验收](research/traces/CAP-05-01.json)。详细CAP32/88、原工作包11/36、研究来源255条/34registry；L3/产品/独立消费者NOT_RUN。下文旧数字属历史快照，以tracking/progress.json为准。

## 2026-10-24｜CAP-08-01后处理管线已编制（仅规划）

[规格](docs/capabilities/CAP-08-01/README.md) · [界面](docs/capabilities/CAP-08-01/UI.md) · [8来源](research/sources/CAP-08-01.json) · [10规则20正反](research/traces/CAP-08-01.json)。详细CAP31/88、实施包11/36、来源247条/33registry；产品/D13/D15均NOT_RUN。后文数字是历史快照，以tracking/progress.json为准。

## 2026-10-20｜CAP-04-08装夹影响检查正式规划（规划非产品）

[业务规格](docs/capabilities/CAP-04-08/README.md) · [GUI/3D](docs/capabilities/CAP-04-08/UI.md) · [来源追踪](research/traces/CAP-04-08.json) · [影响矩阵](docs/capabilities/CAP-04-08/impact-matrix.json)。详细CAP30/88、原实施包11/36，研究CAP追踪30项、来源登记239条/32 registry。静态间隙/布尔候选不等于动态NC安全；L3与产品/独立消费者NOT_RUN。下方旧快照仅供历史追溯。

## 2026-10-20｜CAP-02-01机床资源构型研究补证（规划非产品）

[补证](docs/capabilities/CAP-02-01/RESEARCH-BACKFILL.md) · [UI](docs/capabilities/CAP-02-01/UI-DELTA.md) · [7来源](research/sources/CAP-02-01.json) · [10规则20验收](research/traces/CAP-02-01.json)。详细CAP29/88、实施包11/36、研究追踪29项、研究来源232条/31 registry。L3与产品/独立消费者NOT_RUN；下面为历史快照。

## 2026-10-19｜CAP-01-06统一任务与事件中心研究补证（新入库）

[详细补证](docs/capabilities/CAP-01-06/RESEARCH-BACKFILL.md) · [研究专题](research/topics/R-TASK-001.md) · [8官方来源](research/sources/CAP-01-06.json) · [10规则/20正反验收](research/traces/CAP-01-06.json)。**详细CAP29/88、工作包11/36、CAP研究追踪28项、来源225条/30registry**。运行成功不等于成果采纳、D15工程验证或D16发布；Host取消/乱序/晚回执及统一左TaskPanel均已给出可机器验证的正反规格。L3待审、Python和产品/独立消费者NOT_RUN；后文进度为历史快照，实时以tracking/progress.json为准。PR#1仍Draft。

## 2026-10-19｜CAP-04-04工件坐标系与变换图已编制（以台账为准）

[详细业务规格](docs/capabilities/CAP-04-04/README.md) · [GUI/3D任务](docs/capabilities/CAP-04-04/UI.md) · [来源/规则/20正反验收](research/traces/CAP-04-04.json) · [规划核验记录](tracking/verification-CAP-04-04-2026-10-19.json)。**正式CAP29/88、工作包11/36、来源登记217条/29 registry、CAP研究追踪27项**。L3与独立消费者/产品/机床测试NOT_RUN，PR#1仍Draft。旧段落作为历史快照保留。

## 2026-10-19｜CAP-04-05 多Setup与转序已编制（最新，以台账为准）

新增[CAP-04-05详细规格](docs/capabilities/CAP-04-05/README.md)、[GUI/3D](docs/capabilities/CAP-04-05/UI.md)、[研究追踪](research/traces/CAP-04-05.json)和[独立验收规格](docs/capabilities/CAP-04-05/fixtures.json)。正式统计更新为**28/88 CAP、11/36实施级工作包、CAP研究追踪26项、210条来源登记/28个registry**。原编号不变，L3待人类评审；Python脚本/产品Rust/TS/OCCT、独立消费者、实际NC和机床测试NOT_RUN。CAP-04-04、CAP-01-06、CAP-02-01待入库，历史附件审计与17资产接口会签待办；PR#1保持Draft、main未合并。

## 2026-10-19｜规划最新入库状态（此前段落保留为历史快照）

以[进度台账](tracking/progress.json)为准：**CAP 27/88，实施级工作包11/36，研究登记202条/27 registry，CAP追踪25项、工作包追踪9项**；PR#1仍Draft、main未合并。新增[B0-05原工作包规划](docs/work-packages/B0-05.md)，含逐SHA依赖、GUI/CLI/Agent统一入口、7来源10规则20正反验收及Solver PR#125已合并的最新元数据纠偏。L3待评审，规划结构检查不代表产品、实机或独立消费者通过。其余待入库CAP-04-04、CAP-01-06、CAP-02-01及历史原始附件仍为待办。

## 2026-10-19｜CAP-04-02 毛坯/零件定位配准新编（规划分支）

完成[CAP-04-02业务规格](docs/capabilities/CAP-04-02/README.md)、[五步GUI与单Babylon世界交互](docs/capabilities/CAP-04-02/UI.md)、[七项官方/研究来源及阅读深度](research/sources/CAP-04-02.json)、[十条规则及20项正反验收](research/traces/CAP-04-02.json)、[合成坐标数学样例](docs/capabilities/CAP-04-02/math-examples.json)。**详细CAP 26/88，工作包10/36，来源登记167条（22个registry）**。D04配准与D10执行绑定分开；bbox并非实体包含证明，CL预览不等于NC验证。所有L3审批和产品验收仍未执行；本分支PR#1保持Draft且main未合并。

# Procet Studio｜开发规划与业务设计

## 2026-10-19｜十项规划证据缺口补齐（仅规划完成）

已补齐来源注册与规则/验收：CAP-01-01/02/03研究补证、CAP-03-06/08、CAP-04-01、B0-01/02/04、F1-05，合计来源160条登记记录、完整CAP **25/88**、实施级工作包**10/36**。原有CAP-03-06来源和校验脚本取自真实对话附件；其余缺失材料按原规格/官方来源重新编制，不冒称恢复旧字节。[迁移与残余历史缺口](tracking/pending-source-gaps-2026-10-19.json)。全部设计待人类评审、产品测试NOT_RUN、PR#1 Draft/main未合并。

## 2026-10-19｜此前分批入库快照（历史）

本次已通过同一个Draft PR分支入库 **CAP 22/88、实施级工作包 6/36、研究来源登记 120 条**；main未合并。新增加5项完整CAP：CAP-03-02、CAP-03-03、CAP-03-04、CAP-03-05、CAP-03-07，以及F1-04工作包。CAP-01-04与CAP-01-05已有规格的研究补证已入库。另有部分项目仅主文或追踪入库、缺少来源或附件，详见[缺口登记](tracking/pending-source-gaps-2026-10-19.json)；不得据此增加完整项计数。L3待评审、全部产品验收未执行。

## 以下为2026-10-18历史进度快照（非最新）


本仓维护Procet-*的业务、界面、数据、模块接口、实施任务和研究依据。逐项Git交付，不打ZIP；文档编制、设计批准、产品实现和验收分别记录。

## 最新交付：CAP-03-01 CAD导入与几何读取

2026-10-18新增[业务规格](docs/capabilities/CAP-03-01/README.md)、[GUI/3D任务与字段](docs/capabilities/CAP-03-01/UI.md)、[R-CAD-001理论专题](research/topics/R-CAD-001.md)、[正反例](docs/capabilities/CAP-03-01/fixtures.json)与[逐项规则追踪](research/traces/CAP-03-01.json)。**纠偏：AP242现行引用应以2025 Edition 4为准**，2022版已撤回；CAD导入不应自动等于CAM Job/Setup/制造资格。详细规格17/88、工作包5/36；产品尚未验收。

## 前轮交付：F1-03公共面与领域副本

2026-10-18完成原本地草案复核与入库整理：[F1-03实施规划](docs/work-packages/F1-03.md)、[接线与边界审计矩阵](docs/work-packages/F1-03/01-boundary-audit-and-contracts.md)、[R-BOUND-001研究](research/topics/R-BOUND-001.md)、[来源登记](research/sources/F1-03.json)、[规则追踪](research/traces/F1-03.json)。10项实施子任务、10条设计规则、20条产品验收规格，均待评审/产品执行。

本轮复读CAM现有CamService、ports和边界审计：复用既有服务；修正“能力登记等于本次调用许可”的歧义；增加固定审计文件列表、内联path、请求路由和回退的覆盖要求。只修改规划仓，不修改产品代码。

## 统一导航

| 入口 | 内容 |
|---|---|
| [架构基线V0.8](docs/architecture/v0.8/README.md) | 11域、88项候选、36个工作包、17类业务资产 |
| [业务能力导航](docs/capabilities/README.md) | 当前16项详细稿，未列能力仍待深化 |
| [实施工作包](docs/work-packages/README.md) | 当前5项详细稿，原编号与依赖保留 |
| [数据Owner映射](docs/architecture/v0.8/C0-C1-reference-crosswalk.md) | 17类数据责任；不是字段级冻结 |
| [研究工作台](research/README.md) | 9个专题与规则追踪，前10项CAP补证仍待办 |
| [研究来源总索引](research/source-index.json) | 原61条登记＋本轮8条补充，按记录数统计，非去重原文数 |
| [进度台账](tracking/progress.json) | 编制/研究/评审/实现/验收分别计数 |
| [持续规划任务](tracking/planning-automation.json) | 范围、节奏和结束条件；实时状态以自动任务服务为准 |
| [协作规则](AGENTS.md) | 只改规划、安全、版权、非强制提交和回读要求 |
| [迁移待办](tracking/migration-2026-10-16.md) | 核心已迁，历史JSON/示例/脚本/支持附件尚待审计 |
| [变更记录](CHANGELOG.md) | 本轮和完整历史记录 |

## 进度与分支

规划分支包含详细CAP16/88、实施级工作包5/36、CAP研究追踪6项、工作包追踪3项。源记录合计69条，其中原61条访问记录原样保留，本轮重新读取8个专题来源。全部设计待评审、产品未验收，不能按来源数量认定领域研究完成。

本轮维护分支为gpt-ai/plans/cap-02-07-20261017。开始时main为271f2ad0、分支为6f906e32，main尚不含CAP-02-07/08。是否合并或存在PR必须读取GitHub实时状态，不能从本README自动推定。

下一项CAP-03-01「CAD导入与几何读取」；相关工作包F1-04按依赖推进，前10项研究补证和必要附件迁移穿插进行。

## 原型与验证边界

首批[界面总图](docs/capabilities/batch01-v0.9.1/02_界面设计/业务驱动界面总图.md)和[交互HTML](docs/capabilities/batch01-v0.9.1/02_界面设计/交互评审工作台.html)仍为示意原型，不是生产接线。GitHub展示HTML源码，未部署在线预览。

本轮核验见[记录](tracking/verification-F1-03-2026-10-18.md)。旧22项或6项数学测试是历史记录，不自动算本轮PASS。没有运行产品Rust/TS/OCCT/Windows EXE、真实动态消费者图或数据库回退验收。

公开仓库禁止密钥、授权URL、客户数据、未授权模型、私有源码整段镜像或标准手册盗版全文。保持一个Babylon主交互世界、统一任务容器与领域入口；CL→NC→执行语义→轴运动→验证→发布的责任边界不变。


## V0.8终核交接（2026-10-29）

[第二轮17资产风险、来源边界与独立消费者门禁](docs/architecture/v0.8/V08最终风险与交接第二轮_2026-10-29.md)：含11域风险、10原编号零边包待审、17资产Owner/消费者待办以及204项合成正反门禁。最终人类签署和真实NC/OCCT/B5测试未执行，规划PASS≠产品PASS。


## 2026-10-29｜V0.8引用与历史证据第四轮

[本轮逐文件SHA冻结与部分链接审计](docs/architecture/v0.8/第四轮Markdown链接审计与跨HEAD失效_2026-10-29.md)：96份GitHub Blob、290项启发式相对目标，仍需全仓AST/锚点审计与历史原字节风险处置。17 Owner签署/独立消费者、L3与真实NC/B5均未验收。规划PASS≠产品PASS。
