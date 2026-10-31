#!/usr/bin/env python3
"""CAP-02-02规划静态追踪校验；不会连接产品服务或修改用户数据。"""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
def load(p): return json.loads((root / p).read_text(encoding="utf-8"))
s = load("research/sources/CAP-02-02.json")
t = load("research/traces/CAP-02-02.json")
f = load("docs/capabilities/CAP-02-02/fixtures.json")
idx = load("research/source-index.json")
pr = load("tracking/progress.json")
assert len(s["sources"]) == s["registeredRecords"] == 7
assert len(t["rules"]) == 10 and len(f["scenarios"]) == f["scenarioCount"] == 20
ids = {x["id"] for x in s["sources"]}
assert len(ids) == 7 and len({x["id"] for x in t["rules"]}) == 10
assert len({x["id"] for x in f["scenarios"]}) == 20
by_case = {c["id"]: c for c in f["scenarios"]}
for r in t["rules"]:
    assert r["sourceIds"] and set(r["sourceIds"]) <= ids
    assert r["fields"] and r["assets"] and r["workPackages"]
    assert len(r["tests"]) == 2
    pair = [by_case[x] for x in r["tests"]]
    assert {x["polarity"] for x in pair} == {"positive","negative"}
    for c in pair:
        assert r["id"] in c["ruleIds"]
        assert set(c["sourceIds"]) == set(r["sourceIds"])
        assert c["productStatus"] == "NOT_RUN"
        assert c["testEntry"].startswith("TODO_INDEPENDENT_CONSUMER_")
assert sum(x["registeredRecords"] for x in idx["registries"]) == idx["registeredRecords"]
assert idx["registeredRecords"] == pr["research"]["registeredSources"]
assert pr["capabilities"]["detailDraftedCount"] == 27
print("CAP-02-02 PLANNING_TRACE_PASS; PRODUCT_NOT_RUN")
