# T5-02｜跨仓独立消费者、迁移与回退
真实验证前状态：**NOT_RUN**。规划样例不是产品提交回执。

1. procet-2d在固定exact HEAD以真实DXF（LINE/ARC/BLOCK INSERT/非均匀缩放/镜像/未知单位）输出独立`SourceLocator + FrameChain`，记录输入字节哈希、转换器hash和异常reasonCode。独立新进程校验重建坐标；不得以显示图元匹配率宣称工程尺寸正确。
2. procet-docs在另一个固定HEAD处理多页/裁剪/旋转PDF与扫描图像。保存OCR原始候选文本、bbox、模型/语言包版本、置信度定义和校准证据；引入故意误读的孔径和基准负例，不得自动写入PMI。
3. procet-gui/CLI/Agent复用一个03域Port；前后不同项目相同图纸名但raw hash不同的负例、重入、双击、取消/晚回执、ACL撤销必须由真实D01/D02 Owner给出一致拒绝/确认。记录各仓exact SHA、构建hash、Schema版本、日志SHA、人工决定与Owner快照Revision。
4. 独立D02特征/PMI消费者验证原始来源、Frame与人工采纳证据；没有确切GeometryRef则UNKNOWN，不修改D08冻结，D04与D10分离；不以CL动画或OCR文案授NC工程资格。
5. Expand：旧DXF/PDF reader与快照格式只读保留；Migrate：构造`oldEvidenceRef→newEvidenceRef`显式hash/Frame/人工决定映射，只生成新修订而非双写；Contract：须旧项目真实打开、跨仓独立消费者PASS、Owner会签且人类批准。任一失败切回只读旧入口，保留源文件、草稿、D08、用户数据库。未经独立验证不得删旧实现。

待办风险：扫描件标定误差未形成工艺容差Oracle；OCR符号混淆未校准；不同DXF导出器实体兼容未知；未取得产品exact SHA/独立日志；17资产Owner签署及L3审批待审。
[返回工作包](../T5-02.md) · [数据示例](contract.example.json)。
