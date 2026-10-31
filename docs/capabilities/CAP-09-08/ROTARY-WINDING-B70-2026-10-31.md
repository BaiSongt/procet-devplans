# CAP-09-08｜B70旋转Joint累积圈数与Babylon姿态播放资格（2026-10-31）

**状态：规划专项补证，L3待人工评审；不能形成D15工程验证结论。** 沿用11域88 CAP/36原包/17资产，L1/L2不动。关联原CAP-09-08与原编号F1-02、E3-04、E3-05、U4-04，制造链为 D04名义Setup ≠ D10实装绑定；D09中立CL→D12最终NC→D13控制器解释→D14物理Joint时间轴→D15独立验证→D16发布。不得进行材料扫掠仿真。

## 一、数学反例与错误来源

固定转轴A的空间旋转有 `R_A(0)=R_A(2π)=I`。四元数 `q(0)=(0,0,0,1)` 与 `q(2π)=(0,0,0,-1)` 虽符号不同，却表示同一旋转姿态。因此**只凭首尾姿态，无法区分不动与完整一圈**；内置Quaternion.Slerp不足以恢复丢失的物理Joint累计角。

| 合成的D14来源 | t=0秒 | t=2秒 | t=4秒 | Joint累积变化 | 首尾外观 |
|---|---:|---:|---:|---:|---|
| A组（来源已给定整圈） | 0° | 180° | 360° | +360° | 相同 |
| B组（来源已给定静止） | 0° | 0° | 0° | 0° | 相同 |
| C组（来源已给定跨圈） | 350° | 360° | 370° | +20° | 350°→10° |

以上仅为**合成给定的D14物理Joint序列**，不声称现实LinuxCNC、B5或OEM会因某条NC指令实际按此轨迹运动。LinuxCNC2.9的`WRAPPED_ROTARY`由具体INI配置决定；不能从master文档推断2.9具备后续新选项。两帧350°与10°不能自动选择+20°还是−340°；若D13方言、Profile、实际D10轴链、D14累积角或时基缺失，返回`UNKNOWN`。端点姿态一致不代表路径/限位/碰撞相同，也不能把屏幕帧率当成D14物理运动时钟。

## 二、公开来源、访问深度与局限

| ID | 作者、版本、时间与访问定位 | 阅读范围与严格边界 |
|---|---|---|
| B70-S01 | [LinuxCNC Project，INI 2.9](https://linuxcnc.org/docs/2.9/html/config/ini-config.html) | 官方HTML [AXIS] WRAPPED_ROTARY、LOCKING_INDEXER_JOINT定点实读；不是B5/OEM运行证明 |
| B70-S02 | [Babylon.js官方高级动画](https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations)，滚动网页 | Controlling animations中的默认Quaternion.Slerp及evaluate读取；未跑目标浏览器 |
| B70-S03 | [OCCT 8.0.1 gp_Quaternion](https://occt3d.com/dev/doc/refman/html/classgp___quaternion.html) | SetRotation最短弧与SetVectorAndAngle公开API；不证明Joint行程 |
| B70-S04 | [Kibira、Shao，NIST 2026-01-29](https://www.nist.gov/publications/data-requirements-digital-twin-cnc-machine-tool) | **仅读NIST正式著录和摘要，未读论文PDF**；不推定机床性能数值 |
| B70-S05 | [W3C PROV-O，2013-04-30](https://www.w3.org/TR/prov-o/) | 公开正文的wasDerivedFrom和invalidatedAtTime等指定属性实读；不规定产品CAS |
| B70-S06 | [原CAP-09-08固定Git Blob](https://github.com/BaiSongt/procet-devplans/blob/269e665d298b44473c4b113b7cf0d5b613c3d291/docs/capabilities/CAP-09-08/README.md) | SHA `f6c3e48a23c2806bed08c2e82bc6e21dc6413e2f`，完整原规划实读；属内生业务规范 |
| B70-S07 | [ISO 841:2001，2版，2023确认](https://www.iso.org/standard/23949.html) | 只查ISO合法目录及Abstract，**未读收费正文**；不能编造解缠/轴运动条款 |

逐条记录来源作者、版本、发布时间、URL、2026-10-31访问及局限见[7份登记](../../../research/sources/CAP-09-08-joint-winding-b70.json)。矩阵恒等关系为基础数学推导；CAS/ACL、Owner端口、单Babylon/左TaskPanel属于Procet内生设计，不冒称ISO/NIST规定。

## 三、8条实施规则（来源→字段→CAP/包→验收）

| ID | 可机检工程规则 | 权威Owner/资产与关联包 |
|---|---|---|
| B70-R01 | 绑定`d12Hash/d13Hash/d14Hash/d10Hash/d03Hash`及exact revision | D03/D10/D12/D13/D14；F1-02/E3-04/E3-05 |
| B70-R02 | `joints.mode=UNWRAPPED_JOINT`及逐时累积角/明确delta；禁从端点Quaternion取最短运动 | D10/D13/D14；F1-02/E3-04 |
| B70-R03 | 时基和未知区间显式记录；时间不严格递增拒绝；`BROWSER_FPS`不得生成物理证明 | D13/D14/D15；E3-04/E3-05 |
| B70-R04 | 控制器Profile、D03机床Joint topology、Frame、degree单位；D04≠D10 | D03/D04/D10/D14；F1-02/E3-04 |
| B70-R05 | 唯一Babylon Engine/Scene/Canvas、左UnifiedTaskPanel、GUI/CLI/Agent同`PlaybackEvidencePort`；seek只读 | D14/D15；E3-04/U4-04 |
| B70-R06 | D15只能独立Oracle决定，不以视觉流畅或合成测试造PASS | D12/D13/D14/D15；E3-05/U4-04 |
| B70-R07 | 导出前重验Actor ACL、CAS expectedRevision/Hash/Frame/ScopeEpoch、代次与取消；晚ACK无写入 | D08/D10/D14/D15；E3-04/E3-05/U4-04 |
| B70-R08 | D08冻结与旧D16历史不被覆盖；Expand→Migrate→Contract双Reader、失败回退；真实D16独立消费为未测 | D08/D14/D15/D16；E3-05/U4-04 |

[结构化追踪](../../../research/traces/CAP-09-08-joint-winding-b70-v08.json)含8条规则的来源ID、字段、资产、CAP/原包及验收ID；[55条独立预期合成fixture](joint-winding-b70-fixtures-v08.json)与[只读Node工具](../../../tools/check_cap0908_joint_winding_b70_v08.cjs)可复查。合成分类：9个CANDIDATE_ONLY、24个REJECT、9个STALE、11个UNKNOWN、2个DISPLAY_ONLY；**合成结构合格不是D15 PASS**。

## 四、GUI/3D、数据契约与独立交接

唯一Babylon世界，左侧统一TaskPanel最多12px文字，浅/深主题。Joint时间轴应同时显示`jointId`、`timebase`、`unwrappedDeg`（370°）与`normalizedDisplayDeg`（10°）和缺失区间；通过Joint事件、NC字节区间、调用实例、D15 finding双向定位。GUI/CLI/Agent共09域受管只读Port；视口相机、播放倍速、seek、倒回、旋转拾取不能写D14或D15，更不能作为D16批准。未知Joint时段显示断带，不用动画补帧涂成工程安全。

Report必须回溯D12 NC字节Hash、D13调用实例、D10实际绑定、D03机床轴树、Frame证明、D14样本和未知段、D15 Oracle/覆盖和原始产品HEAD；D04名义Setup不得代替D10实际安装。D03/D10/D12/D13/D14的精确依赖变化令旧报告`STALE`，权限撤销/取消后晚回执不能提交；A/B共用同一事实但不覆盖D08冻结。17资产Owner的正式签署仍为0/17，D16真实独立消费者0/17。

## 五、验证边界及待做的真实工作

本轮只以V8执行与已提交脚本**同一judge函数**的55条规划合成断言，非独立Node在提交后完整文件运行。真实LinuxCNC配置/HAL、B5/OEM实际Joint、OCCT/Babylon GPU、D13/D14对照、D15独立区间Oracle与D16消费者都标`NOT_RUN`；未来必须记录独立实现、真实同NC/Frame、产品exact HEAD/二进制hash、命令/退出码、正反/未知/撤权数据、可复现报告及消费方Owner签署。ISO付费正文未读。**规划PASS≠产品PASS。**
