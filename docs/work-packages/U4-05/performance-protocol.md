# U4-05｜参考模型性能、GPU回收与可访问性回归协议
> **该文件定义将来的真实测试方法，本轮没有运行产品或取得设备测量。** 合成fixture中的hash/FPS均不代表产品实测。

## 锁定测试环境
每次真实报告保存`runId`、`git exact HEAD`、`package-lock hash`、`Babylon锁定版本`、`浏览器/桌面Runtime版本`、`操作系统与DPI`、`GPU型号/驱动与后端(WebGL/WebGPU)`、`参考模型真实bytes hash`、`分辨率/渲染缩放`、`数据来源/操作脚本hash`。缺任一关键身份不与前轮FPS直接比较。

## 冷/热循环与基线
1. 冷启动、加载指定合法测试件、记录首帧与首次可交互延迟；不可拿空Scene填参考工件。
2. 固定相机、拾取与旋转路径，测量Frame Time分布（p50/p95/p99）、Draw Calls、CPU Heap、浏览器进程内存与可用GPU计数；不可访问的计数记`UNKNOWN`。
3. 从工程→资源→NC/诊断→工程往返至少30次，关闭预览、Gizmo、TaskPanel暂态并逆向释放；分别留每轮资源计数、Heap Snapshot前后比较。**不是把30次静态数据断言冒充真实GPU无泄漏。**
4. 重复多批测量并显式记录热身/GC/浏览器节流、后台标签和时钟精度。无代表性模型基准、上下限与设备条件时只记录探索值，**不承诺某个FPS**。
5. 对浅/深主题、12px文字、键盘无鼠标、ESC脏稿、减少动态效果、1280×720/1920×1080/3840×2160及100/125/150/200%屏幕进行矩阵复核；生成失败截图/DOM定位和复现脚本。

## 泄漏及回退判定
不能仅用JS Heap“下降”就宣布WebGL纹理/缓冲无泄漏，也不能只因GPU帧时间波动就判泄漏。必须同时检查U4-03的`OverlayLease/Observer`残留、Babylon Mesh/Material/Texture数量、GPU可见资源指标和共享资源所有权；缺计数即`UNKNOWN`。超过冻结的人类批准阈值时先定位回收路径，必要时仅降级抗锯齿、非必要动效/高成本Overlay，**不得自动删除Owner几何、改变D04/D08或宣称D15工程通过**。

## 执行入口与真实验收
规划级：`node tools/check_u405_planning_2026_10_25.cjs`；产品级拟议：`pnpm test:ux:a11y`、`pnpm test:ux:dpi`、`pnpm test:3d:resource-lifecycle`（仅建议名称，未核实产品存在）。独立测试消费者需要在另进程调用已实现的Owner Port/GUI，对比实际持久回执与GPU/DOM指标，保存exitCode、产物sha、原始日志和报告；不存在就保持`NOT_RUN`。未经批准的效能阈值标`THRESHOLD_PENDING`而不是PASS。
