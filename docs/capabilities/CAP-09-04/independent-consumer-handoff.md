# CAP-09-04｜独立消费者验收、Owner会签与非破坏回退
02域D03 Owner确认刀柄/刀具/主轴接口目录与适配证据；04域D10 Owner实测Gauge、刀具安装、工件偏置和控制器Profile，D04 Owner仅签名义Setup；08域D13 Owner以D12最终NC**原字节**独立解码G43/H、G49、动态补偿及RTCP；09域D14/D15不同实现完成轴时序和工程检查；10域D16 Owner签发版控门禁。每位Owner必须签确切revision/hash/Frame/算法及证据来源，现均PENDING_HUMAN。
独立消费者对正例/错误主轴接口、逆向Gauge符号、旋转工具轴、毫米英寸混用、H与T冲突、缺实测、换刀后H状态、RTCP不支持、测量修订改变、撤权/取消晚回执实施正反验收。需要运行真实NC解释器、机床模型、不同实现FK/Frame变换及实机或正式标定；无B5测量不得将合成几何认证为安全。命令 `node tools/check_cap0904_planning_2026_10_27.cjs` 仅校验规划JSON/数学合成，产品、实机、独立消费者均NOT_RUN。
回退与迁移：旧Reader/schema/D10物理安装/后处理和ControllerProfile需配对可读，按Expand/Migrate/Contract灰度演练；任何变更使D13/14/15证据STALE，保留D08冻结、历史D16和用户数据库。L3会签不由本任务自动通过。
