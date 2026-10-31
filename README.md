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
