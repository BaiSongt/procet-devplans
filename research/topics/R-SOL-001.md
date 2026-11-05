# R-SOL-001｜受管Solver内核身份、运行归档与工程可信边界

> 编制2026-10-18｜阅读范围见[本项来源注册](../sources/F1-05.json)｜关联[F1-05](../../docs/work-packages/F1-05.md)。资料分层：公开官方文献、固定仓源码观察、Procet设计方案、产品实测（本次未执行）。**只在已阅读范围内得出结论**。

## 1. 核心理论及适用层级

**Cargo feature不是运行时认证。** Cargo Reference说明默认features可被依赖和构建配置启用/关闭；`solver-sdk`/`solver-cli`当前默认`native-occt`是源码事实，而是否加载正确的OCCT库必须用运行库标识及实际工件核验。跨Windows/Linux的ABI、动态库搜索、签名/摘要都应留在Solver部署profile中，不把SDK可编译当作整机可部署证明。依据SRC-SOL-001与固定源码E-SOL-01/E-SOL-06。

**OCCT版本变化可以改变几何正确性边界。** OCCT维护者的V7_9_3发布说明列出Boolean、STEP和拓扑命名相关问题修复；这说明必须固定运行时版本并重做来源/容差矩阵，不能从官方修复条目推断所有形体都会正确。源于SRC-SOL-002；几何可信还需独立Checker、Oracle、源拓扑与正反例。

**内容寻址必须绑定原始字节而非展示结果。** OCI官方descriptor采用mediaType/digest/size描述目标内容并要求使用前核验；F1-05仅借鉴其不可变内容地址和闭包校核思路，**不是要求Solver实现OCI容器标准**。Solver `RunPackageView::open`只是骨架JSON读取；真正的run资格还必须审查manifest完整条目，逐个比大小、原始字节Hash、结构及上游sourceRef和内核摘要。已知`SolverSdk::replay`自称完整自证，但真实宿主是否调用它尚需接线测试。依据SRC-SOL-003/E-SOL-03/E-SOL-04。

**取消只是进程控制，业务状态需要另一层事务。** Rust官方`Child`文档公开了kill/wait等进程管理语义；杀掉子进程不自动撤销另一个进程已写出的文件。D06/D07必须以由run owner认证的最终manifest+request receipt作为提交状态，取消与超时后的遗留临时包不能获得可回放资格。Windows任务树清理需结合本产品实际worker做实测，不能依赖Rust文档宣称跨平台已成功。依据SRC-SOL-004/E-SOL-05。

**Python锁文件是独立对照profile可复现性的工具，不是默认生产路径前提。** PEP 751的pylock约定及包hash可帮助独立验证环境落盘；本次source中未证明Procet已使用该格式，更不能让Python对照自动替代Rust+OCCT受管生产求解。依据SRC-SOL-005/E-SOL-02。

## 2. 原V0.8与2026-10-18源码之间的演化裁决

| 历史计划词 | 固定当前证据 | 待评审实现方案与不可突破的边界 |
|---|---|---|
| Python/OCP环境锁 | 源码native-occt默认启用、官方迁移台账明确Rust+OCCT 7.9.3生产 | 保留Python独立对照的锁定；主生产冻结Rust/OCCT/worker identity；不删除历史记录，不偷偷把Python设为生产fallback |
| 既有G6 typed桥接 | native_g5 typed入口与RunPackageView、G5 replay已出现 | 与G6 wire保持明确版本适配；不得把旧桥接结果重签为native认证 |
| 可交付材料状态 | run包含冻结来源/阶段材料记录，但算法上限彼此不同 | 完整证据链仍按1..5特征范围；更大特征数需单独阶段认证；D07的冻结BRep不是NC仿真去料画面 |
| 供宿主使用的入口 | SDK/CLI/Worker/HTTP已有各自实现层；HTTP说明无鉴权/内存队列 | 尽量复用现有SDK，Host封装授权/身份/回执；HTTP未经隔离和鉴权不能声明产品公网可用 |

## 3. 工程决策边界与反例

1. `sourceHash相同`却`frameId不同`→不同冻结输入；不允许跨Setup的材料状态混用。
2. 同一包`manifest`存在但某个`before/after`字节被改动→RunPackageView可能能打开，**产品资格必须拒绝**。
3. 12个特征某一子算法能够运行，不代表完整Oracle 1..5验证覆盖已扩成12；以该具体profile报告unknown/partial。
4. stdout写出了`exitCode=0`但归档/独立核验不可读→任务记录终结但资格仍unverified，不生成Plan批准。
5. HTTP `/jobs`返回202却重启丢失内存任务→Host应按持久receipt或重放能力显示unknown/interrupted，不合成一个“完成”事件。
6. 用户切A/B模式或切另一个工程，旧job回执只入历史审计，不切换当前CAD/Setup视图、也不将任务运行升为工艺批准。

## 4. 实际来源与实测缺口

[SRC-SOL-001 Cargo features](../sources/F1-05.json)；SRC-SOL-002 OCCT V7_9_3官方发布；SRC-SOL-003 OCI descriptor；SRC-SOL-004 Rust Child；SRC-SOL-005 PEP751。当前只读源码固定SHA：`BaiSongt/procet-solver@44172bc046bfd65c2a4fe36212536c70226be48f`与`BaiSongt/procet-cam@fcec1c86047e6b11be35b8bb38971e3dfcffbd7b`。不能公开复制私有仓完整源码。

无法仅靠阅读确认：host是否逐文件验证manifest、动态库加载和G5全场景测试是否对应当前HEAD、Windows/Ubuntu离线分发闭包、完整G5的真实并行吞吐、各算法超范围失效、历史Python兼容包转换资格。以上均列为F1-05产品级准出门，**没有实测记录则状态PENDING**。