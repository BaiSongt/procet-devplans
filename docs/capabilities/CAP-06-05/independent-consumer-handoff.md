# CAP-06-05｜D07独立消费者验收与交接
Owner为06域，正式跨域接口仍待17资产Owner签署。07域不能直接修改D07，05域管理D08，04域D04名义Setup与D10机床执行绑定分离。交接必须包含三类不同哈希：**原始封存B-Rep字节hash、状态元数据及有序依赖hash、产品代码/算法二进制hash**。不得用同一字面SHA字符串冒充三者。

## 无界面真实进程合同
测试进程与被测06域及独立D07消费者须为隔离进程/实际受管Port、可重启持久存储，独立构建SHA和退出码。读取一份合法的封存STEP/OCCT B-Rep以及two-Setup+two-Branch输入；逐案比对D04 Frame、父状态、去料实体、Child StateRef、实际B-Rep bytesHash、BRepCheck、Solid体积与保护区、生成/修改/删除映射。不能用本仓fixtures或同一个生产算法自测自己的结论。

## 真实正反负例及故障注入
- 正例：真实闭合Solid有序去料、单Setup多工序、同父A/B多候选、S1局部重算而S2/D08旧修订字节不变、修补生成新状态而父状态仍可精确读取。
- 反例：父修订失踪或环、CRC/hash不符、Frame非可逆/方向错误、前序状态被初始毛坯覆盖、保护区交叉、相切退化、未知OCCT容差、算法版本变化误重用旧hash；每类应FAIL或UNKNOWN而非吞错。
- 竞态：在Staging/Seal/Owner-CAS/Receipt持久化四切点强杀重启；发生并发HEAD变更、撤权/任务代次变化与cancel后晚回执，各案须证明唯一终态并可重新读取。未知恢复证据输出UNKNOWN_RECOVERY。独立SQLite不推定跨库ACID。
- 资格：即便D07独立结果PASS，也只为D08人工冻结前置；D09→D12→D13→D14→D15→D16独立交接。若D13语义未知或D15覆盖不足，D16不得通过。CL预览不算NC程序级验证，不开发材料扫掠仿真。

## 记录要求与回退
必须报告完整命令、运行日期、OS、OCCT版本/commit、产品exact HEAD、二进制SHA、输入几何实际SHA、OwnerPort版本、测试样例哈希、进程PID、stdout/stderr SHA、退出码和D01–D17实际引用闭包。缺少证据标NOT_RUN；合成规划和正式产品分列。迁移采用expand/migrate/contract，旧reader保持只读直到消费者签署，禁止删除用户数据库，失败停写并回退兼容reader。17资产正式签字及L3仍PENDING_HUMAN。
