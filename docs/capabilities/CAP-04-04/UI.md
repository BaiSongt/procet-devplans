# CAP-04-04｜业务交互、GUI/3D、CLI/Agent
同一Babylon世界与唯一左侧UnifiedTaskPanel；ActivityRail切换Setup模块、Ribbon浮动，不创建第二Engine/Scene或重复资源树。暗/亮主题一致，3D显示颜色/箭头不作为提交依据。

| 步骤 | 左侧任务及参数 | 单世界3D同步 | 业务门禁 |
|---|---|---|---|
| 1. 来源 | 工程、CAD occurrence、D03夹具、Setup、expectedRevision/hash、scopeEpoch | 高亮受控实例及源Frame | 缺exactRef/权限/版本显示unknown |
| 2. 图谱 | Part/Setup/Fixture/Stock具名Frame、边的Owner、单位、originKind | 同场景有向三轴和历史/候选叠层 | 拒绝同名歧义与冲突路径 |
| 3. 编辑 | 平移mm、旋转deg输入转rad、矩阵或四元数、落座/对中绝对锚点 | PreviewLease水印和姿态更新，不变更毛坯尺寸 | 拒绝镜像、比例、NaN、迭代漂移 |
| 4. 影响 | D04新旧hash及05–16消费者失效、冻结D08/D16 | 显示来源与受影响对象关系 | 缺D10绑定不能进入NC工程验证 |
| 5. 提交/回退 | 服务器权限重验、L3状态、CAS、审批、结构化失败码 | 清除候选，保留冻结状态 | 取消/换Setup/撤权/晚回执不落库 |

规划中的同域接口：`FrameGraph.Read/Propose/Preview/Commit` 供GUI、CLI、Agent通过同一Host业务port调用，**不是已经存在的CLI命令**。CLI概念示例 `procet setup frames preview --setup <id> --expected-rev <rev>`；Agent仅生成受审候选，不跳过业务Owner/CAS。ESC退出AI+3D或工作流取消时释放预览租约。
