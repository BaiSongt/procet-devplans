# CAP-08-06｜独立消费者、负例及回退交接

**生产者08域/D12**：只提供受控的原始NC字节及`assetId+revision+sha256+schemaVersion+encoding/BOM/EOL+subprogramClosureHash+profileRef+frameId+scopeEpoch`；人工编辑新修订必须保留`wasRevisionOf`/原字节。禁止以展示文本替代NC源文件，禁止把编辑器的token高亮诊断标记为执行语义。

**独立消费者D13**：由与D12编辑器不同模块重读最终NC bytes（含多文件闭包），解释真实控制器Profile及语义，输出物理行byteSpan/调用栈/迭代号/模态前后态。至少针对N号重复、混合换行、未知编码、含分号的注释、块删除、外部子文件更改、宏/循环未知、权限撤销、CAS冲突、取消晚回执执行正反验证；如需真实控制器才可判定的行为必须`UNKNOWN`。

**独立消费者D14/D15/D16**：D14根据D13动作及D10实际机床参数展开关节轴时序；D15独立NC工程验证（碰撞/限位/可达性证据）与D11 CL预览分离，未知/未运行/旧哈希/无权限时D16禁止发布。必须在真实产品上完成消费者测试后才填写PASS。

**迁移与恢复**：Expand→Migrate→Contract，先支持双Reader和不破坏历史D12修订，修订/子程序manifest签名或散列核对，回放迁移差异，再评审撤掉旧读取通道。保留用户数据库、D08冻结、历史golden与原已发布D16；失败按完整版本组合回退引用，禁止以CLI或绕行API跳过权限拒绝。

**当前事实**：仅规划文档与合成规则/语义测试，独立Node文件运行、真实解释器、机床、消费者、Windows部署均NOT_RUN；17资产Owner正式会签与L3待审。规划PASS≠产品PASS。
