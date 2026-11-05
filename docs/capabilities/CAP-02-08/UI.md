# CAP-02-08｜资源能力兼容选择：GUI、字段与三维交互

本文件是[CAP-02-08](README.md)配套界面设计规格，v0.1待评审，不是已运行页面。仍使用**单一Babylon交互世界**与左侧`UnifiedTaskPanel`，主工程空间/资源空间横向切换；只提供浅/深主题，允许离屏非交互缩略图但不新建第二套互动Engine。

## 入口与作用域

入口A：工艺规划→工序资源需求（D05，尚可无机床）；入口B：Setup→装夹与资源（D04）；入口C：执行配置→机床/控制器/刀具绑定（D10）；入口D：制造资源→能力与兼容筛选（无Project时仍有效）。

从任意页面发起携带`callerScope={projectId?,documentInstanceId?,setupId?,operationId?,expectedRevision?,editSessionId,epoch}`。切换项目或Setup、关闭任务或选择新请求时使旧epoch失效；恢复只回到原调用面板。工作区层不得把ActiveDocument误当原回调目标。

## 五个任务页面（同一左容器）

| 任务 | 列表/表单内容 | 主动作 | 3D关联 |
|---|---|---|---|
| 01 工艺需求 | 角色、加工模式、机床/刀具/夹具必要条件及偏好来源；Must与Prefer分开 | 选择需求模板、编辑草稿、开始评估 | 主模型及选中制造要素，草稿改动不写D05 |
| 02 候选资源 | exact版本、结构Verified/Unverified、任务satisfied/rejected/unknown、符合项数与阻断原因 | 筛选、排序、比较A/B候选 | 资源空间展示选中的单个或覆盖候选，切换不造第二Scene |
| 03 接口与装夹 | 机床安装基准、刀具/主轴接口、夹具允许Grid/TSlot/Rail、需求长度/行程 | 点击安装位、输入索引与位移、试算 | 在同世界以半透明overlay显示候选pose、工作包络；不写入Setup |
| 04 证据与执行范围 | 逐项条件、来源标准/设备手册、readDepth、版本；后处理/控制器覆盖和D11/D15独立状态 | 展开条件、定位问题、补证请求 | 对应轴、接口或范围高亮；不能把绘制覆盖等同仿真通过 |
| 05 确认与影响 | 原修订、候选修订、将要更改的D04/D10字段、将失效的证据、审批责任 | 采用并保存新修订 / 返回 / 放弃 | 点击确认前保留ghost overlay，成功后由新事实重新绘制 |

在候选列表中，结构`Verified`与任务`candidate`绝不共用颜色/文案；页面顶端显示**阶段与范围**：如“资源结构可用”“当前Setup仍缺夹具”“NC级未验证”。只要D12/D13/D15无真实证据，禁止显示“可上机”。

## 字段表（N必填，C条件必填，D派生只读，O可选）

| 字段 | 规则/单位/来源 | 当前编辑责任 |
|---|---|---|
| requirementSetId/revision | D；需求Version或草稿lock；禁止覆盖已Frozen要求 | Plan/Setup |
| stage/intent | N；exploration / setup / execution；不默认提升生产权限 | caller |
| machiningMode | C；fixed3 / indexed3plus2 / simultaneous4 / simultaneous5；不得从轴数自动选 | Plan |
| requirements[] | N；`id/kind/operator/mustOrPrefer/sourceRef/requiredStage`；未知属性明确unknown | 提出者 |
| min/max travel | C；mm；线性axis方向+frame须明确，仪表盘不能只写XYZ大小 | Resources录入 / 使用者只读 |
| rotary angle/speed | C；rad（UI显示°），rad/min；控制器/执行可用性另评 | Resources录入/使用者只读 |
| spindle RPM/cutting feed | C；rpm及mm/min，关联工况资料；不可用机床最大转速直接证明刀具允许 | 资源Owner/工艺Owner |
| interfaceRefs/compatibilityKey | C；双方exact ID、类型、尺寸/配合关系、版本；key仅预筛 | Resources |
| mounting site | C；Grid整数索引、槽号/轨道行程mm和安装frame | Setup草稿 |
| toolAssembly exactRef | C；刀柄+刀具+规长+装配帧版本；缺主轴实配证据则unknown | Resources/Setup |
| controllerProfileRef/postProcessorRef | 执行阶段C；固件/语义/后处理版本，无法用family推断 | D10/NC Owner |
| geometryEnvelope | D；sourceHash、用途、machineFrame；AABB仅可粗筛 | Geometry/Resources |
| criterion status/reason/source | D；每项含satisfied/incompatible/unknown/not_applicable/stale；原因、局限和下一步 | evaluator只读 |
| assessmentFingerprint/affectedRefs | D；exact输入、规则版本、受影响依赖的列表 | Host/Domain |
| review/overrideRequest | O；签审理由+风险级别；不能把unknown改写成satisfied | 评审流程 |

所有显示的数值有单位/来源/有效条件；继承值带“来自exact资源”的可点击链接，不把演示样例当产品默认。录入框支持按字段显示必需证据、合法闭区间/离散域；超限只显示错误和恢复，不自动clamp。

## 选择、预览、确定

1. 列表和3D都发共享的`SelectedResourceRef`，而不是传Babylon Mesh给资源仓。对象点击高亮并滚动到对应匹配项目。
2. 3D中的接口、轴方向、安装格点及边界显示注释和父帧；显示网格缺失时可以只用明确代理/线框，但碰撞和精确配合资格不得由代理继承。
3. 拖动候选只提交临时位置草稿和previewId；自动落座/对中由同一个绝对基准重新计算，重复三次结果相同、不隐式扩展Stock。
4. “确认采用”必须由领域写入Owner重新查exact资源、scope/expectedRevision和全部Must条件；客户端绿色Badge不构成放行票据。成功回执返回新Setup/执行配置修订和影响清单。
5. 取消清除当前overlay、保留已保存草稿；既已提交成功则不能用取消假回退。切换到别的Setup时旧返回的overlay和请求结果不得应用。

## 异常/恢复矩阵

| 情况 | 展示与动作 |
|---|---|
| 资源列表空 | 展示暂无Released候选/创建资源，不偷偷选默认B5或3轴 |
| 已选Obsolete | 历史仅查看，提供显式替换流程及差异预览 |
| 结构能力Unverified | 只显示灰Badge和原因；任务状态独立列出缺证，不把False写成硬不支持 |
| Must有不满足 | 标红冲突项，展示条件来源/单位；不自动删掉Must |
| Must unknown / 控制器语义缺失 | “资料不足，不能生产确认”；给出补证责任人和字段 |
| A/B模式切换 | 不丢失版次，已冻结D08不可静默改；B生产照常复核 |
| 资源修订/工况改变 | 旧结果stale，保留可读历史并突出重新评估 |
| 旧异步返回 | scope/epoch mismatch丢弃，不污染另一个文档 |
| 离线资产缺失 | 项目保留原样，不能画假碰撞体并给出“安全通过” |
| 乐观锁冲突 | 保留本地选择与差异，提供重新读取再决策 |
| 评估超时/取消 | 显示取消/失败阶段，可重试相同requestId，无数据库写入 |
| 键盘/无障碍 | 列表、原因、按钮可Tab访问，Esc结束临时选取，错误不仅靠颜色 |

状态栏显示当前阶段、Frame、单位、输入指纹短标识以及是否为草稿；不再把状态塞在3D四角。用户返回后焦点回到原按钮；统一容器滚动不会丢失当前比较选择。

## 待实施验收走查

- 路径A：探索设计未绑定机床→看到3轴/5轴候选与unknown→只保存需求，不产生D10；进入生产才触发控制器覆盖门。
- 路径B：5轴标称数量已满但结构Unverified→Badge不能显示可用；即使Verified，缺后处理语义仍不可宣布NC通过。
- 路径C：T-Slot槽号越界→预览定位错误但D04不改变；修正后确认→同一个callerScope产生一个修订，重试requestId不会重复采用。
- 路径D：Setup-A比较r1→切换B→A异步返回→B不变；重开A时保留r1草稿，r2上线不替换历史。
- 路径E：UI显示两个候选AABB相交→不推断实际刀轴可达；具体交给FK/IK、碰撞和NC级独立证据。

这些是产品验收脚本设计，**本轮未运行**浏览器、Babylon场景、后台接口、控制器或Windows EXE。
