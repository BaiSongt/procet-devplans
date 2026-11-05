# W2-02｜GUI与3D交互设计
> 业务视图仅提交受管命令；不创建第二Babylon Scene或新的全屏镜像。最大文字字号12px；主题仅浅色/深色。

## 统一左TaskPanel：候选→对比→裁决→提交
- 上方固定Project、分支A/B、D05 head revision/hash、Setup/frame以及待采纳D06 candidateId；任何引用变化使旧预览自动STALE，不保存隐式latest。候选列表展示**稳定工序UID**、来源Run、D07 checker和可信状态，不以数组index映射。
- 中栏左右对比base/head/proposed：新增、修改、删除、重排、冻结冲突按稳定UID成行，状态为MATCH/CHANGED/CONFLICT/UNKNOWN；每行有源引用和字段差异。选择冲突只能显式“保持冻结、分支、拒绝、申请解冻”，不得仅点击3D高亮即写入。
- 一个Babylon世界同步显示毛坯/目标/D06候选去料体与冻结范围；只读分层叠加，标注Frame与单位；一个RendererPort接入，UI变更不触发制造事实修订。D07几何未核验时显示UNKNOWN遮罩，禁止涂绿安全认证。
- 底部统一操作列：`预览`、`比较`、`采纳为草稿`、`拒绝`、`提交解冻申请`。提交前强制再拉取scope/ACL/最新D05及D08修订/任务代次；按钮禁用不是权限校验。Agent只能请求相同DomainPort，不能直接写D05/D08。
- 一旦取消或切换工程，任务generation递增；已结束任务的晚回执到达只能记入隔离审计，不刷新当前预览或新Head。pending动效可显示任务阶段和服务调用，不能把动画显示为结果采纳。
- 失效提示采用链路视图列出 D07/D09/D12/D13/D14/D15/D16 相关修订“需复验”；机床D10执行绑定与D04 Setup分开呈现。CL运动播放只标“预览”，NC工程验证需D15独立结果。

## 交互负例
针对错误绑定StableUID、D07 UNKNOWN、跨分支、冻结重叠、后台权限撤销、CAS竞争、取消晚回执以及误授NC资格分别展示具体failureCode、无提交和纠正动作；不使用“成功但稍后自动修复”。
