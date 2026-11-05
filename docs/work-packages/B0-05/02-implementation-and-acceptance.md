# B0-05｜十项实施子任务、测试入口与退出门

**仅规划编制，产品测试NOT_RUN；每项产品真实执行路径由未来负责仓Owner核对。**

| 子任务 | 目标与输入 | 独立产品验收口径 |
|---|---|---|
| B0-05-S01 | **PR身份和HEAD观测**：repo/PR/base/head完整SHA及不可变观察 | 第二来源完整SHA比对，旧HEAD不可授新PASS |
| B0-05-S02 | **PR依赖与merge-base**：#60/#62真实有向依赖图 | 改base须重算，缺祖先证据标UNKNOWN |
| B0-05-S03 | **Review意见与作用SHA**：reviews/threads/commit映射 | 旧review不自动迁移 |
| B0-05-S04 | **远端检查和本地测试分层**：statuses/checks及跳过/未运行证据 | 空checks或skip ci非PASS |
| B0-05-S05 | **验收回执和日志闭包**：command/exit/env/tests/hash/coveredScopes | 任一缺失阻止全覆盖声明 |
| B0-05-S06 | **只读合并建议**：逐依赖建议与重验清单 | 禁止自动合并或付费CI |
| B0-05-S07 | **QA与独立消费者**：self-report与independent分类 | 无独立日志不授独立PASS |
| B0-05-S08 | **跨域Owner与Frame合同**：D04/D10/D13/D15正确责任映射 | 未知Frame/NC语义为UNKNOWN |
| B0-05-S09 | **Host CAS及取消竞态**：三入口同提交与epoch约束 | 权限撤销或晚回执必须零写 |
| B0-05-S10 | **覆盖、风险和交接**：有界证据矩阵/签署/回退 | 规划PASS绝不等于产品PASS |

每项子任务映射research/traces/B0-05.json的一条规则和fixtures.json的一组正反验收。规划校验器只验证JSON结构、引用与字段完整度，不能当独立QA。产品验收所需：真实且未改动的GitHub HEAD/base、当期manifest对应的可执行命令、实际日志与退出码、目标平台、测试数、排除范围、按角色分离的独立复核人。GUI至少按PR目标版本执行TypeScript类型、单元、根与Tauri双workspace、构建/NSIS/EXE、单Babylon世界的实机显示审查；Solver必须与几何OCCT oracle、真实案例、Viewer和变更版本一一对应。所有命令实施前以实际源码脚本为准，历史评论中出现的命令不可直接当作现行接口。

**可发布/可合并资格为跨域Owner的独立决策**：本包只能生成DRAFTED、EVIDENCE_COLLECTED、QA_REVIEWED、OWNER_APPROVED、MERGE_ELIGIBLE等未来审查状态提案，不会配置GitHub分支保护、执行merge或修改三层锁。任何必验项FAIL/BLOCKED/UNKNOWN/NOT_RUN都不可晋升MERGE_ELIGIBLE。

实施回退只撤销本包派生审查草稿；不得改写既往验收结果、工序冻结事实或产品Git分支。
