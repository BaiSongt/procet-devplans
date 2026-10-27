# R-RELEASE-PACK-001｜NC发布包指纹、供应链验证与离线可信边界

研究日期：2026-10-27。业务目标：在不联网生产现场冻结最终NC、刀具清单与装夹说明，形成D16**候选**而不是自称可上机发布；原E3-06与T5-03承接实施。

## 一、规范来源与推导
- [ISO 6983-1:2009官方目录](../sources/CAP-10-01.json)：仅支撑NC格式适用范围，不能凭目录定义专有控制器模式。
- LinuxCNC 2.9 §1明确程序按块组织、可由多个文件组成、M2/M30可结束执行；据此要求原始字节及依赖清单完整，但LinuxCNC示例不认证B5。
- RFC 8785 §3/Appendix F解决JSON语法表示不唯一的指纹问题；**manifest的JCS摘要≠NC原始文件SHA**。不能把双方混成一个“同文件哈希”，也不能自哈希产生循环。
- TUF 1.0.37 §2/5/6.2的角色、信任链、consistent snapshots和反回滚用于离线传输威胁建模；TUF本身是软件更新体系，不是CNC行业验收标准。
- SLSA v1.2官方“Build: Verifying artifacts”明确来源必须由消费者核对信任根、签名和参数；此处仅类比独立验证职责，**不宣称符合任何SLSA等级**。
- W3C PROV-O从Entity/Activity/derived关系抽象冻结D08→NC D12→验证D15→候选D16；具有来源链**不等于验证通过**。
- RFC 9110 §8.8/13可用于HTTP界面的ETag/If-Match条件写；本地SQLite、离线文件和进程间调用须单独落实领域CAS。
- NIST SP 800-218（仅官网摘要）与2026年CNC数字孪生论文（仅官网著录/摘要）提供安全生命周期及目的决定数据充分性的高层背景，不能推出未阅读条款或机床结论。

## 二、来源与规则表
| CAP-10-01-R01 | 原始NC字节闭包 | C1001-S01, C1001-S02, C1001-S03 | contents.ncRawShaPinned, contents.encodingAndLineEndingsPinned, contents.subprogramClosureComplete, contents.noSilentRewrite | E3-06/T5-03 |
| CAP-10-01-R02 | 刀具清单不得猜测 | C1001-S02, C1001-S06, C1001-S09 | tools.machineResourcesExact, tools.actualAssemblyPinned, tools.ncToolCallsResolved, tools.unknownToolBlocksReview | E3-06/T5-03 |
| CAP-10-01-R03 | 名义Setup与实装分离 | C1001-S06, C1001-S09, C1001-S01 | setup.nominalSetupFramePinned, setup.actualBindingFramePinned, setup.machineKinematicsRevisionPinned, setup.multiSetupNotCollapsed | E3-06/T5-03 |
| CAP-10-01-R04 | 独立D15验证门禁 | C1001-S02, C1001-S09, C1001-S06 | validation.d15OracleIndependent, validation.coverageForExactNc, validation.actualMachineBindingMatched, validation.unknownCannotPass | E3-06/T5-03 |
| CAP-10-01-R05 | 冻结A/B共享事实不覆盖 | C1001-S06, C1001-S05, C1001-S04 | freeze.d08Immutable, freeze.modeSharedSameFact, freeze.exactRevisionDependencies, freeze.noOverwriteExistingRelease | E3-06/T5-03 |
| CAP-10-01-R06 | 可重复指纹但不混Hash域 | C1001-S03, C1001-S04, C1001-S05 | manifest.jcsSchemaPinned, manifest.payloadHashesIndependent, manifest.canonicalDigestExplicit, manifest.noCircularSelfHash | E3-06/T5-03 |
| CAP-10-01-R07 | 离线包拒绝路径欺骗 | C1001-S04, C1001-S05, C1001-S08 | offline.safeRelativePaths, offline.noSymlinkTraversal, offline.caseFoldCollisionRejected, offline.receiverRehashRequired | E3-06/T5-03 |
| CAP-10-01-R08 | 统一业务端口与只读预览 | C1001-S06, C1001-S07, C1001-S08 | ui.singleOwnerPort, ui.onlyOneBabylonWorld, ui.leftTaskPanelUnified, ui.previewNotSignoff | E3-06/T5-03 |
| CAP-10-01-R09 | 提交时ACL与CAS重验 | C1001-S07, C1001-S08, C1001-S06 | transaction.aclRecheckedAtCommit, transaction.expectedRevisionHashFrameCAS, transaction.cancelEpochChecked, transaction.lateAckNoMutation | E3-06/T5-03 |
| CAP-10-01-R10 | 候选/签发/回退隔离 | C1001-S04, C1001-S05, C1001-S06 | lifecycle.candidateNotSigned, lifecycle.staleInvalidated, lifecycle.oldReleaseImmutable, lifecycle.d17FeedbackSeparate | E3-06/T5-03 |

## 三、工程非目标与负例
没有外部签发信任根、实际刀柄测量、确定控制器方言、最终NC子程序字节、D15真实Oracle覆盖或D10实机配置时，将候选标为BLOCKED_UNKNOWN。TUF/SLSA/RFC原则不能取代真实三轴/B5现场验收。CL动画、颜色/静态OCCT距离、JCS成功、U盘复制成功均不能取得工程放行资格。

逐条详见[来源读文证据](../sources/CAP-10-01.json) → [规则字段追踪](../traces/CAP-10-01.json) → [正反/独立变异](../../docs/capabilities/CAP-10-01/fixtures.json)。L3与17资产Owner待人类批准，实际产品及消费者NOT_RUN。
