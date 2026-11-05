# E3-03｜B180 NC参考点与退刀语义专项签收

日期2026-11-05。保留原E3-03编号，不暗改原业务目标。D13消费**最终D12 NC**与独立D10绑定，分别覆盖LinuxCNC2.9 G28/G30预存机器坐标及中间点、G53非模态，Haas Mill G28 G90/G91与Setting108。明确缺存储值/回零/机床设置/刀补/控制器Profile时返回UNKNOWN或REJECT，绝不以回零终点代替安全路径。D14真实轴时序和D15独立物理验证须另外取证，不得把CL动画作NC PASS。

[研究原文与阅读限制](../../capabilities/CAP-07-06/REFERENCE-RETURN-B180-2026-11-05.md) → [规则/字段](../../../research/traces/CAP-07-06-reference-return-b180-v08.json) → [正反+Golden](../../capabilities/CAP-07-06/reference-return-b180-fixtures-v08.json) → [只读校验器](../../../tools/check_cap0706_reference_return_b180_v08.cjs)。实际消费者签收须含源exact HEAD、NC Hash、控制器/Profile/Frame/偏置修订、正反运行命令与结果、权限CAS与取消Fence；Owner 0/17与真实消费者0/17未完成。L3待审，规划PASS≠产品PASS。
