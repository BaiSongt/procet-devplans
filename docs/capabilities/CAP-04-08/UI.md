# CAP-04-08｜装夹影响检查：五步GUI/3D任务设计
只存在**一个Babylon主世界**和**唯一左UnifiedTaskPanel**，ActivityRail→Setup→装夹影响，Ribbon显示当前检验范围；和工程/制造资源两区同用选择、Frame、scopeEpoch状态。CLI和Agent走相同FixtureImpactPort，不新建第二套检查服务。
1. **变更对比**：左面板展示旧新D04/夹具revision/hash、CAD instance、单位/Frame及变更来源；当前3D世界中旧实体灰色ghost、新实体高亮，点选夹具或接触面须显示sourceExactRef+occurrencePath；纯mesh pick只做定位线索。
2. **几何证据**：按“有效B-Rep→宽相预筛→精确距离/交集”逐级显示算法覆盖。清楚标注“仅静态”“交集UNKNOWN”“浮点容差”，详情可追溯算法版本、几何质量、阈值及对应对象；不可把所有绿边框称安全认证。
3. **依赖影响**：左侧树按Owner分区列已失效/无关/未知，显示每条oldHash→consumer exactRef因果边。主3D仅高亮相关几何，不复制左任务组件；支持对比三轴和五轴适用范围，但不模拟未建模机床运动。
4. **确认与取消**：在左TaskPanel显示D08冻结、D16发布保护、失效重算成本、消费者复核责任；预览撤销不写库。鼠标可调整面板宽，浅深主题同样可读；ESC取消AI+3D只释放预览lease。
5. **提交与回执**：显式提交前Host权限/CAS复核，失败保持用户proposal。切换Setup/工程、撤权或取消更新scopeEpoch并拒绝迟到回执；成功仅展示新D04 revision/hash和分区失效任务，不把D15未运行显示为通过。
**入口约束**：GUI命令、建议形态的`procet setup impact propose --setup …`与Agent工具均共享领域端口；CLI指令仅为设计草案，不代表产品现有命令。测试用例见[fixtures](fixtures.json)，静态检查与动态NC验证明确不同。
