# R-IMMSTATE-001｜不可变制造状态、来源DAG及封存字节
2026-10-25 核对OCCT 8.0.1 Boolean Operations、Cut、BRepCheck、Copy、BRepTools公开章节与API；核对W3C PROV-O Recommendation（2013-04-30）、RFC 8785（2020-06，Informational）、RFC 9110（2022-06）、SQLite官方原子提交说明及NIST IR 8536（2026-09-09 Final，仅出版摘要）。每条实际作者、版本、URL、章节深度、可支持命题与不适用处见[来源注册表](../sources/CAP-06-05.json)；未下载/阅读NIST全文及任何付费标准正文。

**推导层次**：W3C的Revision/Derivation可描述有向不可变修订谱系，但“实例化DAG必须无环、同父A/B共存、CAS、内容域分隔、Frame、D07/08边界”是Procet工程规则，不是PROV-O的现成算法。OCCT提供布尔和序列化API，不保证相同实体跨内核版本字节哈希恒等。RFC8785可作为条件满足时的JSON元数据规范化方案，不能规范B-Rep。SQLite关于多文件事务的说明有特殊前提，不能泛化到分离Owner数据库。

**能力边界**：真实OCCT重算、实际ShapeFix不变性、跨进程Owner Seal及恢复、独立D07消费者均NOT_RUN；合成集合与SHA占位只用于反例门禁，不授D09/D15/D16合格资格。[详细规格](../../docs/capabilities/CAP-06-05/README.md) · [逐条追踪](../traces/CAP-06-05.json) · [独立交接](../../docs/capabilities/CAP-06-05/independent-consumer-handoff.md)。
