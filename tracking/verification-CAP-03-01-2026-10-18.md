# 2026-10-18｜CAP-03-01定向静态检查

目标基线：`9105124c4cea78759a8c2ea1df165b9b5d78604c`，仅专项规划分支。实际以工具执行JSON.parse检查新增6项JSON文档/索引与进度，核实新增7条SRC-CAD来源不与旧表+F1-03来源重复；10条规则/20个正反用例/20个fixtures编号闭包；追踪sourceIds均存在；6条新导航/配套文档相对路径；新写入文件的常见GitHub token模式检查，未发现错误。全仓Markdown、JSON Schema引擎和产品测试均**未运行**。

在线研究访问：ISO 10303-21:2016、10303-242:2025与2022历史版本的ISO目录/摘要，以及OCCT8.0.1 STEP Translator/STEPCAFControl_Reader/BRepCheck_Analyzer官方文档和OCCT官方XDE历史Wiki。只读观察源代码：`procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`相关三个文件。检查覆盖仅为规划结构，不证明产品导入或AP242兼容、PMI或制造能力已通过。

待产品验证：锁OCCT版本、解析源fixture、单位与Frame、离线闭包、错误注入、权限与跨Project晚回执、Windows原生导入以及审查签字；未有实际产品PASS。
