# CAP-09-02｜统一左TaskPanel与单Babylon世界

复用**唯一Babylon Scene**显示世界/机床Base/Spindle/ToolMount/TCP/WorkNominal/WorkActual Frame，不新建第二场景；OCCT右手系需经明确单向渲染适配，屏幕拾取或变换手柄的结果不能直接写Owner数据。统一左侧**TaskPanel**提供可调宽的紧凑树表（最大字号12px，仅浅/深主题），显示精确修订、hash、Frame方向、来源和UNKNOWN字段。

流程：选资产修订→对照D04名义Setup及D10真实装夹→计算机床/工具/工件位姿与数学向量→呈现MATHEMATICAL_SYNTHETIC_PASS、UNKNOWN_REAL_MACHINE、D11_CL_ONLY、D15_NC_REQUIRED或STALE→受管09域Port执行CAS/ACL/scopeEpoch/generation/cancel检查。GUI/CLI/Agent同Port；3D预览不是写入，播放结束不代表安全可上机。
