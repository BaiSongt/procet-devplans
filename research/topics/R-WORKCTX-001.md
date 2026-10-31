# R-WORKCTX-001｜WorkContext作用域隔离、导航与正交展示
> U4-01专题。2026-10-25按官方开放来源逐项核对；来源ID、日期、章节、限度见 [来源登记](../sources/U4-01.json)，[10条可检规则与20正反](../traces/U4-01.json)。
## 事实层与推导层分开
1. W3C WCAG2.2第2.4.3、2.4.11、WAI APG的Tabs/Keyboard章节是键盘和焦点设计依据；不定义CAD/Setup主键，**业务exact引用是Procet的工程推导**。
2. Vue Router导航守卫在路由切换时提供取消/异步控制；WHATWG HTML History仅定义会话导航，不能当工程数据库或权限系统，**contextEpoch/Generation**是本方案增加的工程约束。
3. BabylonJS官方明确支持多个Scene，故**“单Scene”是Procet既定架构决策，不是Babylon规范限制**。Scene内租约与Preview释放必须由真实产品测试证明。
4. RFC9110 §13 If-Match有强比较以避免丢失更新的语义，但这里只类比Domain Owner CAS；业务权限撤销/冻结/多库持久性由Procet实现，不能把路由守卫当事务。
5. W3C PROV-O提供衍生/修订概念；Frame和hash必须来自D01/D04 Owner。DOM AbortSignal可发出取消，不能保证后台计算已终止，晚回执仍需代次门禁。
## 追踪与局限
来源→规则→字段→U4-01→正反验收一一记录。规划校验可运行`node tools/check_u401_planning_2026_10_25.cjs`；产品多文档、真UI焦点、实际Babylon GPU、实际Owner提交未运行。仅引用开放标准章节和指导，不复制专有正文，不宣称L3获批。
