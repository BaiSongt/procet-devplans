# R-DNC-TRANSFER-001｜DNC文件交换、设备文件树和运行许可隔离

**范围**：CAP-10-04；关联E3-06/T5-03、D03/D04/D10/D12/D13/D14/D15/D16/D17。

## 来源阅读与适用边界
OPC-40501-1 v1.02.0（2024-11-01）公开正文§1.1、§8.1有可选FileSystem及WorkMasters；旧ProductionProgramType在§8.4.4已标弃用，转OPC40001-3。这证明信息模型**可能**提供文件目录，但不自动证明某台B5/数控控制器具备上传、读取、激活或命令权限。OPC10000-20 v1.05.06（2025-10-22）官方发布页支持进一步选型；本轮只读发布目录。OPC 10000-2与40001-3均仅核对公开版本，协议实作仍待调研。

MTConnect官网描述的HTTP Agent/Adapter主要用于监测，不能偷换成写入DNC；NIST SMS Test Bed Hedberg等（2016）的公开摘要区分实时监测、资料库与技术数据包。RFC9110支持限定在所选HTTP传输语义，RFC8785只针对Manifest JSON规范化，NC原始字节需独立SHA。W3C PROV-O提供Entity/Activity/Agent可溯源关系。ISO23247-1:2021仅读目录和摘要，不能引用付费正文或推断强制网络协议。

## 工程推导（本项目设计，不冒称标准条款）
1. `ReleaseRef/D16→TransferIntent→Staging→ReceiverReadback→D17Append`构造五段独立状态，不让上传ACK等同“安全可运行”。
2. 每段强制exactRevision/hash/frame/owner/controllerProfile/scopeEpoch，失败使用UNKNOWN/REJECTED/STALE，不能通过补默认值掩盖未知。
3. 通过Capability Discovery区分OPC FileType、厂商私有传输、Legacy仅离线。无真实可写证据不尝试调用设备写端口。
4. 冻结程序只能复制至staging，不能自动Activate/Select/CycleStart；这既是最小权限原则，也是D15独立NC工程验证和现场受训操作者的职责隔离。
5. 传输与材料去除仿真无关，不建设材料扫掠仿真。

## 反例和研究限制
丢包重传后重复写、最后一块被篡改、原NC换行被重编码、设备报告成功但读回不同、FileSystem可选未实现、OPC Deprecated数据对象被作为新接口、现场网络无授权、收方反向下载不同、切工程晚ACK、原D16签名仍有效但D10 Frame变更均必须负向验收。公开标准和文献不构成真实生产机床协议认证。

[研究原始条目](../sources/CAP-10-04.json) · [逐字段规则](../traces/CAP-10-04.json) · [CAP](../../docs/capabilities/CAP-10-04/README.md)。
