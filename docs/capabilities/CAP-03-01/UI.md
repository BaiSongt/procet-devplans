# CAP-03-01｜CAD导入与几何读取：界面、状态及单世界3D规格

文档编制完成待评审，v0.1，2026-10-18。延续[业务规格](README.md)和[理论专题](../../../research/topics/R-CAD-001.md)，不是已运行页面。

## 入口与交互主线
入口：工程空间→文件/导入模型；现有CAM模型入口仍保留为兼容入口，但CAD原始文件浏览不应被CAM Job写门冒充。左侧`UnifiedTaskPanel`为唯一操作容器；Ribbon/ActivityRail只触发导航。中央仅一套Babylon主交互世界，主工程和资源空间横向切换；不创建第二交互Scene。首次打开默认居中“打开模型”卡片，浅/深两主题，资源空间不并排分屏。

| 五任务页面 | 操作与内容 | 3D反馈 | 提交/取消 |
|---|---|---|---|
| 01 选择来源 | 文件/拖放候选、sourceHash/大小/许可、支持格式清单、已导入重复提示 | 原模型不被清空，读取前仅静态文件信息 | 选择后才解析，取消不创建文档修订 |
| 02 读取概览 | STEP/AP/Reader版本、层级、部件/实例、元数据实际覆盖、源单位/Frame | 暂存显示投影/层级树联动，按实例拾取 | 只读预览；未知协议显示阻断/仅显示 |
| 03 几何质量 | BRep有效性及原因、shell/solid数量、源/目标单位、拓扑/mesh来源 | 选中问题拓扑高亮，不生成假solid | 可请求受控修补派生，不覆盖原始源 |
| 04 数据确认 | 工程目标、source/derived修订、可用能力brep_and_mesh或mesh_only、PMI读取覆盖 | ghost预览，切换单世界不换真值 | 用户确认前比较expectedRevision/Project epoch |
| 05 保存与恢复 | receipt、CAS闭包、导入日志/问题单、后续创建Job/识别特征入口 | committed描述符驱动场景重新加载；失败清理ghost | 保存成功才出现新文档；旧页签不被静默替换 |

## 字段控制与单位

| 字段 | 约束/默认来源/只读 | 异常行为 |
|---|---|---|
| 文件路径 | UI输入，实际选中文件后只读；不入快照为恢复依赖 | 路径无效只显示修复入口 |
| 文件大小/sha256/格式识别 | 解析后只读；依实际接收字节而非文件名 | 超产品版本实际上限显示数字和来源；不得硬写256MiB为永恒默认 |
| 原单位/角度/不确定 | 读取源表示并显示来源，只读；用户覆盖需显式动作+理由 | UNKNOWN不能默认mm放行制造 |
| 模型局部Frame与装配实例Frame | 从source/XDE派生只读，用户安装姿态另归Setup | Babylon显示调整不改D01身份 |
| BRep/TopologyRef/meshRef | 只读exact产物/来源hash/derivationVersion | mesh_only只能显示，不给可接受特征门 |
| 形状修补选项 | 默认不修补；如启用记录算法、参数、差异及版本 | 被修补模型是新派生，旧版仍可恢复 |
| 源名称/颜色/PMI | 条件只读，注明读取工具与缺失范围 | 不将默认显示色误读为产品材料 |
| 提交身份 | projectId/documentInstanceId/requestId/expectedRevision/epoch（设计提案） | 跨工程/权限更改/过期回执拒绝场景绑定 |

## 操作状态图（拟议）
`empty→selected→checking→parsing→preview_ready/preview_partial/blocked→validating→committing→committed`。任一步可`cancel_requested`，但如果提交已成功，仅取消视图/后续工作，必须按receipt查询，不能伪装没提交。`conflict`、`stale`、`recovery_required`、`read_only`均保留明确后续操作。导入过程中切Project/Setup或关闭页面使preview租约过期，迟到事件不复活旧页面。导入协议部分读取时以真实信息“几何可浏览、元数据部分丢失”，不显示“完全导入”。

3D拾取只产生`SelectionIntent`，高亮只投影已存在的exact ref；对损坏/缺BRep的面，GUI必须阻断进入制造特征Accepted。可对比原始和ShapeFix派生，但预览/视口操作不写业务。状态栏显示源单位、修订、BRep资格和Owner错误码，禁止显示[object Object]。

## 消费评审与反例
CAD Owner、Host/Project、CamService、RendererPort、资源和Solver必须验证：双实例同源但不同位置、未知英寸单位、取消晚到、同哈希不同导入选项、mesh_only误入CAM、外部STEP引用不在离线闭包、旧schema恢复。权限与冻结状态必须在真正Owner提交点重新检查；展示Ready不等于Authorized或Committed。只读/审计页面可在CAM后端未就绪时显示实际已恢复的CAD资产，不能承诺当前产品已支持这一解耦。
