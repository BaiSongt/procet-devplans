# B172｜CAP-09-07：跟随误差门限与物理Joint连续运动包络

> 2026-11-05。新增研究补证，原88 CAP及36包编号不变；L1/L2不变，L3仍待审。**合成校验不能当真实D15工程验证。**

## 官方来源及适用边界

[LinuxCNC 2.9 INI](https://linuxcnc.org/docs/2.9/html/config/ini-config.html) §2.12–2.13：Axis字母软限位和物理Joint限位不是同一量；非恒等运动学可出现Axis合法、Joint越界。其`FERROR`/`MIN_FERROR`是允许的跟随误差报警门限，**不是已经观测的`|pos-fb-pos-cmd|`**。[MOTION HAL参考](https://linuxcnc.org/docs/html/man/man9/motion.9.html) 中`joint.N.pos-cmd`、`pos-fb`、`f-error`、`f-errored`分离；这份页面为滚动版且DEBUG引脚稳定性有限，不能冒称固定2.9版实机测试。

[OCCT 8.0.1 DistanceSS](https://www.occt3d.com/dev/doc/refman/html/class_b_rep_extrema___distance_s_s.html)只描述静态两形状距离的API，不是连续运动碰撞Oracle。[W3C PROV-O](https://www.w3.org/TR/prov-o/)用于证据溯源，[RFC9110](https://www.rfc-editor.org/rfc/rfc9110.html) §13仅作条件更新类比；**业务Owner权限、CAS、取消栅栏是Procet内生约束**，并非这些外部标准直接给出的机床认证条款。8项来源的版本/访问章节/实读深度/局限见[来源登记](../../../research/sources/CAP-09-07-servo-envelope-b172.json)。

## 可复算的连续轨迹反例

定义纯教学曲线`q(u)=4a·u(1-u), u=t/T, 0≤u≤1`。两端`q=0`而中点`q=a`，解析上界`max|q|=|a|`、`max|dq/dt|=4|a|/T`、`max|d²q/dt²|=8|a|/T²`。例如`a=1.2 rad,T=2s,limit=[-1,1]rad`，端点合法但中点1.2 rad超限；`a=0.6,T=0.5s,vmax=3rad/s`使解析速度上界4.8rad/s；`a=0.4,T=0.5s,amax=8rad/s²`使解析加速度12.8rad/s²。这些数值**不是OEM插补算法、B5参数或实测伺服轨迹**。8个独立数学Golden在[fixtures](servo-envelope-b172-fixtures-v08.json)；当解析包络合法也只产生`ANALYTIC_ENVELOPE_ONLY`，不得发布。

## 数据与Owner边界

| 环节 | 必须固定的证据 | 缺口处置 |
| --- | --- | --- |
| D03 / D10 | 物理Joint序号、运动学/限位来源revision、单位/回零、本次机床执行绑定Frame exact | D04名义Setup不得替代D10；标`UNKNOWN_MACHINE` |
| D12 / D13 | 最终NC字节SHA、方言/子程序执行实例与模态 | `UNKNOWN_NC` |
| D14 | 连续Joint曲线/上下界与完整时间覆盖，不把端点线性插值当控制器证据 | `UNKNOWN_INTERVAL` |
| D15 | 独立Oracle、真实反馈有无及缺包窗口、碰撞模型/间隙不确定性 | FERROR阈值不等于测量；`UNKNOWN_FEEDBACK`保守阻断 |
| D16 | 独立D15产品证据、人工签署与当前ACL/CAS | 任何合成`PASS`不得放行 |

故障位可作为故障证据；无报警不能推出无碰撞或实测全段误差有界。伺服误差、工具/夹具几何误差及静态/连续距离预算不能互相代替。**禁止材料扫掠仿真**，CL动画仅作预览，验证从最终NC经D13、D14到D15独立复核。

## 同域入口、失效迁移与验收

GUI/CLI/Agent共同调用09域`SafetyVerificationPort`，全局唯一Babylon Scene/Canvas与左侧UnifiedTaskPanel，展示指令/反馈（如真实存在）、限制、区间极值及NC字节/调用实例；12px字号上限保持。领域Owner提交时重验CAS exact revision、Frame、ACL和取消Fence；取消晚回执只读。D03/D10/D12/D13/D14失效向D15/D16传播，历史冻结不覆盖，旧新Reader成对迁移失败只读回退。

[8规则32字段与原编号包追踪](../../../research/traces/CAP-09-07-servo-envelope-b172-v08.json) → [8正/32独立字段反/8解析Golden](servo-envelope-b172-fixtures-v08.json) → [只读Node校验](../../../tools/check_cap0907_servo_envelope_b172_v08.cjs) → [核验等级](../../../tracking/cap0907-servo-envelope-b172-verification-2026-11-05.json)。源→规则→字段→CAP-09-07/F1-02/E3-04/E3-05/U4-04→测试ID可机器复核。规划V8合成48/48符合预期；独立Node文件进程、真实控制器/OEM/B5/OCCT/D15/Owner/17消费者均**NOT_RUN**。正式Owner签署0/17、真实独立消费者0/17、L3、全仓GFM AST及历史原字节继续开放。**规划PASS≠产品PASS。**
