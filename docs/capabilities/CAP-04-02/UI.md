# CAP-04-02｜GUI、3D、字段与操作状态机

**2026-10-19，规划待L3评审；仅UI规格，不声称Electron/Babylon已接线。** 业务说明[主文](README.md)，可机器校验[正反场景](fixtures.json)。

## 1. 唯一交互容器和布局

保留**一个Babylon 3D世界**。用户通过空间切换器在“工件加工”“制造资源”的完整3D内容之间横向切换，而不是左右并排的两套场景或独立离屏设备。左侧统一`UnifiedTaskPanel`可由鼠标在设定边界内调宽；Ribbon悬浮、ActivityRail不改变现有层级，底部统一状态栏承载Frame/单位/版本和ghost标记；仅浅色/深色主题。

从**Setup→毛坯/零件定位**进入同一个域面板，GUI/CLI/Agent共用`StockPartRegistrationPort`而非各自校验。3D将CAD目标与毛坯分别以边线/半透明ghost叠放；可单独隐藏、透明度滑条、Frame三轴、源bbox与局部余量不足高亮。来源/精度不明以`未知`图标与文字同时呈现，禁止绿色“已认证”。

## 2. 左侧五个任务步骤

| 步骤 | 主操作 | 必须显示的字段 | 拦截/回退 |
|---|---|---|---|
| 01 选来源 | 选工程/CAD实例、已有或候选毛坯 | projectId、setupId、documentInstanceId、CAD revision/hash、occurrencePath、stockSourceKind、stock revision/hash、geometryQualification | 不同实例只读对比；未采用stock允许探索，材料求解不可用 |
| 02 选定位依据 | 拾取设计datum/面/点或录入约束 | topologySnapshotRef、frameRef、点/面/轴、约束自由度、origin、方向、单位 | mesh-only无BRep身份证据显示候选，不批准；欠定返回unknown |
| 03 算定位 | 计算/重算/居中/落座；3D ghost互动 | T^S_P、T^S_K、T^K_P、R/t、handedness、det(R)、solutionMultiplicity、algorithmProfileRef | 输入不变重复计算幂等；取消只销毁ghost且阻断晚回执 |
| 04 核几何 | **显式**计算局部包围、筛查余量 | bboxFrame、BRep/mesh/8角算法标记、tolerancePolicyRef、stock原始尺寸、包含状态、未知区域 | 不自动更改毛坯尺寸；AABB不能直接放行材料计算 |
| 05 审核保存 | 差异、影响、签署、提交、返回旧版 | old/new exactRef、D05/D06/D07/D09 stale清单、D08/D16冻结、expectedRevision、请求幂等ID | 服务器recheck scope/CAS；任意冲突转审查态，原D04不变 |

### 状态转换（领域真值由服务端决定）

`empty → source_loaded → draft_constraints → proposed → reviewed → committed`；并行的`preview_only`永远不产生revision。进入`unknown/ambiguous`时只能修改依据后再次计算；`cancelled`不再接受原scopeEpoch异步回执；`stale`须重新取source/hash；`conflict`走差异对比或放弃，而不是自动重试覆盖。

## 3. 3D拾取与帧/单位显示

鼠标选点返回 `{projectId,documentInstanceId,cadOccurrencePath,topologySnapshotRef,subshapeRef,sourceRevision,sourceFrameRef}`；渲染坐标只作射线命中反查，必须经CAD源映射二次验证；若仅有mesh三角形高亮，不直接将其当制造基准。Frame三轴用轴标和来源文字，不通过颜色 alone 区分。旋转/平移数值必须标明**从P到S或K到S**、角度制、单位，转化到屏幕坐标由RendererPort负责。

左下/右下不再占用3D角落堆砌状态，统一显示在底部状态栏：`当前Setup ID｜D01#r/hash｜D04#r/hash｜单位｜坐标帧｜工作空间｜预览未保存`。主3D选中对象、树与左侧字段联动；跨空间切换不取消可持久草稿但取消属于旧scope的悬浮ghost。

## 4. 关键交互门与异常文案

- 点击“新建Setup”“打开CAD”：**不得**触发毛坯尺寸自动计算，也不因旋转CAD自动扩大实际毛坯；仅明确点击“计算并建议候选毛坯”启动估计。
- “自动落座+对中”：输入是源修订与约束快照，**不是本次显示位姿**。连续三次应返回同候选，不能累计三次平移。
- “采用候选”只更新受控草稿，显式“提交”才产生D04正式修订；并发权限重验和CAS不可省略。
- 只缺机床/D10，仍可定位草稿与CAD几何审查；缺可靠stock，则D06材料判定须展示“缺毛坯依据”；D13未知语义，则D15及D16不能显示PASS。
- 失败码与回退：`REGISTRATION_UNDERDETERMINED`显示欠约束及自由度；`INVALID_RIGID_FRAME`显示变换与单位错误；`GEOMETRY_EVIDENCE_INSUFFICIENT`显示bbox不足的具体理由；`CAS_CONFLICT`回到Review并展示差异；`SCOPE_REVOKED`禁止保存；`LATE_ACK_IGNORED`不跨Setup套用旧回执；`LEGACY_FRAME_UNKNOWN`只读保护。

## 5. 交互验收

**正反T01~T20**详见[fixtures](fixtures.json)；重点由不同测试人员分别经GUI、无UI CLI调用和Agent受管调用重放，相同受授权输入应得到同一领域规则判定。单世界切换/窗口拉宽、三次落座、撤权后晚回执、多Setup A/B和独立06域几何结果必须对拍。只做视觉交互截图无法证明CAS权限或NC语义。
