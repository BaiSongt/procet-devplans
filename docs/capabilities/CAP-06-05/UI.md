# CAP-06-05｜不可变有序材料状态：GUI与3D交互（设计，非运行截图）
单个全屏Babylon Scene，不按Setup、求解路径或资源桌面再建第二World；单一左侧UnifiedTaskPanel承载状态时间轴、Branch/Setup过滤、exact版本引用、来源折叠树、运行与异常信息。Ribbon/ActivityRail只负责发现入口与空间切换，行为由同一06域Port执行。浅色/深色两主题，紧凑布局（最大字体12px）；禁用卡片堆叠，不依赖液态玻璃效果。

## 用户工作流
1. 在左侧TaskPanel选Project/Document/Branch/Setup/StepUID；D04真实Frame和D07前序状态分两栏展示，D10机床执行绑定在下游独立配置区。
2. 单击某状态节点查看父/子修订、B-Rep bytesHash、来源、生成算法、保护区及独立审查结果；3D只用只读显示代理高亮“加工前Stock/候选去料/加工后Stock”，图例注明合成/真实/未知，三维颜色不构成几何核验。
3. “比较候选A/B”在一Scene的Overlay/Preview lease并排切换同一世界的可见性，不能将可视Mesh替代OCCT Solid；离开或取消释放租约、撤销未提交展示，不覆盖父状态或D08。
4. “提交新的状态修订”先显示expectedHead、ACL授权版本、generation、依赖影响表和不可逆审批提示；撤权/Head竞争/取消/晚回执只显示Owner权威结果，无本地乐观伪成功。Staging与Seal等待采用非阻塞真实进度，未知显示UNKNOWN。
5. 从任务卡跳转D07独立证据、D08冻结、D09中立CL、D12最终NC及D13→D14→D15→D16时，显示独立资格链；D11动画仅标“预览”，未知语义不转绿色。

## 统一入口和异常
GUI交互调用`ManufacturingStatePort`，CLI和Agent使用同一命令与权限校验，不得绕过Owner直接写状态文件。错误以`STALE_HEAD / ACL_REVOKED / CANCELLED / UNKNOWN_RECOVERY / INVALID_BREP / UNKNOWN_GEOMETRY`呈现，同时保留可靠原始日志和可复制exact引用。高DPI、键盘ESC、Setup切换和窗口销毁必须停止过期Preview；3D场景不负责CAS回执。
