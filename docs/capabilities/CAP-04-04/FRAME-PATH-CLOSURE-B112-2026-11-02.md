# B112｜CAP-04-04 多路径FrameGraph闭环、复合次序与“几何一致≠实装资格”（2026-11-02）

适用原88项中的CAP-04-04，关联原F1-02、F1-04、W2-05、E3-04、U4-02。L1/L2不改、L3仍待人类评审。该文档、全部矩阵与反例为新编规划证据，不是产品或实机结果。

## 本轮可证伪结论
04域持久化采用列向量左乘：`p_S = (^S T_P)(^P T_C)p_C`。设`^S T_P=Rz(90°)+t(100,0,0)mm`、`^P T_C=t(10,0,0)mm`：CAD原点在Setup中应为`(100,10,0)mm`；若把矩阵逆序相乘则变成`(110,0,0)mm`，**两者不能在同名Frame下互相替代**。合成替代路径`^S T_F=t(100,10,0)mm`和`^F T_C=Rz(90°)`得到与正路径相同变换。两条路径的SE(3)残差应同时检查平移和姿态，不能只比较原点位置。

数学门禁：每条原始输入矩阵必须有限、齐次末行正确、`RᵀR≈I`且`det(R)≈+1`，不接受镜像、缩放、剪切；`gp_Trsf::SetValues`对输入做正交化不能作为原矩阵合法证据。复合采用`T_A T_B`，逆算用严格SE(3)逆。对双路径`T_1,T_2`，例证采用`||t_1-t_2||₂`与`acos(clamp((tr(R_1ᵀR_2)-1)/2))`，两者需在**测试输入自行声明**的阈值内。本批`1e-6 mm / 1e-8 rad`只用于整数量级数学Golden，**不是工程、ISO、NIST或机床容差建议**。实际验收阈值须有04域Owner批准、来源及测量不确定度预算。

| 输入/反例 | 规划输出 | 拒绝错误升级 |
|---|---|---|
| 两条独立来源路径均exact、闭环一致 | CONSISTENT_CANDIDATE | 仅说明矩阵图一致，不授实装或D15通过 |
| 仅一条可追溯路径 | SINGLE_PATH_ONLY | 不冒充两条独立路径互证 |
| 来源缺失/路径复用同一个不可辨来源 | UNKNOWN | 不以“数学相等”自证独立性 |
| 0.05mm合成路径平移差 | FRAME_CONFLICT | 不静默选最近路径或自动修改旧D04 |
| 旧D01、Occurrence或Frame Hash | STALE | 相同显示名称不得复用旧证据 |
| 错误复合、非刚性、越权提交或CL冒充NC | REJECT | 不自动正交化修复/不覆盖D08 |

## 字段、Owner和交互端口
D01来源实例`{assetId,revision,contentHash,occurrencePath,frameId,frameHash,scopeEpoch}`必须由03域只读提供。04域D04的FrameGraph Owner候选只能将`{edgeId,from,to,rawMatrix,unit,sourceExactRef,provenanceEvent,measureOrNominal,algorithmVersion,thresholdPolicyRevision,pathRefs,loopResidual,uncertaintyStatus}`受控写入新修订；源路径存在而测量资格未知时`uncertaintyStatus=UNKNOWN`。PROV-O只提供来源表达术语，不规定这些产品字段或审批方式。D04名义Setup绝不能擅自填充D10实装Frame与控制器G54/G52/G92；设备实测须由具资格的D10 Owner与现场独立消费者提供原始证据。

GUI/CLI/Agent同用04域`FrameGraphPort.previewPathClosure / readExactSnapshot / commitWithCAS`。GUI左侧唯一UnifiedTaskPanel展示有向FrameGraph及多路径冲突，单Babylon Engine/Scene/Canvas只负责高亮与PreviewLease；不产生第二3D。最大文字12px、仅浅/深主题。提交时在Owner事务内复核exact revision/hash/frame、ACL、scopeEpoch、expectedHead CAS、taskGeneration、取消Fence与晚回执；取消或失权后仍可审计但不能接受写入。A/B共享D04事实不覆盖已冻结D08。失效按精确依赖闭包传播，Expand→Migrate→Contract保留旧Reader/快照和非破坏回退。

## 数据链路与独立验收责任
D04名义Frame变化只是重新定位下游候选。中立D09 CL→D12最终NC后处理→D13控制器实际语义→D14物理Joint时序→D15独立验证→D16受控签发；D11/Babylon CL动画不得当成D15产品PASS，D13未知始终UNKNOWN并阻断D16，不做材料扫掠仿真。验证入口`node tools/check_cap0404_frame_path_b112_v08.cjs`仅读规划JSON，不能替代OCCT Frame实例或现场测量/控制器读取。04域Owner需会签阈值、矩阵方向与D10分离；03域提供独立原实例修订，09域/D13-D15消费者重算有效性，最终人类L3审批。

[5项作者/版本/日期/阅读范围及局限](../../../research/sources/CAP-04-04-frame-path-b112.json) → [8条来源/规则/字段/CAP/原包/正反验收](../../../research/traces/CAP-04-04-frame-path-b112-v08.json) → [32项合成fixture及4项独立解析Golden](frame-path-b112-fixtures-v08.json) → [只读Node入口](../../../tools/check_cap0404_frame_path_b112_v08.cjs) → [验证等级](../../../tracking/cap0404-frame-path-b112-verification-2026-11-02.json)。OCCT8.0.1与Eigen官方指定HTML公开正文已读；NIST TN1911仅官方摘要，未打开PDF正文；W3C PROV-O只核对公开术语和摘要。没有将内生CAS/GUI/业务Owner归因于外部标准。规划PASS≠产品PASS。
