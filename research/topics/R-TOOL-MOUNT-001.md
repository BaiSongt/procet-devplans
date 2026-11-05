# R-TOOL-MOUNT-001｜从刀具资源到主轴实际装配及NC刀长语义

## 来源与可采信范围

ISO 13399-1:2006官方目录摘要仅确认**刀具数据类别及关系**，ISO 7388-1:2007目录只确认**7/24特定刀柄类型**；均未读收费全文，不能导出HSK/Capto与B5接口相同、接触面尺寸或保持力。ISO 841:2001及ISO 230-1:2012目录是机床坐标/几何精度范围背景，不证明任何具体机床主轴或Gauge标定。两条LinuxCNC **2.9**官网公开章节直接区分tool.tbl/T位、G43 H、G43.1/G43.2与G49状态；其描述不得移植为所有机床控制器语义。OCCT gp_Trsf公开API支持Frame方向推导，但允许缩放与镜像，Procet限制右手SE(3)是内部架构选择。RFC 9110 If-Match、RFC 8785内容指纹和W3C PROV-O谱系为版本并发/来源证据提供参考，不等于物理安装、Owner授权或现场控制器的真实性认证。

## 推导与量纲

资源件（D03）和实际装配（D10）分别拥有修订。定义spindle gauge plane、holder接触基准、tool shank、tool tip四类具名Frame；按父子变换合成，不得让Babylon渲染Frame成为业务真相。对于已校准的共线简单模型：`p_tcp = p_gauge + L_gauge * u_tool`，其中L单位mm、u为在父Frame中归一化的方向。G01/G02/G04/G06为四种显式真值，G03错长反例与G05零向量反例应拒绝；这些仅合成算术，不处理五轴RTCP、刀具偏置实际叠加与碰撞。

高风险缺口：未知刀柄连接类型、弹性夹持、实际夹持伸出量、量测方法、T/H对照、动态附加刀长、角度头/RTCP、控制器厂商行为。上述未知只能留DRAFT/UNKNOWN并由02/04/08/09域独立消费者举证，绝不可在D13假设PASS。更换工具导致旧D10衍生D11-D16失效而非重写冻结D08和旧D16。C0公共仅保留身份/单位/Frame/Revision/Hash/Scope/协议。

[官方来源与访问范围](../sources/CAP-04-07.json) → [10条规则40字段/原5包](../traces/CAP-04-07.json) → [50正反+24状态+6几何](../../docs/capabilities/CAP-04-07/fixtures.json) → [17资产交接](../../docs/capabilities/CAP-04-07/independent-consumer-handoff.md)。规划通过与真实产品通过严格分离。
