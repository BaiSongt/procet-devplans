# CAP-05-08｜跨域独立消费者交接规程（待执行）

**生产写侧仅05域**：`PlanReadinessDomainPort.inspect/preview/commitHandoff/cancel/forkRollback`；01域Host负责作用域、权限、CAS、任务取消仲裁，禁止GUI、CLI或Agent旁路写入。05域的交接就绪只等于工艺输入闭合，不等于D07、D09、D15或D16的真实执行资格。

| 消费者 | exact输入与验收边界 | 正例 | 必须拒绝的负例 |
|---|---|---|---|
| 06域D06/D07（D05首独立交接） | D01/D02/D03/D04/D05/D08，冻结范围与依赖DAG；D06接收后才计算D07 | D06独立记录ACCEPTED_FOR_SOLVER_INPUT，再复核有序材料状态 | D07缺OCCT证据、仅凭计划宣称可加工 |
| 07域D09（第一独立交接） | D03资源能力、D04 Frame、D07已计算材料状态、D08冻结，全部exact；D05来源可追溯 | 自己生成CL并回签`ACCEPTED_FOR_CL_PLANNING` | D04变更却消费旧CL、资源UNKNOWN、凭3D动画假定CL有效 |
| 08域D12/D13 | 经真实D09生成的CL + D10单独执行配置 + 最终NC字节 | NC行来源与控制器语义独立解析 | 宏/偏置/循环未建模仍报告PASS |
| 09域D14/D15 | 最终D12、D13、机床真实轴树和安装参数 | D14展开后由D15独立覆盖声明 | 用CL动画/单次离散静态干涉代替连续NC验证 |
| 10域D16/D17 | 最终NC、D10、D13/D14/D15 exact证据、审批、离线可信根 | 校验签名与发布闭包后独立接收 | 仅有D05交接报告便允许上机；接收回执假称执行完成 |

每个消费者必须记录运行仓库/精确产品commit、D01–D17适用输入revision/hash/frame及单位、实际测试命令、操作者、日志hash、正反样例、结果状态和签署人。没有独立消费者记录一律NOT_RUN，不能把合成V8测试当产品验收。旧工程缺ref则走只读映射，UNKNOWN阻断，不伪造历史原始字节。

**必要反例**：依赖环、缺feature occurrence、无D03能力证据、跨Setup错Frame、篡改D08、A/B互写、CAS冲突、撤权、取消晚回执、D13 UNKNOWN复用D15旧PASS、D16提前发布、主题切换误失效、旧数据缺hash被无声迁移。Owner跨域会签及L3仍PENDING。