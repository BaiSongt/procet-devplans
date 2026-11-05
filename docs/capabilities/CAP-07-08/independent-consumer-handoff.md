# CAP-07-08｜独立消费者、迁移和无损回退
| 消费方 | 必须形成的真实exact证据 | 反例与否证 |
|---|---|
| D03/D04/D05/D07/D08 Owner | source revision/hash/frame/scope/D08冻结、材料有序前态、工具组件 | 源hash更换却仍取旧局部闭包应拒绝 |
| 07域独立D09 Reader | old/new不可变D09字节、typed段、stableSegmentId映射、实际算法版本 | 段消失无谱系、重复ID或圆弧不连续均拒绝 |
| D12 post | 新D09和独立D10执行绑定、post版本、新NC byte hash及行段来源 | 直接沿用修改前NC并显示PASS必须拒绝 |
| D13/D14/D15独立执行与验证 | 新NC执行语义、UNKNOWN定位、真实轴时序、限位/干涉/覆盖记录 | CL动画可播放而NC未执行仍是NOT_RUN |
| D16/D17发布和离线接收 | D09/D10/D12/D13/D14/D15完整exact闭包、人类审批与可信离线清单 | UNKNOWN/NOT_RUN/缺独立消费者任何一项阻发布 |
消费者记录至少含consumerRepo、exactHEAD、binarySHA256、contractVersion、oldD09Hash、newD09Hash、D04FrameHash、D07MaterialBeforeHash、D08FrozenHash、D10BindingHash、NCBytesHash、command、exitCode、observedResult、reviewer、executedAt、artifactsHash。未执行一律NOT_RUN，不虚构实机测试。
Expand→Migrate→Contract：旧Reader不删，追加新D09及谱系，独立消费者先验证兼容与回退；恢复只切换引用并重新验证相应NC证据，不删除客户数据、golden和D08历史冻结。
