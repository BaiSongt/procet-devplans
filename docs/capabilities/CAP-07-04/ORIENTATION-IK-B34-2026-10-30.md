# B34｜CAP-07-04 五轴刀轴几何连续与真实关节运动资格
日期：2026-10-30；**研究补证，不代表产品实现，L3待审。**

## 新增技术分析
原[CAP-07-04十任务](README.md)已有四/五轴刀轴场、CC/TCP、中立CL与Owner要求。本轮建立三个不能混同的证据层：**D09空间姿态连续、某个D03/D10逆运动学解支连续、最终NC在D14实际物理Joint连续且D15验证通过**。第一个满足不能推出后两个满足。

- **双覆盖数学反例**：单位四元数q=(0,0,0,1)与-q=(0,0,0,-1)表示同旋转，\(2\arccos(|q\cdot(-q)|)=0\)。需验证有限分量、单位性与原Frame；不把四元数符号反转当机床180°翻转。OCCT的SLerp仅是几何旋转插值。
- **回转轴分支反例**：展示角+179°到-179°，按模360最短显示差仅2°；实际轴可能受限位、多圈/缆线约束或控制器解支决定，**绝不可据此命令真实轴2°**。缺D10实际机床与D14最终NC时序时，`physicalUnwrap=UNKNOWN`。
- **五自由度奇异例**：合成5×5对角Jacobian的奇异值取[1,1,1,1,0.1]，样例阈值0.01；将最小项设为0.000001即返回UNKNOWN。阈值是**本fixture的输入**，不是ISO/OEM限值；五轴刀轴任务不一定是6DOF空间位姿，实机Jacobian维数、轴速/转轴枢轴与误差必须按构型定义。

## 来源及实际阅读深度
1. Kevin M. Lynch、Frank C. Park，[Modern Robotics Chapter 5](https://modernrobotics.northwestern.edu/chapters/chapter5/)（分节视频标注2017-09-01）：仅阅读官方§5.1/5.3/5.4简介文字，未看完整课程或付费书正文。
2. LinuxCNC文档维护者，[LinuxCNC 2.9《5-Axis Kinematics》](https://linuxcnc.org/docs/2.9/html/motion/5-axis-kinematics.html)：实际阅读§1/3/5.1–5.3/6公开HTML文字；其中XYZAC/XYZBC枢轴、轴方向不代表B5/OEM通用机床，公式图片未逐一复核。
3. OCCT维护者，[8.0.1 gp_QuaternionSLerp](https://occt3d.com/dev/doc/refman/html/classgp___quaternion_s_lerp.html)和[gp_Quaternion](https://occt3d.com/dev/doc/refman/html/classgp___quaternion.html)：实际读InitFromUnit/Interpolate和构造等公开API章节，未运行C++；插值不是关节时序证明。
4. Procet团队，[固定HEAD原规格](https://github.com/BaiSongt/procet-devplans/blob/a5f1cee9e737cd3cad3169033845ebd9ce3d4c8f/docs/capabilities/CAP-07-04/README.md)，原Blob `293bf58010c4596dcfb9789486371171852e8cae`：Owner/CAS/GUI/撤权/迁移回退为内部工程决策，不冒充外部规范。作者、版本、访问日期、章节深度、局限见[来源登记](../../../research/sources/CAP-07-04-orientation-ik-b34.json)。

## Owner接口、GUI和数据边界
D01/D02/D03/D04/D07/D08 exact revision/hash/frame/scope、D08冻结只读；D04名义Setup绝不覆盖D10实际执行绑定。07域`ContinuousToolpathOwnerPort`统一服务GUI/CLI/Agent，提交事务重验expected/current revision、hash、Frame、ACL/ScopeEpoch、任务代次/CAS与取消。取消后的晚回执忽略；旧数据只读影子迁移和`READ_ONLY_FALLBACK`，不删旧D09或冻结D08。界面只允许一个Babylon Engine/Scene/Canvas与统一左TaskPanel，最大12px，CL动画仅视觉演示。

D09中立CL → D12最终NC后处理 → D13解释语义 → D14物理Joint时序 → D15独立碰撞/轴限证据 → D16发布。未知必须UNKNOWN，未验不发布；**不做材料扫掠仿真**。D03/D10/算法或源Frame更改导致依赖D09-D16逐项失效。产品独立D14/D15消费者尚未运行。

## 机器化追踪与独立验收入口
[5来源](../../../research/sources/CAP-07-04-orientation-ik-b34.json) → [8条规则/字段/原F1-03、E3-01/04/05、U4-04](../../../research/traces/CAP-07-04-orientation-ik-b34-v08.json) → [2正、1未知、41单字段负例](orientation-ik-b34-fixtures-v08.json) → [只读Node验证器](../../../tools/check_cap0704_orientation_ik_b34_v08.cjs) → [证据等级](../../../tracking/cap0704-orientation-ik-b34-verification-2026-10-30.json)。

`node tools/check_cap0704_orientation_ik_b34_v08.cjs` 可在独立检出仓库后执行；本轮仅V8同判定函数44/44合成通过，**独立Node文件进程、真实五轴逆解/OCCT、控制器和17消费者NOT_RUN**。正式Owner签署0/17、历史附件原字节和全仓GFM AST未闭，规划PASS≠产品PASS。
