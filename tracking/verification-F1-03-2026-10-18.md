# F1-03｜2026-10-18本轮核验记录

状态：规划核验，不是产品验收。原工作分支HEAD为6f906e327fa00e9d2573c3abd0a3a5d8bf24586f；准备树66900164d62bbf024b7e004c3f269571d06a2e39已回读。生成树对象不算推送，交付必须以更新分支后的实际回读为准。

## 实际执行范围

环境：Linux，Python 3.13.5。运行命令：

```sh
python checks/check_f103_plan.py --self-test
python -m py_compile checks/check_f103_plan.py
```

两条命令均退出0。第一条仅对F1-03来源与追踪两个JSON执行结构/编号/对应关系检查：8条来源、10条规则、20个验收编号、10个子任务编号，错误列表为空。8组检查器负例均正确拒绝：缺来源、重复来源、未知引用、误标产品通过、短SHA、缺验收覆盖、合成授权参数URL、仓外追踪路径。它们是检查器反例，不是20条产品验收已执行。

为避免把同名本地草案当作远端文件，本轮从GitHub已创建的blob回读两个JSON并与本地检查输入比对，Git blob一致：

| 检查输入 | Git blob |
|---|---|
| research/traces/F1-03.json | 9cec1df474c26a70d1b07e018b24e66c8291f381 |
| research/sources/F1-03.json | 5ed0a13f1d5b3b94a30beeb825572ec5cb213d8b |

检查脚本6509字节，Git blob为7589036a4b186a5ecbc74094b941a244b5536e00。脚本内容哈希是否与入库结果一致须以实际树回读核对；本记录不预填尚未生成的提交SHA。

## 已做定点审阅，未声称自动化通过

重新读取CAM@fcec1c86047e6b11be35b8bb38971e3dfcffbd7b的lib、facade、ports和boundary_audit；修正能力声明/请求许可歧义，列出固定文件数组与内联path的扫描覆盖缺口。F1-03主文与接线矩阵定点检查了10个子任务、20条产品规格及Owner/恢复边界；上述Markdown未在本轮执行全量语义自动检查。

8个新登记来源网页本轮重新读取；ISO仅目录/摘要。旧61条来源保留原记录，本轮没有重新读取全文。原CHANGELOG全文通过复用原blob保存在docs/history/changelog-through-20261017.md，不丢失历史记录。

## 未执行

全仓Markdown链接检查、旧61条来源完整解析与去重、完整产品构建、Rust/TS/OCCT测试、Windows EXE、真实动态消费者追踪、数据库回退、控制器和实机验证均未执行。历史22项/6项数学检查本轮未重跑。未启动付费CI，未修改产品仓库与数据库。

本轮工作包编制状态为待评审；设计批准、产品实现与验收另行记录。最终分支与PR状态必须由GitHub实时读回确认，不能由本记录推定。
