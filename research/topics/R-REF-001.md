# R-REF-001｜跨域引用、规范化、并发与溯源

2026-10-17，原始权威资料研究评审稿。关联[F1-01](../../docs/work-packages/F1-01.md)及[规则](../../docs/work-packages/F1-01/01-rules.md)。所有产品验收未执行。

| ID | 来源与实际读取深度 | 支持的结论和边界 |
|---|---|---|
| SRC-REF-001 | RFC 8785，2020-06，§3.1–3.2，section_text | JCS要求I-JSON、IEEE754数值序列化、UTF-16键排序与Unicode原样；当前Python排序Hash不是JCS |
| SRC-REF-002 | JSON Schema Draft 2020-12，2022-06-16，section_text | 可验证声明的结构，不验证资源确实存在、权限或几何 |
| SRC-REF-003 | RFC 9110，2022-06，§13.1.1，section_text | If-Match强比较避免丢失更新；Host的generation CAS只是类比 |
| SRC-REF-004 | RFC 7493，2015-03，§2–3，section_text | I-JSON的UTF-8、重复键和互操作数值范围；老数据需迁移策略 |
| SRC-REF-005 | W3C PROV-DM，2013-04-30，section_text | Entity/Activity/Agent与Derivation支撑版本来源表达；非Procet数据模型的直接规定 |
| SRC-REF-006 | RFC 6920，2013-04，§2及安全部分，section_text | 用内容hash核对字节，不能推出授权、批准或工程语义安全 |
| SRC-REF-007 | RFC 9562，2024-05，§4–5，section_text | UUID格式与版本；C0现有字符串ID不可未经ADR改为强制UUIDv7 |

**推导**：对象ID、revision、工件hash、schema/producer、批准状态是不同事实。C0的DomainRef没有contentHash；ArtifactDescriptor另有Hash；两者不能直接合并。业务反馈可以循环，但同一个不可变修订的来源DAG不得自引用。仅按结构校验成功不足以允许制造调用。

**待工程审批**：生产requestHash与精度/Unicode政策、C1版本兼容、GC/retire及持久receipt。来源索引详见[注册表](../references.json)；源码实读依据：procet-contracts@60b1b3b8，protocol/README.md等。只核对协议，不声称真实Host或Rust/TS/Worker产品验证通过。
