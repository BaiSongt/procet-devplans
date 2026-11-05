# W2-05｜单Babylon场景与统一左TaskPanel（GUI方案）
[工作包](../W2-05.md) · [合成DTO](contract.example.json) · [正反验收](fixtures.json)

唯一全屏Babylon Scene + 左侧ActivityRail + 统一左TaskPanel，不新建第二Scene或全域巨型Store。最大字号12px、浅/深色主题，避免卡片堆叠。Tab按「Setup导航｜已有Feature｜Plan工序｜双向关联｜来源/失效｜操作/回退」组织；GUI/CLI/Agent均经相同03/04/05领域读取端口与05域提交端口。

**核心操作**：用户直接从Setup A切到Setup B，提交准确project/document/branch/setupId+revision/hash/frame的只读请求；不再要求重新运行特征分析。列表选择Feature能高亮其多个Step，点Step也可高亮多个Feature；3D只通过SelectionIntent/Overlay租约展示几何代理，不赋予几何证书或写入资格。切换时queryGeneration递增，旧A延时回应只能写审计，不覆盖B的当前TaskPanel。

**状态与来源**：精确源可用EXACT；确无业务实体EMPTY_AUTHORIZED；源缺失UNKNOWN_MISSING_SOURCE；索引落后STALE_PROJECTION。显示D02/D04/D05及相关Frame、unit、revision/hash与D08冻结；「重建投影」仅刷新派生索引。机床D10执行绑定需独立设置，不能把Setup A等同G54、Setup B等同G55。

**编辑与播放**：编辑保存必须经05域受管命令及提交时ACL、CAS、jobGeneration、cancelEpoch重验。CL预览为D11_PREVIEW，不展示为D15_NC_PASS；D13语义未知则显示UNKNOWN并阻断D16资格；不做材料扫掠仿真。执行等待动画必须来自真实任务状态，不造假进度或回执。
