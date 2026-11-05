# CAP-09-05｜独立消费者验收、接口会签与回退
09域D11 Owner拟独占写`ClMotionPrecheckPort`，从07域D09只读exact CL revision/hash，05域D08只读冻结快照，02域D03只读机床能力，04域D04只读名义Setup、D10只读实际机床与刀具安装绑定。任何具体签署仍PENDING_HUMAN。09域D14/D15和08域D13/12及10域D16是**独立消费者**，不得用生成D11的算法给自己签安全证明。
独立正反验收至少含：三轴同轴合成、AC旋转轴周期与IK多分支、端点合法而中间Joint越限、取样区间遗漏、速度/加速度未知、刀柄/夹具缺真实几何、混mm/deg、D09 hash变化、D04名义与D10实际错配、CAS冲突、撤权、取消晚ACK、历史冻结重读、旧schema Reader。可重复命令`node tools/check_cap0905_planning_2026_10_27.cjs`仅验证规划JSON/合成数学向量，不访问产品，实机/控制器/独立Consumer均NOT_RUN。
D11 Schema版本须区分`CL_ONLY`与`NC_ENGINEERING_VERIFIED`（前者永不能升级为后者）；D14消费者从D13输出生成NC轴事件而非复用D11时间序列；D15消费者必须独立审查控制器模态、Joint限位与碰撞/可达性。D16只接受有效D15及授权发布闭包，UNKNOWN不放行。
迁移采用Reader+Schema+机床Profile+算法版本配对，按Expand/Migrate/Contract演练，D11新版本不覆盖原D08/D16及用户数据。断电/中断/晚回执需有恢复演练；任一独立消费者未运行只能登记NOT_RUN而不能写PASS。
