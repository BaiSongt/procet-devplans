#!/usr/bin/env python3
"""CAP-04-04规划层独立一致性校验；不执行产品测试。"""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
load = lambda p: json.loads((root / p).read_text(encoding="utf-8"))
src = load("research/sources/CAP-04-04.json")
trace = load("research/traces/CAP-04-04.json")
fixtures = load("docs/capabilities/CAP-04-04/fixtures.json")
math = load("docs/capabilities/CAP-04-04/math-examples.json")
assert src["registeredRecords"] == len(src["sources"]) == 7
assert len(trace["rules"]) == 10 and len(fixtures["scenarios"]) == 20
S = {x["id"] for x in src["sources"]}
R = {x["id"] for x in trace["rules"]}
T = {x["id"] for x in fixtures["scenarios"]}
assert len(S) == 7 and len(R) == 10 and len(T) == 20
by_id = {x["id"]: x for x in fixtures["scenarios"]}
for rule in trace["rules"]:
    assert rule["sourceIds"] and set(rule["sourceIds"]) <= S
    assert len(rule["tests"]) == 2 and set(rule["tests"]) <= T
    assert rule["fields"] and rule["workPackages"]
    assert {by_id[t]["polarity"] for t in rule["tests"]} == {"positive", "negative"}
    for test in rule["tests"]:
        x = by_id[test]
        assert rule["id"] in x["ruleIds"]
        assert set(x["sourceIds"]) == set(rule["sourceIds"])
        assert x["productStatus"] == "NOT_RUN"
for source in src["sources"]:
    assert set(source["rules"]) <= R
m = math["example"]["expectedMatrixSetupFromCad"]
p = math["example"]["cadPoint"] + [1]
got = [sum(row[i] * p[i] for i in range(4)) for row in m][:3]
assert got == math["example"]["expectedSetupPoint"] == [12, 21, 30]
assert math["notManufacturingTolerance"]
print("PASS: CAP-04-04 7来源×10规则×20正反规划验收+数学样例；产品NOT_RUN")
