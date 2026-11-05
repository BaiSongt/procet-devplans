# R-CAD-001｜STEP解析、OCCT/XDE装配与制造输入资格研究

2026-10-18实际联网检索与阅读：ISO官方目录、OCCT8.0.1官方STEP翻译指南/STEPCAFControl_Reader/BRepCheck文档，以及OCCT官方XDE历史Wiki。**仅使用合法公开内容，不取得/复制ISO付费正文。**

## 1. 标准版本与支持范围

| 来源 | 已读范围与深度 | 可以支持 | 不可支持 |
|---|---|---|---|
| SRC-CAD-001 ISO 10303-21:2016 Edition 3（2022确认） | ISO目录/摘要 | Part 21编码与交换文件身份 | 未读具体字节规则、程序已符合Part21 |
| SRC-CAD-002 ISO 10303-242:2025 Edition 4 | ISO目录/摘要 | AP242 Managed model-based 3D engineering版本与范围 | 声称任意OCCT版本已经覆盖全部PMI/装配语义 |
| SRC-CAD-003 ISO 10303-242:2022 Edition 3 | ISO目录/生命周期 | 旧版已撤回，2025替代，历史文件需兼容策略 | 把旧版当目前最新版本或保证跨版无差异 |
| SRC-CAD-004 OCCT8.0.1 STEP Translator | 正文章节：Reading/Assembly/units/XDE/线程参数 | 基础译器、XDE元数据、装配与单位分层 | 把8.0.1新API强行套用旧产品锁版本 |
| SRC-CAD-005 STEPCAFControl_Reader | 公开API正文 | Reader向XDE文档转几何/属性，能报告读取过程 | 自动保证每个源文件有完整PMI/颜色 |
| SRC-CAD-006 BRepCheck_Analyzer | 公开API正文 | 检查形状拓扑/几何有效性及诊断 | IsValid自动证明制造可行、刀具可达或公差可靠 |
| SRC-CAD-007 OCCT XDE历史Wiki | 历史官方存档正文；官网提示迁到新版本文档 | XDE与BRep关联的装配/附加元数据表达 | 代替当前8.0.1源作为未来接口规范 |

**关键版本纠偏**：ISO 10303-242:2022已被2025版取代，不能只引用旧Edition并当成现行AP242。OCCT在线文档目前展示8.0.1的 per-call `DESTEP_Parameters` 并发建议，历史产品仓源码使用何种OCCT版本需要独立核锁；仅凭新版官方指南不得假设当下产品已经采用该接口。ISO 10303-21:2016仍为官方已确认现行版（本轮读取时）。新读者依据官方数据记录，不编造Part21/AP242未读条款。

## 2. 设计推导（来源→规则→字段→验收）

- 文件外链、编码/协议与几何等价不是同一个问题。保留原始CAS及`sourceHash`、导入参数和解析器版本可支持可追溯重试，但Hash不等于生产者签名或CAD内容工程批准。对应CAD-R01/R02，T01—T04。
- 单位与装配实例：OCCT STEP官方指南指出单位信息取自shape representation实体，装配结构与实例属性存在多个表示层；因此D01必须保留源单位、转换、层级与实例位姿，不可把扁平TopoDS_Compound当成等价完整PLM结构。对应CAD-R03/R04，T05—T08。
- 几何资格：导入成功、BRepCheck有效、显示mesh可画、PMI可读、制造可接受是不同判定。修补需作为可追溯派生，不能隐式替换；mesh只用于投影与浏览，不替代严谨制造输入。对应CAD-R05/R07/R08，T09—T16。
- 宿主事务/错误/幂等与协议分层属于**Procet架构政策**，不是ISO要求。现有GUI D00/Host/CAS及CamService入口应该复用，CAD导入与CAM Job批准要解耦而不能重复造一个新CAD真值。对应CAD-R06/R09/R10，T11—T20。

## 3. 源码观察（不是理论来源或产品验收）

`procet-gui@4e8eec12a212fc9dc86f2d728762c852832eebdb`：`apps/desktop/src-tauri/src/commands/cad_input.rs`已有D00受控导入，源大小固定上限256MiB，且前置`cam_job_create`与Cam backend；`apps/desktop/src/modules/cam/modelInput.ts`只筛step/stp并检查CAM Job ready；`packages/renderer-port/src/cad-input.ts`已有typed descriptor，三态几何能力及Toplogy/mesh关联。此为**特定SHA只读路径观察**，未经当前运行程序/Windows/产品测试；任何接口扩展都需核真实组合、权限和兼容性。

## 4. 工程研究缺口与补证责任

需取得合法标准正文或生产方交换契约以验证实际AP242属性/PMI层级；核定Procet所锁OCCT SDK版本及线程安全读取路径；建立授权的少量真实格式fixture、单位缺失/装配多实例反例与BRep/mesh一致性测试；生产导入Worker的资源配额、外链禁用/安全扫描、ShapeFix副作用与旧schema恢复须由Owner评审。缺证时标unsupported/unknown，不能以合成动画代替真实几何消费或程序安全验证。
