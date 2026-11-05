# CAP-04-07｜GUI/3D施工规格

**唯一Babylon Engine/Scene/Canvas**，工程3D与资源3D可横向切换但同一时刻仅一个活动世界；主视口上悬浮半透明单左侧 **UnifiedTaskPanel** 与Ribbon，不建第二个3D或右Drawer。字体最大12px，仅浅色/深色主题。传统Workbench、纯AI+3D、演示/仿真三模式共用同一业务Port，Esc退出特殊模式。

## 左侧TaskPanel的五步任务

1. **选机床/主轴接口**：固定D03机器instance与D10 revision/hash/Frame，展示主轴Gauge Plane及接口类别。
2. **组装刀具总成**：刀柄→可选延长杆→刀具刃部逐级选择D03资源，3D直接拾取部件对应左侧树，不额外创建制造资源管理器。
3. **量测与TCP**：分栏展示主轴安装点、刀柄基准、夹持伸出、Gauge Length、Tool Tip/TCP、量测证据；改变伸长量刷新**同一3D**的局部链，突出UNKNOWN而不写刀表。
4. **执行语义对拍**：D10安装几何、D12最终NC的T/H文字、D13模态、D14轴展开、D15独立验收分层呈现；H与Gauge不相等时说明其参考系和版本差异，而非盲目取某一个数。
5. **影响→人类授权→Owner提交**：差异对拍、受影响D11-D16、撤权/CAS状态、Receipt与只读回滚入口同一容器完成。

3D ghost与命名轴向箭头仅供理解，网格旋转不构成OCCT右手业务Frame、量测证书或NC认证；未知方言明确UNKNOWN。GUI、CLI、Agent共用04域ToolMountPort，Agent不能绕过Owner写权限。换项目/Setup后旧Lease失效，取消晚回执只能进审计。

## 浏览器/独立消费者待验

单Canvas与12px验收、三模式切换、资源3D/工程3D互斥、Frame和Gauge数学、ToolMountPort行为对齐、空数据降级、取消与撤权、碰撞包络、NC H语义均**NOT_RUN**；在真实三轴/B5不同接口各跑正例与反例。L3/Owner会签PENDING_HUMAN。
