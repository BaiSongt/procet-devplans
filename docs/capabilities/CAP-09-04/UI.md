# CAP-09-04｜唯一Babylon世界/统一左TaskPanel（L3待审）
中央保留**一个Babylon Scene**：以半透明装配层显示机床主轴→安装接口→刀柄→伸出段→刀尖（独立TCP十字与Gauge平面），叠加D04名义工件Frame但以D10实机绑定为生效依据；切换候选刀具绝不创建第二个Renderer或伪造测量。
左TaskPanel允许鼠标调整宽度；最大字号12px、仅浅色/深色。字段分组：D03机床/刀柄/刀具资源exact revision+hash，D04名义Setup，D10工单实绑与实测、Gauge平面、正负轴向、单位、有效长度/磨损、T/H匹配、控制器型号/固件/选项、G43/G49/RTCP模态、D13来源行与状态、D14轴事件、D15独立工程验证、D16可发布资格。UNKNOWN红色明确原因，CL_ONLY黄色，不出现伪PASS。
流程：只读选择→合成几何预览→受控实测证据校核→对齐最终NC和H/模态→D13重解释→D14计算→D15独立检查→D16发布申请。GUI/CLI/Agent复用同一领域端口；CAS+ACL+scopeEpoch+generation+cancel提交前重验；切场景、撤权或取消的晚回执必须被拒绝。更换刀柄/刀具必须产生新D10 revision，旧冻结D08/已发布D16保留；原版本Reader与ControllerProfile可配对回退。
