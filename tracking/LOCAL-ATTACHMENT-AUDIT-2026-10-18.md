# 2026-10-18本地附件审计（定向，不是历史资料迁移完成）

- 本地待入库记录：**6**项；本轮实际可读文件**33**份，缺失**15**份；已存在主文件SHA256不匹配记录：**0**项。
- 缺失构成：CAP-01-01补证支持文件5份；上一轮CAP-01-02补证共10份在本次容器未挂载。这些文件可能存在于此前会话交付，不等于历史内容实际被删除。
- CAP-01-02原详细CAP已在远端17/88中，补证不计新增CAP；本轮不擅自伪造补证源文件。
- 历史ZIP必要附件（capability map/work packages/code evidence JSON、review schema示例、脚本/哈希清单）尚未全量核查，不得宣布迁移结清。
- 远端仍为只读核实的分支，未将六项本地待办入库。

## 本轮未找到的相对路径

- `pending-cap-01-01-evidence/research/sources/CAP-01-01.json`
- `pending-cap-01-01-evidence/tools/build_cap_01_01_evidence.py`
- `pending-cap-01-01-evidence/tools/check_cap_01_01_evidence.py`
- `pending-cap-01-01-evidence/tracking/INDEX-DELTA-CAP-01-01.md`
- `pending-cap-01-01-evidence/tracking/pending-CAP-01-01.json`
- `pending-cap-01-02-evidence/docs/capabilities/CAP-01-02/RESEARCH-BACKFILL.md`
- `pending-cap-01-02-evidence/docs/capabilities/CAP-01-02/fixtures.json`
- `pending-cap-01-02-evidence/research/topics/R-OBJ-001.md`
- `pending-cap-01-02-evidence/research/sources/CAP-01-02.json`
- `pending-cap-01-02-evidence/research/traces/CAP-01-02.json`
- `pending-cap-01-02-evidence/tools/build_cap_01_02_evidence.py`
- `pending-cap-01-02-evidence/tools/check_cap_01_02_evidence.py`
- `pending-cap-01-02-evidence/tracking/verification-CAP-01-02-2026-10-18.json`
- `pending-cap-01-02-evidence/tracking/INDEX-DELTA-CAP-01-02.md`
- `pending-cap-01-02-evidence/tracking/pending-CAP-01-02.json`