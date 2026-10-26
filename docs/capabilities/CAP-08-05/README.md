# CAP-08-05｜循环宏与子程序（V0.8，L3待审）
原始定义：**孔加工循环、宏、程序组织**；原编号工作包E3-02、E3-03、U4-04。MVP仅支持目标控制器**显式声明**的子集，绝不推定FANUC/SINUMERIK/B5通用支持。L1/L2不变，L3待人类评审。

## 端到端业务与资产界面
D03制造资源档案管理刀具信息（不是D06求解候选），D04 Setup管理毛坯与零件定位，D10管理实际上机绑定。D09中立CL是输入来源，D12后处理产生最终NC字节。**D13必须独立重读D12最终NC**，基于精确Profile、固件、选件、程序包闭包hash解释循环/宏/子程序；其每一条展开动作记录`{ncBytesHash,physicalLine,callStack,iteration,modalBefore,modalAfter,frameId,scopeEpoch,semanticStatus}`。D14将已解释的动作与D10运动链展开为轴时序，D15独立NC工程验证，D16按组合证据放行；UNKNOWN/NOT_RUN/STALE均不能发布。CL动画不能冒充NC工程验证，不做材料扫掠仿真。D08冻结修订不可覆盖，A/B共享事实而不互相覆盖冻结。

## 十项工程任务、来源与可机检字段
1. **NC/方言/Profile/Setup/绑定精确锁**：`identity.ncHashPinned`, `identity.profilePinned`, `identity.d04Separate`, `identity.d10Exact`；来源C085-S1/C085-S6；资产D04/D10/D12/D13；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P01`、反例`CAP-08-05-T-N01`、独立字段变异`CAP-08-05-M01`。
2. **G80/G81/G83循环白名单与取消**：`cycle.whitelistPinned`, `cycle.g80Tracked`, `cycle.retractModalKnown`, `cycle.unknownFailClosed`；来源C085-S2/C085-S4；资产D12/D13/D15；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P02`、反例`CAP-08-05-T-N02`、独立字段变异`CAP-08-05-M02`。
3. **G83啄钻Q、Z目标、R平面有效性**：`drill.finiteDepth`, `drill.peckPositive`, `drill.rPlaneValid`, `drill.noFalseSafety`；来源C085-S2/C085-S4；资产D04/D10/D13/D14；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P03`、反例`CAP-08-05-T-N03`、独立字段变异`CAP-08-05-M03`。
4. **G98/G99返回平面、G90/G91模态前后态**：`modal.entryKnown`, `modal.g98g99Scoped`, `modal.distanceKnown`, `modal.transitionsTraced`；来源C085-S2/C085-S4；资产D10/D12/D13；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P04`、反例`CAP-08-05-T-N04`、独立字段变异`CAP-08-05-M04`。
5. **M97/M98/O call 程序闭包与路径约束**：`subprogram.dialectKnown`, `subprogram.targetResolved`, `subprogram.closureHashed`, `subprogram.noTraversal`；来源C085-S1/C085-S3；资产D12/D13；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P05`、反例`CAP-08-05-T-N05`、独立字段变异`CAP-08-05-M05`。
6. **局部参数、全局副作用和未知厂商宏**：`parameters.scopeKnown`, `parameters.globalWritesTraced`, `parameters.vendorMacroAllowlisted`, `parameters.unknownBlocked`；来源C085-S1/C085-S3；资产D12/D13；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P06`、反例`CAP-08-05-T-N06`、独立字段变异`CAP-08-05-M06`。
7. **调用深度、循环展开预算及主M99**：`budget.callDepthBounded`, `budget.stepsBounded`, `budget.mainM99Unknown`, `budget.cancelFence`；来源C085-S1/C085-S8；资产D13/D15；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P07`、反例`CAP-08-05-T-N07`、独立字段变异`CAP-08-05-M07`。
8. **源NC行/调用栈/迭代到D14消费来源**：`lineage.physicalLineMapped`, `lineage.callStackCaptured`, `lineage.typedEvents`, `lineage.d14NoCLSubstitution`；来源C085-S5/C085-S7；资产D09/D12/D13/D14；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P08`、反例`CAP-08-05-T-N08`、独立字段变异`CAP-08-05-M08`。
9. **GUI/CLI/Agent单Owner入口及权限并发**：`commit.singlePort`, `commit.casAclRechecked`, `commit.generationCancelChecked`, `commit.d08Frozen`；来源C085-S6/C085-S7；资产D08/D12/D13；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P09`、反例`CAP-08-05-T-N09`、独立字段变异`CAP-08-05-M09`。
10. **D15独立验证、UNKNOWN阻发布和迁移回退**：`release.d13ReparseIndependent`, `release.d15Independent`, `release.unknownBlocksD16`, `release.historyPreserved`；来源C085-S5/C085-S7；资产D12/D13/D15/D16；原包E3-02/E3-03/U4-04；正例`CAP-08-05-T-P10`、反例`CAP-08-05-T-N10`、独立字段变异`CAP-08-05-M10`。

## 控制器语义与失败语义
G80取消、G81基础钻孔、G83带Q啄钻、G98/G99返回平面、G90/G91距离模态必须依Profile、单位、作用域逐步展开。LinuxCNC 2.9的O-call局部#1–#30与编号M98参数持久化不同；Haas M97本地N行与M98外部O程序也不同，不能用一个正则模板替代控制器。程序闭包含调用目标、搜索根、路径白名单、字节hash、参数绑定、调用栈。未知宏、外部文件缺失、歧义引用、越界路径、主程序M99无限执行风险、递归/循环预算耗尽返回REJECT或UNKNOWN；预算为规划软件自身保守门限，并非厂商认证值。必须显示物理NC行+展开路径，不以N号作为唯一来源锚点。

## 统一端口、GUI和并发
GUI/CLI/Agent均使用08域Owner UseCase和Port，不得直接改D13。入参含`assetId,revision,contentHash,schemaVersion,frameId,scopeEpoch,ACL`及任务代次；提交前再验CAS、权限、Frame、scopeEpoch、取消与晚回执。单Babylon世界、左侧UnifiedTaskPanel、≤12px、仅浅/深主题；预览不等于提交/设备ACK。见[GUI/3D](UI.md)及[契约样例](contract.example.json)。D12、Profile、依赖程序字节、D04、D10修改使下游D13–D16旧证据STALE，保留旧Reader/用户数据库/golden与发布修订，采用Expand→Migrate→Contract配对回退。

## 逐项研究与独立验收
[8份真实来源及阅读范围](../../../research/sources/CAP-08-05.json) → [理论推导](../../../research/topics/R-CYCLES-MACROS-001.md) → [规则-字段-CAP-包-验收](../../../research/traces/CAP-08-05.json) → [30正反/独立变异+8语义场景](fixtures.json) → [规划Node校验工具](../../../tools/check_cap0805_planning_2026_10_26.cjs) → [独立消费者交接](independent-consumer-handoff.md)。[17资产Owner候选](asset-owner-candidates.json)仅供接口会签，非正式人类批准。规划合成不代表真实控制器或机床通过，Node文件环境与真实NC/独立消费者仍NOT_RUN；**规划PASS≠产品PASS**。
