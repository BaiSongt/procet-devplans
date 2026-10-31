# CAP-09-07｜单Babylon 3D干涉与可达性工作台

保留全局RendererPort→**唯一Babylon Scene**；最大字号12px、浅色/深色双主题、统一左TaskPanel可拉伸宽度；沿用Host/Project和ModuleRegistry，不增加第二工作台或独立“安全红绿灯”权限。

## 交互区域
左TaskPanel层级为：01选中D12最终NC及D10实际绑定（D04名义Setup并列只读）、02 D13调用实例/模态、03 D14物理Joint时间轴/IK分支与旋转周数、04 D15安全检查对象及碰撞对矩阵、05证据与版本、06D16受控发布只读入口。中间Babylon视口选择刀具/刀柄/机床连杆/夹具/毛坯和保护区（对象引用含Frame/revision/hash），播放D14时序；支持时间区间放大和NC字节偏移/子程序调用实例双向定位。

诊断标签必须显示`REJECT_ENGINEERING`、`UNKNOWN`、`STALE`、`CL_ONLY`与“合成样例不可发布”，不能把静态距结果或绿色外观命名“连续无碰”。悬停查看危险几何对、时间窗口、静态距、最坏容差、采样/区间证据、Oracle身份与未覆盖段。碰撞对象允许排除必须展示操作冻结来源和有效区间，刀具/工件合法切削接触不得自动豁免刀柄/夹具。

## 统一端口
GUI点击“校核” / CLI概念命令`procet verify collision --d12-ref … --d10-ref …` / Agent工具`SafetyVerificationPort.request`均提交完全相同的09域DTO。领域Owner提交前重验ACL+expectedRevision CAS+Frame+scopeEpoch+cancel token；晚ACK写禁止，失效后原D15只读。播放不修改D15结论；权限撤销立即禁发布，但不删冻结数据。

## 独立浏览器与工程验收（未执行）
测试应覆盖同一NC行两次调用映射两个执行实例、双Joint/笛卡尔轴独立越限标注、刀柄擦夹具、运动中段碰撞但两端无碰、未知物理几何为UNKNOWN、允许切削仅限当前冻结工序、晚ACK和A/B冻结回流不覆盖。CLI、GUI、Agent和Babylon真实浏览器运行均`NOT_RUN`。
