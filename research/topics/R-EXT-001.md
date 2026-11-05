# R-EXT-001｜扩展与集成：授权、组合锁和生命周期研究

本专题2026-10-19新编，只记合法公开资料实际浏览的目录或章节。产品测试NOT_RUN，L3待人类评审。

- [SRC-EXT-001 Tauri v2 Capabilities](https://v2.tauri.app/security/capabilities/)；作者：Tauri Contributors；版本：online v2 updated 2026-09-03；时间：2026-09-03；访问：2026-10-19；深度：section_text；章节：Overview; Security Boundaries; invoke_handler defaults；支持：WebView能力权限可限制插件命令；局限：自定义invoke默认对WebView可用，不能代替领域授权。
- [SRC-EXT-002 Tauri v2 Runtime Authority](https://v2.tauri.app/security/runtime-authority/)；作者：Tauri Contributors；版本：online v2 updated 2025-02-22；时间：2025-02-22；访问：2026-10-19；深度：section_text；章节：origin/capability/scope checks；支持：运行时WebView权限与来源判断；局限：CLI/Agent与领域Owner的权限不在该保证内。
- [SRC-EXT-003 Tauri Plugin Development](https://v2.tauri.app/develop/plugins/)；作者：Tauri Contributors；版本：online v2 rolling；时间：unknown；访问：2026-10-19；深度：section_text；章节：Naming Convention; Command Permissions; Scope；支持：插件命名与权限声明；局限：第三方native不因此获得sandbox安全性。
- [SRC-EXT-004 JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/)；作者：JSON Schema Organization；版本：Draft 2020-12；时间：unknown；访问：2026-10-19；深度：section_text；章节：vocabularies; format; dynamicRef；支持：描述符结构校验；局限：不证明功能或可执行文件可信。
- [SRC-EXT-005 RFC 9110 HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)；作者：R. Fielding、M. Nottingham、J. Reschke；版本：RFC9110 2022-06；时间：2022-06；访问：2026-10-19；深度：section_text；章节：13.1.1 If-Match; 13.2 Preconditions；支持：HTTP条件写；局限：并非IPC/DB自然拥有CAS。
- [SRC-EXT-006 Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)；作者：Tom Preston-Werner；版本：2.0.0；时间：unknown；访问：2026-10-19；深度：section_text；章节：Summary; Specification 1-11；支持：公开API版本兼容语义；局限：不是exact hash或独立验收。
- [SRC-EXT-007 NIST SP 800-218 SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)；作者：M. Souppaya、K. Scarfone、D. Dodson；版本：1.1；时间：2022-02-03；访问：2026-10-19；深度：catalog_abstract；章节：Publication metadata; Abstract；支持：安全开发应有可审核证据；局限：未读全文，不推断具体控制项合规。

## 适用边界

Tauri WebView capability不等同Host及领域Owner的业务许可；自定义invoke_handler默认可能从WebView调用，CLI/Agent须通过同一授权门。JSON Schema只验证描述符结构，SemVer不是二进制hash/消费者兼容证明；RFC9110的If-Match是HTTP条件写语义，不表示本地存储已有CAS。NIST SP 800-218本轮仅官方摘要，不臆造正文控制。统一Babylon世界、左侧TaskPanel、CAS和取消晚回执隔离均为Procet内部设计选择。

D04与D10执行绑定分开；D09中立CL→D12 NC→D13解释→D14轴时序→D15独立验证→D16发布。未知执行语义unknown，CL动画不等于NC验证。真实Rust/TS/Windows/实机和独立消费者测试均未执行。
