# CAP-02-04｜夹具与工装资源：V0.8研究补证和独立验收规划（2026-10-28）

**状态：增量证据已编制，待人类复核；不是机械装夹认证或产品验收。** 原[实施规格](README.md)、[单Babylon与统一左TaskPanel的UI](UI.md)、[R-WH-001理论专题](../../../research/topics/R-WH-001.md)、[历史8条追踪规则](../../../research/traces/CAP-02-04.json)和[原数学验证脚本](../../../checks/test_workholding_math_examples.py)保留，不替换其旧字节/历史SRC-WH来源。

## 1. 源→规则→字段→CAP/原工作包→正反例

[新官方/论文定点核阅登记（8条，非去重）](../../../research/sources/CAP-02-04.json) → [10条补充规则、40个字段及原包/WH-T关联](../../../research/traces/CAP-02-04-v08-supplement.json) → [10正40独立单字段反例、6数学反例、8个未执行状态场景](research-fixtures-v08.json) → [Node只读静态检查工具](../../../tools/check_cap0204_research_v08.cjs)。每条规则标明论文/标准公开阅读深度与**Procet内部设计推导的区别**；不将摘要支持的研究背景升级为机械强度或接触安全许可。

原原编号CAP直接边仍按冻结表：**CAP-02-04 → F1-02 / F1-06 / E3-04**，支持原工作包审阅及WH-T01..18需求但不冒称已执行测试。C0仅持身份/单位/Frame/修订协议，夹具类型归D03；名义工艺Setup归D04、真实机床安装绑定归D10、控制器执行归D13。

## 2. 关键机械假设与拒绝条件

- **3-2-1不是通用认证。** 一阶局部接触可写为 `dg_i=n_i·(dt+dtheta×r_i)`，比例归一化的双边矩阵`Aq=0`若秩6，只说明双边线性化不允许非零增量；单边`Aq>=0`仍可让工件向上脱离。历史R-WH-001和[原Python算例](../../../checks/test_workholding_math_examples.py)已演示该反例，本轮不改写其物理结论。仅正反合成数学门禁不代表通用接触求解器。
- **力与摩擦需有明确模型和资料。** 合成模型`fn>=0, ||ft||<=μ fn`；案例fn=10、μ=0.5、ft=(4,4)，不满足摩擦锥。该数值仅验证计算器拒绝方向，不是任何材料、温度、冷却液工况的μ或夹紧力认证。
- **Frame与机器坐标职责隔离。** 列向量`p_A=T_AB p_B`、parent-local与接口配合关系必须给from/to、修订和单位；OCCT `gp_Trsf`允许镜像/缩放，安装仅接受经另行验证的刚体。LinuxCNC 2.9中G53/G54-G59.3可说明机床坐标/工件偏置之别，但不能假设B5或其他控制器等价。
- **独立分项与独立消费者。** 资源目录、定位秩、单边约束、有限载荷、碰撞资产与现场夹紧观测分别为`passed/failed/unknown/stale/not_requested`，不可相互升级；D15最终NC独立验证须消费D12→D13→D14真实语义/时序，`UNKNOWN`不授权D16。CL动画与Babylon资源预览不构成NC验证，也不做材料扫掠仿真。

## 3. 入口、事务与发布/回退

GUI资源世界与工程世界保持**同一Babylon Engine/Scene/Canvas、任一时刻一个活动世界**；所有任务走左侧UnifiedTaskPanel，字体最大12px。GUI/CLI/Agent只能通过同一D03资源Owner Port编辑/发布，通过D04 Setup Port采用；预览、3D选择、Agent建议都不是提交。

Owner保存前重验ACL、ScopeEpoch、exact Revision/Hash/Frame、expectedRevision CAS、cancelGeneration及requestId。取消后晚到ACK不得恢复权限；已生效Owner receipt仍需对账。禁止覆盖冻结A/B；资源退役只追加生命周期事实，历史资源继续按exact闭包解析。安装或接口改变使相关D04/D09/D12/D15依据失效，需新修订并安排重证；未知必需碰撞资产禁止伪造ID发布，允许合法草稿。

## 4. 公开来源、读文范围与剩余风险

NIST 1987 Lee/Haynes有限元与1997 Nederbragt/Ravani触觉定位均**只读官网著录/Abstract**；Yu/Goldberg 1998 SAGE论文为Restricted access且**只读Abstract**；OCCT 8.0.1 `gp_Trsf`、LinuxCNC 2.9 Coordinate Systems、RFC 9110 §13.1.1及W3C PROV-O读取公开定点正文；ISO 230-1:2012只读**官方目录/摘要**（2026 DAmd草案未视为生效标准）。8条各自作者、版本、发表日期、URL、定位和限制见[source registry](../../../research/sources/CAP-02-04.json)。

待实际验证：原R-WH-001引用的旧文献全文、具体夹具承载资料、产品锁定OCCT版本、B5夹具接口、真实接触/载荷/公差、PLC/夹紧回执、3轴/B5及D15真实消费者。所有相关项维持`NOT_RUN/UNKNOWN`；17资产Owner正式会签0/17，L3`PENDING_HUMAN`。**规划PASS≠产品PASS。**
