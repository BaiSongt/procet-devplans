# CAP-06-01｜独立消费者验收
**05域**独立读取06域候选stable id、D01/D04 exact来源及冲突/保护证据，调用PlanAdoptionPort.previewCandidate；经人工选择、权限/CAS/任务代次提交重验后才新增D05 Draft。正例：A无D05→候选→05域创建新草稿。反例：D08冻结hash变、撤权、旧任务回执、重排索引误绑→拒绝且原修订不可变。
**D07独立材料核验**由06域的另一检查路径（不得依赖前端Mesh）重放锁定OCCT输入与fuzzy预算，逐步校验去料/余料体和保护域；拓扑无效、错Frame、多Solid漏失均UNKNOWN/FAIL。**07域D09**只接受D07有序状态+D08冻结的精确证据，不允许只凭D06评分/CL预览颁发后续NC资格。
真实测试要求锁定Solver、OCCT、消费者代码与二进制exact SHA，运行隔离数据并记录正反、几何差异、CAS竞态、取消晚回执和重启恢复。所有真实消费者和机床均NOT_RUN；不得因规划合成PASS而报告产品PASS。