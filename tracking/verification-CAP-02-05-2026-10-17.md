# 本轮规划核验：CAP-02-05（2026-10-17）

读取远端main起点：`99a6aff36392cea492becff2f822d2352b1ba2fe`；开放PR为0，仓库公开且main协作规则允许非强制提交。核查README、AGENTS、progress、automation、research README和原能力编号，确认下一项为CAP-02-05。材料/Stock源码只读基线：`BaiSongt/procet-resources@b861efee9c84a99eba1fbee2c8749e60576fb93f`。

**已实际执行：** 规划生成时的结构语义检查，包括13条详细功能登记、21条唯一参考来源ID、8条规则、每条规则存在文中且来源ID在注册表、全部18个验收ID在规格、未完成计数与总数相符。未运行全仓链接验证、Python/Rust/TS/OCCT、浏览器、Windows EXE或任何产品验收；未启动付费CI。

新增6项来源均为官方ISO目录摘要或OCCT官方API页面；明确记录版次及读取深度。最重要风险：历史`SetupStock.material_id`没有exact material revision，不能按当前最新版重放；`PartBoundingBoxOffset`存在但用户明确禁止系统自动调整毛坯，必须设显式候选→采用流程。标准目录没有公开完整条款，留后续补证。

交付：CAP-02-05详细规格（7项子能力/8项规则/18条设计验收）、独立UI文件、R-MS-001研究专题与研究映射、README/台账更新。每项标记`待评审`、`NOT_RUN_PRODUCT_TEST`。下一项按实时台账，并穿插细分F1-01/F1-06。
