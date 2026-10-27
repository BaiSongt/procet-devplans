# R-11DOMAIN-CROSSCHECK-001｜11域跨域研究、授权与NC证据分离

访问日期：2026-10-28。此研究直接服务11域交叉终核的**首轮**，不宣称已完成逐域逐条来源全文再审。

## 本轮新增的独立技术判断

- **同一来源血缘与实际授权是两套判断**：W3C PROV-O的Entity/Activity/Agent描述信息来源，而业务Owner唯一写入、ACL/CAS、冻结A/B与取消回执是Procet自定门禁，并非W3C强制。
- **哈希的语义必须精确声明**：RFC 8785 §3定义JCS可规范化的JSON子集；CAD/STEP/CL/NC按原字节Hash，若JSON宣称JCS Hash必须登记canonicalization profile/version。不允许把二者混同。
- **网络前置条件不能取代事务重验**：RFC 9110 §13.1—13.2的If-Match用于HTTP条件更新防lost update；并不证明业务Owner在撤权、取消、Frame变化后仍有提交权。
- **最终NC执行语义不可以由CL动画推断**：LinuxCNC 2.9 G-Code/G43仅提供其特定控制器的公开行为；真实控制器未建模的G/M/宏/补偿必须保持UNKNOWN，不能当作D15 PASS。
- **服务成功不代表每项操作成功**：OPC UA Part4 v1.05.07 §5.3明确区分serviceResult与每项StatusCodes。因此D17批量观测/命令回执须有逐项状态，且不等价机床运行授权。
- **数字线程背景不等于跨域互操作已验证**：NIST Digital Thread项目介绍覆盖工程、制造与质量间的交换研究；本轮未读取任何NIST付费或未获取的全文，也未运行消费方测试。

## 可复核证据与失效边界

[来源6项](../sources/DOMAIN-CROSSCHECK-V08.json) → [11条域规则、字段与CAP/原包ID](../traces/DOMAIN-CROSSCHECK-V08.json) → [映射与门禁矩阵](../../docs/architecture/v0.8/11域研究交叉复核_2026-10-28.json) → [正负机器案例](../../docs/architecture/v0.8/11域研究交叉验收_2026-10-28.json)。

这份来源只提供可验证的公共研究背景，不能代替领域Owner签署、L3评审和产品工程试验。后续仍需完成剩余Registry逐份审读与历史附件原字节审计，避免将本轮11域锚点扫描误报为“11域最终研究验收通过”。
