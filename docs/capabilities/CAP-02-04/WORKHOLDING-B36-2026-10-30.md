# CAP-02-04｜B36夹具额定能力、规划开口与实际观测隔离

2026-10-30；V0.8研究补证，L3待人审，原11域88CAP/36原包/17资产不变。[原CAP](README.md)与[UI](UI.md)保持原字节。**规划PASS≠产品PASS。**

## 明确边界

D03夹具资源已发布开口范围 ≠ D04工艺Setup的计划夹口 ≠ D10机床实际绑定 ≠ D17现场传感观测。D03参数可以使预览在4–80mm内选择40mm（均为无实物来源的合成值），不证明已夹紧、工件稳定或D15验证通过。D13解释→D14轴时序→D15独立验证→D16受控发布继续隔离。CL动画或局部3D摆放不得授予NC发布许可。A/B同源工程事实不得覆盖冻结版本；不做材料扫掠仿真。

## 外部证据深度

- [OCCT 8.0.1 gp_Trsf](https://occt3d.com/dev/doc/refman/html/classgp___trsf.html)公开API确认缩放和镜像构造存在；因此仅靠gp_Trsf类型不能证明是正交且无反射的合法安装。未运行Native。
- [OPC Foundation OPC-40501-1 v1.02.0](https://reference.opcfoundation.org/specs/OPC-40501-1)于2024-11-01发布；只核对官方版本/命名空间目录，未读节点正文；不能捏造已定义的夹紧位或B5硬件接口。
- [NIST Lee/Haynes (1987-05-29)](https://www.nist.gov/publications/finite-element-analysis-flexible-fixturing-system)论文仅核对摘要：夹具接触力、摩擦、弹性和加工载荷需模型及证据。PDF未读，不能代入默认摩擦系数或认证安全。
- [RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html)§13.1.1/§13.2公开条件请求只可类比CAS；业务权限重验/ScopeEpoch/取消晚回执属于[原CAP固定Blob](https://github.com/BaiSongt/procet-devplans/blob/7ed7aee8980a134fa5996f253ea77b6cc8cfd87f/docs/capabilities/CAP-02-04/README.md)内部设计约束。

详细作者、版本、URL、访问深度与局限见[5项来源](../../../research/sources/CAP-02-04-workholding-b36.json)。[8条规则](../../../research/traces/CAP-02-04-workholding-b36-v08.json)机器追踪B36-R1至R8分别覆盖：精确资源发布闭包、刚体接口方向、额定容量区间、D03/D04/D10分离、实际状态UNKNOWN、力学证据不越级、CAS+权限重验及取消Fence、GUI/CLI/Agent单Owner Port和唯一Babylon世界/左TaskPanel/≤12px及冻结回退。各规则有sourceIds→字段→CAP-02-04/原编号工作包→正反ID；合成用例[2正45反1未知](workholding-b36-fixtures-v08.json)，每个反例只更改单字段。无sensorEvidence却收到CLOSED时只能返回UNKNOWN，不视为合格夹紧。

## 失效、迁移与独立消费者

修改额定开口/接口必须派生D03新修订并使依赖D04/D10的消费者按实际关系失效；保留旧发布资源只读和旧Reader迁移/回滚，不原位覆盖旧版；权限变化、CAS冲突、撤销、晚回执拒绝提交。GUI/CLI/Agent同一个WorkholdingOwner Port，唯一活动Babylon Engine/Scene/Canvas、左UnifiedTaskPanel；3D选中只是意图，不是持久化提交。独立验收须由D04 Owner核验Frame和资源revision、D10 Owner核实实装和传感、D15 Owner核验真实载荷/NC与运动、D16 Owner检查签发前精确证据；不存在由本合成校验自动出具的OwnerReceipt。

[只读Node入口](../../../tools/check_cap0204_workholding_b36_v08.cjs)及[验证等级](../../../tracking/cap0204-workholding-b36-verification-2026-10-30.json)。本轮V8同函数验证，独立Node文件进程、真实夹具/OCCT/OPC/NC/B5与17独立消费者 NOT_RUN；正式Owner 0/17；L3 PENDING_HUMAN；历史原字节与全仓GFM AST仍待终核。
