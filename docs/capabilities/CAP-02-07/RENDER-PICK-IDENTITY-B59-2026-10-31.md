# B59｜CAP-02-07 资源几何：显示Mesh实例拾取与权威B-Rep来源身份（2026-10-31）

本稿是原CAP-02-07《资源几何与参数化》的专项补证，关联原F1-02、F1-03、F1-06、E3-04、U4-02、U4-03。11域、88 CAP、36原编号包、17资产不变；L1/L2不修改、L3待人类审查；NEWLY_AUTHORED，不是历史附件原始字节恢复，规划PASS≠产品PASS。

## 1. 独立问题：点击显示三角形不等于选中了业务Face

同一个刀具Mesh可在组件A和组件B实例化两次：只用meshId反查资源会把B的点击错误写入A；面片triangleId在重剖分时可能重排，OCCT的IsPartner不等于装配同一实例。WebGL重建、GPU拾取缓存刷新、工程切换与取消晚回执还会造成陈旧选中结果。

权威链：D03精确Resource Revision/Hash/Frame与Scope → CAD B-Rep/参数来源 → 受控剖分Mesh Revision（偏差/算法/epoch）→ 实例注册表（meshId、thinInstanceIndex、instanceKey、epoch）→ triangleId → 剖分构建时登记的triangle-to-source-Face证据 → D03 Owner提交前复核。任何环节缺失只允许DISPLAY_ONLY/UNKNOWN/STALE/REJECT，不得从视觉相似补造权威关系，不得把显示结果当D15工程认证。

## 2. 合法资料的实际阅读范围

- [B59-S01 OCCT 8.0.1 Mesh用户指南](https://occt3d.com/dev/doc/overview/html/occt_user_guides__mesh.html)：阅读Mesh presentations及BRepMesh_IncrementalMesh线性/角度偏差。说明剖分与显示关系，但不认证加工精度、物理碰撞或跨重剖分的triangle ID。
- [B59-S02 OCCT 8.0.1 TopoDS_Shape API](https://www.occt3d.com/dev/doc/refman/html/class_topo_d_s___shape.html)：定点核对Location、IsPartner、IsSame、IsEqual。同TShape不能推定同安装位置，Mesh ID更不能直接推导OCCT Face身份。
- [B59-S03 Khronos glTF 2.0.1](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)：官方§3.4、§3.5.3、§3.7.4，2021-10-11；位置为米，mesh可被多个Node实例化且变换不同；glTF支持非刚体与反射并不代表Procet机械Frame可以接受这些变换。
- [B59-S04 Babylon.js Mesh Picking](https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/picking_collisions)：阅读GPU picking、thinInstanceIndex与setPickingList缓存刷新要求。在线文档版本未锁定到当前产品，真实GPU/浏览器适配NOT_RUN。
- [B59-S05 NIST IR 7796](https://www.nist.gov/publications/mbe-standardization-and-validation)：Lubell、Hartman、Cheney，2011-07-06；**只读官方目录与摘要**，仅用作轻量模型与产品验证须区分的研究背景，绝不声称PDF正文或未读条款已查。
- [B59-S06 固定原CAP-02-07](https://github.com/BaiSongt/procet-devplans/blob/fa65826b08d7e81d2a9825b7a2d43195898ed33e/docs/capabilities/CAP-02-07/README.md)：原Git Blob e3fdedcc2e5be673c4f8c65bb428b94a8028e5a2已读；业务Owner/CAS/GUI/CLI/Agent/D04-D10隔离是**内生需求**，不是外部规范条文。

六项来源的作者、版本、日期、公开URL、2026-10-31访问、章节、深度与局限见[来源登记](../../../research/sources/CAP-02-07-render-pick-b59.json)。

## 3. 数学Golden与实例反例

合成CAD局部点为(10,0,0)mm，绕Z轴旋转90°并沿X正向平移20mm，要求明确变换为先旋转后平移。转换到glTF米制后应为(0.020,0.010,0)m。一般表达为：

\[
p^{m}_{world}=0.001(Rp^{mm}_{local}+t^{mm}),\qquad R^T R=I,\quad\det R=+1.
\]

这是内生SE(3)来源资格，不是glTF对所有Node的约束。**合成fixture的transformMm明确按行主序4×4记录，平移在每行第4列；写入glTF规范列主序矩阵前须显式转换，不能直接复制16个数值。** 错误的米制缩放、左/右乘混淆、反射或非单位缩放必须拒绝，未知单位不能默认成mm。

同一meshId=shared-tool-geometry，instanceIndex=0指向assembly-A/node-1，instanceIndex=1指向assembly-B/node-1。绑定注册表epoch=6及sceneEpoch=3，索引换代后回执STALE，不能沿用旧index。Triangle 12在特定Mesh Revision下映射Face 7；来源证明必须同时包含CAD Hash、实例身份、Face Ref、Mesh Epoch。未证明的triangle仅高亮DISPLAY_ONLY；显示网格不负责几何公差或刀柄碰撞工程资格。

合成linearDeflection=0.02mm与angularDeflection=0.3rad仅作完整证据样例，**不是通用OCCT容差或OEM实际合格范围**。

## 4. 字段与8项可机器检规则

[8条追踪](../../../research/traces/CAP-02-07-render-pick-b59-v08.json)覆盖：
1. R01 D03 ACL、exact Revision/Hash/Frame/ScopeEpoch；
2. R02 CAD mm与glTF m、刚体正交性和Golden；
3. R03 CAD来源、Mesh Hash、mesher配置及epoch；
4. R04 同Mesh多实例的thinInstanceIndex和受控InstanceKey；
5. R05 Triangle→source Face及同一CAD/实例证明；
6. R06 SceneEpoch、任务代次、取消晚回执；
7. R07 单Babylon世界/Canvas、唯一左TaskPanel、≤12px、GUI/CLI/Agent同D03 UseCase；
8. R08 D04名义Setup/D10实际执行绑定分离、D08冻结不可覆盖、禁止凭CL或Mesh推D15 PASS。

C0仅传身份、版本、哈希、单位、Frame、Scope及最小协议。D03仍独占资源定义与来源，Renderer只读显示。GUI点击或Gizmo尺寸拖动只能生成候选；后端D03受管Port提供readExactResource、resolvePickCandidate、proposeResourcePatch、commitCAS，由Owner重新核对用户ACL、期望版本、ScopeEpoch、Frame、任务代次、取消状态与来源，再写新Revision。不能从点击回执直接更新刀柄安装、TCP、实际H刀补或机床程序。

## 5. 交互、失效传播、回退与独立Consumer

统一左TaskPanel的制造资源页将点击对象显示为“显示对象 / 证据未知 / 精确来源候选”；在唯一Babylon Engine/Scene/Canvas上展示当前资源实例及来源Face，主工程和资源空间只横向切换，不增加第二个3D。对显示代理允许半透明区域高亮，不假装原生精确Face。GUI、CLI、Agent通过同一领域UseCase，出现无法定位的Face必须返回结构化原因。

资源编辑提交后新D03 Revision单独保存，旧D03、D04、D10及D08冻结均不覆盖；按精确依赖关系判定哪些CL/NC/执行链D12→D13→D14→D15→D16需STALE，未知依赖范围保守升级。D04名义Setup绝不代替D10实装。Expand→Migrate→Contract：旧mesh-only Reader继续只读DISPLAY_ONLY，新Writer要求精确实例/Face契约；影子读取与独立消费者验收后才切换，失败回退到已核验Reader与完整修订引用，不能修改历史原字节。

独立验证要求D04/D10消费者分别覆盖同Mesh两个安装实例、重剖分后旧Face索引、重建WebGL/实例缓存、撤权、冲突、取消晚回执、单位/矩阵反例和回退；09域独立验证真实机床Frame。最终NC必须重新走中立CL→后处理D12→D13执行语义→D14物理Joint轴时序→D15工程验证→D16人类发布。真实OCCT、Babylon、NC/B5/OEM、17独立消费者与正式Owner会签**NOT_RUN**，L3待人类审。

## 6. 可复核交付

[6来源](../../../research/sources/CAP-02-07-render-pick-b59.json) → [8规则与原编号工作包](../../../research/traces/CAP-02-07-render-pick-b59-v08.json) → [44合成正反/未知案例](render-pick-b59-fixtures-v08.json) → [只读Node校验工具](../../../tools/check_cap0207_render_pick_b59_v08.cjs) → [分级验证记录](../../../tracking/cap0207-render-pick-b59-verification-2026-10-31.json)。

独立Node进程的44个合成案例可通过仅证明此判定器和这些输入的数据一致；并未证明实际OCCT triangulation的映射生成、GPU picker输出或资源实际Owner实现。正式Owner0/17、真实独立消费者0/17，历史原始附件和全仓GFM AST审计未闭合。**规划PASS≠产品PASS。**
