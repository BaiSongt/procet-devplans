# CAP-09-05｜单Babylon世界与统一左TaskPanel（L3待审）
只保留唯一Babylon Scene/RendererPort。3D只读显示D03运动链、D04名义工件坐标、D10实际绑定的机床/刀具/工件姿态，并与D09中立CL段号联动。机床全景、轴读数及行程状态可同时观察；不能创建第二个独立3D世界。所有未实测B5枢轴/限位/刀柄细节显示UNKNOWN。
左侧唯一TaskPanel可调整宽度，最大字号12px，只支持浅/深主题。字段：D09 exact revision/hash/Frame/CL段号、D08冻结、D03能力、D04名义Setup、D10实际绑定/实测与控制器、IK候选分支、轴/Joint边界、采样容差及遗漏区间、几何间隙计算方法、UNKNOWN证据缺口、D11状态与D15/D16禁用理由。
用户交互：选择冻结CL→选择真实D10绑定→只读轴运动预演→查看超限时间/段号/证据→请求Owner提交D11新revision。GUI/CLI/Agent共用09域端口；选择、预览、3D操作本身不提交。提交瞬间CAS/ACL/Frame/scopeEpoch/generation/cancel重验，晚回执拒绝。
`CL_ONLY`必须以黄色显示“CL预检，非NC工程验证”；`REJECT_PRECHECK`显示红色已发现的预检问题；`UNKNOWN`显示未证实的区间/参数；不可将CL预检显示成绿色D15 PASS。下一步NC按钮必须进入D12→D13→D14→D15链，绝不从D11直接取得D16资格。
