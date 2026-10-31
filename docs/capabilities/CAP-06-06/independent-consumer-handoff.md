# CAP-06-06｜独立消费者交接（06→05、D07、07域）
独立消费者必须在**独立进程/独立代码路径**用实际锁版B-Rep读取D06候选的`inputRefs/frontierSeal/candidateLineage`，由06域Owner持久化一条受控D06修订，后由独立D07几何检查者复核材料状态与保护区。05域独立消费候选只能`preview/accept_as_new_draft`，绝不直接覆盖D08。真实`D09`只有获得独立合格D07+D08 exact冻结，才可交07域；后续NC链只能由D12-D16独立实现/复核。

**独立验收清单**：固定工程/文档/Setup和帧哈希；真实模型来源合法且可重放；进程运行命令及binary hash；OCCT版本、编译参数、输入B-Rep字节哈希；Worker数量1/2/4及随机回执顺序；Boolean最大次数/墙钟/内存边界；故障注入点（reserve前、reserve后、Seal前、Seal后、CAS前、CAS后、回执前）；撤权和Head竞争；退出码及错误标准输出；重新启动后从持久回执对账；独立程序校核无冻结覆盖。只有真实进程输出证据才能把`NOT_RUN`改为`PASS/FAIL`。

交接目录建议`artifacts/cap-06-06/<locked-product-head>/<case-id>/`保存run.json、inputs.sha256、checkpoint.json、owner-receipt.json、consumer-result.json及stderr；**这是未来验收路径提议，本仓未创建测试伪文件**。风险：搜索完备性未证明，预算超时不可判无解，独立SQLite多库事务不自动成立，OCCT内核并行行为未锁版，历史迁移与17Owner签署待审批。基于真实运行失败时保留旧日志、旧checkpoint和旧reader，按新修订回退而不清理用户数据库。
