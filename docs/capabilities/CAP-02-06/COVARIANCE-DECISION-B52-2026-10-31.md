# B52｜CAP-02-06 测量资源：相关不确定度、判定规则与工程资格隔离

日期：2026-10-31；状态：**NEWLY_AUTHORED规划补证／L3待人审／产品及独立消费者NOT_RUN**。保留[原CAP](README.md)、[原研究补证](RESEARCH-TRACE-2026-10-28.md)及R-MET-001，不覆盖既有MET编号。本轮新增真正含相关分量的数值反例，并将D03资源资格与D17检测结果分离。

## 一、理论核对与适用边界

- **NIST TN 1297（Taylor/Kuyatt，1994版）Appendix A §A.3**公开给出灵敏度系数与协方差的合成不确定度公式；本轮简化为两个单位灵敏度系数：`uc² = u1² + u2² + 2cov12`。只有充分证明协方差为零才可使用`RSS = sqrt(u1²+u2²)`；不能把相关项默认为零。
- **NIST TN1297 §§5–7**区分合成标准不确定度`uc`与扩展不确定度`U=k·uc`；k、适用分布、方法、校准与环境条件要随结果存证。`k=2`在本合成算例仅是显式输入，不能凭空宣称95%覆盖或实际计量许可。
- **NIST溯源政策 §3.2/§5.1.7**只将溯源赋予**测量结果**，不是设备品牌。校准链与适用场景独立判断；目录处于Released不能自动赋权D17的实际检测结论。
- **ISO 230-10:2022 Ed.3官方Abstract**限定NC机床探测系统性能测试，明确排除把整台机床当CMM的性能评估；**ISO 10360-2:2009 Ed.3官网Abstract（2026确认）**限定笛卡尔、接触式离散点CMM；**ISO 14253-1:2017 Ed.3官网Abstract（2023确认）**指出临界公差和不确定度的合格评定。三项收费标准只阅读官方合法目录与Abstract，**不冒充已读正文、阈值或强制判定条款**。
- 这里的`PROCET-GUARD-U@R1`仅是**待L3批准的内生合成决策策略**：上限`L`，`v+U≤L`为`CONFORMING_CANDIDATE`，`v-U>L`为`NONCONFORMING_CANDIDATE`，其余`INDETERMINATE`。不声称上述ISO强制此算法、k或守护带大小；真实D17必须引用具体Owner批准的规则版本/哈希。

## 二、可反驳的数值Golden（纯合成）

单位为mm，`u1=0.003`、`u2=0.004`，相关协方差`cov12=+0.000006 mm²`（相关系数0.5）。

`uc = sqrt(0.003² + 0.004² + 2×0.000006) = sqrt(0.000037) ≈ 0.00608276253 mm`；`k=2`，故`U≈0.01216552506 mm`。

- 观测`v=9.986`、上限`L=10`：`v+U≈9.998165525≤L`，仅合成`CONFORMING_CANDIDATE`。
- 临界`v=9.988`：`v+U≈10.000165525>L`而`v-U<L`，应标`INDETERMINATE`。若错误忽略协方差得`U=0.010 mm`，会把它误判为候选合格；本案例专门反驳此错误。
- `cov12=-0.000006 mm²`且其余相同，则`uc=sqrt(0.000013)`、`U≈0.007211103 mm`，临界`v=9.988`在此**不同物理假设**下成为候选合格，不可将负协方差直接复制到其他工况。
- 使用`μm`输入时value/u按`1000`换算，协方差按`10^6`换算；每条测量保留原值、原单位、归一值与校准来源。检查`|cov12|≤u1·u2`避免不可能的两变量协方差。这里的1e-8数值比对仅为合成代码容差，不是测量许可或机床精度。

## 三、Owner、GUI/3D、失效与NC边界

D03由02域制造资源Owner管理exact器具定义/组件/能力；校准事实由合法计量提供者负责，D17检测结果与质量判定由结果Owner独立管理。D01定义被测量特征与公差，D04工艺Setup和D10实际机床/测头安装**分别引用**，不可类型覆盖；独立CMM离线测量不假冒在机NC已认证。每条结果保存器具/校准/规则的exact revision、哈希、Frame、采样时间、计量链及不确定度预算。

GUI/CLI/Agent用同一个`MeasurementEvidencePort`；唯一Babylon Engine/Scene/Canvas、左`UnifiedTaskPanel`显示合成测量与不确定度区间，最大字体12px，Preview没有提交权。业务Owner事务提交时重验ACL、许可范围、ScopeEpoch、expected Revision/Hash、取消generation及资源失效迁移；晚ACK不能复活取消的写入，A/B冻结状态不可覆写。D03/校准/PMI/D10变化产生依赖`STALE`与受控回退，不改历史原始观测。

在机探测必须另外提供具体控制器与D10绑定的最终NC证据：中立CL→NC后处理→D13控制器执行语义→D14轴时序→D15工程验证→D16发布；若D13语义UNKNOWN，仅保留原始观测草稿，绝不能将CL预览、合成D17判据或探测系统测试当D15工程PASS。离线CMM与实机NC是不相同的通道；不做材料扫掠仿真。

## 四、机器检查与人类待办

[8项作者/版本/日期/合法阅读深度来源](../../../research/sources/CAP-02-06-covariance-b52.json) → [9条规则/字段/CAP/原F1-06及E3-04/T5-05包](../../../research/traces/CAP-02-06-covariance-b52-v08.json) → [5正36反6 UNKNOWN独立输入](covariance-b52-fixtures-v08.json) → [只读Node测试入口](../../../tools/check_cap0206_covariance_b52_v08.cjs) → [本轮核验等级](../../../tracking/cap0206-covariance-b52-verification-2026-10-31.json)。

`node tools/check_cap0206_covariance_b52_v08.cjs`从真实fixture重建每一输入并调用固定`judge`；判定函数不读取case的`expected`。本轮V8同函数合成执行；独立Node文件进程、原始计量证书和校准链、真实器具、D17独立消费者、OCCT、NC/B5/OEM、L3及正式Owner签署均NOT_RUN。正反合成PASS≠产品PASS。

待人工签署：测量值的可追溯实体分母、校准及环境覆盖范围、允许的统计模型/协方差估算、判定策略与风险承担、D17 Owner/独立消费者签名、可验证的CMM/测头实际样本与故障注入。缺少任一实际资格时不得从`CANDIDATE`升级放行。