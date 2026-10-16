# CAP-02-05｜界面/字段/3D交互设计

2026-10-17；**设计评审稿，非已接线UI**。配套[CAP说明](README.md)。采用单一Babylon世界、左侧固定宽度统一任务容器、浅/深主题；主空间与制造资源空间横向切换，不创建第二个并排Canvas。

## A. 入口及四个任务区

资源入口：ActivityRail→制造资源→材料/毛坯；可无Project查询或维护资源草稿。Setup入口：装夹与毛坯→选择材料和毛坯，必须保存`callerScope={projectId,documentId,setupId,expectedRevision,editSessionId,epoch}`，回调时再次核对，不从当前打开的文档推断返回位置。

| 左侧任务区 | 信息与主操作 | 3D响应 |
|---|---|---|
| 材料目录 | 名称/来源、状态/别名、group、exact修订、可用证据；查找/派生 | 纯材料选择不改变当前S₀几何 |
| 属性与证据 | 方法、硬度scale、密度、适用条件、文献/报告、冲突；检查草稿 | 不凭材料名染色自动推断组织加工许可 |
| 毛坯模板 | 矩形/圆柱/custom Solid、参数、精确/显示资产、frame和版本 | 资源空间看模板，mesh-only有明确“仅展示”标志 |
| 当前Setup毛坯 | 选材与exact、尺寸、六向偏置、Frame、Fit检查、采用/撤销 | 主空间叠加CAD/毛坯/夹具；候选半透明且不写持久状态 |

空间选择共享资源/几何引用，禁止把Babylon mesh id持久化为领域身份。资源与主空间切换要保留相机与任务草稿，不重建Engine。3D显示过滤不改变已批准分析数据。

## B. 主要字段及真值

| 字段 | 编辑性、单位、来源 | 校验/呈现 |
|---|---|---|
| materialId/revision/hash | 只读；资源服务 | 仅material_id的历史值标unresolved |
| designation/standard/vendor/condition | 可编辑草稿；来源引用 | 不凭名称合并，不隐式设材料状态 |
| group P/M/K/N/S/H | 选填、兼容旧Material.group | 标明具体分类体系，不能冒称ISO 513验证牌号 |
| hardness/value/scale/method | 条件必填；HBW/HV/HRC | 不直接互换或自动生成加工建议 |
| density/value/source/validConditions | 可选；g/cm³或kg/m³ | 边界一次受控换算，保持源单位 |
| templateKind | 必填枚举 | 方/圆/custom切换时不适用字段需显式确认清理 |
| sizeMm、diameterMm、lengthMm | 按kind必填、finite、>0 | 尺寸错误定位字段，不自动补全/扩张 |
| offsets x±/y±/z± | 仅用户请求CAD候选时显示；mm | 给出bbox算法、几何来源、误差与预览色 |
| stockFrame/partFrame | 帧Ref及修订、右手方向 | Machine CSYS旧值显示“待显式变换” |
| geometryAssetRef/hash/purpose | Custom条件必填 | 显示资产与精确Solid资格分离 |
| materialRevisionRef, expectedSetupRevision | 采用时由服务端校核 | 不把UI当前选中版本代替回执 |
| fit method/tolerance/residual/evidence | 只读 | passed/failed/unknown/stale分项及定位 |

## C. 用户动作与异常

新建Setup初始毛坯为**未配置**；不会自动创建包围盒。手动填尺寸、打开已发布模板、指定合法几何或主动“从CAD提出候选”均先进入`preview`：保留当前已提交形状作为可比基线。鼠标拾取只确定候选锚点；Esc取消选择，取消预览清除overlay，不写D04；采用时展示差异、重校验rev/assetHash并请求原子保存。三次自动对中不会累计变换，也不会扩大尺寸。

状态分轴：目录ready/dirty/readonly/conflict；Fit not_requested/running/passed/failed/unknown/stale；Setup draft/submitting/committed/blocked。运行时才有进度动效。关闭脏草稿提示保存/放弃/取消；并发冲突保留本地差异；后台回执在工程或setup epoch改变后丢弃；已批准Setup只读，需要显式派生变更。

用户可独立切换CAD、毛坯、夹具、问题区域的显示；只开关渲染，不改变几何/验证参与。出现没有精确B-Rep、材料来源不足、Frame无法解析、超出毛坯边界、离线资产缺失、不可用硬度转换时，错误须指出具体字段、来源和恢复动作，禁止笼统“校验失败”。

## D. 走查（尚未执行）

UI-MS-01：空Setup→手动块材→取消；D04未变（MS-T07/08）。

UI-MS-02：用户主动产生CAD bbox候选，尝试负余量；系统报告越界且不自动扩大（MS-T08/11）。

UI-MS-03：相同输入连续3次自动落座，姿态相等；旋转父Frame下仍符合方向约定（MS-T09/12）。

UI-MS-04：资源r2已发布，旧Setup采用r1；切换Setup后迟到回执被scope gate丢弃（MS-T03/17）。

UI-MS-05：显示网格或legacy未知修订；允许查看，但禁用精确Fit/生产许可并提供补证入口（MS-T04/13/14）。

以上均是将来由真实GUI/业务端口验收的脚本，不是当前运行结论。
