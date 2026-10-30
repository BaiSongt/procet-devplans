# CAP-08-05｜B47 G83啄钻中途退刀与重新进刀语义补证

**2026-10-30 · L3待审 · 规划PASS≠产品PASS**。主关联原E3-02/E3-03、跨域E3-04/E3-05和U4-04；不改11域/88 CAP/36原包/17资产编号。已有[B30 G81/G90/G91/L/G98/G99与G80](../../work-packages/E3-03/CANNED-RETRACT-B30-2026-10-30.md)不再重复。本轮专补**G83深孔啄钻的中间退R、重进刀的0.254mm和最终返回平面差别**。

## 实际外部阅读与限制

LinuxCNC Documentation Project [2.9 G-Codes](https://linuxcnc.org/docs/2.9/html/gcode/g-code.html)公开HTML实读§43.1–43.6、§44、§45、**§47 G83**、§59和§61；页面标注2026-10-26 07:20:37 UTC更新。[2.9速查表](https://linuxcnc.org/docs/2.9/html/gcode.html)实读命令目录。NIST [IR6556官方出版记录](https://www.nist.gov/publications/nist-rs274ngs-interpreter-version-3)仅核对作者、日期、报告号；**未读PDF报告**，不据此宣称已核实解释器具体条款。来源逐项作者/版本/访问日/章节/局限在[登记文件](../../../research/sources/CAP-08-05-peck-motion-b47.json)。**LinuxCNC 2.9不是B5、Haas或其他OEM的统一语义**。

## 真实工程风险与数值见证

对于固定的**LinuxCNC 2.9、G17、G90、G94、G40、毫米制、G83**结构化合成输入，设旧Z=10mm，R=2mm，终孔底Z=-5mm，Q=3mm：啄入深度序列为-1、-4、-5mm。前两次啄入后**中间退刀均回到R=2mm**，即使G98也如此；再开始下一次啄入前快速接近先前孔底上方0.254mm，分别为-0.746和-3.746mm，继续以进给速度啄到下一深度。**只有最后一次退刀**才按G98/G99选返回高度：G98=max(OLD_Z,R)=10mm，G99=R=2mm。该0.254mm为LinuxCNC本版本正文记载，不应硬编码为其他控制器的几何安全让刀值。

若Q≥总孔深，只有一次啄入，没有中间退R/快速重入。若OLD_Z低于R，开始前应先快移到R且G98最终也不会返回低于R的旧位置。L重复的物理NC调用实例不可用同一个源N行覆盖：每次都带NC byte range、调用路径、迭代、连续循环epoch、模态前后hash。中间快移和G0不等于D14可证明物理时序，逐帧Babylon轨迹不等于D15安全认证。

边界：本轮只定义**已解析结构化G83语义门禁**，不编写真实G-code词法/表达式解释器，不宣称G73与G83中间退刀相同；G87/G88及未知方言一律UNKNOWN。G93逆时间、刀补、旋转轴字、非法Q、R低于孔底等按本特定已核实方言拒绝。示例L≤8、最多64次啄入只是合成预算，不是LinuxCNC控制器认证限制。毫米重进值与数值误差是有限样例，不作为NC工程精度阈值。

## 源→规则→字段→原包→独立反例

[4项分层来源](../../../research/sources/CAP-08-05-peck-motion-b47.json) → [8条字段规则与映射](../../../research/traces/CAP-08-05-peck-motion-b47-v08.json) → [6正/37反/3 UNKNOWN，46个独立预期样例](peck-motion-b47-fixtures-v08.json) → [只读Node校验器](../../../tools/check_cap0805_peck_motion_b47_v08.cjs) → [执行等级](../../../tracking/cap0805-peck-motion-b47-verification-2026-10-30.json)。每个负/未知样例只相对P01改一个字段，输出仅为合成规划资格，不存在自动D15 PASS。

跨域契约：D04保存名义Setup与Frame，D10另保存**实际机床执行绑定**；D09中立CL经D12后处理固化原始NC SHA，D13独立重解释最终字节与方言Profile，D14结合D10和Joint数据展开轴时序，D15用真实独立Oracle验证干涉/限位/覆盖，D16据真实人工批准与签名发布。未知语义=UNKNOWN，不做材料扫掠仿真。A/B共同事实不覆盖D08冻结，源变更使D13–D16旧资格STALE，保留旧Reader可回退；CAS和ACL必须在提交时重验，取消后的晚回执不许提交。

GUI/CLI/Agent只调用08域**NcExecutionPort**；唯一Babylon Engine/Scene/Canvas，左侧UnifiedTaskPanel，文字≤12px、浅深主题。UI展示物理NC行/调用栈/周期迭代及「中间退R」和「最终返回」不同标记，预览不可写领域事实、不能代替D15。

## 实施与真实验收交接

开发应增加D13 G83方言事件扩展，保留每段进给、回R、0.254mm前进、最终返回的typed event与字节/帧/模态证据，再交给独立D14和D15消费。真实正例：使用LinuxCNC 2.9解释器对比G98/G99与Q=3/9；真实反例：缺失Q、非法刀补、G93、UNKNOWN方言、取消后回执、不同Profile、D10 Frame错配；另由独立D15验证刀柄/夹具/限位覆盖。**尚未执行真实解释器、Node文件进程、OCCT、B5/OEM、17资产消费者和人类L3审批**；保留PENDING/NOT_RUN，不得视为产品验收。
