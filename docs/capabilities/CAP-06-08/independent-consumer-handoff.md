# CAP-06-08 独立消费者、强杀、冲突与安全回退
1. 隔离工程逐份记录D01/D04/D05/D07/D08的原始SHA、revision、frameHash与Owner HEAD，保存旧B-Rep字节；本地验收不能删除真实用户数据库。
2. **无GUI的真实独立进程**跑A无D05、B已冻结S1/S2而修改S3的流程，检查D06只写新分叉；05域独立进程审查采纳/D08只读历史。
3. D07 Oracle在独立进程另一路重新检查B-Rep拓扑、Boolean、保护区、岛屿、多Solid、体积残差及容差，留下二进制SHA、退出码、输入输出原始字节SHA；Solver自身标记不能冒充Oracle。
4. 用完整依赖边验证仅S3的消费者被标STALE；缺失边必须`UNKNOWN_SCOPE`，非相关Setup与冻结S1/S2原字节不得变化；B0原场景对照回放。
5. Stage前、Seal后、Owner-CAS前、回执持久化前四点强杀，重启对账重复请求、撤权、切Setup、取消任务与迟到回执。UNKNOWN_RECOVERY时不得假报PASS。
6. 在D09 CL→D12 NC→D13未知语义→D14→D15→D16各环节独立检验，不能以CL播放取得工程发布资格。D04名义Setup与D10执行绑定独立。
7. 真实测试应产出可追溯`{consumerBinarySha, processId, exitCode, inputHead, outputHead, ownerReceiptHash, recoveredStatus}`。任何本文件提供的合成规则不得称为真实产品通过。
8. 迁移回退只切换读取指针/版本路由，保留legacy reader、原冻结快照、原库、原失败回执，不双写、不force。

**当前**：independentNode=NOT_RUN；OCCT=NOT_RUN；跨域消费者=NOT_RUN；NC/机床=NOT_RUN；17Owner会签及L3=PENDING_HUMAN。规划PASS≠产品PASS。
