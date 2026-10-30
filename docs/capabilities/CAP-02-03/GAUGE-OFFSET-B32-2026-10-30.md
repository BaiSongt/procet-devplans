# B32｜CAP-02-03 刀具总成量规、伸出、安装TCP与控制器刀补不得混写
日期：2026-10-30｜状态：**研究补证/规划合成；L3待人工审批、真实机床与独立消费者NOT_RUN**。

## 1. 工程问题与范围
对多段刀具总成，**Gauge Length**是指定量规基准到指定控制点的几何量；**Stick-out**是刀具相对夹持端的伸出，**Engagement**是有效夹持段。三者起止基准、来源和约束不同。控制器刀补（D10中实测、D13解释实际生效）也并不天然等于D03的名义量规长。把100 mm名义长度直接复制到任意控制器H值，可能造成二次补偿；刀具在3D看起来对齐不能证明机床TCP成立。

本轮基于原[CAP-02-03规格](README.md)进行专项补证，不重建资源数据结构、不更改11域/88 CAP/36原包/17资产分母。原工作包关联F1-02、F1-06、F1-04、E3-03/04/05/06、W2-02/03/04及U4-02/03。

## 2. 合法来源、已读层级与不能外推之处
- [ISO 13399-1:2006 官方目录](https://www.iso.org/standard/36757.html)：ISO/TC29；2006-02首版、2021复审确认；本轮只读Abstract/General information，**未读收费正文**。可证明存在切削刀具数据类别及关系的信息模型，不授权本稿任意字段为标准条款。
- [ISO/TS 13399-2:2021](https://www.iso.org/standard/81109.html)：ISO/TC29，2021-11第三版、2025复审确认；仅官方Abstract/适用边界。特别注意本部分是cutting items参考字典，不等于刀柄/连接件/总成所有字典。
- [Sandvik Coromant — Modular solutions](https://www.sandvik.coromant.com/en-us/knowledge/machine-tooling-solutions/tooling-considerations/modular-solutions)：厂商公开Modularity/Critical gauge length/Stick-out/Clearance正文；作者机构Sandvik Coromant，网页未标出版时间。强调模组链、振动及伸出不同设计因素；厂商工况经验不自动成为普遍认证限值。
- [LinuxCNC 2.9 G-Codes](https://www.linuxcnc.org/docs/2.9/html/gcode/g-code.html)：官方§28 G43、§29 G43.1、§30 G43.2、§31 G49公开正文。G43 Hn调用刀表，G43.1可动态替代当前偏置而不写刀表，G43.2可叠加；**仅适用于LinuxCNC2.9锁定配置**。
- [Haas Mill G43/G44](https://haascnc.com/service/codes-settings.type%3Dgcode.machine%3Dmill.value%3DG44.html)：Haas Automation公开G43/G44及NGC软件**100.21.000.1100起**行为说明；新版本自动刀补更新/跨开机保持的条件，与不能无条件套用LinuxCNC的默认值构成对比。具体B5/OEM机器、设置和实际表值仍须独立核验。
- [本项目CAP-02-03原规格固定Blob](https://github.com/BaiSongt/procet-devplans/blob/b8d0b9c1bafd9d5a9673d6c2cdc29e9b9fe997db/docs/capabilities/CAP-02-03/README.md)：内部Owner/CAS/GUI不变约束，非外部标准和产品测试。

具体来源、访问日、版本、章节与局限见[源登记](../../../research/sources/CAP-02-03-gauge-offset-b32.json)。

## 3. 数学与数据边界
**合成的同轴直线特例**，若 Holder基准到夹持面有效轴向距离为80mm、已校准伸出20mm，则名义TIP长度可计算为100mm。它不是任意非同轴总成、球刀球心或带角度头的统一公式：一般情形为具名变换链 (T_{gauge\to TCP}=T_{gauge\to holder}\prod_i T_{i\to i+1}T_{last\to TCP}\)。Frame必须定义方向、单位和左右乘法约定，不能用可视Mesh变换倒推。合成Engagement=25mm且已证最小20mm，与Stick-out=20mm保持独立，不能互相替代。

D03 **ToolAssemblyRevision**拥有子件exact revision/Hash、配合证据及名义TCP；D04 **ProcessSetup**拥有工艺选用；D10 **ExecutionBinding**拥有机床/安装/校准/刀表绑定；D13从**最终NC**解释已生效模态/补偿及有效控制器版本；D14轴时序、D15独立验证、D16发布分别单独负责。示例的D10实测offset=95mm与名义Gauge=100mm故意不同，只用于证明分层；**并不宣称95mm正确、可装机或等同OEM实际数据**。

## 4. 判定和错误
- 精确子件、接口配合、承载最小长度、同轴Frame和名义尺寸自洽；未知来源进入`UNKNOWN`，错误复合/冲突进入`REJECT`。
- 控制器策略必须锁定`controller + software + semanticSource + mode`；未知OEM、版本或G43.1/G43.2特殊组合在当前**有限合成模型**中返回`UNKNOWN`，绝不默认`G43_H`。
- 禁止把名义Gauge写成`D10_CALIBRATION`来源，或把CL已补偿+NC再补偿当作单次作用。只读预览、GUI/CLI/Agent同一`02.ToolAssemblyOwner`，单Babylon Engine/Scene/Canvas、资源世界横向切换、统一左TaskPanel，最大字体12px。
- 所有写入需Owner对exact revision/Hash/Frame、ACL与ScopeEpoch、CAS和取消代次**提交时重验**；取消后晚ACK不写新权威。A/B已冻结值保持不变。旧资源退役后保留精确快照，只通过显式新修订迁移与依赖失效传播，不能`latest`回填。

## 5. 独立正反验收设计及未执行项目
[8规则到字段/原包和案例映射](../../../research/traces/CAP-02-03-gauge-offset-b32-v08.json) → [合成fixture](gauge-offset-b32-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0203_gauge_offset_b32_v08.cjs) → [执行等级](../../../tracking/cap0203-gauge-offset-b32-verification-2026-10-30.json)。正例至少覆盖LinuxCNC2.9显式G43 H和Haas NGC限定自动更新；反例独立改变身份、接口、夹持、变换、H配置、CAS、GUI、冻结及D15资格；缺失来源必须`UNKNOWN`。

真正可授产品通过需：独立Node文件进程测试、3D构件实际选择、D03资源API与真实子件数据、实测对刀、OEM控制器配置与刀表快照、最终NC经D13重解释、D14轴序列、D15区间/接触独立验证，以及独立D10/D13/D15/D16消费者回执。当前统统`NOT_RUN`，**规划PASS≠产品PASS**；L3由人审批。
