# CAP-08-08 GUI / 3D 原型设计（仅规划）

- **单世界**：复用唯一 Babylon Scene/RendererPort；NC配置、程序段选择、D13事件与D14轴时序均通过RendererPort高亮，不另建Three/Babylon实例。
- **唯一左侧UnifiedTaskPanel**：工程→NC→后处理配置；任务子视图为“输入锁定 / 后处理与属性 / 语法与来源诊断 / 生成候选 / 工程验证资格”。避免重复右侧卡片、不得用预览按钮执行签发。
- **紧凑界面**：最大字号12px，仅浅/深主题；不以颜色作为唯一状态编码。表格显示插件版本及digest前缀（可点开完整值）、有效属性、机床D03与执行绑定D10、D04 Setup、控制器固件/选件、D09修订、NC字节哈希及静态结果。
- **诊断层级**：`CONFIG_MISSING` / `SCHEMA_REJECT` / `PROFILE_UNKNOWN` / `STATIC_PASS` / `D13_UNKNOWN` / `D15_NOT_RUN` 必须各自可见；`STATIC_PASS`绝不显示成`RELEASE_READY`。
- **双向选择**：NC源码定位保留物理byteSpan/编码/换行，D09 CL片段靠已验证来源manifest关联；无映射显示`UNMAPPED`原因。不根据N行号或3D画面推断来源。D11 CL预览显示`CL_ONLY`水印。
- **行为一致**：GUI / CLI / Agent调用同一个08域Owner；预览只生候选；提交时重新读取CAS、ACL、Frame、scopeEpoch、taskGeneration、cancelled。过期的异步渲染或Worker结果不得改变已确认记录。
- **权限与回退**：未经授权禁用提交、可读取历史发布的不可变引用；升级Profile前提供旧Reader兼容窗口与同一成套版本恢复。真实消费者、3D可视回归和控制器验收尚未执行。
