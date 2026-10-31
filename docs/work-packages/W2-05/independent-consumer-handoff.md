# W2-05｜跨域独立消费者交接
[实施](../W2-05.md) · [合成测试](fixtures.json) · [Owner候选](asset-owner-candidates.json)

需另一独立进程直接读取真实03域D02、04域D04、05域D05/D08的Owner端口和持久层，并保留离线可重放测试库；不得以GUI mock或合成JSON冒充产品消费者PASS。准备两个Setup A/B、Feature f1→Step s1+s2、Step s1→Feature f1+f2、D08已冻结和一条A→B显式Frame迁移。

**独立正反验收**：① 重启后直接切B仍取B已存在Feature/Plan，识别运行次数不增长；② 稳定多对多关系不因排序/重排错绑；③ 修改A仅导致确实依赖A的派生结果失效，B独立原始hash与冻结D08保留；④ 缺源不冒充空；⑤ 清除投影后重建与旧源闭包一致，权威写次数0；⑥ 翻面链方向、单位、逆变换和材料独立验证；⑦ 撤权/并发Head/晚回执不能写入或覆盖另一个Setup。产物包括确切版本/hash/frame、环境SHA、真实查询日志、assert和exit code。

下游独立验证另行进行：D09需D07+D08；最终D12 NC→D13→D14→D15→D16，CL动画不可替代工程认证；未知语义UNKNOWN。真实产品/消费者/机床NOT_RUN，17资产跨域正式Owner签署和L3 PENDING_HUMAN。
