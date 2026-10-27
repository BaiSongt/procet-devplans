# CAP-10-02｜人类审批与签发GUI/3D设计

入口：ActivityRail“发布”→**统一左TaskPanel**（候选/独立NC验证/实装Frame/审核记录/签名与信任/撤销），全屏维持唯一Babylon Scene；主题仅浅/深，字号≤12px，不创建第二Viewer。右侧Agent允许生成申请草稿和证据引用，不出现可直接签发的Agent动作。

同域业务：GUI、CLI、Agent通过`ApproveReleasePort`读和申请；真实决策接口仅允许经重新鉴别和ACL评估的人类审核主体。CLI示意`procet release review --candidate-ref ...`并非已实现，任何终端命令无绕过审批能力。选择NC行、高亮夹具与工件只是D08/D10/D12/D15精确引用的只读投影，不更新签发状态。

字段：申请/审核主体、职责冲突、签审策略版本、候选revision/manifest SHA、最终NC原始字节Hash、D04名义Frame、D10实装Frame和控制器版本、D15独立验证Coverage/Oracle、风险与UNKNOWN列表、签名算法Profile/信任根、撤销与过期状态。无实测显示UNKNOWN，不以绿色或动画冒充安全认证。

交互：Request/Withdraw/Reject/Approve分别受CAS及授权保护；审批行为必须显式确认冻结范围，撤权、晚ACK、Esc取消或切工程不能覆盖历史记录；重新打开待办保持精确对象定位。重点浏览器真实复用Scene、键盘焦点、角色越权、连续切换资源、离线验签等均需产品验收，目前NOT_RUN。
