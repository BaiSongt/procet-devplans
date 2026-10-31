# CAP-09-01｜独立消费者与迁移回退

02域权威D03，04域权威D04和D10，08域权威D12最终NC与D13执行语义，09域权威D11、D14、D15，10域权威D16。候选Owner名单不等于正式会签。09域从D03/D10精确revision/hash/frame获取运动学，拒绝重复JointID、环、非单位轴、缺失枢轴、反手Frame、未定义双驱耦合、软硬限位缺出处。真实机床数据缺失应UNKNOWN而非编造。

NC必须由08域D13独立读取最终D12字节及控制器配置，09域D14依据D13执行事件展开轴位置时间序列，再由独立D15覆盖限位/干涉/语义，D16受控发布；D09/D11动画不具备NC验证资格。D03、D04、D10变化依照[失效矩阵](invalidation-matrix.json)处理，保留D08冻结及旧D16发布，Expand→Migrate→Contract后仍支持旧Reader/Profile成套恢复，不删除用户库。

交接真实正反验收要求02资源Owner、04绑定Owner、08控制器Owner、09验证Owner与10发布Owner各自给出人工签署、实测三轴+B5参数及独立消费者故障注入。提交前CAS/ACL/Frame/scopeEpoch/任务代次/取消态重验，取消晚回执不得回写。真实产品与独立消费者NOT_RUN，Owner和L3 PENDING_HUMAN。