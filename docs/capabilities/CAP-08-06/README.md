# CAP-08-06｜NC源码与编辑（V0.8，L3待审）

**原始88项业务目标**：NC源码与编辑——文本预览、人工编辑和版本记录。保持原编号 `E3-02/E3-03/U4-04`、11个L1/L2与88项CAP基线，不暗扩分母。完整控制器支持与实机许可未验证。

## 业务全流程

用户从NC工作台打开**D12已生成或导入的原始NC文件**，先确认真实bytes、编码/BOM、行结束、Profile与所引用的外部子程序闭包；显示时可以规范化视觉缩进，但**不得因展示重写字节**。用户对受控副本编辑并查看可逆差异，在提交时由08域Owner重新核对源revision/hash、ACL/CAS、Frame、scopeEpoch、taskGeneration、取消状态；成功生成**新的D12修订**，旧D12及D08冻结、D16已发布记录不覆盖。D09中立CL与人工NC编辑明确分支，不把人工编辑伪写回CL。

新D12导致D13独立从**最终NC原始字节**再解释控制器模态、外部程序闭包、宏与循环；再由D14展开实际机床轴时序，D15进行独立工程验证，D16才可以审查发布资格。D04管理工艺Setup，D10绑定实际机床/刀具/控制器，二者不同；D03管理资源刀具，D06是求解候选。D11 CL播放或3D高亮仅供预览，**不是NC工程验证**；未知控制器语义为`UNKNOWN`、未验证为`NOT_RUN`，均不得发布；本轮不做材料扫掠仿真。

## 十项实现任务与规则追踪

1. **NC字节存储与编码**：D12 Owner保留原始byte[]、编码/BOM/EOL、哈希；未知编码只读隔离，不转换覆盖。字段 `bytes.rawHashPinned`, `bytes.encodingDeclared`, `bytes.bomPreserved`, `bytes.eolPreserved`；来源 `C086-S2`, `C086-S1`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P01 / CAP-08-06-T-N01 / CAP-08-06-M01`。
2. **物理行寻址**：行以字节offset+physicalOrdinal+revision定位；N号可重复/缺失，不能作全局主键。字段 `line.physicalOrdinal`, `line.repeatedNAllowed`, `line.blankLinesTracked`, `line.sourceSpansStable`；来源 `C086-S2`, `C086-S3`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P02 / CAP-08-06-T-N02 / CAP-08-06-M02`。
3. **词法视图与只读预检**：注释、普通空白、块删除及活跃注释需分层；未知方言仅诊断UNKNOWN。字段 `lex.commentsPreserved`, `lex.activeCommentsNotAssumedInert`, `lex.blockDeleteProfiled`, `lex.noBlindRewrite`；来源 `C086-S2`, `C086-S8`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P03 / CAP-08-06-T-N03 / CAP-08-06-M03`。
4. **人工编辑与提交**：编辑必须明确基于D12精确revision/hash并产生新版本；不覆已签发字节。字段 `closure.subfilesHashed`, `closure.manifestPinned`, `closure.noTraversal`, `closure.revisionImmutable`；来源 `C086-S3`, `C086-S4`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P04 / CAP-08-06-T-N04 / CAP-08-06-M04`。
5. **外部NC程序闭包**：子程序搜索根/相对路径/文件内容哈希锁定，路径越界、缺文件直接阻断。字段 `dialect.profileExact`, `dialect.syntaxOnlyLabeled`, `dialect.unsupportedUnknown`, `dialect.noUniversalGcode`；来源 `C086-S1`, `C086-S2`, `C086-S6`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P05 / CAP-08-06-T-N05 / CAP-08-06-M05`。
6. **语义差异与回溯**：展示旧/新byte差异及源行、CL映射；不能从文本相似推断语义等价。字段 `diff.byteSpanAnchored`, `diff.editorIdentityTraced`, `diff.semanticImpactNotGuessed`, `diff.oldRevisionPreserved`；来源 `C086-S2`, `C086-S4`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P06 / CAP-08-06-T-N06 / CAP-08-06-M06`。
7. **后处理再生冲突**：手工分支和D09→D12再生成结果并列，合并需显式人工处理，D08冻结不变。字段 `branch.manualAndGeneratedSeparate`, `branch.repostNoSilentOverwrite`, `branch.overlayConflictExplicit`, `branch.d08Frozen`；来源 `C086-S3`, `C086-S4`；资产 `D08`, `D09`, `D12`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P07 / CAP-08-06-T-N07 / CAP-08-06-M07`。
8. **独立执行链失效**：新D12导致D13重解析最终NC字节、D14轴时序、D15独立验证、D16发布资格全部重建。字段 `invalidate.d13ReparseRaw`, `invalidate.d14Stale`, `invalidate.d15Stale`, `invalidate.d16Blocked`；来源 `C086-S3`, `C086-S6`, `C086-S8`；资产 `D12`, `D13`, `D14`, `D15`, `D16`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P08 / CAP-08-06-T-N08 / CAP-08-06-M08`。
9. **统一入口、权限与撤销**：GUI/CLI/Agent经同一个08域UseCase，提交前重验CAS/ACL/Frame/scopeEpoch/任务代次/取消。字段 `commit.singleOwnerPort`, `commit.casAclRechecked`, `commit.frameScopeExact`, `commit.cancelLateAckBlocked`；来源 `C086-S4`, `C086-S5`；资产 `D12`, `D13`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P09 / CAP-08-06-T-N09 / CAP-08-06-M09`。
10. **独立消费者与扩展迁移**：跨团队D13使用原始NC bytes/闭包manifest负向验收；Expand→Migrate→Contract保留旧reader/golden和非破坏回退。字段 `release.independentConsumerPlanned`, `release.unknownBlocksPublish`, `release.expandMigrateContract`, `release.historyUnchanged`；来源 `C086-S3`, `C086-S4`, `C086-S5`；资产 `D12`, `D13`, `D14`, `D15`, `D16`；工作包 `E3-02/E3-03/U4-04`；正反/变异 `CAP-08-06-T-P10 / CAP-08-06-T-N10 / CAP-08-06-M10`。

## 输入输出及接口边界

输入 `sourceRef:{assetId,revision,contentHash,schemaVersion,frameId,scopeEpoch}`、`controllerProfile:{controller,firmware,optionsHash}`、原始`bytes/encoding/BOM/EOL`、`programClosureManifest`、`patch:{startByte,endByte,replacementBytesHash}`、`taskGeneration`、`ACL`、`expectedRevision`。输出仅为**候选D12修订与D13–D16失效清单**，绝不返回虚构的设备ACK。08域Owner职责：`readExact`、`previewDiff`、`proposePatch`、`commitCAS`、`invalidateDownstream`、`rollbackReference`；C0只容纳身份、hash、单位、Frame、修订与最小消息协议，不容纳NC语义巨型common。

无法证明原始编码、子文件闭包、权限、帧或Profile时，不能尝试“自动修正”后提交。示例[候选契约](contract.example.json)是合成字段，控制器语法验证由真正的D13独立完成，不把编辑器高亮或静态校验误当运动安全认证。

## UI/3D、研究及验收边界

[单Babylon与统一左TaskPanel](UI.md) · [独立消费者与失效迁移](independent-consumer-handoff.md) · [17资产候选Owner](asset-owner-candidates.json)。
[8项来源阅读深度](../../../research/sources/CAP-08-06.json) → [理论推导](../../../research/topics/R-NC-SOURCE-EDIT-001.md) → [10条规则/字段/验收映射](../../../research/traces/CAP-08-06.json) → [30条正反变异及9条语义负例](fixtures.json) → [规划工具](../../../tools/check_cap0806_planning_2026_10_26.cjs)。

源字节-控制器语义-轴动作的真实独立消费者、NC/OCCT/GUI/实机测试仍**NOT_RUN**；来源仅用于规划依据，17资产Owner会签与L3仍为**PENDING_HUMAN**。不得将规划合成PASS称作产品PASS。


## B56（2026-10-31）字节补丁专项增量｜L3待审
[UTF-16字符位置与原NC byteSpan不混用的专项研究](BYTE-EDIT-B56-2026-10-31.md) → [5项官方/内生来源](../../../research/sources/CAP-08-06-byte-edit-b56.json) → [8规则与字段可检追踪](../../../research/traces/CAP-08-06-byte-edit-b56-v08.json) → [5正62反5 UNKNOWN合成fixture](byte-edit-b56-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0806_byte_edit_b56_v08.cjs)。UTF-8 only为本轮合成范围，实际OEM编码和设备测试UNKNOWN/NOT_RUN；每次改动生成不可变新D12，D13-D15证据STALE、D16 BLOCKED，D04与D10分离；17真实消费者0/17、Owner0/17、L3待审，**规划PASS≠产品PASS**。
