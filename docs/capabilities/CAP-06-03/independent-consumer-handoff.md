# CAP-06-03｜独立消费者交接合同（仅规划）
**权威Owner**：03域D01/D02、04域D04与D10、05域D05/D08、06域D06/D07、07域D09、08域D12/D13、09域D11/D14/D15、10域D16/D17；17项完整映射以[基线候选表](asset-owner-candidates.json)为准，所有Owner签署 PENDING_HUMAN。
**域端口**：`LocalBRepRemovalDomainPort.calculate/readEvidence/cancel`（06域）；`MaterialStateIndependentCheckPort.verify`（独立D07复核；实现时须与候选算法隔离）；`PlanAdoptionPort.adopt`（05域唯一采纳Owner）；`NcChainEligibilityPort.read`（07域只读先决资格）。Host C0只做id/revision/hash/frame/unit/scope路由、任务与回执，不存领域巨型实体。
**请求与响应**：见[DTO样例](contract.example.json)，每个Ref都有exactrevision/geometry bytes hash/frame/unit/setup；查询应返回包含真实OCCT形状、布尔历史、ShapeFix的新Revision、BRepCheck独立核对、protected/allowance证据的封存包。若任一项缺失报UNKNOWN，不返回合成的“真”Solid。
**独立验收**：消费者必须另进程从封存字节重载固定STEP测试集，重执行检查器并和前一版本逐项比对，至少覆盖12类工况正反、两种Setup及多Solid和三层岛屿；源数据可取合法公开案例或批准自造STEP，必须记录实际几何hash和OCCT版本。变化后由D05/07再核准，任何D09前置未满足不能调用D12；D13未知宏/RTCP/循环为UNKNOWN，后续D15/D16阻断。
**CAS/恢复**：对同项目不同Setup、A/B分支、权限撤销、晚回执、进程强杀及恢复做双进程测试；只承认Owner提交回执，不承认UI/Worker先显示成功；按W2-03精细失效及W2-04持久恢复规则处理。
**状态**：规划合成测试可运行；真实Rust/OCCT、D07/D05独立消费者、NC/实机及人工签署全部`NOT_RUN/PENDING_HUMAN`。
