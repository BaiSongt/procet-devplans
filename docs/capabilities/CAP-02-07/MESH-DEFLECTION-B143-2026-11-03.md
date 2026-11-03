# B143｜CAP-02-07：OCCT剖分偏差、LOD与工程精度资格
**2026-11-03｜原编号CAP/原包不变｜L3 PENDING_HUMAN｜规划PASS≠产品PASS。**

## 本轮独立补证的问题
原CAP-02-07已设计B-Rep与显示网格用途分层；B59关注Mesh拾取身份，B117关注glTF单位与变换。本轮处理不同缺口：**调低线性剖分偏差不等于获得对应CAD制造精度，更不等于NC无碰撞证明。**
OCCT 8.0.1官方Mesh指南将Linear/Angular以及Face内部偏差分开；官方指出当请求线性偏差小于形状自身Tolerance时，算法考虑形状Tolerance而非保证更小请求。BRepMesh_IncrementalMesh API的isRelative=true说明边的请求偏差按其尺寸缩放，Face偏差取边上的最大值。BRep_Tool公开接口允许按meshPurpose选三角剖分并返回Face Location。**这些是API/说明，不是某一实测模型的连续曲面误差上界。**
Khronos glTF 2.0规定米、右手Y-up以及三角Mesh/Primitive组成；该显示/交换层不能自证B-Rep拓扑或制造容差。

## 实施规则与职责
- D01拥有CAD/精确几何与Topology/Occurrence来源，D03拥有制造资源几何与派生Mesh；Renderer的triangleId、LOD和meshId不得成为D01永久Face身份。生成 `MeshDerivative{sourceExactRef,sourceHash,frame,units,meshPurpose,location,mesherVersion,algorithm,isRelative,linearDeflection,angularRad,shapeTolerance,triangulationHash,scopeEpoch}`，缓存键与源及参数精确绑定。
- R01–R04记录exact revision/hash/Frame/单位、正线性/弧度角偏差/相对标记、形状容差、meshPurpose与Face Location；缺条件返回UNKNOWN，不默认宣称有效精度。单纯把0.005mm作为参数，不能在原形状容差0.020mm时写“已认证0.005mm”。
- R05–R06把独立真实几何Oracle、Face内部误差、LOD新旧缓存索引、实例Frame变动定义为必要证据；理想圆弧公式 `h=R(1-cos(theta/2))` 仅适用本轮数学Golden，**不等同OCCT全局上界**。glTF米→CAD毫米只能转换一次。
- R07–R08：D11中立CL动画只能输出CL_ONLY；D12最终NC→D13独立解释→D14轴时序→D15独立工程验证→D16授权发布必须完整。D04名义Setup与D10实际安装分离，UNKNOWN不能上机。GUI/CLI/Agent共享D03 Owner Port，单Babylon世界/统一左TaskPanel。CAS、ACL、Frame、scopeEpoch/generation和取消Fence在写入点重验；晚ACK、撤权和切空间拒绝旧commit；不覆盖A/B冻结、保留旧reader/schema/Profile联动回退；不实施材料扫掠仿真。

## 证据、独立正反机器测试与应用边界
[5项分级来源](../../../research/sources/CAP-02-07-mesh-deflection-b143.json) → [8规则、32字段与F1-02/F1-06/E3-04](../../../research/traces/CAP-02-07-mesh-deflection-b143-v08.json) → [8正32单字段反7 Golden](mesh-deflection-b143-fixtures-v08.json) → [Node只读校验器](../../../tools/check_cap0207_mesh_deflection_b143_v08.cjs) → [核验状态](../../../tracking/cap0207-mesh-deflection-b143-verification-2026-11-03.json)。
OCCT指南/API是同一项目不同章节（**不能作独立出版物计数**）；glTF为公开规范检索选段；来源JSON记录作者、版本、链接、章节、2026-11-03的阅读深度和外推限制。未读收费标准正文，不虚构条款。G01–G02弓高只计算圆弧数学，G03–G04为isRelative代数代入，G05–G07是资格状态，不代表真实OCCT三角网性能。
**跨域独立消费者门禁**：D01须验证Face/Occurrence exact映射，D03须验证相对与绝对偏差/容差、缓存失效与取消，D11不得把Mesh预览提升D15，D15必须独立核对最终NC和物理机床证据。测试入口 `TODO_OCCT_801_MESHER_TOLERANCE`、`TODO_D03_LOD_IDENTITY`、`TODO_D15_MESH_NOT_CERTIFIED`、`TODO_UI_CAS_CANCEL`，均未真实运行。
**本轮仅机器可判的规划合成40+7；独立Node文件进程、OCCT/Babylon、实际D01/D03/D11/D15消费者、真实NC/B5/OEM、历史附件原始字节、GFM全仓AST均NOT_RUN，正式Owner 0/17，L3 PENDING_HUMAN。**
