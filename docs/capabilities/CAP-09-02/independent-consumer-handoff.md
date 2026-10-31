# CAP-09-02｜跨域独立消费者正反验收与回退

需由**02域D03 Owner、04域D04和D10 Owner、08域D13 Owner、09域D14/D15 Owner、10域D16 Owner**独立提供接口证据及正式会签（全为PENDING_HUMAN）。D14只读D03/D10的exact revision/hash/Frame及D13基于最终NC的解释结果；09域数学FK不代替08域控制器模态、WCS偏置或NC解释。

独立数学Oracle必须与[规划向量](fixtures.json)实现隔离：三轴相对TCP(5,14,23)、Z轴绕(10,0,0)旋转90°所得(10,1,0)、X→Z旋转顺序与反顺序不相等；镜像/尺度、错误帧方向、错版本、取消晚回执、撤权及未知RTCP必须明确拒绝或UNKNOWN。实际三轴/B5须使用实测枢轴/限位/ToolMount与误差预算，不得冒充合成数值。D11 CL仅预检，D15必须独立覆盖控制器级NC工程问题；不可进行虚假的材料扫掠模拟。

迁移应保留D08冻结、D16历史发布和用户数据库，旧Reader/schema/Profile成套回退，遵守[失效矩阵](invalidation-matrix.json)。真正消费者、实机、Node文件执行均NOT_RUN；17Owner/L3待审。规划PASS≠产品PASS。
