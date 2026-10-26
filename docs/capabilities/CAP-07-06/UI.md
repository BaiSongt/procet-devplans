# CAP-07-06｜单Babylon Scene、紧凑进退刀编辑和3D预览
ActivityRail「刀路」进入统一左侧TaskPanel，显示进刀/退刀/链接三段参数、D04 Setup和D08冻结状态。全局**唯一Babylon世界**，Agent浮窗只消费同一个领域Port，不另建数据源或Scene；字号最大12px，仅浅/深主题，提供键盘焦点、访问性对比度及错误的可读文案。

设置字段为Setup局部退让方向、安全平面、切入弧半径/斜坡角、出刀连续性、保持下刀的最大通道长度、刀具刀柄与夹具精确Hash、局部校核状态，禁止“任意固定Z=安全”的默认值。支持端面“保守已证链接”与“退让链接”两候选；未知颜色不等于PASS。

3D层使用可释放`OverlayLease(workContext,setup,CLrevision,taskGeneration)`展示刀具完整包络、夹具/岛屿和链接轨迹；CL运动动画必须标记「仅刀路预览·非NC工程验证」，合成例标SYNTHETIC。用户预览→明确采纳→07域Owner ACL/CAS/generation重验→追加D09；切Setup、撤销、晚回执释放租约，不删除D08、不得误修改当前任务。每个执行中的工具显示可取消状态，真实浏览器、DPI、GPU资源生命周期、消费者NOT_RUN。
