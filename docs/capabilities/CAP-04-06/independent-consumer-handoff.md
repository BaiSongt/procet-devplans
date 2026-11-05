# CAP-04-06｜17资产Owner与独立消费者交接

17资产基线见 ../../architecture/v0.8/business-assets.json；Owner名称为候选，尚未签署。本功能写D10新修订，D04名义Setup和D03资源保持不变。D01/D02来自03域设计基线/特征；D03来自02域资源；D04与D10由04域分别持有；D05/D08由05域持有决策与冻结；D06/D07由06域持有求解与材料；D09由07域持有中立CL；D11由09域持有CL预验；D12/D13由08域分别持有NC与语义；D14/D15由09域持有实际轴时序和独立工程验证；D16/D17由10域持有发布与现场反馈。

独立验收必须逐域执行：02域实测资源instance/机床结构与home FK；04域ACL/ScopeEpoch/CAS、D04和D10互不覆盖；08域以真实NC Controller适配G54/G10/RTCP和UNKNOWN；09域由D13到D14真实FK/IK展开，并独立D15验证；10域核D16从D08/D12/D15引用闭包且旧发布字节不变；01域Host验证取消晚回执。每项提交产品exact HEAD、资产revision/hash/Frame、单独反例、测试入口、机器/控制器具体版本和消费者回执。迁移旧数据缺实际坐标和测量证据只读、可回滚，消费者NACK阻切换。

正式Owner会签PENDING_HUMAN，L3待审核；真实跨域消费者/NC/B5与三轴NOT_RUN。规划PASS≠产品PASS。
