# CAP-07-05｜B62 理想球刀残高与表面质量实测严格分层

**2026-10-31；规划专项，L3待人工审查。** 11域88CAP/36原工作包/17资产与L1/L2不变。关联F1-03/E3-01/U4-04，不改变产品、原冻结或机床数据。

## 数学Golden与适用前提

只有在**严格平面、球端理想半径R、平行等高刀路、步距s为实际切向长度、无磨损挠度**的二维截面，理想球冠最大残高才为`h=R-sqrt(R²-(s/2)²)`，域`R>0,0<s≤2R`；目标h的最大理论步距`s_max=2sqrt(2Rh-h²)`，`0≤h≤R`。本关系是Procet从圆方程独立推导，不是ISO或厂商认证。对R=5mm、s=0.8mm，`h=0.0160256822491549mm`；s=1mm则`h=0.0250628144669003mm`，超过本合成目标0.020mm；反算s上界0.893532316147547mm。1e-12mm为本地Double数值断言阈值，**不是机床容差、实际测量精度或表面质量承诺**。

自由曲面、斜面、锥形球刀、刀轴倾角、切向度量及曲率发生变化时，名义R不等于真实有效接触半径，UV参数差不能代替毫米。必须由B-Rep、真实刀具接触和曲率Oracle独立证明；缺证据为`UNKNOWN`。OCCT8.0.1 `GeomLProp_SLPropsBase`公开`IsNormalDefined/IsCurvatureDefined`，本轮读的是8.0.1 API镜像方法文本，**没有真实OCCT调用**。

理想残高h≠Ra、GD&T、实际轮廓纹理或D17测量。ISO 21920-2/3:2021**仅核对合法官方目录/摘要**，并没有读取收费正文或宣称条款。Sandvik公开厂商资料提到锥形球头刀刃结构与残高，不能据此认证本例。NIST 2001/2002的**出版页摘要**提示磨损、机床刀具柔性和动态影响实际表面；两篇论文正文未读，不应外推铝/钛工件指标。

## 领域端口、失效及GUI/3D

D03刀具、D02 B-Rep、D04工艺Setup、D07有序阶段Stock都以exact revision/hash/frame读取，D07本阶段前态必须严格匹配上阶段封存输出。D09属07域业务Owner；唯一`D09.StageFinishPort.inspect/previewCusp/commitNeutralCLWithCAS/cancel/rollbackAsNewRevision`供GUI/CLI/Agent共用。ACL、expected/current Revision/Hash/Frame、ScopeEpoch、taskGeneration和取消令牌在正式提交时重新检验；晚回执STALE，权限拒绝REJECT。D08冻结和A/B共享事实不可覆盖；旧数据缺确证只读UNKNOWN，按Expand→Migrate→Contract迁移、回退追加新Revision而非破坏原数据。

仅一个Babylon Engine/Scene/Canvas，统一左侧TaskPanel、字号上限12px、浅/深主题。UI显示“理想几何候选·非Ra·非NC验收”；3D拾取只预览不可自动提交。D04名义Setup与D10实际执行绑定严格区分。中立D09 CL→D12后处理生成最终NC→D13独立解释执行语义→D14物理Joint时序→D15独立工程验证→D16受控发布。CL动画≠NC工程PASS，控制器语义未知为UNKNOWN，不做材料扫掠仿真。D03/04/07更新使派生D09→D16精确失效，真实消费者须各自读取同Revision/Hash/Frame并独立验收。

## 可机器验证的追踪

[7项来源及访问深度](../../../research/sources/CAP-07-05-scallop-b62.json) → [8规则/字段/原编号包](../../../research/traces/CAP-07-05-scallop-b62-v08.json) → [43项正反/过期/未知fixture](scallop-b62-fixtures-v08.json) → [Node只读执行工具](../../../tools/check_cap0705_scallop_b62_v08.cjs) → [证据等级](../../../tracking/cap0705-scallop-b62-verification-2026-10-31.json)。本轮V8相同判定函数43/43合成PASS：LOCAL_SCALLOP_CANDIDATE 2、REJECT 26、UNKNOWN 8、STALE 7。独立Node完整GitHub文件执行、真实OCCT、NC/B5/OEM、D17实测、17资产Owner签署和真实独立消费者均NOT_RUN，L3待审。**规划PASS≠产品PASS。**

| 来源 | 2026-10-31实际阅读范围 | 限制 |
|---|---|---|
| B62-S01/S02 ISO/TC213 21920-2/3:2021（-2勘误2022-06） | 官方公开目录/摘要 | 未读收费正文 |
| B62-S03 Sandvik | 厂商产品描述/范围 | 未认证本例 |
| B62-S04 OCCT8.0.1 | API镜像法向与曲率方法 | 未运行真实OCCT |
| B62-S05/S06 NIST（2001/2002） | 官方论文出版页及摘要 | 未读全文 |
| B62-S07 Procet原规划Git Blob | CAP-07-05完整业务规格 | 内生规则非外部标准 |

作者、版本、访问URL和章节深度详见source JSON，不复制版权标准正文。

