# W2-06｜独立无界面消费者交接契约

## 前置实物
由质量验证独立运行者在隔离工程交付：01域Host/任务及CAS策略、03域D01/D02只读Port、04域D04 Setup与D10执行绑定Port、05域D05/D08读写Port、06域D06/D07真实求解内核，持久库备份/沙盒、固定Git HEAD/编译产物SHA、每域Port版本与独立进程日志。缺任一真实Port时目标用例为NOT_RUN，不能用本仓Mock顶替。

## 验收场景及出错门禁
A0 空D05求解：读取准确D01/D04，D06给多候选→06域D07几何证据→05域受控采纳D05→受管冻结D08→B补全；观察真实事件顺序及字节Hash。B1 只编辑Setup A一项工序，Setup B冻结哈希保持，若共享D02实际变更则按版本实例DAG传播，不硬编码B永不受影响。M1 按branch/setup/revision查询两Setup，禁止重复识别与GUI活跃态转存。C1 ACL撤销、C2 Head CAS冲突、C3取消晚回执，分别证明权威Head与D08未变。R1–R4 在Staging/Seal/Owner-CAS/回执持久化位置真实强杀重启；旧运行只允许一个可证明终态，未知保持UNKNOWN_RECOVERY。L1 只读迁移旧快照失败回退，不触达用户DB。X1 D13 UNKNOWN时D15/D16必须拒绝PASS。

## 机器输出
生成run.json和artifacts-manifest.json，必须包含：context{projectId,documentId,branchId,setupId}、exactRefs[{assetId,revision,contentHash,hashKind,frameOrNA,unitOrNA,ownerPortVersion}]、runner{pid,os,binaryHash,commitSHA,exitCode}, guards{expectedHead,observedHead,aclEpoch,generation,cancelled}, receipts[{commandId,idempotencyKey,terminalState,digest}], crashEvidence{cutpoint,processExit,recoveredHash}, testResults[{caseId,assertion,status,evidencePaths}], files[{path,sha256}]；每字段来源由真实Owner返回。任何未覆盖/缺日志/退出码/版本/签章视为UNKNOWN/NOT_RUN，不能补填合成结果。

## 提交、回退与审批
依真实领域Port提交时再验证ACL/Head/generation；失败只隔离测试项目，已存在用户工程绝不清库。D04名义Setup与D10执行机床绑定分离；D09中立CL不替代D12 NC，不以D11预演替代D15；未知执行语义UNKNOWN，D16不得发布。人类负责L3签审及17资产Owner会签。

**本仓目前只交付规划、示例字段、可执行合成规则校验；真实产品/独立消费者/强杀恢复全部NOT_RUN。**
