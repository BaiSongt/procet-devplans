#!/usr/bin/env python3
# W2-02规划合成语义Oracle；禁止将此结果冒充产品或几何验证
import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
fx = json.loads((ROOT / "docs/work-packages/W2-02/fixtures.json").read_text(encoding="utf-8"))
tr = json.loads((ROOT / "research/traces/W2-02.json").read_text(encoding="utf-8"))
src = json.loads((ROOT / "research/sources/W2-02.json").read_text(encoding="utf-8"))
owners = json.loads((ROOT / "docs/work-packages/W2-02/asset-owner-candidates.json").read_text(encoding="utf-8"))

def merge(base, patch):
    if not isinstance(base, dict) or not isinstance(patch, dict):
        return copy.deepcopy(patch)
    ans = copy.deepcopy(base)
    for key, value in patch.items():
        ans[key] = merge(ans[key], value) if key in ans else copy.deepcopy(value)
    return ans

def evaluate(d):
    c, p, m, q = d["candidate"], d["plan"], d["commit"], d["downstream"]
    if c["bindingStepUid"] not in {x["uid"] for x in p["steps"]}:
        return "REJECTED", "REJECT_STALE_STEP_UID"
    s = c["source"]
    if any(s[k] != s["expected" + k.title()] for k in ("revision", "hash", "frame")):
        return "REJECTED", "REJECT_SOURCE_DRIFT"
    if c["d07Evidence"]["checker"] != "INDEPENDENT_PASS" or c["d07Evidence"]["frame"] != s["frame"]:
        return "UNKNOWN", "UNKNOWN_GEOMETRY_EVIDENCE"
    if {x["uid"] for x in p["freezeSet"]} & set(p["proposedTouched"]):
        return "REJECTED", "REJECT_FROZEN_SCOPE"
    if m["targetBranch"] != p["branchId"]:
        return "REJECTED", "REJECT_BRANCH_CROSS_WRITE"
    if p["semanticDiff"]["conflict"]:
        return "REJECTED", "REJECT_SEMANTIC_CONFLICT"
    if m["idempotency"]["sameKeyDifferentPayload"]:
        return "REJECTED", "REJECT_IDEMPOTENCY_COLLISION"
    if (m["expectedPlanRevision"] != m["currentPlanRevision"]
            or m["permission"] != "WRITE_D05"
            or m["taskGeneration"] != m["currentGeneration"]):
        return "REJECTED", "REJECT_CAS_OR_ACL"
    if m["cancelled"] or m["receipt"] != "ON_TIME":
        return "REJECTED", "REJECT_CANCELLED_OR_LATE"
    needed = {"D07", "D09", "D12", "D13", "D14", "D15", "D16"}
    if any(q["qualifications"].values()) or not needed <= set(q["invalidationAssets"]):
        return "REJECTED", "REJECT_QUALIFICATION_LEAK"
    if m["idempotency"]["previouslyCommittedSamePayload"]:
        return "IDEMPOTENT_REPLAY", "NO_NC_QUALIFICATION"
    return "ACCEPTED_DRAFT", "NO_NC_QUALIFICATION"

def main():
    rules = tr["rules"]
    assert len(rules) == 10 and len(fx["cases"]) == 20
    assert len(src["sources"]) == 8 and len(owners["assets"]) == 17
    source_ids = {x["id"] for x in src["sources"]}
    assert len(source_ids) == 8
    assert {x["id"] for x in rules} == {c["ruleId"] for c in fx["cases"]}
    assert len({c["id"] for c in fx["cases"]}) == 20
    for r in rules:
        assert r["sourceIds"] and set(r["sourceIds"]) <= source_ids
        assert r["fields"] and r["assets"]
        ps = [x for x in fx["cases"] if x["ruleId"] == r["id"]]
        assert {x["polarity"] for x in ps} == {"positive", "negative"}
        assert {x["id"] for x in ps} == {r["positiveTestId"], r["negativeTestId"]}
        for case in ps:
            computed = evaluate(merge(fx["baseScenario"], case["overrides"]))
            expected = case["expected"]
            assert computed == (expected["status"], expected["reason"]), case["id"]
            assert expected["mayPublish"] is False
            if case["polarity"] == "positive":
                assert computed[0] in {"ACCEPTED_DRAFT", "IDEMPOTENT_REPLAY"}
            else:
                assert computed[1] == r["failureCode"]
    # 变异检查：反例若错误放行必须被捕获；检查器不依赖反例输入中的预期结果决定状态
    for c in (x for x in fx["cases"] if x["polarity"] == "negative"):
        res = evaluate(merge(fx["baseScenario"], c["overrides"]))
        assert res[0] != "ACCEPTED_DRAFT", c["id"]
    print("PASS: W2-02规划语义10规则/20正反/10项拒绝变异，17Owner候选；产品NOT_RUN")

if __name__ == "__main__":
    main()
