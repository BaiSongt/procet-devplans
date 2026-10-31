# CAP-07-06｜进退刀与链接（V0.8，L3待审）
**原88项业务目标原文**：进退刀与链接｜安全高度、切入退出、转移和避让。关联原工作包F1-03 / E3-01 / U4-04。不改变L1/L2、11域、88 CAP、36原编号工作包、17资产分母；L3只是待人类审批的详细设计。

## 关键业务决策
避免端面加工每一行机械抬刀。仅当刀具**完整刀具/刀柄包络**与真实当前材料/工装/岛屿保护体构成的局部链接通道已被**保守验证**时，允许保持下刀；否则应选择可认证的退让路径或标UNKNOWN。安全高度应在当前D04 Setup局部坐标及工具方向中表达，不允许写死Babylon世界Z、某台五轴机床尺寸。改变3+2姿态须重新判断。不能基于距离采样通过宣称连续运动无碰。

## 十项实施子任务
| 子任务 | 输入与交付 | 异常与验收 |
|---|---|---|
| C0706-01 来源指纹与局部框架 | 读取D01/D03/D04/D07/D08精确revision/hash/frame/scope；右手Frame变换链 | 缺失则SOURCE_STALE/FRAME_MISMATCH、拒绝提交（R01） |
| C0706-02 安全平面与退让方向 | 相对当前Setup工件坐标的退让方向、自由空间和安全平面，而非全球Z固定高度 | 未知夹具/方向或仅凭显示包围盒，UNKNOWN（R02） |
| C0706-03 切入几何 | 可选斜坡、螺旋、切向弧、条件允许的垂直下刀，刀具和刀柄一并计算 | 切入位置或连续包络未知则不得认证（R03） |
| C0706-04 切出与进给 | 切出切线/速度意图/局部过切与工况检查 | 局部校核不等于机床安全认证（R04） |
| C0706-05 端面链接保持下刀 | 对相邻端面刀轨、型腔路径计算保守已认证通道；避免无意义逐行退刀 | 薄壁/岛屿/夹具阻塞时改为安全退让或UNKNOWN（R05） |
| C0706-06 全组件避让 | 纳入工件剩余材料、保护体、真实刀具刀柄、夹具/碰撞体 | 静态点最短距离不能证明连续路径无碰（R06） |
| C0706-07 跨Setup与3+2姿态 | 变更Setup、刀轴、刀具和夹具时全部失效并重新认证 | 不能重用旧已批准局部连接通道（R07） |
| C0706-08 中立D09 CL | 写typed segments和TCP/刀轴/Frame/进给意图，D10分离 | 禁止直接携带G代码和机床A/B/C轴（R08） |
| C0706-09 独立NC工程验证 | D12→D13→D14→D15→D16分段验收；未建模语义unknown | CL动画与D11预验证不等于D15（R09） |
| C0706-10 Owner提交与回退 | GUI/CLI/Agent统一Port，提交瞬间CAS/ACL/scope/generation/取消重验 | 晚回执失效，D08冻结不覆盖，非破坏回退（R10） |

## 几何数学与可证伪条件
在当前Setup局部Frame下定义工具组件体T(q)、保护障碍集合O和时间参数轨迹γ(t)。局部连续安全至少要求对所有t∈[0,1]，T(γ(t))∩O为空；有离散采样间隙并不足以证明此命题。OCCT `BRepExtrema_DistShapeShape`仅提供**静态**B-Rep两形体距离，不能独自完成刀柄全路径连续扫掠认证。无可靠保守证明必须UNKNOWN，而非虚构安全值；本规划**不做材料扫掠仿真**。

D09中立CL候选段类型`APPROACH/LEAD_IN/CUT/LINK_STAY_DOWN/LINK_RETRACT/LEAD_OUT`带TCP、刀轴、Frame、障碍物哈希和进给意图，禁止嵌入控制器G0/G1及关节A/B/C实际轴指令。D04 Setup毛坯与D10执行配置绑定**严格分离**。D11只允许CL级运动预验证；D09 CL→D12传统NC后处理→D13独立控制器语义→D14轴时序→D15工程验证→D16发布。D13未知语义即D16阻断，Babylon动画不冒充NC验证。

## 域端口及失效恢复
07域Owner候选端口：`CAMDomainPort.previewLinkPlan/readExactLinkEvidence/commitNeutralCLWithCAS`。跨域D01/D03/D04/D05/D07/D08精确读取revision/contentHash/hashKind/frameRevision/frameHash/scope，06域拥有真实材料状态，07域仅持久化新D09；其余资产不得偷写。GUI/CLI/Agent统一Owner入口，提交时重验ACL/expectedHead/scopeEpoch/taskGeneration/receiptGeneration/cancelled。A/B共用冻结D08，不双写；Setup/刀具/姿态失效传播到链接证据与预览，晚回执无权更新事实。旧CL只读兼容，新版本追加，回退不删除任何用户数据。

## 研究、界面和独立验收入口
[单Babylon与左TaskPanel](UI.md) · [合成接口](contract.example.json) · [17资产Owner候选](asset-owner-candidates.json) · [独立消费者与回退](independent-consumer-handoff.md) · [9项来源/阅读层级](../../../research/sources/CAP-07-06.json) · [理论](../../../research/topics/R-LEAD-LINK-001.md) · [10规则与正反变异](../../../research/traces/CAP-07-06.json) · [30合成场景](fixtures.json)。

测试入口`node tools/check_cap0706_planning_2026_10_26.cjs`；本轮只完成V8纯规划合成30/30，**独立Node文件、真实OCCT/连续干涉、控制器/NC/实机/独立消费者NOT_RUN**；L3与17资产Owner正式会签PENDING。**规划PASS≠产品PASS。**


## B57连续链接区间下界补证（2026-10-31，L3待审）
[区间数学与源/规则/正反验收](CONTINUOUS-LINK-CERT-B57-2026-10-31.md) → [5项来源](../../../research/sources/CAP-07-06-continuous-b57.json) → [8规则](../../../research/traces/CAP-07-06-continuous-b57-v08.json) → [49合成fixture](continuous-link-b57-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0706_continuous_link_b57_v08.cjs)。D09局部候选不等于D15，Owner/17真实消费者0/17，规划PASS≠产品PASS。
