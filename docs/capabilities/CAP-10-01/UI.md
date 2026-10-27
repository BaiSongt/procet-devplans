# CAP-10-01｜发布候选包GUI / 3D交互设计

**统一入口**：左ActivityRail选“发布”→统一左TaskPanel按“候选总览/NC闭包/刀具与Setup/验证证据/指纹与离线审查”页签切换；全屏保持**唯一Babylon Scene**，不在发布面板另建世界。仅浅/深主题，最大文字12px；右侧Agent建议仅创建草稿，不授批准。

**字段与行为**：NC原始SHA、D12修订、外部子程序、D13未知语义；D03工具目录与D10实装测量、刀具号与H/长度区分；多D04 Setup名义Frame→D10实际Frame与机床轴树并排，颜色仅警示UNKNOWN/STALE，禁止绿颜色代表D15工程PASS；只读D15 Oracle/覆盖缺口。缺真实证据显示“待核对”，不得自动填零。

**跨入口一条业务线**：GUI表单、CLI --candidate与Agent toolCall同调10域ReleasePackagePort.readCandidate/buildCandidateCAS；Agent无法直接写D16。3D选取仅同步对象精确revision/hash/frame，不提交、不签发、不修改D08冻结；B/A模式共享同一个冻结对象而不是复制制造事实。

**危险与并发**：多Setup切换不重跑特征分析；双击构建、切项目、撤权、取消后返回、过期D15、U盘校验失败都只生成错误/UNKNOWN或新草稿。提交前ACL、CAS、scopeEpoch、cancelToken重验；late ACK绝不覆盖旧发布记录。CAP-10-02的审批按钮此处禁用，CAP-10-03离线接收另行独立验收。

**可访问性和测试**：状态文字+图标，不仅颜色；键盘焦点与Esc取消；视口选择与列表双向定位但不会更改业务状态。预留Browser真实Scene复用、跨工作区资源释放、CPU/GPU占用及10域consumer回归测试入口，均NOT_RUN。
