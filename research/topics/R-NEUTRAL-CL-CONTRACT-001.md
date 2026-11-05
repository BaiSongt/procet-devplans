# R-NEUTRAL-CL-CONTRACT-001｜中立CL数据与控制器执行语义的边界
核查日期：2026-10-26。来源：[9项含版本/作者/URL/阅读深度](../sources/CAP-07-07.json)；规则：[10项字段映射和30合成场景](../traces/CAP-07-07.json)；实施：[CAP-07-07](../../docs/capabilities/CAP-07-07/README.md)。

**标准可证范围**：ISO 14649-10:2004（S01）与ISO 14649-11:2004（S02）本轮仅打开ISO合法**目录及摘要**；可支持编程系统与控制器间过程数据存在通用层及铣削特定层，**不能**称其规范了本规划JSON的TCP/axis、segmentKind、CAS等字段，更不能声称读取了具体标准条款。

**坐标系及数值**：OCCT 8.0.1 gp_Ax3（S03）公开API明确可表左手或右手系，因此Procet内部取`RIGHT`须主动检验；gp_Trsf（S04）支持变换/组合，是Frame往返计算的API参考，不意味着真实产品已有该实现。det(R)=+1、RᵀR≈I、工具轴||a||≈1是本规划的数学约束而非未经阅读标准的引用。

**CL/NC分层**：LinuxCNC 2.9 Overview（S05）中的G/M模态、机床轴字母说明最终控制器解释具有模式状态。Autodesk Post Library（S06）官方强调后处理须针对实际机床仔细验证；两者都不提供通用机床控制器认证。D09保存中立运动意图，D12下游输出NC，D13解释控制器执行语义，D14时间化，D15验证，D16发布；D11动画没有升级资格。

**可追溯性与并发**：W3C PROV-O（S07）定义实体/活动/派生关系，可用作段级Source→Rule→Field→Consumer记录方式；RFC 9110 §13.1.1（S08）If-Match强条件写帮助说明防止lost update，但D09的Owner CAS还需ACL、Frame、scopeEpoch、taskGeneration、取消晚回执重验；NIST IR8536 final（S09）仅读**2026-09官方出版著录和摘要**，可作为制造追溯跨系统概念背景，不臆造NC实践结论。

**边界结论**：10条规则与30项合成正反/不同字段变异是规划契约可证伪样例，不是OCCT、postprocessor、机床轴轨迹或独立消费者的真实测试。材料扫掠仿真不纳入本规划。
