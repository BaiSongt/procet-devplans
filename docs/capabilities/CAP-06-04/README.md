# CAP-06-04｜有效加工域构建（V0.8，L3待审）
> 原11域88 CAP中的第06域条目，原始业务定义“CAD目标、前序去料、保护区与余量合成”。对应F1-05/W2-02/W2-03/W2-06，保持L1/L2不变及C0最小公共面。[原文映射](../../architecture/v0.8/03_三级能力映射_88项.md)。

## 业务目标和可证边界
为指定WorkContext(Project、Branch、Setup、StepUID)，使用D01受控目标T、D04工艺Setup、**前序D07不可变有序材料Stock** S_prev、逐Face余量政策A、保护区P，在同一物理Frame内构造待进一步求解的有效去料域：
```text
E(T,A) = 基于已批准余量与OCCT有效包络构造的保留实体（禁止以BBox/全局固定膨胀替代）
R_geo  = (S_prev \ E(T,A)) \ P
S_keep = S_prev \ R_geo
必要条件：T ⊆ S_prev；R_geo ⊆ S_prev；R_geo ∩ P = ∅
```
这是数学集合**设计规则**，不是已经执行的B-Rep布尔。E的非均匀余量、复杂面偏置、圆弧角/岛屿/台阶和局部保护区必须提供OCCT有效性证据；若目标超出Stock（纯减材不可能补料）、源几何/Frame无法确认、fuzzy预算无审批、布尔退化或保护区域不明，拒绝或返回UNKNOWN，不能凭一个CAD模型自动构造扩展毛坯。

## 工作流、字段、Owner
1. D01设计基线、D04工艺Setup和D07当前有序Stock由各自Owner的只读端口按`assetId/revision/hash/hashKind/frame/unit/project/branch/setup/scope`取得精确内容。可读取D02特征/保护规则、D03能力、D05人工规划，但A模式不强制已有D05；05域D08冻结只能只读。
2. Part→Setup的有向变换由04域给出可逆变换矩阵、组合次序、手系、单位与批准修订。Babylon渲染转换与OCCT物理变换各自隔离。D04名义Setup不得与D10机床执行绑定混为一个对象。
3. 06域先以真实B-Rep检查`T⊆S_prev`；按面UID、局部区域/公差预算、批准来源构造`E(T,A)`，不默认无限制offset；复杂曲面包络失败显式UNKNOWN。
4. 对Stock/目标包络/保护区用OCCT CUT/COMMON计算，保留non-destructive、fuzzy上限、warnings/errors、Generated/Modified/Deleted、前后BRepCheck、封闭Solid体积预算及多Solid/多环/岛屿身份；禁止吞错后给PASS。
5. 结果先存为D06候选及受控D07新修订，再由独立进程消费者从封存B-Rep字节复核材料、保护区、余量与拓扑。原先D07、D08冻结只读，禁止静默ShapeFix覆盖。跨Setup与A/B按稳定UID和版本化来源DAG精细失效。
6. GUI、CLI、Agent同一`EffectiveMachiningDomainPort.calculate/readEvidence/cancel`；Staging Seal后由Owner验证CAS HEAD、ACL授权代次、Job generation、取消晚回执；冲突或恢复证据不足返回STALE/UNKNOWN_RECOVERY，不可由动画替代真实回执。
7. D09刀路仅能在D07独立合格+D08准确冻结后继续。中立CL→D12后处理NC→D13控制器执行语义→D14轴运动时序→D15独立NC工程验证→D16发布；D13不认识的语义永远UNKNOWN，不得以CL播放或有限集合合成PASS授予D15/D16。**不做材料扫掠仿真**。

## 验收和交付物
[GUI/单Babylon世界](UI.md) · [领域契约样例](contract.example.json) · [来源10项](../../../research/sources/CAP-06-04.json) · [10规则20正反](../../../research/traces/CAP-06-04.json) · [有限集合fixtures](fixtures.json) · [规划Oracle](../../../tools/check_cap0604_planning_2026_10_25.cjs) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者交接](independent-consumer-handoff.md)。
真实B-Rep验收至少两份合法固定STEP，覆盖台阶/复合腔、薄壁、子腔/多重环岛屿、多Solid、余量突变、曲面/斜面、圆弧底角、保护区、近切相切、前序多道去料、旋转Setup、双Setup/A-B；每类正反成对，记录锁版OCCT、原始字节SHA和允许误差证据。独立D07消费者、实际OCCT、NC/机床和人类L3目前**NOT_RUN/PENDING**。合成PASS≠产品PASS。
