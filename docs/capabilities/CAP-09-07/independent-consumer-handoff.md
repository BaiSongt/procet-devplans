# CAP-09-07｜跨域Owner、独立Oracle与回退交接

## 责任边界（候选，需人类会签）
02域写D03机床资源与物理Link档案；04域分别写D04名义Setup与D10实际执行绑定；08域写D12最终NC原字节、D13控制器执行语义；09域运动模块写D14物理Joint时序，**09域独立验证模块**独立写D15碰撞、限位和覆盖证据；10域D16只审批不重写工程判断。全部17业务资产的Owner候选及未签状态见[asset-owner-candidates.json](asset-owner-candidates.json)，不能把候选标“会签完成”。

## 独立消费者验收
- 输入独立读取D12最终字节SHA、D13调用实例和D14事件，按D10实装Frame与D03机床Link精确修订验证；不得只采信D14自报的通过。
- 联合限位Oracle：同一TCP合法但某物理Joint越界应REJECT；物理Joint限位缺失应UNKNOWN；软/硬开关实际可靠性必须由实机证据给出。
- 几何Oracle：刀尖许可切削≠刀柄允许碰夹具；在t=0和t=1无碰、t=0.5穿透的反例必须使仅端点检查UNKNOWN；连续安全必须具独立区间证书及真实建模覆盖。
- 范围Oracle：工具、刀柄、主轴、机床运动部件、夹具、毛坯、保护区配对完整；未建模/坏B-Rep、遗漏中间区间和未获认证标定全部UNKNOWN。
- 控制器Oracle：D13未建模宏、换刀、RTCP或运动指令，D14无法确定时间参数、旋转周数/IK分支时UNKNOWN，绝不可绘制伪确定轴时序后PASS。
- 事务Oracle：生成期间切换Setup、ACL撤权、CAS冲突、取消晚ACK均不能写新D15；A/B共事实但D08冻结和D16历史不可被静默覆盖。
- 发布消费者由**10域独立人员/实现**重读D12/D10/D15 exact hash/frame/审批结果，不承认`REVIEW_READY_SYNTHETIC_ONLY`、UNKNOWN、STALE或CL_ONLY。

## 真实待执行入口
规划脚本`node tools/check_cap0907_planning_2026_10_27.cjs`仅核对JSON追踪及合成状态例（不是产品运行）。后续应提供独立真实三轴和实际B5案例脚本、NC样本合法来源、实测控制器Profile与限位、机床Link/夹具模型、运行系统与Git exact HEAD、独立Oracle二进制/版本/哈希、时间区间覆盖、失败退出码和GUI截图。这些本轮均`NOT_RUN`，Owner/L3均`PENDING_HUMAN`。

## 迁移与回退
先新增D15 Evidence V-next Reader及D14 TimeSegment Reader，双读旧新结果、按revision/hash/Frame比较并作原负例回放，再显式升级Writer；不支持字段→UNKNOWN，绝不强迁旧证据为PASS。灰度失败回退旧Reader/Writer且保留新数据只读，历史冻结D08、D16、用户数据库不删除不覆盖。所有阈值、配置、碰撞pair allowlist、Frame、几何证据或NC修订变化逐依赖边标STALE。
