# R-POST-001｜后处理工程依据和实际局限
原CAP-08-01与E3-02/E3-03/U4-04对应研究。2026-10-24阅读：ISO 14649-10:2004和ISO 6983-1:2009**只有ISO合法公开目录/摘要**，不编造收费条款；LinuxCNC 2.9公开G-Code Overview（§13 Modal Groups）及G-Codes（§1/G2/G3）；NISTIR 6556仅出版元数据，作者按NIST页面记录；OCCT 8.0.1 gp_Trsf公开API，W3C PROV-O公开正文摘要，RFC8785公开§1与§3.2.3。作者、日期、URL、locator和局限详见[来源注册](../sources/CAP-08-01.json)。

“不可变D12、CAS重验、取消晚回执、同域GUI/CLI/Agent端口、Frame链”属于Procet设计规则而非引用标准的强制条款。LinuxCNC的模态不能当作B5/FANUC/SINUMERIK统一语义。D09抽象CL→D12生成NC→独立D13→D14→D15才允许安全验证，未建模语义必须UNKNOWN。本轮真实控制器、NC产品运行和消费者验收NOT_RUN。