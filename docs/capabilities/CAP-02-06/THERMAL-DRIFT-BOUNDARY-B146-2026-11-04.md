# B146｜CAP-02-06 在机热漂移测量、预测与执行资格隔离（2026-11-04）

**状态：L3待人审，规划合成不代表产品通过。** 这是原[CAP-02-06](README.md)与[R-MET-001](../../../research/topics/R-MET-001.md)的补证，不增11域/88CAP/36原工作包/17资产数量。关联原F1-01/F1-02，不重复B71不确定度判定或B107测头模式。

## 一、真实已读范围及局限
[NIST 2026-06-09研究记录](https://www.nist.gov/publications/process-optical-measurement-and-compensation-machine-tool-thermal-deformations)：只读官方作者、出版日期、摘要；摘要涉及在机光学测量、2D-FFT/Hough处理及实验补偿，**论文全文与原始数据未读**，绝不外推“100秒”或具体精度为Procet通用要求。[ISO 230-3:2020官方目录](https://www.iso.org/standard/73291.html)确认2026仍有效，仅公开摘要的环境温度/主轴/线性轴/旋转部件热影响四类测试，**收费正文未读**，不捏造第7章阈值。[NIST 2023视觉监测](https://www.nist.gov/publications/vision-based-thermal-drift-monitoring-method-machine-tools)与[机床校准综述](https://www.nist.gov/publications/machine-tool-calibration-measurement-modeling-and-compensation-machine-tool-errors)仅著录摘要；[BIPM JCGM 100:2008及2026修订目录](https://www.bipm.org/en/committees/jc/jcgm/publications)仅目录/DOI摘要，不推断覆盖因子；[W3C PROV-O](https://www.w3.org/TR/prov-o/)仅公开摘要借鉴来源链。七项独立来源登记中还含[本仓固定HEAD原CAP业务规格](https://github.com/BaiSongt/procet-devplans/blob/5193014d3966ff8c78c168d5371bba7d21dcce0a/docs/capabilities/CAP-02-06/README.md)，不算外部论文。

[原始分级来源](../../../research/sources/CAP-02-06-thermal-drift-b146.json) → [规则/字段/原工作包](../../../research/traces/CAP-02-06-thermal-drift-b146-v08.json) → [8正32独立字段反+8 Golden](thermal-drift-b146-fixtures-v08.json) → [只读Node](../../../tools/check_cap0206_thermal_drift_b146_v08.cjs) → [执行层级](../../../tracking/cap0206-thermal-drift-b146-verification-2026-11-04.json)。

## 二、数据与所有权
02域D03拥有测量设备能力、传感器/校准/热模型/算法适用范围，不拥有10域D17**实际工件采样**；热漂移预测不能被写成实际测量合格。D03每条模型需保留：设备、校准、传感器与模型exact revision/hash、父子Frame、单位、温度采样时间基及其窗口、原始观测blob、传感器偏差/量化误差/不确定度说明、算法版本与标定温度/位置域。过期、外推、原始观测丢失、模型不可辨识均只输出UNKNOWN/STALE。
D04名义Setup不等于D10真实机床、装夹、刀具和控制器执行绑定。D03不得越过08域D12改写NC：如最终NC发生改变，须从新D12原始字节按确切控制器Profile经D13解释、D14物理轴时序、D15独立工程验证、D16授权发布；CL动画和“预测补偿成功”均不是NC PASS，未知语义不得上机，不做材料扫掠仿真。

## 三、8规则及32个独立字段
|规则|业务与失败状态|四个必须可核字段|来源|
|---|---|---|---|
|B146-R01|D03资源与校准来源精确锁定；`UNKNOWN_RESOURCE`|`d03RevisionHashExact / sensorCalibrationExact / frameAndUnitExact / ownerPortDeclared`|B146-S02, B146-S05, B146-S07|
|B146-R02|原始热漂移观测保留时间基与来源；`UNKNOWN_OBSERVATION`|`rawObservationHash / sensorTimestampMonotonic / timebaseVersionPinned / uncalibratedInputNotTruth`|B146-S01, B146-S03, B146-S07|
|B146-R03|环境温度与补偿有效时间窗；`STALE_THERMAL_WINDOW`|`temperatureSeriesExact / windowPolicyVersion / extrapolationUnknown / spatialRangeDeclared`|B146-S01, B146-S02, B146-S07|
|B146-R04|热模型参数/方向/单位/算法资格；`UNKNOWN_MODEL`|`modelRevisionExact / signedFrameDirection / parameterUnitConsistent / algorithmApplicabilityPinned`|B146-S01, B146-S05, B146-S07|
|B146-R05|测量不确定度与实际计量结果隔离；`UNKNOWN_UNCERTAINTY`|`uncertaintyModelRevision / coverageAssumptionDeclared / uncertaintyNotZeroed / noAutomaticConformity`|B146-S04, B146-S02, B146-S07|
|B146-R06|D03预测模型与D17本件结果所有权分离；`REJECT_DOMAIN_CROSSING`|`d03ResourceOnly / d17ActualReadingSeparate / noAutomaticActualMeasurement / independentConsumerSpecified`|B146-S03, B146-S06, B146-S07|
|B146-R07|热补偿不能绕开最终NC验证链；`REJECT_NC_PROMOTION`|`noDirectD12Overwrite / d04D10Separated / d13D14D15Required / unknownBlocksD16`|B146-S01, B146-S07|
|B146-R08|同域入口与受控事务回退；`REJECT_OWNER_COMMIT`|`guiCliAgentOneOwnerPort / singleBabylonLeftTaskPanel / aclCasEpochCancelRecheck / oldRevisionAndReaderRollback`|B146-S06, B146-S07|

每条规则1正4个**仅变动一个字段**的反例，产出仅`RESOURCE_MODEL_CANDIDATE_ONLY`。独立消费者须以不同代码路径验证输入和失效，不得让该测试器自行签D17、NC或资源Owner的最终PASS。

## 四、自建教学数学Golden（非文献算法）
简单标量线性演示`e(T)=b+kΔT`，`b=0.014mm`、`k=0.006mm/K`、`ΔT=4K`，预测`0.038mm`；若人为规定修正方向`-1`、原始读数`0.050mm`，则合成残差`0.012mm`。**不是NIST论文算法、真实体积误差模型、NC验证、计量合格/精度保证**。剩余Golden分别要求121s>120s时间窗、Frame冲突、不确定度缺失、试图越权向FINAL_NC写入和模型未批准都不能生成有效候选。

## 五、GUI/CLI/Agent、事务与迁移
三个入口共用`02.MeasurementResourceOwnerPort.readCalibrationExact/stageThermalModel/evaluateWindow/commitD03CAS/invalidate/readEvidence`；唯一Babylon Engine/Scene/Canvas，左UnifiedTaskPanel显示设备、版本、时间窗、可信状态和异常，字体≤12px、浅/深主题。3D可预览不提交；C0仅公共身份、单位、Frame、Hash、Revision、Scope，禁巨型Common。
Owner在事务提交点重新校验ACL、CAS expected revision/hash、Frame、scopeEpoch、taskGeneration、取消令牌；撤权与取消后的晚回执丢弃，已实际提交Receipt须保留并对账。失效事件只追加新revision，旧D08的A/B冻结成果不覆盖，D16历史可审计保留；双读旧Schema、Expand/Migrate/Contract与回退须有独立测试入口。独立D17消费者对原始测量复核，D13-D15对最终NC独立复核；目前签署0/17、实际消费者0/17、真实探测/OCCT/NC/B5/OEM测试NOT_RUN，L3待审，规划PASS≠产品PASS。
