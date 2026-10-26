# CAP-09-01｜统一界面与3D

在统一左侧TaskPanel展示D03精确资源修订/hash与D10执行绑定修订、机床Link/Joint树、轴旋向、枢轴、关节行程、来源章节及UNKNOWN项。复用**唯一Babylon Scene**画坐标系、pivot与运动链叠层，不新建第二世界；STL仅为外观，不可推断真实控制器限位或机床能力。

操作：选机床→核对D03/D10/Frame→检查根/父子关系与双驱joint→显示合成数学正解与真实参数UNKNOWN→提出候选→09域统一Port在提交前重验ACL、CAS、scopeEpoch、generation、cancelled→级联失效；GUI/CLI/Agent共享命令。单世界、最大字号12px、仅浅/深色主题、TaskPanel可调宽。晚到Worker回执只能作日志。

标签区分MATHEMATICAL_SYNTHETIC_PASS / UNKNOWN_REAL_MACHINE / D11_CL_ONLY / D15_NC_REQUIRED / STALE，绝不能显示“播放成功=安全可上机”。实机三轴/B5 UI视觉回归、可访问性和端到端消费者尚NOT_RUN。