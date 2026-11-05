# CAP-05-08｜统一规划校核与交接工作台
> V0.8 L3待审；本文件只描述交互。产品Babylon/Host未运行。

唯一Babylon全屏世界，ActivityRail选择“工艺”，左侧统一TaskPanel内分“必要输入/工序校核/冲突与来源/交接确认”四步；右侧Agent仅可显隐并复用同一05域Port。浅/深主题，字号不超过12px，警告文字不可只靠颜色。

1. 选择工程scope及A/B分支，左侧列出D01、D02、D03、D04、D05与D08的exact revision/hash/frame；D10执行配置另栏只读显示且不可填入D04。
2. 校核工序stableId与DAG有向边；3D仅按D02 occurrence高亮，有疑似ID变动显示“待人工映射”，不能以图形相似确认。工序缺必要特征、策略单位、资源能力或Frame证明时呈UNKNOWN并定位字段与Owner。
3. 预览用Gate Matrix呈现九项门：输入、依赖、特征、资源、Setup、冻结、局部失效、事务、消费者。未通过显示BLOCKED/UNKNOWN和下一可行动作；D08冻结不可直接写，A/B同源不互相覆盖。
4. 仅在用户明确执行“交接给D06求解”时由`PlanReadinessDomainPort.commitHandoff`重读ACL/CAS/epoch/generation及来源hash；取消后任务迟到回执不改变交接头。结果卡展示新D05引用、D06回执、D09待D07/D08闭包及未验证的D13/D15/D16，不出现“NC工程验证通过”。
5. 点击工艺或3D选择只读预览；回滚创建新D05修订与只追加审计。旧数据缺hash/frame显示只读迁移审查，不隐藏按钮背后虚假成功。

CLI候选：`plan readiness inspect|preview|commit|cancel|rollback`；Agent调用同Port而不是具有特权的写接口。测试入口：`node tools/check_cap_05_08.mjs`；此命令只校验规划与合成fixture，不证明产品通过。